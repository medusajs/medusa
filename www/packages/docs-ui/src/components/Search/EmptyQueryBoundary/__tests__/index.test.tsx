import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock hooks
const mockUseInstantSearch = vi.fn()

vi.mock("react-instantsearch", () => ({
  useInstantSearch: () => mockUseInstantSearch(),
}))

import { SearchEmptyQueryBoundary } from "../../EmptyQueryBoundary"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders fallback when query is empty", () => {
    mockUseInstantSearch.mockReturnValue({
      indexUiState: { query: "" },
    })
    const { container } = render(
      <SearchEmptyQueryBoundary
        fallback={<div data-testid="fallback">Fallback</div>}
      >
        <div data-testid="children">Children</div>
      </SearchEmptyQueryBoundary>
    )
    const fallback = container.querySelector("[data-testid='fallback']")
    expect(fallback).toBeInTheDocument()
    const children = container.querySelector("[data-testid='children']")
    expect(children).not.toBeInTheDocument()
  })

  test("renders children when query is not empty", () => {
    mockUseInstantSearch.mockReturnValue({
      indexUiState: { query: "test" },
    })
    const { container } = render(
      <SearchEmptyQueryBoundary
        fallback={<div data-testid="fallback">Fallback</div>}
      >
        <div data-testid="children">Children</div>
      </SearchEmptyQueryBoundary>
    )
    const children = container.querySelector("[data-testid='children']")
    expect(children).toBeInTheDocument()
    const fallback = container.querySelector("[data-testid='fallback']")
    expect(fallback).not.toBeInTheDocument()
  })

  test("renders children when query is undefined", () => {
    mockUseInstantSearch.mockReturnValue({
      indexUiState: {},
    })
    const { container } = render(
      <SearchEmptyQueryBoundary
        fallback={<div data-testid="fallback">Fallback</div>}
      >
        <div data-testid="children">Children</div>
      </SearchEmptyQueryBoundary>
    )
    const fallback = container.querySelector("[data-testid='fallback']")
    expect(fallback).toBeInTheDocument()
  })
})
