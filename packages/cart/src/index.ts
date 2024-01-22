import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as Models from "@models"
import { moduleDefinition } from "./module-definition"

export default moduleDefinition

const migrationScriptOptions = {
  moduleName: Modules.CART,
  models: Models,
  pathToMigrations: __dirname + "/migrations",
}

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)
export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

export * from "./initialize"
export * from "./loaders"

