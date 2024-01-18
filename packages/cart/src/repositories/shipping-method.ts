import { DALUtils } from "@medusajs/utils"
import { ShippingMethod } from "@models"
import { CreateShippingMethodDTO, UpdateShippingMethodDTO } from "@types"

export class ShippingMethodRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  ShippingMethod,
  {
    create: CreateShippingMethodDTO
    update: UpdateShippingMethodDTO
  }
>(ShippingMethod) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
