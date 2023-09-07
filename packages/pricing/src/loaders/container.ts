import { ModulesSdkTypes } from "@medusajs/types"
import * as defaultRepositories from "@repositories"
import {
  BaseRepository,
  CurrencyRepository,
  MoneyAmountRepository,
  RuleTypeRepository
} from "@repositories"
import { CurrencyService, MoneyAmountService, RuleTypeService } from "@services"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { loadCustomRepositories } from "@medusajs/utils"
import { asClass } from "awilix"

export default async ({
  container,
  options,
}: LoaderOptions<
  | ModulesSdkTypes.ModuleServiceInitializeOptions
  | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
>): Promise<void> => {
  const customRepositories = (
    options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  )?.repositories

  container.register({
    currencyService: asClass(CurrencyService).singleton(),
    moneyAmountService: asClass(MoneyAmountService).singleton(),
    ruleTypeService: asClass(RuleTypeService).singleton(),
  })

  if (customRepositories) {
    loadCustomRepositories({
      defaultRepositories,
      customRepositories,
      container,
    })
  } else {
    loadDefaultRepositories({ container })
  }
}

function loadDefaultRepositories({ container }) {
  container.register({
    baseRepository: asClass(BaseRepository).singleton(),
    currencyRepository: asClass(CurrencyRepository).singleton(),
    moneyAmountRepository: asClass(MoneyAmountRepository).singleton(),
    ruleTypeRepository: asClass(RuleTypeRepository).singleton(),
  })
}
