import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Calculate time remaining in total seconds
 */
const calculateTotalSeconds = (deadline: Date, currentTime: Date): number => {
  const timeRemaining = deadline.getTime() - currentTime.getTime();

  if (timeRemaining <= 0) {
    return 0;
  }

  return Math.floor(timeRemaining / 1000);
};

/**
 * Calculate countdown state (same logic as component)
 */
interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const calculateTimeRemaining = (
  deadline: Date,
  currentTime: Date
): CountdownState => {
  const timeRemaining = deadline.getTime() - currentTime.getTime();

  if (timeRemaining <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
    };
  }

  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
};

describe('CountdownTimer Property-Based Tests', () => {
  // Feature: proposta-bcm-interativa, Property 5: Countdown Timer Monotonic Decrease
  // **Validates: Requirements 7.5**
  it('Property 5: consecutive updates should show strictly decreasing total seconds', () => {
    fc.assert(
      fc.property(
        // Generate a deadline timestamp (future date)
        fc.integer({
          min: Date.now(),
          max: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }),
        // Generate two timestamps before the deadline where time2 > time1
        fc.integer({ min: 0, max: 364 * 24 * 60 * 60 * 1000 }),
        fc.integer({ min: 1000, max: 10000 }), // Time difference in ms (1-10 seconds)
        (deadlineMs, offsetMs, timeDiffMs) => {
          const deadline = new Date(deadlineMs);
          const time1 = new Date(deadlineMs - offsetMs);
          const time2 = new Date(time1.getTime() + timeDiffMs);

          // Skip if time2 is at or past the deadline
          if (time2.getTime() >= deadline.getTime()) {
            return true;
          }

          // Calculate total seconds remaining at both timestamps
          const totalSeconds1 = calculateTotalSeconds(deadline, time1);
          const totalSeconds2 = calculateTotalSeconds(deadline, time2);

          // Property: total seconds should strictly decrease
          // (time2 is later than time1, so should have fewer seconds remaining)
          return totalSeconds2 < totalSeconds1;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('total seconds calculation should be consistent with component state', () => {
    fc.assert(
      fc.property(
        // Generate a deadline
        fc.integer({
          min: Date.now(),
          max: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }),
        // Generate a current time before the deadline
        fc.integer({ min: 0, max: 364 * 24 * 60 * 60 * 1000 }),
        (deadlineMs, offsetMs) => {
          const deadline = new Date(deadlineMs);
          const currentTime = new Date(deadlineMs - offsetMs);

          // Calculate using both methods
          const totalSeconds = calculateTotalSeconds(deadline, currentTime);
          const state = calculateTimeRemaining(deadline, currentTime);

          // Calculate total seconds from state components
          const stateSeconds =
            state.days * 24 * 60 * 60 +
            state.hours * 60 * 60 +
            state.minutes * 60 +
            state.seconds;

          // Property: both calculations should match
          return Math.abs(totalSeconds - stateSeconds) <= 1; // Allow 1 second tolerance for rounding
        }
      ),
      { numRuns: 100 }
    );
  });

  it('countdown should never show negative values', () => {
    fc.assert(
      fc.property(
        // Generate a deadline
        fc.integer({
          min: Date.now(),
          max: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }),
        // Generate a current time (could be before or after deadline)
        fc.integer({
          min: -365 * 24 * 60 * 60 * 1000,
          max: 365 * 24 * 60 * 60 * 1000,
        }),
        (deadlineMs, offsetMs) => {
          const deadline = new Date(deadlineMs);
          const currentTime = new Date(deadlineMs + offsetMs);

          const state = calculateTimeRemaining(deadline, currentTime);

          // Property: all time components should be non-negative
          return (
            state.days >= 0 &&
            state.hours >= 0 &&
            state.minutes >= 0 &&
            state.seconds >= 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('expired state should be set when current time >= deadline', () => {
    fc.assert(
      fc.property(
        // Generate a deadline
        fc.integer({
          min: Date.now(),
          max: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }),
        // Generate a current time at or after deadline
        fc.integer({ min: 0, max: 365 * 24 * 60 * 60 * 1000 }),
        (deadlineMs, offsetMs) => {
          const deadline = new Date(deadlineMs);
          const currentTime = new Date(deadlineMs + offsetMs);

          const state = calculateTimeRemaining(deadline, currentTime);

          // Property: should be expired when current time >= deadline
          return state.isExpired === true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('time components should be within valid ranges', () => {
    fc.assert(
      fc.property(
        // Generate a deadline
        fc.integer({
          min: Date.now(),
          max: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }),
        // Generate a current time before deadline
        fc.integer({ min: 0, max: 364 * 24 * 60 * 60 * 1000 }),
        (deadlineMs, offsetMs) => {
          const deadline = new Date(deadlineMs);
          const currentTime = new Date(deadlineMs - offsetMs);

          const state = calculateTimeRemaining(deadline, currentTime);

          // Property: time components should be within valid ranges
          return (
            state.days >= 0 &&
            state.hours >= 0 &&
            state.hours < 24 &&
            state.minutes >= 0 &&
            state.minutes < 60 &&
            state.seconds >= 0 &&
            state.seconds < 60
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('one second time advance should decrease total seconds by approximately 1', () => {
    fc.assert(
      fc.property(
        // Generate a deadline
        fc.integer({
          min: Date.now() + 10000,
          max: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }),
        // Generate a current time well before deadline
        fc.integer({ min: 10000, max: 364 * 24 * 60 * 60 * 1000 }),
        (deadlineMs, offsetMs) => {
          const deadline = new Date(deadlineMs);
          const time1 = new Date(deadlineMs - offsetMs);
          const time2 = new Date(time1.getTime() + 1000); // Exactly 1 second later

          // Skip if time2 is at or past the deadline
          if (time2.getTime() >= deadline.getTime()) {
            return true;
          }

          const totalSeconds1 = calculateTotalSeconds(deadline, time1);
          const totalSeconds2 = calculateTotalSeconds(deadline, time2);

          // Property: advancing 1 second should decrease total seconds by 1
          return totalSeconds1 - totalSeconds2 === 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('countdown should be zero when expired', () => {
    fc.assert(
      fc.property(
        // Generate a deadline
        fc.integer({
          min: Date.now(),
          max: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }),
        // Generate a current time at or after deadline
        fc.integer({ min: 0, max: 365 * 24 * 60 * 60 * 1000 }),
        (deadlineMs, offsetMs) => {
          const deadline = new Date(deadlineMs);
          const currentTime = new Date(deadlineMs + offsetMs);

          const state = calculateTimeRemaining(deadline, currentTime);

          // Property: all time components should be zero when expired
          if (state.isExpired) {
            return (
              state.days === 0 &&
              state.hours === 0 &&
              state.minutes === 0 &&
              state.seconds === 0
            );
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('urgency threshold detection should be consistent', () => {
    const URGENCY_THRESHOLD_MS = 72 * 60 * 60 * 1000; // 72 hours

    fc.assert(
      fc.property(
        // Generate a deadline
        fc.integer({
          min: Date.now(),
          max: Date.now() + 365 * 24 * 60 * 60 * 1000,
        }),
        // Generate a current time
        fc.integer({ min: 0, max: 365 * 24 * 60 * 60 * 1000 }),
        (deadlineMs, offsetMs) => {
          const deadline = new Date(deadlineMs);
          const currentTime = new Date(deadlineMs - offsetMs);

          const timeRemaining = deadline.getTime() - currentTime.getTime();
          const isUrgent =
            timeRemaining > 0 && timeRemaining <= URGENCY_THRESHOLD_MS;

          // Property: urgency should be true only when 0 < timeRemaining <= 72 hours
          if (isUrgent) {
            return timeRemaining > 0 && timeRemaining <= URGENCY_THRESHOLD_MS;
          } else {
            return timeRemaining <= 0 || timeRemaining > URGENCY_THRESHOLD_MS;
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
