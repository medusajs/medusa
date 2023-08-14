import * as StockLocationModels from "../models"

import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"

import { EntitySchema } from "@mikro-orm/core"
import { ModulesSdkUtils } from "@medusajs/utils"

export default async (
  { options, container, logger }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  const entities = Object.values(
    StockLocationModels
  ) as unknown as EntitySchema[]

  await ModulesSdkUtils.mikroOrmConnectionLoader({
    entities,
    container,
    options,
    moduleDeclaration,
    logger,
  })

  //   if (
  //     moduleDeclaration?.scope === MODULE_SCOPE.INTERNAL &&
  //     moduleDeclaration.resources === MODULE_RESOURCE_TYPE.SHARED
  //   ) {
  //     const { projectConfig } = container.resolve("configModule")
  //     options = {
  //       database: {
  //         clientUrl: projectConfig.database_url!,
  //       },
  //     }
  //   }

  //   const customManager = (
  //     options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  //   )?.manager

  //   if (!customManager) {
  //     const dbData = ModulesSdkUtils.loadDatabaseConfig("stock_location", options)
  //     await loadDefault({ database: dbData, container })
  //   } else {
  //     container.register({
  //       manager: asValue(customManager),
  //     })
  //   }
  // }

  // async function loadDefault({ database, container }) {
  //   if (!database) {
  //     throw new MedusaError(
  //       MedusaError.Types.INVALID_ARGUMENT,
  //       `Database config is not present at module config "options.database"`
  //     )
  //   }

  //   const entities = Object.values(
  //     StockLocationModels
  //   ) as unknown as EntitySchema[]

  //   console.log("entities", entities)

  //   const orm = await createConnection(database, entities)

  //   container.register({
  //     manager: asValue(orm.em.fork()),
  //   })
}
