import { ModuleExports } from "@medusajs/types"
import { CurrencyService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

// TODO: replace this with money amount service
const service = CurrencyService
const loaders = [loadContainer, loadConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
