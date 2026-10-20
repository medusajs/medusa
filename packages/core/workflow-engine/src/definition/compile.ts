import { createHash } from "node:crypto"
import { resolveDurability } from "./run-options"
import { Durability, StepNode, WorkflowDefinition } from "./types"
import { validateDefinition } from "./validate"

export interface CompiledWorkflow {
  id: string
  definition: WorkflowDefinition
  steps: StepNode[]
  indexById: Map<string, number>
  dependencies: number[][]
  dependents: number[][]
  /**
   * Longest distance from a root. Compensation runs one depth at a time, from
   * the deepest down.
   */
  depth: number[]
  durability: Durability
  hash: string
}

export function compile(definition: WorkflowDefinition): CompiledWorkflow {
  validateDefinition(definition)

  const steps = definition.steps
  const indexById = new Map<string, number>()
  steps.forEach((step, index) => indexById.set(step.id, index))

  const dependencies = steps.map((step) =>
    step.dependsOn.map((id) => indexById.get(id)!)
  )
  const dependents: number[][] = steps.map(() => [])
  dependencies.forEach((deps, index) => {
    for (const dep of deps) {
      dependents[dep].push(index)
    }
  })

  const depth: number[] = []
  dependencies.forEach((deps, index) => {
    depth[index] = deps.length
      ? Math.max(...deps.map((dep) => depth[dep])) + 1
      : 0
  })

  return {
    id: definition.id,
    definition,
    steps,
    indexById,
    dependencies,
    dependents,
    depth,
    durability: resolveDurability(definition),
    hash: hashDefinition(definition),
  }
}

export function hashDefinition(definition: WorkflowDefinition): string {
  const shape = {
    steps: definition.steps.map((step) => ({
      id: step.id,
      dependsOn: step.dependsOn,
      options: plain(step.options),
    })),
    options: plain(definition.options),
  }

  return createHash("sha256").update(stableStringify(shape)).digest("hex")
}

function plain(value: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, entry] of Object.entries(value)) {
    if (entry !== undefined && typeof entry !== "function") {
      result[key] = entry
    }
  }
  return result
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`
  }

  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort()
    return `{${keys
      .map(
        (key) =>
          `${JSON.stringify(key)}:${stableStringify(
            (value as Record<string, unknown>)[key]
          )}`
      )
      .join(",")}}`
  }

  return JSON.stringify(value) ?? "null"
}
