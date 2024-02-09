import {
  Context,
  CreatePaymentProviderDTO,
  DAL,
  InternalModuleDeclaration,
  IPaymentProcessor,
  IPaymentProviderService,
  PaymentProcessorAuthorizeResponse,
  PaymentProcessorError,
  PaymentProcessorSessionResponse,
  PaymentSessionStatus,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  isPaymentProcessorError,
  MedusaContext,
} from "@medusajs/utils"
import { PaymentProvider } from "@models"

import { isDefined, MedusaError } from "medusa-core-utils"
import {
  CreatePaymentInput,
  PaymentProcessorContext,
} from "@medusajs/types/src"

type InjectedDependencies = {
  paymentProviderRepository: DAL.RepositoryService
  [key: `payment_providers_${string}`]: IPaymentProcessor
}

export default class PaymentProviderService implements IPaymentProviderService {
  paymentProviderRepository_: DAL.RepositoryService
  protected readonly container_: InjectedDependencies

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

  retrieveProvider(providerId: string): IPaymentProcessor {
    try {
      return this.container_[
        `payment_provider_${providerId}`
      ] as IPaymentProcessor
    } catch (e) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a payment provider with id: ${providerId}`
      )
    }
  }

  async createSession(
    provider_id: string,
    sessionInput: PaymentProcessorContext
  ): Promise<PaymentProcessorSessionResponse["session_data"]> {
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

    if ("error" in paymentResponse) {
      this.throwFromPaymentProcessorError(paymentResponse)
    }

    return (paymentResponse as PaymentProcessorSessionResponse).session_data
  }

  async updateSession(
    paymentSession: {
      id: string
      data: Record<string, unknown>
      provider_id: string
    },
    sessionInput: PaymentProcessorContext
  ): Promise<Record<string, unknown> | undefined> {
    const provider = this.retrieveProvider(paymentSession.provider_id)

    const paymentResponse = await provider.updatePayment(sessionInput)

    if ((paymentResponse as PaymentProcessorError)?.error) {
      this.throwFromPaymentProcessorError(
        paymentResponse as PaymentProcessorError
      )
    }

    return (paymentResponse as PaymentProcessorSessionResponse)?.session_data
  }

  async deleteSession(paymentSession: {
    provider_id: string
    data: Record<string, unknown>
  }): Promise<void> {
    const provider = this.retrieveProvider(paymentSession.provider_id)

    const error = await provider.deletePayment(paymentSession.data)
    if (isPaymentProcessorError(error)) {
      this.throwFromPaymentProcessorError(error as PaymentProcessorError)
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
    if ("error" in paymentData) {
      this.throwFromPaymentProcessorError(paymentData as PaymentProcessorError)
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
    if ("error" in res) {
      this.throwFromPaymentProcessorError(res)
    }

    return {
      data: (res as PaymentProcessorAuthorizeResponse).data,
      status: (res as PaymentProcessorAuthorizeResponse).status,
    }
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
    if ("error" in res) {
      this.throwFromPaymentProcessorError(res as PaymentProcessorError)
    }

    return (res as PaymentProcessorSessionResponse).session_data
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
    if ("error" in res) {
      this.throwFromPaymentProcessorError(res as PaymentProcessorError)
    }

    return res as Record<string, unknown>
  }

  async cancelPayment(payment: {
    data: Record<string, unknown>
    provider_id: string
  }): Promise<void> {
    const provider = this.retrieveProvider(payment.provider_id)

    const error = await provider.cancelPayment(payment.data)
    if (isPaymentProcessorError(error)) {
      this.throwFromPaymentProcessorError(error as PaymentProcessorError)
    }
  }

  async refundFromPayment(
    payment: { data: Record<string, unknown>; provider_id: string },
    amount: number
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProvider(payment.provider_id)

    const res = await provider.refundPayment(payment.data, amount)
    if (isPaymentProcessorError(res)) {
      this.throwFromPaymentProcessorError(res as PaymentProcessorError)
    }

    return res as Record<string, unknown>
  }

  throwFromPaymentProcessorError(error: PaymentProcessorError) {}
}
