import {
  CaptureDTO,
  Context,
  CreateCaptureDTO,
  CreatePaymentCollectionDTO,
  CreatePaymentDTO,
  CreatePaymentProviderDTO,
  CreatePaymentSessionDTO,
  CreateRefundDTO,
  DAL,
  InternalModuleDeclaration,
  IPaymentModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  PaymentCollectionDTO,
  PaymentCollectionStatus,
  PaymentDTO,
  PaymentSessionDTO,
  PaymentSessionStatus,
  RefundDTO,
  SetPaymentSessionsContextDTO,
  SetPaymentSessionsDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
  UpdatePaymentSessionDTO,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
} from "@medusajs/utils"
import {
  Capture,
  Payment,
  PaymentCollection,
  PaymentSession,
  Refund,
} from "@models"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import PaymentProviderService from "./payment-provider"
import paymentSession from "@medusajs/medusa/dist/repositories/payment-session"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  paymentService: ModulesSdkTypes.InternalModuleService<any>
  captureService: ModulesSdkTypes.InternalModuleService<any>
  refundService: ModulesSdkTypes.InternalModuleService<any>
  paymentSessionService: ModulesSdkTypes.InternalModuleService<any>
  paymentCollectionService: ModulesSdkTypes.InternalModuleService<any>
  paymentProviderService: PaymentProviderService
}

const generateMethodForModels = [PaymentCollection, PaymentSession, Payment]

