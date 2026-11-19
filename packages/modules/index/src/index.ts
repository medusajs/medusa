import { IndexModuleService } from "@services"
import { Module, Modules } from "@medusajs/framework/utils"
import containerLoader from "./loaders/index"

/**
 * @deprecated The Index Module is deprecated and will be removed in a future release. Use `query.graph()` instead, which filters across linked modules: https://docs.medusajs.com/learn/fundamentals/query#filter-by-linked-data-models-property
 */
export default Module(Modules.INDEX, {
  service: IndexModuleService,
  loaders: [containerLoader],
})
