import { PaymentSession } from "@models"
import { CreatePaymentSessionDTO, DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  paymentSessionRepository: DAL.RepositoryService
}

export default class PaymentSessionService<
  TEntity extends PaymentSession = PaymentSession
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreatePaymentSessionDTO
  }
>(PaymentSession)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
