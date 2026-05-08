import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  prefersReducedMotion,
  getConnectionSpeed,
  isSlowConnection,
  shouldLoadHighQualityImages,
  prefetchResource,
  preloadResource,
} from './performance';

/**
 * Performance Utilities Tests
 *
 * Tests performance monitoring and optimization utilities
 * Requirements: 14.4, 14.5 - Performance optimization
 */

describe('Performance Utilities', () => {
  describe('prefersReducedMotion', () => {
    it('should return boolean value', () => {
      const result = prefersReducedMotion();
      expect(typeof result).toBe('boolean');
    });

    it('should check for prefers-reduced-motion media query', () => {
      const matchMediaSpy = vi.spyOn(window, 'matchMedia');

      prefersReducedMotion();

      expect(matchMediaSpy).toHaveBeenCalledWith(
        '(prefers-reduced-motion: reduce)'
      );
    });
  });

  describe('getConnectionSpeed', () => {
    it('should return connection speed string', () => {
      const speed = getConnectionSpeed();
      expect(typeof speed).toBe('string');
    });

    it('should return "unknown" when connection API is not available', () => {
      const originalConnection = (
        navigator as Navigator & { connection?: unknown }
      ).connection;
      delete (navigator as Navigator & { connection?: unknown }).connection;

      const speed = getConnectionSpeed();
      expect(speed).toBe('unknown');

      // Restore
      (navigator as Navigator & { connection?: unknown }).connection =
        originalConnection;
    });
  });

  describe('isSlowConnection', () => {
    it('should return boolean value', () => {
      const result = isSlowConnection();
      expect(typeof result).toBe('boolean');
    });

    it('should return false for unknown connection', () => {
      const originalConnection = (
        navigator as Navigator & { connection?: unknown }
      ).connection;
      delete (navigator as Navigator & { connection?: unknown }).connection;

      const result = isSlowConnection();
      expect(result).toBe(false);

      // Restore
      (navigator as Navigator & { connection?: unknown }).connection =
        originalConnection;
    });
  });

  describe('shouldLoadHighQualityImages', () => {
    it('should return boolean value', () => {
      const result = shouldLoadHighQualityImages();
      expect(typeof result).toBe('boolean');
    });

    it('should return true for unknown connection (safe default)', () => {
      const originalConnection = (
        navigator as Navigator & { connection?: unknown }
      ).connection;
      delete (navigator as Navigator & { connection?: unknown }).connection;

      const result = shouldLoadHighQualityImages();
      expect(result).toBe(true);

      // Restore
      (navigator as Navigator & { connection?: unknown }).connection =
        originalConnection;
    });
  });

  describe('prefetchResource', () => {
    beforeEach(() => {
      // Clear any existing prefetch links
      document.head
        .querySelectorAll('link[rel="prefetch"]')
        .forEach(link => link.remove());
    });

    afterEach(() => {
      // Clean up
      document.head
        .querySelectorAll('link[rel="prefetch"]')
        .forEach(link => link.remove());
    });

    it('should add prefetch link to document head', () => {
      prefetchResource('/test-resource.js', 'script');

      const link = document.head.querySelector(
        'link[rel="prefetch"][href="/test-resource.js"]'
      ) as HTMLLinkElement;
      expect(link).toBeInTheDocument();
      expect(link.as).toBe('script');
    });

    it('should default to "fetch" as type', () => {
      prefetchResource('/test-resource.json');

      const link = document.head.querySelector(
        'link[rel="prefetch"][href="/test-resource.json"]'
      ) as HTMLLinkElement;
      expect(link.as).toBe('fetch');
    });
  });

  describe('preloadResource', () => {
    beforeEach(() => {
      // Clear any existing preload links
      document.head
        .querySelectorAll('link[rel="preload"]')
        .forEach(link => link.remove());
    });

    afterEach(() => {
      // Clean up
      document.head
        .querySelectorAll('link[rel="preload"]')
        .forEach(link => link.remove());
    });

    it('should add preload link to document head', () => {
      preloadResource('/critical-resource.js', 'script');

      const link = document.head.querySelector(
        'link[rel="preload"][href="/critical-resource.js"]'
      ) as HTMLLinkElement;
      expect(link).toBeInTheDocument();
      expect(link.as).toBe('script');
    });

    it('should add type attribute when provided', () => {
      preloadResource('/font.woff2', 'font', 'font/woff2');

      const link = document.head.querySelector(
        'link[rel="preload"][href="/font.woff2"]'
      ) as HTMLLinkElement;
      expect(link.type).toBe('font/woff2');
    });

    it('should not add type attribute when not provided', () => {
      preloadResource('/style.css', 'style');

      const link = document.head.querySelector(
        'link[rel="preload"][href="/style.css"]'
      ) as HTMLLinkElement;
      expect(link.type).toBe('');
    });
  });
});
