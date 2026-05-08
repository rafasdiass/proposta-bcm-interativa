import React, { useState, useCallback } from 'react';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

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
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'active':
        return <Circle className="w-6 h-6 text-blue-600 fill-blue-600" />;
      case 'pending':
        return <Lock className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Timeline de Investimento
        </h2>
        <div className="flex items-baseline gap-2">
          <p className="text-lg text-gray-600">Investimento Total:</p>
          <p
            className="text-3xl font-bold text-teal-600"
            aria-label={`Investimento total de ${formatCurrency(TOTAL_INVESTMENT)}`}
          >
            {formatCurrency(TOTAL_INVESTMENT)}
          </p>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Progress Line */}
        <div
          className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200"
          aria-hidden="true"
        />

        {/* Tranches */}
        <div className="space-y-8">
          {TRANCHES.map((tranche, index) => {
            const isExpanded = expandedTranche === tranche.id;
            const isFocused = focusedTranche === tranche.id;
            const progress = calculateProgress(tranche.number);
            const progressColor = getProgressColor(progress);

            return (
              <div key={tranche.id} className="relative">
                {/* Progress indicator on timeline */}
                {index < TRANCHES.length && (
                  <div
                    className="absolute left-8 top-0 w-1 h-full transition-colors duration-300"
                    style={{
                      backgroundColor:
                        tranche.status === 'completed'
                          ? progressColor
                          : 'transparent',
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Tranche Card */}
                <div
                  className={`relative pl-20 transition-all duration-300 ${
                    isFocused
                      ? 'ring-2 ring-blue-500 ring-offset-2 rounded-lg'
                      : ''
                  }`}
                >
                  {/* Status Icon */}
                  <div
                    className="absolute left-5 top-0 bg-white p-1 rounded-full"
                    style={{
                      borderColor: progressColor,
                      borderWidth: '2px',
                    }}
                    aria-hidden="true"
                  >
                    {getStatusIcon(tranche.status)}
                  </div>

                  {/* Tranche Content */}
                  <div
                    className={`bg-gradient-to-br from-gray-50 to-white border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-md ${
                      isExpanded
                        ? 'shadow-lg border-teal-500'
                        : 'border-gray-200'
                    }`}
                    onClick={() => toggleTranche(tranche.id)}
                    onKeyDown={e => handleKeyDown(e, tranche.id)}
                    onFocus={() => setFocusedTranche(tranche.id)}
                    onBlur={() => setFocusedTranche(null)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-label={`Tranche ${tranche.number}: ${formatCurrency(tranche.amount)}, gatilho: ${tranche.trigger}`}
                  >
                    {/* Tranche Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            Tranche {tranche.number}
                          </h3>
                          <span
                            className="text-2xl font-bold"
                            style={{ color: progressColor }}
                          >
                            {formatCurrency(tranche.amount)}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-sm font-medium text-gray-600">
                            Gatilho:
                          </span>
                          <p className="text-sm text-gray-700 flex-1">
                            {tranche.trigger}
                          </p>
                        </div>
                      </div>

                      {/* Expand Indicator */}
                      <div
                        className={`ml-4 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Deliverables (Expandable) */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded
                          ? 'max-h-96 opacity-100'
                          : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          Entregas:
                        </h4>
                        <ul className="space-y-2" role="list">
                          {tranche.deliverables.map((deliverable, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <span
                                className="mt-1 flex-shrink-0"
                                style={{ color: progressColor }}
                                aria-hidden="true"
                              >
                                •
                              </span>
                              <span>{deliverable}</span>
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

      {/* Summary */}
      <div className="mt-8 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRANCHES.map(tranche => {
            const progress = calculateProgress(tranche.number);
            const progressColor = getProgressColor(progress);

            return (
              <div
                key={tranche.id}
                className="bg-white rounded-lg p-4 border-2"
                style={{ borderColor: progressColor }}
              >
                <p className="text-xs text-gray-600 mb-1">
                  T{tranche.number} -{' '}
                  {tranche.status === 'active'
                    ? 'Ativo'
                    : tranche.status === 'completed'
                      ? 'Completo'
                      : 'Pendente'}
                </p>
                <p
                  className="text-xl font-bold"
                  style={{ color: progressColor }}
                >
                  {formatCurrency(tranche.amount)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessibility Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-blue-900">
          <strong>Navegação:</strong> Use Tab para navegar entre tranches, Enter
          ou Espaço para expandir/recolher detalhes. Passe o mouse ou toque para
          revelar entregas.
        </p>
      </div>
    </div>
  );
};

export default TrancheTimeline;
