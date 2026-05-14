import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render, waitFor } from "@testing-library/react"
import { Sidebar } from "types"

// mock functions
const mockScrollIntoView = vi.fn()
const mockScrollTo = vi.fn()

// mock hooks
const mockIsItemActive = vi.fn()
const mockSetMobileSidebarOpen = vi.fn()

const defaultUseSidebarReturn = {
  isItemActive: mockIsItemActive,
  setMobileSidebarOpen: mockSetMobileSidebarOpen,
  disableActiveTransition: false,
  sidebarRef: React.createRef<HTMLDivElement>(),
  sidebarTopHeight: 0,
}

const defaultUseMobileReturn = {
  isMobile: false,
}

const mockUseSidebar = vi.fn(() => defaultUseSidebarReturn)
const mockUseMobile = vi.fn(() => defaultUseMobileReturn)

vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}))

vi.mock("@/providers/Mobile", () => ({
  useMobile: () => mockUseMobile(),
}))

// mock components
vi.mock("@/components/Badge", () => ({
  Badge: ({
    variant,
    children,
  }: {
    variant?: string
    children: React.ReactNode
  }) => (
    <div data-testid="badge" data-variant={variant}>
      {children}
    </div>
  ),
}))

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    target,
    rel,
  }: {
    href: string
    children: React.ReactNode
    className?: string
    target?: string
    rel?: string
  }) => (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      data-testid="sidebar-link"
    >
      {children}
    </a>
  ),
}))

vi.mock("@/components/Sidebar/Item", () => ({
  SidebarItem: ({ item }: { item: Sidebar.SidebarItem }) => (
    <div data-testid="sidebar-item">
      {"title" in item ? item.title : item.type}
    </div>
  ),
}))

vi.mock("@/utils/check-sidebar-item-visibility", () => ({
  checkSidebarItemVisibility: vi.fn(() => false),
}))

// Mock scrollIntoView
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView
  window.HTMLElement.prototype.scrollTo = mockScrollTo
  vi.clearAllMocks()
  mockIsItemActive.mockReturnValue(false)
  mockUseSidebar.mockReturnValue(defaultUseSidebarReturn)
  mockUseMobile.mockReturnValue(defaultUseMobileReturn)
})

import { SidebarItemLink } from "../../Link"

describe("rendering", () => {
  test("renders link title", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Link")
  })

  test("renders link with hash prefix when isPathHref is false", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "test",
      title: "Test Link",
      isPathHref: false,
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveAttribute("href", "#test")
  })

  test("renders link without hash prefix when isPathHref is true", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
      isPathHref: true,
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveAttribute("href", "/test")
  })

  test("renders external link with target and rel", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "external",
      path: "https://example.com",
      title: "External Link",
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("renders badge when provided", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
      badge: { text: "New", variant: "blue" },
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("New")
  })

  test("renders additional elements when provided", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
      additionalElms: <span data-testid="additional">Additional</span>,
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const additional = container.querySelector("[data-testid='additional']")
    expect(additional).toBeInTheDocument()
  })

  test("renders children when provided", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
      children: [
        {
          type: "link",
          path: "/child1",
          title: "Child 1",
        },
      ],
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const childItem = container.querySelector("[data-testid='sidebar-item']")
    expect(childItem).toBeInTheDocument()
    expect(childItem).toHaveTextContent("Child 1")
  })

  test("does not render children when hideChildren is true", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
      hideChildren: true,
      children: [
        {
          type: "link",
          path: "/child1",
          title: "Child 1",
        },
      ],
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const childItem = container.querySelector("[data-testid='sidebar-item']")
    expect(childItem).not.toBeInTheDocument()
  })

  test("applies active styles when active", () => {
    mockIsItemActive.mockReturnValue(true)
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveClass("bg-medusa-bg-base")
    expect(link).toHaveClass(
      "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark"
    )
    expect(link).toHaveClass("text-medusa-fg-base")
  })

  test("applies inactive styles when not active and nested is false", () => {
    mockIsItemActive.mockReturnValue(false)
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveClass("text-medusa-fg-subtle")
  })

  test("applies nested styles when not active and nested is true", () => {
    mockIsItemActive.mockReturnValue(false)
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "test",
      title: "Test Link",
    }
    const { container } = render(<SidebarItemLink item={item} nested={true} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveClass("text-medusa-fg-muted")
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toHaveClass("pl-docs_1.5")
  })

  test("applies break-words for multi-word titles", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link Title",
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveClass("break-words")
  })

  test("applies truncate for single-word titles", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Link",
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass("truncate")
  })

  test("applies custom className", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    const { container } = render(
      <SidebarItemLink item={item} className="custom-class" />
    )
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveClass("custom-class")
  })

  test("passes linkProps to Link component", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
      linkProps: { rel: "noopener noreferrer" },
    }
    const { container } = render(<SidebarItemLink item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })
})

describe("interactions", () => {
  test("closes mobile sidebar when active and mobile", async () => {
    mockIsItemActive.mockReturnValue(true)
    mockUseMobile.mockReturnValue({ isMobile: true })
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    render(<SidebarItemLink item={item} />)
    await waitFor(() => {
      expect(mockSetMobileSidebarOpen).toHaveBeenCalledWith(false)
    })
  })

  test("does not close mobile sidebar when not active", () => {
    mockIsItemActive.mockReturnValue(false)
    mockUseMobile.mockReturnValue({ isMobile: true })
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    render(<SidebarItemLink item={item} />)
    expect(mockSetMobileSidebarOpen).not.toHaveBeenCalled()
  })
})

describe("scroll behavior", () => {
  test("scrolls into view when active and parent category is open", () => {
    mockIsItemActive.mockReturnValue(true)
    const sidebarRef = React.createRef<HTMLDivElement>()
    sidebarRef.current = document.createElement("div")
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      sidebarRef,
    })
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    const { container } = render(
      <SidebarItemLink item={item} isParentCategoryOpen={true} />
    )
    const listItem = container.querySelector("li")
    expect(listItem).toBeInTheDocument()
    // scrollIntoView should be called via useEffect
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      block: "center",
    })
  })

  test("doesn't scroll into view when disableActiveTransition is true", () => {
    mockIsItemActive.mockReturnValue(true)
    const sidebarRef = React.createRef<HTMLDivElement>()
    sidebarRef.current = document.createElement("div")
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      disableActiveTransition: true,
      sidebarRef,
      sidebarTopHeight: 0,
    })
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    render(<SidebarItemLink item={item} isParentCategoryOpen={true} />)
    expect(mockScrollIntoView).not.toHaveBeenCalled()

    // instead, scrollTo should be called
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: -10,
    })
  })
})
