import Stripe from "stripe"
import {
  AbstractPaymentProcessor,
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus
} from "@medusajs/medusa"
import { PaymentIntentOptions, StripeOptions } from "../types"

class StripeBase extends AbstractPaymentProcessor {
  static identifier = ""

  protected readonly paymentIntentOptions
  protected readonly options_: StripeOptions
  private stripe_: Stripe

  constructor(_, options) {
    super(_, options)

    this.options_ = options
  }

  async init(): Promise<void> {
    this.stripe_ = new Stripe(this.options_.api_key, {
      apiVersion: '2020-08-27',
    })
  }

  getPaymentIntentOptions(): PaymentIntentOptions {
    const options: PaymentIntentOptions = {}

    if (this?.paymentIntentOptions?.capture_method) {
      options.capture_method = this.paymentIntentOptions.capture_method
    }

    if (this?.paymentIntentOptions?.setup_future_usage) {
      options.setup_future_usage = this.paymentIntentOptions.setup_future_usage
    }

    if (this?.paymentIntentOptions?.payment_method_types) {
      options.payment_method_types =
        this.paymentIntentOptions.payment_method_types
    }

    return options
  }

  authorizePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | void> {
    return Promise.resolve(undefined);
  }

  cancelPayment(paymentId: string): Promise<PaymentProcessorError | void> {
    return Promise.resolve(undefined);
  }

  capturePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | void> {
    return Promise.resolve(undefined);
  }

  deletePayment(paymentId: string): Promise<PaymentProcessorError | void> {
    return Promise.resolve(undefined);
  }

  getPaymentStatus(paymentId: string): Promise<PaymentSessionStatus> {
    return Promise.resolve(undefined);
  }

  initiatePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    return Promise.resolve(undefined);
  }

  refundPayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | void> {
    return Promise.resolve(undefined);
  }

  retrievePayment(paymentId: string): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
    return Promise.resolve(undefined);
  }

  updatePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | void> {
    return Promise.resolve(undefined);
  }
}

export default StripeBase
