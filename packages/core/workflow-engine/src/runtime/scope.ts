import { AsyncLocalStorage } from "node:async_hooks"
import { StepAction } from "../definition/types"

export interface RunScope {
  engineId: string
  runId: string
  rootRunId: string
  workflowId: string
  transactionId: string
  durability: "none" | "summary" | "full"
  context: Record<string, unknown>
  stepId?: string
  action?: StepAction
  attempt?: number
  /**
   * Whether what the step changes is written with the run's next commit by
   * the executor running it. False for async steps, whose outcome is written
   * separately.
   */
  writesWithRun?: boolean
}

const storage = new AsyncLocalStorage<RunScope>()

export function runInScope<T>(scope: RunScope, fn: () => T): T {
  return storage.run(scope, fn)
}

export function currentScope(): RunScope | undefined {
  return storage.getStore()
}

/**
 * Runs `fn` outside any run scope.
 */
export function outsideScope<T>(fn: () => T): T {
  return storage.exit(fn)
}
