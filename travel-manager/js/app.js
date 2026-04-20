/**
 * OdusIA App Entry Point
 */
import { openDB, loadRepoData } from './storage.js';
import { state } from './state.js';
import { HOTEL_REPOSITORY } from './constants.js';
import { 
  renderDashboard, 
  renderUpcomingGrid, 
  renderHistory, 
  switchView,
  editBooking,
  previewAttachment,
  closePreviewModal,
  renderEditAttachments,
  renderPlanHotels,
  openModal,
  closeModal,
  openPlanTripModal,
  closePlanTripModal,
  changeWizardStep
} from './ui.js';
import { AtlasBot } from './bot.js';
import { 
  handleAddBooking, 
  handlePlanTrip, 
  handleFileSelection, 
  removeAttachment, 
  addHotelRow, 
  removeHotelRow, 
  updateHotelField,
  addHotelsToPlan,
  createTripAutomatically,
  handleSaveBooking,
  deleteBookingPrompt,
  archiveTrip,
  exportCurationToRepo,
  deleteHotel
} from './handlers.js';

// 🛡️ GLOBAL EXPORTS (Hardened: Assigned at the very top)
window.state = state;
window.HOTEL_REPOSITORY = HOTEL_REPOSITORY;
window.switchView = (view) => { console.log('➡️ Navigating to:', view); switchView(view); };
window.handleAddBooking = handleAddBooking;
window.handlePlanTrip = handlePlanTrip;
window.handleFileSelection = handleFileSelection;
window.removeAttachment = removeAttachment;
window.addHotelRow = addHotelRow;
window.removeHotelRow = removeHotelRow;
window.updateHotelField = updateHotelField;
window.addHotelsToPlan = addHotelsToPlan;
window.createTripAutomatically = createTripAutomatically;

window.openModal = openModal;
window.closeModal = closeModal;
window.openPlanTripModal = openPlanTripModal;
window.closePlanTripModal = closePlanTripModal;
window.editBooking = editBooking;
window.previewAttachment = previewAttachment;
window.closePreviewModal = closePreviewModal;
window.renderEditAttachments = renderEditAttachments;
window.renderPlanHotels = renderPlanHotels;

window.handleSaveBooking = handleSaveBooking;
window.archiveTrip = archiveTrip; 
window.changeWizardStep = changeWizardStep;
window.deleteBookingPrompt = deleteBookingPrompt;
window.exportCurationToRepo = exportCurationToRepo;
window.deleteHotel = deleteHotel;

