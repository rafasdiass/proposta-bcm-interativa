import { User, Building2, School, Check } from 'lucide-react';
import { NarrativeSection } from './NarrativeSection';

const plans = [
  {
    name: 'Profissional',
    price: 'R$ 297',
    audience: 'terapeutas independentes e consultorios',
    icon: User,
  },
  {
    name: 'Clinica',
    price: 'R$ 997',
    audience: 'equipes com agenda, pacientes e supervisao',
    icon: Building2,
  },
  {
    name: 'Escola',
    price: 'R$ 1.997',
    audience: 'operacoes com turmas, familias e relatorios',
    icon: School,
  },
];

export default function MarketRevenueSection() {
  return (
    <NarrativeSection
      eyebrow="Mercado e receita"
      title="Receita recorrente com planos alinhados ao tamanho da operacao"
      lead="O BCM combina assinatura mensal, servicos de implantacao e potencial de contratos institucionais. A estrutura permite comecar em nichos claros e expandir para redes, escolas e municipios."
      tone="teal"
      metrics={[
        { value: 'R$ 297', label: 'entrada profissional' },
        { value: 'R$ 997', label: 'plano clinica' },
        { value: 'R$ 1.997', label: 'plano escola' },
      ]}
    >
      <div className="overflow-hidden rounded-xl bg-[#101F35] border border-[#263A59] shadow-lg shadow-black/20">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {plans.map(({ name, price, audience, icon: Icon }) => (
            <div
              key={name}
              className="min-w-0 p-5 sm:p-6 border-b md:border-b-0 md:border-r last:border-0 border-[#263A59] group hover:bg-white/5 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#5EEAD4]/10 flex items-center justify-center text-[#5EEAD4] mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{name}</h3>
              <p className="metric-value text-2xl sm:text-3xl font-black text-[#2D9B8A] my-3">{price}</p>
              <p className="prose-measure text-slate-200 leading-relaxed text-sm">{audience}</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#5EEAD4]">
                <Check className="w-3 h-3" />
                <span>Inclui suporte fundador</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </NarrativeSection>
  );
}
