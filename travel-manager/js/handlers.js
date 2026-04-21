import { state } from './state.js';
import { idbSaveFile, idbDeleteFile, saveRepoData, persistRepoToFilesystem } from './storage.js';
import { validateFileMagicNumber } from './security.js';
import { HOTEL_REPOSITORY } from './constants.js';

export function handleAddBooking(e) {
  e.preventDefault();
  const type = document.getElementById('b-type').value;
  const title = document.getElementById('b-title').value;
  const date = document.getElementById('b-date').value;
  const desc = document.getElementById('b-desc').value;

  const newBooking = {
    id: Date.now(),
    type,
    title,
    date,
    description: desc,
    status: 'pending',
    attachments: [],
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80'
  };

  state.addBooking(newBooking);
  document.getElementById('bookingModal')?.classList.remove('active');
  if (window.renderDashboard) window.renderDashboard();
  if (window.renderUpcomingGrid) window.renderUpcomingGrid('all');
}

export function handlePlanTrip(e) {
  e.preventDefault();
  
  const dest = document.getElementById('pt-dest').value;
  const start = document.getElementById('pt-start').value;
  const end = document.getElementById('pt-end').value;
  const flight = document.getElementById('pt-flight').value;

  const id = state.editingId || Date.now();
  const isNew = !state.editingId;
  
  let booking;
  if (!isNew) {
    booking = state.data.upcoming.find(b => b.id == id);
  } else {
    booking = {
      id: id,
      type: 'viaggio',
      status: 'pending',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80'
    };
  }

  if (!booking) {
    console.error('❌ Booking not found for ID:', id);
    return;
  }

  booking.title = dest;
  booking.date = start;
  booking.endDate = end;
  booking.flight = flight;
  booking.description = `Viaggio a ${dest}. ${flight ? 'Volo: ' + flight : ''}`;
  
  booking.hotels = [...state.currentHotelsEdit];
  booking.attachments = [...state.currentAttachmentsEdit];

  if (isNew) {
    state.addBooking(booking);
  } else {
    state.save();
  }

  state.resetEditState();
  document.getElementById('planTripModal')?.classList.remove('active');
  if (window.renderDashboard) window.renderDashboard();
  if (window.renderUpcomingGrid) window.renderUpcomingGrid('all');
  if (window.switchView) window.switchView('upcoming');
}

export async function handleFileSelection(e, prefix) {
  const files = e.target.files;
  if (!files || files.length === 0) return;
  
  const statusEl = document.getElementById(`${prefix}-upload-status`);
  if (statusEl) statusEl.style.display = 'block';

  const tempId = state.editingId || Date.now();
  const db = window.db; 

  try {
    for (const file of Array.from(files)) {
      const isValid = await validateFileMagicNumber(file);
      if (!isValid) {
        alert(`❌ File Rifiutato: "${file.name}" non sembra essere un documento valido o è corrotto.`);
        continue;
      }

      const key = await idbSaveFile(db, tempId, file);
      state.currentAttachmentsEdit.push({ id: key, name: file.name });
    }
    if (window.renderEditAttachments) window.renderEditAttachments(prefix);
  } catch (err) {
    console.error('File Upload Error:', err);
  } finally {
    if (statusEl) statusEl.style.display = 'none';
  }
}

export async function removeAttachment(prefix, idx) {
  const att = state.currentAttachmentsEdit[idx];
  const confirmed = window.showLuxuryConfirm ? await window.showLuxuryConfirm(
    'Rimuovi Allegato',
    `Sei sicuro di voler rimuovere "${att.name}"?`,
    'danger'
  ) : confirm(`Rimuovere ${att.name}?`);
  if (confirmed) {
    const db = window.db;
    await idbDeleteFile(db, att.id);
    state.currentAttachmentsEdit.splice(idx, 1);
    renderEditAttachments(prefix);
  }
}

export function addHotelRow(prefix) {
  state.currentHotelsEdit.push({ name: '', spa: '', distance: '', price: '', rating: '', link: '' });
  renderPlanHotels(prefix);
}

export function removeHotelRow(prefix, idx) {
  state.currentHotelsEdit.splice(idx, 1);
  renderPlanHotels(prefix);
}

export function addHotelFromRepo(h, zoneName) {
  state.currentHotelsEdit.push({
    name: h.name,
    spa: h.spa,
    distance: h.distance || (`${h.distanceKm} KM / ${h.distanceTime}`),
    price: h.price,
    rating: h.rating,
    link: h.link,
    fromRepo: true,
    zone: zoneName
  });
  renderPlanHotels('pt');
}

export function updateHotelField(idx, field, value) {
  if (state.currentHotelsEdit[idx]) {
    state.currentHotelsEdit[idx][field] = value;
  }
}

