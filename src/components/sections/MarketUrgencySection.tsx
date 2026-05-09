import { AlertCircle, Zap, ShieldAlert, Clock } from 'lucide-react';
import { CountdownTimer } from '../interactive/CountdownTimer';
import { NarrativeSection } from './NarrativeSection';

export default function MarketUrgencySection() {
  return (
    <NarrativeSection
      eyebrow="Janela de mercado"
      title="A posicao de fundador vale mais antes do mercado organizar a disputa"
      lead="A demanda por terapia ABA cresce mais rapido do que a capacidade operacional das clinicas. Quem entra cedo ajuda a definir o produto, o catalogo fundador e a narrativa cientifica antes que a categoria seja capturada por solucoes genericas."
      tone="teal"
      cards={[
        {
          title: 'Dor operacional clara',
          body: 'Clinicas precisam crescer sem perder governanca clinica, margem e rastreabilidade dos atendimentos.',
          icon: AlertCircle,
        },
        {
          title: 'Escassez de parceiros',
          body: 'A posicao de parceiro fundador deve ser limitada para preservar profundidade de validacao e foco tecnico.',
          icon: ShieldAlert,
        },
        {
          title: 'Narrativa cientifica',
          body: 'O primeiro parceiro ajuda a transformar evidencia clinica em produto defensavel.',
          icon: Zap,
        },
        {
          title: 'Tempo de decisao',
          body: 'Esperar reduz influencia sobre roadmap, protocolos prioritarios e termos economicos.',
          icon: Clock,
        },
      ]}
    >
      <CountdownTimer />
    </NarrativeSection>
  );
}
