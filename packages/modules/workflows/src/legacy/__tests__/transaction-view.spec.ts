import type { CompiledWorkflow, RunRecord } from "@medusajs/workflow-engine"
import { toExecutionDTO } from "../../adapters/execution-dto"
import { LegacyTransactionView } from "../transaction-view"

/**
 * a -> b, c -> d (diamond), e -> f in parallel, g after d and f.
 */
const graph: Record<string, string[]> = {
  a: [],
  e: [],
  b: ["a"],
  c: ["a"],
  f: ["e"],
  d: ["b", "c"],
  g: ["d", "f"],
}

function compiled(): CompiledWorkflow {
  const steps = Object.entries(graph).map(([id, dependsOn]) => ({
    id,
    dependsOn,
    invoke: async () => undefined,
    compensate: id === "a" ? async () => undefined : undefined,
    options: id === "b" ? { maxRetries: 2, timeoutMs: 1500 } : {},
  }))
  const indexById = new Map(steps.map((step, index) => [step.id, index]))
  const dependencies = steps.map((step) =>
    step.dependsOn.map((id) => indexById.get(id)!)
  )
  const depth: number[] = []
  dependencies.forEach((deps, index) => {
    depth[index] = deps.length
      ? Math.max(...deps.map((dep) => depth[dep])) + 1
      : 0
  })
  return {
    id: "wf",
    definition: { id: "wf", steps, options: {} },
    steps,
    indexById,
    dependencies,
    dependents: steps.map((_, index) =>
      dependencies.flatMap((deps, dependent) =>
        deps.includes(index) ? [dependent] : []
      )
    ),
    depth,
    durability: "none",
    hash: "hash",
  } as unknown as CompiledWorkflow
}

const run = (overrides: Partial<RunRecord> = {}): RunRecord => ({
  id: "run_1",
  workflowId: "wf",
  transactionId: "trx",
  status: "running",
  durability: "none",
  definitionHash: "hash",
  input: {},
  context: {},
  metadata: {},
  errors: [],
  flags: {},
  idempotent: false,
  createdAt: new Date(1000),
  updatedAt: new Date(9000),
  steps: [
    {
      stepId: "d",
      status: "running",
      attempt: 1,
      startedAt: new Date(4000),
    },
    {
      stepId: "a",
      status: "succeeded",
      attempt: 1,
      output: "out",
      compensateInput: "comp",
      startedAt: new Date(2000),
      finishedAt: new Date(2500),
    },
    { stepId: "b", status: "succeeded", attempt: 2 },
    { stepId: "c", status: "skipped", attempt: 0, skipReason: "condition" },
    { stepId: "e", status: "succeeded", attempt: 1 },
  ],
  ...overrides,
})

