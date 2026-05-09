import { render, screen, act, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NavigationProvider } from './NavigationProvider';
import { useNavigation } from './useNavigation';
import { proposalPages } from '@/data/pages';

const lastPageIndex = proposalPages.length - 1;

// Test component to access navigation context
function TestComponent() {
  const { state, actions } = useNavigation();

  return (
    <div>
      <div data-testid="mode">{state.mode}</div>
      <div data-testid="current-section">{state.currentSection}</div>
      <div data-testid="total-sections">{state.totalSections}</div>
      <div data-testid="is-transitioning">
        {state.isTransitioning.toString()}
      </div>

      <button onClick={() => actions.setMode('presentation')}>
        Set Presentation Mode
      </button>
      <button onClick={() => actions.setMode('landing')}>
        Set Landing Mode
      </button>
      <button onClick={() => actions.nextSection()}>Next Section</button>
      <button onClick={() => actions.previousSection()}>
        Previous Section
      </button>
      <button onClick={() => actions.goToSection(5)}>Go to Section 5</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <NavigationProvider>
      <TestComponent />
    </NavigationProvider>
  );
}

describe('NavigationProvider', () => {
  beforeEach(() => {
    // Reset URL hash
    window.location.hash = '';

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with correct default state', () => {
      renderWithProvider();

      expect(screen.getByTestId('mode')).toHaveTextContent('landing');
      expect(screen.getByTestId('current-section')).toHaveTextContent('0');
      expect(screen.getByTestId('total-sections')).toHaveTextContent(
        String(proposalPages.length)
      );
      expect(screen.getByTestId('is-transitioning')).toHaveTextContent('false');
    });
  });

  describe('Mode Switching', () => {
    it('should switch to presentation mode', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.click(screen.getByText('Set Presentation Mode'));

      expect(screen.getByTestId('mode')).toHaveTextContent('presentation');
      expect(screen.getByTestId('is-transitioning')).toHaveTextContent('true');
    });

    it('should switch back to landing mode', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // First switch to presentation mode
      await user.click(screen.getByText('Set Presentation Mode'));
      expect(screen.getByTestId('mode')).toHaveTextContent('presentation');

      // Then switch back to landing mode
      await user.click(screen.getByText('Set Landing Mode'));
      expect(screen.getByTestId('mode')).toHaveTextContent('landing');
    });
  });

  describe('Section Navigation', () => {
    it('should navigate to next section', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.click(screen.getByText('Next Section'));

      expect(screen.getByTestId('current-section')).toHaveTextContent('1');
    });

    it('should navigate to previous section', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // First go to section 5
      await user.click(screen.getByText('Go to Section 5'));
      expect(screen.getByTestId('current-section')).toHaveTextContent('5');

      // Then go to previous section
      await user.click(screen.getByText('Previous Section'));
      expect(screen.getByTestId('current-section')).toHaveTextContent('4');
    });

    it('should navigate to specific section', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.click(screen.getByText('Go to Section 5'));

      expect(screen.getByTestId('current-section')).toHaveTextContent('5');
    });

    it('should not go below section 0', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Try to go to previous section when already at 0
      await user.click(screen.getByText('Previous Section'));

      expect(screen.getByTestId('current-section')).toHaveTextContent('0');
    });

    it('should not go above last section', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      for (let i = 0; i < 25; i++) {
        await user.click(screen.getByText('Next Section'));
      }

      expect(screen.getByTestId('current-section')).toHaveTextContent(
        String(lastPageIndex)
      );
    });
  });

  describe('Keyboard Navigation in Presentation Mode', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Switch to presentation mode first
      await user.click(screen.getByText('Set Presentation Mode'));

      // Wait for transition state to settle
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 350));
      });
    });

    it('should navigate forward with ArrowRight', () => {
      fireEvent.keyDown(window, { code: 'ArrowRight' });

      expect(screen.getByTestId('current-section')).toHaveTextContent('1');
    });

    it('should navigate forward with PageDown', () => {
      fireEvent.keyDown(window, { code: 'PageDown' });

      expect(screen.getByTestId('current-section')).toHaveTextContent('1');
    });

    it('should navigate forward with Space', () => {
      fireEvent.keyDown(window, { code: 'Space' });

      expect(screen.getByTestId('current-section')).toHaveTextContent('1');
    });

    it('should navigate backward with ArrowLeft', async () => {
      const user = userEvent.setup();

      // First go to section 2
      await user.click(screen.getByText('Go to Section 5'));
      expect(screen.getByTestId('current-section')).toHaveTextContent('5');

      // Then navigate back with ArrowLeft
      fireEvent.keyDown(window, { code: 'ArrowLeft' });

      expect(screen.getByTestId('current-section')).toHaveTextContent('4');
    });

    it('should navigate backward with PageUp', async () => {
      const user = userEvent.setup();

      // First go to section 5
      await user.click(screen.getByText('Go to Section 5'));
      expect(screen.getByTestId('current-section')).toHaveTextContent('5');

      // Then navigate back with PageUp
      fireEvent.keyDown(window, { code: 'PageUp' });

      expect(screen.getByTestId('current-section')).toHaveTextContent('4');
    });

    it('should go to first section with Home', async () => {
      const user = userEvent.setup();

      // First go to section 5
      await user.click(screen.getByText('Go to Section 5'));
      expect(screen.getByTestId('current-section')).toHaveTextContent('5');

      // Then go to first section with Home
      fireEvent.keyDown(window, { code: 'Home' });

      expect(screen.getByTestId('current-section')).toHaveTextContent('0');
    });

    it('should go to last section with End', () => {
      fireEvent.keyDown(window, { code: 'End' });

      expect(screen.getByTestId('current-section')).toHaveTextContent(
        String(lastPageIndex)
      );
    });

    it('should exit presentation mode with Escape', () => {
      fireEvent.keyDown(window, { code: 'Escape' });

      expect(screen.getByTestId('mode')).toHaveTextContent('landing');
    });

    it('should prevent default behavior for navigation keys', () => {
      const event = new KeyboardEvent('keydown', { code: 'ArrowRight' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      fireEvent(window, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation in Landing Mode', () => {
    it('should not handle keyboard navigation in landing mode', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Ensure we're in landing mode
      expect(screen.getByTestId('mode')).toHaveTextContent('landing');

      // Try to navigate with keyboard
      fireEvent.keyDown(window, { code: 'ArrowRight' });

      // Should still be at section 0
      expect(screen.getByTestId('current-section')).toHaveTextContent('0');
    });
  });

  describe('URL Fragment Management', () => {
    it('should update URL fragment when section changes', async () => {
      const user = userEvent.setup();
      const replaceStateSpy = vi.spyOn(window.history, 'replaceState');

      renderWithProvider();

      await user.click(screen.getByText('Go to Section 5'));

      expect(replaceStateSpy).toHaveBeenCalledWith(
        null,
        '',
        `#${proposalPages[5].slug}`
      );
    });

    it('should handle initial URL fragment on load', () => {
      // Set initial hash
      window.location.hash = '#secao-3';

      renderWithProvider();

      expect(screen.getByTestId('current-section')).toHaveTextContent('3');
    });
  });

  describe('Transition State Management', () => {
    it('should set transitioning state when changing sections', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.click(screen.getByText('Next Section'));

      expect(screen.getByTestId('is-transitioning')).toHaveTextContent('true');
    });

    it('should reset transitioning state after timeout', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      await user.click(screen.getByText('Next Section'));
      expect(screen.getByTestId('is-transitioning')).toHaveTextContent('true');

      // Wait for transition timeout
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 350));
      });

      expect(screen.getByTestId('is-transitioning')).toHaveTextContent('false');
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus trap in presentation mode', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Switch to presentation mode
      await user.click(screen.getByText('Set Presentation Mode'));

      // The keyboard navigation should work without losing focus
      fireEvent.keyDown(window, { code: 'ArrowRight' });
      expect(screen.getByTestId('current-section')).toHaveTextContent('1');

      fireEvent.keyDown(window, { code: 'ArrowLeft' });
      expect(screen.getByTestId('current-section')).toHaveTextContent('0');
    });
  });
});
