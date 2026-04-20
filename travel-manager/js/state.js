/**
 * OdusIA State Management Module
 */
import { saveAppData, loadAppData, saveRepoData, persistRepoToFilesystem } from './storage.js';

const INITIAL_DATA = {
  upcoming: [],
  history: [],
  stats: { viaggio: 0, lavoro: 0, tennis: 0 }
};

export class AppState {
  constructor() {
    this.data = loadAppData(INITIAL_DATA);
    this.editingId = null;
    this.currentAttachmentsEdit = [];
    this.currentHotelsEdit = [];
    this.currentPlanStep = 1;
    this.listeners = [];
    this.curatorState = {
      isActive: false,
      currentStep: 0,
      inputs: { location: '', spa: '', price: '', focus: '' },
      lastCurationHotels: [],
      lastCurationLocation: '',
      lastViewedHotel: null,
      history: []
    };
  }

  /**
   * Persists the current HOTEL_REPOSITORY.
   */
  syncHotelRepo(repo) {
    saveRepoData(repo);
    persistRepoToFilesystem(repo);
    this.notify();
  }

  /**
   * Subscribe to state changes.
   * @param {Function} callback 
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Notify all listeners of a state change.
   */
  notify() {
    this.listeners.forEach(callback => callback(this.data));
  }

  /**
   * Persists current data and notifies listeners.
   */
  save() {
    saveAppData(this.data);
    this.notify();
  }

  /**
   * Updates a specific statistics counter.
   * @param {string} type 
   * @param {number} delta 
   */
  updateStat(type, delta = 1) {
    if (this.data.stats[type] !== undefined) {
      this.data.stats[type] += delta;
      this.save();
    }
  }

  /**
   * Adds a new booking to the upcoming list.
   * @param {Object} booking 
   */
  addBooking(booking) {
    this.data.upcoming.unshift(booking);
    this.updateStat(booking.type, 1);
    this.save();
  }

  /**
   * Deletes a booking by ID.
   * @param {number|string} id 
   */
  deleteBooking(id) {
    const uIdx = this.data.upcoming.findIndex(b => b.id == id);
    if (uIdx !== -1) {
      const b = this.data.upcoming.splice(uIdx, 1)[0];
      this.updateStat(b.type, -1);
      this.save();
      return true;
    }
    const hIdx = this.data.history.findIndex(b => b.id == id);
    if (hIdx !== -1) {
      this.data.history.splice(hIdx, 1);
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Moves a booking from upcoming to history.
   * @param {number|string} id 
   */
  archiveBooking(id) {
    const idx = this.data.upcoming.findIndex(b => b.id == id);
    if (idx !== -1) {
      const b = this.data.upcoming.splice(idx, 1)[0];
      b.status = 'completed';
      this.data.history.unshift(b);
      this.save();
    }
  }

  resetEditState() {
    this.editingId = null;
    this.currentAttachmentsEdit = [];
    this.currentHotelsEdit = [];
    this.currentPlanStep = 1;
  }

  resetCuratorState() {
    this.curatorState.isActive = false;
    this.curatorState.currentStep = 0;
    this.curatorState.inputs = { location: '', spa: '', price: '', focus: '' };
    this.curatorState.history = [];
    // Preserving lastCurationHotels and lastCurationLocation for Export functionality
  }

  resetAll() {
    this.data = { upcoming: [], history: [], stats: { viaggio: 0, lavoro: 0, tennis: 0 } };
    this.resetEditState();
  }
}

// Single instance for the application
export const state = new AppState();
