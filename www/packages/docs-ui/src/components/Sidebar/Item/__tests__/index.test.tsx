import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { Sidebar } from "types"

// mock components
vi.mock("@/components/Sidebar/Item/Link", () => ({
  SidebarItemLink: ({ item }: { item: Sidebar.SidebarItemLink }) => (
    <div data-testid="sidebar-item-link">{item.title}</div>
  ),
}))

vi.mock("@/components/Sidebar/Item/Category", () => ({
  SidebarItemCategory: ({ item }: { item: Sidebar.SidebarItemCategory }) => (
    <div data-testid="sidebar-item-category">{item.title}</div>
  ),
}))

vi.mock("@/components/Sidebar/Item/SubCategory", () => ({
  SidebarItemSubCategory: ({
    item,
  }: {
    item: Sidebar.SidebarItemSubCategory
  }) => <div data-testid="sidebar-item-subcategory">{item.title}</div>,
}))

vi.mock("@/components/Sidebar/Item/Sidebar", () => ({
  SidebarItemSidebar: ({ item }: { item: Sidebar.SidebarItemSidebar }) => (
    <div data-testid="sidebar-item-sidebar">{item.title}</div>
  ),
}))

vi.mock("@/components/DottedSeparator", () => ({
  DottedSeparator: () => <div data-testid="dotted-separator">Separator</div>,
}))

import { SidebarItem } from "../../Item"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders link item", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "link",
      path: "/test",
      title: "Test Link",
    }
    const { container } = render(<SidebarItem item={item} />)
    const link = container.querySelector("[data-testid='sidebar-item-link']")
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent("Test Link")
  })

  test("renders ref item", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "ref",
      path: "/test",
      title: "Test Ref",
    }
    const { container } = render(<SidebarItem item={item} />)
    const link = container.querySelector("[data-testid='sidebar-item-link']")
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent("Test Ref")
  })

  test("renders external item", () => {
    const item: Sidebar.SidebarItemLink = {
      type: "external",
      path: "https://example.com",
      title: "External Link",
    }
    const { container } = render(<SidebarItem item={item} />)
    const link = container.querySelector("[data-testid='sidebar-item-link']")
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent("External Link")
  })

  test("renders category item", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(<SidebarItem item={item} />)
    const category = container.querySelector(
      "[data-testid='sidebar-item-category']"
    )
    expect(category).toBeInTheDocument()
    expect(category).toHaveTextContent("Test Category")
  })

  test("renders subcategory item", () => {
    const item: Sidebar.SidebarItemSubCategory = {
      type: "sub-category",
      title: "Test SubCategory",
    }
    const { container } = render(<SidebarItem item={item} />)
    const subcategory = container.querySelector(
      "[data-testid='sidebar-item-subcategory']"
    )
    expect(subcategory).toBeInTheDocument()
    expect(subcategory).toHaveTextContent("Test SubCategory")
  })

  test("renders sidebar item", () => {
    const item: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "test-sidebar",
      title: "Test Sidebar",
      children: [],
    }
    const { container } = render(<SidebarItem item={item} />)
    const sidebar = container.querySelector(
      "[data-testid='sidebar-item-sidebar']"
    )
    expect(sidebar).toBeInTheDocument()
    expect(sidebar).toHaveTextContent("Test Sidebar")
  })

  test("renders separator item", () => {
    const item: Sidebar.SidebarItemSeparator = {
      type: "separator",
    }
    const { container } = render(<SidebarItem item={item} />)
    const separator = container.querySelector(
      "[data-testid='dotted-separator']"
    )
    expect(separator).toBeInTheDocument()
  })

  test("renders dotted separator after category when hasNextItems is true", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(
      <SidebarItem item={item} hasNextItems={true} />
    )
    const separator = container.querySelector(
      "[data-testid='dotted-separator']"
    )
    expect(separator).toBeInTheDocument()
  })

  test("does not render dotted separator after category when hasNextItems is false", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(
      <SidebarItem item={item} hasNextItems={false} />
    )
    const separator = container.querySelector(
      "[data-testid='dotted-separator']"
    )
    expect(separator).not.toBeInTheDocument()
  })

  test("passes props to nested component", () => {
    const item: Sidebar.SidebarItemCategory = {
      type: "category",
      title: "Test Category",
      children: [],
    }
    const { container } = render(
      <SidebarItem item={item} nested={true} className="custom-class" />
    )
    const category = container.querySelector(
      "[data-testid='sidebar-item-category']"
    )
    expect(category).toBeInTheDocument()
  })
})
