import { describe, it, expect } from 'vitest';
import { AtlasBot } from '../js/bot.js';

describe('AtlasBot Logic', () => {
  const matchIntent = AtlasBot.matchIntent;
  const buildResponse = AtlasBot._test.buildResponse;

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
      expect(match).toEqual({ type: 'hotelSearch' });
    });

    it('should return null for unknown input', () => {
      const match = matchIntent('blah blah');
      expect(match).toBeNull();
    });
  });

  describe('Response Generation', () => {
    it('should build a greeting response', () => {
      const response = buildResponse('ciao');
      expect(response).toContain('Atlas');
      expect(response).toContain('Senior Curator');
    });

    it('should return destination details', () => {
      const response = buildResponse('Giappone');
      expect(response).toContain('Giappone');
      expect(response).toContain('Budget medio');
    });

    it('should handle fallback for unknown intents', () => {
      const response = buildResponse('abcxyz');
      expect(response).toContain('Senior Curator');
    });
  });
});
