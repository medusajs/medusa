import { moduleDefinition } from "./module-definition"
import { Modules } from "@medusajs/modules-sdk"
import * as models from "@models"
import { ModulesSdkUtils } from "@medusajs/utils"

export default moduleDefinition

const migrationScriptOptions = {
  moduleName: Modules.WORKFLOW_ORCHESTRATOR,
  models: models,
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
