import { CreateCustomerDTO, DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Customer } from "@models"

type InjectedDependencies = {
  cartRepository: DAL.RepositoryService
}

export default class CustomerService<
  TEntity extends Customer = Customer
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  { create: CreateCustomerDTO }
>(Customer)<TEntity> {}
