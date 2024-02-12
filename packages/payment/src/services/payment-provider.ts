import { EOL } from "os"
import { isDefined, MedusaError } from "medusa-core-utils"
import {
  Context,
  CreatePaymentInput,
  CreatePaymentProviderDTO,
  DAL,
  InternalModuleDeclaration,
  IPaymentProvider,
  PaymentProviderAuthorizeResponse,
  PaymentProviderContext,
  PaymentProviderError,
  PaymentProviderSessionResponse,
  PaymentSessionStatus,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  isPaymentProviderError,
  MedusaContext,
} from "@medusajs/utils"

import { PaymentProvider } from "@models"

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
    provider_id: string,
    sessionInput: PaymentProviderContext
  ): Promise<PaymentProviderSessionResponse["session_data"]> {
    const provider = this.retrieveProvider(provider_id)

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

    return (paymentResponse as PaymentProviderSessionResponse).session_data
  }

  async updateSession(
    paymentSession: {
      id: string
      data: Record<string, unknown>
      provider_id: string
    },
    sessionInput: PaymentProviderContext
  ): Promise<Record<string, unknown> | undefined> {
    const provider = this.retrieveProvider(paymentSession.provider_id)

    const paymentResponse = await provider.updatePayment(sessionInput)

    if (isPaymentProviderError(paymentResponse)) {
      this.throwPaymentProviderError(paymentResponse)
    }

    return (paymentResponse as PaymentProviderSessionResponse)?.session_data
  }

  async deleteSession(paymentSession: {
    provider_id: string
    data: Record<string, unknown>
  }): Promise<void> {
    const provider = this.retrieveProvider(paymentSession.provider_id)

    const error = await provider.deletePayment(paymentSession.data)
    if (isPaymentProviderError(error)) {
      this.throwPaymentProviderError(error)
    }
  }

  async createPayment(
    data: CreatePaymentInput
  ): Promise<Record<string, unknown>> {
    const { payment_session, provider_id } = data
    const providerId = provider_id ?? payment_session.provider_id

    const provider = this.retrieveProvider(providerId)

    /**
     * NOTE: JUST RETRIEVE
     */
    const paymentData = await provider.retrievePayment(payment_session.data)
    if (isPaymentProviderError(paymentData)) {
      this.throwPaymentProviderError(paymentData)
    }

    return paymentData as Record<string, unknown>
  }

  async authorizePayment(
    paymentSession: {
      provider_id: string
      data: Record<string, unknown>
    },
    context: Record<string, unknown>
  ): Promise<{ data: Record<string, unknown>; status: PaymentSessionStatus }> {
    const provider = this.retrieveProvider(paymentSession.provider_id)

    const res = await provider.authorizePayment(paymentSession.data, context)
    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    const { data, status } = res as PaymentProviderAuthorizeResponse
    return { data, status }
  }

  async updateSessionData(
    paymentSession: {
      id: string
      provider_id: string
      data: Record<string, unknown>
    },
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProvider(paymentSession.provider_id)

    const res = await provider.updatePaymentData(paymentSession.id, data)
    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    return (res as PaymentProviderSessionResponse).session_data
  }

  async getStatus(payment: {
    provider_id: string
    data: Record<string, unknown>
  }): Promise<PaymentSessionStatus> {
    const provider = this.retrieveProvider(payment.provider_id)
    return await provider.getPaymentStatus(payment.data)
  }

  async capturePayment(paymentObj: {
    provider_id: string
    data: Record<string, unknown>
  }): Promise<Record<string, unknown>> {
    const provider = this.retrieveProvider(paymentObj.provider_id)

    const res = await provider.capturePayment(paymentObj.data)
    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    return res as Record<string, unknown>
  }

  async cancelPayment(payment: {
    data: Record<string, unknown>
    provider_id: string
  }): Promise<void> {
    const provider = this.retrieveProvider(payment.provider_id)

    const error = await provider.cancelPayment(payment.data)
    if (isPaymentProviderError(error)) {
      this.throwPaymentProviderError(error)
    }
  }

  async refundPayment(
    payment: { data: Record<string, unknown>; provider_id: string },
    amount: number
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProvider(payment.provider_id)

    const res = await provider.refundPayment(payment.data, amount)
    if (isPaymentProviderError(res)) {
      this.throwPaymentProviderError(res)
    }

    return res as Record<string, unknown>
  }

  private throwPaymentProviderError(errObj: PaymentProviderError) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `${errObj.error}${errObj.detail ? `:${EOL}${errObj.detail}` : ""}`,
      errObj.code
    )
  }
}
