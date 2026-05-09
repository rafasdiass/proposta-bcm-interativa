import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  Zap,
} from 'lucide-react';

/**
 * Cover Section Component
 *
 * Landing page hero section with main CTA actions
 * Full-screen layout without header/footer
 */
export default function CoverSection() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden rounded-2xl w-full border border-[#1E3354] bg-[#08111F]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B3A6B] via-[#102642] to-[#2D9B8A]"></div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 text-center text-white px-6 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full"
        >
          {/* Logo/Brand */}
          <div className="mb-12 w-full">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4">BCM</h1>
            <div className="h-1 w-24 bg-amber-400 mx-auto mb-4"></div>
            <p className="text-2xl md:text-3xl font-medium text-blue-100 tracking-wide">
              LaVita Code
            </p>
          </div>

          {/* Main headline */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight w-full max-w-5xl mx-auto text-safe"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Proposta de Parceria Estratégica
          </motion.h2>

          <motion.p
            className="prose-measure text-xl md:text-2xl text-blue-100 mb-12 mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transforme o futuro da terapia ABA digital com o Grupo Gradual
          </motion.p>

          {/* Investment highlight - Force Horizontal Row on Tablet+ */}
          {/* Nova versão do card de investimento - Redesign Total */}
          <motion.div
            className="w-full bg-gradient-to-r from-emerald-900 to-[#101F35] rounded-3xl p-6 sm:p-8 mb-12 border border-emerald-700/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Decoração de fundo */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
              {/* Bloco 1: Investimento */}
              <div className="min-w-0 flex-1 bg-black/30 backdrop-blur-sm rounded-xl p-5 sm:p-6 md:p-7 border border-white/10 w-full flex flex-col items-center lg:items-start">
                <p className="text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Investimento Total
                </p>
                <p className="metric-value text-3xl sm:text-4xl md:text-5xl font-black text-white">
                  R${' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                    75.000
                  </span>
                </p>
              </div>

              {/* Conector Central */}
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-800/50 flex items-center justify-center border border-emerald-500/30 shadow-inner">
                  <Zap className="w-5 h-5 text-emerald-400" />
                </div>
              </div>

              {/* Bloco 2: Estrutura */}
              <div className="min-w-0 flex-1 bg-black/30 backdrop-blur-sm rounded-xl p-5 sm:p-6 md:p-7 border border-white/10 w-full flex flex-col items-center lg:items-start">
                <p className="text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Estrutura da Proposta
                </p>
                <div className="flex flex-col gap-1 text-center lg:text-left w-full">
                  <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    3 Tranches
                  </p>
                  <p className="text-emerald-100 text-sm md:text-base font-medium">
                    Vinculadas a gatilhos de mercado
                  </p>
                </div>
              </div>
            </div>
          </motion.div>



          {/* Confidentiality notice */}
          <motion.p
            className="text-sm text-blue-300 mt-12 font-medium tracking-wide uppercase opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Documento confidencial · Grupo Gradual
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
