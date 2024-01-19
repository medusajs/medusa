import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as Models from "@models"

import { moduleDefinition } from "./module-definition"

export default moduleDefinition

const migrationScriptOptions = {
  moduleName: Modules.CUSTOMER,
  models: Models,
  pathToMigrations: __dirname + "/migrations",
}

export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

export const runMigration = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)

export * from "./initialize"
export * from "./loaders"
