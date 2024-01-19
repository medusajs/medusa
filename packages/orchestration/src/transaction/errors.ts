export class PermanentStepFailureError extends Error {
  static isPermanentStepFailureError(
    error: Error
  ): error is PermanentStepFailureError {
    return (
      error instanceof PermanentStepFailureError ||
      error?.name === "PermanentStepFailure"
    )
  }

  constructor(message?: string) {
    super(message)
    this.name = "PermanentStepFailure"
  }
}

export class TransactionStepTimeoutError extends Error {
  static isTransactionStepTimeoutError(
    error: Error
  ): error is TransactionStepTimeoutError {
    return (
      error instanceof TransactionStepTimeoutError ||
      error?.name === "TransactionStepTimeoutError"
    )
  }

  constructor(message?: string) {
    super(message)
    this.name = "TransactionStepTimeoutError"
  }
}

export class TransactionTimeoutError extends Error {
  static isTransactionTimeoutError(
    error: Error
  ): error is TransactionTimeoutError {
    return (
      error instanceof TransactionTimeoutError ||
      error?.name === "TransactionTimeoutError"
    )
  }

  constructor(message?: string) {
    super(message)
    this.name = "TransactionTimeoutError"
  }
}
