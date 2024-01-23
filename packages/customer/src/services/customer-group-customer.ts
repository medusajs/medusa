import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { CustomerGroupCustomer } from "@models"

type CreateCustomerGroupCustomerDTO = {
  customer_id: string
  customer_group_id: string
  created_by?: string
}

type InjectedDependencies = {
  customerGroupRepository: DAL.RepositoryService
}

export default class CustomerGroupCustomerService<
  TEntity extends CustomerGroupCustomer = CustomerGroupCustomer
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  { create: CreateCustomerGroupCustomerDTO }
>(CustomerGroupCustomer)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
