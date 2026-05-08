import { useState } from 'react';
import {
  ProgressIndicator,
  ProgressIndicatorCompact,
} from './ProgressIndicator';
import { NavigationProvider } from '../../contexts/NavigationProvider';
import { ModeToggle } from './ModeToggle';

/**
 * Demo component to showcase ProgressIndicator functionality
 *
 * This component demonstrates both the full and compact versions
 * of the ProgressIndicator in different navigation modes.
 */
export function ProgressIndicatorDemo() {
  const [showCompact, setShowCompact] = useState(false);

  // Sample section titles for demonstration
  const sectionTitles = [
    'Capa',
    'Resumo Executivo',
    'Urgência de Mercado',
    'O que é o BCM',
    'Produto - Módulos',
    'Tese Técnica',
    'Protocolos Gradual',
    'OERA como Fundador',
    'Mercado & Receita',
    'Projeções',
    'Por que o Gradual',
    'Time',
    'Proposta & Tranches',
    'Pagamento por Prova',
    'Retorno Esperado',
    'Retorno antes da Escala',
    'Governança',
    'Plano de Execução',
    'Objeções',
    'Quadro de Decisão',
    'Termos Resumidos',
    'Próximos Passos',
  ];

  return (
    <NavigationProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Progress Indicator */}
        {showCompact ? (
          <ProgressIndicatorCompact />
        ) : (
          <ProgressIndicator
            sectionTitles={sectionTitles}
            showNavigation={true}
          />
        )}

        {/* Demo Content */}
        <div className="pt-20 px-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Demonstração do ProgressIndicator
            </h1>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Controles de Demonstração
                </h2>

                <div className="flex flex-wrap gap-4">
                  <ModeToggle />

                  <button
                    onClick={() => setShowCompact(!showCompact)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {showCompact ? 'Mostrar Completo' : 'Mostrar Compacto'}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Funcionalidades
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">Modo Landing</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Barra de progresso baseada no scroll</li>
                      <li>• Indicador da seção atual</li>
                      <li>• Dropdown de navegação entre seções</li>
                      <li>• Percentual de conclusão</li>
                      <li>• Atualização automática da URL</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">
                      Modo Apresentação
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Controles de navegação flutuantes</li>
                      <li>• Botões anterior/próximo</li>
                      <li>• Pontos de progresso clicáveis</li>
                      <li>• Auto-ocultação após inatividade</li>
                      <li>• Navegação por teclado</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Acessibilidade
                </h2>

                <div className="bg-blue-50 p-4 rounded-md">
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Landmarks semânticos (banner, navigation)</li>
                    <li>• Atributos ARIA apropriados</li>
                    <li>• Suporte completo à navegação por teclado</li>
                    <li>• Rótulos descritivos para leitores de tela</li>
                    <li>• Contraste WCAG AA</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Instruções de Teste
                </h2>

                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>Modo Landing:</strong>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Role a página para ver o progresso atualizar</li>
                      <li>• Use o dropdown para navegar entre seções</li>
                      <li>• Observe a atualização da URL</li>
                    </ul>

                    <p className="pt-2">
                      <strong>Modo Apresentação:</strong>
                    </p>
                    <ul className="ml-4 space-y-1">
                      <li>• Use as setas do teclado para navegar</li>
                      <li>• Clique nos pontos para ir a seções específicas</li>
                      <li>• Mova o mouse para mostrar os controles</li>
                      <li>• Pressione ESC para voltar ao modo landing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample sections for scrolling demonstration */}
          {sectionTitles.map((title, index) => (
            <div
              key={index}
              id={`section-${index}`}
              className="bg-white rounded-lg shadow-sm p-8 mb-8 min-h-[400px]"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {index + 1}. {title}
              </h2>

              <div className="prose text-gray-600">
                <p>
                  Esta é a seção "{title}" da demonstração. O conteúdo aqui é
                  apenas para fins de demonstração do componente
                  ProgressIndicator.
                </p>

                <p>
                  Você pode rolar a página para ver como o indicador de
                  progresso atualiza automaticamente, ou usar os controles de
                  navegação para pular entre as seções.
                </p>

                <div className="mt-8 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm">
                    <strong>Seção atual:</strong> {index + 1} de{' '}
                    {sectionTitles.length}
                  </p>
                  <p className="text-sm">
                    <strong>Progresso:</strong>{' '}
                    {Math.round(((index + 1) / sectionTitles.length) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </NavigationProvider>
  );
}

export default ProgressIndicatorDemo;
