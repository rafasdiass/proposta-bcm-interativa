import { SofthouseCalculator } from '@/components/interactive/SofthouseCalculator';

/**
 * SofthouseSection - Dedicated page showcasing LaVita Code as Gradual's softhouse.
 *
 * Cognitive psychology principles applied:
 * - Anchoring: 25% number leads prominently
 * - Progressive disclosure: value prop → benefits → calculator → CTA
 * - Chunking: 3 benefit cards max
 * - Loss aversion: "money you're losing today"
 * - Social proof: exclusive to investor anchor partners
 */
export default function SofthouseSection() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-16">
      {/* A. HERO - Anchoring with the 25% number */}
      <div className="w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2D9B8A]/20 border border-[#5EEAD4]/30 rounded-full text-xs font-black uppercase tracking-widest text-[#5EEAD4]">
          <i className="bi bi-shield-check" />
          Exclusivo para Investidor Âncora
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-white leading-tight">
          <span className="text-[#5EEAD4]">25%</span> menos
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto">
          que qualquer softhouse do mercado. Sempre.
        </p>
      </div>

      {/* B. BENEFIT CARDS - 3 blocks, scannable in 3 seconds each */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Card 1: Assumimos tudo */}
        <div className="bg-[#101F35] border border-[#263A59] rounded-2xl p-6 space-y-4 shadow-lg exec-card-hover">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#2D9B8A]/20 text-[#5EEAD4]">
            <i className="bi bi-layers-fill text-xl" />
          </div>
          <h3 className="text-xl font-bold text-white">Assumimos tudo</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Novos projetos, sistemas em produção, manutenção, apps, integrações.
          </p>
        </div>

        {/* Card 2: Sem surpresas */}
        <div className="bg-[#101F35] border border-[#263A59] rounded-2xl p-6 space-y-4 shadow-lg exec-card-hover">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F5A623]/15 text-[#F5A623]">
            <i className="bi bi-percent text-xl" />
          </div>
          <h3 className="text-xl font-bold text-white">Sem surpresas</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Preço sempre 25% abaixo do melhor orçamento que você receber.
          </p>
        </div>

        {/* Card 3: Prioridade total */}
        <div className="bg-[#101F35] border border-[#263A59] rounded-2xl p-6 space-y-4 shadow-lg exec-card-hover">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#1B3A6B] text-[#60A5FA]">
            <i className="bi bi-lightning-fill text-xl" />
          </div>
          <h3 className="text-xl font-bold text-white">Prioridade total</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Atendimento dedicado como investidor âncora.
          </p>
        </div>
      </div>

      {/* C. CALCULATOR */}
      <div className="w-full">
        <SofthouseCalculator />
      </div>

      {/* D. CTA / CLOSING - Loss aversion framing */}
      <div className="w-full text-center py-8 border-t border-[#263A59]">
        <p className="text-2xl md:text-3xl font-bold text-slate-200">
          Quanto você gasta hoje com tecnologia?
        </p>
        <p className="text-slate-400 text-base mt-3 max-w-xl mx-auto">
          Cada mês sem a LaVita Code é dinheiro perdido.
        </p>
      </div>
    </div>
  );
}
