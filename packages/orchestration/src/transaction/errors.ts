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
