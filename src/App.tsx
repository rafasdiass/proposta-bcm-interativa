import { NavigationProvider } from './contexts';
import { SectionRenderer } from './components/sections';
import { ProposalNavbar } from './components/navigation';
import { SkipLinks, AppErrorBoundary, Footer } from './components/common';

function App() {
  return (
    <AppErrorBoundary>
      <NavigationProvider>
        {/* Skip Links for Keyboard Navigation */}
        <SkipLinks />

        <div className="min-h-screen bg-[#08111F] text-white">
          <ProposalNavbar />

          {/* Main Content */}
          <main id="main-content" className="w-full min-h-screen pb-20 sm:pb-24">
            <SectionRenderer />
          </main>

          <Footer />
        </div>
      </NavigationProvider>
    </AppErrorBoundary>
  );
}

export default App;
