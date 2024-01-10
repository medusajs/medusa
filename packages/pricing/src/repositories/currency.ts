import { DALUtils } from "@medusajs/utils"

import { Currency } from "@models"

export class CurrencyRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  Currency,
  "code"
) {}