describe("execution view", () => {
  it("levels steps by their longest path from the first steps", () => {
    const steps = new LegacyTransactionView(run(), [], compiled()).getFlow()
      .steps

    expect(
      Object.fromEntries(
        Object.values(steps).map((step) => [step.step_id, step.depth])
      )
    ).toEqual({ a: 1, e: 1, b: 2, c: 2, f: 2, d: 3, g: 4 })
  })

  it("lists steps by depth, then declaration", () => {
    const steps = new LegacyTransactionView(run(), [], compiled()).getFlow()
      .steps

    expect(Object.keys(steps)).toEqual([
      "_root.a",
      "_root.e",
      "_root.b",
      "_root.c",
      "_root.f",
      "_root.d",
      "_root.g",
    ])
  })

  it("names each step and the steps it depends on", () => {
    const steps = new LegacyTransactionView(run(), [], compiled()).getFlow()
      .steps

    expect(steps["_root.d"]).toEqual(
      expect.objectContaining({
        id: "_root.d",
        step_id: "d",
        depends_on: ["b", "c"],
        definition: expect.objectContaining({ action: "d" }),
      })
    )
    expect(steps["_root.a"].depends_on).toEqual([])
    expect(steps["_root.g"].depends_on).toEqual(["d", "f"])
  })

  it("lists steps that have not run as not started", () => {
    const steps = new LegacyTransactionView(run(), [], compiled()).getFlow()
      .steps

    expect(steps["_root.f"]).toEqual(
      expect.objectContaining({
        invoke: { state: "not_started", status: "idle" },
        compensate: { state: "dormant", status: "idle" },
        attempts: 0,
      })
    )
  })

  it("does not invent steps when the run used another definition", () => {
    const steps = new LegacyTransactionView(
      run({ definitionHash: "older" }),
      [],
      compiled()
    ).getFlow().steps

    expect(Object.keys(steps)).toEqual([
      "_root.a",
      "_root.e",
      "_root.b",
      "_root.c",
      "_root.d",
    ])
  })

  it("does not describe steps with another definition than the run's", () => {
    const steps = new LegacyTransactionView(
      run({ definitionHash: "older" }),
      [],
      compiled()
    ).getFlow().steps

    expect(steps["_root.d"]).toEqual(
      expect.objectContaining({ depth: 1, depends_on: [] })
    )
    expect(steps["_root.b"].definition.maxRetries).toBeUndefined()
  })

  it("reports skipped steps", () => {
    const step = new LegacyTransactionView(run(), [], compiled()).getFlow()
      .steps["_root.c"]

    expect(step.invoke.state).toEqual("skipped")
  })

  it("reports step options and timestamps", () => {
    const steps = new LegacyTransactionView(run(), [], compiled()).getFlow()
      .steps

    expect(steps["_root.a"]).toEqual(
      expect.objectContaining({
        startedAt: 2000,
        lastAttempt: 2000,
        timedOutAt: null,
      })
    )
    expect(steps["_root.a"].definition.noCompensation).toBe(false)
    expect(steps["_root.b"].definition).toEqual(
      expect.objectContaining({ maxRetries: 2, timeout: 1.5 })
    )
    expect(steps["_root.b"].attempts).toEqual(2)
  })

  it("falls back to the first level without the workflow's definition", () => {
    const steps = new LegacyTransactionView(run()).getFlow().steps

    expect(Object.values(steps).map((step) => step.depth)).toEqual([
      1, 1, 1, 1, 1,
    ])
    expect(steps["_root.d"].depends_on).toEqual([])
  })

  it("sets timedOutAt only when the run timed out", () => {
    expect(
      new LegacyTransactionView(run(), [], compiled()).getFlow().timedOutAt
    ).toBeNull()

    const timedOut = new LegacyTransactionView(
      run({
        status: "compensated",
        flags: { timedOut: true },
        deadlineAt: new Date(5000),
        finishedAt: new Date(7000),
      }),
      [],
      compiled()
    ).getFlow()

    expect(timedOut.timedOutAt).toEqual(5000)
  })

  it("sets a step's timedOutAt only when the step timed out", () => {
    const steps = new LegacyTransactionView(
      run({
        steps: [
          {
            stepId: "a",
            status: "timed_out",
            attempt: 1,
            error: { message: "timeout" },
            finishedAt: new Date(3000),
          },
        ],
      }),
      [],
      compiled()
    ).getFlow().steps

    expect(steps["_root.a"]).toEqual(
      expect.objectContaining({
        timedOutAt: 3000,
        invoke: { state: "timeout", status: "permanent_failure" },
      })
    )
    expect(steps["_root.b"].timedOutAt).toBeNull()
  })

  it("keeps the run id as the execution id", () => {
    const execution = toExecutionDTO(run(), compiled())

    expect(execution.id).toEqual("run_1")
    expect(execution.run_id).toEqual("run_1")
    expect((execution.context as any).data.invoke).toEqual({
      a: {
        __type: "Symbol(WorkflowWorkflowData)",
        output: {
          __type: "Symbol(WorkflowStepResponse)",
          output: "out",
          compensateInput: "comp",
        },
      },
    })
  })
})
