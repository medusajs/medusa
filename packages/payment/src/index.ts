import { moduleDefinition } from "./module-definition"
import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"

import * as PaymentModels from "@models"

export default moduleDefinition

const migrationScriptOptions = {
  moduleName: Modules.PAYMENT,
  models: PaymentModels,
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
