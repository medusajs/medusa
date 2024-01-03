import * as defaultRepositories from "@repositories"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"
import { loadCustomRepositories } from "@medusajs/utils"
import * as defaultServices from "@services"
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
    promotionService: asClass(defaultServices.PromotionService).singleton(),
    promotionRuleService: asClass(
      defaultServices.PromotionRuleService
    ).singleton(),
    promotionRuleValueService: asClass(
      defaultServices.PromotionRuleValueService
    ).singleton(),
    applicationMethodService: asClass(
      defaultServices.ApplicationMethodService
    ).singleton(),
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
    applicationMethodRepository: asClass(
      defaultRepositories.ApplicationMethodRepository
    ).singleton(),
    promotionRepository: asClass(
      defaultRepositories.PromotionRepository
    ).singleton(),
    promotionRuleRepository: asClass(
      defaultRepositories.PromotionRuleRepository
    ).singleton(),
    promotionRuleValueRepository: asClass(
      defaultRepositories.PromotionRuleValueRepository
    ).singleton(),
  })
}
