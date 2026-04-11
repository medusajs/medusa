import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import type { Sidebar } from "types"

// Mock dependencies
const mockShownSidebar = vi.fn()
const mockActivePath = vi.fn(() => "/test-path")
const mockUseSidebar = vi.fn(() => ({
  shownSidebar: mockShownSidebar(),
  activePath: mockActivePath(),
}))

let previousActivePath: string | undefined = undefined
const mockUsePrevious = vi.fn((value: unknown) => {
  const current = previousActivePath
  previousActivePath = value as string
  return current
})

vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}))

vi.mock("@uidotdev/usehooks", () => ({
  usePrevious: (value: unknown) => mockUsePrevious(value),
}))

import { PaginationProvider, usePagination } from "../index"

const TestComponent = () => {
  const { nextPage, previousPage } = usePagination()
  return (
    <div>
      <div data-testid="next-page-title">{nextPage?.title || "no-next"}</div>
      <div data-testid="next-page-link">{nextPage?.link || "no-next-link"}</div>
      <div data-testid="next-page-parent">
        {nextPage?.parentTitle || "no-next-parent"}
      </div>
      <div data-testid="prev-page-title">
        {previousPage?.title || "no-prev"}
      </div>
      <div data-testid="prev-page-link">
        {previousPage?.link || "no-prev-link"}
      </div>
      <div data-testid="prev-page-parent">
        {previousPage?.parentTitle || "no-prev-parent"}
      </div>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  previousActivePath = undefined
  mockActivePath.mockReturnValue("/test-path")
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("rendering", () => {
  test("renders children", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)

    const { container } = render(
      <PaginationProvider>
        <div>Test</div>
      </PaginationProvider>
    )
    expect(container).toHaveTextContent("Test")
  })
})

