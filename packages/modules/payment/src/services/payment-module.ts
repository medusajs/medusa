import {
  AccountHolderDTO,
  BigNumberInput,
  CaptureDTO,
  Context,
  CreateAccountHolderDTO,
  CreateAccountHolderOutput,
  CreateCaptureDTO,
  CreatePaymentCollectionDTO,
  CreatePaymentMethodDTO,
  CreatePaymentSessionDTO,
  CreateRefundDTO,
  DAL,
  FilterablePaymentCollectionProps,
  FilterablePaymentMethodProps,
  FilterablePaymentProviderProps,
  FindConfig,
  InferEntityType,
  InitiatePaymentOutput,
  InternalModuleDeclaration,
  IPaymentModuleService,
  Logger,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  PaymentCollectionDTO,
  PaymentCollectionUpdatableFields,
  PaymentDTO,
  PaymentMethodDTO,
  PaymentProviderDTO,
  PaymentSessionDTO,
  ProviderWebhookPayload,
  RefundDTO,
  RefundReasonDTO,
  UpdateAccountHolderDTO,
  UpdateAccountHolderOutput,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
  UpdatePaymentSessionDTO,
  UpsertPaymentCollectionDTO,
  WebhookActionResult,
} from "@medusajs/framework/types"
import {
  BigNumber,
  EmitEvents,
  InjectManager,
  InjectTransactionManager,
  isPresent,
  isString,
  MathBN,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  normalizeCurrencyCode,
  PaymentCollectionStatus,
  PaymentSessionStatus,
  promiseAll,
} from "@medusajs/framework/utils"
import {
  AccountHolder,
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
  logger?: Logger
  baseRepository: DAL.RepositoryService
  paymentService: ModulesSdkTypes.IMedusaInternalService<any>
  captureService: ModulesSdkTypes.IMedusaInternalService<any>
  refundService: ModulesSdkTypes.IMedusaInternalService<any>
  paymentSessionService: ModulesSdkTypes.IMedusaInternalService<any>
  paymentCollectionService: ModulesSdkTypes.IMedusaInternalService<any>
  accountHolderService: ModulesSdkTypes.IMedusaInternalService<any>
  paymentProviderService: PaymentProviderService
}

const generateMethodForModels = {
  PaymentCollection,
  PaymentSession,
  Payment,
  Capture,
  Refund,
  RefundReason,
  AccountHolder,
}

