import {
  InjectionZone,
  RESOLVED_ROUTE_MODULES,
  RESOLVED_WIDGET_MODULES,
  VIRTUAL_MODULES,
  getVirtualId,
  getWidgetImport,
  getWidgetZone,
  isValidInjectionZone,
  resolveVirtualId,
} from "@medusajs/admin-shared"
import { fdir } from "fdir"
import fs from "fs/promises"
import MagicString from "magic-string"
import path from "path"
import type * as Vite from "vite"

import {
  ExportNamedDeclaration,
  ObjectProperty,
  parse,
  traverse,
  type ExportDefaultDeclaration,
  type File,
  type NodePath,
  type ParseResult,
  type ParserOptions,
} from "./babel"

const VALID_FILE_EXTENSIONS = [".tsx", ".jsx"]

/**
 * Returns the module type of a given file.
 */
function getModuleType(file: string) {
  const normalizedPath = path.normalize(file)

  if (normalizedPath.includes(path.normalize("/admin/widgets/"))) {
    return "widget"
  } else if (normalizedPath.includes(path.normalize("/admin/routes/"))) {
    return "route"
  } else {
    return "none"
  }
}

/**
 * Returns the parser options for a given file.
 */
function getParserOptions(file: string): ParserOptions {
  const options: ParserOptions = {
    sourceType: "module",
    plugins: ["jsx"],
  }

  if (file.endsWith(".tsx")) {
    options.plugins?.push("typescript")
  }

  return options
}

/**
 * Generates a module with a source map from a code string
 */
function generateModule(code: string) {
  const magicString = new MagicString(code)

  return {
    code: magicString.toString(),
    map: magicString.generateMap({ hires: true }),
  }
}

/**
 * Crawls a directory and returns all files that match the criteria.
 */
async function crawl(
  dir: string,
  file?: string,
  depth?: { min: number; max?: number }
) {
  const dirDepth = dir.split(path.sep).length

  const crawler = new fdir()
    .withBasePath()
    .exclude((dirName) => dirName.startsWith("_"))
    .filter((path) => {
      return VALID_FILE_EXTENSIONS.some((ext) => path.endsWith(ext))
    })

  if (file) {
    crawler.filter((path) => {
      return VALID_FILE_EXTENSIONS.some((ext) => path.endsWith(file + ext))
    })
  }

  if (depth) {
    crawler.filter((file) => {
      const pathDepth = file.split(path.sep).length - 1

      if (depth.max && pathDepth > dirDepth + depth.max) {
        return false
      }

      if (pathDepth < dirDepth + depth.min) {
        return false
      }

      return true
    })
  }

  return crawler.crawl(dir).withPromise()
}

/**
 * Extracts and returns the properties of a `config` object from a named export declaration.
 */
function getConfigObjectProperties(path: NodePath<ExportNamedDeclaration>) {
  const declaration = path.node.declaration

  if (declaration && declaration.type === "VariableDeclaration") {
    const configDeclaration = declaration.declarations.find(
      (d) =>
        d.type === "VariableDeclarator" &&
        d.id.type === "Identifier" &&
        d.id.name === "config"
    )

    if (
      configDeclaration &&
      configDeclaration.init?.type === "CallExpression" &&
      configDeclaration.init.arguments.length > 0 &&
      configDeclaration.init.arguments[0].type === "ObjectExpression"
    ) {
      return configDeclaration.init.arguments[0].properties
    }
  }

  return null
}

/**
 * Validates if the default export in a given AST is a component (JSX element or fragment).
 */
