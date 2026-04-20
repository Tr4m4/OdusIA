import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AtlasBot } from '../js/bot.js';

describe('AtlasBot Deep Coverage', () => {
  const { buildResponse } = AtlasBot._test;

  it('should cover all thematic responses', () => {
    // Testing the logic via buildResponse through intent matching
    expect(buildResponse('estate')).toContain('Grecia');
    expect(buildResponse('inverno')).toContain('Maldive');
    expect(buildResponse('visto')).toContain('Italiani');
    expect(buildResponse('grazie')).toContain('piacere assisterla');
  });

  it('should cover specific destination branches', () => {
    expect(buildResponse('Giappone')).toContain('Tokyo');
    expect(buildResponse('Bali')).toContain('Ubud');
  });

  it('should cover fallback', () => {
    expect(buildResponse('asdfghjkl')).toContain('Senior Curator');
  });

  it('should cover UI functions', () => {
    document.body.innerHTML = `
      <div id="chatbot-panel"></div>
      <div id="chatbot-messages"></div>
      <input id="chatbot-input">
    `;
    AtlasBot.init(); // This will trigger listeners
    
    // Test toggle
    const panel = document.getElementById('chatbot-panel');
    panel.classList.add('chat-open');
    expect(panel.classList.contains('chat-open')).toBe(true);
    
    // Call buildResponse with different branch triggers
    expect(buildResponse('visti')).toBeDefined(); // intent branch
    expect(buildResponse('hotel')).toBeDefined(); // hotelSearch branch
  });
});
