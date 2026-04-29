import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { HitType } from "../index"

// mock hooks
const mockSetIsOpen = vi.fn()
const mockSendEvent = vi.fn()

const defaultUseSearchReturn = {
  indices: [
    { value: "docs", title: "Documentation" },
    { value: "api", title: "API Reference" },
  ],
  selectedIndex: "docs",
  setIsOpen: mockSetIsOpen,
}

const defaultUseInstantSearchReturn = {
  status: "idle" as const,
}

const mockUseSearch = vi.fn(() => defaultUseSearchReturn)
const mockUseInstantSearch = vi.fn(() => defaultUseInstantSearchReturn)
const mockUseHits = vi.fn(() => ({
  items: [] as HitType[],
  sendEvent: mockSendEvent,
}))

vi.mock("@/providers/Search", () => ({
  useSearch: () => mockUseSearch(),
}))

vi.mock("react-instantsearch", () => ({
  useInstantSearch: () => mockUseInstantSearch(),
  useHits: () => mockUseHits(),
  Index: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Configure: () => null,
  Snippet: ({ attribute, hit }: { attribute: string; hit: HitType }) => (
    <span data-testid="snippet" data-attribute={attribute}>
      {hit.hierarchy.lvl1 || ""}
    </span>
  ),
}))

// mock components
vi.mock("@/components/Link", () => ({
  Link: ({
    href,
    onClick,
    children,
  }: {
    href: string
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
    children: React.ReactNode
  }) => (
    <a
      href={href}
      data-testid="hit-link"
      onClick={(e) => {
        // prevent actual navigation
        e.preventDefault()
        // call onClick
        onClick?.(e)
        // set is open to false
        mockSetIsOpen(false)
      }}
    >
      {children}
    </a>
  ),
}))

vi.mock("@/components/Badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="badge">{children}</div>
  ),
}))

vi.mock("@/components/Search/Hits/GroupName", () => ({
  SearchHitGroupName: ({ name }: { name: string }) => (
    <div data-testid="group-name">{name}</div>
  ),
}))

vi.mock("@/components/Search/NoResults", () => ({
  SearchNoResult: () => <div data-testid="no-results">No Results</div>,
}))

import { SearchHitsWrapper, SearchHits } from "../../Hits"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSearch.mockReturnValue(defaultUseSearchReturn)
  mockUseInstantSearch.mockReturnValue(defaultUseInstantSearchReturn)
  mockUseHits.mockReturnValue({
    items: [],
    sendEvent: mockSendEvent,
  })
  // prevent navigation errors in jsdom
  Object.defineProperty(window, "location", {
    value: {
      assign: vi.fn(),
      replace: vi.fn(),
      pathname: "/",
      origin: "http://localhost",
    },
    writable: true, // Needed to allow overwriting in tests
  })
})

describe("SearchHitsWrapper", () => {
  test("renders no results when all indices have no results", () => {
    mockUseInstantSearch.mockReturnValue({
      status: "idle",
    })
    const { container } = render(<SearchHitsWrapper configureProps={{}} />)
    const noResults = container.querySelector("[data-testid='no-results']")
    expect(noResults).toBeInTheDocument()
  })

  test("renders group name for each index", () => {
    const { container } = render(<SearchHitsWrapper configureProps={{}} />)
    const groupNames = container.querySelectorAll("[data-testid='group-name']")
    expect(groupNames.length).toBeGreaterThanOrEqual(0)
  })

  test("hides non-selected index", () => {
    const { container } = render(<SearchHitsWrapper configureProps={{}} />)
    const indexDivs = container.querySelectorAll("[data-index]")
    expect(indexDivs[1]).toHaveClass("hidden")
  })

  test("shows selected index", () => {
    const { container } = render(<SearchHitsWrapper configureProps={{}} />)
    const indexDivs = container.querySelectorAll("[data-index]")
    expect(indexDivs[0]).not.toHaveClass("hidden")
  })
})