document.addEventListener('DOMContentLoaded', async () => {
  console.info('🚀 OdusIA Initializing...');
  
  // 0. Hydrate Repository (Persistence ODUS-23 - Hardened Sync)
  const savedRepo = loadRepoData();
  if (savedRepo) {
    console.info('📥 Syncing Hotel Repository with latest Curator data...');
    // Create a map of existing hotel names per zone for fast lookup
    const existingHotels = new Map();
    savedRepo.forEach(zone => {
      zone.hotels.forEach(h => existingHotels.set(`${zone.zone}|${h.name}`, h));
    });

    // Merge new hotels or upgrade existing ones from constants.js
    HOTEL_REPOSITORY.forEach(constZone => {
      const targetZone = savedRepo.find(z => z.zone === constZone.zone);
      if (targetZone) {
        constZone.hotels.forEach(h => {
          const existing = existingHotels.get(`${constZone.zone}|${h.name}`);
          if (!existing) {
            console.log(`✨ New Hotel Found: ${h.name} (${constZone.zone})`);
            targetZone.hotels.push(h);
          } else if (!existing.details && h.details) {
            // ODUS-23: Smart upgrade for existing hotels without 'details'
            console.log(`💎 Upgrading Hotel Factsheet: ${h.name}`);
            existing.details = h.details;
          }
        });
      } else {
        // New zone entirely
        savedRepo.push(constZone);
      }
    });

    HOTEL_REPOSITORY.length = 0;
    HOTEL_REPOSITORY.push(...savedRepo);
  }

  // 1. Initialize Storage
  try {
    const database = await openDB();
    window.db = database;
    console.info('✅ Storage initialized.');
  } catch (err) {
    console.error('❌ Storage initialization failed:', err);
  }

  // 2. Initial Render
  state.subscribe(() => {
    renderDashboard();
    renderHistory();
    renderUpcomingGrid(document.querySelector('.filter-btn.active')?.dataset.filter || 'all');
  });

  // Push initial state to UI
  renderDashboard();
  renderHistory();
  renderUpcomingGrid('all');

  // Mobile Menu Binding
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      sidebar.classList.toggle('mobile-open');
    });
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 1024 && sidebar.classList.contains('mobile-open') && !sidebar.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }

  // 3. Set up High-Level Delegation (Global Reliability)
  document.addEventListener('click', (e) => {
    // 3a. Sidebar Navigation
    const navLink = e.target.closest('.nav-links li');
    if (navLink && navLink.dataset.view) {
      console.debug('🚀 Sidebar Navigation:', navLink.dataset.view);
      const view = navLink.dataset.view;
      if (typeof window.switchView === 'function') window.switchView(view);
      else switchView(view);
      return;
    }

    // 3b. Dashboard/Filter Stats
    const statCard = e.target.closest('.stat-card');
    if (statCard && statCard.dataset.filter) {
      if (typeof window.switchView === 'function') window.switchView('upcoming');
      else switchView('upcoming');
      setTimeout(() => renderUpcomingGrid(statCard.dataset.filter), 100);
      return;
    }

    // 3c. Filter Category Tabs
    const filterBtn = e.target.closest('.filter-btn');
    if (filterBtn && filterBtn.dataset.filter) {
      document.querySelectorAll('.filter-btn').forEach(f => f.classList.remove('active'));
      filterBtn.classList.add('active');
      renderUpcomingGrid(filterBtn.getAttribute('data-filter'));
    }
  });

  // 5. Initialize Chatbot (Sandboxed)
  try {
    AtlasBot.init();
  } catch (err) {
    console.error('🛡️ AtlasBot Initialization Failed (Non-Blocking):', err);
  }

  // 6. Set up Preview Listeners
  const previewCloseBtn = document.getElementById('closePreviewBtn');
  if (previewCloseBtn) previewCloseBtn.addEventListener('click', closePreviewModal);
  
  const previewModal = document.getElementById('attachmentPreviewModal');
  if (previewModal) {
    previewModal.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closePreviewModal();
    });
  }

  // 7. Logout Support (Hardened with Luxury UI)
  const logoutBtn = document.querySelector('.btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      // Direct reference to the exported function if possible, or use the global registered later
      if (typeof window.showLuxuryConfirm === 'function') {
        const confirmed = await window.showLuxuryConfirm(
          'Conferma Logout',
          'Sei sicuro di voler uscire dalla sessione odierna?',
          'fa-right-from-bracket'
        );
        if (confirmed) {
          window.location.reload(); 
        }
      } else if (confirm('Sei sicuro di voler uscire?')) {
        window.location.reload();
      }
    });
  }

  console.info('✅ OdusIA Ready.');

  // 🛡️ Global Interaction Debugger (Hardened)
  document.addEventListener('click', (e) => {
    const path = e.composedPath().map(el => el.tagName || el.id || el.className).join(' > ');
    console.debug(`🔍 Interaction: ${path} [X: ${e.clientX}, Y: ${e.clientY}]`);
    
    // Auto-fix if a modal-overlay is active but blocking (Safety Net)
    const activeOverlay = document.querySelector('.modal-overlay.active');
    if (activeOverlay && !e.target.closest('.modal-content')) {
        console.warn('🛡️ Interaction caught by overlay outside content - closing modal');
        // This is a safety measure if user clicks outside modal
        if (activeOverlay.id === 'luxuryConfirmModal') {
            // No automated close for confirm unless explicitly asked, but just log it
        }
    }
  }, true);
});
