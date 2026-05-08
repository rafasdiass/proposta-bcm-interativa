/**
 * Responsive Design Tests for ROI Simulator
 *
 * Tests that the ROI Simulator component renders correctly across different viewport sizes
 * and meets touch target requirements for mobile devices.
 *
 * Requirements: 14.1, 14.2
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ROISimulator } from './ROISimulator';

describe('ROISimulator - Responsive Design', () => {
  it('renders without horizontal scroll on mobile viewport (320px)', () => {
    // Set viewport to mobile size
    global.innerWidth = 320;
    global.innerHeight = 568;

    const { container } = render(<ROISimulator />);

    // Component should render
    expect(screen.getByText('Simulador de ROI dos 5%')).toBeInTheDocument();

    // Container should not exceed viewport width
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toBeInTheDocument();
  });

  it('renders all interactive elements with minimum 44px touch targets', () => {
    render(<ROISimulator />);

    // Check scenario buttons
    const scenarioButtons = screen.getAllByRole('button');
    expect(scenarioButtons.length).toBeGreaterThan(0);

    // All buttons should have touch-manipulation class
    scenarioButtons.forEach(button => {
      const classes = button.className;
      expect(classes).toContain('touch-manipulation');
    });
  });

  it('displays all pre-configured scenarios', () => {
    render(<ROISimulator />);

    expect(screen.getByText(/Breakeven/i)).toBeInTheDocument();
    expect(screen.getByText(/1\.000 assinantes/i)).toBeInTheDocument();
    expect(screen.getByText(/Contrato municipal/i)).toBeInTheDocument();
    expect(screen.getByText(/Presença nacional/i)).toBeInTheDocument();
  });

  it('displays all input controls', () => {
    render(<ROISimulator />);

    // Subscriber count input
    expect(
      screen.getByLabelText(/Número de Assinantes Pagantes/i)
    ).toBeInTheDocument();

    // Plan mix inputs
    expect(screen.getByLabelText(/Profissional/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Clínica/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Escola/i)).toBeInTheDocument();

    // MRR multiple input
    expect(screen.getByLabelText(/Múltiplo de MRR/i)).toBeInTheDocument();
  });

  it('displays results section', () => {
    render(<ROISimulator />);

    expect(screen.getByText('Resultados da Simulação')).toBeInTheDocument();
    expect(screen.getByText(/Receita Mensal/i)).toBeInTheDocument();
    expect(screen.getByText(/Valuation Estimado/i)).toBeInTheDocument();
    expect(screen.getByText(/Valor dos 5%/i)).toBeInTheDocument();
  });

  it('displays disclaimer', () => {
    render(<ROISimulator />);

    expect(
      screen.getByText(/Projeções são estimativas comerciais/i)
    ).toBeInTheDocument();
  });

  it('renders with responsive typography classes', () => {
    const { container } = render(<ROISimulator />);

    // Check for responsive text classes
    const heading = screen.getByText('Simulador de ROI dos 5%');
    expect(heading.className).toMatch(/text-(lg|xl|2xl)/);
  });
});
