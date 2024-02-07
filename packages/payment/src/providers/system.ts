import {
  PaymentProcessorContext,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus,
} from "@medusajs/types"
import { AbstractPaymentProcessor } from "@medusajs/utils"

export class SystemProviderService extends AbstractPaymentProcessor {
  static identifier = "system"

  async createPayment(_): Promise<Record<string, unknown>> {
    return {}
  }

  async getStatus(_): Promise<string> {
    return "authorized"
  }

  async getPaymentData(_): Promise<Record<string, unknown>> {
    return {}
  }

  async initiatePayment(
    context: PaymentProcessorContext
  ): Promise<PaymentProcessorSessionResponse> {
    return { session_data: {} }
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    throw new Error("Method not implemented.")
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProcessorError> {
    return {}
  }

  async authorizePayment(_): Promise<
    | PaymentProcessorError
    | {
        status: PaymentSessionStatus
        data: PaymentProcessorSessionResponse["session_data"]
      }
  > {
    return { data: {}, status: PaymentSessionStatus.AUTHORIZED }
  }

  async updatePaymentData(_): Promise<Record<string, unknown>> {
    return {}
  }

  async updatePayment(
    _
  ): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
    return {} as PaymentProcessorSessionResponse
  }

  async deletePayment(_): Promise<Record<string, unknown>> {
    return {}
  }

  async capturePayment(_): Promise<Record<string, unknown>> {
    return {}
  }

  async refundPayment(_): Promise<Record<string, unknown>> {
    return {}
  }

  async cancelPayment(_): Promise<Record<string, unknown>> {
    return {}
  }
}

export default SystemProviderService
