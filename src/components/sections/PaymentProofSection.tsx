import { ComparisonTable } from '../interactive/ComparisonTable';
import { SofthouseCalculator } from '../interactive/SofthouseCalculator';
import { NarrativeSection } from './NarrativeSection';

export default function PaymentProofSection() {
  return (
    <NarrativeSection
      eyebrow="Prova economica"
      title="Entrar agora troca incerteza por influencia verificavel"
      lead="O aporte nao depende apenas de valorizacao futura. A parceria tambem cria retorno operacional com desconto em desenvolvimento e maior poder de moldar o produto antes da janela fechar."
      tone="dark"
    >
      <div className="space-y-8">
        <ComparisonTable showAnimationControl={false} />
        <SofthouseCalculator />
      </div>
    </NarrativeSection>
  );
}
