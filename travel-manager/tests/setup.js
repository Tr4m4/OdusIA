import { vi } from 'vitest';

// Mock window and document if not provided by jsdom
if (typeof window === 'undefined') {
  global.window = {};
}

// Mock Fetch to prevent "Invalid URL" errors in Node/JSDOM
global.fetch = vi.fn((url) => {
  console.debug('[TEST MOCK] Fetch called for:', url);
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ 
      answer: "Mock AI response for " + url,
      hotels: [],
      status: "success"
    })
  });
});

// Mock window.confirm
global.confirm = vi.fn(() => true);
global.window.confirm = global.confirm;

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: vi.fn((key) => storage[key] || null),
  setItem: vi.fn((key, val) => storage[key] = val),
  removeItem: vi.fn((key) => delete storage[key]),
  clear: vi.fn(() => { for (const key in storage) delete storage[key]; })
};

// Mock marked (markdown parser)
global.marked = {
  parse: vi.fn((text) => text)
};

console.log('✅ Vitest Setup: Global Mocks Initialized');
