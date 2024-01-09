import { DALUtils } from "@medusajs/utils"

import { PriceSetMoneyAmountRules } from "@models"

export class PriceSetMoneyAmountRulesRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  PriceSetMoneyAmountRules
) {}
