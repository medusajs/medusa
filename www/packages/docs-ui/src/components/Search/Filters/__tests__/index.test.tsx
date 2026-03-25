import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import type { AlgoliaIndex } from "../../../../providers/Search"

// mock hooks
const mockSetSelectedIndex = vi.fn()

const defaultUseSearchReturn = {
  indices: [
    { value: "docs", title: "Documentation" },
    { value: "api", title: "API Reference" },
  ] as AlgoliaIndex[],
  selectedIndex: "docs",
  setSelectedIndex: mockSetSelectedIndex,
}

const mockUseSearch = vi.fn(() => defaultUseSearchReturn)

vi.mock("@/providers/Search", () => ({
  useSearch: () => mockUseSearch(),
}))

import { SearchFilters } from "../../Filters"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSearch.mockReturnValue(defaultUseSearchReturn)
})

describe("rendering", () => {
  test("does not render when only one index", () => {
    mockUseSearch.mockReturnValue({
      ...defaultUseSearchReturn,
      indices: [{ value: "docs", title: "Documentation" }],
    })
    const { container } = render(<SearchFilters />)
    expect(container.firstChild).toBeNull()
  })

  test("does not render when no indices", () => {
    mockUseSearch.mockReturnValue({
      ...defaultUseSearchReturn,
      indices: [],
    })
    const { container } = render(<SearchFilters />)
    expect(container.firstChild).toBeNull()
  })

  test("renders filter buttons for each index", () => {
    const { container } = render(<SearchFilters />)
    const buttons = container.querySelectorAll("button")
    expect(buttons).toHaveLength(2)
    expect(buttons[0]).toHaveTextContent("Documentation")
    expect(buttons[1]).toHaveTextContent("API Reference")
  })

  test("applies active styles to selected index", () => {
    const { container } = render(<SearchFilters />)
    const buttons = container.querySelectorAll("button")
    expect(buttons[0]).toHaveClass(
      "rounded-docs_sm text-medusa-fg-base bg-medusa-bg-base"
    )
    expect(buttons[0]).toHaveClass(
      "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark"
    )
  })

  test("applies inactive styles to non-selected indices", () => {
    const { container } = render(<SearchFilters />)
    const buttons = container.querySelectorAll("button")
    expect(buttons[1]).toHaveClass("text-medusa-fg-muted")
    expect(buttons[1]).not.toHaveClass("bg-medusa-bg-base")
  })
})

describe("interactions", () => {
  test("calls setSelectedIndex when filter button is clicked", () => {
    const { container } = render(<SearchFilters />)
    const buttons = container.querySelectorAll("button")
    fireEvent.click(buttons[1]!)
    expect(mockSetSelectedIndex).toHaveBeenCalledWith("api")
  })

  test("updates active state when selectedIndex changes", () => {
    mockUseSearch.mockReturnValue({
      ...defaultUseSearchReturn,
      selectedIndex: "api",
    })
    const { container } = render(<SearchFilters />)
    const buttons = container.querySelectorAll("button")
    expect(buttons[1]).toHaveClass("bg-medusa-bg-base")
    expect(buttons[0]).toHaveClass("text-medusa-fg-muted")
  })
})
