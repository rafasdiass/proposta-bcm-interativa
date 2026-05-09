import {} from 'react';
import { ModeToggle, ModeToggleCompact } from './ModeToggle';
import { useModeToggle } from '../../hooks/useModeToggle';
import { useNavigation } from '../../contexts';

/**
 * Demo component to showcase ModeToggle functionality
 * This demonstrates all the features implemented in task 2.2
 */
export function ModeToggleDemo() {
  const { state } = useNavigation();
  const modeToggle = useModeToggle();

  return (
    <div className="fixed top-4 left-4 bg-white p-6 rounded-lg shadow-lg border z-50 max-w-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        🎛️ ModeToggle Component Demo
      </h3>

      {/* Current State Display */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Estado Atual:
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Modo:</span>
            <span
              className={`font-medium ${
                state.mode === 'landing' ? 'text-blue-600' : 'text-purple-600'
              }`}
            >
              {state.mode === 'landing' ? '📜 Landing' : '🎯 Presentation'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Seção:</span>
            <span className="font-medium text-gray-800">
              {state.currentSection + 1} / {state.totalSections}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transicionando:</span>
            <span
              className={`font-medium ${
                state.isTransitioning ? 'text-amber-600' : 'text-green-600'
              }`}
            >
              {state.isTransitioning ? 'Sim' : 'Não'}
            </span>
          </div>
        </div>
      </div>

      {/* ModeToggle Variants */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Padrão (com labels):
          </h4>
          <ModeToggle />
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Sem labels:
          </h4>
          <ModeToggle showLabels={false} />
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Tamanho pequeno:
          </h4>
          <ModeToggle size="sm" />
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Tamanho grande:
          </h4>
          <ModeToggle size="lg" />
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Modo compacto:
          </h4>
          <ModeToggleCompact />
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Compacto sem labels:
          </h4>
          <ModeToggleCompact showLabels={false} />
        </div>
      </div>

      {/* Hook Demo */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          useModeToggle Hook:
        </h4>
        <div className="space-y-2">
          <button
            onClick={modeToggle.toggleMode}
            className="w-full px-3 py-2 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
          >
            Toggle Mode (Hook)
          </button>

          <div className="text-xs text-gray-600 space-y-1">
            <div>isLandingMode: {modeToggle.isLandingMode.toString()}</div>
            <div>
              isPresentationMode: {modeToggle.isPresentationMode.toString()}
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          ✅ Recursos de Acessibilidade:
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>✅ Navegação por teclado (Enter/Space)</li>
          <li>✅ ARIA labels e pressed states</li>
          <li>✅ Focus indicators visíveis</li>
          <li>✅ Tooltips informativos</li>
          <li>✅ Role group para agrupamento</li>
          <li>✅ Screen reader friendly</li>
        </ul>
      </div>

      {/* Usage Instructions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          📖 Como usar:
        </h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>
            <strong>Mouse:</strong> Clique nos botões para alternar
          </div>
          <div>
            <strong>Teclado:</strong> Tab + Enter/Space
          </div>
          <div>
            <strong>Modo Landing:</strong> Rolagem contínua
          </div>
          <div>
            <strong>Modo Presentation:</strong> Setas do teclado
          </div>
        </div>
      </div>

      {/* Requirements Validation */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          📋 Requirements Atendidos:
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>✅ 2.3: Toggle entre modos de navegação</li>
          <li>✅ 15.2: Navegação completa por teclado</li>
          <li>✅ 15.5: ARIA labels apropriados</li>
          <li>✅ Preserva posição da seção atual</li>
          <li>✅ Estilo Bootstrap seguindo design system</li>
        </ul>
      </div>
    </div>
  );
}
