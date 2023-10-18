import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import * as SearchModels from "../models"
import { SearchModuleOptions } from "../types"

export default async (
  { options, container, logger }: LoaderOptions<SearchModuleOptions>,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  if (options?.defaultAdapterOptions) {
    const entities = Object.values(SearchModels) as unknown as EntitySchema[]
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