describe("usePagination hook", () => {
  test("throws error when used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("usePagination must be used inside a PaginationProvider")

    consoleSpy.mockRestore()
  })

  test("returns undefined for next and previous when no sidebar", () => {
    mockShownSidebar.mockReturnValue(null)

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("no-next")
    expect(getByTestId("prev-page-title")).toHaveTextContent("no-prev")
  })

  test("returns undefined for next and previous when sidebar has no items", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("no-next")
    expect(getByTestId("prev-page-title")).toHaveTextContent("no-prev")
  })

  test("finds next page in flat sidebar", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "link",
          path: "/page-1",
          title: "Page 1",
        },
        {
          type: "link",
          path: "/test-path",
          title: "Current Page",
        },
        {
          type: "link",
          path: "/page-3",
          title: "Page 3",
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("Page 3")
    expect(getByTestId("next-page-link")).toHaveTextContent("/page-3")
    expect(getByTestId("prev-page-title")).toHaveTextContent("Page 1")
    expect(getByTestId("prev-page-link")).toHaveTextContent("/page-1")
  })

  test("returns undefined for next page when on last item", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "link",
          path: "/page-1",
          title: "Page 1",
        },
        {
          type: "link",
          path: "/test-path",
          title: "Current Page",
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("no-next")
    expect(getByTestId("prev-page-title")).toHaveTextContent("Page 1")
  })

  test("returns undefined for previous page when on first item", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "link",
          path: "/test-path",
          title: "Current Page",
        },
        {
          type: "link",
          path: "/page-2",
          title: "Page 2",
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("Page 2")
    expect(getByTestId("prev-page-title")).toHaveTextContent("no-prev")
  })

  test("finds next page in nested sidebar", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "link",
          path: "/test-path",
          title: "Current Page",
          children: [
            {
              type: "link",
              path: "/test-path/child-1",
              title: "Child 1",
            },
            {
              type: "link",
              path: "/test-path/child-2",
              title: "Child 2",
            },
          ],
        },
        {
          type: "link",
          path: "/page-2",
          title: "Page 2",
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("Child 1")
    expect(getByTestId("next-page-link")).toHaveTextContent(
      "/test-path/child-1"
    )
    expect(getByTestId("next-page-parent")).toHaveTextContent("Current Page")
  })

  test("finds previous page in nested sidebar", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "category",
          title: "Category 1",
          children: [
            {
              type: "link",
              path: "/category-1/item-1",
              title: "Item 1",
            },
            {
              type: "link",
              path: "/test-path",
              title: "Current Page",
            },
          ],
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("prev-page-title")).toHaveTextContent("Item 1")
    expect(getByTestId("prev-page-link")).toHaveTextContent(
      "/category-1/item-1"
    )
  })

  test("handles separators in sidebar", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "link",
          path: "/page-1",
          title: "Page 1",
        },
        {
          type: "separator",
        },
        {
          type: "link",
          path: "/test-path",
          title: "Current Page",
        },
        {
          type: "separator",
        },
        {
          type: "link",
          path: "/page-3",
          title: "Page 3",
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("Page 3")
    expect(getByTestId("prev-page-title")).toHaveTextContent("Page 1")
  })

  test("finds next page across categories", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "category",
          title: "Category 1",
          children: [
            {
              type: "link",
              path: "/category-1/item-1",
              title: "Item 1",
            },
            {
              type: "link",
              path: "/test-path",
              title: "Current Page",
            },
          ],
        },
        {
          type: "category",
          title: "Category 2",
          children: [
            {
              type: "link",
              path: "/category-2/item-1",
              title: "Category 2 Item 1",
            },
          ],
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent(
      "Category 2 Item 1"
    )
    expect(getByTestId("next-page-link")).toHaveTextContent(
      "/category-2/item-1"
    )
    expect(getByTestId("next-page-parent")).toHaveTextContent("Category 2")
  })

  test("finds previous page across categories", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "category",
          title: "Category 1",
          children: [
            {
              type: "link",
              path: "/category-1/item-1",
              title: "Item 1",
            },
          ],
        },
        {
          type: "category",
          title: "Category 2",
          children: [
            {
              type: "link",
              path: "/test-path",
              title: "Current Page",
            },
          ],
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("prev-page-title")).toHaveTextContent("Item 1")
    expect(getByTestId("prev-page-link")).toHaveTextContent(
      "/category-1/item-1"
    )
  })

  test("handles sidebar with children property", () => {
    const mockSidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      children: [
        {
          type: "link",
          path: "/page-1",
          title: "Page 1",
        },
        {
          type: "link",
          path: "/test-path",
          title: "Current Page",
        },
        {
          type: "link",
          path: "/page-3",
          title: "Page 3",
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("Page 3")
    expect(getByTestId("prev-page-title")).toHaveTextContent("Page 1")
  })

  test("updates pagination when activePath changes", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "link",
          path: "/page-1",
          title: "Page 1",
        },
        {
          type: "link",
          path: "/test-path",
          title: "Current Page",
        },
        {
          type: "link",
          path: "/page-3",
          title: "Page 3",
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")
    previousActivePath = undefined

    const { getByTestId, rerender } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("Page 3")
    expect(getByTestId("prev-page-title")).toHaveTextContent("Page 1")

    // Change active path
    previousActivePath = "/test-path"
    mockActivePath.mockReturnValue("/page-3")

    rerender(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("no-next")
    expect(getByTestId("prev-page-title")).toHaveTextContent("Current Page")
  })

  test("does not update pagination when activePath has not changed", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "link",
          path: "/test-path",
          title: "Current Page",
        },
        {
          type: "link",
          path: "/page-2",
          title: "Page 2",
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")
    previousActivePath = "/test-path" // Same as current

    const { getByTestId, rerender } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    const initialNextPage = getByTestId("next-page-title").textContent

    // Re-render with same activePath
    rerender(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    // Should remain the same
    expect(getByTestId("next-page-title")).toHaveTextContent(initialNextPage!)
  })

  test("handles complex nested structure", () => {
    const mockSidebar: Sidebar.Sidebar = {
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      items: [
        {
          type: "category",
          title: "Category 1",
          children: [
            {
              type: "sub-category",
              title: "Sub Category 1",
              children: [
                {
                  type: "link",
                  path: "/cat1/sub1/item1",
                  title: "Item 1",
                },
                {
                  type: "link",
                  path: "/test-path",
                  title: "Current Page",
                },
                {
                  type: "link",
                  path: "/cat1/sub1/item3",
                  title: "Item 3",
                },
              ],
            },
          ],
        },
      ],
    }
    mockShownSidebar.mockReturnValue(mockSidebar)
    mockActivePath.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <PaginationProvider>
        <TestComponent />
      </PaginationProvider>
    )

    expect(getByTestId("next-page-title")).toHaveTextContent("Item 3")
    expect(getByTestId("next-page-link")).toHaveTextContent("/cat1/sub1/item3")
    expect(getByTestId("prev-page-title")).toHaveTextContent("Item 1")
    expect(getByTestId("prev-page-link")).toHaveTextContent("/cat1/sub1/item1")
  })
})
