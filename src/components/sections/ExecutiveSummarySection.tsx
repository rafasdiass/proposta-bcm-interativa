import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Clock } from 'lucide-react';

/**
 * Executive Summary Section Component
 *
 * High-level overview of the partnership proposal
 */
export default function ExecutiveSummarySection() {
  const highlights = [
    {
      icon: TrendingUp,
      title: 'Mercado em Crescimento',
      description:
        'Terapia ABA digital com demanda crescente e poucos players estabelecidos',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Users,
      title: 'Parceria Estratégica',
      description:
        'Gradual como primeiro parceiro clínico e co-fundador do produto',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Target,
      title: 'Retorno Projetado',
      description:
        '5% da LaVita Code com potencial de valorização significativa',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Clock,
      title: 'Urgência Temporal',
      description: 'Janela de oportunidade limitada para posição de fundador',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Main summary */}
      <motion.div
        className="text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Uma Oportunidade Única de Parceria
        </h2>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          O BCM representa a próxima geração de plataformas para terapia ABA,
          combinando protocolos clínicos validados com tecnologia de ponta. Esta
          proposta oferece ao Grupo Gradual a oportunidade de se tornar
          co-fundador e moldar o futuro da terapia digital.
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600 mb-2">R$ 75.000</p>
              <p className="text-sm text-gray-600">Investimento Total</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-teal-600 mb-2">5%</p>
              <p className="text-sm text-gray-600">Participação LaVita Code</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-600 mb-2">3</p>
              <p className="text-sm text-gray-600">Tranches com Gatilhos</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Key highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon;
          return (
            <motion.div
              key={highlight.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${highlight.bgColor}`}>
                  <Icon className={`w-6 h-6 ${highlight.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Value proposition */}
      <motion.div
        className="bg-gray-50 rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Por que Esta Parceria Faz Sentido
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Para o Gradual
            </h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Posição de co-fundador em tecnologia disruptiva
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Moldar produto conforme necessidades clínicas
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Retorno financeiro com potencial de escala
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Vantagem competitiva no mercado ABA
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Para a LaVita Code
            </h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Validação clínica com parceiro experiente
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Acesso a protocolos e expertise do Gradual
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Capital para acelerar desenvolvimento
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Primeiro cliente âncora para tração inicial
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
