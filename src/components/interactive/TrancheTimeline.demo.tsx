import React from 'react';
import { TrancheTimeline } from './TrancheTimeline';

/**
 * Demo page for TrancheTimeline component
 *
 * This demo showcases the interactive timeline for investment tranches
 * with keyboard accessibility and hover/touch interactions.
 */
export const TrancheTimelineDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TrancheTimeline Component Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive timeline displaying investment tranches with triggers,
            deliverables, and progress indicators. Features keyboard
            accessibility and responsive design.
          </p>
        </div>

        {/* Component Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Interactive Timeline
          </h2>
          <TrancheTimeline />
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                ✓ Three Investment Tranches
              </h3>
              <p className="text-gray-600">
                Displays T1 (R$30,000), T2 (R$25,000), and T3 (R$20,000) with
                total investment of R$75,000
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                ✓ Trigger Conditions
              </h3>
              <p className="text-gray-600">
                Each tranche shows its activation trigger: contract signature,
                50 paying users, or publication/100 users
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                ✓ Interactive Deliverables
              </h3>
              <p className="text-gray-600">
                Click or tap on any tranche to reveal its associated
                deliverables and milestones
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                ✓ Progress Indicator
              </h3>
              <p className="text-gray-600">
                Visual progress with color gradient from green (#2D9B8A) to
                amber (#F5A623)
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                ✓ Keyboard Accessible
              </h3>
              <p className="text-gray-600">
                Full keyboard navigation with Tab, Enter, and Space keys. ARIA
                attributes for screen readers
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                ✓ Responsive Design
              </h3>
              <p className="text-gray-600">
                Adapts to different screen sizes with mobile-friendly touch
                interactions
              </p>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">How to Use</h2>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start gap-3">
              <span className="font-bold">1.</span>
              <p>
                <strong>Mouse/Touch:</strong> Click or tap on any tranche card
                to expand and view deliverables
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold">2.</span>
              <p>
                <strong>Keyboard:</strong> Use Tab to navigate between tranches,
                then press Enter or Space to expand/collapse
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold">3.</span>
              <p>
                <strong>Screen Readers:</strong> Each tranche has descriptive
                ARIA labels with amount and trigger information
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold">4.</span>
              <p>
                <strong>Visual Progress:</strong> Notice the color gradient that
                transitions from green (early stage) to amber (later stage)
              </p>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Technical Details
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">Component Props:</h3>
              <p className="text-sm">
                No props required - component uses internal state and constants
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Accessibility:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>ARIA expanded/collapsed states</li>
                <li>Keyboard navigation support</li>
                <li>Screen reader friendly labels</li>
                <li>Focus indicators</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Styling:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Tailwind CSS for responsive design</li>
                <li>Smooth transitions and animations</li>
                <li>Color gradient interpolation</li>
                <li>Hover and focus states</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Testing:</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Unit tests for all interactions</li>
                <li>Property-based tests for invariants</li>
                <li>Accessibility compliance tests</li>
                <li>Keyboard navigation tests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrancheTimelineDemo;
