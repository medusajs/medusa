import { RunStatus, StepAction, StepContext } from "../definition/types"
import type { PeriodicTask } from "../recovery/periodic"
import { RunChanges, RunRecord } from "../store/store"
import type { RunScope } from "./scope"

export interface StepInvocation {
  action: StepAction
  ctx: StepContext
}

export interface RunInvocation {
  run: RunRecord
  locals: Record<string, unknown>
}

/**
 * Optional behaviour plugged into an engine. Hooks run in registration order;
 * `around*` hooks nest, the first registered being the outermost.
 */
export interface EngineExtension {
  name: string
  /**
   * Wraps every handler call, invoke and compensate.
   */
  aroundStep?<T>(invocation: StepInvocation, next: () => Promise<T>): Promise<T>
  /**
   * Wraps one execution segment of a run, from start or resume until it
   * finishes or waits.
   */
  aroundRun?<T>(invocation: RunInvocation, next: () => Promise<T>): Promise<T>
  /**
   * Supplies process-local values for a run that was started elsewhere or
   * whose locals are gone.
   */
  resolveLocals?(run: RunRecord): Record<string, unknown> | undefined
  /**
   * Called once when the extension is added to an engine.
   */
  attach?(engine: ExtensionHost): void
  /**
   * A step attempt failed. `willRetry` is false when the failure is
   * permanent.
   */
  onStepAttemptFailed?(event: {
    run: RunRecord
    stepId: string
    attempt: number
    willRetry: boolean
  }): void | Promise<void>
  onStepCompensated?(event: {
    run: RunRecord
    stepId: string
  }): void | Promise<void>
  /**
   * Changes written atomically with a stored run's final commit.
   */
  finalChanges?(
    run: RunRecord,
    status: RunStatus
  ): Pick<RunChanges, "outbox"> | undefined
  /**
   * Background tasks run on instances that dispatch work.
   */
  periodicTasks?(): PeriodicTask[]
  /**
   * Runs before the caller that drove the run gets its result.
   */
  onRunFinished?(
    run: RunRecord,
    locals: Record<string, unknown>
  ): void | Promise<void>
}

export function composeAround<I>(
  extensions: EngineExtension[],
  hook: "aroundStep" | "aroundRun",
  invocation: I
): <T>(fn: () => Promise<T>) => Promise<T> {
  const wrappers = extensions.filter((extension) => extension[hook])
  return <T>(fn: () => Promise<T>) => {
    const call = (index: number): Promise<T> => {
      if (index === wrappers.length) {
        return fn()
      }
      return (wrappers[index][hook] as any)(invocation, () => call(index + 1))
    }
    return call(0)
  }
}

type NotificationHook =
  | "onStepAttemptFailed"
  | "onStepCompensated"
  | "onRunFinished"

/**
 * Calls a notification hook of every extension in order. A failing extension
 * is logged and does not stop the others.
 */
export async function callExtensions<K extends NotificationHook>(
  extensions: EngineExtension[],
  logger: { error(message: string, error?: unknown): void },
  hook: K,
  args: Parameters<NonNullable<EngineExtension[K]>>,
  describe: string
) {
  for (const extension of extensions) {
    const fn = extension[hook] as ((...args: unknown[]) => unknown) | undefined
    try {
      await fn?.apply(extension, args)
    } catch (error) {
      logger.error(`Extension "${extension.name}" failed ${describe}`, error)
    }
  }
}

/**
 * What an extension may use from the engine it is attached to.
 */
export interface ExtensionHost {
  readonly instanceId: string
  currentScope(): RunScope | undefined
}