function isDefaultExportComponent(
  path: NodePath<ExportDefaultDeclaration>,
  ast: File
): boolean {
  let hasComponentExport = false
  const declaration = path.node.declaration

  if (
    declaration &&
    (declaration.type === "Identifier" ||
      declaration.type === "FunctionDeclaration")
  ) {
    const exportName =
      declaration.type === "Identifier"
        ? declaration.name
        : declaration.id && declaration.id.name

    if (exportName) {
      try {
        traverse(ast, {
          VariableDeclarator({ node, scope }) {
            let isDefaultExport = false

            if (node.id.type === "Identifier" && node.id.name === exportName) {
              isDefaultExport = true
            }

            if (!isDefaultExport) {
              return
            }

            traverse(
              node,
              {
                ReturnStatement(path) {
                  if (
                    path.node.argument?.type === "JSXElement" ||
                    path.node.argument?.type === "JSXFragment"
                  ) {
                    hasComponentExport = true
                  }
                },
              },
              scope
            )
          },
        })
      } catch (e) {
        return false
      }
    }
  }

  return hasComponentExport
}

/** Widget utilities */

/**
 * Validates the widget configuration.
 */
function validateWidgetConfig(
  path: NodePath<ExportNamedDeclaration>,
  zone?: InjectionZone
): { zoneIsValid: boolean; zoneValue: string | string[] | null } {
  let zoneIsValid = false
  let zoneValue: string | string[] | null = null

  const properties = getConfigObjectProperties(path)

  if (!properties) {
    return { zoneIsValid, zoneValue }
  }

  const zoneProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "zone"
  ) as ObjectProperty | undefined

  if (!zoneProperty) {
    return { zoneIsValid, zoneValue }
  }

  if (zoneProperty.value.type === "StringLiteral") {
    zoneIsValid = !zone
      ? isValidInjectionZone(zoneProperty.value.value)
      : zone === zoneProperty.value.value
    zoneValue = zoneProperty.value.value
  } else if (zoneProperty.value.type === "ArrayExpression") {
    zoneIsValid = zoneProperty.value.elements.every((e) => {
      if (!e || e.type !== "StringLiteral") {
        return false
      }

      const isZoneMatch = !zone ? true : zone === e.value

      return isValidInjectionZone(e.value) && isZoneMatch
    })

    const values: string[] = []

    for (const element of zoneProperty.value.elements) {
      if (element && element.type === "StringLiteral") {
        values.push(element.value)
      }
    }

    zoneValue = values
  }

  return { zoneIsValid, zoneValue }
}

/**
 * Validates a widget file.
 */
async function validateWidget(
  file: string,
  zone?: InjectionZone
): Promise<
  { valid: true; zone: InjectionZone } | { valid: false; zone: null }
> {
  let _zoneValue: string | string[] | null = null

  const content = await fs.readFile(file, "utf-8")
  const parserOptions = getParserOptions(file)

  let ast: ParseResult<File>

  try {
    ast = parse(content, parserOptions)
  } catch (e) {
    return { valid: false, zone: _zoneValue }
  }

  let hasDefaultExport = false
  let hasNamedExport = false

  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        hasDefaultExport = isDefaultExportComponent(path, ast)
      },
      ExportNamedDeclaration(path) {
        const { zoneIsValid, zoneValue } = validateWidgetConfig(path, zone)

        hasNamedExport = zoneIsValid
        _zoneValue = zoneValue
      },
    })
  } catch (err) {
    return { valid: false, zone: _zoneValue }
  }

  return { valid: hasNamedExport && hasDefaultExport, zone: _zoneValue as any }
}

async function generateWidgetEntrypoint(
  sources: Set<string>,
  zone: InjectionZone
) {
  const files = (
    await Promise.all(
      Array.from(sources).map(async (source) => crawl(`${source}/widgets`))
    )
  ).flat()

  const validatedWidgets = (
    await Promise.all(
      files.map(async (widget) => {
        const { valid } = await validateWidget(widget, zone)
        return valid ? widget : null
      })
    )
  ).filter(Boolean) as string[]

  if (!validatedWidgets.length) {
    const code = `export default {
        widgets: [],
      }`

    return { module: generateModule(code), paths: [] }
  }

  const importString = validatedWidgets
    .map((path, index) => `import WidgetExt${index} from "${path}";`)
    .join("\n")

  const exportString = `export default {
      widgets: [${validatedWidgets
        .map((_, index) => `{ Component: WidgetExt${index} }`)
        .join(", ")}],
    }`

  const code = `${importString}\n${exportString}`

  return { module: generateModule(code), paths: validatedWidgets }
}

