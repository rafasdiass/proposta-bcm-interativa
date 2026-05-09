import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import {
  mockMatchMedia,
  simulateMobileViewport,
  simulateTabletViewport,
  simulateDesktopViewport,
} from './test/test-utils';

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

describe('Integration: Proposal Page Navigation', () => {
  beforeEach(() => {
    mockMatchMedia(false);
    global.IntersectionObserver = MockIntersectionObserver;
    Element.prototype.scrollIntoView = vi.fn();
    window.location.hash = '';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts on the overview page and exposes the page navigation', () => {
    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: /paginas da proposta/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Visão Geral' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });

  it('navigates between proposal pages and updates the URL fragment', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Investimento' }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Investimento' })
      ).toHaveAttribute('aria-current', 'page');
    });
    expect(
      screen.getByText('Estrutura econômica, tranches e retorno.')
    ).toBeInTheDocument();
  });

  it('loads a valid page slug from the initial URL fragment', async () => {
    window.location.hash = '#produto';

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Produto' })).toHaveAttribute(
        'aria-current',
        'page'
      );
    });
    expect(
      screen.getByText('O que está sendo construído e por que é defensável.')
    ).toBeInTheDocument();
  });

  it('handles invalid URL fragments gracefully', () => {
    window.location.hash = '#invalid-section';

    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Visão Geral' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});

describe('Integration: Responsive Shell', () => {
  beforeEach(() => {
    mockMatchMedia(false);
    global.IntersectionObserver = MockIntersectionObserver;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders mobile layout with a page selector and sticky actions', () => {
    simulateMobileViewport();

    render(<App />);

    expect(
      screen.getByRole('combobox', { name: /selecionar pagina/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('complementary', { name: /ações principais/i })
    ).toBeInTheDocument();
  });

  it('renders tablet and desktop layouts without losing semantic order', () => {
    simulateTabletViewport();
    const { rerender } = render(<App />);

    const firstHeader = screen.getAllByRole('banner')[0];
    const main = screen.getByRole('main');
    expect(firstHeader.compareDocumentPosition(main)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    );

    simulateDesktopViewport();
    rerender(<App />);

    expect(
      screen.getByRole('navigation', { name: /paginas da proposta/i })
    ).toBeInTheDocument();
  });

  it('keeps primary action targets available', () => {
    render(<App />);

    expect(
      screen.getAllByRole('button', { name: /assinar intenção de parceria/i })
        .length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('button', { name: /baixar proposta em pdf/i }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole('button', { name: /agendar reunião/i }).length
    ).toBeGreaterThan(0);
  });
});
