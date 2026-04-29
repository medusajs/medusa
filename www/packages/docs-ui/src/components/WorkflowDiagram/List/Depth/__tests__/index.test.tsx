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

import { WorkflowDiagramListDepth } from "../../Depth"

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
    const { container } = render(<WorkflowDiagramListDepth cluster={cluster} />)
    const nodes = container.querySelectorAll("[data-testid='step-node']")
    expect(nodes).toHaveLength(2)
  })

  test("renders line with cluster", () => {
    const cluster: WorkflowStepUi[] = [
      {
        name: "test.step1",
        type: "step",
        depth: 1,
      },
    ]
    const { container } = render(<WorkflowDiagramListDepth cluster={cluster} />)
    const line = container.querySelector("[data-testid='line']")
    expect(line).toBeInTheDocument()
    expect(line).toHaveAttribute("data-step-count", "1")
  })

  test("applies workflow-node-group class", () => {
    const cluster: WorkflowStepUi[] = [
      {
        name: "test.step1",
        type: "step",
        depth: 1,
      },
    ]
    const { container } = render(<WorkflowDiagramListDepth cluster={cluster} />)
    const containerDiv = container.querySelector("div")
    expect(containerDiv).toHaveClass("workflow-node-group")
  })
})