export function addHotelsToPlan(hotelsJson) {
  try {
    const hotels = JSON.parse(decodeURIComponent(hotelsJson));
    state.currentHotelsEdit = [...state.currentHotelsEdit, ...hotels];
    if (window.renderPlanHotels) window.renderPlanHotels('pt');
    if (window.openPlanTripModal) window.openPlanTripModal(false);
    document.querySelector('.hotel-section')?.scrollIntoView({ behavior: 'smooth' });
  } catch (e) {
    console.error('Error adding hotels:', e);
  }
}

export function createTripAutomatically(trip) {
  const newBooking = {
    id: Date.now(),
    type: 'viaggio',
    title: trip.title || 'Nuovo Viaggio',
    date: trip.date || '',
    endDate: trip.endDate || '',
    flight: trip.flight || '',
    description: trip.description || `Viaggio pianificato automaticamente.`,
    attachments: [],
    hotels: trip.hotels || [],
    isPlanTrip: true,
    status: 'pending',
    image: trip.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80'
  };
  
  state.addBooking(newBooking);
  renderDashboard();
  renderUpcomingGrid('all');
}

export function handleSaveBooking(e) {
  e.preventDefault();
  const id = state.editingId;
  const item = state.data.upcoming.find(b => b.id == id);
  if (!item) return;

  item.title = document.getElementById('b-title').value;
  item.date = document.getElementById('b-date').value;
  item.description = document.getElementById('b-desc').value;
  item.type = document.getElementById('b-type').value;
  item.attachments = [...state.currentAttachmentsEdit];

  state.addBooking(item);
  state.editingId = null;
  document.getElementById('bookingModal')?.classList.remove('active');
  renderDashboard();
  renderUpcomingGrid('all');
}

export async function deleteBookingPrompt(id) {
  const confirmed = await showLuxuryConfirm(
    'Conferma Eliminazione',
    'Sei sicuro di voler eliminare definitivamente questo elemento? Questa azione non è reversibile.',
    'danger'
  );
  
  if (confirmed) {
    state.deleteBooking(id);
    if (window.renderDashboard) window.renderDashboard();
    if (window.renderUpcomingGrid) window.renderUpcomingGrid('all');
    if (window.renderHistory) window.renderHistory();
    if (window.showToast) window.showToast('Prenotazione eliminata con successo.', 'success');
  }
}

export async function archiveTrip(id) {
  const confirmed = await showLuxuryConfirm(
    'Archivia Viaggio',
    'Vuoi contrassegnare questo viaggio come completato e spostarlo in archivio?',
    'default'
  );
  if (confirmed) {
    state.archiveBooking(id);
    renderDashboard();
    renderUpcomingGrid('all');
    renderHistory();
    showToast('Viaggio archiviato con successo.', 'success');
  }
}

export async function exportCurationToRepo() {
  const { lastCurationHotels, lastCurationLocation } = state.curatorState;
  
  if (!lastCurationHotels || lastCurationHotels.length === 0) {
    showToast('Nessun dato da esportare.', 'error');
    return;
  }

  const m = await import('./constants.js');
  const repo = m.HOTEL_REPOSITORY;
  let zone = repo.find(z => z.zone.toLowerCase() === lastCurationLocation.toLowerCase());
  
  if (!zone) {
    zone = { zone: lastCurationLocation, icon: 'fa-map-location-dot', hotels: [] };
    repo.push(zone);
  }

  let addedCount = 0;
  lastCurationHotels.forEach(h => {
    const exists = zone.hotels.some(existing => existing.name.toLowerCase() === h.name.toLowerCase());
    if (!exists) {
      zone.hotels.push({
        name: h.name, spa: h.spa, distanceKm: h.distanceKm, distanceTime: h.distanceTime,
        distance: `${h.distanceKm} KM / ${h.distanceTime}`, price: h.price, rating: 9.0, link: h.link
      });
      addedCount++;
    }
  });

  // 🛡️ Remove the export button after success
  const exportBtn = document.querySelector('.save-curation-btn');
  if (exportBtn) exportBtn.style.display = 'none';

  if (window.renderHotelsView) window.renderHotelsView();
  state.syncHotelRepo(repo);
  
  if (window.showToast) window.showToast(`Esportazione completata: ${addedCount} nuovi hotel aggiunti a "${lastCurationLocation}".`, 'success');
}

