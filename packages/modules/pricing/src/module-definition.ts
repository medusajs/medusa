import { Modules } from "@medusajs/modules-sdk"
import { ModuleExports } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as Models from "@models"
import { PricingModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

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

const service = PricingModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
