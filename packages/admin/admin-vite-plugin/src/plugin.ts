import {
  RESOLVED_CUSTOM_FIELD_DISPLAY_MODULES,
  RESOLVED_CUSTOM_FIELD_FORM_CONFIG_MODULES,
  RESOLVED_CUSTOM_FIELD_FORM_FIELD_MODULES,
  RESOLVED_CUSTOM_FIELD_LINK_MODULES,
  RESOLVED_ROUTE_MODULES,
  RESOLVED_WIDGET_MODULES,
  resolveVirtualId,
  VIRTUAL_MODULES,
} from "@medusajs/admin-shared"
import crypto from "node:crypto"
import path from "path"
import type * as Vite from "vite"
import { MedusaVitePlugin } from "./types"
import { generateModule } from "./utils"
import {
  generateVirtualConfigModule,
  generateVirtualLinkModule,
  generateVirtualMenuItemModule,
  generateVirtualRouteModule,
} from "./virtual-modules"
import { generateWidgetConfigHash } from "./widgets"

const CONFIG_VIRTUAL_MODULE = `virtual:medusa/config`
const RESOLVED_CONFIG_VIRTUAL_MODULE = `\0${CONFIG_VIRTUAL_MODULE}`
const LINK_VIRTUAL_MODULE = `virtual:medusa/links`
const RESOLVED_LINK_VIRTUAL_MODULE = `\0${LINK_VIRTUAL_MODULE}`
const ROUTE_VIRTUAL_MODULE = `virtual:medusa/routes`
const RESOLVED_ROUTE_VIRTUAL_MODULE = `\0${ROUTE_VIRTUAL_MODULE}`
const MENU_ITEM_VIRTUAL_MODULE = `virtual:medusa/menu-items`
const RESOLVED_MENU_ITEM_VIRTUAL_MODULE = `\0${MENU_ITEM_VIRTUAL_MODULE}`
type VirtualModule =
  | typeof CONFIG_VIRTUAL_MODULE
  | typeof LINK_VIRTUAL_MODULE
  | typeof ROUTE_VIRTUAL_MODULE
  | typeof MENU_ITEM_VIRTUAL_MODULE
