/**
 * ModuleCards Component
 *
 * Displays 12 expandable cards for BCM product modules with keyboard navigation
 * and proper accessibility support.
 *
 * Requirements: 9.1, 9.2, 9.3, 9.5
 */

import { useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

export interface Module {
  id: string;
  number: string;
  title: string;
  description: string;
  variant: 'teal' | 'amber' | 'blue' | 'purple';
}

export const modules: Module[] = [
  {
    id: 'psrf-bcm',
    number: '01',
    title: 'PSRF-BCM',
    description:
      'Triagem de repertório funcional: 21 probes, 7 domínios, output direto para metas.',
    variant: 'teal',
  },
  {
    id: 'psfa-bcm',
    number: '02',
    title: 'PSFA-BCM',
    description:
      'Análise funcional: 4 condições + controle, hipótese funcional e confiança.',
    variant: 'teal',
  },
  {
    id: 'eps-pca',
    number: '03',
    title: 'EPS-PCA',
    description:
      'Perfil sensorial: 24 trials, 5 canais, adaptação de UX e rotina.',
    variant: 'teal',
  },
  {
    id: 'kernel',
    number: '04',
    title: 'Kernel',
    description:
      'Motor clínico genérico para derivar metas, intervenções e governança.',
    variant: 'amber',
  },
  {
    id: 'pei-digital',
    number: '05',
    title: 'PEI Digital',
    description:
      'Gerado em 35 min com baselines, SMART, mastery e PDF defensável.',
    variant: 'blue',
  },
  {
    id: 'minha-voz',
    number: '06',
    title: 'Minha Voz',
    description: 'CAA com PECS, voz PT-BR, modo livre, modo clínico e FCT.',
    variant: 'blue',
  },
  {
    id: 'rotinas',
    number: '07',
    title: 'Rotinas',
    description:
      'Economia de fichas, fading, reforços e execução vinculada ao PEI.',
    variant: 'purple',
  },
  {
    id: 'jogos',
    number: '08',
    title: '32 Jogos',
    description:
      'Biblioteca de jogos terapêuticos vinculados a metas do PEI com telemetria integrada.',
    variant: 'purple',
  },
  {
    id: 'visao-360',
    number: '09',
    title: 'Visão 360',
    description:
      'Dashboard completo com visão integrada do progresso clínico e dados de intervenção.',
    variant: 'blue',
  },
  {
    id: 'relatorios',
    number: '10',
    title: 'Relatórios',
    description:
      'Relatórios defensáveis para escola, ANS e família com evidências auditáveis.',
    variant: 'teal',
  },
  {
    id: 'acesso-progressivo',
    number: '11',
    title: 'Acesso Progressivo',
    description:
      'Sistema de permissões e acesso controlado para diferentes perfis de usuário.',
    variant: 'purple',
  },
  {
    id: 'stack-saas',
    number: '12',
    title: 'Stack SaaS',
    description:
      'Infraestrutura completa em nuvem com escalabilidade, segurança e conformidade.',
    variant: 'amber',
  },
];

export interface ModuleCardsProps {
  /** Additional CSS classes */
  className?: string;
  /** Initial expanded module IDs */
  initialExpanded?: string[];
}

/**
 * ModuleCards component displays 12 expandable cards for product modules
 */
export function ModuleCards({
  className = '',
  initialExpanded = [],
}: ModuleCardsProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(initialExpanded)
  );

  // Toggle module expansion
  const toggleModule = useCallback((moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, moduleId: string) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleModule(moduleId);
      }
    },
    [toggleModule]
  );

  // Get variant-specific styles
  const getVariantStyles = (variant: Module['variant']) => {
    const styles = {
      teal: {
        border: 'border-t-4 border-t-[#2D9B8A]',
        icon: 'text-[#5EEAD4]',
        title: 'text-[#5EEAD4]',
      },
      amber: {
        border: 'border-t-4 border-t-[#F5A623]',
        icon: 'text-[#F5A623]',
        title: 'text-[#F5A623]',
      },
      blue: {
        border: 'border-t-4 border-t-[#1B3A6B]',
        icon: 'text-[#60A5FA]',
        title: 'text-[#60A5FA]',
      },
      purple: {
        border: 'border-t-4 border-t-[#8B7EC8]',
        icon: 'text-[#C4B5FD]',
        title: 'text-[#C4B5FD]',
      },
    };
    return styles[variant];
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 ${className}`}
    >
      {modules.map(module => {
        const isExpanded = expandedModules.has(module.id);
        const variantStyles = getVariantStyles(module.variant);

        return (
          <div
            key={module.id}
            className={`
              bg-[#101F35] border border-[#263A59] rounded-lg shadow-md shadow-black/20 overflow-hidden
              transition-all duration-300 ease-in-out
              hover:border-[#5EEAD4]
              ${variantStyles.border}
              ${isExpanded ? 'ring-2 ring-offset-2 ring-gray-300' : ''}
            `}
          >
            <button
              onClick={() => toggleModule(module.id)}
              onKeyDown={e => handleKeyDown(e, module.id)}
              className="w-full text-left p-3 sm:p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 min-h-[44px] touch-manipulation bg-transparent border-0 shadow-none"
              aria-expanded={isExpanded}
              aria-controls={`module-content-${module.id}`}
              type="button"
            >
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="min-w-0 flex-1 w-full">
                  <div className="flex items-baseline gap-2 mb-1 w-full">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                      {module.number}
                    </span>
                    <h3
                      className={`text-sm sm:text-base font-bold ${variantStyles.title}`}
                    >
                      {module.title}
                    </h3>
                  </div>

                  {/* Always show description preview */}
                  <p className="prose-measure text-xs sm:text-sm text-slate-300 w-full">
                    {module.description}
                  </p>
                </div>

                <ChevronDown
                  className={`
                    flex-shrink-0 w-5 h-5 transition-transform duration-300
                    ${variantStyles.icon}
                    ${isExpanded ? 'transform rotate-180' : ''}
                  `}
                  aria-hidden="true"
                />
              </div>
            </button>

            {/* Expandable content */}
            <div
              id={`module-content-${module.id}`}
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
              `}
              aria-hidden={!isExpanded}
            >
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-white/10">
                <p className="prose-measure text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ModuleCards;
