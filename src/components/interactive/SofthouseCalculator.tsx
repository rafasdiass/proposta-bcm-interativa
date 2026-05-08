import React, { useState, useMemo, useCallback } from 'react';
import { Calculator, TrendingDown, Clock } from 'lucide-react';

// Constants
const TOTAL_INVESTMENT = 75000;
const DISCOUNT_RATE = 0.25;
const MIN_MONTHLY_COST = 0;
const MAX_MONTHLY_COST = 200000;

// Reference examples from the proposal
const REFERENCE_EXAMPLES = [
  {
    monthlyCost: 8000,
    annualSavings: 24000,
    paybackYears: 3.1,
  },
  {
    monthlyCost: 12000,
    annualSavings: 36000,
    paybackYears: 2.1,
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Calculate savings and payback
const calculateSavings = (monthlyCost: number): SavingsCalculations => {
  // Monthly savings = monthly cost * 25% discount
  const monthlySavings = monthlyCost * DISCOUNT_RATE;

  // Annual savings = monthly savings * 12
  const annualSavings = monthlySavings * 12;

  // Payback years = total investment / annual savings
  // Returns null if monthly cost is zero to avoid division by zero
  const paybackYears =
    monthlyCost > 0 ? TOTAL_INVESTMENT / annualSavings : null;

  return {
    monthlySavings,
    annualSavings,
    paybackYears,
  };
};

export const SofthouseCalculator: React.FC = () => {
  const [monthlyCost, setMonthlyCost] = useState(0);

  // Calculate savings with memoization for performance
  const calculations = useMemo(
    () => calculateSavings(monthlyCost),
    [monthlyCost]
  );

  // Handle monthly cost change
  const handleMonthlyCostChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
        setMonthlyCost(
          Math.max(MIN_MONTHLY_COST, Math.min(MAX_MONTHLY_COST, value))
        );
      } else if (e.target.value === '') {
        setMonthlyCost(0);
      }
    },
    []
  );

  // Load reference example
  const loadExample = useCallback((exampleMonthlyCost: number) => {
    setMonthlyCost(exampleMonthlyCost);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-teal-600 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Calculadora Softhouse LaVita Code
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Calcule a economia operacional com 25% de desconto em serviços de
            desenvolvimento
          </p>
        </div>
      </div>

      {/* Reference Examples */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Exemplos de Referência
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {REFERENCE_EXAMPLES.map((example, index) => (
            <button
              key={index}
              onClick={() => loadExample(example.monthlyCost)}
              className="px-3 py-2 sm:px-4 sm:py-3 text-left bg-teal-50 hover:bg-teal-100 active:bg-teal-200 rounded-lg transition-colors border border-teal-200 hover:border-teal-300 min-h-[44px] touch-manipulation"
            >
              <div className="text-xs sm:text-sm font-medium text-teal-900 mb-1">
                {formatCurrency(example.monthlyCost)}/mês
              </div>
              <div className="text-xs text-teal-700">
                Economia: {formatCurrency(example.annualSavings)}/ano • Payback:{' '}
                {example.paybackYears} anos
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Control */}
      <div className="mb-6 sm:mb-8">
        <label
          htmlFor="monthly-cost"
          className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
        >
          Custo Mensal Atual de Software (BRL)
        </label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <input
            id="monthly-cost"
            type="range"
            min={MIN_MONTHLY_COST}
            max={MAX_MONTHLY_COST}
            step="1000"
            value={monthlyCost}
            onChange={handleMonthlyCostChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600 touch-manipulation"
            style={{ minHeight: '44px' }}
          />
          <input
            type="number"
            min={MIN_MONTHLY_COST}
            max={MAX_MONTHLY_COST}
            step="1000"
            value={monthlyCost}
            onChange={handleMonthlyCostChange}
            className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-md text-sm min-h-[44px] touch-manipulation"
            placeholder="0"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Intervalo: {formatCurrency(MIN_MONTHLY_COST)} a{' '}
          {formatCurrency(MAX_MONTHLY_COST)}
        </p>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Economia com 25% de Desconto
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Monthly Savings */}
          <div className="bg-white rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-600 mb-1">Economia Mensal</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 break-words">
              {formatCurrency(calculations.monthlySavings)}
            </p>
          </div>

          {/* Annual Savings */}
          <div className="bg-white rounded-lg p-3 sm:p-4">
            <p className="text-xs text-gray-600 mb-1">Economia Anual</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600 break-words">
              {formatCurrency(calculations.annualSavings)}
            </p>
          </div>

          {/* Payback Years */}
          <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-teal-500 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-gray-600 flex-shrink-0" />
              <p className="text-xs text-gray-600">
                Payback (Investimento: {formatCurrency(TOTAL_INVESTMENT)})
              </p>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-teal-600">
              {calculations.paybackYears !== null
                ? `${calculations.paybackYears.toFixed(1)} anos`
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Zero cost message */}
        {monthlyCost === 0 && (
          <div className="mt-3 sm:mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-amber-900">
              Informe um custo mensal para estimar o payback
            </p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <p className="text-xs text-blue-900">
          <strong>Nota Importante:</strong> Esta calculadora mostra o retorno
          operacional do uso dos serviços de desenvolvimento da LaVita Code com
          25% de desconto, independente do retorno sobre o investimento em
          equity. O payback é calculado considerando o investimento total de{' '}
          {formatCurrency(TOTAL_INVESTMENT)} dividido pela economia anual
          gerada.
        </p>
      </div>
    </div>
  );
};

export default SofthouseCalculator;
