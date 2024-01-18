import {
  CreateShippingMethodAdjustmentDTO,
  DAL,
  UpdateShippingMethodAdjustmentDTO,
} from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { ShippingMethodAdjustmentLine } from "@models"

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
>(ShippingMethodAdjustmentLine)<TEntity> {}
