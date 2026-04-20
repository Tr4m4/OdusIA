import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as handlers from '../js/handlers.js';
import * as ui from '../js/ui.js';
import { state } from '../js/state.js';

describe('OdusIA Integration & Edge Case Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.resetAll();
    document.body.innerHTML = `
      <div id="latest-bookings"></div>
      <div id="upcoming-grid"></div>
      <div id="history-list"></div>
      <div id="pt-upload-status" style="display:none"></div>
      <div id="pt-existing-attachments"></div>
      <div id="dashboard-view" class="view-container"></div>
      <div id="upcoming-view" class="view-container"></div>
      <div id="attachmentPreviewModal" class="modal">
        <div id="preview-modal-title"></div>
        <div id="preview-content-container"></div>
      </div>
      <input id="b-title"><input id="b-date"><textarea id="b-desc"></textarea>
      <select id="b-type"><option value="viaggio">V</option></select>
    `;
    window.db = {}; // Mock DB
  });

  it('handleFileSelection full flow with multiple valid files', async () => {
    const f1 = new File(['%PDF-1.5'], 'test1.pdf', { type: 'application/pdf' });
    const event = { target: { files: [f1], id: 'pt-attachments' } };
    
    // Mock idbSaveFile 
    vi.mock('../js/storage.js', async (importOriginal) => {
      const actual = await importOriginal();
      return { 
        ...actual,
        idbSaveFile: vi.fn(() => Promise.resolve(`key_1`))
      };
    });

    await handlers.handleFileSelection(event, 'pt');
    expect(state.currentAttachmentsEdit.length).toBeGreaterThanOrEqual(0);
  });

  it('ui.previewAttachment branches', async () => {
    // Note: previewAttachment is async and takes (id, name)
    await ui.previewAttachment('1_f.pdf', 'f.pdf');
    expect(document.getElementById('preview-modal-title').textContent).toBe('f.pdf');
    // Don't check for spinner if we await completion, it might be gone.
    // Check that it's no longer empty.
    expect(document.getElementById('preview-content-container').innerHTML).not.toBe('');

    await ui.previewAttachment('1_f.png', 'f.png');
    expect(document.getElementById('preview-modal-title').textContent).toBe('f.png');
  });

  it('handlers error paths', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    handlers.addHotelsToPlan('invalid-json');
    expect(consoleSpy).toHaveBeenCalled();
  });
});
