import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock components
vi.mock("@/components/WorkflowDiagram/Common/Arrow/Horizontal", () => ({
  WorkflowDiagramArrowHorizontal: () => (
    <div data-testid="arrow-horizontal">Horizontal</div>
  ),
}))

vi.mock("@/components/WorkflowDiagram/Common/Arrow/Middle", () => ({
  WorkflowDiagramArrowMiddle: () => (
    <div data-testid="arrow-middle">Middle</div>
  ),
}))

vi.mock("@/components/WorkflowDiagram/Common/Arrow/End", () => ({
  WorkflowDiagramArrowEnd: () => <div data-testid="arrow-end">End</div>,
}))

import { WorkflowDiagramArrow } from "../../Arrow"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders horizontal arrow when depth is 1", () => {
    const { container } = render(<WorkflowDiagramArrow depth={1} />)
    const horizontal = container.querySelector(
      "[data-testid='arrow-horizontal']"
    )
    expect(horizontal).toBeInTheDocument()
    const middle = container.querySelector("[data-testid='arrow-middle']")
    expect(middle).not.toBeInTheDocument()
    const end = container.querySelector("[data-testid='arrow-end']")
    expect(end).not.toBeInTheDocument()
  })

  test("renders horizontal and end arrows when depth is 2", () => {
    const { container } = render(<WorkflowDiagramArrow depth={2} />)
    const horizontal = container.querySelector(
      "[data-testid='arrow-horizontal']"
    )
    expect(horizontal).toBeInTheDocument()
    const end = container.querySelector("[data-testid='arrow-end']")
    expect(end).toBeInTheDocument()
    const middle = container.querySelector("[data-testid='arrow-middle']")
    expect(middle).not.toBeInTheDocument()
  })

  test("renders horizontal, middle, and end arrows when depth is 3", () => {
    const { container } = render(<WorkflowDiagramArrow depth={3} />)
    const horizontal = container.querySelector(
      "[data-testid='arrow-horizontal']"
    )
    expect(horizontal).toBeInTheDocument()
    const middle = container.querySelectorAll("[data-testid='arrow-middle']")
    expect(middle).toHaveLength(1)
    const end = container.querySelector("[data-testid='arrow-end']")
    expect(end).toBeInTheDocument()
  })

  test("renders correct number of middle arrows for depth 4", () => {
    const { container } = render(<WorkflowDiagramArrow depth={4} />)
    const middle = container.querySelectorAll("[data-testid='arrow-middle']")
    expect(middle).toHaveLength(2)
  })

  test("renders correct number of middle arrows for depth 5", () => {
    const { container } = render(<WorkflowDiagramArrow depth={5} />)
    const middle = container.querySelectorAll("[data-testid='arrow-middle']")
    expect(middle).toHaveLength(3)
  })

  test("applies flex column layout when depth > 1", () => {
    const { container } = render(<WorkflowDiagramArrow depth={2} />)
    const wrapper = container.querySelector("div.flex-col")
    expect(wrapper).toBeInTheDocument()
  })

  test("applies items-end alignment when depth > 1", () => {
    const { container } = render(<WorkflowDiagramArrow depth={2} />)
    const wrapper = container.querySelector("div.items-end")
    expect(wrapper).toBeInTheDocument()
  })
})
