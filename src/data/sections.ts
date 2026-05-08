import type { SectionConfig } from '@/types';
import { lazy } from 'react';

// Lazy load section components for better performance
const CoverSection = lazy(() => import('@/components/sections/CoverSection'));
const ExecutiveSummarySection = lazy(
  () => import('@/components/sections/ExecutiveSummarySection')
);
const MarketUrgencySection = lazy(
  () => import('@/components/sections/MarketUrgencySection')
);
const ProductOverviewSection = lazy(
  () => import('@/components/sections/ProductOverviewSection')
);
const ProductModulesSection = lazy(
  () => import('@/components/sections/ProductModulesSection')
);
const TechnicalThesisSection = lazy(
  () => import('@/components/sections/TechnicalThesisSection')
);
const GradualProtocolsSection = lazy(
  () => import('@/components/sections/GradualProtocolsSection')
);
const OERAFounderSection = lazy(
  () => import('@/components/sections/OERAFounderSection')
);
const MarketRevenueSection = lazy(
  () => import('@/components/sections/MarketRevenueSection')
);
const ProjectionsSection = lazy(
  () => import('@/components/sections/ProjectionsSection')
);
const WhyGradualSection = lazy(
  () => import('@/components/sections/WhyGradualSection')
);
const TeamSection = lazy(() => import('@/components/sections/TeamSection'));
const ProposalTranchesSection = lazy(
  () => import('@/components/sections/ProposalTranchesSection')
);
const PaymentProofSection = lazy(
  () => import('@/components/sections/PaymentProofSection')
);
const ExpectedReturnSection = lazy(
  () => import('@/components/sections/ExpectedReturnSection')
);
const PreScaleReturnSection = lazy(
  () => import('@/components/sections/PreScaleReturnSection')
);
const GovernanceSection = lazy(
  () => import('@/components/sections/GovernanceSection')
);
const ExecutionPlanSection = lazy(
  () => import('@/components/sections/ExecutionPlanSection')
);
const ObjectionsSection = lazy(
  () => import('@/components/sections/ObjectionsSection')
);
const DecisionFrameworkSection = lazy(
  () => import('@/components/sections/DecisionFrameworkSection')
);
const SummaryTermsSection = lazy(
  () => import('@/components/sections/SummaryTermsSection')
);
const NextStepsSection = lazy(
  () => import('@/components/sections/NextStepsSection')
);

/**
 * Section Configuration
 *
 * Defines all 22 sections of the Interactive BCM Proposal
 * Each section corresponds to a slide from the original proposal
 *
 * Requirements: 1.2, 2.6
 */
