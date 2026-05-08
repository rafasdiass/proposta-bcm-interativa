import React from 'react';
import { ROISimulator } from './ROISimulator';

/**
 * Demo component showing how to use the ROI Simulator
 *
 * This component can be imported into any section of the application
 * to display the interactive ROI calculator.
 *
 * Usage:
 * ```tsx
 * import { ROISimulator } from '@/components/interactive';
 *
 * function MySection() {
 *   return (
 *     <div>
 *       <h1>Investment Opportunity</h1>
 *       <ROISimulator />
 *     </div>
 *   );
 * }
 * ```
 *
 * Features:
 * - Real-time calculations with <100ms response time
 * - Pre-configured scenarios (breakeven, 1K subscribers, municipal contract, national presence)
 * - Input validation and range constraints
 * - Formatted BRL currency display using Intl.NumberFormat
 * - Responsive design with mobile support
 * - Accessibility-compliant with keyboard navigation
 *
 * Requirements Validated:
 * - 4.1: Subscriber count input [0, 5000] in increments of 10
 * - 4.2: Plan mix inputs (Professional R$297, Clinic R$997, School R$1,997)
 * - 4.3: MRR multiple input [1, 20] with default 5
 * - 4.4: Real-time calculations <100ms
 * - 4.5: Four pre-configured scenarios
 * - 4.6: Scenario selection fills inputs
 * - 4.9: Disclaimer text about projections
 * - 17.1: Currency formatting in BRL
 */
export const ROISimulatorDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ROI Simulator Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Interactive calculator to simulate the value of 5% equity in LaVita
            Code based on different subscriber scenarios and plan mixes.
          </p>
        </div>

        <ROISimulator />

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                1. Quick Start with Scenarios
              </h3>
              <p>
                Click any of the pre-configured scenario buttons to instantly
                see projections for common business milestones:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>
                  <strong>Breakeven (350 subscribers):</strong> Initial
                  profitability milestone
                </li>
                <li>
                  <strong>1,000 subscribers:</strong> Early growth stage
                </li>
                <li>
                  <strong>Municipal contract + 500 subscribers:</strong>{' '}
                  Government partnership scenario
                </li>
                <li>
                  <strong>National presence (2,000+ subscribers):</strong> Scale
                  achievement
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                2. Customize Your Projection
              </h3>
              <p>Adjust the inputs to model your specific scenario:</p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>
                  <strong>Subscriber Count:</strong> Use the slider or number
                  input (0-5,000)
                </li>
                <li>
                  <strong>Plan Mix:</strong> Adjust the percentage distribution
                  across three plans
                </li>
                <li>
                  <strong>MRR Multiple:</strong> Set the valuation multiple
                  (1-20x)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                3. Understand the Results
              </h3>
              <p>The calculator displays three key metrics:</p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>
                  <strong>Monthly Revenue (MRR):</strong> Total recurring
                  revenue per month
                </li>
                <li>
                  <strong>Estimated Valuation:</strong> Company value based on
                  MRR multiple
                </li>
                <li>
                  <strong>Value of 5%:</strong> Worth of the 5% equity stake
                  (highlighted in blue)
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-lg mb-2 text-blue-900">
                Investment Context
              </h3>
              <p className="text-blue-800">
                Grupo Gradual will receive 5% of LaVita Code for a R$75,000
                investment. This calculator helps visualize the potential return
                on that investment across different growth scenarios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROISimulatorDemo;
