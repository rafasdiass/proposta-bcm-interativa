import { TrendingUp, Rocket, Building2, BarChart } from 'lucide-react';
import { ROISimulator } from '../interactive/ROISimulator';
import { NarrativeSection } from './NarrativeSection';

export default function ProjectionsSection() {
  return (
    <NarrativeSection
      eyebrow="Projecoes"
      title="O upside dos 5% depende de MRR, margem e velocidade de validacao"
      lead="As projecoes devem ser lidas como cenarios, nao promessa de retorno. O ponto central e mostrar como uma participacao pequena pode ganhar relevancia quando a plataforma comprova receita recorrente."
      tone="dark"
      cards={[
        {
          title: 'Cenario conservador',
          body: 'Atingir breakeven ja transforma o aporte em uma posicao economica mensuravel.',
          icon: BarChart,
        },
        {
          title: 'Cenario de tracao',
          body: 'Com mil assinantes, a narrativa muda de software em validacao para ativo SaaS vertical.',
          icon: Rocket,
        },
        {
          title: 'Cenario institucional',
          body: 'Contratos com escolas, redes ou municipios podem acelerar MRR sem depender apenas de venda pulverizada.',
          icon: Building2,
        },
        {
          title: 'Disciplina de premissas',
          body: 'O simulador explicita assinantes, mix de planos e multiplo para evitar caixa-preta financeira.',
          icon: TrendingUp,
        },
      ]}
    >
      <ROISimulator />
    </NarrativeSection>
  );
}
