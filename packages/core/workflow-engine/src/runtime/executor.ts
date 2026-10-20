import { CompiledWorkflow } from "../definition/compile"
import { runTimeoutMs } from "../definition/run-options"
import {
  RunStatus,
  StepAction,
  StepContext,
  StepResult,
} from "../definition/types"
import { LeaseLostError, RunTimeoutError, WorkflowEngineError } from "../errors"
import { RunEvent, RunEventName } from "../events/emitter"
import { deserializeError, serializeError } from "../serialization/serializer"
import {
  resumeTimer,
  retryTimer,
  stepTimeoutTimer,
  timerId,
} from "../scheduling/timers"
import { Lease, NewTimer, RunChanges, StepRecord, Store } from "../store/store"
import { Clock, sleep } from "./clock"
import { runCompensation } from "./compensator"
import { callExtensions, composeAround, EngineExtension } from "./middleware"
import { RunState } from "./run-state"
import { runInScope } from "./scope"
import {
  idempotencyKey,
  invokeOnce,
  InvokeOutcome,
  InvokeRequest,
} from "./step-invoker"

export interface ExecutorRuntime {
  engineId: string
  instanceId: string
  mode: "shared" | "worker" | "server"
  store: Store
  clock: Clock
  extensions: EngineExtension[]
  logger: {
    error(message: string, error?: unknown): void
    warn(message: string): void
  }
  /**
   * Abort controllers of async step handlers running in this process, by run.
   * They outlive the executor that launched them.
   */
  asyncHandlers: Map<string, Set<AbortController>>
  emit(event: RunEvent): void
  attach(executor: Executor): void
  detach(executor: Executor): void
  continueRun(runId: string): Promise<unknown>
  /**
   * Completes the run's waiting steps whose child run already finished but
   * could not complete them, because the step was not waiting yet.
   */
  settleFinishedChildren(executor: Executor): Promise<void>
  completeFromBackground(
    executor: Executor,
    index: number,
    attempt: number,
    outcome: InvokeOutcome
  ): Promise<void>
  /**
   * Tells dispatchers that a timer is due now.
   */
  wakeWorkers(): void
  /**
   * Tells this instance's dispatcher when timers it just armed are due, so it
   * does not wait for its next poll.
   */
  timersArmed?(dueAt: Date[]): void
  finished(executor: Executor): Promise<void>
}

// How long a run whose executor failed waits before it is resumed.
const RESUME_AFTER_ERROR_MS = 5_000

type SettlementBody =
  | InvokeOutcome
  | { kind: "retry_scheduled"; error: unknown }

type Settlement = { index: number } & SettlementBody

/**
 * Drives one run in this process while it holds the run's lease. A run with
 * durability `none` has no lease and is never stored.
 */
export class Executor {
  readonly runId: string
  locals: Record<string, unknown>
  resultValue: unknown
  resultError: unknown
  cancelRequested: boolean
  timedOut = false
  /**
   * The run's timeout, with the per-call override it was started with.
   */
  readonly timeoutMs: number

  #running = new Map<number, AbortController>()
  #settled: Settlement[] = []
  #wake: (() => void) | null = null
  #externalPending = false
  #failing = false
  #handOff = false
  #checkedBeforePark = false
  #parking = false
  #pendingTimers: NewTimer[] = []
  #pendingTimerDeletes: string[] = []
  /**
   * Steps that were running when the run timed out. They keep their results
   * but carry the timeout error.
   */
  #inFlightAtTimeout = new Set<number>()
  #commitChain: Promise<unknown> = Promise.resolve()
  /**
   * How many of the run's errors the store has. Errors are only appended.
   */
  #storedErrorCount: number
  /**
   * Set when another process took the run over and this one must stop.
   */
  lost = false

