import { ModuleExports } from "@medusajs/types"
import { WorkflowOrchestratorModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const service = WorkflowOrchestratorModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
