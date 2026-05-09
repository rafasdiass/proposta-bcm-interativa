import logoOficial from '@/assets/logo-oficial.png';
import { useNavigation } from '@/contexts/useNavigation';
import { proposalPages } from '@/data/pages';
import { cn } from '@/utils';

const pageIcons: Record<string, string> = {
  'visao-geral': 'bi-grid-1x2-fill',
  'mercado': 'bi-graph-up-arrow',
  'produto': 'bi-box-seam-fill',
  'investimento': 'bi-cash-stack',
  'execucao': 'bi-rocket-takeoff-fill',
  'termos': 'bi-file-earmark-check-fill',
};

export function ProposalNavbar() {
  const { state, actions } = useNavigation();
  const isFirst = state.currentSection === 0;
  const isLast = state.currentSection === proposalPages.length - 1;

  return (
    <header
      id="navigation-controls"
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#2D9B8A]/30 bg-[#0B1A2D]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4),0_0_15px_rgba(45,155,138,0.2)]"
      role="banner"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => actions.goToSection(0)}
          className="flex items-center transition-transform hover:scale-105 bg-transparent border-0 p-0 outline-none shadow-none"
          aria-label="Ir para a visão geral"
        >
          <img 
            src={logoOficial} 
            alt="BCM Logo" 
            className="h-20 md:h-28 w-auto object-contain transition-all"
            style={{ 
              filter: 'invert(1) brightness(1.5) contrast(1000%)',
              mixBlendMode: 'screen'
            }}
          />
        </button>

        <nav
          className="hidden flex-1 items-center justify-center gap-1 xl:gap-3 lg:flex"
          aria-label="Páginas da proposta"
        >
          {proposalPages.map((page, index) => {
            const isActive = index === state.currentSection;
            const iconClass = pageIcons[page.id] || 'bi-grid-fill';
            // Shorten label for Terms
            const label = page.id === 'termos' ? 'Termos' : page.title;

            return (
              <button
                key={page.id}
                type="button"
                onClick={() => actions.goToSection(index)}
                className={cn(
                  'group flex items-center gap-2 rounded-full px-3 py-2 xl:px-4 text-[13px] font-bold transition-all duration-300 min-w-[100px] justify-center',
                  isActive
                    ? 'bg-gradient-to-r from-[#F5A623] to-[#D97706] text-white shadow-[0_4px_15px_rgba(245,166,35,0.4)] scale-105 ring-1 ring-[#F5A623]/50'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <i className={cn(iconClass, 'text-base transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#5EEAD4]')} />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="relative lg:hidden">
            <i className="bi bi-list absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={state.currentSection}
              onChange={event => actions.goToSection(Number(event.target.value))}
              className="h-10 rounded-full border border-white/10 bg-[#101F35] pl-9 pr-8 text-sm font-medium text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#F5A623]/50 transition-all"
              aria-label="Selecionar página"
            >
              {proposalPages.map((page, index) => (
                <option key={page.id} value={index}>
                  {page.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            <a
              href="/BCM_Proposta_Gradual_v2.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#2D9B8A] hover:bg-[#268A79] text-white rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-[#2D9B8A]/20 no-underline"
            >
              <i className="bi bi-file-earmark-pdf-fill" />
              PDF
            </a>
            <a
              href="/BCM_Proposta_Gradual_v2.pptx"
              download="BCM_Proposta_Gradual_v2.pptx"
              className="flex items-center gap-2 px-4 py-2 bg-[#1E3A5F] hover:bg-[#2D4F7C] text-slate-200 border border-white/10 rounded-full text-xs font-black uppercase tracking-wider transition-all no-underline"
            >
              <i className="bi bi-file-earmark-ppt-fill" />
              PPTX
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