  constructor(
    readonly runtime: ExecutorRuntime,
    readonly compiled: CompiledWorkflow,
    readonly state: RunState,
    public lease: Lease | null,
    locals: Record<string, unknown>
  ) {
    this.runId = state.run.id
    this.locals = locals
    this.cancelRequested = !!state.run.cancelRequestedAt
    this.#storedErrorCount = state.errors.length
    this.timeoutMs = runTimeoutMs(compiled, state.run)
  }

  get durability() {
    return this.state.run.durability
  }

  get stored() {
    return this.durability !== "none"
  }

  /**
   * Set once the executor committed to parking: it no longer reacts to a run
   * timeout, so the timeout must wait until it detached.
   */
  get parking() {
    return this.#parking
  }

  notify() {
    this.#externalPending = true
    this.#wake?.()
  }

  requestTimeout() {
    if (!this.timedOut) {
      this.timedOut = true
      this.#running.forEach((_, index) => this.#inFlightAtTimeout.add(index))
      for (const controller of this.#running.values()) {
        controller.abort()
      }
      this.#abortAsyncHandlers()
      this.#wake?.()
    }
  }

  /**
   * Applies failures reported from outside while no executor held the run.
   */
  recoverPendingFailures() {
    this.state.steps.forEach((step, index) => {
      if (!step.pendingFailure) {
        return
      }
      const latest = this.state.stepRecord(index)
      step.status = "waiting"
      this.#applyStoredStep(index, latest)
    })
  }

  async execute(): Promise<void> {
    this.runtime.attach(this)

    try {
      const around = composeAround(this.runtime.extensions, "aroundRun", {
        run: this.state.run,
        locals: this.locals,
      })
      await around(() => this.#drive())
    } catch (error) {
      if (!(error instanceof LeaseLostError)) {
        await this.#abandon()
        throw error
      }
      // Another process took the run over. Nothing this one did after losing
      // the lease was written; running steps finish but are not recorded.
      this.lost = true
      this.lease = null
      for (const controller of this.#running.values()) {
        controller.abort()
      }
      this.#abortAsyncHandlers()
    } finally {
      this.runtime.detach(this)
    }
  }

  /**
   * Gives the run up after an unexpected error, so it is not stuck behind a
   * lease that heartbeats keep renewing: a resume timer picks it up later.
   * An earlier resume timer, such as the one being handled, is kept with its
   * claim, which delays a run that keeps failing.
   */
  async #abandon() {
    for (const controller of this.#running.values()) {
      controller.abort()
    }
    const lease = this.lease
    if (!lease) {
      return
    }
    this.lease = null
    const { store, clock, logger } = this.runtime
    const resumeAt = new Date(clock.now() + RESUME_AFTER_ERROR_MS)
    // Independent, so that a released lease alone still lets the reaper
    // recover the run.
    await Promise.all([
      store
        .scheduleTimers([resumeTimer(this.#runRef, resumeAt)], {
          onlyEarlier: true,
        })
        .catch((error) =>
          logger.error(`Failed to schedule run ${this.runId} to resume`, error)
        ),
      store
        .releaseLease(lease)
        .catch((error) =>
          logger.error(
            `Failed to release the lease of run ${this.runId}`,
            error
          )
        ),
    ])
  }

  get #runRef() {
    const run = this.state.run
    return {
      id: run.id,
      workflowId: run.workflowId,
      definitionHash: run.definitionHash,
    }
  }

