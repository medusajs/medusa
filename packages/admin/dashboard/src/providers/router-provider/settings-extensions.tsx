import routes from "virtual:medusa/routes/pages"

import { createRouteMap, settingsRouteRegex } from "../../extensions/routes/utils"

const pages = routes.pages
  .filter((ext) => settingsRouteRegex.test(ext.path))
  .map((ext) => ext)

/**
 * Settings Route extensions.
 */
export const SettingsExtensions = createRouteMap(pages, "/settings")
