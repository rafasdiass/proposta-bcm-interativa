import { ROISimulator } from '../interactive/ROISimulator';
import { NarrativeSection } from './NarrativeSection';

export default function ExpectedReturnSection() {
  return (
    <NarrativeSection
      eyebrow="Retorno esperado"
      title="As três camadas de retorno do investidor fundador"
      lead="Diferente de um investimento passivo, a parceria com o BCM oferece retornos em diferentes horizontes de tempo e naturezas operacionais."
      tone="dark"
      metrics={[
        { value: '5%', label: 'equity no BCM' },
        { value: '25%', label: 'economia operacional' },
        { value: '3x', label: 'camadas de retorno' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h4 className="text-[#5EEAD4] font-bold mb-2">1. Eficiência (Agora)</h4>
          <p className="text-slate-400 text-sm">Economia direta de 25% em qualquer demanda de tecnologia com a LaVita Code.</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h4 className="text-[#F5A623] font-bold mb-2">2. Equity (Escala)</h4>
          <p className="text-slate-400 text-sm">Valorização da sua cota de 5% conforme o produto ganha o mercado nacional.</p>
        </div>
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h4 className="text-blue-400 font-bold mb-2">3. Estratégia (Futuro)</h4>
          <p className="text-slate-400 text-sm">Poder de moldar a ferramenta que sua própria clínica usará no dia a dia.</p>
        </div>
      </div>
      <ROISimulator />
    </NarrativeSection>
  );
}
