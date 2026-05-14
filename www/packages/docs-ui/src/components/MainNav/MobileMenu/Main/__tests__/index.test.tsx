import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

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
}

// mock functions
const mockUseMainNav = vi.fn(() => defaultUseMainNavReturn)
const mockSetSelectedMenus = vi.fn()
const mockOnOpenLink = vi.fn()

// mock components
vi.mock("@/providers/MainNav", () => ({
  useMainNav: () => mockUseMainNav(),
}))

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
        // can't perform actual navigation in tests
        e.preventDefault()
        onClick?.()
      }}
    >
      {children}
    </a>
  ),
}))

import { MainNavMobileMainMenu } from "../../Main"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("default render", () => {
    const { container } = render(
      <MainNavMobileMainMenu
        setSelectedMenus={mockSetSelectedMenus}
        onOpenLink={mockOnOpenLink}
      />
    )
    const link = container.querySelector("a[href='/home']")
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent("Home")
    const icon = container.querySelector("[data-testid='triangle-icon']")
    expect(icon).toBeInTheDocument()
  })
})

describe("interaction", () => {
  test("calls onOpenLink when link is clicked", () => {
    const { container } = render(
      <MainNavMobileMainMenu
        setSelectedMenus={mockSetSelectedMenus}
        onOpenLink={mockOnOpenLink}
      />
    )
    const link = container.querySelector("a[href='/home']")
    fireEvent.click(link!)
    expect(mockOnOpenLink).toHaveBeenCalledTimes(1)
  })

  test("sets selected menu when dropdown is clicked", () => {
    const { container } = render(
      <MainNavMobileMainMenu
        setSelectedMenus={mockSetSelectedMenus}
        onOpenLink={mockOnOpenLink}
      />
    )
    const dropdownItem = Array.from(container.querySelectorAll("li")).find(
      (li) => li.textContent?.includes("Docs")
    )
    fireEvent.click(dropdownItem!)
    expect(mockSetSelectedMenus).toHaveBeenCalledTimes(1)
  })

  test("does not set selected menu when link is clicked", () => {
    const { container } = render(
      <MainNavMobileMainMenu
        setSelectedMenus={mockSetSelectedMenus}
        onOpenLink={mockOnOpenLink}
      />
    )
    const link = container.querySelector("a[href='/home']")
    fireEvent.click(link!)
    expect(mockSetSelectedMenus).not.toHaveBeenCalled()
  })
})
