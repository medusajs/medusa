import VirtualRoutes from "virtual:medusa/routes"
import {
  createRouteMap,
  settingsRouteRegex,
} from "../../extensions/routes/utils"

const pages = VirtualRoutes.routes
  .filter((ext) => !settingsRouteRegex.test(ext.path))
  .map((ext) => ext)

/**
 * Core Route extensions.
 */
export const RouteExtensions = createRouteMap(pages)
