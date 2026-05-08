import React from 'react';
import { StickyCTA } from './StickyCTA';
import { NavigationProvider } from '../../contexts';

/**
 * StickyCTA Demo
 *
 * Demonstrates the Sticky CTA component with different configurations
 * and viewport sizes.
 */

export const StickyCTADemo: React.FC = () => {
  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-100 pb-32">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="container-content">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sticky CTA Component Demo
            </h1>
            <p className="text-gray-600">
              Fixed-position call-to-action bar with three primary actions
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="container-content py-12 space-y-12">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <p className="text-gray-700">
                The <strong>StickyCTA</strong> component provides a
                fixed-position bar at the bottom of the viewport with three
                primary actions:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  <strong>Assinar Intenção:</strong> Opens a modal with the
                  IntentForm component
                </li>
                <li>
                  <strong>Baixar PDF:</strong> Downloads the proposal PDF file
                </li>
                <li>
                  <strong>Agendar Reunião:</strong> Opens an external scheduling
                  link in a new tab
                </li>
              </ul>
              <p className="text-gray-700">
                The component is responsive and collapses to a compact view on
                mobile devices (viewport width &lt; 640px).
              </p>
            </div>
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Desktop View
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ All three actions visible</li>
                  <li>✓ Horizontal layout with proper spacing</li>
                  <li>✓ Clear visual hierarchy</li>
                  <li>✓ Hover states and transitions</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Mobile View
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ Primary action always visible</li>
                  <li>✓ Expandable menu for additional actions</li>
                  <li>✓ Touch-friendly button sizes</li>
                  <li>✓ Automatic menu collapse after action</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Accessibility
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ WCAG AA contrast compliance</li>
                  <li>✓ Proper ARIA labels and roles</li>
                  <li>✓ Keyboard navigation support</li>
                  <li>✓ Screen reader friendly</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Integration
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ IntentForm modal integration</li>
                  <li>✓ PDF download handling</li>
                  <li>✓ External link management</li>
                  <li>✓ Navigation mode awareness</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Requirements Validation
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-900">
                      Requirement
                    </th>
                    <th className="py-3 px-4 font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4 text-gray-700">
                      12.1 - Fixed positioning in both navigation modes
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Implemented
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700">
                      12.2 - Three primary actions exposed
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Implemented
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700">
                      12.3 - Opens IntentForm modal on "Assinar intenção"
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Implemented
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700">
                      12.4 - Opens external scheduling link in new tab
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Implemented
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700">
                      12.5 - Responsive collapse on mobile (viewport &lt; 640px)
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Implemented
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-700">
                      12.6 - WCAG AA contrast compliance
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Implemented
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Usage Example */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Usage Example
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`import { StickyCTA } from './components/interactive/StickyCTA';

function App() {
  return (
    <NavigationProvider>
      <div className="min-h-screen">
        {/* Your content */}
        
        {/* Sticky CTA Bar */}
        <StickyCTA
          pdfUrl="/BCM_Proposta_Investimento_Grupo_Gradual_ATUALIZADA.pdf"
          schedulingUrl="https://calendly.com/example"
        />
      </div>
    </NavigationProvider>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* Testing Instructions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Testing Instructions
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Desktop Testing
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Verify all three buttons are visible</li>
                  <li>Click "Assinar Intenção" to open the modal</li>
                  <li>Click "Baixar PDF" to trigger download</li>
                  <li>Click "Agendar Reunião" to open scheduling link</li>
                  <li>Test keyboard navigation (Tab, Enter, Escape)</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Mobile Testing
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Resize viewport to &lt; 640px width</li>
                  <li>Verify compact view with menu button</li>
                  <li>Click menu button to expand additional actions</li>
                  <li>Test each action from the expanded menu</li>
                  <li>Verify menu closes after action is triggered</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Accessibility Testing
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Test with screen reader (NVDA, JAWS, VoiceOver)</li>
                  <li>Verify all buttons have proper labels</li>
                  <li>Check contrast ratios with browser DevTools</li>
                  <li>Test keyboard-only navigation</li>
                  <li>Verify focus indicators are visible</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Scroll Content for Testing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Scroll to Test Fixed Positioning
            </h2>
            <div className="space-y-4">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-6 h-64 flex items-center justify-center"
                >
                  <p className="text-2xl font-semibold text-gray-400">
                    Content Block {i + 1}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky CTA Component */}
        <StickyCTA
          pdfUrl="/BCM_Proposta_Investimento_Grupo_Gradual_ATUALIZADA.pdf"
          schedulingUrl="https://calendly.com/example"
        />
      </div>
    </NavigationProvider>
  );
};

export default StickyCTADemo;
