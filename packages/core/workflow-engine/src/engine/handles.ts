import { RunStatus } from "../definition/types"
import {
  EngineStoppedError,
  RunNotFoundError,
  RunNotStoredError,
} from "../errors"
import { Clock } from "../runtime/clock"
import type { Executor } from "../runtime/executor"
import { LiveRunError } from "../runtime/run-state"
import { isFinalRunStatus } from "../runtime/transitions"
import { deserializeError } from "../serialization/serializer"
import { RunRecord, Store } from "../store/store"
import { RunHandle } from "./types"

type FinishWaiter = {
  run: RunRecord
  resolve: (handle: RunHandle) => void
  reject: (error: unknown) => void
}

export interface RunHandlesDeps {
  store: Store
  clock: Clock
  pollIntervalMs(): number
  isActive(runId: string): boolean
  background(task: () => Promise<unknown>, description: string): void
}

/**
 * Builds run handles and keeps the callers waiting on a run: until it finishes
 * (`handle.wait()`) or until its executor in this process goes idle.
 */
export class RunHandles {
  #finish = new Map<string, FinishWaiter[]>()
  #idle = new Map<string, Array<(handle: RunHandle) => void>>()
  #polls = new Map<string, unknown>()
  #stopped = false

  constructor(private readonly deps: RunHandlesDeps) {}

  fromExecutor(executor: Executor): RunHandle {
    const state = executor.state
    return this.#build({
      run: state.snapshot(),
      finished: isFinalRunStatus(state.status),
      result: executor.resultValue,
      resultError: executor.resultError,
      errors: [...state.errors],
    })
  }

  fromRecord(record: RunRecord, opts: { existing?: boolean } = {}): RunHandle {
    return this.#build({
      run: record,
      finished: isFinalRunStatus(record.status),
      result: record.result,
      errors: (record.errors ?? []).map((error) => ({
        ...error,
        cause: deserializeError(error.error),
      })),
      existing: opts.existing,
    })
  }

  async load(runId: string): Promise<RunHandle> {
    const record = await this.deps.store.loadRun(runId, { steps: true })
    if (!record) {
      throw new RunNotFoundError(runId)
    }
    return this.fromRecord(record)
  }

  /**
   * Resolves when the executor holding the run in this process goes idle.
   */
  waitIdle(runId: string): Promise<RunHandle> {
    return new Promise<RunHandle>((resolve) => {
      this.#idle.set(runId, [...(this.#idle.get(runId) ?? []), resolve])
    })
  }

  executorIdle(executor: Executor) {
    const waiters = this.#idle.get(executor.runId)
    if (!waiters) {
      return
    }
    this.#idle.delete(executor.runId)
    const handle = this.fromExecutor(executor)
    waiters.forEach((resolve) => resolve(handle))
  }

  finished(handle: RunHandle) {
    this.#takeFinishWaiters(handle.runId).forEach(({ resolve }) =>
      resolve(handle)
    )
  }

  /**
   * Another instance reported that the run finished.
   */
  remoteFinished(runId: string, status: RunStatus) {
    if (!this.#finish.has(runId)) {
      return
    }
    this.deps.background(async () => {
      const record = await this.deps.store.loadRun(runId, { steps: true })
      const waiters = this.#finish.get(runId)
      if (waiters) {
        this.finished(this.fromRecord(record ?? { ...waiters[0].run, status }))
      }
    }, `Failed to load finished run ${runId}`)
  }

  start() {
    this.#stopped = false
  }

  /**
   * Stops polling and rejects every pending `wait()`: nothing in this process
   * would settle them any more.
   */
  stop() {
    this.#stopped = true
    for (const poll of this.#polls.values()) {
      this.deps.clock.clearTimeout(poll)
    }
    this.#polls.clear()
    const waiters = [...this.#finish.values()].flat()
    this.#finish.clear()
    for (const { run, reject } of waiters) {
      reject(
        new EngineStoppedError(
          `The workflow engine stopped before run ${run.id} of workflow "${run.workflowId}" finished`
        )
      )
    }
  }

  #build(parts: {
    run: RunRecord
    finished: boolean
    result: unknown
    resultError?: unknown
    errors: LiveRunError[]
    existing?: boolean
  }): RunHandle {
    const { run } = parts
    const handle: RunHandle = {
      runId: run.id,
      workflowId: run.workflowId,
      transactionId: run.transactionId,
      status: run.status,
      ...parts,
      wait: () => {
        if (handle.finished) {
          return Promise.resolve(handle)
        }
        if (run.durability === "none") {
          return Promise.reject(new RunNotStoredError(run.id, run.workflowId))
        }
        if (this.#stopped) {
          return Promise.reject(
            new EngineStoppedError(
              `The workflow engine is stopped and cannot wait for run ${run.id} of workflow "${run.workflowId}"`
            )
          )
        }
        return new Promise<RunHandle>((resolve, reject) => {
          this.#finish.set(run.id, [
            ...(this.#finish.get(run.id) ?? []),
            { run, resolve, reject },
          ])
          this.#poll(run.id)
        })
      },
    }
    return handle
  }

  /**
   * Runs finishing on another instance are seen through the notifier, which
   * may lose messages, so waiters also poll the store.
   */
  #poll(runId: string) {
    if (this.#stopped) {
      return
    }
    const existing = this.#polls.get(runId)
    if (existing !== undefined) {
      this.deps.clock.clearTimeout(existing)
    }
    const timer = this.deps.clock.setTimeout(() => {
      this.#polls.delete(runId)
      this.deps.background(async () => {
        try {
          await this.#checkFinished(runId)
        } finally {
          if (this.#finish.has(runId)) {
            this.#poll(runId)
          }
        }
      }, `Failed to check whether run ${runId} finished`)
    }, this.deps.pollIntervalMs())
    this.#polls.set(runId, timer)
  }

  async #checkFinished(runId: string) {
    if (!this.#finish.has(runId) || this.deps.isActive(runId)) {
      return
    }
    const record = await this.deps.store.loadRun(runId)
    if (!record) {
      // Finished and not retained, so its outcome is gone.
      this.#takeFinishWaiters(runId).forEach(({ reject }) =>
        reject(new RunNotFoundError(runId))
      )
      return
    }
    if (isFinalRunStatus(record.status)) {
      const full = await this.deps.store.loadRun(runId, { steps: true })
      this.finished(this.fromRecord(full ?? record))
    }
  }

  #takeFinishWaiters(runId: string) {
    const waiters = this.#finish.get(runId) ?? []
    this.#finish.delete(runId)
    const poll = this.#polls.get(runId)
    if (poll !== undefined) {
      this.deps.clock.clearTimeout(poll)
      this.#polls.delete(runId)
    }
    return waiters
  }
}
