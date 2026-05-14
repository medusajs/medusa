import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render, waitFor } from "@testing-library/react"
import { Sidebar } from "types"

// mock hooks
const mockIsItemActive = vi.fn()
const mockUpdatePersistedCategoryState = vi.fn()
const mockGetPersistedCategoryState = vi.fn()

const defaultUseSidebarReturn = {
  isItemActive: mockIsItemActive,
  updatePersistedCategoryState: mockUpdatePersistedCategoryState,
  getPersistedCategoryState: mockGetPersistedCategoryState,
  persistCategoryState: false,
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

vi.mock("@/components/Loading", () => ({
  Loading: ({
    count,
    className,
    barClassName,
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
  SidebarItem: ({ item }: { item: Sidebar.SidebarItem }) => (
    <div data-testid="sidebar-item">
      {"title" in item ? item.title : item.type}
    </div>
  ),
}))

vi.mock("@medusajs/icons", () => ({
  TriangleDownMini: () => <svg data-testid="triangle-down-icon" />,
  TriangleUpMini: () => <svg data-testid="triangle-up-icon" />,
}))

import { SidebarItemCategory } from "../../Category"

beforeEach(() => {
  vi.clearAllMocks()
  mockIsItemActive.mockReturnValue(false)
  mockGetPersistedCategoryState.mockReturnValue(undefined)
  mockUseSidebar.mockReturnValue(defaultUseSidebarReturn)
})

describe("rendering", () => {
  test("renders category title", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Category")
  })

  test("renders badge when provided", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      badge: { text: "New", variant: "blue" },
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("New")
  })

  test("renders additional elements when provided", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      additionalElms: <span data-testid="additional">Additional</span>,
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const additional = container.querySelector("[data-testid='additional']")
    expect(additional).toBeInTheDocument()
  })

  test("renders triangle up icon when closed", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const upIcon = container.querySelector("[data-testid='triangle-up-icon']")
    expect(upIcon).toBeInTheDocument()
  })

  test("renders triangle down icon when open", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      initialOpen: true,
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const downIcon = container.querySelector(
      "[data-testid='triangle-down-icon']"
    )
    expect(downIcon).toBeInTheDocument()
  })

  test("does not render triangle icons when additionalElms is provided", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      additionalElms: <span>Additional</span>,
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const upIcon = container.querySelector("[data-testid='triangle-up-icon']")
    const downIcon = container.querySelector(
      "[data-testid='triangle-down-icon']"
    )
    expect(upIcon).not.toBeInTheDocument()
    expect(downIcon).not.toBeInTheDocument()
  })

  test("renders children when open", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      initialOpen: true,
      children: [
        {
          type: "link",
          path: "/child1",
          title: "Child 1",
        },
      ],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const childItem = container.querySelector("[data-testid='sidebar-item']")
    expect(childItem).toBeInTheDocument()
    expect(childItem).toHaveTextContent("Child 1")
  })

  test("hides children when closed", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      initialOpen: false,
      children: [
        {
          type: "link",
          path: "/child1",
          title: "Child 1",
        },
      ],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const children = container.querySelector(
      "[data-testid='sidebar-item-category-children']"
    )
    expect(children).toHaveClass("overflow-hidden m-0 h-0")
  })

  test("does not render children when hideChildren is true", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      hideChildren: true,
      initialOpen: true,
      children: [
        {
          type: "link",
          path: "/child1",
          title: "Child 1",
        },
      ],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const childItem = container.querySelector("[data-testid='sidebar-item']")
    expect(childItem).not.toBeInTheDocument()
  })

  test("renders loading when showLoadingIfEmpty is true and no children", async () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      initialOpen: true,
      loaded: false,
      showLoadingIfEmpty: true,
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    await waitFor(() => {
      const loading = container.querySelector("[data-testid='loading']")
      expect(loading).toBeInTheDocument()
    })
  })

  test("applies break-words for multi-word titles", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category Title",
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const clickableDiv = container.querySelector(
      "[data-testid='sidebar-item-category']"
    )
    expect(clickableDiv).toHaveClass("break-words")
  })

  test("applies truncate for single-word titles", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Category",
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass("truncate")
  })

  test("applies custom className", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(
      <SidebarItemCategory item={item} className="custom-class" />
    )
    const category = container.querySelector(
      "[data-testid='sidebar-item-category-container']"
    )
    expect(category).toHaveClass("custom-class")
  })
})

describe("interactions", () => {
  test("toggles open state when clicked", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const clickableDiv = container.querySelector(
      "[data-testid='sidebar-item-category']"
    )
    const upIcon = container.querySelector("[data-testid='triangle-up-icon']")
    expect(upIcon).toBeInTheDocument()
    fireEvent.click(clickableDiv!)
    const downIcon = container.querySelector(
      "[data-testid='triangle-down-icon']"
    )
    expect(downIcon).toBeInTheDocument()
  })

  test("calls onOpen when opening", () => {
    const mockOnOpen = vi.fn()
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      onOpen: mockOnOpen,
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const clickableDiv = container.querySelector(
      "[data-testid='sidebar-item-category']"
    )
    fireEvent.click(clickableDiv!)
    expect(mockOnOpen).toHaveBeenCalledTimes(1)
  })

  test("does not call onOpen when closing", () => {
    const mockOnOpen = vi.fn()
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      initialOpen: true,
      onOpen: mockOnOpen,
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const clickableDiv = container.querySelector(
      "[data-testid='sidebar-item-category']"
    )
    fireEvent.click(clickableDiv!)
    expect(mockOnOpen).not.toHaveBeenCalled()
  })

  test("updates persisted state when persistCategoryState is true", () => {
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      persistCategoryState: true,
    })
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const clickableDiv = container.querySelector(
      "[data-testid='sidebar-item-category']"
    )
    fireEvent.click(clickableDiv!)
    expect(mockUpdatePersistedCategoryState).toHaveBeenCalledWith(
      "Test Category",
      true
    )
  })

  test("opens category when active", async () => {
    mockIsItemActive.mockReturnValue(true)
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    await waitFor(() => {
      const downIcon = container.querySelector(
        "[data-testid='triangle-down-icon']"
      )
      expect(downIcon).toBeInTheDocument()
    })
  })

  test("uses persisted state when persistCategoryState is true", () => {
    mockGetPersistedCategoryState.mockReturnValue(true)
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      persistCategoryState: true,
    })
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(<SidebarItemCategory item={item} />)
    const downIcon = container.querySelector(
      "[data-testid='triangle-down-icon']"
    )
    expect(downIcon).toBeInTheDocument()
  })
})
