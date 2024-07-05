import { Modules, initializeFactory } from "@medusajs/modules-sdk"

import { moduleDefinition } from "./module-definition"

export * from "./models"
export * from "./services"

export const initialize = initializeFactory({
  moduleName: Modules.STOCK_LOCATION,
  moduleDefinition,
})
export const runMigrations = moduleDefinition.runMigrations
export const revertMigration = moduleDefinition.revertMigration
export default moduleDefinition
