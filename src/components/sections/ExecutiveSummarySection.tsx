import React from 'react';

import {
  TrendingUp,
  Users,
  Target,
  Shield,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import './ExecutiveSummary.css';

/**
 * Executive Summary Section Component
 *
 * Totalmente reescrito usando Bootstrap, CSS Grid e Flexbox nativos
 * para garantir responsividade perfeita em todas as telas,
 * eliminando problemas de "texto em coluna".
 */
export default function ExecutiveSummarySection() {
  const highlights = [
    {
      icon: TrendingUp,
      title: 'Mercado em Crescimento',
      description:
        'Terapia ABA digital com demanda crescente e poucos players estabelecidos.',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/15',
    },
    {
      icon: Users,
      title: 'Parceria Estratégica',
      description:
        'Gradual como primeiro parceiro clínico e investidor estratégico.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/15',
    },
    {
      icon: Target,
      title: 'Retorno Projetado',
      description:
        '5% do BCM com potencial de valorização em escala nacional.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/15',
    },
    {
      icon: null,
      title: 'Urgência Temporal',
      description: 'Janela de oportunidade limitada para posição de investidor.',
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/15',
    },
  ];

  const logicGradual = [
    'Posição de investidor em tecnologia disruptiva',
    'Moldar produto conforme necessidades clínicas reais',
    'Retorno financeiro com alto potencial de escala',
    'Vantagem competitiva tecnológica no mercado ABA',
  ];

  const logicLavita = [
    'Validação clínica com parceiro de referência',
    'Acesso a protocolos e expertise do Gradual',
    'Capital estratégico para acelerar o roadmap',
    'Primeiro cliente âncora para tração imediata',
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-16">
      {/* 1. HERO & FINANCIALS CARD */}
      <div className="w-full min-w-0 bg-gradient-to-br from-[#1b3a6b] to-[#102642] rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-black/20 text-white">
        {/* Header content */}
        <div className="w-full mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest text-amber-400 mb-6 exec-badge-glow">
            <Zap className="w-4 h-4" />
            Visão de Futuro
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Uma Oportunidade <br className="hidden md:block" /> Única de
            Parceria
          </h1>

          <p className="prose-measure text-base sm:text-lg md:text-xl text-blue-100 leading-relaxed">
            O BCM representa a próxima geração de plataformas para terapia ABA,
            sob a liderança da cofundadora Laura Dias. Esta proposta oferece ao
            Grupo Gradual a oportunidade de se tornar investidor estratégico com
            5% de participação no BCM, moldando o futuro da terapia digital.
          </p>
        </div>

        {/* Financials Strip */}
        <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-4 items-stretch divide-y lg:divide-y-0 lg:divide-x divide-white/20">
            <div className="min-w-0 flex flex-col items-center lg:items-start pt-4 lg:pt-0 lg:px-5 first:pt-0">
              <span className="text-indigo-200 text-sm font-semibold uppercase tracking-wide mb-2 text-safe">
                Investimento Total
              </span>
              <span className="metric-value text-3xl sm:text-4xl md:text-5xl font-black text-amber-400">
                R$ 75.000
              </span>
            </div>

            <div className="min-w-0 flex flex-col items-center lg:items-start pt-6 lg:pt-0 lg:px-5">
              <span className="text-indigo-200 text-sm font-semibold uppercase tracking-wide mb-2 text-safe">
                Participação BCM
              </span>
              <span className="metric-value text-3xl sm:text-4xl md:text-5xl font-black text-amber-400">
                5%
              </span>
            </div>

            <div className="min-w-0 flex flex-col items-center lg:items-start pt-6 lg:pt-0 lg:px-5">
              <span className="text-indigo-200 text-sm font-semibold uppercase tracking-wide mb-2 text-safe">
                Garantias
              </span>
              <div className="min-w-0 flex items-center gap-3 text-amber-400 text-xl font-bold">
                <Shield className="w-6 h-6 flex-shrink-0" />
                <span className="text-safe">3 Tranches com Gatilhos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HIGHLIGHTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
        {highlights.map(item => {
          return (
            <div
              key={item.title}
              className="bg-[#101F35] rounded-xl p-5 sm:p-6 border border-[#263A59] exec-card-hover w-full min-w-0 shadow-lg shadow-black/20"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${item.bgColor} ${item.color}`}
              >
                {item.icon
                  ? (() => { const I = item.icon as React.ElementType; return <I className="w-7 h-7" />; })()
                  : <i className="bi bi-hourglass-split text-2xl" />}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="prose-measure text-slate-200 leading-relaxed text-sm md:text-base">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. STRATEGIC LOGIC */}
      <div className="w-full min-w-0 bg-[#0B1A2D] rounded-2xl p-5 sm:p-6 md:p-8 border border-white/10 shadow-xl">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-center text-white mb-12">
          Por que esta parceria faz sentido agora?
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Coluna Gradual */}
          <div className="w-full min-w-0">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg logic-circle-g flex-shrink-0">
                G
              </div>
              <h3 className="text-2xl font-bold text-white">
                Para o Grupo Gradual
              </h3>
            </div>
            <ul className="space-y-5">
              {logicGradual.map(text => (
                <li key={text} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-safe text-slate-300 text-base sm:text-lg leading-relaxed">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna LaVita */}
          <div className="w-full min-w-0">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg logic-circle-l flex-shrink-0">
                L
              </div>
              <h3 className="text-2xl font-bold text-white">
                Para a LaVita Code
              </h3>
            </div>
            <ul className="space-y-5">
              {logicLavita.map(text => (
                <li key={text} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-safe text-slate-300 text-base sm:text-lg leading-relaxed">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* 4. SOFTHOUSE EXCLUSIVA - DESTAQUE */}
      <div className="w-full min-w-0 bg-gradient-to-r from-[#2D9B8A] to-[#1B6B5F] rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-[#2D9B8A]/20 border border-[#5EEAD4]/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <i className="bi bi-percent text-[180px] sm:text-[220px] -mt-10 -mr-10" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest text-white mb-4 sm:mb-6">
            <i className="bi bi-lightning-fill" />
            Benefício Exclusivo do Investidor Âncora
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4 leading-tight">
            LaVita Code: A Softhouse do Gradual
          </h2>

          <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-3xl">
            Ao se tornar <strong>investidor âncora</strong>, o Gradual ganha uma <strong>softhouse própria</strong>. 
            Qualquer projeto de tecnologia (novos sistemas, manutenção de produtos em produção, 
            apps, integrações, automações) passa a ser desenvolvido pela LaVita Code 
            com <strong>25% de desconto permanente</strong> sobre qualquer concorrente. 
            Somos a softhouse mais barata e mais alinhada que o Gradual pode ter.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-5 text-center border border-white/20">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">25%</div>
              <p className="text-white/80 text-xs sm:text-sm font-medium">Mais barato que qualquer softhouse do mercado</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-5 text-center border border-white/20">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">∞</div>
              <p className="text-white/80 text-xs sm:text-sm font-medium">Novos projetos, sistemas em produção, manutenção: tudo incluso</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 sm:p-5 text-center border border-white/20">
              <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                <i className="bi bi-shield-check" />
              </div>
              <p className="text-white/80 text-xs sm:text-sm font-medium">Prioridade máxima e alinhamento estratégico total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
