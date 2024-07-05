import { ModuleExports } from "@medusajs/types"
import { RegionModuleService } from "./services"

import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as RegionModels from "@models"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import loadDefaults from "./loaders/defaults"

const migrationScriptOptions = {
  moduleName: Modules.REGION,
  models: RegionModels,
  pathToMigrations: __dirname + "/migrations",
}

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)
export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

const service = RegionModuleService
const loaders = [loadContainer, loadConnection, loadDefaults] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
