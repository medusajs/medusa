import crypto from "crypto"

import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  CreateAccountHolderInput,
  CreateAccountHolderOutput,
  DeleteAccountHolderInput,
  DeleteAccountHolderOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrieveAccountHolderInput,
  RetrieveAccountHolderOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"
import {
  AbstractPaymentProvider,
  MedusaError,
  PaymentActions,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"

/**
 * Test payment provider used to exercise the account-holder flow in
 * createPaymentSessionsWorkflow.
 *
 * - createAccountHolder is idempotent: it returns the customer id, so repeated
 *   inits for the same customer resolve to the same (provider_id, external_id),
 *   mirroring a real provider (e.g. Stripe) whose create is keyed on the
 *   customer.
 * - initiatePayment fails on demand (when the session data carries `fail:
 *   true`), so a test can drive a workflow rollback after the account holder
 *   has been created and linked.
 */
export class AccountHolderPaymentProvider extends AbstractPaymentProvider {
  static identifier = "account-holder"

  constructor(
    cradle: Record<string, unknown>,
    config: Record<string, unknown> = {}
  ) {
    super(cradle, config)
  }

  async getStatus(_): Promise<string> {
    return "authorized"
  }

  async getPaymentData(_): Promise<Record<string, unknown>> {
    return {}
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    if ((input.data as { fail?: boolean })?.fail) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        "Simulated payment session failure"
      )
    }

    return { data: {}, id: crypto.randomUUID() }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    return { status: PaymentSessionStatus.AUTHORIZED }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    return {}
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    return { data: {}, status: PaymentSessionStatus.AUTHORIZED }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: {} }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: {} }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    return { data: {} }
  }

  async retrieveAccountHolder(
    input: RetrieveAccountHolderInput
  ): Promise<RetrieveAccountHolderOutput> {
    return { id: input.id }
  }

  async createAccountHolder(
    input: CreateAccountHolderInput
  ): Promise<CreateAccountHolderOutput> {
    return { id: input.context.customer.id }
  }

  async deleteAccountHolder(
    input: DeleteAccountHolderInput
  ): Promise<DeleteAccountHolderOutput> {
    return { data: {} }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    return { data: {} }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: {} }
  }

  async getWebhookActionAndData(
    data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    return { action: PaymentActions.NOT_SUPPORTED }
  }
}
