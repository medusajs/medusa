import { DALUtils } from "@medusajs/utils"

import { PriceSetMoneyAmountRules } from "@models"
import { RepositoryTypes } from "@types"

export class PriceSetMoneyAmountRulesRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PriceSetMoneyAmountRules,
  {
    create: RepositoryTypes.CreatePriceSetMoneyAmountRulesDTO
    update: RepositoryTypes.UpdatePriceSetMoneyAmountRulesDTO
  }
>(PriceSetMoneyAmountRules) {}
