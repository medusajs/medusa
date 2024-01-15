import { ModuleExports } from "@medusajs/types"

import { PaymentModuleService } from "@services"

import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

const service = PaymentModuleService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
