export type Durability = "none" | "summary" | "full"

export type RunStatus =
  | "pending"
  | "running"
  | "waiting"
  | "compensating"
  | "succeeded"
  | "compensated"
  | "failed"
  | "cancelled"

export type StepStatus =
  | "pending"
  | "running"
  | "waiting"
  | "retry_scheduled"
  | "succeeded"
  | "skipped"
  | "failed"
  | "timed_out"
  | "compensating"
  | "compensated"
  | "compensation_failed"

export type StepAction = "invoke" | "compensate"

export interface StepKey {
  workflowId: string
  transactionId: string
  stepId: string
  action: StepAction
}

export interface StepOptions {
  /**
   * The run does not wait for the step. It is `waiting` until its handler
   * resolves with an output (background) or until it is completed from outside.
   */
  async?: boolean
  maxRetries?: number
  retryIntervalMs?: number
  /**
   * When false, a failed attempt waits for an explicit `retryStep`.
   */
  autoRetry?: boolean
  timeoutMs?: number
  continueOnPermanentFailure?: boolean
  /**
   * `true` skips every dependent step. A step id skips the dependents up to,
   * but not including, that step.
   */
  skipOnPermanentFailure?: boolean | string
  saveResponse?: boolean
  /**
   * The step starts a child run and is completed when the child finishes.
   */
  nested?: boolean
  [key: string]: unknown
}

export interface ScheduleOptions {
  cron?: string
  intervalMs?: number
  concurrency?: "allow" | "forbid"
  numberOfExecutions?: number
  catchUp?: boolean
}

export interface WorkflowOptions {
  timeoutMs?: number
  retentionTimeMs?: number
  idempotent?: boolean
  store?: boolean
  durability?: Durability
  schedule?: ScheduleOptions
  [key: string]: unknown
}

export interface StepError {
  name?: string
  message: string
  stack?: string
  [key: string]: unknown
}

export type StepResult =
  | { kind: "output"; output: unknown; compensateInput: unknown }
  | { kind: "skip" }
  | { kind: "wait" }

export interface StepContext {
  runId: string
  workflowId: string
  transactionId: string
  stepId: string
  action: StepAction
  attempt: number
  idempotencyKey: StepKey
  signal: AbortSignal
  input: unknown
  context: Record<string, unknown>
  metadata: Record<string, unknown>
  /**
   * Values supplied by the caller or by extensions for this process only.
   * They are never stored.
   */
  locals: Record<string, unknown>
  results: ReadonlyMap<string, unknown>
  /**
   * Per-run memo for values derived during the run, such as transforms.
   */
  memo: Map<string, unknown>
  parentRunId?: string
  parentStepId?: string
}

export type InvokeHandler = (ctx: StepContext) => Promise<StepResult>

export type CompensateHandler = (
  compensateInput: unknown,
  ctx: StepContext
) => Promise<void>

export interface StepNode {
  id: string
  dependsOn: string[]
  invoke: InvokeHandler
  compensate?: CompensateHandler
  options: StepOptions
}

export interface ResultContext {
  runId: string
  input: unknown
  context: Record<string, unknown>
  locals: Record<string, unknown>
  results: ReadonlyMap<string, unknown>
  memo: Map<string, unknown>
}

export interface WorkflowDefinition {
  id: string
  /**
   * Topologically sorted. A step may only depend on steps declared before it.
   */
  steps: StepNode[]
  options: WorkflowOptions
  result?: (ctx: ResultContext) => unknown | Promise<unknown>
}
