/**
 * OdusIA Storage Module (IndexedDB & LocalStorage)
 */

const DB_NAME = 'TravelManagerDB';
const DB_VERSION = 2; // Incremented for better versioning
const STORE_NAME = 'attachments';
const APP_DATA_KEY = 'travel_manager_data';

/**
 * Opens connection to IndexedDB.
 */
export async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (e) => reject(e.target.error);
    request.onsuccess = (e) => resolve(e.target.result);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

/**
 * Saves a file to IndexedDB with a unique key.
 */
export async function idbSaveFile(db, bookingId, file) {
  if (!db) throw new Error('DB non inizializzato');
  const key = `${bookingId}_${file.name}`;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({ id: key, content: file, type: file.type });
    request.onsuccess = () => resolve(key);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Retrieves a file from IndexedDB.
 */
export async function idbGetFile(db, id) {
  if (!db) throw new Error('DB non inizializzato');
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Deletes a file from IndexedDB.
 */
export async function idbDeleteFile(db, id) {
  if (!db) throw new Error('DB non inizializzato');
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
}

/**
 * Saves application data to LocalStorage.
 */
export function saveAppData(data) {
  localStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
}

/**
 * Loads application data from LocalStorage.
 */
export function loadAppData(defaults) {
  const stored = localStorage.getItem(APP_DATA_KEY);
  if (!stored) return defaults;
  try {
    const parsed = JSON.parse(stored);
    // Deep merge or validation could be added here
    return { ...defaults, ...parsed };
  } catch (e) {
    console.warn('Failed to parse app data, using defaults.');
    return defaults;
  }
}

const REPO_DATA_KEY = 'travel_manager_repo';

/**
 * Saves the Hotel Repository to LocalStorage.
 */
export function saveRepoData(data) {
  localStorage.setItem(REPO_DATA_KEY, JSON.stringify(data));
}

/**
 * Loads the Hotel Repository from LocalStorage.
 */
export function loadRepoData() {
  const stored = localStorage.getItem(REPO_DATA_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}
/**
 * Persists the Hotel Repository to the filesystem via server API.
 */
export async function persistRepoToFilesystem(repo) {
  try {
    const response = await fetch('/api/save-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(repo)
    });
    if (!response.ok) throw new Error('API request failed');
    console.info('💾 Repository synchronized to constants.js');
    return await response.json();
  } catch (err) {
    console.error('❌ Failed to persist repository to disk:', err);
    return { success: false, error: err.message };
  }
}
