/**
 * Basic test to ensure reduced motion path works correctly
 * Run with: npm test -- motion.test.ts
 */

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('Motion Controls', () => {
  test('MOTION_DISABLED should be true when DEBUG_MOTION is off', () => {
    process.env.NEXT_PUBLIC_DEBUG_MOTION = 'off';
    
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    const { MOTION_DISABLED } = require('../hooks/useReducedMotion');
    expect(MOTION_DISABLED).toBe(true);
  });

  test('MOTION_DISABLED should be false when DEBUG_MOTION is not set and prefers-reduced-motion is false', () => {
    delete process.env.NEXT_PUBLIC_DEBUG_MOTION;
    process.env.NEXT_PUBLIC_ANIMATIONS_ENABLED = 'true';
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    const { MOTION_DISABLED } = require('../hooks/useReducedMotion');
    expect(MOTION_DISABLED).toBe(false);
  });
});