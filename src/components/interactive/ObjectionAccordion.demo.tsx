/**
 * Demo file for ObjectionAccordion component
 *
 * This file demonstrates the ObjectionAccordion component with various configurations.
 */

import { ObjectionAccordion } from './ObjectionAccordion';

export default function ObjectionAccordionDemo() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[#1B3A6B] mb-2">
            ObjectionAccordion Component
          </h1>
          <p className="text-gray-600">
            FAQ-style accordion with single-item expansion and full keyboard
            navigation
          </p>
        </div>

        {/* Default State */}
        <section>
          <h2 className="text-2xl font-bold text-[#1B3A6B] mb-4">
            Default State
          </h2>
          <p className="text-gray-600 mb-4">
            All items collapsed by default. Click or use keyboard to expand.
          </p>
          <div className="bg-white p-6 rounded-lg shadow">
            <ObjectionAccordion />
          </div>
        </section>

        {/* With Initial Expanded */}
        <section>
          <h2 className="text-2xl font-bold text-[#1B3A6B] mb-4">
            With Initial Expanded Item
          </h2>
          <p className="text-gray-600 mb-4">
            Third item ("E se virar só mais um software?") is initially
            expanded.
          </p>
          <div className="bg-white p-6 rounded-lg shadow">
            <ObjectionAccordion initialExpanded="just-another-software" />
          </div>
        </section>

        {/* Keyboard Navigation Instructions */}
        <section className="bg-blue-50 border-l-4 border-[#1B3A6B] p-6 rounded">
          <h3 className="text-xl font-bold text-[#1B3A6B] mb-3">
            Keyboard Navigation (WAI-ARIA Accordion Pattern)
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-4">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs">
                Enter
              </kbd>
              <span>or</span>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs">
                Space
              </kbd>
              <span>— Toggle current item</span>
            </div>
            <div className="flex gap-4">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs">
                ↓
              </kbd>
              <span>— Move focus to next accordion header</span>
            </div>
            <div className="flex gap-4">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs">
                ↑
              </kbd>
              <span>— Move focus to previous accordion header</span>
            </div>
            <div className="flex gap-4">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs">
                Home
              </kbd>
              <span>— Move focus to first accordion header</span>
            </div>
            <div className="flex gap-4">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded font-mono text-xs">
                End
              </kbd>
              <span>— Move focus to last accordion header</span>
            </div>
          </div>
        </section>

        {/* Accessibility Features */}
        <section className="bg-green-50 border-l-4 border-[#2D9B8A] p-6 rounded">
          <h3 className="text-xl font-bold text-[#1B3A6B] mb-3">
            Accessibility Features
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              ✓ Proper ARIA attributes (aria-expanded, aria-controls,
              aria-labelledby)
            </li>
            <li>✓ Semantic HTML with proper heading structure</li>
            <li>
              ✓ Full keyboard navigation following WAI-ARIA Accordion pattern
            </li>
            <li>✓ Focus indicators for keyboard users</li>
            <li>
              ✓ Single-item expansion behavior (only one item open at a time)
            </li>
            <li>✓ Screen reader friendly with proper roles and labels</li>
          </ul>
        </section>

        {/* Requirements Coverage */}
        <section className="bg-amber-50 border-l-4 border-[#F5A623] p-6 rounded">
          <h3 className="text-xl font-bold text-[#1B3A6B] mb-3">
            Requirements Coverage
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>11.1:</strong> Displays 6 objection items (produto não
              vender, clínica não usar, virar "só mais um software",
              participação pequena, conflito técnico, retorno demorar)
            </li>
            <li>
              <strong>11.2:</strong> Expands item when clicked, showing the
              corresponding answer
            </li>
            <li>
              <strong>11.3:</strong> Single-item expansion (only one item
              expanded at a time)
            </li>
            <li>
              <strong>11.4:</strong> Full keyboard navigation with Enter/Space
              to toggle, ArrowUp/ArrowDown to navigate, Home/End for first/last
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
