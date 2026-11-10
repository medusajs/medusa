import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { BadgeProps } from "../../Badge"
import { TooltipProps } from "../../Tooltip"

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

import { PermissionsBadge } from "../index"

describe("render", () => {
  test("renders one badge per permission", () => {
    const { container } = render(
      <PermissionsBadge
        permissions={["product:create", "product:update"]}
      />
    )
    expect(container).toBeInTheDocument()

    const badges = container.querySelectorAll("[data-testid='badge']")
    expect(badges).toHaveLength(2)
    expect(badges[0]).toHaveTextContent("product:create")
    expect(badges[1]).toHaveTextContent("product:update")
  })

  test("renders the all-of label for multiple permissions by default", () => {
    const { container } = render(
      <PermissionsBadge
        permissions={["product:create", "product:update"]}
      />
    )
    // the label is rendered outside the tooltip, in the wrapper
    expect(container).toHaveTextContent("Requires policies (all of):")
  })

  test("renders the any-of label when requireAll is false", () => {
    const { container } = render(
      <PermissionsBadge
        permissions={["order:read", "order:update"]}
        requireAll={false}
      />
    )
    expect(container).toHaveTextContent("Requires policies (any of):")
  })

  test("renders the singular label for a single permission", () => {
    const { container } = render(
      <PermissionsBadge permissions={["customer:read"]} />
    )
    expect(container).toHaveTextContent("Requires policy:")

    const badges = container.querySelectorAll("[data-testid='badge']")
    expect(badges).toHaveLength(1)
    expect(badges[0]).toHaveTextContent("customer:read")
  })

  test("uses a custom label when provided", () => {
    const { container } = render(
      <PermissionsBadge
        permissions={["product:read"]}
        label="Needed policy:"
      />
    )
    expect(container).toHaveTextContent("Needed policy:")
    expect(container).not.toHaveTextContent("Requires policy:")
  })

  test("renders nothing when no permissions are passed", () => {
    const { container } = render(<PermissionsBadge permissions={[]} />)
    expect(
      container.querySelector("[data-testid='tooltip']")
    ).not.toBeInTheDocument()
    expect(
      container.querySelector("[data-testid='badge']")
    ).not.toBeInTheDocument()
  })

  test("applies a custom className to the wrapper", () => {
    const { container } = render(
      <PermissionsBadge
        permissions={["product:read"]}
        className="text-red-500"
      />
    )
    // the wrapper span is the outermost rendered element
    expect(container.firstChild).toHaveClass("text-red-500")
  })
})
