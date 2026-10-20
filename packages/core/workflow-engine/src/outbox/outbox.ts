import { monotonicFactory } from "ulid"
import {
  OutboxFailure,
  OutboxRow,
  OutboxStore,
  RunRecord,
} from "../store/store"
import { EngineExtension, ExtensionHost } from "../runtime/middleware"

export interface OutboxOptions {
  /**
   * Delivers released messages, in the order they were staged. Delivery is at
   * least once: after a crash a message may be published again.
   */
  publish(messages: unknown[]): Promise<void>
  /**
   * The group a run's messages belong to, if any.
   */
  groupOf(run: Pick<RunRecord, "context">): string | undefined
  /**
   * Whether the run releases its group when it finishes. Runs started inside
   * another run's step usually share its group and do not.
   */
  releases(run: Pick<RunRecord, "context">): boolean
  /**
   * How often messages that failed to publish, or were left behind by a
   * crash, are published again. Also the delay after a message's first failed
   * attempt, which doubles with every attempt up to 10 minutes. Defaults to 5
   * seconds.
   */
  republishIntervalMs?: number
  /**
   * Failed attempts after which a stored message is dead: it is no longer
   * published and is kept for inspection for 30 days. Defaults to 10.
   */
  maxPublishAttempts?: number
  logger?: { warn(message: string): void }
}

export interface Outbox {
  extension: EngineExtension
  /**
   * Stages messages for the current step. Must be called inside a step.
   */
  stage(groupId: string, messages: unknown[]): Promise<void>
  /**
   * Publishes what the group has staged so far.
   */
  release(groupId: string): Promise<void>
  discard(groupId: string, filter?: { names?: string[] }): Promise<void>
  /**
   * Whether the current step belongs to a run of this group.
   */
  owns(groupId: string): boolean
}

const nextId = monotonicFactory()
const CLAIM_MS = 30_000
const BATCH = 500
const MAX_BATCHES_PER_TICK = 20
const MAX_BACKOFF_MS = 10 * 60_000
// Single publishes that fail in a row before the transport counts as down.
const OUTAGE_AFTER = 3
const DEFAULT_MAX_PUBLISH_ATTEMPTS = 10

/**
 * Stages messages with the run that produced them and publishes them only
 * when the root run of their group succeeds. Messages of a retried attempt or
 * a compensated step are dropped. Runs that are never stored keep their
 * messages in memory.
 */
