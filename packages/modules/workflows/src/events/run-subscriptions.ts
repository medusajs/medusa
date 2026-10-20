import type { Logger } from "@medusajs/framework/types"
import { Engine, isFinalRunStatus, RunEvent } from "@medusajs/workflow-engine"
import { LegacyEvent, toLegacyEvent } from "../legacy/transaction-view"

type Subscriber = ((event: LegacyEvent) => unknown) & { _id?: string }
export type RunCallbacks = Record<string, Function | undefined>
export type RunKey = { workflowId: string; transactionId: string }

const ANY_TRANSACTION = "any"

// Callbacks of a run that finishes on another instance are never called when
// no notifier relays its events, so they are dropped once the run is seen
// finished, or at the latest after a day.
const CALLBACK_SWEEP_INTERVAL_MS = 60_000
const CALLBACK_MISSING_TTL_MS = 60 * 60 * 1000
const CALLBACK_MAX_TTL_MS = 24 * 60 * 60 * 1000

export const runKey = ({ workflowId, transactionId }: RunKey) =>
  `${workflowId}:${transactionId}`

/**
 * Delivers the engine's run events to `subscribe` listeners and to the
 * `events` callbacks passed to a single call, in the legacy event shape.
 */
export class RunSubscriptions {
  #subscribers = new Map<string, Map<string, Subscriber[]>>()
  #runCallbacks = new Map<string, Map<RunCallbacks, number>>()
  #callbackSweep?: ReturnType<typeof setInterval>
  #stopped = false

  constructor(
    private readonly engine: Engine,
    private readonly logger: Pick<Logger, "error" | "warn">
  ) {
    engine.on((event) => this.#dispatch(event))
  }

  subscribe(
    workflowId: string,
    transactionId: string | undefined,
    subscriber: Function,
    subscriberId?: string
  ) {
    const handler = subscriber as Subscriber
    handler._id = subscriberId
    const byTransaction = this.#subscribers.get(workflowId) ?? new Map()
    const key = transactionId ?? ANY_TRANSACTION
    const handlers = (byTransaction.get(key) ?? []).filter(
      (existing) =>
        existing !== handler && (!subscriberId || existing._id !== subscriberId)
    )
    handlers.push(handler)
    byTransaction.set(key, handlers)
    this.#subscribers.set(workflowId, byTransaction)
  }

  unsubscribe(
    workflowId: string,
    transactionId: string | undefined,
    subscriberOrId: string | Function
  ) {
    const byTransaction = this.#subscribers.get(workflowId)
    if (!byTransaction) {
      return
    }
    const key = transactionId ?? ANY_TRANSACTION
    const handlers = (byTransaction.get(key) ?? []).filter((handler) =>
      handler._id ? handler._id !== subscriberOrId : handler !== subscriberOrId
    )
    if (handlers.length) {
      byTransaction.set(key, handlers)
    } else {
      byTransaction.delete(key)
    }
    if (!byTransaction.size) {
      this.#subscribers.delete(workflowId)
    }
  }

  /**
   * Returns what to pass to `removeCallbacks` when the call that added them
   * fails or finds the run already finished.
   */
  addCallbacks(
    key: RunKey,
    callbacks?: RunCallbacks
  ): RunCallbacks | undefined {
    if (!callbacks || !Object.keys(callbacks).length) {
      return undefined
    }
    const id = runKey(key)
    const entries = this.#runCallbacks.get(id) ?? new Map()
    entries.set(callbacks, Date.now())
    this.#runCallbacks.set(id, entries)
    this.#scheduleCallbackSweep()
    return callbacks
  }

  removeCallbacks(key: RunKey, callbacks: RunCallbacks | undefined) {
    if (!callbacks) {
      return
    }
    const id = runKey(key)
    const entries = this.#runCallbacks.get(id)
    entries?.delete(callbacks)
    if (entries && !entries.size) {
      this.#runCallbacks.delete(id)
    }
  }

  stop() {
    this.#stopped = true
    if (this.#callbackSweep) {
      clearInterval(this.#callbackSweep)
      this.#callbackSweep = undefined
    }
  }

  clear() {
    this.#runCallbacks.clear()
    this.#subscribers.clear()
  }

  #scheduleCallbackSweep() {
    if (this.#callbackSweep || this.#stopped) {
      return
    }
    this.#callbackSweep = setInterval(
      () => void this.#sweepRunCallbacks(),
      CALLBACK_SWEEP_INTERVAL_MS
    )
    this.#callbackSweep.unref?.()
  }

