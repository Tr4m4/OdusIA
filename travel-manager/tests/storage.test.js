import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { openDB, idbSaveFile, idbGetFile, idbDeleteFile, saveAppData, loadAppData } from '../js/storage.js';

describe('Storage Module (IndexedDB & LocalStorage)', () => {
  let db;

  beforeEach(async () => {
    db = await openDB();
  });

  it('should initialize the database', () => {
    expect(db.name).toBe('TravelManagerDB');
    expect(db.objectStoreNames.contains('attachments')).toBe(true);
  });

  it('should save and retrieve a file', async () => {
    const file = new File(['hello content'], 'test.txt', { type: 'text/plain' });
    const bookingId = 123;
    
    const key = await idbSaveFile(db, bookingId, file);
    expect(key).toBe('123_test.txt');
    
    const retrieved = await idbGetFile(db, key);
    expect(retrieved.id).toBe(key);
    expect(retrieved.content).toBeDefined();
  });

  it('should delete a file', async () => {
    const file = new File(['bye'], 'bye.txt');
    const key = await idbSaveFile(db, 999, file);
    
    await idbDeleteFile(db, key);
    
    const retrieved = await idbGetFile(db, key);
    expect(retrieved).toBeUndefined();
  });

  it('should manage LocalStorage data', () => {
    const data = { test: 'value' };
    saveAppData(data);
    
    const loaded = loadAppData({ default: 'ok' });
    expect(loaded.test).toBe('value');
    expect(loaded.default).toBe('ok');
  });

  it('should return defaults on load error', () => {
    localStorage.setItem('travel_manager_data', 'invalid-json');
    const result = loadAppData({ x: 1 });
    expect(result.x).toBe(1);
  });
});
