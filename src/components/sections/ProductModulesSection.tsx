/**
 * ProductModulesSection Component
 *
 * Displays the 12 BCM product modules in expandable cards
 */

import { ModuleCards } from '../interactive/ModuleCards';

export default function ProductModulesSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="text-sm font-bold text-[#2D9B8A] uppercase tracking-wider mb-2">
          O Produto
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1B3A6B] mb-4">
          12 Módulos Integrados
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          A proposta não é financiar uma ideia. É acelerar um ativo funcional
          com módulos já definidos.
        </p>
      </div>

      <ModuleCards />
    </div>
  );
}
