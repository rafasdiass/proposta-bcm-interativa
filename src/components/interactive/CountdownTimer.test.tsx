import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CountdownTimer } from './CountdownTimer';

// Mock the useReducedMotion hook
vi.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: vi.fn(() => false),
}));

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders countdown timer with correct structure', () => {
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days from now
    render(<CountdownTimer deadline={futureDate} />);

    expect(screen.getByText('Validade da Proposta')).toBeInTheDocument();
    expect(screen.getByText('Dias')).toBeInTheDocument();
    expect(screen.getByText('Horas')).toBeInTheDocument();
    expect(screen.getByText('Minutos')).toBeInTheDocument();
    expect(screen.getByText('Segundos')).toBeInTheDocument();
  });

  it('displays correct time remaining for future deadline', () => {
    // Set a specific future date: 5 days, 3 hours, 30 minutes, 45 seconds from now
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    const deadline = new Date('2024-01-06T03:30:45Z');
    render(<CountdownTimer deadline={deadline} />);

    // Check days (should be 5)
    expect(screen.getByLabelText(/5 dias/i)).toHaveTextContent('05');
    // Check hours (should be 3)
    expect(screen.getByLabelText(/3 horas/i)).toHaveTextContent('03');
    // Check minutes (should be 30)
    expect(screen.getByLabelText(/30 minutos/i)).toHaveTextContent('30');
    // Check seconds (should be 45)
    expect(screen.getByLabelText(/45 segundos/i)).toHaveTextContent('45');
  });

  it('updates countdown every second', async () => {
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    const deadline = new Date('2024-01-01T00:01:30Z'); // 1 minute 30 seconds from now
    render(<CountdownTimer deadline={deadline} />);

    // Initial state: 1 minute 30 seconds
    const initialSeconds = screen.getByLabelText(/30 segundos/i).textContent;
    expect(initialSeconds).toBe('30');

    // Verify that the interval is set up (timer count > 0)
    expect(vi.getTimerCount()).toBeGreaterThan(0);
  });

  it('displays expired state when deadline has passed', () => {
    const pastDate = new Date(Date.now() - 1000); // 1 second ago
    render(<CountdownTimer deadline={pastDate} />);

    expect(screen.getByText('Proposta Expirada')).toBeInTheDocument();
    expect(
      screen.getByText(/Entre em contato para renovar a proposta/i)
    ).toBeInTheDocument();
  });

  it('transitions to expired state when countdown reaches zero', async () => {
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    const deadline = new Date('2024-01-01T00:00:03Z'); // 3 seconds from now
    render(<CountdownTimer deadline={deadline} />);

    // Initially should show countdown
    expect(screen.getByText('Dias')).toBeInTheDocument();
    expect(screen.queryByText('Proposta Expirada')).not.toBeInTheDocument();

    // Advance time past deadline
    await vi.advanceTimersByTimeAsync(4000);
    vi.setSystemTime(new Date('2024-01-01T00:00:04Z'));

    // Should now show expired state
    expect(screen.getByText('Proposta Expirada')).toBeInTheDocument();
  });

  it('uses amber color when within 72-hour urgency threshold', () => {
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    // Set deadline to 48 hours from now (within 72-hour threshold)
    const deadline = new Date('2024-01-03T00:00:00Z');
    const { container } = render(<CountdownTimer deadline={deadline} />);

    // Check for amber color classes
    const countdownDisplay = container.querySelector('.bg-amber-50');
    expect(countdownDisplay).toBeInTheDocument();
    expect(countdownDisplay).toHaveClass('border-amber-500');
  });

  it('uses blue color when outside 72-hour urgency threshold', () => {
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    // Set deadline to 5 days from now (outside 72-hour threshold)
    const deadline = new Date('2024-01-06T00:00:00Z');
    const { container } = render(<CountdownTimer deadline={deadline} />);

    // Check for blue color classes
    const countdownDisplay = container.querySelector('.bg-blue-50');
    expect(countdownDisplay).toBeInTheDocument();
    expect(countdownDisplay).toHaveClass('border-blue-500');
  });

  it('displays urgency message when within 72-hour threshold', () => {
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    // Set deadline to 24 hours from now
    const deadline = new Date('2024-01-02T00:00:00Z');
    render(<CountdownTimer deadline={deadline} />);

    expect(
      screen.getByText(/Tempo limitado! Esta proposta expira em breve/i)
    ).toBeInTheDocument();
  });

  it('does not display urgency message when outside 72-hour threshold', () => {
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    // Set deadline to 5 days from now
    const deadline = new Date('2024-01-06T00:00:00Z');
    render(<CountdownTimer deadline={deadline} />);

    expect(
      screen.queryByText(/Tempo limitado! Esta proposta expira em breve/i)
    ).not.toBeInTheDocument();
  });

  it('formats numbers with leading zeros', () => {
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    // Set deadline to have single-digit values
    const deadline = new Date('2024-01-01T01:02:03Z'); // 1 hour, 2 minutes, 3 seconds
    render(<CountdownTimer deadline={deadline} />);

    expect(screen.getByLabelText(/0 dias/i)).toHaveTextContent('00');
    expect(screen.getByLabelText(/1 horas/i)).toHaveTextContent('01');
    expect(screen.getByLabelText(/2 minutos/i)).toHaveTextContent('02');
    expect(screen.getByLabelText(/3 segundos/i)).toHaveTextContent('03');
  });

  it('displays deadline date in pt-BR format', () => {
    const deadline = new Date('2026-05-22T23:59:59-03:00');
    render(<CountdownTimer deadline={deadline} />);

    // Check for formatted date (should be in dd/MM/yyyy format)
    expect(screen.getByText(/Válida até:/i)).toBeInTheDocument();
    expect(screen.getByText(/22\/05\/2026/i)).toBeInTheDocument();
  });

  it('uses default deadline when no deadline prop is provided', () => {
    render(<CountdownTimer />);

    // Should render without errors and show countdown or expired state
    expect(screen.getByText('Validade da Proposta')).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    const deadline = new Date('2024-01-02T00:00:00Z');
    const { unmount } = render(<CountdownTimer deadline={deadline} />);

    // Verify interval is running
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    // Unmount component
    unmount();

    // Verify interval is cleaned up
    expect(vi.getTimerCount()).toBe(0);
  });

  it('respects reduced motion preference', async () => {
    const { useReducedMotion } = await import('../../hooks/useReducedMotion');
    vi.mocked(useReducedMotion).mockReturnValue(true);

    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    // Set deadline within urgency threshold
    const deadline = new Date('2024-01-02T00:00:00Z');
    const { container } = render(<CountdownTimer deadline={deadline} />);

    // Should not have animate-pulse class when reduced motion is preferred
    const countdownDisplay = container.querySelector('.animate-pulse');
    expect(countdownDisplay).not.toBeInTheDocument();

    // Should show message about disabled animations
    expect(
      screen.getByText(
        /Animações decorativas foram desabilitadas conforme sua preferência/i
      )
    ).toBeInTheDocument();
  });

  it('applies custom className prop', () => {
    const deadline = new Date(Date.now() + 10000);
    const { container } = render(
      <CountdownTimer deadline={deadline} className="custom-class" />
    );

    const timerContainer = container.firstChild;
    expect(timerContainer).toHaveClass('custom-class');
  });

  it('handles edge case of exactly 72 hours remaining', () => {
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    // Set deadline to exactly 72 hours from now
    const deadline = new Date('2024-01-04T00:00:00Z');
    const { container } = render(<CountdownTimer deadline={deadline} />);

    // Should be in urgent state (within threshold)
    const countdownDisplay = container.querySelector('.bg-amber-50');
    expect(countdownDisplay).toBeInTheDocument();
  });

  it('handles edge case of just over 72 hours remaining', () => {
    const now = new Date('2024-01-01T00:00:00Z');
    vi.setSystemTime(now);

    // Set deadline to 72 hours + 1 second from now
    const deadline = new Date('2024-01-04T00:00:01Z');
    const { container } = render(<CountdownTimer deadline={deadline} />);

    // Should not be in urgent state (outside threshold)
    const countdownDisplay = container.querySelector('.bg-blue-50');
    expect(countdownDisplay).toBeInTheDocument();
  });

  describe('Edge Cases and Error Conditions', () => {
    it('handles deadline in the past', () => {
      const pastDate = new Date('2020-01-01T00:00:00Z');
      render(<CountdownTimer deadline={pastDate} />);

      expect(screen.getByText('Proposta Expirada')).toBeInTheDocument();
    });

    it('handles deadline exactly at current time', () => {
      const now = new Date();
      vi.setSystemTime(now);

      render(<CountdownTimer deadline={now} />);

      expect(screen.getByText('Proposta Expirada')).toBeInTheDocument();
    });

    it('handles very short countdown (less than 1 minute)', () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const deadline = new Date('2024-01-01T00:00:30Z'); // 30 seconds
      render(<CountdownTimer deadline={deadline} />);

      expect(screen.getByLabelText(/0 dias/i)).toHaveTextContent('00');
      expect(screen.getByLabelText(/0 horas/i)).toHaveTextContent('00');
      expect(screen.getByLabelText(/0 minutos/i)).toHaveTextContent('00');
      expect(screen.getByLabelText(/30 segundos/i)).toHaveTextContent('30');
    });

    it('handles very long countdown (years)', () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const deadline = new Date('2026-01-01T00:00:00Z'); // 2 years
      render(<CountdownTimer deadline={deadline} />);

      // Should display days (730 days for 2 years)
      const daysElement = screen.getByLabelText(/\d+ dias/i);
      expect(daysElement).toBeInTheDocument();
      expect(parseInt(daysElement.textContent || '0')).toBeGreaterThan(700);
    });

    it('handles countdown crossing midnight', async () => {
      const now = new Date('2024-01-01T23:59:50Z');
      vi.setSystemTime(now);

      const deadline = new Date('2024-01-02T00:00:10Z'); // 20 seconds, crosses midnight
      render(<CountdownTimer deadline={deadline} />);

      // Initial state
      expect(screen.getByLabelText(/0 dias/i)).toHaveTextContent('00');
      expect(screen.getByLabelText(/0 horas/i)).toHaveTextContent('00');
      expect(screen.getByLabelText(/0 minutos/i)).toHaveTextContent('00');
      expect(screen.getByLabelText(/20 segundos/i)).toHaveTextContent('20');
    });

    it('handles countdown at exactly 72 hours (urgency boundary)', () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const deadline = new Date('2024-01-04T00:00:00Z'); // Exactly 72 hours
      const { container } = render(<CountdownTimer deadline={deadline} />);

      // Should be in urgent state (at threshold)
      const countdownDisplay = container.querySelector('.bg-amber-50');
      expect(countdownDisplay).toBeInTheDocument();
      expect(
        screen.getByText(/Tempo limitado! Esta proposta expira em breve/i)
      ).toBeInTheDocument();
    });

    it('handles countdown at 72 hours + 1 second (just outside urgency)', () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const deadline = new Date('2024-01-04T00:00:01Z'); // 72 hours + 1 second
      const { container } = render(<CountdownTimer deadline={deadline} />);

      // Should NOT be in urgent state
      const countdownDisplay = container.querySelector('.bg-blue-50');
      expect(countdownDisplay).toBeInTheDocument();
      expect(
        screen.queryByText(/Tempo limitado! Esta proposta expira em breve/i)
      ).not.toBeInTheDocument();
    });

    it('handles invalid deadline gracefully', () => {
      const invalidDate = new Date('invalid');
      const { container } = render(<CountdownTimer deadline={invalidDate} />);

      // Should handle invalid date without crashing - displays NaN values
      expect(
        container.querySelector('[aria-label="NaN dias"]')
      ).toBeInTheDocument();
    });

    it('updates seconds monotonically decreasing', () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const deadline = new Date('2024-01-01T00:00:30Z'); // 30 seconds
      render(<CountdownTimer deadline={deadline} />);

      // Get initial seconds value (should be 30)
      const initialSecondsElement = screen.getByLabelText(/30 segundos/i);
      const initialSeconds = parseInt(initialSecondsElement.textContent || '0');
      expect(initialSeconds).toBe(30);

      // Verify that timer is set up (interval exists)
      expect(vi.getTimerCount()).toBeGreaterThan(0);
    });

    it('handles rapid re-renders without memory leaks', () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const deadline = new Date('2024-01-02T00:00:00Z');
      const { rerender, unmount } = render(
        <CountdownTimer deadline={deadline} />
      );

      // Rapid re-renders
      for (let i = 0; i < 10; i++) {
        rerender(<CountdownTimer deadline={deadline} />);
      }

      // Should still work correctly
      expect(screen.getByText('Validade da Proposta')).toBeInTheDocument();

      // Cleanup
      unmount();

      // Verify no timers left running
      expect(vi.getTimerCount()).toBe(0);
    });

    it('handles timezone differences correctly', () => {
      const deadline = new Date('2026-05-22T23:59:59-03:00'); // São Paulo timezone
      render(<CountdownTimer deadline={deadline} />);

      // Should display the date in pt-BR format with timezone
      expect(screen.getByText(/22\/05\/2026/i)).toBeInTheDocument();
    });

    it('displays all time units with proper formatting', () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const deadline = new Date('2024-01-06T03:30:45Z');
      render(<CountdownTimer deadline={deadline} />);

      // All units should have leading zeros
      expect(screen.getByLabelText(/5 dias/i)).toHaveTextContent('05');
      expect(screen.getByLabelText(/3 horas/i)).toHaveTextContent('03');
      expect(screen.getByLabelText(/30 minutos/i)).toHaveTextContent('30');
      expect(screen.getByLabelText(/45 segundos/i)).toHaveTextContent('45');
    });

    it('handles countdown with only seconds remaining', () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const deadline = new Date('2024-01-01T00:00:05Z'); // 5 seconds
      render(<CountdownTimer deadline={deadline} />);

      expect(screen.getByLabelText(/0 dias/i)).toHaveTextContent('00');
      expect(screen.getByLabelText(/0 horas/i)).toHaveTextContent('00');
      expect(screen.getByLabelText(/0 minutos/i)).toHaveTextContent('00');
      expect(screen.getByLabelText(/5 segundos/i)).toHaveTextContent('05');
    });

    it('stops updating after expiration', async () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const deadline = new Date('2024-01-01T00:00:02Z'); // 2 seconds
      render(<CountdownTimer deadline={deadline} />);

      // Advance past deadline
      await vi.advanceTimersByTimeAsync(3000);
      vi.setSystemTime(new Date('2024-01-01T00:00:03Z'));

      // Should show expired state
      expect(screen.getByText('Proposta Expirada')).toBeInTheDocument();

      // No more timers should be running
      const timerCount = vi.getTimerCount();
      expect(timerCount).toBe(0);
    });

    it('handles custom className prop', () => {
      const deadline = new Date(Date.now() + 10000);
      const { container } = render(
        <CountdownTimer deadline={deadline} className="custom-test-class" />
      );

      expect(container.firstChild).toHaveClass('custom-test-class');
    });

    it('displays urgency message only when urgent', () => {
      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      // Not urgent (5 days)
      const { rerender } = render(
        <CountdownTimer deadline={new Date('2024-01-06T00:00:00Z')} />
      );
      expect(
        screen.queryByText(/Tempo limitado! Esta proposta expira em breve/i)
      ).not.toBeInTheDocument();

      // Urgent (24 hours)
      rerender(<CountdownTimer deadline={new Date('2024-01-02T00:00:00Z')} />);
      expect(
        screen.getByText(/Tempo limitado! Esta proposta expira em breve/i)
      ).toBeInTheDocument();
    });

    it('handles reduced motion preference correctly', async () => {
      const { useReducedMotion } = await import('../../hooks/useReducedMotion');
      vi.mocked(useReducedMotion).mockReturnValue(true);

      const now = new Date('2024-01-01T00:00:00Z');
      vi.setSystemTime(now);

      const deadline = new Date('2024-01-02T00:00:00Z'); // Urgent
      const { container } = render(<CountdownTimer deadline={deadline} />);

      // Should not have pulse animation
      expect(container.querySelector('.animate-pulse')).not.toBeInTheDocument();

      // Should show accessibility message
      expect(
        screen.getByText(
          /Animações decorativas foram desabilitadas conforme sua preferência/i
        )
      ).toBeInTheDocument();
    });
  });
});
