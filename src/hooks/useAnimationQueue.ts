import { useRef, useCallback } from 'react';

/**
 * Maximum number of concurrent animations allowed
 * Requirements: 16.4
 */
const MAX_CONCURRENT_ANIMATIONS = 3;

/**
 * Global animation queue manager
 * Ensures we don't have too many animations running simultaneously
 */
class AnimationQueueManager {
  private activeAnimations = new Set<string>();
  private queue: Array<{ id: string; callback: () => void }> = [];

  /**
   * Request to start an animation
   * Returns true if animation can start immediately, false if queued
   */
  requestAnimation(id: string, callback: () => void): boolean {
    // If already active, don't add again
    if (this.activeAnimations.has(id)) {
      return true;
    }

    // If under limit, start immediately
    if (this.activeAnimations.size < MAX_CONCURRENT_ANIMATIONS) {
      this.activeAnimations.add(id);
      callback();
      return true;
    }

    // Otherwise, queue it
    this.queue.push({ id, callback });
    return false;
  }

  /**
   * Release an animation slot
   */
  releaseAnimation(id: string): void {
    this.activeAnimations.delete(id);

    // Process queue
    if (
      this.queue.length > 0 &&
      this.activeAnimations.size < MAX_CONCURRENT_ANIMATIONS
    ) {
      const next = this.queue.shift();
      if (next) {
        this.activeAnimations.add(next.id);
        next.callback();
      }
    }
  }

  /**
   * Cancel a queued animation
   */
  cancelAnimation(id: string): void {
    this.activeAnimations.delete(id);
    this.queue = this.queue.filter(item => item.id !== id);
  }

  /**
   * Get current queue status
   */
  getStatus() {
    return {
      active: this.activeAnimations.size,
      queued: this.queue.length,
      canStart: this.activeAnimations.size < MAX_CONCURRENT_ANIMATIONS,
    };
  }
}

// Global singleton instance
const globalAnimationQueue = new AnimationQueueManager();

/**
 * Hook to manage animation queue for performance
 *
 * Limits concurrent animations to prevent performance issues
 *
 * Requirements: 16.4
 */
export function useAnimationQueue(animationId?: string) {
  const idRef = useRef(
    animationId || `animation-${Math.random().toString(36).substr(2, 9)}`
  );
  const isActiveRef = useRef(false);

  const startAnimation = useCallback((onStart: () => void) => {
    const started = globalAnimationQueue.requestAnimation(idRef.current, () => {
      isActiveRef.current = true;
      onStart();
    });

    return started;
  }, []);

  const endAnimation = useCallback(() => {
    if (isActiveRef.current) {
      globalAnimationQueue.releaseAnimation(idRef.current);
      isActiveRef.current = false;
    }
  }, []);

  const cancelAnimation = useCallback(() => {
    globalAnimationQueue.cancelAnimation(idRef.current);
    isActiveRef.current = false;
  }, []);

  const getQueueStatus = useCallback(() => {
    return globalAnimationQueue.getStatus();
  }, []);

  return {
    startAnimation,
    endAnimation,
    cancelAnimation,
    getQueueStatus,
    animationId: idRef.current,
  };
}
