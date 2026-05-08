import { useState } from 'react';
import { useNavigation } from '../../contexts';
import { Keyboard, ArrowRight, ArrowLeft, Home, RotateCcw } from 'lucide-react';

/**
 * Demo component showcasing keyboard navigation functionality
 */
export function KeyboardNavigationDemo() {
  const { state, actions } = useNavigation();
  const [showHelp, setShowHelp] = useState(false);

  const keyboardShortcuts = [
    {
      key: '→',
      description: 'Next section',
      codes: ['ArrowRight', 'PageDown', 'Space'],
    },
    {
      key: '←',
      description: 'Previous section',
      codes: ['ArrowLeft', 'PageUp'],
    },
    { key: 'Home', description: 'First section', codes: ['Home'] },
    { key: 'End', description: 'Last section', codes: ['End'] },
    { key: 'Esc', description: 'Exit presentation', codes: ['Escape'] },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Keyboard className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Keyboard Navigation
        </h3>
      </div>

      {/* Current State */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="text-sm text-gray-600 mb-1">Current State:</div>
        <div className="font-medium">
          Mode: <span className="text-blue-600">{state.mode}</span>
        </div>
        <div className="font-medium">
          Section:{' '}
          <span className="text-blue-600">{state.currentSection + 1}</span> of{' '}
          {state.totalSections}
        </div>
      </div>

      {/* Mode Controls */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Mode Controls:</div>
        <div className="flex gap-2">
          <button
            onClick={() => actions.setMode('presentation')}
            disabled={state.mode === 'presentation'}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Enter Presentation
          </button>
          <button
            onClick={() => actions.setMode('landing')}
            disabled={state.mode === 'landing'}
            className="px-3 py-2 text-sm bg-gray-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Exit to Landing
          </button>
        </div>
      </div>

      {/* Manual Navigation */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-2">Manual Navigation:</div>
        <div className="flex gap-2">
          <button
            onClick={() => actions.previousSection()}
            disabled={state.currentSection === 0}
            className="p-2 bg-gray-100 rounded disabled:bg-gray-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            title="Previous section"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => actions.goToSection(0)}
            disabled={state.currentSection === 0}
            className="p-2 bg-gray-100 rounded disabled:bg-gray-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            title="First section"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => actions.goToSection(state.totalSections - 1)}
            disabled={state.currentSection === state.totalSections - 1}
            className="p-2 bg-gray-100 rounded disabled:bg-gray-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            title="Last section"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => actions.nextSection()}
            disabled={state.currentSection === state.totalSections - 1}
            className="p-2 bg-gray-100 rounded disabled:bg-gray-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
            title="Next section"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Keyboard Help */}
      <div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="text-sm text-blue-600 hover:text-blue-800 underline mb-2"
        >
          {showHelp ? 'Hide' : 'Show'} Keyboard Shortcuts
        </button>

        {showHelp && (
          <div className="bg-blue-50 rounded-md p-3">
            <div className="text-sm text-blue-800 mb-2 font-medium">
              Available in Presentation Mode:
            </div>
            <div className="space-y-1">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="font-mono bg-white px-2 py-1 rounded text-blue-900">
                    {shortcut.key}
                  </span>
                  <span className="text-blue-700">{shortcut.description}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-blue-600">
              💡 Keyboard navigation only works in presentation mode
            </div>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {state.mode === 'presentation' && (
        <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-md">
          <div className="text-xs text-green-800">
            ✅ Keyboard navigation is active. Use arrow keys to navigate!
          </div>
        </div>
      )}

      {state.mode === 'landing' && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="text-xs text-yellow-800">
            ⚠️ Enter presentation mode to use keyboard navigation
          </div>
        </div>
      )}
    </div>
  );
}