export async function deleteHotel(name, zoneName) {
  const confirmed = await showLuxuryConfirm(
    'Rimuovere dal Repository',
    `Sei sicuro di voler rimuovere "${name}" dal repository?`,
    'danger'
  );

  if (!confirmed) return;

  const m = await import('./constants.js');
  const repo = m.HOTEL_REPOSITORY;
  const zone = repo.find(z => z.zone.toLowerCase() === zoneName.toLowerCase());
  
  if (!zone) {
    console.warn('❌ Zone not found:', zoneName);
    return;
  }

  const idx = zone.hotels.findIndex(h => h.name.toLowerCase() === name.toLowerCase());
  if (idx !== -1) {
    zone.hotels.splice(idx, 1);
    
    if (zone.hotels.length === 0 && zone.zone !== 'TOP5') {
      const zIdx = repo.indexOf(zone);
      repo.splice(zIdx, 1);
    }

    if (window.renderHotelsView) window.renderHotelsView();
    state.syncHotelRepo(repo);
    if (window.showToast) window.showToast(`"${name}" rimosso dal repository.`, 'info');
  }
}

export function openImportModal() {
  const datalist = document.getElementById('zone-list');
  if (datalist) {
    const zones = HOTEL_REPOSITORY.map(z => z.zone);
    datalist.innerHTML = zones.map(z => `<option value="${z}">`).join('');
  }
  document.getElementById('importHotelModal')?.classList.add('active');
}

export function closeImportModal() {
  document.getElementById('importHotelModal')?.classList.remove('active');
  document.getElementById('import-hotel-form')?.reset();
}

export async function saveImportedHotel(e) {
  e.preventDefault();
  
  const name = document.getElementById('imp-name').value.trim();
  const zoneName = document.getElementById('imp-zone').value.trim().toUpperCase();
  const spa = document.getElementById('imp-spa').value.trim();
  const rating = parseFloat(document.getElementById('imp-rating').value) || 0;
  const price = document.getElementById('imp-price').value.trim();
  const distance = document.getElementById('imp-distance').value.trim();
  const location = document.getElementById('imp-location').value.trim();
  const link = document.getElementById('imp-link').value.trim();
  const description = document.getElementById('imp-desc').value.trim();

  if (!name || !zoneName) {
    if (window.showToast) window.showToast('Nome e Zona sono obbligatori.', 'error');
    return;
  }

  let zone = HOTEL_REPOSITORY.find(z => z.zone.toUpperCase() === zoneName);
  if (!zone) {
    zone = { zone: zoneName, icon: 'fa-map-location-dot', hotels: [] };
    HOTEL_REPOSITORY.push(zone);
  }

  const existingHotel = zone.hotels.find(h => h.name.toLowerCase() === name.toLowerCase());
  if (existingHotel) {
    if (window.showToast) window.showToast('Questo hotel esiste già in questa zona.', 'warning');
    return;
  }

  const newHotel = {
    name,
    spa,
    rating,
    price,
    distance,
    link: link || '#',
    details: {
      description,
      spa_size: '-',
      pools: { internal: 0, external: 0, desc: '-' },
      location: location || zoneName,
      highlights: ['Intelligence Captured']
    }
  };

  zone.hotels.push(newHotel);
  
  // Persist
  saveRepoData(HOTEL_REPOSITORY);
  await persistRepoToFilesystem(HOTEL_REPOSITORY);

  // UI Updates
  closeImportModal();
  if (window.renderHotelsView) window.renderHotelsView();
  if (window.showToast) window.showToast(`"${name}" è stato archiviato correttamente nel repository.`, 'success');
  
  // Optional: Switch to repository view
  const go = window.showLuxuryConfirm ? await window.showLuxuryConfirm('Intelligence Archiviata', 'Vuoi visualizzare subito il repository hotel?', 'default') : true;
  if (go && window.switchView) window.switchView('hotels');
}

/**
 * 🗄️ ARCHIVIO CURATELE
 * Salva il contenuto del report AI su file fisico .md
 */
window.saveCuratelaToArchive = async function(btn) {
  const container = btn.closest('.curator-report');
  if (!container) return;

  // Estraiamo il titolo o la prima riga utile per il nome file
  const locationHeader = container.querySelector('h1, h2, h3')?.textContent || 'Curation';
  
  // 1. Capture content BEFORE changing button state
  const reportClone = container.cloneNode(true);
  
  // 2. Cleanup: remove UI elements that shouldn't be in the text archive
  reportClone.querySelectorAll('.hotel-btns, .archive-action, .curator-controls').forEach(el => el.remove());
  
  const cleanHtml = reportClone.innerHTML.trim();
  
  // 3. UI feedback
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Archiviazione in corso...';

  try {
    const response = await fetch('/api/archive-curation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: cleanHtml, 
        location: locationHeader 
      })
    });

    const data = await response.json();
    if (response.ok) {
      if (window.showToast) window.showToast(`💎 Report archiviato con successo: ${data.fileName}`, 'success');
      btn.innerHTML = '<i class="fa-solid fa-check-double"></i> SALVATO NELL\'ARCHIVIO';
      btn.classList.add('archived-success');
    } else {
      throw new Error(data.error);
    }
  } catch (err) {
    console.error("Archival Error:", err);
    if (window.showToast) window.showToast("Errore durante l'archiviazione.", 'error');
    btn.innerHTML = originalHtml;
    btn.disabled = false;
  }
};

