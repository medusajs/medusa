import { DALUtils } from "@medusajs/utils"

import { Currency } from "@models"
import { RepositoryTypes } from "@types"

export class CurrencyRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  Currency,
  {
    create: RepositoryTypes.CreateCurrencyDTO
    update: RepositoryTypes.UpdateCurrencyDTO
  }
>(Currency, "code") {}
