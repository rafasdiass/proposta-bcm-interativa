import React, { useState, useMemo } from 'react';
import { cn } from '@/utils';

// Constants
const TOTAL_INVESTMENT = 75000;
const DISCOUNT_RATE = 0.25;
const MIN_MONTHLY_COST = 0;
const MAX_MONTHLY_COST = 200000;

// Reference examples from the proposal
const REFERENCE_EXAMPLES = [
  {
    label: 'Médio Porte',
    monthlyCost: 12000,
    icon: 'bi-speedometer2',
  },
  {
    label: 'Avançada',
    monthlyCost: 25000,
    icon: 'bi-cpu-fill',
  },
] as const;

interface SavingsCalculations {
  monthlySavings: number;
  annualSavings: number;
  paybackYears: number | null;
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

// Calculate savings and payback
const calculateSavings = (monthlyCost: number): SavingsCalculations => {
  const monthlySavings = monthlyCost * DISCOUNT_RATE;
  const annualSavings = monthlySavings * 12;
  const paybackYears = monthlyCost > 0 ? TOTAL_INVESTMENT / annualSavings : null;

  return {
    monthlySavings,
    annualSavings,
    paybackYears,
  };
};

export const SofthouseCalculator: React.FC = () => {
  const [monthlyCost, setMonthlyCost] = useState(12000);

  const calculations = useMemo(
    () => calculateSavings(monthlyCost),
    [monthlyCost]
  );

  const handleMonthlyCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setMonthlyCost(Math.max(MIN_MONTHLY_COST, Math.min(MAX_MONTHLY_COST, value)));
    } else if (e.target.value === '') {
      setMonthlyCost(0);
    }
  };

  return (
    <div className="w-full overflow-x-hidden space-y-6">
      {/* Educational Header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-white mb-2">Simulador de Eficiência em Tecnologia</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
          Como investidor âncora, o Gradual acessa o time da LaVita Code com <strong>custos reduzidos</strong>. 
          Isso gera um retorno direto: a economia mensal acumulada "paga" o aporte inicial de {formatCurrency(TOTAL_INVESTMENT)}.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Left Column: Inputs */}
        <div className="w-full lg:w-[60%] space-y-6">
          <div className="bg-[#101F35] border border-white/10 rounded-3xl p-6 shadow-2xl h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 flex items-center justify-center bg-[#5EEAD4]/20 rounded-xl text-[#5EEAD4]">
                <i className="bi bi-cpu-fill text-xl" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Custo de Desenvolvimento</h2>
            </div>

            <div className="space-y-10">
              {/* Monthly Cost Input */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <label className="flex flex-col text-xs font-black text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2">
                      <i className="bi bi-cash-stack text-[#5EEAD4]" />
                      Demanda Mensal
                    </span>
                    <span className="text-[9px] font-medium text-slate-500 mt-1 lowercase normal-case tracking-normal">valor investido em softhouses tradicionais</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-bold text-sm">R$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={monthlyCost}
                      onChange={handleMonthlyCostChange}
                      className="no-spin w-24 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-right text-base font-black text-[#5EEAD4] focus:outline-none focus:ring-1 focus:ring-[#5EEAD4]"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={MIN_MONTHLY_COST}
                  max={MAX_MONTHLY_COST}
                  step="1000"
                  value={monthlyCost}
                  onChange={handleMonthlyCostChange}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#5EEAD4]"
                />
              </div>

              {/* Scenarios Bar */}
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cenários de Referência</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REFERENCE_EXAMPLES.map((example) => (
                    <button
                      key={example.label}
                      onClick={() => setMonthlyCost(example.monthlyCost)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-2xl border border-white/5 transition-all hover:scale-[1.02] active:scale-95 min-w-0 overflow-hidden",
                        monthlyCost === example.monthlyCost ? "bg-[#5EEAD4] border-[#5EEAD4] text-white shadow-lg shadow-[#5EEAD4]/20" : "bg-white/5"
                      )}
                    >
                      <div className={cn("w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl", monthlyCost === example.monthlyCost ? "bg-white/20" : "bg-[#5EEAD4]/10 text-[#5EEAD4]")}>
                        <i className={cn(example.icon, "text-base")} />
                      </div>
                      <div className="text-left min-w-0">
                        <p className={cn("text-[10px] font-black uppercase tracking-wider leading-none mb-1 truncate", monthlyCost === example.monthlyCost ? "text-white/80" : "text-slate-500")}>{example.label}</p>
                        <p className={cn("text-sm font-black truncate", monthlyCost === example.monthlyCost ? "text-white" : "text-white")}>{formatCurrency(example.monthlyCost)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Badge */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#2D9B8A]/20 to-transparent border-l-4 border-[#2D9B8A] rounded-r-2xl">
                <div className="w-10 h-10 flex items-center justify-center bg-[#2D9B8A] rounded-full text-white shadow-lg shadow-[#2D9B8A]/20">
                  <i className="bi bi-percent text-lg" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#5EEAD4] uppercase tracking-[0.2em]">Retorno em Eficiência</p>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">Você recebe o mesmo serviço de ponta, mas paga 25% a menos por ser investidor âncora.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="w-full lg:w-[40%]">
          <div className="h-full flex flex-col bg-gradient-to-br from-[#09221F] to-[#0B1A2D] border border-[#5EEAD4]/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <i className="bi bi-shield-check text-[140px] text-[#5EEAD4]" />
            </div>

            <div className="relative z-10 flex flex-col h-full space-y-10">
              <h3 className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">Retorno sem Escala</h3>
              
              <div className="space-y-8 flex-1">
                <div>
                  <p className="text-slate-300 text-[10px] font-black uppercase tracking-wider mb-2">Economia Mensal</p>
                  <p className="text-3xl font-black text-white tracking-tight">
                    {formatCurrency(calculations.monthlySavings)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-300 text-[10px] font-black uppercase tracking-wider mb-2">Economia Anual</p>
                  <p className="text-4xl font-black text-[#5EEAD4] tracking-tight">
                    {formatCurrency(calculations.annualSavings)}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/10 mt-auto bg-white/5 p-6 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 flex items-center justify-center bg-[#F5A623] rounded-lg text-white">
                      <i className="bi bi-clock-fill text-xs" />
                    </div>
                    <p className="text-[#F5A623] text-[10px] font-black uppercase tracking-widest">Payback do Investimento</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-black text-white tracking-tighter">
                      {calculations.paybackYears !== null ? calculations.paybackYears.toFixed(1) : '--'}
                    </p>
                    <p className="text-xl font-bold text-slate-400">anos</p>
                  </div>
                  <p className="mt-3 text-slate-500 text-[9px] leading-relaxed italic uppercase tracking-wider font-bold">
                    Tempo para a economia acumulada igualar o aporte de {formatCurrency(TOTAL_INVESTMENT)}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
        <i className="bi bi-arrow-right-circle-fill text-[#5EEAD4]" />
        <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-wider">
          O desconto operacional garante que o investimento se pague apenas pela eficiência, independente de dividendos ou exit.
        </p>
      </div>
    </div>
  );
};

export default SofthouseCalculator;
