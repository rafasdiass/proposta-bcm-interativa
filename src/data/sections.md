# Section Configuration System

## Overview

The section configuration system defines all 22 sections of the Interactive BCM Proposal application. Each section corresponds to a slide from the original proposal and includes configuration for routing, theming, and component rendering.

**Requirements:** 1.2, 2.6

## Architecture

### SectionConfig Interface

```typescript
interface SectionConfig {
  id: string;              // Unique identifier for the section
  slug: string;            // URL-safe slug for routing
  title: string;           // Display title
  variant: 'light' | 'dark' | 'teal';  // Theme variant
  component: React.ComponentType;      // Lazy-loaded component
  showHeader: boolean;     // Whether to show section header
  showFooter: boolean;     // Whether to show section footer
  order: number;           // Sequential order (0-21)
}
```

## All 22 Sections

The system includes all sections from the original proposal:

1. **Capa** (Cover) - Dark variant, no header/footer
2. **Resumo Executivo** (Executive Summary) - Light variant
3. **Urgência de Mercado** (Market Urgency) - Teal variant
4. **O que é o BCM** (What is BCM) - Light variant
5. **Produto - 12 Módulos** (Product Modules) - Light variant
6. **Tese Técnica - Kernel** (Technical Thesis) - Dark variant
7. **Protocolos Gradual** (Gradual Protocols) - Light variant
8. **OERA como Fundador** (OERA as Founder) - Teal variant
9. **Mercado & Receita** (Market & Revenue) - Light variant
10. **Projeções** (Projections) - Light variant
11. **Por que o Gradual** (Why Gradual) - Dark variant
12. **Time** (Team) - Light variant
13. **Proposta & Tranches** (Proposal & Tranches) - Teal variant
14. **Pagamento por Prova** (Payment Proof) - Light variant
15. **Retorno Esperado** (Expected Return) - Light variant
16. **Retorno Antes da Escala** (Pre-Scale Return) - Dark variant
17. **Governança** (Governance) - Light variant
18. **Plano de Execução** (Execution Plan) - Light variant
19. **Objeções** (Objections) - Teal variant
20. **Quadro de Decisão** (Decision Framework) - Light variant
21. **Termos Resumidos** (Summary Terms) - Dark variant
22. **Próximos Passos** (Next Steps) - Teal variant, no footer

## Theme Variants

### Light Variant
- Background: `#F8F9FA` (light base)
- Text: Dark gray
- Used for most content sections

### Dark Variant
- Background: `#102642` (dark base) with gradient to `#1B3A6B`
- Text: White
- Used for emphasis sections (cover, technical thesis, team, etc.)

### Teal Variant
- Background: Gradient from `#102642` to `#2D9B8A` (green-growth)
- Text: White
- Used for action-oriented sections (urgency, OERA, tranches, objections, next steps)

## Routing and Deep Linking

### URL Fragment Format

Sections are accessible via URL fragments:
```
#secao-{slug}
```

Examples:
- `#secao-capa` - Cover section
- `#secao-resumo-executivo` - Executive Summary
- `#secao-proposta-tranches` - Proposal & Tranches

### Navigation Functions

The system provides utility functions for section navigation:

```typescript
// Get section by ID
const section = getSectionById('capa');

// Get section by slug
const section = getSectionBySlug('resumo-executivo');

// Get section by index
const section = getSectionByIndex(0);

// Get total number of sections
const total = getTotalSections(); // Returns 22

// Get section index
const index = getSectionIndex('capa'); // Returns 0

// Navigate to next/previous section
const next = getNextSection('capa');
const prev = getPreviousSection('time');
```

## Component Loading

All section components are lazy-loaded for optimal performance:

```typescript
const CoverSection = lazy(() => import('@/components/sections/CoverSection'));
```

This ensures:
- Faster initial page load
- Reduced bundle size
- Better code splitting
- Improved performance

## Integration with Navigation System

The section configuration integrates seamlessly with the navigation system:

### Landing Mode
- All sections are rendered in sequence
- Scroll position determines current section
- URL fragment updates as user scrolls
- Intersection Observer tracks section visibility

