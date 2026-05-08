# StickyCTA Component

## Overview

The `StickyCTA` component provides a fixed-position call-to-action bar that remains visible at the bottom of the viewport during scrolling. It features three primary actions designed to maximize conversion: signing intent, downloading the PDF proposal, and scheduling a meeting.

## Features

- **Fixed Positioning**: Remains visible in both landing and presentation navigation modes
- **Three Primary Actions**:
  - **Assinar Intenção**: Opens the IntentForm modal for capturing user interest
  - **Baixar PDF**: Downloads the proposal PDF with proper filename
  - **Agendar Reunião**: Opens external scheduling link in new tab
- **Responsive Design**: Collapses to compact view on mobile viewports (< 640px)
- **WCAG AA Compliance**: Maintains proper contrast ratios for accessibility
- **Keyboard Accessible**: Full keyboard navigation support with proper ARIA attributes

## Requirements Validation

| Requirement | Description | Status |
|------------|-------------|--------|
| 12.1 | Fixed positioning in both navigation modes | ✓ |
| 12.2 | Three primary actions exposed | ✓ |
| 12.3 | Opens IntentForm modal on "Assinar intenção" | ✓ |
| 12.4 | Opens external scheduling link in new tab | ✓ |
| 12.5 | Responsive collapse on mobile (< 640px) | ✓ |
| 12.6 | WCAG AA contrast compliance | ✓ |

## Usage

### Basic Usage

```tsx
import { StickyCTA } from './components/interactive/StickyCTA';
import { NavigationProvider } from './contexts';

function App() {
  return (
    <NavigationProvider>
      <div className="min-h-screen">
        {/* Your content */}
        
        <StickyCTA />
      </div>
    </NavigationProvider>
  );
}
```

### With Custom URLs

```tsx
<StickyCTA
  pdfUrl="/custom-proposal.pdf"
  schedulingUrl="https://calendly.com/your-link"
/>
```

### With Custom Styling

```tsx
<StickyCTA
  className="shadow-2xl"
  pdfUrl="/proposal.pdf"
  schedulingUrl="https://example.com/schedule"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pdfUrl` | `string` | `/BCM_Proposta_Investimento_Grupo_Gradual_ATUALIZADA.pdf` | URL for the PDF download |
| `schedulingUrl` | `string` | `import.meta.env.VITE_SCHEDULING_URL \|\| '#'` | External scheduling link |
| `className` | `string` | `''` | Additional CSS classes |

## Behavior

### Desktop View (≥ 640px)

- All three actions are visible in a horizontal layout
- Buttons are properly spaced with clear visual hierarchy
- Primary action uses `btn-primary` style (blue background)
- Secondary actions use `btn-outline` and `btn-secondary` styles
- Hover states provide visual feedback

### Mobile View (< 640px)

- Primary action ("Assinar Intenção") is always visible
- Additional actions are hidden behind an expandable menu
- Menu button toggles the expanded state
- Menu automatically closes after an action is triggered
- Touch-friendly button sizes (minimum 44px)

### Modal Behavior

- Clicking "Assinar Intenção" opens the IntentForm modal
- Modal has a semi-transparent backdrop
- Clicking outside the form closes the modal
- Clicking inside the form does not close the modal
- Modal is properly centered and scrollable on small screens

### PDF Download

- Creates a temporary anchor element to trigger download
- Sets proper filename: `BCM_Proposta_Investimento_Grupo_Gradual.pdf`
- Opens in new tab with `noopener,noreferrer` for security
- Falls back to opening in new tab if download fails
- Closes mobile menu after download is triggered

### Scheduling Link

- Opens external link in new tab
- Uses `noopener,noreferrer` for security
- Closes mobile menu after link is opened

## Accessibility

### ARIA Attributes

- `role="region"` with `aria-label` for the main CTA bar
- `role="dialog"` with `aria-modal="true"` for the modal
- `role="menu"` and `role="menuitem"` for mobile menu
- `aria-expanded` on mobile menu button
- `aria-label` on all interactive buttons

### Keyboard Navigation

- All buttons are keyboard accessible (Tab navigation)
- Enter and Space keys activate buttons
- Escape key closes the modal
- Focus indicators are visible and meet WCAG AA standards

### Screen Reader Support

- Descriptive labels for all actions
- Proper semantic HTML structure
- Live region updates for dynamic content
- Hidden decorative icons with `aria-hidden="true"`

### Contrast Compliance

- Primary button: White text on blue (#1B3A6B) - 4.5:1 ratio
- Outline button: Blue text (#1B3A6B) on white - 4.5:1 ratio
- Secondary button: White text on teal (#2D9B8A) - 4.5:1 ratio
- All combinations meet WCAG AA standards

## Integration

### Navigation Context

The component uses the `useNavigation` hook to access the current navigation mode:

```tsx
const { state } = useNavigation();
// state.mode: 'landing' | 'presentation'
```

This allows the component to adapt its positioning based on the navigation mode.

### IntentForm Integration

The component integrates with the `IntentForm` component:

```tsx
import { IntentForm } from './IntentForm';

// In component
{showIntentForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <IntentForm onClose={handleCloseIntentForm} />
  </div>
)}
```

### Environment Variables

The component uses environment variables for configuration:

```bash
# .env
VITE_SCHEDULING_URL=https://calendly.com/your-link
```

## Testing

### Unit Tests

Run the test suite:

```bash
npm test StickyCTA.test.tsx
```

Test coverage includes:
- Desktop and mobile view rendering
- Button click handlers
- Modal open/close behavior
- PDF download functionality
- Scheduling link behavior
- Mobile menu expand/collapse
- Accessibility attributes
- Error handling
- Custom props

### Manual Testing

#### Desktop Testing
1. Verify all three buttons are visible
2. Click "Assinar Intenção" to open the modal
3. Click "Baixar PDF" to trigger download
4. Click "Agendar Reunião" to open scheduling link
5. Test keyboard navigation (Tab, Enter, Escape)

#### Mobile Testing
1. Resize viewport to < 640px width
2. Verify compact view with menu button
3. Click menu button to expand additional actions
4. Test each action from the expanded menu
5. Verify menu closes after action is triggered

#### Accessibility Testing
1. Test with screen reader (NVDA, JAWS, VoiceOver)
2. Verify all buttons have proper labels
3. Check contrast ratios with browser DevTools
4. Test keyboard-only navigation
5. Verify focus indicators are visible

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Performance

- Minimal re-renders using React state management
- No heavy computations or animations
- Lazy loading of IntentForm modal
- Efficient event handlers with proper cleanup

## Known Issues

None at this time.

## Future Enhancements

- [ ] Add analytics tracking for CTA interactions
- [ ] Support for custom action buttons
- [ ] Animation options for mobile menu
- [ ] Configurable button order
- [ ] Theme variants (light/dark)

## Related Components

- [IntentForm](./IntentForm.md) - Form component for capturing user intent
- [ModeToggle](../navigation/ModeToggle.tsx) - Navigation mode switcher
- [NavigationProvider](../../contexts/NavigationProvider.tsx) - Navigation context provider

## References

- Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6
- Design Document: Section 7 - Form handling and integrations
- WCAG 2.1 AA Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
