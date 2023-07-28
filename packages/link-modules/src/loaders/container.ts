import { BaseRepository, getPivotRepository } from "@repositories"
import { PivotService, getModuleService } from "@services"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkTypes } from "@medusajs/types"
import { asClass } from "awilix"

export function containerLoader(entity, joinerConfig) {
  return async ({
    container,
  }: LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>): Promise<void> => {
    container.register({
      linkModuleService: asClass(getModuleService(joinerConfig)).singleton(),
      pivotService: asClass(PivotService).singleton(),

      baseRepository: asClass(BaseRepository).singleton(),
      pivotRepository: asClass(getPivotRepository(entity)).singleton(),
    })
  }
}
