/**
 * Demo component for ModuleCards
 *
 * Showcases the ModuleCards component with different configurations
 */

import { ModuleCards } from './ModuleCards';

export function ModuleCardsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ModuleCards Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Interactive expandable cards for BCM product modules
          </p>
        </div>

        {/* Default state */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Default State (All Collapsed)
          </h2>
          <ModuleCards />
        </section>

        {/* With initial expanded */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            With Initial Expanded Modules
          </h2>
          <p className="text-gray-600 mb-4">
            PSRF-BCM and Kernel modules start expanded
          </p>
          <ModuleCards initialExpanded={['psrf-bcm', 'kernel']} />
        </section>

        {/* Features list */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>12 expandable cards for product modules</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Click or tap to expand/collapse</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Keyboard navigation with Enter and Space keys</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Proper ARIA attributes (aria-expanded, aria-controls)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Color-coded variants (teal, amber, blue, purple)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Smooth animations and transitions</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Responsive grid layout</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Multiple cards can be expanded simultaneously</span>
            </li>
          </ul>
        </section>

        {/* Keyboard shortcuts */}
        <section className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Keyboard Shortcuts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">
                Tab
              </kbd>
              <span className="text-gray-700">Navigate between cards</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">
                Enter
              </kbd>
              <span className="text-gray-700">Toggle expansion</span>
            </div>
            <div className="flex items-center gap-3">
              <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">
                Space
              </kbd>
              <span className="text-gray-700">Toggle expansion</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ModuleCardsDemo;
