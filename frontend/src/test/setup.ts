import '@testing-library/jest-dom'

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:5173',
    origin: 'http://localhost:5173',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
