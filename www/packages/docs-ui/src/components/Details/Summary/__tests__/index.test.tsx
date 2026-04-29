import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { DetailsSummary } from "../index"

describe("render", () => {
  test("renders details summary with children", () => {
    const { container } = render(<DetailsSummary>Test</DetailsSummary>)
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    const title = container.querySelector(
      "[data-testid='details-summary-title']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test")
  })

  test("renders details summary with title", () => {
    const { container } = render(<DetailsSummary title="Test" />)
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    const title = container.querySelector(
      "[data-testid='details-summary-title']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test")
  })

  test("renders details summary with subtitle", () => {
    const { container } = render(<DetailsSummary subtitle="Test" />)
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    const subtitle = container.querySelector(
      "[data-testid='details-summary-subtitle']"
    )
    expect(subtitle).toBeInTheDocument()
    expect(subtitle).toHaveTextContent("Test")
  })

  test("renders details summary with badge", () => {
    const badge = <div data-testid="test-badge">Test Badge</div>
    const { container } = render(<DetailsSummary badge={badge} />)
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    const extra = container.querySelector(
      "[data-testid='details-summary-extra']"
    )
    expect(extra).toBeInTheDocument()
    const badgeElement = extra?.querySelector("[data-testid='test-badge']")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("Test Badge")
  })

  test("renders details summary with expandable", () => {
    const { container } = render(<DetailsSummary expandable />)
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    expect(summary).toHaveClass("cursor-pointer")
    expect(summary).toHaveClass("gap-0.5")
    const extra = container.querySelector(
      "[data-testid='details-summary-extra']"
    )
    expect(extra).toBeInTheDocument()
    const icon = extra?.querySelector("svg")
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass("transition-transform")
    expect(icon).not.toHaveClass("rotate-45")
  })

  test("renders details summary with hideExpandableIcon", () => {
    const { container } = render(<DetailsSummary hideExpandableIcon />)
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    const extra = container.querySelector(
      "[data-testid='details-summary-extra']"
    )
    expect(extra).toBeInTheDocument()
    const icon = extra?.querySelector("svg")
    expect(icon).not.toBeInTheDocument()
  })

  test("renders details summary with className", () => {
    const { container } = render(<DetailsSummary className="test-class" />)
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    expect(summary).toHaveClass("test-class")
  })

  test("renders details summary with titleClassName", () => {
    const { container } = render(
      <DetailsSummary titleClassName="test-title-class" />
    )
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    const title = container.querySelector(
      "[data-testid='details-summary-title']"
    )
    expect(title).toBeInTheDocument()
    expect(title).toHaveClass("test-title-class")
  })

  test("renders details summary with summaryRef", () => {
    const summaryRef = vi.fn()
    const { container } = render(<DetailsSummary summaryRef={summaryRef} />)
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    expect(summaryRef).toHaveBeenCalled()
  })

  test("renders details summary with rest props", () => {
    const { container } = render(<DetailsSummary data-testid="test-summary" />)
    const summary = container.querySelector("[data-testid='test-summary']")
    expect(summary).toBeInTheDocument()
    expect(summary).toHaveAttribute("data-testid", "test-summary")
  })

  test("renders with expandable and open", () => {
    const { container } = render(<DetailsSummary expandable open />)
    const summary = container.querySelector("summary")
    expect(summary).toBeInTheDocument()
    expect(summary).toHaveClass("cursor-pointer")
    expect(summary).toHaveClass("gap-0.5")
    const extra = container.querySelector(
      "[data-testid='details-summary-extra']"
    )
    expect(extra).toBeInTheDocument()
    const icon = extra?.querySelector("svg")
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass("transition-transform")
    expect(icon).toHaveClass("rotate-45")
  })
})
