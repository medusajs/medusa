import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/types"
import Models from "@medusajs/medusa/dist/loaders/models"
import { EntitySchema } from "@mikro-orm/core"
import { mikroOrmConnectionLoader } from "./mikro-orm-connection-loader"

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
    const entities = Object.values(Models) as unknown as EntitySchema[]

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
