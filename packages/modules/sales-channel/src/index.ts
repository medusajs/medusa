import { initializeFactory, Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"

import * as SalesChannelModels from "@models"

import { moduleDefinition } from "./module-definition"

export default moduleDefinition

const migrationScriptOptions = {
  moduleName: Modules.SALES_CHANNEL,
  models: SalesChannelModels,
  pathToMigrations: __dirname + "/migrations",
}

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)
export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

export const initialize = initializeFactory({
  moduleName: Modules.SALES_CHANNEL,
  moduleDefinition,
})

export * from "./types"
export * from "./models"
export * from "./services"
