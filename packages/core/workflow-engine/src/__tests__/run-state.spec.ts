import { defineWorkflow } from "../definition/builder"
import { compile, CompiledWorkflow } from "../definition/compile"
import { RunState } from "../runtime/run-state"
import { RunRecord } from "../store/store"

const noop = async (): Promise<unknown> => undefined

function state(compiled: CompiledWorkflow, steps: RunRecord["steps"] = []) {
  return new RunState(compiled, {
    id: "run",
    workflowId: compiled.id,
    transactionId: "t",
    status: "running",
    durability: "none",
    definitionHash: compiled.hash,
    input: {},
    context: {},
    metadata: {},
    errors: [],
    flags: {},
    idempotent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    steps,
  })
}

function succeed(run: RunState, index: number) {
  run.setStepStatus(index, "running")
  run.setStepStatus(index, "succeeded")
  run.resolve(index)
}

const diamond = compile(
  defineWorkflow({
    id: "diamond",
    steps: [
      { id: "root", invoke: noop },
      { id: "a", dependsOn: ["root"], invoke: noop },
      { id: "b", dependsOn: ["root"], invoke: noop },
      { id: "join", dependsOn: ["a", "b"], invoke: noop },
    ],
  })
)

describe("RunState ready queue", () => {
  it("hands out each ready step once, in declaration order", () => {
    const run = state(diamond)

    expect(run.takeReady()).toEqual([0])
    expect(run.takeReady()).toEqual([])

    succeed(run, 0)
    expect(run.takeReady()).toEqual([1, 2])
  })

  it("makes a join ready only once every dependency resolved, in any order", () => {
    const run = state(diamond)
    succeed(run, 0)
    run.takeReady()

    run.setStepStatus(2, "running")
    run.setStepStatus(2, "skipped")
    run.resolve(2)
    expect(run.takeReady()).toEqual([])
    expect(run.allResolved).toBe(false)

    succeed(run, 1)
    expect(run.takeReady()).toEqual([3])

    succeed(run, 3)
    expect(run.allResolved).toBe(true)
  })

  it("ignores a step resolved twice", () => {
    const run = state(diamond)
    succeed(run, 0)
    run.resolve(0)

    expect(run.remaining).toEqual([0, 0, 0, 2])
    expect(run.takeReady()).toEqual([1, 2])
  })

  it("makes a step that moves back to pending ready again", () => {
    const run = state(diamond)
    run.takeReady()
    run.setStepStatus(0, "waiting")
    expect(run.takeReady()).toEqual([])

    run.setStepStatus(0, "pending")
    expect(run.takeReady()).toEqual([0])
  })

  it("drops candidates that are no longer pending when taken", () => {
    const run = state(diamond)
    succeed(run, 0)
    run.setStepStatus(1, "skipped")
    expect(run.takeReady()).toEqual([2])
  })

  it("starts from stored steps", () => {
    const run = state(diamond, [
      { stepId: "root", status: "succeeded", attempt: 1 },
      { stepId: "a", status: "succeeded", attempt: 1 },
      { stepId: "b", status: "waiting", attempt: 1 },
    ])

    expect(run.takeReady()).toEqual([])
    expect(run.allResolved).toBe(false)

    run.setStepStatus(2, "succeeded")
    run.resolve(2)
    expect(run.takeReady()).toEqual([3])
  })
})
