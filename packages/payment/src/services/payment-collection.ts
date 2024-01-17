import { PaymentCollection } from "@models"
import { Context, DAL } from "@medusajs/types"
import {
  doNotForceTransaction,
  InjectTransactionManager,
  MedusaContext,
  shouldForceTransaction,
} from "@medusajs/utils"

type InjectedDependencies = {
  paymentCollectionRepository: DAL.RepositoryService
}

export default class PaymentCollectionService<
  T extends PaymentCollection = PaymentCollection
> {
  protected readonly paymentCollectionRepository_: DAL.RepositoryService

  constructor({ paymentCollectionRepository }: InjectedDependencies) {
    this.paymentCollectionRepository_ = paymentCollectionRepository
  }

  @InjectTransactionManager(
    shouldForceTransaction,
    "paymentCollectionRepository_"
  )
  create() {}

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
