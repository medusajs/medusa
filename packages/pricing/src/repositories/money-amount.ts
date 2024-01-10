import { DALUtils } from "@medusajs/utils"

import { MoneyAmount } from "@models"
import { RepositoryTypes } from "@types"

export class MoneyAmountRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  MoneyAmount,
  {
    create: RepositoryTypes.CreateMoneyAmountDTO
    update: RepositoryTypes.UpdateMoneyAmountDTO
  }
>(MoneyAmount) {}
