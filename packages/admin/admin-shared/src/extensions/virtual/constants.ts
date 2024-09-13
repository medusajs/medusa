import {
  CUSTOM_FIELD_DISPLAY_PATHS,
  CUSTOM_FIELD_FORM_CONFIG_PATHS,
  CUSTOM_FIELD_FORM_FIELD_PATHS,
  CUSTOM_FIELD_LINK_PATHS,
} from "../custom-fields/constants"
import { ROUTE_IMPORTS } from "../routes"
import { INJECTION_ZONES } from "../widgets"
import {
  getCustomFieldImport,
  getVirtualId,
  getWidgetImport,
  resolveVirtualId,
} from "./utils"

const VIRTUAL_WIDGET_MODULES = INJECTION_ZONES.map((zone) => {
  return getVirtualId(getWidgetImport(zone))
})

const VIRTUAL_ROUTE_MODULES = ROUTE_IMPORTS.map((route) => {
  return getVirtualId(route)
})

const VIRTUAL_CUSTOM_FIELD_LINK_MODULES = CUSTOM_FIELD_LINK_PATHS.map(
  (link) => {
    return getVirtualId(getCustomFieldImport(link))
  }
)

const VIRTUAL_CUSTOM_FIELD_FORM_CONFIG_MODULES =
  CUSTOM_FIELD_FORM_CONFIG_PATHS.map((config) => {
    return getVirtualId(getCustomFieldImport(config))
  })

const VIRTUAL_CUSTOM_FIELD_FORM_FIELD_MODULES =
  CUSTOM_FIELD_FORM_FIELD_PATHS.map((field) => {
    return getVirtualId(getCustomFieldImport(field))
  })

const VIRTUAL_CUSTOM_FIELD_DISPLAY_MODULES = CUSTOM_FIELD_DISPLAY_PATHS.map(
  (container) => {
    return getVirtualId(getCustomFieldImport(container))
  }
)

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
  ...VIRTUAL_CUSTOM_FIELD_FORM_FIELD_MODULES,
  ...VIRTUAL_CUSTOM_FIELD_FORM_CONFIG_MODULES,
  ...VIRTUAL_CUSTOM_FIELD_LINK_MODULES,
  ...VIRTUAL_CUSTOM_FIELD_DISPLAY_MODULES,
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

export const RESOLVED_CUSTOM_FIELD_LINK_MODULES =
  VIRTUAL_CUSTOM_FIELD_LINK_MODULES.map((id) => {
    return resolveVirtualId(id)
  })

export const RESOLVED_CUSTOM_FIELD_FORM_CONFIG_MODULES =
  VIRTUAL_CUSTOM_FIELD_FORM_CONFIG_MODULES.map((id) => {
    return resolveVirtualId(id)
  })

export const RESOLVED_CUSTOM_FIELD_DISPLAY_MODULES =
  VIRTUAL_CUSTOM_FIELD_DISPLAY_MODULES.map((id) => {
    return resolveVirtualId(id)
  })

export const RESOLVED_CUSTOM_FIELD_FORM_FIELD_MODULES =
  VIRTUAL_CUSTOM_FIELD_FORM_FIELD_MODULES.map((id) => {
    return resolveVirtualId(id)
  })
