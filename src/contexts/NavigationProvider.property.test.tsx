import { render, fireEvent, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { NavigationProvider } from './NavigationProvider';
import { useNavigation } from './useNavigation';

// Test component to access navigation context
function TestComponent() {
  const { state, actions } = useNavigation();

  return (
    <div>
      <div data-testid="mode">{state.mode}</div>
      <div data-testid="current-section">{state.currentSection}</div>
      <div data-testid="total-sections">{state.totalSections}</div>

      <button onClick={() => actions.setMode('presentation')}>
        Set Presentation Mode
      </button>
      <button onClick={() => actions.goToSection(0)}>Go to Section 0</button>
    </div>
  );
}

describe('NavigationProvider Property-Based Tests', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.clearAllMocks();
    // Clean up DOM between tests
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Additional cleanup
    cleanup();
    document.body.innerHTML = '';
  });

  // Feature: proposta-bcm-interativa, Property 1: Keyboard navigation should maintain section bounds
  it('should maintain section bounds regardless of navigation sequence', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.oneof(
            fc.constant('ArrowRight'),
            fc.constant('ArrowLeft'),
            fc.constant('PageDown'),
            fc.constant('PageUp'),
            fc.constant('Space'),
            fc.constant('Home'),
            fc.constant('End')
          ),
          { minLength: 1, maxLength: 50 }
        ),
        keySequence => {
          // Clean up before each property test run
          cleanup();
          document.body.innerHTML = '';

          const { getByTestId, getByText } = render(
            <NavigationProvider>
              <TestComponent />
            </NavigationProvider>
          );

          // Switch to presentation mode
          fireEvent.click(getByText('Set Presentation Mode'));

          // Apply key sequence
          keySequence.forEach(key => {
            fireEvent.keyDown(window, { code: key });
          });

          const currentSection = parseInt(
            getByTestId('current-section').textContent || '0'
          );
          const totalSections = parseInt(
            getByTestId('total-sections').textContent || '22'
          );

          // Section should always be within bounds
          expect(currentSection).toBeGreaterThanOrEqual(0);
          expect(currentSection).toBeLessThan(totalSections);

          // Clean up after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 2: Home and End keys should always go to correct sections
  it('should always navigate to first section with Home and last section with End', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 21 }), // Starting section
        startSection => {
          // Clean up before each property test run
          cleanup();
          document.body.innerHTML = '';

          const { getByTestId, getByText } = render(
            <NavigationProvider>
              <TestComponent />
            </NavigationProvider>
          );

          // Switch to presentation mode
          fireEvent.click(getByText('Set Presentation Mode'));

          // Navigate to starting section first
          for (let i = 0; i < startSection; i++) {
            fireEvent.keyDown(window, { code: 'ArrowRight' });
          }

          // Test Home key
          fireEvent.keyDown(window, { code: 'Home' });
          expect(getByTestId('current-section')).toHaveTextContent('0');

          // Test End key
          fireEvent.keyDown(window, { code: 'End' });
          expect(getByTestId('current-section')).toHaveTextContent('21');

          // Clean up after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 3: Forward navigation keys should have consistent behavior
  it('should have consistent forward navigation behavior across different keys', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('ArrowRight'),
          fc.constant('PageDown'),
          fc.constant('Space')
        ),
        fc.integer({ min: 0, max: 20 }), // Starting section (not last)
        (forwardKey, startSection) => {
          // Clean up before each property test run
          cleanup();
          document.body.innerHTML = '';

          const { getByTestId, getByText } = render(
            <NavigationProvider>
              <TestComponent />
            </NavigationProvider>
          );

          // Switch to presentation mode
          fireEvent.click(getByText('Set Presentation Mode'));

          // Navigate to starting section
          for (let i = 0; i < startSection; i++) {
            fireEvent.keyDown(window, { code: 'ArrowRight' });
          }

          const initialSection = parseInt(
            getByTestId('current-section').textContent || '0'
          );

          // Use forward navigation key
          fireEvent.keyDown(window, { code: forwardKey });

          const finalSection = parseInt(
            getByTestId('current-section').textContent || '0'
          );

          // Should advance by exactly one section (unless at boundary)
          if (initialSection < 21) {
            expect(finalSection).toBe(initialSection + 1);
          } else {
            expect(finalSection).toBe(initialSection); // Stay at last section
          }

          // Clean up after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 4: Backward navigation keys should have consistent behavior
  it('should have consistent backward navigation behavior across different keys', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.constant('ArrowLeft'), fc.constant('PageUp')),
        fc.integer({ min: 1, max: 21 }), // Starting section (not first)
        (backwardKey, startSection) => {
          // Clean up before each property test run
          cleanup();
          document.body.innerHTML = '';

          const { getByTestId, getByText } = render(
            <NavigationProvider>
              <TestComponent />
            </NavigationProvider>
          );

          // Switch to presentation mode
          fireEvent.click(getByText('Set Presentation Mode'));

          // Navigate to starting section
          for (let i = 0; i < startSection; i++) {
            fireEvent.keyDown(window, { code: 'ArrowRight' });
          }

          const initialSection = parseInt(
            getByTestId('current-section').textContent || '0'
          );

          // Use backward navigation key
          fireEvent.keyDown(window, { code: backwardKey });

          const finalSection = parseInt(
            getByTestId('current-section').textContent || '0'
          );

          // Should go back by exactly one section (unless at boundary)
          if (initialSection > 0) {
            expect(finalSection).toBe(initialSection - 1);
          } else {
            expect(finalSection).toBe(initialSection); // Stay at first section
          }

          // Clean up after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 5: Escape key should always return to landing mode
  it('should always return to landing mode when Escape is pressed in presentation mode', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.oneof(
            fc.constant('ArrowRight'),
            fc.constant('ArrowLeft'),
            fc.constant('Home'),
            fc.constant('End')
          ),
          { maxLength: 10 }
        ),
        navigationSequence => {
          // Clean up before each property test run
          cleanup();
          document.body.innerHTML = '';

          const { getByTestId, getByText } = render(
            <NavigationProvider>
              <TestComponent />
            </NavigationProvider>
          );

          // Switch to presentation mode
          fireEvent.click(getByText('Set Presentation Mode'));
          expect(getByTestId('mode')).toHaveTextContent('presentation');

          // Perform some navigation
          navigationSequence.forEach(key => {
            fireEvent.keyDown(window, { code: key });
          });

          // Press Escape
          fireEvent.keyDown(window, { code: 'Escape' });

          // Should be back in landing mode
          expect(getByTestId('mode')).toHaveTextContent('landing');

          // Clean up after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: proposta-bcm-interativa, Property 6: Navigation should be idempotent at boundaries
  it('should be idempotent when navigating at section boundaries', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }), // Number of repeated key presses
        repeatCount => {
          // Clean up before each property test run
          cleanup();
          document.body.innerHTML = '';

          const { getByTestId, getByText } = render(
            <NavigationProvider>
              <TestComponent />
            </NavigationProvider>
          );

          // Switch to presentation mode
          fireEvent.click(getByText('Set Presentation Mode'));

          // Test at first section boundary
          fireEvent.click(getByText('Go to Section 0'));
          const initialSection = parseInt(
            getByTestId('current-section').textContent || '0'
          );

          // Try to go backward multiple times
          for (let i = 0; i < repeatCount; i++) {
            fireEvent.keyDown(window, { code: 'ArrowLeft' });
          }

          const afterBackward = parseInt(
            getByTestId('current-section').textContent || '0'
          );
          expect(afterBackward).toBe(initialSection); // Should stay at 0

          // Test at last section boundary
          fireEvent.keyDown(window, { code: 'End' });
          const lastSection = parseInt(
            getByTestId('current-section').textContent || '0'
          );

          // Try to go forward multiple times
          for (let i = 0; i < repeatCount; i++) {
            fireEvent.keyDown(window, { code: 'ArrowRight' });
          }

          const afterForward = parseInt(
            getByTestId('current-section').textContent || '0'
          );
          expect(afterForward).toBe(lastSection); // Should stay at last section

          // Clean up after each property test run
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
