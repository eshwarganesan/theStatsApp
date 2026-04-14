/**
 * Timer boundary constants for adjustment controls
 * Feature 006: Timer Adjustment Controls
 */

export const TIMER_CONSTANTS = {
  /** Maximum timer value in seconds (59 minutes 59 seconds) */
  MAX_TIME_SECONDS: 3599,

  /** Minimum timer value in seconds */
  MIN_TIME_SECONDS: 0,

  /** Maximum minutes (59) */
  MAX_MINUTES: 59,

  /** Maximum seconds (59) */
  MAX_SECONDS: 59,

  /** Seconds per minute (conversion constant) */
  SECONDS_PER_MINUTE: 60,

  /** Default initial timer duration in seconds (10:00) */
  DEFAULT_INITIAL_TIME: 600,
} as const
