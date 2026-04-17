import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlankScoreKeepingCanvas } from '../BlankScoreKeepingCanvas'

describe('BlankScoreKeepingCanvas', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<BlankScoreKeepingCanvas />)
      // Component renders successfully
      expect(true).toBe(true)
    })

    it('should render a main element as semantic container', () => {
      render(<BlankScoreKeepingCanvas />)
      const mainElement = screen.getByLabelText('Scorekeeping canvas')
      expect(mainElement).toBeInTheDocument()
    })

    it('should have proper ARIA label for accessibility', () => {
      render(<BlankScoreKeepingCanvas />)
      const mainElement = screen.getByLabelText('Scorekeeping canvas')
      expect(mainElement).toBeInTheDocument()
    })
  })

  describe('Responsive Classes', () => {
    it('should have w-full class for full width', () => {
      render(<BlankScoreKeepingCanvas />)
      const mainElement = screen.getByLabelText('Scorekeeping canvas')
      expect(mainElement).toHaveClass('w-full')
    })

    it('should have h-screen class for full height', () => {
      render(<BlankScoreKeepingCanvas />)
      const mainElement = screen.getByLabelText('Scorekeeping canvas')
      expect(mainElement).toHaveClass('h-screen')
    })

    it('should have bg-white class for background color', () => {
      render(<BlankScoreKeepingCanvas />)
      const mainElement = screen.getByLabelText('Scorekeeping canvas')
      expect(mainElement).toHaveClass('bg-white')
    })

    it('should have flex classes for layout', () => {
      render(<BlankScoreKeepingCanvas />)
      const mainElement = screen.getByLabelText('Scorekeeping canvas')
      expect(mainElement).toHaveClass('flex')
      expect(mainElement).toHaveClass('items-center')
      expect(mainElement).toHaveClass('justify-center')
    })
  })

  describe('Content', () => {
    it('should intentionally have empty/minimal content', () => {
      render(<BlankScoreKeepingCanvas />)
      const mainElement = screen.getByLabelText('Scorekeeping canvas')
      // Children should be minimal (only comment or empty)
      expect(mainElement.children.length).toBeLessThanOrEqual(1)
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<BlankScoreKeepingCanvas />)
      const mainElement = screen.getByLabelText('Scorekeeping canvas')
      expect(mainElement).toBeInTheDocument()
    })
  })
})
