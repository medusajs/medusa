import { Module, Modules } from "@medusajs/utils"
import { WorkflowsModuleService } from "@services"
import { loadUtils } from "./loaders"

export default Module(Modules.WORKFLOW_ENGINE, {
  service: WorkflowsModuleService,
  loaders: [loadUtils],
})
