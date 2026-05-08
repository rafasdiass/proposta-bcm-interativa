import React, { useState } from 'react';
import { FileDown, Calendar, FileSignature, X, Menu } from 'lucide-react';
import { IntentForm } from './IntentForm';
import { useNavigation } from '../../contexts';

/**
 * StickyCTA Component
 *
 * Fixed-position CTA bar with three primary actions:
 * - "Assinar intenção" (opens IntentForm modal)
 * - "Baixar PDF" (downloads the proposal PDF)
 * - "Agendar reunião" (opens external scheduling link)
 *
 * The bar collapses on mobile viewports and maintains WCAG AA contrast compliance.
 *
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6
 */

interface StickyCTAProps {
  /** URL for the PDF download */
  pdfUrl?: string;
  /** External scheduling link */
  schedulingUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

export const StickyCTA: React.FC<StickyCTAProps> = ({
  pdfUrl = '/BCM_Proposta_Investimento_Grupo_Gradual_ATUALIZADA.pdf',
  schedulingUrl = import.meta.env.VITE_SCHEDULING_URL || '#',
  className = '',
}) => {
  const [showIntentForm, setShowIntentForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useNavigation();

  // Handle PDF download
  const handleDownloadPDF = () => {
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'BCM_Proposta_Investimento_Grupo_Gradual.pdf';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Close mobile menu if open
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Fallback: open in new tab
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle scheduling link
  const handleScheduleMeeting = () => {
    window.open(schedulingUrl, '_blank', 'noopener,noreferrer');
    setIsMobileMenuOpen(false);
  };

  // Handle intent form open
  const handleOpenIntentForm = () => {
    setShowIntentForm(true);
    setIsMobileMenuOpen(false);
  };

  // Handle intent form close
  const handleCloseIntentForm = () => {
    setShowIntentForm(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Determine positioning based on navigation mode
  const positionClasses =
    state.mode === 'presentation'
      ? 'bottom-0 left-0 right-0'
      : 'bottom-0 left-0 right-0';

  return (
    <>
      {/* Sticky CTA Bar */}
      <div
        className={`fixed ${positionClasses} z-40 bg-white border-t-2 border-gray-200 shadow-strong ${className}`}
        role="region"
        aria-label="Ações principais da proposta"
      >
        {/* Desktop View - Full Actions */}
        <div className="hidden sm:block">
          <div className="container-content py-4">
            <div className="flex items-center justify-center gap-4">
              {/* Primary Action: Sign Intent */}
              <button
                onClick={handleOpenIntentForm}
                className="btn btn-primary flex items-center gap-2 px-6 py-3 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
                aria-label="Assinar intenção de parceria"
              >
                <FileSignature className="w-5 h-5" aria-hidden="true" />
                <span>Assinar Intenção</span>
              </button>

              {/* Secondary Action: Download PDF */}
              <button
                onClick={handleDownloadPDF}
                className="btn btn-outline flex items-center gap-2 px-6 py-3 text-base font-semibold"
                aria-label="Baixar proposta em PDF"
              >
                <FileDown className="w-5 h-5" aria-hidden="true" />
                <span>Baixar PDF</span>
              </button>

              {/* Tertiary Action: Schedule Meeting */}
              <button
                onClick={handleScheduleMeeting}
                className="btn btn-secondary flex items-center gap-2 px-6 py-3 text-base font-semibold"
                aria-label="Agendar reunião"
              >
                <Calendar className="w-5 h-5" aria-hidden="true" />
                <span>Agendar Reunião</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile View - Compact with Expandable Menu */}
        <div className="sm:hidden">
          {/* Collapsed Bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={handleOpenIntentForm}
              className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm font-semibold flex-1 mr-2"
              aria-label="Assinar intenção de parceria"
            >
              <FileSignature className="w-4 h-4" aria-hidden="true" />
              <span>Assinar Intenção</span>
            </button>

            <button
              onClick={toggleMobileMenu}
              className="btn btn-outline flex items-center gap-2 px-3 py-2"
              aria-label={
                isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu de ações'
              }
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Expanded Menu */}
          {isMobileMenuOpen && (
            <div
              className="border-t border-gray-200 bg-gray-50 px-4 py-3 space-y-2"
              role="menu"
              aria-label="Menu de ações adicionais"
            >
              <button
                onClick={handleDownloadPDF}
                className="btn btn-outline flex items-center gap-2 px-4 py-2 text-sm font-semibold w-full justify-center"
                role="menuitem"
                aria-label="Baixar proposta em PDF"
              >
                <FileDown className="w-4 h-4" aria-hidden="true" />
                <span>Baixar PDF</span>
              </button>

              <button
                onClick={handleScheduleMeeting}
                className="btn btn-secondary flex items-center gap-2 px-4 py-2 text-sm font-semibold w-full justify-center"
                role="menuitem"
                aria-label="Agendar reunião"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Agendar Reunião</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Intent Form Modal */}
      {showIntentForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intent-form-title"
          onClick={handleCloseIntentForm}
        >
          <div
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <IntentForm onClose={handleCloseIntentForm} />
          </div>
        </div>
      )}
    </>
  );
};

export default StickyCTA;
