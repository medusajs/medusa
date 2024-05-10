import { moduleDefinition } from "./module-definition"
import { initializeFactory, Modules } from "@medusajs/modules-sdk"

export default moduleDefinition

export const initialize = initializeFactory({
  moduleName: Modules.PRODUCT,
  moduleDefinition,
})

export * from "./models"
export * from "./services"
export * from "./types"
