import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as Models from "@models"

const migrationScriptOptions = {
  moduleName: Modules.CUSTOMER,
  models: Models,
  pathToMigrations: __dirname + "/../migrations",
}

export const revertMigration = ModulesSdkUtils.buildRevertMigrationScript(
  migrationScriptOptions
)
