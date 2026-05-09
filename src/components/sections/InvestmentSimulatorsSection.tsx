import { ROISimulator } from '../interactive/ROISimulator';
import { SofthouseCalculator } from '../interactive/SofthouseCalculator';
import { ComparisonTable } from '../interactive/ComparisonTable';
import { NarrativeSection } from './NarrativeSection';

export default function InvestmentSimulatorsSection() {
  return (
    <NarrativeSection
      eyebrow="Tese de Retorno"
      title="Dashboard de Valorização e Eficiência"
      lead="Diferente de um aporte tradicional, o retorno no BCM combina a valorização de equity com a redução imediata de custos operacionais e influência estratégica."
      tone="dark"
      cards={[
        {
          title: 'Cenário Conservador',
          body: 'O breakeven operacional já torna o aporte de 75k um ativo líquido e seguro.',
        },
        {
          title: 'Cenário de Tração',
          body: 'Com a escala SaaS, os 5% de participação podem superar 10x o capital investido.',
        },
        {
          title: 'Cenário Institucional',
          body: 'Vendas para grandes redes aceleram o exit sem depender de escala pulverizada.',
        },
        {
          title: 'Disciplina de Premissas',
          body: 'O simulador abaixo permite testar cenários reais sem caixa-preta financeira.',
        },
      ]}
    >
      <div className="space-y-16">
        {/* Simulators Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {/* Left: Equity Simulator */}
          <div className="space-y-6">
            <div className="bg-[#101F35] border border-white/10 rounded-2xl p-6">
              <h3 className="text-[#F5A623] text-sm font-black uppercase tracking-widest mb-2">Dimensão 1: Crescimento (Equity)</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Valorização da sua cota de 5% baseada na escala do faturamento recorrente (SaaS).
              </p>
            </div>
            <ROISimulator />
          </div>

          {/* Right: Efficiency Simulator */}
          <div className="space-y-6">
            <div className="bg-[#101F35] border border-white/10 rounded-2xl p-6">
              <h3 className="text-[#5EEAD4] text-sm font-black uppercase tracking-widest mb-2">Dimensão 2: Eficiência (Cashback)</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Economia direta de 25% no seu custo de tecnologia atual, gerando payback imediato do aporte.
              </p>
            </div>
            <SofthouseCalculator />
          </div>
        </div>

        {/* Strategic Comparison */}
        <div className="pt-16 border-t border-white/10">
          <div className="max-w-3xl mb-10">
            <h3 className="text-2xl font-black text-white mb-4">Escolha Estratégica: Janela de Oportunidade</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              O BCM está em uma fase única onde o primeiro parceiro clínico tem o poder de ditar o padrão técnico de todo o mercado. 
              Abaixo, a comparação real entre entrar agora como fundador ou esperar para entrar como cliente.
            </p>
          </div>
          <ComparisonTable showAnimationControl={false} />
        </div>
        
        {/* Footer Info */}
        <div className="p-6 bg-[#2D9B8A]/10 border border-[#2D9B8A]/20 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-[#2D9B8A] rounded-full flex items-center justify-center text-white flex-shrink-0">
              <i className="bi bi-graph-up-arrow text-3xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold mb-1 italic">A Tese Combinada</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Ao investir R$ 75k, o Gradual protege seu caixa no curto prazo (via eficiência) e se posiciona para uma saída (exit) ou dividendos no longo prazo (via escala).
              </p>
            </div>
          </div>
        </div>
      </div>
    </NarrativeSection>
  );
}
