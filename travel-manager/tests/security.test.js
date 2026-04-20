import { describe, it, expect, vi } from 'vitest';
import { validateFileMagicNumber } from '../js/security.js';

describe('Security Module (Magic Numbers)', () => {
  // Mock File and FileReader for environment compatibility
  const createMockFile = (name, bytes) => {
    const blob = new Blob([new Uint8Array(bytes)]);
    return new File([blob], name);
  };

  it('should validate a correct PDF file', async () => {
    const pdfBytes = [0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34]; // %PDF-1.4
    const file = createMockFile('test.pdf', pdfBytes);
    
    const isValid = await validateFileMagicNumber(file);
    expect(isValid).toBe(true);
  });

  it('should validate a correct PNG file', async () => {
    const pngBytes = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    const file = createMockFile('image.png', pngBytes);
    
    const isValid = await validateFileMagicNumber(file);
    expect(isValid).toBe(true);
  });

  it('should validate a correct ZIP/Office file', async () => {
    const zipBytes = [0x50, 0x4B, 0x03, 0x04];
    const file = createMockFile('doc.docx', zipBytes);
    
    const isValid = await validateFileMagicNumber(file);
    expect(isValid).toBe(true);
  });

  it('should block a malicious/faked file', async () => {
    // Malicious text file renamed to .pdf
    const textBytes = new TextEncoder().encode('I am a sneaky script');
    const file = createMockFile('malicious.pdf', textBytes);
    
    const isValid = await validateFileMagicNumber(file);
    expect(isValid).toBe(false);
  });

  it('should block an unknown file type', async () => {
    const randomBytes = [0x00, 0x00, 0x00, 0x00];
    const file = createMockFile('unknown.bin', randomBytes);
    
    const isValid = await validateFileMagicNumber(file);
    expect(isValid).toBe(false);
  });
});
