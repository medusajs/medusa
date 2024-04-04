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
      return t("workflowExecutions.state.done")
    case TransactionState.FAILED:
      return t("workflowExecutions.state.failed")
    case TransactionState.REVERTED:
      return t("workflowExecutions.state.reverted")
    case TransactionState.INVOKING:
      return t("workflowExecutions.state.invoking")
    case TransactionState.WAITING_TO_COMPENSATE:
      return t("workflowExecutions.transaction.state.waitingToCompensate")
    case TransactionState.COMPENSATING:
      return t("workflowExecutions.state.compensating")
    case TransactionState.NOT_STARTED:
      return t("workflowExecutions.state.notStarted")
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
      return t("workflowExecutions.state.done")
    case TransactionStepState.FAILED:
      return t("workflowExecutions.state.failed")
    case TransactionStepState.REVERTED:
      return t("workflowExecutions.state.reverted")
    case TransactionStepState.INVOKING:
      return t("workflowExecutions.state.invoking")
    case TransactionStepState.COMPENSATING:
      return t("workflowExecutions.state.compensating")
    case TransactionStepState.NOT_STARTED:
      return t("workflowExecutions.state.notStarted")
    case TransactionStepState.SKIPPED:
      return t("workflowExecutions.step.state.skipped")
    case TransactionStepState.DORMANT:
      return t("workflowExecutions.step.state.dormant")
    case TransactionStepState.TIMEOUT:
      return t("workflowExecutions.step.state.timeout")
  }
}
