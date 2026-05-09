export function Footer() {
  const whatsappNumber = '5511976812278';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20proposta%20BCM.`;

  return (
    <footer className="w-full bg-[#060E1A] border-t border-white/10 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* LaVita Code */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">LaVita Code</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Desenvolvimento de software sob medida com foco em saúde e bem-estar.
            </p>
            <a
              href="https://lavitacode.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#5EEAD4] hover:text-[#2D9B8A] text-sm font-bold transition-colors no-underline"
            >
              <i className="bi bi-globe2" />
              lavitacode.com.br
            </a>
          </div>

          {/* BCM App */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">BCM App</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Plataforma SaaS para gestão clínica e escolar em saúde.
            </p>
            <a
              href="https://bcmapp.pro/login"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#5EEAD4] hover:text-[#2D9B8A] text-sm font-bold transition-colors no-underline"
            >
              <i className="bi bi-box-arrow-up-right" />
              bcmapp.pro
            </a>
          </div>

          {/* Contato Direto */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Contato Direto</h4>
            <div className="space-y-2">
              <a
                href="mailto:contato@lavitacode.com"
                className="flex items-center gap-2 text-slate-300 hover:text-white text-sm transition-colors no-underline"
              >
                <i className="bi bi-envelope-fill text-[#F5A623]" />
                contato@lavitacode.com
              </a>
              <a
                href="tel:+5511976812278"
                className="flex items-center gap-2 text-slate-300 hover:text-white text-sm transition-colors no-underline"
              >
                <i className="bi bi-telephone-fill text-[#F5A623]" />
                11 97681-2278
              </a>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Fale Conosco</h4>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-3 bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-full text-sm font-black transition-all shadow-lg shadow-[#25D366]/20 no-underline"
            >
              <i className="bi bi-whatsapp text-lg" />
              Abrir WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} LaVita Code · Todos os direitos reservados
          </p>
          <p className="text-slate-600 text-xs">
            Proposta Confidencial · BCM × Grupo Gradual
          </p>
        </div>
      </div>
    </footer>
  );
}
