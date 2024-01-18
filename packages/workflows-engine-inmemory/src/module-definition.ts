import { ModuleExports } from "@medusajs/types"
import { WorkflowsModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const service = WorkflowsModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
