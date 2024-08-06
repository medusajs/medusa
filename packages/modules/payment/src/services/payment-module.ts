import {
  BigNumberInput,
  CaptureDTO,
  Context,
  CreateCaptureDTO,
  CreatePaymentCollectionDTO,
  CreatePaymentSessionDTO,
  CreateRefundDTO,
  DAL,
  FilterablePaymentCollectionProps,
  FilterablePaymentProviderProps,
  FilterablePaymentSessionProps,
  FindConfig,
  InternalModuleDeclaration,
  IPaymentModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  PaymentCollectionDTO,
  PaymentCollectionUpdatableFields,
  PaymentDTO,
  PaymentProviderDTO,
  PaymentSessionDTO,
  ProviderWebhookPayload,
  RefundDTO,
  RefundReasonDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
  UpdatePaymentSessionDTO,
  UpsertPaymentCollectionDTO,
} from "@medusajs/types"
import {
  BigNumber,
  InjectManager,
  InjectTransactionManager,
  isString,
  MathBN,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  PaymentActions,
  PaymentCollectionStatus,
  PaymentSessionStatus,
  promiseAll,
} from "@medusajs/utils"
import {
  Capture,
  Payment,
  PaymentCollection,
  PaymentSession,
  Refund,
  RefundReason,
} from "@models"
import { joinerConfig } from "../joiner-config"
import PaymentProviderService from "./payment-provider"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  paymentService: ModulesSdkTypes.IMedusaInternalService<any>
  captureService: ModulesSdkTypes.IMedusaInternalService<any>
  refundService: ModulesSdkTypes.IMedusaInternalService<any>
  paymentSessionService: ModulesSdkTypes.IMedusaInternalService<any>
  paymentCollectionService: ModulesSdkTypes.IMedusaInternalService<any>
  paymentProviderService: PaymentProviderService
}

const generateMethodForModels = {
  PaymentCollection,
  PaymentSession,
  Payment,
  Capture,
  Refund,
  RefundReason,
}

