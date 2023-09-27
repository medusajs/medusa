import * as defaultRepositories from "@repositories"
import * as defaultServices from "@services"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"
import { asClass } from "awilix"
import { loadCustomRepositories } from "@medusajs/utils"

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
    currencyService: asClass(defaultServices.CurrencyService).singleton(),
    moneyAmountService: asClass(defaultServices.MoneyAmountService).singleton(),
    priceSetService: asClass(defaultServices.PriceSetService).singleton(),
    ruleTypeService: asClass(defaultServices.RuleTypeService).singleton(),
    priceRuleService: asClass(defaultServices.PriceRuleService).singleton(),
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
    baseRepository: asClass(defaultRepositories.BaseRepository).singleton(),
    currencyRepository: asClass(
      defaultRepositories.CurrencyRepository
    ).singleton(),
    moneyAmountRepository: asClass(
      defaultRepositories.MoneyAmountRepository
    ).singleton(),
    priceSetRepository: asClass(
      defaultRepositories.PriceSetRepository
    ).singleton(),
    ruleTypeRepository: asClass(
      defaultRepositories.RuleTypeRepository
    ).singleton(),
    priceRuleRepository: asClass(
      defaultRepositories.PriceRuleRepository
    ).singleton(),
  })
}
