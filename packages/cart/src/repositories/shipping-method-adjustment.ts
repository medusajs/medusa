import {
  CreateShippingMethodAdjustmentDTO,
  UpdateShippingMethodAdjustmentDTO,
} from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { ShippingMethodAdjustmentLine } from "@models"

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
