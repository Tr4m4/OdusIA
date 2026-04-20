/**
 * OdusIA Atlas Travel Expert Chatbot Module
 */
import { DESTINATIONS, INTENTS } from './constants.js';
import { escapeHTML } from './utils.js';
import { AtlasCurator } from './curator.js';
import { state } from './state.js';

export const AtlasBot = (() => {
  // ── RESPONSE GENERATORS ────────────────────────────────
  function buildDestinationResponse(key) {
    const d = DESTINATIONS[key];
    if (!d) return null;
    return `
      <span class="emoji-lead">${d.emoji}</span> <strong>${d.flag}</strong><br><br>
      📅 <strong>Periodo migliore:</strong> ${d.best}<br>
      ⚠️ <strong>Evita:</strong> ${d.avoid}<br>
      💰 <strong>Budget medio:</strong> ${d.budget}<br>
      📋 <strong>Visto:</strong> ${d.visto}<br><br>
      <strong>✨ Top destinazioni:</strong>
      <ul>${d.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
      <strong>💡 Consigli pratici:</strong>
      <ul>${d.tips.map(t => `<li>${t}</li>`).join('')}</ul>
    `;
  }

  const THEMATIC = {
    estate: () => `☀️ <strong>Mete perfette per l'estate:</strong><br><br>
      🇬🇷 <strong>Grecia:</strong> Scegli maggio o settembre per prezzi migliori — le isole a luglio sono affollate<br>
      🇮🇩 <strong>Bali:</strong> Stagione secca perfetta (aprile-ottobre)<br>
      🇮🇸 <strong>Islanda:</strong> Estate = sole di mezzanotte e paesaggi mozzafiato<br><br>
      💡 <em>Vuoi dettagli su una di queste? Dimmi il nome!</em>`,

    inverno: () => `❄️ <strong>Mete per l'inverno:</strong><br><br>
      🇲🇻 <strong>Maldive:</strong> Novembre-Aprile è la stagione d'oro<br>
      🇹🇭 <strong>Thailandia:</strong> Clima perfetto, affollatissima ma splendida<br>
      🇦🇪 <strong>Dubai:</strong> Ottobre-Aprile, temperatura ideale (~25°C)<br><br>
      💡 <em>Stai pianificando qualcosa di specifico? Posso aiutarti!</em>`,

    visti: () => `📋 <strong>Guida Visti per Italiani:</strong><br><br>
      ✅ <strong>Senza visto:</strong> Europa Schengen, USA (ESTA), Giappone (90gg)<br>
      🟡 <strong>Visto all'arrivo:</strong> Bali/Indonesia (~€30), Maldive (gratis)<br><br>
      <strong>💡 Sempre verifica sul sito <em>viaggiaresicuri.mae.it</em> prima di partire!</strong>`,

    greeting: () => {
      const hour = new Date().getHours();
      const g = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';
      return `${g}. 👋 Sono **Atlas**, il Senior Curator di OdusIA.<br><br>
        La mia missione è orchestrare la tua prossima esperienza d'eccellenza. **Qual è la tua destinazione d'elezione?** 🌍`;
    },

    thanks: () => `È stato un piacere assisterla. Resto a disposizione per coordinare ogni dettaglio del Suo soggiorno.`
  };

  // ── MATCHING ENGINE ────────────────────────────────────
  function matchIntent(text) {
    const lower = typeof text === 'string' ? text.toLowerCase() : '';

    // 🛡️ High-Priority Specialized Actions
    if (lower.includes('esporta') || lower.includes('salva')) return { type: 'action', key: 'export' };
    if (lower.includes('nuova') && lower.includes('conversazione')) return { type: 'action', key: 'reset' };
    if (lower.includes('curatela') || lower.includes('luxury curator')) return { type: 'action', key: 'curator_start' };

    // 🛡️ Discovery / Search Intents (Refined to avoid blocking)
    if (lower === 'hotel' || lower === 'spa' || lower.startsWith('cerca hotel') || lower.startsWith('trova spa')) return { type: 'hotelSearch' };
    
    for (const rule of INTENTS) {
      if (rule.dest && rule.keywords.some(k => lower.includes(k))) return { type: 'destination', key: rule.dest };
      if (rule.intent && rule.keywords.some(k => lower.includes(k))) return { type: 'intent', key: rule.intent };
    }
    
    if (lower.includes('aiuto') || lower.includes('chi sei') || lower.includes('cosa fai')) return { type: 'intent', key: 'greeting' };
    return null;
  }
  function buildResponse(text) {
    const match = matchIntent(text);

    // ── CURATOR MODE ──
    // Se il curatore è attivo, TUTTI i messaggi passano da lui (ECCETTO reset espliciti)
    if (state.curatorState.isActive) {
      if (!match || match.key !== 'reset') {
        return AtlasCurator.handleInput(text);
      }
    }

    // ── Intent Matching logic (Destination, Help, Search) ──
    if (match) {
      if (match.key === 'curator_start') return AtlasCurator.start();
      
      if (match.type === 'intent' && match.key === 'greeting') {
        return "Sia il benvenuto. Desidera esplorare la nostra collezione di **Hotel & SPA** o preferisce avviare una **Curatela di Lusso** personalizzata?";
      }
      // ... more intents handled by standard templates if curator not active
    }

    // Default Fallback: Se non capisco l'intento e non siamo in curatela, suggerisco di iniziare
    return "Mi perdoni, non ho colto perfettamente. Preferisce consultare il catalogo o desidera che io **inizi una curatela** per Lei?";
  }

  // ── UI ENGINE ──────────────────────────────────────────
  let isTyping = false;

  function init() {
    const trigger = document.getElementById('chatbot-trigger');
    const panel   = document.getElementById('chatbot-panel');
    const sendBtn  = document.getElementById('chatbot-send');
    const input    = document.getElementById('chatbot-input');
    const resetBtn = document.getElementById('chatbot-reset');
    const expandBtn = document.getElementById('chatbot-expand');

    if (!trigger || !panel) {
      console.warn('Atlas: Core UI elements missing.');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const isPopout = urlParams.get('popout') === 'true';
    if (isPopout) {
      document.body.classList.add('chat-popout-mode');
      toggleChat(true);
    }

    trigger.addEventListener('click', () => toggleChat());
    
    // ── Robust Header Actions (Event Delegation) ──
    const header = panel.querySelector('.chatbot-header');
    header?.addEventListener('click', (e) => {
      const btn = e.target.closest('.chatbot-action-btn');
      if (!btn) return;
      
      const action = btn.id;
      if (action === 'chatbot-close') toggleChat(false);
      else if (action === 'chatbot-expand') toggleExpand();
      else if (action === 'chatbot-popout') openPopout();
      else if (action === 'chatbot-reset') resetChat();
    });
    
    sendBtn?.addEventListener('click', () => handleSend());
    input?.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        handleSend(); 
      } 
    });
    
    // ── Global Link Interceptor (Force New Tab) ──
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer?.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && !link.href.startsWith('javascript:')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // ── Bind Suggestions ──
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        if (query) handleSend(query);
      });
    });

    console.info('✅ AtlasBot Hardened Initialization Complete.');
    loadHistory();
  }

  function toggleChat(forceState) {
    const panel = document.getElementById('chatbot-panel');
    const isOpen = forceState !== undefined ? forceState : !panel.classList.contains('chat-open');
    panel.classList.toggle('chat-open', isOpen);
  }

  function toggleExpand() {
    const panel = document.getElementById('chatbot-panel');
    const expandBtn = document.getElementById('chatbot-expand');
    const isExpanded = panel.classList.toggle('chat-expanded');
    
    if (expandBtn) {
      expandBtn.querySelector('i').className = isExpanded ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
    }
  }

  function openPopout() {
    toggleChat(false);
    window.open(window.location.pathname + '?popout=true', 'AtlasPopout', 'width=520,height=750,resizable=yes');
  }

  function loadHistory() {
    const msgs = document.getElementById('chatbot-messages');
    if (!msgs) return;
    
    const history = JSON.parse(localStorage.getItem('atlas_chat_history') || '[]');
    if (history.length === 0) {
      renderWelcome();
    } else {
      history.forEach(m => addMessage(m.role, m.html, 0, false));
    }
  }

  function saveMessage(role, html) {
    const history = JSON.parse(localStorage.getItem('atlas_chat_history') || '[]');
    history.push({ role, html });
    localStorage.setItem('atlas_chat_history', JSON.stringify(history));
  }

  function resetChat() {
    if (confirm('Sei sicuro di voler avviare una nuova conversazione? La cronologia attuale andrà persa.')) {
      localStorage.removeItem('atlas_chat_history');
      const msgs = document.getElementById('chatbot-messages');
      if (msgs) msgs.innerHTML = '';
      
      // Reset Curator State
      state.curatorState.isActive = false;
      state.curatorState.currentStep = 0;
      state.curatorState.inputs = { location: '', spa: '', price: '', focus: '' };
      
      renderWelcome();
    }
  }

  function renderWelcome() {
    const msgs = document.getElementById('chatbot-messages');
    if (msgs && !msgs.querySelector('.chat-msg')) {
      addMessage('bot', THEMATIC.greeting(), 600);
    }
  }

  function addMessage(role, html, delay = 0, shouldSave = true) {
    const msgs = document.getElementById('chatbot-messages');
    if (!msgs) return;
    
    const postMessage = () => {
      const div = document.createElement('div');
      div.className = `chat-msg ${role}`;
      div.innerHTML = role === 'bot'
        ? `<div class="msg-avatar"><img src="assets/logo_full.png" class="bot-msg-logo" alt="Atlas"></div><div class="msg-bubble">${html}</div>`
        : `<div class="msg-bubble">${escapeHTML(html)}</div>`;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      
      if (shouldSave) saveMessage(role, html);
    };

    if (delay > 0) {
      setTimeout(postMessage, delay);
    } else {
      postMessage();
    }
  }

  // ── TYPING INDICATOR ──
  function showTypingIndicator() {
    const msgs = document.getElementById('chatbot-messages');
    if (!msgs || msgs.querySelector('.typing-indicator')) return;

    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.innerHTML = `
      <div class="typing-bubble">
        <div class="loading-dragon-container">
          <img src="assets/icon_dragon_gold.png" class="loading-dragon" alt="Drago OdusIA">
          <img src="assets/icon_dragon_fire.png" class="dragon-fire" alt="Fuoco">
        </div>
        <div class="typing-text">Atlas sta orchestrando</div>
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTypingIndicator() {
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) indicator.remove();
  }

  async function handleSend(forcedText = null) {
    const input = document.getElementById('chatbot-input');
    const text = forcedText || input.value.trim();
    if (!text || isTyping) return;

    if (!forcedText) input.value = '';
    addMessage('user', text);

    isTyping = true;
    showTypingIndicator();
    
    let response;
    try {
      if (state.curatorState.isActive) {
        response = await AtlasCurator.handleInput(text, matchIntent);
      } else {
        response = buildResponse(text);
      }
    } catch (err) {
      response = `<div class="error-box">Errore di comunicazione. Riprova.</div>`;
    } finally {
      hideTypingIndicator();
    }

    addMessage('bot', response, 200);
    isTyping = false;
  }

  window.AtlasBot = { 
    init,
    reset: resetChat,
    toggleChat,
    handleSend,
    matchIntent,
    _test: { buildResponse }
  };
  return window.AtlasBot;
})();
