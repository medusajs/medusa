import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock data
const mockItem = {
  type: "sub-menu" as const,
  title: "Item",
  link: "/item",
  items: [
    {
      type: "link" as const,
      title: "Sub Item",
      link: "/sub-item",
    },
  ],
}

const mockItemWithoutLink = {
  type: "sub-menu" as const,
  title: "Item",
  items: [
    {
      type: "link" as const,
      title: "Sub Item",
      link: "/sub-item",
    },
  ],
}

// mock functions
const mockItemsOnClick = vi.fn()

// mock components
vi.mock("next/link", () => ({
  default: ({
    href,
    className,
    children,
    onClick,
  }: {
    href: string
    className?: string
    children: React.ReactNode
    onClick?: () => void
  }) => (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
      }}
      data-testid="menu-item"
    >
      {children}
    </a>
  ),
}))

vi.mock("@medusajs/icons", () => ({
  TriangleRightMini: () => <svg data-testid="triangle-icon" />,
}))

vi.mock("@/components/Menu", () => ({
  Menu: ({ items }: { items: unknown[] }) => (
    <div data-testid="sub-menu-menu">
      {items.map((item: unknown, index: number) => (
        <div key={index} data-testid={`sub-menu-item`}>
          {JSON.stringify(item)}
        </div>
      ))}
    </div>
  ),
}))

import { MenuSubMenu } from "../../SubMenu"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders item", () => {
    const { container } = render(
      <MenuSubMenu item={mockItem} itemsOnClick={mockItemsOnClick} />
    )
    const item = container.querySelector("[data-testid='menu-item']")
    expect(item).toBeInTheDocument()
    expect(item).toHaveTextContent("Item")
    const icon = container.querySelector("[data-testid='triangle-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders as Link when item has link", () => {
    const { container } = render(
      <MenuSubMenu item={mockItem} itemsOnClick={mockItemsOnClick} />
    )
    const link = container.querySelector("a")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/item")
  })

  test("renders as span when item has no link", () => {
    const { container } = render(
      <MenuSubMenu item={mockItemWithoutLink} itemsOnClick={mockItemsOnClick} />
    )
    const span = container.querySelector("span")
    expect(span).toBeInTheDocument()
    expect(span).toHaveTextContent("Item")
  })

  test("hides sub-menu when not hovered", () => {
    const { container } = render(
      <MenuSubMenu item={mockItem} itemsOnClick={mockItemsOnClick} />
    )
    const subMenu = container.querySelector("[data-testid='sub-menu-menu']")
    expect(subMenu).not.toBeInTheDocument()
  })
})

describe("interaction", () => {
  test("shows sub-menu when hovered", () => {
    const { container } = render(
      <MenuSubMenu item={mockItem} itemsOnClick={mockItemsOnClick} />
    )
    const wrapper = container.querySelector("[data-testid='sub-menu-wrapper']")
    fireEvent.mouseOver(wrapper!)
    const subMenu = container.querySelector("[data-testid='sub-menu-menu']")
    expect(subMenu).toBeInTheDocument()
  })

  test("hides sub-menu when mouse leaves", () => {
    const { container } = render(
      <MenuSubMenu item={mockItem} itemsOnClick={mockItemsOnClick} />
    )
    const wrapper = container.querySelector("[data-testid='sub-menu-wrapper']")
    fireEvent.mouseOver(wrapper!)
    let subMenu = container.querySelector("[data-testid='sub-menu-menu']")
    expect(subMenu).toBeInTheDocument()

    fireEvent.mouseLeave(wrapper!)
    subMenu = container.querySelector("[data-testid='sub-menu-menu']")
    expect(subMenu).not.toBeInTheDocument()
  })

  test("calls itemsOnClick when clicked", () => {
    const { container } = render(
      <MenuSubMenu item={mockItem} itemsOnClick={mockItemsOnClick} />
    )
    const component = container.querySelector("[data-testid='menu-item']")
    fireEvent.click(component!)
    expect(mockItemsOnClick).toHaveBeenCalledWith(mockItem)
  })
})
