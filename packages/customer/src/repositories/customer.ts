import { DALUtils } from "@medusajs/utils"
import { Customer } from "@models"
import { CreateCustomerDTO, UpdateCustomerDTO } from "@medusajs/types"

export class CustomerRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Customer,
  {
    create: CreateCustomerDTO
    update: UpdateCustomerDTO
  }
>(Customer) {}
