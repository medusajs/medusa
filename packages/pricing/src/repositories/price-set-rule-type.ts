import { DALUtils } from "@medusajs/utils"

import { PriceSetRuleType } from "@models"

export class PriceSetRuleTypeRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  PriceSetRuleType
) {}
