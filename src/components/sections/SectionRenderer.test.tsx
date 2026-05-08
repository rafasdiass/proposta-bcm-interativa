import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavigationProvider } from '@/contexts';
import { SectionRenderer } from './SectionRenderer';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
  },
}));

// Mock react-error-boundary
vi.mock('react-error-boundary', () => ({
  ErrorBoundary: ({ children }: any) => children,
}));

// Mock the section components to avoid lazy loading issues in tests
vi.mock('@/data/sections', () => ({
  sectionConfigs: [
    {
      id: 'test-section-1',
      slug: 'test-section-1',
      title: 'Test Section 1',
      variant: 'light',
      component: () => <div>Test Section 1 Content</div>,
      showHeader: true,
      showFooter: true,
      order: 0,
    },
    {
      id: 'test-section-2',
      slug: 'test-section-2',
      title: 'Test Section 2',
      variant: 'dark',
      component: () => <div>Test Section 2 Content</div>,
      showHeader: true,
      showFooter: true,
      order: 1,
    },
  ],
}));

describe('SectionRenderer Component', () => {
  it('renders all sections in landing mode', () => {
    render(
      <NavigationProvider>
        <SectionRenderer />
      </NavigationProvider>
    );

    expect(screen.getByText('Test Section 1')).toBeInTheDocument();
    expect(screen.getByText('Test Section 2')).toBeInTheDocument();
    expect(screen.getByText('Test Section 1 Content')).toBeInTheDocument();
    expect(screen.getByText('Test Section 2 Content')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <NavigationProvider>
        <SectionRenderer />
      </NavigationProvider>
    );

    const mainContainer = screen.getByRole('main');
    expect(mainContainer).toHaveAttribute(
      'aria-label',
      'Proposta BCM - Conteúdo Principal'
    );
  });

  it('renders sections with correct IDs', () => {
    render(
      <NavigationProvider>
        <SectionRenderer />
      </NavigationProvider>
    );

    expect(document.getElementById('test-section-1')).toBeInTheDocument();
    expect(document.getElementById('test-section-2')).toBeInTheDocument();
  });
});
