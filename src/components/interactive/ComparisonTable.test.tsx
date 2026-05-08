/**
 * Unit tests for ComparisonTable component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComparisonTable, defaultComparisonData } from './ComparisonTable';

// Mock the useReducedMotion hook before imports
vi.mock('../../hooks/useReducedMotion');

describe('ComparisonTable', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset the mock to return false (motion enabled) by default
    const { useReducedMotion } = await import('../../hooks/useReducedMotion');
    vi.mocked(useReducedMotion).mockReturnValue(false);
  });

  describe('Rendering', () => {
    it('should render both columns with correct headers', () => {
      render(<ComparisonTable />);

      expect(screen.getByText('Se o Gradual entra agora')).toBeInTheDocument();
      expect(screen.getByText('Se o Gradual espera')).toBeInTheDocument();
    });

    it('should render all enter now items', () => {
      render(<ComparisonTable />);

      defaultComparisonData.enterNow.forEach(item => {
        expect(screen.getByText(item.text)).toBeInTheDocument();
      });
    });

    it('should render all wait items', () => {
      render(<ComparisonTable />);

      defaultComparisonData.wait.forEach(item => {
        expect(screen.getByText(item.text)).toBeInTheDocument();
      });
    });

    it('should render animation control button by default', () => {
      render(<ComparisonTable />);

      expect(
        screen.getByRole('button', { name: /animar/i })
      ).toBeInTheDocument();
    });

    it('should not render animation control when showAnimationControl is false', () => {
      render(<ComparisonTable showAnimationControl={false} />);

      expect(
        screen.queryByRole('button', { name: /animar/i })
      ).not.toBeInTheDocument();
    });

    it('should render with custom data', () => {
      const customData = {
        enterNow: [{ id: 'custom-1', text: 'Custom benefit 1' }],
        wait: [{ id: 'custom-2', text: 'Custom risk 1' }],
      };

      render(<ComparisonTable data={customData} />);

      expect(screen.getByText('Custom benefit 1')).toBeInTheDocument();
      expect(screen.getByText('Custom risk 1')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ComparisonTable className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Animation', () => {
    it('should start animation when button is clicked', async () => {
      const user = userEvent.setup();
      render(<ComparisonTable />);

      const button = screen.getByRole('button', { name: /animar/i });
      await user.click(button);

      expect(button).toHaveTextContent('Animando...');
      expect(button).toBeDisabled();
    });

    it('should show animation button with correct initial text', () => {
      render(<ComparisonTable />);

      const button = screen.getByRole('button', { name: /animar/i });
      expect(button).toHaveTextContent('Animar comparação');
    });
  });

  describe('Reduced Motion', () => {
    it('should show all items immediately when reduced motion is preferred', async () => {
      const { useReducedMotion } = await import('../../hooks/useReducedMotion');
      vi.mocked(useReducedMotion).mockReturnValue(true);

      render(<ComparisonTable />);

      // All items should be visible immediately
      const firstEnterItem = screen
        .getByText(defaultComparisonData.enterNow[0].text)
        .closest('li');
      const firstWaitItem = screen
        .getByText(defaultComparisonData.wait[0].text)
        .closest('li');

      expect(firstEnterItem).toHaveClass('opacity-100');
      expect(firstWaitItem).toHaveClass('opacity-100');
    });

    it('should not show animation button when reduced motion is preferred', async () => {
      const { useReducedMotion } = await import('../../hooks/useReducedMotion');
      vi.mocked(useReducedMotion).mockReturnValue(true);

      render(<ComparisonTable />);

      const button = screen.queryByRole('button', { name: /animar/i });
      expect(button).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure with lists', () => {
      render(<ComparisonTable />);

      const lists = screen.getAllByRole('list');
      expect(lists).toHaveLength(2);
    });

    it('should have accessible button with aria-label', () => {
      render(<ComparisonTable />);

      const button = screen.getByRole('button', { name: 'Animar comparação' });
      expect(button).toHaveAttribute('aria-label', 'Animar comparação');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have screen reader status region', () => {
      render(<ComparisonTable />);

      const status = screen.getByRole('status');
      expect(status).toBeInTheDocument();
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveAttribute('aria-atomic', 'true');
    });

    it('should have proper icon aria-hidden attributes', () => {
      const { container } = render(<ComparisonTable />);

      const icons = container.querySelectorAll('svg[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Visual Balance', () => {
    it('should render equal number of items in both columns by default', () => {
      render(<ComparisonTable />);

      expect(defaultComparisonData.enterNow.length).toBe(
        defaultComparisonData.wait.length
      );
    });

    it('should handle unequal column lengths gracefully', () => {
      const unequalData = {
        enterNow: [
          { id: '1', text: 'Benefit 1' },
          { id: '2', text: 'Benefit 2' },
        ],
        wait: [{ id: '3', text: 'Risk 1' }],
      };

      render(<ComparisonTable data={unequalData} />);

      expect(screen.getByText('Benefit 1')).toBeInTheDocument();
      expect(screen.getByText('Benefit 2')).toBeInTheDocument();
      expect(screen.getByText('Risk 1')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data gracefully', () => {
      const emptyData = {
        enterNow: [],
        wait: [],
      };

      render(<ComparisonTable data={emptyData} />);

      expect(screen.getByText('Se o Gradual entra agora')).toBeInTheDocument();
      expect(screen.getByText('Se o Gradual espera')).toBeInTheDocument();
    });

    it('should prevent multiple simultaneous animations', async () => {
      const user = userEvent.setup();
      render(<ComparisonTable />);

      const button = screen.getByRole('button', { name: /animar/i });

      await user.click(button);
      expect(button).toBeDisabled();

      // Button should remain disabled while animating
      expect(button).toBeDisabled();
    });
  });

  describe('Props', () => {
    it('should accept custom animation delay', () => {
      const { container } = render(<ComparisonTable animationDelay={500} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render without animation control when prop is false', () => {
      render(<ComparisonTable showAnimationControl={false} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