/** Route utilities */

function validateRouteConfig(
  path: NodePath<ExportNamedDeclaration>,
  resolveMenuItem: boolean
) {
  const properties = getConfigObjectProperties(path)

  /**
   * When resolving links for the sidebar, we a config to get the props needed to
   * render the link correctly.
   *
   * If the user has not provided any config, then the route can never be a valid
   * menu item, so we can skip the validation, and return false.
   */
  if (!properties && resolveMenuItem) {
    return false
  }

  /**
   * A config is not required for a component to be a valid route.
   */
  if (!properties) {
    return true
  }

  const labelProperty = properties.find(
    (p) =>
      p.type === "ObjectProperty" &&
      p.key.type === "Identifier" &&
      p.key.name === "label"
  ) as ObjectProperty | undefined

  const labelIsValid =
    !labelProperty || labelProperty.value.type === "StringLiteral"

  return labelIsValid
}

async function validateRoute(file: string, resolveMenuItem = false) {
  const content = await fs.readFile(file, "utf-8")
  const parserOptions = getParserOptions(file)

  let ast: ParseResult<File>

  try {
    ast = parse(content, parserOptions)
  } catch (_e) {
    return false
  }

  let hasDefaultExport = false
  let hasNamedExport = resolveMenuItem ? false : true

  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        hasDefaultExport = isDefaultExportComponent(path, ast)
      },
      ExportNamedDeclaration(path) {
        hasNamedExport = validateRouteConfig(path, resolveMenuItem)
      },
    })
  } catch (_e) {
    return false
  }

  return hasNamedExport && hasDefaultExport
}

function createRoutePath(file: string) {
  return file
    .replace(/.*\/admin\/(routes|settings)/, "")
    .replace(/\[([^\]]+)\]/g, ":$1")
    .replace(/\/page\.(tsx|jsx)/, "")
}

