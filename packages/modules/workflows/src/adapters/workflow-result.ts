import type { Logger } from "@medusajs/framework/types"
import { TransactionState } from "@medusajs/framework/utils"
import type { CompiledWorkflow, RunHandle } from "@medusajs/workflow-engine"
import { EOL } from "os"
import { LegacyTransactionView } from "../legacy/transaction-view"

export type ResultOperation =
  | "run"
  | "cancel"
  | "stepSuccess"
  | "stepFailure"
  | "retryStep"

/**
 * Builds `{ acknowledgement, errors, transaction, result, thrownError }` and
 * throws the first invoke error, or compensation error for a cancel, when the
 * run failed and the caller asked for it.
 */
export function toWorkflowResult(
  handle: RunHandle,
  options: {
    operation: ResultOperation
    throwOnError: boolean
    logOnError?: boolean
    logger?: Pick<Logger, "error">
    compiled?: CompiledWorkflow
  }
) {
  const transaction = new LegacyTransactionView(
    handle.run,
    handle.errors,
    options.compiled
  )
  // A cancel fails when compensation fails, so it reports those errors.
  const errors = transaction.getErrors(
    options.operation === "cancel" ? "compensate" : "invoke"
  )
  const state = transaction.getState()
  const failed =
    state === TransactionState.FAILED || state === TransactionState.REVERTED
  const cancelled =
    options.operation === "cancel" && state === TransactionState.REVERTED

  let thrownError: unknown
  if (failed && !cancelled) {
    thrownError = errors[0]?.error ?? new Error("Unknown error")
  }
  if (handle.resultError) {
    thrownError ??= handle.resultError
    errors.push(handle.resultError as any)
  }

  if (options.logOnError) {
    logErrors(transaction, options.logger ?? console)
  }

  const acknowledgement = {
    workflowId: handle.workflowId,
    transactionId: handle.transactionId,
    parentStepIdempotencyKey: handle.run.context?.parentStepIdempotencyKey as
      | string
      | undefined,
    hasFinished: handle.finished,
    hasFailed:
      options.operation === "cancel"
        ? state === TransactionState.FAILED
        : failed,
    // Only cancel acknowledgements say whether the run exists.
    ...(options.operation === "cancel" ? { exists: true } : {}),
  }

  if (options.throwOnError && thrownError) {
    throw thrownError
  }

  return {
    acknowledgement,
    errors,
    transaction,
    result: handle.result,
    thrownError,
  }
}

function logErrors(
  transaction: LegacyTransactionView,
  logger: Pick<Logger, "error">
) {
  for (const error of transaction.getErrors()) {
    const cause = error.error as { message?: string; stack?: string }
    const message = cause?.message ? `: ${cause.message}` : ""
    const stack = cause?.stack ? `${EOL}${cause.stack}` : ""
    logger.error(
      `${transaction.modelId}:${error.action}:${error.handlerType}${message}${stack}`
    )
  }
}
