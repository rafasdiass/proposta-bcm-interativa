import React from 'react';
import { SofthouseCalculator } from './SofthouseCalculator';

/**
 * Demo component for SofthouseCalculator
 *
 * This demo showcases the Softhouse Calculator component which calculates
 * operational savings from using LaVita Code's development services at a 25% discount.
 *
 * Features demonstrated:
 * - Monthly cost input with range slider and number input
 * - Real-time calculation of monthly and annual savings
 * - Payback period calculation based on R$75,000 investment
 * - Reference examples (R$8,000 and R$12,000 per month)
 * - Zero cost handling with informative message
 * - BRL currency formatting
 */
export const SofthouseCalculatorDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Softhouse Calculator Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate operational savings from using LaVita Code's development
            services with a 25% discount. This calculator shows the return
            independent of equity investment.
          </p>
        </div>

        {/* Calculator Component */}
        <SofthouseCalculator />

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                1. Enter Your Monthly Software Cost
              </h3>
              <p>
                Use the slider or input field to enter your current monthly
                software development cost (R$0 to R$200,000).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                2. View Calculated Savings
              </h3>
              <p>The calculator automatically shows:</p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>Monthly savings (25% of your monthly cost)</li>
                <li>Annual savings (monthly savings × 12)</li>
                <li>Payback period (R$75,000 investment ÷ annual savings)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                3. Try Reference Examples
              </h3>
              <p>
                Click on the reference example buttons to quickly see
                calculations for common scenarios:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>
                  R$8,000/month → R$24,000/year savings → 3.1 years payback
                </li>
                <li>
                  R$12,000/month → R$36,000/year savings → 2.1 years payback
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Technical Details
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Discount Rate:</strong> 25% fixed
            </p>
            <p>
              <strong>Total Investment:</strong> R$75,000
            </p>
            <p>
              <strong>Monthly Cost Range:</strong> R$0 to R$200,000
            </p>
            <p>
              <strong>Payback Formula:</strong> 75,000 ÷ (monthly_cost × 0.25 ×
              12)
            </p>
            <p>
              <strong>Currency Format:</strong> Brazilian Real (BRL) with pt-BR
              locale
            </p>
          </div>
        </div>

        {/* Component Features */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Component Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-gray-900">
                User Experience
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Dual input controls (slider + number field)</li>
                <li>Real-time calculation updates</li>
                <li>Pre-configured reference examples</li>
                <li>Responsive design for all screen sizes</li>
                <li>Clear visual hierarchy</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-gray-900">
                Technical Implementation
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>React hooks (useState, useMemo, useCallback)</li>
                <li>Performance optimization with memoization</li>
                <li>Input validation and constraints</li>
                <li>Graceful zero-cost handling</li>
                <li>Accessible form controls</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SofthouseCalculatorDemo;
