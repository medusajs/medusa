import { moduleDefinition } from "./module-definition"
import { Modules } from "@medusajs/modules-sdk"
import * as Models from "@models"
import { ModulesSdkUtils } from "@medusajs/utils"

export default moduleDefinition

const migrationScriptOptions = {
  moduleName: Modules.PRICING,
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
export * from "./types"
export * from "./loaders"
export * from "./models"
export * from "./services"
