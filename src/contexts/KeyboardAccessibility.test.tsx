import { render, fireEvent, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { NavigationProvider } from './NavigationProvider';
import { useNavigation } from './useNavigation';

// Mock component that simulates interactive elements in presentation mode
function InteractiveTestComponent() {
  const { state, actions } = useNavigation();

  return (
    <div>
      <div data-testid="mode">{state.mode}</div>
      <div data-testid="current-section">{state.currentSection}</div>

      <button onClick={() => actions.setMode('presentation')}>
        Enter Presentation Mode
      </button>

      {state.mode === 'presentation' && (
        <div data-testid="presentation-content">
          <button type="button" data-testid="interactive-button">
            Interactive Button
          </button>
          <input data-testid="interactive-input" placeholder="Test input" />
          <a href="#" data-testid="interactive-link">
            Test Link
          </a>

          <div data-testid="section-content">
            <h1>Section {state.currentSection}</h1>
            <p>This is the content for section {state.currentSection}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function renderWithProvider() {
  return render(
    <NavigationProvider>
      <InteractiveTestComponent />
    </NavigationProvider>
  );
}

describe('Keyboard Accessibility Tests', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.clearAllMocks();
    // Clean up DOM between tests
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Additional cleanup
    document.body.innerHTML = '';
  });

  describe('Focus Management', () => {
    it('should maintain focus visibility during keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Focus on an interactive element
      const button = screen.getByTestId('interactive-button');
      button.focus();
      expect(document.activeElement).toBe(button);

      // Navigate with keyboard - focus should be maintained on the page
      fireEvent.keyDown(window, { code: 'ArrowRight' });

      // The focused element might change, but focus should still be somewhere in the document
      expect(document.activeElement).not.toBe(null);
      expect(document.activeElement).not.toBe(document.body);
    });

    it('should not trap focus when navigating between sections', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Focus on input
      const input = screen.getByTestId('interactive-input');
      input.focus();

      // Navigate to next section
      fireEvent.keyDown(window, { code: 'ArrowRight' });

      // Should be able to focus on elements in the new section
      const newButton = screen.getByTestId('interactive-button');
      newButton.focus();
      expect(document.activeElement).toBe(newButton);
    });

    it('should allow tabbing through interactive elements', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Tab through elements
      await user.tab();
      const button = screen.getByTestId('interactive-button');
      expect(document.activeElement).toBe(button);

      await user.tab();
      const input = screen.getByTestId('interactive-input');
      expect(document.activeElement).toBe(input);

      await user.tab();
      const link = screen.getByTestId('interactive-link');
      expect(document.activeElement).toBe(link);
    });
  });

  describe('Keyboard Event Handling', () => {
    it('should prevent default behavior only for navigation keys', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Test navigation keys - should prevent default
      const navigationKeys = [
        'ArrowRight',
        'ArrowLeft',
        'PageDown',
        'PageUp',
        'Space',
        'Home',
        'End',
        'Escape',
      ];

      navigationKeys.forEach(key => {
        const event = new KeyboardEvent('keydown', { code: key });
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

        fireEvent(window, event);

        expect(preventDefaultSpy).toHaveBeenCalled();
      });
    });

    it('should not prevent default for non-navigation keys', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Test non-navigation keys - should not prevent default
      const nonNavigationKeys = ['KeyA', 'KeyB', 'Enter', 'Tab', 'Shift'];

      nonNavigationKeys.forEach(key => {
        const event = new KeyboardEvent('keydown', { code: key });
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

        fireEvent(window, event);

        expect(preventDefaultSpy).not.toHaveBeenCalled();
      });
    });

    it('should handle keyboard events only in presentation mode', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // In landing mode, keyboard navigation should not work
      expect(screen.getByTestId('mode')).toHaveTextContent('landing');

      const initialSection = screen.getByTestId('current-section').textContent;
      fireEvent.keyDown(window, { code: 'ArrowRight' });

      // Section should not change in landing mode
      expect(screen.getByTestId('current-section')).toHaveTextContent(
        initialSection || '0'
      );

      // Switch to presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Now keyboard navigation should work
      fireEvent.keyDown(window, { code: 'ArrowRight' });
      expect(screen.getByTestId('current-section')).toHaveTextContent('1');
    });
  });

  describe('Interactive Element Accessibility', () => {
    it('should allow normal interaction with form elements', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Focus and type in input
      const input = screen.getByTestId('interactive-input') as HTMLInputElement;
      await user.click(input);
      await user.type(input, 'testtext');

      expect(input.value).toBe('testtext');
    });

    it('should allow button clicks while in presentation mode', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Click button should work normally
      const button = screen.getByTestId('interactive-button');
      const clickHandler = vi.fn();
      button.addEventListener('click', clickHandler);

      await user.click(button);
      expect(clickHandler).toHaveBeenCalled();
    });

    it('should allow link navigation', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Link should be focusable and clickable
      const link = screen.getByTestId('interactive-link');
      await user.click(link);

      // Link should have received focus
      expect(document.activeElement).toBe(link);
    });
  });

  describe('Escape Key Behavior', () => {
    it('should exit presentation mode and return focus appropriately', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      const enterButton = screen.getByText('Enter Presentation Mode');
      await user.click(enterButton);

      expect(screen.getByTestId('mode')).toHaveTextContent('presentation');

      // Press Escape to exit
      fireEvent.keyDown(window, { code: 'Escape' });

      expect(screen.getByTestId('mode')).toHaveTextContent('landing');

      // Presentation content should be removed
      expect(
        screen.queryByTestId('presentation-content')
      ).not.toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation Consistency', () => {
    it('should provide consistent navigation experience across all forward keys', async () => {
      const forwardKeys = ['ArrowRight', 'PageDown', 'Space'];

      for (const key of forwardKeys) {
        // Clean up and render fresh for each test
        document.body.innerHTML = '';
        const { getByText, getByTestId } = renderWithProvider();

        // Enter presentation mode
        const enterButton = getByText('Enter Presentation Mode');
        await userEvent.setup().click(enterButton);

        // Start at section 0
        expect(getByTestId('current-section')).toHaveTextContent('0');

        // Navigate forward
        fireEvent.keyDown(window, { code: key });

        // Should be at section 1
        expect(getByTestId('current-section')).toHaveTextContent('1');
      }
    });

    it('should provide consistent navigation experience across all backward keys', async () => {
      const backwardKeys = ['ArrowLeft', 'PageUp'];

      for (const key of backwardKeys) {
        // Clean up and render fresh for each test
        document.body.innerHTML = '';
        const { getByText, getByTestId } = renderWithProvider();

        // Enter presentation mode
        const enterButton = getByText('Enter Presentation Mode');
        await userEvent.setup().click(enterButton);

        // Go to section 5 first
        for (let i = 0; i < 5; i++) {
          fireEvent.keyDown(window, { code: 'ArrowRight' });
        }
        expect(getByTestId('current-section')).toHaveTextContent('5');

        // Navigate backward
        fireEvent.keyDown(window, { code: key });

        // Should be at section 4
        expect(getByTestId('current-section')).toHaveTextContent('4');
      }
    });
  });

  describe('ARIA and Semantic Accessibility', () => {
    it('should maintain proper ARIA attributes during navigation', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Check that interactive elements have proper attributes
      const button = screen.getByTestId('interactive-button');
      expect(button).toHaveAttribute('type', 'button');

      const input = screen.getByTestId('interactive-input');
      expect(input).toHaveAttribute('placeholder');

      const link = screen.getByTestId('interactive-link');
      expect(link).toHaveAttribute('href');
    });

    it('should maintain semantic structure during section changes', async () => {
      const user = userEvent.setup();
      renderWithProvider();

      // Enter presentation mode
      await user.click(screen.getByText('Enter Presentation Mode'));

      // Navigate to different sections
      fireEvent.keyDown(window, { code: 'ArrowRight' });

      // Section content should still have proper heading structure
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Section 1');
    });
  });
});
