import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { ShippingMethodAdjustment } from "@models"
import {
  CreateShippingMethodAdjustmentDTO,
  UpdateShippingMethodAdjustmentDTO,
} from "@types"

type InjectedDependencies = {
  shippingMethodAdjustmentRepository: DAL.RepositoryService
}

export default class ShippingMethodAdjustmentService<
  TEntity extends ShippingMethodAdjustment = ShippingMethodAdjustment
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateShippingMethodAdjustmentDTO
    update: UpdateShippingMethodAdjustmentDTO
  }
>(ShippingMethodAdjustment)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
