/**
 * ProductModulesSection Component
 *
 * Displays the 12 BCM product modules in expandable cards
 */

import { ModuleCards } from '../interactive/ModuleCards';

export default function ProductModulesSection() {
  return (
    <div className="w-full min-w-0 space-y-10 md:space-y-12">
      <div className="w-full space-y-6">
        <div className="text-sm font-bold text-[#5EEAD4] uppercase tracking-wider">
          O Produto
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-safe">
          12 Módulos Integrados
        </h2>
        <p className="prose-measure text-xl text-slate-300 leading-relaxed">
          A proposta não é financiar uma ideia. É acelerar um ativo funcional
          com módulos já definidos e prontos para escala.
        </p>
      </div>

      <ModuleCards />
    </div>
  );
}
