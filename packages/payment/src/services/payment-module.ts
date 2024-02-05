import {
  CaptureDTO,
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
  ModulesSdkTypes,
  PaymentCollectionDTO,
  PaymentDTO,
  PaymentSessionDTO,
  SetPaymentSessionsDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
  MedusaError,
  InjectManager,
} from "@medusajs/utils"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import { Payment, PaymentCollection, PaymentSession } from "@models"

import PaymentService from "./payment"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  paymentService: PaymentService<any>
  paymentSessionService: ModulesSdkTypes.InternalModuleService<any>
  paymentCollectionService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [PaymentCollection, PaymentSession]

export default class PaymentModuleService<
    TPaymentCollection extends PaymentCollection = PaymentCollection,
    TPayment extends Payment = Payment
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    InjectedDependencies,
    PaymentCollectionDTO,
    {
      PaymentCollection: { dto: PaymentCollectionDTO }
      PaymentSession: { dto: PaymentSessionDTO }
    }
  >(PaymentCollection, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IPaymentModuleService
{
  protected baseRepository_: DAL.RepositoryService

  protected paymentService_: PaymentService<TPayment>
  protected paymentSessionService_: ModulesSdkTypes.InternalModuleService<any>
  protected paymentCollectionService_: ModulesSdkTypes.InternalModuleService<TPaymentCollection>

  constructor(
    {
      baseRepository,
      paymentService,
      paymentSessionService,
      paymentCollectionService,
    }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

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
  ): Promise<PaymentCollectionDTO>
  createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO[],
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO>

  @InjectTransactionManager("baseRepository_")
  async createPaymentSession(
    paymentCollectionId: string,
    data: CreatePaymentSessionDTO | CreatePaymentSessionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO> {
    let input = Array.isArray(data) ? data : [data]

    input = input.map((inputData) => ({
      payment_collection: paymentCollectionId,
      ...inputData,
    }))

    await this.paymentSessionService_.create(input, sharedContext)

    return await this.retrievePaymentCollection(
      paymentCollectionId,
      {
        relations: ["payment_sessions"],
      },
      sharedContext
    )
  }

  /**
   * TODO
   */

  authorizePaymentCollection(
    paymentCollectionId: string,
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO> {
    throw new Error("Method not implemented.")
  }
  completePaymentCollection(
    paymentCollectionId: string,
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO> {
    throw new Error("Method not implemented.")
  }

  cancelPayment(paymentId: string, sharedContext?: Context): Promise<PaymentDTO>
  cancelPayment(
    paymentId: string[],
    sharedContext?: Context
  ): Promise<PaymentDTO[]>

  cancelPayment(
    paymentId: string | string[],
    sharedContext?: Context
  ): Promise<PaymentDTO | PaymentDTO[]> {
    throw new Error("Method not implemented.")
  }

  authorizePaymentSessions(
    paymentCollectionId: string,
    sessionIds: string[],
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO> {
    throw new Error("Method not implemented.")
  }
  completePaymentSessions(
    paymentCollectionId: string,
    sessionIds: string[],
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO> {
    throw new Error("Method not implemented.")
  }
  setPaymentSessions(
    paymentCollectionId: string,
    data: SetPaymentSessionsDTO[],
    sharedContext?: Context | undefined
  ): Promise<PaymentCollectionDTO> {
    throw new Error("Method not implemented.")
  }
}
