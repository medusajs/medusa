import {
  InternalModuleDeclaration,
  LoaderOptions,
  MODULE_RESOURCE_TYPE,
} from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import * as SearchModels from "../models"
import { SearchModuleOptions } from "../types"

export default async (
  { options, container, logger }: LoaderOptions<SearchModuleOptions>,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  const entities = Object.values(SearchModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  if (moduleDeclaration?.resources !== MODULE_RESOURCE_TYPE.SHARED) {
    if (!options?.defaultAdapterOptions) {
      throw new Error(
        "Search module error, no default adapter options provided while the module is not shared."
      )
    }
  }

  await ModulesSdkUtils.mikroOrmConnectionLoader({
    entities,
    container,
    options: options?.defaultAdapterOptions ?? {},
    moduleDeclaration,
    logger,
    pathToMigrations,
  })
}
