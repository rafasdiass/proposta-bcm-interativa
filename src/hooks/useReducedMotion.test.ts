import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReducedMotion } from './useReducedMotion';

describe('useReducedMotion', () => {
  let matchMediaMock: {
    matches: boolean;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
    addListener: ReturnType<typeof vi.fn>;
    removeListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    matchMediaMock = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
    };

    window.matchMedia = vi.fn().mockImplementation(() => matchMediaMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return false when prefers-reduced-motion is not set', () => {
    matchMediaMock.matches = false;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('should return true when prefers-reduced-motion is set', () => {
    matchMediaMock.matches = true;
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('should set up event listener on mount', () => {
    renderHook(() => useReducedMotion());
    expect(matchMediaMock.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should clean up event listener on unmount', () => {
    const { unmount } = renderHook(() => useReducedMotion());
    unmount();
    expect(matchMediaMock.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should use legacy addListener if addEventListener is not available', () => {
    const legacyMatchMedia = {
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    };

    window.matchMedia = vi.fn().mockImplementation(() => legacyMatchMedia);

    const { unmount } = renderHook(() => useReducedMotion());

    expect(legacyMatchMedia.addListener).toHaveBeenCalledWith(
      expect.any(Function)
    );

    unmount();

    expect(legacyMatchMedia.removeListener).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });
});
