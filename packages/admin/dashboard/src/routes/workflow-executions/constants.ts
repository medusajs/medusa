import { TransactionState, TransactionStepState } from "./types"

export const STEP_IN_PROGRESS_STATES = [
  TransactionStepState.COMPENSATING,
  TransactionStepState.INVOKING,
]

export const STEP_SKIPPED_STATES = [
  TransactionStepState.SKIPPED,
  TransactionStepState.SKIPPED_FAILURE,
]
export const STEP_OK_STATES = [TransactionStepState.DONE]

export const STEP_ERROR_STATES = [
  TransactionStepState.FAILED,
  TransactionStepState.REVERTED,
  TransactionStepState.TIMEOUT,
  TransactionStepState.DORMANT,
]
export const STEP_INACTIVE_STATES = [TransactionStepState.NOT_STARTED]

export const TRANSACTION_OK_STATES = [TransactionState.DONE]
export const TRANSACTION_ERROR_STATES = [
  TransactionState.FAILED,
  TransactionState.REVERTED,
]
export const TRANSACTION_IN_PROGRESS_STATES = [
  TransactionState.INVOKING,
  TransactionState.WAITING_TO_COMPENSATE,
  TransactionState.COMPENSATING,
]
