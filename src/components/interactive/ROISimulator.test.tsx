import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ROISimulator } from './ROISimulator';

describe('ROISimulator', () => {
  it('renders the component with default values', () => {
    render(<ROISimulator />);

    expect(screen.getByText('Simulador de ROI dos 5%')).toBeInTheDocument();
    expect(screen.getByLabelText('Número de Assinantes Pagantes')).toHaveValue(
      '350'
    );
  });

  it('displays all pre-configured scenarios', () => {
    render(<ROISimulator />);

    expect(screen.getByText('Breakeven (350 assinantes)')).toBeInTheDocument();
    expect(screen.getByText('1.000 assinantes')).toBeInTheDocument();
    expect(
      screen.getByText('Contrato municipal + 500 assinantes')
    ).toBeInTheDocument();
    expect(screen.getByText('Presença nacional')).toBeInTheDocument();
  });

  it('loads scenario when clicking pre-configured button', () => {
    render(<ROISimulator />);

    const scenario1kButton = screen.getByText('1.000 assinantes');
    fireEvent.click(scenario1kButton);

    const subscriberInputs = screen.getAllByDisplayValue('1000');
    expect(subscriberInputs.length).toBeGreaterThan(0);
  });

  it('updates subscriber count when slider changes', () => {
    render(<ROISimulator />);

    const slider = screen.getByLabelText('Número de Assinantes Pagantes');
    fireEvent.change(slider, { target: { value: '1000' } });

    const subscriberInputs = screen.getAllByDisplayValue('1000');
    expect(subscriberInputs.length).toBeGreaterThan(0);
  });

  it('updates subscriber count when number input changes', () => {
    render(<ROISimulator />);

    const numberInputs = screen.getAllByRole('spinbutton');
    const subscriberInput = numberInputs.find(
      input =>
        input.getAttribute('min') === '0' &&
        input.getAttribute('max') === '5000'
    );

    expect(subscriberInput).toBeDefined();
    if (subscriberInput) {
      fireEvent.change(subscriberInput, { target: { value: '2000' } });
      expect(subscriberInput).toHaveValue(2000);
    }
  });

  it('constrains subscriber count to valid range [0, 5000]', () => {
    render(<ROISimulator />);

    const numberInputs = screen.getAllByRole('spinbutton');
    const subscriberInput = numberInputs.find(
      input =>
        input.getAttribute('min') === '0' &&
        input.getAttribute('max') === '5000'
    );

    if (subscriberInput) {
      // Test upper bound
      fireEvent.change(subscriberInput, { target: { value: '6000' } });
      expect(subscriberInput).toHaveValue(5000);

      // Test lower bound
      fireEvent.change(subscriberInput, { target: { value: '-100' } });
      expect(subscriberInput).toHaveValue(0);
    }
  });

  it('updates plan mix percentages', () => {
    render(<ROISimulator />);

    const professionalSlider = screen.getByLabelText(
      'Profissional (R$ 297)'
    ) as HTMLInputElement;
    fireEvent.change(professionalSlider, { target: { value: '70' } });

    // Check that the percentage is displayed
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('updates MRR multiple', () => {
    render(<ROISimulator />);

    const mrrSlider = screen.getByLabelText('Múltiplo de MRR para Valuation');
    fireEvent.change(mrrSlider, { target: { value: '10' } });

    const mrrInputs = screen.getAllByDisplayValue('10');
    expect(mrrInputs.length).toBeGreaterThan(0);
  });

  it('constrains MRR multiple to valid range [1, 20]', () => {
    render(<ROISimulator />);

    const numberInputs = screen.getAllByRole('spinbutton');
    const mrrInput = numberInputs.find(
      input =>
        input.getAttribute('min') === '1' && input.getAttribute('max') === '20'
    );

    if (mrrInput) {
      // Test upper bound
      fireEvent.change(mrrInput, { target: { value: '25' } });
      expect(mrrInput).toHaveValue(20);

      // Test lower bound
      fireEvent.change(mrrInput, { target: { value: '0' } });
      expect(mrrInput).toHaveValue(1);
    }
  });

  it('displays calculated results', () => {
    render(<ROISimulator />);

    expect(screen.getByText('Receita Mensal (MRR)')).toBeInTheDocument();
    expect(screen.getByText('Valuation Estimado')).toBeInTheDocument();
    expect(screen.getByText('Valor dos 5%')).toBeInTheDocument();
  });

  it('displays disclaimer text', () => {
    render(<ROISimulator />);

    expect(
      screen.getByText(/Projeções são estimativas comerciais/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/não constituem garantia de retorno/i)
    ).toBeInTheDocument();
  });

  it('formats currency values in BRL', () => {
    render(<ROISimulator />);

    // Check that currency values are displayed with R$ prefix
    const currencyElements = screen.getAllByText(/R\$/);
    expect(currencyElements.length).toBeGreaterThan(0);
  });

  it('calculates correct monthly revenue for default values', () => {
    render(<ROISimulator />);

    // Default: 350 subscribers, 60% Professional (297), 30% Clinic (997), 10% School (1997)
    // Professional: 350 * 0.6 * 297 = 62,370
    // Clinic: 350 * 0.3 * 997 = 104,685
    // School: 350 * 0.1 * 1997 = 69,895
    // Total: 236,950

    // Check that the revenue is displayed (using regex to match the formatted value)
    expect(screen.getByText(/R\$ 236\.950,00/)).toBeInTheDocument();
  });

  it('calculates correct 5% value for default values', () => {
    render(<ROISimulator />);

    // Default MRR: 236,950
    // Valuation: 236,950 * 5 = 1,184,750
    // 5% value: 1,184,750 * 0.05 = 59,237.50

    // Check that the 5% value is displayed (using regex to match the formatted value)
    expect(screen.getByText(/R\$ 59\.237,50/)).toBeInTheDocument();
  });

  it('updates calculations in real-time when inputs change', () => {
    render(<ROISimulator />);

    // Get initial 5% value
    const initialResults = screen.getByText(/Valor dos 5%/i).parentElement;
    const initialValue = initialResults?.textContent;

    // Change subscriber count
    const slider = screen.getByLabelText('Número de Assinantes Pagantes');
    fireEvent.change(slider, { target: { value: '1000' } });

    // Get new 5% value
    const newResults = screen.getByText(/Valor dos 5%/i).parentElement;
    const newValue = newResults?.textContent;

    // Values should be different
    expect(newValue).not.toBe(initialValue);
  });

  it('handles zero subscribers correctly', () => {
    render(<ROISimulator />);

    const slider = screen.getByLabelText('Número de Assinantes Pagantes');
    fireEvent.change(slider, { target: { value: '0' } });

    // Should display R$ 0,00 for all values (using regex to match)
    const zeroElements = screen.getAllByText(/R\$ 0,00/);
    expect(zeroElements.length).toBeGreaterThan(0);
  });

  it('handles maximum subscribers (5000) correctly', () => {
    render(<ROISimulator />);

    const slider = screen.getByLabelText('Número de Assinantes Pagantes');
    fireEvent.change(slider, { target: { value: '5000' } });

    // Should calculate and display values for 5000 subscribers
    const subscriberInputs = screen.getAllByDisplayValue('5000');
    expect(subscriberInputs.length).toBeGreaterThan(0);

    // Results should be displayed (not zero)
    const results = screen.getByText(/Valor dos 5%/i).parentElement;
    expect(results?.textContent).not.toContain('R$ 0,00');
  });

  describe('Edge Cases and Error Conditions', () => {
    it('handles invalid subscriber input gracefully', () => {
      render(<ROISimulator />);

      const numberInputs = screen.getAllByRole('spinbutton');
      const subscriberInput = numberInputs.find(
        input =>
          input.getAttribute('min') === '0' &&
          input.getAttribute('max') === '5000'
      );

      if (subscriberInput) {
        // Try to input NaN
        fireEvent.change(subscriberInput, { target: { value: 'abc' } });
        // Should maintain previous valid value (350 is default)
        expect(subscriberInput).toHaveValue(350);
      }
    });

    it('handles plan mix adjustments to maintain 100% total', () => {
      render(<ROISimulator />);

      const professionalSlider = screen.getByLabelText(
        'Profissional (R$ 297)'
      ) as HTMLInputElement;

      // Set professional to 80%
      fireEvent.change(professionalSlider, { target: { value: '80' } });

      // Check that percentages are displayed
      expect(screen.getByText('80%')).toBeInTheDocument();

      // The other two should adjust to total 20%
      const clinicPercentage = parseInt(
        screen
          .getByLabelText('Clínica (R$ 997)')
          .closest('div')
          ?.querySelector('span')?.textContent || '0'
      );
      const schoolPercentage = parseInt(
        screen
          .getByLabelText('Escola (R$ 1.997)')
          .closest('div')
          ?.querySelector('span')?.textContent || '0'
      );

      // Total should be 100%
      expect(80 + clinicPercentage + schoolPercentage).toBe(100);
    });

    it('handles plan mix set to 100% for one plan', () => {
      render(<ROISimulator />);

      const professionalSlider = screen.getByLabelText(
        'Profissional (R$ 297)'
      ) as HTMLInputElement;

      // Set professional to 100%
      fireEvent.change(professionalSlider, { target: { value: '100' } });

      // Check that professional is 100%
      expect(screen.getByText('100%')).toBeInTheDocument();

      // Other plans should be 0%
      const allZeroPercents = screen.getAllByText('0%');
      expect(allZeroPercents.length).toBeGreaterThanOrEqual(2);
    });

    it('handles fractional MRR multiple values', () => {
      render(<ROISimulator />);

      const numberInputs = screen.getAllByRole('spinbutton');
      const mrrInput = numberInputs.find(
        input =>
          input.getAttribute('min') === '1' &&
          input.getAttribute('max') === '20'
      );

      if (mrrInput) {
        // Set to 7.5
        fireEvent.change(mrrInput, { target: { value: '7.5' } });
        expect(mrrInput).toHaveValue(7.5);

        // Results should update accordingly
        const results = screen.getByText(/Valor dos 5%/i).parentElement;
        expect(results).toBeInTheDocument();
      }
    });

    it('handles rapid scenario switching', () => {
      render(<ROISimulator />);

      // Rapidly switch between scenarios
      const breakeven = screen.getByText('Breakeven (350 assinantes)');
      const scenario1k = screen.getByText('1.000 assinantes');
      const national = screen.getByText('Presença nacional');

      fireEvent.click(breakeven);
      fireEvent.click(scenario1k);
      fireEvent.click(national);
      fireEvent.click(breakeven);

      // Should end up with breakeven values
      const subscriberInputs = screen.getAllByDisplayValue('350');
      expect(subscriberInputs.length).toBeGreaterThan(0);
    });

    it('maintains calculation accuracy with extreme values', () => {
      render(<ROISimulator />);

      const slider = screen.getByLabelText('Número de Assinantes Pagantes');
      fireEvent.change(slider, { target: { value: '5000' } });

      const professionalSlider = screen.getByLabelText(
        'Profissional (R$ 297)'
      ) as HTMLInputElement;
      fireEvent.change(professionalSlider, { target: { value: '100' } });

      const numberInputs = screen.getAllByRole('spinbutton');
      const mrrInput = numberInputs.find(
        input =>
          input.getAttribute('min') === '1' &&
          input.getAttribute('max') === '20'
      );

      if (mrrInput) {
        fireEvent.change(mrrInput, { target: { value: '20' } });
      }

      // Should display large values correctly
      // 5000 * 297 = 1,485,000 MRR
      // 1,485,000 * 20 = 29,700,000 valuation
      // 29,700,000 * 0.05 = 1,485,000 (5% value)
      // Use getAllByText since the value appears in multiple places
      const matchingElements = screen.getAllByText(/R\$ 1\.485\.000,00/);
      expect(matchingElements.length).toBeGreaterThan(0);
    });

    it('handles empty input field gracefully', () => {
      render(<ROISimulator />);

      const numberInputs = screen.getAllByRole('spinbutton');
      const subscriberInput = numberInputs.find(
        input =>
          input.getAttribute('min') === '0' &&
          input.getAttribute('max') === '5000'
      );

      if (subscriberInput) {
        // Clear the input
        fireEvent.change(subscriberInput, { target: { value: '' } });

        // Should handle empty input without crashing
        expect(subscriberInput).toBeInTheDocument();
      }
    });

    it('displays all currency values with proper BRL formatting', () => {
      render(<ROISimulator />);

      // Set to known values
      const slider = screen.getByLabelText('Número de Assinantes Pagantes');
      fireEvent.change(slider, { target: { value: '1000' } });

      // Check that all currency values use proper formatting
      const currencyElements = screen.getAllByText(/R\$/);
      expect(currencyElements.length).toBeGreaterThan(0);

      // Check for proper decimal separator (comma)
      const valuesWithComma = screen.getAllByText(/,\d{2}/);
      expect(valuesWithComma.length).toBeGreaterThan(0);
    });

    it('handles subscriber count increments correctly', () => {
      render(<ROISimulator />);

      const slider = screen.getByLabelText('Número de Assinantes Pagantes');

      // Test increment by 10 (step value)
      fireEvent.change(slider, { target: { value: '350' } });
      expect(screen.getAllByDisplayValue('350').length).toBeGreaterThan(0);

      fireEvent.change(slider, { target: { value: '360' } });
      expect(screen.getAllByDisplayValue('360').length).toBeGreaterThan(0);
    });

    it('recalculates immediately when any input changes', () => {
      render(<ROISimulator />);

      // Get initial value
      const initialValue =
        screen.getByText(/Valor dos 5%/i).parentElement?.textContent;

      // Change subscriber count
      const slider = screen.getByLabelText('Número de Assinantes Pagantes');
      fireEvent.change(slider, { target: { value: '500' } });

      // Get new value
      const newValue =
        screen.getByText(/Valor dos 5%/i).parentElement?.textContent;

      // Values should be different
      expect(newValue).not.toBe(initialValue);
    });
  });
});
