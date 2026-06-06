import { CurrencyModuleService } from "@services"
import initialDataLoader from "./loaders/initial-data"
import { Module, Modules } from "@zjedene-medusa/framework/utils"

const service = CurrencyModuleService
const loaders = [initialDataLoader]

export default Module(Modules.CURRENCY, {
  service,
  loaders,
})
