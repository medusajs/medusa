import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { Sidebar } from "types"

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

vi.mock("@/components/Sidebar/Item", () => ({
  SidebarItem: ({ item }: { item: Sidebar.SidebarItem }) => (
    <div data-testid="sidebar-item">
      {"title" in item ? item.title : item.type}
    </div>
  ),
}))

import { SidebarItemSubCategory } from "../../SubCategory"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders subcategory item", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Sub Category",
    }
    const { container } = render(<SidebarItemSubCategory item={item} />)
    const listItem = container.querySelector("li")
    expect(listItem).toBeInTheDocument()
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Sub Category")
  })

  test("renders badge when provided", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Sub Category",
      badge: { text: "New", variant: "blue" },
    }
    const { container } = render(<SidebarItemSubCategory item={item} />)
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("New")
    expect(badge).toHaveAttribute("data-variant", "blue")
  })

  test("renders additional elements when provided", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Sub Category",
      additionalElms: <span data-testid="additional">Additional</span>,
    }
    const { container } = render(<SidebarItemSubCategory item={item} />)
    const additional = container.querySelector("[data-testid='additional']")
    expect(additional).toBeInTheDocument()
  })

  test("renders children when provided", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Sub Category",
      children: [
        {
          type: "link",
          path: "/child1",
          title: "Child 1",
        },
      ],
    }
    const { container } = render(<SidebarItemSubCategory item={item} />)
    const childItem = container.querySelector("[data-testid='sidebar-item']")
    expect(childItem).toBeInTheDocument()
    expect(childItem).toHaveTextContent("Child 1")
  })

  test("does not render children when hideChildren is true", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Sub Category",
      hideChildren: true,
      children: [
        {
          type: "link",
          path: "/child1",
          title: "Child 1",
        },
      ],
    }
    const { container } = render(<SidebarItemSubCategory item={item} />)
    const childItem = container.querySelector("[data-testid='sidebar-item']")
    expect(childItem).not.toBeInTheDocument()
  })

  test("applies nested styles when nested is true", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Sub Category",
    }
    const { container } = render(
      <SidebarItemSubCategory item={item} nested={true} />
    )
    const itemContainer = container.querySelector(
      "[data-testid='sidebar-item-container']"
    )
    expect(itemContainer).toHaveClass("text-medusa-fg-muted")
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toHaveClass("pl-docs_1.5")
  })

  test("applies subtle styles when nested is false", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Sub Category",
    }
    const { container } = render(
      <SidebarItemSubCategory item={item} nested={false} />
    )
    const itemContainer = container.querySelector(
      "[data-testid='sidebar-item-container']"
    )
    expect(itemContainer).toHaveClass("text-medusa-fg-subtle")
  })

  test("applies break-words for multi-word titles", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Sub Category Title",
    }
    const { container } = render(<SidebarItemSubCategory item={item} />)
    const itemContainer = container.querySelector(
      "[data-testid='sidebar-item-container']"
    )
    expect(itemContainer).toHaveClass("break-words")
  })

  test("applies truncate for single-word titles", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Subcategory",
    }
    const { container } = render(<SidebarItemSubCategory item={item} />)
    const title = container.querySelector("[data-testid='sidebar-item-title']")
    expect(title).toHaveClass("truncate")
  })

  test("applies custom className", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Sub Category",
    }
    const { container } = render(
      <SidebarItemSubCategory item={item} className="custom-class" />
    )
    const span = container.querySelector(
      "[data-testid='sidebar-item-container']"
    )
    expect(span).toHaveClass("custom-class")
  })
})
