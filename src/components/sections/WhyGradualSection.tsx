import { Award, Microscope, Lightbulb, Signal, Quote } from 'lucide-react';
import { NarrativeSection } from './NarrativeSection';

export default function WhyGradualSection() {
  return (
    <NarrativeSection
      eyebrow="Parceiro ideal"
      title="O Gradual combina reputacao clinica, campo real e ambicao de escala"
      lead="A parceria faz sentido porque o Gradual nao seria apenas comprador. Ele traz contexto clinico, capacidade de validacao, autoridade de mercado e uma dor operacional que o BCM precisa resolver bem."
      cards={[
        {
          title: 'Autoridade clinica',
          body: 'A reputacao do Gradual aumenta a credibilidade do produto perante familias, terapeutas e instituicoes.',
          icon: Award,
        },
        {
          title: 'Campo de validacao',
          body: 'Uso em operacao real permite testar fluxo, linguagem, indicadores e aderencia de equipe.',
          icon: Microscope,
        },
        {
          title: 'Visao de produto',
          body: 'A parceria ajuda a priorizar problemas que de fato travam crescimento de clinicas ABA.',
          icon: Lightbulb,
        },
        {
          title: 'Sinal ao mercado',
          body: 'Um investidor âncora forte reduz a percepcao de risco para os proximos clientes e investidores.',
          icon: Signal,
        },
      ]}
      footer={
        <div className="flex gap-4 items-start">
          <Quote className="w-8 h-8 text-[#2D9B8A] flex-shrink-0 opacity-60" />
          <blockquote className="text-xl text-slate-200 font-medium leading-relaxed italic">
            "A melhor hora para moldar um produto vertical e antes de ele virar
            padrao de mercado. Depois disso, o parceiro vira apenas usuario."
          </blockquote>
        </div>
      }
    />
  );
}
