import { render, screen } from '@testing-library/react';
import type React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { NavigationProvider } from '@/contexts';
import { SectionRenderer } from './SectionRenderer';

vi.mock('framer-motion', () => ({
  motion: {
    section: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => (
      <section {...props}>{children}</section>
    ),
  },
}));

vi.mock('react-error-boundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/data/pages', () => ({
  proposalPages: [
    {
      id: 'test-page',
      slug: 'test-page',
      title: 'Test Page',
      subtitle: 'Test page subtitle',
      variant: 'light',
      sectionIds: ['test-section-1', 'test-section-2'],
    },
  ],
  getPageSections: () => [
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
  findPageIndexBySlug: (slug: string) => (slug === 'test-page' ? 0 : null),
}));

describe('SectionRenderer Component', () => {
  it('renders the active proposal page and its sections', () => {
    render(
      <NavigationProvider>
        <SectionRenderer />
      </NavigationProvider>
    );

    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByText('Test page subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test Section 1 Content')).toBeInTheDocument();
    expect(screen.getByText('Test Section 2 Content')).toBeInTheDocument();
  });

  it('renders the page section with the current page id', () => {
    render(
      <NavigationProvider>
        <SectionRenderer />
      </NavigationProvider>
    );

    expect(document.getElementById('test-page')).toBeInTheDocument();
    expect(document.getElementById('test-section-1')).toBeInTheDocument();
    expect(document.getElementById('test-section-2')).toBeInTheDocument();
  });
});
