import { SofthouseCalculator } from '../interactive/SofthouseCalculator';
import { NarrativeSection } from './NarrativeSection';

export default function PreScaleReturnSection() {
  return (
    <NarrativeSection
      eyebrow="Retorno de curto prazo"
      title="Como o aporte se paga através de eficiência"
      lead="Mesmo antes do BCM atingir milhares de assinantes, o investimento de R$ 75k gera retorno imediato ao reduzir os custos fixos de tecnologia do Gradual."
      tone="dark"
      cards={[
        {
          title: 'Cash-on-Cash',
          body: 'A economia real no faturamento mensal de TI funciona como um dividendo antecipado.',
        },
        {
          title: 'Prioridade Técnica',
          body: 'Como sócio, o Gradual tem prioridade na alocação de horas da LaVita Code.',
        },
        {
          title: 'Desenvolvimento Ágil',
          body: 'O time já conhece o negócio, eliminando o custo de aprendizado de softhouses externas.',
        },
        {
          title: 'Mitigação de Risco',
          body: 'Se o SaaS demorar a escalar, o investimento já se pagou pela eficiência operacional.',
        },
      ]}
    >
      <div className="mb-10 p-6 bg-[#2D9B8A]/10 border border-[#2D9B8A]/30 rounded-2xl">
        <p className="text-white text-sm leading-relaxed">
          <strong>A lógica é simples:</strong> Se o Gradual investe hoje R$ 12k/mês em tecnologia, os 25% de desconto economizam R$ 3k/mês. 
          Em menos de 2,5 anos, os R$ 75k do aporte retornaram integralmente ao caixa da clínica apenas via economia.
        </p>
      </div>
      <SofthouseCalculator />
    </NarrativeSection>
  );
}
