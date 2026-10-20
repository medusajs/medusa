import { CompiledWorkflow } from "../definition/compile"
import { WorkflowRegistry } from "../definition/registry"
import { Durability } from "../definition/types"
import { isFinalRunStatus } from "../runtime/transitions"
import { ClaimedSchedule, ScheduleSpec, Store } from "../store/store"
import { nextFireTime } from "./cron"

export function scheduledWorkflowIds(registry: WorkflowRegistry): string[] {
  return registry
    .list()
    .filter((compiled) => compiled.definition.options.schedule)
    .map((compiled) => compiled.id)
}

export function scheduleSpec(compiled: CompiledWorkflow): ScheduleSpec {
  const schedule = compiled.definition.options.schedule!
  return {
    workflowId: compiled.id,
    cron: schedule.cron ?? null,
    intervalMs: schedule.intervalMs ?? null,
    concurrency: schedule.concurrency ?? "forbid",
    numberOfExecutions: schedule.numberOfExecutions ?? null,
    catchUp: schedule.catchUp ?? true,
    definitionHash: compiled.hash,
  }
}

/**
 * Returns the next fire time computed for a new schedule; one that exists
 * keeps its own.
 */
export async function upsertSchedule(store: Store, compiled: CompiledWorkflow) {
  const spec = scheduleSpec(compiled)
  const next = nextFireTime(spec, await store.now())
  await store.upsertSchedule(spec, next)
  return next
}

export interface FireScheduleDeps {
  store: Store
  owner: string
  pollIntervalMs: number
  /**
   * Called with the next fire, so the dispatcher checks for it then.
   */
  wakeAt?(at: Date): void
  logger: {
    error(message: string, error?: unknown): void
    warn(message: string): void
  }
  start(options: {
    workflowId: string
    transactionId: string
    input: unknown
    options: { durability: Durability }
  }): Promise<unknown>
}

/**
 * Advances a claimed schedule to its next fire, then starts the run for this
 * fire unless it was missed or the previous run is still going.
 */
export async function fireSchedule(
  deps: FireScheduleDeps,
  { schedule, now }: ClaimedSchedule
) {
  const { store } = deps
  const fireTime = schedule.nextFireAt!
  const missedTooLong =
    !schedule.catchUp &&
    now.getTime() - fireTime.getTime() >
      Math.max(deps.pollIntervalMs, 1_000) * 2

  // Missed fires collapse into this one: the next fire is computed from now.
  const nextFireAt = nextFireTime(
    schedule,
    new Date(Math.max(now.getTime(), fireTime.getTime()))
  )

  let fire = !missedTooLong
  if (fire && schedule.concurrency === "forbid" && schedule.lastTransactionId) {
    const previous = await store.findRun(
      schedule.workflowId,
      schedule.lastTransactionId
    )
    if (previous && !isFinalRunStatus(previous.status)) {
      fire = false
      deps.logger.warn(
        `Skipped a fire of "${schedule.workflowId}": the previous run is still running`
      )
    }
  }

  const transactionId = `schedule:${
    schedule.workflowId
  }:${fireTime.toISOString()}`
  const remaining =
    fire && schedule.remaining !== null
      ? schedule.remaining - 1
      : schedule.remaining

  // The next fire is stored before the run starts, so a failing run never
  // stops its schedule.
  const advanced = await store.advanceSchedule(
    schedule.workflowId,
    deps.owner,
    {
      nextFireAt: remaining === 0 ? null : nextFireAt,
      remaining,
      lastTransactionId: fire ? transactionId : schedule.lastTransactionId,
    }
  )
  if (advanced && remaining !== 0 && nextFireAt) {
    deps.wakeAt?.(nextFireAt)
  }
  if (!advanced || !fire) {
    return
  }

  try {
    await deps.start({
      workflowId: schedule.workflowId,
      transactionId,
      input: { scheduledFor: fireTime.toISOString() },
      options: { durability: "summary" },
    })
  } catch (error) {
    deps.logger.error(`Scheduled run of "${schedule.workflowId}" failed`, error)
  }
}
