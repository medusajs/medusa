import {
  type CustomFieldImportType,
  RESOLVED_CUSTOM_FIELD_DISPLAY_MODULES,
  RESOLVED_CUSTOM_FIELD_FORM_CONFIG_MODULES,
  RESOLVED_CUSTOM_FIELD_FORM_FIELD_MODULES,
  RESOLVED_CUSTOM_FIELD_LINK_MODULES,
  RESOLVED_ROUTE_MODULES,
  RESOLVED_WIDGET_MODULES,
  VIRTUAL_MODULES,
  getVirtualId,
  getWidgetImport,
  getWidgetZone,
  resolveVirtualId,
} from "@medusajs/admin-shared"
import path from "path"
import type * as Vite from "vite"
import {
  generateCustomFieldDisplayEntrypoint,
  generateCustomFieldFormConfigEntrypoint,
  getCustomFieldGraphPath,
  validateCustomFieldDisplay,
  validateCustomFieldFormConfig,
} from "./custom-fields"
import {
  generateCustomFieldFormFieldEntrypoint,
  validateCustomFieldFormField,
} from "./custom-fields/fields"
import {
  generateCustomFieldLinkEntrypoint,
  validateCustomFieldLink,
} from "./custom-fields/links"
import { generateRouteEntrypoint, validateRoute } from "./routes"
import { ExtensionGraph, LoadModuleOptions, MedusaVitePlugin } from "./types"
import {
  getCustomFieldConfigParams,
  getCustomFieldDisplayParams,
  getCustomFieldFieldParams,
  getCustomFieldLinkParams,
} from "./utils"
import { isVirtualModule } from "./virtual/utils"
import { generateWidgetEntrypoint, validateWidget } from "./widgets"

// const EVENT_ADD = "add"
// const EVENT_CHANGE = "change"

function isCustomFieldModule(type: any): type is CustomFieldImportType {
  return ["link", "config", "field", "display"].includes(type)
}

function getExtensionGraphPath(
  path: string,
  type: "link" | "config" | "field" | "display" | "widget" | "route"
) {
  if (isCustomFieldModule(type)) {
    return getCustomFieldGraphPath(path, type)
  }

  return path
}

