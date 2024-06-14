import { CurrencyModuleService } from "@services"
import initialDataLoader from "./loaders/initial-data"
import { ModuleExports } from "@medusajs/types"

const service = CurrencyModuleService
const loaders = [initialDataLoader]

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
