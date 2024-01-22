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
  SetPaymentSessionsDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
} from "@medusajs/types"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "@medusajs/utils"

import * as services from "@services"

import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  paymentCollectionService: services.PaymentCollection
  paymentService: services.Payment
  paymentSessionService: services.PaymentSession
}

export default class PaymentModule implements IPaymentModuleService {
  protected baseRepository_: DAL.RepositoryService

  protected paymentService_: services.Payment
  protected paymentSessionService_: services.PaymentSession
  protected paymentCollectionService_: services.PaymentCollection

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
  ) {
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
    filters?: FilterablePaymentCollectionProps,
    config?: FindConfig<PaymentCollectionDTO>,
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
    filters?: FilterablePaymentCollectionProps,
    config?: FindConfig<PaymentCollectionDTO>,
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

  @InjectTransactionManager("baseRepository_")
  async capturePayment(
    data: CreateCaptureDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    // TODO 1. check if (payment.captured_amount + amount > payment.authorized_amount) {}

    // TODO: 2. set captured_at if fully captured?
    // TODO: 3. set PaymentCollection status

    await this.paymentService_.capture(data, sharedContext)

    const payment = await this.paymentService_.retrieve(
      data.payment_id,
      {
        relations: ["captures"],
      },
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentDTO>(payment, {
      populate: true,
    })
  }

  @InjectTransactionManager("baseRepository_")
  async refundPayment(
    data: CreateRefundDTO,
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentDTO> {
    // TODO 1. check if (payment.captured_amount - amount > 0) {}

    await this.paymentService_.refund(data, sharedContext)

    const payment = await this.paymentService_.retrieve(
      data.payment_id,
      {
        relations: ["refunds"],
      },
      sharedContext
    )

    return await this.baseRepository_.serialize<PaymentDTO>(payment, {
      populate: true,
    })
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

  cancelPayment(
    paymentId: string,
    sharedContext?: Context
  ): Promise<PaymentDTO> {
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
