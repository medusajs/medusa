import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { Workflow } from "types"

// mock utilities
const mockCreateNodeClusters = vi.fn()
const mockGetNextCluster = vi.fn()

vi.mock("@/utils/workflow-diagram-utils", () => ({
  createNodeClusters: (steps: unknown) => mockCreateNodeClusters(steps),
  getNextCluster: (clusters: unknown, depth: number) =>
    mockGetNextCluster(clusters, depth),
}))

// mock components
vi.mock("@/components/WorkflowDiagram/List/Depth", () => ({
  WorkflowDiagramListDepth: ({ cluster }: { cluster: unknown[] }) => (
    <div data-testid="list-depth" data-cluster-size={cluster.length}>
      Depth
    </div>
  ),
}))

vi.mock("@/components/WorkflowDiagram/Common/Legend", () => ({
  WorkflowDiagramLegend: ({ hideLegend }: { hideLegend?: boolean }) => (
    <div data-testid="legend" data-hide={hideLegend}>
      Legend
    </div>
  ),
}))

import { WorkflowDiagramList } from "../../List"

beforeEach(() => {
  vi.clearAllMocks()
  mockCreateNodeClusters.mockReturnValue({
    1: [
      {
        name: "test.step1",
        type: "step",
        depth: 1,
        expandable: false,
      },
    ],
  })
  mockGetNextCluster.mockReturnValue([])
})

describe("rendering", () => {
  test("renders depth components for each cluster", () => {
    const workflow: Workflow = {
      name: "test-workflow",
      steps: [
        {
          name: "test.step1",
          type: "step",
          depth: 1,
        },
      ],
    }
    mockCreateNodeClusters.mockReturnValue({
      1: [
        {
          name: "test.step1",
          type: "step",
          depth: 1,
          expandable: false,
        },
      ],
      2: [
        {
          name: "test.step2",
          type: "step",
          depth: 2,
          expandable: false,
        },
      ],
    })
    const { container } = render(<WorkflowDiagramList workflow={workflow} />)
    const depths = container.querySelectorAll("[data-testid='list-depth']")
    expect(depths).toHaveLength(2)
  })

  test("renders legend", () => {
    const workflow: Workflow = {
      name: "test-workflow",
      steps: [
        {
          name: "test.step1",
          type: "step",
          depth: 1,
        },
      ],
    }
    const { container } = render(<WorkflowDiagramList workflow={workflow} />)
    const legend = container.querySelector("[data-testid='legend']")
    expect(legend).toBeInTheDocument()
  })

  test("passes hideLegend to legend", () => {
    const workflow: Workflow = {
      name: "test-workflow",
      steps: [
        {
          name: "test.step1",
          type: "step",
          depth: 1,
        },
      ],
    }
    const { container } = render(
      <WorkflowDiagramList workflow={workflow} hideLegend={true} />
    )
    const legend = container.querySelector("[data-testid='legend']")
    expect(legend).toHaveAttribute("data-hide", "true")
  })

  test("calls createNodeClusters with workflow steps", () => {
    const workflow: Workflow = {
      name: "test-workflow",
      steps: [
        {
          name: "test.step1",
          type: "step",
          depth: 1,
        },
      ],
    }
    render(<WorkflowDiagramList workflow={workflow} />)
    expect(mockCreateNodeClusters).toHaveBeenCalledWith(workflow.steps)
  })
})
