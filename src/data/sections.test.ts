import { describe, it, expect } from 'vitest';
import {
  sectionConfigs,
  getSectionById,
  getSectionBySlug,
  getSectionByIndex,
  getTotalSections,
  getSectionIndex,
  getNextSection,
  getPreviousSection,
} from './sections';

/**
 * Section Configuration System Tests
 *
 * Tests for the section configuration system that defines all 22 sections
 * of the Interactive BCM Proposal
 *
 * Requirements: 1.2, 2.6
 */
describe('Section Configuration System', () => {
  describe('sectionConfigs', () => {
    it('should have exactly 22 sections', () => {
      expect(sectionConfigs).toHaveLength(22);
    });

    it('should have all sections with required properties', () => {
      sectionConfigs.forEach(section => {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('slug');
        expect(section).toHaveProperty('title');
        expect(section).toHaveProperty('variant');
        expect(section).toHaveProperty('component');
        expect(section).toHaveProperty('showHeader');
        expect(section).toHaveProperty('showFooter');
        expect(section).toHaveProperty('order');
      });
    });

    it('should have unique IDs for all sections', () => {
      const ids = sectionConfigs.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(sectionConfigs.length);
    });

    it('should have unique slugs for all sections', () => {
      const slugs = sectionConfigs.map(s => s.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(sectionConfigs.length);
    });

    it('should have sequential order values from 0 to 21', () => {
      const orders = sectionConfigs.map(s => s.order).sort((a, b) => a - b);
      expect(orders).toEqual(Array.from({ length: 22 }, (_, i) => i));
    });

    it('should have valid variant values', () => {
      const validVariants = ['light', 'dark', 'teal'];
      sectionConfigs.forEach(section => {
        expect(validVariants).toContain(section.variant);
      });
    });

    it('should have boolean values for showHeader and showFooter', () => {
      sectionConfigs.forEach(section => {
        expect(typeof section.showHeader).toBe('boolean');
        expect(typeof section.showFooter).toBe('boolean');
      });
    });

    it('should have cover section (capa) as first section', () => {
      const firstSection = sectionConfigs.find(s => s.order === 0);
      expect(firstSection?.id).toBe('capa');
      expect(firstSection?.showHeader).toBe(false);
      expect(firstSection?.showFooter).toBe(false);
    });

    it('should have next steps (proximos-passos) as last section', () => {
      const lastSection = sectionConfigs.find(s => s.order === 21);
      expect(lastSection?.id).toBe('proximos-passos');
      expect(lastSection?.showFooter).toBe(false);
    });

    it('should have all 22 sections from requirements', () => {
      const expectedSections = [
        'capa',
        'resumo-executivo',
        'urgencia-mercado',
        'o-que-e-bcm',
        'produto-modulos',
        'tese-tecnica',
        'protocolos-gradual',
        'oera-fundador',
        'mercado-receita',
        'projecoes',
        'por-que-gradual',
        'time',
        'proposta-tranches',
        'pagamento-prova',
        'retorno-esperado',
        'retorno-pre-escala',
        'governanca',
        'plano-execucao',
        'objecoes',
        'quadro-decisao',
        'termos-resumidos',
        'proximos-passos',
      ];

      const actualIds = sectionConfigs
        .sort((a, b) => a.order - b.order)
        .map(s => s.id);

      expect(actualIds).toEqual(expectedSections);
    });
  });

  describe('getSectionById', () => {
    it('should return section when ID exists', () => {
      const section = getSectionById('capa');
      expect(section).toBeDefined();
      expect(section?.id).toBe('capa');
    });

    it('should return undefined when ID does not exist', () => {
      const section = getSectionById('non-existent-id');
      expect(section).toBeUndefined();
    });

    it('should return correct section for all valid IDs', () => {
      sectionConfigs.forEach(config => {
        const section = getSectionById(config.id);
        expect(section).toEqual(config);
      });
    });
  });

  describe('getSectionBySlug', () => {
    it('should return section when slug exists', () => {
      const section = getSectionBySlug('capa');
      expect(section).toBeDefined();
      expect(section?.slug).toBe('capa');
    });

    it('should return undefined when slug does not exist', () => {
      const section = getSectionBySlug('non-existent-slug');
      expect(section).toBeUndefined();
    });

    it('should return correct section for all valid slugs', () => {
      sectionConfigs.forEach(config => {
        const section = getSectionBySlug(config.slug);
        expect(section).toEqual(config);
      });
    });
  });

  describe('getSectionByIndex', () => {
    it('should return section when index is valid', () => {
      const section = getSectionByIndex(0);
      expect(section).toBeDefined();
      expect(section?.order).toBe(0);
    });

    it('should return undefined when index is negative', () => {
      const section = getSectionByIndex(-1);
      expect(section).toBeUndefined();
    });

    it('should return undefined when index is out of bounds', () => {
      const section = getSectionByIndex(22);
      expect(section).toBeUndefined();
    });

    it('should return correct section for all valid indices', () => {
      for (let i = 0; i < 22; i++) {
        const section = getSectionByIndex(i);
        expect(section).toBeDefined();
        expect(section?.order).toBe(i);
      }
    });
  });

  describe('getTotalSections', () => {
    it('should return 22', () => {
      expect(getTotalSections()).toBe(22);
    });
  });

  describe('getSectionIndex', () => {
    it('should return correct index for valid section ID', () => {
      const index = getSectionIndex('capa');
      expect(index).toBe(0);
    });

    it('should return -1 for non-existent section ID', () => {
      const index = getSectionIndex('non-existent-id');
      expect(index).toBe(-1);
    });

    it('should return correct index for all sections', () => {
      sectionConfigs.forEach(config => {
        const index = getSectionIndex(config.id);
        expect(index).toBe(config.order);
      });
    });
  });

  describe('getNextSection', () => {
    it('should return next section for first section', () => {
      const nextSection = getNextSection('capa');
      expect(nextSection).toBeDefined();
      expect(nextSection?.order).toBe(1);
    });

    it('should return undefined for last section', () => {
      const nextSection = getNextSection('proximos-passos');
      expect(nextSection).toBeUndefined();
    });

    it('should return undefined for non-existent section', () => {
      const nextSection = getNextSection('non-existent-id');
      expect(nextSection).toBeUndefined();
    });

    it('should return correct next section for all sections except last', () => {
      for (let i = 0; i < 21; i++) {
        const currentSection = getSectionByIndex(i);
        if (currentSection) {
          const nextSection = getNextSection(currentSection.id);
          expect(nextSection).toBeDefined();
          expect(nextSection?.order).toBe(i + 1);
        }
      }
    });
  });

  describe('getPreviousSection', () => {
    it('should return undefined for first section', () => {
      const prevSection = getPreviousSection('capa');
      expect(prevSection).toBeUndefined();
    });

    it('should return previous section for last section', () => {
      const prevSection = getPreviousSection('proximos-passos');
      expect(prevSection).toBeDefined();
      expect(prevSection?.order).toBe(20);
    });

    it('should return undefined for non-existent section', () => {
      const prevSection = getPreviousSection('non-existent-id');
      expect(prevSection).toBeUndefined();
    });

    it('should return correct previous section for all sections except first', () => {
      for (let i = 1; i < 22; i++) {
        const currentSection = getSectionByIndex(i);
        if (currentSection) {
          const prevSection = getPreviousSection(currentSection.id);
          expect(prevSection).toBeDefined();
          expect(prevSection?.order).toBe(i - 1);
        }
      }
    });
  });

  describe('Section routing and deep linking', () => {
    it('should support URL fragment generation from section slug', () => {
      sectionConfigs.forEach(section => {
        const fragment = `secao-${section.slug}`;
        expect(fragment).toMatch(/^secao-[a-z-]+$/);
      });
    });

    it('should have slugs that are URL-safe', () => {
      sectionConfigs.forEach(section => {
        // Slugs should only contain lowercase letters and hyphens
        expect(section.slug).toMatch(/^[a-z-]+$/);
      });
    });
  });

  describe('Section variants distribution', () => {
    it('should have a mix of light, dark, and teal variants', () => {
      const variants = sectionConfigs.map(s => s.variant);
      expect(variants).toContain('light');
      expect(variants).toContain('dark');
      expect(variants).toContain('teal');
    });

    it('should have appropriate variant for cover section', () => {
      const coverSection = getSectionById('capa');
      expect(coverSection?.variant).toBe('dark');
    });

    it('should have appropriate variant for urgency section', () => {
      const urgencySection = getSectionById('urgencia-mercado');
      expect(urgencySection?.variant).toBe('teal');
    });
  });

  describe('Header and footer configuration', () => {
    it('should not show header and footer on cover section', () => {
      const coverSection = getSectionById('capa');
      expect(coverSection?.showHeader).toBe(false);
      expect(coverSection?.showFooter).toBe(false);
    });

    it('should not show footer on next steps section', () => {
      const nextStepsSection = getSectionById('proximos-passos');
      expect(nextStepsSection?.showFooter).toBe(false);
    });

    it('should show header and footer on most sections', () => {
      const sectionsWithBoth = sectionConfigs.filter(
        s => s.showHeader && s.showFooter
      );
      // Most sections should have both header and footer
      expect(sectionsWithBoth.length).toBeGreaterThan(15);
    });
  });
});
