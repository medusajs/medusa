import { CurrencyModuleService } from "@services"
import initialDataLoader from "./loaders/initial-data"
import { ExportModule, Modules } from "@medusajs/utils"

const service = CurrencyModuleService
const loaders = [initialDataLoader]

export default ExportModule(Modules.CURRENCY, {
  service,
  loaders,
})
