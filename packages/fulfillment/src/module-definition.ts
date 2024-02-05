import { ModuleExports } from "@medusajs/types"
import { FulfillmentModuleService } from "@services"

import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import { Modules } from "@medusajs/modules-sdk"
import * as Models from "@models"
import { ModulesSdkUtils } from "@medusajs/utils"

const migrationScriptOptions = {
  moduleName: Modules.FULFILLMENT,
  models: Models,
  pathToMigrations: __dirname + "/migrations",
}

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)
export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

const service = FulfillmentModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  revertMigration,
  runMigrations,
}
