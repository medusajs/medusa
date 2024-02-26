import { ModuleExports } from "@medusajs/types"

import { PaymentModuleService } from "@services"

import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import loadProviders from "./loaders/providers"
import loadDefaults from "./loaders/defaults"

import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"

import * as PaymentModels from "@models"

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

const service = PaymentModuleService
const loaders = [
  loadContainer,
  loadConnection,
  loadProviders,
  loadDefaults,
] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
  runMigrations,
  revertMigration,
}
