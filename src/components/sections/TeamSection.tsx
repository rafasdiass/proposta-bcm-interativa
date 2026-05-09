import { NarrativeSection } from './NarrativeSection';

export default function TeamSection() {
  return (
    <NarrativeSection
      eyebrow="Time"
      title="Execucao enxuta com governanca de cofundadora"
      lead="Laura Dias lidera a iniciativa como cofundadora, trazendo a LaVita Code para produto e engenharia. O Gradual entra com validacao clinica, direcao de protocolo e legitimidade setorial."
      cards={[
        {
          title: 'Cofundadora e Produto',
          body: 'Laura Dias coordena a visao de produto, garantindo que a tecnologia sirva a estrategia clinica do Gradual.',
        },
        {
          title: 'Engenharia e Entrega',
          body: 'Equipe tecnica focada em arquitetura, desenvolvimento, integracoes e ciclo de entrega mensal.',
        },
        {
          title: 'Direcao clinica',
          body: 'Responsavel por validar fluxos, linguagem, indicadores e aderencia dos protocolos.',
        },
        {
          title: 'Comite de parceria',
          body: 'Ritual mensal acompanha roadmap, tranches, metricas, riscos e decisoes de priorizacao.',
        },
      ]}
    />
  );
}
