/**
 * Options of a workflow step. Durations are in seconds.
 */
export type WorkflowStepConfig = {
  /**
   * If true, the workflow continues when this step fails permanently.
   */
  continueOnPermanentFailure?: boolean
  /**
   * If true, the steps after this one are skipped when it fails permanently.
   * If a step name, the steps up to that step are skipped.
   */
  skipOnPermanentFailure?: boolean | string
  /**
   * If true, the step has no compensation.
   */
  noCompensation?: boolean
  /**
   * The number of retries after the first failed attempt.
   */
  maxRetries?: number
  /**
   * If false, a failed attempt waits for an explicit `retryStep`.
   */
  autoRetry?: boolean
  /**
   * Seconds to wait between retries.
   */
  retryInterval?: number
  /**
   * @deprecated Has no effect: the workflow engine ignores it. Use an async
   * step with a timeout instead.
   */
  retryIntervalAwaiting?: number
  /**
   * @deprecated Has no effect: the workflow engine ignores it. Use an async
   * step with a timeout instead.
   */
  maxAwaitingRetries?: number
  /**
   * Seconds after which the step times out.
   */
  timeout?: number
  /**
   * If true, the workflow does not wait for the step. An async step that
   * returns a `StepResponse` completes in the background; one that returns
   * nothing waits for `setStepSuccess` or `setStepFailure`.
   */
  async?: boolean
  /**
   * If true, the step hosts a child workflow.
   */
  nested?: boolean
  /**
   * @deprecated Background execution follows from the step's return value.
   */
  backgroundExecution?: boolean
  /**
   * @deprecated Has no effect: the workflow engine runs compensation
   * synchronously.
   */
  compensateAsync?: boolean
  /**
   * @deprecated Unused.
   */
  noWait?: boolean
  /**
   * If false, the step's output is not kept for later steps.
   */
  saveResponse?: boolean
  /**
   * @deprecated The durability level follows from the workflow options.
   */
  store?: boolean
}

export type SchedulerOptions = {
  /**
   * Whether a new execution may start while the previous one is still running.
   * Defaults to "forbid".
   */
  concurrency?: "allow" | "forbid"
  /**
   * Limits the number of executions. Unlimited when not set.
   */
  numberOfExecutions?: number
} & (
  | {
      /**
       * The cron expression to schedule the workflow execution.
       */
      cron: string
    }
  | {
      /**
       * The interval, in milliseconds, between executions.
       */
      interval: number
    }
)

/**
 * Options of a workflow. Durations are in seconds.
 */
export type WorkflowConfigOptions = {
  /**
   * Seconds after which the workflow times out and is compensated.
   */
  timeout?: number
  /**
   * If true, the execution is stored.
   */
  store?: boolean
  /**
   * Seconds to keep the execution after it finishes.
   */
  retentionTime?: number
  /**
   * @deprecated Use `store` instead.
   */
  storeExecution?: boolean
  /**
   * If true, running the workflow again with the transaction id of a finished
   * execution returns that execution's result.
   */
  idempotent?: boolean
  /**
   * Runs the workflow on a schedule.
   */
  schedule?: string | SchedulerOptions
  /**
   * How much of the execution is saved: nothing, the start and the end, or
   * every step. Derived from the other options when not set.
   */
  durability?: "none" | "summary" | "full"
}

export type TransactionStepError = {
  action: string
  handlerType: "invoke" | "compensate"
  error: Error | any
}

/**
 * The state of a step as the legacy transaction API reports it.
 */
export type LegacyTransactionStep = {
  id: string
  depth: number
  definition: { action: string } & WorkflowStepConfig
  invoke: { state: string; status: string }
  compensate: { state: string; status: string }
  attempts: number
  failures: number
  startedAt?: number
  lastAttempt?: number | null
}

export type LegacyTransactionFlow = {
  modelId: string
  transactionId: string
  runId: string
  state: string
  hasAsyncSteps?: boolean
  hasFailedSteps: boolean
  hasSkippedSteps: boolean
  hasSkippedOnFailureSteps: boolean
  hasRevertedSteps: boolean
  hasWaitingSteps: boolean
  timedOutAt: number | null
  cancelledAt: number | null
  startedAt: number
  metadata: Record<string, unknown>
  steps: Record<string, LegacyTransactionStep>
}

/**
 * The transaction object returned with a workflow result.
 */
export interface LegacyTransaction {
  readonly transactionId: string
  readonly modelId: string
  readonly runId: string
  getState(): string
  hasFinished(): boolean
  getErrors(handlerType?: "invoke" | "compensate"): TransactionStepError[]
  getContext(): {
    payload: unknown
    invoke: Record<
      string,
      { output: { output: unknown; compensateInput: unknown } }
    >
    compensate: Record<string, unknown>
  }
  getFlow(): LegacyTransactionFlow
}

type TransactionEventArgs = { transaction: LegacyTransaction }
type StepEventArgs = TransactionEventArgs & { step: LegacyTransactionStep }

/**
 * Callbacks for one run, passed in the run options.
 */
export type WorkflowRunEvents = {
  onBegin?: (args: TransactionEventArgs) => void
  onResume?: (args: TransactionEventArgs) => void
  onFinish?: (
    args: TransactionEventArgs & { result?: unknown; errors?: unknown[] }
  ) => void
  onTimeout?: (args: TransactionEventArgs) => void
  onStepBegin?: (args: StepEventArgs) => void
  onStepSuccess?: (args: StepEventArgs) => void
  onStepFailure?: (args: StepEventArgs) => void
  onStepAwaiting?: (args: StepEventArgs) => void
  onCompensateBegin?: (args: TransactionEventArgs) => void
  onCompensateStepSuccess?: (args: StepEventArgs) => void
  onCompensateStepFailure?: (args: StepEventArgs) => void
  onStepSkipped?: (args: StepEventArgs) => void
}
