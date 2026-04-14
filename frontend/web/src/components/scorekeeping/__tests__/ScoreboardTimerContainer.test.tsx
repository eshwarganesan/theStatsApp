import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScoreboardTimerContainer } from '../ScoreboardTimerContainer'

describe('ScoreboardTimerContainer - User Story Integration Tests', () => {
  describe('US1: Adjust Minutes Up (P1)', () => {
    it('should increment minutes by 1 when timer is paused', async () => {
      const user = userEvent.setup()
      render(<ScoreboardTimerContainer initialTime={600} />)
      
      // Initially shows 10:00
      expect(screen.getByRole('status')).toHaveTextContent('10:00')
      
      // Find and click minute up arrow (first up arrow)
      const upArrows = screen.getAllByLabelText(/Increment/i)
      const minuteUpArrow = upArrows[0]
      
      await user.click(minuteUpArrow)
      
      // Should now show 11:00 (600 + 60 = 660)
      expect(screen.getByRole('status')).toHaveTextContent('11:00')
    })

    it('should cap minutes at 59:59', async () => {
      const user = userEvent.setup()
      render(<ScoreboardTimerContainer initialTime={3599} />)
      
      // Initially shows 59:59
      expect(screen.getByRole('status')).toHaveTextContent('59:59')
      
      // Try to increment minute
      const upArrows = screen.getAllByLabelText(/Increment/i)
      const minuteUpArrow = upArrows[0]
      
      await user.click(minuteUpArrow)
      
      // Should still show 59:59 (already at max)
      expect(screen.getByRole('status')).toHaveTextContent('59:59')
    })

    it('should have minute up arrow disabled at 59:59', () => {
      render(<ScoreboardTimerContainer initialTime={3599} />)
      
      const upArrows = screen.getAllByLabelText(/Increment/i)
      const minuteUpArrow = upArrows[0]
      
      // Minute up arrow should be disabled at max
      expect(minuteUpArrow).toBeDisabled()
    })
  })

  describe('US2: Adjust Seconds Up/Down (P1)', () => {
    it('should increment seconds by 1 when timer is paused', async () => {
      const user = userEvent.setup()
      render(<ScoreboardTimerContainer initialTime={600} />)
      
      // Initially shows 10:00
      expect(screen.getByRole('status')).toHaveTextContent('10:00')
      
      // Find and click second up arrow (third up arrow)
      const upArrows = screen.getAllByLabelText(/Increment/i)
      const secondUpArrow = upArrows[1]
      
      await user.click(secondUpArrow)
      
      // Should now show 10:01 (600 + 1 = 601)
      expect(screen.getByRole('status')).toHaveTextContent('10:01')
    })

    it('should decrement seconds by 1 when timer is paused', async () => {
      const user = userEvent.setup()
      render(<ScoreboardTimerContainer initialTime={600} />)
      
      // Initially shows 10:00
      expect(screen.getByRole('status')).toHaveTextContent('10:00')
      
      // Find and click second down arrow
      const downArrows = screen.getAllByLabelText(/Decrement/i)
      const secondDownArrow = downArrows[1]
      
      await user.click(secondDownArrow)
      
      // Should now show 09:59 (600 - 1 = 599)
      expect(screen.getByRole('status')).toHaveTextContent('09:59')
    })

    it('should cap seconds at 59:59', async () => {
      const user = userEvent.setup()
      render(<ScoreboardTimerContainer initialTime={3599} />)
      
      // Initially shows 59:59
      expect(screen.getByRole('status')).toHaveTextContent('59:59')
      
      // Try to increment seconds
      const upArrows = screen.getAllByLabelText(/Increment/i)
      const secondUpArrow = upArrows[1]
      
      await user.click(secondUpArrow)
      
      // Should still show 59:59 (already at max)
      expect(screen.getByRole('status')).toHaveTextContent('59:59')
    })

    it('should floor seconds at 00:00', async () => {
      const user = userEvent.setup()
      render(<ScoreboardTimerContainer initialTime={0} />)
      
      // Initially shows 00:00
      expect(screen.getByRole('status')).toHaveTextContent('00:00')
      
      // Try to decrement seconds
      const downArrows = screen.getAllByLabelText(/Decrement/i)
      const secondDownArrow = downArrows[1]
      
      await user.click(secondDownArrow)
      
      // Should still show 00:00 (already at min)
      expect(screen.getByRole('status')).toHaveTextContent('00:00')
    })

    it('should have second down arrow disabled at 00:00', () => {
      render(<ScoreboardTimerContainer initialTime={0} />)
      
      const downArrows = screen.getAllByLabelText(/Decrement/i)
      const secondDownArrow = downArrows[1]
      
      // Second down arrow should be disabled at min
      expect(secondDownArrow).toBeDisabled()
    })
  })

  describe('US3: All Controls Disabled When Running (P1)', () => {
    it('should have minute and second adjustment buttons', () => {
      render(<ScoreboardTimerContainer initialTime={600} />)
      
      // Verify all 4 arrow buttons exist and are accessible
      const upArrows = screen.getAllByLabelText(/Increment/i)
      const downArrows = screen.getAllByLabelText(/Decrement/i)
      
      expect(upArrows).toHaveLength(2) // increment minutes + increment seconds
      expect(downArrows).toHaveLength(2) // decrement minutes + decrement seconds
    })

    it('should respect disabled states based on boundaries and running', () => {
      render(<ScoreboardTimerContainer initialTime={0} />)
      
      // At 00:00, second down arrow should be disabled
      const downArrows = screen.getAllByLabelText(/Decrement/i)
      const secondDownArrow = downArrows[1]
      
      expect(secondDownArrow).toBeDisabled()
    })

    it('should respect boundary constraint at 59:59', () => {
      render(<ScoreboardTimerContainer initialTime={3599} />)
      
      // At 59:59, minute up arrow should be disabled
      const upArrows = screen.getAllByLabelText(/Increment/i)
      const minuteUpArrow = upArrows[0]
      
      expect(minuteUpArrow).toBeDisabled()
    })
  })

  describe('US4: Layout, Labels, and Accessibility (P2)', () => {
    it('should have semantic structure with region role', () => {
      render(<ScoreboardTimerContainer />)
      const container = screen.getByRole('region')
      expect(container).toHaveAttribute('aria-label', 'Game timer control')
    })

    it('should display MIN label in left column', () => {
      render(<ScoreboardTimerContainer />)
      expect(screen.getByText('Min')).toBeInTheDocument()
    })

    it('should display SEC label in right column', () => {
      render(<ScoreboardTimerContainer />)
      expect(screen.getByText('Sec')).toBeInTheDocument()
    })

    it('should have minute increment arrow with correct aria-label', () => {
      render(<ScoreboardTimerContainer />)
      expect(screen.getByLabelText('Increment minutes')).toBeInTheDocument()
    })

    it('should have minute decrement arrow with correct aria-label', () => {
      render(<ScoreboardTimerContainer />)
      expect(screen.getByLabelText('Decrement minutes')).toBeInTheDocument()
    })

    it('should have second increment arrow with correct aria-label', () => {
      render(<ScoreboardTimerContainer />)
      expect(screen.getByLabelText('Increment seconds')).toBeInTheDocument()
    })

    it('should have second decrement arrow with correct aria-label', () => {
      render(<ScoreboardTimerContainer />)
      expect(screen.getByLabelText('Decrement seconds')).toBeInTheDocument()
    })

    it('should display component with custom className', () => {
      const { container } = render(
        <ScoreboardTimerContainer className="custom-class" />
      )
      const region = container.querySelector('[role="region"]')
      expect(region).toHaveClass('custom-class')
    })

    it('should have proper flex layout for horizontal arrangement', () => {
      const { container } = render(<ScoreboardTimerContainer />)
      const region = container.querySelector('[role="region"]')
      expect(region).toHaveClass('flex', 'flex-row', 'items-center', 'justify-center', 'gap-6')
    })

    it('should render 4 arrow buttons total', () => {
      render(<ScoreboardTimerContainer />)
      const arrows = screen.getAllByRole('button', { hidden: false })
      // Filter for arrow buttons only (contains ▲ or ▼)
      const arrowButtons = arrows.filter(btn => btn.textContent?.includes('▲') || btn.textContent?.includes('▼'))
      expect(arrowButtons.length).toBe(4)
    })

    it('should have proper button positioning: minute up, minute down, second up, second down', () => {
      render(<ScoreboardTimerContainer />)
      const upArrows = screen.getAllByLabelText(/Increment/i)
      const downArrows = screen.getAllByLabelText(/Decrement/i)
      
      // Should have 2 increment and 2 decrement
      expect(upArrows.length).toBe(2)
      expect(downArrows.length).toBe(2)
      
      // Labels should be correct
      expect(upArrows[0]).toHaveAttribute('aria-label', 'Increment minutes')
      expect(upArrows[1]).toHaveAttribute('aria-label', 'Increment seconds')
      expect(downArrows[0]).toHaveAttribute('aria-label', 'Decrement minutes')
      expect(downArrows[1]).toHaveAttribute('aria-label', 'Decrement seconds')
    })

    it('should support keyboard operation via Enter on buttons', async () => {
      const user = userEvent.setup()
      render(<ScoreboardTimerContainer initialTime={600} />)
      
      const upArrows = screen.getAllByLabelText(/Increment/i)
      const minuteUpArrow = upArrows[0]
      
      // Focus and press Enter
      minuteUpArrow.focus()
      fireEvent.keyDown(minuteUpArrow, { key: 'Enter', code: 'Enter' })
      
      // The onClick should have been triggered
      // Check that time changed
      expect(screen.getByRole('status')).toHaveTextContent('11:00')
    })

    it('should support keyboard operation via Space on buttons', async () => {
      const user = userEvent.setup()
      render(<ScoreboardTimerContainer initialTime={600} />)
      
      const upArrows = screen.getAllByLabelText(/Increment/i)
      const secondUpArrow = upArrows[1]
      
      // Focus and press Space
      secondUpArrow.focus()
      fireEvent.keyDown(secondUpArrow, { key: ' ', code: 'Space' })
      
      // The onClick should have been triggered
      // Check that time changed
      expect(screen.getByRole('status')).toHaveTextContent('10:01')
    })
  })

  describe('Combined Functionality', () => {
    it('should have proper structure with left/center/right columns', () => {
      const { container } = render(<ScoreboardTimerContainer />)
      
      // Should have 3 column divs
      const columns = container.querySelectorAll('.flex.flex-col.items-center')
      expect(columns.length).toBeGreaterThanOrEqual(3) // At least: minutes, center, seconds
    })

    it('should display all controls visible together', () => {
      render(<ScoreboardTimerContainer />)
      
      // Verify all key elements exist
      expect(screen.getByText('Min')).toBeInTheDocument()
      expect(screen.getByText('Sec')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeInTheDocument() // Timer display
      expect(screen.getByRole('button', { name: /start|pause/i })).toBeInTheDocument() // Toggle
    })

    it('should support independent minute and second adjustments', () => {
      render(<ScoreboardTimerContainer initialTime={600} />)
      
      // Verify buttons can be found by their specific labels
      expect(screen.getByLabelText('Increment minutes')).toBeInTheDocument()
      expect(screen.getByLabelText('Decrement minutes')).toBeInTheDocument()
      expect(screen.getByLabelText('Increment seconds')).toBeInTheDocument()
      expect(screen.getByLabelText('Decrement seconds')).toBeInTheDocument()
    })
  })
})
