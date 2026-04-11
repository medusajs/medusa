import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { Sidebar } from "types"

// mock hooks
const mockSetMobileSidebarOpen = vi.fn()
const mockSetDesktopSidebarOpen = vi.fn()
const mockSetSidebarTopHeight = vi.fn()

const mockSidebar: Sidebar.Sidebar = {
  sidebar_id: "test-sidebar",
  title: "Test Sidebar",
  items: [
    {
      type: "link",
      path: "/test",
      title: "Test Link",
    },
  ],
}

const defaultUseSidebarReturn = {
  sidebars: [mockSidebar],
  shownSidebar: mockSidebar as
    | Sidebar.Sidebar
    | Sidebar.SidebarItemSidebar
    | undefined,
  mobileSidebarOpen: false,
  setMobileSidebarOpen: mockSetMobileSidebarOpen,
  isSidebarStatic: true,
  sidebarRef: React.createRef<HTMLDivElement>(),
  desktopSidebarOpen: true,
  setDesktopSidebarOpen: mockSetDesktopSidebarOpen,
  setSidebarTopHeight: mockSetSidebarTopHeight,
  sidebarHistory: ["test-sidebar"],
}

const mockUseSidebar = vi.fn(() => defaultUseSidebarReturn)
const mockUseKeyboardShortcut = vi.fn()

vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}))

vi.mock("@/hooks/use-keyboard-shortcut", () => ({
  useKeyboardShortcut: (options: unknown) => mockUseKeyboardShortcut(options),
}))

// mock components
vi.mock("@/components/Loading", () => ({
  Loading: ({
    count,
    className,
  }: {
    count?: number
    className?: string
    barClassName?: string
  }) => (
    <div data-testid="loading" data-count={count} className={className}>
      Loading
    </div>
  ),
}))

vi.mock("@/components/Sidebar/Item", () => ({
  SidebarItem: ({
    item,
    hasNextItems,
  }: {
    item: Sidebar.SidebarItem
    hasNextItems: boolean
  }) => (
    <div data-testid="sidebar-item" data-has-next={hasNextItems}>
      {"title" in item ? item.title : item.type}
    </div>
  ),
}))

vi.mock("@/components/Sidebar/Top", () => ({
  SidebarTop: () => <div data-testid="sidebar-top">Top</div>,
}))

