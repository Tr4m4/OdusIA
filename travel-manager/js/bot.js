/**
 * OdusIA Sophos Travel Expert Chatbot Module
 */
import { DESTINATIONS, INTENTS } from './constants.js';
import { escapeHTML } from './utils.js';
import { SophosCurator } from './curator.js';
import { state } from './state.js';

export const SophosBot = (() => {
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
      return `${g}. 👋 Sono <strong>Sophos</strong>, il Senior Curator di OdusIA.<br><br>
        La mia missione è orchestrare la tua prossima esperienza d'eccellenza. <strong>Qual è la tua destinazione d'elezione?</strong> 🌍`;
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

    // 🛡️ Discovery / Search Intents (Refined to prioritize AI Research)
    if (lower === 'hotel' || lower === 'spa' || lower.includes('cerca') || lower.includes('trova') || lower.includes('hotel in')) return { type: 'curator_trigger' };
    
    for (const rule of INTENTS) {
      if (rule.dest && rule.keywords.some(k => lower.includes(k))) return { type: 'destination', key: rule.dest };
      if (rule.intent && rule.keywords.some(k => lower.includes(k))) return { type: 'intent', key: rule.intent };
    }
    
    if (lower.includes('aiuto') || lower.includes('chi sei') || lower.includes('cosa fai')) return { type: 'intent', key: 'greeting' };
    return null;
  }
  async function buildResponse(text) {
    const match = matchIntent(text);

    // ── CURATOR MODE ──
    // Se il curatore è attivo, TUTTI i messaggi passano da lui (ECCETTO reset espliciti)
    if (state.curatorState.isActive) {
      if (!match || match.key !== 'reset') {
        return await SophosCurator.handleInput(text);
      }
    }

    // ── AI-FIRST AUTO-TRIGGER ──
    // Se l'intento è di ricerca o se la query è complessa, avviamo subito la Curatela 4.0
    if (match?.type === 'curator_trigger' || !match) {
      console.debug('💎 Sophos: Auto-triggering Curator 4.0 for query:', text);
      SophosCurator.start(true); // Silent start
      return await SophosCurator.handleInput(text);
    }

    // ── Standard Intent Matching (Only for clear shortcuts/greetings) ──
    if (match.key === 'curator_start') return SophosCurator.start();
    
    if (match.type === 'intent' && match.key === 'greeting') {
      return THEMATIC.greeting();
    }
    
    if (match.type === 'destination') {
      return buildDestinationResponse(match.key);
    }

    if (match.type === 'intent' && THEMATIC[match.key]) {
      return THEMATIC[match.key]();
    }

    // Ultima barriera: se arriviamo qui e non sappiamo cosa fare, comunque AI
    SophosCurator.start(true);
    return await SophosCurator.handleInput(text);
  }

  // ── UI ENGINE ──────────────────────────────────────────
  let isTyping = false;
  let currentAbortController = null;

  function init() {
    const trigger = document.getElementById('chatbot-trigger');
    const panel   = document.getElementById('chatbot-panel');
    const sendBtn  = document.getElementById('chatbot-send');
    const input    = document.getElementById('chatbot-input');
    const resetBtn = document.getElementById('chatbot-reset');
    const expandBtn = document.getElementById('chatbot-expand');

    if (!trigger || !panel) {
      console.warn('Sophos: Core UI elements missing.');
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
    header?.addEventListener('click', async (e) => {
      const btn = e.target.closest('.chatbot-action-btn');
      if (!btn) return;
      
      const action = btn.id;
      if (action === 'chatbot-close') toggleChat(false);
      else if (action === 'chatbot-expand') toggleExpand();
      else if (action === 'chatbot-popout') openPopout();
      else if (action === 'chatbot-reset') await resetChat();
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

    console.info('✅ SophosBot Hardened Initialization Complete.');
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
    window.open(window.location.pathname + '?popout=true', 'SophosPopout', 'width=520,height=750,resizable=yes');
  }

  function loadHistory() {
    const msgs = document.getElementById('chatbot-messages');
    if (!msgs) return;
    
    const history = JSON.parse(localStorage.getItem('sophos_chat_history') || '[]');
    if (history.length === 0) {
      renderWelcome();
    } else {
      history.forEach(m => addMessage(m.role, m.html, 0, false));
    }
  }

  function saveMessage(role, html) {
    const history = JSON.parse(localStorage.getItem('sophos_chat_history') || '[]');
    history.push({ role, html });
    localStorage.setItem('sophos_chat_history', JSON.stringify(history));
  }

  async function resetChat() {
    const confirmed = window.showLuxuryConfirm 
      ? await window.showLuxuryConfirm('Iniziare Nuova Conversazione?', 'La cronologia attuale con Sophos andrà persa. Continuare?', 'warning')
      : confirm('Sei sicuro di voler avviare una nuova conversazione? La cronologia attuale andrà persa.');

    if (confirmed) {
      localStorage.removeItem('sophos_chat_history');
      const msgs = document.getElementById('chatbot-messages');
      if (msgs) msgs.innerHTML = '';
      
      // Reset Curator State
      state.curatorState.isActive = false;
      state.curatorState.history = [];
      
      renderWelcome();
    }
  }

  function renderWelcome() {
    const msgs = document.getElementById('chatbot-messages');
    if (msgs && !msgs.querySelector('.chat-msg')) {
      // 🛡️ Force Curator 4.0 Start
      const welcomeMsg = SophosCurator.start();
      addMessage('bot', welcomeMsg, 600);
    }
  }

  function addMessage(role, html, delay = 0, shouldSave = true) {
    const msgs = document.getElementById('chatbot-messages');
    if (!msgs) return;
    
    const postMessage = () => {
      const div = document.createElement('div');
      const isBot = role === 'bot';
      let content = html;
      
      // 🛡️ Markdown Parsing for plain bot messages
      if (isBot && typeof marked !== 'undefined') {
        const cleaned = html.replace(/^```html\n?|^```markdown\n?|^```\n?|```$/gm, "").trim();
        // curator-report = already rendered HTML, skip second parse
        if (cleaned.includes('curator-report')) {
          content = cleaned;
        } else {
          content = marked.parse(cleaned);
        }
      }
      
      div.innerHTML = isBot
        ? `<div class="msg-avatar"><img src="assets/logo_full.png" class="bot-msg-logo" alt="Sophos"></div><div class="msg-bubble">${content}</div>`
        : `<div class="msg-bubble">${escapeHTML(content)}</div>`;
        
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
        <div class="typing-text">Sophos sta orchestrando</div>
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
        <button class="btn-cancel-request" onclick="window.abortSophosRequest()" title="Annulla richiesta">
          <i class="fa-solid fa-circle-stop"></i> Annulla
        </button>
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
    
    // 🛡️ Initialize AbortController for this request
    currentAbortController = new AbortController();
    
    let responseText;
    try {
      if (state.curatorState.isActive) {
        responseText = await SophosCurator.handleInput(text, currentAbortController.signal);
      } else {
        responseText = await buildResponse(text);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        responseText = null; // Handler already returns a message in curator.js
      } else {
        console.error('Sophos: Error building response:', err);
        responseText = `<div class="error-box">Non sono riuscito a contattare l'intelligence. Riprovi tra un istante.</div>`;
      }
    } finally {
      currentAbortController = null;
    }

    hideTypingIndicator();
    if (responseText) addMessage('bot', responseText);
    isTyping = false;
  }

  window.abortSophosRequest = () => {
    if (currentAbortController) {
      console.warn('💎 Sophos: User aborted request.');
      currentAbortController.abort();
    }
  };

  window.SophosBot = { 
    init,
    reset: resetChat,
    toggleChat,
    handleSend,
    matchIntent,
    _test: { buildResponse }
  };
  return window.SophosBot;
})();
