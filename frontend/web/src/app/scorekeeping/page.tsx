import { Metadata } from 'next'
import { BlankScoreKeepingCanvas } from '@/components/scorekeeping/BlankScoreKeepingCanvas'

export const metadata: Metadata = {
  title: 'Scorekeeping - theStatsApp',
  description: 'Basketball game scorekeeping',
  viewport: 'width=device-width, initial-scale=1',
}

/**
 * Scorekeeping Page
 *
 * This page serves as the main entry point for the basketball scorekeeping
 * application. It displays a minimal, blank canvas that can be extended with
 * game state, controls, and statistics.
 *
 * Route: /scorekeeping
 */
export default function ScoreKeepingPage() {
  return (
    <div className="w-full h-screen">
      <BlankScoreKeepingCanvas />
    </div>
  )
}
