import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { WorkflowStepUi } from "types"

// mock components
vi.mock("@/components/WorkflowDiagram/Common/Node", () => ({
  WorkflowDiagramStepNode: ({ step }: { step: WorkflowStepUi }) => (
    <div data-testid="step-node" data-step-name={step.name}>
      {step.name}
    </div>
  ),
}))

vi.mock("@/components/WorkflowDiagram/Common/Line", () => ({
  WorkflowDiagramLine: ({ step }: { step: WorkflowStepUi[] }) => (
    <div data-testid="line" data-step-count={step.length}>
      Line
    </div>
  ),
}))

import { WorkflowDiagramCanvasDepth } from "../../Depth"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders step nodes for cluster", () => {
    const cluster: WorkflowStepUi[] = [
      {
        name: "test.step1",
        type: "step",
        depth: 1,
      },
      {
        name: "test.step2",
        type: "step",
        depth: 1,
      },
    ]
    const next: WorkflowStepUi[] = []
    const { container } = render(
      <WorkflowDiagramCanvasDepth cluster={cluster} next={next} />
    )
    const nodes = container.querySelectorAll("[data-testid='step-node']")
    expect(nodes).toHaveLength(2)
  })

  test("renders line with next cluster", () => {
    const cluster: WorkflowStepUi[] = [
      {
        name: "test.step1",
        type: "step",
        depth: 1,
      },
    ]
    const next: WorkflowStepUi[] = [
      {
        name: "test.step2",
        type: "step",
        depth: 2,
      },
    ]
    const { container } = render(
      <WorkflowDiagramCanvasDepth cluster={cluster} next={next} />
    )
    const line = container.querySelector("[data-testid='line']")
    expect(line).toBeInTheDocument()
    expect(line).toHaveAttribute("data-step-count", "1")
  })
})
