import { MedusaError, Modules } from "@medusajs/utils"
import type { StepContext } from "@medusajs/workflow-engine"
import { getWorkflowDefinition } from "../../../brand"
import { createStep } from "../create-step"
import { createWorkflow } from "../create-workflow"
import { StepResponse } from "../helpers/step-response"

let id = 0
const nextId = () => `run-as-step-${++id}`

const asyncChildSetup = () => {
  const child = createWorkflow(nextId(), () => {
    createStep(
      { name: "child-step", async: true },
      async () => new StepResponse("done")
    )()
  })
  const parent = createWorkflow(nextId(), () => {
    child.runAsStep({ input: {} })
  })
  const node = getWorkflowDefinition(parent).steps.find((step) =>
    step.id.endsWith("-as-step")
  )!

  const engine = {
    run: jest.fn().mockResolvedValue({}),
    cancel: jest.fn().mockResolvedValue({}),
  }
  const container = {
    resolve: (key: string) =>
      key === Modules.WORKFLOW_ENGINE ? engine : undefined,
  }

  const context = (
    action: "invoke" | "compensate",
    attempt: number
  ): StepContext => ({
    runId: "run_1",
    workflowId: getWorkflowDefinition(parent).id,
    transactionId: "parent-tx",
    stepId: node.id,
    action,
    attempt,
    idempotencyKey: {
      workflowId: getWorkflowDefinition(parent).id,
      transactionId: "parent-tx",
      stepId: node.id,
      action,
    } as any,
    signal: new AbortController().signal,
    input: {},
    context: {},
    metadata: {},
    locals: { container },
    results: new Map(),
    memo: new Map(),
  })

  return { node, engine, context }
}

describe("runAsStep with an async child", () => {
  it("cancels the child started by a later invoke attempt", async () => {
    const { node, engine, context } = asyncChildSetup()

    await node.invoke(context("invoke", 2))
    await node.compensate!(undefined, context("compensate", 1))

    const started = engine.run.mock.calls[0][1].transactionId
    const cancelled = engine.cancel.mock.calls[0][1].transactionId
    expect(cancelled).toBe(started)
  })

  it("keeps waiting when a retried attempt finds the child running", async () => {
    const { node, engine, context } = asyncChildSetup()
    engine.run.mockRejectedValueOnce(
      new MedusaError(MedusaError.Types.CONFLICT, "already started")
    )

    await expect(node.invoke(context("invoke", 2))).resolves.toEqual({
      kind: "wait",
    })
  })
})
