/**
 * OdusIA UI Rendering Module
 */
import { state } from './state.js';
import { escapeHTML } from './utils.js';
import { HOTEL_REPOSITORY } from './constants.js';

/**
 * Renders the main dashboard overview.
 */
export function renderDashboard() {
  const container = document.getElementById('upcoming-list');
  const historyContainer = document.getElementById('recent-history-list');
  if (!container) return;

  // 🛡️ Update Stats
  const { voyage = 0, work = 0, tennis = 0 } = state.data.stats;
  // Use mapping or local keys if state.data.stats uses different keys
  // Based on state.js: { viaggio: 0, lavoro: 0, tennis: 0 }
  const s = state.data.stats;
  if(document.getElementById('stat-viaggio')) document.getElementById('stat-viaggio').textContent = s.viaggio || 0;
  if(document.getElementById('stat-lavoro')) document.getElementById('stat-lavoro').textContent = s.lavoro || 0;
  if(document.getElementById('stat-tennis')) document.getElementById('stat-tennis').textContent = s.tennis || 0;

  const latest = state.data.upcoming.slice(0, 3);
  if (latest.length === 0) {
    container.innerHTML = `
      <div class="empty-state animate-fade">
        <i class="fa-solid fa-plane-up" style="font-size: 3.5rem; color: var(--accent-gold); margin-bottom: 1.5rem; opacity: 0.8;"></i>
        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 2rem;">Il tuo diario di viaggio è vuoto. <br>Inizia a sognare la tua prossima meta.</p>
        <button class="btn-primary btn-travel" onclick="window.openPlanTripModal()">
          <img src="assets/icon_ship_gold.png" class="btn-brand-icon" alt=""> Aggiungi Ora
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = latest.map(b => `
    <div class="booking-row animate-fade">
      <div class="row-main">
        <div class="row-type-icon ${b.type}">
          <i class="fa-solid ${b.type === 'viaggio' ? 'fa-plane' : (b.type === 'lavoro' ? 'fa-briefcase' : 'fa-table-tennis-paddle-ball')}"></i>
        </div>
        <div class="row-info">
          <h3>${escapeHTML(b.title)}</h3>
          <p class="date"><i class="fa-regular fa-calendar"></i> ${b.date}</p>
        </div>
      </div>
      <div class="row-actions">
        <button class="icon-btn-luxury" onclick="window.editBooking('${b.id}')" title="Modifica">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="icon-btn-luxury delete" onclick="window.deleteBookingPrompt('${b.id}')" title="Elimina">
          <i class="fa-solid fa-trash"></i>
        </button>
        <button onclick="window.switchView('upcoming')" class="btn-primary outline" style="padding: 0.5rem 1.2rem; font-size: 0.85rem; border-radius: 12px;">Dettagli</button>
      </div>
    </div>
  `).join('');

  // Render history summary if container exists
  if (historyContainer) {
    const recentHistory = state.data.history.slice(0, 3);
    if (recentHistory.length === 0) {
      historyContainer.innerHTML = '<p class="empty-msg" style="padding:1rem;color:var(--text-muted);font-size:0.9rem;">Nessun viaggio completato.</p>';
    } else {
      historyContainer.innerHTML = recentHistory.map(h => `
        <div class="history-item-mini">
          <div class="h-icon-sm ${h.type}"><i class="fa-solid ${h.type === 'viaggio' ? 'fa-plane' : 'fa-briefcase'}"></i></div>
          <div class="h-details">
            <span class="h-title">${escapeHTML(h.title)}</span>
            <span class="h-date">${h.date}</span>
          </div>
        </div>
      `).join('');
    }
  }
}

/**
 * Renders the upcoming bookings grid with filtering.
 * @param {string} filter 
 */
export function renderUpcomingGrid(filter = 'all') {
  const container = document.getElementById('all-upcoming-grid');
  if (!container) return;

  const filtered = filter === 'all' 
    ? state.data.upcoming 
    : state.data.upcoming.filter(b => b.type === filter);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><p>Nessun elemento trovato per questa categoria.</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(b => `
    <div class="full-card animate-fade">
      <div class="card-image">
        <img src="${b.image}" alt="${escapeHTML(b.title)}">
        <div class="card-badge ${b.type}">${b.type.toUpperCase()}</div>
        <div class="card-actions-overlay">
          <button class="icon-btn-luxury" onclick="window.editBooking('${b.id}')" title="Modifica"><i class="fa-solid fa-pen"></i></button>
          <button class="icon-btn-luxury delete" onclick="window.deleteBookingPrompt('${b.id}')" title="Elimina"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
      <div class="card-content">
        <div class="card-header">
          <h2>${escapeHTML(b.title)}</h2>
        </div>
        <p class="card-date"><i class="fa-solid fa-calendar-days"></i> ${b.date} ${b.endDate ? ' - ' + b.endDate : ''}</p>
        <p class="card-desc">${escapeHTML(b.description)}</p>
        
        ${b.hotels && b.hotels.length > 0 ? `
          <div class="card-section">
            <h4><i class="fa-solid fa-hotel"></i> Hotel Proposti (${b.hotels.length})</h4>
            <div class="hotel-labels">
              ${b.hotels.map(h => `
                <div class="hotel-pill-wrapper">
                  <span class="hotel-pill">${escapeHTML(h.name)}</span>
                  ${h.fromRepo ? `
                    <button type="button" class="pill-action" onclick="window.showHotelDetails('${escapeHTML(h.name.replace(/'/g, "\\'"))}', '${escapeHTML(h.zone.replace(/'/g, "\\'"))}')" title="Vedi Scheda">
                      <i class="fa-solid fa-up-right-from-square"></i>
                    </button>
                  ` : ''}
                </div>
              `).join('')}
            </div>
            <button class="btn-primary outline btn-sm" style="margin-top:0.8rem;" onclick="window.viewComparison('${b.id}')">
              Confronta Opzioni <i class="fa-solid fa-scale-balanced"></i>
            </button>
          </div>
        ` : ''}

        ${b.attachments && b.attachments.length > 0 ? `
          <div class="card-section">
            <h4><i class="fa-solid fa-paperclip"></i> Allegati (${b.attachments.length})</h4>
            <div class="attachment-list">
              ${b.attachments.map(a => `
                <div class="att-item" onclick="window.previewAttachment('${a.id}', '${a.name}')">
                  <i class="fa-solid ${a.name.toLowerCase().endsWith('.pdf') ? 'fa-file-pdf' : 'fa-file-image'}"></i>
                  <span>${escapeHTML(a.name)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="card-footer">
          <button class="btn-primary btn-travel" onclick="window.archiveTrip('${b.id}')">
            <img src="assets/icon_ship_gold.png" class="btn-brand-icon" alt=""> Segna come Completato
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Renders the historical records.
 */
export function renderHistory() {
  const container = document.getElementById('history-timeline');
  if (!container) return;

  if (state.data.history.length === 0) {
    container.innerHTML = `<p class="empty-msg">Nessun viaggio completato in archivio.</p>`;
    return;
  }

  const defaultImages = {
    viaggio: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    lavoro: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    tennis: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80',
    generica: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80'
  };

  container.innerHTML = state.data.history.map(b => `
    <div class="history-card animate-fade">
      <div class="card-image">
        <img src="${b.image || defaultImages[b.type] || defaultImages.generica}" alt="${escapeHTML(b.title)}">
        <div class="card-badge">${b.type.toUpperCase()}</div>
      </div>
      <div class="card-content">
        <div class="card-header">
          <h3>${escapeHTML(b.title)}</h3>
        </div>
        <div class="card-date">
          <i class="fa-solid fa-calendar-check"></i> ${b.date} ${b.endDate ? ' - ' + b.endDate : ''}
        </div>
        <p class="card-desc">${escapeHTML(b.description)}</p>
        
        ${b.hotels && b.hotels.length > 0 ? `
          <div style="margin-top:0.5rem;">
            <div class="hotel-labels">
              ${b.hotels.slice(0, 3).map(h => `
                <div class="hotel-pill-wrapper" style="border-radius:6px;">
                  <span class="hotel-pill" style="font-size:0.75rem; padding:0.4rem 0.7rem;">${escapeHTML(h.name)}</span>
                  ${h.fromRepo ? `
                    <button type="button" class="pill-action" style="width:28px;" onclick="window.showHotelDetails('${escapeHTML(h.name.replace(/'/g, "\\'"))}', '${escapeHTML(h.zone.replace(/'/g, "\\'"))}')" title="Vedi Scheda">
                      <i class="fa-solid fa-up-right-from-square" style="font-size:0.6rem;"></i>
                    </button>
                  ` : ''}
                </div>
              `).join('')}
              ${b.hotels.length > 3 ? `<div class="hotel-pill-wrapper" style="border-radius:6px; opacity:0.6;"><span class="hotel-pill" style="font-size:0.75rem; padding:0.4rem 0.7rem;">+${b.hotels.length - 3}</span></div>` : ''}
            </div>
          </div>
        ` : ''}
      </div>
      <div class="card-footer">
        <button class="btn-premium-link" style="padding:0.5rem 1rem; font-size:0.8rem;" onclick="window.viewComparison('${b.id}')">
          <i class="fa-solid fa-eye"></i> Dettagli
        </button>
        <button class="btn-history-delete" onclick="window.deleteBookingPrompt('${b.id}')" title="Elimina definitivamente">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * View switching logic.
 * @param {string} viewName 
 */
export function switchView(viewName) {
  try {
    console.info(`🔄 switchView: ${viewName}`);
    const views = document.querySelectorAll('.view-container');
    const navLinks = document.querySelectorAll('.nav-links li');
    const viewTitle = document.getElementById('view-title');

    if (!views.length) throw new Error('No view containers found');

    views.forEach(v => v.classList.add('hidden'));
    navLinks.forEach(l => l.classList.remove('active'));

    const targetView = document.getElementById(`${viewName}-view`);
    const targetLink = document.querySelector(`.nav-links li[data-view="${viewName}"]`);
    
    if (targetView) targetView.classList.remove('hidden');
    if (targetLink) targetLink.classList.add('active');

    if (viewTitle) {
      const titles = {
        'dashboard': 'Dashboard Personale',
        'upcoming': 'Prossimi Viaggi e Impegni',
        'history': 'Archivio Storico',
        'hotels': 'Luxury Wellness Repository'
      };
      viewTitle.textContent = titles[viewName] || 'OdusIA';
    }

    if (viewName === 'hotels') {
      renderHotelsView();
    }
  } catch (err) {
    console.error('❌ switchView Critical Failure:', err);
  }
}

/**
 * Hotel Repository rendering.
 */
let activeHotelZone = 'TOP5';

export function handleHotelSearch(query) {
  state.hotelSearchQuery = query.toLowerCase();
  renderHotelsView();
}

export function switchHotelTab(zoneName) {
  state.hotelSearchQuery = ''; // Clear search on tab switch
  activeHotelZone = zoneName;
  renderHotelsView();
}

/**
 * Compiles a hotel card.
 */
function renderHotelCard(h, isFeatured = false, rank = 0) {
  const ratingLabel = h.rating >= 9.3 ? 'Eccellente' : (h.rating >= 8.8 ? 'Ottimo' : 'Molto Buono');
  const featuredClass = isFeatured ? 'featured-rank-card' : '';
  const rankFloat = rank > 0 ? `<div class="rank-float">${rank}</div>` : '';

  const escName = h.name.replace(/'/g, "\\'");
  const escZone = (h.zone || activeHotelZone).replace(/'/g, "\\'");

  return `
    <div class="hotel-premium-card ${featuredClass}" onclick="window.showHotelDetails('${escName}', '${escZone}')">
      ${rankFloat}
      <div class="card-top">
        <div class="hotel-title-group">
          <div class="hotel-zone-tag">${escapeHTML(h.zone || 'Premium Selection')}</div>
          <h3>${escapeHTML(h.name)}</h3>
        </div>
        <div class="card-rating">
          <span class="rating-score">${h.rating}</span>
          <span class="rating-label">${ratingLabel}</span>
        </div>
      </div>
      <div class="card-body-content">
        <p class="spa-info-text">${escapeHTML(h.spa)}</p>
      </div>
      <div class="card-meta-row">
        <div class="meta-item" style="flex-direction:column; align-items:flex-start; gap:0.2rem;">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <i class="fa-solid fa-clock"></i> 
            ${h.distanceKm ? `${h.distanceKm} KM • ${h.distanceTime}` : escapeHTML(h.distance)}
          </div>
          ${h.details?.location ? `
            <div class="hotel-card-locality" style="font-size:0.75rem; color:var(--accent-gold); opacity:0.9; margin-left:1.4rem;">
              <i class="fa-solid fa-location-dot" style="font-size:0.7rem;"></i> ${escapeHTML(h.details.location)}
            </div>
          ` : ''}
        </div>
        <div class="meta-item"><span class="price-pill">${escapeHTML(h.price)}</span></div>
      </div>
      <div class="card-actions-row">
        <a href="${h.link}" target="_blank" class="btn-premium-link" onclick="event.stopPropagation()">
          <i class="fa-solid fa-arrow-right"></i> Esplora Sito
        </a>
        <button class="btn-hotel-delete" 
                data-name="${escapeHTML(h.name)}" 
                data-zone="${escapeHTML(h.zone || activeHotelZone)}"
                onclick="event.stopPropagation(); window.handleHotelDelete(this)" 
                title="Rimuovi dal Repository">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    </div>
  `;
}

/**
 * Global Handler for Hotel Deletion (Data-Attribute Based)
 */
window.handleHotelDelete = (btn) => {
  const name = btn.getAttribute('data-name');
  const zone = btn.getAttribute('data-zone');
  window.deleteHotel(name, zone);
};

export function renderHotelsView() {
  const container = document.getElementById('hotels-content');
  if (!container) return;

  let html = `<div class="hotel-repo-container">`;
  html += `
    <div class="repo-header-bar">
      <div class="hotel-search-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input type="text" class="hotel-search-box" placeholder="Ricerca veloce nella collezione..." 
               oninput="window.handleHotelSearch(this.value)" value="${escapeHTML(state.hotelSearchQuery)}">
      </div>
      <nav class="hotel-tabs-nav">
        <button class="tab-btn tab-btn-priority ${activeHotelZone === 'TOP5' && !state.hotelSearchQuery ? 'active' : ''}" onclick="window.switchHotelTab('TOP5')">
          <i class="fa-solid fa-crown"></i> TOP 5
        </button>
        ${HOTEL_REPOSITORY.map(z => {
          const escZone = z.zone.replace(/'/g, "\\'");
          const isActive = activeHotelZone === z.zone && !state.hotelSearchQuery;
          return `
            <button class="tab-btn ${isActive ? 'active' : ''}" onclick="window.switchHotelTab('${escZone}')">
              <i class="fa-solid ${z.icon}"></i> ${escapeHTML(z.zone)}
            </button>
          `;
        }).join('')}
      </nav>
    </div>
  `;

  if (state.hotelSearchQuery) {
    const query = state.hotelSearchQuery;
    const results = [];
    HOTEL_REPOSITORY.forEach(z => {
      z.hotels.forEach(h => {
        if (h.name.toLowerCase().includes(query) || 
            h.spa.toLowerCase().includes(query) || 
            z.zone.toLowerCase().includes(query)) {
          results.push({...h, zone: z.zone});
        }
      });
    });

    html += `
      <section class="hotel-section-wrapper animate-fade">
        <div class="section-header" style="margin-bottom:2rem;">
          <h2 style="font-size:1.5rem; color:var(--accent-gold);">Risultati Ricerca: "${escapeHTML(query)}"</h2>
          <p style="color:var(--text-muted);">${results.length} hotel trovati</p>
        </div>
        ${results.length > 0 ? `
          <div class="hotel-cards-grid">${results.map(h => renderHotelCard(h)).join('')}</div>
        ` : `
          <div class="no-results-box" style="padding:4rem; text-align:center; background:rgba(255,255,255,0.02); border-radius:20px; border:1px dashed rgba(255,255,255,0.1);">
            <i class="fa-solid fa-face-frown" style="font-size:3rem; color:var(--text-muted); margin-bottom:1rem;"></i>
            <p style="color:var(--text-muted);">Nessun hotel corrisponde alla tua ricerca.</p>
          </div>
        `}
      </section>
    `;
  } else if (activeHotelZone === 'TOP5') {
    const allHotels = HOTEL_REPOSITORY.flatMap(z => z.hotels.map(h => ({...h, zone: z.zone})));
    const top5 = [...allHotels].sort((a, b) => b.rating - a.rating).slice(0, 5);
    html += `
      <section class="hotel-section-wrapper animate-fade">
        <div class="section-header" style="margin-bottom:2.5rem; text-align:center;">
          <h2 style="font-size:2.2rem; font-family:var(--font-heading); color:var(--text-main);">The Elite Collection</h2>
          <p style="color:var(--text-muted); font-size:1.1rem;">I 5 migliori Wellness Hotel selezionati per eccellenza SPA e servizio</p>
        </div>
        <div class="top-5-featured">${top5.map((h, i) => renderHotelCard(h, true, i + 1)).join('')}</div>
      </section>
    `;
  } else {
    const currentZone = HOTEL_REPOSITORY.find(z => z.zone === activeHotelZone);
    if (currentZone) {
      html += `
        <section class="hotel-section-wrapper animate-fade">
          <div class="section-header" style="margin-bottom:2.5rem;">
            <h2 style="font-size:1.8rem; font-family:var(--font-heading); color:var(--text-main);"><i class="fa-solid ${currentZone.icon}"></i> Explore: ${escapeHTML(currentZone.zone)}</h2>
          </div>
          <div class="hotel-cards-grid">${currentZone.hotels.map(h => renderHotelCard(h)).join('')}</div>
        </section>
      `;
    }
  }
  html += `</div>`;
  container.innerHTML = html;
}

// Attach UI functions to window for legacy HTML support if needed,
// though we prefer app.js to bind them.
window.switchHotelTab = switchHotelTab;

/**
 * Opens the high-end hotel factsheet modal.
 */
export function showHotelDetails(name, zone) {
  const zoneData = HOTEL_REPOSITORY.find(z => z.zone === zone);
  if (!zoneData) return;
  const h = zoneData.hotels.find(hotel => hotel.name === name);
  if (!h) return;

  // 🛡️ Store for Hooking
  state.curatorState.lastViewedHotel = { ...h, zone };

  const modal = document.getElementById('hotelDetailModal');
  if (!modal) return;

  // Populate basic info
  document.getElementById('fact-name').textContent = h.name;
  document.getElementById('fact-zone-tag').textContent = zone;
  
  // Populate details if available
  const det = h.details || {
    description: "Dettagli in fase di acquisizione dal Curatore. Questa struttura rispetta gli standard elitari di SPA e isolamento richiesti per il repository.",
    spa_size: "Info Premium",
    pools: { desc: h.spa },
    location: "Coordinate in fase di validazione",
    highlights: ["Servizio d'eccellenza", "Privacy Garantita"]
  };

  document.getElementById('fact-spa-size').textContent = det.spa_size || '-';
  document.getElementById('fact-pools').textContent = (det.pools && det.pools.desc) ? det.pools.desc : '-';
  if (det.pools && det.pools.internal !== undefined) {
    document.getElementById('fact-pools').textContent = `${det.pools.internal} In / ${det.pools.external} Out`;
  }
  document.getElementById('fact-location').textContent = det.location || '-';
  document.getElementById('fact-description').textContent = det.description;
  
  const highlightsContainer = document.getElementById('fact-highlights');
  highlightsContainer.innerHTML = (det.highlights || []).map(text => `<li>${escapeHTML(String(text))}</li>`).join('');
  
  const linkBtn = document.getElementById('fact-link');
  if (linkBtn) {
    linkBtn.href = h.link;
    linkBtn.style.display = h.link ? 'flex' : 'none';
  }

  modal.classList.add('active');
}

export function closeHotelDetailModal() {
  document.getElementById('hotelDetailModal')?.classList.remove('active');
}

window.showHotelDetails = showHotelDetails;
window.closeHotelDetailModal = closeHotelDetailModal;

/**
 * Hooks the current viewed hotel into the Plan Trip wizard.
 */
export function hookCurrentHotelToPlan() {
  const h = state.curatorState.lastViewedHotel;
  if (!h) return;

  // Formatta l'hotel per addHotelsToPlan
  const hotelToHook = [{
    name: h.name,
    spa: h.spa,
    distance: h.distance || `${h.distanceKm} KM / ${h.distanceTime}`,
    price: h.price,
    rating: h.rating,
    link: h.link
  }];

  const json = encodeURIComponent(JSON.stringify(hotelToHook));
  
  // Chiudi il modal dell'hotel
  closeHotelDetailModal();
  
  // Chiama l'handler per aggiungere l'hotel e aprire il wizard
  import('./handlers.js').then(m => {
    m.addHotelFromRepo(h, h.zone); // Usa addHotelFromRepo per includere metadati
    openPlanTripModal(false);
    document.querySelector('.hotel-section')?.scrollIntoView({ behavior: 'smooth' });
    showToast(`Hotel "${h.name}" agganciato al piano di viaggio.`, 'success');
  });
}

window.hookCurrentHotelToPlan = hookCurrentHotelToPlan;


export function renderPlanHotels(prefix) {
  const container = document.getElementById(`${prefix}-hotel-list`);
  if (!container) return;
  
  if (state.currentHotelsEdit.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:var(--text-muted);font-size:0.85rem;padding:2rem;">Nessuna opzione hotel aggiunta. Cerca nel repository sopra o clicca "Aggiungi Proposta Manuale" per iniziare.</p>`;
    return;
  }

  container.innerHTML = state.currentHotelsEdit.map((h, i) => `
    <div class="hotel-entry-card animate-fade">
      <div class="card-action-bar">
        ${h.fromRepo ? `
          <button type="button" class="btn-view-repo" onclick="window.showHotelDetails('${escapeHTML(h.name.replace(/'/g, "\\'"))}', '${escapeHTML(h.zone.replace(/'/g, "\\'"))}')" title="Vedi nel Repository">
            <i class="fa-solid fa-eye"></i> Vedi Scheda
          </button>
        ` : ''}
        <button type="button" class="btn-remove-hotel" onclick="window.removeHotelRow('${prefix}', ${i})" title="Rimuovi Opzione">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
      
      <div class="input-with-icon full-width">
        <i class="fa-solid fa-hotel" style="color:var(--accent-gold);"></i>
        <input type="text" class="wizard-input-large" placeholder="Nome Hotel (es. Lefay Resort, Mandarin Oriental...)" value="${escapeHTML(String(h.name))}" onchange="window.updateHotelField(${i}, 'name', this.value)">
      </div>

      <div class="input-with-icon full-width">
        <i class="fa-solid fa-spa" style="color:var(--accent-gold);"></i>
        <input type="text" class="wizard-input-large" placeholder="Dettagli SPA & Servizi Esclusivi" value="${escapeHTML(String(h.spa))}" onchange="window.updateHotelField(${i}, 'spa', this.value)">
      </div>

      <div class="input-with-icon">
        <i class="fa-solid fa-route"></i>
        <input type="text" class="wizard-input-large" placeholder="Distanza" value="${escapeHTML(String(h.distance))}" onchange="window.updateHotelField(${i}, 'distance', this.value)">
      </div>

      <div class="input-with-icon">
        <i class="fa-solid fa-tag"></i>
        <input type="text" class="wizard-input-large" placeholder="Prezzo/Notte" value="${escapeHTML(String(h.price))}" onchange="window.updateHotelField(${i}, 'price', this.value)">
      </div>

      <div class="input-with-icon">
        <i class="fa-solid fa-star"></i>
        <input type="text" class="wizard-input-large" placeholder="Rating (es. 9.5)" value="${escapeHTML(String(h.rating))}" onchange="window.updateHotelField(${i}, 'rating', this.value)">
      </div>

      <div class="input-with-icon">
        <i class="fa-solid fa-link"></i>
        <input type="text" class="wizard-input-large" placeholder="Link Sito" value="${escapeHTML(String(h.link))}" onchange="window.updateHotelField(${i}, 'link', this.value)">
      </div>
    </div>
  `).join('');
}