export function createOutbox(
  store: OutboxStore,
  options: OutboxOptions
): Outbox {
  let host: ExtensionHost | undefined
  const memory = new Map<string, OutboxRow[]>()
  const unpublished: OutboxRow[] = []

  const owner = () => host?.instanceId ?? "outbox"

  const dropMemory = (predicate: (row: OutboxRow) => boolean) => {
    for (const [groupId, rows] of memory) {
      const kept = rows.filter((row) => !predicate(row))
      kept.length ? memory.set(groupId, kept) : memory.delete(groupId)
    }
  }

  const deliver = async (rows: OutboxRow[]) => {
    if (!rows.length) {
      return
    }
    rows.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    await options.publish(rows.map((row) => row.message))
  }

  const baseBackoffMs = options.republishIntervalMs ?? 5_000
  const retryPolicy = {
    baseDelayMs: baseBackoffMs,
    maxDelayMs: MAX_BACKOFF_MS,
    maxAttempts: options.maxPublishAttempts ?? DEFAULT_MAX_PUBLISH_ATTEMPTS,
  }
  const warn = (message: string) =>
    options.logger ? options.logger.warn(message) : console.warn(message)

  /**
   * Publishes claimed rows and deletes the published ones. When the batch
   * fails, rows are published one by one so one bad message does not hold
   * back the others. Each failed attempt is recorded on the row, which backs
   * it off and, after too many attempts, makes it dead. Rows not tried
   * because the transport looks down are deferred without an attempt.
   * Returns whether every row was published.
   */
  const deliverStored = async (rows: OutboxRow[]): Promise<boolean> => {
    if (!rows.length) {
      return true
    }
    try {
      await deliver(rows)
      await settle(rows, [])
      return true
    } catch (error) {
      if (rows.length === 1) {
        await settle([], [{ id: rows[0].id, error: describeError(error) }])
        return false
      }
    }

    const published: OutboxRow[] = []
    const failed: OutboxFailure[] = []
    let untried: OutboxRow[] = []
    let failedInRow = 0
    for (const [index, row] of rows.entries()) {
      if (!published.length && failedInRow >= OUTAGE_AFTER) {
        untried = rows.slice(index)
        break
      }
      try {
        await deliver([row])
        published.push(row)
        failedInRow = 0
      } catch (error) {
        failed.push({ id: row.id, error: describeError(error) })
        failedInRow++
      }
    }
    await settle(published, failed)
    await store.deferOutbox(
      untried.map((row) => row.id),
      owner(),
      baseBackoffMs
    )
    return !failed.length && !untried.length
  }

  const settle = async (published: OutboxRow[], failed: OutboxFailure[]) => {
    await store.deleteOutboxIds(
      published.map((row) => row.id),
      owner()
    )
    if (!failed.length) {
      return
    }
    const dead = await store.failOutbox(failed, owner(), retryPolicy)
    for (const row of dead) {
      const name = (row.message as { name?: string } | null)?.name
      const reason = (row.lastError as { message?: string } | null)?.message
      warn(
        `Outbox message ${row.id}${name ? ` (${name})` : ""} of group ${
          row.groupId
        } failed to publish ${row.attempts} times and will not be retried${
          reason ? `: ${reason}` : ""
        }`
      )
    }
  }

  const publishGroup = async (groupId: string) => {
    const fromMemory = memory.get(groupId) ?? []
    memory.delete(groupId)

    let stored: OutboxRow[] = []
    for (;;) {
      const batch = await store.claimOutbox(owner(), BATCH, CLAIM_MS, groupId)
      stored = [...stored, ...batch]
      if (batch.length < BATCH) {
        break
      }
    }

    try {
      await deliver([...fromMemory, ...stored])
    } catch (error) {
      unpublished.push(...fromMemory)
      // Stored messages are retried one by one, then with a backoff.
      const ok = await deliverStored(stored)
      if (fromMemory.length || !ok) {
        throw error
      }
      return
    }
    await settle(stored, [])
  }

  const outbox: Outbox = {
    async stage(groupId, messages) {
      const scope = host?.currentScope()
      if (!scope) {
        throw new Error(
          "Grouped messages can only be staged from inside a workflow step"
        )
      }
      const rows: OutboxRow[] = messages.map((message) => ({
        id: nextId(),
        groupId,
        runId: scope.runId,
        stepId: scope.stepId ?? null,
        attempt: scope.attempt ?? null,
        message,
      }))
      if (scope.durability === "none") {
        memory.set(groupId, [...(memory.get(groupId) ?? []), ...rows])
        return
      }
      await store.stageOutbox(rows)
    },

    async release(groupId) {
      await store.markOutboxReady(groupId)
      await publishGroup(groupId)
    },

    async discard(groupId, filter = {}) {
      dropMemory(
        (row) =>
          row.groupId === groupId &&
          (!filter.names ||
            filter.names.includes((row.message as { name?: string })?.name!))
      )
      await store.deleteOutbox({ groupId, names: filter.names })
    },

    owns(groupId) {
      const scope = host?.currentScope()
      return !!scope && options.groupOf(scope) === groupId
    },

    extension: {
      name: "outbox",

      attach(engine) {
        host = engine
      },

      async onStepAttemptFailed({ run, stepId, attempt, willRetry }) {
        if (!willRetry) {
          return
        }
        dropMemory(
          (row) =>
            row.runId === run.id &&
            row.stepId === stepId &&
            row.attempt === attempt
        )
        if (run.durability !== "none") {
          await store.deleteOutbox({ runId: run.id, stepId, attempt })
        }
      },

      async onStepCompensated({ run, stepId }) {
        dropMemory((row) => row.runId === run.id && row.stepId === stepId)
        if (run.durability !== "none") {
          await store.deleteOutbox({ runId: run.id, stepId })
        }
      },

      finalChanges(run, status) {
        const groupId = options.groupOf(run)
        if (!groupId || !options.releases(run)) {
          return undefined
        }
        return {
          outbox:
            status === "succeeded"
              ? { readyGroup: groupId }
              : { discardGroup: groupId },
        }
      },

      async onRunFinished(run) {
        const groupId = options.groupOf(run)
        if (!groupId) {
          return
        }

        if (!options.releases(run)) {
          // A child that failed while its parent goes on loses its messages.
          if (run.status !== "succeeded") {
            dropMemory((row) => row.runId === run.id)
            await store.deleteOutbox({ runId: run.id })
          }
          return
        }

        if (run.status === "succeeded") {
          if (run.durability === "none") {
            await store.markOutboxReady(groupId)
          }
          await publishGroup(groupId)
          return
        }

        memory.delete(groupId)
        if (run.durability === "none") {
          await store.deleteOutbox({ groupId })
        }
      },

      periodicTasks() {
        return [
          {
            name: "outbox-republish",
            everyMs: options.republishIntervalMs ?? 5_000,
            run: async () => {
              const retry = unpublished.splice(0)
              if (retry.length) {
                try {
                  await deliver(retry)
                } catch {
                  unpublished.push(...retry)
                }
              }
              for (let i = 0; i < MAX_BATCHES_PER_TICK; i++) {
                const stored = await store.claimOutbox(owner(), BATCH, CLAIM_MS)
                const ok = await deliverStored(stored)
                if (!ok || stored.length < BATCH) {
                  break
                }
              }
            },
          },
        ]
      },
    },
  }

  return outbox
}

function describeError(error: unknown): { name?: string; message: string } {
  if (error instanceof Error) {
    return { name: error.name, message: error.message }
  }
  return { message: String(error) }
}
