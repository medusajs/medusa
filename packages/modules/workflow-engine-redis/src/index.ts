import { initializeFactory, Modules } from "@medusajs/modules-sdk"
import { moduleDefinition } from "./module-definition"

export default moduleDefinition

export const initialize = initializeFactory({
  moduleName: Modules.WORKFLOW_ENGINE,
  moduleDefinition,
})

export * from "./loaders"
