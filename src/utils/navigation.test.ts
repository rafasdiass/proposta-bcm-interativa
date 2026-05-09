import {
  scrollToSection,
  getSectionElement,
  getAllSectionElements,
  calculateSectionProgress,
  getCurrentSectionFromScroll,
  parseSectionFromFragment,
  generateSectionFragment,
  prefersReducedMotion,
  getScrollBehavior,
} from './navigation';

describe('Navigation Utilities', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';

    // Reset window properties
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      value: 0,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: 800,
    });

    Object.defineProperty(document.documentElement, 'scrollTop', {
      writable: true,
      value: 0,
    });

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      value: 2400, // 3x viewport height
    });
  });

  describe('scrollToSection', () => {
    it('should scroll to section element when it exists', () => {
      // Create a mock section element
      const sectionElement = document.createElement('div');
      sectionElement.id = 'section-5';
      const scrollIntoViewSpy = vi.spyOn(sectionElement, 'scrollIntoView');
      document.body.appendChild(sectionElement);

      scrollToSection(5);

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      });
    });

    it('should handle custom scroll options', () => {
      const sectionElement = document.createElement('div');
      sectionElement.id = 'section-3';
      const scrollIntoViewSpy = vi.spyOn(sectionElement, 'scrollIntoView');
      document.body.appendChild(sectionElement);

      scrollToSection(3, {
        behavior: 'auto',
        block: 'center',
        inline: 'start',
      });

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'center',
        inline: 'start',
      });
    });

    it('should not throw error when section does not exist', () => {
      expect(() => scrollToSection(999)).not.toThrow();
    });
  });

  describe('getSectionElement', () => {
    it('should return section element when it exists', () => {
      const sectionElement = document.createElement('div');
      sectionElement.id = 'section-2';
      document.body.appendChild(sectionElement);

      const result = getSectionElement(2);

      expect(result).toBe(sectionElement);
    });

    it('should return null when section does not exist', () => {
      const result = getSectionElement(999);

      expect(result).toBeNull();
    });
  });

  describe('getAllSectionElements', () => {
    it('should return all section elements', () => {
      // Create multiple section elements
      for (let i = 0; i < 5; i++) {
        const sectionElement = document.createElement('div');
        sectionElement.id = `section-${i}`;
        document.body.appendChild(sectionElement);
      }

      const result = getAllSectionElements();

      expect(result).toHaveLength(5);
      expect(result[0].id).toBe('section-0');
      expect(result[4].id).toBe('section-4');
    });

    it('should return empty array when no sections exist', () => {
      const result = getAllSectionElements();

      expect(result).toHaveLength(0);
    });
  });

  describe('calculateSectionProgress', () => {
    it('should calculate progress correctly', () => {
      // Set scroll position to middle
      Object.defineProperty(window, 'pageYOffset', { value: 800 });

      const progress = calculateSectionProgress();

      // scrollHeight (2400) - innerHeight (800) = 1600
      // scrollTop (800) / 1600 = 0.5
      expect(progress).toBe(0.5);
    });

    it('should return 0 when at top', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 0 });

      const progress = calculateSectionProgress();

      expect(progress).toBe(0);
    });

    it('should return 1 when at bottom', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 1600 });

      const progress = calculateSectionProgress();

      expect(progress).toBe(1);
    });

    it('should handle edge case when scrollHeight equals innerHeight', () => {
      Object.defineProperty(document.documentElement, 'scrollHeight', {
        value: 800,
      });

      const progress = calculateSectionProgress();

      expect(progress).toBe(0);
    });
  });

  describe('getCurrentSectionFromScroll', () => {
    it('should return correct section index based on scroll progress', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 800 }); // 50% progress

      const sectionIndex = getCurrentSectionFromScroll(10);

      // 50% of 10 sections = section 5
      expect(sectionIndex).toBe(5);
    });

    it('should not exceed total sections', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 1600 }); // 100% progress

      const sectionIndex = getCurrentSectionFromScroll(5);

      // Should be clamped to last section (4)
      expect(sectionIndex).toBe(4);
    });

    it('should not go below 0', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 0 });

      const sectionIndex = getCurrentSectionFromScroll(10);

      expect(sectionIndex).toBe(0);
    });
  });

  describe('parseSectionFromFragment', () => {
    it('should parse section index from valid fragment', () => {
      expect(parseSectionFromFragment('#secao-5')).toBe(5);
      expect(parseSectionFromFragment('secao-10')).toBe(10);
      expect(parseSectionFromFragment('#secao-0')).toBe(0);
    });

    it('should return null for invalid fragments', () => {
      expect(parseSectionFromFragment('#invalid')).toBeNull();
      expect(parseSectionFromFragment('#secao-')).toBeNull();
      expect(parseSectionFromFragment('#secao-abc')).toBeNull();
      expect(parseSectionFromFragment('')).toBeNull();
    });
  });

  describe('generateSectionFragment', () => {
    it('should generate correct fragment for section index', () => {
      expect(generateSectionFragment(0)).toBe('visao-geral');
      expect(generateSectionFragment(5)).toBe('termos');
      expect(generateSectionFragment(21)).toBe('secao-21');
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return true when user prefers reduced motion', () => {
      // Mock matchMedia to return matches: true
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: true,
      }));

      expect(prefersReducedMotion()).toBe(true);
    });

    it('should return false when user does not prefer reduced motion', () => {
      // Mock matchMedia to return matches: false
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
      }));

      expect(prefersReducedMotion()).toBe(false);
    });
  });

  describe('getScrollBehavior', () => {
    it('should return auto when user prefers reduced motion', () => {
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: true,
      }));

      expect(getScrollBehavior()).toBe('auto');
    });

    it('should return smooth when user does not prefer reduced motion', () => {
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
      }));

      expect(getScrollBehavior()).toBe('smooth');
    });
  });
});