export const medusaVitePlugin: MedusaVitePlugin = (options) => {
  const _extensionGraph: ExtensionGraph = new Map<string, Set<string>>()
  const _sources = new Set<string>(options?.sources ?? [])

  let watcher: Vite.FSWatcher | undefined

  async function generateEntrypoint(options: LoadModuleOptions) {
    switch (options.type) {
      case "widget":
        return await generateWidgetEntrypoint(_sources, options.get)
      case "route":
        return await generateRouteEntrypoint(_sources, options.get)
      case "config":
        return await generateCustomFieldFormConfigEntrypoint(
          _sources,
          options.get
        )
      case "field":
        return await generateCustomFieldFormFieldEntrypoint(
          _sources,
          options.get
        )
      case "display":
        return await generateCustomFieldDisplayEntrypoint(_sources, options.get)
      case "link":
        return await generateCustomFieldLinkEntrypoint(_sources, options.get)
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
      const extensionGraphPath = getExtensionGraphPath(path, options.type)
      const ids = _extensionGraph.get(extensionGraphPath) || new Set<string>()
      ids.add(id)
      _extensionGraph.set(extensionGraphPath, ids)
    }
    return module
  }

  function isFileInSources(file: string): boolean {
    for (const source of _sources) {
      if (file.startsWith(path.resolve(source))) {
        return true
      }
    }
    return false
  }

  return {
    name: "@medusajs/admin-vite-plugin",
    enforce: "pre",
    configureServer(_server) {
      watcher = _server.watcher

      watcher?.add(Array.from(_sources))
    },
    resolveId(id) {
      if (VIRTUAL_MODULES.includes(id)) {
        return resolveVirtualId(id)
      }
      return null
    },
    async load(id) {
      if (RESOLVED_WIDGET_MODULES.includes(id)) {
        return loadVirtualModule(id, { type: "widget", get: getWidgetZone(id) })
      }
      if (RESOLVED_ROUTE_MODULES.includes(id)) {
        return loadVirtualModule(id, {
          type: "route",
          get: id.includes("link") ? "link" : "page",
        })
      }
      if (RESOLVED_CUSTOM_FIELD_FORM_CONFIG_MODULES.includes(id)) {
        const params = getCustomFieldConfigParams(id)

        if (!params) {
          return
        }

        return loadVirtualModule(id, {
          type: "config",
          get: params,
        })
      }
      if (RESOLVED_CUSTOM_FIELD_FORM_FIELD_MODULES.includes(id)) {
        const params = getCustomFieldFieldParams(id)

        if (!params) {
          return
        }

        return loadVirtualModule(id, {
          type: "field",
          get: params,
        })
      }
      if (RESOLVED_CUSTOM_FIELD_DISPLAY_MODULES.includes(id)) {
        const params = getCustomFieldDisplayParams(id)

        if (!params) {
          return
        }

        return loadVirtualModule(id, {
          type: "display",
          get: params,
        })
      }
      if (RESOLVED_CUSTOM_FIELD_LINK_MODULES.includes(id)) {
        const params = getCustomFieldLinkParams(id)

        if (!params) {
          return
        }

        return loadVirtualModule(id, {
          type: "link",
          get: params,
        })
      }
    },
    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    },
    async handleHotUpdate(ctx) {
      if (!isFileInSources(ctx.file)) {
        return
      }

      for (const module of ctx.modules) {
        const importers = module.importers

        for (const importer of importers) {
          if (!isVirtualModule(importer.url)) {
            continue
          }

          const type = getVirtualModuleType(importer.url)

          if (!type) {
            continue
          }

          let valid = false
          let shouldReload = false

          switch (type) {
            case "widgets": {
              const result = await validateWidget(ctx.file)
              valid = result.valid
              break
            }
            case "routes": {
              const routeType = getRouteType(importer.url)

              if (!routeType) {
                console.log("routeType", routeType, importer.url)
                continue
              }

              console.log("routeType", routeType)

              const result = await validateRoute(ctx.file, routeType === "link")
              valid = result.valid
              shouldReload = routeType === "link"
              break
            }
            case "custom-fields": {
              const customFieldType = getCustomFieldType(importer.url)

              if (!customFieldType) {
                continue
              }

              shouldReload = true
              switch (customFieldType) {
                case "config": {
                  const result = await validateCustomFieldFormConfig(ctx.file)

                  valid = result.valid
                  break
                }
                case "field": {
                  const result = await validateCustomFieldFormField(ctx.file)

                  valid = result.valid
                  break
                }
                case "display": {
                  const result = await validateCustomFieldDisplay(ctx.file)

                  valid = result.valid
                  break
                }
                case "link": {
                  const result = await validateCustomFieldLink(ctx.file)

                  valid = result.valid
                  break
                }
              }
            }
          }

          const mod = await ctx.server.moduleGraph.getModuleByUrl(importer.url)

          if (!mod) {
            continue
          }

          if (!valid || shouldReload) {
            // Remove the module from the module graph
            ctx.server.moduleGraph.invalidateModule(mod)
            await ctx.server.reloadModule(mod)
            continue
          }
        }

        const extensionType = getExtensionFolder(ctx.file)

        console.log("module", module.id)
        console.log(
          "importers",
          Array.from(importers).map((i) => i.url)
        )

        /**
         * If importers is an empty Set, that means that it is not being imported by any virtual module.
         * We should re-evaluate the file and see if it should be added to the virtual modules.
         */
        if (importers.size === 0) {
          if (!extensionType) {
            continue
          }

          switch (extensionType) {
            case "widgets": {
              const { valid, zone } = await validateWidget(ctx.file)

              if (!valid) {
                break
              }

              const zoneValues = Array.isArray(zone) ? zone : [zone]

              for (const zone of zoneValues) {
                const zonePath = getWidgetImport(zone)
                const virtualModuleId = getVirtualId(zonePath)
                const resolvedVirtualModuleId =
                  resolveVirtualId(virtualModuleId)

                const mod = ctx.server.moduleGraph.getModuleById(
                  resolvedVirtualModuleId
                )

                if (!mod) {
                  continue
                }

                ctx.server.moduleGraph.invalidateModule(mod)
                await ctx.server.reloadModule(mod)
              }

              break
            }
            case "routes": {
              const { valid, config } = await validateRoute(ctx.file)

              if (!valid) {
                break
              }

              for (const resolvedVirtualModuleId of RESOLVED_ROUTE_MODULES) {
                /**
                 * If the route does not have a config, then there is no need to reload the link module.
                 */
                if (!config && resolvedVirtualModuleId.endsWith("link")) {
                  console.log(
                    "Skipping reload of link module because route does not have a config"
                  )
                  continue
                }

                const mod = ctx.server.moduleGraph.getModuleById(
                  resolvedVirtualModuleId
                )

                if (!mod) {
                  continue
                }

                await ctx.server.reloadModule(mod)
              }

              break
            }
            case "custom-fields": {
              const validationResults = [
                {
                  result: await validateCustomFieldFormConfig(ctx.file),
                  modules: RESOLVED_CUSTOM_FIELD_FORM_CONFIG_MODULES,
                },
                {
                  result: await validateCustomFieldFormField(ctx.file),
                  modules: RESOLVED_CUSTOM_FIELD_FORM_FIELD_MODULES,
                },
                {
                  result: await validateCustomFieldDisplay(ctx.file),
                  modules: RESOLVED_CUSTOM_FIELD_DISPLAY_MODULES,
                },
                {
                  result: await validateCustomFieldLink(ctx.file),
                  modules: RESOLVED_CUSTOM_FIELD_LINK_MODULES,
                },
              ]

              for (const { result, modules } of validationResults) {
                if (result.valid) {
                  const paths = result.paths.map((path) =>
                    path.replace(".", "/")
                  )
                  const resolvedPaths = modules.filter((resolved) =>
                    paths.some((p) => resolved.includes(p))
                  )

                  for (const path of resolvedPaths) {
                    const mod = ctx.server.moduleGraph.getModuleById(path)
                    if (mod) {
                      await ctx.server.reloadModule(mod)
                    }
                  }
                }
              }
              break
            }
          }
        }

        /**
         * If there is a change to a route file, and it's currently only being imported by one
         * virtual module (e.g. the pages module), then we should check if it now contains a
         * config with a label. If so, we should reload the links module.
         */
        if (extensionType === "routes" && importers.size === 1) {
          const result = await validateRoute(ctx.file, true)

          if (result.valid) {
            const resolvedId = RESOLVED_ROUTE_MODULES.find((id) =>
              id.endsWith("link")
            )

            if (!resolvedId) {
              continue
            }

            const mod = ctx.server.moduleGraph.getModuleById(resolvedId)

            if (!mod) {
              continue
            }

            await ctx.server.reloadModule(mod)
          }
        }
      }
    },
  }
}

