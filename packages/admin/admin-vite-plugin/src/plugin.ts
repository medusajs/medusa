import crypto from "node:crypto"
import path from "path"
import type * as Vite from "vite"
import { MedusaVitePlugin } from "./types"
import {
  generateVirtualConfigModule,
  generateVirtualLinkModule,
  generateVirtualMenuItemModule,
  generateVirtualRouteModule,
} from "./virtual-modules"
import {
  CONFIG_VIRTUAL_MODULE,
  LINK_VIRTUAL_MODULE,
  MENU_ITEM_VIRTUAL_MODULE,
  RESOLVED_CONFIG_VIRTUAL_MODULE,
  RESOLVED_LINK_VIRTUAL_MODULE,
  RESOLVED_MENU_ITEM_VIRTUAL_MODULE,
  RESOLVED_ROUTE_VIRTUAL_MODULE,
  ROUTE_VIRTUAL_MODULE,
  VIRTUAL_MODULES,
  VirtualModule,
  resolveVirtualId,
} from "./vmod"
import { generateWidgetConfigHash } from "./widgets"

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

          if (routeHash !== hashMap.get(ROUTE_VIRTUAL_MODULE)) {
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

          if (widgetConfigHash !== hashMap.get(CONFIG_VIRTUAL_MODULE)) {
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
      if (VIRTUAL_MODULES.includes(id as VirtualModule)) {
        return resolveVirtualId(id)
      }

      return null
    },
    async load(id) {
      if (id === RESOLVED_CONFIG_VIRTUAL_MODULE) {
        const widgetConfigHash = await generateWidgetConfigHash(_sources)
        hashMap.set(CONFIG_VIRTUAL_MODULE, widgetConfigHash)

        return await generateVirtualConfigModule(_sources)
      }

      if (id === RESOLVED_LINK_VIRTUAL_MODULE) {
        const linkModule = await generateVirtualLinkModule(_sources)

        const linkHash = crypto
          .createHash("md5")
          .update(linkModule.code)
          .digest("hex")

        hashMap.set(LINK_VIRTUAL_MODULE, linkHash)

        return linkModule
      }

      if (id === RESOLVED_ROUTE_VIRTUAL_MODULE) {
        const routeModule = await generateVirtualRouteModule(_sources)

        const routeHash = crypto
          .createHash("md5")
          .update(routeModule.code)
          .digest("hex")

        hashMap.set(ROUTE_VIRTUAL_MODULE, routeHash)

        return routeModule
      }

      if (id === RESOLVED_MENU_ITEM_VIRTUAL_MODULE) {
        const menuItemModule = await generateVirtualMenuItemModule(_sources)

        const menuItemHash = crypto
          .createHash("md5")
          .update(menuItemModule.code)
          .digest("hex")

        hashMap.set(MENU_ITEM_VIRTUAL_MODULE, menuItemHash)

        return menuItemModule
      }
    },
    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    },
  }
}
