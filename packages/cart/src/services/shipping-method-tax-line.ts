import { DAL } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { ShippingMethodTaxLine } from "@models"
import {
  CreateShippingMethodTaxLineDTO,
  UpdateShippingMethodTaxLineDTO,
} from "@types"

type InjectedDependencies = {
  shippingMethodTaxLineRepository: DAL.RepositoryService
}

export default class ShippingMethodTaxLineService<
  TEntity extends ShippingMethodTaxLine = ShippingMethodTaxLine
> extends ModulesSdkUtils.abstractServiceFactory<
  InjectedDependencies,
  {
    create: CreateShippingMethodTaxLineDTO
    update: UpdateShippingMethodTaxLineDTO
  }
>(ShippingMethodTaxLine)<TEntity> {
  constructor(container: InjectedDependencies) {
    // @ts-ignore
    super(...arguments)
  }
}
