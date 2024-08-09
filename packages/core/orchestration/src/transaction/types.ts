import { DistributedTransactionType } from "./distributed-transaction"
import { TransactionStep } from "./transaction-step"
export {
  TransactionHandlerType,
  TransactionState,
  TransactionStepStatus,
} from "@medusajs/utils"

/**
 * Defines the structure and behavior of a single step within a transaction workflow.
 */
export type TransactionStepsDefinition = {
  /**
   * A unique identifier for the transaction step.
   * This is set automatically when declaring a workflow with "createWorkflow"
   */
  uuid?: string

  /**
   * Specifies the action to be performed in this step.
   * "name" is an alias for action when creating a workflow with "createWorkflow".
   */
  action?: string

  /**
   * Indicates whether the workflow should continue even if there is a permanent failure in this step.
   * In case it is set to true, the children steps of this step will not be executed and their status will be marked as TransactionStepState.SKIPPED_FAILURE.
   */
  continueOnPermanentFailure?: boolean

  /**
   * If true, no compensation action will be triggered for this step in case of a failure.
   */
  noCompensation?: boolean

  /**
   * The maximum number of times this step should be retried in case of temporary failures.
   * The default is 0 (no retries).
   */
  maxRetries?: number

  /**
   * The interval (in seconds) between retry attempts after a temporary failure.
   * The default is to retry immediately.
   */
  retryInterval?: number

  /**
   * The interval (in seconds) to retry a step even if its status is "TransactionStepStatus.WAITING".
   */
  retryIntervalAwaiting?: number

  /**
   * The maximum amount of time (in seconds) to wait for this step to complete.
   * This is NOT an execution timeout, the step will always be executed and wait for its response.
   * If the response is not received within the timeout set, it will be marked as "TransactionStepStatus.TIMEOUT" and the workflow will be reverted as soon as it receives the response.
   */
  timeout?: number

  /**
   * If true, the step is executed asynchronously. This means that the workflow will not wait for the response of this step.
   * Async steps require to have their responses set using "setStepSuccess" or "setStepFailure", unless it is combined with "backgroundExecution: true".
   * If combined with a timeout, and any response is not set within that interval, the step will be marked as "TransactionStepStatus.TIMEOUT" and the workflow will be reverted immediately.
   */
  async?: boolean

  /**
   * It applies to "async" steps only, allowing them to run in the background and automatically complete without external intervention.
   * It is ideal for time-consuming tasks that will be complete after the execution, contrasting with standard "async" operations that require a response to be set in a later stage.
   */
  backgroundExecution?: boolean

  /**
   * If true, the compensation function for this step is executed asynchronously. Which means, the response has to be set using "setStepSuccess" or "setStepFailure".
   */
  compensateAsync?: boolean

  /**
   * If true, the workflow will not wait for their sibling steps to complete before moving to the next step.
   */
  noWait?: boolean

  /**
   * If true, the response of this step will be stored.
   * Default is true.
   */
  saveResponse?: boolean

  /**
   * Defines the next step(s) to execute after this step. Can be a single step or an array of steps.
   */
  next?: TransactionStepsDefinition | TransactionStepsDefinition[]

  // TODO: add metadata field for customizations
}

/**
 * Defines the options for a transaction model, which are applicable to the entire workflow.
 */
export type TransactionModelOptions = {
  /**
   * The global timeout for the entire transaction workflow (in seconds).
   */
  timeout?: number

  /**
   * If true, the state of the transaction will be persisted.
   */
  store?: boolean

  /**
   * TBD
   */
  retentionTime?: number

  /**
   * If true, the execution details of each step will be stored.
   */
  storeExecution?: boolean

  /**
   * If true, the workflow will use the transaction ID as the key to ensure only-once execution
   */
  idempotent?: boolean

  /**
   * Defines the workflow as a scheduled workflow that executes based on the cron configuration passed.
   * The value can either by a cron expression string, or an object that also allows to define the concurrency behavior.
   */
  schedule?: string | SchedulerOptions

  // TODO: add metadata field for customizations
}

export type SchedulerOptions = {
  /**
   * The cron expression to schedule the workflow execution.
   */
  cron: string
  /**
   * Setting whether to allow concurrent executions (eg. if the previous execution is still running, should the new one be allowed to run or not)
   * By default concurrent executions are not allowed.
   */
  concurrency?: "allow" | "forbid"

  /**
   * Optionally limit the number of executions for the scheduled workflow. If not set, the workflow will run indefinitely.
   */
  numberOfExecutions?: number
}

export type TransactionModel = {
  id: string
  flow: TransactionStepsDefinition
  hash: string
  options?: TransactionModelOptions
}

export enum DistributedTransactionEvent {
  BEGIN = "begin",
  RESUME = "resume",
  COMPENSATE_BEGIN = "compensateBegin",
  FINISH = "finish",
  TIMEOUT = "timeout",
  STEP_BEGIN = "stepBegin",
  STEP_SUCCESS = "stepSuccess",
  STEP_SKIPPED = "stepSkipped",
  STEP_FAILURE = "stepFailure",
  STEP_AWAITING = "stepAwaiting",
  COMPENSATE_STEP_SUCCESS = "compensateStepSuccess",
  COMPENSATE_STEP_FAILURE = "compensateStepFailure",
}

export type DistributedTransactionEvents = {
  onBegin?: (args: { transaction: DistributedTransactionType }) => void
  onResume?: (args: { transaction: DistributedTransactionType }) => void
  onFinish?: (args: {
    transaction: DistributedTransactionType
    result?: unknown
    errors?: unknown[]
  }) => void
  onTimeout?: (args: { transaction: DistributedTransactionType }) => void

  onStepBegin?: (args: {
    step: TransactionStep
    transaction: DistributedTransactionType
  }) => void

  onStepSuccess?: (args: {
    step: TransactionStep
    transaction: DistributedTransactionType
  }) => void

  onStepFailure?: (args: {
    step: TransactionStep
    transaction: DistributedTransactionType
  }) => void

  onStepAwaiting?: (args: {
    step: TransactionStep
    transaction: DistributedTransactionType
  }) => void

  onCompensateBegin?: (args: {
    transaction: DistributedTransactionType
  }) => void

  onCompensateStepSuccess?: (args: {
    step: TransactionStep
    transaction: DistributedTransactionType
  }) => void

  onCompensateStepFailure?: (args: {
    step: TransactionStep
    transaction: DistributedTransactionType
  }) => void

  onStepSkipped?: (args: {
    step: TransactionStep
    transaction: DistributedTransactionType
  }) => void
}

export type StepFeatures = {
  hasAsyncSteps: boolean
  hasStepTimeouts: boolean
  hasRetriesTimeout: boolean
}

export type TransactionOptions = TransactionModelOptions & StepFeatures
