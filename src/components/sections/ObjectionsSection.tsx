import { ObjectionAccordion } from '../interactive/ObjectionAccordion';

export default function ObjectionsSection() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-[#2D9B8A] mb-2">
          Objeções respondidas
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A6B] mb-4">
          As principais dúvidas já foram tratadas na estrutura do acordo.
        </h2>
      </div>

      <ObjectionAccordion />
    </div>
  );
}