export const medusaVitePlugin: MedusaVitePlugin = (options) => {
  const hashMap = new Map<VirtualModule, string>()
  const _sources = new Set<string>(options?.sources ?? [])

  let watcher: Vite.FSWatcher | undefined

  function isFileInSources(file: string): boolean {
    for (const source of _sources) {
      if (file.startsWith(path.resolve(source))) {
        return true
      }
    }
    return false
  }

  function isFileInRoutes(file: string): boolean {
    const normalizedPath = path.normalize(file).replace(/\\/g, "/")
    return normalizedPath.includes("/src/admin/routes/")
  }

  function isFileInCustomFields(file: string): boolean {
    const normalizedPath = path.normalize(file).replace(/\\/g, "/")
    return normalizedPath.includes("/src/admin/custom-fields/")
  }

  function isFileInWidgets(file: string): boolean {
    const normalizedPath = path.normalize(file).replace(/\\/g, "/")
    return normalizedPath.includes("/src/admin/widgets/")
  }

  return {
    name: "@medusajs/admin-vite-plugin",
    enforce: "pre",
    configureServer(_server) {
      watcher = _server.watcher
      watcher?.add(Array.from(_sources))

      watcher?.on("all", async (_event, file) => {
        if (!isFileInSources(file)) {
          return
        }

        /**
         * If the change was in the routes folder, and the hash has changed, we need to reload the route module.
         * Otherwise, we can skip reloading the module, as there has been no changes to which routes are injected.
         */
        if (isFileInRoutes(file)) {
          const routeModule = await generateVirtualRouteModule(_sources)

          const routeHash = crypto
            .createHash("md5")
            .update(routeModule.code)
            .digest("hex")

          if (routeHash !== hashMap.get("virtual:medusa/routes")) {
            const routeModule = _server.moduleGraph.getModuleById(
              RESOLVED_ROUTE_VIRTUAL_MODULE
            )

            if (routeModule) {
              await _server.reloadModule(routeModule)
            }
          }
        }

        /**
         * If the change was in the widgets folder, we can compare the hashes of the generated config module.
         * If the hash is the same, then we don't need to reload the module, as the changes to a widget component
         * don't require a reload, and can be handled by HMR.
         */
        if (isFileInWidgets(file)) {
          const widgetConfigHash = await generateWidgetConfigHash(_sources)

          if (widgetConfigHash !== hashMap.get("virtual:medusa/config")) {
            const mod = _server.moduleGraph.getModuleById(
              RESOLVED_CONFIG_VIRTUAL_MODULE
            )

            if (mod) {
              await _server.reloadModule(mod)
            }
          }
        } else {
          /**
           * If the change was not in the widgets folder, we need to reload the config module.
           */
          const mod = _server.moduleGraph.getModuleById(
            RESOLVED_CONFIG_VIRTUAL_MODULE
          )

          if (mod) {
            await _server.reloadModule(mod)
          }
        }

        /**
         * If the change was in the custom fields folder, and the hash has changed, we need to reload the link module.
         * Otherwise, we can skip reloading the module, as there has been no changes to which links are injected.
         */
        if (isFileInCustomFields(file)) {
          const linkModule = await generateVirtualLinkModule(_sources)

          const linkHash = crypto
            .createHash("md5")
            .update(linkModule.code)
            .digest("hex")

          if (linkHash !== hashMap.get("virtual:medusa/links")) {
            const linkModule = _server.moduleGraph.getModuleById(
              RESOLVED_LINK_VIRTUAL_MODULE
            )

            if (linkModule) {
              await _server.reloadModule(linkModule)
            }
          }
        }
      })
    },
    resolveId(id) {
      if (
        [
          ...VIRTUAL_MODULES,
          CONFIG_VIRTUAL_MODULE,
          ROUTE_VIRTUAL_MODULE,
          LINK_VIRTUAL_MODULE,
        ].includes(id)
      ) {
        return resolveVirtualId(id)
      }

      return null
    },
    async load(id) {
      if (id === RESOLVED_CONFIG_VIRTUAL_MODULE) {
        const widgetConfigHash = await generateWidgetConfigHash(_sources)
        hashMap.set("virtual:medusa/config", widgetConfigHash)

        return await generateVirtualConfigModule(_sources)
      }

      if (id === RESOLVED_LINK_VIRTUAL_MODULE) {
        const linkModule = await generateVirtualLinkModule(_sources)

        const linkHash = crypto
          .createHash("md5")
          .update(linkModule.code)
          .digest("hex")

        hashMap.set("virtual:medusa/links", linkHash)

        return linkModule
      }

      if (id === RESOLVED_ROUTE_VIRTUAL_MODULE) {
        const routeModule = await generateVirtualRouteModule(_sources)

        const routeHash = crypto
          .createHash("md5")
          .update(routeModule.code)
          .digest("hex")

        hashMap.set("virtual:medusa/routes", routeHash)

        return routeModule
      }

      if (id === RESOLVED_MENU_ITEM_VIRTUAL_MODULE) {
        const menuItemModule = await generateVirtualMenuItemModule(_sources)

        const menuItemHash = crypto
          .createHash("md5")
          .update(menuItemModule.code)
          .digest("hex")

        hashMap.set("virtual:medusa/menu-items", menuItemHash)

        return menuItemModule
      }

      // TODO: Remove all of these
      if (RESOLVED_CUSTOM_FIELD_DISPLAY_MODULES.includes(id)) {
        const code = `export default {
            containers: [],
        }`

        return generateModule(code)
      }

      if (RESOLVED_CUSTOM_FIELD_FORM_FIELD_MODULES.includes(id)) {
        const code = `export default {
            sections: [],
        }`

        return generateModule(code)
      }

      if (RESOLVED_CUSTOM_FIELD_FORM_CONFIG_MODULES.includes(id)) {
        const code = `export default {
            configs: [],
        }`

        return generateModule(code)
      }

      if (RESOLVED_CUSTOM_FIELD_LINK_MODULES.includes(id)) {
        const code = `export default {
            links: [],
        }`

        return generateModule(code)
      }

      if (RESOLVED_ROUTE_MODULES.includes(id)) {
        if (id.includes("link")) {
          const code = `export default {
            links: [],
          }`

          return generateModule(code)
        }

        const code = `export default {
          pages: [],
        }`

        return generateModule(code)
      }

      if (RESOLVED_WIDGET_MODULES.includes(id)) {
        const code = `export default {
          widgets: [],
        }`

        return generateModule(code)
      }
    },
    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    },
  }
}
