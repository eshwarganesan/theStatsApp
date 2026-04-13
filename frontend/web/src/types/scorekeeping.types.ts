/**
 * Type definitions for blank scorekeeping canvas feature
 *
 * This module defines minimal TypeScript interfaces required by the scorekeeping
 * canvas implementation. In v1, these are largely empty/placeholder interfaces,
 * allowing for future expansion without breaking existing code.
 *
 * @module scorekeeping.types
 */

/**
 * Props for the BlankScoreKeepingCanvas component
 *
 * In v1, this component is stateless and doesn't require props.
 * The interface is defined here to support future extensibility.
 *
 * @interface BlankScoreKeeperProps
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BlankScoreKeeperProps {
  // Future props can be added here without breaking existing code
  // Examples: onScoreUpdate?: (team: 'home' | 'away', score: number) => void
}

/**
 * Page route type for scorekeeping pages
 *
 * @enum ScoreKeeperPageType
 */
export enum ScoreKeeperPageType {
  BLANK = 'blank',
  WITH_CONTROLS = 'with-controls',
  WITH_TIMER = 'with-timer',
}

/**
 * Score state for future scorekeeping features
 *
 * @interface ScoreState
 */
export interface ScoreState {
  homeScore: number
  awayScore: number
  quarterNumber: number
  timeRemaining: number
}
