import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnimationQueue } from './useAnimationQueue';

describe('useAnimationQueue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide animation control functions', () => {
    const { result } = renderHook(() => useAnimationQueue());

    expect(result.current.startAnimation).toBeDefined();
    expect(result.current.endAnimation).toBeDefined();
    expect(result.current.cancelAnimation).toBeDefined();
    expect(result.current.getQueueStatus).toBeDefined();
    expect(result.current.animationId).toBeDefined();
  });

  it('should generate unique animation ID', () => {
    const { result: result1 } = renderHook(() => useAnimationQueue());
    const { result: result2 } = renderHook(() => useAnimationQueue());

    expect(result1.current.animationId).not.toBe(result2.current.animationId);
  });

  it('should use provided animation ID', () => {
    const customId = 'custom-animation-id';
    const { result } = renderHook(() => useAnimationQueue(customId));

    expect(result.current.animationId).toBe(customId);
  });

  it('should start animation immediately when under limit', () => {
    const { result } = renderHook(() => useAnimationQueue('test-anim-1'));
    const onStart = vi.fn();

    act(() => {
      const started = result.current.startAnimation(onStart);
      expect(started).toBe(true);
      expect(onStart).toHaveBeenCalled();
    });

    // Clean up
    act(() => {
      result.current.endAnimation();
    });
  });

  it('should track queue status', () => {
    const { result } = renderHook(() => useAnimationQueue('test-anim-2'));

    act(() => {
      const status = result.current.getQueueStatus();
      expect(status).toHaveProperty('active');
      expect(status).toHaveProperty('queued');
      expect(status).toHaveProperty('canStart');
    });
  });

  it('should end animation and release slot', () => {
    const { result } = renderHook(() => useAnimationQueue('test-anim-3'));
    const onStart = vi.fn();

    act(() => {
      result.current.startAnimation(onStart);
      result.current.endAnimation();
    });

    // After ending, should be able to start again
    act(() => {
      const started = result.current.startAnimation(onStart);
      expect(started).toBe(true);
    });

    // Clean up
    act(() => {
      result.current.endAnimation();
    });
  });
});
