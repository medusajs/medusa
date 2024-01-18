import { DALUtils } from "@medusajs/utils"
import { ShippingMethodAdjustmentLine } from "@models"
import {
  CreateShippingMethodAdjustmentDTO,
  UpdateShippingMethodAdjustmentDTO,
} from "@types"

export class ShippingMethodAdjustmentRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  ShippingMethodAdjustmentLine,
  {
    create: CreateShippingMethodAdjustmentDTO
    update: UpdateShippingMethodAdjustmentDTO
  }
>(ShippingMethodAdjustmentLine) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
