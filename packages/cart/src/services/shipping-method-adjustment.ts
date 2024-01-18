import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { ShippingMethodAdjustmentLine } from "@models"
import {
  CreateShippingMethodAdjustmentDTO,
  UpdateShippingMethodAdjustmentDTO,
} from "@types"

type InjectedDependencies = {
  shippingMethodAdjustmentRepository: DAL.RepositoryService
}

export default class ShippingMethodAdjustmentService<
  TEntity extends ShippingMethodAdjustmentLine = ShippingMethodAdjustmentLine
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateShippingMethodAdjustmentDTO
    update: UpdateShippingMethodAdjustmentDTO
  }
>(ShippingMethodAdjustmentLine)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
