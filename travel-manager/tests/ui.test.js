import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as ui from '../js/ui.js';
import { state } from '../js/state.js';
import { HOTEL_REPOSITORY } from '../js/constants.js';

describe('UI Rendering Module - Deep Coverage', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="latest-bookings"></div>
      <div id="latest-bookings"></div>
      <div id="all-upcoming-grid"></div>
      <div id="history-timeline"></div>
      <div id="hotels-content"></div>
      <div id="view-title"></div>
      <div id="dashboard-view" class="view-container"></div>
      <div id="upcoming-view" class="view-container"></div>
      <div id="history-view" class="view-container"></div>
      <div id="hotels-view" class="view-container"></div>
      <div id="pt-hotel-list"></div>
      <div id="pt-existing-attachments"></div>
      <div id="b-existing-attachments"></div>
      <div id="bookingModal" class="modal"></div>
      <div id="planTripModal" class="modal"></div>
      <div id="attachmentPreviewModal" class="modal">
        <div id="preview-modal-title"></div>
        <div id="preview-content-container"></div>
      </div>
      <ul class="nav-links">
        <li data-view="dashboard"></li>
        <li data-view="upcoming"></li>
        <li data-view="history"></li>
        <li data-view="hotels"></li>
      </ul>
      <input id="b-title">
      <input id="b-date">
      <textarea id="b-desc"></textarea>
      <select id="b-type"></select>
      <div id="b-modal-title"></div>
      <button id="b-modal-btn"></button>
      <input id="pt-dest">
      <input id="pt-start">
      <input id="pt-end">
      <input id="pt-flight">
      <div id="pt-modal-title"></div>
      <button id="pt-modal-btn"></button>
    `;
    state.resetEditState();
  });

  it('renderHistory should show empty message when no history', () => {
    state.data.history = [];
    ui.renderHistory();
    expect(document.getElementById('history-timeline').innerHTML).toContain('Nessun viaggio completato');
  });

  it('renderHistory should show items when history exists', () => {
    state.data.history = [{ id: 1, title: 'Old Trip', date: '2023-01-01', description: 'Done', type: 'viaggio' }];
    ui.renderHistory();
    expect(document.getElementById('history-timeline').innerHTML).toContain('Old Trip');
  });

  it('switchView should toggle visibility and update title', () => {
    ui.switchView('hotels');
    expect(document.getElementById('hotels-view').classList.contains('hidden')).toBe(false);
    expect(document.getElementById('dashboard-view').classList.contains('hidden')).toBe(true);
    expect(document.getElementById('view-title').textContent).toBe('Luxury Wellness Repository');
  });

  it('renderHotelsView should render tabs and content', () => {
    ui.renderHotelsView();
    const container = document.getElementById('hotels-content');
    expect(container.innerHTML).toContain('EXCLUSIVE TOP 5');
  });

  it('renderPlanHotels and renderEditAttachments should render correctly', () => {
    state.currentHotelsEdit = [{ name: 'Test Hotel', spa: 'Good', distance: '10m', price: '100', rating: '9', link: '' }];
    ui.renderPlanHotels('pt');
    expect(document.getElementById('pt-hotel-list').innerHTML).toContain('Test Hotel');

    state.currentAttachmentsEdit = [{ id: '1', name: 'File.pdf' }];
    ui.renderEditAttachments('pt');
    expect(document.getElementById('pt-existing-attachments').innerHTML).toContain('File.pdf');
  });

  it('modal controls should work', () => {
    ui.openModal();
    expect(document.getElementById('bookingModal').classList.contains('active')).toBe(true);
    ui.closeModal();
    expect(document.getElementById('bookingModal').classList.contains('active')).toBe(false);

    ui.openPlanTripModal();
    expect(document.getElementById('planTripModal').classList.contains('active')).toBe(true);
    ui.closePlanTripModal();
    expect(document.getElementById('planTripModal').classList.contains('active')).toBe(false);
  });

  it('editBooking should populate the modal for normal and plan trips', () => {
    const trip = { id: 10, title: 'Paris', date: '2026-05-01', flight: 'AF1', hotels: [], type: 'viaggio' };
    state.data.upcoming = [trip];
    
    ui.editBooking(10);
    expect(document.getElementById('pt-dest').value).toBe('Paris');
    expect(document.getElementById('planTripModal').classList.contains('active')).toBe(true);
    
    ui.closePlanTripModal();
    
    const booking = { id: 20, title: 'Meeting', date: '2026-06-01', type: 'lavoro', description: 'desc' };
    state.data.upcoming.push(booking);
    
    ui.editBooking(20);
    expect(document.getElementById('b-title').value).toBe('Meeting');
    expect(document.getElementById('bookingModal').classList.contains('active')).toBe(true);
  });

  it('renderUpcomingGrid should filter by type', () => {
    state.data.upcoming = [
      { id: 1, title: 'T1', type: 'viaggio', date: 'X', image: '' },
      { id: 2, title: 'T2', type: 'lavoro', date: 'Y', image: '' }
    ];
    ui.renderUpcomingGrid('viaggio');
    const html = document.getElementById('all-upcoming-grid').innerHTML;
    expect(html).toContain('T1');
    expect(html).not.toContain('T2');
  });

  it('renderUpcomingGrid should render sections for hotels and attachments', () => {
    state.data.upcoming = [
      { 
        id: 1, title: 'Trip 1', type: 'viaggio', date: '2026', 
        image: '', hotels: [{name:'H1'}], attachments: [{id:'a1', name:'doc.pdf'}] 
      }
    ];
    window.db = {
      transaction: vi.fn(() => ({
        objectStore: vi.fn(() => ({
          get: vi.fn(() => ({
            onsuccess: null,
            onerror: null
          }))
        }))
      }))
    };
    ui.renderUpcomingGrid();
    const html = document.getElementById('all-upcoming-grid').innerHTML;
    expect(html).toContain('Hotel Proposti');
    expect(html).toContain('Allegati');
  });

  it('closePreviewModal should remove active class', () => {
    const modal = document.getElementById('attachmentPreviewModal');
    modal.classList.add('active');
    ui.closePreviewModal();
    expect(modal.classList.contains('active')).toBe(false);
  });
});
