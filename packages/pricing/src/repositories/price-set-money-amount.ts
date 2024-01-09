import { DALUtils } from "@medusajs/utils"

import { PriceSetMoneyAmount } from "@models"

export class PriceSetMoneyAmountRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  PriceSetMoneyAmount
) {}
