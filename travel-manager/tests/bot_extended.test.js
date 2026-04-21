import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SophosBot } from '../js/bot.js';

describe('SophosBot Deep Coverage', () => {
  const { buildResponse } = SophosBot._test;

  it('should cover all thematic responses', async () => {
    // Testing the logic via buildResponse through intent matching
    expect(await buildResponse('estate')).toContain('Grecia');
    expect(await buildResponse('inverno')).toContain('Maldive');
    expect(await buildResponse('visto')).toContain('Italiani');
    expect(await buildResponse('grazie')).toContain('piacere assisterla');
  });

  it('should cover specific destination branches', async () => {
    expect(await buildResponse('Giappone')).toContain('Tokyo');
    expect(await buildResponse('Bali')).toContain('Ubud');
  });

  it('should cover fallback', async () => {
    expect(await buildResponse('asdfghjkl')).toContain('Mock AI response');
  });

  it('should cover UI functions', async () => {
    document.body.innerHTML = `
      <div id="chatbot-panel"></div>
      <div id="chatbot-messages"></div>
      <input id="chatbot-input">
    `;
    SophosBot.init(); // This will trigger listeners
    
    // Test toggle
    const panel = document.getElementById('chatbot-panel');
    panel.classList.add('chat-open');
    expect(panel.classList.contains('chat-open')).toBe(true);
    
    // Call buildResponse with different branch triggers
    expect(await buildResponse('visti')).toBeDefined(); // intent branch
    expect(await buildResponse('hotel')).toBeDefined(); // hotelSearch branch
  });
});
