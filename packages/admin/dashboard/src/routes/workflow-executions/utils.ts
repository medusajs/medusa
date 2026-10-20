import { HttpTypes } from "@medusajs/types"
import { TFunction } from "i18next"
import {
  STEP_ERROR_STATES,
  STEP_INACTIVE_STATES,
  STEP_IN_PROGRESS_STATES,
  TRANSACTION_ERROR_STATES,
  TRANSACTION_IN_PROGRESS_STATES,
} from "./constants"
import {
  TransactionState,
  TransactionStepState,
  TransactionStepStatus,
} from "./types"

export const adminExecutionKey = {
  detail: (id: string) => ["workflow_executions", "detail", id],
  list: (query?: HttpTypes.AdminGetWorkflowExecutionsParams) => [
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
    case TransactionStepState.SKIPPED_FAILURE:
      return t("workflowExecutions.step.state.skippedFailure")
    case TransactionStepState.DORMANT:
      return t("workflowExecutions.step.state.dormant")
    case TransactionStepState.TIMEOUT:
      return t("workflowExecutions.step.state.timeout")
  }
}

type ExecutionStep = HttpTypes.AdminWorkflowExecutionStep

const ROOT_STEP_ID = "_root"

/**
 * The step's ID as defined in the workflow. Step IDs may contain dots, so
 * they are never parsed out of the execution step's ID.
 */
export const getStepName = (step: ExecutionStep): string =>
  step.step_id ?? step.definition?.action ?? step.id

/**
 * The steps of an execution, without the legacy root, ordered by depth.
 */
export const getExecutionSteps = (
  steps?: Record<string, ExecutionStep> | null
): ExecutionStep[] =>
  Object.values(steps ?? {})
    .filter((step) => step.id !== ROOT_STEP_ID)
    .map((step, index) => ({ step, index }))
    .sort((a, b) => a.step.depth - b.step.depth || a.index - b.index)
    .map(({ step }) => step)

/**
 * The names of the steps that run after the given step, directly or not.
 */
export const getStepDescendants = (
  steps: ExecutionStep[],
  stepName: string
): Set<string> => {
  const dependents = new Map<string, string[]>()
  for (const step of steps) {
    for (const dependency of step.depends_on ?? []) {
      dependents.set(dependency, [
        ...(dependents.get(dependency) ?? []),
        getStepName(step),
      ])
    }
  }

  const descendants = new Set<string>()
  const stack = [...(dependents.get(stepName) ?? [])]
  while (stack.length) {
    const next = stack.pop()!
    if (!descendants.has(next)) {
      descendants.add(next)
      stack.push(...(dependents.get(next) ?? []))
    }
  }
  return descendants
}

/**
 * The names of the steps that will not run because a step they depend on
 * failed permanently.
 */
export const getUnreachableStepNames = (
  steps: ExecutionStep[]
): Set<string> => {
  const unreachable = new Set<string>()
  const notStarted = new Set(
    steps
      .filter((step) => step.invoke.state === TransactionStepState.NOT_STARTED)
      .map(getStepName)
  )

  for (const step of steps) {
    if (step.invoke.status !== TransactionStepStatus.PERMANENT_FAILURE) {
      continue
    }
    for (const name of getStepDescendants(steps, getStepName(step))) {
      if (notStarted.has(name)) {
        unreachable.add(name)
      }
    }
  }
  return unreachable
}

/**
 * Steps grouped by depth, shallowest first. Steps of a group can run in
 * parallel once the previous groups are done.
 */
export const groupStepsByDepth = (
  steps: ExecutionStep[]
): ExecutionStep[][] => {
  const groups = new Map<number, ExecutionStep[]>()
  for (const step of steps) {
    groups.set(step.depth, [...(groups.get(step.depth) ?? []), step])
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, group]) => group)
}
