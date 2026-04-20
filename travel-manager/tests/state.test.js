import { describe, it, expect, vi, beforeEach } from 'vitest';
import { state } from '../js/state.js';

describe('State Module (Observer Pattern)', () => {
  beforeEach(() => {
    // Reset state before each test
    state.data.upcoming = [];
    state.data.history = [];
    state.subscribers = [];
  });

  it('should initialize with empty data', () => {
    expect(state.data.upcoming).toEqual([]);
  });

  it('should add a booking and notify subscribers', () => {
    const callback = vi.fn();
    state.subscribe(callback);

    const booking = { id: 1, title: 'Test Trip' };
    state.addBooking(booking);

    expect(state.data.upcoming).toContain(booking);
    expect(callback).toHaveBeenCalledWith(state.data);
  });

  it('should delete a booking and notify subscribers', () => {
    const booking = { id: 1, title: 'Test Trip' };
    state.addBooking(booking);
    
    const callback = vi.fn();
    state.subscribe(callback);

    state.deleteBooking(1);

    expect(state.data.upcoming).not.toContain(booking);
    expect(callback).toHaveBeenCalled();
  });

  it('should archive a trip (move from upcoming to history)', () => {
    const trip = { id: 1, title: 'Italy', type: 'viaggio' };
    state.addBooking(trip);

    state.archiveBooking(1);

    expect(state.data.upcoming).toHaveLength(0);
    expect(state.data.history).toHaveLength(1);
    expect(state.data.history[0].title).toBe('Italy');
  });

  it('should reset edit state', () => {
    state.editingId = 123;
    state.currentAttachmentsEdit = [{ id: 1 }];
    state.currentHotelsEdit = [{ name: 'Hotel' }];

    state.resetEditState();

    expect(state.editingId).toBeNull();
    expect(state.currentAttachmentsEdit).toEqual([]);
    expect(state.currentHotelsEdit).toEqual([]);
  });

  it('should delete from history', () => {
    state.data.history = [{ id: 99, title: 'Old' }];
    const res = state.deleteBooking(99);
    expect(res).toBe(true);
    expect(state.data.history.length).toBe(0);
  });

  it('should return false when deleting non-existent', () => {
    expect(state.deleteBooking(555)).toBe(false);
  });
});
