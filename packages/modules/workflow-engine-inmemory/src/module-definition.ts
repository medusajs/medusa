import { ModuleExports } from "@medusajs/types"
import { WorkflowsModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import loadUtils from "./loaders/utils"

const service = WorkflowsModuleService
const loaders = [loadContainer, loadConnection, loadUtils] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
