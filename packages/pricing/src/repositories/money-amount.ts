import { DALUtils } from "@medusajs/utils"

import { MoneyAmount } from "@models"

export class MoneyAmountRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  MoneyAmount
) {}
