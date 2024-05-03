import * as Models from "@models"

import { UserModuleService } from "@services"
import { ModuleExports } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const migrationScriptOptions = {
  moduleName: Modules.USER,
  models: Models,
  pathToMigrations: __dirname + "/migrations",
}

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)
export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

const service = UserModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