  async #sweepRunCallbacks() {
    const now = Date.now()
    for (const [id, entries] of [...this.#runCallbacks]) {
      const oldest = Math.min(...entries.values())
      if (now - oldest < CALLBACK_SWEEP_INTERVAL_MS) {
        continue
      }
      const separator = id.indexOf(":")
      const key = {
        workflowId: id.slice(0, separator),
        transactionId: id.slice(separator + 1),
      }
      const run = await this.engine
        .findRun(key.workflowId, key.transactionId)
        .catch(() => undefined)
      for (const [callbacks, addedAt] of entries) {
        const age = now - addedAt
        if (age < CALLBACK_SWEEP_INTERVAL_MS) {
          continue
        }
        const finished = !!run && isFinalRunStatus(run.status)
        const missing = run === null && age > CALLBACK_MISSING_TTL_MS
        if (finished || missing) {
          this.removeCallbacks(key, callbacks)
        } else if (age > CALLBACK_MAX_TTL_MS) {
          this.removeCallbacks(key, callbacks)
          this.logger.warn(
            `Dropped the callbacks of workflow ${id} after waiting a day for it to finish`
          )
        }
      }
    }
    if (!this.#runCallbacks.size && this.#callbackSweep) {
      clearInterval(this.#callbackSweep)
      this.#callbackSweep = undefined
    }
  }

  #dispatch(event: RunEvent) {
    const callbacksKey = runKey(event)
    const callbacks = this.#runCallbacks.get(callbacksKey)
    const byTransaction = this.#subscribers.get(event.workflowId)
    if (!callbacks && !byTransaction) {
      return
    }

    const { registry } = this.engine
    const compiled = registry.has(event.workflowId)
      ? registry.get(event.workflowId)
      : undefined
    const legacy = toLegacyEvent(event, compiled)
    if (!legacy) {
      return
    }

    for (const callback of callbacks?.keys() ?? []) {
      try {
        callback[legacy.name]?.({
          transaction: legacy.transaction,
          step: legacy.payload.step,
          response: legacy.payload.response,
          result: legacy.payload.result,
          errors: legacy.payload.errors,
        })
      } catch (error) {
        this.logger.error(`Workflow event handler error: ${error}`)
      }
    }
    if (legacy.name === "onFinish") {
      this.#runCallbacks.delete(callbacksKey)
    }

    if (byTransaction) {
      setImmediate(() =>
        this.#notifySubscribers(byTransaction, event, legacy.payload)
      )
    }
  }

  #notifySubscribers(
    byTransaction: Map<string, Subscriber[]>,
    event: RunEvent,
    payload: LegacyEvent
  ) {
    const handlers = [
      ...(byTransaction.get(event.transactionId) ?? []),
      ...(byTransaction.get(ANY_TRANSACTION) ?? []),
    ]
    if (payload.eventType === "onFinish") {
      byTransaction.delete(event.transactionId)
      if (
        !byTransaction.size &&
        this.#subscribers.get(event.workflowId) === byTransaction
      ) {
        this.#subscribers.delete(event.workflowId)
      }
    }
    for (const handler of handlers) {
      Promise.resolve()
        .then(() => handler(payload))
        .catch((error) => this.logger.error(`Subscriber error: ${error}`))
    }
  }
}
