import type {
  LegacyTransaction,
  LegacyTransactionFlow,
  LegacyTransactionStep,
  TransactionStepError,
} from "@medusajs/framework/types"
import { TransactionState } from "@medusajs/framework/utils"
import type {
  CompiledWorkflow,
  LiveRunError,
  RunEvent,
  RunRecord,
  StepRecord,
} from "@medusajs/workflow-engine"
import { deserializeError, FINAL_RUN_STATUSES } from "@medusajs/workflow-engine"
import { toLegacyRunState, toLegacyStepStates } from "../adapters/state"

const ROOT_STEP = "_root"

function legacyStepId(stepId: string) {
  return `${ROOT_STEP}.${stepId}`
}

function toMs(date?: Date | string | null): number | null {
  return date ? new Date(date).getTime() : null
}

function toSeconds(ms?: number): number | undefined {
  return ms === undefined ? undefined : ms / 1000
}

/**
 * A step as executions report it. `step_id` and `depends_on` describe the
 * step without parsing its id.
 */
export type ExecutionStepView = LegacyTransactionStep & {
  step_id: string
  /**
   * The steps this one runs after, empty when it runs first or when the
   * workflow is not registered.
   */
  depends_on: string[]
  timedOutAt: number | null
}

/**
 * The registered definition, only when the run was started with it.
 */
function runDefinition(run: RunRecord, compiled?: CompiledWorkflow) {
  return compiled && compiled.hash === run.definitionHash ? compiled : undefined
}

/**
 * `compiled` describes the step only when it is the definition the run was
 * started with; pass it through `runDefinition`.
 */
export function toLegacyStep(
  step: StepRecord,
  compiled?: CompiledWorkflow
): ExecutionStepView {
  const index = compiled?.indexById.get(step.stepId)
  const node = index === undefined ? undefined : compiled!.steps[index]
  const options = node?.options
  const { invoke, compensate } = toLegacyStepStates(step)
  const failed = !!step.error
  const startedAt = toMs(step.startedAt)

  return {
    id: legacyStepId(step.stepId),
    // The legacy root is depth 0, so the first steps are depth 1.
    depth: index === undefined ? 1 : compiled!.depth[index] + 1,
    definition: {
      action: step.stepId,
      async: options?.async,
      nested: options?.nested,
      maxRetries: options?.maxRetries,
      autoRetry: options?.autoRetry,
      retryInterval: toSeconds(options?.retryIntervalMs),
      timeout: toSeconds(options?.timeoutMs),
      continueOnPermanentFailure: options?.continueOnPermanentFailure,
      skipOnPermanentFailure: options?.skipOnPermanentFailure,
      saveResponse: options?.saveResponse,
      noCompensation: node ? !node.compensate : undefined,
    } as LegacyTransactionStep["definition"],
    invoke,
    compensate,
    attempts: step.attempt,
    failures: failed ? step.attempt : 0,
    startedAt: startedAt ?? undefined,
    // The engine keeps the start of the latest attempt only.
    lastAttempt: startedAt,
    step_id: step.stepId,
    depends_on: node ? [...node.dependsOn] : [],
    timedOutAt: step.status === "timed_out" ? toMs(step.finishedAt) : null,
  }
}

/**
 * The run's steps in execution order, by depth and then declaration in the
 * registered definition. Steps that have not run yet have no record; they are
 * listed as not started when the run's definition is the registered one.
 */
