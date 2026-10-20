import type { CompiledWorkflow } from "./compile"
import { Durability, WorkflowDefinition, WorkflowOptions } from "./types"

const DURABILITY_RANK: Record<Durability, number> = {
  none: 0,
  summary: 1,
  full: 2,
}

/**
 * Raises the durability to what the workflow options need. Options never
 * lower it.
 */
export function raiseDurability(
  base: Durability,
  options: Partial<WorkflowOptions>
): Durability {
  let durability = base
  const raise = (to: Durability) => {
    if (DURABILITY_RANK[to] > DURABILITY_RANK[durability]) {
      durability = to
    }
  }
  if (options.durability) {
    raise(options.durability)
  }
  if (options.timeoutMs) {
    raise("full")
  }
  if (options.idempotent || options.retentionTimeMs || options.store) {
    raise("summary")
  }
  return durability
}

/**
 * Steps that wait, retry later or time out need every step stored.
 */
export function resolveDurability(definition: WorkflowDefinition): Durability {
  const stepsNeedFull = definition.steps.some(
    (step) =>
      step.options.async ||
      step.options.nested ||
      step.options.retryIntervalMs ||
      step.options.timeoutMs ||
      step.options.autoRetry === false
  )
  return raiseDurability(stepsNeedFull ? "full" : "none", definition.options)
}

/**
 * Metadata key holding a run timeout given when the run was started, which
 * overrides the workflow's.
 */
export const RUN_TIMEOUT_METADATA_KEY = "timeoutMs"

export function runTimeoutMs(
  compiled: CompiledWorkflow,
  run: { metadata?: Record<string, unknown> | null }
): number {
  const override = run.metadata?.[RUN_TIMEOUT_METADATA_KEY]
  return typeof override === "number"
    ? override
    : compiled.definition.options.timeoutMs ?? 0
}
