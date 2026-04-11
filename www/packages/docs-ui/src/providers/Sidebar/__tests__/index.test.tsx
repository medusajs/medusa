import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react"
import type { Sidebar } from "types"

// Mock dependencies
const mockUseSiteConfig = vi.fn(() => ({
  config: {
    project: {
      title: "Test Project",
      key: "test-project",
    },
  },
}))

const mockUseIsBrowser = vi.fn(() => ({
  isBrowser: true,
}))

const mockUsePathname = vi.fn(() => "/test-path")

const mockPush = vi.fn()
const mockReplace = vi.fn()
const mockUseRouter = vi.fn(() => ({
  push: mockPush,
  replace: mockReplace,
}))

const mockGetScrolledTop = vi.fn(() => 0)

vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))

vi.mock("@/providers/BrowserProvider", () => ({
  useIsBrowser: () => mockUseIsBrowser(),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockUseRouter(),
}))

vi.mock("@/utils/get-scrolled-top", () => ({
  getScrolledTop: () => mockGetScrolledTop(),
}))

// Test data
const mockSidebar1: Sidebar.Sidebar = {
  sidebar_id: "sidebar-1",
  title: "Sidebar 1",
  items: [
    {
      type: "link",
      path: "/test-path",
      title: "Test Link",
    },
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
          path: "/category-1/item-2",
          title: "Item 2",
        },
      ],
    },
    {
      type: "link",
      path: "/item-3",
      title: "Item 3",
      children: [
        {
          type: "link",
          path: "/item-3/item-3-1",
          title: "Item 3-1",
        },
      ],
    },
  ],
}

const mockSidebar2: Sidebar.Sidebar = {
  sidebar_id: "sidebar-2",
  title: "Sidebar 2",
  items: [
    {
      type: "link",
      path: "/sidebar-2/item-1",
      title: "Sidebar 2 Item 1",
    },
  ],
}

const mockSidebar3: Sidebar.Sidebar = {
  sidebar_id: "sidebar-3",
  title: "Sidebar 3",
  items: [
    {
      type: "link",
      path: "#hash-path",
      title: "Hash Path",
    },
  ],
}

import { SidebarProvider, useSidebar } from "../index"

const TestComponent = () => {
  const sidebar = useSidebar()
  if (!sidebar) {
    return null
  }

  return (
    <div>
      <div data-testid="sidebars-count">{sidebar.sidebars.length}</div>
      <div data-testid="active-path">{sidebar.activePath || "none"}</div>
      <div data-testid="active-item-title">
        {sidebar.activeItem?.title || "none"}
      </div>
      <div data-testid="shown-sidebar-id">
        {sidebar.shownSidebar?.sidebar_id || "none"}
      </div>
      <div data-testid="mobile-open">
        {sidebar.mobileSidebarOpen ? "open" : "closed"}
      </div>
      <div data-testid="desktop-open">
        {sidebar.desktopSidebarOpen ? "open" : "closed"}
      </div>
      <div data-testid="sidebar-history">
        {sidebar.sidebarHistory.join(",") || "none"}
      </div>
      <div data-testid="sidebar-top-height">{sidebar.sidebarTopHeight}</div>
      <button
        data-testid="set-active-path"
        onClick={() => sidebar.setActivePath("/test-path")}
      >
        Set Active Path
      </button>
      <button
        data-testid="set-mobile-open"
        onClick={() => sidebar.setMobileSidebarOpen(true)}
      >
        Open Mobile
      </button>
      <button
        data-testid="set-desktop-open"
        onClick={() => sidebar.setDesktopSidebarOpen(false)}
      >
        Close Desktop
      </button>
      <button
        data-testid="set-sidebar-top-height"
        onClick={() => sidebar.setSidebarTopHeight(100)}
      >
        Set Height
      </button>
      <button
        data-testid="add-items"
        onClick={() =>
          sidebar.addItems(
            [
              {
                type: "link",
                path: "/new-item",
                title: "New Item",
              },
            ],
            { sidebar_id: "sidebar-1" }
          )
        }
      >
        Add Items
      </button>
      <button
        data-testid="update-items"
        onClick={() =>
          sidebar.updateItems({
            sidebar_id: "sidebar-1",
            items: [
              {
                existingItem: mockSidebar1.items[0] as Sidebar.SidebarItem,
                newItem: { title: "Updated Title" },
              },
            ],
          })
        }
      >
        Update Items
      </button>
      <button
        data-testid="remove-items"
        onClick={() =>
          sidebar.removeItems({
            items: [mockSidebar1.items[0] as Sidebar.SidebarItem],
            sidebar_id: "sidebar-1",
          })
        }
      >
        Remove Items
      </button>
      <button data-testid="reset-items" onClick={() => sidebar.resetItems()}>
        Reset Items
      </button>
      <button data-testid="go-back" onClick={() => sidebar.goBack()}>
        Go Back
      </button>
      <button
        data-testid="update-category-state"
        onClick={() => sidebar.updatePersistedCategoryState("Category 1", true)}
      >
        Update Category State
      </button>
      <div data-testid="category-state">
        {sidebar.getPersistedCategoryState("Category 1")?.toString() || "none"}
      </div>
      <div data-testid="is-item-active">
        {sidebar.isItemActive({
          item: mockSidebar1.items[0] as Sidebar.InteractiveSidebarItem,
        })
          ? "active"
          : "inactive"}
      </div>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  mockUseSiteConfig.mockReturnValue({
    config: {
      project: {
        title: "Test Project",
        key: "test-project",
      },
    },
  })
  mockUseIsBrowser.mockReturnValue({
    isBrowser: true,
  })
  mockUsePathname.mockReturnValue("/test-path")
  mockGetScrolledTop.mockReturnValue(0)
  mockPush.mockClear()
  mockReplace.mockClear()

  // Mock window.location.hash
  Object.defineProperty(window, "location", {
    value: {
      hash: "",
    },
    writable: true,
    configurable: true,
  })

  // Mock document.getElementsByTagName
  Object.defineProperty(document, "getElementsByTagName", {
    value: vi.fn(() => [{ length: 1 }] as unknown as HTMLCollectionOf<Element>),
    writable: true,
    configurable: true,
  })
})

