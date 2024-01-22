import { CustomerTypes, DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Customer } from "@models"

type InjectedDependencies = {
  customerRepository: DAL.RepositoryService
}

export default class CustomerService<
  TEntity extends Customer = Customer
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CustomerTypes.CreateCustomerDTO
    update: CustomerTypes.UpdateCustomerDTO
  }
>(Customer)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
