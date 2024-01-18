import { DALUtils } from "@medusajs/utils"
import { Address } from "@models"
import { CreateAddressDTO, UpdateAddressDTO } from "../types"

export class AddressRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Address,
  {
    create: CreateAddressDTO
    update: UpdateAddressDTO
  }
>(Address) {}
