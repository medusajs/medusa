import { ulid } from "ulid"
import { CompiledWorkflow } from "../definition/compile"
import { WorkflowRegistry } from "../definition/registry"
import {
  raiseDurability,
  RUN_TIMEOUT_METADATA_KEY,
} from "../definition/run-options"
import { Durability, RunStatus, WorkflowDefinition } from "../definition/types"
import {
  CancelNotAllowedError,
  DefinitionMismatchError,
  EngineStoppedError,
  RunInterruptedError,
  StepNotFoundError,
  StepNotWaitingError,
  TransactionAlreadyStartedError,
  WorkflowNotRegisteredError,
  RunNotFoundError,
} from "../errors"
import { RunEvent, RunEventEmitter, RunEventListener } from "../events/emitter"
import { PeriodicTasks } from "../recovery/periodic"
import { engineTasks } from "../recovery/tasks"
import { Clock, systemClock } from "../runtime/clock"
import { Executor, ExecutorRuntime } from "../runtime/executor"
import { callExtensions, EngineExtension } from "../runtime/middleware"
import { RunState } from "../runtime/run-state"
import { currentScope, outsideScope, RunScope } from "../runtime/scope"
import { backgroundOutcome, InvokeOutcome } from "../runtime/step-invoker"
import { FINAL_RUN_STATUSES, isFinalRunStatus } from "../runtime/transitions"
import { Dispatcher } from "../scheduling/dispatcher"
import {
  fireSchedule,
  scheduledWorkflowIds,
  upsertSchedule,
} from "../scheduling/schedules"
import { resumeTimer, runTimeoutTimer, timerId } from "../scheduling/timers"
import { serializeError } from "../serialization/serializer"
import { NotifierMessage } from "../signals/notifier"
import { MemoryStore } from "../store/memory/memory-store"
import {
  Lease,
  NewRun,
  NewTimer,
  Page,
  RunFilter,
  RunRecord,
  StepOutcome,
  Store,
} from "../store/store"
import { RunHandles } from "./handles"
import { handleTimer } from "./timer-handler"
import {
  ContinueResult,
  EngineConfig,
  EngineLogger,
  InstanceMode,
  RunHandle,
  RunTarget,
  StartOptions,
  StepTarget,
} from "./types"

// Children are kept for their parent's compensation unless they set their own
// retention.
const CHILD_RETENTION_MS = 24 * 60 * 60 * 1000
const DEFAULT_LEASE_TTL_MS = 24 * 60 * 60 * 1000
const DEFAULT_POLL_INTERVAL_MS = 1_000
// With a notifier, polling only catches wake-ups that were lost.
const NOTIFIED_POLL_INTERVAL_MS = 30_000
const DEFAULT_RECOVERY = {
  heartbeatIntervalMs: 5_000,
  leaseTtlMs: 30_000,
  reaperIntervalMs: 10_000,
}

export function createEngine(config: EngineConfig = {}): Engine {
  return new Engine(config)
}

export class Engine {
  readonly engineId = ulid()
  readonly instanceId: string
  readonly mode: InstanceMode
  readonly store: Store
  readonly registry = new WorkflowRegistry()

  #config: EngineConfig
  #clock: Clock
  #leaseTtlMs: number
  #recovery: typeof DEFAULT_RECOVERY | undefined
  #extensions: EngineExtension[] = []
  #logger: EngineLogger
  #emitter = new RunEventEmitter()
  #active = new Map<string, Executor>()
  #handles: RunHandles
  #locals = new Map<string, Record<string, unknown>>()
  #drained = new Set<() => void>()
  #runtime: ExecutorRuntime
  #dispatcher: Dispatcher | undefined
  #periodic: PeriodicTasks
  #unsubscribe: (() => Promise<void> | void) | undefined
  #booted: Promise<void> | undefined
  #stopping = false

