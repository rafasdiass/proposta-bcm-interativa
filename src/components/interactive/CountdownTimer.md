# CountdownTimer Component

## Overview

The `CountdownTimer` component displays a real-time countdown to a configurable deadline, with visual urgency indicators and proper state management. It's designed for the Interactive BCM Proposal to show the time remaining until the proposal expires.

## Features

- **Real-time Updates**: Updates every second with proper cleanup
- **Configurable Deadline**: Accepts custom deadline with sensible default (May 22, 2026)
- **Urgency Threshold**: Changes colors when less than 72 hours remain
- **Expired State**: Gracefully handles expired deadlines
- **Reduced Motion Support**: Respects user's motion preferences
- **Accessibility**: Proper ARIA labels and semantic HTML
- **Responsive Design**: Works on all screen sizes

## Usage

### Basic Usage

```tsx
import { CountdownTimer } from './components/interactive/CountdownTimer';

function App() {
  return <CountdownTimer />;
}
```

### Custom Deadline

```tsx
import { CountdownTimer } from './components/interactive/CountdownTimer';

function App() {
  const customDeadline = new Date('2026-12-31T23:59:59-03:00');
  
  return <CountdownTimer deadline={customDeadline} />;
}
```

### With Custom Styling

```tsx
import { CountdownTimer } from './components/interactive/CountdownTimer';

function App() {
  return <CountdownTimer className="my-custom-class" />;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `deadline` | `Date` | `new Date('2026-05-22T23:59:59-03:00')` | The target deadline for the countdown |
| `className` | `string` | `''` | Additional CSS classes to apply to the container |

## Behavior

### Time Display

The component displays four time units:
- **Days**: Total days remaining
- **Hours**: Hours remaining (0-23)
- **Minutes**: Minutes remaining (0-59)
- **Seconds**: Seconds remaining (0-59)

All values are formatted with leading zeros (e.g., "05" instead of "5").

### Color States

The component uses two color schemes based on urgency:

#### Normal State (> 72 hours remaining)
- **Color**: Blue (#1B3A6B)
- **Background**: Light blue (#EFF6FF)
- **Border**: Blue (#3B82F6)

#### Urgent State (≤ 72 hours remaining)
- **Color**: Amber (#F5A623)
- **Background**: Light amber (#FEF3C7)
- **Border**: Amber (#F59E0B)
- **Additional**: Displays urgency message
- **Animation**: Pulse effect (if motion not reduced)

#### Expired State
- **Color**: Red (#DC2626)
- **Background**: Light red (#FEE2E2)
- **Border**: Red (#EF4444)
- **Display**: "Proposta Expirada" message
- **Behavior**: Stops updating

### Reduced Motion

When the user has `prefers-reduced-motion: reduce` enabled:
- Decorative pulse animation is disabled
- A message is displayed acknowledging the preference
- Core functionality (time updates) continues normally

## Implementation Details

### State Management

The component uses React hooks for state management:
- `useState`: Manages countdown state (days, hours, minutes, seconds, isExpired)
- `useEffect`: Sets up and cleans up the interval timer
- `useReducedMotion`: Custom hook to detect motion preferences

### Performance

- **Memoization**: Time calculations are performed only when needed
- **Cleanup**: Interval is properly cleared on unmount
- **Conditional Updates**: Stops updating when expired

### Accessibility

- **ARIA Labels**: Each time unit has descriptive labels (e.g., "5 dias")
- **Semantic HTML**: Uses proper heading hierarchy
- **Screen Reader Support**: All content is accessible to screen readers
- **Keyboard Navigation**: No interactive elements, so no keyboard traps

## Requirements Validation

This component satisfies the following requirements from the specification:

- **Requirement 7.1**: Displays days, hours, minutes, and seconds to configurable deadline
- **Requirement 7.2**: Updates every second while deadline is in the future
- **Requirement 7.3**: Displays "Proposta Expirada" and stops updates when deadline passes
- **Requirement 7.4**: Uses amber color when ≤72 hours remain, blue otherwise
- **Requirement 7.6**: Respects prefers-reduced-motion by disabling decorative animations

## Testing

The component includes comprehensive unit tests covering:
- Correct time display for various deadlines
- Real-time updates every second
- Transition to expired state
- Color changes based on urgency threshold
- Reduced motion preference handling
- Edge cases (exactly 72 hours, just over 72 hours)
- Proper cleanup on unmount

Run tests with:
```bash
npm test -- CountdownTimer.test.tsx
```

## Examples

### Default Deadline
```tsx
<CountdownTimer />
```
Shows countdown to May 22, 2026, 23:59:59 (America/Sao_Paulo).

### Urgent Deadline (48 hours)
```tsx
<CountdownTimer deadline={new Date(Date.now() + 48 * 60 * 60 * 1000)} />
```
Shows countdown in amber with urgency message.

### Expired Deadline
```tsx
<CountdownTimer deadline={new Date(Date.now() - 1000)} />
```
Shows "Proposta Expirada" message.

## Related Components

- `ROISimulator`: Interactive ROI calculator
- `SofthouseCalculator`: Payback calculator
- `TrancheTimeline`: Investment timeline visualization

## Future Enhancements

Potential improvements for future iterations:
- Custom urgency threshold configuration
- Multiple urgency levels with different colors
- Sound notifications (with user permission)
- Timezone selection
- Pause/resume functionality
- Custom expired message
