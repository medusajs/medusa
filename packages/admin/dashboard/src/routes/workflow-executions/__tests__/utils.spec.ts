import { HttpTypes } from "@medusajs/types"
import { describe, expect, it } from "vitest"
import {
  getExecutionSteps,
  getStepDescendants,
  getStepName,
  getUnreachableStepNames,
  groupStepsByDepth,
} from "../utils"

const step = (
  stepId: string,
  depth: number,
  dependsOn: string[],
  invoke: Partial<HttpTypes.WorkflowExecutionFn> = {}
): HttpTypes.AdminWorkflowExecutionStep => ({
  id: `_root.${stepId}`,
  step_id: stepId,
  depends_on: dependsOn,
  depth,
  startedAt: 0,
  definition: {},
  invoke: { state: "done", status: "ok", ...invoke },
  compensate: { state: "dormant", status: "idle" },
})

const byId = (steps: HttpTypes.AdminWorkflowExecutionStep[]) =>
  Object.fromEntries(steps.map((s) => [s.id, s]))

/**
 * a -> b.with.dots, c -> d, and e in parallel.
 */
const diamond = () => [
  step("d", 3, ["b.with.dots", "c"], { state: "not_started", status: "idle" }),
  step("a", 1, []),
  step("b.with.dots", 2, ["a"], {
    state: "failed",
    status: "permanent_failure",
  }),
  step("c", 2, ["a"]),
  step("e", 1, []),
]

describe("getStepName", () => {
  it("uses the explicit step id, which may contain dots", () => {
    expect(getStepName(step("b.with.dots", 1, []))).toBe("b.with.dots")
  })

  it("falls back to the definition's action", () => {
    const { step_id, ...rest } = step("x", 1, [])
    expect(getStepName({ ...rest, definition: { action: "x" } } as any)).toBe(
      "x"
    )
  })
})

describe("getExecutionSteps", () => {
  it("drops the root and orders by depth", () => {
    const steps = getExecutionSteps({
      ...byId(diamond()),
      _root: { ...step("_root", 0, []), id: "_root" },
    })
    expect(steps.map(getStepName)).toEqual(["a", "e", "b.with.dots", "c", "d"])
    expect(steps.find((s) => s.id === "_root")).toBeUndefined()
  })

  it("handles missing steps", () => {
    expect(getExecutionSteps(undefined)).toEqual([])
  })
})

describe("getStepDescendants", () => {
  it("follows dependencies, not id nesting", () => {
    expect(getStepDescendants(diamond(), "a")).toEqual(
      new Set(["b.with.dots", "c", "d"])
    )
    expect(getStepDescendants(diamond(), "e")).toEqual(new Set())
  })
})

describe("getUnreachableStepNames", () => {
  it("marks the not started descendants of a permanently failed step", () => {
    expect(getUnreachableStepNames(diamond())).toEqual(new Set(["d"]))
  })

  it("marks nothing when no step failed", () => {
    const steps = diamond().map((s) => ({
      ...s,
      invoke: { state: "done", status: "ok" } as const,
    }))
    expect(getUnreachableStepNames(steps)).toEqual(new Set())
  })
})

describe("groupStepsByDepth", () => {
  it("groups steps that share a depth, shallowest first", () => {
    const groups = groupStepsByDepth(getExecutionSteps(byId(diamond())))
    expect(groups.map((group) => group.map(getStepName))).toEqual([
      ["a", "e"],
      ["b.with.dots", "c"],
      ["d"],
    ])
  })
})
