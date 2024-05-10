import {
  moduleDefinition,
  revertMigration,
  runMigrations,
} from "./module-definition"
import { initializeFactory, Modules } from "@medusajs/modules-sdk"

export default moduleDefinition
export { revertMigration, runMigrations }

export const initialize = initializeFactory({
  moduleName: Modules.PRICING,
  moduleDefinition,
})

export * from "./models"
export * from "./services"
export * from "./types"
