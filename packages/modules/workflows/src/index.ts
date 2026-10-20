import { Module, Modules } from "@medusajs/framework/utils"
import engineLoader from "./loaders/engine"
import { WorkflowsModuleService } from "./services"

export * from "./types"
export { configureWorkflowTracing } from "./middleware/tracing"
export type { WorkflowTracing } from "./middleware/tracing"
export { WorkflowsModuleService }

export default Module(Modules.WORKFLOW_ENGINE, {
  service: WorkflowsModuleService,
  loaders: [engineLoader],
})
