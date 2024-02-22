import { Modules } from "@medusajs/modules-sdk"
import { ModuleExports } from "@medusajs/types"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as Models from "@models"
import { CustomerModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const migrationScriptOptions = {
  moduleName: Modules.CUSTOMER,
  models: Models,
  pathToMigrations: __dirname + "/migrations",
}

export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)

export const runMigrations = ModulesSdkUtils.buildMigrationScript(
  migrationScriptOptions
)

const service = CustomerModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
