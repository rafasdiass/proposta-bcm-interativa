import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Default deadline: May 22, 2026, 23:59:59 in America/Sao_Paulo timezone
const DEFAULT_DEADLINE = new Date('2026-05-22T23:59:59-03:00');

// Urgency threshold: 72 hours in milliseconds
const URGENCY_THRESHOLD_MS = 72 * 60 * 60 * 1000;

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

interface CountdownTimerProps {
  deadline?: Date;
  className?: string;
}

/**
 * Calculate time remaining until deadline
 */
const calculateTimeRemaining = (deadline: Date): CountdownState => {
  const now = new Date();
  const timeRemaining = deadline.getTime() - now.getTime();

  if (timeRemaining <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
};

/**
 * Format number with leading zero
 */
const formatNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};

/**
 * Check if deadline is within urgency threshold
 */
const isUrgent = (deadline: Date): boolean => {
  const now = new Date();
  const timeRemaining = deadline.getTime() - now.getTime();
  return timeRemaining > 0 && timeRemaining <= URGENCY_THRESHOLD_MS;
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  deadline = DEFAULT_DEADLINE,
  className = '',
}) => {
  const [timeRemaining, setTimeRemaining] = useState<CountdownState>(() =>
    calculateTimeRemaining(deadline)
  );
  const prefersReducedMotion = useReducedMotion();
  const urgent = isUrgent(deadline);

  // Update countdown every second
  useEffect(() => {
    // Initial calculation
    setTimeRemaining(calculateTimeRemaining(deadline));

    // Don't set up interval if already expired
    if (timeRemaining.isExpired) {
      return;
    }

    // Update every second
    const intervalId = setInterval(() => {
      const newTimeRemaining = calculateTimeRemaining(deadline);
      setTimeRemaining(newTimeRemaining);

      // Clear interval if expired
      if (newTimeRemaining.isExpired) {
        clearInterval(intervalId);
      }
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [deadline, timeRemaining.isExpired]);

  // Determine color based on urgency
  const colorClass = urgent
    ? 'text-amber-600 border-amber-500 bg-amber-50'
    : 'text-blue-600 border-blue-500 bg-blue-50';

  const iconColorClass = urgent ? 'text-amber-600' : 'text-blue-600';

  // Animation class (respects reduced motion)
  const animationClass = !prefersReducedMotion && urgent ? 'animate-pulse' : '';

  return (
    <div
      className={`w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Clock className={`w-8 h-8 ${iconColorClass}`} />
        <h2 className="text-2xl font-bold text-gray-900">
          Validade da Proposta
        </h2>
      </div>

      {/* Countdown Display */}
      {timeRemaining.isExpired ? (
        // Expired State
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-8">
          <div className="flex items-center justify-center gap-3">
            <AlertCircle className="w-12 h-12 text-red-600" />
            <div>
              <p className="text-3xl font-bold text-red-600">
                Proposta Expirada
              </p>
              <p className="text-sm text-red-700 mt-2">
                Entre em contato para renovar a proposta
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Active Countdown
        <div
          className={`border-2 rounded-lg p-8 transition-colors duration-300 ${colorClass} ${animationClass}`}
        >
          {/* Time Units Grid */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {/* Days */}
            <div className="text-center">
              <div
                className="text-5xl font-bold mb-2"
                aria-label={`${timeRemaining.days} dias`}
              >
                {formatNumber(timeRemaining.days)}
              </div>
              <div className="text-sm font-medium uppercase tracking-wide opacity-75">
                Dias
              </div>
            </div>

            {/* Hours */}
            <div className="text-center">
              <div
                className="text-5xl font-bold mb-2"
                aria-label={`${timeRemaining.hours} horas`}
              >
                {formatNumber(timeRemaining.hours)}
              </div>
              <div className="text-sm font-medium uppercase tracking-wide opacity-75">
                Horas
              </div>
            </div>

            {/* Minutes */}
            <div className="text-center">
              <div
                className="text-5xl font-bold mb-2"
                aria-label={`${timeRemaining.minutes} minutos`}
              >
                {formatNumber(timeRemaining.minutes)}
              </div>
              <div className="text-sm font-medium uppercase tracking-wide opacity-75">
                Minutos
              </div>
            </div>

            {/* Seconds */}
            <div className="text-center">
              <div
                className="text-5xl font-bold mb-2"
                aria-label={`${timeRemaining.seconds} segundos`}
              >
                {formatNumber(timeRemaining.seconds)}
              </div>
              <div className="text-sm font-medium uppercase tracking-wide opacity-75">
                Segundos
              </div>
            </div>
          </div>

          {/* Urgency Message */}
          {urgent && (
            <div className="bg-white rounded-lg p-4 border border-amber-300">
              <p className="text-sm font-semibold text-amber-900 text-center">
                ⚠️ Tempo limitado! Esta proposta expira em breve.
              </p>
            </div>
          )}

          {/* Deadline Information */}
          <div className="mt-6 text-center">
            <p className="text-sm opacity-75">
              Válida até:{' '}
              <span className="font-semibold">
                {deadline.toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'America/Sao_Paulo',
                })}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Accessibility Note */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-700">
          <strong>Nota:</strong> O contador é atualizado automaticamente a cada
          segundo.{' '}
          {prefersReducedMotion &&
            'Animações decorativas foram desabilitadas conforme sua preferência.'}
        </p>
      </div>
    </div>
  );
};

export default CountdownTimer;
