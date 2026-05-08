import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Section } from './Section';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
  },
}));

describe('Section Component', () => {
  it('renders with basic props', () => {
    render(
      <Section id="test-section" title="Test Section" variant="light">
        <div>Test content</div>
      </Section>
    );

    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders without header when showHeader is false', () => {
    render(
      <Section
        id="test-section"
        title="Test Section"
        variant="light"
        showHeader={false}
      >
        <div>Test content</div>
      </Section>
    );

    expect(screen.queryByText('Test Section')).not.toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders without footer when showFooter is false', () => {
    render(
      <Section
        id="test-section"
        title="Test Section"
        variant="light"
        showFooter={false}
      >
        <div>Test content</div>
      </Section>
    );

    expect(
      screen.queryByText('Proposta de Parceria Estratégica · Confidencial')
    ).not.toBeInTheDocument();
  });

  it('applies correct variant styling', () => {
    const { rerender } = render(
      <Section id="test-section" title="Test Section" variant="dark">
        <div>Test content</div>
      </Section>
    );

    const section = screen.getByRole('region');
    expect(section).toHaveClass('section-dark');

    rerender(
      <Section id="test-section" title="Test Section" variant="teal">
        <div>Test content</div>
      </Section>
    );

    expect(section).toHaveClass('section-teal');
  });

  it('applies custom className', () => {
    render(
      <Section
        id="test-section"
        title="Test Section"
        variant="light"
        className="custom-class"
      >
        <div>Test content</div>
      </Section>
    );

    const section = screen.getByRole('region');
    expect(section).toHaveClass('custom-class');
  });

  it('handles accessibility attributes', () => {
    render(
      <Section
        id="test-section"
        title="Test Section"
        variant="light"
        tabIndex={0}
        aria-hidden={false}
      >
        <div>Test content</div>
      </Section>
    );

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('tabIndex', '0');
    expect(section).toHaveAttribute('aria-hidden', 'false');
  });
});
