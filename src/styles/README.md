# Bootstrap Styling - Interactive BCM Proposal

This project uses Bootstrap CSS plus app-specific styles in `src/index.css`.
The previous utility compiler has been removed from the build pipeline.

## Styling Entry

- `src/index.css` imports `bootstrap/dist/css/bootstrap.min.css`.
- Brand tokens live in `:root` as CSS variables.
- The app keeps semantic helpers such as `.prose-measure`, `.text-safe`, `.metric-value`, `.section-light`, `.section-dark`, and `.section-teal`.
- A small migration bridge remains in `src/index.css` for app-specific layout and color utilities that Bootstrap does not provide directly.

## Brand Colors

| Color | Hex | CSS Variable |
| --- | --- | --- |
| Primary | `#1B3A6B` | `--color-primary` |
| Secondary | `#2D9B8A` | `--color-secondary` |
| Accent | `#F5A623` | `--color-accent` |
| Purple | `#8B7EC8` | `--color-purple` |
| Dark Base | `#08111F` | `--color-base-dark` |

## Responsive Model

Use Bootstrap classes first:

- `.container`, `.container-fluid`
- `.row`, `.col-*`
- `.d-flex`, `.d-grid`
- `.gap-*`, `.p-*`, `.m-*`
- `.btn`, `.card`, `.badge`, `.form-control`, `.form-select`

Use app classes when Bootstrap does not express the BCM visual language cleanly.

## Guardrails

- Do not reintroduce utility-compiler packages, framework directives, or framework CSS imports.
- Keep text containers at `min-width: 0` when inside flex/grid layouts.
- Use `.prose-measure`, `.text-safe`, and `.metric-value` for long copy and money values.
- Prefer Bootstrap grid over narrow fixed-width cards.
