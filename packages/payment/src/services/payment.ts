import { Payment } from "@models"
import { CreatePaymentDTO, DAL, UpdatePaymentDTO } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"

type InjectedDependencies = {
  paymentRepository: DAL.RepositoryService
}

export default class PaymentService<
  TEntity extends Payment = Payment
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreatePaymentDTO
    update: UpdatePaymentDTO
  }
>(Payment)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
