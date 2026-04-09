import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock components
vi.mock("@/components/InlineCode", () => ({
  InlineCode: ({ children }: { children: React.ReactNode }) => (
    <code data-testid="inline-code">{children}</code>
  ),
}))

vi.mock("@medusajs/ui", () => ({
  Text: ({
    children,
    size,
    leading,
    weight,
    className,
  }: {
    children: React.ReactNode
    size?: string
    leading?: string
    weight?: string
    className?: string
  }) => (
    <span
      data-size={size}
      data-leading={leading}
      data-weight={weight}
      className={className}
    >
      {children}
    </span>
  ),
}))

vi.mock("@medusajs/icons", () => ({
  Bolt: () => <svg data-testid="bolt-icon" />,
  InformationCircle: () => <svg data-testid="information-circle-icon" />,
  CursorArrowRays: () => <svg data-testid="cursor-arrow-rays-icon" />,
}))

import { WorkflowDiagramLegend } from "../../Legend"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders workflow hook legend item", () => {
    const { container } = render(<WorkflowDiagramLegend />)
    const boltIcon = container.querySelector("[data-testid='bolt-icon']")
    expect(boltIcon).toBeInTheDocument()
    expect(container).toHaveTextContent("Workflow hook")
  })

  test("renders when condition legend item", () => {
    const { container } = render(<WorkflowDiagramLegend />)
    const infoIcon = container.querySelector(
      "[data-testid='information-circle-icon']"
    )
    expect(infoIcon).toBeInTheDocument()
    expect(container).toHaveTextContent("Step conditioned by")
    expect(container).toHaveTextContent("when")
  })

  test("renders view step details legend item", () => {
    const { container } = render(<WorkflowDiagramLegend />)
    const cursorIcon = container.querySelector(
      "[data-testid='cursor-arrow-rays-icon']"
    )
    expect(cursorIcon).toBeInTheDocument()
    expect(container).toHaveTextContent("View step details")
  })

  test("hides workflow hook and when condition when hideLegend is true", () => {
    const { container } = render(<WorkflowDiagramLegend hideLegend={true} />)
    const boltIcon = container.querySelector("[data-testid='bolt-icon']")
    const infoIcon = container.querySelector(
      "[data-testid='information-circle-icon']"
    )
    expect(boltIcon).not.toBeInTheDocument()
    expect(infoIcon).not.toBeInTheDocument()
    expect(container).not.toHaveTextContent("Workflow hook")
    expect(container).not.toHaveTextContent("Step conditioned by")
  })

  test("still renders view step details when hideLegend is true", () => {
    const { container } = render(<WorkflowDiagramLegend hideLegend={true} />)
    const cursorIcon = container.querySelector(
      "[data-testid='cursor-arrow-rays-icon']"
    )
    expect(cursorIcon).toBeInTheDocument()
    expect(container).toHaveTextContent("View step details")
  })
})
