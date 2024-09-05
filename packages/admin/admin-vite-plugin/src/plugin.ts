import {
  InjectionZone,
  RESOLVED_CONTAINER_MODULES,
  RESOLVED_FORM_MODULES,
  RESOLVED_ROUTE_MODULES,
  RESOLVED_WIDGET_MODULES,
  VIRTUAL_MODULES,
  getVirtualId,
  getWidgetImport,
  getWidgetZone,
  resolveVirtualId,
} from "@medusajs/admin-shared"
import type * as Vite from "vite"
import { generateRouteEntrypoint, validateRoute } from "./route-utils"
import { ExtensionGraph, LoadModuleOptions, MedusaVitePlugin } from "./types"
import { getModuleType } from "./utils"
import { generateWidgetEntrypoint, validateWidget } from "./widget-utils"

const EVENT_ADD = "add"
const EVENT_CHANGE = "change"

export const medusaVitePlugin: MedusaVitePlugin = (options) => {
  const _extensionGraph: ExtensionGraph = new Map<string, Set<string>>()
  const _sources = new Set<string>(options?.sources ?? [])

  let server: Vite.ViteDevServer | undefined
  let watcher: Vite.FSWatcher | undefined

  async function generateEntrypoint(options: LoadModuleOptions) {
    switch (options.type) {
      case "widget": {
        return await generateWidgetEntrypoint(_sources, options.get)
      }
      case "route":
        return await generateRouteEntrypoint(_sources, options.get)
      default:
        return null
    }
  }

  async function loadVirtualModule(id: string, options: LoadModuleOptions) {
    const result = await generateEntrypoint(options)

    if (!result) {
      return
    }

    const { module, paths } = result

    for (const path of paths) {
      const ids = _extensionGraph.get(path) || new Set<string>()
      ids.add(id)
      _extensionGraph.set(path, ids)
    }

    return module
  }

  async function reloadModule(moduleId: string) {
    const module = server?.moduleGraph.getModuleById(moduleId)

    if (module) {
      await server?.reloadModule(module)
    }
  }

  function getWidgetZoneImports(zoneValues: InjectionZone[]): Set<string> {
    const imports = new Set<string>()

    for (const zoneValue of zoneValues) {
      const zonePath = getWidgetImport(zoneValue)
      const moduleId = getVirtualId(zonePath)
      const resolvedModuleId = resolveVirtualId(moduleId)
      imports.add(resolvedModuleId)
    }

    return imports
  }

  async function handleInvalidFile(file: string) {
    const extensionIds = _extensionGraph.get(file)
    _extensionGraph.delete(file)

    if (extensionIds) {
      for (const moduleId of extensionIds) {
        await reloadModule(moduleId)
      }
    }
  }

  async function handleWidgetChange(
    file: string,
    event: typeof EVENT_ADD | typeof EVENT_CHANGE
  ) {
    const { valid, zone } = await validateWidget(file)
    const zoneValues = Array.isArray(zone) ? zone : ([zone] as InjectionZone[])

    if (event === EVENT_CHANGE) {
      /**
       * If the file is in the extension graph, and it has become
       * invalid, we need to remove it from the graph and reload all modules
       * that import the widget.
       */
      if (!valid) {
        await handleInvalidFile(file)
        return
      }

      /**
       * If the file is not in the extension graph, we need to add it.
       * We also need to reload all modules that import the widget.
       */
      if (!_extensionGraph.has(file)) {
        const imports = getWidgetZoneImports(zoneValues)
        _extensionGraph.set(file, imports)

        for (const moduleId of imports) {
          await reloadModule(moduleId)
        }
      }

      if (_extensionGraph.has(file)) {
        const modules = _extensionGraph.get(file)

        if (!modules) {
          return
        }

        for (const moduleId of modules) {
          const module = server?.moduleGraph.getModuleById(moduleId)

          if (!module || !module.id) {
            continue
          }

          const matchedInjectionZone = getWidgetZone(module.id)

          /**
           * If the widget is imported in a module that does not match the new
           * zone value, we need to reload the module, so the widget will be removed.
           */
          if (!zoneValues.includes(matchedInjectionZone)) {
            modules.delete(moduleId)
            await server?.reloadModule(module)
          }
        }

        const imports = new Set<string>(modules)

        /**
         * If the widget is not currently being imported by the virtual module that
         * matches its zone value, we need to reload the module, so the widget will be added.
         */
        for (const zoneValue of zoneValues) {
          const zonePath = getWidgetImport(zoneValue)
          const moduleId = getVirtualId(zonePath)
          const resolvedModuleId = resolveVirtualId(moduleId)

          if (!modules.has(resolvedModuleId)) {
            const module = server?.moduleGraph.getModuleById(resolvedModuleId)
            if (module) {
              imports.add(resolvedModuleId)
              await server?.reloadModule(module)
            }
          }
        }

        _extensionGraph.set(file, imports)
      }
    }

    if (event === EVENT_ADD) {
      /**
       * If a new file is added in /admin/widgets, but it is not valid,
       * we don't need to do anything.
       */
      if (!valid) {
        return
      }

      /**
       * If a new file is added in /admin/widgets, and it is valid, we need to
       * add it to the extension graph and reload all modules that need to import
       * the widget so that they can be updated with the new widget.
       */
      const imports = getWidgetZoneImports(zoneValues)
      _extensionGraph.set(file, imports)

      for (const moduleId of imports) {
        await reloadModule(moduleId)
      }
    }
  }

  async function handleRouteChange(
    file: string,
    event: typeof EVENT_ADD | typeof EVENT_CHANGE
  ) {
    const valid = await validateRoute(file)

    if (event === EVENT_CHANGE) {
      /**
       * If the file is in the extension graph, and it has become
       * invalid, we need to remove it from the graph and reload all modules
       * that import the route.
       */
      if (!valid) {
        await handleInvalidFile(file)
        return
      }

      /**
       * If the file is not in the extension graph, we need to add it.
       * We also need to reload all modules that import the route.
       */
      if (!_extensionGraph.has(file)) {
        const imports = new Set<string>()

        for (const resolvedModuleId of RESOLVED_ROUTE_MODULES) {
          const module = server?.moduleGraph.getModuleById(resolvedModuleId)
          if (module) {
            imports.add(resolvedModuleId)
            await server?.reloadModule(module)
          }
        }

        _extensionGraph.set(file, imports)
      }
    }

    if (event === EVENT_ADD) {
      /**
       * If a new file is added in /admin/routes, but it is not valid,
       * we don't need to do anything.
       */
      if (!valid) {
        return
      }

      const imports = new Set<string>()

      for (const resolvedModuleId of RESOLVED_ROUTE_MODULES) {
        const module = server?.moduleGraph.getModuleById(resolvedModuleId)
        if (module) {
          imports.add(resolvedModuleId)
          await server?.reloadModule(module)
        }
      }

      _extensionGraph.set(file, imports)
    }
  }

  async function handleAddOrChange(
    path: string,
    event: typeof EVENT_ADD | typeof EVENT_CHANGE
  ) {
    const type = getModuleType(path)

    switch (type) {
      case "widget":
        await handleWidgetChange(path, event)
        break
      case "route":
        await handleRouteChange(path, event)
        break
      default:
        // In all other cases we don't need to do anything.
        break
    }
  }

  async function handleUnlink(path: string) {
    const moduleIds = _extensionGraph.get(path)
    _extensionGraph.delete(path)

    if (!moduleIds) {
      return
    }

    for (const moduleId of moduleIds) {
      const module = server?.moduleGraph.getModuleById(moduleId)

      if (module) {
        await server?.reloadModule(module)
      }
    }
  }

  return {
    name: "@medusajs/admin-vite-plugin",
    enforce: "pre",
    configureServer(_server) {
      server = _server
      watcher = _server.watcher

      _sources.forEach((source) => {
        watcher?.add(source)
      })

      watcher.on("all", async (event, path) => {
        switch (event) {
          case "add":
          case "change": {
            await handleAddOrChange(path, event)
            break
          }
          case "unlinkDir":
          case "unlink":
            await handleUnlink(path)
            break
          default:
            break
        }
      })
    },
    resolveId(id) {
      if (VIRTUAL_MODULES.includes(id)) {
        return resolveVirtualId(id)
      }

      return null
    },
    async load(id) {
      if (RESOLVED_WIDGET_MODULES.includes(id)) {
        const zone = getWidgetZone(id)
        return loadVirtualModule(id, { type: "widget", get: zone })
      }

      if (RESOLVED_ROUTE_MODULES.includes(id)) {
        const type = id.includes("link") ? "link" : "page"
        return loadVirtualModule(id, { type: "route", get: type })
      }

      if (RESOLVED_FORM_MODULES.includes(id)) {
        console.log("NOT IMPLEMENTED")
      }

      if (RESOLVED_CONTAINER_MODULES.includes(id)) {
        console.log("NOT IMPLEMENTED")
      }
    },
    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    },
  }
}
