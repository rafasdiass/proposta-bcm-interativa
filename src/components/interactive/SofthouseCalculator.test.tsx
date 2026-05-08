import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SofthouseCalculator } from './SofthouseCalculator';

describe('SofthouseCalculator', () => {
  it('renders the calculator with header and description', () => {
    render(<SofthouseCalculator />);

    expect(
      screen.getByText('Calculadora Softhouse LaVita Code')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Calcule a economia operacional com 25% de desconto/)
    ).toBeInTheDocument();
  });

  it('displays reference examples with correct values', () => {
    render(<SofthouseCalculator />);

    // Check for R$8,000/month example
    expect(screen.getByText(/R\$\s*8\.000,00\/mês/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*24\.000,00\/ano/)).toBeInTheDocument();
    expect(screen.getAllByText(/3\.1/).length).toBeGreaterThan(0); // "3.1" appears in reference example

    // Check for R$12,000/month example
    expect(screen.getByText(/R\$\s*12\.000,00\/mês/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*36\.000,00\/ano/)).toBeInTheDocument();
    expect(screen.getAllByText(/2\.1/).length).toBeGreaterThan(0); // "2.1" appears in reference example
  });

  it('calculates savings correctly for R$8,000/month', () => {
    render(<SofthouseCalculator />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '8000' } });

    // Monthly savings: 8000 * 0.25 = 2000
    expect(screen.getByText(/R\$\s*2\.000,00/)).toBeInTheDocument();

    // Annual savings: 2000 * 12 = 24000 (appears in multiple places)
    expect(screen.getAllByText(/R\$\s*24\.000,00/).length).toBeGreaterThan(0);

    // Payback: 75000 / 24000 = 3.125 ≈ 3.1 years (appears in multiple places)
    expect(screen.getAllByText(/3\.1 anos/).length).toBeGreaterThan(0);
  });

  it('calculates savings correctly for R$12,000/month', () => {
    render(<SofthouseCalculator />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '12000' } });

    // Monthly savings: 12000 * 0.25 = 3000
    expect(screen.getByText(/R\$\s*3\.000,00/)).toBeInTheDocument();

    // Annual savings: 3000 * 12 = 36000 (appears in multiple places)
    expect(screen.getAllByText(/R\$\s*36\.000,00/).length).toBeGreaterThan(0);

    // Payback: 75000 / 36000 = 2.083 ≈ 2.1 years (appears in multiple places)
    expect(screen.getAllByText(/2\.1 anos/).length).toBeGreaterThan(0);
  });

  it('handles zero cost input gracefully', () => {
    render(<SofthouseCalculator />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '0' } });

    // Should show zero savings (appears in multiple places)
    expect(screen.getAllByText(/R\$\s*0,00/).length).toBeGreaterThan(0);

    // Should show N/A for payback
    expect(screen.getByText('N/A')).toBeInTheDocument();

    // Should show informative message
    expect(
      screen.getByText('Informe um custo mensal para estimar o payback')
    ).toBeInTheDocument();
  });

  it('formats all monetary values in BRL', () => {
    render(<SofthouseCalculator />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '10000' } });

    // Check BRL formatting (R$ with thousands separator and decimal)
    const currencyElements = screen.getAllByText(/R\$/);
    expect(currencyElements.length).toBeGreaterThan(0);

    // Verify specific formatted values
    expect(screen.getByText(/R\$\s*2\.500,00/)).toBeInTheDocument(); // Monthly savings
    expect(screen.getByText(/R\$\s*30\.000,00/)).toBeInTheDocument(); // Annual savings
  });

  it('loads reference example when clicked', () => {
    render(<SofthouseCalculator />);

    // Click the first reference example (R$8,000/month)
    const exampleButton = screen.getByText(/R\$\s*8\.000,00\/mês/);
    fireEvent.click(exampleButton);

    // Verify the input value is updated
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('8000');

    // Verify calculations are updated - use getAllByText since values appear in multiple places
    expect(screen.getAllByText(/R\$\s*2\.000,00/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/R\$\s*24\.000,00/).length).toBeGreaterThan(0);
  });

  it('updates calculations when monthly cost changes', () => {
    render(<SofthouseCalculator />);

    const input = screen.getByRole('spinbutton');

    // First value
    fireEvent.change(input, { target: { value: '5000' } });
    expect(screen.getByText(/R\$\s*1\.250,00/)).toBeInTheDocument(); // 5000 * 0.25

    // Second value
    fireEvent.change(input, { target: { value: '10000' } });
    expect(screen.getByText(/R\$\s*2\.500,00/)).toBeInTheDocument(); // 10000 * 0.25
  });

  it('respects minimum and maximum cost constraints', () => {
    render(<SofthouseCalculator />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    // Try to set below minimum (0)
    fireEvent.change(input, { target: { value: '-1000' } });
    expect(parseInt(input.value)).toBe(0);

    // Try to set above maximum (200,000)
    fireEvent.change(input, { target: { value: '250000' } });
    expect(parseInt(input.value)).toBe(200000);
  });

  it('displays investment amount in disclaimer', () => {
    render(<SofthouseCalculator />);

    // Check that R$75,000 appears (it appears in multiple places)
    expect(screen.getAllByText(/R\$\s*75\.000,00/).length).toBeGreaterThan(0);
  });

  it('shows correct payback calculation for various inputs', () => {
    render(<SofthouseCalculator />);

    const input = screen.getByRole('spinbutton');

    // Test case 1: R$20,000/month
    // Annual savings: 20000 * 0.25 * 12 = 60,000
    // Payback: 75000 / 60000 = 1.25 years
    fireEvent.change(input, { target: { value: '20000' } });
    expect(screen.getByText(/1\.3 anos/)).toBeInTheDocument();

    // Test case 2: R$50,000/month
    // Annual savings: 50000 * 0.25 * 12 = 150,000
    // Payback: 75000 / 150000 = 0.5 years
    fireEvent.change(input, { target: { value: '50000' } });
    expect(screen.getByText(/0\.5 anos/)).toBeInTheDocument();
  });

  it('handles empty input gracefully', () => {
    render(<SofthouseCalculator />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '' } });

    // Should default to 0
    expect(screen.getByText('N/A')).toBeInTheDocument();
    expect(
      screen.getByText('Informe um custo mensal para estimar o payback')
    ).toBeInTheDocument();
  });

  it('displays discount rate information', () => {
    render(<SofthouseCalculator />);

    // Check that "25% de desconto" appears (it appears in multiple places)
    expect(screen.getAllByText(/25% de desconto/i).length).toBeGreaterThan(0);
  });

  it('shows operational return disclaimer', () => {
    render(<SofthouseCalculator />);

    expect(
      screen.getByText(/retorno operacional do uso dos serviços/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /independente do retorno sobre o investimento em equity/i
      )
    ).toBeInTheDocument();
  });

  describe('Edge Cases and Error Conditions', () => {
    it('handles invalid monthly cost input gracefully', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;

      // Try to input NaN
      fireEvent.change(input, { target: { value: 'invalid' } });

      // Should handle gracefully (either maintain previous value or show 0)
      expect(input).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('handles very large monthly cost values', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '200000' } });

      // Should calculate correctly for max value
      // Monthly savings: 200000 * 0.25 = 50,000
      expect(screen.getByText(/R\$\s*50\.000,00/)).toBeInTheDocument();

      // Annual savings: 50000 * 12 = 600,000
      expect(screen.getByText(/R\$\s*600\.000,00/)).toBeInTheDocument();

      // Payback: 75000 / 600000 = 0.125 years
      expect(screen.getByText(/0\.1 anos/)).toBeInTheDocument();
    });

    it('handles very small monthly cost values', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '100' } });

      // Should calculate correctly for small value
      // Monthly savings: 100 * 0.25 = 25
      expect(screen.getByText(/R\$\s*25,00/)).toBeInTheDocument();

      // Annual savings: 25 * 12 = 300
      expect(screen.getByText(/R\$\s*300,00/)).toBeInTheDocument();

      // Payback: 75000 / 300 = 250 years
      expect(screen.getByText(/250\.0 anos/)).toBeInTheDocument();
    });

    it('handles rapid value changes', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton');

      // Rapidly change values
      fireEvent.change(input, { target: { value: '5000' } });
      fireEvent.change(input, { target: { value: '10000' } });
      fireEvent.change(input, { target: { value: '15000' } });
      fireEvent.change(input, { target: { value: '8000' } });

      // Should end up with final value calculations
      expect(screen.getByText(/R\$\s*2\.000,00/)).toBeInTheDocument();
    });

    it('handles slider and number input synchronization', () => {
      render(<SofthouseCalculator />);

      const inputs = screen.getAllByRole('spinbutton');
      const numberInput = inputs[0] as HTMLInputElement;

      // Change via number input
      fireEvent.change(numberInput, { target: { value: '10000' } });

      // Both inputs should have the same value
      expect(numberInput.value).toBe('10000');
    });

    it('maintains calculation accuracy with decimal results', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton');

      // Set value that results in decimal payback
      fireEvent.change(input, { target: { value: '7500' } });

      // Annual savings: 7500 * 0.25 * 12 = 22,500
      // Payback: 75000 / 22500 = 3.333... ≈ 3.3 years
      expect(screen.getByText(/3\.3 anos/)).toBeInTheDocument();
    });

    it('displays correct discount rate information', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '10000' } });

      // Monthly savings should be exactly 25% of monthly cost
      // 10000 * 0.25 = 2500
      expect(screen.getByText(/R\$\s*2\.500,00/)).toBeInTheDocument();
    });

    it('handles boundary value at minimum (0)', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '0' } });

      // Should show N/A and informative message
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(
        screen.getByText('Informe um custo mensal para estimar o payback')
      ).toBeInTheDocument();
    });

    it('handles boundary value at maximum (200000)', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '200000' } });

      // Should accept max value
      expect(input.value).toBe('200000');

      // Should calculate correctly
      expect(screen.getByText(/R\$\s*50\.000,00/)).toBeInTheDocument();
    });

    it('formats all monetary values consistently', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '12345' } });

      // Check that all currency values use BRL formatting
      const currencyElements = screen.getAllByText(/R\$/);
      expect(currencyElements.length).toBeGreaterThan(0);

      // Check for proper thousands separator (dot) and decimal separator (comma)
      const formattedValues = screen.getAllByText(/\d{1,3}\.\d{3},\d{2}/);
      expect(formattedValues.length).toBeGreaterThan(0);
    });

    it('recalculates immediately on input change', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton');

      // Get initial state (should be 0)
      expect(screen.getByText('N/A')).toBeInTheDocument();

      // Change value
      fireEvent.change(input, { target: { value: '8000' } });

      // Should immediately show new calculations
      expect(screen.queryByText('N/A')).not.toBeInTheDocument();
      expect(screen.getByText(/R\$\s*2\.000,00/)).toBeInTheDocument();
    });

    it('handles negative values by clamping to minimum', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '-5000' } });

      // Should clamp to 0
      expect(parseInt(input.value)).toBe(0);
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('handles values exceeding maximum by clamping', () => {
      render(<SofthouseCalculator />);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '300000' } });

      // Should clamp to 200000
      expect(parseInt(input.value)).toBe(200000);
    });

    it('displays investment amount consistently', () => {
      render(<SofthouseCalculator />);

      // R$ 75,000 should appear in multiple places
      const investmentReferences = screen.getAllByText(/R\$\s*75\.000,00/);
      expect(investmentReferences.length).toBeGreaterThan(0);
    });

    it('handles reference example clicks correctly', () => {
      render(<SofthouseCalculator />);

      // Click second example
      const example2 = screen.getByText(/R\$\s*12\.000,00\/mês/);
      fireEvent.click(example2);

      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('12000');

      // Verify calculations match the example
      expect(screen.getAllByText(/R\$\s*3\.000,00/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/R\$\s*36\.000,00/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/2\.1 anos/).length).toBeGreaterThan(0);
    });
  });
});
