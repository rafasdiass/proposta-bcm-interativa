import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle, Mail, Loader2 } from 'lucide-react';

// Form data interface
export interface IntentFormData {
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  message?: string;
  consentGiven: boolean;
}

// Form submission status
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

interface IntentFormProps {
  onClose?: () => void;
  endpoint?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fallback email for contact
const FALLBACK_EMAIL = 'rafaeldias@lavitacode.com.br';

export const IntentForm: React.FC<IntentFormProps> = ({
  onClose,
  endpoint = import.meta.env.VITE_INTENT_ENDPOINT || '',
}) => {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<IntentFormData>({
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      role: '',
      message: '',
      consentGiven: false,
    },
  });

  // Handle form submission
  const onSubmit = async (data: IntentFormData) => {
    setStatus('submitting');
    setErrorMessage('');

    try {
      // If no endpoint is configured, skip API call
      if (!endpoint) {
        throw new Error('Endpoint de submissão não configurado');
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar formulário');
      }

      setStatus('success');
      reset();

      // Auto-close after 3 seconds on success
      setTimeout(() => {
        onClose?.();
      }, 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Erro ao enviar formulário. Por favor, tente novamente.'
      );
    }
  };

  // Handle retry
  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  // Render success state
  if (status === 'success') {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center py-6 sm:py-8">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Intenção Registrada com Sucesso!
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Obrigado pelo seu interesse. Entraremos em contato em breve para dar
            continuidade à proposta.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="btn btn-primary min-h-[44px] touch-manipulation"
              aria-label="Fechar formulário"
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Manifestar Interesse na Proposta
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Preencha o formulário abaixo para registrar sua intenção de avançar
          com a parceria estratégica BCM.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Full Name - Required */}
        <div className="mb-3 sm:mb-4">
          <label
            htmlFor="fullName"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
          >
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName', {
              required: 'Nome completo é obrigatório',
              minLength: {
                value: 3,
                message: 'Nome deve ter pelo menos 3 caracteres',
              },
            })}
            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors min-h-[44px] touch-manipulation ${
              errors.fullName
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Digite seu nome completo"
            aria-invalid={errors.fullName ? 'true' : 'false'}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email - Required */}
        <div className="mb-3 sm:mb-4">
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
          >
            Email Corporativo <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email é obrigatório',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Email inválido',
              },
            })}
            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors min-h-[44px] touch-manipulation ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="seu.email@empresa.com.br"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone - Optional */}
        <div className="mb-3 sm:mb-4">
          <label
            htmlFor="phone"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
          >
            Telefone <span className="text-gray-400 text-xs">(opcional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[44px] touch-manipulation"
            placeholder="(00) 00000-0000"
          />
        </div>

        {/* Role - Required */}
        <div className="mb-3 sm:mb-4">
          <label
            htmlFor="role"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
          >
            Papel na Decisão <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            {...register('role', {
              required: 'Papel na decisão é obrigatório',
            })}
            className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors min-h-[44px] touch-manipulation ${
              errors.role
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            aria-invalid={errors.role ? 'true' : 'false'}
            aria-describedby={errors.role ? 'role-error' : undefined}
          >
            <option value="">Selecione seu papel</option>
            <option value="decisor-final">Decisor Final</option>
            <option value="influenciador">Influenciador</option>
            <option value="avaliador-tecnico">Avaliador Técnico</option>
            <option value="avaliador-financeiro">Avaliador Financeiro</option>
            <option value="outro">Outro</option>
          </select>
          {errors.role && (
            <p
              id="role-error"
              className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Message - Optional */}
        <div className="mb-4 sm:mb-6">
          <label
            htmlFor="message"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
          >
            Mensagem <span className="text-gray-400 text-xs">(opcional)</span>
          </label>
          <textarea
            id="message"
            {...register('message')}
            rows={4}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none touch-manipulation"
            placeholder="Comentários, dúvidas ou observações adicionais..."
          />
        </div>

        {/* LGPD Consent - Required */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <input
              id="consentGiven"
              type="checkbox"
              {...register('consentGiven', {
                required: 'Você deve concordar para continuar',
              })}
              className={`mt-1 w-5 h-5 sm:w-4 sm:h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 flex-shrink-0 touch-manipulation ${
                errors.consentGiven ? 'border-red-500' : ''
              }`}
              aria-invalid={errors.consentGiven ? 'true' : 'false'}
              aria-describedby={
                errors.consentGiven ? 'consent-error' : undefined
              }
            />
            <label
              htmlFor="consentGiven"
              className="text-xs sm:text-sm text-gray-700"
            >
              <span className="text-red-500">*</span> Concordo em compartilhar
              meus dados para fins de contato comercial relacionado a esta
              proposta. Estou ciente de que as informações serão tratadas de
              forma confidencial conforme a LGPD (Lei Geral de Proteção de
              Dados).
            </label>
          </div>
          {errors.consentGiven && (
            <p
              id="consent-error"
              className="mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              {errors.consentGiven.message}
            </p>
          )}
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-red-900 mb-2">
                  {errorMessage}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="text-xs sm:text-sm font-medium text-red-700 hover:text-red-800 underline text-left min-h-[44px] sm:min-h-0 touch-manipulation"
                  >
                    Tentar novamente
                  </button>
                  <a
                    href={`mailto:${FALLBACK_EMAIL}?subject=Interesse na Proposta BCM&body=Nome: %0D%0AEmail: %0D%0ATelefone: %0D%0APapel: %0D%0AMensagem: `}
                    className="text-xs sm:text-sm font-medium text-red-700 hover:text-red-800 underline flex items-center gap-1 min-h-[44px] sm:min-h-0 touch-manipulation"
                  >
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    Enviar por email
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            type="submit"
            disabled={!isValid || status === 'submitting'}
            className="flex-1 btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation"
            aria-label="Enviar formulário de intenção"
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                Enviar Intenção
              </>
            )}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline min-h-[44px] touch-manipulation"
              aria-label="Cancelar e fechar formulário"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Confidentiality Notice */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          <strong>Confidencial:</strong> As informações desta proposta são
          confidenciais e destinadas exclusivamente ao Grupo Gradual. Ao
          submeter este formulário, você confirma estar autorizado a representar
          sua organização nesta tratativa.
        </p>
      </div>
    </div>
  );
};

export default IntentForm;
