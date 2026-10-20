import { defineWorkflow } from "../definition/builder"
import { compile } from "../definition/compile"
import { WorkflowRegistry } from "../definition/registry"
import { canTransitionRun, canTransitionStep } from "../runtime/transitions"

const noop = async (): Promise<unknown> => undefined

describe("compile", () => {
  it("indexes steps, edges and depth", () => {
    const compiled = compile(
      defineWorkflow({
        id: "w",
        steps: [
          { id: "a", invoke: noop },
          { id: "b", dependsOn: ["a"], invoke: noop },
          { id: "c", dependsOn: ["a"], invoke: noop },
          { id: "d", dependsOn: ["b", "c"], invoke: noop },
        ],
      })
    )

    expect(compiled.dependents).toEqual([[1, 2], [3], [3], []])
    expect(compiled.depth).toEqual([0, 1, 1, 2])
    expect(compiled.durability).toEqual("none")
  })

  it("rejects duplicate ids and undeclared dependencies", () => {
    expect(() =>
      compile(
        defineWorkflow({
          id: "w",
          steps: [
            { id: "a", invoke: noop },
            { id: "a", invoke: noop },
          ],
        })
      )
    ).toThrow('more than one step with id "a"')

    expect(() =>
      compile(
        defineWorkflow({
          id: "w",
          steps: [{ id: "a", dependsOn: ["b"], invoke: noop }],
        })
      )
    ).toThrow('depends on "b"')
  })

  it.each([
    [{}, {}, "none"],
    [{ idempotent: true }, {}, "summary"],
    [{ retentionTimeMs: 10 }, {}, "summary"],
    [{ timeoutMs: 10 }, {}, "full"],
    [{}, { async: true }, "full"],
    [{}, { retryIntervalMs: 10 }, "full"],
    [{}, { timeoutMs: 10 }, "full"],
    [{ durability: "full" as const }, {}, "full"],
  ])(
    "derives durability from %j and step %j",
    (options, stepOptions, expected) => {
      const compiled = compile(
        defineWorkflow({
          id: "w",
          steps: [{ id: "a", invoke: noop, options: stepOptions }],
          options,
        })
      )
      expect(compiled.durability).toEqual(expected)
    }
  )

  it("hashes the shape, not the handlers", () => {
    const build = (invoke: () => Promise<unknown> = noop, extra = {}) =>
      compile(
        defineWorkflow({
          id: "w",
          steps: [{ id: "a", invoke, options: extra }],
        })
      ).hash

    expect(build()).toEqual(build(async () => 1))
    expect(build()).not.toEqual(build(noop, { maxRetries: 1 }))
  })

  it("accepts the same shape twice and rejects a different one", () => {
    const registry = new WorkflowRegistry()
    const definition = (id: string) =>
      defineWorkflow({ id: "w", steps: [{ id, invoke: noop }] })

    registry.register(definition("a"))
    expect(() => registry.register(definition("a"))).not.toThrow()
    expect(() => registry.register(definition("b"))).toThrow(
      'Workflow with id "w" and step definition already exists.'
    )
  })
})

describe("transitions", () => {
  it("allows the documented run transitions only", () => {
    expect(canTransitionRun("running", "waiting")).toBe(true)
    expect(canTransitionRun("succeeded", "compensating")).toBe(true)
    expect(canTransitionRun("compensated", "running")).toBe(false)
    expect(canTransitionRun("failed", "compensating")).toBe(false)
  })

  it("allows the documented step transitions only", () => {
    expect(canTransitionStep("pending", "running")).toBe(true)
    expect(canTransitionStep("waiting", "succeeded")).toBe(true)
    expect(canTransitionStep("succeeded", "running")).toBe(false)
    expect(canTransitionStep("skipped", "compensating")).toBe(false)
  })
})
