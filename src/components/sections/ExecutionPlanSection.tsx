import { NarrativeSection } from './NarrativeSection';

const milestones = [
  ['D+0', 'Assinatura, kickoff e confirmacao dos criterios de tranche.'],
  ['D+30', 'Mapeamento OERA, fluxos prioritarios e backlog validado.'],
  ['D+60', 'Primeiros modulos em uso assistido com equipe piloto.'],
  ['D+90', 'Indicadores de uso, ajustes clinicos e plano comercial inicial.'],
  ['D+180', 'Base para expansao, publicacao conjunta ou novo marco comercial.'],
];

export default function ExecutionPlanSection() {
  return (
    <NarrativeSection
      eyebrow="Plano de execucao"
      title="A decisao vira cadencia de produto em ciclos de 30 dias"
      lead="O plano prioriza aprendizado rapido, evidencias objetivas e governanca mensal. A meta e sair de alinhamento estrategico para uso real antes que a parceria perca momentum."
    >
      <div className="rounded-xl border border-[#263A59] bg-[#101F35] shadow-lg shadow-black/20 overflow-hidden">
        {milestones.map(([time, text]) => (
          <div
            key={time}
            className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-3 border-b last:border-b-0 border-[#263A59] p-6"
          >
            <div className="text-2xl font-bold text-[#2D9B8A]">{time}</div>
            <p className="prose-measure text-slate-200 leading-relaxed">
              {text}
            </p>
          </div>
        ))}
      </div>
    </NarrativeSection>
  );
}
