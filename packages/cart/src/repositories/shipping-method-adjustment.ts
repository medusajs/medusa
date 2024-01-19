import { DALUtils } from "@medusajs/utils"
import { ShippingMethodAdjustment } from "@models"
import {
    CreateShippingMethodAdjustmentDTO,
    UpdateShippingMethodAdjustmentDTO,
} from "@types"

export class ShippingMethodAdjustmentRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  ShippingMethodAdjustment,
  {
    create: CreateShippingMethodAdjustmentDTO
    update: UpdateShippingMethodAdjustmentDTO
  }
>(ShippingMethodAdjustment) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
