import { PaymentProcessorError } from "@medusajs/types"

export abstract class AbstractPaymentModuleProvider {
  public static PROVIDER?: string
  public static DISPLAY_NAME?: string

  protected readonly config_: Record<string, any>

  constructor({ config }) {
    this.config_ = config
  }

  public get provider() {
    return (this.constructor as Function & { PROVIDER: string }).PROVIDER
  }

  public get displayName() {
    return (this.constructor as Function & { DISPLAY_NAME: string })
      .DISPLAY_NAME
  }

  static isPaymentProcessor(object): boolean {
    return object?.constructor?._isPaymentProcessor
  }
}

export function isPaymentProcessorError(
  obj: any
): obj is PaymentProcessorError {
  return obj && typeof obj === "object" && obj.error && obj.code && obj.detail
}
