/**
 * OdusIA Luxury Travel Curator Module (v. 4.0)
 * Architecture: Pure Conversational AI (Gemini 3 Flash)
 */
import { state } from './state.js';

export const AtlasCurator = (() => {
  
  function start() {
    state.curatorState.isActive = true;
    state.curatorState.history = [];
    return "Benvenuto nella **Curatela Esclusiva v. 4.0**. Sono il Suo Curatore personale. Mi dica, quale destinazione ha in mente o quale sogno desidera trasformare in realtà?";
  }

  async function handleInput(text) {
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
        body: JSON.stringify({ history: state.curatorState.history })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Errore di sistema');

      const aiHtml = data.html;

      // 3. Update History with Model Response
      state.curatorState.history.push({
        role: 'model',
        parts: [{ text: aiHtml }]
      });

      // 4. Wrap the response in a Luxury Container
      return `
        <div class="curator-report animate-fade ai-pure-mode">
          ${aiHtml}
          <div class="curator-controls" style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
             <p style="font-size: 0.8rem; color: var(--accent-travel); opacity: 0.7;">
               💎 <em>Intelligence Sinestetica V 4.0 | Alimentato da Gemini 3 Flash</em>
             </p>
          </div>
        </div>
      `;

    } catch (err) {
      console.error("AI Failure:", err);
      return `<div class="error-box" style="color: #ff4d4d; border: 1px solid #ff4d4d; padding: 1rem; border-radius: 8px;">
        <strong>Connessione AI interrotta:</strong> ${err.message}<br>
        <small>Mi scuso, stiamo riscontrando un'elevata richiesta di consultazioni. Riprovi tra un istante.</small>
      </div>`;
    }
  }

  return {
    start,
    handleInput
  };
})();