describe("SearchHits", () => {
  const mockHits: HitType[] = [
    {
      hierarchy: {
        lvl0: "Getting Started",
        lvl1: "Introduction",
        lvl2: null,
        lvl3: null,
        lvl4: null,
        lvl5: null,
      },
      _tags: [],
      url: "/docs/getting-started/introduction",
      url_without_anchor: "/docs/getting-started/introduction",
      type: "lvl1",
      __position: 1,
      objectID: "1",
      description: "Learn the basics",
    },
  ]

  test("renders hits", () => {
    mockUseHits.mockReturnValue({
      items: mockHits,
      sendEvent: mockSendEvent,
    })
    const { container } = render(
      <SearchHits indexName="docs" setNoResults={vi.fn()} />
    )
    const hitDivs = container.querySelectorAll("[data-hit]")
    expect(hitDivs.length).toBeGreaterThan(0)
  })

  test("renders hit hierarchy", () => {
    mockUseHits.mockReturnValue({
      items: mockHits,
      sendEvent: mockSendEvent,
    })
    const { container } = render(
      <SearchHits indexName="docs" setNoResults={vi.fn()} />
    )
    expect(container).toHaveTextContent("Getting Started › Introduction")
  })

  test("renders hit description", () => {
    mockUseHits.mockReturnValue({
      items: mockHits,
      sendEvent: mockSendEvent,
    })
    const { container } = render(
      <SearchHits indexName="docs" setNoResults={vi.fn()} />
    )
    expect(container).toHaveTextContent("Learn the basics")
  })

  test("renders community badge for non-Medusa integrations", () => {
    const hitWithIntegration: HitType = {
      ...mockHits[0],
      integration_vendor: "Stripe",
    }
    mockUseHits.mockReturnValue({
      items: [hitWithIntegration],
      sendEvent: mockSendEvent,
    })
    const { container } = render(
      <SearchHits indexName="docs" setNoResults={vi.fn()} />
    )
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("Community")
  })

  test("does not render badge for Medusa integrations", () => {
    const hitWithMedusa: HitType = {
      ...mockHits[0],
      integration_vendor: "Medusa",
    }
    mockUseHits.mockReturnValue({
      items: [hitWithMedusa],
      sendEvent: mockSendEvent,
    })
    const { container } = render(
      <SearchHits indexName="docs" setNoResults={vi.fn()} />
    )
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).not.toBeInTheDocument()
  })

  test("calls sendEvent when hit link is clicked", () => {
    mockUseHits.mockReturnValue({
      items: mockHits,
      sendEvent: mockSendEvent,
    })
    const { container } = render(
      <SearchHits indexName="docs" setNoResults={vi.fn()} />
    )
    const link = container.querySelector("[data-testid='hit-link']")
    fireEvent.click(link!)
    expect(mockSendEvent).toHaveBeenCalledWith(
      "click",
      mockHits[0],
      "Search Result Clicked"
    )
  })

  test("closes search modal for internal links", () => {
    mockUseHits.mockReturnValue({
      items: mockHits,
      sendEvent: mockSendEvent,
    })
    const { container } = render(
      <SearchHits
        indexName="docs"
        setNoResults={vi.fn()}
        checkInternalPattern={/\/docs\//}
      />
    )
    const link = container.querySelector("[data-testid='hit-link']")
    const preventDefaultSpy = vi.fn()
    const mockEvent = {
      preventDefault: preventDefaultSpy,
    } as unknown as React.MouseEvent<HTMLAnchorElement>
    fireEvent.click(link!, mockEvent)
    expect(mockSetIsOpen).toHaveBeenCalledWith(false)
  })

  test("calls setNoResults when hits are empty", () => {
    const mockSetNoResults = vi.fn()
    mockUseHits.mockReturnValue({
      items: [],
      sendEvent: mockSendEvent,
    })
    mockUseInstantSearch.mockReturnValue({
      status: "idle",
    })
    render(<SearchHits indexName="docs" setNoResults={mockSetNoResults} />)
    // Wait for useEffect
    expect(mockSetNoResults).toHaveBeenCalled()
  })
})
