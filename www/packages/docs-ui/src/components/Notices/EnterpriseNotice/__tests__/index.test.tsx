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

import { EnterpriseNotice } from "../index"

describe("render", () => {
  test("renders the default badge content and license text", () => {
    const { container } = render(<EnterpriseNotice />)
    expect(container).toBeInTheDocument()

    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()

    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("Enterprise")

    const tooltipChildren = container.querySelector(
      "[data-testid='tooltip-children']"
    )
    expect(tooltipChildren).toBeInTheDocument()
    expect(tooltipChildren).toHaveTextContent(
      "This feature requires an enterprise license."
    )
  })

  test("uses the featureName in the tooltip text", () => {
    const { container } = render(
      <EnterpriseNotice featureName="RBAC Module" />
    )
    const tooltipChildren = container.querySelector(
      "[data-testid='tooltip-children']"
    )
    expect(tooltipChildren).toBeInTheDocument()
    expect(tooltipChildren).toHaveTextContent(
      "This RBAC Module requires an enterprise license."
    )
  })

  test("mentions the feature flag when provided", () => {
    const { container } = render(
      <EnterpriseNotice featureName="RBAC Module" featureFlag="rbac" />
    )
    const tooltipChildren = container.querySelector(
      "[data-testid='tooltip-children']"
    )
    expect(tooltipChildren).toBeInTheDocument()
    expect(tooltipChildren).toHaveTextContent(
      "You must also enable its feature flag: rbac"
    )
  })

  test("omits the feature flag text when not provided", () => {
    const { container } = render(<EnterpriseNotice />)
    const tooltipChildren = container.querySelector(
      "[data-testid='tooltip-children']"
    )
    expect(tooltipChildren).toBeInTheDocument()
    expect(tooltipChildren).not.toHaveTextContent("feature flag")
  })

  test("renders with tooltipTextClassName", () => {
    const { container } = render(
      <EnterpriseNotice tooltipTextClassName="text-red-500" />
    )
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
      <EnterpriseNotice badgeClassName="text-red-500" />
    )
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("text-red-500")
  })

  test("renders with badgeContent", () => {
    const { container } = render(
      <EnterpriseNotice badgeContent="Custom badge content" />
    )
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("Custom badge content")
  })
})
