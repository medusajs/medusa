import { BaseRepository, getPivotRepository } from "@repositories"
import { PivotService, getModuleService } from "@services"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { InternalModuleDeclaration, ModulesSdkTypes } from "@medusajs/types"
import { asClass, asValue } from "awilix"

export function containerLoader(entity, joinerConfig) {
  return async (
    {
      options,
      container,
    }: LoaderOptions<
      | ModulesSdkTypes.ModuleServiceInitializeOptions
      | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    >,
    moduleDeclaration?: InternalModuleDeclaration
  ): Promise<void> => {
    const [primary, foreign] = joinerConfig.relationships!

    container.register({
      primary: asValue(primary.split(",")),
      foreign: asValue(foreign),

      linkModuleService: asClass(getModuleService(joinerConfig)).singleton(),
      pivotService: asClass(PivotService).singleton(),

      baseRepository: asClass(BaseRepository).singleton(),
      pivotRepository: asClass(getPivotRepository(entity)).singleton(),
    })
  }
}
