import { DALUtils } from "@medusajs/utils"

import { PriceSet } from "@models"

export class PriceSetRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  PriceSet
) {}
