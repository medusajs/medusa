import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { CustomerGroup } from "@models"
import { CreateCustomerGroupDTO, UpdateCustomerGroupDTO } from "@medusajs/types"

type InjectedDependencies = {
  customerGroupRepository: DAL.RepositoryService
}

export default class CustomerGroupService<
  TEntity extends CustomerGroup = CustomerGroup
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateCustomerGroupDTO
    update: UpdateCustomerGroupDTO
  }
>(CustomerGroup)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
