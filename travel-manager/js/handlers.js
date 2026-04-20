/**
 * OdusIA Event Handlers Module
 */
import { state } from './state.js';
import { idbSaveFile, idbDeleteFile } from './storage.js';
import { 
  renderDashboard, 
  renderUpcomingGrid, 
  switchView, 
  renderEditAttachments, 
  renderHistory,
  closePlanTripModal,
  showLuxuryConfirm,
  showToast
} from './ui.js';
import { validateFileMagicNumber } from './security.js';

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
  renderDashboard();
  renderUpcomingGrid('all');
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
  renderDashboard();
  renderUpcomingGrid('all');
  switchView('upcoming');
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
    renderEditAttachments(prefix);
  } catch (err) {
    console.error('File Upload Error:', err);
  } finally {
    if (statusEl) statusEl.style.display = 'none';
  }
}

export async function removeAttachment(prefix, idx) {
  const att = state.currentAttachmentsEdit[idx];
  const confirmed = await showLuxuryConfirm(
    'Rimuovi Allegato',
    `Sei sicuro di voler rimuovere "${att.name}"?`,
    'danger'
  );
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

export function updateHotelField(idx, field, value) {
  if (state.currentHotelsEdit[idx]) {
    state.currentHotelsEdit[idx][field] = value;
  }
}

export function addHotelsToPlan(hotelsJson) {
  try {
    const hotels = JSON.parse(decodeURIComponent(hotelsJson));
    state.currentHotelsEdit = [...state.currentHotelsEdit, ...hotels];
    renderPlanHotels('pt');
    openPlanTripModal(false);
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
    renderDashboard();
    renderUpcomingGrid('all');
    renderHistory();
    showToast('Prenotazione eliminata con successo.', 'success');
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

  const ui = await import('./ui.js');
  ui.renderHotelsView();
  state.syncHotelRepo(repo);
  
  showToast(`Esportazione completata: ${addedCount} nuovi hotel aggiunti a "${lastCurationLocation}".`, 'success');
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

    const ui = await import('./ui.js');
    ui.renderHotelsView();
    state.syncHotelRepo(repo);
    showToast(`"${name}" rimosso dal repository.`, 'info');
  }
}
