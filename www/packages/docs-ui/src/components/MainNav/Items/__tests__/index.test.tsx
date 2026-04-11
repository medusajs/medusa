import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock data
const mockNavItems = [
  {
    type: "link" as const,
    title: "Home",
    link: "/home",
  },
  {
    type: "dropdown" as const,
    title: "Docs",
    children: [
      {
        type: "link" as const,
        title: "Getting Started",
        link: "/docs/getting-started",
      },
    ],
  },
]

const defaultUseMainNavReturn = {
  navItems: mockNavItems,
  activeItemIndex: 0,
  activeItem: mockNavItems[0],
}

// mock functions
const mockUseMainNav = vi.fn(() => defaultUseMainNavReturn)

// mock components
vi.mock("@/providers/MainNav", () => ({
  useMainNav: () => mockUseMainNav(),
}))

vi.mock("@/components/MainNav/Items/Link", () => ({
  MainNavItemLink: ({
    item,
    isActive,
  }: {
    item: { title: string; link: string; type: string }
    isActive: boolean
  }) => (
    <a href={item.link} data-testid="nav-link" data-active={isActive}>
      {item.title}
    </a>
  ),
}))

vi.mock("@/components/MainNav/Items/Dropdown", () => ({
  MainNavItemDropdown: ({
    item,
    isActive,
  }: {
    item: { title: string; type: string; children: Record<string, string>[] }
    isActive: boolean
  }) => (
    <div data-testid="nav-dropdown" data-active={isActive}>
      {item.title}
      {item.children.map((child, index) => (
        <div
          key={index}
          data-testid={`nav-dropdown-child`}
          data-active={isActive}
          data-href={child.link}
        >
          {child.title}
        </div>
      ))}
    </div>
  ),
}))

import { MainNavItems } from "../../Items"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders list of nav items", () => {
    const { container } = render(<MainNavItems />)
    const list = container.querySelector("ul")
    expect(list).toBeInTheDocument()
    const links = container.querySelectorAll("[data-testid='nav-link']")
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveTextContent("Home")
    expect(links[0]).toHaveAttribute("href", "/home")
    expect(links[0]).toHaveAttribute("data-active", "true")
    const dropdowns = container.querySelectorAll("[data-testid='nav-dropdown']")
    expect(dropdowns).toHaveLength(1)
    expect(dropdowns[0]).toHaveTextContent("Docs")
    expect(dropdowns[0]).toHaveAttribute("data-active", "false")
    const dropdownChildren = container.querySelectorAll(
      "[data-testid='nav-dropdown-child']"
    )
    expect(dropdownChildren).toHaveLength(1)
    expect(dropdownChildren[0]).toHaveTextContent("Getting Started")
    expect(dropdownChildren[0]).toHaveAttribute(
      "data-href",
      "/docs/getting-started"
    )
    expect(dropdownChildren[0]).toHaveAttribute("data-active", "false")
  })

  test("marks active item", () => {
    const { container } = render(<MainNavItems />)
    const links = container.querySelectorAll("[data-testid='nav-link']")
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute("data-active", "true")
  })

  test("marks inactive items", () => {
    mockUseMainNav.mockReturnValueOnce({
      ...defaultUseMainNavReturn,
      activeItemIndex: 1,
    })
    const { container } = render(<MainNavItems />)
    const links = container.querySelectorAll("[data-testid='nav-link']")
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute("data-active", "false")
  })

  test("applies custom className", () => {
    const { container } = render(<MainNavItems className="custom-class" />)
    const list = container.querySelector("ul")
    expect(list).toHaveClass("custom-class")
  })
})
