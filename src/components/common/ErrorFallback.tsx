/**
 * Error Fallback Components
 *
 * Provides fallback UI components for different error scenarios
 * Requirements: Task 11.2 - Create fallback UI components for error states
 */

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, FileText } from 'lucide-react';
import type { FallbackProps } from 'react-error-boundary';

/**
 * Generic error fallback component
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      role="alert"
      aria-live="assertive"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle
              className="w-8 h-8 text-red-600"
              aria-hidden="true"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Algo deu errado
        </h1>

        <p className="text-gray-600 mb-6">
          Desculpe, encontramos um problema inesperado. Por favor, tente
          novamente.
        </p>

        {import.meta.env.DEV && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
              Detalhes técnicos
            </summary>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40 text-red-600">
              {errorObj.message}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Tentar novamente"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Tentar novamente
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Voltar ao início"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Voltar ao início
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Section-level error fallback (less intrusive)
 */
export function SectionErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full py-12 px-4 bg-red-50 border border-red-200 rounded-lg"
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" aria-hidden="true" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Erro ao carregar esta seção
        </h2>

        <p className="text-gray-600 mb-4">
          Esta seção não pôde ser carregada. Você pode continuar navegando pelas
          outras seções.
        </p>

        {import.meta.env.DEV && (
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
              Detalhes do erro
            </summary>
            <pre className="text-xs bg-white p-3 rounded overflow-auto max-h-32 text-red-600 border border-red-200">
              {errorObj.message}
            </pre>
          </details>
        )}

        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Tentar carregar novamente"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Tentar novamente
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Component-level error fallback (minimal)
 */
export function ComponentErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  return (
    <div
      className="p-4 bg-yellow-50 border border-yellow-200 rounded"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 mb-2">
            Este componente não pôde ser carregado.
          </p>
          {import.meta.env.DEV && (
            <p className="text-xs text-gray-500 mb-2 font-mono truncate">
              {errorObj.message}
            </p>
          )}
          <button
            onClick={resetErrorBoundary}
            className="text-sm text-yellow-700 hover:text-yellow-800 underline focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
            aria-label="Tentar novamente"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Network error fallback
 */
export function NetworkErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div
      className="p-6 bg-blue-50 border border-blue-200 rounded-lg"
      role="alert"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" aria-hidden="true" />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Problema de conexão
        </h3>

        <p className="text-gray-600 mb-4">
          Não foi possível carregar o conteúdo. Verifique sua conexão com a
          internet.
        </p>

        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Tentar novamente"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

/**
 * Loading error fallback (for lazy-loaded components)
 */
export function LoadingErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div
      className="flex items-center justify-center p-8"
      role="alert"
      aria-live="polite"
    >
      <div className="text-center">
        <AlertTriangle
          className="w-8 h-8 text-gray-400 mx-auto mb-3"
          aria-hidden="true"
        />
        <p className="text-gray-600 mb-3">Falha ao carregar componente</p>
        <button
          onClick={resetErrorBoundary}
          className="text-sm text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label="Tentar novamente"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
