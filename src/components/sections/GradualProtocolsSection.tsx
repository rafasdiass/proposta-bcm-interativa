import { ProtocolSelector } from '../interactive/ProtocolSelector';

export default function GradualProtocolsSection() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A6B]">
          Protocolos Clínicos
        </h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          O Kernel BCM aceita múltiplos protocolos clínicos, incluindo os
          defaults desenvolvidos pela LaVita Code e os protocolos preferenciais
          do Grupo Gradual.
        </p>
      </div>

      <ProtocolSelector />

      <div className="bg-blue-50 border-l-4 border-[#1B3A6B] p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-[#1B3A6B] mb-3">
          Flexibilidade Clínica Total
        </h3>
        <p className="text-gray-700 leading-relaxed">
          O Kernel BCM foi projetado para aceitar qualquer protocolo clínico
          estruturado, permitindo que o Grupo Gradual utilize seus protocolos
          preferenciais sem comprometer a integração com os defaults do BCM.
          Esta flexibilidade garante que a plataforma se adapte às necessidades
          clínicas específicas do Gradual, mantendo a robustez e a governança do
          sistema.
        </p>
      </div>
    </div>
  );
}
