import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock components
vi.mock("next/link", () => ({
  default: ({
    href,
    className,
    children,
    onClick,
    target,
    rel,
  }: {
    href: string
    className?: string
    children: React.ReactNode
    onClick?: () => void
    target?: string
    rel?: string
  }) => (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
      }}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  ),
}))

// mock data
const mockItem = {
  type: "link" as const,
  title: "Test Link",
  link: "/test",
  icon: <span data-testid="link-icon">Icon</span>,
}

// mock functions
const mockOnClick = vi.fn()

import { MenuItem } from "../../Item"

beforeEach(() => {
  mockOnClick.mockClear()
})

describe("rendering", () => {
  test("renders link item", () => {
    const { container } = render(<MenuItem item={mockItem} />)
    const link = container.querySelector("a")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
    expect(link).toHaveTextContent("Test Link")
    const icon = container.querySelector("[data-testid='link-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("does not render icon when not provided", () => {
    const itemWithoutIcon = {
      ...mockItem,
      icon: undefined,
    }
    const { container } = render(<MenuItem item={itemWithoutIcon} />)
    const icon = container.querySelector("[data-testid='link-icon']")
    expect(icon).not.toBeInTheDocument()
  })

  test("opens in new tab when openInNewTab is true", () => {
    const itemWithNewTab = {
      ...mockItem,
      openInNewTab: true,
    }
    const { container } = render(<MenuItem item={itemWithNewTab} />)
    const link = container.querySelector("a")
    expect(link).toHaveAttribute("target", "_blank")
    expect(link).toHaveAttribute("rel", "noopener noreferrer")
  })

  test("does not open in new tab when openInNewTab is false", () => {
    const { container } = render(<MenuItem item={mockItem} />)
    const link = container.querySelector("a")
    expect(link).not.toHaveAttribute("target", "_blank")
    expect(link).not.toHaveAttribute("rel", "noopener noreferrer")
  })
})

describe("interaction", () => {
  test("calls onClick callback when provided", () => {
    const { container } = render(
      <MenuItem item={mockItem} onClick={mockOnClick} />
    )
    const link = container.querySelector("a")
    fireEvent.click(link!)
    expect(mockOnClick).toHaveBeenCalledWith(mockItem)
  })
})
