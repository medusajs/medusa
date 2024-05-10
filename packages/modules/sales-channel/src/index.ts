import { initializeFactory, Modules } from "@medusajs/modules-sdk"

import { moduleDefinition } from "./module-definition"

export default moduleDefinition

export const initialize = initializeFactory({
  moduleName: Modules.SALES_CHANNEL,
  moduleDefinition,
})

export * from "./types"
export * from "./models"
export * from "./services"
