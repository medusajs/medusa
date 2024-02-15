import {
  PaymentProviderContext,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  WebhookActionData,
  PaymentActions,
} from "@medusajs/types"
import { AbstractPaymentProvider } from "@medusajs/utils"

export class SystemProviderService extends AbstractPaymentProvider {
  static identifier = "system"
  static PROVIDER = "system"

  async getStatus(_): Promise<string> {
    return "authorized"
  }

  async getPaymentData(_): Promise<Record<string, unknown>> {
    return {}
  }

  async initiatePayment(
    context: PaymentProviderContext
  ): Promise<PaymentProviderSessionResponse> {
    return { data: {} }
  }

  async getPaymentStatus(
    paymentSessionData: Record<string, unknown>
  ): Promise<PaymentSessionStatus> {
    throw new Error("Method not implemented.")
  }

  async retrievePayment(
    paymentSessionData: Record<string, unknown>
  ): Promise<Record<string, unknown> | PaymentProviderError> {
    return {}
  }

  async authorizePayment(_): Promise<
    | PaymentProviderError
    | {
        status: PaymentSessionStatus
        data: PaymentProviderSessionResponse["data"]
      }
  > {
    return { data: {}, status: PaymentSessionStatus.AUTHORIZED }
  }

  async updatePayment(
    _
  ): Promise<PaymentProviderError | PaymentProviderSessionResponse> {
    return { data: {} } as PaymentProviderSessionResponse
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

  async getWebhookAction(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionData> {
    return { action: PaymentActions.AUTHORIZED, data: {} }
  }
}

export default SystemProviderService