export default class PaymentModuleService<
    TPaymentCollection extends PaymentCollection = PaymentCollection,
    TPayment extends Payment = Payment,
    TCapture extends Capture = Capture,
    TRefund extends Refund = Refund,
    TPaymentSession extends PaymentSession = PaymentSession
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    PaymentCollectionDTO,
    {
      PaymentCollection: { dto: PaymentCollectionDTO }
      PaymentSession: { dto: PaymentSessionDTO }
      Payment: { dto: PaymentDTO }
      Capture: { dto: CaptureDTO }
      Refund: { dto: RefundDTO }
    }
  >(PaymentCollection, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IPaymentModuleService
{
  protected baseRepository_: DAL.RepositoryService

  protected paymentService_: ModulesSdkTypes.InternalModuleService<TPayment>
  protected captureService_: ModulesSdkTypes.InternalModuleService<TCapture>
  protected refundService_: ModulesSdkTypes.InternalModuleService<TRefund>
  protected paymentSessionService_: ModulesSdkTypes.InternalModuleService<TPaymentSession>
  protected paymentCollectionService_: ModulesSdkTypes.InternalModuleService<TPaymentCollection>
  protected paymentProviderService_: PaymentProviderService

  constructor(
    {
      baseRepository,
      paymentService,
      captureService,
      refundService,
      paymentSessionService,
      paymentProviderService,
      paymentCollectionService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository

    this.refundService_ = refundService
    this.captureService_ = captureService
    this.paymentService_ = paymentService
    this.paymentSessionService_ = paymentSessionService
    this.paymentProviderService_ = paymentProviderService
    this.paymentCollectionService_ = paymentCollectionService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  __hooks = {
    onApplicationStart: async () => await this.createProvidersOnLoad(),
  }

  /**
   *
   * ********** PAYMENT COLLECTION **********
   *
   */

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

    return await this.baseRepository_.serialize<PaymentCollectionDTO[]>(
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

    // TODO: what checks should be done here? e.g. captured_amount === amount?

    const updated = await this.paymentCollectionService_.update(
      input,
      sharedContext
    )

    return await this.baseRepository_.serialize(
      Array.isArray(paymentCollectionId) ? updated : updated[0],
      { populate: true }
    )
  }

  @InjectTransactionManager("baseRepository_")
  async authorizePaymentCollection(
    paymentCollectionId: string,
    sessionIds: string[],
    context: Record<string, unknown> = {},
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

      const { data, status } =
        await this.paymentProviderService_.authorizePayment(
          {
            provider_id: paymentSession.provider_id,
            data: paymentSession.data,
          },
          context
        )

      await this.paymentSessionService_.update({
        id: paymentSession.id,
        data,
        status,
        authorized_at:
          status === PaymentSessionStatus.AUTHORIZED ? new Date() : null,
      })

      if (status === PaymentSessionStatus.AUTHORIZED) {
        authorizedAmount += paymentSession.amount

        await this.createPayment(
          {
            amount: paymentSession.amount,
            authorized_amount: paymentSession.amount,
            currency_code: paymentCollection.currency_code,
            provider_id: paymentSession.provider_id,
            payment_session_id: paymentSession.id,
            payment_collection_id: paymentCollection.id,
            data: paymentSession.data, // TODO: fetch latest data here <-
            // TODO: cart_id
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
    context: SetPaymentSessionsContextDTO,
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

    const paymentSessionsMap = new Map(
      paymentCollection.payment_sessions!.map((session) => [
        session.id,
        session,
      ])
    )

    const totalSessionsAmount = data.reduce((acc, i) => acc + i.amount, 0)

    if (totalSessionsAmount !== paymentCollection.amount) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `The sum of sessions is not equal to ${paymentCollection.amount} on Payment Collection`
      )
    }

    const currentSessionsIds: string[] = []

    for (const input of data) {
      const existingSession = input.session_id
        ? (paymentSessionsMap.get(input.session_id) as PaymentSessionDTO)
        : null

      let paymentSession: PaymentSessionDTO

      const providerContext = {
        amount: input.amount,
        currency_code: input.currency_code,
        ...context,
        paymentSessionData: {},
      }

      if (existingSession) {
        paymentSession = await this.updatePaymentSession({
          id: existingSession.id,
          providerContext,
        })
      } else {
        paymentSession = await this.createPaymentSession(paymentCollectionId, {
          provider_id: input.provider_id,
          providerContext,
        })
      }

      currentSessionsIds.push(paymentSession.id)
    }

    if (paymentCollection.payment_sessions?.length) {
      const toRemoveSessions = paymentCollection.payment_sessions.filter(
        ({ id }) => !currentSessionsIds.includes(id)
      )

      if (toRemoveSessions.length) {
        await Promise.all(
          toRemoveSessions.map((session) =>
            this.deletePaymentSession(session.id)
          )
        )
      }
    }

    return await this.retrievePaymentCollection(
      paymentCollectionId,
      {},
      sharedContext
    )
  }

  /**
   *
   * ********** PAYMENT SESSION **********
   *
   */

  @InjectTransactionManager("baseRepository_")
  async createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSessionDTO> {
    const sessionData = await this.paymentProviderService_.createSession(
      data.provider_id,
      data.providerContext
    )

    const created = await this.paymentSessionService_.create(
      {
        provider_id: data.provider_id,
        amount: data.providerContext.amount,
        currency_code: data.providerContext.currency_code,
        payment_collection: paymentCollectionId,
        data: sessionData,
      },
      sharedContext
    )

    return this.baseRepository_.serialize(created, { populate: true })
  }

  @InjectTransactionManager("baseRepository_")
  async updatePaymentSession(
    data: UpdatePaymentSessionDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSessionDTO> {
    const session = await this.retrievePaymentSession(
      data.id,
      {},
      sharedContext
    )

    const sessionData = await this.paymentProviderService_.updateSession(
      {
        id: session.id,
        data: session.data,
        provider_id: session.provider_id,
      },
      data.providerContext
    )

    const updated = await this.paymentSessionService_.update(
      {
        amount: data.providerContext.amount,
        currency_code: data.providerContext.currency_code,
        data: sessionData,
      },
      sharedContext
    )

    return await this.baseRepository_.serialize(updated, { populate: true })
  }

  @InjectTransactionManager("baseRepository_")
  async deletePaymentSession(
    id: string,
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    const session = await this.retrievePaymentSession(id, {}, sharedContext)

    await this.paymentProviderService_.deleteSession({
      provider_id: session.provider_id,
      data: session.data,
    })

    await this.paymentSessionService_.delete(id, sharedContext)
  }

  @InjectTransactionManager("baseRepository_")
  async authorizePaymentSession(
    id: string,
    context: Record<string, unknown>,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    const session = await this.retrievePaymentSession(id, {}, sharedContext)

    if (session.authorized_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Session is already authorized."
      )
    }

    const { data, status } =
      await this.paymentProviderService_.authorizePayment(
        {
          provider_id: session.provider_id,
          data: session.data,
        },
        context
      )

    await this.paymentSessionService_.update(
      {
        id: session.id,
        data,
        status,
        authorized_at:
          status === PaymentSessionStatus.AUTHORIZED ? new Date() : null,
      },
      sharedContext
    )

    if (status !== PaymentSessionStatus.AUTHORIZED) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Session not authorized with the provider."
      )
    }

    const payment = await this.paymentService_.create(
      {
        amount: session.amount,
        currency_code: session.currency_code,
        authorized_amount: session.amount,
        payment_session: session.id,
        payment_collection: session.payment_collection!.id,
        provider_id: session.provider_id,
        // customer_id: context.customer.id,
        data,
      },
      sharedContext
    )

    return this.retrievePayment(payment.id, {}, sharedContext)
  }

  /**
   *
   * ********** PAYMENT **********
   *
   */

  @InjectTransactionManager("baseRepository_")
  async createPayment(
    data: CreatePaymentDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    const session = await this.retrievePaymentSession(
      data.payment_session_id,
      {},
      sharedContext
    )

    const paymentData = await this.paymentProviderService_.createPayment({
      payment_session: session,
      amount: data.amount,
      provider_id: data.provider_id,
      currency_code: data.currency_code,
      resource_id: data.order_edit_id || data.order_id || data.cart_id,
    })

    const payment = await this.paymentService_.create(
      {
        ...data,
        payment_collection: data.payment_collection_id,
        payment_session: data.payment_session_id,
        data: paymentData,
      },
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentDTO>(payment)
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

  @InjectTransactionManager("baseRepository_")
  async capturePayment(
    data: CreateCaptureDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PaymentDTO> {
    const payment = await this.paymentService_.retrieve(
      data.payment_id,
      {},
      sharedContext
    )

    if (payment.canceled_at) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The payment: ${payment.id} has been canceled.`
      )
    }

    if (payment.captured_at) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The payment: ${payment.id} is already fully captured.`
      )
    }

    // TODO: revisit when https://github.com/medusajs/medusa/pull/6253 is merged
    // if (payment.captured_amount + input.amount > payment.authorized_amount) {
    //   throw new MedusaError(
    //     MedusaError.Types.INVALID_DATA,
    //     `Total captured amount for payment: ${payment.id} exceeds authorized amount.`
    //   )
    // }

    const paymentData = await this.paymentProviderService_.capturePayment({
      data: payment.data!,
      provider_id: payment.provider_id,
    })

    await this.captureService_.create(
      {
        payment: data.payment_id,
        amount: data.amount,
        captured_by: data.captured_by,
      },
      sharedContext
    )

    await this.updatePayment({ id: payment.id, data: paymentData })

    // TODO: revisit when https://github.com/medusajs/medusa/pull/6253 is merged
    // if (payment.captured_amount + data.amount === payment.amount) {
    //   await this.paymentService_.update(
    //     { id: payment.id, captured_at: new Date() },
    //     sharedContext
    //   )
    // }

    return await this.retrievePayment(
      payment.id,
      { relations: ["captures"] },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  async refundPayment(
    data: CreateRefundDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    const payment = await this.paymentService_.retrieve(
      data.payment_id,
      {},
      sharedContext
    )

    // TODO: revisit when https://github.com/medusajs/medusa/pull/6253 is merged
    // if (payment.captured_amount < input.amount) {
    //   throw new MedusaError(
    //     MedusaError.Types.INVALID_DATA,
    //     `Refund amount for payment: ${payment.id} cannot be greater than the amount captured on the payment.`
    //   )
    // }

    const paymentData = await this.paymentProviderService_.refundFromPayment(
      {
        data: payment.data!,
        provider_id: payment.provider_id,
      },
      data.amount
    )

    await this.refundService_.create(
      {
        payment: data.payment_id,
        amount: data.amount,
        created_by: data.created_by,
      },
      sharedContext
    )

    await this.updatePayment({ id: payment.id, data: paymentData })

    return await this.retrievePayment(
      payment.id,
      { relations: ["refunds"] },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  async cancelPayment(
    paymentId: string,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    const payment = await this.paymentService_.retrieve(
      paymentId,
      {},
      sharedContext
    )

    // TODO: revisit when totals are implemented
    //   if (payment.captured_amount !== 0) {
    //     throw new MedusaError(
    //       MedusaError.Types.INVALID_DATA,
    //       `Cannot cancel a payment: ${payment.id} that has been captured.`
    //     )
    //   }

    await this.paymentProviderService_.cancelPayment({
      data: payment.data!,
      provider_id: payment.provider_id,
    })

    await this.paymentService_.update(
      { id: paymentId, canceled_at: new Date() },
      sharedContext
    )

    return this.retrievePayment(payment.id, {}, sharedContext)
  }

  private async createProvidersOnLoad() {
    const providersToLoad = this.__container__["payment_providers"]

    const providers = await this.paymentProviderService_.list({
      // @ts-ignore TODO
      id: providersToLoad.map((p) => p.getIdentifier()),
    })

    const loadedProvidersMap = new Map(providers.map((p) => [p.id, p]))

    const providersToCreate: CreatePaymentProviderDTO[] = []

    for (const provider of providersToLoad) {
      if (loadedProvidersMap.has(provider.getIdentifier())) {
        continue
      }

      providersToCreate.push({
        id: provider.getIdentifier(),
      })
    }

    await this.paymentProviderService_.create(providersToCreate)
  }
}
