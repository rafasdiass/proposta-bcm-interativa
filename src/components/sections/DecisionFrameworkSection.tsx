import { NarrativeSection } from './NarrativeSection';

export default function DecisionFrameworkSection() {
  return (
    <NarrativeSection
      eyebrow="Quadro de decisao"
      title="A pergunta nao e se o BCM esta pronto, e se o Gradual quer molda-lo"
      lead="A decisao deve comparar risco, influencia e custo de oportunidade. Entrar cedo aumenta incerteza, mas tambem aumenta poder de autoria, prioridade e retorno potencial."
      cards={[
        {
          title: 'Risco tecnico',
          body: 'Mitigado por tranches, entregas verificaveis e uso de componentes ja estruturados.',
        },
        {
          title: 'Risco comercial',
          body: 'Mitigado por planos claros, piloto com campo real e validacao com usuarios pagantes.',
        },
        {
          title: 'Influencia estrategica',
          body: 'Maxima no inicio, quando protocolos, produto e narrativa ainda estao sendo definidos.',
        },
        {
          title: 'Custo de esperar',
          body: 'Outro parceiro pode ocupar a posicao fundadora e reduzir o poder de moldagem do Gradual.',
        },
      ]}
    />
  );
}
