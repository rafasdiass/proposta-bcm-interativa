import { NarrativeSection } from './NarrativeSection';

export default function GovernanceSection() {
  return (
    <NarrativeSection
      eyebrow="Governanca"
      title="A parceria precisa ser simples de assinar e seria de acompanhar"
      lead="O desenho de governanca protege os dois lados: clareza sobre participacao, tranches, direitos economicos, confidencialidade, tomada de decisao e relatorios de evolucao."
      cards={[
        {
          title: 'Cap table',
          body: 'Participacao registrada em termos objetivos, com regras claras de diluicao e eventos futuros.',
        },
        {
          title: 'Reporting',
          body: 'Atualizacao mensal de produto, usuarios, receita, pipeline, riscos e proximos marcos.',
        },
        {
          title: 'Direitos de voto',
          body: 'Decisoes estruturais seguem governanca combinada sem travar execucao cotidiana.',
        },
        {
          title: 'Confidencialidade',
          body: 'Protocolos, dados clinicos, estrategia e termos economicos ficam protegidos desde a assinatura.',
        },
      ]}
    />
  );
}
