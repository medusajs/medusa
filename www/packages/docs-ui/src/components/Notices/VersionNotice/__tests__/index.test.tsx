import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { BadgeProps } from "../../../Badge"
import { TooltipProps } from "../../../Tooltip"

// mock components
vi.mock("@/components/Tooltip", () => ({
  Tooltip: ({ tooltipChildren, children }: TooltipProps) => (
    <div data-testid="tooltip">
      <div data-testid="tooltip-children">{tooltipChildren}</div>
      <div data-testid="children">{children}</div>
    </div>
  ),
}))

vi.mock("@/components/Badge", () => ({
  Badge: ({ children, className }: BadgeProps) => (
    <div data-testid="badge" className={className}>
      {children}
    </div>
  ),
}))

import { VersionNotice } from "../index"

describe("render", () => {
  test("renders with default props", () => {
    const { container } = render(<VersionNotice version="1.0.0" />)
    expect(container).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    const tooltipChildren = container.querySelector(
      "[data-testid='tooltip-children']"
    )
    expect(tooltipChildren).toBeInTheDocument()
    expect(tooltipChildren).toHaveTextContent(
      "This is available starting from Medusa v1.0.0"
    )
  })

  test("renders with tooltipTextClassName", () => {
    const { container } = render(
      <VersionNotice version="1.0.0" tooltipTextClassName="text-red-500" />
    )
    expect(container).toBeInTheDocument()
    const tooltipChildren = container.querySelector(
      "[data-testid='tooltip-children']"
    )
    expect(tooltipChildren).toBeInTheDocument()
    const child = tooltipChildren?.firstChild
    expect(child).toBeInTheDocument()
    expect(child).toHaveClass("text-red-500")
  })

  test("renders with badgeClassName", () => {
    const { container } = render(
      <VersionNotice version="1.0.0" badgeClassName="text-red-500" />
    )
    expect(container).toBeInTheDocument()
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("text-red-500")
  })

  test("renders with badgeContent", () => {
    const { container } = render(
      <VersionNotice version="1.0.0" badgeContent="Custom badge content" />
    )
    expect(container).toBeInTheDocument()
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("Custom badge content")
  })
})
