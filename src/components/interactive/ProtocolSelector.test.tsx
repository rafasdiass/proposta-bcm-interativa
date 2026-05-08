/**
 * Unit tests for ProtocolSelector component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProtocolSelector, protocolGroups } from './ProtocolSelector';

describe('ProtocolSelector', () => {
  describe('Rendering', () => {
    it('should render both group selection buttons', () => {
      render(<ProtocolSelector />);

      expect(
        screen.getByRole('button', { name: /Defaults BCM/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Preferenciais Gradual/i })
      ).toBeInTheDocument();
    });

    it('should render with BCM defaults selected by default', () => {
      render(<ProtocolSelector />);

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });
      expect(bcmButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should render all protocol cards', () => {
      render(<ProtocolSelector />);

      // Count total protocols across both groups
      const totalProtocols = protocolGroups.reduce(
        (sum, group) => sum + group.protocols.length,
        0
      );

      // All protocol abbreviations should be present
      protocolGroups.forEach(group => {
        group.protocols.forEach(protocol => {
          expect(screen.getByText(protocol.abbreviation)).toBeInTheDocument();
        });
      });
    });

    it('should highlight OERA as priority when Gradual preferred is selected', async () => {
      const user = userEvent.setup();
      render(<ProtocolSelector />);

      // Select Gradual preferred group
      const gradualButton = screen.getByRole('button', {
        name: /Preferenciais Gradual/i,
      });
      await user.click(gradualButton);

      // Check for priority badge
      expect(screen.getByText(/Prioritário/i)).toBeInTheDocument();
    });

    it('should not show priority badge when Gradual preferred is not selected', () => {
      render(<ProtocolSelector />);

      // Priority badge should not be visible
      expect(screen.queryByText(/Prioritário/i)).not.toBeInTheDocument();
    });
  });

  describe('Group Selection', () => {
    it('should toggle group selection on click', async () => {
      const user = userEvent.setup();
      render(<ProtocolSelector />);

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });

      // Initially selected
      expect(bcmButton).toHaveAttribute('aria-pressed', 'true');

      // Click to deselect
      await user.click(bcmButton);
      expect(bcmButton).toHaveAttribute('aria-pressed', 'false');

      // Click to select again
      await user.click(bcmButton);
      expect(bcmButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should allow selecting both groups simultaneously', async () => {
      const user = userEvent.setup();
      render(<ProtocolSelector />);

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });
      const gradualButton = screen.getByRole('button', {
        name: /Preferenciais Gradual/i,
      });

      // Select both groups
      await user.click(gradualButton);

      expect(bcmButton).toHaveAttribute('aria-pressed', 'true');
      expect(gradualButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should show combination mode message when both groups are selected', async () => {
      const user = userEvent.setup();
      render(<ProtocolSelector />);

      const gradualButton = screen.getByRole('button', {
        name: /Preferenciais Gradual/i,
      });

      // Select both groups
      await user.click(gradualButton);

      // Check for combination mode message
      expect(
        screen.getByText(/Modo combinação/i, { exact: false })
      ).toBeInTheDocument();
    });

    it('should show default message when no groups are selected', async () => {
      const user = userEvent.setup();
      render(<ProtocolSelector />);

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });

      // Deselect the default group
      await user.click(bcmButton);

      // Check for default message
      expect(
        screen.getByText(/Selecione um grupo de protocolos/i, { exact: false })
      ).toBeInTheDocument();
    });
  });

  describe('Visual Highlighting', () => {
    it('should highlight protocols from selected groups', async () => {
      const user = userEvent.setup();
      render(<ProtocolSelector />);

      // BCM defaults should be highlighted initially
      // Find the actual card container (not just the closest div which might be inner content)
      const psrfHeading = screen.getByText('PSRF-BCM');
      const psrfCard = psrfHeading.closest('.border-2');
      expect(psrfCard).toHaveClass('border-[#2D9B8A]');

      // Gradual protocols should not be highlighted
      const oeraHeading = screen.getByText('OERA');
      const oeraCard = oeraHeading.closest('.border-2');
      expect(oeraCard).toHaveClass('opacity-60');

      // Select Gradual preferred
      const gradualButton = screen.getByRole('button', {
        name: /Preferenciais Gradual/i,
      });
      await user.click(gradualButton);

      // Now OERA should be highlighted
      const oeraCardAfter = screen.getByText('OERA').closest('.border-2');
      expect(oeraCardAfter).toHaveClass('border-[#2D9B8A]');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should toggle group selection with Enter key', async () => {
      const user = userEvent.setup();
      render(<ProtocolSelector />);

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });
      bcmButton.focus();

      // Press Enter to deselect
      await user.keyboard('{Enter}');
      expect(bcmButton).toHaveAttribute('aria-pressed', 'false');

      // Press Enter to select again
      await user.keyboard('{Enter}');
      expect(bcmButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should toggle group selection with Space key', async () => {
      const user = userEvent.setup();
      render(<ProtocolSelector />);

      const gradualButton = screen.getByRole('button', {
        name: /Preferenciais Gradual/i,
      });
      gradualButton.focus();

      // Press Space to select
      await user.keyboard(' ');
      expect(gradualButton).toHaveAttribute('aria-pressed', 'true');

      // Press Space to deselect
      await user.keyboard(' ');
      expect(gradualButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should have proper focus indicators', () => {
      render(<ProtocolSelector />);

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });
      expect(bcmButton).toHaveClass('focus:ring-2');
    });
  });

  describe('Initial State', () => {
    it('should accept custom initial selected groups', () => {
      render(<ProtocolSelector initialSelected={['gradual-preferred']} />);

      const gradualButton = screen.getByRole('button', {
        name: /Preferenciais Gradual/i,
      });
      expect(gradualButton).toHaveAttribute('aria-pressed', 'true');

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });
      expect(bcmButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should accept both groups as initial selection', () => {
      render(
        <ProtocolSelector
          initialSelected={['bcm-defaults', 'gradual-preferred']}
        />
      );

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });
      const gradualButton = screen.getByRole('button', {
        name: /Preferenciais Gradual/i,
      });

      expect(bcmButton).toHaveAttribute('aria-pressed', 'true');
      expect(gradualButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should accept empty initial selection', () => {
      render(<ProtocolSelector initialSelected={[]} />);

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });
      const gradualButton = screen.getByRole('button', {
        name: /Preferenciais Gradual/i,
      });

      expect(bcmButton).toHaveAttribute('aria-pressed', 'false');
      expect(gradualButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('ARIA Attributes', () => {
    it('should have proper aria-pressed attributes', () => {
      render(<ProtocolSelector />);

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });
      expect(bcmButton).toHaveAttribute('aria-pressed');
    });

    it('should have aria-live region for description updates', () => {
      render(<ProtocolSelector />);

      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    });

    it('should have aria-label for selection indicator', async () => {
      const user = userEvent.setup();
      render(<ProtocolSelector />);

      // BCM defaults is selected by default, so check for selection indicators
      const selectionIndicators = screen.getAllByLabelText('Selecionado');
      expect(selectionIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid toggling', async () => {
      const user = userEvent.setup();
      render(<ProtocolSelector />);

      const bcmButton = screen.getByRole('button', { name: /Defaults BCM/i });

      // Initially selected (default state)
      expect(bcmButton).toHaveAttribute('aria-pressed', 'true');

      // Rapidly toggle multiple times
      await user.click(bcmButton); // false
      await user.click(bcmButton); // true
      await user.click(bcmButton); // false
      await user.click(bcmButton); // true

      // Should end in selected state (4 clicks from initially selected = even number)
      expect(bcmButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should apply custom className', () => {
      const { container } = render(
        <ProtocolSelector className="custom-class" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Protocol Data', () => {
    it('should display correct number of BCM default protocols', () => {
      render(<ProtocolSelector />);

      const bcmGroup = protocolGroups.find(g => g.id === 'bcm-defaults');
      expect(bcmGroup?.protocols).toHaveLength(3);
    });

    it('should display correct number of Gradual preferred protocols', () => {
      render(<ProtocolSelector />);

      const gradualGroup = protocolGroups.find(
        g => g.id === 'gradual-preferred'
      );
      expect(gradualGroup?.protocols).toHaveLength(7);
    });

    it('should mark only OERA as priority protocol', () => {
      const gradualGroup = protocolGroups.find(
        g => g.id === 'gradual-preferred'
      );
      const priorityProtocols = gradualGroup?.protocols.filter(
        p => p.isPriority
      );

      expect(priorityProtocols).toHaveLength(1);
      expect(priorityProtocols?.[0].id).toBe('oera');
    });
  });
});