/**
 * Renders the hotel repository selector in the wizard.
 */
export function renderHotelSelector(query = '') {
  const container = document.getElementById('pt-repo-selector');
  if (!container) return;

  const lowQuery = query.toLowerCase();
  let html = '';

  HOTEL_REPOSITORY.forEach(zone => {
    const filteredHotels = zone.hotels.filter(h => 
      h.name.toLowerCase().includes(lowQuery) || 
      zone.zone.toLowerCase().includes(lowQuery) ||
      (h.spa && h.spa.toLowerCase().includes(lowQuery))
    );

    if (filteredHotels.length > 0) {
      html += `
        <div class="selector-section">
          <div class="selector-section-title"><i class="fa-solid ${zone.icon}"></i> ${escapeHTML(zone.zone)}</div>
          <div class="selector-grid">
            ${filteredHotels.map(h => `
              <div class="selector-card" onclick="window.selectHotelFromRepo('${escapeHTML(h.name.replace(/'/g, "\\'"))}', '${escapeHTML(zone.zone.replace(/'/g, "\\'"))}')">
                <div class="h-name">${escapeHTML(h.name)}</div>
                <div class="h-spa">${escapeHTML(h.spa.length > 80 ? h.spa.substring(0, 80) + '...' : h.spa)}</div>
                <div class="h-meta">
                  <span><i class="fa-solid fa-star"></i> ${h.rating}</span>
                  <span>${escapeHTML(h.price)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  });

  if (html === '') {
    html = `<div style="text-align:center; padding:2rem; color:var(--text-muted);">Nessun hotel trovato nel repository per "${escapeHTML(query)}".</div>`;
  }

  container.innerHTML = html;
}

