export function Footer() {
  const whatsappNumber = '5511976812278';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Ol%C3%A1%2C%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20a%20proposta%20BCM.`;

  return (
    <footer className="w-full bg-[#060E1A] border-t border-white/10 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile: compact horizontal layout */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-center">
          <a
            href="https://lavitacode.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#5EEAD4] hover:text-[#2D9B8A] text-xs sm:text-sm font-bold transition-colors no-underline"
          >
            <i className="bi bi-globe2" />
            LaVita Code
          </a>

          <span className="text-white/20 hidden sm:inline">|</span>

          <a
            href="https://bcmapp.pro/login"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#5EEAD4] hover:text-[#2D9B8A] text-xs sm:text-sm font-bold transition-colors no-underline"
          >
            <i className="bi bi-box-arrow-up-right" />
            BCM App
          </a>

          <span className="text-white/20 hidden sm:inline">|</span>

          <a
            href="mailto:contato@lavitacode.com"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-xs sm:text-sm transition-colors no-underline"
          >
            <i className="bi bi-envelope-fill text-[#F5A623]" />
            contato@lavitacode.com
          </a>

          <span className="text-white/20 hidden sm:inline">|</span>

          <a
            href="tel:+5511976812278"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-xs sm:text-sm transition-colors no-underline"
          >
            <i className="bi bi-telephone-fill text-[#F5A623]" />
            11 97681-2278
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5A] text-white rounded-full text-xs font-black transition-all shadow-lg shadow-[#25D366]/20 no-underline"
          >
            <i className="bi bi-whatsapp text-base" />
            WhatsApp
          </a>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-slate-500 text-[10px] sm:text-xs">
            © {new Date().getFullYear()} LaVita Code · Proposta Confidencial · BCM × Grupo Gradual
          </p>
        </div>
      </div>
    </footer>
  );
}
