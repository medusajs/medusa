import {
  Context,
  CreatePaymentCollectionDTO,
  CreatePaymentDTO,
  CreatePaymentSessionDTO,
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
  createPayment(data: CreatePaymentDTO): Promise<PaymentDTO>
  createPayment(data: CreatePaymentDTO[]): Promise<PaymentDTO[]>
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

    return await this.retrievePaymentCollection(paymentCollectionId, {
      relations: ["payment_sessions"],
    })
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

  capturePayment(
    paymentId: string,
    amount: number,
    sharedContext?: Context | undefined
  ): Promise<PaymentDTO> {
    throw new Error("Method not implemented.")
  }
  refundPayment(
    paymentId: string,
    amount: number,
    sharedContext?: Context | undefined
  ): Promise<PaymentDTO> {
    throw new Error("Method not implemented.")
  }
  updatePayment(
    data: UpdatePaymentDTO,
    sharedContext?: Context | undefined
  ): Promise<PaymentDTO>
  updatePayment(
    data: UpdatePaymentDTO[],
    sharedContext?: Context | undefined
  ): Promise<PaymentDTO[]>
  updatePayment(
    data: unknown,
    sharedContext?: unknown
  ):
    | Promise<import("@medusajs/types").PaymentDTO>
    | Promise<import("@medusajs/types").PaymentDTO[]> {
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
