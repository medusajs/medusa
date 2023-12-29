import { DistributedTransaction } from "./distributed-transaction"
import { TransactionStep } from "./transaction-step"
export {
  TransactionHandlerType,
  TransactionState,
  TransactionStepStatus,
} from "@medusajs/utils"

export type TransactionStepsDefinition = {
  action?: string
  continueOnPermanentFailure?: boolean
  noCompensation?: boolean
  maxRetries?: number
  retryInterval?: number
  retryIntervalAwaiting?: number
  timeout?: number
  async?: boolean
  compensateAsync?: boolean
  noWait?: boolean
  saveResponse?: boolean
  next?: TransactionStepsDefinition | TransactionStepsDefinition[]
}

export type TransactionModelOptions = {
  timeout?: number
  storeExecution?: boolean
  retentionTime?: number
  strictCheckpoints?: boolean
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
  STEP_FAILURE = "stepFailure",
  COMPENSATE_STEP_SUCCESS = "compensateStepSuccess",
  COMPENSATE_STEP_FAILURE = "compensateStepFailure",
}

export type DistributedTransactionEvents = {
  onBegin?: (args: { transaction: DistributedTransaction }) => void
  onResume?: (args: { transaction: DistributedTransaction }) => void
  onFinish?: (args: {
    transaction: DistributedTransaction
    result?: unknown
    errors?: unknown[]
  }) => void
  onTimeout?: (args: { transaction: DistributedTransaction }) => void

  onStepBegin?: (args: {
    step: TransactionStep
    transaction: DistributedTransaction
  }) => void

  onStepSuccess?: (args: {
    step: TransactionStep
    transaction: DistributedTransaction
  }) => void

  onStepFailure?: (args: {
    step: TransactionStep
    transaction: DistributedTransaction
  }) => void

  onCompensateBegin?: (args: { transaction: DistributedTransaction }) => void

  onCompensateStepSuccess?: (args: {
    step: TransactionStep
    transaction: DistributedTransaction
  }) => void

  onCompensateStepFailure?: (args: {
    step: TransactionStep
    transaction: DistributedTransaction
  }) => void
}
