import { PaymentCollection } from "@models"
import {
  CreatePaymentCollectionDTO,
  DAL,
  UpdatePaymentCollectionDTO,
} from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  paymentCollectionRepository: DAL.RepositoryService
}

export default class PaymentCollectionService<
  TEntity extends PaymentCollection = PaymentCollection
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreatePaymentCollectionDTO
    update: UpdatePaymentCollectionDTO
  }
>(PaymentCollection)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