function getCustomFieldType(
  file: string
): "config" | "field" | "display" | "link" | null {
  const customFieldType = file.split("/").pop()

  if (customFieldType === "$config") {
    return "config"
  }

  if (customFieldType === "$field") {
    return "field"
  }

  if (customFieldType === "$display") {
    return "display"
  }

  if (customFieldType === "$link") {
    return "link"
  }

  return null
}

function getRouteType(file: string): "link" | "page" | null {
  const routeType = file.split("/").pop()

  if (routeType === "links") {
    return "link"
  }

  if (routeType === "pages") {
    return "page"
  }

  return null
}

export type VirtualModuleType = "widgets" | "routes" | "custom-fields"

function getVirtualModuleType(url: string): VirtualModuleType | null {
  const urlParts = url.split("/")
  if (urlParts.length <= 1) {
    return null
  }

  const type = urlParts[1]

  if (isVirtualModuleType(type)) {
    return type
  }

  return null
}

function isVirtualModuleType(type: string): type is VirtualModuleType {
  return ["widgets", "routes", "custom-fields"].includes(type)
}

function getExtensionFolder(
  file: string
): "widgets" | "routes" | "custom-fields" | null {
  const normalizedPath = file.replace(/\\/g, "/")

  const match = normalizedPath.match(/\/src\/admin\/(\w+)\//)
  if (!match) {
    return null
  }

  const type = match[1]
  switch (type) {
    case "widgets":
      return "widgets"
    case "routes":
      return "routes"
    case "custom-fields":
      return "custom-fields"
    default:
      return null
  }
}
