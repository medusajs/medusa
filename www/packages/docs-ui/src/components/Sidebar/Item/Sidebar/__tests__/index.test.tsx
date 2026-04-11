import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { Sidebar } from "types"

// mock hooks
const mockGetSidebarFirstLinkChild = vi.fn()

const defaultUseSidebarReturn = {
  getSidebarFirstLinkChild: mockGetSidebarFirstLinkChild,
}

const mockUseSidebar = vi.fn(() => defaultUseSidebarReturn)

vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
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
    ...props
  }: {
    href: string
    children: React.ReactNode
    className?: string
    [key: string]: unknown
  }) => (
    <a href={href} className={className} data-testid="sidebar-link" {...props}>
      {children}
    </a>
  ),
}))

import { SidebarItemSidebar } from "../../Sidebar"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSidebar.mockReturnValue(defaultUseSidebarReturn)
})

describe("rendering", () => {
  test("renders sidebar title", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(<SidebarItemSidebar item={item} />)
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Sidebar")
  })

  test("renders link with hash prefix when isPathHref is false", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "test",
      title: "Test Link",
      isPathHref: false,
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(<SidebarItemSidebar item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveAttribute("href", "#test")
  })

  test("renders link without hash prefix when isPathHref is true", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
      isPathHref: true,
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(<SidebarItemSidebar item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveAttribute("href", "/test")
  })

  test("renders badge when provided", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      badge: { text: "New", variant: "blue" },
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(<SidebarItemSidebar item={item} />)
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("New")
  })

  test("renders additional elements when provided", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      additionalElms: <span data-testid="additional">Additional</span>,
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(<SidebarItemSidebar item={item} />)
    const additional = container.querySelector("[data-testid='additional']")
    expect(additional).toBeInTheDocument()
  })

  test("applies nested styles when nested is true", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(
      <SidebarItemSidebar item={item} nested={true} />
    )
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveClass("text-medusa-fg-muted")
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toHaveClass("pl-docs_1.5")
  })

  test("applies subtle styles when nested is false", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(
      <SidebarItemSidebar item={item} nested={false} />
    )
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveClass("text-medusa-fg-subtle")
  })

  test("applies break-words for multi-word titles", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar Title",
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(<SidebarItemSidebar item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveClass("break-words")
  })

  test("applies truncate for single-word titles", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Sidebar",
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(<SidebarItemSidebar item={item} />)
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toHaveClass("truncate")
  })

  test("applies custom className", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(
      <SidebarItemSidebar item={item} className="custom-class" />
    )
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveClass("custom-class")
  })

  test("passes linkProps to Link component", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
      linkProps: { rel: "noopener noreferrer" },
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    const { container } = render(<SidebarItemSidebar item={item} />)
    const link = container.querySelector("[data-testid='sidebar-link']")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })
})

describe("useSidebar integration", () => {
  test("calls getSidebarFirstLinkChild with item", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      children: [],
    }
    const firstChild: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    mockGetSidebarFirstLinkChild.mockReturnValue(firstChild)
    render(<SidebarItemSidebar item={item} />)
    expect(mockGetSidebarFirstLinkChild).toHaveBeenCalledWith(item)
  })
})
