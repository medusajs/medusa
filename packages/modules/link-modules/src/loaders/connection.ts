import {
  InternalModuleDeclaration,
  LoaderOptions,
  ModuleServiceInitializeCustomDataLayerOptions,
  ModuleServiceInitializeOptions,
} from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"

import { EntitySchema } from "@mikro-orm/core"

export function connectionLoader(entity: EntitySchema) {
  return async (
    {
      options,
      container,
      logger,
    }: LoaderOptions<
      | ModuleServiceInitializeOptions
      | ModuleServiceInitializeCustomDataLayerOptions
    >,
    moduleDeclaration?: InternalModuleDeclaration
  ): Promise<void> => {
    const pathToMigrations = __dirname + "/../migrations"

    await ModulesSdkUtils.mikroOrmConnectionLoader({
      moduleName: "link_module",
      entities: [entity],
      container,
      options,
      moduleDeclaration,
      logger,
      pathToMigrations,
    })
  }
}
