import type { ReactNode, ElementType } from 'react';
import { cn } from '@/utils';

type Tone = 'light' | 'dark' | 'teal';

interface NarrativeCard {
  title: string;
  body: string;
  icon?: ElementType;
}

interface NarrativeMetric {
  value: string;
  label: string;
}

interface NarrativeSectionProps {
  eyebrow: string;
  title: string;
  lead: string;
  cards?: NarrativeCard[];
  metrics?: NarrativeMetric[];
  children?: ReactNode;
  footer?: ReactNode;
  tone?: Tone;
}

/**
 * Tone tokens — todos os fundos são SÓLIDOS (sem translucidez) para garantir
 * contraste mínimo WCAG AA em qualquer contexto de página. Nunca usamos
 * `bg-white/10` sobre fundos escuros porque isso funde texto e background.
 */
const toneStyles: Record<
  Tone,
  {
    panel: string;
    eyebrow: string;
    title: string;
    lead: string;
    card: string;
    cardTitle: string;
    cardBody: string;
    cardIcon: string;
    metric: string;
    metricValue: string;
    metricLabel: string;
    divider: string;
  }
> = {
  light: {
    panel: '',
    eyebrow: 'text-[#5EEAD4]',
    title: 'text-white',
    lead: 'text-slate-200',
    card: 'bg-[#101F35] border border-[#263A59] shadow-lg shadow-black/20 hover:border-[#2D9B8A] transition-colors',
    cardTitle: 'text-white',
    cardBody: 'text-slate-200',
    cardIcon: 'bg-[#2D9B8A]/15 text-[#5EEAD4]',
    metric: 'bg-[#101F35] border border-[#263A59] shadow-lg shadow-black/20',
    metricValue: 'text-[#F5A623]',
    metricLabel: 'text-slate-300',
    divider: 'border-[#263A59]',
  },
  dark: {
    panel:
      'bg-[#08111F] border border-[#1E3354] rounded-2xl p-6 md:p-10 lg:p-12 shadow-xl shadow-black/30',
    eyebrow: 'text-[#F5A623]',
    title: 'text-white',
    lead: 'text-slate-200',
    card: 'bg-[#101F35] border border-[#263A59] shadow-lg shadow-black/20 hover:border-[#5EEAD4] transition-colors',
    cardTitle: 'text-white',
    cardBody: 'text-slate-200',
    cardIcon: 'bg-[#1B3A6B] text-[#BFDBFE]',
    metric: 'bg-[#102642] border border-[#2D4A73] shadow-md',
    metricValue: 'text-[#F5A623]',
    metricLabel: 'text-slate-300',
    divider: 'border-[#263A59]',
  },
  teal: {
    panel:
      'bg-[#09221F] border border-[#1E4D46] rounded-2xl p-6 md:p-10 lg:p-12 shadow-xl shadow-black/30',
    eyebrow: 'text-[#F5A623]',
    title: 'text-white',
    lead: 'text-teal-50',
    card: 'bg-[#102A27] border border-[#245B52] shadow-lg shadow-black/20 hover:border-[#5EEAD4] transition-colors',
    cardTitle: 'text-white',
    cardBody: 'text-teal-50',
    cardIcon: 'bg-[#2D9B8A]/20 text-[#5EEAD4]',
    metric: 'bg-[#102A27] border border-[#245B52] shadow-md',
    metricValue: 'text-[#F5A623]',
    metricLabel: 'text-teal-100',
    divider: 'border-[#245B52]',
  },
};

export function NarrativeSection({
  eyebrow,
  title,
  lead,
  cards = [],
  metrics = [],
  children,
  footer,
  tone = 'light',
}: NarrativeSectionProps) {
  const styles = toneStyles[tone];

  return (
    <div className={cn('w-full space-y-10 md:space-y-12', styles.panel)}>
      <div className="w-full max-w-3xl space-y-6">
        <div
          className={cn(
            'text-sm font-bold uppercase tracking-wider',
            styles.eyebrow
          )}
        >
          {eyebrow}
        </div>
        <h2
          className={cn(
            'text-3xl md:text-4xl lg:text-5xl font-bold leading-tight',
            styles.title
          )}
        >
          {title}
        </h2>
        <p
          className={cn(
            'prose-measure text-lg md:text-xl leading-relaxed',
            styles.lead
          )}
        >
          {lead}
        </p>
      </div>

      {metrics.length > 0 && (
        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-6">
          {metrics.map(metric => (
            <div
              key={metric.label}
              className={cn(
                'w-full rounded-xl p-5 sm:p-6 text-center',
                styles.metric
              )}
            >
              <div
                className={cn(
                  'metric-value text-2xl sm:text-3xl md:text-4xl font-bold',
                  styles.metricValue
                )}
              >
                {metric.value}
              </div>
              <div
                className={cn(
                  'mt-3 text-sm font-medium uppercase tracking-wide',
                  styles.metricLabel
                )}
              >
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {cards.length > 0 && (
        <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-6">
          {cards.map(card => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className={cn(
                  'w-full rounded-xl p-5 sm:p-6 md:p-7',
                  styles.card
                )}
              >
                <div className="flex items-start gap-4 w-full">
                  {Icon && (
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                        styles.cardIcon
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-[200px]">
                    <h3
                      className={cn(
                        'text-lg md:text-xl font-bold mb-2',
                        styles.cardTitle
                      )}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={cn(
                        'prose-measure text-base leading-relaxed',
                        styles.cardBody
                      )}
                    >
                      {card.body}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {children && <div className="w-full min-w-0 mt-8">{children}</div>}

      {footer && (
        <div className={cn('w-full pt-8 border-t', styles.divider)}>
          {footer}
        </div>
      )}
    </div>
  );
}