afterEach(() => {
  cleanup()
  localStorage.clear()
})

describe("rendering", () => {
  test("renders children", () => {
    const { container } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <div>Test</div>
      </SidebarProvider>
    )
    expect(container).toHaveTextContent("Test")
  })
})

describe("useSidebar hook", () => {
  test("initializes with provided sidebars", () => {
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1, mockSidebar2]}>
        <TestComponent />
      </SidebarProvider>
    )

    expect(getByTestId("sidebars-count")).toHaveTextContent("2")
  })

  test("sets active path from pathname", async () => {
    mockUsePathname.mockReturnValue("/test-path")
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]} shouldHandlePathChange={true}>
        <TestComponent />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("active-path")).toHaveTextContent("/test-path")
    })
  })

  test("finds active item from active path", async () => {
    mockUsePathname.mockReturnValue("/test-path")
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]} shouldHandlePathChange={true}>
        <TestComponent />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("active-item-title")).toHaveTextContent("Test Link")
    })
  })

  test("sets shown sidebar to first sidebar when single sidebar", () => {
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponent />
      </SidebarProvider>
    )

    expect(getByTestId("shown-sidebar-id")).toHaveTextContent("sidebar-1")
  })

  test("mobileSidebarOpen defaults to false", () => {
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponent />
      </SidebarProvider>
    )

    expect(getByTestId("mobile-open")).toHaveTextContent("closed")
  })

  test("desktopSidebarOpen defaults to true", () => {
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponent />
      </SidebarProvider>
    )

    expect(getByTestId("desktop-open")).toHaveTextContent("open")
  })

  test("loads desktop sidebar state from localStorage", async () => {
    localStorage.setItem("hide_sidebar", "true")
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponent />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("desktop-open")).toHaveTextContent("closed")
    })
  })

  test("setActivePath updates active path", async () => {
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponent />
      </SidebarProvider>
    )

    fireEvent.click(getByTestId("set-active-path"))

    await waitFor(() => {
      expect(getByTestId("active-path")).toHaveTextContent("/test-path")
    })
  })

  test("setMobileSidebarOpen updates mobile sidebar state", () => {
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponent />
      </SidebarProvider>
    )

    fireEvent.click(getByTestId("set-mobile-open"))

    expect(getByTestId("mobile-open")).toHaveTextContent("open")
  })

  test("setDesktopSidebarOpen updates desktop sidebar state and localStorage", async () => {
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponent />
      </SidebarProvider>
    )

    fireEvent.click(getByTestId("set-desktop-open"))

    await waitFor(() => {
      expect(getByTestId("desktop-open")).toHaveTextContent("closed")
      expect(localStorage.getItem("hide_sidebar")).toBe("true")
    })
  })

  test("setSidebarTopHeight updates sidebar top height", () => {
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponent />
      </SidebarProvider>
    )

    fireEvent.click(getByTestId("set-sidebar-top-height"))

    expect(getByTestId("sidebar-top-height")).toHaveTextContent("100")
  })

  test("addItems adds items to sidebar", async () => {
    const TestComponentWithItems = () => {
      const sidebar = useSidebar()
      return (
        <div>
          <div data-testid="items-count">
            {sidebar.sidebars[0]?.items.length || 0}
          </div>
          <button
            data-testid="add-items"
            onClick={() =>
              sidebar.addItems(
                [
                  {
                    type: "link",
                    path: "/new-item",
                    title: "New Item",
                  },
                ],
                { sidebar_id: "sidebar-1" }
              )
            }
          >
            Add Items
          </button>
        </div>
      )
    }

    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponentWithItems />
      </SidebarProvider>
    )

    const initialCount = mockSidebar1.items.length
    expect(getByTestId("items-count")).toHaveTextContent(
      initialCount.toString()
    )

    fireEvent.click(getByTestId("add-items"))

    await waitFor(() => {
      expect(Number(getByTestId("items-count").textContent)).toBeGreaterThan(
        initialCount
      )
    })
  })

  test("updateItems updates existing items", async () => {
    const TestComponentWithUpdate = () => {
      const sidebar = useSidebar()
      const updatedItem = sidebar.sidebars[0]?.items.find(
        (item) => item.type === "link" && item.path === "/test-path"
      )
      return (
        <div>
          <div data-testid="updated-title">
            {updatedItem && updatedItem.type === "link"
              ? updatedItem.title
              : "not found"}
          </div>
          <button
            data-testid="update-items"
            onClick={() =>
              sidebar.updateItems({
                sidebar_id: "sidebar-1",
                items: [
                  {
                    existingItem: mockSidebar1.items[0] as Sidebar.SidebarItem,
                    newItem: { title: "Updated Title" },
                  },
                ],
              })
            }
          >
            Update Items
          </button>
        </div>
      )
    }

    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponentWithUpdate />
      </SidebarProvider>
    )

    expect(getByTestId("updated-title")).toHaveTextContent("Test Link")

    fireEvent.click(getByTestId("update-items"))

    await waitFor(() => {
      expect(getByTestId("updated-title")).toHaveTextContent("Updated Title")
    })
  })

  test("removeItems removes items from sidebar", async () => {
    const TestComponentWithRemove = () => {
      const sidebar = useSidebar()
      return (
        <div>
          <div data-testid="items-count">
            {sidebar.sidebars[0]?.items.length || 0}
          </div>
          <button
            data-testid="remove-items"
            onClick={() =>
              sidebar.removeItems({
                items: [mockSidebar1.items[0] as Sidebar.SidebarItem],
                sidebar_id: "sidebar-1",
              })
            }
          >
            Remove Items
          </button>
        </div>
      )
    }

    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponentWithRemove />
      </SidebarProvider>
    )

    const initialCount = mockSidebar1.items.length
    expect(getByTestId("items-count")).toHaveTextContent(
      initialCount.toString()
    )

    fireEvent.click(getByTestId("remove-items"))

    await waitFor(() => {
      expect(Number(getByTestId("items-count").textContent)).toBeLessThan(
        initialCount
      )
    })
  })

  test("resetItems resets sidebar to initial state", async () => {
    const TestComponentWithReset = () => {
      const sidebar = useSidebar()
      return (
        <div>
          <div data-testid="items-count">
            {sidebar.sidebars[0]?.items.length || 0}
          </div>
          <button
            data-testid="add-items"
            onClick={() =>
              sidebar.addItems(
                [
                  {
                    type: "link",
                    path: "/new-item",
                    title: "New Item",
                  },
                ],
                { sidebar_id: "sidebar-1" }
              )
            }
          >
            Add Items
          </button>
          <button
            data-testid="reset-items"
            onClick={() => sidebar.resetItems()}
          >
            Reset Items
          </button>
        </div>
      )
    }

    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponentWithReset />
      </SidebarProvider>
    )

    const initialCount = mockSidebar1.items.length
    expect(getByTestId("items-count")).toHaveTextContent(
      initialCount.toString()
    )

    // Add an item first
    fireEvent.click(getByTestId("add-items"))

    await waitFor(() => {
      expect(Number(getByTestId("items-count").textContent)).toBeGreaterThan(
        initialCount
      )
    })

    // Then reset
    fireEvent.click(getByTestId("reset-items"))

    await waitFor(() => {
      expect(getByTestId("items-count")).toHaveTextContent(
        initialCount.toString()
      )
    })
  })

  test("isItemActive returns true for active item", async () => {
    mockUsePathname.mockReturnValue("/test-path")
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]} shouldHandlePathChange={true}>
        <TestComponent />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("is-item-active")).toHaveTextContent("active")
    })
  })

  test("isItemActive returns false for inactive item", async () => {
    mockUsePathname.mockReturnValue("/other-path")
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]} shouldHandlePathChange={true}>
        <TestComponent />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("is-item-active")).toHaveTextContent("inactive")
    })
  })

  test("isItemActive checks children when checkLinkChildren is true", async () => {
    mockUsePathname.mockReturnValue("/category-1/item-1")
    const TestComponentWithChild = () => {
      const sidebar = useSidebar()
      return (
        <div>
          <div data-testid="category-active">
            {sidebar.isItemActive({
              item: mockSidebar1.items[1] as Sidebar.InteractiveSidebarItem,
              checkLinkChildren: true,
            })
              ? "active"
              : "inactive"}
          </div>
        </div>
      )
    }

    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]} shouldHandlePathChange={true}>
        <TestComponentWithChild />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("category-active")).toHaveTextContent("active")
    })
  })

  test("isItemActive does not check link children when checkLinkChildren is false", async () => {
    mockUsePathname.mockReturnValue("/item-3/item-3-1")
    const TestComponentWithChild = () => {
      const sidebar = useSidebar()
      return (
        <div>
          <div data-testid="link-inactive">
            {sidebar.isItemActive({
              item: mockSidebar1.items[2] as Sidebar.InteractiveSidebarItem,
              checkLinkChildren: false,
            })
              ? "active"
              : "inactive"}
          </div>
        </div>
      )
    }

    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]} shouldHandlePathChange={true}>
        <TestComponentWithChild />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("link-inactive")).toHaveTextContent("inactive")
    })
  })

  test("isItemActive checks category children when checkLinkChildren is false", async () => {
    mockUsePathname.mockReturnValue("/category-1/item-1")
    const TestComponentWithChild = () => {
      const sidebar = useSidebar()
      return (
        <div>
          <div data-testid="category-active">
            {sidebar.isItemActive({
              item: mockSidebar1.items[1] as Sidebar.InteractiveSidebarItem,
              checkLinkChildren: false,
            })
              ? "active"
              : "inactive"}
          </div>
        </div>
      )
    }

    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]} shouldHandlePathChange={true}>
        <TestComponentWithChild />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("category-active")).toHaveTextContent("active")
    })
  })

  test("getSidebar returns sidebar by id", () => {
    const TestComponentWithGetSidebar = () => {
      const sidebar = useSidebar()
      const foundSidebar = sidebar.getSidebar("sidebar-1")
      return (
        <div data-testid="found-sidebar-id">
          {foundSidebar?.sidebar_id || "none"}
        </div>
      )
    }

    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1, mockSidebar2]}>
        <TestComponentWithGetSidebar />
      </SidebarProvider>
    )

    expect(getByTestId("found-sidebar-id")).toHaveTextContent("sidebar-1")
  })

  test("getSidebarFirstLinkChild returns first link child", () => {
    const TestComponentWithGetFirstLink = () => {
      const sidebar = useSidebar()
      const firstLink = sidebar.getSidebarFirstLinkChild(mockSidebar1)
      return (
        <div data-testid="first-link-path">{firstLink?.path || "none"}</div>
      )
    }

    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]}>
        <TestComponentWithGetFirstLink />
      </SidebarProvider>
    )

    expect(getByTestId("first-link-path")).toHaveTextContent("/test-path")
  })

  test("goBack navigates to previous sidebar in history", async () => {
    const sidebarWithNested: Sidebar.Sidebar = {
      sidebar_id: "main",
      title: "Main Sidebar",
      items: [
        {
          type: "sidebar",
          sidebar_id: "nested",
          title: "Nested Sidebar",
          children: [
            {
              type: "link",
              path: "/nested/item",
              title: "Nested Item",
            },
          ],
        },
      ],
    }

    const nestedSidebar: Sidebar.Sidebar = {
      sidebar_id: "nested",
      title: "Nested Sidebar",
      items: [
        {
          type: "link",
          path: "/nested/item",
          title: "Nested Item",
        },
      ],
    }

    mockUsePathname.mockReturnValue("/nested/item")
    const { getByTestId } = render(
      <SidebarProvider
        sidebars={[sidebarWithNested, nestedSidebar]}
        shouldHandlePathChange={true}
      >
        <TestComponent />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("sidebar-history")).not.toHaveTextContent("none")
    })

    fireEvent.click(getByTestId("go-back"))

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled()
    })
  })

  test("updatePersistedCategoryState saves to localStorage", async () => {
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]} persistCategoryState={true}>
        <TestComponent />
      </SidebarProvider>
    )

    fireEvent.click(getByTestId("update-category-state"))

    await waitFor(() => {
      const storageData = JSON.parse(
        localStorage.getItem("Test Project_categories") || "{}"
      )
      expect(storageData["Test Project"]["Category 1"]).toBe(true)
    })
  })

  test("getPersistedCategoryState retrieves from localStorage", async () => {
    localStorage.setItem(
      "Test Project_categories",
      JSON.stringify({
        "Test Project": {
          "Category 1": true,
        },
      })
    )

    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]} persistCategoryState={true}>
        <TestComponent />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("category-state")).toHaveTextContent("true")
    })
  })

  test("getPersistedCategoryState returns undefined for non-existent category", () => {
    const { getByTestId } = render(
      <SidebarProvider sidebars={[mockSidebar1]} persistCategoryState={true}>
        <TestComponent />
      </SidebarProvider>
    )

    expect(getByTestId("category-state")).toHaveTextContent("none")
  })

  test("handles hash change when shouldHandleHashChange is true and shouldHandlePathChange is false", async () => {
    Object.defineProperty(window, "location", {
      value: {
        hash: "#hash-path",
      },
      writable: true,
      configurable: true,
    })

    const { getByTestId } = render(
      <SidebarProvider
        sidebars={[mockSidebar3]}
        shouldHandleHashChange={true}
        shouldHandlePathChange={false}
      >
        <TestComponent />
      </SidebarProvider>
    )

    await waitFor(() => {
      // init() removes the # from the hash
      expect(getByTestId("active-path")).toHaveTextContent("hash-path")
    })
  })

  test("does not handle hash change when shouldHandleHashChange is false", async () => {
    Object.defineProperty(window, "location", {
      value: {
        hash: "#/hash-path",
      },
      writable: true,
      configurable: true,
    })

    mockUsePathname.mockReturnValue("/test-path")
    const { getByTestId } = render(
      <SidebarProvider
        sidebars={[mockSidebar1]}
        shouldHandleHashChange={false}
        shouldHandlePathChange={true}
      >
        <TestComponent />
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(getByTestId("active-path")).toHaveTextContent("/test-path")
    })
  })

  test("handles scroll when shouldHandleHashChange is true", async () => {
    mockGetScrolledTop.mockReturnValue(30) // Between 0 and 56

    const TestComponentWithScroll = () => {
      const sidebar = useSidebar()
      return (
        <div>
          <div data-testid="scroll-active-path">
            {sidebar.activePath || "none"}
          </div>
        </div>
      )
    }

    const scrollableElement = document.createElement("div")
    render(
      <SidebarProvider
        sidebars={[mockSidebar1]}
        shouldHandleHashChange={true}
        scrollableElement={scrollableElement}
      >
        <TestComponentWithScroll />
      </SidebarProvider>
    )

    // Simulate scroll event
    fireEvent.scroll(scrollableElement)

    await waitFor(() => {
      expect(mockGetScrolledTop).toHaveBeenCalled()
    })
  })

  test("calls setIsLoading when sidebars are loaded", async () => {
    const setIsLoading = vi.fn()
    render(
      <SidebarProvider
        sidebars={[mockSidebar1]}
        isLoading={true}
        setIsLoading={setIsLoading}
      >
        <div>Test</div>
      </SidebarProvider>
    )

    await waitFor(() => {
      expect(setIsLoading).toHaveBeenCalledWith(false)
    })
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useSidebar must be used inside a SidebarProvider")

    consoleSpy.mockRestore()
  })
})
