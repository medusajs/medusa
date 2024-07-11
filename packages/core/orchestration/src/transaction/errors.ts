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

export class SkipStepResponse extends Error {
  static isSkipStepResponse(error: Error): error is SkipStepResponse {
    return (
      error instanceof SkipStepResponse || error?.name === "SkipStepResponse"
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

export function serializeError(error) {
  const serialized = {
    message: error.message,
    name: error.name,
    stack: error.stack,
  }

  Object.getOwnPropertyNames(error).forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!serialized.hasOwnProperty(key)) {
      serialized[key] = error[key]
    }
  })

  return serialized
}

export function isErrorLike(value) {
  return (
    !!value &&
    typeof value === "object" &&
    "name" in value &&
    "message" in value &&
    "stack" in value
  )
}
