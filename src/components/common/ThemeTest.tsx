/**
 * Theme Test Component - Verifies Tailwind CSS configuration
 * This component tests the custom brand colors and theme setup
 */

import React from 'react';

const ThemeTest: React.FC = () => {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Tailwind CSS Theme Test</h2>

      {/* Brand Colors Test */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div
            className="w-16 h-16 rounded-lg mx-auto mb-2"
            style={{ backgroundColor: 'var(--color-primary)' }}
          ></div>
          <p className="text-sm font-medium">Primary</p>
          <p className="text-xs text-gray-600">#1B3A6B</p>
        </div>

        <div className="card p-4 text-center">
          <div
            className="w-16 h-16 rounded-lg mx-auto mb-2"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          ></div>
          <p className="text-sm font-medium">Secondary</p>
          <p className="text-xs text-gray-600">#2D9B8A</p>
        </div>

        <div className="card p-4 text-center">
          <div
            className="w-16 h-16 rounded-lg mx-auto mb-2"
            style={{ backgroundColor: 'var(--color-accent)' }}
          ></div>
          <p className="text-sm font-medium">Accent</p>
          <p className="text-xs text-gray-600">#F5A623</p>
        </div>

        <div className="card p-4 text-center">
          <div
            className="w-16 h-16 rounded-lg mx-auto mb-2"
            style={{ backgroundColor: 'var(--color-purple)' }}
          ></div>
          <p className="text-sm font-medium">Purple</p>
          <p className="text-xs text-gray-600">#8B7EC8</p>
        </div>
      </div>

      {/* Button Components Test */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Button Components</h3>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-accent">Accent Button</button>
          <button className="btn btn-outline">Outline Button</button>
        </div>
      </div>

      {/* Card Components Test */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Card Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-6">
            <h4 className="font-semibold mb-2">Regular Card</h4>
            <p className="text-gray-600">
              This is a regular card component with soft shadow.
            </p>
          </div>
          <div className="card-interactive p-6">
            <h4 className="font-semibold mb-2">Interactive Card</h4>
            <p className="text-gray-600">
              This card has hover effects and transforms.
            </p>
          </div>
        </div>
      </div>

      {/* Section Variants Test */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Section Variants</h3>
        <div className="space-y-2">
          <div className="section-light p-4 rounded-lg">
            <p className="font-medium">Light Section</p>
            <p className="text-sm opacity-75">Background: #F8F9FA</p>
          </div>
          <div className="section-dark p-4 rounded-lg">
            <p className="font-medium">Dark Section</p>
            <p className="text-sm opacity-75">Background: #102642</p>
          </div>
          <div className="section-teal p-4 rounded-lg">
            <p className="font-medium">Teal Section</p>
            <p className="text-sm opacity-75">Background: #2D9B8A</p>
          </div>
        </div>
      </div>

      {/* Typography Test */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Typography</h3>
        <div className="space-y-2">
          <h1>Heading 1 - Large Title</h1>
          <h2>Heading 2 - Section Title</h2>
          <h3>Heading 3 - Subsection</h3>
          <p>Regular paragraph text with proper line height and spacing.</p>
          <p className="text-sm">
            Small text for captions and secondary information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;
