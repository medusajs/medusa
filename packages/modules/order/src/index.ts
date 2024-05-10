import { initializeFactory, Modules } from "@medusajs/modules-sdk"
import { moduleDefinition } from "./module-definition"

export * from "./models"
export * from "./services"
export * from "./types"

export const initialize = initializeFactory({
  moduleName: Modules.ORDER,
  moduleDefinition,
})

export default moduleDefinition
