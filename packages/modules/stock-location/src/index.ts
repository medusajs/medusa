import { Module, Modules } from "@zjedene-medusa/framework/utils"
import { StockLocationModuleService } from "@services"

export default Module(Modules.STOCK_LOCATION, {
  service: StockLocationModuleService,
})
