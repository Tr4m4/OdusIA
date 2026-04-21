import { describe, it, expect } from 'vitest';
import { SophosBot } from '../js/bot.js';

describe('SophosBot Logic', () => {
  const matchIntent = SophosBot.matchIntent;
  const buildResponse = SophosBot._test.buildResponse;

  describe('Intent Matching', () => {
    it('should match a destination (e.g., Japan)', () => {
      const match = matchIntent('Voglio andare in Giappone');
      expect(match).toEqual({ type: 'destination', key: 'giappone' });
    });

    it('should match a thematic intent (e.g., summer)', () => {
      const match = matchIntent('Consigli per l\'estate');
      expect(match).toEqual({ type: 'intent', key: 'estate' });
    });

    it('should match hotel/spa keywords', () => {
      const match = matchIntent('Cerco un hotel con spa');
      expect(match).toEqual({ type: 'curator_trigger' });
    });

    it('should return null for unknown input', () => {
      const match = matchIntent('blah blah');
      expect(match).toBeNull();
    });
  });

  describe('Response Generation', () => {
    it('should build a greeting response', async () => {
      const response = await buildResponse('ciao');
      expect(response).toContain('Sophos');
      expect(response).toContain('Senior Curator');
    });

    it('should return destination details', async () => {
      const response = await buildResponse('Giappone');
      expect(response).toContain('Giappone');
      expect(response).toContain('Budget medio');
    });

    it('should handle fallback for unknown intents', async () => {
      const response = await buildResponse('abcxyz');
      expect(response).toContain('Mock AI response'); // Using our setup.js mock
    });
  });
});
