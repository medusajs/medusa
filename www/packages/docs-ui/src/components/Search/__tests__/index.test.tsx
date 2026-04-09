import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { SearchSuggestionType } from "../Suggestions"

// mock data
const defaultUseSearchReturn = {
  isOpen: true,
  searchClient: {},
  modalRef: React.createRef<HTMLDivElement>(),
}

const defaultAlgoliaProps = {
  appId: "test",
  apiKey: "test",
  mainIndexName: "docs",
}

// mock hooks
const mockUseSearch = vi.fn(() => defaultUseSearchReturn)
const mockUseSearchNavigation = vi.fn()

vi.mock("@/providers/Search", () => ({
  useSearch: () => mockUseSearch(),
}))

vi.mock("@/hooks/use-search-navigation", () => ({
  useSearchNavigation: (options: unknown) => mockUseSearchNavigation(options),
}))

// mock components
vi.mock("react-instantsearch", () => ({
  InstantSearch: ({
    children,
    indexName,
  }: {
    children: React.ReactNode
    indexName: string
  }) => (
    <div data-testid="instant-search" data-index-name={indexName}>
      {children}
    </div>
  ),
  SearchBox: ({
    placeholder,
    formRef,
  }: {
    placeholder?: string
    formRef?: React.RefObject<HTMLFormElement>
  }) => (
    <form ref={formRef} data-testid="search-box">
      <input placeholder={placeholder} data-testid="search-input" />
    </form>
  ),
}))

vi.mock("@/components/Search/EmptyQueryBoundary", () => ({
  SearchEmptyQueryBoundary: ({
    children,
    fallback,
  }: {
    children: React.ReactNode
    fallback: React.ReactNode
  }) => (
    <div data-testid="empty-query-boundary">
      {children}
      {fallback}
    </div>
  ),
}))

vi.mock("@/components/Search/Suggestions", () => ({
  SearchSuggestions: ({
    suggestions,
  }: {
    suggestions: SearchSuggestionType[]
  }) => (
    <div data-testid="search-suggestions">
      {suggestions.map((s, i) => (
        <div key={i}>{s.title}</div>
      ))}
    </div>
  ),
}))

vi.mock("@/components/Search/Hits", () => ({
  SearchHitsWrapper: ({
    checkInternalPattern,
  }: {
    checkInternalPattern?: RegExp
  }) => (
    <div
      data-testid="search-hits-wrapper"
      data-pattern={checkInternalPattern?.toString()}
    >
      Hits
    </div>
  ),
}))

vi.mock("@/components/Search/Filters", () => ({
  SearchFilters: () => <div data-testid="search-filters">Filters</div>,
}))

vi.mock("@/components/Search/Footer", () => ({
  SearchFooter: () => <div data-testid="search-footer">Footer</div>,
}))

vi.mock("@/components/Loading/Spinner", () => ({
  SpinnerLoading: () => <div data-testid="spinner-loading">Loading</div>,
}))
vi.mock("@/components/Search/Callout", () => ({
  SearchCallout: () => <div data-testid="search-callout">Callout</div>,
}))

import { Search } from "../../Search"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSearch.mockReturnValue(defaultUseSearchReturn)
})

describe("rendering", () => {
  test("renders search component", () => {
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <Search algolia={defaultAlgoliaProps} suggestions={suggestions} />
    )
    const instantSearch = container.querySelector(
      "[data-testid='instant-search']"
    )
    expect(instantSearch).toBeInTheDocument()
  })

  test("renders InstantSearch with correct index name", () => {
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <Search algolia={defaultAlgoliaProps} suggestions={suggestions} />
    )
    const instantSearch = container.querySelector(
      "[data-testid='instant-search']"
    )
    expect(instantSearch).toHaveAttribute("data-index-name", "docs")
  })

  test("renders SearchBox", () => {
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <Search algolia={defaultAlgoliaProps} suggestions={suggestions} />
    )
    const searchBox = container.querySelector("[data-testid='search-box']")
    expect(searchBox).toBeInTheDocument()
  })

  test("renders search input with placeholder", () => {
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <Search algolia={defaultAlgoliaProps} suggestions={suggestions} />
    )
    const input = container.querySelector("[data-testid='search-input']")
    expect(input).toHaveAttribute("placeholder", "Find something...")
  })

  test("renders SearchFilters", () => {
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <Search algolia={defaultAlgoliaProps} suggestions={suggestions} />
    )
    const filters = container.querySelector("[data-testid='search-filters']")
    expect(filters).toBeInTheDocument()
  })

  test("renders SearchEmptyQueryBoundary", () => {
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <Search algolia={defaultAlgoliaProps} suggestions={suggestions} />
    )
    const boundary = container.querySelector(
      "[data-testid='empty-query-boundary']"
    )
    expect(boundary).toBeInTheDocument()
  })

  test("renders SearchSuggestions as fallback", () => {
    const suggestions: SearchSuggestionType[] = [
      { title: "Getting Started", items: ["Item 1"] },
    ]
    const { container } = render(
      <Search algolia={defaultAlgoliaProps} suggestions={suggestions} />
    )
    const suggestionsEl = container.querySelector(
      "[data-testid='search-suggestions']"
    )
    expect(suggestionsEl).toBeInTheDocument()
  })

  test("renders SearchHitsWrapper", () => {
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <Search algolia={defaultAlgoliaProps} suggestions={suggestions} />
    )
    const hits = container.querySelector("[data-testid='search-hits-wrapper']")
    expect(hits).toBeInTheDocument()
  })

  test("renders SearchFooter", () => {
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <Search algolia={defaultAlgoliaProps} suggestions={suggestions} />
    )
    const footer = container.querySelector("[data-testid='search-footer']")
    expect(footer).toBeInTheDocument()
  })

  test("renders SearchCallout", () => {
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <Search algolia={defaultAlgoliaProps} suggestions={suggestions} />
    )
    const callout = container.querySelector("[data-testid='search-callout']")
    expect(callout).toBeInTheDocument()
  })

  test("passes checkInternalPattern to SearchHitsWrapper", () => {
    const suggestions: SearchSuggestionType[] = []
    const pattern = /\/docs\//
    const { container } = render(
      <Search
        algolia={defaultAlgoliaProps}
        suggestions={suggestions}
        checkInternalPattern={pattern}
      />
    )
    const hits = container.querySelector("[data-testid='search-hits-wrapper']")
    expect(hits).toHaveAttribute("data-pattern", pattern.toString())
  })
})

describe("focus management", () => {
  test("sets up search navigation hook", () => {
    const suggestions: SearchSuggestionType[] = []
    render(<Search algolia={defaultAlgoliaProps} suggestions={suggestions} />)
    expect(mockUseSearchNavigation).toHaveBeenCalledWith({
      getInputElm: expect.any(Function),
      focusInput: expect.any(Function),
      keyboardProps: {
        isLoading: false,
      },
    })
  })

  test("passes isLoading to keyboard props", () => {
    const suggestions: SearchSuggestionType[] = []
    render(
      <Search
        algolia={defaultAlgoliaProps}
        suggestions={suggestions}
        isLoading={true}
      />
    )
    expect(mockUseSearchNavigation).toHaveBeenCalledWith(
      expect.objectContaining({
        keyboardProps: {
          isLoading: true,
        },
      })
    )
  })
})
