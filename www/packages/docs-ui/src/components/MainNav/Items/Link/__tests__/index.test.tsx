import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock data
const item = {
  type: "link" as const,
  title: "Test Link",
  link: "/test",
}

// mock components
vi.mock("@/components/LinkButton", () => ({
  LinkButton: ({
    href,
    className,
    variant,
    children,
  }: {
    href: string
    className?: string
    variant?: string
    children: React.ReactNode
  }) => (
    <a
      href={href}
      className={className}
      data-testid="link-button"
      data-variant={variant}
    >
      {children}
    </a>
  ),
}))

import { MainNavItemLink } from "../../Link"

describe("rendering", () => {
  test("renders link with item title", () => {
    const { container } = render(
      <MainNavItemLink item={item} isActive={false} />
    )
    const link = container.querySelector("[data-testid='link-button']")
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/test")
    expect(link).toHaveTextContent("Test Link")
  })

  test("applies active styles when isActive is true", () => {
    const { container } = render(
      <MainNavItemLink item={item} isActive={true} />
    )
    const link = container.querySelector("[data-testid='link-button']")
    expect(link).toHaveAttribute("data-variant", "base")
  })

  test("applies inactive styles when isActive is false", () => {
    const { container } = render(
      <MainNavItemLink item={item} isActive={false} />
    )
    const link = container.querySelector("[data-testid='link-button']")
    expect(link).toHaveAttribute("data-variant", "subtle")
  })

  test("renders icon when provided", () => {
    const item = {
      type: "link" as const,
      title: "Test Link",
      link: "/test",
    }
    const icon = <span data-testid="icon">Icon</span>
    const { container } = render(
      <MainNavItemLink item={item} isActive={false} icon={icon} />
    )
    const iconElement = container.querySelector("[data-testid='icon']")
    expect(iconElement).toBeInTheDocument()
  })

  test("applies custom className", () => {
    const item = {
      type: "link" as const,
      title: "Test Link",
      link: "/test",
    }
    const { container } = render(
      <MainNavItemLink item={item} isActive={false} className="custom-class" />
    )
    const link = container.querySelector("[data-testid='link-button']")
    expect(link).toHaveClass("custom-class")
  })
})
