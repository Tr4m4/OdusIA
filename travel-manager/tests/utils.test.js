import { describe, it, expect } from 'vitest';
import { escapeHTML, formatCurrency, generateId, formatDate } from '../js/utils.js';

describe('Utils Module', () => {
  describe('escapeHTML', () => {
    it('should escape dangerous characters', () => {
      const input = '<script>alert("xss")</script> & "quote"';
      const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &quot;quote&quot;';
      expect(escapeHTML(input)).toBe(expected);
    });

    it('should return empty string for null or undefined', () => {
      expect(escapeHTML(null)).toBe('');
      expect(escapeHTML(undefined)).toBe('');
    });
  });

  describe('formatCurrency', () => {
    it('should format numbers to EUR currency', () => {
      // Flexible matching for locale differences
      const result100 = formatCurrency(100);
      expect(result100).toContain('100,00');
      expect(result100).toContain('€');
      
      const result1250 = formatCurrency(1250.5);
      expect(result1250).toContain('1250,50');
      expect(result1250).toContain('€');
    });
  });

  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const date = new Date('2026-04-18');
      expect(formatDate(date)).toBe('2026-04-18');
    });
  });

  describe('generateId', () => {
    it('should generate numeric IDs', () => {
      const id = generateId();
      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThan(0);
    });
  });
});