vi.mock("react-transition-group", () => ({
  CSSTransition: ({
    children,
    nodeRef,
  }: {
    children: React.ReactNode
    nodeRef: React.RefObject<HTMLDivElement>
  }) => <div ref={nodeRef}>{children}</div>,
  SwitchTransition: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock("@react-hook/resize-observer", () => ({
  default: vi.fn(),
}))

vi.mock("@/providers/BrowserProvider", () => ({
  useIsBrowser: () => ({
    isBrowser: true,
  }),
}))

import { Sidebar as SidebarComponent } from "../../Sidebar"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSidebar.mockReturnValue(defaultUseSidebarReturn)
})

describe("rendering", () => {
  test("renders sidebar top", () => {
    const { container } = render(<SidebarComponent />)
    const top = container.querySelector("[data-testid='sidebar-top']")
    expect(top).toBeInTheDocument()
  })

  test("renders sidebar items", () => {
    const { container } = render(<SidebarComponent />)
    const items = container.querySelectorAll("[data-testid='sidebar-item']")
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent("Test Link")
  })

  test("renders loading when items are empty and not static", () => {
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      shownSidebar: { ...mockSidebar, items: [] },
      isSidebarStatic: false,
    })
    const { container } = render(<SidebarComponent />)
    const loading = container.querySelector("[data-testid='loading']")
    expect(loading).toBeInTheDocument()
  })

  test("does not render loading when items exist", () => {
    const { container } = render(<SidebarComponent />)
    const loading = container.querySelector("[data-testid='loading']")
    expect(loading).not.toBeInTheDocument()
  })

  test("renders overlay when mobile sidebar is open", () => {
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      mobileSidebarOpen: true,
    })
    const { container } = render(<SidebarComponent />)
    const overlay = container.querySelector(
      "[data-testid='mobile-sidebar-overlay']"
    )
    expect(overlay).toBeInTheDocument()
  })

  test("does not render overlay when mobile sidebar is closed", () => {
    const { container } = render(<SidebarComponent />)
    const overlay = container.querySelector(
      "[data-testid='mobile-sidebar-overlay']"
    )
    expect(overlay).not.toBeInTheDocument()
  })

  test("applies mobile sidebar open classes", () => {
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      mobileSidebarOpen: true,
    })
    const { container } = render(<SidebarComponent />)
    const aside = container.querySelector("aside")
    expect(aside).toHaveClass(
      "!left-docs_0.5 !top-docs_0.5 z-50 shadow-elevation-modal dark:shadow-elevation-modal-dark"
    )
    expect(aside).toHaveClass("rounded")
    expect(aside).toHaveClass("lg:!left-0 lg:!top-0 lg:shadow-none")
  })

  test("applies desktop sidebar open classes", () => {
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      desktopSidebarOpen: true,
    })
    const { container } = render(<SidebarComponent />)
    const aside = container.querySelector("aside")
    expect(aside).toHaveClass("lg:left-0")
  })

  test("applies desktop sidebar closed classes", () => {
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      desktopSidebarOpen: false,
    })
    const { container } = render(<SidebarComponent />)
    const aside = container.querySelector("aside")
    expect(aside).toHaveClass("lg:!absolute lg:!-left-full")
  })

  test("applies custom className", () => {
    const { container } = render(<SidebarComponent className="custom-class" />)
    const aside = container.querySelector("aside")
    expect(aside).toHaveClass("custom-class")
  })

  test("uses items from shownSidebar when available", () => {
    const sidebarWithItems: Sidebar.Sidebar = {
      sidebar_id: "sidebar-with-items",
      title: "Sidebar With Items",
      items: [
        {
          type: "link",
          path: "/item1",
          title: "Item 1",
        },
        {
          type: "link",
          path: "/item2",
          title: "Item 2",
        },
      ],
    }
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      shownSidebar: sidebarWithItems,
    })
    const { container } = render(<SidebarComponent />)
    const items = container.querySelectorAll("[data-testid='sidebar-item']")
    expect(items).toHaveLength(2)
  })

  test("uses children from shownSidebar when items not available", () => {
    const sidebarWithChildren: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "sidebar-with-children",
      title: "Sidebar With Children",
      children: [
        {
          type: "link",
          path: "/child1",
          title: "Child 1",
        },
      ],
    }
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      shownSidebar: sidebarWithChildren,
    })
    const { container } = render(<SidebarComponent />)
    const items = container.querySelectorAll("[data-testid='sidebar-item']")
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent("Child 1")
  })

  test("passes hasNextItems correctly", () => {
    const sidebarWithMultipleItems: Sidebar.Sidebar = {
      sidebar_id: "sidebar-multiple",
      title: "Multiple Items",
      items: [
        {
          type: "link",
          path: "/item1",
          title: "Item 1",
        },
        {
          type: "link",
          path: "/item2",
          title: "Item 2",
        },
      ],
    }
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      shownSidebar: sidebarWithMultipleItems,
    })
    const { container } = render(<SidebarComponent />)
    const items = container.querySelectorAll("[data-testid='sidebar-item']")
    expect(items[0]).toHaveAttribute("data-has-next", "true")
    expect(items[1]).toHaveAttribute("data-has-next", "false")
  })
})

describe("interactions", () => {
  test("closes mobile sidebar when clicking outside", () => {
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      mobileSidebarOpen: true,
    })
    const { container } = render(
      <div>
        <div data-testid="outside-element">Outside Element</div>
        <SidebarComponent />
      </div>
    )
    const outsideElement = container.querySelector(
      "[data-testid='outside-element']"
    )
    fireEvent.click(outsideElement!)
    expect(mockSetMobileSidebarOpen).toHaveBeenCalledWith(false)
  })

  test("sets up keyboard shortcut for toggle", () => {
    render(<SidebarComponent />)
    expect(mockUseKeyboardShortcut).toHaveBeenCalledWith({
      metakey: true,
      shortcutKeys: ["\\"],
      action: expect.any(Function),
    })
  })

  test("toggles desktop sidebar when keyboard shortcut is triggered", () => {
    render(<SidebarComponent />)
    const lastCall =
      mockUseKeyboardShortcut.mock.calls[
        mockUseKeyboardShortcut.mock.calls.length - 1
      ]
    const action = lastCall[0].action
    action()
    expect(mockSetDesktopSidebarOpen).toHaveBeenCalledWith(expect.any(Function))
  })
})
