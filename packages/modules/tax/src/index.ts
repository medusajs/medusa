import { initializeFactory, Modules } from "@medusajs/modules-sdk"
import { moduleDefinition } from "./module-definition"

export * from "./models"
export * from "./services"

export const initialize = initializeFactory({
  moduleName: Modules.TAX,
  moduleDefinition,
})

export default moduleDefinition
