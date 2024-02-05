import { moduleDefinition } from "./module-definition"
import { Modules } from "@medusajs/modules-sdk"
import { initializeFactory } from "@medusajs/utils"

export * from "./types"
export * from "./models"
export * from "./services"

export const initialize = initializeFactory({
  moduleName: Modules.FULFILLMENT,
  moduleDefinition,
})
export const runMigrations = moduleDefinition.runMigrations
export const revertMigration = moduleDefinition.revertMigration
export default moduleDefinition
