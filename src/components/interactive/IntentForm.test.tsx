import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntentForm } from './IntentForm';

describe('IntentForm', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render all required form fields', () => {
      render(<IntentForm />);

      expect(
        screen.getByLabelText(/nome completo/i, { selector: 'input' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      ).toBeInTheDocument();
    });

    it('should render optional fields', () => {
      render(<IntentForm />);

      expect(
        screen.getByLabelText(/telefone/i, { selector: 'input' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/mensagem/i, { selector: 'textarea' })
      ).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<IntentForm />);

      expect(
        screen.getByRole('button', { name: /enviar/i })
      ).toBeInTheDocument();
    });

    it('should render cancel button when onClose is provided', () => {
      const onClose = vi.fn();
      render(<IntentForm onClose={onClose} />);

      expect(
        screen.getByRole('button', { name: /cancelar/i })
      ).toBeInTheDocument();
    });

    it('should not render cancel button when onClose is not provided', () => {
      render(<IntentForm />);

      expect(
        screen.queryByRole('button', { name: /cancelar/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show error when full name is empty', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      const nameInput = screen.getByLabelText(/nome completo/i, {
        selector: 'input',
      });
      await user.click(nameInput);
      await user.tab(); // Blur the input

      await waitFor(() => {
        expect(screen.getByText(/nome completo é obrigatório/i)).toBeVisible();
      });
    });

    it('should show error when full name is too short', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      const nameInput = screen.getByLabelText(/nome completo/i, {
        selector: 'input',
      });
      await user.type(nameInput, 'AB');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText(/nome deve ter pelo menos 3 caracteres/i)
        ).toBeVisible();
      });
    });

    it('should show error when email is empty', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      const emailInput = screen.getByLabelText(/email corporativo/i, {
        selector: 'input',
      });
      await user.click(emailInput);
      await user.click(document.body); // Click outside to trigger blur

      await waitFor(() => {
        expect(screen.getByText(/email é obrigatório/i)).toBeVisible();
      });
    });

    it('should show error when email is invalid', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      const emailInput = screen.getByLabelText(/email corporativo/i, {
        selector: 'input',
      });
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/email inválido/i)).toBeVisible();
      });
    });

    it('should show error when role is not selected', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      const roleSelect = screen.getByLabelText(/papel na decisão/i, {
        selector: 'select',
      });
      await user.click(roleSelect);
      await user.click(document.body); // Click outside to trigger blur

      await waitFor(() => {
        expect(
          screen.getByText(/papel na decisão é obrigatório/i)
        ).toBeVisible();
      });
    });

    it('should show error when consent is not given', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      const consentCheckbox = screen.getByLabelText(
        /concordo em compartilhar/i,
        {
          selector: 'input',
        }
      );

      // Check and then uncheck to trigger validation
      await user.click(consentCheckbox);
      await user.click(consentCheckbox); // Uncheck
      await user.click(document.body); // Blur

      await waitFor(() => {
        expect(
          screen.getByText(/você deve concordar para continuar/i)
        ).toBeVisible();
      });
    });

    it('should disable submit button when form is invalid', () => {
      render(<IntentForm />);

      const submitButton = screen.getByRole('button', { name: /enviar/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when all required fields are valid', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      // Fill required fields
      await user.type(
        screen.getByLabelText(/nome completo/i, { selector: 'input' }),
        'João Silva'
      );
      await user.type(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' }),
        'joao@empresa.com.br'
      );
      await user.selectOptions(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' }),
        'decisor-final'
      );
      await user.click(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      );

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /enviar/i });
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      global.fetch = mockFetch;

      render(<IntentForm endpoint="https://api.example.com/intent" />);

      // Fill form
      await user.type(
        screen.getByLabelText(/nome completo/i, { selector: 'input' }),
        'João Silva'
      );
      await user.type(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' }),
        'joao@empresa.com.br'
      );
      await user.type(
        screen.getByLabelText(/telefone/i, { selector: 'input' }),
        '(11) 98765-4321'
      );
      await user.selectOptions(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' }),
        'decisor-final'
      );
      await user.type(
        screen.getByLabelText(/mensagem/i, { selector: 'textarea' }),
        'Gostaria de mais informações'
      );
      await user.click(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      );

      // Submit
      const submitButton = screen.getByRole('button', { name: /enviar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/intent',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fullName: 'João Silva',
              email: 'joao@empresa.com.br',
              phone: '(11) 98765-4321',
              role: 'decisor-final',
              message: 'Gostaria de mais informações',
              consentGiven: true,
            }),
          })
        );
      });
    });

    it('should show success message after successful submission', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      global.fetch = mockFetch;

      render(<IntentForm endpoint="https://api.example.com/intent" />);

      // Fill and submit form
      await user.type(
        screen.getByLabelText(/nome completo/i, { selector: 'input' }),
        'João Silva'
      );
      await user.type(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' }),
        'joao@empresa.com.br'
      );
      await user.selectOptions(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' }),
        'decisor-final'
      );
      await user.click(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      );
      await user.click(screen.getByRole('button', { name: /enviar/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/intenção registrada com sucesso/i)
        ).toBeVisible();
      });
    });

    it('should show error message when submission fails', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      global.fetch = mockFetch;

      render(<IntentForm endpoint="https://api.example.com/intent" />);

      // Fill and submit form
      await user.type(
        screen.getByLabelText(/nome completo/i, { selector: 'input' }),
        'João Silva'
      );
      await user.type(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' }),
        'joao@empresa.com.br'
      );
      await user.selectOptions(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' }),
        'decisor-final'
      );
      await user.click(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      );
      await user.click(screen.getByRole('button', { name: /enviar/i }));

      await waitFor(() => {
        expect(screen.getByText(/falha ao enviar formulário/i)).toBeVisible();
      });
    });

    it('should show error when endpoint is not configured', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      // Fill and submit form
      await user.type(
        screen.getByLabelText(/nome completo/i, { selector: 'input' }),
        'João Silva'
      );
      await user.type(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' }),
        'joao@empresa.com.br'
      );
      await user.selectOptions(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' }),
        'decisor-final'
      );
      await user.click(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      );
      await user.click(screen.getByRole('button', { name: /enviar/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/endpoint de submissão não configurado/i)
        ).toBeVisible();
      });
    });

    it('should provide retry option on error', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      global.fetch = mockFetch;

      render(<IntentForm endpoint="https://api.example.com/intent" />);

      // Fill and submit form
      await user.type(
        screen.getByLabelText(/nome completo/i, { selector: 'input' }),
        'João Silva'
      );
      await user.type(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' }),
        'joao@empresa.com.br'
      );
      await user.selectOptions(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' }),
        'decisor-final'
      );
      await user.click(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      );
      await user.click(screen.getByRole('button', { name: /enviar/i }));

      await waitFor(() => {
        expect(screen.getByText(/tentar novamente/i)).toBeVisible();
      });
    });

    it('should provide mailto fallback on error', async () => {
      const user = userEvent.setup();
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      global.fetch = mockFetch;

      render(<IntentForm endpoint="https://api.example.com/intent" />);

      // Fill and submit form
      await user.type(
        screen.getByLabelText(/nome completo/i, { selector: 'input' }),
        'João Silva'
      );
      await user.type(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' }),
        'joao@empresa.com.br'
      );
      await user.selectOptions(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' }),
        'decisor-final'
      );
      await user.click(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      );
      await user.click(screen.getByRole('button', { name: /enviar/i }));

      await waitFor(() => {
        const mailtoLink = screen.getByText(/enviar por email/i);
        expect(mailtoLink).toBeVisible();
        expect(mailtoLink.closest('a')).toHaveAttribute(
          'href',
          expect.stringContaining('mailto:rafaeldias@lavitacode.com.br')
        );
      });
    });

    it('should call onClose after successful submission', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      global.fetch = mockFetch;

      render(
        <IntentForm
          endpoint="https://api.example.com/intent"
          onClose={onClose}
        />
      );

      // Fill and submit form
      await user.type(
        screen.getByLabelText(/nome completo/i, { selector: 'input' }),
        'João Silva'
      );
      await user.type(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' }),
        'joao@empresa.com.br'
      );
      await user.selectOptions(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' }),
        'decisor-final'
      );
      await user.click(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      );
      await user.click(screen.getByRole('button', { name: /enviar/i }));

      await waitFor(() => {
        expect(
          screen.getByText(/intenção registrada com sucesso/i)
        ).toBeVisible();
      });

      // onClose should be called after 3 seconds
      await waitFor(
        () => {
          expect(onClose).toHaveBeenCalled();
        },
        { timeout: 4000 }
      );
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for all inputs', () => {
      render(<IntentForm />);

      expect(
        screen.getByLabelText(/nome completo/i, { selector: 'input' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/telefone/i, { selector: 'input' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/mensagem/i, { selector: 'textarea' })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      ).toBeInTheDocument();
    });

    it('should mark invalid fields with aria-invalid', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      const nameInput = screen.getByLabelText(/nome completo/i, {
        selector: 'input',
      });

      // Type and then clear to trigger validation
      await user.type(nameInput, 'A');
      await user.clear(nameInput);
      await user.click(document.body); // Click outside to trigger blur

      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('should associate error messages with inputs via aria-describedby', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      const nameInput = screen.getByLabelText(/nome completo/i, {
        selector: 'input',
      });

      // Type and then clear to trigger validation
      await user.type(nameInput, 'A');
      await user.clear(nameInput);
      await user.click(document.body); // Click outside to trigger blur

      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-describedby', 'fullName-error');
        expect(screen.getByRole('alert')).toHaveTextContent(
          /nome completo é obrigatório/i
        );
      });
    });

    it('should have proper button labels', () => {
      const onClose = vi.fn();
      render(<IntentForm onClose={onClose} />);

      expect(
        screen.getByRole('button', {
          name: /enviar formulário de intenção/i,
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', {
          name: /cancelar e fechar formulário/i,
        })
      ).toBeInTheDocument();
    });
  });

  describe('LGPD Compliance', () => {
    it('should display LGPD consent text', () => {
      render(<IntentForm />);

      expect(
        screen.getByText(/concordo em compartilhar meus dados/i)
      ).toBeVisible();
      expect(screen.getByText(/lgpd/i)).toBeVisible();
    });

    it('should display confidentiality notice', () => {
      render(<IntentForm />);

      expect(screen.getByText(/confidencial:/i)).toBeVisible();
    });

    it('should require consent before submission', async () => {
      const user = userEvent.setup();
      render(<IntentForm />);

      // Fill all fields except consent
      await user.type(
        screen.getByLabelText(/nome completo/i, { selector: 'input' }),
        'João Silva'
      );
      await user.type(
        screen.getByLabelText(/email corporativo/i, { selector: 'input' }),
        'joao@empresa.com.br'
      );
      await user.selectOptions(
        screen.getByLabelText(/papel na decisão/i, { selector: 'select' }),
        'decisor-final'
      );

      // Submit button should be disabled without consent
      const submitButton = screen.getByRole('button', { name: /enviar/i });
      expect(submitButton).toBeDisabled();

      // Now check consent
      await user.click(
        screen.getByLabelText(/concordo em compartilhar/i, {
          selector: 'input',
        })
      );

      // Wait for form to update and button to be enabled
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onClose when cancel button is clicked', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      render(<IntentForm onClose={onClose} />);

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
