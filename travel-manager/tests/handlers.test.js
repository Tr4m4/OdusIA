import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as handlers from '../js/handlers.js';
import { state } from '../js/state.js';

describe('Handlers Module - High Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock global UI functions
    global.openPlanTripModal = vi.fn();
    global.closePlanTripModal = vi.fn();
    global.renderPlanHotels = vi.fn();
    global.renderEditAttachments = vi.fn();
    global.renderHistory = vi.fn();
    global.renderDashboard = vi.fn();
    global.renderUpcomingGrid = vi.fn();
    global.switchView = vi.fn();
    
    state.resetAll();
    document.body.innerHTML = `
      <form id="bookingForm">
        <input id="b-title" value="New Trip">
        <input id="b-date" value="2026-12-01">
        <textarea id="b-desc">Desc</textarea>
        <select id="b-type"><option value="viaggio">Viaggio</option></select>
        <div id="b-existing-attachments"></div>
      </form>
      <form id="planTripForm">
        <input id="pt-dest" value="Paris">
        <input id="pt-start" value="2026-05-01">
        <input id="pt-end" value="2026-05-10">
        <input id="pt-flight" value="AF123">
        <div id="pt-hotel-list"></div>
        <div id="pt-existing-attachments"></div>
      </form>
      <div id="latest-bookings"></div>
      <div id="upcoming-grid"></div>
    `;
  });

  it('handleAddBooking should create a normal booking', () => {
    const event = { preventDefault: vi.fn() };
    handlers.handleAddBooking(event);
    expect(state.data.upcoming).toHaveLength(1);
    expect(state.data.upcoming[0].type).toBe('viaggio');
  });

  it('handlePlanTrip should create a booking', () => {
    const event = { preventDefault: vi.fn() };
    handlers.handlePlanTrip(event);
    expect(state.data.upcoming).toHaveLength(1);
    expect(state.data.upcoming[0].title).toBe('Paris');
  });

  it('createTripAutomatically should work', () => {
    handlers.createTripAutomatically({ title: 'AI Trip' });
    expect(state.data.upcoming).toHaveLength(1);
    expect(state.data.upcoming[0].isPlanTrip).toBe(true);
  });

  it('handleSaveBooking should update existing booking', () => {
    state.editingId = 1;
    state.data.upcoming = [{ id: 1, title: 'Old' }];
    document.getElementById('b-title').value = 'New';
    handlers.handleSaveBooking({ preventDefault: vi.fn() });
    expect(state.data.upcoming[0].title).toBe('New');
  });

  it('handleSavePlanTrip should update existing trip', () => {
    state.editingId = 2;
    state.data.upcoming = [{ id: 2, title: 'Old Trip', type: 'viaggio' }];
    document.getElementById('pt-dest').value = 'New Dest';
    handlers.handlePlanTrip({ preventDefault: vi.fn() });
    expect(state.data.upcoming[0].title).toBe('New Dest');
  });

  it('delete and archive should work with confirmation', () => {
    state.data.upcoming = [{ id: 10, title: 'T' }];
    vi.stubGlobal('confirm', vi.fn(() => true));
    
    handlers.deleteBookingPrompt(10);
    expect(state.data.upcoming).toHaveLength(0);

    state.data.upcoming = [{ id: 11, title: 'T2' }];
    handlers.archiveTrip(11);
    expect(state.data.history).toHaveLength(1);
  });

  it('hotel row management', () => {
    handlers.addHotelRow('pt');
    expect(state.currentHotelsEdit).toHaveLength(1);
    handlers.updateHotelField(0, 'name', 'Hilton');
    expect(state.currentHotelsEdit[0].name).toBe('Hilton');
    handlers.removeHotelRow('pt', 0);
    expect(state.currentHotelsEdit).toHaveLength(0);
  });

  it('addHotelsToPlan should parse and add', () => {
    const json = encodeURIComponent(JSON.stringify([{name:'H1'}]));
    handlers.addHotelsToPlan(json);
    expect(state.currentHotelsEdit).toHaveLength(1);
  });

  it('handleFileSelection should block malicious files', async () => {
    vi.stubGlobal('alert', vi.fn());
    const file = new File(['bad'], 'bad.pdf');
    const event = { target: { files: [file], id: 'b-attachments' } };
    
    // Mock validation to fail
    vi.mock('../js/security.js', async (importOriginal) => {
      return { 
        ...(await importOriginal()),
        validateFileMagicNumber: vi.fn(() => Promise.resolve(false)) 
      };
    });

    await handlers.handleFileSelection(event, 'b');
    expect(global.alert).toHaveBeenCalled();
  });

  it('removeAttachment should work with confirm', async () => {
    state.currentAttachmentsEdit = [{ id: '123', name: 'test.pdf' }];
    vi.stubGlobal('confirm', vi.fn(() => true));
    window.db = {
      transaction: vi.fn(() => ({
        objectStore: vi.fn(() => ({
          delete: vi.fn(() => {
            const req = { onsuccess: null, onerror: null };
            setTimeout(() => { if (req.onsuccess) req.onsuccess(); }, 0);
            return req;
          })
        }))
      }))
    };
    
    await handlers.removeAttachment('b', 0);
    expect(state.currentAttachmentsEdit).toHaveLength(0);
  });

  it('save handlers should return if no item found', () => {
    state.editingId = 999;
    const event = { preventDefault: vi.fn() };
    expect(() => handlers.handleSaveBooking(event)).not.toThrow();
    expect(() => handlers.handlePlanTrip(event)).not.toThrow();
  });
});
