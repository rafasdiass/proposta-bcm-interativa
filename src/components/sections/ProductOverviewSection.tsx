import { NarrativeSection } from './NarrativeSection';

export default function ProductOverviewSection() {
  return (
    <NarrativeSection
      eyebrow="Definicao do produto"
      title="BCM e a camada operacional para terapia ABA digital"
      lead="O BCM organiza pacientes, protocolos, agenda, dados clinicos e indicadores em uma unica experiencia. A tese nao e apenas digitalizar formularios: e transformar conhecimento clinico em uma plataforma operacional escalavel."
      metrics={[
        { value: '12', label: 'modulos funcionais planejados' },
        { value: '1', label: 'kernel clinico para protocolos' },
        { value: '24/7', label: 'base pronta para operacao assistida' },
      ]}
      cards={[
        {
          title: 'Prontuario orientado a protocolo',
          body: 'Registros, metas e evolucao acompanham a logica da intervencao, nao um cadastro generico.',
        },
        {
          title: 'Rotina para clinicas',
          body: 'Agenda, equipe, pagamentos e comunicacao ficam conectados ao fluxo real de atendimento.',
        },
        {
          title: 'Dados para decisao',
          body: 'Indicadores ajudam a separar crescimento saudavel de ocupacao sem margem.',
        },
        {
          title: 'Base para escala',
          body: 'A arquitetura nasce para receber novos protocolos, unidades, escolas e contratos publicos.',
        },
      ]}
    />
  );
}
