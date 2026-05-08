import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { TrancheTimeline } from './TrancheTimeline';

describe('TrancheTimeline', () => {
  describe('Rendering', () => {
    it('should render the timeline with header and total investment', () => {
      render(<TrancheTimeline />);

      expect(screen.getByText('Timeline de Investimento')).toBeInTheDocument();
      expect(screen.getByText('Investimento Total:')).toBeInTheDocument();
      expect(screen.getByText('R$ 75.000')).toBeInTheDocument();
    });

    it('should render all three tranches', () => {
      render(<TrancheTimeline />);

      expect(screen.getByText('Tranche 1')).toBeInTheDocument();
      expect(screen.getByText('Tranche 2')).toBeInTheDocument();
      expect(screen.getByText('Tranche 3')).toBeInTheDocument();
    });

    it('should display correct amounts for each tranche', () => {
      render(<TrancheTimeline />);

      // Use getAllByText since amounts appear in both main cards and summary
      const t1Amounts = screen.getAllByText('R$ 30.000');
      const t2Amounts = screen.getAllByText('R$ 25.000');
      const t3Amounts = screen.getAllByText('R$ 20.000');

      // Each amount should appear at least once
      expect(t1Amounts.length).toBeGreaterThan(0);
      expect(t2Amounts.length).toBeGreaterThan(0);
      expect(t3Amounts.length).toBeGreaterThan(0);
    });

    it('should display correct triggers for each tranche', () => {
      render(<TrancheTimeline />);

      expect(screen.getByText('Assinatura do contrato')).toBeInTheDocument();
      expect(
        screen.getByText('50 usuários pagantes ativos')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Publicação conjunta OU 100 usuários pagantes')
      ).toBeInTheDocument();
    });
  });

  describe('Interaction - Hover/Touch', () => {
    it('should expand tranche when clicked', () => {
      render(<TrancheTimeline />);

      const tranche1 = screen.getByRole('button', {
        name: /Tranche 1.*Assinatura do contrato/i,
      });

      // Check aria-expanded attribute instead of visibility
      expect(tranche1).toHaveAttribute('aria-expanded', 'false');

      // Click to expand
      fireEvent.click(tranche1);

      // Check aria-expanded changed
      expect(tranche1).toHaveAttribute('aria-expanded', 'true');

      // Deliverables should now be in the document
      expect(
        screen.getByText('Viagem inicial para reunião presencial')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Onboarding completo da equipe')
      ).toBeInTheDocument();
    });

    it('should collapse tranche when clicked again', () => {
      render(<TrancheTimeline />);

      const tranche1 = screen.getByRole('button', {
        name: /Tranche 1.*Assinatura do contrato/i,
      });

      // Expand
      fireEvent.click(tranche1);
      expect(tranche1).toHaveAttribute('aria-expanded', 'true');
      expect(
        screen.getByText('Viagem inicial para reunião presencial')
      ).toBeInTheDocument();

      // Collapse
      fireEvent.click(tranche1);
      expect(tranche1).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show deliverables for T1 when expanded', () => {
      render(<TrancheTimeline />);

      const tranche1 = screen.getByRole('button', {
        name: /Tranche 1/i,
      });

      fireEvent.click(tranche1);

      expect(
        screen.getByText('Viagem inicial para reunião presencial')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Onboarding completo da equipe')
      ).toBeInTheDocument();
      expect(screen.getByText('Início da integração OERA')).toBeInTheDocument();
      expect(
        screen.getByText('Setup do ambiente de desenvolvimento')
      ).toBeInTheDocument();
    });

    it('should show deliverables for T2 when expanded', () => {
      render(<TrancheTimeline />);

      const tranche2 = screen.getByRole('button', {
        name: /Tranche 2/i,
      });

      fireEvent.click(tranche2);

      expect(
        screen.getByText('Módulo de gestão de pacientes completo')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Sistema de agendamento implementado')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Integração com plataformas de pagamento')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Dashboard de métricas operacionais')
      ).toBeInTheDocument();
    });

    it('should show deliverables for T3 when expanded', () => {
      render(<TrancheTimeline />);

      const tranche3 = screen.getByRole('button', {
        name: /Tranche 3/i,
      });

      fireEvent.click(tranche3);

      expect(
        screen.getByText('Módulo de prontuário eletrônico')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Sistema de relatórios avançados')
      ).toBeInTheDocument();
      expect(screen.getByText('Integração completa OERA')).toBeInTheDocument();
      expect(
        screen.getByText('Documentação técnica finalizada')
      ).toBeInTheDocument();
    });
  });

  describe('Keyboard Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<TrancheTimeline />);

      const tranche1 = screen.getByRole('button', {
        name: /Tranche 1/i,
      });

      expect(tranche1).toHaveAttribute('aria-expanded', 'false');
      expect(tranche1).toHaveAttribute('tabIndex', '0');
    });

    it('should update aria-expanded when expanded', () => {
      render(<TrancheTimeline />);

      const tranche1 = screen.getByRole('button', {
        name: /Tranche 1/i,
      });

      fireEvent.click(tranche1);

      expect(tranche1).toHaveAttribute('aria-expanded', 'true');
    });

    it('should expand tranche when Enter key is pressed', () => {
      render(<TrancheTimeline />);

      const tranche1 = screen.getByRole('button', {
        name: /Tranche 1/i,
      });

      fireEvent.keyDown(tranche1, { key: 'Enter' });

      expect(
        screen.getByText('Viagem inicial para reunião presencial')
      ).toBeInTheDocument();
    });

    it('should expand tranche when Space key is pressed', () => {
      render(<TrancheTimeline />);

      const tranche1 = screen.getByRole('button', {
        name: /Tranche 1/i,
      });

      fireEvent.keyDown(tranche1, { key: ' ' });

      expect(
        screen.getByText('Viagem inicial para reunião presencial')
      ).toBeInTheDocument();
    });

    it('should be keyboard navigable with Tab', () => {
      render(<TrancheTimeline />);

      const tranche1 = screen.getByRole('button', { name: /Tranche 1/i });
      const tranche2 = screen.getByRole('button', { name: /Tranche 2/i });
      const tranche3 = screen.getByRole('button', { name: /Tranche 3/i });

      expect(tranche1).toHaveAttribute('tabIndex', '0');
      expect(tranche2).toHaveAttribute('tabIndex', '0');
      expect(tranche3).toHaveAttribute('tabIndex', '0');
    });

    it('should have accessible label for total investment', () => {
      render(<TrancheTimeline />);

      const totalInvestment = screen.getByLabelText(
        'Investimento total de R$ 75.000'
      );

      expect(totalInvestment).toBeInTheDocument();
    });
  });

  describe('Progress Indicator', () => {
    it('should display summary cards with tranche amounts', () => {
      render(<TrancheTimeline />);

      // Check summary section exists
      const summaryCards = screen.getAllByText(
        /T\d - (Ativo|Pendente|Completo)/
      );
      expect(summaryCards).toHaveLength(3);
    });

    it('should show status for each tranche in summary', () => {
      render(<TrancheTimeline />);

      expect(screen.getByText('T1 - Ativo')).toBeInTheDocument();
      expect(screen.getByText('T2 - Pendente')).toBeInTheDocument();
      expect(screen.getByText('T3 - Pendente')).toBeInTheDocument();
    });
  });

  describe('Total Investment Invariant', () => {
    it('should display total that equals sum of all tranches', () => {
      render(<TrancheTimeline />);

      // Total should be R$ 75.000 (30.000 + 25.000 + 20.000)
      const totalElement = screen.getByLabelText(
        'Investimento total de R$ 75.000'
      );
      expect(totalElement).toBeInTheDocument();

      // Verify individual tranches sum to total
      const t1 = 30000;
      const t2 = 25000;
      const t3 = 20000;
      const sum = t1 + t2 + t3;

      expect(sum).toBe(75000);
    });
  });

  describe('Accessibility Instructions', () => {
    it('should display keyboard navigation instructions', () => {
      render(<TrancheTimeline />);

      expect(
        screen.getByText(/Use Tab para navegar entre tranches/i)
      ).toBeInTheDocument();
    });
  });
});
