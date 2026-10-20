import { MedusaError } from "@medusajs/framework/utils"
import {
  CancelNotAllowedError,
  DefinitionConflictError,
  RunNotFoundError,
  StepNotFoundError,
  StepNotWaitingError,
  TransactionAlreadyStartedError,
  WorkflowNotRegisteredError,
} from "@medusajs/workflow-engine"
import { toLegacyStepStatus } from "./state"

export type Operation = "run" | "cancel" | "success" | "failure" | "retry"

/**
 * The error a caller of the module sees for an engine error.
 */
export function toMedusaError(error: unknown, operation: Operation): unknown {
  if (error instanceof StepNotWaitingError) {
    return new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `Cannot set step ${error.operation} when status is ${toLegacyStepStatus(
        error.status
      )}`
    )
  }
  if (error instanceof RunNotFoundError) {
    return new MedusaError(
      MedusaError.Types.NOT_FOUND,
      operation === "cancel"
        ? "Transaction not found"
        : `Transaction ${error.transactionId} could not be found.`
    )
  }
  if (error instanceof StepNotFoundError) {
    return new MedusaError(MedusaError.Types.NOT_FOUND, error.message)
  }
  if (error instanceof CancelNotAllowedError) {
    return new MedusaError(MedusaError.Types.NOT_ALLOWED, error.message)
  }
  if (error instanceof TransactionAlreadyStartedError) {
    return new MedusaError(MedusaError.Types.CONFLICT, error.message)
  }
  if (error instanceof DefinitionConflictError) {
    return new MedusaError(MedusaError.Types.INVALID_DATA, error.message)
  }
  if (error instanceof WorkflowNotRegisteredError) {
    return new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `${error.message}. Workflows must be defined in a project's or plugin's src/workflows folder.`
    )
  }
  return error
}
