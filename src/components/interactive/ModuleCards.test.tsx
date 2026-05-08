/**
 * Unit tests for ModuleCards component
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModuleCards, modules } from './ModuleCards';

describe('ModuleCards', () => {
  describe('Rendering', () => {
    it('should render all 12 module cards', () => {
      render(<ModuleCards />);

      // Check that all 12 modules are rendered
      expect(screen.getByText('PSRF-BCM')).toBeInTheDocument();
      expect(screen.getByText('PSFA-BCM')).toBeInTheDocument();
      expect(screen.getByText('EPS-PCA')).toBeInTheDocument();
      expect(screen.getByText('Kernel')).toBeInTheDocument();
      expect(screen.getByText('PEI Digital')).toBeInTheDocument();
      expect(screen.getByText('Minha Voz')).toBeInTheDocument();
      expect(screen.getByText('Rotinas')).toBeInTheDocument();
      expect(screen.getByText('32 Jogos')).toBeInTheDocument();
      expect(screen.getByText('Visão 360')).toBeInTheDocument();
      expect(screen.getByText('Relatórios')).toBeInTheDocument();
      expect(screen.getByText('Acesso Progressivo')).toBeInTheDocument();
      expect(screen.getByText('Stack SaaS')).toBeInTheDocument();
    });

    it('should render module numbers', () => {
      render(<ModuleCards />);

      // Check that module numbers are rendered
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });

    it('should render module descriptions', () => {
      render(<ModuleCards />);

      // Check that descriptions are rendered (at least one)
      // Note: Description appears twice (preview + expanded content)
      const descriptions = screen.getAllByText(
        /Triagem de repertório funcional/i
      );
      expect(descriptions.length).toBeGreaterThan(0);
    });
  });

  describe('Expansion behavior', () => {
    it('should start with all cards collapsed by default', () => {
      render(<ModuleCards />);

      // All cards should have aria-expanded="false"
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should expand a card when clicked', () => {
      render(<ModuleCards />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });
      expect(psrfButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(psrfButton);

      expect(psrfButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should collapse an expanded card when clicked again', () => {
      render(<ModuleCards />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });

      // Expand
      fireEvent.click(psrfButton);
      expect(psrfButton).toHaveAttribute('aria-expanded', 'true');

      // Collapse
      fireEvent.click(psrfButton);
      expect(psrfButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should allow multiple cards to be expanded simultaneously', () => {
      render(<ModuleCards />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });
      const kernelButton = screen.getByRole('button', { name: /04.*Kernel/i });

      fireEvent.click(psrfButton);
      fireEvent.click(kernelButton);

      expect(psrfButton).toHaveAttribute('aria-expanded', 'true');
      expect(kernelButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should respect initialExpanded prop', () => {
      render(<ModuleCards initialExpanded={['psrf-bcm', 'kernel']} />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });
      const kernelButton = screen.getByRole('button', { name: /04.*Kernel/i });
      const psfaButton = screen.getByRole('button', { name: /02.*PSFA-BCM/i });

      expect(psrfButton).toHaveAttribute('aria-expanded', 'true');
      expect(kernelButton).toHaveAttribute('aria-expanded', 'true');
      expect(psfaButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Keyboard navigation', () => {
    it('should expand card on Enter key', () => {
      render(<ModuleCards />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });
      expect(psrfButton).toHaveAttribute('aria-expanded', 'false');

      psrfButton.focus();
      fireEvent.keyDown(psrfButton, { key: 'Enter' });

      expect(psrfButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should expand card on Space key', () => {
      render(<ModuleCards />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });
      expect(psrfButton).toHaveAttribute('aria-expanded', 'false');

      psrfButton.focus();
      fireEvent.keyDown(psrfButton, { key: ' ' });

      expect(psrfButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should collapse card on Enter key when expanded', () => {
      render(<ModuleCards />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });

      // Expand
      fireEvent.keyDown(psrfButton, { key: 'Enter' });
      expect(psrfButton).toHaveAttribute('aria-expanded', 'true');

      // Collapse
      fireEvent.keyDown(psrfButton, { key: 'Enter' });
      expect(psrfButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should not trigger on other keys', () => {
      render(<ModuleCards />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });
      expect(psrfButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.keyDown(psrfButton, { key: 'a' });
      fireEvent.keyDown(psrfButton, { key: 'Escape' });
      fireEvent.keyDown(psrfButton, { key: 'Tab' });

      expect(psrfButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ModuleCards />);

      const buttons = screen.getAllByRole('button');

      buttons.forEach((button, index) => {
        const module = modules[index];
        expect(button).toHaveAttribute('aria-expanded');
        expect(button).toHaveAttribute(
          'aria-controls',
          `module-content-${module.id}`
        );
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should have proper aria-hidden on content', () => {
      const { container } = render(<ModuleCards />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });
      const contentDiv = container.querySelector('#module-content-psrf-bcm');

      expect(contentDiv).toHaveAttribute('aria-hidden', 'true');

      fireEvent.click(psrfButton);

      expect(contentDiv).toHaveAttribute('aria-hidden', 'false');
    });

    it('should be keyboard focusable', () => {
      render(<ModuleCards />);

      const buttons = screen.getAllByRole('button');

      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Variant styles', () => {
    it('should apply correct variant classes', () => {
      const { container } = render(<ModuleCards />);

      // Check that variant-specific border classes are applied
      const cards = container.querySelectorAll('[class*="border-t-"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid toggling', () => {
      render(<ModuleCards />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });

      // Rapid clicks
      fireEvent.click(psrfButton);
      fireEvent.click(psrfButton);
      fireEvent.click(psrfButton);
      fireEvent.click(psrfButton);

      // Should end up collapsed (even number of clicks)
      expect(psrfButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should handle empty initialExpanded array', () => {
      render(<ModuleCards initialExpanded={[]} />);

      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should handle invalid module IDs in initialExpanded', () => {
      render(<ModuleCards initialExpanded={['invalid-id', 'psrf-bcm']} />);

      const psrfButton = screen.getByRole('button', { name: /01.*PSRF-BCM/i });
      expect(psrfButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
