/**
 * Demo page for ComparisonTable component
 */

import { ComparisonTable } from './ComparisonTable';

export default function ComparisonTableDemo() {
  const customData = {
    enterNow: [
      { id: 'custom-1', text: 'Benefício customizado 1' },
      { id: 'custom-2', text: 'Benefício customizado 2' },
      { id: 'custom-3', text: 'Benefício customizado 3' },
    ],
    wait: [
      { id: 'custom-4', text: 'Risco customizado 1' },
      { id: 'custom-5', text: 'Risco customizado 2' },
      { id: 'custom-6', text: 'Risco customizado 3' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ComparisonTable Component Demo
          </h1>
          <p className="text-lg text-gray-600">
            Demonstração do componente de comparação "Entrar agora vs Esperar"
          </p>
        </div>

        {/* Default variant */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Variante Padrão (com controle de animação)
          </h2>
          <ComparisonTable />
        </section>

        {/* Without animation control */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Sem Controle de Animação (auto-start)
          </h2>
          <ComparisonTable showAnimationControl={false} />
        </section>

        {/* Custom data */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Com Dados Customizados
          </h2>
          <ComparisonTable data={customData} />
        </section>

        {/* Custom animation delay */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Com Delay de Animação Customizado (500ms)
          </h2>
          <ComparisonTable animationDelay={500} />
        </section>

        {/* Reduced motion simulation */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Simulação de Reduced Motion
          </h2>
          <p className="text-gray-600 mb-4">
            Para testar: abra as DevTools e simule "prefers-reduced-motion:
            reduce" ou use as configurações de acessibilidade do seu sistema
            operacional.
          </p>
          <ComparisonTable />
        </section>

        {/* Usage instructions */}
        <section className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Como Usar</h2>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">Importação:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                <code>{`import { ComparisonTable } from './components/interactive/ComparisonTable';`}</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Uso Básico:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                <code>{`<ComparisonTable />`}</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Com Props Customizadas:
              </h3>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                <code>{`<ComparisonTable
  data={customData}
  showAnimationControl={false}
  animationDelay={300}
  className="my-custom-class"
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Props Disponíveis:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">data</code>:
                  Dados de comparação (enterNow e wait arrays)
                </li>
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    className
                  </code>
                  : Classes CSS adicionais
                </li>
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    showAnimationControl
                  </code>
                  : Mostrar botão de controle de animação (padrão: true)
                </li>
                <li>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    animationDelay
                  </code>
                  : Delay entre itens em ms (padrão: 200)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Recursos de Acessibilidade:
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Respeita preferência de reduced motion do usuário</li>
                <li>Navegação por teclado completa</li>
                <li>Anúncios de status para leitores de tela</li>
                <li>Estrutura semântica com listas e landmarks</li>
                <li>Ícones decorativos marcados com aria-hidden</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
