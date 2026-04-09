import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { Sidebar } from "types"

// mock hooks
const mockGoBack = vi.fn()

const mockShownSidebar: Sidebar.Sidebar = {
  sidebar_id: "test-sidebar",
  title: "Test Sidebar",
  items: [],
}

const defaultUseSidebarReturn = {
  goBack: mockGoBack,
  shownSidebar: mockShownSidebar as
    | Sidebar.Sidebar
    | Sidebar.SidebarItemSidebar
    | undefined,
}

const mockUseSidebar = vi.fn(() => defaultUseSidebarReturn)

vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}))

// mock components
vi.mock("@medusajs/icons", () => ({
  ArrowUturnLeft: () => <svg data-testid="arrow-icon" />,
}))

import { SidebarChild } from "../../Child"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSidebar.mockReturnValue(defaultUseSidebarReturn)
})

describe("rendering", () => {
  test("renders nothing when shownSidebar is undefined", () => {
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      shownSidebar: undefined,
    })
    const { container } = render(<SidebarChild />)
    expect(container.firstChild).toBeNull()
  })

  test("renders child sidebar component", () => {
    const { container } = render(<SidebarChild />)
    const wrapper = container.querySelector("[data-testid='sidebar-child']")
    expect(wrapper).toBeInTheDocument()
  })

  test("renders arrow icon", () => {
    const { container } = render(<SidebarChild />)
    const icon = container.querySelector("[data-testid='arrow-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders sidebar title", () => {
    const { container } = render(<SidebarChild />)
    const title = container.querySelector("[data-testid='sidebar-child-title']")
    expect(title).toHaveTextContent("Test Sidebar")
  })

  test("renders childSidebarTitle when available", () => {
    const sidebarWithChildTitle: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "child-sidebar",
      title: "Parent Title",
      childSidebarTitle: "Child Title",
      children: [],
    }
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      shownSidebar: sidebarWithChildTitle,
    })
    const { container } = render(<SidebarChild />)
    const title = container.querySelector("[data-testid='sidebar-child-title']")
    expect(title).toHaveTextContent("Child Title")
  })

  test("renders title when childSidebarTitle is not available", () => {
    const sidebarWithoutChildTitle: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "child-sidebar",
      title: "Parent Title",
      children: [],
    }
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      shownSidebar: sidebarWithoutChildTitle,
    })
    const { container } = render(<SidebarChild />)
    const title = container.querySelector("[data-testid='sidebar-child-title']")
    expect(title).toHaveTextContent("Parent Title")
  })

  test("renders title when childSidebarTitle is empty string", () => {
    const sidebarWithEmptyChildTitle: Sidebar.SidebarItemSidebar = {
      type: "sidebar",
      sidebar_id: "child-sidebar",
      title: "Parent Title",
      childSidebarTitle: "",
      children: [],
    }
    mockUseSidebar.mockReturnValue({
      ...defaultUseSidebarReturn,
      shownSidebar: sidebarWithEmptyChildTitle,
    })
    const { container } = render(<SidebarChild />)
    const title = container.querySelector("[data-testid='sidebar-child-title']")
    expect(title).toHaveTextContent("Parent Title")
  })
})

describe("interactions", () => {
  test("calls goBack when clicked", () => {
    const { container } = render(<SidebarChild />)
    const clickableDiv = container.querySelector(
      "[data-testid='sidebar-child-back-button']"
    )
    fireEvent.click(clickableDiv!)
    expect(mockGoBack).toHaveBeenCalledTimes(1)
  })
})
