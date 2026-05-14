import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock hooks
const mockUseKeyboardShortcut = vi.fn()

vi.mock("@/hooks/use-keyboard-shortcut", () => ({
  useKeyboardShortcut: (options: unknown) => mockUseKeyboardShortcut(options),
}))

// mock components
vi.mock("@/components/Kbd", () => ({
  Kbd: ({
    children,
    variant,
  }: {
    children: React.ReactNode
    variant?: string
  }) => (
    <kbd data-testid="kbd" data-variant={variant}>
      {children}
    </kbd>
  ),
}))

import { SearchInput } from "../../Search"

beforeEach(() => {
  mockUseKeyboardShortcut.mockClear()
})

describe("rendering", () => {
  test("renders search input", () => {
    const { container } = render(<SearchInput value="" onChange={vi.fn()} />)
    const input = container.querySelector("input[type='text']")
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute("placeholder", "Search...")
    const kbd = container.querySelector("[data-testid='kbd']")
    expect(kbd).toBeInTheDocument()
    expect(kbd).toHaveTextContent("esc")
    expect(kbd).toHaveAttribute("data-variant", "small")
    const hintText = container.querySelector("span.text-medusa-fg-muted")
    expect(hintText).toHaveTextContent("Clear Search")
  })

  test("renders with custom placeholder", () => {
    const { container } = render(
      <SearchInput
        value=""
        onChange={vi.fn()}
        placeholder="Custom placeholder"
      />
    )
    const input = container.querySelector("input")
    expect(input).toHaveAttribute("placeholder", "Custom placeholder")
  })

  test("renders clear button when value is present", () => {
    const { container } = render(
      <SearchInput value="test" onChange={vi.fn()} />
    )
    const clearButton = container.querySelector("[data-testid='clear-button']")
    expect(clearButton).toBeInTheDocument()
  })

  test("does not render clear button when value is empty", () => {
    const { container } = render(<SearchInput value="" onChange={vi.fn()} />)
    const clearButton = container.querySelector("[data-testid='clear-button']")
    expect(clearButton).not.toBeInTheDocument()
  })

  test("applies custom className", () => {
    const { container } = render(
      <SearchInput value="" onChange={vi.fn()} className="custom-class" />
    )
    const input = container.querySelector("input")
    expect(input).toHaveClass("custom-class")
  })

  test("passes through other input props", () => {
    const { container } = render(
      <SearchInput
        value=""
        onChange={vi.fn()}
        disabled
        data-testid="search-input"
      />
    )
    const input = container.querySelector("input")
    expect(input).toBeDisabled()
    expect(input).toHaveAttribute("data-testid", "search-input")
  })
})

describe("interaction", () => {
  test("calls onChange with empty string when clear button is clicked", () => {
    const mockOnChange = vi.fn()
    const { container } = render(
      <SearchInput value="test" onChange={mockOnChange} />
    )
    const clearButton = container.querySelector("button")
    fireEvent.click(clearButton!)
    expect(mockOnChange).toHaveBeenCalledWith("")
  })
})

describe("keyboard shortcut", () => {
  test("sets up escape key shortcut", () => {
    const mockOnChange = vi.fn()
    render(<SearchInput value="test" onChange={mockOnChange} />)

    expect(mockUseKeyboardShortcut).toHaveBeenCalledWith({
      metakey: false,
      shortcutKeys: ["escape"],
      action: expect.any(Function),
      checkEditing: false,
      preventDefault: true,
    })
  })

  test("escape key shortcut clears the input", () => {
    const mockOnChange = vi.fn()
    render(<SearchInput value="test" onChange={mockOnChange} />)

    // Get the action function from the last call
    const lastCall =
      mockUseKeyboardShortcut.mock.calls[
        mockUseKeyboardShortcut.mock.calls.length - 1
      ]
    const action = lastCall[0].action

    // Call the action to simulate escape key press
    action()

    expect(mockOnChange).toHaveBeenCalledWith("")
  })
})