export default class PaymentModuleService
  extends ModulesSdkUtils.MedusaService<{
    PaymentCollection: { dto: PaymentCollectionDTO }
    PaymentSession: { dto: PaymentSessionDTO }
    Payment: { dto: PaymentDTO }
    Capture: { dto: CaptureDTO }
    Refund: { dto: RefundDTO }
    RefundReason: { dto: RefundReasonDTO }
    AccountHolder: { dto: AccountHolderDTO }
  }>(generateMethodForModels)
  implements IPaymentModuleService
{
  protected baseRepository_: DAL.RepositoryService

  protected paymentService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Payment
  >
  protected captureService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Capture
  >
  protected refundService_: ModulesSdkTypes.IMedusaInternalService<
    typeof Refund
  >
  protected paymentSessionService_: ModulesSdkTypes.IMedusaInternalService<
    typeof PaymentSession
  >
  protected paymentCollectionService_: ModulesSdkTypes.IMedusaInternalService<
    typeof PaymentCollection
  >
  protected paymentProviderService_: PaymentProviderService
  protected accountHolderService_: ModulesSdkTypes.IMedusaInternalService<
    typeof AccountHolder
  >

  constructor(
    {
      baseRepository,
      paymentService,
      captureService,
      refundService,
      paymentSessionService,
      paymentProviderService,
      paymentCollectionService,
      accountHolderService,
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
    this.accountHolderService_ = accountHolderService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  protected roundToCurrencyPrecision(
    amount: BigNumberInput,
    currencyCode: string
  ): BigNumberInput {
    let precision: number | undefined = undefined
    try {
      const formatted = Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
      }).format(0.1111111)

      precision = formatted.split(".")[1].length
    } catch {
      // Unknown currency, keep the full precision
    }

    return MathBN.convert(amount, precision)
  }

  // @ts-expect-error
  createPaymentCollections(
    data: CreatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  // @ts-expect-error
  createPaymentCollections(
    data: CreatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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
      Array.isArray(data) ? collections : collections[0]
    )
  }

  @InjectTransactionManager()
  async createPaymentCollections_(
    data: CreatePaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<InferEntityType<typeof PaymentCollection>[]> {
    const normalizedData = data.map((d) => ({
      ...d,
      currency_code: d.currency_code
        ? normalizeCurrencyCode(d.currency_code)
        : d.currency_code,
    }))
    return await this.paymentCollectionService_.create(
      normalizedData,
      sharedContext
    )
  }

  // @ts-expect-error
  updatePaymentCollections(
    paymentCollectionId: string,
    data: PaymentCollectionUpdatableFields,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>
  // @ts-expect-error
  updatePaymentCollections(
    selector: FilterablePaymentCollectionProps,
    data: PaymentCollectionUpdatableFields,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  @InjectManager()
  @EmitEvents()
  // @ts-expect-error
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
          currency_code: normalizeCurrencyCode(data.currency_code ?? ""),
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
        currency_code: normalizeCurrencyCode(data.currency_code ?? ""),
      }))
    }

    const result = await this.updatePaymentCollections_(
      updateData,
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentCollectionDTO[]>(
      Array.isArray(data) ? result : result[0]
    )
  }

  @InjectTransactionManager()
  async updatePaymentCollections_(
    data: UpdatePaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<InferEntityType<typeof PaymentCollection>[]> {
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

  @InjectManager()
  @EmitEvents()
  async upsertPaymentCollections(
    data: UpsertPaymentCollectionDTO | UpsertPaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO | PaymentCollectionDTO[]> {
    const result = await this.upsertPaymentCollections_(data, sharedContext)

    return await this.baseRepository_.serialize<
      PaymentCollectionDTO[] | PaymentCollectionDTO
    >(Array.isArray(data) ? result : result[0])
  }

  @InjectTransactionManager()
  protected async upsertPaymentCollections_(
    data: UpsertPaymentCollectionDTO | UpsertPaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<InferEntityType<typeof PaymentCollection>[]> {
    const input = Array.isArray(data) ? data : [data]
    const forUpdate = input
      .filter(
        (collection): collection is UpdatePaymentCollectionDTO =>
          !!collection.id
      )
      .map((element) => ({
        ...element,
        currency_code: normalizeCurrencyCode(element.currency_code ?? ""),
      }))
    const forCreate = input
      .filter(
        (collection): collection is CreatePaymentCollectionDTO => !collection.id
      )
      .map((element) => ({
        ...element,
        currency_code: normalizeCurrencyCode(element.currency_code ?? ""),
      }))

    const operations: Promise<InferEntityType<typeof PaymentCollection>[]>[] =
      []

    if (forCreate.length) {
      operations.push(this.createPaymentCollections_(forCreate, sharedContext))
    }
    if (forUpdate.length) {
      operations.push(this.updatePaymentCollections_(forUpdate, sharedContext))
    }

    const result = (await promiseAll(operations)).flat()

    return result
  }

  completePaymentCollections(
    paymentCollectionId: string,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>
  completePaymentCollections(
    paymentCollectionId: string[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>

  // Should we remove this and use `updatePaymentCollections` instead?
  @InjectManager()
  @EmitEvents()
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
      Array.isArray(paymentCollectionId) ? updated : updated[0]
    )
  }

  @InjectManager()
  @EmitEvents()
  async createPaymentSession(
    paymentCollectionId: string,
    input: CreatePaymentSessionDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSessionDTO> {
    let paymentSession: InferEntityType<typeof PaymentSession> | undefined
    let providerPaymentSession: InitiatePaymentOutput | undefined

    try {
      paymentSession = await this.createPaymentSession_(
        paymentCollectionId,
        input,
        sharedContext
      )

      providerPaymentSession = await this.paymentProviderService_.createSession(
        input.provider_id,
        {
          context: {
            idempotency_key: paymentSession!.id,
            ...input.context,
          },
          data: { ...input.data, session_id: paymentSession!.id },
          amount: input.amount,
          currency_code: normalizeCurrencyCode(input.currency_code ?? ""),
        }
      )

      paymentSession = await this.paymentSessionService_.update(
        {
          id: paymentSession!.id,
          data: { ...input.data, ...providerPaymentSession.data },
          status: providerPaymentSession.status ?? PaymentSessionStatus.PENDING,
        },
        sharedContext
      )
    } catch (error) {
      if (providerPaymentSession) {
        await this.paymentProviderService_.deleteSession(input.provider_id, {
          data: input.data,
        })
      }

      if (paymentSession) {
        await this.paymentSessionService_.delete(
          paymentSession.id,
          sharedContext
        )
      }

      throw error
    }

    return await this.baseRepository_.serialize(paymentSession)
  }

  @InjectTransactionManager()
  async createPaymentSession_(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<InferEntityType<typeof PaymentSession>> {
    const paymentSession = await this.paymentSessionService_.create(
      {
        payment_collection_id: paymentCollectionId,
        provider_id: data.provider_id,
        amount: data.amount,
        currency_code: normalizeCurrencyCode(data.currency_code ?? ""),
        context: data.context,
        data: data.data,
        metadata: data.metadata,
      },
      sharedContext
    )

    return paymentSession
  }

  @InjectManager()
  @EmitEvents()
  async updatePaymentSession(
    data: UpdatePaymentSessionDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSessionDTO> {
    const session = await this.paymentSessionService_.retrieve(
      data.id,
      { select: ["id", "status", "data", "provider_id"] },
      sharedContext
    )

    const providerData = await this.paymentProviderService_.updateSession(
      session.provider_id,
      {
        data: data.data,
        amount: data.amount,
        currency_code: normalizeCurrencyCode(data.currency_code ?? ""),
        context: data.context,
      }
    )

    const updated = await this.paymentSessionService_.update(
      {
        id: session.id,
        amount: data.amount,
        currency_code: normalizeCurrencyCode(data.currency_code ?? ""),
        data: providerData.data,
        // Allow the caller to explicitly set the status (eg. due to a webhook), fallback to the update response, and finally to the existing status.
        status: data.status ?? providerData.status ?? session.status,
        metadata: data.metadata,
      },
      sharedContext
    )

    return await this.baseRepository_.serialize(updated)
  }

  @InjectManager()
  @EmitEvents()
  async deletePaymentSession(
    id: string,
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    const session = await this.paymentSessionService_.retrieve(
      id,
      { select: ["id", "data", "provider_id"] },
      sharedContext
    )

    await this.paymentProviderService_.deleteSession(session.provider_id, {
      data: session.data,
    })

    await this.paymentSessionService_.delete(id, sharedContext)
  }

  @InjectManager()
  @EmitEvents()
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
          "authorized_at",
          "payment_collection_id",
        ],
        relations: ["payment", "payment_collection"],
      },
      sharedContext
    )

    // this method needs to be idempotent
    if (session.payment && session.authorized_at) {
      return await this.baseRepository_.serialize(session.payment)
    }

    let { data, status } = await this.paymentProviderService_.authorizePayment(
      session.provider_id,
      {
        data: session.data,
        context: { idempotency_key: session.id, ...context },
      }
    )

    if (
      status !== PaymentSessionStatus.AUTHORIZED &&
      status !== PaymentSessionStatus.CAPTURED
    ) {
      await this.paymentSessionService_.update(
        {
          id: session.id,
          status,
          data,
        },
        sharedContext
      )
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Session: ${session.id} was not authorized with the provider.`
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
      await this.paymentProviderService_.cancelPayment(session.provider_id, {
        data,
        context: {
          idempotency_key: payment?.id,
          ...context,
        },
      })

      throw error
    }

    await this.maybeUpdatePaymentCollection_(
      session.payment_collection_id,
      sharedContext
    )

    return await this.baseRepository_.serialize(payment)
  }

  @InjectTransactionManager()
  protected async authorizePaymentSession_(
    session: InferEntityType<typeof PaymentSession>,
    data: Record<string, unknown> | undefined,
    status: PaymentSessionStatus,
    @MedusaContext() sharedContext?: Context
  ): Promise<InferEntityType<typeof Payment>> {
    let isCaptured = false
    if (status === PaymentSessionStatus.CAPTURED) {
      status = PaymentSessionStatus.AUTHORIZED
      isCaptured = true
    }

    await this.paymentSessionService_.update(
      {
        id: session.id,
        data,
        status,
        ...(session.authorized_at === null
          ? {
              authorized_at: new Date(),
            }
          : {}),
      },
      sharedContext
    )

    const payment = await this.paymentService_.create(
      {
        amount: session.amount,
        currency_code: normalizeCurrencyCode(session.currency_code ?? ""),
        payment_session: session.id,
        payment_collection_id: session.payment_collection_id,
        provider_id: session.provider_id,
        data,
      },
      sharedContext
    )

    if (isCaptured) {
      await this.capturePayment(
        {
          payment_id: payment.id,
          amount: session.amount as BigNumberInput,
          is_captured: isCaptured,
        },
        sharedContext
      )
    }

    return payment
  }

  @InjectManager()
  @EmitEvents()
  async updatePayment(
    data: UpdatePaymentDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    // NOTE: currently there is no update with the provider but maybe data could be updated
    const result = await this.paymentService_.update(data, sharedContext)

    return await this.baseRepository_.serialize<PaymentDTO>(result)
  }

  // TODO: This method should return a capture, not a payment
  @InjectManager()
  @EmitEvents()
  async capturePayment(
    data: CreateCaptureDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PaymentDTO> {
    let { is_captured, ...data_ } = data
    const payment = await this.paymentService_.retrieve(
      data_.payment_id,
      {
        select: [
          "id",
          "data",
          "provider_id",
          "payment_collection_id",
          "amount",
          "raw_amount",
          "currency_code",
          "captured_at",
          "canceled_at",
        ],
        relations: ["captures.raw_amount"],
      },
      sharedContext
    )

    let isCaptured = is_captured
    if (!isCaptured) {
      const isAutoCaptured = !!payment?.captured_at
      isCaptured = isAutoCaptured
    }

    const { isFullyCaptured, capture } = await this.capturePayment_(
      data_,
      payment,
      sharedContext
    )

    try {
      await this.capturePaymentFromProvider_(
        payment,
        capture,
        { isFullyCaptured, isCaptured },
        sharedContext
      )
    } catch (error) {
      if (capture?.id) {
        await super.deleteCaptures({ id: capture.id }, sharedContext)
      }
      throw error
    }

    await this.maybeUpdatePaymentCollection_(
      payment.payment_collection_id,
      sharedContext
    )

    return await this.baseRepository_.serialize(payment)
  }

  @InjectTransactionManager()
  protected async capturePayment_(
    data: CreateCaptureDTO,
    payment: InferEntityType<typeof Payment>,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<{
    isFullyCaptured: boolean
    capture?: InferEntityType<typeof Capture>
  }> {
    if (payment.canceled_at) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The payment: ${payment.id} has been canceled.`
      )
    }

    if (payment.captured_at) {
      return { isFullyCaptured: true }
    }

    // If no custom amount is passed, we assume the full amount needs to be captured
    if (!data.amount) {
      data.amount = payment.amount as number
    }

    const capturedAmount = payment.captures.reduce((captureAmount, next) => {
      return MathBN.add(captureAmount, next.raw_amount as BigNumberInput)
    }, MathBN.convert(0))

    const authorizedAmount = new BigNumber(payment.raw_amount as BigNumberInput)
    const newCaptureAmount = new BigNumber(data.amount)
    const remainingToCapture = MathBN.sub(authorizedAmount, capturedAmount)

    if (
      MathBN.gt(
        this.roundToCurrencyPrecision(newCaptureAmount, payment.currency_code),
        this.roundToCurrencyPrecision(remainingToCapture, payment.currency_code)
      )
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `You cannot capture more than the authorized amount substracted by what is already captured.`
      )
    }

    // When the entire authorized amount has been captured, we return it as complete
    const totalCaptured = MathBN.convert(
      MathBN.add(capturedAmount, newCaptureAmount)
    )
    const isFullyCaptured = MathBN.gte(
      this.roundToCurrencyPrecision(totalCaptured, payment.currency_code),
      this.roundToCurrencyPrecision(authorizedAmount, payment.currency_code)
    )

    const capture = await this.captureService_.create(
      {
        payment: data.payment_id,
        amount: data.amount,
        captured_by: data.captured_by,
      },
      sharedContext
    )

    return { isFullyCaptured, capture }
  }

  @InjectManager()
  protected async capturePaymentFromProvider_(
    payment: InferEntityType<typeof Payment>,
    capture: InferEntityType<typeof Capture> | undefined,
    options: {
      isFullyCaptured?: boolean
      isCaptured?: boolean
    } = {},
    @MedusaContext() sharedContext: Context = {}
  ) {
    if (!options.isCaptured) {
      const paymentData = await this.paymentProviderService_.capturePayment(
        payment.provider_id,
        {
          data: payment.data!,
          context: {
            idempotency_key: capture?.id,
          },
        }
      )

      await this.paymentService_.update(
        {
          id: payment.id,
          data: paymentData.data,
          captured_at: options.isFullyCaptured ? new Date() : undefined,
        },
        sharedContext
      )
    } else if (options.isFullyCaptured && !payment.captured_at) {
      /**
       * In the case of auto capture, we need to update the payment to set the captured_at date
       * only if fully captured.
       */
      await this.paymentService_.update(
        {
          id: payment.id,
          captured_at: new Date(),
        },
        sharedContext
      )
    }

    return payment
  }

  @InjectManager()
  @EmitEvents()
  async refundPayment(
    data: CreateRefundDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<PaymentDTO> {
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
    const refund = await this.refundPayment_(payment, data, sharedContext)

    try {
      await this.refundPaymentFromProvider_(payment, refund, sharedContext)
    } catch (error) {
      await super.deleteRefunds({ id: refund.id }, sharedContext)
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

  @InjectTransactionManager()
  private async refundPayment_(
    payment: InferEntityType<typeof Payment>,
    data: CreateRefundDTO,
    @MedusaContext() sharedContext: Context = {}
  ): Promise<InferEntityType<typeof Refund>> {
    if (!data.amount) {
      data.amount = payment.amount as BigNumberInput
    }

    const capturedAmount = payment.captures.reduce((captureAmount, next) => {
      const amountAsBigNumber = new BigNumber(next.raw_amount as BigNumberInput)
      return MathBN.add(captureAmount, amountAsBigNumber)
    }, MathBN.convert(0))
    const refundedAmount = payment.refunds.reduce((refundedAmount, next) => {
      return MathBN.add(refundedAmount, next.raw_amount as BigNumberInput)
    }, MathBN.convert(0))

    const totalRefundedAmount = MathBN.add(refundedAmount, data.amount)

    if (MathBN.lt(capturedAmount, totalRefundedAmount)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `You cannot refund more than what is captured on the payment.`
      )
    }

    const refund = await this.refundService_.create(
      {
        payment: data.payment_id,
        amount: data.amount,
        created_by: data.created_by,
        note: data.note,
        refund_reason_id: data.refund_reason_id,
      },
      sharedContext
    )

    return refund
  }

  @InjectManager()
  protected async refundPaymentFromProvider_(
    payment: InferEntityType<typeof Payment>,
    refund: InferEntityType<typeof Refund>,
    @MedusaContext() sharedContext: Context = {}
  ) {
    const paymentData = await this.paymentProviderService_.refundPayment(
      payment.provider_id,
      {
        data: payment.data!,
        amount: refund.raw_amount as BigNumberInput,
        context: {
          idempotency_key: refund.id,
        },
      }
    )

    await this.paymentService_.update(
      { id: payment.id, data: paymentData.data },
      sharedContext
    )

    return payment
  }

  @InjectManager()
  @EmitEvents()
  async cancelPayment(
    paymentId: string,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    const payment = await this.paymentService_.retrieve(
      paymentId,
      { select: ["id", "data", "provider_id"] },
      sharedContext
    )

    await this.paymentProviderService_.cancelPayment(payment.provider_id, {
      data: payment.data!,
      context: {
        idempotency_key: payment.id,
      },
    })

    await this.paymentService_.update(
      { id: paymentId, canceled_at: new Date() },
      sharedContext
    )

    return await this.retrievePayment(payment.id, {}, sharedContext)
  }

  @InjectManager()
  protected async maybeUpdatePaymentCollection_(
    paymentCollectionId: string,
    sharedContext?: Context
  ) {
    const paymentCollection = await this.paymentCollectionService_.retrieve(
      paymentCollectionId,
      {
        select: ["amount", "raw_amount", "status", "currency_code"],
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
    let completedAt: Date | undefined

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
      status = MathBN.gte(
        this.roundToCurrencyPrecision(
          authorizedAmount,
          paymentCollection.currency_code
        ),
        this.roundToCurrencyPrecision(
          paymentCollection.amount,
          paymentCollection.currency_code
        )
      )
        ? PaymentCollectionStatus.AUTHORIZED
        : PaymentCollectionStatus.PARTIALLY_AUTHORIZED
    }

    if (
      MathBN.gte(
        this.roundToCurrencyPrecision(
          capturedAmount,
          paymentCollection.currency_code
        ),
        this.roundToCurrencyPrecision(
          paymentCollection.amount,
          paymentCollection.currency_code
        )
      )
    ) {
      status = PaymentCollectionStatus.COMPLETED
      completedAt = new Date()
    }

    await this.paymentCollectionService_.update(
      {
        id: paymentCollectionId,
        status,
        authorized_amount: authorizedAmount,
        captured_amount: capturedAmount,
        refunded_amount: refundedAmount,
        completed_at: completedAt,
      },
      sharedContext
    )
  }

  @InjectManager()
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

  @InjectManager()
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

  @InjectManager()
  @EmitEvents()
  async createAccountHolder(
    input: CreateAccountHolderDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<AccountHolderDTO> {
    if (input.context?.account_holder) {
      return input.context.account_holder as AccountHolderDTO
    }

    let accountHolder: InferEntityType<typeof AccountHolder> | undefined
    let providerAccountHolder: CreateAccountHolderOutput | undefined

    providerAccountHolder =
      await this.paymentProviderService_.createAccountHolder(
        input.provider_id,
        {
          context: {
            idempotency_key: input.context?.customer?.id,
            ...input.context,
          },
        }
      )

    // This can be empty when either the method is not supported or an account holder wasn't created
    if (isPresent(providerAccountHolder)) {
      accountHolder = await this.accountHolderService_.create(
        {
          external_id: providerAccountHolder.id,
          email: input.context.customer?.email,
          data: providerAccountHolder.data,
          provider_id: input.provider_id,
        },
        sharedContext
      )
    }

    return await this.baseRepository_.serialize(accountHolder)
  }

  @InjectManager()
  @EmitEvents()
  async updateAccountHolder(
    input: UpdateAccountHolderDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<AccountHolderDTO> {
    if (!input.context?.account_holder) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Missing account holder data while updating account holder."
      )
    }

    let accountHolder: InferEntityType<typeof AccountHolder> | undefined
    let providerAccountHolder: UpdateAccountHolderOutput | undefined

    providerAccountHolder =
      await this.paymentProviderService_.updateAccountHolder(
        input.provider_id,
        {
          context: input.context,
        }
      )

    // The data field can be empty when either the method is not supported or an account holder wasn't updated
    // We still want to do the update as we might only be updating the metadata
    accountHolder = await this.accountHolderService_.update(
      {
        id: input.id,
        ...(providerAccountHolder?.data
          ? { data: providerAccountHolder.data }
          : {}),
        metadata: input.metadata,
      },
      sharedContext
    )

    return await this.baseRepository_.serialize(accountHolder)
  }

  @InjectManager()
  @EmitEvents()
  async deleteAccountHolder(
    id: string,
    @MedusaContext() sharedContext?: Context
  ): Promise<void> {
    const accountHolder = await this.accountHolderService_.retrieve(
      id,
      { select: ["id", "provider_id", "external_id", "email", "data"] },
      sharedContext
    )

    await this.accountHolderService_.delete(id, sharedContext)

    await this.paymentProviderService_.deleteAccountHolder(
      accountHolder.provider_id,
      {
        context: { account_holder: accountHolder },
      }
    )
  }

  @InjectManager()
  async listPaymentMethods(
    filters: FilterablePaymentMethodProps,
    config: FindConfig<PaymentMethodDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentMethodDTO[]> {
    const res = await this.paymentProviderService_.listPaymentMethods(
      filters.provider_id,
      { context: filters.context }
    )

    return res.map((item) => ({
      id: item.id,
      data: item.data!,
      provider_id: filters.provider_id,
    }))
  }

  @InjectManager()
  async listAndCountPaymentMethods(
    filters: FilterablePaymentMethodProps,
    config: FindConfig<PaymentMethodDTO> = {},
    @MedusaContext() sharedContext?: Context
  ): Promise<[PaymentMethodDTO[], number]> {
    const paymentMethods =
      await this.paymentProviderService_.listPaymentMethods(
        filters.provider_id,
        { context: filters.context }
      )

    const normalizedResponse = paymentMethods.map((item) => ({
      id: item.id,
      data: item.data!,
      provider_id: filters.provider_id,
    }))

    return [normalizedResponse, paymentMethods.length]
  }

  createPaymentMethods(
    data: CreatePaymentMethodDTO,
    sharedContext?: Context
  ): Promise<PaymentMethodDTO>

  createPaymentMethods(
    data: CreatePaymentMethodDTO[],
    sharedContext?: Context
  ): Promise<PaymentMethodDTO[]>

  @InjectManager()
  @EmitEvents()
  async createPaymentMethods(
    data: CreatePaymentMethodDTO | CreatePaymentMethodDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentMethodDTO | PaymentMethodDTO[]> {
    const input = Array.isArray(data) ? data : [data]

    const result = await promiseAll(
      input.map((item) =>
        this.paymentProviderService_.savePaymentMethod(item.provider_id, item)
      ),
      { aggregateErrors: true }
    )

    const normalizedResponse = result.map((item, i) => {
      return {
        id: item.id,
        data: item.data!,
        provider_id: input[i].provider_id,
      }
    })

    return Array.isArray(data) ? normalizedResponse : normalizedResponse[0]
  }

  @InjectManager()
  async getWebhookActionAndData(
    eventData: ProviderWebhookPayload,
    @MedusaContext() sharedContext?: Context
  ): Promise<WebhookActionResult> {
    const providerId = `pp_${eventData.provider}`

    return await this.paymentProviderService_.getWebhookActionAndData(
      providerId,
      eventData.payload
    )
  }
}
