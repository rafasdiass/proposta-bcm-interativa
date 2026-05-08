#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 *
 * Validates that required environment variables are set before building
 * for production. This helps catch configuration issues early.
 *
 * Usage:
 *   node scripts/validate-env.js
 *   npm run validate-env
 */

const requiredVars = [
  'VITE_INTENT_ENDPOINT',
  'VITE_SCHEDULING_URL',
];

const optionalVars = [
  'VITE_PROPOSAL_DEADLINE',
  'VITE_GA_TRACKING_ID',
  'VITE_HOTJAR_ID',
  'VITE_APP_URL',
  'VITE_SOURCEMAP',
  'VITE_DEBUG_MODE',
  'VITE_ENABLE_PERFORMANCE_MONITORING',
];

const errors = [];
const warnings = [];

console.log('🔍 Validating environment configuration...\n');

// Check required variables
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    errors.push(`❌ Missing required variable: ${varName}`);
  } else {
    console.log(`✅ ${varName}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
  }
});

// Check optional variables
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    warnings.push(`⚠️  Optional variable not set: ${varName}`);
  } else {
    console.log(`✅ ${varName}: ${value.substring(0, 50)}${value.length > 50 ? '...' : ''}`);
  }
});

// Validate URL formats
const urlVars = ['VITE_INTENT_ENDPOINT', 'VITE_SCHEDULING_URL', 'VITE_APP_URL'];
urlVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    try {
      new URL(value);
    } catch (e) {
      errors.push(`❌ Invalid URL format for ${varName}: ${value}`);
    }
  }
});

// Validate date format for deadline
const deadline = process.env.VITE_PROPOSAL_DEADLINE;
if (deadline) {
  try {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) {
      errors.push(`❌ Invalid date format for VITE_PROPOSAL_DEADLINE: ${deadline}`);
    } else if (date < new Date()) {
      warnings.push(`⚠️  VITE_PROPOSAL_DEADLINE is in the past: ${deadline}`);
    }
  } catch (e) {
    errors.push(`❌ Invalid date format for VITE_PROPOSAL_DEADLINE: ${deadline}`);
  }
}

// Validate GA tracking ID format
const gaId = process.env.VITE_GA_TRACKING_ID;
if (gaId && !gaId.match(/^G-[A-Z0-9]+$/)) {
  warnings.push(`⚠️  VITE_GA_TRACKING_ID format looks incorrect (should be G-XXXXXXXXXX): ${gaId}`);
}

// Validate Hotjar ID format
const hotjarId = process.env.VITE_HOTJAR_ID;
if (hotjarId && !hotjarId.match(/^\d+$/)) {
  warnings.push(`⚠️  VITE_HOTJAR_ID should be numeric: ${hotjarId}`);
}

// Print results
console.log('\n' + '='.repeat(60));

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:\n');
  warnings.forEach(warning => console.log(warning));
}

if (errors.length > 0) {
  console.log('\n❌ Errors:\n');
  errors.forEach(error => console.log(error));
  console.log('\n💡 See ENV_SETUP.md for configuration guidance.\n');
  process.exit(1);
}

console.log('\n✅ Environment configuration is valid!\n');
process.exit(0);
