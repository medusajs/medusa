import {
  CaptureDTO,
  Context,
  CreateCaptureDTO,
  CreatePaymentCollectionDTO,
  CreatePaymentProviderDTO,
  CreatePaymentSessionDTO,
  CreateRefundDTO,
  DAL,
  InternalModuleDeclaration,
  IPaymentModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  PaymentCollectionDTO,
  PaymentDTO,
  PaymentSessionDTO,
  PaymentSessionStatus,
  ProviderWebhookPayload,
  RefundDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
  UpdatePaymentSessionDTO,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  MedusaError,
  ModulesSdkUtils,
  PaymentActions,
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

const generateMethodForModels = [PaymentCollection, Payment]

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

  @InjectTransactionManager("baseRepository_")
  async createPaymentCollections(
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

  updatePaymentCollections(
    data: UpdatePaymentCollectionDTO[],
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]>
  updatePaymentCollections(
    data: UpdatePaymentCollectionDTO,
    sharedContext?: Context
  ): Promise<PaymentCollectionDTO>

  @InjectTransactionManager("baseRepository_")
  async updatePaymentCollections(
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

  @InjectTransactionManager("baseRepository_")
  async createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentSessionDTO> {
    const created = await this.paymentSessionService_.create(
      {
        provider_id: data.provider_id,
        amount: data.providerContext.amount,
        currency_code: data.providerContext.currency_code,
        payment_collection: paymentCollectionId,
      },
      sharedContext
    )

    try {
      const sessionData = await this.paymentProviderService_.createSession(
        data.provider_id,
        {
          ...data.providerContext,
          resource_id: created.id,
        }
      )

      await this.paymentSessionService_.update(
        {
          id: created.id,
          data: sessionData,
        },
        sharedContext
      )

      return await this.baseRepository_.serialize(created, { populate: true })
    } catch (e) {
      await this.paymentSessionService_.delete([created.id], sharedContext)
      throw e
    }
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

    const sessionData = await this.paymentProviderService_.updateSession(
      session.provider_id,
      data.providerContext
    )

    const updated = await this.paymentSessionService_.update(
      {
        id: session.id,
        amount: data.providerContext.amount,
        currency_code: data.providerContext.currency_code,
        data: sessionData,
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
        select: ["id", "data", "provider_id", "amount", "currency_code"],
        relations: ["payment_collection"],
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
        payment_collection: session.payment_collection!.id,
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
      { select: ["id", "data", "provider_id"] },
      sharedContext
    )

    if (payment.canceled_at) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The payment: ${payment.id} has been canceled.`
      )
    }

    // this method needs to be idempotent
    if (payment.captured_at) {
      return this.retrievePayment(
        data.payment_id,
        { relations: ["captures"] },
        sharedContext
      )
    }

    // TODO: revisit when https://github.com/medusajs/medusa/pull/6253 is merged
    // if (payment.captured_amount + input.amount > payment.amount) {
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

    await this.paymentService_.update(
      { id: payment.id, data: paymentData },
      sharedContext
    )

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
      { select: ["id", "data", "provider_id"] },
      sharedContext
    )

    // TODO: revisit when https://github.com/medusajs/medusa/pull/6253 is merged
    // if (payment.captured_amount < input.amount) {
    //   throw new MedusaError(
    //     MedusaError.Types.INVALID_DATA,
    //     `Refund amount for payment: ${payment.id} cannot be greater than the amount captured on the payment.`
    //   )
    // }

    const paymentData = await this.paymentProviderService_.refundPayment(
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

  async createProvidersOnLoad() {
    const providersToLoad = this.__container__["payment_providers"]

    const providers = await this.paymentProviderService_.list({
      // @ts-ignore TODO
      id: providersToLoad,
    })

    const loadedProvidersMap = new Map(providers.map((p) => [p.id, p]))

    const providersToCreate: CreatePaymentProviderDTO[] = []
    for (const id of providersToLoad) {
      if (loadedProvidersMap.has(id)) {
        continue
      }

      providersToCreate.push({ id })
    }

    await this.paymentProviderService_.create(providersToCreate)
  }
}
