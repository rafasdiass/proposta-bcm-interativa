import React, { useState, useMemo, useCallback } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';

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
const DEFAULT_MRR_MULTIPLE = 5;

// Pre-configured scenarios
const SCENARIOS = [
  {
    id: 'breakeven',
    name: 'Breakeven (350 assinantes)',
    subscribers: 350,
    planMix: DEFAULT_PLAN_MIX,
    mrrMultiple: DEFAULT_MRR_MULTIPLE,
  },
  {
    id: '1k-subscribers',
    name: '1.000 assinantes',
    subscribers: 1000,
    planMix: DEFAULT_PLAN_MIX,
    mrrMultiple: DEFAULT_MRR_MULTIPLE,
  },
  {
    id: 'municipal-contract',
    name: 'Contrato municipal + 500 assinantes',
    subscribers: 500,
    planMix: DEFAULT_PLAN_MIX,
    mrrMultiple: DEFAULT_MRR_MULTIPLE,
  },
  {
    id: 'national-presence',
    name: 'Presença nacional',
    subscribers: 2000,
    planMix: DEFAULT_PLAN_MIX,
    mrrMultiple: DEFAULT_MRR_MULTIPLE,
  },
] as const;

interface PlanMix {
  professional: number;
  clinic: number;
  school: number;
}

interface ROICalculations {
  monthlyRevenue: number;
  estimatedValuation: number;
  fivePercentValue: number;
}

// Currency formatter for BRL
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Calculate ROI metrics
const calculateROI = (
  subscribers: number,
  planMix: PlanMix,
  mrrMultiple: number
): ROICalculations => {
  // Calculate revenue per plan type
  const professionalRevenue =
    ((subscribers * planMix.professional) / 100) * PLAN_PRICING.professional;
  const clinicRevenue =
    ((subscribers * planMix.clinic) / 100) * PLAN_PRICING.clinic;
  const schoolRevenue =
    ((subscribers * planMix.school) / 100) * PLAN_PRICING.school;

  // Total monthly revenue
  const monthlyRevenue = professionalRevenue + clinicRevenue + schoolRevenue;

  // Estimated valuation (MRR * multiple)
  const estimatedValuation = monthlyRevenue * mrrMultiple;

  // 5% value
  const fivePercentValue = estimatedValuation * 0.05;

  return {
    monthlyRevenue,
    estimatedValuation,
    fivePercentValue,
  };
};

