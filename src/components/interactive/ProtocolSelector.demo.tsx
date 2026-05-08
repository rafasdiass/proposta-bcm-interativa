/**
 * Demo page for ProtocolSelector component
 */

import { ProtocolSelector } from './ProtocolSelector';

export function ProtocolSelectorDemo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#1B3A6B]">
            Protocol Selector Component
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Demonstração do seletor de protocolos clínicos que permite alternar
            entre os protocolos padrão do BCM e os protocolos preferenciais do
            Grupo Gradual.
          </p>
        </div>

        {/* Default State */}
        <section className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Estado Padrão</h2>
          <p className="text-gray-600">
            Por padrão, o componente inicia com "Defaults BCM" selecionado.
          </p>
          <ProtocolSelector />
        </section>

        {/* Gradual Preferred Initial State */}
        <section className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Preferenciais Gradual Pré-selecionado
          </h2>
          <p className="text-gray-600">
            Demonstração com os protocolos preferenciais do Gradual selecionados
            inicialmente, destacando o OERA como protocolo prioritário.
          </p>
          <ProtocolSelector initialSelected={['gradual-preferred']} />
        </section>

        {/* Both Groups Selected */}
        <section className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Modo Combinação</h2>
          <p className="text-gray-600">
            Demonstração com ambos os grupos selecionados simultaneamente,
            ilustrando a flexibilidade do Kernel BCM.
          </p>
          <ProtocolSelector
            initialSelected={['bcm-defaults', 'gradual-preferred']}
          />
        </section>

        {/* No Selection */}
        <section className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Sem Seleção</h2>
          <p className="text-gray-600">
            Demonstração do estado quando nenhum grupo está selecionado,
            exibindo a mensagem de orientação.
          </p>
          <ProtocolSelector initialSelected={[]} />
        </section>

        {/* Features List */}
        <section className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Funcionalidades</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#2D9B8A] font-bold">✓</span>
              <span>
                <strong>Seleção de Grupos:</strong> Alterne entre "Defaults BCM"
                e "Preferenciais Gradual" com um clique.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2D9B8A] font-bold">✓</span>
              <span>
                <strong>Modo Combinação:</strong> Selecione ambos os grupos
                simultaneamente para visualizar todos os protocolos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2D9B8A] font-bold">✓</span>
              <span>
                <strong>Protocolo Prioritário:</strong> OERA é destacado com um
                selo "Prioritário" quando os protocolos preferenciais do Gradual
                estão selecionados.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2D9B8A] font-bold">✓</span>
              <span>
                <strong>Destaque Visual:</strong> Protocolos dos grupos
                selecionados são destacados com bordas coloridas e maior
                opacidade.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2D9B8A] font-bold">✓</span>
              <span>
                <strong>Acessibilidade:</strong> Navegação completa por teclado
                com Enter/Space, atributos ARIA apropriados e região de status
                ao vivo.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#2D9B8A] font-bold">✓</span>
              <span>
                <strong>Mensagens Contextuais:</strong> Descrições dinâmicas que
                mudam conforme a seleção, incluindo mensagem de orientação
                quando nenhum grupo está selecionado.
              </span>
            </li>
          </ul>
        </section>

        {/* Protocol Details */}
        <section className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalhes dos Protocolos
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-[#1B3A6B] mb-3">
                Defaults BCM (3 protocolos)
              </h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>
                  • <strong>PSRF-BCM:</strong> Protocolo de Sondagem de
                  Repertório Funcional
                </li>
                <li>
                  • <strong>PSFA-BCM:</strong> Protocolo de Sondagem de Função
                  Adaptativa
                </li>
                <li>
                  • <strong>EPS-PCA:</strong> Escala de Perfil Sensorial -
                  Protocolo de Condicionamento Adaptativo
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#1B3A6B] mb-3">
                Preferenciais Gradual (7 protocolos)
              </h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>
                  • <strong>OERA</strong>{' '}
                  <span className="text-[#F5A623] font-semibold">
                    (Prioritário)
                  </span>
                  : Observação e Entrevista de Repertório ABA
                </li>
                <li>
                  • <strong>VB-MAPP:</strong> Verbal Behavior Milestones
                  Assessment and Placement Program
                </li>
                <li>
                  • <strong>ABLLS-R:</strong> Assessment of Basic Language and
                  Learning Skills - Revised
                </li>
                <li>
                  • <strong>PEP-3:</strong> Psychoeducational Profile - Third
                  Edition
                </li>
                <li>
                  • <strong>CARS-2:</strong> Childhood Autism Rating Scale -
                  Second Edition
                </li>
                <li>
                  • <strong>SRS-2:</strong> Social Responsiveness Scale - Second
                  Edition
                </li>
                <li>
                  • <strong>Vineland-3:</strong> Vineland Adaptive Behavior
                  Scales - Third Edition
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="bg-white rounded-lg shadow-md p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Como Usar</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Navegação por Mouse/Touch:
              </h3>
              <ol className="list-decimal ml-6 space-y-1">
                <li>
                  Clique nos botões "Defaults BCM" ou "Preferenciais Gradual"
                  para selecionar/desselecionar grupos
                </li>
                <li>
                  Observe como os cards de protocolos são destacados conforme a
                  seleção
                </li>
                <li>Selecione ambos os grupos para ativar o modo combinação</li>
                <li>
                  Desselecione todos os grupos para ver a mensagem de orientação
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">
                Navegação por Teclado:
              </h3>
              <ol className="list-decimal ml-6 space-y-1">
                <li>
                  Use{' '}
                  <kbd className="px-2 py-1 bg-gray-100 rounded border">
                    Tab
                  </kbd>{' '}
                  para navegar entre os botões de grupo
                </li>
                <li>
                  Pressione{' '}
                  <kbd className="px-2 py-1 bg-gray-100 rounded border">
                    Enter
                  </kbd>{' '}
                  ou{' '}
                  <kbd className="px-2 py-1 bg-gray-100 rounded border">
                    Space
                  </kbd>{' '}
                  para selecionar/desselecionar
                </li>
                <li>Observe os indicadores de foco visuais</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProtocolSelectorDemo;
