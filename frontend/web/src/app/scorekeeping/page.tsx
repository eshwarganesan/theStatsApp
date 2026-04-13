import { Metadata } from 'next'
import { BlankScoreKeepingCanvas } from '@/components/scorekeeping/BlankScoreKeepingCanvas'
import { ScoreboardTimerContainer } from '@/components/scorekeeping/ScoreboardTimerContainer'

export const metadata: Metadata = {
  title: 'Scorekeeping - theStatsApp',
  description: 'Basketball game scorekeeping',
  viewport: 'width=device-width, initial-scale=1',
}

/**
 * Scorekeeping Page
 *
 * This page serves as the main entry point for the basketball scorekeeping
 * application. It displays a countdown timer at the top and a blank canvas
 * that can be extended with game state, controls, and statistics.
 *
 * Route: /scorekeeping
 *
 * Features:
 * - ScoreboardTimerContainer: Game timer with start/stop toggle (Feature 004)
 * - BlankScoreKeepingCanvas: Placeholder canvas for future features (Feature 003)
 */
export default function ScoreKeepingPage() {
  return (
    <main className="w-full h-screen flex flex-col bg-white">
      {/* Timer at top */}
      <ScoreboardTimerContainer initialTime={600} />

      {/* Canvas area */}
      <div className="flex-1 w-full flex items-center justify-center">
        <BlankScoreKeepingCanvas />
      </div>
    </main>
  )
}