export const ROISimulator: React.FC = () => {
  const [subscribers, setSubscribers] = useState(DEFAULT_SUBSCRIBERS);
  const [planMix, setPlanMix] = useState<PlanMix>(DEFAULT_PLAN_MIX);
  const [mrrMultiple, setMrrMultiple] = useState(DEFAULT_MRR_MULTIPLE);

  // Calculate ROI metrics with memoization for performance
  const calculations = useMemo(
    () => calculateROI(subscribers, planMix, mrrMultiple),
    [subscribers, planMix, mrrMultiple]
  );

  // Handle subscriber count change
  const handleSubscribersChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setSubscribers(Math.max(0, Math.min(5000, value)));
      }
    },
    []
  );

  // Handle plan mix change
  const handlePlanMixChange = useCallback(
    (plan: keyof PlanMix, value: number) => {
      setPlanMix(prev => {
        const newMix = { ...prev, [plan]: value };
        // Ensure total is 100%
        const total = newMix.professional + newMix.clinic + newMix.school;
        if (total !== 100) {
          // Adjust other plans proportionally
          const otherPlans = Object.keys(newMix).filter(
            p => p !== plan
          ) as (keyof PlanMix)[];
          const remaining = 100 - value;
          const otherTotal = otherPlans.reduce((sum, p) => sum + prev[p], 0);

          if (otherTotal > 0) {
            otherPlans.forEach(p => {
              newMix[p] = Math.round((prev[p] / otherTotal) * remaining);
            });
          } else {
            // Distribute evenly if other plans are 0
            const perPlan = Math.floor(remaining / otherPlans.length);
            otherPlans.forEach((p, i) => {
              newMix[p] = i === 0 ? remaining - perPlan : perPlan;
            });
          }
        }
        return newMix;
      });
    },
    []
  );

  // Handle MRR multiple change
  const handleMrrMultipleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        setMrrMultiple(Math.max(1, Math.min(20, value)));
      }
    },
    []
  );

  // Load pre-configured scenario
  const loadScenario = useCallback((scenarioId: string) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      setSubscribers(scenario.subscribers);
      setPlanMix(scenario.planMix);
      setMrrMultiple(scenario.mrrMultiple);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          Simulador de ROI dos 5%
        </h2>
      </div>

      {/* Pre-configured Scenarios */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Cenários Pré-configurados
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {SCENARIOS.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => loadScenario(scenario.id)}
              className="px-3 py-2 sm:px-4 sm:py-3 text-left bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-lg transition-colors border border-blue-200 hover:border-blue-300 min-h-[44px] touch-manipulation"
            >
              <span className="text-xs sm:text-sm font-medium text-blue-900">
                {scenario.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Controls */}
      <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        {/* Subscriber Count */}
        <div>
          <label
            htmlFor="subscribers"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
          >
            Número de Assinantes Pagantes
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <input
              id="subscribers"
              type="range"
              min="0"
              max="5000"
              step="10"
              value={subscribers}
              onChange={handleSubscribersChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 touch-manipulation"
              style={{ minHeight: '44px' }}
            />
            <input
              type="number"
              min="0"
              max="5000"
              step="10"
              value={subscribers}
              onChange={handleSubscribersChange}
              className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[44px] touch-manipulation"
            />
          </div>
        </div>

        {/* Plan Mix */}
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
            Mix de Planos (%)
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {/* Professional Plan */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="plan-professional"
                  className="text-xs sm:text-sm text-gray-600"
                >
                  Profissional (R$ 297)
                </label>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {planMix.professional}%
                </span>
              </div>
              <input
                id="plan-professional"
                type="range"
                min="0"
                max="100"
                step="1"
                value={planMix.professional}
                onChange={e =>
                  handlePlanMixChange('professional', parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 touch-manipulation"
                style={{ minHeight: '44px' }}
              />
            </div>

            {/* Clinic Plan */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="plan-clinic"
                  className="text-xs sm:text-sm text-gray-600"
                >
                  Clínica (R$ 997)
                </label>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {planMix.clinic}%
                </span>
              </div>
              <input
                id="plan-clinic"
                type="range"
                min="0"
                max="100"
                step="1"
                value={planMix.clinic}
                onChange={e =>
                  handlePlanMixChange('clinic', parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 touch-manipulation"
                style={{ minHeight: '44px' }}
              />
            </div>

            {/* School Plan */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="plan-school"
                  className="text-xs sm:text-sm text-gray-600"
                >
                  Escola (R$ 1.997)
                </label>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {planMix.school}%
                </span>
              </div>
              <input
                id="plan-school"
                type="range"
                min="0"
                max="100"
                step="1"
                value={planMix.school}
                onChange={e =>
                  handlePlanMixChange('school', parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 touch-manipulation"
                style={{ minHeight: '44px' }}
              />
            </div>
          </div>
        </div>

        {/* MRR Multiple */}
        <div>
          <label
            htmlFor="mrr-multiple"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
          >
            Múltiplo de MRR para Valuation
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <input
              id="mrr-multiple"
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={mrrMultiple}
              onChange={handleMrrMultipleChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 touch-manipulation"
              style={{ minHeight: '44px' }}
            />
            <input
              type="number"
              min="1"
              max="20"
              step="0.5"
              value={mrrMultiple}
              onChange={handleMrrMultipleChange}
              className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[44px] touch-manipulation"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Resultados da Simulação
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Monthly Revenue */}
          <div className="bg-white rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-600 mb-1">Receita Mensal (MRR)</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">
              {formatCurrency(calculations.monthlyRevenue)}
            </p>
          </div>

          {/* Estimated Valuation */}
          <div className="bg-white rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-600 mb-1">Valuation Estimado</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">
              {formatCurrency(calculations.estimatedValuation)}
            </p>
          </div>

          {/* 5% Value */}
          <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-blue-500 sm:col-span-2 lg:col-span-1">
            <p className="text-xs text-gray-600 mb-1">Valor dos 5%</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 break-words">
              {formatCurrency(calculations.fivePercentValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
        <p className="text-xs text-amber-900">
          <strong>Aviso:</strong> Projeções são estimativas comerciais por
          múltiplo de MRR e não constituem garantia de retorno.
        </p>
      </div>
    </div>
  );
};

export default ROISimulator;