window.handleRepoSearch = (val) => renderHotelSelector(val);
window.selectHotelFromRepo = async (name, zoneName) => {
  const h = HOTEL_REPOSITORY.find(z => z.zone === zoneName)?.hotels.find(hotel => hotel.name === name);
  if (h) {
    const handlers = await import('./handlers.js');
    handlers.addHotelFromRepo(h, zoneName);
    showToast(`"${name}" aggiunto al piano.`, 'success');
  }
};

/**
 * Renders attachments in the edit modal.
 */
export function renderEditAttachments(prefix) {
  const container = document.getElementById(`${prefix}-existing-attachments`);
  if (!container) return;
  
  if (state.currentAttachmentsEdit.length === 0) {
    container.style.display = 'none';
    container.innerHTML = '';
    return;
  }
  
  container.style.display = 'flex';
  container.innerHTML = state.currentAttachmentsEdit.map((a, i) => `
    <div class="att-pill">
      <i class="fa-solid fa-file-alt"></i>
      <span>${escapeHTML(a.name || a.label)}</span>
      <button type="button" onclick="window.removeAttachment('${prefix}', ${i})">&times;</button>
    </div>
  `).join('');
}

export function openModal() { document.getElementById('bookingModal')?.classList.add('active'); }
export function closeModal() {
  document.getElementById('bookingModal')?.classList.remove('active');
  document.getElementById('bookingForm')?.reset();
  state.resetEditState();
}

