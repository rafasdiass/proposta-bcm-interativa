import React, { useState } from 'react';
import { CountdownTimer } from './CountdownTimer';

/**
 * Demo component for CountdownTimer
 *
 * Demonstrates:
 * - Default deadline (May 22, 2026)
 * - Custom deadline
 * - Urgency threshold (72 hours)
 * - Expired state
 * - Reduced motion support
 */
export const CountdownTimerDemo: React.FC = () => {
  const [customDeadline, setCustomDeadline] = useState<Date | null>(null);

  // Preset deadlines for demonstration
  const presets = {
    default: null, // Uses default May 22, 2026
    urgent: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    soon: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    expired: new Date(Date.now() - 1000), // 1 second ago
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Countdown Timer Demo
          </h1>
          <p className="text-gray-600">
            Interactive demonstration of the Countdown Timer component with
            various deadline scenarios.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Preset Scenarios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => setCustomDeadline(presets.default)}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Default Deadline
              <span className="block text-xs mt-1 opacity-75">
                May 22, 2026
              </span>
            </button>
            <button
              onClick={() => setCustomDeadline(presets.urgent)}
              className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
            >
              Urgent (48h)
              <span className="block text-xs mt-1 opacity-75">
                Within urgency threshold
              </span>
            </button>
            <button
              onClick={() => setCustomDeadline(presets.soon)}
              className="px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
            >
              Soon (5 days)
              <span className="block text-xs mt-1 opacity-75">
                Outside urgency threshold
              </span>
            </button>
            <button
              onClick={() => setCustomDeadline(presets.expired)}
              className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              Expired
              <span className="block text-xs mt-1 opacity-75">
                Past deadline
              </span>
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div>
          {customDeadline === null ? (
            <CountdownTimer />
          ) : (
            <CountdownTimer deadline={customDeadline} />
          )}
        </div>

        {/* Feature Documentation */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Real-time Updates
              </h3>
              <p className="text-sm text-gray-600">
                The countdown updates every second, displaying days, hours,
                minutes, and seconds remaining until the deadline.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Urgency Threshold
              </h3>
              <p className="text-sm text-gray-600">
                When less than 72 hours remain, the timer changes to amber color
                and displays an urgency message.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Expired State
              </h3>
              <p className="text-sm text-gray-600">
                When the deadline passes, the timer displays an expired message
                and stops updating.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Reduced Motion
              </h3>
              <p className="text-sm text-gray-600">
                Respects the prefers-reduced-motion preference by disabling
                decorative animations while maintaining functionality.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Accessibility
              </h3>
              <p className="text-sm text-gray-600">
                Includes proper ARIA labels for screen readers and semantic HTML
                structure.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Configurable Deadline
              </h3>
              <p className="text-sm text-gray-600">
                Accepts a custom deadline prop with a sensible default (May 22,
                2026).
              </p>
            </div>
          </div>
        </div>

        {/* Requirements Validation */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Requirements Validation
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <p className="font-medium text-gray-900">
                  Requirement 7.1: Configurable deadline
                </p>
                <p className="text-sm text-gray-600">
                  Default: May 22, 2026, 23:59:59 in America/Sao_Paulo timezone
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <p className="font-medium text-gray-900">
                  Requirement 7.2: Real-time updates
                </p>
                <p className="text-sm text-gray-600">
                  Updates every second while deadline is in the future
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <p className="font-medium text-gray-900">
                  Requirement 7.3: Expired state
                </p>
                <p className="text-sm text-gray-600">
                  Displays "Proposta Expirada" and stops updates when deadline
                  passes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <p className="font-medium text-gray-900">
                  Requirement 7.4: Urgency colors
                </p>
                <p className="text-sm text-gray-600">
                  Amber (#F5A623) when ≤72 hours, Blue (#1B3A6B) otherwise
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <p className="font-medium text-gray-900">
                  Requirement 7.6: Reduced motion
                </p>
                <p className="text-sm text-gray-600">
                  Respects prefers-reduced-motion by disabling decorative
                  animations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimerDemo;
