import { DALUtils } from "@medusajs/utils"
import { CustomerGroup } from "@models"
import { CreateCustomerGroupDTO, UpdateCustomerGroupDTO } from "@types"

export class CustomerGroupRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  CustomerGroup,
  {
    create: CreateCustomerGroupDTO
    update: UpdateCustomerGroupDTO
  }
>(CustomerGroup) {}