export function openPlanTripModal(shouldReset = true) {
  if (shouldReset) state.resetEditState();
  state.currentPlanStep = 1; // 🛡️ Always start at step 1
  const modal = document.getElementById('planTripModal');
  if (modal) {
    modal.classList.add('active');
    updateWizardUI();
    renderPlanHotels('pt');
    renderEditAttachments('pt');
    renderHotelSelector(); // 🛡️ Initialize repository selector
  }
}

export function closePlanTripModal() {
  const modal = document.getElementById('planTripModal');
  if (modal) {
    modal.classList.remove('active');
    // 🛡️ Cleanup form
    document.getElementById('planTripForm')?.reset();
  }
  state.resetEditState();
}

/**
 * Navigation for the Luxury Wizard
 * @param {number} delta 
 */
export function changeWizardStep(delta) {
  const nextStep = state.currentPlanStep + delta;
  if (nextStep < 1 || nextStep > 3) return;

  // Simple validation for Step 1
  if (delta > 0 && state.currentPlanStep === 1) {
    const dest = document.getElementById('pt-dest')?.value;
    const start = document.getElementById('pt-start')?.value;
    const end = document.getElementById('pt-end')?.value;
    if (!dest || !start || !end) {
      alert('Per favore, completa i campi obbligatori della destinazione e delle date.');
      return;
    }
  }

  state.currentPlanStep = nextStep;
  updateWizardUI();
}

