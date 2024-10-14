import routeModule from "virtual:medusa/routes"
import {
  createRouteMap,
  getRouteExtensions,
} from "../../extensions/routes/utils"

const routes = getRouteExtensions(routeModule, "core")

/**
 * Core Route extensions.
 */
export const RouteExtensions = createRouteMap(routes)
