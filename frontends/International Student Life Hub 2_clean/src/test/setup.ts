import '@testing-library/jest-dom';

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE: 'http://127.0.0.1:8000',
    VITE_WS_URL: 'ws://127.0.0.1:8080',
    DEV: true,
  },
  writable: true,
});

// Mock fetch
global.fetch = vi.fn();

// Mock WebSocket
global.WebSocket = vi.fn(() => ({
  close: vi.fn(),
  send: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: WebSocket.OPEN,
})) as any;

// Mock EventSource
global.EventSource = vi.fn(() => ({
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: EventSource.OPEN,
})) as any;

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
