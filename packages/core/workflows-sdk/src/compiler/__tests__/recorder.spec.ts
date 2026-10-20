import { hashDefinition } from "@medusajs/workflow-engine"
import { getWorkflowDefinition, getWorkflowRunOptions } from "../../brand"
import {
  createHook,
  createStep,
  createWorkflow,
  parallelize,
  resolveValue,
  StepResponse,
  transform,
  when,
  WorkflowResponse,
} from "../../utils/composer"
import {
  getComposerContext,
  setComposerContext,
  WorkflowRecorder,
} from "../recorder"
import { normalizeLegacyOptions, toWorkflowOptions } from "../to-definition"
import { evaluateCondition, RUN_MEMO, ValueContext } from "../values"

const step = (name: string) =>
  createStep(name, async () => new StepResponse(name))

const stepWithInput = (name: string) =>
  createStep(name, async (_input: { from: unknown }) => new StepResponse(name))

const shape = (workflow: unknown) =>
  getWorkflowDefinition(workflow).steps.map((s) => [s.id, s.dependsOn])

let id = 0
const nextId = () => `recorder-${++id}`

// Records a composer function without compiling it.
const record = (composer: () => void) => {
  const recorder = new WorkflowRecorder(nextId())
  setComposerContext(recorder)
  try {
    composer()
  } finally {
    setComposerContext(undefined)
  }
  return recorder
}

