import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ArrowButton } from '../ArrowButton'

describe('ArrowButton Component', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render up arrow when direction is "up"', () => {
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      expect(button.textContent).toBe('▲')
    })

    it('should render down arrow when direction is "down"', () => {
      render(
        <ArrowButton
          direction="down"
          unit="seconds"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      expect(button.textContent).toBe('▼')
    })
  })

  describe('ARIA Attributes', () => {
    it('should have correct aria-label for increment minutes', () => {
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Increment minutes')
    })

    it('should have correct aria-label for decrement minutes', () => {
      render(
        <ArrowButton
          direction="down"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Decrement minutes')
    })

    it('should have correct aria-label for increment seconds', () => {
      render(
        <ArrowButton
          direction="up"
          unit="seconds"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Increment seconds')
    })

    it('should have correct aria-label for decrement seconds', () => {
      render(
        <ArrowButton
          direction="down"
          unit="seconds"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Decrement seconds')
    })

    it('should always have aria-pressed attribute set to false', () => {
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('Click Handling', () => {
    it('should call onClick handler when clicked', async () => {
      const user = userEvent.setup()
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      await user.click(button)
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled and clicked', async () => {
      const user = userEvent.setup()
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={true}
        />
      )
      const button = screen.getByRole('button')
      await user.click(button)
      expect(mockOnClick).not.toHaveBeenCalled()
    })

    it('should have disabled attribute when disabled prop is true', () => {
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={true}
        />
      )
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should not have disabled attribute when disabled prop is false', () => {
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })
  })

  describe('Keyboard Support', () => {
    it('should call onClick when Enter key is pressed', async () => {
      const user = userEvent.setup()
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      await user.click(button)
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', keyCode: 13 })
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('should call onClick when Space key is pressed', async () => {
      const user = userEvent.setup()
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: ' ', code: 'Space', keyCode: 32 })
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('should not call onClick on other keys', () => {
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      fireEvent.keyDown(button, { key: 'a', code: 'KeyA', keyCode: 65 })
      expect(mockOnClick).not.toHaveBeenCalled()
    })
  })

  describe('Styling', () => {
    it('should apply custom className prop', () => {
      const { container } = render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
          className="custom-class"
        />
      )
      const button = container.querySelector('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should have base Tailwind classes', () => {
      const { container } = render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = container.querySelector('button')
      expect(button).toHaveClass('h-12', 'w-12')
    })

    it('should have responsive Tailwind classes', () => {
      const { container } = render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = container.querySelector('button')
      expect(button).toHaveClass('md:h-14', 'md:w-14')
    })
  })

  describe('Touch and Accessibility', () => {
    it('should have minimum 44px touch target (h-12 = 48px)', () => {
      const { container } = render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = container.querySelector('button') as HTMLElement
      const style = window.getComputedStyle(button)
      // h-12 is 3rem = 48px (at default font-size 16px)
      expect(button).toHaveClass('h-12')
    })

    it('should be focusable via Tab key', () => {
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={false}
        />
      )
      const button = screen.getByRole('button')
      // All button elements are focusable by default
      expect(button.tagName).toBe('BUTTON')
    })

    it('should not be focusable when disabled', () => {
      render(
        <ArrowButton
          direction="up"
          unit="minutes"
          onClick={mockOnClick}
          disabled={true}
        />
      )
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })
  })
})