export const sectionConfigs: SectionConfig[] = [
  {
    id: 'capa',
    slug: 'capa',
    title: 'BCM · LaVita Code',
    variant: 'dark',
    component: CoverSection,
    showHeader: false,
    showFooter: false,
    order: 0,
  },
  {
    id: 'resumo-executivo',
    slug: 'resumo-executivo',
    title: 'Resumo Executivo',
    variant: 'light',
    component: ExecutiveSummarySection,
    showHeader: true,
    showFooter: true,
    order: 1,
  },
  {
    id: 'urgencia-mercado',
    slug: 'urgencia-mercado',
    title: 'Urgência de Mercado',
    variant: 'teal',
    component: MarketUrgencySection,
    showHeader: true,
    showFooter: true,
    order: 2,
  },
  {
    id: 'o-que-e-bcm',
    slug: 'o-que-e-bcm',
    title: 'O que é o BCM',
    variant: 'light',
    component: ProductOverviewSection,
    showHeader: true,
    showFooter: true,
    order: 3,
  },
  {
    id: 'produto-modulos',
    slug: 'produto-modulos',
    title: 'Produto - 12 Módulos',
    variant: 'light',
    component: ProductModulesSection,
    showHeader: true,
    showFooter: true,
    order: 4,
  },
  {
    id: 'tese-tecnica',
    slug: 'tese-tecnica',
    title: 'Tese Técnica - Kernel',
    variant: 'dark',
    component: TechnicalThesisSection,
    showHeader: true,
    showFooter: true,
    order: 5,
  },
  {
    id: 'protocolos-gradual',
    slug: 'protocolos-gradual',
    title: 'Protocolos Gradual',
    variant: 'light',
    component: GradualProtocolsSection,
    showHeader: true,
    showFooter: true,
    order: 6,
  },
  {
    id: 'oera-fundador',
    slug: 'oera-fundador',
    title: 'OERA como Fundador',
    variant: 'teal',
    component: OERAFounderSection,
    showHeader: true,
    showFooter: true,
    order: 7,
  },
  {
    id: 'mercado-receita',
    slug: 'mercado-receita',
    title: 'Mercado & Receita',
    variant: 'light',
    component: MarketRevenueSection,
    showHeader: true,
    showFooter: true,
    order: 8,
  },
  {
    id: 'projecoes',
    slug: 'projecoes',
    title: 'Projeções',
    variant: 'light',
    component: ProjectionsSection,
    showHeader: true,
    showFooter: true,
    order: 9,
  },
  {
    id: 'por-que-gradual',
    slug: 'por-que-gradual',
    title: 'Por que o Gradual',
    variant: 'dark',
    component: WhyGradualSection,
    showHeader: true,
    showFooter: true,
    order: 10,
  },
  {
    id: 'time',
    slug: 'time',
    title: 'Time',
    variant: 'light',
    component: TeamSection,
    showHeader: true,
    showFooter: true,
    order: 11,
  },
  {
    id: 'proposta-tranches',
    slug: 'proposta-tranches',
    title: 'Proposta & Tranches',
    variant: 'teal',
    component: ProposalTranchesSection,
    showHeader: true,
    showFooter: true,
    order: 12,
  },
  {
    id: 'pagamento-prova',
    slug: 'pagamento-prova',
    title: 'Pagamento por Prova',
    variant: 'light',
    component: PaymentProofSection,
    showHeader: true,
    showFooter: true,
    order: 13,
  },
  {
    id: 'retorno-esperado',
    slug: 'retorno-esperado',
    title: 'Retorno Esperado',
    variant: 'light',
    component: ExpectedReturnSection,
    showHeader: true,
    showFooter: true,
    order: 14,
  },
  {
    id: 'retorno-pre-escala',
    slug: 'retorno-pre-escala',
    title: 'Retorno Antes da Escala',
    variant: 'dark',
    component: PreScaleReturnSection,
    showHeader: true,
    showFooter: true,
    order: 15,
  },
  {
    id: 'governanca',
    slug: 'governanca',
    title: 'Governança',
    variant: 'light',
    component: GovernanceSection,
    showHeader: true,
    showFooter: true,
    order: 16,
  },
  {
    id: 'plano-execucao',
    slug: 'plano-execucao',
    title: 'Plano de Execução',
    variant: 'light',
    component: ExecutionPlanSection,
    showHeader: true,
    showFooter: true,
    order: 17,
  },
  {
    id: 'objecoes',
    slug: 'objecoes',
    title: 'Objeções',
    variant: 'teal',
    component: ObjectionsSection,
    showHeader: true,
    showFooter: true,
    order: 18,
  },
  {
    id: 'quadro-decisao',
    slug: 'quadro-decisao',
    title: 'Quadro de Decisão',
    variant: 'light',
    component: DecisionFrameworkSection,
    showHeader: true,
    showFooter: true,
    order: 19,
  },
  {
    id: 'termos-resumidos',
    slug: 'termos-resumidos',
    title: 'Termos Resumidos',
    variant: 'dark',
    component: SummaryTermsSection,
    showHeader: true,
    showFooter: true,
    order: 20,
  },
  {
    id: 'proximos-passos',
    slug: 'proximos-passos',
    title: 'Próximos Passos',
    variant: 'teal',
    component: NextStepsSection,
    showHeader: true,
    showFooter: false,
    order: 21,
  },
];

/**
 * Get section configuration by ID
 */
export const getSectionById = (id: string): SectionConfig | undefined => {
  return sectionConfigs.find(section => section.id === id);
};

/**
 * Get section configuration by slug
 */
export const getSectionBySlug = (slug: string): SectionConfig | undefined => {
  return sectionConfigs.find(section => section.slug === slug);
};

/**
 * Get section configuration by order/index
 */
export const getSectionByIndex = (index: number): SectionConfig | undefined => {
  return sectionConfigs.find(section => section.order === index);
};

/**
 * Get total number of sections
 */
export const getTotalSections = (): number => {
  return sectionConfigs.length;
};

/**
 * Get section index by ID
 */
export const getSectionIndex = (id: string): number => {
  const section = getSectionById(id);
  return section ? section.order : -1;
};

/**
 * Get next section configuration
 */
export const getNextSection = (
  currentId: string
): SectionConfig | undefined => {
  const currentIndex = getSectionIndex(currentId);
  if (currentIndex === -1 || currentIndex >= sectionConfigs.length - 1) {
    return undefined;
  }
  return getSectionByIndex(currentIndex + 1);
};

/**
 * Get previous section configuration
 */
export const getPreviousSection = (
  currentId: string
): SectionConfig | undefined => {
  const currentIndex = getSectionIndex(currentId);
  if (currentIndex <= 0) {
    return undefined;
  }
  return getSectionByIndex(currentIndex - 1);
};
