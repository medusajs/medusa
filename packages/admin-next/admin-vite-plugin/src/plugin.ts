import {
  InjectionZone,
  RESOLVED_ROUTE_MODULES,
  RESOLVED_SETTING_MODULES,
  RESOLVED_WIDGET_MODULES,
  VIRTUAL_MODULES,
  getWidgetImport,
  getWidgetZone,
  id,
  isValidInjectionZone,
  resolve,
} from "@medusajs/admin-shared"
import { fdir } from "fdir"
import fs from "fs/promises"
import MagicString from "magic-string"
import path from "path"
import type * as Vite from "vite"

import {
  parse,
  traverse,
  type ExportDefaultDeclaration,
  type ExportNamedDeclaration,
  type File,
  type NodePath,
  type ObjectProperty,
  type ParseResult,
  type ParserOptions,
} from "./babel"

// const traverse = (_traverse as any).default as typeof _traverse
// const traverse = _traverse

let debug = false

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
  } else if (normalizedPath.includes(path.normalize("/admin/settings/"))) {
    return "setting"
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
      configDeclaration.init?.type === "ObjectExpression"
    ) {
      return configDeclaration.init.properties
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
    if (debug) {
      console.log(`[DEBUG]: Error traversing file ${file}: ${err}`)
    }

    return { valid: false, zone: _zoneValue }
  }

  return { valid: hasNamedExport && hasDefaultExport, zone: _zoneValue }
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

  if (debug) {
    console.log(
      `[DEBUG]: Found ${
        files.length
      } widget files for zone ${zone}: [${files.join(", ")}]`
    )
  }

  const validatedWidgets = (
    await Promise.all(
      files.map(async (widget) => {
        const { valid } = await validateWidget(widget, zone)
        return valid ? widget : null
      })
    )
  ).filter(Boolean) as string[]

  if (debug) {
    console.log(
      `[DEBUG]: ${validatedWidgets.length} widgets passed validation for zone ${zone}`
    )
  }

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

type LoadModuleOptions =
  | {
      type: "widget"
      get: InjectionZone
    }
  | {
      type: "route" | "setting"
      get: string
    }

export type MedusaVitePluginOptions = {
  /**
   * A list of directories to source extensions from.
   */
  sources?: string[]
  /**
   * Whether to enable debug mode.
   */
  debug?: boolean
}

export type MedusaVitePlugin = (config?: MedusaVitePluginOptions) => Vite.Plugin
export const medusaVitePlugin: MedusaVitePlugin = (options) => {
  debug = options?.debug ?? false

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
        // TODO: Handle route module loading
        return null
      case "setting":
        // TODO: Handle setting module loading
        return null
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

  async function handleWidgetChange(file: string) {
    const { valid, zone } = await validateWidget(file)

    if (!valid) {
      _extensionGraph.delete(file)
      return
    }

    const zoneValues = Array.isArray(zone) ? zone : [zone]

    for (const zoneValue of zoneValues) {
      const zonePath = getWidgetImport(zoneValue)
      const moduleId = id(zonePath)
      const resolvedModuleId = resolve(moduleId)

      const module = server?.moduleGraph.getModuleById(resolvedModuleId)

      /**
       * If the module is not in our extension graph, we generate a new entrypoint
       * for the widget zone, to ensure that the widget is included in the bundle.
       */
      if (_extensionGraph.has(file)) {
        await generateWidgetEntrypoint(_sources, zoneValue)
      }

      /**
       * If the module is already in the module graph, we reload it to ensure that
       * the changes are reflected in the bundle.
       */
      if (module) {
        await server?.reloadModule(module)
      }
    }
  }

  async function handleAddOrChange(path: string) {
    const type = getModuleType(path)

    switch (type) {
      case "widget":
        await handleWidgetChange(path)
        break
      case "route":
        // Handle route change if necessary
        break
      case "setting":
        // Handle setting change if necessary
        break
      default:
        // Handle other types if necessary
        break
    }
  }

  async function handleUnlink(path: string) {
    const moduleIds = _extensionGraph.get(path)

    if (!moduleIds) {
      return
    }

    for (const moduleId of moduleIds) {
      const module = server?.moduleGraph.getModuleById(moduleId)

      if (module) {
        _extensionGraph.delete(path)
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
            await handleAddOrChange(path)
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
        return resolve(id)
      }

      return null
    },
    async load(id) {
      if (RESOLVED_WIDGET_MODULES.includes(id)) {
        const zone = getWidgetZone(id)

        return register(id, { type: "widget", get: zone })
      }

      if (RESOLVED_ROUTE_MODULES.includes(id)) {
        return `export const msg = "Hello from virtual route!";`
      }

      if (RESOLVED_SETTING_MODULES.includes(id)) {
        return `export const msg = "Hello from virtual setting!";`
      }
    },
    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    },
  }
}
