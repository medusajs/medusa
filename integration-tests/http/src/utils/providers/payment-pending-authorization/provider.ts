import crypto from "crypto"
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import {
  AbstractPaymentProvider,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"

/**
 * A test payment provider that simulates async payment methods.
 *
 * - First `authorizePayment` call returns `pending_authorization`
 * - Subsequent calls return `authorized` if `data.payment_received` is truthy
 *   (simulating the payment arriving), otherwise stays `pending_authorization`
 */
export class PendingAuthorizationPaymentProvider extends AbstractPaymentProvider {
  static identifier = "pending-auth"

  constructor(cradle: Record<string, unknown>, config = {}) {
    // @ts-ignore - AbstractPaymentProvider has protected constructor
    super(cradle, config)
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    return { data: {}, id: crypto.randomUUID() }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    if (input.data?.payment_received) {
      return {
        data: { ...input.data, authorized: true },
        status: PaymentSessionStatus.AUTHORIZED,
      }
    }

    return {
      data: { ...input.data },
      status: PaymentSessionStatus.PENDING_AUTHORIZATION,
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    return { data: {} }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    return { data: {} }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    return { data: {} }
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    return { data: {} }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    if (input.data?.authorized) {
      return { status: PaymentSessionStatus.AUTHORIZED }
    }
    return { status: PaymentSessionStatus.PENDING_AUTHORIZATION }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    return {}
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    return { data: input.data ?? {} }
  }

  async getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const body = data.data as Record<string, unknown>

    if (!body?.action || !body?.session_id) {
      return { action: PaymentActions.NOT_SUPPORTED }
    }

    return {
      action: body.action as PaymentActions,
      data: {
        session_id: body.session_id as string,
        amount: body.amount as number,
      },
    }
  }
}

export default PendingAuthorizationPaymentProvider
