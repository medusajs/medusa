import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

import { SearchSuggestionItem } from "../../Item"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders suggestion item", () => {
    const mockOnClick = vi.fn()
    const { container } = render(
      <SearchSuggestionItem onClick={mockOnClick}>
        Test Item
      </SearchSuggestionItem>
    )
    const item = container.querySelector("div")
    expect(item).toBeInTheDocument()
    expect(item).toHaveTextContent("Test Item")
  })

  test("renders children", () => {
    const mockOnClick = vi.fn()
    const { container } = render(
      <SearchSuggestionItem onClick={mockOnClick}>
        <span data-testid="child">Child Content</span>
      </SearchSuggestionItem>
    )
    const child = container.querySelector("[data-testid='child']")
    expect(child).toBeInTheDocument()
  })

  test("applies custom className", () => {
    const mockOnClick = vi.fn()
    const { container } = render(
      <SearchSuggestionItem onClick={mockOnClick} className="custom-class">
        Test
      </SearchSuggestionItem>
    )
    const item = container.querySelector("div")
    expect(item).toHaveClass("custom-class")
  })

  test("has data-hit attribute", () => {
    const mockOnClick = vi.fn()
    const { container } = render(
      <SearchSuggestionItem onClick={mockOnClick}>Test</SearchSuggestionItem>
    )
    const item = container.querySelector("div")
    expect(item).toHaveAttribute("data-hit")
  })

  test("passes through other props", () => {
    const mockOnClick = vi.fn()
    const { container } = render(
      <SearchSuggestionItem onClick={mockOnClick} tabIndex={5}>
        Test
      </SearchSuggestionItem>
    )
    const item = container.querySelector("div")
    expect(item).toHaveAttribute("tabIndex", "5")
  })
})

describe("interactions", () => {
  test("calls onClick when clicked", () => {
    const mockOnClick = vi.fn()
    const { container } = render(
      <SearchSuggestionItem onClick={mockOnClick}>Test</SearchSuggestionItem>
    )
    const item = container.querySelector("div")
    fireEvent.click(item!)
    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })
})