describe("workflow recorder", () => {
  let warn: jest.SpyInstance

  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockRestore()
  })

  describe("unnamed when", () => {
    const composer = (input: { a: boolean }) => {
      when(input, (i) => i.a).then(() => ({ value: input }))
      when(input, (i) => !i.a).then(() => ({ value: input }))
      step("after")()
    }

    it("gets a step id derived from declaration order", () => {
      const workflow = createWorkflow(nextId(), composer)

      expect(shape(workflow)).toEqual([
        ["when-then-1", []],
        ["when-then-2", ["when-then-1"]],
        ["after", ["when-then-2"]],
      ])
      expect(warn).toHaveBeenCalled()
    })

    it("compiles to the same hash every time", () => {
      const first = getWorkflowDefinition(createWorkflow(nextId(), composer))
      const second = getWorkflowDefinition(createWorkflow(nextId(), composer))

      expect(hashDefinition(second)).toEqual(hashDefinition(first))
    })
  })

  describe("parallelize", () => {
    it("keeps the dependency on a step recorded in a later argument", () => {
      const workflow = createWorkflow(nextId(), () => {
        step("a")()
        parallelize(step("b")(), stepWithInput("c")({ from: step("d")() }))
        step("e")()
      })

      expect(shape(workflow)).toEqual([
        ["a", []],
        ["b", ["a"]],
        ["d", ["b"]],
        ["c", ["a", "d"]],
        ["e", ["c"]],
      ])
    })

    it("keeps the dependency on a step recorded in the first argument", () => {
      const workflow = createWorkflow(nextId(), () => {
        step("a")()
        parallelize(stepWithInput("b")({ from: step("d")() }), step("c")())
        step("e")()
      })

      expect(shape(workflow)).toEqual([
        ["a", []],
        ["d", ["a"]],
        ["b", ["d"]],
        ["c", ["d"]],
        ["e", ["b", "c"]],
      ])
    })

    it("keeps the dependencies of a when block passed as an argument", () => {
      const workflow = createWorkflow(nextId(), (input: { ok: boolean }) => {
        step("a")()
        parallelize(
          step("b")(),
          when("cond", input, (i) => i.ok).then(() => {
            const d = step("d")()
            return { d }
          }) as any
        )
        step("e")()
      })

      expect(shape(workflow)).toEqual([
        ["a", []],
        ["b", ["a"]],
        ["d", ["b"]],
        ["cond", ["a", "d"]],
        ["e", ["cond"]],
      ])
    })
  })

  describe("when without then", () => {
    it("throws while the workflow is created", () => {
      const name = nextId()

      expect(() =>
        createWorkflow(name, (input) => {
          when(input, () => true)
          step("a")()
        })
      ).toThrow(`Workflow "${name}": ".then" is missing after "when" condition`)
      expect(getComposerContext()).toBeUndefined()
    })
  })

  describe("conditions", () => {
    const values = (): ValueContext => ({
      payload: {},
      invoke: {},
      context: {},
      container: undefined,
      [RUN_MEMO]: new Map(),
    })

    it("evaluates again after a failure", async () => {
      const condition = jest
        .fn()
        .mockRejectedValueOnce(new Error("boom"))
        .mockResolvedValueOnce(true)
      const block = { id: "when-test", input: {}, condition }
      const run = values()

      await expect(evaluateCondition(block, run)).rejects.toThrow("boom")
      await expect(evaluateCondition(block, run)).resolves.toBe(true)
      await expect(evaluateCondition(block, run)).resolves.toBe(true)
      expect(condition).toHaveBeenCalledTimes(2)
    })
  })

  describe("ids", () => {
    const composer = () => {
      const a = step("a")()
      when({ a }, ({ a }) => !!a).then(() => {
        const b = step("b")() as any
        b.if({ a }, ({ a }) => !!a)
      })
      transform({ a }, ({ a }) => a)
    }

    it("numbers conditions per workflow", () => {
      const first = record(composer)
      const second = record(composer)

      const ids = (recorder: WorkflowRecorder) =>
        recorder.steps.map((s) => s.conditions.map((c) => c.id))

      expect(ids(first)).toEqual([[], ["when-1", "if-2"]])
      expect(ids(second)).toEqual(ids(first))
    })

    it("numbers transforms per workflow", () => {
      const first = record(composer)
      const second = record(composer)

      expect(first.nextTransformId()).toEqual("transform-2")
      expect(second.nextTransformId()).toEqual("transform-2")
    })

    it("uses the global recorder key", () => {
      const recorder = new WorkflowRecorder(nextId())
      setComposerContext(recorder)
      try {
        expect(global[Symbol.for("medusa.workflow.recorder")]).toBe(recorder)
      } finally {
        setComposerContext(undefined)
      }
      expect(global[Symbol.for("medusa.workflow.recorder")]).toBeUndefined()
    })
  })

  describe("hooks", () => {
    it("exposes a handler registrar for each declared hook", () => {
      const workflow = createWorkflow(nextId(), () => {
        const created = createHook("created", {})
        return new WorkflowResponse(undefined, { hooks: [created] })
      })

      expect(Object.keys(workflow.hooks)).toEqual(["created"])
      workflow.hooks.created(() => void 0)
      expect(() => workflow.hooks.created(() => void 0)).toThrow(
        "Cannot define multiple hook handlers for the created hook"
      )
    })
  })

  describe("resolveValue", () => {
    const values = (results: Record<string, unknown>): ValueContext => ({
      payload: { name: "input" },
      invoke: results,
      context: {},
      container: undefined,
      [RUN_MEMO]: new Map(),
    })

    it("reads step outputs directly from the results", async () => {
      let refs: any
      record(() => {
        refs = { a: step("a")(), b: step("b")() }
      })

      expect(
        await resolveValue(
          { a: refs.a, b: refs.b },
          values({ a: 1, b: { c: 2 } })
        )
      ).toEqual({ a: 1, b: { c: 2 } })
    })

    it("resolves a step without output to undefined", async () => {
      let ref: any
      record(() => {
        ref = step("a")()
      })

      expect(await resolveValue({ a: ref }, values({ a: undefined }))).toEqual({
        a: undefined,
      })
    })

    it("does not unwrap an output that has an output property", async () => {
      let ref: any
      record(() => {
        ref = step("a")()
      })

      expect(await resolveValue(ref, values({ a: { output: 1 } }))).toEqual({
        output: 1,
      })
    })
  })

  describe("legacy options", () => {
    it("treats storeExecution as store", () => {
      expect(toWorkflowOptions({ storeExecution: true }).store).toBe(true)
      expect(normalizeLegacyOptions({ storeExecution: true })).toEqual({
        store: true,
      })
    })

    it("drops the ignored step options", () => {
      expect(
        normalizeLegacyOptions(
          {
            maxRetries: 2,
            store: true,
            noWait: true,
            backgroundExecution: true,
            compensateAsync: false,
          },
          { workflowId: "wf", stepId: "a" }
        )
      ).toEqual({ maxRetries: 2 })
    })
  })

  describe("ignored step options", () => {
    it("does not make the workflow async on compensateAsync", () => {
      const child = createWorkflow(nextId(), () => {
        step("a")().config({ compensateAsync: true })
      })
      const parent = createWorkflow(nextId(), () => {
        child.runAsStep({ input: {} })
      })

      const definition = getWorkflowDefinition(parent)
      expect(definition.steps[0].options.async).toBeUndefined()
      expect(definition.steps[0].options.nested).toBeUndefined()
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('"compensateAsync"')
      )
    })
  })

  describe("workflow config", () => {
    it("keeps the options for every run", () => {
      const workflow = createWorkflow(nextId(), () => {
        step("a")()
      })
      expect(getWorkflowRunOptions(workflow)).toBeUndefined()

      workflow.config({ timeout: 5 })
      workflow.config({ retentionTime: 10 })

      expect(getWorkflowRunOptions(workflow)).toEqual({
        timeout: 5,
        retentionTime: 10,
      })
    })
  })
})