export default class PaymentModuleService
  extends ModulesSdkUtils.MedusaService<{
    PaymentCollection: { dto: PaymentCollectionDTO }
    PaymentSession: { dto: PaymentSessionDTO }
    Payment: { dto: PaymentDTO }
    Capture: { dto: CaptureDTO }
    Refund: { dto: RefundDTO }
    RefundReason: { dto: RefundReasonDTO }
  }>(generateMethodForModels)
  implements IPaymentModuleService
{
  protected baseRepository_: DAL.RepositoryService

  protected paymentService_: ModulesSdkTypes.IMedusaInternalService<Payment>
  protected captureService_: ModulesSdkTypes.IMedusaInternalService<Capture>
  protected refundService_: ModulesSdkTypes.IMedusaInternalService<Refund>
  protected paymentSessionService_: ModulesSdkTypes.IMedusaInternalService<PaymentSession>
  protected paymentCollectionService_: ModulesSdkTypes.IMedusaInternalService<PaymentCollection>
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

  // @ts-ignore
  createPaymentCollections(
    data: CreatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  createPaymentCollections(
    data: CreatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>
  @InjectManager("baseRepository_")
  async createPaymentCollections(
    data: CreatePaymentCollectionDTO | CreatePaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO | PaymentCollectionDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const collections = await this.createPaymentCollections_(
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

  @InjectTransactionManager("baseRepository_")
  async createPaymentCollections_(
    data: CreatePaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollection[]> {
    return await this.paymentCollectionService_.create(data, sharedContext)
  }

  // @ts-ignore
  updatePaymentCollections(
    paymentCollectionId: string,
    data: PaymentCollectionUpdatableFields,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>
  updatePaymentCollections(
    selector: FilterablePaymentCollectionProps,
    data: PaymentCollectionUpdatableFields,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  @InjectManager("baseRepository_")
  async updatePaymentCollections(
    idOrSelector: string | FilterablePaymentCollectionProps,
    data: PaymentCollectionUpdatableFields,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO | PaymentCollectionDTO[]> {
    let updateData: UpdatePaymentCollectionDTO[] = []

    if (isString(idOrSelector)) {
      updateData = [
        {
          id: idOrSelector,
          ...data,
        },
      ]
    } else {
      const collections = await this.paymentCollectionService_.list(
        idOrSelector,
        {},
        sharedContext
      )

      updateData = collections.map((c) => ({
        id: c.id,
        ...data,
      }))
    }

    const result = await this.updatePaymentCollections_(
      updateData,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentCollectionDTO[]>(
      Array.isArray(data) ? result : result[0],
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async updatePaymentCollections_(
    data: UpdatePaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollection[]> {
    return await this.paymentCollectionService_.update(data, sharedContext)
  }

  upsertPaymentCollections(
    data: UpsertPaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>
  upsertPaymentCollections(
    data: UpsertPaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  @InjectManager("baseRepository_")
  async upsertPaymentCollections(
    data: UpsertPaymentCollectionDTO | UpsertPaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO | PaymentCollectionDTO[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input.filter(
      (collection): collection is UpdatePaymentCollectionDTO => !!collection.id
    )
    const forCreate = input.filter(
      (collection): collection is CreatePaymentCollectionDTO => !collection.id
    )

    const operations: Promise<PaymentCollection[]>[] = []

    if (forCreate.length) {
      operations.push(this.createPaymentCollections_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.updatePaymentCollections_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()

    return await this.baseRepository_.serialize<
      PaymentCollectionDTO[] | PaymentCollectionDTO
    >(Array.isArray(data) ? result : result[0])
  }

  completePaymentCollections(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>
  completePaymentCollections(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  @InjectManager("baseRepository_")
  async completePaymentCollections(
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

  @InjectManager("baseRepository_")
  async createPaymentSession(
    paymentCollectionId: string,
    input: CreatePaymentSessionDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSessionDTO> {
    let paymentSession: PaymentSession | undefined

    try {
      paymentSession = await this.createPaymentSession_(
        paymentCollectionId,
        input,
        sharedContext
      )

      const providerSessionSession =
        await this.paymentProviderService_.createSession(input.provider_id, {
          context: { ...input.context, session_id: paymentSession.id },
          amount: input.amount,
          currency_code: input.currency_code,
        })

      paymentSession = (
        await this.paymentSessionService_.update(
          {
            id: paymentSession.id,
            data: { ...input.data, ...providerSessionSession },
          },
          sharedContext
        )
      )[0]
    } catch (error) {
      if (paymentSession) {
        // In case the session is created, but fails to be updated in Medusa,
        // we catch the error and delete the session and rethrow.
        await this.paymentProviderService_.deleteSession({
          provider_id: input.provider_id,
          data: input.data,
        })
        await this.paymentSessionService_.delete(
          paymentSession.id,
          sharedContext
        )
      }

      throw error
    }

    return await this.baseRepository_.serialize(paymentSession, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async createPaymentSession_(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSession> {
    const paymentSession = await this.paymentSessionService_.create(
      {
        payment_collection_id: paymentCollectionId,
        provider_id: data.provider_id,
        amount: data.amount,
        currency_code: data.currency_code,
        context: data.context,
        data: data.data,
      },
      sharedContext
    )

    return paymentSession
  }

  @InjectManager("baseRepository_")
  async updatePaymentSession(
    data: UpdatePaymentSessionDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSessionDTO> {
    const session = await this.paymentSessionService_.retrieve(
      data.id,
      { select: ["id", "data", "provider_id"] },
      sharedContext
    )

    const updated = await this.paymentSessionService_.update(
      {
        id: session.id,
        amount: data.amount,
        currency_code: data.currency_code,
        data: data.data,
      },
      sharedContext
    )

    return await this.baseRepository_.serialize(updated[0], { populate: true })
  }

  @InjectManager("baseRepository_")
  async deletePaymentSession(
    id: string,
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    const session = await this.paymentSessionService_.retrieve(
      id,
      { select: ["id", "data", "provider_id"] },
      sharedContext
    )

    await this.paymentProviderService_.deleteSession({
      provider_id: session.provider_id,
      data: session.data,
    })

    await this.paymentSessionService_.delete(id, sharedContext)
  }

  @InjectManager("baseRepository_")
  async authorizePaymentSession(
    id: string,
    context: Record<string, unknown>,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    const session = await this.paymentSessionService_.retrieve(
      id,
      {
        select: [
          "id",
          "data",
          "provider_id",
          "amount",
          "raw_amount",
          "currency_code",
          "payment_collection_id",
        ],
      },
      sharedContext
    )

    // this method needs to be idempotent
    if (session.authorized_at) {
      const payment = await this.paymentService_.retrieve(
        { session_id: session.id },
        { relations: ["payment_collection"] },
        sharedContext
      )
      return await this.baseRepository_.serialize(payment, { populate: true })
    }

    let { data, status } = await this.paymentProviderService_.authorizePayment(
      {
        provider_id: session.provider_id,
        data: session.data,
      },
      context
    )

    if (
      status !== PaymentSessionStatus.AUTHORIZED &&
      status !== PaymentSessionStatus.CAPTURED
    ) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Session: ${session.id} is not authorized with the provider.`
      )
    }

    let payment
    try {
      payment = await this.authorizePaymentSession_(
        session,
        data,
        status as PaymentSessionStatus,
        sharedContext
      )
    } catch (error) {
      await this.paymentProviderService_.cancelPayment({
        provider_id: session.provider_id,
        data,
      })

      throw error
    }

    await this.maybeUpdatePaymentCollection_(
      session.payment_collection_id,
      sharedContext
    )

    return await this.retrievePayment(
      payment.id,
      { relations: ["payment_collection"] },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  async authorizePaymentSession_(
    session: PaymentSession,
    data: Record<string, unknown>,
    status: PaymentSessionStatus,
    @MedusaContext() sharedContext?: Context
  ): Promise<Payment> {
    let autoCapture = false
    if (status === PaymentSessionStatus.CAPTURED) {
      status = PaymentSessionStatus.AUTHORIZED
      autoCapture = true
    }

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

    const payment = await this.paymentService_.create(
      {
        amount: session.amount,
        currency_code: session.currency_code,
        payment_session: session.id,
        payment_collection_id: session.payment_collection_id,
        provider_id: session.provider_id,
        data,
      },
      sharedContext
    )

    if (autoCapture) {
      await this.capturePayment(
        { payment_id: payment.id, amount: session.amount as BigNumberInput },
        sharedContext
      )
    }

    return payment
  }

  @InjectManager("baseRepository_")
  // @ts-expect-error
  async retrievePaymentSession(
    id: string,
    config: FindConfig<PaymentSessionDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSessionDTO> {
    const session = await this.paymentSessionService_.retrieve(
      id,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize(session)
  }

  @InjectManager("baseRepository_")
  // @ts-expect-error
  async listPaymentSessions(
    filters?: FilterablePaymentSessionProps,
    config?: FindConfig<PaymentSessionDTO>,
    sharedContext?: Context
  ): Promise<PaymentSessionDTO[]> {
    const sessions = await this.paymentSessionService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentSessionDTO[]>(sessions)
  }

  @InjectManager("baseRepository_")
  async updatePayment(
    data: UpdatePaymentDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    // NOTE: currently there is no update with the provider but maybe data could be updated
    const result = await this.paymentService_.update(data, sharedContext)

    return await this.baseRepository_.serialize<PaymentDTO>(result[0], {
      populate: true,
    })
  }

  @InjectManager("baseRepository_")
  async capturePayment(
    data: CreateCaptureDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PaymentDTO> {
    const [payment, isFullyCaptured] = await this.capturePayment_(
      data,
      sharedContext
    )

    try {
      await this.capturePaymentFromProvider_(
        payment,
        isFullyCaptured,
        sharedContext
      )
    } catch (error) {
      await super.deleteCaptures(data.payment_id, sharedContext)
      throw error
    }

    await this.maybeUpdatePaymentCollection_(
      payment.payment_collection_id,
      sharedContext
    )

    return await this.retrievePayment(
      payment.id,
      { relations: ["captures"] },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  private async capturePayment_(
    data: CreateCaptureDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<[Payment, boolean]> {
    const payment = await this.paymentService_.retrieve(
      data.payment_id,
      {
        select: [
          "id",
          "data",
          "provider_id",
          "payment_collection_id",
          "amount",
          "raw_amount",
          "canceled_at",
        ],
        relations: ["captures.raw_amount"],
      },
      sharedContext
    )

    // If no custom amount is passed, we assume the full amount needs to be captured
    if (!data.amount) {
      data.amount = payment.amount as number
    }

    if (payment.canceled_at) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The payment: ${payment.id} has been canceled.`
      )
    }

    if (payment.captured_at) {
      return [
        (await this.retrievePayment(
          data.payment_id,
          { relations: ["captures"] },
          sharedContext
        )) as unknown as Payment,
        true,
      ]
    }

    const capturedAmount = payment.captures.reduce((captureAmount, next) => {
      return MathBN.add(captureAmount, next.raw_amount)
    }, MathBN.convert(0))

    const authorizedAmount = new BigNumber(payment.raw_amount)
    const newCaptureAmount = new BigNumber(data.amount)
    const remainingToCapture = MathBN.sub(authorizedAmount, capturedAmount)

    if (MathBN.gt(newCaptureAmount, remainingToCapture)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `You cannot capture more than the authorized amount substracted by what is already captured.`
      )
    }

    // When the entire authorized amount has been captured, we return it as complete
    const totalCaptured = MathBN.convert(
      MathBN.add(capturedAmount, newCaptureAmount)
    )
    const isFullyCaptured = MathBN.gte(totalCaptured, authorizedAmount)

    await this.captureService_.create(
      {
        payment: data.payment_id,
        amount: data.amount,
        captured_by: data.captured_by,
      },
      sharedContext
    )

    return [payment, isFullyCaptured]
  }
  @InjectManager("baseRepository_")
  private async capturePaymentFromProvider_(
    payment: Payment,
    isFullyCaptured: boolean,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const paymentData = await this.paymentProviderService_.capturePayment({
      data: payment.data!,
      provider_id: payment.provider_id,
    })

    await this.paymentService_.update(
      {
        id: payment.id,
        data: paymentData,
        captured_at: isFullyCaptured ? new Date() : undefined,
      },
      sharedContext
    )

    return payment
  }

  @InjectManager("baseRepository_")
  async refundPayment(
    data: CreateRefundDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PaymentDTO> {
    const payment = await this.refundPayment_(data, sharedContext)

    try {
      await this.refundPaymentFromProvider_(payment, sharedContext)
    } catch (error) {
      await super.deleteRefunds(data.payment_id, sharedContext)
      throw error
    }

    await this.maybeUpdatePaymentCollection_(
      payment.payment_collection_id,
      sharedContext
    )

    return await this.retrievePayment(
      payment.id,
      { relations: ["refunds"] },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
  private async refundPayment_(
    data: CreateRefundDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<Payment> {
    const payment = await this.paymentService_.retrieve(
      data.payment_id,
      {
        select: [
          "id",
          "data",
          "provider_id",
          "payment_collection_id",
          "amount",
          "raw_amount",
        ],
        relations: ["captures.raw_amount", "refunds.raw_amount"],
      },
      sharedContext
    )

    if (!data.amount) {
      data.amount = payment.amount as BigNumberInput
    }

    const capturedAmount = payment.captures.reduce((captureAmount, next) => {
      const amountAsBigNumber = new BigNumber(next.raw_amount)
      return MathBN.add(captureAmount, amountAsBigNumber)
    }, MathBN.convert(0))
    const refundedAmount = payment.refunds.reduce((refundedAmount, next) => {
      return MathBN.add(refundedAmount, next.raw_amount)
    }, MathBN.convert(0))

    const totalRefundedAmount = MathBN.add(
      refundedAmount,
      data.amount
    )

    if (MathBN.lt(capturedAmount, totalRefundedAmount)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `You cannot refund more than what is captured on the payment.`
      )
    }

    await this.refundService_.create(
      {
        payment: data.payment_id,
        amount: data.amount,
        created_by: data.created_by,
        note: data.note,
        refund_reason_id: data.refund_reason_id,
      },
      sharedContext
    )

    return payment
  }

  @InjectManager("baseRepository_")
  private async refundPaymentFromProvider_(
    payment: Payment,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const paymentData = await this.paymentProviderService_.refundPayment(
      {
        data: payment.data!,
        provider_id: payment.provider_id,
      },
      payment.raw_amount
    )

    await this.paymentService_.update(
      { id: payment.id, data: paymentData },
      sharedContext
    )

    return payment
  }

  @InjectManager("baseRepository_")
  async cancelPayment(
    paymentId: string,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    const payment = await this.paymentService_.retrieve(
      paymentId,
      { select: ["id", "data", "provider_id"] },
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

    return await this.retrievePayment(payment.id, {}, sharedContext)
  }

  @InjectManager("baseRepository_")
  async processEvent(
    eventData: ProviderWebhookPayload,
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    const providerId = `pp_${eventData.provider}`

    const event = await this.paymentProviderService_.getWebhookActionAndData(
      providerId,
      eventData.payload
    )

    if (event.action === PaymentActions.NOT_SUPPORTED) {
      return
    }

    switch (event.action) {
      case PaymentActions.SUCCESSFUL: {
        const [payment] = await this.listPayments(
          {
            payment_session_id: event.data.session_id,
          },
          {},
          sharedContext
        )
        if (payment && !payment.captured_at) {
          await this.capturePayment(
            { payment_id: payment.id, amount: event.data.amount },
            sharedContext
          )
        }
        break
      }
      case PaymentActions.AUTHORIZED:
        await this.authorizePaymentSession(
          event.data.session_id,
          {},
          sharedContext
        )
    }
  }

  @InjectManager("baseRepository_")
  async listPaymentProviders(
    filters: FilterablePaymentProviderProps = {},
    config: FindConfig<PaymentProviderDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentProviderDTO[]> {
    const providers = await this.paymentProviderService_.list(
      filters,
      config,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentProviderDTO[]>(
      providers,
      {
        populate: true,
      }
    )
  }

  @InjectManager("baseRepository_")
  async listAndCountPaymentProviders(
    filters: FilterablePaymentProviderProps = {},
    config: FindConfig<PaymentProviderDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<[PaymentProviderDTO[], number]> {
    const [providers, count] = await this.paymentProviderService_.listAndCount(
      filters,
      config,
      sharedContext
    )

    return [
      await this.baseRepository_.serialize<PaymentProviderDTO[]>(providers, {
        populate: true,
      }),
      count,
    ]
  }

  @InjectManager("baseRepository_")
  private async maybeUpdatePaymentCollection_(
    paymentCollectionId: string,
    sharedContext?: Context
  ) {
    const paymentCollection = await this.paymentCollectionService_.retrieve(
      paymentCollectionId,
      {
        select: ["amount", "raw_amount", "status"],
        relations: [
          "payment_sessions.amount",
          "payment_sessions.raw_amount",
          "payments.captures.amount",
          "payments.captures.raw_amount",
          "payments.refunds.amount",
          "payments.refunds.raw_amount",
        ],
      },
      sharedContext
    )

    const paymentSessions = paymentCollection.payment_sessions
    const captures = paymentCollection.payments
      .map((pay) => [...pay.captures])
      .flat()
    const refunds = paymentCollection.payments
      .map((pay) => [...pay.refunds])
      .flat()

    let authorizedAmount = MathBN.convert(0)
    let capturedAmount = MathBN.convert(0)
    let refundedAmount = MathBN.convert(0)

    for (const ps of paymentSessions) {
      if (ps.status === PaymentSessionStatus.AUTHORIZED) {
        authorizedAmount = MathBN.add(authorizedAmount, ps.amount)
      }
    }

    for (const capture of captures) {
      capturedAmount = MathBN.add(capturedAmount, capture.amount)
    }

    for (const refund of refunds) {
      refundedAmount = MathBN.add(refundedAmount, refund.amount)
    }

    let status =
      paymentSessions.length === 0
        ? PaymentCollectionStatus.NOT_PAID
        : PaymentCollectionStatus.AWAITING

    if (MathBN.gt(authorizedAmount, 0)) {
      status = MathBN.gte(authorizedAmount, paymentCollection.amount)
        ? PaymentCollectionStatus.AUTHORIZED
        : PaymentCollectionStatus.PARTIALLY_AUTHORIZED
    }

    await this.paymentCollectionService_.update(
      {
        id: paymentCollectionId,
        status,
        authorized_amount: authorizedAmount,
        captured_amount: capturedAmount,
        refunded_amount: refundedAmount,
      },
      sharedContext
    )
  }
}
