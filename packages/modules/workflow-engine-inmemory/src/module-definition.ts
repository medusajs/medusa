import { ModuleExports } from "@medusajs/types"
import { WorkflowsModuleService } from "@services"
import loadUtils from "./loaders/utils"

const service = WorkflowsModuleService
const loaders = [loadUtils]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
