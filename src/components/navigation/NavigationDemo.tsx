import { useEffect } from 'react';
import { useNavigation } from '../../contexts';
import { useScrollProgress } from '../../hooks';

/**
 * Demo component to showcase navigation functionality
 * This demonstrates the key features implemented in task 2.1
 */
export function NavigationDemo() {
  const { state, actions } = useNavigation();
  const { progress } = useScrollProgress({ enabled: state.mode === 'landing' });

  // Demo keyboard navigation instructions
  useEffect(() => {
    if (state.mode === 'presentation') {
      console.log('🎮 Presentation Mode Active!');
      console.log('Use these keys:');
      console.log('→ / Space / PageDown: Next section');
      console.log('← / PageUp: Previous section');
      console.log('Home: First section');
      console.log('End: Last section');
      console.log('Esc: Return to landing mode');
    }
  }, [state.mode]);

  return (
    <div className="fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-sm">
      <h3 className="text-sm font-semibold mb-3 text-gray-800">
        🚀 Navigation System Demo
      </h3>

      {/* Current State Display */}
      <div className="space-y-2 text-xs mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Mode:</span>
          <span
            className={`font-medium ${
              state.mode === 'landing' ? 'text-blue-600' : 'text-purple-600'
            }`}
          >
            {state.mode === 'landing' ? '📜 Landing' : '🎯 Presentation'}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Section:</span>
          <span className="font-medium text-gray-800">
            {state.currentSection + 1} / {state.totalSections}
          </span>
        </div>

        {state.mode === 'landing' && (
          <div className="flex justify-between">
            <span className="text-gray-600">Progress:</span>
            <span className="font-medium text-green-600">
              {Math.round(progress * 100)}%
            </span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-600">URL Fragment:</span>
          <span className="font-mono text-xs text-gray-500">
            #{window.location.hash.slice(1) || 'none'}
          </span>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mb-3">
        <div className="flex gap-1">
          <button
            onClick={() => actions.setMode('landing')}
            className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              state.mode === 'landing'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📜 Landing
          </button>
          <button
            onClick={() => actions.setMode('presentation')}
            className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              state.mode === 'presentation'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎯 Presentation
          </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="space-y-2">
        <div className="flex gap-1">
          <button
            onClick={() => actions.previousSection()}
            disabled={state.currentSection === 0}
            className="flex-1 px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={() => actions.nextSection()}
            disabled={state.currentSection === state.totalSections - 1}
            className="flex-1 px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Próxima →
          </button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => actions.goToSection(0)}
            className="flex-1 px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
          >
            🏠 Início
          </button>
          <button
            onClick={() =>
              actions.goToSection(Math.floor(state.totalSections / 2))
            }
            className="flex-1 px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
          >
            🎯 Meio
          </button>
          <button
            onClick={() => actions.goToSection(state.totalSections - 1)}
            className="flex-1 px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            🏁 Final
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 leading-relaxed">
          {state.mode === 'presentation' ? (
            <>
              <strong>Modo Apresentação:</strong> Use as setas do teclado,
              espaço, home, end ou esc para navegar.
            </>
          ) : (
            <>
              <strong>Modo Landing:</strong> Role a página para navegar ou use
              os botões acima.
            </>
          )}
        </p>
      </div>

      {/* Feature Checklist */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-700 mb-2">
          ✅ Funcionalidades Implementadas:
        </p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>✅ Dual navigation modes</li>
          <li>✅ URL fragment updates</li>
          <li>✅ Keyboard navigation</li>
          <li>✅ State management with useReducer</li>
          <li>✅ Scroll progress tracking</li>
          <li>✅ Section routing</li>
        </ul>
      </div>
    </div>
  );
}
