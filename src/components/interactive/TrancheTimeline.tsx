import React, { useState, useCallback } from 'react';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/utils';

// Tranche data structure
interface Tranche {
  id: string;
  number: number;
  amount: number;
  trigger: string;
  deliverables: string[];
  status: 'pending' | 'active' | 'completed';
}

// Constants from requirements
const TOTAL_INVESTMENT = 75000;

const TRANCHES: Tranche[] = [
  {
    id: 't1',
    number: 1,
    amount: 30000,
    trigger: 'Assinatura do contrato',
    deliverables: [
      'Viagem inicial para reunião presencial',
      'Onboarding completo da equipe',
      'Início da integração OERA',
      'Setup do ambiente de desenvolvimento',
    ],
    status: 'active',
  },
  {
    id: 't2',
    number: 2,
    amount: 25000,
    trigger: '50 usuários pagantes ativos',
    deliverables: [
      'Módulo de gestão de pacientes completo',
      'Sistema de agendamento implementado',
      'Integração com plataformas de pagamento',
      'Dashboard de métricas operacionais',
    ],
    status: 'pending',
  },
  {
    id: 't3',
    number: 3,
    amount: 20000,
    trigger: 'Publicação conjunta OU 100 usuários pagantes',
    deliverables: [
      'Módulo de prontuário eletrônico',
      'Sistema de relatórios avançados',
      'Integração completa OERA',
      'Documentação técnica finalizada',
    ],
    status: 'pending',
  },
];

// Currency formatter for BRL
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Calculate progress percentage for gradient
const calculateProgress = (trancheNumber: number): number => {
  // Progress is based on tranche position (0%, 50%, 100%)
  return ((trancheNumber - 1) / (TRANCHES.length - 1)) * 100;
};

