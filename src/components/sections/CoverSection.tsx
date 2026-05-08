import { motion } from 'framer-motion';
import { ArrowRight, Download, Calendar } from 'lucide-react';

/**
 * Cover Section Component
 *
 * Landing page hero section with main CTA actions
 * Full-screen layout without header/footer
 */
export default function CoverSection() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700"></div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4">BCM</h1>
            <p className="text-xl md:text-2xl text-blue-200">LaVita Code</p>
          </div>

          {/* Main headline */}
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Proposta de Parceria Estratégica
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transforme o futuro da terapia ABA digital com o Grupo Gradual
          </motion.p>

          {/* Investment highlight */}
          <motion.div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-sm text-blue-200 mb-2">Investimento Total</p>
            <p className="text-4xl font-bold text-amber-300">R$ 75.000</p>
            <p className="text-sm text-blue-200 mt-2">
              Em 3 tranches com gatilhos de mercado
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button className="inline-flex items-center px-8 py-4 bg-amber-500 text-gray-900 font-semibold rounded-xl hover:bg-amber-400 transition-colors shadow-lg">
              <ArrowRight className="w-5 h-5 mr-2" />
              Explorar Proposta
            </button>

            <button className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/30">
              <Download className="w-5 h-5 mr-2" />
              Baixar PDF
            </button>

            <button className="inline-flex items-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors">
              <Calendar className="w-5 h-5 mr-2" />
              Agendar Reunião
            </button>
          </motion.div>

          {/* Confidentiality notice */}
          <motion.p
            className="text-sm text-blue-300 mt-8 opacity-75"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Documento confidencial · Grupo Gradual
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
