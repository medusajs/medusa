import { CurrencyModuleService } from "@services"
import initialDataLoader from "./loaders/initial-data"
import { Module, Modules } from "@medusajs/utils"

const service = CurrencyModuleService
const loaders = [initialDataLoader]

export default Module({
  name: Modules.CURRENCY,
  service,
  loaders,
})
