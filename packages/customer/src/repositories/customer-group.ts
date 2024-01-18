import { DALUtils } from "@medusajs/utils"
import { CustomerGroup } from "@models"
import { CreateCartDTO, UpdateCartDTO } from "@types"

export class CustomerGroupRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  CustomerGroup,
  {
    create: CreateCartDTO
    update: UpdateCartDTO
  }
>(CustomerGroup) {}
