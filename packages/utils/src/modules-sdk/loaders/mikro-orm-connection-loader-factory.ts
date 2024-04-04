import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/types"
import { mikroOrmConnectionLoader } from "./mikro-orm-connection-loader"
import {
  FreeTextSearchFilterKey,
  mikroOrmFreeTextSearchFilterOptionsFactory,
} from "../../dal/mikro-orm/mikro-orm-fre-text-search-filter"

/**
 * Factory for creating a MikroORM connection loader for the modules
 *
 * @param moduleName
 * @param moduleModels
 * @param migrationsPath
 */
export function mikroOrmConnectionLoaderFactory({
  moduleName,
  moduleModels,
  migrationsPath,
}: {
  moduleName: string
  moduleModels: any[]
  migrationsPath?: string
}): any {
  return async (
    { options, container, logger }: LoaderOptions,
    moduleDeclaration?: InternalModuleDeclaration
  ): Promise<void> => {
    await mikroOrmConnectionLoader({
      moduleName,
      entities: moduleModels,
      container,
      options,
      moduleDeclaration,
      logger,
      pathToMigrations: migrationsPath ?? "",
    })
  }
}
