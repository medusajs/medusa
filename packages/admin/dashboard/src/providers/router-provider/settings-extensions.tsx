import routeModule from "virtual:medusa/routes"
import {
  createRouteMap,
  getRouteExtensions,
} from "../../extensions/routes/utils"

const routes = getRouteExtensions(routeModule, "settings")

/**
 * Settings Route extensions.
 */
export const SettingsExtensions = createRouteMap(routes, "/settings")
