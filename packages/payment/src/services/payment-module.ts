import {
  Context,
  CreatePaymentCollectionDTO,
  CreatePaymentDTO,
  CreatePaymentSessionDTO,
  DAL,
  InternalModuleDeclaration,
  IPaymentModuleService,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  PaymentCollectionDTO,
  PaymentDTO,
  SetPaymentSessionsDTO,
  UpdatePaymentCollectionDTO,
  UpdatePaymentDTO,
} from "@medusajs/types"
import {
  InjectTransactionManager,
  MedusaContext,
  ModulesSdkUtils,
} from "@medusajs/utils"

import { entityNameToLinkableKeysMap, joinerConfig } from "../joiner-config"
import {
  Capture,
  Payment,
  PaymentCollection,
  PaymentMethodToken,
  PaymentProvider,
  PaymentSession,
  Refund,
} from "@models"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  paymentCollectionService: ModulesSdkTypes.InternalModuleService<any>
}

const generateMethodForModels = [
  Capture,
  PaymentCollection,
  PaymentMethodToken,
  PaymentProvider,
  PaymentSession,
  Refund,
]

export default class PaymentModuleService<
    TPaymentCollection extends PaymentCollection = PaymentCollection
  >
  extends ModulesSdkUtils.abstractModuleServiceFactory<
    // TODO revisit when moving forward frane
    InjectedDependencies,
    PaymentDTO,
    {
      Capture: { dto: any }
      PaymentCollection: { dto: any }
      PaymentMethodToken: { dto: any }
      PaymentProvider: { dto: any }
      PaymentSession: { dto: any }
      Refund: { dto: any }
    }
  >(Payment, generateMethodForModels, entityNameToLinkableKeysMap)
  implements IPaymentModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected paymentCollectionService_: ModulesSdkTypes.InternalModuleService<TPaymentCollection>

  constructor(
    { baseRepository, paymentCollectionService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    // @ts-ignore
    super(...arguments)

    this.baseRepository_ = baseRepository

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
  createPayment(data: CreatePaymentDTO): Promise<PaymentDTO>
  createPayment(data: CreatePaymentDTO[]): Promise<PaymentDTO[]>
  createPayment(data: unknown): Promise<PaymentDTO | PaymentDTO[]> {
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
  ): Promise<PaymentDTO | PaymentDTO[]> {
    throw new Error("Method not implemented.")
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
  createPaymentSession(
    paymentCollectionId: unknown,
    data: unknown,
    sharedContext?: unknown
  ): Promise<PaymentCollectionDTO> {
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
