import { TrancheTimeline } from '../interactive/TrancheTimeline';
import { NarrativeSection } from './NarrativeSection';

export default function ProposalTranchesSection() {
  return (
    <NarrativeSection
      eyebrow="Estrutura do aporte"
      title="R$ 75 mil em tranches vinculadas a marcos de execucao"
      lead="A proposta reduz risco colocando capital em etapas. Cada tranche financia uma fase objetiva e conecta o aporte a sinais de validacao, usuarios pagantes ou publicacao conjunta."
      tone="dark"
      cards={[
        {
          title: 'Tranche 1',
          body: 'Assinatura, alinhamento presencial, onboarding e inicio da integracao OERA.',
        },
        {
          title: 'Tranche 2',
          body: 'Liberada com usuarios pagantes, validando utilidade e disposicao de pagamento.',
        },
        {
          title: 'Tranche 3',
          body: 'Conecta escala comercial ou publicacao conjunta ao fechamento do aporte.',
        },
        {
          title: 'Governanca',
          body: 'Cada marco deve ter evidencia objetiva para evitar ambiguidade entre as partes.',
        },
      ]}
    >
      <TrancheTimeline />
    </NarrativeSection>
  );
}
