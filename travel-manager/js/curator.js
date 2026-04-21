/**
 * OdusIA Luxury Travel Curator Module (v. 4.0)
 * Architecture: Pure Conversational AI (Gemini 3 Flash)
 */
import { state } from './state.js';

export const SophosCurator = (() => {
  
  function start(isSilent = false) {
    state.curatorState.isActive = true;
    state.curatorState.history = [];
    if (isSilent) return "";
    return "Benvenuto nella **Curatela Esclusiva v. 4.0**. Sono **Sophos**, il Suo Curatore personale. Mi dica, quale destinazione ha in mente o quale sogno desidera trasformare in realtà?";
  }

  async function handleInput(text, signal = null) {
    const lower = text.toLowerCase().trim();
    if (['annulla', 'esci', 'reset', 'stop'].includes(lower)) {
      state.resetCuratorState();
      return "Consultazione terminata. Sono a Sua disposizione per altre richieste.";
    }

    // 1. Update History with User Message
    state.curatorState.history.push({
      role: 'user',
      parts: [{ text: text }]
    });

    try {
      // 2. Call the AI Gateway
      const response = await fetch('/api/ai-curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: state.curatorState.history }),
        signal: signal
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Errore di sistema');

      const aiMarkdown = data.text || "";
      const modelUsed = data.model || "GEMINI 3 FLASH";

      // 3. Robust Cleanup: strip backtick code blocks
      let cleanedMarkdown = aiMarkdown
        .replace(/^```html\n?|^```markdown\n?|^```\n?|```$/gm, "")
        .trim();

      // 4. ⚡ Process UI markers BEFORE marked.parse
      // Flexible [[IMPORT]] handler: supports historical 8 fields, 12 fields, or new 13 fields
      cleanedMarkdown = cleanedMarkdown.replace(/\[\[IMPORT:(.*?)\]\]/g, (match, fullContent) => {
        const p = fullContent.split('|').map(s => s.trim());
        
        let name, link, price, dist, spa_desc, spa_size, pools_in, pools_out, city, zone, desc, highlights, rating;
        
        if (p.length >= 13) {
          // New 13-field format
          [name, link, price, dist, spa_desc, spa_size, pools_in, pools_out, city, zone, desc, highlights, rating] = p;
        } else if (p.length >= 12) {
          // 12-field format
          [name, link, price, dist, spa_desc, spa_size, pools_in, pools_out, city, zone, desc, highlights] = p;
          rating = "9.0";
        } else {
          // Legacy 8-field format (fallback)
          [name, link, price, dist, spa_desc, city, zone, desc] = p;
          spa_size = "-"; pools_in = 0; pools_out = 0; highlights = "Luxury Stay;Exclusive Location";
          rating = "8.5";
        }

        return `<button class="btn-cattura" onclick="window.autoImportHotel(this)" `+
          `data-name="${name || ''}" data-link="${link || '#'}" data-price="${price || '-'}" data-distance="${dist || '-'}" `+
          `data-spa="${spa_desc || '-'}" data-spa-size="${spa_size || '-'}" `+
          `data-pools-in="${pools_in || 0}" data-pools-out="${pools_out || 0}" `+
          `data-location="${city || ''}" data-zone="${zone || ''}" data-desc="${desc || ''}" data-highlights="${highlights || ''}" `+
          `data-rating="${rating || '9.0'}" `+
          `><i class="fa-solid fa-plus-circle"></i> CATTURA</button>`;
      });

      // [[ARCHIVE]] → Salva Report CTA
      cleanedMarkdown = cleanedMarkdown.replace(/\[\[ARCHIVE\]\]/g, () => {
        return `<div class="archive-action"><button class="btn-primary" onclick="window.saveCuratelaToArchive(this)">SALVA REPORT NELL'ARCHIVIO</button></div>`;
      });

      // 5. Render: marked handles both markdown AND passes HTML through (v9 default)
      const renderedHtml = typeof marked !== 'undefined'
        ? marked.parse(cleanedMarkdown)
        : cleanedMarkdown;

      // 6. Wrap in Luxury Container
      const finalPayload = `<div class="curator-report animate-fade">
  ${renderedHtml}
  <div class="curator-controls">
    <p>📜 <em>OdusIA Archive Integrity V 4.0 | Alimentato da ${modelUsed}</em></p>
  </div>
</div>`;

      // 7. Update History
      state.curatorState.history.push({
        role: 'model',
        parts: [{ text: finalPayload }]
      });

      return finalPayload;

    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn("AI Request Aborted by User");
        return "⚠️ **Operazione annullata su Sua richiesta.** Posso aiutarLa con qualcos'altro?";
      }
      console.error("AI Failure:", err);
      return `<div class="error-box" style="color: #ff4d4d; border: 2px solid #ff4d4d; padding: 1.5rem; border-radius: 12px; background: rgba(255,0,0,0.05); margin: 1rem 0;">
        <div style="font-weight: bold; font-size: 1.1rem; margin-bottom: 0.5rem;">🚨 INTELLIGENCE INTERROTTA</div>
        <div style="font-family: monospace; background: rgba(0,0,0,0.3); padding: 0.8rem; border-radius: 4px; margin-bottom: 0.8rem;">
          ${err.message}
        </div>
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">
          Possibili cause: Quota giornaliera esaurita per tutti i modelli o rallentamento dei server Google. Riprova tra 60 secondi.
        </p>
      </div>`;
    }
  }

  return {
    start,
    handleInput
  };
})();
