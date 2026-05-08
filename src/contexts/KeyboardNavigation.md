# Keyboard Navigation System

## Overview

The Interactive BCM Proposal application includes a comprehensive keyboard navigation system that allows users to navigate through the presentation using keyboard shortcuts while maintaining proper focus management and accessibility compliance.

## Implementation

The keyboard navigation system is implemented in the `NavigationProvider` component and provides full keyboard control for the presentation mode.

### Supported Keyboard Controls

#### Navigation Keys (Presentation Mode Only)

| Key | Action | Description |
|-----|--------|-------------|
| `ArrowRight` | Next Section | Navigate to the next section |
| `ArrowLeft` | Previous Section | Navigate to the previous section |
| `PageDown` | Next Section | Navigate to the next section (alternative) |
| `PageUp` | Previous Section | Navigate to the previous section (alternative) |
| `Space` | Next Section | Navigate to the next section (alternative) |
| `Home` | First Section | Jump to the first section (section 0) |
| `End` | Last Section | Jump to the last section (section 21) |
| `Escape` | Exit Presentation | Return to landing mode |

#### Behavior Rules

1. **Mode Restriction**: Keyboard navigation only works in presentation mode
2. **Boundary Handling**: Navigation is bounded (cannot go below 0 or above total sections - 1)
3. **Event Prevention**: Navigation keys have their default behavior prevented in presentation mode
4. **Focus Management**: Focus is maintained appropriately during navigation

### Architecture

#### Core Components

1. **NavigationProvider**: Main context provider with keyboard event handling
2. **NavigationState**: State management for current mode and section
3. **Navigation Utilities**: Helper functions for scrolling and URL management

#### Key Features

- **Event Listener Management**: Automatic setup and cleanup of keyboard event listeners
- **State Synchronization**: URL fragment updates reflect current section
- **Accessibility Compliance**: WCAG AA compliant keyboard navigation
- **Focus Management**: Proper focus handling without focus traps

### Code Structure

```typescript
// Keyboard event handler in NavigationProvider
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    // Only handle keyboard navigation in presentation mode
    if (state.mode !== 'presentation') return;

    // Prevent default behavior for navigation keys
    const navigationKeys = [
      'ArrowRight', 'ArrowLeft', 'PageDown', 'PageUp', 
      'Space', 'Home', 'End', 'Escape'
    ];

    if (navigationKeys.includes(event.code)) {
      event.preventDefault();
    }

    // Handle navigation based on key
    switch (event.code) {
      case 'ArrowRight':
      case 'PageDown':
      case 'Space':
        actions.nextSection();
        break;
      // ... other cases
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [state.mode, state.totalSections, actions]);
```

### Testing

The keyboard navigation system includes comprehensive testing:

#### Unit Tests (`NavigationProvider.test.tsx`)
- Basic navigation functionality
- Mode switching behavior
- Section boundary handling
- URL fragment management
- Transition state management

#### Property-Based Tests (`NavigationProvider.property.test.tsx`)
- Section bounds maintenance across random key sequences
- Home/End key consistency
- Forward/backward navigation consistency
- Escape key behavior
- Boundary idempotence

#### Accessibility Tests (`KeyboardAccessibility.test.tsx`)
- Focus management during navigation
- Interactive element accessibility
- Event handling specificity
- ARIA attribute maintenance
- Semantic structure preservation

### Accessibility Features

#### WCAG AA Compliance
- **Keyboard Navigation**: Full keyboard accessibility without mouse dependency
- **Focus Management**: Visible focus indicators and proper focus flow
- **Event Handling**: Appropriate event prevention without breaking other interactions
- **Screen Reader Support**: Compatible with assistive technologies

#### Focus Management
- Focus is maintained during section transitions
- Interactive elements remain accessible via Tab navigation
- No focus traps that prevent normal page interaction
- Focus indicators are always visible

#### Reduced Motion Support
- Respects `prefers-reduced-motion` user preference
- Smooth scrolling can be disabled for users with vestibular disorders
- Animations are optional and don't affect core functionality

### Integration Points

#### URL Management
- Section changes update URL fragments (`#secao-N`)
- Browser back/forward buttons work correctly
- Bookmarkable section positions
- Deep linking support

#### Mode Integration
- Seamless switching between landing and presentation modes
- State preservation across mode changes
- Consistent behavior regardless of entry method

#### Component Integration
- Works with all interactive components (forms, buttons, links)
- Doesn't interfere with normal component interactions
- Maintains component accessibility features

### Performance Considerations

#### Event Handling
- Single global event listener for efficiency
- Proper cleanup prevents memory leaks
- Event delegation for optimal performance

#### State Management
- Minimal re-renders through proper memoization
- Efficient state updates with useReducer
- Debounced URL updates to prevent excessive history entries

### Browser Compatibility

The keyboard navigation system is compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Usage Examples

#### Basic Navigation
```typescript
// User presses ArrowRight in presentation mode
// → Advances to next section
// → Updates URL fragment
// → Maintains focus appropriately

// User presses Home
// → Jumps to first section (0)
// → Updates URL to #secao-0

// User presses Escape
// → Returns to landing mode
// → Preserves current section position
```

#### Integration with Components
```typescript
function MyComponent() {
  const { state, actions } = useNavigation();
  
  return (
    <div>
      {state.mode === 'presentation' && (
        <div>
          <p>Use arrow keys to navigate</p>
          <p>Press Escape to exit presentation mode</p>
        </div>
      )}
    </div>
  );
}
```

### Troubleshooting

#### Common Issues

1. **Navigation not working**: Ensure you're in presentation mode
2. **Focus issues**: Check that interactive elements have proper tabindex
3. **Event conflicts**: Verify no other components are preventing default on navigation keys

#### Debug Information

The navigation state can be inspected using React DevTools:
- Current mode (landing/presentation)
- Current section index
- Total sections count
- Transition state

### Future Enhancements

Potential improvements for the keyboard navigation system:
- Customizable keyboard shortcuts
- Section preview on navigation
- Keyboard shortcut help overlay
- Voice navigation support
- Gesture navigation for touch devices

## Conclusion

The keyboard navigation system provides a robust, accessible, and user-friendly way to navigate through the Interactive BCM Proposal presentation. It follows web accessibility best practices and provides comprehensive keyboard support for all users, including those who rely on assistive technologies.