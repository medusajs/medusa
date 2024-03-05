import { AdminGetWorkflowExecutionsParams } from "@medusajs/medusa"
import { TFunction } from "i18next"
import {
  STEP_ERROR_STATES,
  STEP_INACTIVE_STATES,
  STEP_IN_PROGRESS_STATES,
  TRANSACTION_ERROR_STATES,
  TRANSACTION_IN_PROGRESS_STATES,
} from "./constants"
import { TransactionState, TransactionStepState } from "./types"

export const adminExecutionKey = {
  detail: (id: string) => ["workflow_executions", "detail", id],
  list: (query?: AdminGetWorkflowExecutionsParams) => [
    "workflow_executions",
    "list",
    { query },
  ],
}

export const getTransactionStateColor = (
  state: TransactionState
): "green" | "orange" | "red" => {
  let statusColor: "green" | "red" | "orange" = "green"

  if (TRANSACTION_ERROR_STATES.includes(state)) {
    statusColor = "red"
  }

  if (TRANSACTION_IN_PROGRESS_STATES.includes(state)) {
    statusColor = "orange"
  }

  return statusColor
}

export const getTransactionState = (
  t: TFunction<"translation", any>,
  state: TransactionState
) => {
  switch (state) {
    case TransactionState.DONE:
      return t("executions.state.done")
    case TransactionState.FAILED:
      return t("executions.state.failed")
    case TransactionState.REVERTED:
      return t("executions.state.reverted")
    case TransactionState.INVOKING:
      return t("executions.state.invoking")
    case TransactionState.WAITING_TO_COMPENSATE:
      return t("executions.transaction.state.waitingToCompensate")
    case TransactionState.COMPENSATING:
      return t("executions.state.compensating")
    case TransactionState.NOT_STARTED:
      return t("executions.state.notStarted")
  }
}

export const getStepStateColor = (state: TransactionStepState) => {
  let statusColor: "green" | "red" | "orange" | "grey" = "green"

  if (STEP_ERROR_STATES.includes(state)) {
    statusColor = "red"
  }

  if (STEP_INACTIVE_STATES.includes(state)) {
    statusColor = "grey"
  }

  if (STEP_IN_PROGRESS_STATES.includes(state)) {
    statusColor = "orange"
  }

  return statusColor
}

export const getStepState = (
  t: TFunction<"translation", any>,
  state: TransactionStepState
) => {
  switch (state) {
    case TransactionStepState.DONE:
      return t("executions.state.done")
    case TransactionStepState.FAILED:
      return t("executions.state.failed")
    case TransactionStepState.REVERTED:
      return t("executions.state.reverted")
    case TransactionStepState.INVOKING:
      return t("executions.state.invoking")
    case TransactionStepState.COMPENSATING:
      return t("executions.state.compensating")
    case TransactionStepState.NOT_STARTED:
      return t("executions.state.notStarted")
    case TransactionStepState.SKIPPED:
      return t("executions.step.state.skipped")
    case TransactionStepState.DORMANT:
      return t("executions.step.state.dormant")
    case TransactionStepState.TIMEOUT:
      return t("executions.step.state.timeout")
  }
}