  async #drive(): Promise<void> {
    for (;;) {
      if (this.#externalPending) {
        await this.#applyExternal()
      }

      if (this.#deadlinePassed() && !this.timedOut) {
        this.timedOut = true
        this.#running.forEach((_, index) => this.#inFlightAtTimeout.add(index))
      }

      if (this.state.status === "compensating") {
        await this.#compensate()
        return
      }

      if (this.state.status === "succeeded") {
        // A retained, finished run that is being cancelled.
        if (this.cancelRequested) {
          await this.#beginCompensation()
          continue
        }
        return
      }

      if (this.timedOut || this.cancelRequested) {
        await this.#stopInvoking()
        await this.#beginCompensation()
        continue
      }

      if (this.state.status === "waiting") {
        this.state.setRunStatus("running")
      }

      if (!this.#failing) {
        await this.#launchReady()
      }

      if (this.#running.size === 0 && this.#settled.length === 0) {
        if (this.#externalPending) {
          continue
        }
        if (this.#failing) {
          await this.#beginCompensation()
          continue
        }
        if (this.state.allResolved) {
          await this.#finishSuccess()
          return
        }
        // Another process may have completed a step while this one ran.
        if (this.durability === "full" && !this.#checkedBeforePark) {
          this.#checkedBeforePark = true
          await this.runtime.settleFinishedChildren(this)
          if (await this.#applyExternal()) {
            continue
          }
        }
        if (await this.#park()) {
          return
        }
        continue
      }

      await this.#nextSettlement()
      this.#processSettlements()
      this.#checkedBeforePark = false
      await this.#flush()
    }
  }

  /**
   * Async steps are written as waiting in one commit before any of their
   * handlers start; handlers then start in declaration order.
   */
  async #launchReady() {
    const ready: number[] = []
    let hasAsync = false
    for (const index of this.state.takeReady()) {
      if (this.#running.has(index)) {
        continue
      }
      if (this.compiled.steps[index].options.async) {
        // Servers leave async steps to workers.
        if (this.runtime.mode === "server") {
          this.#handOff = true
          continue
        }
        this.#prepareAsync(index)
        hasAsync = true
      }
      ready.push(index)
    }
    if (hasAsync) {
      await this.#flush()
    }
    for (const index of ready) {
      if (this.compiled.steps[index].options.async) {
        this.#startAsync(index)
      } else {
        this.#launchSync(index)
      }
    }
  }

  #launchSync(index: number) {
    void this.#runSync(index).then(
      (settlement) => {
        this.#running.delete(index)
        this.#settled.push({ index, ...settlement } as Settlement)
        this.#wake?.()
      },
      (error) => {
        this.#running.delete(index)
        this.#settled.push({ index, kind: "failure", error, permanent: true })
        this.#wake?.()
      }
    )
  }

  async #runSync(index: number): Promise<SettlementBody> {
    const node = this.compiled.steps[index]
    const step = this.state.steps[index]
    const maxRetries = node.options.maxRetries ?? 0

    for (;;) {
      // Set before the first await so the step counts as running at once.
      const controller = new AbortController()
      this.#running.set(index, controller)
      this.#beginAttempt(index)

      const outcome = await invokeOnce(this.#invokeRequest(index, controller))
      if (outcome.kind !== "failure") {
        return outcome
      }

      const exhausted = step.attempt > maxRetries
      if (
        outcome.permanent ||
        exhausted ||
        this.timedOut ||
        this.cancelRequested ||
        this.lost
      ) {
        await this.#attemptFailed(index, step.attempt, false)
        return { ...outcome, permanent: true }
      }
      await this.#attemptFailed(index, step.attempt, true)

      if (node.options.autoRetry === false) {
        return { kind: "retry_scheduled", error: outcome.error }
      }

      const interval = node.options.retryIntervalMs
      if (interval) {
        // The retry happens here while this process holds the lease. The
        // stored timer only matters if the process dies before then.
        this.state.setStepStatus(index, "retry_scheduled")
        step.error = undefined
        this.#pendingTimers.push(
          retryTimer(
            this.#runRef,
            node.id,
            new Date(this.runtime.clock.now() + interval)
          )
        )
        await this.#flush()
        await sleep(this.runtime.clock, interval, controller.signal)
        if (this.timedOut || this.cancelRequested || this.lost) {
          return { ...outcome, permanent: true }
        }
        this.#pendingTimerDeletes.push(timerId.retry(this.runId, node.id))
        this.state.setStepStatus(index, "pending")
      }
    }
  }

  #attemptFailed(index: number, attempt: number, willRetry: boolean) {
    const stepId = this.state.stepId(index)
    return callExtensions(
      this.runtime.extensions,
      this.runtime.logger,
      "onStepAttemptFailed",
      [{ run: this.state.run, stepId, attempt, willRetry }],
      `after step "${stepId}" of run ${this.runId} failed`
    )
  }

  stepCompensated(index: number) {
    const stepId = this.state.stepId(index)
    return callExtensions(
      this.runtime.extensions,
      this.runtime.logger,
      "onStepCompensated",
      [{ run: this.state.run, stepId }],
      `after step "${stepId}" of run ${this.runId} was compensated`
    )
  }

  #beginAttempt(index: number) {
    const step = this.state.steps[index]
    step.attempt++
    step.startedAt = new Date(this.runtime.clock.now())
    this.state.setStepStatus(index, "running")
    this.#emit("stepStarted", {
      stepId: this.state.stepId(index),
      action: "invoke",
      attempt: step.attempt,
    })
  }

  /**
   * Async handlers run outside the executor: their step timeout is a stored
   * timer and a run timeout does not reach them.
   */
  #invokeRequest(
    index: number,
    controller: AbortController,
    async = false
  ): InvokeRequest {
    const node = this.compiled.steps[index]
    const ctx = this.context(index, "invoke", controller.signal)
    return {
      ctx,
      controller,
      clock: this.runtime.clock,
      timeoutMs: async ? undefined : node.options.timeoutMs,
      handler: node.invoke,
      call: (fn) => this.callHandler(ctx, fn),
      runTimedOut: () =>
        !async && this.timedOut
          ? new RunTimeoutError(this.compiled.id, this.timeoutMs)
          : undefined,
    }
  }

  /**
   * Async steps are `waiting` before their handler starts, so an outside
   * completion can arrive at any time. A handler that resolves with an output
   * completes the step in the background.
   */
  #prepareAsync(index: number) {
    const node = this.compiled.steps[index]
    const step = this.state.steps[index]
    step.attempt++
    step.startedAt = new Date(this.runtime.clock.now())
    // Recovery re-runs the step if this instance dies before its handler
    // returns.
    step.owner = this.runtime.instanceId
    this.state.setStepStatus(index, "waiting")
    if (node.options.timeoutMs) {
      this.#pendingTimers.push(
        stepTimeoutTimer(
          this.#runRef,
          node.id,
          step.attempt,
          new Date(this.runtime.clock.now() + node.options.timeoutMs)
        )
      )
    }
  }

  #startAsync(index: number) {
    const node = this.compiled.steps[index]
    const attempt = this.state.steps[index].attempt
    this.#emit("stepStarted", { stepId: node.id, action: "invoke", attempt })
    this.#emit("stepWaiting", { stepId: node.id, action: "invoke", attempt })

    const controller = new AbortController()
    const handlers = this.runtime.asyncHandlers
    const live = handlers.get(this.runId) ?? new Set<AbortController>()
    live.add(controller)
    handlers.set(this.runId, live)

    void invokeOnce(this.#invokeRequest(index, controller, true))
      .then((outcome) =>
        this.runtime.completeFromBackground(this, index, attempt, outcome)
      )
      .catch((error) =>
        this.runtime.logger.error(
          `Failed to complete step "${node.id}" of run ${this.runId}`,
          error
        )
      )
      .finally(() => {
        live.delete(controller)
        if (!live.size && handlers.get(this.runId) === live) {
          handlers.delete(this.runId)
        }
      })
  }

  #abortAsyncHandlers() {
    const live = this.runtime.asyncHandlers.get(this.runId) ?? []
    for (const controller of live) {
      controller.abort()
    }
  }

  /**
   * Resolves when a step settles, or, unless only steps count, when something
   * outside needs handling. Waiting for steps only matters once the run is
   * stopping: a timeout would otherwise resolve this at once, forever.
   */
  #nextSettlement(stepsOnly = false): Promise<void> {
    if (
      this.#settled.length ||
      (!stepsOnly && (this.#externalPending || this.timedOut))
    ) {
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      this.#wake = () => {
        this.#wake = null
        resolve()
      }
    })
  }

  #processSettlements() {
    const settled = this.#settled
    this.#settled = []
    for (const settlement of settled) {
      this.#apply(settlement)
    }
  }

  #apply(settlement: Settlement) {
    const { index } = settlement
    const stepId = this.state.stepId(index)
    const step = this.state.steps[index]
    step.finishedAt = new Date(this.runtime.clock.now())

    switch (settlement.kind) {
      case "output":
        this.state.setStepStatus(index, "succeeded")
        this.state.setOutput(
          index,
          settlement.output,
          settlement.compensateInput
        )
        step.error = null
        this.#emit("stepSucceeded", {
          stepId,
          action: "invoke",
          attempt: step.attempt,
          output: settlement.output,
        })
        this.state.resolve(index)
        return
      case "skip":
        this.state.setStepStatus(index, "skipped")
        step.skipReason = "condition"
        this.state.flags.hasSkippedSteps = true
        this.#emit("stepSkipped", {
          stepId,
          action: "invoke",
          attempt: step.attempt,
        })
        this.state.resolve(index)
        return
      case "wait":
        if (!this.stored) {
          this.#applyPermanentFailure(index, {
            kind: "failure",
            error: new WorkflowEngineError(
              `Step "${stepId}" of workflow "${this.compiled.id}" waits, but the run is not stored (durability "none") and could never resume`
            ),
            permanent: true,
          })
          return
        }
        this.state.setStepStatus(index, "waiting")
        this.#emit("stepWaiting", {
          stepId,
          action: "invoke",
          attempt: step.attempt,
        })
        return
      case "retry_scheduled":
        this.state.setStepStatus(index, "retry_scheduled")
        step.error = serializeError(settlement.error)
        return
      case "failure":
        this.#applyPermanentFailure(index, settlement)
        return
    }
  }

  #applyPermanentFailure(
    index: number,
    failure: Extract<InvokeOutcome, { kind: "failure" }>
  ) {
    const node = this.compiled.steps[index]
    const step = this.state.steps[index]

    this.state.setStepStatus(index, failure.timedOut ? "timed_out" : "failed")
    step.pendingFailure = null
    if (failure.partial) {
      this.state.setOutput(
        index,
        failure.partial.output,
        failure.partial.compensateInput
      )
    }
    this.state.addError(index, "invoke", failure.error)
    this.#emit("stepFailed", {
      stepId: node.id,
      action: "invoke",
      attempt: step.attempt,
      error: failure.error,
    })

    if (this.timedOut || this.cancelRequested) {
      this.#failing = true
      return
    }

    const { continueOnPermanentFailure, skipOnPermanentFailure } = node.options

    if (continueOnPermanentFailure) {
      this.state.flags.hasFailedSteps = true
      this.state.resolve(index)
      return
    }

    if (skipOnPermanentFailure) {
      this.state.flags.hasFailedSteps = true
      this.#skipDescendants(index, skipOnPermanentFailure)
      return
    }

    this.#failing = true
  }

  #skipDescendants(index: number, target: true | string) {
    const descendants = this.state.descendants(index)
    if (typeof target === "string") {
      const targetIndex = this.compiled.indexById.get(target)!
      descendants.delete(targetIndex)
      for (const kept of this.state.descendants(targetIndex)) {
        descendants.delete(kept)
      }
    }

    this.state.resolve(index)
    const ordered = [...descendants].sort((a, b) => a - b)
    for (const descendant of ordered) {
      const step = this.state.steps[descendant]
      if (step.status !== "pending") {
        continue
      }
      this.state.setStepStatus(descendant, "skipped")
      step.skipReason = "failure"
      this.state.flags.hasSkippedOnFailureSteps = true
      this.#emit("stepSkipped", {
        stepId: this.state.stepId(descendant),
        action: "invoke",
      })
      this.state.resolve(descendant)
    }
  }

  /**
   * Reads completions, retries and cancel requests that arrived from outside.
   * Returns whether anything changed.
   */
  async #applyExternal(): Promise<boolean> {
    this.#externalPending = false
    if (!this.stored) {
      return false
    }

    const record = await this.runtime.store.loadRun(this.runId, { steps: true })
    if (!record) {
      return false
    }
    let changed = false
    if (record.cancelRequestedAt && !this.cancelRequested) {
      this.cancelRequested = true
      changed = true
    }

    const stored = new Map((record.steps ?? []).map((s) => [s.stepId, s]))
    this.state.steps.forEach((step, index) => {
      if (step.status !== "waiting" && step.status !== "retry_scheduled") {
        return
      }
      const latest = stored.get(this.state.stepId(index))
      if (!latest || latest.status === step.status) {
        return
      }
      // A failure this executor already turned into a scheduled retry.
      if (
        step.status === "retry_scheduled" &&
        (latest.status === "failed" || latest.status === "timed_out")
      ) {
        return
      }
      this.#applyStoredStep(index, latest)
      changed = true
    })
    return changed
  }

  #applyStoredStep(index: number, latest: StepRecord) {
    const node = this.compiled.steps[index]
    const step = this.state.steps[index]
    step.finishedAt = latest.finishedAt ?? new Date(this.runtime.clock.now())

    switch (latest.status) {
      case "succeeded":
        this.#apply({
          index,
          kind: "output",
          output: latest.output,
          compensateInput: latest.compensateInput,
        })
        return
      case "skipped":
        this.#apply({ index, kind: "skip" })
        return
      case "pending":
        this.state.setStepStatus(index, "pending")
        step.pendingFailure = null
        return
      case "failed":
      case "timed_out": {
        const error = deserializeError(
          latest.error ?? { message: "Unknown error" }
        )
        const permanent =
          !!latest.pendingFailure?.permanent ||
          latest.status === "timed_out" ||
          step.attempt > (node.options.maxRetries ?? 0)

        void this.#attemptFailed(index, step.attempt, !permanent)

        if (!permanent) {
          this.state.setStepStatus(index, "retry_scheduled")
          step.error = latest.error
          step.pendingFailure = null
          // Without auto-retry the step waits for an explicit retry.
          if (node.options.autoRetry !== false) {
            this.#pendingTimers.push(
              retryTimer(
                this.#runRef,
                node.id,
                new Date(
                  this.runtime.clock.now() + (node.options.retryIntervalMs ?? 0)
                )
              )
            )
          }
          return
        }

        this.#applyPermanentFailure(index, {
          kind: "failure",
          error,
          permanent: true,
          timedOut: latest.status === "timed_out",
          partial:
            latest.compensateInput !== undefined
              ? {
                  output: latest.output,
                  compensateInput: latest.compensateInput,
                }
              : undefined,
        })
        return
      }
    }
  }

  /**
   * Cancel and run timeout: abort running steps, wait for them, and mark
   * waiting steps as failed when the run timed out.
   */
  async #stopInvoking() {
    for (const controller of this.#running.values()) {
      controller.abort()
    }
    this.#abortAsyncHandlers()
    while (this.#running.size) {
      await this.#nextSettlement(true)
      this.#processSettlements()
    }
    this.#processSettlements()

    if (this.timedOut) {
      const error = new RunTimeoutError(this.compiled.id, this.timeoutMs)
      this.state.flags.timedOut = true
      let recorded = false
      this.state.steps.forEach((step, index) => {
        if (step.status === "waiting" || step.status === "retry_scheduled") {
          this.state.setStepStatus(index, "failed")
          this.state.addError(index, "invoke", error)
          recorded = true
        } else if (
          this.#inFlightAtTimeout.has(index) &&
          step.status === "succeeded"
        ) {
          this.state.addError(index, "invoke", error)
          recorded = true
        }
      })
      if (!recorded && !this.state.errors.length) {
        let last = 0
        this.state.steps.forEach((step, index) => {
          if (step.status !== "pending") {
            last = index
          }
        })
        this.state.addError(last, "invoke", error)
      }
      this.#emit("runTimedOut", {})
    }
  }

  async #beginCompensation() {
    this.state.setRunStatus("compensating")
    this.#emit("compensationStarted", {})
    await this.#flush({ status: "compensating" })
  }

  async #compensate() {
    await runCompensation(this)
    // As today, callers get whatever part of the result can still be resolved.
    await this.#resolveResult()
    const failed = this.state.hasStatus("compensation_failed")
    const status: RunStatus = failed
      ? "failed"
      : this.cancelRequested && !this.timedOut
      ? "cancelled"
      : "compensated"
    await this.#finish(status)
  }

  async #resolveResult() {
    const resolveResult = this.compiled.definition.result
    if (!resolveResult) {
      return
    }
    try {
      this.resultValue = await runInScope(this.#scope(), () =>
        resolveResult({
          runId: this.runId,
          input: this.state.run.input,
          context: this.state.run.context,
          locals: this.locals,
          results: this.state.results,
          memo: this.state.memo,
        })
      )
      this.resultError = undefined
    } catch (error) {
      this.resultError = error
    }
  }

  async #finishSuccess() {
    await this.#resolveResult()
    this.state.setRunStatus("succeeded")
    this.state.run.result = this.resultValue
    await this.#finish("succeeded")
  }

  async #finish(status: RunStatus) {
    if (this.state.status !== status) {
      this.state.setRunStatus(status)
    }

    if (this.stored && this.lease) {
      const retained = !!this.state.run.retentionMs
      const steps =
        this.durability === "summary"
          ? this.state.steps.map((_, index) => this.state.stepRecord(index))
          : this.state.takeDirtySteps()
      this.state.dirty.clear()

      const extra = Object.assign(
        {},
        ...this.runtime.extensions.map(
          (extension) =>
            extension.finalChanges?.({ ...this.state.run, status }, status) ??
            {}
        )
      )
      await this.#commit({
        ...extra,
        status,
        result: status === "succeeded" ? this.resultValue : undefined,
        errors: this.state.storedErrors(),
        flags: this.state.flags,
        finished: true,
        steps: retained ? steps : [],
        delete: !retained,
        releaseLease: true,
        deleteRunTimers: true,
      })
      this.lease = null
    }

    await this.runtime.finished(this)
  }

  /**
   * Nothing can make progress until something outside completes a step.
   * Returns false when the run timed out first and must not park.
   */
  async #park(): Promise<boolean> {
    if (this.timedOut) {
      return false
    }
    this.#parking = true
    // Callers of a run that stops at an async step get the result as far as it
    // can be resolved, as today.
    await this.#resolveResult()
    if (this.resultError) {
      const reason = (this.resultError as Error)?.message ?? this.resultError
      this.runtime.logger.warn(
        `The result of run ${this.runId} could not be resolved while it waits: ${reason}`
      )
    }
    this.resultError = undefined
    this.state.setRunStatus("waiting")
    if (this.#handOff) {
      this.#pendingTimers.push(
        resumeTimer(this.#runRef, new Date(this.runtime.clock.now()))
      )
    }
    if (this.lease) {
      await this.#flush({ status: "waiting", releaseLease: true }, true)
      this.lease = null
    }
    this.runtime.detach(this)
    if (this.#handOff) {
      this.runtime.wakeWorkers()
    }
    // The run's timeout timer was stored when it started; now that the run
    // waits, whoever dispatches must check it when it is due.
    if (this.state.run.deadlineAt) {
      this.runtime.timersArmed?.([new Date(this.state.run.deadlineAt)])
    }
    if (this.#externalPending) {
      this.runtime
        .continueRun(this.runId)
        .catch((error) =>
          this.runtime.logger.error(
            `Failed to continue run ${this.runId} after it parked`,
            error
          )
        )
    }
    return true
  }

  async #flush(extra: RunChanges = {}, force = false) {
    if ((this.durability !== "full" && !force) || !this.lease) {
      this.state.dirty.clear()
      return
    }
    const steps = this.state.takeDirtySteps()
    const timers = [
      ...new Map(this.#pendingTimers.splice(0).map((t) => [t.id, t])).values(),
    ]
    const deleteTimers = this.#pendingTimerDeletes.splice(0)
    if (
      !steps.length &&
      !timers.length &&
      !deleteTimers.length &&
      !Object.keys(extra).length
    ) {
      return
    }
    const errorsChanged = this.state.errors.length !== this.#storedErrorCount
    this.#storedErrorCount = this.state.errors.length
    const result = await this.#commit({
      ...extra,
      steps,
      ...(errorsChanged ? { errors: this.state.storedErrors() } : {}),
      flags: this.state.flags,
      ...(timers.length ? { timers } : {}),
      ...(deleteTimers.length ? { deleteTimers } : {}),
    })
    if (result?.cancelRequested && !this.cancelRequested) {
      this.cancelRequested = true
    }
  }

  #commit(changes: RunChanges) {
    const lease = this.lease!
    const next = this.#commitChain.then(() =>
      this.runtime.store.commit(lease, changes).then((result) => {
        if (changes.timers?.length) {
          this.runtime.timersArmed?.(changes.timers.map((t) => t.dueAt))
        }
        return result
      })
    )
    this.#commitChain = next.catch(() => undefined)
    return next
  }

  async flushCompensation() {
    await this.#flush()
  }

  #deadlinePassed(): boolean {
    const deadline = this.state.run.deadlineAt
    return (
      !!deadline && this.runtime.clock.now() >= new Date(deadline).getTime()
    )
  }

  context(index: number, action: StepAction, signal: AbortSignal): StepContext {
    const run = this.state.run
    const node = this.compiled.steps[index]
    const base = {
      workflowId: run.workflowId,
      transactionId: run.transactionId,
      stepId: node.id,
      action,
    }
    return {
      runId: run.id,
      ...base,
      attempt: this.state.steps[index].attempt,
      idempotencyKey: idempotencyKey(base),
      signal,
      input: run.input,
      context: run.context,
      metadata: run.metadata,
      locals: this.locals,
      results: this.state.results,
      memo: this.state.memo,
      parentRunId: run.parentRunId ?? undefined,
      parentStepId: run.parentStepId ?? undefined,
    }
  }

  callHandler<T extends StepResult | void>(
    ctx: StepContext,
    fn: () => Promise<T>
  ): Promise<T> {
    const around = composeAround(this.runtime.extensions, "aroundStep", {
      action: ctx.action,
      ctx,
    })
    return runInScope(
      {
        ...this.#scope(),
        stepId: ctx.stepId,
        action: ctx.action,
        attempt: ctx.attempt,
      },
      () => around(fn)
    )
  }

  #scope() {
    const run = this.state.run
    return {
      engineId: this.runtime.engineId,
      runId: run.id,
      rootRunId: (run.metadata?.rootRunId as string) ?? run.id,
      workflowId: run.workflowId,
      transactionId: run.transactionId,
      durability: run.durability,
      context: run.context,
    }
  }

  emit(name: RunEventName, payload: Partial<RunEvent>) {
    this.#emit(name, payload)
  }

  #emit(name: RunEventName, payload: Partial<RunEvent>) {
    const run = this.state.run
    this.runtime.emit({
      name,
      runId: run.id,
      workflowId: run.workflowId,
      transactionId: run.transactionId,
      status: this.state.status,
      snapshot: () => this.state.snapshot(),
      ...payload,
    })
  }
}
