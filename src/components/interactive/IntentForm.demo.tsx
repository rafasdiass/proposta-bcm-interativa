import React, { useState } from 'react';
import { IntentForm } from './IntentForm';

/**
 * IntentForm Demo
 *
 * This demo showcases the IntentForm component with different configurations.
 */
export const IntentFormDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showWithEndpoint, setShowWithEndpoint] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          IntentForm Component Demo
        </h1>

        {/* Demo Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Demo Controls
          </h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              Open Form (No Endpoint)
            </button>
            <button
              onClick={() => setShowWithEndpoint(true)}
              className="btn btn-secondary"
            >
              Open Form (With Endpoint)
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Required Fields:</strong> Name, Email, Role, and LGPD
                Consent
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Optional Fields:</strong> Phone and Message
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Real-time Validation:</strong> Validates on blur with
                immediate feedback
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>LGPD Compliance:</strong> Explicit consent checkbox with
                clear privacy notice
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Error Handling:</strong> Network error handling with
                retry and mailto fallback
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Accessibility:</strong> Full keyboard navigation, ARIA
                labels, and screen reader support
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                <strong>Success State:</strong> Shows confirmation message and
                auto-closes after 3 seconds
              </span>
            </li>
          </ul>
        </div>

        {/* Usage Example */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Usage Example
          </h2>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            {`import { IntentForm } from './components/interactive/IntentForm';

// Basic usage
<IntentForm />

// With endpoint and onClose callback
<IntentForm 
  endpoint="https://api.example.com/intent"
  onClose={() => console.log('Form closed')}
/>

// Environment variable configuration
// .env file:
// VITE_INTENT_ENDPOINT=https://api.example.com/intent`}
          </pre>
        </div>
      </div>

      {/* Modal for Form (No Endpoint) */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <IntentForm onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}

      {/* Modal for Form (With Endpoint) */}
      {showWithEndpoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <IntentForm
              endpoint="https://httpbin.org/post"
              onClose={() => setShowWithEndpoint(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IntentFormDemo;
