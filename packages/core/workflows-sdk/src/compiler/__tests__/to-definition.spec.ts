import {
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  StepResponse,
  when,
  WorkflowResponse,
} from "../../utils/composer"
import { getWorkflowDefinition } from "../../brand"
import { formatStepKey, parseStepKey } from "../step-key"

const step = (name: string) =>
  createStep(name, async () => new StepResponse(name))

const shape = (workflow: unknown) =>
  getWorkflowDefinition(workflow).steps.map((s) => [s.id, s.dependsOn])

let id = 0
const nextId = () => `compiler-${++id}`

describe("compiling a composer function", () => {
  it("chains steps in declaration order", () => {
    const workflow = createWorkflow(nextId(), () => {
      step("a")()
      step("b")()
    })

    expect(shape(workflow)).toEqual([
      ["a", []],
      ["b", ["a"]],
    ])
  })

  it("makes parallel steps siblings and waits for all of them", () => {
    const workflow = createWorkflow(nextId(), () => {
      step("a")()
      parallelize(step("b")(), step("c")(), step("d")())
      step("e")()
    })

    expect(shape(workflow)).toEqual([
      ["a", []],
      ["b", ["a"]],
      ["c", ["a"]],
      ["d", ["a"]],
      ["e", ["b", "c", "d"]],
    ])
  })

  it("renames the use that .config is called on", () => {
    const log = step("log")
    const workflow = createWorkflow(nextId(), () => {
      log()
      log().config({ name: "second" })
    })

    expect(shape(workflow)).toEqual([
      ["log", []],
      ["second", ["log"]],
    ])
  })

  it("records nested when blocks", () => {
    const workflow = createWorkflow(nextId(), (input: { a: boolean }) => {
      when("outer", input, (i) => i.a).then(() => {
        step("x")()
        when("inner", input, (i) => !i.a).then(() => {
          step("y")()
        })
      })
    })

    expect(shape(workflow)).toEqual([
      ["x", []],
      ["y", ["x"]],
    ])
  })

  it("records hook steps and their result step", () => {
    const workflow = createWorkflow(nextId(), (input) => {
      const hook = createHook("myHook", { input })
      hook.getResult()
      return new WorkflowResponse(void 0, { hooks: [hook] })
    })

    expect(shape(workflow)).toEqual([
      ["myHook", []],
      ["get-myHook-result", ["myHook"]],
    ])
  })

  it("converts durations from seconds to milliseconds", () => {
    const workflow = createWorkflow(
      { name: nextId(), timeout: 2, retentionTime: 3 },
      () => {
        step("a")().config({ retryInterval: 1, timeout: 4, maxRetries: 1 })
      }
    )

    const definition = getWorkflowDefinition(workflow)
    expect(definition.options).toEqual(
      expect.objectContaining({ timeoutMs: 2000, retentionTimeMs: 3000 })
    )
    expect(definition.steps[0].options).toEqual(
      expect.objectContaining({
        retryIntervalMs: 1000,
        timeoutMs: 4000,
        maxRetries: 1,
      })
    )
  })
})

describe("step keys", () => {
  it("round trips ids containing colons", () => {
    const parts = {
      workflowId: "wf",
      transactionId: "schedule:job:2026-01-01T00:00:00.000Z",
      stepId: "step",
      action: "invoke" as const,
    }
    expect(parseStepKey(formatStepKey(parts))).toEqual(parts)
  })

  it("reads legacy unescaped keys", () => {
    expect(parseStepKey("wf:trx:step:compensate")).toEqual({
      workflowId: "wf",
      transactionId: "trx",
      stepId: "step",
      action: "compensate",
    })
  })
})
