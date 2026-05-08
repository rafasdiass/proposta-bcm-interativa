/**
 * Unit tests for ObjectionAccordion component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ObjectionAccordion, objections } from './ObjectionAccordion';

describe('ObjectionAccordion', () => {
  describe('Rendering', () => {
    it('should render all 6 objection items', () => {
      render(<ObjectionAccordion />);

      objections.forEach(objection => {
        expect(screen.getByText(objection.question)).toBeInTheDocument();
      });
    });

    it('should render with custom className', () => {
      const { container } = render(
        <ObjectionAccordion className="custom-class" />
      );
      const accordion = container.querySelector('.custom-class');
      expect(accordion).toBeInTheDocument();
    });

    it('should have proper ARIA region label', () => {
      render(<ObjectionAccordion />);
      expect(
        screen.getByRole('region', { name: 'Objeções respondidas' })
      ).toBeInTheDocument();
    });
  });

  describe('Single-item expansion behavior', () => {
    it('should start with no items expanded by default', () => {
      render(<ObjectionAccordion />);

      objections.forEach(objection => {
        const button = screen.getByRole('button', {
          name: new RegExp(objection.question),
        });
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });

    it('should expand an item when clicked', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      fireEvent.click(firstButton);

      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText(objections[0].answer)).toBeVisible();
    });

    it('should collapse an expanded item when clicked again', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });

      // Expand
      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');

      // Collapse
      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should only allow one item expanded at a time', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      const secondButton = screen.getByRole('button', {
        name: new RegExp(objections[1].question),
      });

      // Expand first item
      fireEvent.click(firstButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      expect(secondButton).toHaveAttribute('aria-expanded', 'false');

      // Expand second item (should collapse first)
      fireEvent.click(secondButton);
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
      expect(secondButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('should support initialExpanded prop', () => {
      render(<ObjectionAccordion initialExpanded={objections[2].id} />);

      const thirdButton = screen.getByRole('button', {
        name: new RegExp(objections[2].question),
      });
      expect(thirdButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText(objections[2].answer)).toBeVisible();
    });
  });

  describe('Keyboard navigation (WAI-ARIA Accordion pattern)', () => {
    it('should toggle item with Enter key', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      firstButton.focus();

      fireEvent.keyDown(firstButton, { key: 'Enter' });
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');

      fireEvent.keyDown(firstButton, { key: 'Enter' });
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should toggle item with Space key', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      firstButton.focus();

      fireEvent.keyDown(firstButton, { key: ' ' });
      expect(firstButton).toHaveAttribute('aria-expanded', 'true');

      fireEvent.keyDown(firstButton, { key: ' ' });
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should move focus to next item with ArrowDown', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      const secondButton = screen.getByRole('button', {
        name: new RegExp(objections[1].question),
      });

      firstButton.focus();
      fireEvent.keyDown(firstButton, { key: 'ArrowDown' });

      expect(document.activeElement).toBe(secondButton);
    });

    it('should move focus to previous item with ArrowUp', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      const secondButton = screen.getByRole('button', {
        name: new RegExp(objections[1].question),
      });

      secondButton.focus();
      fireEvent.keyDown(secondButton, { key: 'ArrowUp' });

      expect(document.activeElement).toBe(firstButton);
    });

    it('should wrap focus from last to first item with ArrowDown', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      const lastButton = screen.getByRole('button', {
        name: new RegExp(objections[objections.length - 1].question),
      });

      lastButton.focus();
      fireEvent.keyDown(lastButton, { key: 'ArrowDown' });

      expect(document.activeElement).toBe(firstButton);
    });

    it('should wrap focus from first to last item with ArrowUp', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      const lastButton = screen.getByRole('button', {
        name: new RegExp(objections[objections.length - 1].question),
      });

      firstButton.focus();
      fireEvent.keyDown(firstButton, { key: 'ArrowUp' });

      expect(document.activeElement).toBe(lastButton);
    });

    it('should move focus to first item with Home key', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      const thirdButton = screen.getByRole('button', {
        name: new RegExp(objections[2].question),
      });

      thirdButton.focus();
      fireEvent.keyDown(thirdButton, { key: 'Home' });

      expect(document.activeElement).toBe(firstButton);
    });

    it('should move focus to last item with End key', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      const lastButton = screen.getByRole('button', {
        name: new RegExp(objections[objections.length - 1].question),
      });

      firstButton.focus();
      fireEvent.keyDown(firstButton, { key: 'End' });

      expect(document.activeElement).toBe(lastButton);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on buttons', () => {
      render(<ObjectionAccordion />);

      objections.forEach(objection => {
        const button = screen.getByRole('button', {
          name: new RegExp(objection.question),
        });

        expect(button).toHaveAttribute('aria-expanded');
        expect(button).toHaveAttribute(
          'aria-controls',
          `objection-panel-${objection.id}`
        );
        expect(button).toHaveAttribute(
          'id',
          `objection-header-${objection.id}`
        );
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should have proper ARIA attributes on panels', () => {
      render(<ObjectionAccordion />);

      objections.forEach(objection => {
        const panel = document.getElementById(
          `objection-panel-${objection.id}`
        );

        expect(panel).toHaveAttribute('role', 'region');
        expect(panel).toHaveAttribute(
          'aria-labelledby',
          `objection-header-${objection.id}`
        );
        expect(panel).toHaveAttribute('aria-hidden');
      });
    });

    it('should update aria-hidden when expanding/collapsing', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      const firstPanel = document.getElementById(
        `objection-panel-${objections[0].id}`
      );

      // Initially collapsed
      expect(firstPanel).toHaveAttribute('aria-hidden', 'true');

      // Expand
      fireEvent.click(firstButton);
      expect(firstPanel).toHaveAttribute('aria-hidden', 'false');

      // Collapse
      fireEvent.click(firstButton);
      expect(firstPanel).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have focus indicators', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });
      expect(firstButton).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  describe('Visual variants', () => {
    it('should apply correct variant styles to each objection', () => {
      const { container } = render(<ObjectionAccordion />);

      // Check that different variants are applied
      const amberBorder = container.querySelector('.border-l-\\[\\#F5A623\\]');
      const tealBorder = container.querySelector('.border-l-\\[\\#2D9B8A\\]');
      const blueBorder = container.querySelector('.border-l-\\[\\#1B3A6B\\]');
      const purpleBorder = container.querySelector('.border-l-\\[\\#8B7EC8\\]');

      expect(amberBorder).toBeInTheDocument();
      expect(tealBorder).toBeInTheDocument();
      expect(blueBorder).toBeInTheDocument();
      expect(purpleBorder).toBeInTheDocument();
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid clicking without errors', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });

      // Rapid clicks
      fireEvent.click(firstButton);
      fireEvent.click(firstButton);
      fireEvent.click(firstButton);
      fireEvent.click(firstButton);

      // Should end in collapsed state (even number of clicks)
      expect(firstButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should handle keyboard navigation without errors when no item is expanded', () => {
      render(<ObjectionAccordion />);

      const firstButton = screen.getByRole('button', {
        name: new RegExp(objections[0].question),
      });

      firstButton.focus();
      fireEvent.keyDown(firstButton, { key: 'ArrowDown' });
      fireEvent.keyDown(firstButton, { key: 'ArrowUp' });
      fireEvent.keyDown(firstButton, { key: 'Home' });
      fireEvent.keyDown(firstButton, { key: 'End' });

      // Should not throw errors
      expect(true).toBe(true);
    });
  });
});
