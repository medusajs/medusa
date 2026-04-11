import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock functions
const mockPreventDefault = vi.fn()

// mock hooks
const mockSetIsOpen = vi.fn()
const mockUseKeyboardShortcut = vi.fn()

const defaultUseSearchReturn = {
  setIsOpen: mockSetIsOpen,
}

const mockUseSearch = vi.fn(() => defaultUseSearchReturn)

vi.mock("@/providers/Search", () => ({
  useSearch: () => mockUseSearch(),
}))

vi.mock("@/hooks/use-keyboard-shortcut", () => ({
  useKeyboardShortcut: (options: unknown) => mockUseKeyboardShortcut(options),
}))

// mock components
vi.mock("@/components/Button", () => ({
  Button: ({
    variant,
    onClick,
    className,
    children,
  }: {
    variant?: string
    onClick?: () => void
    className?: string
    children: React.ReactNode
  }) => (
    <button
      data-variant={variant}
      onClick={onClick}
      className={className}
      data-testid="search-opener-button"
    >
      {children}
    </button>
  ),
}))

vi.mock("@medusajs/icons", () => ({
  MagnifyingGlass: ({ className }: { className?: string }) => (
    <svg data-testid="magnifying-glass-icon" className={className} />
  ),
}))

import { SearchModalOpener } from "../../ModalOpener"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSearch.mockReturnValue(defaultUseSearchReturn)
  window.MouseEvent.prototype.preventDefault = mockPreventDefault
})

describe("rendering", () => {
  test("renders search modal opener button", () => {
    const { container } = render(<SearchModalOpener />)
    const button = container.querySelector(
      "[data-testid='search-opener-button']"
    )
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute("data-variant", "transparent")
  })

  test("renders magnifying glass icon", () => {
    const { container } = render(<SearchModalOpener />)
    const icon = container.querySelector(
      "[data-testid='magnifying-glass-icon']"
    )
    expect(icon).toBeInTheDocument()
  })
})

describe("interactions", () => {
  test("calls setIsOpen when button is clicked", () => {
    const { container } = render(<SearchModalOpener />)
    const button = container.querySelector(
      "[data-testid='search-opener-button']"
    )
    fireEvent.click(button!)
    expect(mockSetIsOpen).toHaveBeenCalledWith(true)
  })

  test("prevents default and blurs target when clicked", () => {
    const { container } = render(<SearchModalOpener />)
    const button = container.querySelector(
      "[data-testid='search-opener-button']"
    )
    fireEvent.click(button!)
    expect(mockPreventDefault).toHaveBeenCalled()
  })

  test("does not open when isLoading is true", () => {
    const { container } = render(<SearchModalOpener isLoading={true} />)
    const button = container.querySelector(
      "[data-testid='search-opener-button']"
    )
    fireEvent.click(button!)
    expect(mockSetIsOpen).not.toHaveBeenCalled()
  })
})

describe("keyboard shortcuts", () => {
  test("sets up keyboard shortcut for 'k' key", () => {
    render(<SearchModalOpener />)
    expect(mockUseKeyboardShortcut).toHaveBeenCalledWith({
      shortcutKeys: ["k"],
      action: expect.any(Function),
      isLoading: false,
    })
  })

  test("passes isLoading to keyboard shortcut", () => {
    render(<SearchModalOpener isLoading={true} />)
    expect(mockUseKeyboardShortcut).toHaveBeenCalledWith(
      expect.objectContaining({
        isLoading: true,
      })
    )
  })

  test("toggles search modal when keyboard shortcut is triggered", () => {
    render(<SearchModalOpener />)
    const lastCall =
      mockUseKeyboardShortcut.mock.calls[
        mockUseKeyboardShortcut.mock.calls.length - 1
      ]
    const action = lastCall[0].action
    action()
    expect(mockSetIsOpen).toHaveBeenCalledWith(expect.any(Function))
  })
})
