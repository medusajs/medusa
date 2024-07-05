import {
  CaptureDTO,
  Context,
  CreateCaptureDTO,
  CreatePaymentCollectionDTO,
  CreatePaymentSessionDTO,
  CreateRefundDTO,
  DAL,
  FilterablePaymentCollectionProps,
  FilterablePaymentProviderProps,
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
  PaymentSessionStatus,
  ProviderWebhookPayload,
  RefundDTO,
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
  promiseAll,
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

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  paymentService: ModulesSdkTypes.InternalModuleService<any>
  captureService: ModulesSdkTypes.InternalModuleService<any>
  refundService: ModulesSdkTypes.InternalModuleService<any>
  paymentSessionService: ModulesSdkTypes.InternalModuleService<any>
  paymentCollectionService: ModulesSdkTypes.InternalModuleService<any>
  paymentProviderService: PaymentProviderService
}

const generateMethodForModels = [
  PaymentCollection,
  Payment,
  PaymentSession,
  Capture,
  Refund,
]

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
    return this.paymentCollectionService_.create(data, sharedContext)
  }

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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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
    let paymentSession: PaymentSession

    try {
      const providerSessionSession =
        await this.paymentProviderService_.createSession(input.provider_id, {
          context: input.context ?? {},
          amount: input.amount,
          currency_code: input.currency_code,
        })

      input.data = {
        ...input.data,
        ...providerSessionSession,
      }

      paymentSession = await this.createPaymentSession_(
        paymentCollectionId,
        input,
        sharedContext
      )
    } catch (error) {
      // In case the session is created at the provider, but fails to be created in Medusa,
      // we catch the error and delete the session at the provider and rethrow.
      await this.paymentProviderService_.deleteSession({
        provider_id: input.provider_id,
        data: input.data,
      })

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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
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
        `Session: ${session.id} is not authorized with the provider.`
      )
    }

    // TODO: update status on payment collection if authorized_amount === amount - depends on the BigNumber PR

    const payment = await this.paymentService_.create(
      {
        amount: session.amount,
        currency_code: session.currency_code,
        payment_session: session.id,
        payment_collection_id: session.payment_collection_id,
        provider_id: session.provider_id,
        // customer_id: context.customer.id,
        data,
      },
      sharedContext
    )

    return await this.retrievePayment(
      payment.id,
      { relations: ["payment_collection"] },
      sharedContext
    )
  }

  @InjectTransactionManager("baseRepository_")
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

  @InjectTransactionManager("baseRepository_")
  async capturePayment(
    data: CreateCaptureDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PaymentDTO> {
    const payment = await this.paymentService_.retrieve(
      data.payment_id,
      {
        select: [
          "id",
          "data",
          "provider_id",
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
      return await this.retrievePayment(
        data.payment_id,
        { relations: ["captures"] },
        sharedContext
      )
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

    await this.paymentService_.update(
      { id: payment.id, data: paymentData },
      sharedContext
    )

    // When the entire authorized amount has been captured, we mark it fully capture by setting the captured_at field
    const totalCaptured = MathBN.convert(
      MathBN.add(capturedAmount, newCaptureAmount)
    )
    if (MathBN.gte(totalCaptured, authorizedAmount)) {
      await this.paymentService_.update(
        { id: payment.id, captured_at: new Date() },
        sharedContext
      )
    }

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
      {
        select: ["id", "data", "provider_id", "amount", "raw_amount"],
        relations: ["captures.raw_amount"],
      },
      sharedContext
    )

    if (!data.amount) {
      data.amount = payment.amount as number
    }

    const capturedAmount = payment.captures.reduce((captureAmount, next) => {
      const amountAsBigNumber = new BigNumber(next.raw_amount)
      return MathBN.add(captureAmount, amountAsBigNumber)
    }, MathBN.convert(0))
    const refundAmount = new BigNumber(data.amount)

    if (MathBN.lt(capturedAmount, refundAmount)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `You cannot refund more than what is captured on the payment.`
      )
    }

    const paymentData = await this.paymentProviderService_.refundPayment(
      {
        data: payment.data!,
        provider_id: payment.provider_id,
      },
      data.amount as number
    )

    await this.refundService_.create(
      {
        payment: data.payment_id,
        amount: data.amount,
        created_by: data.created_by,
      },
      sharedContext
    )

    await this.paymentService_.update(
      { id: payment.id, data: paymentData },
      sharedContext
    )

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

  @InjectTransactionManager("baseRepository_")
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
            session_id: event.data.resource_id,
          },
          {},
          sharedContext
        )

        await this.capturePayment(
          { payment_id: payment.id, amount: event.data.amount },
          sharedContext
        )
        break
      }
      case PaymentActions.AUTHORIZED:
        await this.authorizePaymentSession(
          event.data.resource_id as string,
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
}
