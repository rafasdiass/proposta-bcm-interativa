/**
 * ObjectionAccordion Component
 *
 * FAQ-style accordion displaying 6 common objections with single-item expansion behavior.
 * Implements WAI-ARIA Accordion pattern with full keyboard navigation support.
 *
 * Requirements: 11.1, 11.2, 11.3, 11.4
 */

import { useState, useCallback, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface ObjectionItem {
  id: string;
  question: string;
  answer: string;
  variant: 'amber' | 'teal' | 'purple' | 'blue';
}

export const objections: ObjectionItem[] = [
  {
    id: 'product-not-sell',
    question: 'E se o produto não vender?',
    answer:
      'A tranche 2 só é paga com 50 usuários pagantes ativos. Sem venda, não há segundo aporte.',
    variant: 'amber',
  },
  {
    id: 'clinic-not-use',
    question: 'E se a clínica não usar?',
    answer:
      'O acesso gratuito exige mínimo de 10 crianças nos primeiros 60 dias. Sem uso, não há validação real para ninguém.',
    variant: 'teal',
  },
  {
    id: 'just-another-software',
    question: 'E se virar só mais um software?',
    answer:
      'O diferencial é o kernel clínico + OERA nativo + telemetria + relatórios defensáveis. Não é apenas cadastro ou prontuário.',
    variant: 'purple',
  },
  {
    id: 'small-participation',
    question: 'E se a participação for pequena?',
    answer:
      '5% agora é posição de fundador de parceria, antes de receita, rodada e escala. O valor está no timing.',
    variant: 'blue',
  },
  {
    id: 'technical-conflict',
    question: 'E se houver conflito técnico?',
    answer:
      'O Gradual tem direito a voto nas decisões técnicas de produto com impacto clínico. A cofundadora Laura Dias mantém a responsabilidade de viabilidade, arquitetura e execução junto ao time técnico.',
    variant: 'teal',
  },
  {
    id: 'return-delay',
    question: 'E se o retorno demorar?',
    answer:
      'A economia de softhouse e desconto permanente criam retorno direto independente da escala do BCM.',
    variant: 'amber',
  },
];

export interface ObjectionAccordionProps {
  /** Additional CSS classes */
  className?: string;
  /** Initial expanded item ID */
  initialExpanded?: string | null;
}

/**
 * ObjectionAccordion component displays FAQ-style objections with single-item expansion
 */
export function ObjectionAccordion({
  className = '',
  initialExpanded = null,
}: ObjectionAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(initialExpanded);
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  // Toggle item expansion (single-item behavior)
  const toggleItem = useCallback((itemId: string) => {
    setExpandedId(prev => (prev === itemId ? null : itemId));
  }, []);

  // Handle keyboard navigation following WAI-ARIA Accordion pattern
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, itemId: string, index: number) => {
      const currentIndex = index;
      const totalItems = objections.length;
      let targetIndex: number | null = null;

      switch (e.key) {
        case 'Enter':
        case ' ':
          // Toggle current item
          e.preventDefault();
          toggleItem(itemId);
          break;

        case 'ArrowDown':
          // Move focus to next accordion header
          e.preventDefault();
          targetIndex = (currentIndex + 1) % totalItems;
          break;

        case 'ArrowUp':
          // Move focus to previous accordion header
          e.preventDefault();
          targetIndex = (currentIndex - 1 + totalItems) % totalItems;
          break;

        case 'Home':
          // Move focus to first accordion header
          e.preventDefault();
          targetIndex = 0;
          break;

        case 'End':
          // Move focus to last accordion header
          e.preventDefault();
          targetIndex = totalItems - 1;
          break;

        default:
          break;
      }

      // Focus the target button if a navigation key was pressed
      if (targetIndex !== null) {
        const targetId = objections[targetIndex].id;
        const targetButton = buttonRefs.current.get(targetId);
        targetButton?.focus();
      }
    },
    [toggleItem]
  );

  // Store button refs
  const setButtonRef = useCallback(
    (id: string, element: HTMLButtonElement | null) => {
      if (element) {
        buttonRefs.current.set(id, element);
      } else {
        buttonRefs.current.delete(id);
      }
    },
    []
  );

  // Get variant-specific styles
  const getVariantStyles = (variant: ObjectionItem['variant']) => {
    const styles = {
      teal: {
        border: 'border-l-4 border-l-[#2D9B8A]',
        bg: 'bg-[#102A27]',
        icon: 'text-[#5EEAD4]',
        question: 'text-white',
      },
      amber: {
        border: 'border-l-4 border-l-[#F5A623]',
        bg: 'bg-[#2A2110]',
        icon: 'text-[#F5A623]',
        question: 'text-white',
      },
      blue: {
        border: 'border-l-4 border-l-[#1B3A6B]',
        bg: 'bg-[#101F35]',
        icon: 'text-[#60A5FA]',
        question: 'text-white',
      },
      purple: {
        border: 'border-l-4 border-l-[#8B7EC8]',
        bg: 'bg-[#211A35]',
        icon: 'text-[#C4B5FD]',
        question: 'text-white',
      },
    };
    return styles[variant];
  };

  return (
    <div
      className={`space-y-3 ${className}`}
      role="region"
      aria-label="Objeções respondidas"
    >
      {objections.map((objection, index) => {
        const isExpanded = expandedId === objection.id;
        const variantStyles = getVariantStyles(objection.variant);

        return (
          <div
            key={objection.id}
            className={`
              border border-[#263A59] rounded-lg shadow-sm shadow-black/20 overflow-hidden
              transition-all duration-300 ease-in-out
              hover:border-[#5EEAD4]
              ${variantStyles.border}
              ${variantStyles.bg}
              ${isExpanded ? 'ring-2 ring-offset-2 ring-offset-[#08111F] ring-[#5EEAD4]' : ''}
            `}
          >
            <h3>
              <button
                ref={el => setButtonRef(objection.id, el)}
                onClick={() => toggleItem(objection.id)}
                onKeyDown={e => handleKeyDown(e, objection.id, index)}
                className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded={isExpanded}
                aria-controls={`objection-panel-${objection.id}`}
                id={`objection-header-${objection.id}`}
                type="button"
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`text-base font-bold ${variantStyles.question}`}
                  >
                    {objection.question}
                  </span>

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
            </h3>

            {/* Expandable answer panel */}
            <div
              id={`objection-panel-${objection.id}`}
              role="region"
              aria-labelledby={`objection-header-${objection.id}`}
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
              `}
              aria-hidden={!isExpanded}
            >
              <div className="px-4 pb-4 pt-2 border-t border-white/10">
                <p className="prose-measure text-sm text-slate-200 leading-relaxed">
                  {objection.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ObjectionAccordion;
