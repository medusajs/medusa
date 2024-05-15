import { ModuleExports } from "@medusajs/types"
import { CurrencyModuleService } from "@services"
import initialDataLoader from "./loaders/initial-data"

const service = CurrencyModuleService
const loaders = [initialDataLoader]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
