import React from "react"
import { cleanup, render } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

// mock components
vi.mock("docs-ui", () => ({
  Badge: ({ children, className }: BadgeProps) => (
    <div data-testid="badge" className={className}>{children}</div>
  ),
  Link: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="link">{children}</div>
  ),
  Tooltip: ({ tooltipChildren, children }: TooltipProps) => (
    <div data-testid="tooltip">
      <div data-testid="tooltip-children">{tooltipChildren}</div>
      <div data-testid="children">{children}</div>
    </div>
  ),
}))

import TagsOperationFeatureFlagNotice from ".."
import { BadgeProps, TooltipProps } from "docs-ui"

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders feature flag notice for endpoint type by default", () => {
    const { container } = render(<TagsOperationFeatureFlagNotice featureFlag="test-feature-flag" />)
    const tooltipElement = container.querySelector("[data-testid='tooltip']")
    expect(tooltipElement).toBeInTheDocument()
    const tooltipChildrenElement = container.querySelector("[data-testid='tooltip-children']")
    expect(tooltipChildrenElement).toBeInTheDocument()
    expect(tooltipChildrenElement).toHaveTextContent("To use this endpoint, make sure to enable its feature flag: test-feature-flag")
    
    const badgeElement = container.querySelector("[data-testid='badge']")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("feature flag")
  })

  test("renders feature flag notice for parameter type", () => {
    const { container } = render(<TagsOperationFeatureFlagNotice featureFlag="test-feature-flag" type="parameter" />)
    const tooltipElement = container.querySelector("[data-testid='tooltip']")
    expect(tooltipElement).toBeInTheDocument()
    const tooltipChildrenElement = container.querySelector("[data-testid='tooltip-children']")
    expect(tooltipChildrenElement).toBeInTheDocument()
    expect(tooltipChildrenElement).toHaveTextContent("To use this parameter, make sure to enable its feature flag: test-feature-flag")
    
    const badgeElement = container.querySelector("[data-testid='badge']")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("feature flag")
  })

  test("renders feature flag notice with tooltipTextClassName", () => {
    const { container } = render(<TagsOperationFeatureFlagNotice featureFlag="test-feature-flag" tooltipTextClassName="text-red-500" />)
    const tooltipTextElement = container.querySelector("[data-testid='tooltip-text']")
    expect(tooltipTextElement).toBeInTheDocument()
    expect(tooltipTextElement).toHaveClass("text-red-500")
  })

  test("renders feature flag notice with badgeClassName", () => {
    const { container } = render(<TagsOperationFeatureFlagNotice featureFlag="test-feature-flag" badgeClassName="bg-red-500" />)
    const badgeElement = container.querySelector("[data-testid='badge']")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveClass("bg-red-500")
  })
})