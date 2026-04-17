import React from 'react'
import { render, screen } from '@testing-library/react'
import { ScoreboardTimer } from '../ScoreboardTimer'

describe('ScoreboardTimer', () => {
  it('renders with initial time 10:00', () => {
    render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={600}
        initialTime={600}
      />
    )
    expect(screen.getByText('10:00')).toBeInTheDocument()
  })

  it('displays time in MM:SS format', () => {
    render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={65}
        initialTime={600}
      />
    )
    expect(screen.getByText('01:05')).toBeInTheDocument()
  })

  it('shows paused status when not running', () => {
    render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={300}
        initialTime={600}
      />
    )
    expect(screen.getByText('○ Paused')).toBeInTheDocument()
  })

  it('shows running status when active', () => {
    render(
      <ScoreboardTimer
        isRunning={true}
        currentTime={300}
        initialTime={600}
      />
    )
    expect(screen.getByText('● Running')).toBeInTheDocument()
  })

  it('shows expired status at 0:00', () => {
    render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={0}
        initialTime={600}
      />
    )
    expect(screen.getByText('● End')).toBeInTheDocument()
  })

  it('has semantic time element', () => {
    render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={600}
        initialTime={600}
      />
    )
    const timeElement = screen.getByRole('status')
    expect(timeElement).toBeInTheDocument()
    expect(timeElement.tagName).toBe('TIME')
  })

  it('has aria-live for screen reader announcements', () => {
    const { container } = render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={600}
        initialTime={600}
      />
    )
    const ariaLiveElement = container.querySelector('[aria-live="polite"]')
    expect(ariaLiveElement).toBeInTheDocument()
  })

  it('calls onTimeUpdate callback', () => {
    const mockCallback = jest.fn()
    const { rerender } = render(
      <ScoreboardTimer
        isRunning={false}
        currentTime={600}
        initialTime={600}
        onTimeUpdate={mockCallback}
      />
    )
    expect(mockCallback).toHaveBeenCalledWith(600)

    rerender(
      <ScoreboardTimer
        isRunning={false}
        currentTime={300}
        initialTime={600}
        onTimeUpdate={mockCallback}
      />
    )
    expect(mockCallback).toHaveBeenCalledWith(300)
  })
})
