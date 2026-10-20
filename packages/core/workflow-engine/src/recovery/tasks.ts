import { EngineExtension } from "../runtime/middleware"
import { Store } from "../store/store"
import { PeriodicTask } from "./periodic"

// Orphaned timers and staged messages are swept in bounded batches. A staged
// message is only an orphan long after its group could still be released.
const ORPHAN_SWEEP_LIMIT = 1000
const ORPHAN_SWEEP_BATCHES = 10
const ORPHAN_OUTBOX_STALE_MS = 7 * 24 * 60 * 60 * 1000
// Runs of dead instances are rescheduled in batches until none are left, up
// to a bound per reaper tick.
const EXPIRED_LEASE_BATCH = 100
const EXPIRED_LEASE_BATCHES = 10

export interface EngineTasksDeps {
  store: Store
  instanceId: string
  mode: string
  leaseTtlMs: number
  /**
   * Set when recovery is on.
   */
  recovery?: { heartbeatIntervalMs: number; reaperIntervalMs: number }
  /**
   * Whether this instance dispatches timers and schedules.
   */
  dispatches: boolean
  extensions: EngineExtension[]
  staleScheduleMs: number
  retentionCleanupIntervalMs: number
  scheduledWorkflowIds(): string[]
  resumeLater(runIds: string[], opts?: { onlyEarlier?: boolean }): Promise<void>
  wakeWorkers(): void
}

/**
 * The background tasks an engine instance runs: heartbeats, the reaper,
 * schedule bookkeeping, extension tasks and retention.
 */
export function engineTasks(deps: EngineTasksDeps): PeriodicTask[] {
  const { store, recovery } = deps
  const tasks: PeriodicTask[] = []

  // Leases stay held while their owner heartbeats, so only the heartbeat is
  // written. One live worker reaps for all of them.
  let reaps = false

  if (recovery) {
    tasks.push({
      name: "heartbeat",
      everyMs: recovery.heartbeatIntervalMs,
      run: async () => {
        const { reaper } = await store.heartbeat(
          { id: deps.instanceId, mode: deps.mode },
          { liveMs: deps.leaseTtlMs }
        )
        reaps = reaper === deps.instanceId
      },
    })
  }

  if (recovery && deps.dispatches) {
    tasks.push({
      name: "reaper",
      everyMs: recovery.reaperIntervalMs,
      run: async () => {
        if (!reaps) {
          return
        }
        let rescheduled = 0
        for (let i = 0; i < EXPIRED_LEASE_BATCHES; i++) {
          const batch = await store.scheduleExpiredLeaseResumes(
            EXPIRED_LEASE_BATCH,
            deps.leaseTtlMs
          )
          rescheduled += batch.length
          if (batch.length < EXPIRED_LEASE_BATCH) {
            break
          }
        }
        if (rescheduled) {
          deps.wakeWorkers()
        }

        const now = (await store.now()).getTime()
        const orphaned = await store.recoverOrphanedSteps(
          new Date(now - recovery.heartbeatIntervalMs * 3)
        )
        // A resume timer that is already due is left alone, so its
        // generation and claim stay as they are.
        await deps.resumeLater(orphaned, { onlyEarlier: true })
        // Well past the point where its steps were recovered.
        await store.deleteStaleWorkers(new Date(now - deps.leaseTtlMs * 10))
      },
    })
  }

  if (deps.dispatches) {
    tasks.push({
      name: "schedules",
      everyMs: 60 * 60_000,
      run: async () => {
        await store.touchSchedules(deps.scheduledWorkflowIds())
        await store.deleteStaleSchedules(
          new Date((await store.now()).getTime() - deps.staleScheduleMs)
        )
      },
    })
    for (const extension of deps.extensions) {
      tasks.push(...(extension.periodicTasks?.() ?? []))
    }
    tasks.push({
      name: "retention",
      everyMs: deps.retentionCleanupIntervalMs,
      run: async () => {
        await store.deleteExpired()
        for (let i = 0; i < ORPHAN_SWEEP_BATCHES; i++) {
          const deleted = await store.deleteOrphans({
            limit: ORPHAN_SWEEP_LIMIT,
            outboxStaleMs: ORPHAN_OUTBOX_STALE_MS,
          })
          if (deleted < ORPHAN_SWEEP_LIMIT) {
            break
          }
        }
      },
    })
  }

  return tasks
}
