import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { SearchSuggestionType } from "../index"
import { SearchCommand } from "@/providers/Search"

// mock hooks
const mockSetIndexUiState = vi.fn()
const mockSetCommand = vi.fn()

const defaultUseInstantSearchReturn = {
  setIndexUiState: mockSetIndexUiState,
}

const defaultUseSearchReturn = {
  commands: [] as SearchCommand[],
  setCommand: mockSetCommand,
}

const mockUseInstantSearch = vi.fn(() => defaultUseInstantSearchReturn)
const mockUseSearch = vi.fn(() => defaultUseSearchReturn)

vi.mock("react-instantsearch", () => ({
  useInstantSearch: () => mockUseInstantSearch(),
}))

vi.mock("@/providers/Search", () => ({
  useSearch: () => mockUseSearch(),
}))

// mock components
vi.mock("@/components/Search/Suggestions/Item", () => ({
  SearchSuggestionItem: ({
    onClick,
    children,
    ...props
  }: {
    onClick: () => void
    children: React.ReactNode
    [key: string]: any
  }) => (
    <div data-testid="suggestion-item" onClick={onClick} {...props}>
      {children}
    </div>
  ),
}))

vi.mock("@/components/Search/Hits/GroupName", () => ({
  SearchHitGroupName: ({ name }: { name: string }) => (
    <div data-testid="group-name">{name}</div>
  ),
}))

vi.mock("@/components/Badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="badge">{children}</div>
  ),
}))

import { SearchSuggestions } from "../../Suggestions"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseInstantSearch.mockReturnValue(defaultUseInstantSearchReturn)
  mockUseSearch.mockReturnValue(defaultUseSearchReturn)
})

describe("rendering", () => {
  test("renders suggestion groups", () => {
    const suggestions: SearchSuggestionType[] = [
      { title: "Getting Started", items: ["Item 1"] },
      { title: "Advanced", items: ["Item 2"] },
    ]
    const { container } = render(
      <SearchSuggestions suggestions={suggestions} />
    )
    const groupNames = container.querySelectorAll("[data-testid='group-name']")
    expect(groupNames).toHaveLength(2)
    expect(groupNames[0]).toHaveTextContent("Getting Started")
    expect(groupNames[1]).toHaveTextContent("Advanced")
  })

  test("renders suggestion items", () => {
    const suggestions: SearchSuggestionType[] = [
      { title: "Getting Started", items: ["Item 1", "Item 2"] },
    ]
    const { container } = render(
      <SearchSuggestions suggestions={suggestions} />
    )
    const items = container.querySelectorAll("[data-testid='suggestion-item']")
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent("Item 1")
    expect(items[1]).toHaveTextContent("Item 2")
  })

  test("renders commands section when commands exist", () => {
    mockUseSearch.mockReturnValue({
      commands: [
        {
          title: "Command 1",
          icon: <span data-testid="command-icon">Icon</span>,
          badge: { children: "New", variant: "blue" },
          name: "Command 1",
        },
      ],
      setCommand: mockSetCommand,
    })
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <SearchSuggestions suggestions={suggestions} />
    )
    const groupNames = container.querySelectorAll("[data-testid='group-name']")
    expect(groupNames).toHaveLength(1)
    expect(groupNames[0]).toHaveTextContent("Commands")
    const icon = container.querySelector("[data-testid='command-icon']")
    expect(icon).toBeInTheDocument()
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
  })

  test("does not render commands section when commands are empty", () => {
    const suggestions: SearchSuggestionType[] = [
      { title: "Getting Started", items: ["Item 1"] },
    ]
    const { container } = render(
      <SearchSuggestions suggestions={suggestions} />
    )
    const groupNames = container.querySelectorAll("[data-testid='group-name']")
    expect(groupNames).toHaveLength(1)
    expect(groupNames[0]).not.toHaveTextContent("Commands")
  })
})

describe("interactions", () => {
  test("calls setIndexUiState when suggestion item is clicked", () => {
    const suggestions: SearchSuggestionType[] = [
      { title: "Getting Started", items: ["Item 1"] },
    ]
    const { container } = render(
      <SearchSuggestions suggestions={suggestions} />
    )
    const items = container.querySelectorAll("[data-testid='suggestion-item']")
    fireEvent.click(items[0]!)
    expect(mockSetIndexUiState).toHaveBeenCalledWith({ query: "Item 1" })
  })

  test("calls setCommand when command item is clicked", () => {
    mockUseSearch.mockReturnValue({
      commands: [
        {
          title: "Command 1",
          icon: <span data-testid="command-icon">Icon</span>,
          name: "Command 1",
        },
      ],
      setCommand: mockSetCommand,
    })
    const suggestions: SearchSuggestionType[] = []
    const { container } = render(
      <SearchSuggestions suggestions={suggestions} />
    )
    const items = container.querySelectorAll("[data-testid='suggestion-item']")
    fireEvent.click(items[0]!)
    expect(mockSetCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Command 1",
      })
    )
  })

  test("sets correct tabIndex for suggestion items", () => {
    mockUseSearch.mockReturnValue({
      commands: [
        {
          title: "Command 1",
          icon: <span>Icon</span>,
          name: "Command 1",
        },
      ],
      setCommand: mockSetCommand,
    })
    const suggestions: SearchSuggestionType[] = [
      { title: "Getting Started", items: ["Item 1", "Item 2"] },
    ]
    const { container } = render(
      <SearchSuggestions suggestions={suggestions} />
    )
    const items = container.querySelectorAll("[data-testid='suggestion-item']")
    // Command has tabIndex 0, first suggestion has tabIndex 1
    expect(items[1]).toHaveAttribute("tabIndex", "1")
  })
})
