import { DALUtils } from "@medusajs/utils"
import { Customer } from "@models"
import { CreateCartDTO, UpdateCartDTO } from "@types"

export class CustomerRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Customer,
  {
    create: CreateCartDTO
    update: UpdateCartDTO
  }
>(Customer) {}