async function generateRouteEntrypoint(
  sources: Set<string>,
  type: "page" | "link"
) {
  const files = (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/routes`, "page", { min: 1 })
      )
    )
  ).flat()

  const validatedRoutes = (
    await Promise.all(
      files.map(async (route) => {
        const valid = await validateRoute(route, type === "link")
        return valid ? route : null
      })
    )
  ).filter(Boolean) as string[]

  if (!validatedRoutes.length) {
    const code = `export default {
        ${type}s: [],
      }`

    return { module: generateModule(code), paths: [] }
  }

  const importString = validatedRoutes
    .map((path, index) => {
      return type === "page"
        ? `import RouteExt${index} from "${path}";`
        : `import { config as routeConfig${index} } from "${path}";`
    })
    .join("\n")

  const exportString = `export default {
      ${type}s: [${validatedRoutes
    .map((file, index) => {
      return type === "page"
        ? `{ path: "${createRoutePath(file)}", Component: RouteExt${index} }`
        : `{ path: "${createRoutePath(file)}", ...routeConfig${index} }`
    })
    .join(", ")}],
    }`

  const code = `${importString}\n${exportString}`

  return { module: generateModule(code), paths: validatedRoutes }
}

type LoadModuleOptions =
  | {
      type: "widget"
      get: InjectionZone
    }
  | {
      type: "route"
      get: "page" | "link"
    }

export type MedusaVitePluginOptions = {
  /**
   * A list of directories to source extensions from.
   */
  sources?: string[]
}

export type MedusaVitePlugin = (config?: MedusaVitePluginOptions) => Vite.Plugin
export const medusaVitePlugin: MedusaVitePlugin = (options) => {
  const _extensionGraph = new Map<string, Set<string>>()
  const _sources = new Set<string>(options?.sources ?? [])

  let server: Vite.ViteDevServer | undefined
  let watcher: Vite.FSWatcher | undefined

  async function loadModule(options: LoadModuleOptions) {
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

  async function register(id: string, options: LoadModuleOptions) {
    const result = await loadModule(options)

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

  async function handleWidgetChange(file: string, event: "add" | "change") {
    const { valid, zone } = await validateWidget(file)
    const zoneValues = Array.isArray(zone) ? zone : [zone]

    if (event === "change") {
      /**
       * If the file is in the extension graph, and it has become
       * invalid, we need to remove it from the graph and reload all modules
       * that import the widget.
       */
      if (!valid) {
        const extensionIds = _extensionGraph.get(file)
        _extensionGraph.delete(file)

        if (!extensionIds) {
          return
        }

        for (const moduleId of extensionIds) {
          const module = server?.moduleGraph.getModuleById(moduleId)

          if (module) {
            await server?.reloadModule(module)
          }
        }

        return
      }

      /**
       * If the file is not in the extension graph, we need to add it.
       * We also need to reload all modules that import the widget.
       */
      if (!_extensionGraph.has(file)) {
        const imports = new Set<string>()

        for (const zoneValue of zoneValues) {
          const zonePath = getWidgetImport(zoneValue)
          const moduleId = getVirtualId(zonePath)
          const resolvedModuleId = resolveVirtualId(moduleId)
          const module = server?.moduleGraph.getModuleById(resolvedModuleId)
          if (module) {
            imports.add(resolvedModuleId)
            await server?.reloadModule(module)
          }
        }

        _extensionGraph.set(file, imports)
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

    if (event === "add") {
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
      const imports = new Set<string>()

      for (const zoneValue of zoneValues) {
        const zonePath = getWidgetImport(zoneValue)
        const moduleId = getVirtualId(zonePath)
        const resolvedModuleId = resolveVirtualId(moduleId)

        const module = server?.moduleGraph.getModuleById(resolvedModuleId)

        if (module) {
          imports.add(resolvedModuleId)
          await server?.reloadModule(module)
        }
      }

      _extensionGraph.set(file, imports)
    }
  }

  async function handleRouteChange(file: string, event: "add" | "change") {
    const valid = await validateRoute(file)

    if (event === "change") {
      /**
       * If the file is in the extension graph, and it has become
       * invalid, we need to remove it from the graph and reload all modules
       * that import the route.
       */
      if (!valid) {
        const extensionIds = _extensionGraph.get(file)
        _extensionGraph.delete(file)

        if (!extensionIds) {
          return
        }

        for (const moduleId of extensionIds) {
          const module = server?.moduleGraph.getModuleById(moduleId)

          if (module) {
            await server?.reloadModule(module)
          }
        }

        return
      }

      /**
       * If the file is not in the extension graph, we need to add it.
       * We also need to reload all modules that import the route.
       */
      if (!_extensionGraph.has(file)) {
        const moduleId = getVirtualId(file)
        const resolvedModuleId = resolveVirtualId(moduleId)
        const module = server?.moduleGraph.getModuleById(resolvedModuleId)
        if (module) {
          await server?.reloadModule(module)
        }
      }

      if (_extensionGraph.has(file)) {
        const modules = _extensionGraph.get(file)

        if (!modules) {
          return
        }

        for (const moduleId of modules) {
          const module = server?.moduleGraph.getModuleById(moduleId)

          if (module) {
            await server?.reloadModule(module)
          }
        }
      }
    }

    if (event === "add") {
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

  async function handleAddOrChange(path: string, event: "add" | "change") {
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

        return register(id, { type: "widget", get: zone })
      }

      if (RESOLVED_ROUTE_MODULES.includes(id)) {
        const type = id.includes("link") ? "link" : "page"
        return register(id, { type: "route", get: type })
      }
    },
    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    },
  }
}
