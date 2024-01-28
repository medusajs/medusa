import {
  Context,
  CreateCaptureDTO,
  CreatePaymentCollectionDTO,
  CreatePaymentDTO,
  CreatePaymentSessionDTO,
  CreateRefundDTO,
  DAL,
  FilterablePaymentCollectionProps,
  FindConfig,
  InternalModuleDeclaration,
  IPaymentModuleService,
  ModuleJoinerConfig,
  PaymentCollectionDTO,
  PaymentDTO,
  PaymentSessionDTO,
  SetPaymentSessionsDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
  UpdatePaymentSessionDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  PaymentCollectionStatus,
  PaymentSessionStatus,
} from "@medusajs/utils"

import * as services from "@services"

import { joinerConfig } from "../joiner-config"
import { Payment, PaymentSession } from "@models"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  paymentCollectionService: services.PaymentCollectionService
  paymentService: services.PaymentService
  paymentSessionService: services.PaymentSessionService
}

export default class PaymentModuleService implements IPaymentModuleService {
  protected baseRepository_: DAL.RepositoryService

  protected paymentService_: services.PaymentService
  protected paymentSessionService_: services.PaymentSessionService
  protected paymentCollectionService_: services.PaymentCollectionService

  constructor(
    {
      baseRepository,
      paymentService,
      paymentSessionService,
      paymentCollectionService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.baseRepository_ = baseRepository

    this.paymentService_ = paymentService
    this.paymentSessionService_ = paymentSessionService
    this.paymentCollectionService_ = paymentCollectionService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  createPaymentCollection(
    data: CreatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  createPaymentCollection(
    data: CreatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createPaymentCollection(
    data: CreatePaymentCollectionDTO | CreatePaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO | PaymentCollectionDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const collections = await this.paymentCollectionService_.create(
      input,
      sharedContext
    )

    return await this.baseRepository_.serialize(
      Array.isArray(data) ? collections : collections[0],
      {
        populate: true,
      }
    )
  }

  updatePaymentCollection(
    data: UpdatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>
  updatePaymentCollection(
    data: UpdatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  @InjectTransactionManager("baseRepository_")
  async updatePaymentCollection(
    data: UpdatePaymentCollectionDTO | UpdatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO | PaymentCollectionDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const result = await this.paymentCollectionService_.update(
      input,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentCollectionDTO[]>(
      Array.isArray(data) ? result : result[0],
      {
        populate: true,
      }
    )
  }

  deletePaymentCollection(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<void>
  deletePaymentCollection(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<void>

  @InjectTransactionManager("baseRepository_")
  async deletePaymentCollection(
    ids: string | string[],
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    const paymentCollectionIds = Array.isArray(ids) ? ids : [ids]
    await this.paymentCollectionService_.delete(
      paymentCollectionIds,
      sharedContext
    )
  }

  @InjectManager("baseRepository_")
  async retrievePaymentCollection(
    paymentCollectionId: string,
    config: FindConfig<PaymentCollectionDTO> = {},
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PaymentCollectionDTO> {
    const paymentCollection = await this.paymentCollectionService_.retrieve(
      paymentCollectionId,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentCollectionDTO>(
      paymentCollection,
      { populate: true }
    )
  }

  @InjectManager("baseRepository_")
  async listPaymentCollections(
    filters: FilterablePaymentCollectionProps = {},
    config: FindConfig<PaymentCollectionDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]> {
    const paymentCollections = await this.paymentCollectionService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentCollectionDTO[]>(
      paymentCollections,
      { populate: true }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountPaymentCollections(
    filters: FilterablePaymentCollectionProps = {},
    config: FindConfig<PaymentCollectionDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<[PaymentCollectionDTO[], number]> {
    const [paymentCollections, count] =
      await this.paymentCollectionService_.listAndCount(
        filters,
        config,
        sharedContext
      )

    return [
      await this.baseRepository_.serialize<PaymentCollectionDTO[]>(
        paymentCollections,
        { populate: true }
      ),
      count,
    ]
  }

  createPayment(
    data: CreatePaymentDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>
  createPayment(
    data: CreatePaymentDTO[],
    sharedContext?: Context
  ): Promise<PaymentDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createPayment(
    data: CreatePaymentDTO | CreatePaymentDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO | PaymentDTO[]> {
    let input = Array.isArray(data) ? data : [data]

    input = input.map((inputData) => ({
      payment_collection: inputData.payment_collection_id,
      payment_session: inputData.payment_session_id,
      ...inputData,
    }))

    const payments = await this.paymentService_.create(input, sharedContext)

    return await this.baseRepository_.serialize<PaymentDTO[]>(
      Array.isArray(data) ? payments : payments[0],
      {
        populate: true,
      }
    )
  }

  updatePayment(
    data: UpdatePaymentDTO,
    sharedContext?: Context | undefined
  ): Promise<PaymentDTO>
  updatePayment(
    data: UpdatePaymentDTO[],
    sharedContext?: Context | undefined
  ): Promise<PaymentDTO[]>

  @InjectTransactionManager("baseRepository_")
  async updatePayment(
    data: UpdatePaymentDTO | UpdatePaymentDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO | PaymentDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const result = await this.paymentService_.update(input, sharedContext)

    return await this.baseRepository_.serialize<PaymentDTO[]>(
      Array.isArray(data) ? result : result[0],
      {
        populate: true,
      }
    )
  }

  capturePayment(
    data: CreateCaptureDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>
  capturePayment(
    data: CreateCaptureDTO[],
    sharedContext?: Context
  ): Promise<PaymentDTO[]>

  @InjectManager("baseRepository_")
  async capturePayment(
    data: CreateCaptureDTO | CreateCaptureDTO[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PaymentDTO | PaymentDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const payments = await this.capturePaymentBulk_(input, sharedContext)

    return await this.baseRepository_.serialize(
      Array.isArray(data) ? payments : payments[0],
      { populate: true }
    )
  }

  @InjectTransactionManager("baseRepository_")
  protected async capturePaymentBulk_(
    data: CreateCaptureDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<Payment[]> {
    let payments = await this.paymentService_.list(
      { id: data.map((d) => d.payment_id) },
      {
        select: [
          "amount",
          "authorized_amount",
          "captured_amount",
          "captured_at",
        ],
        relations: ["captures"],
      },
      sharedContext
    )
    const inputMap = new Map(data.map((d) => [d.payment_id, d]))

    for (const payment of payments) {
      const input = inputMap.get(payment.id)!

      if (payment.captured_at) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "The payment is already fully captured."
        )
      }

      if (
        Number(payment.captured_amount) + input.amount >
        Number(payment.authorized_amount)
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Total captured amount for payment: ${payment.id} exceeds authorised amount.`
        )
      }
    }

    await this.paymentService_.capture(data, sharedContext)

    let fullyCapturedPaymentsId: string[] = []
    for (const payment of payments) {
      const input = inputMap.get(payment.id)!

      if (
        Number(payment.captured_amount) + input.amount ===
        Number(payment.amount)
      ) {
        fullyCapturedPaymentsId.push(payment.id)
      }
    }

    if (fullyCapturedPaymentsId.length) {
      await this.paymentService_.update(
        fullyCapturedPaymentsId.map((id) => ({ id, captured_at: new Date() })),
        sharedContext
      )
    }

    // TODO: set PaymentCollection status if fully captured

    return await this.paymentService_.list(
      { id: data.map((d) => d.payment_id) },
      // TODO: temp - will be removed
      {
        select: [
          "amount",
          "authorized_amount",
          "captured_amount",
          "captured_at",
        ],
        relations: ["captures"],
      },
      sharedContext
    )
  }

  refundPayment(
    data: CreateRefundDTO,
    sharedContext?: Context
  ): Promise<PaymentDTO>
  refundPayment(
    data: CreateRefundDTO[],
    sharedContext?: Context
  ): Promise<PaymentDTO[]>

  @InjectManager("baseRepository_")
  async refundPayment(
    data: CreateRefundDTO | CreateRefundDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO | PaymentDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const payments = await this.refundPaymentBulk_(input, sharedContext)

    return await this.baseRepository_.serialize(
      Array.isArray(data) ? payments : payments[0],
      { populate: true }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async refundPaymentBulk_(
    data: CreateRefundDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<Payment[]> {
    const payments = await this.paymentService_.list(
      { id: data.map(({ payment_id }) => payment_id) },
      // TODO: temp - will be removed
      {
        select: ["captured_amount"],
      },
      sharedContext
    )

    const inputMap = new Map(data.map((d) => [d.payment_id, d]))

    for (const payment of payments) {
      const input = inputMap.get(payment.id)!
      if (payment.captured_amount < input.amount) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Refund amount for payment: ${payment.id} cannot be greater than the amount captured on the payment.`
        )
      }
    }

    await this.paymentService_.refund(data, sharedContext)

    return await this.paymentService_.list(
      { id: data.map(({ payment_id }) => payment_id) },
      {
        select: ["amount", "refunded_amount"],
        relations: ["refunds"],
      },
      sharedContext
    )
  }

  createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO,
    sharedContext?: Context | undefined
  ): Promise<PaymentSessionDTO>
  createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO[],
    sharedContext?: Context | undefined
  ): Promise<PaymentSessionDTO[]>

  @InjectTransactionManager("baseRepository_")
  async createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO | CreatePaymentSessionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSessionDTO | PaymentSessionDTO[]> {
    let input = Array.isArray(data) ? data : [data]

    input = input.map((inputData) => ({
      payment_collection: paymentCollectionId,
      ...inputData,
    }))

    const created = await this.paymentSessionService_.create(
      input,
      sharedContext
    )

    return this.baseRepository_.serialize(
      Array.isArray(data) ? created : created[0],
      { populate: true }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async authorizePaymentCollection(
    paymentCollectionId: string,
    sessionIds: string[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO> {
    const paymentCollection = await this.retrievePaymentCollection(
      paymentCollectionId,
      { relations: ["payment_sessions", "payments"] }
    )

    if (paymentCollection.authorized_amount === paymentCollection.amount) {
      return paymentCollection
    }

    if (paymentCollection.amount < 0) {
      return await this.updatePaymentCollection(
        {
          id: paymentCollectionId,
          authorized_amount: 0,
          status: PaymentCollectionStatus.AUTHORIZED,
        },
        sharedContext
      )
    }

    if (!paymentCollection.payment_sessions?.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You cannot complete a Payment Collection without a payment session."
      )
    }

    let authorizedAmount = 0

    for (const paymentSession of paymentCollection.payment_sessions) {
      if (paymentSession.authorized_at) {
        continue
      }

      if (!sessionIds.includes(paymentSession.id)) {
        continue
      }

      // MOCK - TODO: authorize with payment provider
      paymentSession.status = PaymentSessionStatus.AUTHORIZED
      // MOCK

      if (paymentSession.status === PaymentSessionStatus.AUTHORIZED) {
        authorizedAmount += paymentSession.amount

        await this.createPayment(
          {
            amount: paymentSession.amount,
            currency_code: paymentCollection.currency_code,
            provider_id: paymentSession.provider_id,
            payment_session_id: paymentSession.id,
            payment_collection_id: paymentCollection.id,
            data: {}, // TODO: from provider
          },
          sharedContext
        )
      }
    }

    let status = paymentCollection.status

    if (authorizedAmount === 0) {
      status = PaymentCollectionStatus.AWAITING
    } else if (authorizedAmount < paymentCollection.amount) {
      status = PaymentCollectionStatus.PARTIALLY_AUTHORIZED
    } else if (authorizedAmount === paymentCollection.amount) {
      status = PaymentCollectionStatus.AUTHORIZED
    }

    await this.updatePaymentCollection(
      {
        id: paymentCollectionId,
        authorized_amount: authorizedAmount,
        status,
      },
      sharedContext
    )

    return this.retrievePaymentCollection(
      paymentCollectionId,
      {},
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  async setPaymentSessions(
    paymentCollectionId: string,
    data: SetPaymentSessionsDTO[],
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO> {
    const paymentCollection = await this.retrievePaymentCollection(
      paymentCollectionId,
      { relations: ["payment_sessions", "payment_providers"] },
      sharedContext
    )

    if (paymentCollection.status !== PaymentCollectionStatus.NOT_PAID) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot set payment sessions for a payment collection with status ${paymentCollection.status}`
      )
    }

    // TODO: we should pass payment providers upon creation

    const paymentProvidersMap = new Map(
      paymentCollection.payment_providers.map((provider) => [
        provider.id,
        provider,
      ])
    )

    const paymentSessionsMap = new Map(
      paymentCollection.payment_providers.map((session) => [
        session.id,
        session,
      ])
    )

    const totalSessionsAmount = data.reduce((acc, i) => acc + i.amount, 0)

    if (totalSessionsAmount === paymentCollection.amount) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `The sum of sessions is not equal to ${paymentCollection.amount} on Payment Collection`
      )
    }

    const currentSessionsIds: string[] = []

    for (const input of data) {
      const existingSession =
        input.session_id && paymentSessionsMap.get(input.session_id)
      let paymentSession: PaymentSessionDTO

      if (existingSession) {
        // TODO: update session with provider
        paymentSession = await this.updatePaymentSession({
          id: existingSession.id,
          authorized_at: new Date(),
        })
      } else {
        // TODO: create session with provider

        paymentSession = await this.createPaymentSession(paymentCollectionId, {
          authorized_at: new Date(),
          amount: input.amount,
          provider_id: input.provider_id,
          currency_code: paymentCollection.currency_code,
        })
      }

      currentSessionsIds.push(paymentSession.id)
    }

    if (paymentCollection.payment_sessions?.length) {
      const toRemoveSessionIds = paymentCollection.payment_sessions
        .filter(({ id }) => !currentSessionsIds.includes(id))
        .map(({ id }) => id)

      if (toRemoveSessionIds.length) {
        // TODO remove sessions with provider

        await this.deletePaymentSession(toRemoveSessionIds, sharedContext)
      }
    }

    return await this.retrievePaymentCollection(
      paymentCollectionId,
      {},
      sharedContext
    )
  }

  deletePaymentSession(ids: string[], sharedContext?: Context): Promise<void>
  deletePaymentSession(id: string, sharedContext?: Context): Promise<void>
  @InjectTransactionManager("baseRepository_")
  async deletePaymentSession(
    ids: string | string[],
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    const paymentCollectionIds = Array.isArray(ids) ? ids : [ids]
    await this.paymentSessionService_.delete(
      paymentCollectionIds,
      sharedContext
    )
  }

  updatePaymentSession(
    data: UpdatePaymentSessionDTO,
    sharedContext?: Context
  ): Promise<PaymentSessionDTO>
  updatePaymentSession(
    data: UpdatePaymentSessionDTO[],
    sharedContext?: Context
  ): Promise<PaymentSessionDTO[]>
  @InjectTransactionManager("baseRepository_")
  async updatePaymentSession(
    data: UpdatePaymentSessionDTO | UpdatePaymentSessionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSessionDTO | PaymentSessionDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const sessions = await this.paymentSessionService_.update(
      input,
      sharedContext
    )

    return await this.baseRepository_.serialize(
      Array.isArray(data) ? sessions : sessions[0],
      { populate: true }
    )
  }

  completePaymentCollection(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>
  completePaymentCollection(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  @InjectTransactionManager("baseRepository_")
  async completePaymentCollection(
    paymentCollectionId: string | string[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO | PaymentCollectionDTO[]> {
    const input = Array.isArray(paymentCollectionId)
      ? paymentCollectionId.map((id) => ({
          id,
          completed_at: new Date(),
        }))
      : [{ id: paymentCollectionId, completed_at: new Date() }]

    const updated = await this.paymentCollectionService_.update(
      input,
      sharedContext
    )

    return await this.baseRepository_.serialize(
      Array.isArray(paymentCollectionId) ? updated : updated[0],
      { populate: true }
    )
  }

  cancelPayment(paymentId: string, sharedContext?: Context): Promise<PaymentDTO>
  cancelPayment(
    paymentId: string[],
    sharedContext?: Context
  ): Promise<PaymentDTO[]>

  @InjectTransactionManager("baseRepository_")
  async cancelPayment(
    paymentId: string | string[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO | PaymentDTO[]> {
    const input = Array.isArray(paymentId) ? paymentId : [paymentId]

    // TODO: what if there are existing captures/refunds

    // TODO: cancel with the provider

    const updated = await this.paymentService_.update(
      input.map((id) => ({
        id,
        canceled_at: new Date(),
      })),
      sharedContext
    )

    return await this.baseRepository_.serialize(
      Array.isArray(paymentId) ? updated : updated[0],
      { populate: true }
    )
  }
}