function stepRecords(run: RunRecord, compiled?: CompiledWorkflow) {
  const records = new Map((run.steps ?? []).map((s) => [s.stepId, s]))
  const current = runDefinition(run, compiled)
  if (current) {
    for (const node of current.steps) {
      if (!records.has(node.id)) {
        records.set(node.id, { stepId: node.id, status: "pending", attempt: 0 })
      }
    }
  }

  const position = (stepId: string) => {
    const index = compiled?.indexById.get(stepId)
    return index === undefined
      ? [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
      : [compiled!.depth[index], index]
  }
  return [...records.values()].sort((a, b) => {
    const [depthA, indexA] = position(a.stepId)
    const [depthB, indexB] = position(b.stepId)
    return depthA - depthB || indexA - indexB
  })
}

/**
 * The transaction object callers of `run` read, built from a run record.
 */
export class LegacyTransactionView implements LegacyTransaction {
  readonly transactionId: string
  readonly modelId: string
  readonly runId: string

  constructor(
    readonly snapshot: RunRecord,
    readonly liveErrors: LiveRunError[] = [],
    readonly compiled?: CompiledWorkflow
  ) {
    this.transactionId = snapshot.transactionId
    this.modelId = snapshot.workflowId
    this.runId = snapshot.id
  }

  getState(): string {
    return toLegacyRunState(this.snapshot.status)
  }

  hasFinished(): boolean {
    return FINAL_RUN_STATUSES.has(this.snapshot.status)
  }

  getErrors(handlerType?: "invoke" | "compensate"): TransactionStepError[] {
    const errors = this.liveErrors.length
      ? this.liveErrors
      : (this.snapshot.errors ?? []).map((error) => ({
          ...error,
          cause: deserializeError(error.error),
        }))

    return errors
      .filter((error) => !handlerType || error.action === handlerType)
      .map((error) => ({
        action: error.stepId,
        handlerType: error.action,
        error: error.cause ?? error.error,
      }))
  }

  getContext() {
    const invoke: Record<string, any> = {}
    for (const step of this.snapshot.steps ?? []) {
      if ("output" in step || "compensateInput" in step) {
        // The markers the previous engine's stored context carried, which
        // API clients may read.
        invoke[step.stepId] = {
          __type: "Symbol(WorkflowWorkflowData)",
          output: {
            __type: "Symbol(WorkflowStepResponse)",
            output: step.output,
            compensateInput: step.compensateInput,
          },
        }
      }
    }
    return { payload: this.snapshot.input, invoke, compensate: {} }
  }

  getFlow(): LegacyTransactionFlow & {
    steps: Record<string, ExecutionStepView>
  } {
    const run = this.snapshot
    const steps: Record<string, ExecutionStepView> = {}
    const compiled = runDefinition(run, this.compiled)
    for (const step of stepRecords(run, this.compiled)) {
      steps[legacyStepId(step.stepId)] = toLegacyStep(step, compiled)
    }

    return {
      modelId: run.workflowId,
      transactionId: run.transactionId,
      runId: run.id,
      state: this.getState(),
      hasAsyncSteps: !!compiled?.steps.some((step) => step.options.async),
      hasFailedSteps: !!run.flags?.hasFailedSteps,
      hasSkippedSteps: !!run.flags?.hasSkippedSteps,
      hasSkippedOnFailureSteps: !!run.flags?.hasSkippedOnFailureSteps,
      hasRevertedSteps: this.getState() === TransactionState.REVERTED,
      hasWaitingSteps: (run.steps ?? []).some((s) => s.status === "waiting"),
      // The run times out when its deadline passes.
      timedOutAt: run.flags?.timedOut
        ? toMs(run.deadlineAt ?? run.finishedAt ?? run.updatedAt)
        : null,
      cancelledAt: toMs(run.cancelRequestedAt),
      startedAt: toMs(run.createdAt)!,
      metadata: {
        ...(run.metadata ?? {}),
        eventGroupId: run.context?.eventGroupId,
        parentStepIdempotencyKey: run.context?.parentStepIdempotencyKey,
        preventReleaseEvents: run.context?.preventReleaseEvents,
      },
      steps,
    }
  }

  /**
   * A transaction ends up in a step's compensation input, which may be
   * stored. Only the run record survives that.
   */
  toJSON() {
    return {
      transactionId: this.transactionId,
      modelId: this.modelId,
      runId: this.runId,
      snapshot: this.snapshot,
    }
  }
}

/**
 * Accepts a transaction object or what `toJSON` left of one.
 */
export function snapshotFromTransaction(
  transaction: unknown
): RunRecord | undefined {
  if (!transaction || typeof transaction !== "object") {
    return undefined
  }
  return (transaction as { snapshot?: RunRecord }).snapshot
}

export type LegacyEventName =
  | "onBegin"
  | "onResume"
  | "onCompensateBegin"
  | "onFinish"
  | "onTimeout"
  | "onStepBegin"
  | "onStepSuccess"
  | "onStepFailure"
  | "onStepAwaiting"
  | "onStepSkipped"
  | "onCompensateStepSuccess"
  | "onCompensateStepFailure"

const EVENT_NAMES: Partial<Record<RunEvent["name"], LegacyEventName>> = {
  runStarted: "onBegin",
  runResumed: "onResume",
  compensationStarted: "onCompensateBegin",
  runFinished: "onFinish",
  runTimedOut: "onTimeout",
  stepStarted: "onStepBegin",
  stepSucceeded: "onStepSuccess",
  stepFailed: "onStepFailure",
  stepWaiting: "onStepAwaiting",
  stepSkipped: "onStepSkipped",
  stepCompensated: "onCompensateStepSuccess",
  stepCompensationFailed: "onCompensateStepFailure",
}

export function toLegacyEventName(
  name: RunEvent["name"]
): LegacyEventName | undefined {
  return EVENT_NAMES[name]
}

export type LegacyEvent = {
  eventType: LegacyEventName
  workflowId: string
  transactionId: string
  step?: ReturnType<typeof toLegacyStep>
  response?: unknown
  result?: unknown
  errors?: unknown[]
  state?: string
}

/**
 * The payload `subscribe` listeners and run `events` callbacks receive.
 */
export function toLegacyEvent(
  event: RunEvent,
  compiled?: CompiledWorkflow
):
  | {
      name: LegacyEventName
      payload: LegacyEvent
      transaction?: LegacyTransactionView
    }
  | undefined {
  const name = toLegacyEventName(event.name)
  if (!name) {
    return undefined
  }

  const snapshot = event.snapshot?.()
  const transaction = snapshot
    ? new LegacyTransactionView(snapshot, [], compiled)
    : undefined
  const stepRecord = event.stepId
    ? snapshot?.steps?.find((step) => step.stepId === event.stepId)
    : undefined

  const payload: LegacyEvent = {
    eventType: name,
    workflowId: event.workflowId,
    transactionId: event.transactionId,
    state: toLegacyRunState(event.status),
  }

  if (stepRecord) {
    payload.step = toLegacyStep(stepRecord, runDefinition(snapshot!, compiled))
  }
  if (name === "onStepSuccess") {
    payload.response = event.output
  }
  if (name === "onStepFailure" || name === "onCompensateStepFailure") {
    const action = name === "onStepFailure" ? "invoke" : "compensate"
    payload.errors = (transaction?.getErrors(action) ?? []).filter(
      (error) => error.action === event.stepId
    )
  }
  if (name === "onFinish") {
    payload.result = event.result
    payload.errors = transaction?.getErrors() ?? []
  }

  return { name, payload, transaction }
}
