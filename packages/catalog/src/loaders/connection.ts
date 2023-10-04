import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import * as CatalogModels from "../models"
import { CatalogModuleOptions } from "../types"

export default async (
  { options, container, logger }: LoaderOptions<CatalogModuleOptions>,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  if (options?.defaultAdapterOptions) {
    const entities = Object.values(CatalogModels) as unknown as EntitySchema[]
    const pathToMigrations = __dirname + "/../migrations"

    await ModulesSdkUtils.mikroOrmConnectionLoader({
      entities,
      container,
      options: options.defaultAdapterOptions,
      moduleDeclaration,
      logger,
      pathToMigrations,
    })
  }
}
