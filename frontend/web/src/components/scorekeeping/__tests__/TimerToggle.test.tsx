import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TimerToggle } from '../TimerToggle'

describe('TimerToggle', () => {
  it('renders play button when not running', () => {
    render(
      <TimerToggle
        isRunning={false}
        onToggle={jest.fn()}
      />
    )
    const button = screen.getByRole('button', { name: /start timer/i })
    expect(button).toBeInTheDocument()
  })

  it('renders pause button when running', () => {
    render(
      <TimerToggle
        isRunning={true}
        onToggle={jest.fn()}
      />
    )
    const button = screen.getByRole('button', { name: /pause timer/i })
    expect(button).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const mockToggle = jest.fn()
    render(
      <TimerToggle
        isRunning={false}
        onToggle={mockToggle}
      />
    )
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle when Enter key pressed', () => {
    const mockToggle = jest.fn()
    render(
      <TimerToggle
        isRunning={false}
        onToggle={mockToggle}
      />
    )
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle when Space key pressed', () => {
    const mockToggle = jest.fn()
    render(
      <TimerToggle
        isRunning={false}
        onToggle={mockToggle}
      />
    )
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: ' ' })
    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  it('has aria-pressed attribute matching isRunning state', () => {
    const { rerender } = render(
      <TimerToggle
        isRunning={false}
        onToggle={jest.fn()}
      />
    )
    let button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'false')

    rerender(
      <TimerToggle
        isRunning={true}
        onToggle={jest.fn()}
      />
    )
    button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('button is disabled when prop is true', () => {
    render(
      <TimerToggle
        isRunning={false}
        onToggle={jest.fn()}
        disabled={true}
      />
    )
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('minimum touch target size is 44px', () => {
    const { container } = render(
      <TimerToggle
        isRunning={false}
        onToggle={jest.fn()}
      />
    )
    const button = container.querySelector('button')
    expect(button).toHaveClass('px-8', 'py-3')
    // 12 * 4px (Tailwind unit) = 48px (exceeds 44px minimum)
  })
})
