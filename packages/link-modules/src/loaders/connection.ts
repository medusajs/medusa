import {
  InternalModuleDeclaration,
  LoaderOptions,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/modules-sdk"
import { MedusaError, ModulesSdkUtils } from "@medusajs/utils"

import { ModulesSdkTypes } from "@medusajs/types"
import { asValue } from "awilix"
import { createConnection } from "../utils"

export function connectionLoader(entity) {
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
    if (
      moduleDeclaration?.scope === MODULE_SCOPE.INTERNAL &&
      moduleDeclaration.resources === MODULE_RESOURCE_TYPE.SHARED
    ) {
      return
    }

    const customManager = (
      options as ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
    )?.manager

    if (!customManager) {
      const dbData = ModulesSdkUtils.loadDatabaseConfig("link_modules", options)
      await loadDefault({ database: dbData, container, options })
    } else {
      container.register({
        manager: asValue(customManager),
      })
    }
  }

  async function loadDefault({ database, container, options }) {
    if (!database) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `Database config is not present at module config "options.database"`
      )
    }

    const orm = await createConnection(database, [entity])

    container.register({
      manager: asValue(orm.em.fork()),
    })
  }
}
