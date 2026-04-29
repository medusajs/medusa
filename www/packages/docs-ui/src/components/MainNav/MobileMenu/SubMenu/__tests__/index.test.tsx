import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { MenuItem } from "types"

// mock data
const mockMenu: MenuItem[] = [
  {
    type: "link" as const,
    title: "Getting Started",
    link: "/docs/getting-started",
  },
  {
    type: "sub-menu" as const,
    title: "Advanced",
    items: [
      {
        type: "link" as const,
        title: "API Reference",
        link: "/docs/api",
      },
    ],
  },
  {
    type: "divider" as const,
  },
]

// mock functions
const mockSetSelectedMenus = vi.fn()
const mockOnOpenLink = vi.fn()

// mock components
vi.mock("next/link", () => ({
  default: ({
    href,
    className,
    children,
    onClick,
    ...props
  }: {
    href: string
    className?: string
    children: React.ReactNode
    onClick?: () => void
    [key: string]: unknown
  }) => (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        // can't perform actual navigation in tests
        e.preventDefault()
        onClick?.()
      }}
      {...props}
    >
      {children}
    </a>
  ),
}))

import { MainNavMobileSubMenu } from "../../SubMenu"

beforeEach(() => {
  mockSetSelectedMenus.mockClear()
  mockOnOpenLink.mockClear()
})

describe("rendering", () => {
  test("renders menu title", () => {
    const { container } = render(
      <MainNavMobileSubMenu
        menu={mockMenu}
        title="Docs"
        setSelectedMenus={mockSetSelectedMenus}
        onOpenLink={mockOnOpenLink}
      />
    )
    const title = container.querySelector("[data-testid='menu-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Docs")
    const link = container.querySelector("[data-testid='link-item']")
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent("Getting Started")
    expect(link).toHaveAttribute("href", "/docs/getting-started")
    const subMenu = container.querySelector("[data-testid='sub-menu-item']")
    expect(subMenu).toBeInTheDocument()
    expect(subMenu).toHaveTextContent("Advanced")
  })

  test("filters out divider items", () => {
    const { container } = render(
      <MainNavMobileSubMenu
        menu={mockMenu}
        title="Docs"
        setSelectedMenus={mockSetSelectedMenus}
        onOpenLink={mockOnOpenLink}
      />
    )
    const listItems = container.querySelectorAll("li")
    expect(listItems).toHaveLength(2) // Only link and sub-menu, not divider
  })
})

describe("interaction", () => {
  test("calls onOpenLink when link is clicked", () => {
    const { container } = render(
      <MainNavMobileSubMenu
        menu={mockMenu}
        title="Docs"
        setSelectedMenus={mockSetSelectedMenus}
        onOpenLink={mockOnOpenLink}
      />
    )
    const link = container.querySelector("[data-testid='link-item']")
    fireEvent.click(link!)
    expect(mockOnOpenLink).toHaveBeenCalledTimes(1)
  })

  test("sets selected menu when sub-menu is clicked", () => {
    const { container } = render(
      <MainNavMobileSubMenu
        menu={mockMenu}
        title="Docs"
        setSelectedMenus={mockSetSelectedMenus}
        onOpenLink={mockOnOpenLink}
      />
    )
    const subMenu = container.querySelector("[data-testid='sub-menu-item']")
    fireEvent.click(subMenu!)
    expect(mockSetSelectedMenus).toHaveBeenCalledTimes(1)
  })
})
