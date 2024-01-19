import { DALUtils } from "@medusajs/utils"
import { ShippingMethodTaxLine } from "@models"
import {
  CreateShippingMethodTaxLineDTO,
  UpdateShippingMethodTaxLineDTO,
} from "@types"

export class ShippingMethodTaxLineRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  ShippingMethodTaxLine,
  {
    create: CreateShippingMethodTaxLineDTO
    update: UpdateShippingMethodTaxLineDTO
  }
>(ShippingMethodTaxLine) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
