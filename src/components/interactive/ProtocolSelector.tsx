/**
 * ProtocolSelector Component
 *
 * Allows users to toggle between BCM default protocols and Gradual preferred protocols,
 * with special highlighting for OERA as a priority protocol.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5
 */

import { useState, useCallback } from 'react';
import { CheckCircle2, Star } from 'lucide-react';

export interface Protocol {
  id: string;
  name: string;
  abbreviation: string;
  isPriority?: boolean;
}

export interface ProtocolGroup {
  id: 'bcm-defaults' | 'gradual-preferred';
  name: string;
  description: string;
  protocols: Protocol[];
}

export const protocolGroups: ProtocolGroup[] = [
  {
    id: 'bcm-defaults',
    name: 'Defaults BCM',
    description:
      'Protocolos padrão do BCM desenvolvidos pela LaVita Code para triagem, análise funcional e perfil sensorial.',
    protocols: [
      {
        id: 'psrf-bcm',
        name: 'Protocolo de Sondagem de Repertório Funcional',
        abbreviation: 'PSRF-BCM',
      },
      {
        id: 'psfa-bcm',
        name: 'Protocolo de Sondagem de Função Adaptativa',
        abbreviation: 'PSFA-BCM',
      },
      {
        id: 'eps-pca',
        name: 'Escala de Perfil Sensorial - Protocolo de Condicionamento Adaptativo',
        abbreviation: 'EPS-PCA',
      },
    ],
  },
  {
    id: 'gradual-preferred',
    name: 'Preferenciais Gradual',
    description:
      'Protocolos clínicos preferenciais do Grupo Gradual, incluindo OERA como protocolo prioritário para integração.',
    protocols: [
      {
        id: 'oera',
        name: 'Observação e Entrevista de Repertório ABA',
        abbreviation: 'OERA',
        isPriority: true,
      },
      {
        id: 'vb-mapp',
        name: 'Verbal Behavior Milestones Assessment and Placement Program',
        abbreviation: 'VB-MAPP',
      },
      {
        id: 'ablls-r',
        name: 'Assessment of Basic Language and Learning Skills - Revised',
        abbreviation: 'ABLLS-R',
      },
      {
        id: 'pep-3',
        name: 'Psychoeducational Profile - Third Edition',
        abbreviation: 'PEP-3',
      },
      {
        id: 'cars-2',
        name: 'Childhood Autism Rating Scale - Second Edition',
        abbreviation: 'CARS-2',
      },
      {
        id: 'srs-2',
        name: 'Social Responsiveness Scale - Second Edition',
        abbreviation: 'SRS-2',
      },
      {
        id: 'vineland-3',
        name: 'Vineland Adaptive Behavior Scales - Third Edition',
        abbreviation: 'Vineland-3',
      },
    ],
  },
];

export interface ProtocolSelectorProps {
  /** Additional CSS classes */
  className?: string;
  /** Initial selected groups */
  initialSelected?: Array<'bcm-defaults' | 'gradual-preferred'>;
}

/**
 * ProtocolSelector component for toggling between protocol groups
 */
export function ProtocolSelector({
  className = '',
  initialSelected = ['bcm-defaults'],
}: ProtocolSelectorProps) {
  const [selectedGroups, setSelectedGroups] = useState<
    Set<'bcm-defaults' | 'gradual-preferred'>
  >(new Set(initialSelected));

  // Toggle group selection
  const toggleGroup = useCallback(
    (groupId: 'bcm-defaults' | 'gradual-preferred') => {
      setSelectedGroups(prev => {
        const next = new Set(prev);
        if (next.has(groupId)) {
          next.delete(groupId);
        } else {
          next.add(groupId);
        }
        return next;
      });
    },
    []
  );

  // Handle keyboard navigation for group buttons
  const handleGroupKeyDown = useCallback(
    (e: React.KeyboardEvent, groupId: 'bcm-defaults' | 'gradual-preferred') => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleGroup(groupId);
      }
    },
    [toggleGroup]
  );

  // Get active description based on selected groups
  const getActiveDescription = () => {
    if (selectedGroups.size === 0) {
      return 'Selecione um grupo de protocolos para visualizar os detalhes.';
    }
    if (selectedGroups.size === 2) {
      return 'Modo combinação: O Kernel BCM aceita ambos os conjuntos de protocolos, permitindo flexibilidade clínica total.';
    }
    const selectedGroup = protocolGroups.find(g => selectedGroups.has(g.id));
    return selectedGroup?.description || '';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Group Selection Buttons */}
      <div className="flex flex-wrap gap-3">
        {protocolGroups.map(group => {
          const isSelected = selectedGroups.has(group.id);
          return (
            <button
              key={group.id}
              onClick={() => toggleGroup(group.id)}
              onKeyDown={e => handleGroupKeyDown(e, group.id)}
              className={`
                px-6 py-3 rounded-lg font-semibold text-sm
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${
                  isSelected
                    ? 'bg-[#1B3A6B] text-white shadow-md hover:bg-[#152e54]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              aria-pressed={isSelected}
              type="button"
            >
              <span className="flex items-center gap-2">
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                )}
                {group.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Description */}
      <div
        className={`
          p-4 rounded-lg border-l-4 transition-colors duration-200
          ${
            selectedGroups.size === 0
              ? 'bg-gray-50 border-gray-300 text-gray-600'
              : selectedGroups.size === 2
                ? 'bg-purple-50 border-[#8B7EC8] text-gray-800'
                : 'bg-blue-50 border-[#1B3A6B] text-gray-800'
          }
        `}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm leading-relaxed">{getActiveDescription()}</p>
      </div>

      {/* Protocol Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {protocolGroups.map(group => {
          const isGroupSelected = selectedGroups.has(group.id);

          return group.protocols.map(protocol => {
            const isHighlighted = isGroupSelected;
            const isPriority = protocol.isPriority && isGroupSelected;

            return (
              <div
                key={protocol.id}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-300
                  ${
                    isHighlighted
                      ? 'border-[#2D9B8A] bg-white shadow-md'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }
                  ${isPriority ? 'ring-2 ring-[#F5A623] ring-offset-2' : ''}
                `}
              >
                {/* Priority Badge */}
                {isPriority && (
                  <div className="absolute -top-2 -right-2 bg-[#F5A623] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                    Prioritário
                  </div>
                )}

                {/* Protocol Content */}
                <div className="space-y-2">
                  <h3
                    className={`
                      font-bold text-base
                      ${isHighlighted ? 'text-[#1B3A6B]' : 'text-gray-500'}
                    `}
                  >
                    {protocol.abbreviation}
                  </h3>
                  <p
                    className={`
                      text-sm leading-relaxed
                      ${isHighlighted ? 'text-gray-700' : 'text-gray-500'}
                    `}
                  >
                    {protocol.name}
                  </p>
                </div>

                {/* Selection Indicator */}
                {isHighlighted && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2
                      className="w-5 h-5 text-[#2D9B8A]"
                      aria-label="Selecionado"
                    />
                  </div>
                )}
              </div>
            );
          });
        })}
      </div>

      {/* Default State Message */}
      {selectedGroups.size === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Selecione "Defaults BCM" ou "Preferenciais Gradual" para visualizar
            os protocolos.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProtocolSelector;
