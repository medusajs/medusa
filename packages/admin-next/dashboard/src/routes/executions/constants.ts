import { TransactionStepState } from "./types"

export const BLUE_STATES = [TransactionStepState.INVOKING]

export const ORANGE_STATES = [
  TransactionStepState.COMPENSATING,
  TransactionStepState.SKIPPED,
]

export const GREEN_STATES = [TransactionStepState.DONE]

export const RED_STATES = [
  TransactionStepState.FAILED,
  TransactionStepState.REVERTED,
  TransactionStepState.TIMEOUT,
  TransactionStepState.DORMANT,
]

export const GRAY_STATES = [TransactionStepState.NOT_STARTED]
