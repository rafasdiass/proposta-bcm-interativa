import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StickyCTA } from './StickyCTA';
import { NavigationProvider } from '../../contexts';

// Mock the useNavigation hook
vi.mock('../../contexts', async () => {
  const actual = await vi.importActual('../../contexts');
  return {
    ...actual,
    useNavigation: vi.fn(() => ({
      state: {
        mode: 'landing',
        currentSection: 0,
        totalSections: 22,
        isTransitioning: false,
      },
      actions: {
        setMode: vi.fn(),
        goToSection: vi.fn(),
        nextSection: vi.fn(),
        previousSection: vi.fn(),
        updateProgress: vi.fn(),
      },
    })),
  };
});

// Helper to render with NavigationProvider
const renderWithProvider = (ui: React.ReactElement) => {
  return render(<NavigationProvider>{ui}</NavigationProvider>);
};

describe('StickyCTA', () => {
  beforeEach(() => {
    // Mock window.open
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Desktop View', () => {
    beforeEach(() => {
      // Mock window.matchMedia for desktop
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(min-width: 640px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    });

    it('renders all three primary actions on desktop', () => {
      renderWithProvider(<StickyCTA />);

      // Both desktop and mobile versions exist in DOM, use getAllByRole
      const intentButtons = screen.getAllByRole('button', {
        name: /assinar intenção/i,
      });
      expect(intentButtons.length).toBeGreaterThan(0);

      expect(
        screen.getByRole('button', { name: /baixar proposta em pdf/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /agendar reunião/i })
      ).toBeInTheDocument();
    });

    it('has proper ARIA labels for accessibility', () => {
      renderWithProvider(<StickyCTA />);

      const region = screen.getByRole('region', {
        name: /ações principais da proposta/i,
      });
      expect(region).toBeInTheDocument();

      const intentButtons = screen.getAllByRole('button', {
        name: /assinar intenção de parceria/i,
      });
      expect(intentButtons[0]).toHaveAttribute('aria-label');
    });

    it('opens intent form modal when "Assinar Intenção" is clicked', async () => {
      renderWithProvider(<StickyCTA />);

      const intentButtons = screen.getAllByRole('button', {
        name: /assinar intenção de parceria/i,
      });
      // Click the desktop version (first one)
      fireEvent.click(intentButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('triggers PDF download when "Baixar PDF" is clicked', () => {
      renderWithProvider(<StickyCTA />);

      const downloadButton = screen.getByRole('button', {
        name: /baixar proposta em pdf/i,
      });

      // Mock document.createElement and appendChild
      const mockLink = {
        href: '',
        download: '',
        target: '',
        rel: '',
        click: vi.fn(),
      };
      const createElementSpy = vi
        .spyOn(document, 'createElement')
        .mockReturnValue(mockLink as any);
      const appendChildSpy = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(() => mockLink as any);
      const removeChildSpy = vi
        .spyOn(document.body, 'removeChild')
        .mockImplementation(() => mockLink as any);

      fireEvent.click(downloadButton);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockLink.click).toHaveBeenCalled();
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    it('opens scheduling link in new tab when "Agendar Reunião" is clicked', () => {
      const schedulingUrl = 'https://calendly.com/example';
      renderWithProvider(<StickyCTA schedulingUrl={schedulingUrl} />);

      const scheduleButton = screen.getByRole('button', {
        name: /agendar reunião/i,
      });
      fireEvent.click(scheduleButton);

      expect(window.open).toHaveBeenCalledWith(
        schedulingUrl,
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('closes intent form modal when clicking outside', async () => {
      renderWithProvider(<StickyCTA />);

      // Open modal
      const intentButtons = screen.getAllByRole('button', {
        name: /assinar intenção de parceria/i,
      });
      fireEvent.click(intentButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click on backdrop
      const backdrop = screen.getByRole('dialog');
      fireEvent.click(backdrop);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('does not close modal when clicking inside form', async () => {
      renderWithProvider(<StickyCTA />);

      // Open modal
      const intentButtons = screen.getAllByRole('button', {
        name: /assinar intenção de parceria/i,
      });
      fireEvent.click(intentButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click inside the form (on the white container)
      const formContainer = screen
        .getByRole('dialog')
        .querySelector('.max-w-2xl');
      if (formContainer) {
        fireEvent.click(formContainer);
      }

      // Modal should still be open
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Mobile View', () => {
    beforeEach(() => {
      // Mock window.matchMedia for mobile
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(max-width: 639px)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });
    });

    it('shows compact view with menu button on mobile', () => {
      renderWithProvider(<StickyCTA />);

      // Primary action should be visible (both desktop and mobile versions exist)
      const intentButtons = screen.getAllByRole('button', {
        name: /assinar intenção de parceria/i,
      });
      expect(intentButtons.length).toBeGreaterThan(0);

      // Menu button should be visible
      expect(
        screen.getByRole('button', { name: /abrir menu de ações/i })
      ).toBeInTheDocument();
    });

    it('expands menu when menu button is clicked', () => {
      renderWithProvider(<StickyCTA />);

      const menuButton = screen.getByRole('button', {
        name: /abrir menu de ações/i,
      });
      fireEvent.click(menuButton);

      // Check if expanded menu is visible
      expect(
        screen.getByRole('menu', { name: /menu de ações adicionais/i })
      ).toBeInTheDocument();

      // Check if additional actions are visible
      expect(
        screen.getByRole('menuitem', { name: /baixar proposta em pdf/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('menuitem', { name: /agendar reunião/i })
      ).toBeInTheDocument();
    });

    it('collapses menu when menu button is clicked again', () => {
      renderWithProvider(<StickyCTA />);

      const menuButton = screen.getByRole('button', {
        name: /abrir menu de ações/i,
      });

      // Open menu
      fireEvent.click(menuButton);
      expect(
        screen.getByRole('menu', { name: /menu de ações adicionais/i })
      ).toBeInTheDocument();

      // Close menu
      const closeButton = screen.getByRole('button', {
        name: /fechar menu/i,
      });
      fireEvent.click(closeButton);

      expect(
        screen.queryByRole('menu', { name: /menu de ações adicionais/i })
      ).not.toBeInTheDocument();
    });

    it('closes mobile menu after action is triggered', () => {
      renderWithProvider(<StickyCTA />);

      // Open menu
      const menuButton = screen.getByRole('button', {
        name: /abrir menu de ações/i,
      });
      fireEvent.click(menuButton);

      // Click on download action
      const downloadButton = screen.getByRole('menuitem', {
        name: /baixar proposta em pdf/i,
      });

      // Mock document methods
      const mockLink = {
        href: '',
        download: '',
        target: '',
        rel: '',
        click: vi.fn(),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(
        () => mockLink as any
      );
      vi.spyOn(document.body, 'removeChild').mockImplementation(
        () => mockLink as any
      );

      fireEvent.click(downloadButton);

      // Menu should be closed
      expect(
        screen.queryByRole('menu', { name: /menu de ações adicionais/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Contrast Compliance', () => {
    it('applies proper button styles for WCAG AA compliance', () => {
      renderWithProvider(<StickyCTA />);

      const primaryButtons = screen.getAllByRole('button', {
        name: /assinar intenção de parceria/i,
      });
      const outlineButton = screen.getByRole('button', {
        name: /baixar proposta em pdf/i,
      });
      const secondaryButton = screen.getByRole('button', {
        name: /agendar reunião/i,
      });

      // Check that buttons have appropriate classes (check first primary button)
      expect(primaryButtons[0]).toHaveClass('btn-primary');
      expect(outlineButton).toHaveClass('btn-outline');
      expect(secondaryButton).toHaveClass('btn-secondary');
    });
  });

  describe('Custom Props', () => {
    it('uses custom PDF URL when provided', () => {
      const customPdfUrl = '/custom-proposal.pdf';
      renderWithProvider(<StickyCTA pdfUrl={customPdfUrl} />);

      const downloadButton = screen.getByRole('button', {
        name: /baixar proposta em pdf/i,
      });

      const mockLink = {
        href: '',
        download: '',
        target: '',
        rel: '',
        click: vi.fn(),
      };
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(
        () => mockLink as any
      );
      vi.spyOn(document.body, 'removeChild').mockImplementation(
        () => mockLink as any
      );

      fireEvent.click(downloadButton);

      expect(mockLink.href).toBe(customPdfUrl);
    });

    it('uses custom scheduling URL when provided', () => {
      const customSchedulingUrl = 'https://custom-calendar.com';
      renderWithProvider(<StickyCTA schedulingUrl={customSchedulingUrl} />);

      const scheduleButton = screen.getByRole('button', {
        name: /agendar reunião/i,
      });
      fireEvent.click(scheduleButton);

      expect(window.open).toHaveBeenCalledWith(
        customSchedulingUrl,
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('applies custom className', () => {
      const customClass = 'custom-sticky-cta';
      const { container } = renderWithProvider(
        <StickyCTA className={customClass} />
      );

      const stickyBar = container.querySelector(`.${customClass}`);
      expect(stickyBar).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('falls back to opening PDF in new tab on download error', () => {
      renderWithProvider(<StickyCTA />);

      const downloadButton = screen.getByRole('button', {
        name: /baixar proposta em pdf/i,
      });

      // Mock createElement to throw error
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('Download failed');
      });

      fireEvent.click(downloadButton);

      // Should fall back to window.open
      expect(window.open).toHaveBeenCalled();
    });
  });

  describe('Keyboard Accessibility', () => {
    it('all buttons are keyboard accessible', () => {
      renderWithProvider(<StickyCTA />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('modal has proper aria attributes', async () => {
      renderWithProvider(<StickyCTA />);

      const intentButtons = screen.getAllByRole('button', {
        name: /assinar intenção de parceria/i,
      });
      fireEvent.click(intentButtons[0]);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby', 'intent-form-title');
      });
    });
  });
});
