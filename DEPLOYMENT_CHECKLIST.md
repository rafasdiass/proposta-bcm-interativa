# Production Deployment Checklist

Use this checklist to ensure a smooth production deployment of the Interactive BCM Proposal application.

## Pre-Deployment

### 1. Environment Configuration

- [ ] Copy `.env.production.example` to `.env.production`
- [ ] Configure `VITE_INTENT_ENDPOINT` with production API endpoint
- [ ] Configure `VITE_SCHEDULING_URL` with production scheduling link
- [ ] Set `VITE_PROPOSAL_DEADLINE` to correct deadline date
- [ ] Add `VITE_GA_TRACKING_ID` (Google Analytics)
- [ ] Add `VITE_HOTJAR_ID` (Hotjar)
- [ ] Set `VITE_APP_URL` to production domain
- [ ] Set `VITE_SOURCEMAP=false` for production
- [ ] Set `VITE_DEBUG_MODE=false` for production
- [ ] Set `VITE_ENABLE_PERFORMANCE_MONITORING=true`

### 2. Code Quality

- [ ] Run `npm run lint` - no errors
- [ ] Run `npm run type-check` - no TypeScript errors
- [ ] Run `npm run format:check` - code is properly formatted
- [ ] Run `npm run test:run` - all tests pass
- [ ] Review code changes since last deployment

### 3. Content Verification

- [ ] PDF file exists in `public/` directory
- [ ] PDF filename matches: `BCM_Proposta_Investimento_Grupo_Gradual_ATUALIZADA.pdf`
- [ ] All section content is up to date
- [ ] Calculator default values are correct
- [ ] Contact information is current

### 4. Build Verification

- [ ] Run `npm run validate-env` - environment is valid
- [ ] Run `npm run build` - build succeeds without errors
- [ ] Check `dist/` directory size (should be < 5MB)
- [ ] Verify PDF is in `dist/` root directory
- [ ] Run `npm run preview` - preview build works locally

## Deployment

### 5. Hosting Platform Configuration

#### Netlify
- [ ] Environment variables configured in Netlify UI
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Node version: 20
- [ ] Deploy previews enabled for pull requests

#### Vercel
- [ ] Environment variables configured in Vercel UI
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Node version: 20
- [ ] Preview deployments enabled

#### Custom Server
- [ ] Environment variables set on server
- [ ] Web server configured (Nginx/Apache)
- [ ] HTTPS certificate installed
- [ ] Firewall rules configured
- [ ] CDN configured (if applicable)

### 6. DNS and Domain

- [ ] Domain DNS records configured
- [ ] SSL/TLS certificate active
- [ ] HTTPS redirect enabled
- [ ] WWW redirect configured (if needed)
- [ ] Domain propagation verified

### 7. Deploy

- [ ] Push code to production branch
- [ ] Trigger deployment (automatic or manual)
- [ ] Monitor deployment logs for errors
- [ ] Wait for deployment to complete
- [ ] Verify deployment status is "success"

## Post-Deployment

### 8. Functional Testing

- [ ] Visit production URL - site loads correctly
- [ ] Test landing mode navigation - scrolling works
- [ ] Test presentation mode - slide navigation works
- [ ] Test mode switching - transitions are smooth
- [ ] Test PDF download - file downloads correctly
- [ ] Test intent form submission - form submits successfully
- [ ] Test scheduling link - opens correct calendar
- [ ] Test all interactive calculators - calculations are correct
- [ ] Test countdown timer - shows correct time remaining
- [ ] Test module cards - expand/collapse works
- [ ] Test protocol selector - switching works
- [ ] Test objection accordion - items expand correctly

### 9. Cross-Browser Testing

- [ ] Chrome (latest) - all features work
- [ ] Firefox (latest) - all features work
- [ ] Safari (latest) - all features work
- [ ] Edge (latest) - all features work
- [ ] Mobile Safari (iOS) - responsive and functional
- [ ] Chrome Mobile (Android) - responsive and functional

### 10. Responsive Testing

- [ ] Mobile (320px-767px) - layout adapts correctly
- [ ] Tablet (768px-1023px) - layout adapts correctly
- [ ] Desktop (1024px+) - full layout displays correctly
- [ ] Touch interactions work on mobile/tablet
- [ ] Sticky CTA is accessible on all screen sizes

### 11. Performance Verification

- [ ] Run Lighthouse audit - Performance score > 90
- [ ] First Contentful Paint < 2.5s
- [ ] Largest Contentful Paint < 4s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 5s
- [ ] Check bundle sizes in Network tab

### 12. Analytics Verification

- [ ] Google Analytics tracking code loads
- [ ] GA4 Realtime shows active users
- [ ] Hotjar tracking code loads
- [ ] Hotjar dashboard shows recordings
- [ ] Test event tracking (click CTA, submit form)
- [ ] Verify events appear in GA4 within 24 hours

### 13. Accessibility Testing

- [ ] Keyboard navigation works throughout site
- [ ] Screen reader announces content correctly
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Reduced motion preference is respected
- [ ] All interactive elements have proper ARIA labels

### 14. Security Verification

- [ ] HTTPS is enforced (no mixed content)
- [ ] Security headers are set (check with securityheaders.com)
- [ ] No sensitive data in client-side code
- [ ] API endpoints require authentication
- [ ] CORS is properly configured
- [ ] Rate limiting is in place for form submissions

### 15. Monitoring Setup

- [ ] Error tracking configured (Sentry, etc.)
- [ ] Uptime monitoring configured
- [ ] Performance monitoring active
- [ ] Analytics dashboards set up
- [ ] Alert notifications configured
- [ ] Backup strategy in place

## Rollback Plan

### If Issues Occur

1. **Immediate Actions:**
   - [ ] Document the issue with screenshots/logs
   - [ ] Notify stakeholders
   - [ ] Assess severity (critical/major/minor)

2. **Rollback Steps:**
   - [ ] Revert to previous deployment
   - [ ] Verify previous version works
   - [ ] Investigate issue in staging environment
   - [ ] Fix issue and redeploy

3. **Communication:**
   - [ ] Update status page (if applicable)
   - [ ] Notify users of any downtime
   - [ ] Document lessons learned

## Sign-Off

- [ ] Technical lead approval
- [ ] QA approval
- [ ] Product owner approval
- [ ] Deployment documented in changelog

## Post-Launch Monitoring (First 24 Hours)

- [ ] Monitor error rates
- [ ] Check analytics for traffic patterns
- [ ] Review form submission success rate
- [ ] Monitor server resources
- [ ] Check for any user-reported issues
- [ ] Verify all integrations are working

## Post-Launch Monitoring (First Week)

- [ ] Review analytics data
- [ ] Check conversion rates
- [ ] Analyze user behavior patterns
- [ ] Review performance metrics
- [ ] Gather user feedback
- [ ] Plan any necessary optimizations

---

**Deployment Date:** _________________

**Deployed By:** _________________

**Version:** _________________

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
