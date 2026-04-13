import React from 'react'
import type { BlankScoreKeeperProps } from '@/types/scorekeeping.types'

/**
 * BlankScoreKeepingCanvas Component
 *
 * A minimal, intentionally blank scorekeeping canvas that serves as the foundation
 * for future scorekeeping features. This component provides:
 *
 * - Semantic HTML structure with <main> landmark element
 * - Full viewport coverage (width and height)
 * - Responsive design using Tailwind utilities
 * - Proper accessibility attributes (ARIA labels, semantic roles)
 * - Clean, minimalist aesthetic aligned with theStatsApp design system
 *
 * The component is intentionally simple to avoid over-engineering.
 * Future features (timer, scores, controls) will be added as child components.
 *
 * @component
 * @example
 * return <BlankScoreKeepingCanvas />
 *
 * @returns {JSX.Element} Blank scorekeeping canvas main element
 */
export const BlankScoreKeepingCanvas: React.FC<BlankScoreKeeperProps> = () => {
  return (
    <main
      className="w-full h-screen bg-white flex items-center justify-center"
      role="main"
      aria-label="Scorekeeping canvas"
    >
      {/* 
        Intentionally blank - ready for future features:
        - Timer display
        - Team scores
        - Game controls
        - Statistics panel
      */}
    </main>
  )
}

export default BlankScoreKeepingCanvas