  constructor(config: EngineConfig = {}) {
    this.#config = config
    this.#clock = config.clock ?? systemClock
    this.store = config.store ?? new MemoryStore({ clock: this.#clock })
    this.instanceId = config.instanceId ?? `wf_instance_${ulid()}`
    this.mode = config.mode ?? "shared"
    const recovery = config.recovery
    this.#recovery = recovery
      ? {
          heartbeatIntervalMs:
            recovery.heartbeatIntervalMs ??
            DEFAULT_RECOVERY.heartbeatIntervalMs,
          leaseTtlMs: recovery.leaseTtlMs ?? DEFAULT_RECOVERY.leaseTtlMs,
          reaperIntervalMs:
            recovery.reaperIntervalMs ?? DEFAULT_RECOVERY.reaperIntervalMs,
        }
      : undefined
    this.#leaseTtlMs = this.#recovery?.leaseTtlMs ?? DEFAULT_LEASE_TTL_MS
    this.#logger = config.logger ?? {
      error: (message, error) => console.error(message, error),
      warn: (message) => console.warn(message),
    }
    this.#handles = new RunHandles({
      store: this.store,
      clock: this.#clock,
      pollIntervalMs: () => this.#pollIntervalMs,
      isActive: (runId) => this.#active.has(runId),
      background: (task, description) => this.#background(task, description),
    })
    this.#runtime = this.#createRuntime()
    this.#periodic = new PeriodicTasks(this.#clock, (message, error) =>
      this.#logger.error(message, error)
    )
    for (const extension of config.extensions ?? []) {
      this.use(extension)
    }
  }

  get #pollIntervalMs() {
    return (
      this.#config.pollIntervalMs ??
      (this.#unsubscribe ? NOTIFIED_POLL_INTERVAL_MS : DEFAULT_POLL_INTERVAL_MS)
    )
  }

  get #dispatches() {
    return this.mode !== "server"
  }

  register(definition: WorkflowDefinition) {
    const compiled = this.registry.register(definition)
    if (this.#booted && compiled.definition.options.schedule) {
      this.#background(
        () => upsertSchedule(this.store, compiled),
        `Failed to register the schedule of "${compiled.id}"`
      )
    }
    return compiled
  }

  unregister(workflowId: string) {
    const scheduled =
      !!this.registry.find(workflowId)?.definition.options.schedule
    this.registry.unregister(workflowId)
    if (scheduled && this.#booted) {
      this.#background(
        () => this.store.removeSchedule(workflowId),
        `Failed to remove the schedule of "${workflowId}"`
      )
    }
  }

  listRegistered() {
    return this.registry.list().map((compiled) => ({
      id: compiled.id,
      hash: compiled.hash,
      schedule: compiled.definition.options.schedule,
    }))
  }

  use(extension: EngineExtension) {
    this.#extensions.push(extension)
    extension.attach?.(this)
  }

  on(listener: RunEventListener) {
    return this.#emitter.on(listener)
  }

  /**
   * The run and step the caller is executing in, if it is inside a step.
   */
  currentScope(): RunScope | undefined {
    const scope = currentScope()
    return scope?.engineId === this.engineId ? scope : undefined
  }

  /**
   * Starts the dispatcher, heartbeats, the reaper and schedule bookkeeping.
   * Called on first use unless `autoBoot` is false.
   */
  boot(): Promise<void> {
    this.#booted ??= this.#boot()
    return this.#booted
  }

  async #boot() {
    this.#stopping = false
    this.#handles.start()
    if (this.#config.notifier) {
      // Without the notifier the engine still works, polling instead.
      try {
        this.#unsubscribe = await this.#config.notifier.subscribe((message) =>
          this.#onMessage(message)
        )
      } catch (error) {
        this.#logger.warn(
          `The workflow engine notifier is unavailable, falling back to polling: ${error}`
        )
      }
    }

    // Leases this instance id held before a restart can be taken back at once.
    const released = await this.store.releaseLeasesOf(this.instanceId)
    await this.#resumeLater(released)

    const nextFires: Date[] = []
    for (const compiled of this.registry.list()) {
      if (compiled.definition.options.schedule) {
        const next = await upsertSchedule(this.store, compiled)
        if (next) {
          nextFires.push(next)
        }
      }
    }

    if (this.#dispatches) {
      this.#dispatcher = this.#createDispatcher()
      nextFires.forEach((at) => this.#dispatcher!.wakeAt(at))
      this.#dispatcher.start()
    }

    this.#periodic.start(
      engineTasks({
        store: this.store,
        instanceId: this.instanceId,
        mode: this.mode,
        leaseTtlMs: this.#leaseTtlMs,
        recovery: this.#recovery,
        dispatches: this.#dispatches,
        extensions: this.#extensions,
        staleScheduleMs: this.#config.staleScheduleMs ?? 24 * 60 * 60_000,
        retentionCleanupIntervalMs:
          this.#config.retentionCleanupIntervalMs ?? 30 * 60_000,
        scheduledWorkflowIds: () => scheduledWorkflowIds(this.registry),
        resumeLater: (runIds, opts) => this.#resumeLater(runIds, opts),
        wakeWorkers: () => this.#wakeWorkers(),
      })
    )
  }

  #createDispatcher() {
    return new Dispatcher({
      store: this.store,
      clock: this.#clock,
      owner: this.instanceId,
      pollIntervalMs: this.#pollIntervalMs,
      batchSize: 10,
      claimMs: this.#config.timerClaimMs ?? 30_000,
      mismatchGraceMs: this.#config.definitionGraceMs ?? 5 * 60_000,
      capacity: () =>
        (this.#config.maxConcurrentRuns ?? 50) - this.#active.size,
      known: () =>
        this.registry.list().map((compiled) => ({
          workflowId: compiled.id,
          hash: compiled.hash,
        })),
      scheduledWorkflows: () => scheduledWorkflowIds(this.registry),
      onTimer: (timer) =>
        handleTimer(
          {
            store: this.store,
            clock: this.#clock,
            owner: this.instanceId,
            leaseTtlMs: this.#leaseTtlMs,
            runTimeoutTakeoverMs:
              this.#config.runTimeoutTakeoverMs ?? 5 * 60_000,
            registry: this.registry,
            activeExecutor: (runId) => this.#active.get(runId),
            wakeAt: (at) => this.#dispatcher?.wakeAt(at),
            continueRun: (runId, options) => this.#continue(runId, options),
          },
          timer
        ),
      onSchedule: (claimed) =>
        fireSchedule(
          {
            store: this.store,
            owner: this.instanceId,
            pollIntervalMs: this.#pollIntervalMs,
            wakeAt: (at) => this.#dispatcher?.wakeAt(at),
            logger: this.#logger,
            start: (options) => this.start(options),
          },
          claimed
        ),
      onError: (message, error) => this.#logger.error(message, error),
    })
  }

  /**
   * Stops taking new work, waits up to the grace period for running runs,
   * then gives up every lease so other instances continue at once.
   */
  async shutdown(options: { graceMs?: number } = {}) {
    this.#stopping = true
    await this.#dispatcher?.stop()
    this.#dispatcher = undefined
    await this.#periodic.stop()

    await this.#drain(options.graceMs ?? 10_000)

    if (this.#booted) {
      try {
        const released = await this.store.releaseLeasesOf(this.instanceId)
        await this.#resumeLater(released)
        if (this.#recovery) {
          await this.store.removeWorker(this.instanceId)
        }
      } catch (error) {
        this.#logger.error("Failed to hand runs over on shutdown", error)
      }
    }

    this.#handles.stop()
    await this.#unsubscribe?.()
    this.#unsubscribe = undefined
    this.#booted = undefined
  }

  /**
   * Resolves once no executor runs in this process, or after the grace period.
   */
  #drain(graceMs: number): Promise<void> {
    if (!this.#active.size || graceMs <= 0) {
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      const done = () => {
        this.#clock.clearTimeout(timer)
        this.#drained.delete(done)
        resolve()
      }
      const timer = this.#clock.setTimeout(done, graceMs)
      this.#drained.add(done)
    })
  }

  /**
   * Resolves when the run finishes or can make no progress until something
   * outside completes a step.
   */
  async start(options: StartOptions): Promise<RunHandle> {
    // Steps of runs still draining may start children.
    if (this.#stopping && !this.currentScope()) {
      throw new EngineStoppedError(
        `Cannot start workflow "${options.workflowId}": the workflow engine is shutting down or stopped`
      )
    }
    await this.#autoBoot()
    const compiled = this.registry.get(options.workflowId)
    const workflowOptions = {
      ...compiled.definition.options,
      ...(options.options ?? {}),
    }
    // A child that completes its parent's step must survive until the parent
    // can be resumed from the store.
    const durability = raiseDurability(
      compiled.durability,
      options.parent?.completeStep
        ? { ...workflowOptions, durability: "full" }
        : workflowOptions
    )
    const now = this.#clock.now()
    const transactionId = options.transactionId ?? ulid()
    const id = `wf_run_${ulid()}`

    const parentScope = options.parent
    const metadata = { ...(options.metadata ?? {}) }
    if (parentScope) {
      const parentRoot = this.currentScope()?.rootRunId
      metadata.rootRunId = parentRoot ?? parentScope.runId
      if (parentScope.completeStep) {
        metadata.completesParentStep = true
      }
    }
    if (options.options?.timeoutMs) {
      metadata[RUN_TIMEOUT_METADATA_KEY] = options.options.timeoutMs
    }

    const newRun: NewRun = {
      id,
      workflowId: compiled.id,
      transactionId,
      status: "running",
      durability,
      definitionHash: compiled.hash,
      input: options.input,
      context: options.context ?? {},
      metadata,
      errors: [],
      flags: {},
      parentRunId: parentScope?.runId ?? null,
      parentStepId: parentScope?.stepId ?? null,
      idempotent: !!workflowOptions.idempotent,
      retentionMs:
        workflowOptions.retentionTimeMs ??
        (parentScope ? CHILD_RETENTION_MS : null),
      cancelRequestedAt: null,
      deadlineAt: workflowOptions.timeoutMs
        ? new Date(now + workflowOptions.timeoutMs)
        : null,
    }

    let record: RunRecord
    let lease: Lease | null = null
    if (durability === "none") {
      record = {
        ...newRun,
        createdAt: new Date(now),
        updatedAt: new Date(now),
        steps: [],
      }
    } else {
      const timers: NewTimer[] = newRun.deadlineAt
        ? [
            runTimeoutTimer(
              { id, workflowId: compiled.id, definitionHash: compiled.hash },
              newRun.deadlineAt
            ),
          ]
        : []
      const created = await this.store.createRun(
        newRun,
        {
          unique: options.unique ?? true,
          idempotent: !!workflowOptions.idempotent,
        },
        { owner: this.instanceId, ttlMs: this.#leaseTtlMs },
        timers
      )

      if (created.kind === "running") {
        throw new TransactionAlreadyStartedError(transactionId)
      }
      if (created.kind === "finished") {
        return this.#handles.fromRecord(created.run, { existing: true })
      }
      record = { ...created.run, steps: [] }
      lease = created.lease
    }

    // Runs started without locals, such as scheduled ones, get them from the
    // extensions, as resumed runs do.
    const executor = this.#executor(
      compiled,
      record,
      lease,
      options.locals ?? this.#localsFor(record)
    )
    if (options.locals) {
      this.#locals.set(id, options.locals)
    }

    this.#emit(
      {
        name: "runStarted",
        runId: id,
        workflowId: compiled.id,
        transactionId,
        status: "running",
        snapshot: () => executor.state.snapshot(),
      },
      durability
    )

    await executor.execute()
    return this.#handles.fromExecutor(executor)
  }

  async completeStep(
    target: StepTarget,
    result: { output?: unknown; compensateInput?: unknown }
  ): Promise<RunHandle> {
    const output = result.output
    return this.#settleWaitingStep(target, "success", {
      kind: "output",
      output,
      compensateInput:
        result.compensateInput !== undefined ? result.compensateInput : output,
    })
  }

  async failStep(
    target: StepTarget,
    error: unknown,
    options: { permanent?: boolean } = {}
  ): Promise<RunHandle> {
    return this.#settleWaitingStep(target, "failure", {
      kind: "failure",
      error: serializeError(error),
      permanent: !!options.permanent,
    })
  }

  async retryStep(target: StepTarget): Promise<RunHandle> {
    await this.#autoBoot()
    const run = await this.#findTargetRun(target)
    this.#assertStep(run, target.stepId)
    const timer = resumeTimer(run, new Date(this.#clock.now()))
    // A retry timer left for the step would relaunch it a second time.
    const result = await this.store.requestStepRetry(
      run.id,
      target.stepId,
      timer,
      { deleteTimers: [timerId.retry(run.id, target.stepId)] }
    )
    if (!result.ok) {
      throw new StepNotWaitingError("retry", result.status ?? "pending")
    }
    return this.#continueAfterOutsideChange(run.id, result.timerGeneration)
  }

  async cancel(target: RunTarget): Promise<RunHandle> {
    await this.#autoBoot()
    const run =
      target.snapshot?.durability === "none"
        ? target.snapshot
        : await this.#findTargetRun(target)

    if (run.status === "failed") {
      throw new CancelNotAllowedError(
        "Cannot revert a permanent failed transaction."
      )
    }
    if (run.status === "compensating") {
      throw new CancelNotAllowedError(
        "Cannot revert a transaction that is already compensating."
      )
    }
    if (run.status === "compensated" || run.status === "cancelled") {
      return this.#handles.fromRecord(run)
    }

    if (run.durability === "none") {
      return this.#cancelSnapshot(run, target.locals ?? {})
    }

    await this.store.requestCancel(
      run.id,
      resumeTimer(run, new Date(this.#clock.now()))
    )
    return this.#continueAfterOutsideChange(run.id)
  }

  /**
   * Continues a run held by nobody. With `force`, takes the run over even if
   * another instance holds its lease.
   */
  async resume(
    runId: string,
    options: { force?: boolean } = {}
  ): Promise<RunHandle> {
    const result = await this.#continue(runId, { force: options.force })
    return result.handle ?? this.#handles.load(runId)
  }

  async getRun(runId: string, opts: { steps?: boolean } = {}) {
    return this.store.loadRun(runId, opts)
  }

  async findRun(
    workflowId: string,
    transactionId: string,
    opts: { steps?: boolean } = {}
  ) {
    return this.store.findRun(workflowId, transactionId, opts)
  }

  async queryRuns(filter: RunFilter, page?: Page) {
    return this.store.queryRuns(filter, page)
  }

  async deleteExpired() {
    return this.store.deleteExpired()
  }

  async #autoBoot() {
    if (this.#config.autoBoot !== false && !this.#stopping) {
      await this.boot()
    }
  }

  #executor(
    compiled: CompiledWorkflow,
    record: RunRecord,
    lease: Lease | null,
    locals: Record<string, unknown>
  ) {
    return new Executor(
      this.#runtime,
      compiled,
      new RunState(compiled, record),
      lease,
      locals
    )
  }

  async #cancelSnapshot(
    record: RunRecord,
    locals: Record<string, unknown>
  ): Promise<RunHandle> {
    const compiled = this.registry.get(record.workflowId)
    const executor = this.#executor(
      compiled,
      { ...record, cancelRequestedAt: new Date(this.#clock.now()) },
      null,
      locals
    )
    await executor.execute()
    return this.#handles.fromExecutor(executor)
  }

  async #settleWaitingStep(
    target: StepTarget,
    operation: "success" | "failure",
    outcome: StepOutcome
  ): Promise<RunHandle> {
    await this.#autoBoot()
    const run = await this.#findTargetRun(target)
    this.#assertStep(run, target.stepId)

    const result = await this.store.completeWaitingStep(
      run.id,
      target.stepId,
      outcome,
      resumeTimer(run, new Date(this.#clock.now()))
    )
    if (!result.ok) {
      throw new StepNotWaitingError(operation, result.status ?? "pending")
    }

    return this.#continueAfterOutsideChange(run.id, result.timerGeneration)
  }

  /**
   * After a completion, retry or cancel was written together with a resume
   * timer: continue inline when this instance may, otherwise leave the timer
   * to a worker.
   */
  async #continueAfterOutsideChange(
    runId: string,
    timerGeneration?: number
  ): Promise<RunHandle> {
    if (this.mode === "server") {
      this.#wakeWorkers()
      return this.#handles.load(runId)
    }

    const result = await this.#continue(runId)
    if (result.outcome === "busy") {
      this.#wakeWorkers()
      return this.#handles.load(runId)
    }
    if (result.outcome !== "notified" && timerGeneration !== undefined) {
      await this.store
        .completeTimer(timerId.resume(runId), timerGeneration)
        .catch(() => undefined)
    }
    return result.handle ?? this.#handles.load(runId)
  }

  async #findTargetRun(target: RunTarget): Promise<RunRecord> {
    let run: RunRecord | null = null
    if (target.runId) {
      run = await this.store.loadRun(target.runId)
    } else if (target.workflowId && target.transactionId) {
      run = await this.store.findRun(target.workflowId, target.transactionId)
    }
    if (!run) {
      throw new RunNotFoundError(target.transactionId ?? target.runId ?? "")
    }
    if (!this.registry.has(run.workflowId)) {
      throw new WorkflowNotRegisteredError(run.workflowId)
    }
    return run
  }

  #assertStep(run: RunRecord, stepId: string) {
    const compiled = this.registry.get(run.workflowId)
    if (!compiled.indexById.has(stepId)) {
      throw new StepNotFoundError(stepId, run.transactionId)
    }
  }

  /**
   * Continues the run inline when this process can take its lease. If another
   * executor in this process holds it, that executor is told to reload.
   */
  async #continue(
    runId: string,
    options: { force?: boolean } = {}
  ): Promise<ContinueResult> {
    const active = this.#active.get(runId)
    if (active) {
      const idle = this.#handles.waitIdle(runId)
      active.notify()
      return { outcome: "notified", handle: await idle }
    }

    // A stopping instance takes on no run: another instance, or this one
    // after a restart, resumes it from the timer.
    if (this.#stopping) {
      await this.#resumeLater([runId], { onlyEarlier: true })
      this.#dropLocals(runId)
      return { outcome: "busy" }
    }

    const acquired = await this.store.acquireLease(
      runId,
      this.instanceId,
      this.#leaseTtlMs,
      { force: options.force }
    )
    if (!acquired.ok) {
      this.#dropLocals(runId)
      return { outcome: acquired.reason === "missing" ? "missing" : "busy" }
    }
    const lease = acquired.lease

    let executor: Executor
    try {
      const record = await this.store.loadRun(runId, { steps: true })
      const resumable =
        record &&
        (!isFinalRunStatus(record.status) ||
          (record.status === "succeeded" && !!record.cancelRequestedAt))

      if (!record || !resumable) {
        await this.store.releaseLease(lease)
        this.#dropLocals(runId)
        return record
          ? { outcome: "done", handle: this.#handles.fromRecord(record) }
          : { outcome: "missing" }
      }

      const compiled = this.registry.get(record.workflowId)

      // Without step rows there is nothing to resume from.
      if (record.durability === "summary" && !isFinalRunStatus(record.status)) {
        return {
          outcome: "done",
          handle: await this.#failRun(
            record,
            lease,
            new RunInterruptedError(record.workflowId)
          ),
        }
      }

      const missing = missingSteps(compiled, record)
      if (missing.length) {
        return {
          outcome: "done",
          handle: await this.#failRun(
            record,
            lease,
            new DefinitionMismatchError(record.workflowId, missing)
          ),
        }
      }

      executor = this.#executor(
        compiled,
        record,
        lease,
        this.#localsFor(record)
      )
      executor.recoverPendingFailures()
    } catch (error) {
      await this.store.releaseLease(lease)
      throw error
    }

    this.#emit(
      {
        name: "runResumed",
        runId,
        workflowId: executor.state.run.workflowId,
        transactionId: executor.state.run.transactionId,
        status: executor.state.status,
        snapshot: () => executor.state.snapshot(),
      },
      executor.durability
    )

    await executor.execute()
    return {
      outcome: "continued",
      handle: this.#handles.fromExecutor(executor),
    }
  }

  async #failRun(
    record: RunRecord,
    lease: Lease,
    error: Error
  ): Promise<RunHandle> {
    const errors = [
      ...(record.errors ?? []),
      { stepId: "", action: "invoke" as const, error: serializeError(error) },
    ]
    await this.store.commit(lease, {
      status: "failed",
      errors,
      finished: true,
      releaseLease: true,
      deleteRunTimers: true,
    })
    const handle = this.#handles.fromRecord({
      ...record,
      status: "failed",
      errors,
    })
    this.#logger.error(
      `Run ${record.id} of workflow "${record.workflowId}" failed`,
      error
    )
    await this.#finalize(handle, this.#localsFor(record))
    return handle
  }

  async #resumeLater(runIds: string[], opts: { onlyEarlier?: boolean } = {}) {
    if (!runIds.length) {
      return
    }
    const [runs] = await this.store.queryRuns({ ids: runIds })
    const now = await this.store.now()
    await this.store.scheduleTimers(
      runs.map((run) => resumeTimer(run, now)),
      opts
    )
    this.#wakeWorkers()
  }

  #wakeWorkers() {
    this.#dispatcher?.wake()
    this.#config.notifier
      ?.publish({ type: "wake", origin: this.instanceId })
      .catch((error) =>
        this.#logger.warn(`Failed to publish a wake-up: ${error}`)
      )
  }

  #onMessage(message: NotifierMessage) {
    if (message.origin === this.instanceId) {
      return
    }
    if (message.type === "wake") {
      this.#dispatcher?.wake()
      return
    }
    if (message.name === "runFinished") {
      this.#handles.remoteFinished(message.runId, message.status as RunStatus)
    }
    this.#emitter.emit({
      name: message.name,
      runId: message.runId,
      workflowId: message.workflowId,
      transactionId: message.transactionId,
      status: message.status as RunStatus,
      stepId: message.stepId,
      remote: true,
    })
  }

  /**
   * Locals are kept only while this instance may still continue the run.
   */
  #dropLocals(runId: string) {
    if (!this.#active.has(runId) && !this.#runtime.asyncHandlers.has(runId)) {
      this.#locals.delete(runId)
    }
  }

  #localsFor(record: RunRecord) {
    const known = this.#locals.get(record.id)
    if (known) {
      return known
    }
    for (const extension of this.#extensions) {
      const locals = extension.resolveLocals?.(record)
      if (locals) {
        return locals
      }
    }
    return {}
  }

  #emit(
    event: RunEvent,
    durability: Durability | undefined = this.#active.get(event.runId)
      ?.durability
  ) {
    this.#emitter.emit(event)
    const notifier = this.#config.notifier
    if (notifier && !event.remote && durability && durability !== "none") {
      notifier
        .publish({
          type: "event",
          origin: this.instanceId,
          name: event.name,
          runId: event.runId,
          workflowId: event.workflowId,
          transactionId: event.transactionId,
          status: event.status,
          stepId: event.stepId,
        })
        .catch(() => undefined)
    }
  }

  #background(task: () => Promise<unknown>, description: string) {
    task().catch((error) => this.#logger.error(description, error))
  }

  #createRuntime(): ExecutorRuntime {
    return {
      engineId: this.engineId,
      instanceId: this.instanceId,
      mode: this.mode,
      store: this.store,
      clock: this.#clock,
      extensions: this.#extensions,
      logger: this.#logger,
      asyncHandlers: new Map(),
      emit: (event) => this.#emit(event),
      attach: (executor) => {
        this.#active.set(executor.runId, executor)
      },
      detach: (executor) => this.#detach(executor),
      continueRun: (runId) => this.#continue(runId),
      settleFinishedChildren: (executor) =>
        this.#settleFinishedChildren(executor),
      completeFromBackground: async (executor, index, attempt, outcome) =>
        this.#background(
          () => this.#completeFromBackground(executor, index, attempt, outcome),
          `Failed to complete step "${executor.compiled.steps[index].id}"`
        ),
      wakeWorkers: () => this.#wakeWorkers(),
      timersArmed: (dueAt) => {
        for (const at of dueAt) {
          this.#dispatcher?.wakeAt(at)
        }
      },
      finished: (executor) =>
        this.#finalize(this.#handles.fromExecutor(executor), executor.locals),
    }
  }

  /**
   * Writes an async handler's outcome as a completion from outside, as if
   * another process reported it.
   */
  async #completeFromBackground(
    executor: Executor,
    index: number,
    attempt: number,
    outcome: InvokeOutcome
  ) {
    const node = executor.compiled.steps[index]
    const run = executor.state.run
    if (!executor.stored) {
      return
    }
    const stored = backgroundOutcome(node.options, outcome)
    if (!stored) {
      await this.store.clearStepOwner(run.id, node.id, attempt)
      return
    }
    const result = await this.store.completeWaitingStep(
      run.id,
      node.id,
      stored,
      resumeTimer(run, new Date(this.#clock.now())),
      { attempt }
    )
    if (result.ok) {
      await this.#continueAfterOutsideChange(run.id, result.timerGeneration)
    } else {
      this.#dropLocals(run.id)
    }
  }

  #detach(executor: Executor) {
    if (this.#active.get(executor.runId) !== executor) {
      return
    }
    this.#active.delete(executor.runId)
    if (executor.lost) {
      this.#locals.delete(executor.runId)
    } else {
      this.#dropLocals(executor.runId)
    }
    this.#handles.executorIdle(executor)
    if (!this.#active.size) {
      this.#drained.forEach((done) => done())
    }
  }

  /**
   * Every way a run ends goes through here.
   */
  async #finalize(handle: RunHandle, locals: Record<string, unknown>) {
    const run = handle.run
    this.#locals.delete(run.id)

    await callExtensions(
      this.#extensions,
      this.#logger,
      "onRunFinished",
      [run, locals],
      `after run ${run.id}`
    )

    this.#emit(
      {
        name: "runFinished",
        runId: run.id,
        workflowId: run.workflowId,
        transactionId: run.transactionId,
        status: run.status,
        result: handle.result,
        errors: run.errors,
        snapshot: () => run,
      },
      run.durability
    )

    if (
      run.parentRunId &&
      run.parentStepId &&
      run.metadata?.completesParentStep
    ) {
      await this.#notifyParent(run, handle)
    }

    this.#handles.finished(handle)
  }

  async #notifyParent(run: RunRecord, handle: RunHandle) {
    const parentRunId = run.parentRunId!
    try {
      const outcome = childOutcome(
        run,
        handle.result,
        handle.errors.find((e) => e.action === "invoke")?.cause
      )
      const parent = await this.store.loadRun(parentRunId)
      if (!parent) {
        return
      }
      const result = await this.store.completeWaitingStep(
        parentRunId,
        run.parentStepId!,
        outcome,
        resumeTimer(parent, new Date(this.#clock.now()))
      )
      if (result.ok) {
        this.#continueParentLater(parentRunId, result.timerGeneration)
        return
      }
      // A step that is not waiting yet picks the child up before its run
      // parks, see `#settleFinishedChildren`.
      this.#logger.warn(
        `Run ${run.id} could not complete step "${
          run.parentStepId
        }" of its parent ${parentRunId}, whose status is ${
          result.status ?? "unknown"
        }`
      )
    } catch (error) {
      this.#logger.error(
        `Failed to report run ${run.id} to its parent ${parentRunId}`,
        error
      )
    }
  }

  /**
   * A child that finished before its parent's nested step was waiting could
   * not complete it. Before the parent parks, such children complete their
   * step from what they stored.
   */
  async #settleFinishedChildren(executor: Executor) {
    const waiting = new Set(
      executor.state.steps
        .map((step, index) =>
          step.status === "waiting" &&
          executor.compiled.steps[index].options.nested
            ? executor.state.stepId(index)
            : null
        )
        .filter((stepId): stepId is string => !!stepId)
    )
    if (!waiting.size) {
      return
    }
    const [children] = await this.store.queryRuns({
      parentRunId: executor.runId,
      status: [...FINAL_RUN_STATUSES],
    })
    for (const child of children) {
      const stepId = child.parentStepId
      if (
        !stepId ||
        !waiting.has(stepId) ||
        !child.metadata?.completesParentStep
      ) {
        continue
      }
      waiting.delete(stepId)
      await this.store.completeWaitingStep(
        executor.runId,
        stepId,
        childOutcome(
          child,
          child.result,
          child.errors?.find((e) => e.action === "invoke")?.error
        )
      )
    }
  }

  /**
   * The parent continues outside the child's run and its context: from the
   * resume timer already written when this instance dispatches timers,
   * otherwise on the next turn.
   */
  #continueParentLater(runId: string, timerGeneration?: number) {
    if (this.#dispatcher) {
      this.#wakeWorkers()
      return
    }
    outsideScope(() =>
      setImmediate(() =>
        this.#background(
          () => this.#continueAfterOutsideChange(runId, timerGeneration),
          `Failed to continue run ${runId}`
        )
      )
    )
  }
}

/**
 * The outcome a finished child reports to the step of its parent.
 */
function childOutcome(
  run: RunRecord,
  result: unknown,
  error: unknown
): StepOutcome {
  if (run.status === "succeeded") {
    return { kind: "output", output: result, compensateInput: result }
  }
  return {
    kind: "failure",
    error: serializeError(
      error ?? new Error(`Child workflow "${run.workflowId}" ${run.status}`)
    ),
    permanent: false,
  }
}

/**
 * Step ids of a run that the registered definition no longer has.
 */
function missingSteps(compiled: CompiledWorkflow, record: RunRecord): string[] {
  if (compiled.hash === record.definitionHash) {
    return []
  }
  return (record.steps ?? [])
    .filter((step) => step.status !== "pending")
    .map((step) => step.stepId)
    .filter((stepId) => !compiled.indexById.has(stepId))
}
