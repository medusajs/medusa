import { PaymentCollection } from "@models"
import { Context, DAL, PaymentCollectionDTO } from "@medusajs/types"
import {
  doNotForceTransaction,
  InjectTransactionManager,
  MedusaContext,
  shouldForceTransaction,
} from "@medusajs/utils"

import { PaymentCollectionRepository } from "@repositories"

type InjectedDependencies = {
  paymentCollectionRepository: DAL.RepositoryService
}

export default class PaymentCollectionService<
  TEntity extends PaymentCollection = PaymentCollection
> {
  protected readonly paymentCollectionRepository_: DAL.RepositoryService

  constructor({ paymentCollectionRepository }: InjectedDependencies) {
    this.paymentCollectionRepository_ = paymentCollectionRepository
  }

  @InjectTransactionManager(
    shouldForceTransaction,
    "paymentCollectionRepository_"
  )
  async create(
    data: PaymentCollectionDTO[],
    @MedusaContext() sharedContext?: Context
  ): Promise<PaymentCollectionDTO[]> {
    return (await (
      this.paymentCollectionRepository_ as PaymentCollectionRepository
    ).create(data, sharedContext)) as TEntity[]
  }

  @InjectTransactionManager(
    doNotForceTransaction,
    "paymentCollectionRepository_"
  )
  async delete(
    ids: string[],
    @MedusaContext() sharedContext: Context = {}
  ): Promise<void> {
    await this.paymentCollectionRepository_.delete(ids, sharedContext)
  }
}
