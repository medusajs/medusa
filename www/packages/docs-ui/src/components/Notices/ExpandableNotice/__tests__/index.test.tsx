import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { BadgeProps } from "../../../Badge"
import { TooltipProps } from "../../../Tooltip"
import { LinkProps } from "../../../Link"

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

vi.mock("@/components/Link", () => ({
  Link: (props: LinkProps) => <a {...props} data-testid="link" />,
}))

import { ExpandableNotice } from "../index"

describe("render", () => {
  test("renders request type by default", () => {
    const { container } = render(
      <ExpandableNotice link="https://example.com" />
    )
    expect(container).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    const tooltipChildren = container.querySelector(
      "[data-testid='tooltip-children']"
    )
    expect(tooltipChildren).toBeInTheDocument()
    expect(tooltipChildren).toHaveTextContent(
      "If this request accepts an expand parameter, this relation can be expanded into an object."
    )
  })

  test("renders method type", () => {
    const { container } = render(
      <ExpandableNotice type="method" link="https://example.com" />
    )
    expect(container).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    const tooltipChildren = container.querySelector(
      "[data-testid='tooltip-children']"
    )
    expect(tooltipChildren).toBeInTheDocument()
    expect(tooltipChildren).toHaveTextContent(
      "If this method accepts an expand parameter or property, this relation can be expanded into an object."
    )
  })

  test("renders workflow type", () => {
    const { container } = render(
      <ExpandableNotice type="workflow" link="https://example.com" />
    )
    expect(container).toBeInTheDocument()
    const tooltip = container.querySelector("[data-testid='tooltip']")
    expect(tooltip).toBeInTheDocument()
    const tooltipChildren = container.querySelector(
      "[data-testid='tooltip-children']"
    )
    expect(tooltipChildren).toBeInTheDocument()
    expect(tooltipChildren).toHaveTextContent(
      "If this workflow accepts an expand parameter or property, this relation can be expanded into an object."
    )
  })

  test("renders with badgeContent", () => {
    const { container } = render(
      <ExpandableNotice
        badgeContent="Custom badge content"
        link="https://example.com"
      />
    )
    expect(container).toBeInTheDocument()
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent("Custom badge content")
  })

  test("renders with badgeClassName", () => {
    const { container } = render(
      <ExpandableNotice
        badgeClassName="text-red-500"
        link="https://example.com"
      />
    )
    expect(container).toBeInTheDocument()
    const badge = container.querySelector("[data-testid='badge']")
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass("text-red-500")
  })
})
