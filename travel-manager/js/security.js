/**
 * OdusIA Security Module
 * Binary file validation using Magic Numbers (File Signatures)
 */

const SIGNATURES = {
  // PDF: %PDF-
  pdf: [0x25, 0x50, 0x44, 0x46],
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  // JPEG: FF D8 FF
  jpg: [0xFF, 0xD8, 0xFF],
  // OFFICE / ZIP: PK.. (50 4B 03 04)
  zip: [0x50, 0x4B, 0x03, 0x04]
};

/**
 * Validates a file by reading its first few bytes.
 * @param {File} file 
 * @returns {Promise<boolean>}
 */
export async function validateFileMagicNumber(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    // Read only the first 8 bytes for efficiency
    const blob = file.slice(0, 8);
    
    reader.onload = (e) => {
      const bytes = new Uint8Array(e.target.result);
      const hex = Array.from(bytes).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
      
      let matched = false;
      let matchedType = '';

      for (const [type, signature] of Object.entries(SIGNATURES)) {
        if (signature.every((byte, i) => bytes[i] === byte)) {
          matched = true;
          matchedType = type;
          break;
        }
      }

      if (!matched) {
        console.warn(`[SECURITY AUDIT] Blocked File: ${file.name}`);
        console.warn(`[SECURITY AUDIT] Size: ${file.size} bytes`);
        console.warn(`[SECURITY AUDIT] Detected Signature: ${hex}`);
        resolve(false);
      } else {
        console.info(`[SECURITY AUDIT] File Validated: ${file.name} (Type: ${matchedType})`);
        resolve(true);
      }
    };

    reader.onerror = () => {
      console.error(`[SECURITY AUDIT] Error reading file: ${file.name}`);
      resolve(false);
    };

    reader.readAsArrayBuffer(blob);
  });
}
