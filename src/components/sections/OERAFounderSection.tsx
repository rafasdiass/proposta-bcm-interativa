import { ClipboardList, UserCheck, Activity, BarChart3 } from 'lucide-react';
import { NarrativeSection } from './NarrativeSection';

export default function OERAFounderSection() {
  return (
    <NarrativeSection
      eyebrow="Protocolo fundador"
      title="OERA entra como catalogo fundador, nao como anexo"
      lead="A parceria posiciona o conhecimento clinico do Gradual dentro do nucleo do produto. O OERA pode nascer como protocolo prioritario, com governanca de autoria, validacao e evolucao conjunta."
      tone="teal"
      cards={[
        {
          title: 'Prioridade no roadmap',
          body: 'O protocolo entra cedo na modelagem, evitando adaptacoes superficiais depois do produto pronto.',
          icon: ClipboardList,
        },
        {
          title: 'Autoria preservada',
          body: 'A contribuicao clinica fica vinculada ao Grupo Gradual nas entregas, materiais e futuras publicacoes.',
          icon: UserCheck,
        },
        {
          title: 'Validacao no campo',
          body: 'Uso real gera aprendizado para melhorar protocolo, produto e indicadores de resultado.',
          icon: Activity,
        },
        {
          title: 'Ativo escalavel',
          body: 'O conhecimento deixa de depender apenas de transferencia manual e passa a compor a plataforma.',
          icon: BarChart3,
        },
      ]}
    />
  );
}
