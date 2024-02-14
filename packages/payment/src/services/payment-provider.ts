import { EOL } from "os"
import { isDefined, MedusaError } from "medusa-core-utils"
import {
  Context,
  CreatePaymentProviderDTO,
  DAL,
  InternalModuleDeclaration,
  IPaymentProvider,
  PaymentProviderAuthorizeResponse,
  PaymentProviderContext,
  PaymentProviderDataInput,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  PaymentSessionStatus,
  ProviderWebhookPayload,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  isPaymentProviderError,
  MedusaContext,
} from "@medusajs/utils"

import { PaymentProvider } from "@models"
import { WebhookActionData } from "@medusajs/types/src"

type InjectedDependencies = {
  paymentProviderRepository: DAL.RepositoryService
  [key: `pp_${string}`]: IPaymentProvider
}

export default class PaymentProviderService {
  protected readonly container_: InjectedDependencies
  protected readonly paymentProviderRepository_: DAL.RepositoryService

  constructor(
    container: InjectedDependencies,

    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.container_ = container
    this.paymentProviderRepository_ = container.paymentProviderRepository
  }

  @InjectTransactionManager("paymentProviderRepository_")
  async create(
    data: CreatePaymentProviderDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentProvider[]> {
    return await this.paymentProviderRepository_.create(data, sharedContext)
  }

  @InjectManager("paymentProviderRepository_")
  async list(
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentProvider[]> {
    return await this.paymentProviderRepository_.find(undefined, sharedContext)
  }

  retrieveProvider(providerId: string): IPaymentProvider {
    try {
      return this.container_[`pp_${providerId}`] as IPaymentProvider
    } catch (e) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a payment provider with id: ${providerId}`
      )
    }
  }

  async createSession(
    providerId: string,
    sessionInput: PaymentProviderContext
  ): Promise<PaymentProviderSessionResponse["data"]> {
    const provider = this.retrieveProvider(providerId)

    if (
      !isDefined(sessionInput.currency_code) ||
      !isDefined(sessionInput.amount)
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "`currency_code` and `amount` are required to create payment session."
      )
    }

    const paymentResponse = await provider.initiatePayment(sessionInput)

    if (isPaymentProviderError(paymentResponse)) {
      this.throwPaymentProviderError(paymentResponse)
    }

    return (paymentResponse as PaymentProviderSessionResponse).data
  }

  async updateSession(
    providerId: string,
    sessionInput: PaymentProviderContext
  ): Promise<Record<string, unknown> | undefined> {
    const provider = this.retrieveProvider(providerId)

    const paymentResponse = await provider.updatePayment(sessionInput)

    if (isPaymentProviderError(paymentResponse)) {
      this.throwPaymentProviderError(paymentResponse)
    }

    return (paymentResponse as PaymentProviderSessionResponse)?.data
  }

  async deleteSession(input: PaymentProviderDataInput): Promise<void> {
    const provider = this.retrieveProvider(input.provider_id)

    const error = await provider.deletePayment(input.data)
    if (isPaymentProviderError(error)) {
      this.throwPaymentProviderError(error)
    }
  }

  async authorizePayment(
    input: PaymentProviderDataInput,
    context: Record<string, unknown>
  ): Promise<{ data: Record<string, unknown>; status: PaymentSessionStatus }> {
    const provider = this.retrieveProvider(input.provider_id)

    const res = await provider.authorizePayment(input.data, context)
    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    const { data, status } = res as PaymentProviderAuthorizeResponse
    return { data, status }
  }

  async getStatus(
    input: PaymentProviderDataInput
  ): Promise<PaymentSessionStatus> {
    const provider = this.retrieveProvider(input.provider_id)
    return await provider.getPaymentStatus(input.data)
  }

  async capturePayment(
    input: PaymentProviderDataInput
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProvider(input.provider_id)

    const res = await provider.capturePayment(input.data)
    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    return res as Record<string, unknown>
  }

  async cancelPayment(input: PaymentProviderDataInput): Promise<void> {
    const provider = this.retrieveProvider(input.provider_id)

    const error = await provider.cancelPayment(input.data)
    if (isPaymentProviderError(error)) {
      this.throwPaymentProviderError(error)
    }
  }

  async refundPayment(
    input: PaymentProviderDataInput,
    amount: number
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProvider(input.provider_id)

    const res = await provider.refundPayment(input.data, amount)
    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    return res as Record<string, unknown>
  }

  async processEvent(
    providerId: string,
    data: ProviderWebhookPayload["data"]
  ): Promise<WebhookActionData> {
    const provider = this.retrieveProvider(providerId)

    return await provider.getWebhookAction(data)
  }

  private throwPaymentProviderError(errObj: PaymentProviderError) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `${errObj.error}${errObj.detail ? `:${EOL}${errObj.detail}` : ""}`,
      errObj.code
    )
  }
}
