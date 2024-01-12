import { DALUtils } from "@medusajs/utils"

import { PriceSetMoneyAmount } from "@models"
import { RepositoryTypes } from "@types"

export class PriceSetMoneyAmountRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PriceSetMoneyAmount,
  {
    create: RepositoryTypes.CreatePriceSetMoneyAmountDTO
    update: RepositoryTypes.UpdatePriceSetMoneyAmountDTO
  }
>(PriceSetMoneyAmount) {
  // @ts-ignore
  constructor(...arguments: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
