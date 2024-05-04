import { Modules, initializeFactory } from "@medusajs/modules-sdk"

import { moduleDefinition } from "./module-definition"

export const initialize = initializeFactory({
  moduleName: Modules.LOCKING,
  moduleDefinition,
})
export const runMigrations = moduleDefinition.runMigrations
export const revertMigration = moduleDefinition.revertMigration
export default moduleDefinition
