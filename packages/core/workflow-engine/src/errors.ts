export class WorkflowEngineError extends Error {
  constructor(message: string) {
    super(message)
    this.name = new.target.name
  }
}

export class WorkflowNotRegisteredError extends WorkflowEngineError {
  constructor(public workflowId: string) {
    super(`Workflow "${workflowId}" is not registered`)
  }
}

export class DefinitionConflictError extends WorkflowEngineError {
  constructor(public workflowId: string) {
    super(
      `Workflow with id "${workflowId}" and step definition already exists.`
    )
  }
}

export class InvalidDefinitionError extends WorkflowEngineError {}

export class TransactionAlreadyStartedError extends WorkflowEngineError {
  constructor(public transactionId: string) {
    super(`Transaction already started for transactionId: ${transactionId}`)
  }
}

export class RunNotFoundError extends WorkflowEngineError {
  constructor(public transactionId: string) {
    super(`Transaction ${transactionId} could not be found.`)
  }
}

export class StepNotFoundError extends WorkflowEngineError {
  constructor(public stepId: string, public transactionId: string) {
    super(`Step "${stepId}" not found in transaction ${transactionId}.`)
  }
}

export class StepNotWaitingError extends WorkflowEngineError {
  constructor(
    public operation: "success" | "failure" | "retry",
    public status: string
  ) {
    super(`Cannot set step ${operation} when status is ${status}`)
  }
}

export class CancelNotAllowedError extends WorkflowEngineError {}

export class InvalidTransitionError extends WorkflowEngineError {}

export class LeaseLostError extends WorkflowEngineError {
  constructor(public runId: string) {
    super(`Lease lost for run ${runId}`)
  }
}

/**
 * Thrown by a handler to fail the step without retries. `compensateInput` is
 * passed to the step's own compensation.
 */
export class NonRetryableError extends WorkflowEngineError {
  constructor(message: string, public compensateInput?: unknown) {
    super(message)
  }
}

export class StepTimeoutError extends WorkflowEngineError {
  constructor(public stepId: string, public timeoutMs: number) {
    super(`Step "${stepId}" timed out after ${timeoutMs} ms`)
  }
}

export class RunTimeoutError extends WorkflowEngineError {
  constructor(public workflowId: string, public timeoutMs: number) {
    super(`Workflow "${workflowId}" timed out after ${timeoutMs} ms`)
  }
}

export class DefinitionMismatchError extends WorkflowEngineError {
  constructor(public workflowId: string, public stepIds: string[]) {
    super(
      `Run of workflow "${workflowId}" cannot resume: its steps ${stepIds
        .map((id) => `"${id}"`)
        .join(", ")} no longer exist in the workflow`
    )
  }
}

export class RunInterruptedError extends WorkflowEngineError {
  constructor(public workflowId: string) {
    super(
      `Run of workflow "${workflowId}" was interrupted and cannot be resumed`
    )
  }
}

export class RunNotStoredError extends WorkflowEngineError {
  constructor(public runId: string, public workflowId: string) {
    super(
      `Run ${runId} of workflow "${workflowId}" is not stored (durability "none") and cannot finish after it stopped`
    )
  }
}

export class EngineStoppedError extends WorkflowEngineError {
  constructor(message = "The workflow engine is shutting down or stopped") {
    super(message)
  }
}
