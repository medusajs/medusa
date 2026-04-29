import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import { SearchProvider, useSearch } from "../index"
import type { SearchCommand, AlgoliaIndex } from "../index"

// mock components
vi.mock("@/components/Modal", () => ({
  Modal: ({
    children,
    open,
    onClose,
    ...props
  }: {
    children?: React.ReactNode
    open?: boolean
    onClose?: () => void
    [key: string]: unknown
  }) => (
    <div
      data-testid="search-modal"
      data-open={open}
      onClick={onClose}
      {...props}
    >
      {children}
    </div>
  ),
}))

vi.mock("@/components/Search", () => ({
  Search: ({ algolia }: { algolia: unknown }) => (
    <div data-testid="search-component" data-algolia={JSON.stringify(algolia)}>
      Search
    </div>
  ),
}))

vi.mock("react-transition-group", () => ({
  CSSTransition: ({
    children,
  }: {
    children: React.ReactNode
    classNames?: Record<string, string>
    timeout?: number
  }) => <div data-testid="css-transition">{children}</div>,
  SwitchTransition: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="switch-transition">{children}</div>
  ),
}))

vi.mock("algoliasearch/lite", () => ({
  liteClient: vi.fn(() => ({
    search: vi.fn(),
  })),
}))

const TestComponent = () => {
  const {
    isOpen,
    setIsOpen,
    commands,
    command,
    setCommand,
    setCommands,
    selectedIndex,
    setSelectedIndex,
  } = useSearch()

  return (
    <div>
      <div data-testid="is-open">{isOpen ? "open" : "closed"}</div>
      <div data-testid="commands-count">{commands.length}</div>
      <div data-testid="command">{command?.name || "none"}</div>
      <div data-testid="selected-index">{selectedIndex}</div>
      <button data-testid="open" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <button data-testid="close" onClick={() => setIsOpen(false)}>
        Close
      </button>
      <button
        data-testid="set-command"
        onClick={() => {
          setCommand({
            name: "test-command",
            title: "Test Command",
            component: (
              <div data-testid="command-component">Command Component</div>
            ),
          })
        }}
      >
        Set Command
      </button>
      <button
        data-testid="add-command"
        onClick={() =>
          setCommands([
            {
              name: "new-command",
              title: "New Command",
            },
          ])
        }
      >
        Add Command
      </button>
      <button
        data-testid="change-index"
        onClick={() => setSelectedIndex("index2")}
      >
        Change Index
      </button>
    </div>
  )
}

const defaultIndices: AlgoliaIndex[] = [
  { value: "index1", title: "Index 1" },
  { value: "index2", title: "Index 2" },
]

const defaultAlgolia = {
  appId: "test-app-id",
  apiKey: "test-api-key",
  mainIndexName: "index1",
}

const defaultSearchProps = {
  indices: defaultIndices,
  suggestions: [],
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe("rendering", () => {
  test("renders children", () => {
    const { container } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <div>Test</div>
      </SearchProvider>
    )
    expect(container).toHaveTextContent("Test")
  })

  test("renders search modal when open", () => {
    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    fireEvent.click(getByTestId("open"))

    expect(getByTestId("search-modal")).toBeInTheDocument()
    expect(getByTestId("search-modal")).toHaveAttribute("data-open", "true")
  })

  test("renders search component when no command is set", () => {
    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    fireEvent.click(getByTestId("open"))

    expect(getByTestId("search-component")).toBeInTheDocument()
  })

  test("renders command component when command is set", () => {
    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    fireEvent.click(getByTestId("open"))
    fireEvent.click(getByTestId("set-command"))

    expect(getByTestId("command-component")).toBeInTheDocument()
  })
})

describe("useSearch hook", () => {
  test("isOpen defaults to false", () => {
    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    expect(getByTestId("is-open")).toHaveTextContent("closed")
  })

  test("setIsOpen updates isOpen", () => {
    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    fireEvent.click(getByTestId("open"))

    expect(getByTestId("is-open")).toHaveTextContent("open")

    fireEvent.click(getByTestId("close"))

    expect(getByTestId("is-open")).toHaveTextContent("closed")
  })

  test("initializes with default commands", () => {
    const commands: SearchCommand[] = [
      {
        name: "command1",
        title: "Command 1",
      },
    ]

    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
        commands={commands}
      >
        <TestComponent />
      </SearchProvider>
    )

    expect(getByTestId("commands-count")).toHaveTextContent("1")
  })

  test("setCommands updates commands", () => {
    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    expect(getByTestId("commands-count")).toHaveTextContent("0")

    fireEvent.click(getByTestId("add-command"))

    expect(getByTestId("commands-count")).toHaveTextContent("1")
  })

  test("setCommand updates command", () => {
    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    expect(getByTestId("command")).toHaveTextContent("none")

    fireEvent.click(getByTestId("set-command"))

    expect(getByTestId("command")).toHaveTextContent("test-command")
  })

  test("calls command action when command is set", () => {
    const action = vi.fn()
    const TestComponentWithAction = () => {
      const { setCommand } = useSearch()
      return (
        <button
          data-testid="set-command-action"
          onClick={() =>
            setCommand({
              name: "test-command",
              title: "Test Command",
              action,
            })
          }
        >
          Set Command
        </button>
      )
    }

    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponentWithAction />
      </SearchProvider>
    )

    fireEvent.click(getByTestId("set-command-action"))

    expect(action).toHaveBeenCalled()
  })

  test("selectedIndex defaults to defaultIndex", () => {
    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    expect(getByTestId("selected-index")).toHaveTextContent("index1")
  })

  test("setSelectedIndex updates selectedIndex", () => {
    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    fireEvent.click(getByTestId("change-index"))

    expect(getByTestId("selected-index")).toHaveTextContent("index2")
  })

  test("updates selectedIndex when defaultIndex changes", async () => {
    const { getByTestId, rerender } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    expect(getByTestId("selected-index")).toHaveTextContent("index1")

    rerender(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index2"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponent />
      </SearchProvider>
    )

    await waitFor(() => {
      expect(getByTestId("selected-index")).toHaveTextContent("index2")
    })
  })

  test("provides searchClient", () => {
    const TestComponentWithClient = () => {
      const { searchClient } = useSearch()
      return <div data-testid="client">{searchClient ? "yes" : "no"}</div>
    }

    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponentWithClient />
      </SearchProvider>
    )

    expect(getByTestId("client")).toHaveTextContent("yes")
  })

  test("provides modalRef", () => {
    const TestComponentWithRef = () => {
      const { modalRef } = useSearch()
      return <div data-testid="ref">{modalRef.current ? "yes" : "no"}</div>
    }

    const { getByTestId } = render(
      <SearchProvider
        indices={defaultIndices}
        defaultIndex="index1"
        algolia={defaultAlgolia}
        searchProps={defaultSearchProps}
      >
        <TestComponentWithRef />
      </SearchProvider>
    )

    expect(getByTestId("ref")).toBeInTheDocument()
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useSearch must be used inside a SearchProvider")

    consoleSpy.mockRestore()
  })
})