/**
 * Updates the visibility of steps and the progress stepper
 */
export function updateWizardUI() {
  try {
    const currentStep = state.currentPlanStep;

    // Update Progress Nodes
    document.querySelectorAll('.step-node').forEach(node => {
      const stepNum = parseInt(node.dataset.step);
      node.classList.remove('active', 'completed');
      if (stepNum === currentStep) node.classList.add('active');
      if (stepNum < currentStep) node.classList.add('completed');
    });

    // Update Step Panels
    document.querySelectorAll('.wizard-step').forEach(panel => {
      panel.classList.remove('active');
    });
    const activePanel = document.getElementById(`pt-step-${currentStep}`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // Update Buttons
    const prevBtn = document.getElementById('pt-prev-btn');
    const nextBtn = document.getElementById('pt-next-btn');
    const submitBtn = document.getElementById('pt-submit-btn');

    if (prevBtn) prevBtn.classList.toggle('hidden', currentStep === 1);
    if (nextBtn) nextBtn.classList.toggle('hidden', currentStep === 3);
    if (submitBtn) submitBtn.classList.toggle('hidden', currentStep !== 3);
  } catch (err) {
    console.error('🛡️ Wizard UI Update Error:', err);
  }
}

/**
 * Populates and opens the edit modal for a booking.
 */
export function editBooking(id) {
  const item = state.data.upcoming.find(b => b.id == id);
  if (!item) return;

  state.editingId = id;
  state.currentAttachmentsEdit = item.attachments ? [...item.attachments] : [];
  state.currentHotelsEdit = item.hotels ? JSON.parse(JSON.stringify(item.hotels)) : [];

  if (item.flight !== undefined || item.hotels) { // It's a Plan Trip
    const destEl = document.getElementById('pt-dest');
    if (destEl) destEl.value = item.title;
    const startEl = document.getElementById('pt-start');
    if (startEl) startEl.value = item.date;
    const endEl = document.getElementById('pt-end');
    if (endEl) endEl.value = item.endDate || '';
    const flightEl = document.getElementById('pt-flight');
    if (flightEl) flightEl.value = item.flight || '';
    
    const titleEl = document.getElementById('pt-modal-title');
    if (titleEl) titleEl.textContent = 'Modifica Viaggio';
    const btnEl = document.getElementById('pt-modal-btn');
    if (btnEl) btnEl.textContent = 'Salva Modifiche';
    
    renderEditAttachments('pt');
    renderPlanHotels('pt');
    openPlanTripModal();
  } else {
    const titleInp = document.getElementById('b-title');
    if (titleInp) titleInp.value = item.title;
    const dateInp = document.getElementById('b-date');
    if (dateInp) dateInp.value = item.date;
    const descInp = document.getElementById('b-desc');
    if (descInp) descInp.value = item.description || '';
    const typeInp = document.getElementById('b-type');
    if (typeInp) typeInp.value = item.type;
    
    const titleEl = document.getElementById('b-modal-title');
    if (titleEl) titleEl.textContent = 'Modifica Prenotazione';
    const btnEl = document.getElementById('b-modal-btn');
    if (btnEl) btnEl.textContent = 'Salva Modifiche';
    
    renderEditAttachments('b');
    openModal();
  }
}

/**
 * Handles file preview from IndexedDB.
 */
export async function previewAttachment(id, name) {
  const modal = document.getElementById('attachmentPreviewModal');
  const titleEl = document.getElementById('preview-modal-title');
  const container = document.getElementById('preview-content-container');
  
  if (!modal || !container) return;
  
  modal.classList.add('active');
  titleEl.textContent = name;
  container.innerHTML = '<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i></div>';
  
  try {
    const db = window.db;
    const record = await (import('./storage.js').then(m => m.idbGetFile(db, id)));
    if (!record) throw new Error('File non trovato');
    
    const url = URL.createObjectURL(record.content);
    const isPDF = name.toLowerCase().endsWith('.pdf');
    
    container.innerHTML = isPDF 
      ? `<iframe src="${url}" width="100%" height="500px" 
           sandbox="allow-scripts allow-same-origin allow-popups"
           style="border:none;border-radius:12px;display:block;"></iframe>`
      : `<img src="${url}" style="max-width:100%;border-radius:12px;box-shadow:var(--shadow-lg);display:block;margin:0 auto;">`;
    
    container.innerHTML += `
      <div style="margin-top:1.5rem; text-align:center;">
        <a href="${url}" download="${name}" class="btn-primary">
          <i class="fa-solid fa-download"></i> Scarica Allegato
        </a>
      </div>
    `;
  } catch (err) {
    console.error('Preview Error:', err);
    container.innerHTML = `<p style="color:var(--accent-fire); text-align:center;">Errore durante l'apertura: ${err.message}</p>`;
  }
}

/**
 * Show a Luxury Confirmation Modal (Async)
 */
export async function showLuxuryConfirm(title, msg, type = 'default') {
  return new Promise((resolve) => {
    const modal = document.getElementById('luxuryConfirmModal');
    const titleEl = document.getElementById('lx-modal-title');
    const msgEl = document.getElementById('lx-modal-msg');
    const iconEl = document.getElementById('lx-modal-icon');
    const cancelBtn = document.getElementById('lx-modal-cancel');
    const proceedBtn = document.getElementById('lx-modal-proceed');

    if (!modal) return resolve(confirm(msg));

    titleEl.textContent = title;
    msgEl.textContent = msg;
    iconEl.innerHTML = type === 'danger' ? '<i class="fa-solid fa-triangle-exclamation"></i>' : '<i class="fa-solid fa-shield-halved"></i>';
    iconEl.className = `luxury-modal-icon ${type}`;

    modal.classList.add('active');

    const cleanup = (val) => {
      modal.classList.remove('active');
      cancelBtn.removeEventListener('click', onCancel);
      proceedBtn.removeEventListener('click', onProceed);
      resolve(val);
    };

    const onCancel = () => cleanup(false);
    const onProceed = () => cleanup(true);

    cancelBtn.addEventListener('click', onCancel);
    proceedBtn.addEventListener('click', onProceed);
  });
}

/**
 * Show a Luxury Toast Notification
 */
export function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-fade-in`;
  const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-circle-xmark' : 'fa-info-circle');
  
  toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

export function closePreviewModal() {
  const modal = document.getElementById('attachmentPreviewModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      const container = document.getElementById('preview-content-container');
      if (container) container.innerHTML = '';
    }, 300);
  }
}


/**
 * Opens comparison modal for hotels in a trip.
 */
export function viewComparison(id) {
  const item = state.data.upcoming.find(b => b.id == id) || state.data.history.find(h => h.id == id);
  if (!item || !item.hotels || item.hotels.length === 0) {
    showToast("Nessuna opzione hotel da confrontare per questo elemento.", "warning");
    return;
  }

  const titleEl = document.getElementById('comp-modal-title');
  if (titleEl) titleEl.textContent = `Confronto Opzioni: ${item.title}`;

  const table = document.getElementById('comparison-table-body');
  if (!table) return;

  let html = `
    <thead>
      <tr>
        <th>Hotel</th>
        <th>SPA / Wellness</th>
        <th>Distanza / Location</th>
        <th>Rating</th>
        <th>Prezzo</th>
        <th>Azioni</th>
      </tr>
    </thead>
    <tbody>
  `;

  html += item.hotels.map(h => `
    <tr>
      <td>
        <strong style="color:var(--text-main); font-size:1rem;">${escapeHTML(h.name)}</strong>
      </td>
      <td>
        <div class="spa-details" style="font-size:0.8rem; color:var(--text-muted); line-height:1.4; max-width:250px;">${escapeHTML(h.spa)}</div>
      </td>
      <td>
        <div class="distance-info" style="font-size:0.85rem; color:var(--text-main);">
          <i class="fa-solid fa-map-pin" style="color:var(--accent-gold); margin-right:5px;"></i>
          ${escapeHTML(h.distance)}
        </div>
      </td>
      <td>
        <div class="vote-badge" style="background:var(--accent-gold); color:#000; padding:0.2rem 0.6rem; border-radius:6px; font-weight:700; display:inline-block;">${h.rating || 'N/A'}</div>
      </td>
      <td>
        <span class="price-tag" style="color:var(--accent-gold); font-weight:600; font-size:0.95rem;">${escapeHTML(h.price)}</span>
      </td>
      <td>
        <div style="display:flex; gap:10px;">
          ${h.fromRepo ? `
            <button class="icon-btn-luxury" onclick="window.showHotelDetails('${escapeHTML(h.name.replace(/'/g, "\\'"))}', '${escapeHTML(h.zone.replace(/'/g, "\\'"))}')" title="Vedi Scheda">
              <i class="fa-solid fa-eye"></i>
            </button>
          ` : ''}
          <a href="${h.link}" target="_blank" class="icon-btn-luxury" title="Sito Ufficiale">
            <i class="fa-solid fa-external-link"></i>
          </a>
        </div>
      </td>
    </tr>
  `).join('');

  html += `</tbody>`;
  table.innerHTML = html;

  document.getElementById('comparisonModal')?.classList.add('active');
}

export function closeComparisonModal() {
  document.getElementById('comparisonModal')?.classList.remove('active');
}
