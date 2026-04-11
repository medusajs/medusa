export class HMRReloadError extends Error {
  static isHMRReloadError(error: Error): error is HMRReloadError {
    return error instanceof HMRReloadError || error.name === "HMRReloadError"
  }

  constructor(message: string) {
    super(message)
    this.name = "HMRReloadError"
  }
}
