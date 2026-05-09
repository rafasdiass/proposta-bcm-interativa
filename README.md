# Interactive BCM Proposal

A modern React + TypeScript web application that transforms a static business proposal into an engaging, interactive experience for LaVita Code's BCM platform partnership with Grupo Gradual.

## Features

- **Dual Navigation Modes**: Seamless switching between continuous landing page and slide-by-slide presentation modes
- **Interactive Calculators**: ROI simulator and softhouse calculator for decision-making
- **Conversion-Optimized**: Every component designed to maximize conversion (sign intent, schedule meeting, download PDF)
- **Accessibility-First**: WCAG AA compliance with keyboard navigation and screen reader support
- **Responsive Design**: Works across all devices from mobile to desktop

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Bootstrap CSS 5
- **Animation**: Framer Motion 12
- **Icons**: Lucide React 1.14
- **Forms**: React Hook Form 7
- **Date Utilities**: date-fns 4
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js 20 LTS or higher
- npm 10 or higher

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd orcamento-gradual
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables (optional):
   ```bash
   cp .env.example .env.local
   ```

## Development

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Code Quality

Run linting:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```

Format code with Prettier:
```bash
npm run format
```

Check code formatting:
```bash
npm run format:check
```

Type checking:
```bash
npm run type-check
```

## Building for Production

Create a production build:
```bash
npm run build
```

The build output will be in the `dist/` directory.

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   ├── interactive/      # Interactive calculators and tools
│   ├── navigation/       # Navigation and mode switching
│   └── sections/         # Content section components
├── contexts/             # React contexts for state management
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions and constants
├── styles/              # Global styles and Bootstrap config
└── data/                # Static content and configuration
public/                   # Static assets (including PDF)
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check if code is properly formatted |
| `npm run type-check` | Run TypeScript type checking |

## Environment Configuration

The application uses environment variables for configuration. See **[ENV_SETUP.md](./ENV_SETUP.md)** for comprehensive configuration guide.

### Quick Setup

Create a `.env.local` file with:

```env
# Required: API endpoint for form submissions
VITE_INTENT_ENDPOINT=https://api.example.com/intent

# Required: External scheduling system URL
VITE_SCHEDULING_URL=https://calendly.com/example

# Optional: Proposal validity deadline (ISO 8601 format)
VITE_PROPOSAL_DEADLINE=2026-05-22T23:59:59-03:00

# Optional: Analytics tracking IDs
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_HOTJAR_ID=1234567
```

For detailed configuration including analytics integration, production deployment, and troubleshooting, see **[ENV_SETUP.md](./ENV_SETUP.md)**.

## Static Assets

The PDF proposal is served as a static asset from the `public/` directory:
- **Development**: `http://localhost:5173/BCM_Proposta_Investimento_Grupo_Gradual_ATUALIZADA.pdf`
- **Production**: `https://yourdomain.com/BCM_Proposta_Investimento_Grupo_Gradual_ATUALIZADA.pdf`

## Deployment

### Static Hosting (Recommended)

The application builds to static files and can be deployed to any static hosting service:

1. **Vercel**:
   ```bash
   npm run build
   npx vercel --prod
   ```

2. **Netlify**:
   ```bash
   npm run build
   # Upload dist/ folder to Netlify
   ```

3. **GitHub Pages**:
   ```bash
   npm run build
   # Deploy dist/ folder to gh-pages branch
   ```

### Server Configuration

For proper routing support, configure your server to:
- Serve `index.html` for all routes (SPA fallback)
- Set proper MIME types for `.pdf` files
- Enable gzip compression for static assets
- Set appropriate cache headers

Example Nginx configuration:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}

location ~* \.pdf$ {
  add_header Content-Type application/pdf;
  add_header Cache-Control "public, max-age=31536000";
}
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **First Contentful Paint**: < 2.5s on 4G
- **Largest Contentful Paint**: < 4s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: Optimized with code splitting and tree shaking

## Accessibility

The application follows WCAG 2.1 AA guidelines:
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios
- Reduced motion support
- Semantic HTML structure

## License

Private - LaVita Code & Grupo Gradual Partnership Proposal

## Support

For technical issues or questions, contact:
- **Developer**: Rafael Dias (rafaeldias@lavitacode.com.br)
- **Project**: Interactive BCM Proposal