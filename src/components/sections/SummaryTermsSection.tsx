import { NarrativeSection } from './NarrativeSection';

const terms = [
  ['Aporte', 'R$ 75.000 em tres tranches'],
  ['Participacao', '5% do BCM vinculados ao acordo'],
  ['Gatilhos', 'Assinatura, usuarios pagantes e marco comercial/cientifico'],
  ['Governanca', 'Reporting mensal e criterios objetivos de acompanhamento'],
  ['Validade', 'Proposta sujeita a confirmacao dentro da janela apresentada'],
];

export default function SummaryTermsSection() {
  return (
    <NarrativeSection
      eyebrow="Termos resumidos"
      title="O acordo cabe em poucos termos, mas precisa de execucao rigorosa"
      lead="Esta pagina resume a estrutura economica e operacional para facilitar a decisao. O contrato final deve detalhar gatilhos, direitos, confidencialidade e governanca."
      tone="dark"
    >
      <div className="overflow-hidden rounded-xl bg-[#101F35] border border-[#263A59] shadow-lg shadow-black/20">
        {terms.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3 border-b last:border-b-0 border-white/10 p-5"
          >
            <div className="font-semibold text-[#5EEAD4]">{label}</div>
            <div className="text-slate-200">{value}</div>
          </div>
        ))}
      </div>
    </NarrativeSection>
  );
}
