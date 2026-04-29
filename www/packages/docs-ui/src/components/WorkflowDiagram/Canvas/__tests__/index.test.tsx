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

// mock framer-motion
const MotionDiv = vi.hoisted(() => {
  const Component = ({
    children,
    className,
    style,
    onMouseDown,
    onMouseUp,
    drag,
  }: {
    children: React.ReactNode
    className?: string
    style?: Record<string, unknown>
    onMouseDown?: () => void
    onMouseUp?: () => void
    drag?: boolean
  }) => (
    <div
      className={className}
      style={style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      data-drag={drag}
      data-testid="motion-div"
    >
      {children}
    </div>
  )
  Component.displayName = "MotionDiv"
  return Component
})

vi.mock("framer-motion", () => ({
  motion: {
    div: MotionDiv,
  },
  useAnimationControls: () => ({
    set: vi.fn(),
    start: vi.fn(),
  }),
  useDragControls: () => ({}),
  useMotionValue: (initial: number) => ({
    get: () => initial,
    on: vi.fn(() => vi.fn()),
  }),
}))

// mock components
vi.mock("@/components/WorkflowDiagram/Canvas/Depth", () => ({
  WorkflowDiagramCanvasDepth: ({
    cluster,
  }: {
    cluster: unknown[]
    next: unknown[]
  }) => (
    <div data-testid="canvas-depth" data-cluster-size={cluster.length}>
      Depth
    </div>
  ),
}))

vi.mock("@medusajs/icons", () => ({
  PlusMini: () => <svg data-testid="plus-icon" />,
  MinusMini: () => <svg data-testid="minus-icon" />,
  ArrowPathMini: () => <svg data-testid="arrow-path-icon" />,
}))

import { WorkflowDiagramCanvas } from "../../Canvas"

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
  test("renders motion div", () => {
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
    const { container } = render(<WorkflowDiagramCanvas workflow={workflow} />)
    const motionDiv = container.querySelector("[data-testid='motion-div']")
    expect(motionDiv).toBeInTheDocument()
  })

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
    const { container } = render(<WorkflowDiagramCanvas workflow={workflow} />)
    const depths = container.querySelectorAll("[data-testid='canvas-depth']")
    expect(depths).toHaveLength(2)
  })

  test("renders zoom controls", () => {
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
    const { container } = render(<WorkflowDiagramCanvas workflow={workflow} />)
    const plusIcon = container.querySelector("[data-testid='plus-icon']")
    const minusIcon = container.querySelector("[data-testid='minus-icon']")
    const arrowPathIcon = container.querySelector(
      "[data-testid='arrow-path-icon']"
    )
    expect(plusIcon).toBeInTheDocument()
    expect(minusIcon).toBeInTheDocument()
    expect(arrowPathIcon).toBeInTheDocument()
  })

  test("renders zoom percentage dropdown", () => {
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
    const { container } = render(<WorkflowDiagramCanvas workflow={workflow} />)
    const dropdownTrigger = container.querySelector(
      "[data-testid='zoom-percentage-dropdown-trigger']"
    )
    expect(dropdownTrigger).toBeInTheDocument()
    expect(dropdownTrigger).toHaveTextContent("100%")
  })
})
