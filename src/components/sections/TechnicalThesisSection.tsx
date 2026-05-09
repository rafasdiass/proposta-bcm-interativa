import { Cpu, Database, Share2, Award } from 'lucide-react';
import { NarrativeSection } from './NarrativeSection';

export default function TechnicalThesisSection() {
  return (
    <NarrativeSection
      eyebrow="Tese tecnica"
      title="Um kernel clinico separa protocolo, operacao e produto"
      lead="A vantagem tecnica do BCM esta em tratar protocolos como entidades configuraveis, auditaveis e reutilizaveis. Isso reduz dependencia de codigo sob medida e cria uma base para evoluir o produto com seguranca."
      tone="dark"
      metrics={[
        { value: 'Kernel', label: 'nucleo de regras clinicas' },
        { value: 'API', label: 'camada pronta para integracoes' },
        { value: 'Dados', label: 'estrutura para indicadores e pesquisa' },
      ]}
      cards={[
        {
          title: 'Protocolos configuraveis',
          body: 'Metas, passos, criterios de progresso e revisoes podem evoluir sem reconstruir o produto.',
          icon: Cpu,
        },
        {
          title: 'Auditoria desde o inicio',
          body: 'A trilha de decisao clinica fica preservada para governanca, qualidade e melhoria continua.',
          icon: Award,
        },
        {
          title: 'Extensao por modulos',
          body: 'Agenda, financeiro, prontuario e dashboards se conectam ao mesmo nucleo de dados.',
          icon: Share2,
        },
        {
          title: 'Defensabilidade',
          body: 'Quanto mais protocolos validados entram no kernel, maior o valor acumulado da plataforma.',
          icon: Database,
        },
      ]}
    />
  );
}
