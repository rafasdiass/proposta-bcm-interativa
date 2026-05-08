import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SectionErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  sectionTitle: string;
  sectionId: string;
}

/**
 * SectionErrorFallback Component
 *
 * Error boundary fallback for individual sections
 * Provides graceful error handling without breaking the entire app
 */
export function SectionErrorFallback({
  error,
  resetErrorBoundary,
  sectionTitle,
  sectionId,
}: SectionErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Erro ao carregar seção
        </h3>

        <p className="text-gray-600 mb-1">
          Não foi possível carregar a seção "{sectionTitle}"
        </p>

        <p className="text-sm text-gray-500 mb-6">ID: {sectionId}</p>

        {import.meta.env.DEV && (
          <details className="text-left mb-6 p-4 bg-red-50 rounded-lg">
            <summary className="cursor-pointer text-sm font-medium text-red-800 mb-2">
              Detalhes do erro (desenvolvimento)
            </summary>
            <pre className="text-xs text-red-700 whitespace-pre-wrap break-words">
              {error.message}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}

        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </button>

          <p className="text-xs text-gray-500">
            Se o problema persistir, recarregue a página ou entre em contato com
            o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
