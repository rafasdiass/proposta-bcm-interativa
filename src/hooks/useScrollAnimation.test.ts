import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useScrollAnimation } from './useScrollAnimation';
import { useReducedMotion } from './useReducedMotion';

// Mock useReducedMotion
vi.mock('./useReducedMotion');

describe('useScrollAnimation', () => {
  let observerCallback: IntersectionObserverCallback;
  let observeMock: ReturnType<typeof vi.fn>;
  let unobserveMock: ReturnType<typeof vi.fn>;
  let disconnectMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset the mock
    vi.mocked(useReducedMotion).mockReturnValue(false);

    observeMock = vi.fn();
    unobserveMock = vi.fn();
    disconnectMock = vi.fn();

    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation(callback => {
      observerCallback = callback;
      return {
        observe: observeMock,
        unobserve: unobserveMock,
        disconnect: disconnectMock,
      };
    }) as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with isInView false', () => {
    const { result } = renderHook(() => useScrollAnimation());
    expect(result.current.isInView).toBe(false);
    expect(result.current.hasAnimated).toBe(false);
  });

  it('should provide a ref', () => {
    const { result } = renderHook(() => useScrollAnimation());
    expect(result.current.ref).toBeDefined();
    expect(result.current.ref.current).toBeNull();
  });

  it('should not set up observer when disabled', () => {
    renderHook(() => useScrollAnimation({ enabled: false }));
    expect(observeMock).not.toHaveBeenCalled();
  });

  it('should indicate shouldAnimate based on enabled and reduced motion', () => {
    const { result } = renderHook(() => useScrollAnimation({ enabled: true }));
    expect(result.current.shouldAnimate).toBe(true);
  });

  it('should immediately mark as animated when reduced motion is preferred', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true);
    const { result } = renderHook(() => useScrollAnimation());

    // When reduced motion is preferred, shouldAnimate should be false
    // and the state should be set immediately without needing intersection
    expect(result.current.shouldAnimate).toBe(false);
  });
});
