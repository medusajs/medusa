import { ROUTE_IMPORTS } from "../routes"
import { INJECTION_ZONES } from "../widgets"
import { getVirtualId, getWidgetImport, resolveVirtualId } from "./utils"

const VIRTUAL_WIDGET_MODULES = INJECTION_ZONES.map((zone) => {
  return getVirtualId(getWidgetImport(zone))
})

const VIRTUAL_ROUTE_MODULES = ROUTE_IMPORTS.map((route) => {
  return getVirtualId(route)
})

/**
 * All virtual modules that are used in the admin panel. Virtual modules are used
 * to inject custom widgets, routes and settings. A virtual module is imported using
 * a string that corresponds to the id of the virtual module.
 *
 * @example
 * ```ts
 * import ProductDetailsBefore from "virtual:medusa/widgets/product/details/before"
 * ```
 */
export const VIRTUAL_MODULES = [
  ...VIRTUAL_WIDGET_MODULES,
  ...VIRTUAL_ROUTE_MODULES,
]

/**
 * Reolved paths to all virtual widget modules.
 */
export const RESOLVED_WIDGET_MODULES = VIRTUAL_WIDGET_MODULES.map((id) => {
  return resolveVirtualId(id)
})

/**
 * Reolved paths to all virtual route modules.
 */
export const RESOLVED_ROUTE_MODULES = VIRTUAL_ROUTE_MODULES.map((id) => {
  return resolveVirtualId(id)
})
