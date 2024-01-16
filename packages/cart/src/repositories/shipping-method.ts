import { DALUtils } from "@medusajs/utils"
import { ShippingMethod } from "@models"
import { CreateShippingMethodDTO, UpdateShippingMethodDTO } from "@types"

export class ShippingMethodRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  ShippingMethod,
  {
    create: CreateShippingMethodDTO
    update: UpdateShippingMethodDTO
  }
>(ShippingMethod) {}
