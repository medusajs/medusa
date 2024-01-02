import { Modules } from "@medusajs/modules-sdk"
import { LoaderOptions, ModulesSdkTypes } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import { EntitySchema } from "@mikro-orm/core"
import * as cartModels from "@models"

export async function runMigrations({
  options,
  logger,
}: Pick<
  LoaderOptions<ModulesSdkTypes.ModuleServiceInitializeOptions>,
  "options" | "logger"
> = {}) {
  const entities = Object.values(cartModels) as unknown as EntitySchema[]
  const pathToMigrations = __dirname + "/../migrations"

  await ModulesSdkUtils.migrationsUp({
    options,
    logger,
    moduleName: Modules.CART,
    models: entities,
    pathToMigrations,
  })
}
