import { DALUtils } from "@medusajs/utils"

import { PriceSet } from "@models"
import { RepositoryTypes } from "@types"

export class PriceSetRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  PriceSet,
  {
    create: RepositoryTypes.CreatePriceSetDTO
    update: RepositoryTypes.UpdatePriceSetDTO
  }
>(PriceSet) {
  // @ts-ignore
  constructor(...arguments: any[]) {
    // @ts-ignore
    super(...arguments)
  }
}
