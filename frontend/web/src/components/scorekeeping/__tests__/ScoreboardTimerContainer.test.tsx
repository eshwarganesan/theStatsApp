import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { ScoreboardTimerContainer } from '../ScoreboardTimerContainer'

describe('ScoreboardTimerContainer', () => {
  describe('Initial State', () => {
    it('displays initial time 10:00', () => {
      render(<ScoreboardTimerContainer initialTime={600} />)
      expect(screen.getByText('10:00')).toBeInTheDocument()
    })

    it('starts with timer paused', () => {
      render(<ScoreboardTimerContainer initialTime={600} />)
      const button = screen.getByRole('button', { name: /start timer/i })
      expect(button).toBeInTheDocument()
    })

    it('shows paused status initially', () => {
      render(<ScoreboardTimerContainer initialTime={600} />)
      expect(screen.getByText('○ Paused')).toBeInTheDocument()
    })
  })

  describe('Timer Countdown', () => {
    it('timer counts down when started', async () => {
      jest.useFakeTimers()
      render(<ScoreboardTimerContainer initialTime={600} />)

      // Click play button
      const playButton = screen.getByRole('button', { name: /start timer/i })
      fireEvent.click(playButton)

      // Should show pause button now
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause timer/i })).toBeInTheDocument()
      })

      // Advance timer by 1 second
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Time should decrease
      await waitFor(() => {
        expect(screen.getByText('09:59')).toBeInTheDocument()
      })

      jest.useRealTimers()
    })

    it('timer stops at 0:00', async () => {
      jest.useFakeTimers()
      render(<ScoreboardTimerContainer initialTime={5} />)

      const playButton = screen.getByRole('button', { name: /start timer/i })
      fireEvent.click(playButton)

      // Advance by 6 seconds (past 5 second limit)
      act(() => {
        jest.advanceTimersByTime(6000)
      })

      await waitFor(() => {
        expect(screen.getByText('00:00')).toBeInTheDocument()
      })

      jest.useRealTimers()
    })

    it('timer does not go negative', async () => {
      jest.useFakeTimers()
      render(<ScoreboardTimerContainer initialTime={1} />)

      const playButton = screen.getByRole('button', { name: /start timer/i })
      fireEvent.click(playButton)

      // Advance by way more than 1 second
      act(() => {
        jest.advanceTimersByTime(10000)
      })

      await waitFor(() => {
        expect(screen.getByText('00:00')).toBeInTheDocument()
      })

      jest.useRealTimers()
    })
  })

  describe('Toggle Control', () => {
    it('toggling pauses and resumes timer', async () => {
      jest.useFakeTimers()
      render(<ScoreboardTimerContainer initialTime={600} />)

      // Start timer
      let button = screen.getByRole('button', { name: /start timer/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /pause timer/i })).toBeInTheDocument()
      })

      // Advance timer
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(screen.getByText('09:59')).toBeInTheDocument()
      })

      // Pause timer
      button = screen.getByRole('button', { name: /pause timer/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument()
      })

      // Advance timer (should not change because paused)
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(screen.getByText('09:59')).toBeInTheDocument()
      })

      jest.useRealTimers()
    })

    it('keyboard Enter key toggles timer', () => {
      render(<ScoreboardTimerContainer initialTime={600} />)
      const button = screen.getByRole('button', { name: /start timer/i })

      fireEvent.keyDown(button, { key: 'Enter' })
      expect(screen.getByRole('button', { name: /pause timer/i })).toBeInTheDocument()
    })

    it('keyboard Space key toggles timer', () => {
      render(<ScoreboardTimerContainer initialTime={600} />)
      const button = screen.getByRole('button', { name: /start timer/i })

      fireEvent.keyDown(button, { key: ' ' })
      expect(screen.getByRole('button', { name: /pause timer/i })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has region role for timer control', () => {
      const { container } = render(<ScoreboardTimerContainer initialTime={600} />)
      const region = container.querySelector('[role="region"]')
      expect(region).toBeInTheDocument()
      expect(region).toHaveAttribute('aria-label', 'Game timer control')
    })

    it('displays task info text', () => {
      render(<ScoreboardTimerContainer initialTime={600} />)
      expect(screen.getByText(/Click play to start/i)).toBeInTheDocument()
    })
  })

  describe('Callbacks', () => {
    it('calls onTimeUpdate when time changes', async () => {
      jest.useFakeTimers()
      const mockCallback = jest.fn()
      render(<ScoreboardTimerContainer initialTime={600} onTimeUpdate={mockCallback} />)

      const playButton = screen.getByRole('button', { name: /start timer/i })
      fireEvent.click(playButton)

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(mockCallback).toHaveBeenCalledWith(599)
      })

      jest.useRealTimers()
    })
  })

  describe('Cleanup', () => {
    it('cleans up interval on unmount', () => {
      jest.useFakeTimers()
      const { unmount } = render(<ScoreboardTimerContainer initialTime={600} />)

      const playButton = screen.getByRole('button', { name: /start timer/i })
      fireEvent.click(playButton)

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow()

      jest.useRealTimers()
    })
  })
})
