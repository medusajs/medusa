import { DALUtils } from "@medusajs/utils"

import { PriceSetRuleType } from "@models"
import { RepositoryTypes } from "@types"

export class PriceSetRuleTypeRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PriceSetRuleType,
  {
    create: RepositoryTypes.CreatePriceSetRuleTypeDTO
    update: RepositoryTypes.UpdatePriceSetRuleTypeDTO
  }
>(PriceSetRuleType) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
