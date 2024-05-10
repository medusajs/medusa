import { moduleDefinition } from "./module-definition"
import { initializeFactory, Modules } from "@medusajs/modules-sdk"

export * from "./types"
export * from "./models"
export * from "./services"

export const initialize = initializeFactory({
  moduleName: Modules.NOTIFICATION,
  moduleDefinition,
})
export const runMigrations = moduleDefinition.runMigrations
export const revertMigration = moduleDefinition.revertMigration
export default moduleDefinition
