import React, { useState, useMemo } from 'react';
import { cn } from '@/utils';

// Plan pricing constants
const PLAN_PRICING = {
  professional: 297,
  clinic: 997,
  school: 1997,
} as const;

// Default values
const DEFAULT_SUBSCRIBERS = 350;
const DEFAULT_PLAN_MIX = {
  professional: 60,
  clinic: 30,
  school: 10,
};
const DEFAULT_ARR_MULTIPLE = 8; // SaaS verticais: 5x–15x ARR

// Pre-money valuation floor (capital already invested at cost)
// R$150k already invested by the founders before this round
const PREINVESTMENT_COST = 150000;

// Pre-configured scenarios with icons
const SCENARIOS = [
  {
    id: 'breakeven',
    name: 'Breakeven',
    desc: '350 assinantes',
    subscribers: 350,
    planMix: DEFAULT_PLAN_MIX,
    mrrMultiple: DEFAULT_ARR_MULTIPLE,
    icon: 'bi-target',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    id: '1k-subscribers',
    name: 'Crescimento',
    desc: '1.000 assinantes',
    subscribers: 1000,
    planMix: DEFAULT_PLAN_MIX,
    mrrMultiple: DEFAULT_ARR_MULTIPLE,
    icon: 'bi-graph-up-arrow',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10'
  },
  {
    id: 'national-presence',
    name: 'Escala',
    desc: '2.000 assinantes',
    subscribers: 2000,
    planMix: DEFAULT_PLAN_MIX,
    mrrMultiple: DEFAULT_ARR_MULTIPLE,
    icon: 'bi-rocket-takeoff',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  {
    id: 'national-dominance',
    name: 'Liderança',
    desc: '5.000 assinantes',
    subscribers: 5000,
    planMix: DEFAULT_PLAN_MIX,
    mrrMultiple: DEFAULT_ARR_MULTIPLE,
    icon: 'bi-lightning-fill',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10'
  },
] as const;

interface PlanMix {
  professional: number;
  clinic: number;
  school: number;
}

interface ROICalculations {
  monthlyRevenue: number;
  annualRevenue: number;
  estimatedValuation: number;
  fivePercentValue: number;
  multipleOfInvestment: number;
}

// Currency formatter for BRL
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Calculate ROI metrics using ARR-based valuation (industry standard)
// Valuation = MAX(Pre-money floor, ARR × Multiple)
// This ensures the 150k already invested at cost sets a valuation floor
const calculateROI = (
  subscribers: number,
  planMix: PlanMix,
  mrrMultiple: number
): ROICalculations => {
  const professionalRevenue = ((subscribers * planMix.professional) / 100) * PLAN_PRICING.professional;
  const clinicRevenue = ((subscribers * planMix.clinic) / 100) * PLAN_PRICING.clinic;
  const schoolRevenue = ((subscribers * planMix.school) / 100) * PLAN_PRICING.school;

  const monthlyRevenue = professionalRevenue + clinicRevenue + schoolRevenue;
  const annualRevenue = monthlyRevenue * 12; // ARR

  // Valuation uses ARR × multiple (industry standard for SaaS)
  // Floor = 3× the capital already invested at cost (R$150k)
  const arrBasedValuation = annualRevenue * mrrMultiple;
  const premoneyFloor = PREINVESTMENT_COST * 3; // R$450k floor
  const estimatedValuation = Math.max(arrBasedValuation, premoneyFloor);

  const fivePercentValue = estimatedValuation * 0.05;
  const multipleOfInvestment = fivePercentValue / 75000;

  return {
    monthlyRevenue,
    annualRevenue,
    estimatedValuation,
    fivePercentValue,
    multipleOfInvestment,
  };
};

export const ROISimulator: React.FC = () => {
  const [subscribers, setSubscribers] = useState(DEFAULT_SUBSCRIBERS);
  const [planMix, setPlanMix] = useState<PlanMix>(DEFAULT_PLAN_MIX);
  const [mrrMultiple, setMrrMultiple] = useState(DEFAULT_ARR_MULTIPLE);

  const calculations = useMemo(
    () => calculateROI(subscribers, planMix, mrrMultiple),
    [subscribers, planMix, mrrMultiple]
  );

  const handleSubscribersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setSubscribers(Math.max(0, Math.min(10000, value)));
    }
  };

  const handlePlanMixChange = (plan: keyof PlanMix, value: number) => {
    setPlanMix(prev => {
      const newMix = { ...prev, [plan]: value };
      const total = newMix.professional + newMix.clinic + newMix.school;
      if (total !== 100) {
        const otherPlans = Object.keys(newMix).filter(p => p !== plan) as (keyof PlanMix)[];
        const remaining = 100 - value;
        const otherTotal = otherPlans.reduce((sum, p) => sum + prev[p], 0);

        if (otherTotal > 0) {
          otherPlans.forEach(p => {
            newMix[p] = Math.round((prev[p] / otherTotal) * remaining);
          });
        } else {
          const perPlan = Math.floor(remaining / otherPlans.length);
          otherPlans.forEach((p, i) => {
            newMix[p] = i === 0 ? remaining - perPlan : perPlan;
          });
        }
      }
      return newMix;
    });
  };

  const handleMrrMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setMrrMultiple(Math.max(1, Math.min(50, value)));
    }
  };

  return (
    <div className="w-full overflow-x-hidden space-y-6">
      {/* Educational Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-white mb-2">Simulador de Valorização de Equity (5%)</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
          SaaS são avaliados pelo mercado com base na <strong>receita anual recorrente (ARR)</strong> multiplicada por um índice do setor.
          O BCM já possui <strong>R$ 150k investidos a custo próprio</strong> pelos fundadores, estabelecendo um piso de valuation defensável.
          Use o simulador para ver o valor real da sua participação em diferentes cenários de escala.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left Column: Inputs */}
        <div className="w-full lg:w-[60%] space-y-6">
          <div className="bg-[#101F35] border border-white/10 rounded-3xl p-6 shadow-2xl h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 flex items-center justify-center bg-[#2D9B8A]/20 rounded-xl text-[#2D9B8A]">
                <i className="bi bi-graph-up-arrow text-xl" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Onde o BCM pode chegar?</h2>
            </div>

            <div className="space-y-8">
              {/* Subscribers */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <label className="flex flex-col text-xs font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <i className="bi bi-people-fill text-[#2D9B8A]" />
                      Meta de Assinantes
                    </span>
                    <span className="text-[9px] font-medium text-slate-500 mt-1 lowercase normal-case tracking-normal">clínicas, escolas e terapeutas pagantes</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={subscribers}
                    onChange={handleSubscribersChange}
                    className="no-spin w-20 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-right text-base font-black text-[#2D9B8A] focus:outline-none focus:ring-1 focus:ring-[#2D9B8A]"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="50"
                  value={subscribers}
                  onChange={handleSubscribersChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#2D9B8A]"
                />
              </div>

              {/* Plan Mix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'professional', name: 'Profissional', price: 297, color: 'accent-[#2D9B8A]' },
                  { id: 'clinic', name: 'Clínica', price: 997, color: 'accent-blue-400' },
                  { id: 'school', name: 'Escola', price: 1997, color: 'accent-purple-400' },
                ].map(plan => (
                  <div key={plan.id} className="space-y-2 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                      <span className="text-slate-500 truncate">{plan.name}</span>
                      <span className="text-white">{planMix[plan.id as keyof PlanMix]}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={planMix[plan.id as keyof PlanMix]}
                      onChange={e => handlePlanMixChange(plan.id as keyof PlanMix, parseInt(e.target.value))}
                      className={cn("w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer", plan.color)}
                    />
                  </div>
                ))}
              </div>

              {/* Multiple */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <label className="flex flex-col text-xs font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <i className="bi bi-bar-chart-fill text-blue-400" />
                      Múltiplo sobre ARR
                    </span>
                    <span className="text-[9px] font-medium text-slate-500 mt-1 lowercase normal-case tracking-normal">valuation = ARR × múltiplo · ref. SaaS: 5x–15x</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={mrrMultiple}
                    onChange={handleMrrMultipleChange}
                    className="no-spin w-16 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-right text-base font-black text-blue-400 focus:outline-none"
                  />
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="0.5"
                  value={mrrMultiple}
                  onChange={handleMrrMultipleChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results (Sticky-ish on Desktop) */}
        <div className="w-full lg:w-[40%]">
          <div className="h-full flex flex-col bg-gradient-to-br from-[#1B3A6B] to-[#0B1A2D] border border-[#2D9B8A]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <i className="bi bi-currency-dollar text-[120px]" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Estimativa de Retorno</h3>
              
              <div className="space-y-4 flex-1">
                <div className="bg-[#0D1B2A] p-4 rounded-2xl border border-white/10">
                  <p className="text-slate-300 text-[10px] font-black uppercase tracking-wider mb-1">MRR (Faturamento Mensal)</p>
                  <p className="text-2xl font-black text-white tracking-tight">
                    {formatCurrency(calculations.monthlyRevenue)}
                  </p>
                </div>

                <div className="bg-[#0D1B2A] p-4 rounded-2xl border border-white/10">
                  <p className="text-slate-300 text-[10px] font-black uppercase tracking-wider mb-1">ARR (Receita Anual Recorrente)</p>
                  <p className="text-2xl font-black text-[#60A5FA] tracking-tight">
                    {formatCurrency(calculations.annualRevenue)}
                  </p>
                </div>

                <div className="bg-[#0D1B2A] p-4 rounded-2xl border border-white/10">
                  <p className="text-slate-300 text-[10px] font-black uppercase tracking-wider mb-1">Valuation da Empresa</p>
                  <p className="text-2xl font-black text-[#5EEAD4] tracking-tight">
                    {formatCurrency(calculations.estimatedValuation)}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1">Piso: R$ 450k (3× investimento já realizado)</p>
                </div>

                <div className="mt-auto bg-gradient-to-br from-[#F5A623] to-[#D97706] rounded-2xl p-5 shadow-xl shadow-amber-950/20 ring-1 ring-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 flex items-center justify-center bg-white/20 rounded-lg text-white">
                      <i className="bi bi-lightning-fill text-xs" />
                    </div>
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Valor do Equity (5%)</p>
                  </div>
                  <p className="text-4xl font-black text-white tracking-tighter">
                    {formatCurrency(calculations.fivePercentValue)}
                  </p>
                  {calculations.multipleOfInvestment >= 1 && (
                    <p className="mt-2 text-white font-black text-sm">
                      = {calculations.multipleOfInvestment.toFixed(1)}× o aporte de R$ 75k
                    </p>
                  )}
                  <p className="mt-1 text-white/60 text-[10px] leading-relaxed italic font-medium">
                    * Projeção baseada em ARR × múltiplo de mercado SaaS.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenarios Bar */}
      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Selecione um cenário para simular:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setSubscribers(s.subscribers);
                setPlanMix(s.planMix);
                setMrrMultiple(s.mrrMultiple);
              }}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl border border-white/5 transition-all hover:scale-[1.02] active:scale-95 group min-w-0",
                subscribers === s.subscribers ? "bg-[#2D9B8A] border-[#2D9B8A] shadow-lg shadow-[#2D9B8A]/20" : "bg-[#101F35]/60 backdrop-blur-md"
              )}
            >
              <div className={cn("w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl transition-colors", subscribers === s.subscribers ? "bg-white/20" : s.bg)}>
                <i className={cn(s.icon, "text-base", subscribers === s.subscribers ? "text-white" : s.color)} />
              </div>
              <div className="text-left min-w-0">
                <p className={cn("text-[10px] font-black uppercase tracking-wider leading-none mb-1 truncate", subscribers === s.subscribers ? "text-white/80" : "text-slate-500")}>{s.name}</p>
                <p className={cn("text-xs font-bold truncate", subscribers === s.subscribers ? "text-white" : "text-slate-300")}>{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
        <i className="bi bi-info-circle-fill text-[#F5A623]" />
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-wider">
          Projeções baseadas em métricas SaaS (MRR x Múltiplo). O valuation real depende de churn e EBITDA.
        </p>
      </div>
    </div>
  );
};

export default ROISimulator;
