# Environment Variables Quick Reference

Quick reference card for environment variable configuration. For detailed documentation, see [ENV_SETUP.md](./ENV_SETUP.md).

## Required Variables

| Variable | Type | Example | Description |
|----------|------|---------|-------------|
| `VITE_INTENT_ENDPOINT` | URL | `https://api.example.com/intent` | Form submission API endpoint |
| `VITE_SCHEDULING_URL` | URL | `https://calendly.com/example` | Scheduling system URL |

## Optional Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_PROPOSAL_DEADLINE` | ISO 8601 | `2026-05-22T23:59:59-03:00` | Countdown deadline |
| `VITE_GA_TRACKING_ID` | String | Empty | Google Analytics ID (G-XXXXXXXXXX) |
| `VITE_HOTJAR_ID` | String | Empty | Hotjar site ID (numeric) |
| `VITE_APP_URL` | URL | `https://example.com` | Application base URL |
| `VITE_SOURCEMAP` | Boolean | `false` | Enable production source maps |
| `VITE_DEBUG_MODE` | Boolean | `false` | Enable debug logging |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | Boolean | `true` | Enable performance tracking |

## Quick Setup Commands

```bash
# Copy example file
cp .env.example .env.local

# Validate configuration
npm run validate-env

# Build with validation
npm run build:production
```

## Environment Files

| File | Purpose | Commit? |
|------|---------|---------|
| `.env.example` | Template with placeholders | ✅ Yes |
| `.env.production.example` | Production template | ✅ Yes |
| `.env.local` | Local development config | ❌ No |
| `.env.production` | Production config | ❌ No |
| `.env.staging` | Staging config | ❌ No |

## Common Issues

### Variables not loading
- Ensure names start with `VITE_`
- Restart dev server after changes
- Check file is named `.env.local`

### Analytics not tracking
- Verify tracking ID format
- Check browser console for errors
- Disable ad blockers for testing

### Build fails
- Run `npm run validate-env`
- Check all required variables are set
- Verify URL formats are correct

## Platform-Specific Setup

### Netlify
```
Site Settings → Environment Variables → Add variables
```

### Vercel
```
Project Settings → Environment Variables → Add variables
```

### GitHub Actions
```yaml
env:
  VITE_INTENT_ENDPOINT: ${{ secrets.INTENT_ENDPOINT }}
  VITE_SCHEDULING_URL: ${{ secrets.SCHEDULING_URL }}
```

## Testing Configuration

```bash
# Development
VITE_INTENT_ENDPOINT=http://localhost:3000/api/intent
VITE_DEBUG_MODE=true

# Staging
VITE_INTENT_ENDPOINT=https://api-staging.example.com/intent
VITE_GA_TRACKING_ID=G-STAGING123

# Production
VITE_INTENT_ENDPOINT=https://api.example.com/intent
VITE_GA_TRACKING_ID=G-PROD123XYZ
VITE_DEBUG_MODE=false
```

## Security Checklist

- [ ] Never commit `.env.local` or `.env.production`
- [ ] Use different endpoints for dev/staging/prod
- [ ] Rotate API keys regularly
- [ ] Limit access to production configs
- [ ] Monitor for suspicious activity

## Support

- **Full Documentation:** [ENV_SETUP.md](./ENV_SETUP.md)
- **Deployment Guide:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Technical Support:** rafaeldias@lavitacode.com.br
