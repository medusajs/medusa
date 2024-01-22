import { moduleDefinition } from "./module-definition"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Modules } from "@medusajs/modules-sdk"
import * as ProductModels from "@models"

export default moduleDefinition

const migrationScriptOptions = {
  moduleName: Modules.PRODUCT,
  models: ProductModels,
  pathToMigrations: __dirname + "/migrations",
}

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)
export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

export * from "./initialize"
export * from "./types"
export * from "./loaders"
export * from "./models"
export * from "./services"
