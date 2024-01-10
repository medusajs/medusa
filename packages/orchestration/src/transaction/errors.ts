export class PermanentStepFailureError extends Error {
  static isPermanentStepFailureError(
    error: Error
  ): error is PermanentStepFailureError {
    return (
      error instanceof PermanentStepFailureError ||
      error.name === "PermanentStepFailure"
    )
  }

  constructor(message?: string) {
    super(message)
    this.name = "PermanentStepFailure"
  }
}

export class StepTimeoutError extends Error {
  static isStepTimeoutError(error: Error): error is StepTimeoutError {
    return (
      error instanceof StepTimeoutError || error.name === "StepTimeoutError"
    )
  }

  constructor(message?: string) {
    super(message)
    this.name = "StepTimeoutError"
  }
}

export class TransactionTimeoutError extends Error {
  static isTransactionTimeoutError(
    error: Error
  ): error is TransactionTimeoutError {
    return (
      error instanceof TransactionTimeoutError ||
      error.name === "TransactionTimeoutError"
    )
  }

  constructor(message?: string) {
    super(message)
    this.name = "TransactionTimeoutError"
  }
}
