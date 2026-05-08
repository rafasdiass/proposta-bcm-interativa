# Environment Configuration Guide

This document provides comprehensive guidance for configuring environment variables for the Interactive BCM Proposal application.

## Table of Contents

- [Quick Start](#quick-start)
- [Environment Variables Reference](#environment-variables-reference)
- [Configuration by Environment](#configuration-by-environment)
- [Analytics Integration](#analytics-integration)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure required variables:**
   - `VITE_INTENT_ENDPOINT` - Your form submission API endpoint
   - `VITE_SCHEDULING_URL` - Your scheduling system URL (Calendly, etc.)

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Variables Reference

### Required Variables

#### `VITE_INTENT_ENDPOINT`
- **Type:** URL string
- **Required:** Yes
- **Default:** `/api/intent`
- **Description:** API endpoint where intent form submissions are sent
- **Example:** `https://api.lavitacode.com.br/proposals/intent`
- **Requirements:** 13.2 (Form submission to configurable endpoint)

**Usage:**
```typescript
// Automatically used by IntentForm component
import { appConfig } from '@/data/config';
const endpoint = appConfig.endpoints.intentSubmission;
```

#### `VITE_SCHEDULING_URL`
- **Type:** URL string
- **Required:** Yes
- **Default:** `https://calendly.com/lavitacode`
- **Description:** External scheduling system URL for meeting bookings
- **Example:** `https://calendly.com/lavitacode/bcm-proposal`

**Usage:**
```typescript
// Used by StickyCTA component
import { appConfig } from '@/data/config';
const schedulingUrl = appConfig.endpoints.schedulingLink;
```

### Optional Variables

#### `VITE_PROPOSAL_DEADLINE`
- **Type:** ISO 8601 datetime string with timezone
- **Required:** No
- **Default:** `2026-05-22T23:59:59-03:00`
- **Description:** Proposal validity deadline for countdown timer
- **Format:** `YYYY-MM-DDTHH:mm:ss±HH:mm`
- **Requirements:** 7.1 (Countdown timer with configurable deadline)

**Examples:**
```bash
# May 22, 2026 at 23:59:59 in São Paulo (UTC-3)
VITE_PROPOSAL_DEADLINE=2026-05-22T23:59:59-03:00

# December 31, 2025 at 18:00:00 in São Paulo
VITE_PROPOSAL_DEADLINE=2025-12-31T18:00:00-03:00

# Using UTC timezone
VITE_PROPOSAL_DEADLINE=2026-05-23T02:59:59Z
```

**Usage:**
```typescript
// Automatically used by CountdownTimer component
import { appConfig } from '@/data/config';
const deadline = appConfig.proposal.validUntil;
```

#### `VITE_GA_TRACKING_ID`
- **Type:** String (Google Analytics 4 Measurement ID)
- **Required:** No
- **Default:** Empty (analytics disabled)
- **Format:** `G-XXXXXXXXXX`
- **Description:** Google Analytics 4 tracking ID for user behavior analytics

**How to get:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property or use existing one
3. Navigate to Admin → Data Streams → Web
4. Copy the Measurement ID (starts with `G-`)

**Example:**
```bash
VITE_GA_TRACKING_ID=G-ABC123XYZ
```

#### `VITE_HOTJAR_ID`
- **Type:** String (numeric)
- **Required:** No
- **Default:** Empty (Hotjar disabled)
- **Format:** Numeric ID (e.g., `1234567`)
- **Description:** Hotjar site ID for heatmaps and session recordings

**How to get:**
1. Go to [Hotjar](https://insights.hotjar.com/)
2. Create a new site or use existing one
3. Navigate to Sites & Organizations
4. Copy the Site ID (numeric value)

**Example:**
```bash
VITE_HOTJAR_ID=3456789
```

#### `VITE_APP_URL`
- **Type:** URL string
- **Required:** No
- **Default:** `https://example.com`
- **Description:** Base URL of the application for canonical URLs and social sharing
- **Example:** `https://proposta-bcm.lavitacode.com.br`

#### `VITE_SOURCEMAP`
- **Type:** Boolean string (`true` or `false`)
- **Required:** No
- **Default:** `false`
- **Description:** Enable source maps in production builds for debugging
- **Note:** Set to `true` for debugging, `false` for smaller bundles

#### `VITE_DEBUG_MODE`
- **Type:** Boolean string (`true` or `false`)
- **Required:** No
- **Default:** `false` (automatically `true` in development)
- **Description:** Enable debug logging in console

#### `VITE_ENABLE_PERFORMANCE_MONITORING`
- **Type:** Boolean string (`true` or `false`)
- **Required:** No
- **Default:** `true`
- **Description:** Enable performance monitoring and metrics collection

## Configuration by Environment

### Development Environment

Create `.env.local` for local development:

```bash
# Development configuration
VITE_INTENT_ENDPOINT=http://localhost:3000/api/intent
VITE_SCHEDULING_URL=https://calendly.com/lavitacode-dev
VITE_PROPOSAL_DEADLINE=2026-05-22T23:59:59-03:00

# Analytics disabled in development
VITE_GA_TRACKING_ID=
VITE_HOTJAR_ID=

# Development settings
VITE_APP_URL=http://localhost:5173
VITE_DEBUG_MODE=true
VITE_ENABLE_PERFORMANCE_MONITORING=false
```

### Staging Environment

Create `.env.staging` for staging/preview deployments:

```bash
# Staging configuration
VITE_INTENT_ENDPOINT=https://api-staging.lavitacode.com.br/proposals/intent
VITE_SCHEDULING_URL=https://calendly.com/lavitacode-staging
VITE_PROPOSAL_DEADLINE=2026-05-22T23:59:59-03:00

# Test analytics IDs
VITE_GA_TRACKING_ID=G-STAGING123
VITE_HOTJAR_ID=9999999

# Staging settings
VITE_APP_URL=https://staging-proposta-bcm.lavitacode.com.br
VITE_SOURCEMAP=true
VITE_DEBUG_MODE=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Production Environment

Create `.env.production` for production deployments:

```bash
# Production configuration
VITE_INTENT_ENDPOINT=https://api.lavitacode.com.br/proposals/intent
VITE_SCHEDULING_URL=https://calendly.com/lavitacode/bcm-proposal
VITE_PROPOSAL_DEADLINE=2026-05-22T23:59:59-03:00

# Production analytics
VITE_GA_TRACKING_ID=G-PROD123XYZ
VITE_HOTJAR_ID=1234567

# Production settings
VITE_APP_URL=https://proposta-bcm.lavitacode.com.br
VITE_SOURCEMAP=false
VITE_DEBUG_MODE=false
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

## Analytics Integration

### Google Analytics 4 Setup

1. **Create GA4 Property:**
   - Go to [Google Analytics](https://analytics.google.com/)
   - Click "Admin" → "Create Property"
   - Follow the setup wizard
   - Select "Web" as platform

2. **Get Measurement ID:**
   - Navigate to Admin → Data Streams
   - Click on your web stream
   - Copy the Measurement ID (format: `G-XXXXXXXXXX`)

3. **Configure Environment:**
   ```bash
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

4. **Verify Installation:**
   - Build and deploy your application
   - Visit your site
   - Check GA4 Realtime reports to see active users

### Hotjar Setup

1. **Create Hotjar Site:**
   - Go to [Hotjar](https://insights.hotjar.com/)
   - Click "Add new site"
   - Enter your site URL
   - Complete the setup

2. **Get Site ID:**
   - Navigate to Sites & Organizations
   - Find your site and copy the numeric Site ID

3. **Configure Environment:**
   ```bash
   VITE_HOTJAR_ID=1234567
   ```

4. **Verify Installation:**
   - Build and deploy your application
   - Visit your site
   - Check Hotjar dashboard for tracking status

### Analytics Events Tracked

The application automatically tracks the following events:

- **Navigation:**
  - Section views (landing and presentation modes)
  - Mode switches (landing ↔ presentation)

- **Engagement:**
  - Calculator interactions (ROI, Softhouse)
  - Module card expansions
  - Protocol selector changes
  - Objection accordion views
  - Countdown timer urgency (when < 72 hours)

- **Conversion:**
  - CTA clicks (sign intent, download PDF, schedule meeting)
  - Form submissions (success/failure)
  - PDF downloads

### Privacy Considerations

- **IP Anonymization:** Enabled by default in GA4 configuration
- **LGPD Compliance:** Intent form includes explicit consent
- **Cookie Consent:** Consider adding a cookie consent banner for EU/BR compliance
- **Data Retention:** Configure in GA4 settings (recommended: 14 months)

## Production Deployment

### Netlify Deployment

1. **Configure Environment Variables:**
   - Go to Site Settings → Environment Variables
   - Add all required variables from `.env.production`

2. **Build Command:**
   ```bash
   npm run build
   ```

3. **Publish Directory:**
   ```
   dist
   ```

4. **Environment Variables in Netlify UI:**
   ```
   VITE_INTENT_ENDPOINT=https://api.lavitacode.com.br/proposals/intent
   VITE_SCHEDULING_URL=https://calendly.com/lavitacode/bcm-proposal
   VITE_PROPOSAL_DEADLINE=2026-05-22T23:59:59-03:00
   VITE_GA_TRACKING_ID=G-PROD123XYZ
   VITE_HOTJAR_ID=1234567
   VITE_APP_URL=https://proposta-bcm.lavitacode.com.br
   ```

### Vercel Deployment

1. **Configure Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add variables for Production, Preview, and Development

2. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables in Vercel UI:**
   - Same as Netlify configuration above

### Custom Server Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set environment variables on server:**
   ```bash
   export VITE_INTENT_ENDPOINT=https://api.lavitacode.com.br/proposals/intent
   export VITE_SCHEDULING_URL=https://calendly.com/lavitacode/bcm-proposal
   # ... other variables
   ```

3. **Serve the `dist` directory:**
   ```bash
   # Using a simple HTTP server
   npx serve dist -p 3000
   
   # Or configure your web server (Nginx, Apache, etc.)
   ```

## Troubleshooting

### Issue: Environment variables not loading

**Symptoms:**
- Variables show as `undefined`
- Default values are used instead of configured values

**Solutions:**
1. Ensure variable names start with `VITE_` prefix
2. Restart development server after changing `.env.local`
3. Check file is named exactly `.env.local` (not `.env.local.txt`)
4. Verify file is in project root directory

### Issue: Analytics not tracking

**Symptoms:**
- No data in Google Analytics
- Hotjar shows "Not installed"

**Solutions:**
1. Verify tracking IDs are correct format:
   - GA4: `G-XXXXXXXXXX` (starts with `G-`)
   - Hotjar: Numeric ID only
2. Check browser console for errors
3. Disable ad blockers for testing
4. Wait 24-48 hours for data to appear in analytics dashboards
5. Use GA4 Realtime reports for immediate verification

### Issue: Form submission fails

**Symptoms:**
- Form shows error message
- Network errors in console

**Solutions:**
1. Verify `VITE_INTENT_ENDPOINT` is accessible
2. Check CORS configuration on API server
3. Ensure API endpoint accepts POST requests
4. Verify API expects JSON content type
5. Check API authentication requirements

### Issue: Countdown timer shows wrong time

**Symptoms:**
- Timer shows incorrect deadline
- Timer immediately shows "expired"

**Solutions:**
1. Verify `VITE_PROPOSAL_DEADLINE` format is correct (ISO 8601)
2. Include timezone offset (e.g., `-03:00` for São Paulo)
3. Check server time is synchronized
4. Verify date is in the future

### Issue: PDF download not working

**Symptoms:**
- 404 error when downloading PDF
- PDF link is broken

**Solutions:**
1. Verify PDF file exists in `public/` directory
2. Check filename matches exactly (case-sensitive)
3. Ensure build process copies public files to dist
4. Check server MIME type configuration for `.pdf` files

### Issue: Build fails with environment variable errors

**Symptoms:**
- TypeScript errors about undefined variables
- Build process exits with error

**Solutions:**
1. Ensure all required variables are defined in build environment
2. Check `.env.production` file exists for production builds
3. Verify hosting platform has environment variables configured
4. Use default values in code for optional variables

## Security Best Practices

1. **Never commit `.env.local` or `.env.production` to version control**
   - These files are in `.gitignore` by default
   - Only commit `.env.example` with placeholder values

2. **Use different API endpoints for different environments**
   - Development: Local or staging API
   - Production: Production API with proper authentication

3. **Rotate API keys regularly**
   - Update analytics tracking IDs if compromised
   - Change API endpoints if security breach occurs

4. **Limit access to production environment variables**
   - Only authorized team members should access production configs
   - Use hosting platform's access control features

5. **Monitor analytics for suspicious activity**
   - Check for unusual traffic patterns
   - Review form submissions for spam or abuse

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [Google Analytics 4 Setup Guide](https://support.google.com/analytics/answer/9304153)
- [Hotjar Installation Guide](https://help.hotjar.com/hc/en-us/articles/115011639927)
- [ISO 8601 Date Format Reference](https://en.wikipedia.org/wiki/ISO_8601)
- [LGPD Compliance Guide](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

## Support

For questions or issues with environment configuration:

- **Technical Support:** rafaeldias@lavitacode.com.br
- **Project Documentation:** See `README.md` and `design.md`
- **Spec Requirements:** See `.kiro/specs/proposta-bcm-interativa/requirements.md`
