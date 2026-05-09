import { IntentForm } from '../interactive/IntentForm';
import { NarrativeSection } from './NarrativeSection';

export default function NextStepsSection() {
  return (
    <NarrativeSection
      eyebrow="Proximos passos"
      title="Pronto para avançar?"
      lead="A partir daqui, seguiremos com o alinhamento via WhatsApp para validar os termos, confirmar a tese e definir o kickoff da parceria."
      tone="dark"
      cards={[
        {
          title: '1. Validar tese',
          body: 'Revisar premissas comerciais, tecnicas e clinicas com os decisores do Gradual.',
        },
        {
          title: '2. Fechar termos',
          body: 'Converter a proposta em minuta com participacao, gatilhos e confidencialidade.',
        },
        {
          title: '3. Kickoff',
          body: 'Agendar encontro inicial, equipe responsavel e primeiro ciclo de execucao.',
        },
        {
          title: '4. Medir progresso',
          body: 'Acompanhar entregas, usuarios, aprendizados e criterios das proximas tranches.',
        },
      ]}
    />
  );
}
