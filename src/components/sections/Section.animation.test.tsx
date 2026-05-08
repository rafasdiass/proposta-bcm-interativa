import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section } from './Section';

// Mock the hooks
vi.mock('@/hooks', () => ({
  useReducedMotion: vi.fn(() => false),
  useAnimationQueue: vi.fn(() => ({
    startAnimation: vi.fn(cb => {
      cb();
      return true;
    }),
    endAnimation: vi.fn(),
    cancelAnimation: vi.fn(),
    getQueueStatus: vi.fn(() => ({ active: 0, queued: 0, canStart: true })),
    animationId: 'test-animation',
  })),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    section: vi.fn(({ children, ...props }) => (
      <section {...props}>{children}</section>
    )),
  },
}));

describe('Section - Animation Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render section with animation support', () => {
    render(
      <Section id="test-section" title="Test Section" variant="light">
        <div>Test Content</div>
      </Section>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render with correct variant styling', () => {
    const { container } = render(
      <Section id="test-section" title="Test Section" variant="dark">
        <div>Test Content</div>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('section-dark');
  });

  it('should render header when showHeader is true', () => {
    render(
      <Section
        id="test-section"
        title="Test Section"
        variant="light"
        showHeader={true}
      >
        <div>Test Content</div>
      </Section>
    );

    expect(screen.getByText('BCM · LaVita Code')).toBeInTheDocument();
  });

  it('should not render header when showHeader is false', () => {
    render(
      <Section
        id="test-section"
        title="Test Section"
        variant="light"
        showHeader={false}
      >
        <div>Test Content</div>
      </Section>
    );

    expect(screen.queryByText('BCM · LaVita Code')).not.toBeInTheDocument();
  });

  it('should render footer when showFooter is true', () => {
    render(
      <Section
        id="test-section"
        title="Test Section"
        variant="light"
        showFooter={true}
      >
        <div>Test Content</div>
      </Section>
    );

    expect(
      screen.getByText('Proposta de Parceria Estratégica · Confidencial')
    ).toBeInTheDocument();
  });

  it('should not render footer when showFooter is false', () => {
    render(
      <Section
        id="test-section"
        title="Test Section"
        variant="light"
        showFooter={false}
      >
        <div>Test Content</div>
      </Section>
    );

    expect(
      screen.queryByText('Proposta de Parceria Estratégica · Confidencial')
    ).not.toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Section
        id="test-section"
        title="Test Section"
        variant="light"
        className="custom-class"
      >
        <div>Test Content</div>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('should set aria-labelledby when showHeader is true', () => {
    const { container } = render(
      <Section
        id="test-section"
        title="Test Section"
        variant="light"
        showHeader={true}
      >
        <div>Test Content</div>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).toHaveAttribute('aria-labelledby', 'test-section-title');
  });
});
