import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { WorkflowStepUi } from "types"

// mock components
vi.mock("@/components/WorkflowDiagram/Common/Arrow", () => ({
  WorkflowDiagramArrow: ({ depth }: { depth: number }) => (
    <div data-testid="arrow" data-depth={depth}>
      Arrow
    </div>
  ),
}))

import { WorkflowDiagramLine } from "../../Line"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders nothing when step is empty", () => {
    const { container } = render(<WorkflowDiagramLine step={[]} />)
    expect(container.firstChild).toBeNull()
  })

  test("renders when step is not empty", () => {
    const step: WorkflowStepUi[] = [
      {
        name: "test.step1",
        type: "step",
        depth: 1,
      },
    ]
    const { container } = render(<WorkflowDiagramLine step={step} />)
    const containerDiv = container.querySelector("div")
    expect(containerDiv).toBeInTheDocument()
  })
})
