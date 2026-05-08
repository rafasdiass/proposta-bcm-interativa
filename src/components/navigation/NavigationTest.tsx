import {} from 'react';
import { useNavigation } from '../../contexts';

/**
 * Simple test component to verify navigation system functionality
 * This component will be removed once the full navigation UI is implemented
 */
export function NavigationTest() {
  const { state, actions } = useNavigation();

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="text-sm font-semibold mb-2">Navigation Test</h3>

      <div className="space-y-2 text-xs">
        <div>
          <strong>Mode:</strong> {state.mode}
        </div>
        <div>
          <strong>Section:</strong> {state.currentSection + 1} /{' '}
          {state.totalSections}
        </div>
        <div>
          <strong>Transitioning:</strong> {state.isTransitioning ? 'Yes' : 'No'}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex gap-1">
          <button
            onClick={() => actions.setMode('landing')}
            className={`px-2 py-1 text-xs rounded ${
              state.mode === 'landing'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Landing
          </button>
          <button
            onClick={() => actions.setMode('presentation')}
            className={`px-2 py-1 text-xs rounded ${
              state.mode === 'presentation'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Presentation
          </button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => actions.previousSection()}
            disabled={state.currentSection === 0}
            className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            ← Prev
          </button>
          <button
            onClick={() => actions.nextSection()}
            disabled={state.currentSection === state.totalSections - 1}
            className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            Next →
          </button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => actions.goToSection(0)}
            className="px-2 py-1 text-xs rounded bg-green-200 text-green-700"
          >
            First
          </button>
          <button
            onClick={() => actions.goToSection(state.totalSections - 1)}
            className="px-2 py-1 text-xs rounded bg-green-200 text-green-700"
          >
            Last
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {state.mode === 'presentation' && (
          <div>Use arrow keys, space, home, end, esc</div>
        )}
      </div>
    </div>
  );
}
