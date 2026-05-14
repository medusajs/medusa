import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { Workflow } from "types"

// mock components
vi.mock("@/components/Loading", () => ({
  Loading: () => <div data-testid="loading">Loading</div>,
}))

vi.mock("@/components/WorkflowDiagram/Canvas", () => ({
  WorkflowDiagramCanvas: ({ workflow }: { workflow: Workflow }) => (
    <div data-testid="canvas-diagram">Canvas</div>
  ),
}))

vi.mock("@/components/WorkflowDiagram/List", () => ({
  WorkflowDiagramList: ({ workflow }: { workflow: Workflow }) => (
    <div data-testid="list-diagram">List</div>
  ),
}))

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof React>("react")
  return {
    ...actual,
    Suspense: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

import { WorkflowDiagram } from "../../WorkflowDiagram"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders list diagram by default", () => {
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
    const { container } = render(<WorkflowDiagram workflow={workflow} />)
    const listDiagram = container.querySelector("[data-testid='list-diagram']")
    expect(listDiagram).toBeInTheDocument()
    const canvasDiagram = container.querySelector(
      "[data-testid='canvas-diagram']"
    )
    expect(canvasDiagram).not.toBeInTheDocument()
  })

  test("renders canvas diagram when type is canvas", () => {
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
      <WorkflowDiagram workflow={workflow} type="canvas" />
    )
    const canvasDiagram = container.querySelector(
      "[data-testid='canvas-diagram']"
    )
    expect(canvasDiagram).toBeInTheDocument()
    const listDiagram = container.querySelector("[data-testid='list-diagram']")
    expect(listDiagram).not.toBeInTheDocument()
  })

  test("renders list diagram when type is list", () => {
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
      <WorkflowDiagram workflow={workflow} type="list" />
    )
    const listDiagram = container.querySelector("[data-testid='list-diagram']")
    expect(listDiagram).toBeInTheDocument()
    const canvasDiagram = container.querySelector(
      "[data-testid='canvas-diagram']"
    )
    expect(canvasDiagram).not.toBeInTheDocument()
  })
})
