import {
  Context,
  CreatePaymentCollectionDTO,
  DAL,
  InternalModuleDeclaration,
  IPaymentModuleService,
  ModuleJoinerConfig,
  PaymentCollectionDTO,
} from "@medusajs/types"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"

import * as services from "@services"

import { Payment } from "@models"

import { joinerConfig } from "../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  paymentCollectionService: services.PaymentCollection
}

export default class PaymentModule<TPayment extends Payment = Payment>
  implements IPaymentModuleService
{
  protected baseRepository_: DAL.RepositoryService
  protected paymentCollectionService_: services.PaymentCollection

  constructor(
    { baseRepository, paymentCollectionService }: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
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
}