### Presentation Mode
- Only current section is visible
- Keyboard navigation (Arrow keys, PageUp/Down, Space, Home, End, Esc)
- URL fragment updates on section change
- Focus management for accessibility

## Header and Footer Configuration

### Standard Sections
Most sections include both header and footer:
- **Header**: Section title + "BCM · LaVita Code" brand
- **Footer**: "Proposta de Parceria Estratégica · Confidencial"

### Special Cases
- **Cover (Capa)**: No header or footer
- **Next Steps (Próximos Passos)**: Header only, no footer

## Accessibility

The section configuration system ensures:

1. **Semantic HTML**: Each section uses `<section>` element
2. **ARIA Labels**: Sections are labeled with `aria-labelledby`
3. **Keyboard Navigation**: Full keyboard support in presentation mode
4. **Focus Management**: Proper focus handling when switching sections
5. **Screen Reader Support**: Proper landmarks and labels

## Performance Optimization

### Code Splitting
- Each section component is lazy-loaded
- Reduces initial bundle size
- Improves First Contentful Paint

### Intersection Observer
- Efficient scroll tracking in landing mode
- Minimal performance impact
- Respects reduced motion preferences

### Animation Queue
- Limits concurrent animations to 3 elements
- Prevents performance degradation
- Respects `prefers-reduced-motion`

## Testing

The section configuration system includes comprehensive tests:

### Unit Tests
- All 22 sections are defined
- Unique IDs and slugs
- Sequential order values (0-21)
- Valid variant values
- Proper header/footer configuration

### Integration Tests
- Section navigation works correctly
- URL fragment updates properly
- Deep linking functions correctly
- Keyboard navigation works in presentation mode

### Accessibility Tests
- Proper ARIA attributes
- Semantic HTML structure
- Focus management
- Screen reader compatibility

## Usage Examples

### Adding a New Section

To add a new section:

1. Create the section component:
```typescript
// src/components/sections/NewSection.tsx
export default function NewSection() {
  return <div>New Section Content</div>;
}
```

2. Add lazy import in `sections.ts`:
```typescript
const NewSection = lazy(() => import('@/components/sections/NewSection'));
```

3. Add configuration to `sectionConfigs`:
```typescript
{
  id: 'new-section',
  slug: 'new-section',
  title: 'New Section',
  variant: 'light',
  component: NewSection,
  showHeader: true,
  showFooter: true,
  order: 22, // Next available order
}
```

### Navigating to a Section

```typescript
import { useNavigation } from '@/contexts/useNavigation';
import { getSectionIndex } from '@/data/sections';

function MyComponent() {
  const { actions } = useNavigation();
  
  const goToProposal = () => {
    const index = getSectionIndex('proposta-tranches');
    actions.goToSection(index);
  };
  
  return <button onClick={goToProposal}>Ver Proposta</button>;
}
```

### Getting Current Section Info

```typescript
import { useNavigation } from '@/contexts/useNavigation';
import { getSectionByIndex } from '@/data/sections';

function CurrentSectionDisplay() {
  const { state } = useNavigation();
  const currentSection = getSectionByIndex(state.currentSection);
  
  return (
    <div>
      <h2>{currentSection?.title}</h2>
      <p>Section {state.currentSection + 1} of {state.totalSections}</p>
    </div>
  );
}
```

## Best Practices

1. **Always use utility functions** instead of directly accessing `sectionConfigs`
2. **Maintain sequential order** values when adding/removing sections
3. **Use semantic slugs** that match the section ID
4. **Lazy load components** for optimal performance
5. **Test thoroughly** when modifying section configuration
6. **Preserve accessibility** attributes in all sections
7. **Follow variant conventions** (light for content, dark for emphasis, teal for action)

## Related Files

- `src/data/sections.ts` - Section configuration and utility functions
- `src/data/sections.test.ts` - Comprehensive test suite
- `src/components/sections/Section.tsx` - Reusable Section component
- `src/components/sections/SectionRenderer.tsx` - Section rendering logic
- `src/contexts/NavigationProvider.tsx` - Navigation state management
- `src/types/index.ts` - TypeScript type definitions
