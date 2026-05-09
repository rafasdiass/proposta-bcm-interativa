import type { SectionConfig } from '@/types';
import { sectionConfigs } from './sections';

export interface ProposalPageConfig {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  variant: SectionConfig['variant'];
  sectionIds: string[];
}

export const proposalPages: ProposalPageConfig[] = [
  {
    id: 'visao-geral',
    slug: 'visao-geral',
    title: 'Visão Geral',
    subtitle: 'A tese completa em poucos minutos.',
    variant: 'light',
    sectionIds: ['capa', 'resumo-executivo'],
  },
  {
    id: 'softhouse',
    slug: 'softhouse',
    title: 'Softhouse',
    subtitle: 'Tecnologia mais barata, sempre.',
    variant: 'light',
    sectionIds: ['softhouse-dedicada'],
  },
  {
    id: 'mercado',
    slug: 'mercado',
    title: 'Mercado',
    subtitle: 'Por que a janela existe agora.',
    variant: 'light',
    sectionIds: ['urgencia-mercado', 'mercado-receita'],
  },
  {
    id: 'produto',
    slug: 'produto',
    title: 'Produto',
    subtitle: 'O que está sendo construído e por que é defensável.',
    variant: 'light',
    sectionIds: [
      'o-que-e-bcm',
      'produto-modulos',
      'tese-tecnica',
      'protocolos-gradual',
      'oera-fundador',
    ],
  },
  {
    id: 'investimento',
    slug: 'investimento',
    title: 'Investimento',
    subtitle: 'Estrutura econômica, tranches e retorno.',
    variant: 'light',
    sectionIds: [
      'proposta-tranches',
      'simuladores-investimento',
    ],
  },
  {
    id: 'execucao',
    slug: 'execucao',
    title: 'Execução',
    subtitle: 'Time, governança, plano e critérios de decisão.',
    variant: 'light',
    sectionIds: [
      'por-que-gradual',
      'time',
      'governanca',
      'plano-execucao',
      'objecoes',
      'quadro-decisao',
    ],
  },
  {
    id: 'termos',
    slug: 'termos',
    title: 'Termos e Próximos Passos',
    subtitle: 'Resumo final para avançar.',
    variant: 'light',
    sectionIds: ['termos-resumidos', 'proximos-passos'],
  },
];

export const proposalPageTitles = proposalPages.map(page => page.title);

export function getPageSections(page: ProposalPageConfig): SectionConfig[] {
  return page.sectionIds
    .map(id => sectionConfigs.find(section => section.id === id))
    .filter((section): section is SectionConfig => Boolean(section));
}

export function findPageIndexBySlug(slug: string): number | null {
  const index = proposalPages.findIndex(page => page.slug === slug);
  return index >= 0 ? index : null;
}
