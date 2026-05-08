import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { LazyImage, LazyBackgroundImage } from './LazyImage';

/**
 * LazyImage Component Tests
 *
 * Tests lazy loading functionality with explicit dimensions
 * Requirements: 14.5 - Lazy loading with explicit dimensions
 */

describe('LazyImage', () => {
  it('should render with explicit dimensions', () => {
    render(
      <LazyImage
        src="/test-image.png"
        alt="Test image"
        width={800}
        height={600}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('width', '800');
    expect(img).toHaveAttribute('height', '600');
  });

  it('should have loading="lazy" attribute', () => {
    render(
      <LazyImage
        src="/test-image.png"
        alt="Test image"
        width={800}
        height={600}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('should have decoding="async" attribute', () => {
    render(
      <LazyImage
        src="/test-image.png"
        alt="Test image"
        width={800}
        height={600}
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('should show placeholder while loading', () => {
    const { container } = render(
      <LazyImage
        src="/test-image.png"
        alt="Test image"
        width={800}
        height={600}
      />
    );

    // Placeholder should be present initially
    const placeholder = container.querySelector('.animate-pulse');
    expect(placeholder).toBeInTheDocument();
  });

  it('should call onLoad callback when image loads', async () => {
    const onLoad = vi.fn();

    render(
      <LazyImage
        src="/test-image.png"
        alt="Test image"
        width={800}
        height={600}
        onLoad={onLoad}
      />
    );

    const img = screen.getByAltText('Test image');

    // Simulate image load
    img.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onError callback when image fails to load', async () => {
    const onError = vi.fn();

    render(
      <LazyImage
        src="/invalid-image.png"
        alt="Test image"
        width={800}
        height={600}
        onError={onError}
      />
    );

    const img = screen.getByAltText('Test image');

    // Simulate image error
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  it('should show error state when image fails to load', async () => {
    render(
      <LazyImage
        src="/invalid-image.png"
        alt="Test image"
        width={800}
        height={600}
      />
    );

    const img = screen.getByAltText('Test image');

    // Simulate image error
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      const errorState = screen.getByRole('img', {
        name: /Failed to load: Test image/i,
      });
      expect(errorState).toBeInTheDocument();
    });
  });

  it('should apply custom className', () => {
    const { container } = render(
      <LazyImage
        src="/test-image.png"
        alt="Test image"
        width={800}
        height={600}
        className="custom-class"
      />
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should maintain aspect ratio', () => {
    const { container } = render(
      <LazyImage
        src="/test-image.png"
        alt="Test image"
        width={800}
        height={600}
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.aspectRatio).toBe('800 / 600');
  });
});

describe('LazyBackgroundImage', () => {
  it('should render children', () => {
    render(
      <LazyBackgroundImage src="/test-bg.png">
        <div>Test content</div>
      </LazyBackgroundImage>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <LazyBackgroundImage src="/test-bg.png" className="custom-bg-class">
        <div>Test content</div>
      </LazyBackgroundImage>
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-bg-class');
  });

  it('should have role="img" when alt is provided', () => {
    render(
      <LazyBackgroundImage src="/test-bg.png" alt="Background image">
        <div>Test content</div>
      </LazyBackgroundImage>
    );

    const wrapper = screen.getByRole('img');
    expect(wrapper).toHaveAttribute('aria-label', 'Background image');
  });

  it('should not have role="img" when alt is not provided', () => {
    const { container } = render(
      <LazyBackgroundImage src="/test-bg.png">
        <div>Test content</div>
      </LazyBackgroundImage>
    );

    const wrapper = container.firstChild;
    expect(wrapper).not.toHaveAttribute('role');
  });
});