// Get color based on progress (green to amber gradient)
const getProgressColor = (progress: number): string => {
  // Interpolate between green (#2D9B8A) and amber (#F5A623)
  const green = { r: 45, g: 155, b: 138 };
  const amber = { r: 245, g: 166, b: 35 };

  const ratio = progress / 100;
  const r = Math.round(green.r + (amber.r - green.r) * ratio);
  const g = Math.round(green.g + (amber.g - green.g) * ratio);
  const b = Math.round(green.b + (amber.b - green.b) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
};

export const TrancheTimeline: React.FC = () => {
  const [expandedTranche, setExpandedTranche] = useState<string | null>(null);
  const [focusedTranche, setFocusedTranche] = useState<string | null>(null);

  // Toggle tranche expansion
  const toggleTranche = useCallback((trancheId: string) => {
    setExpandedTranche(prev => (prev === trancheId ? null : trancheId));
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, trancheId: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTranche(trancheId);
      }
    },
    [toggleTranche]
  );

  // Get status icon
  const getStatusIcon = (status: Tranche['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-[#5EEAD4]" />;
      case 'active':
        return <Circle className="w-6 h-6 text-[#60A5FA] fill-[#60A5FA]" />;
      case 'pending':
        return <Lock className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-[#101F35] border border-[#263A59] rounded-2xl shadow-xl shadow-black/40 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
            Timeline de Investimento
          </h2>
          <div className="flex items-baseline gap-2">
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Aporte Total:</p>
            <p
              className="text-3xl font-black text-[#5EEAD4]"
              aria-label={`Investimento total de ${formatCurrency(TOTAL_INVESTMENT)}`}
            >
              {formatCurrency(TOTAL_INVESTMENT)}
            </p>
          </div>
        </div>
        
        {/* Progress Summary Mini */}
        <div className="flex gap-2">
          {TRANCHES.map(t => (
            <div 
              key={t.id} 
              className={cn(
                "w-3 h-3 rounded-full",
                t.status === 'completed' ? "bg-[#5EEAD4]" : t.status === 'active' ? "bg-[#60A5FA] animate-pulse" : "bg-slate-700"
              )}
            />
          ))}
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Progress Line (Vertical on mobile, Horizontal on desktop) */}
        <div
          className="absolute left-8 md:left-0 md:top-12 top-0 md:w-full w-1 md:h-1 h-full bg-[#263A59]"
          aria-hidden="true"
        />

        {/* Tranches Grid */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-4 relative z-10">
          {TRANCHES.map((tranche, index) => {
            const isExpanded = expandedTranche === tranche.id;
            const isFocused = focusedTranche === tranche.id;
            const progress = calculateProgress(tranche.number);
            const progressColor = getProgressColor(progress);

            return (
              <div key={tranche.id} className="flex-1 min-w-0">
                <div
                  className={`relative md:pt-20 pl-20 md:pl-0 transition-all duration-300 ${
                    isFocused ? 'ring-2 ring-[#60A5FA] rounded-xl ring-offset-4 ring-offset-[#101F35]' : ''
                  }`}
                >
                  {/* Status Indicator (on the line) */}
                  <div
                    className="absolute left-5 md:left-1/2 md:top-8 -translate-x-1/2 bg-[#101F35] p-2 rounded-full border-4 shadow-lg z-20"
                    style={{ borderColor: tranche.status === 'pending' ? '#263A59' : progressColor }}
                    aria-hidden="true"
                  >
                    {getStatusIcon(tranche.status)}
                  </div>

                  {/* Tranche Card */}
                  <div
                    className={cn(
                      "bg-[#08111F] border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl",
                      isExpanded ? "border-teal-500 ring-4 ring-teal-500/10" : "border-[#263A59] hover:border-slate-500"
                    )}
                    onClick={() => toggleTranche(tranche.id)}
                    onKeyDown={e => handleKeyDown(e, tranche.id)}
                    onFocus={() => setFocusedTranche(tranche.id)}
                    onBlur={() => setFocusedTranche(null)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tranche {tranche.number}</span>
                        <div className={cn("transition-transform duration-300", isExpanded ? "rotate-180" : "")}>
                          <i className="bi bi-chevron-down text-slate-600" />
                        </div>
                      </div>
                      
                      <p className="text-xl font-black text-white leading-none">
                        {formatCurrency(tranche.amount)}
                      </p>
                      
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Gatilho:</span>
                        <p className="text-xs text-slate-300 font-medium leading-tight line-clamp-2">
                          {tranche.trigger}
                        </p>
                      </div>

                      {/* Expandable Deliverables */}
                      <div className={cn(
                        "overflow-hidden transition-all duration-500",
                        isExpanded ? "max-h-96 opacity-100 mt-4 pt-4 border-t border-white/5" : "max-h-0 opacity-0"
                      )}>
                        <h4 className="text-[10px] font-black text-[#5EEAD4] uppercase tracking-widest mb-3">Entregas Chave:</h4>
                        <ul className="space-y-2">
                          {tranche.deliverables.map((d, i) => (
                            <li key={i} className="flex gap-2 text-[11px] text-slate-400 leading-snug">
                              <span className="text-[#5EEAD4]">•</span>
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Logic Info */}
      <div className="mt-12 flex flex-col sm:flex-row gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
        <div className="flex-1 flex gap-4">
          <div className="w-12 h-12 flex-shrink-0 bg-[#F5A623]/20 rounded-xl flex items-center justify-center text-[#F5A623]">
            <i className="bi bi-shield-check text-2xl" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Proteção ao Investidor</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              As tranches vinculadas a marcos (milestones) garantem que o capital só seja liberado conforme o risco do projeto diminui e a tração aumenta.
            </p>
          </div>
        </div>
        <div className="flex-1 flex gap-4 border-t sm:border-t-0 sm:border-l border-white/10 pt-6 sm:pt-0 sm:pl-6">
          <div className="w-12 h-12 flex-shrink-0 bg-[#60A5FA]/20 rounded-xl flex items-center justify-center text-[#60A5FA]">
            <i className="bi bi-lightning-charge text-2xl" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-1">Agilidade na Execução</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Cada liberação financia o próximo ciclo de crescimento, mantendo o time focado em métricas que geram valor real e escalabilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrancheTimeline;
