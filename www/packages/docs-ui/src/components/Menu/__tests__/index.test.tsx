import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { MenuItem } from "types"

// mock data
const mockItems: MenuItem[] = [
  {
    type: "link" as const,
    title: "Link Item",
    link: "/link",
  },
  {
    type: "action" as const,
    title: "Action Item",
    action: vi.fn(),
    icon: <div data-testid="action-icon">Action Icon</div>,
  },
  {
    type: "divider" as const,
  },
  {
    type: "custom" as const,
    content: <div data-testid="custom-content">Custom Content</div>,
  },
  {
    type: "sub-menu" as const,
    title: "Sub Menu",
    items: [
      {
        type: "link" as const,
        title: "Sub Item",
        link: "/sub",
      },
    ],
  },
]

// mock functions
const mockItemsOnClick = vi.fn()

// mock components
vi.mock("@/components/Menu/Item", () => ({
  MenuItem: ({
    item,
  }: {
    item: { title: string; link: string; type: string }
  }) => <div data-testid="menu-item">{item.title}</div>,
}))

vi.mock("@/components/Menu/Action", () => ({
  MenuAction: ({
    item,
  }: {
    item: { title: string; action: () => void; type: string }
  }) => <div data-testid="menu-action">{item.title}</div>,
}))

vi.mock("@/components/Menu/Divider", () => ({
  MenuDivider: () => <div data-testid="menu-divider" />,
}))

vi.mock("@/components/Menu/SubMenu", () => ({
  MenuSubMenu: ({
    item,
  }: {
    item: { title: string; type: string; items: unknown[] }
  }) => <div data-testid="menu-submenu">{item.title}</div>,
}))

import { Menu } from "../../Menu"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders link items", () => {
    const { container } = render(<Menu items={mockItems} />)
    const linkItem = container.querySelector("[data-testid='menu-item']")
    expect(linkItem).toBeInTheDocument()
    expect(linkItem).toHaveTextContent("Link Item")
  })

  test("renders action items", () => {
    const { container } = render(<Menu items={mockItems} />)
    const actionItem = container.querySelector("[data-testid='menu-action']")
    expect(actionItem).toBeInTheDocument()
    expect(actionItem).toHaveTextContent("Action Item")
  })

  test("renders divider items", () => {
    const { container } = render(<Menu items={mockItems} />)
    const divider = container.querySelector("[data-testid='menu-divider']")
    expect(divider).toBeInTheDocument()
  })

  test("renders custom content", () => {
    const { container } = render(<Menu items={mockItems} />)
    const customContent = container.querySelector(
      "[data-testid='custom-content']"
    )
    expect(customContent).toBeInTheDocument()
    expect(customContent).toHaveTextContent("Custom Content")
  })

  test("renders sub-menu items", () => {
    const { container } = render(<Menu items={mockItems} />)
    const subMenu = container.querySelector("[data-testid='menu-submenu']")
    expect(subMenu).toBeInTheDocument()
    expect(subMenu).toHaveTextContent("Sub Menu")
  })

  test("applies custom className", () => {
    const { container } = render(
      <Menu items={mockItems} className="custom-class" />
    )
    const menu = container.querySelector("[data-testid='menu']")
    expect(menu).toHaveClass("custom-class")
  })
})