/**
 * 🤖 AUTO-IMPORT INTELLIGENCE v. 3.0 — DIRECT SAVE
 * Salva l'hotel direttamente nel repository senza aprire form.
 * Crea automaticamente la zona (es. LIGURIA) se non esiste.
 */
window.autoImportHotel = async function(btn) {
  try {
    const data = {
      name:      btn.getAttribute('data-name'),
      link:      btn.getAttribute('data-link'),
      price:     btn.getAttribute('data-price'),
      distance:  btn.getAttribute('data-distance'),
      spa:       btn.getAttribute('data-spa'),
      spa_size:  btn.getAttribute('data-spa-size') || '-',
      pools_in:  parseInt(btn.getAttribute('data-pools-in'))  || 0,
      pools_out: parseInt(btn.getAttribute('data-pools-out')) || 0,
      location:  btn.getAttribute('data-location'),
      zone:      (btn.getAttribute('data-zone') || 'ITALIA').toUpperCase(),
      desc:      btn.getAttribute('data-desc'),
      rating:    parseFloat(btn.getAttribute('data-rating')) || 9.0,
      highlights: (btn.getAttribute('data-highlights') || '')
                    .split(';')
                    .map(h => h.trim())
                    .filter(Boolean)
    };

    if (!data.name) throw new Error('Dati hotel mancanti.');

    // --- Accedi al repository (esposto da app.js) ---
    const repo = window.HOTEL_REPOSITORY;
    if (!repo) {
      if (window.showToast) window.showToast('Repository non disponibile. Apri la sezione Hotel prima.', 'error');
      return;
    }

    // --- Crea zona se non esiste ---
    let zone = repo.find(z => z.zone.toUpperCase() === data.zone);
    if (!zone) {
      zone = { zone: data.zone, icon: 'fa-map-location-dot', hotels: [] };
      repo.push(zone);
    }

    // --- Gestione Duplicati ---
    const existingIndex = zone.hotels.findIndex(h => h.name.toLowerCase() === data.name.toLowerCase());
    
    const hotelObj = {
      name: data.name,
      spa:  data.spa  || '-',
      rating: data.rating,
      price:  data.price    || '-',
      distance: data.distance || '-',
      link: data.link || '#',
      details: {
        description: data.desc || 'Eccellenza del territorio con servizi di alto livello e posizione privilegiata.',
        spa_size: data.spa_size && data.spa_size !== '-' ? data.spa_size : '800 mq (est.)',
        pools: {
          internal: data.pools_in || 1,
          external: data.pools_out || 1,
          desc: `${data.pools_in || 1} interne, ${data.pools_out || 1} esterne`
        },
        location: data.location || data.zone,
        highlights: data.highlights.length > 0
          ? data.highlights
          : ['Spiaggia Privata', 'SPA Esclusiva', 'Vista Panoramica']
      }
    };

    if (existingIndex !== -1) {
      console.log(`[Repository] Updating existing hotel: ${data.name}`);
      zone.hotels[existingIndex] = hotelObj;
    } else {
      console.log(`[Repository] Adding new hotel: ${data.name}`);
      zone.hotels.push(hotelObj);
    }

    // --- Persistenza Doppia (Server + LocalStorage per UI Sync) ---
    const success = await fetch('/api/save-repo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(window.HOTEL_REPOSITORY)
    });

    if (typeof window.saveRepoData === 'function') {
      window.saveRepoData(window.HOTEL_REPOSITORY);
    } else {
      localStorage.setItem('travel_manager_repo', JSON.stringify(window.HOTEL_REPOSITORY));
    }

    if (window.renderHotelsView) window.renderHotelsView();

    // --- Feedback visivo sul bottone ---
    btn.innerHTML = '<i class="fa-solid fa-check"></i> CATTURATO';
    btn.style.background = '#2d7a2d';
    btn.disabled = true;

    if (window.showToast) window.showToast(
      `💎 "${data.name}" salvato nella zona ${data.zone}.`, 'success'
    );

  } catch (err) {
    console.error('AutoImport Error:', err);
    if (window.showToast) window.showToast('Errore durante la cattura.', 'error');
  }
};
