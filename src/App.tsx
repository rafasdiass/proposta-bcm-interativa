import './App.css';
import { NavigationProvider } from './contexts';
import { SectionRenderer, SectionNavigation } from './components/sections';
import { ModeToggle, ProgressIndicator } from './components/navigation';
import { SkipLinks, AppErrorBoundary } from './components/common';
import { StickyCTA } from './components/interactive/StickyCTA';

function App() {
  return (
    <AppErrorBoundary>
      <NavigationProvider>
        {/* Skip Links for Keyboard Navigation */}
        <SkipLinks />

        <div className="min-h-screen bg-gray-50">
          {/* Navigation Controls */}
          <header
            id="navigation-controls"
            className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
            role="banner"
          >
            <div className="flex items-start justify-between p-2 sm:p-4">
              <div className="pointer-events-auto">
                <ModeToggle />
              </div>
              <div className="pointer-events-auto">
                <ProgressIndicator />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main id="main-content">
            <SectionRenderer />
          </main>

          {/* Presentation Mode Navigation */}
          <SectionNavigation />

          {/* Sticky CTA Bar */}
          <aside
            id="sticky-cta"
            role="complementary"
            aria-label="Ações principais"
          >
            <StickyCTA />
          </aside>
        </div>
      </NavigationProvider>
    </AppErrorBoundary>
  );
}

export default App;
