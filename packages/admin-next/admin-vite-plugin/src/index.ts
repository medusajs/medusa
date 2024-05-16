import { ParseResult, ParserOptions, parse } from "@babel/parser"
import _traverse, { NodePath } from "@babel/traverse"
import {
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  File,
  ObjectExpression,
  ObjectProperty,
} from "@babel/types"
import chokidar from "chokidar"
import { fdir } from "fdir"
import fs from "fs/promises"
import MagicString from "magic-string"
import path from "path"
import { Logger, PluginOption, ViteDevServer } from "vite"

import { InjectionZone, injectionZones } from "@medusajs/admin-shared"

const traverse = (_traverse as any).default as typeof _traverse

const VIRTUAL_PREFIX = "/@virtual/medusajs-admin-vite-plugin/"
const IMPORT_PREFIX = "medusa-admin:"

const WIDGET_MODULE = `${IMPORT_PREFIX}widgets/`
const WIDGET_MODULES = injectionZones.map((zone) => {
  return `${WIDGET_MODULE}${zone.replace(/\./g, "/")}`
})

const ROUTE_PAGE_MODULE = `${IMPORT_PREFIX}routes/pages`
const ROUTE_LINK_MODULE = `${IMPORT_PREFIX}routes/links`

const ROUTE_MODULES = [ROUTE_PAGE_MODULE, ROUTE_LINK_MODULE]

const SETTING_PAGE_MODULE = `${IMPORT_PREFIX}settings/pages`
const SETTING_CARD_MODULE = `${IMPORT_PREFIX}settings/cards`

const SETTING_MODULE = [SETTING_PAGE_MODULE, SETTING_CARD_MODULE]

const MODULES = [...WIDGET_MODULES, ...ROUTE_MODULES, ...SETTING_MODULE]

type InjectArgs = {
  sources?: string[]
}

type LoadModuleOptions =
  | { type: "widget"; get: InjectionZone }
  | { type: "route"; get: "page" | "link" }
  | { type: "setting"; get: "page" | "card" }

export default function inject(args?: InjectArgs): PluginOption {
  const _extensionGraph = new Map<string, Set<string>>()
  const _sources = new Set<string>([...(args?.sources || [])])

  let server: ViteDevServer
  let watcher: chokidar.FSWatcher
  let logger: Logger

  /**
   * Traverses the directory and returns all files that ends with .tsx or .jsx,
   * excluding files in subdirectories that starts with _.
   *
   * @param dir - The directory to traverse
   * @param file - The file name to filter by without extension
   * @param depth - The depth of the files to return
   */
  async function traverseDirectory(
    dir: string,
    file?: string,
    depth?: { min: number; max?: number }
  ) {
    const baseDepth = dir.split(path.sep).length

    const crawler = new fdir()
      .withBasePath()
      .exclude((dirName) => dirName.startsWith("_"))
      .filter((path) => path.endsWith(".tsx") || path.endsWith(".jsx"))

    if (file) {
      crawler.filter(
        (path) => path.endsWith(`${file}.tsx`) || path.endsWith(`${file}.jsx`)
      )
    }

    if (depth) {
      crawler.filter((file) => {
        const directoryDepth = file.split(path.sep).length - 1

        if (depth.max && directoryDepth > baseDepth + depth.max) {
          return false
        }

        if (directoryDepth < baseDepth + depth.min) {
          return false
        }

        return true
      })
    }

    return await crawler.crawl(dir).withPromise()
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
   * Validates that the default export of a file is a JSX component
   */
  function validateDefaultExport(
    path: NodePath<ExportDefaultDeclaration>,
    ast: ParseResult<File>
  ) {
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

              if (
                node.id.type === "Identifier" &&
                node.id.name === exportName
              ) {
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
          console.error(
            `An error occured while validating the default export of '${path}'. The following error must be resolved before continuing:\n${e}`
          )
          return false
        }
      }
    }

    return hasComponentExport
  }

  /**
   * Gets the properties of the config object in an extension file
   */
  function getProperties(path: NodePath<ExportNamedDeclaration>) {
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
   * Validates that the provided zone is a valid injection zone for a widget
   */
  function validateInjectionZone(zone: any): zone is InjectionZone {
    return injectionZones.includes(zone)
  }

  function validateWidgetConfig(
    path: NodePath<ExportNamedDeclaration>,
    zone?: InjectionZone
  ) {
    const properties = getProperties(path)

    if (!properties) {
      return { zoneIsValid: false, zoneValue: undefined }
    }

    const zoneProperty = properties.find(
      (p) =>
        p.type === "ObjectProperty" &&
        p.key.type === "Identifier" &&
        p.key.name === "zone"
    ) as ObjectProperty | undefined

    if (!zoneProperty) {
      return { zoneIsValid: false, zoneValue: undefined }
    }

    let zoneIsValid = false
    let zoneValue: string | string[] | undefined = undefined

    if (zoneProperty.value.type === "StringLiteral") {
      zoneIsValid = !zone
        ? validateInjectionZone(zoneProperty.value.value)
        : zone === zoneProperty.value.value
      zoneValue = zoneProperty.value.value
    } else if (zoneProperty.value.type === "ArrayExpression") {
      zoneIsValid = zoneProperty.value.elements.every((_zone) => {
        if (!_zone || _zone.type !== "StringLiteral") {
          return false
        }

        const isZoneMatch = !zone ? true : zone === _zone.value

        return validateInjectionZone(_zone.value) && isZoneMatch
      })

      zoneValue = zoneProperty.value.elements
        .map((e) => {
          if (e && e.type === "StringLiteral") {
            return e.value
          }
        })
        .filter(Boolean) as string[]
    }

    return { zoneIsValid, zoneValue }
  }

  async function validateWidget(file: string, zone?: InjectionZone) {
    const content = await fs.readFile(file, "utf-8")

    const parserOptions: ParserOptions = {
      sourceType: "module",
      plugins: ["jsx"],
    }

    if (file.endsWith(".tsx")) {
      parserOptions.plugins?.push("typescript")
    }

    let ast: ParseResult<File>

    try {
      ast = parse(content, parserOptions)
    } catch (err) {
      logger.error(
        `An error occured while parsing the content of ${file}:\n${err}`,
        {
          error: err as Error,
          timestamp: true,
        }
      )
      return { isValidWidget: false, zoneValue: undefined }
    }

    let hasDefaultExport = false
    let hasNamedExport = false
    let zoneValue: string | string[] | undefined

    try {
      traverse(ast, {
        ExportDefaultDeclaration(path) {
          hasDefaultExport = validateDefaultExport(path, ast)
        },
        ExportNamedDeclaration(path) {
          const { zoneIsValid, zoneValue: value } = validateWidgetConfig(
            path,
            zone
          )
          hasNamedExport = zoneIsValid
          zoneValue = value
        },
      })
    } catch (err) {
      logger.error(`An error occured while validating the content of ${file}`, {
        error: err as Error,
        timestamp: true,
      })

      return { isValidWidget: false, zoneValue: undefined }
    }

    return { isValidWidget: hasDefaultExport && hasNamedExport, zoneValue }
  }

  async function generateWidgetEntrypoint(zone: InjectionZone) {
    const files = (
      await Promise.all(
        Array.from(_sources).map(async (source) =>
          traverseDirectory(`${source}/widgets`)
        )
      )
    ).flat()

    const validatedWidgets = (
      await Promise.all(
        files.map(async (widget) => {
          const { isValidWidget } = await validateWidget(widget, zone)
          return isValidWidget ? widget : null
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

  function validateRouteConfig(
    path: NodePath<ExportNamedDeclaration>,
    requireLink: boolean
  ) {
    const properties = getProperties(path)

    if (!properties) {
      return false
    }

    const linkProperty = properties.find(
      (p) =>
        p.type === "ObjectProperty" &&
        p.key.type === "Identifier" &&
        p.key.name === "link"
    ) as ObjectProperty | undefined

    /**
     * Link is optional unless requireLink is true.
     */
    if (!linkProperty && !requireLink) {
      return true
    }

    const linkValue = linkProperty?.value as ObjectExpression | undefined

    if (!linkValue) {
      return false
    }

    let labelIsValid = false

    if (
      linkValue.properties.some(
        (p) =>
          p.type === "ObjectProperty" &&
          p.key.type === "Identifier" &&
          p.key.name === "label" &&
          p.value.type === "StringLiteral"
      )
    ) {
      labelIsValid = true
    }

    return labelIsValid
  }

  async function validateRoute(file: string, requireLink: boolean) {
    const content = await fs.readFile(file, "utf-8")

    const parserOptions: ParserOptions = {
      sourceType: "module",
      plugins: ["jsx"],
    }

    if (file.endsWith(".tsx")) {
      parserOptions.plugins?.push("typescript")
    }

    let ast: ParseResult<File>

    try {
      ast = parse(content, parserOptions)
    } catch (err) {
      logger.error("An error occured while validating a route.", {
        error: err as Error,
        timestamp: true,
      })
      return false
    }

    let hasDefaultExport = false
    let hasNamedExport = false

    try {
      traverse(ast, {
        ExportDefaultDeclaration(path) {
          hasDefaultExport = validateDefaultExport(path, ast)
        },
        ExportNamedDeclaration(path) {
          hasNamedExport = validateRouteConfig(path, requireLink)
        },
      })
    } catch (err) {
      logger.error("An error occured while validating a route.", {
        error: err as Error,
        timestamp: true,
      })
      return false
    }

    return hasDefaultExport && hasNamedExport
  }

  function createPath(file: string) {
    return file
      .replace(/.*\/admin\/(routes|settings)/, "")
      .replace(/\[([^\]]+)\]/g, ":$1")
      .replace(/\/page\.(tsx|jsx)/, "")
  }

  async function generateRouteEntrypoint(get: "page" | "link") {
    const files = (
      await Promise.all(
        Array.from(_sources).map(async (source) =>
          traverseDirectory(`${source}/routes`, "page", { min: 1 })
        )
      )
    ).flat()

    const validatedRoutes = (
      await Promise.all(
        files.map(async (route) => {
          const isValid = await validateRoute(route, get === "link")
          return isValid ? route : null
        })
      )
    ).filter(Boolean) as string[]

    if (!validatedRoutes.length) {
      const code = `export default {
        ${get}s: [],
      }`

      return { module: generateModule(code), paths: [] }
    }

    const importString = validatedRoutes
      .map((path, index) => {
        return get === "page"
          ? `import RouteExt${index} from "${path}";`
          : `import { config as routeConfig${index} } from "${path}";`
      })
      .join("\n")

    const exportString = `export default {
      ${get}s: [${validatedRoutes
      .map((file, index) => {
        return get === "page"
          ? `{ path: "${createPath(file)}", file: "${file}" }`
          : `{ path: "${createPath(file)}", ...routeConfig${index}.link }`
      })
      .join(", ")}],
    }`

    const code = `${importString}\n${exportString}`

    return { module: generateModule(code), paths: validatedRoutes }
  }

  async function validateSetting(file: string) {
    const content = await fs.readFile(file, "utf-8")

    const parserOptions: ParserOptions = {
      sourceType: "module",
      plugins: ["jsx"],
    }

    if (file.endsWith(".tsx")) {
      parserOptions.plugins?.push("typescript")
    }

    let ast: ParseResult<File>

    try {
      ast = parse(content, parserOptions)
    } catch (err) {
      logger.error("An error occured while validating a setting.", {
        error: err as Error,
        timestamp: true,
      })
      return false
    }

    let hasDefaultExport = false
    let hasNamedExport = false

    try {
      traverse(ast, {
        ExportDefaultDeclaration(path) {
          hasDefaultExport = validateDefaultExport(path, ast)
        },
        ExportNamedDeclaration(path) {
          hasNamedExport = validateSettingConfig(path)
        },
      })
    } catch (err) {
      logger.error("An error occured while validating a setting.", {
        error: err as Error,
        timestamp: true,
      })
      return false
    }

    return hasDefaultExport && hasNamedExport
  }

  function validateSettingConfig(path: NodePath<ExportNamedDeclaration>) {
    const properties = getProperties(path)

    if (!properties) {
      return false
    }

    const cardProperty = properties.find(
      (p) =>
        p.type === "ObjectProperty" &&
        p.key.type === "Identifier" &&
        p.key.name === "card"
    ) as ObjectProperty | undefined

    // Link property is required for settings
    if (!cardProperty) {
      return false
    }

    const cardValue = cardProperty.value as ObjectExpression

    let hasLabel = false
    let hasDescription = false

    if (
      cardValue.properties.some(
        (p) =>
          p.type === "ObjectProperty" &&
          p.key.type === "Identifier" &&
          p.key.name === "label" &&
          p.value.type === "StringLiteral"
      )
    ) {
      hasLabel = true
    }

    if (
      cardValue.properties.some(
        (p) =>
          p.type === "ObjectProperty" &&
          p.key.type === "Identifier" &&
          p.key.name === "description" &&
          p.value.type === "StringLiteral"
      )
    ) {
      hasDescription = true
    }

    return hasLabel && hasDescription
  }

  async function generateSettingEntrypoint(get: "page" | "card") {
    const files = (
      await Promise.all(
        Array.from(_sources).map(async (source) =>
          traverseDirectory(`${source}/settings`, "page", { min: 1, max: 1 })
        )
      )
    ).flat()

    const validatedSettings = (
      await Promise.all(
        files.map(async (setting) => {
          const isValid = await validateSetting(setting)
          return isValid ? setting : null
        })
      )
    ).filter(Boolean) as string[]

    if (!validatedSettings.length) {
      const code = `export default {
        ${get}s: [],
      }`

      return { module: generateModule(code), paths: [] }
    }

    const importString = validatedSettings
      .map((path, index) => {
        return get === "page"
          ? `import SettingExt${index} from "${path}";`
          : `import { config as settingConfig${index} } from "${path}";`
      })
      .join("\n")

    const exportString = `export default {
      ${get}s: [${validatedSettings
      .map((file, index) => {
        return get === "page"
          ? `{ path: "${createPath(file)}", file: "${file}" }`
          : `{ path: "${createPath(file)}", ...settingConfig${index}.card }`
      })
      .join(", ")}],
    }`

    const code = `${importString}\n${exportString}`

    return { module: generateModule(code), paths: validatedSettings }
  }

  async function loadModule(options: LoadModuleOptions) {
    switch (options.type) {
      case "widget": {
        return await generateWidgetEntrypoint(options.get)
      }
      case "route": {
        return await generateRouteEntrypoint(options.get)
      }
      case "setting": {
        return await generateSettingEntrypoint(options.get)
      }
    }
  }

  function getExtensionType(file: string) {
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

  async function handleWidgetChange(file: string) {
    const { isValidWidget, zoneValue } = await validateWidget(file)

    if (!isValidWidget || !zoneValue) {
      _extensionGraph.delete(file)
      return
    }

    const zoneValues = Array.isArray(zoneValue) ? zoneValue : [zoneValue]

    for (const zone of zoneValues) {
      const zonePath = zone.replace(/\./g, "/")
      const moduleId = `${VIRTUAL_PREFIX}${WIDGET_MODULE}${zonePath}`

      const module = server.moduleGraph.getModuleById(moduleId)

      if (module) {
        await server.reloadModule(module)
      }
    }
  }

  async function handleRouteChange(file: string) {
    const isValidRoute = await validateRoute(file, false)

    if (!isValidRoute) {
      _extensionGraph.delete(file)
      return
    }

    for (const moduleId of ROUTE_MODULES) {
      const fullModuleId = `${VIRTUAL_PREFIX}${moduleId}`
      const module = server.moduleGraph.getModuleById(fullModuleId)

      if (module) {
        await server.reloadModule(module)
      }
    }
  }

  async function handleSettingChange(file: string) {
    const isValidSetting = await validateSetting(file)

    if (!isValidSetting) {
      _extensionGraph.delete(file)
      return
    }

    for (const moduleId of SETTING_MODULE) {
      const fullModuleId = `${VIRTUAL_PREFIX}${moduleId}`
      const module = server.moduleGraph.getModuleById(fullModuleId)

      if (module) {
        await server.reloadModule(module)
      }
    }
  }

  async function handleExtensionUnlink(file: string) {
    const moduleIds = _extensionGraph.get(file)

    if (!moduleIds) {
      return
    }

    for (const moduleId of moduleIds) {
      const module = server.moduleGraph.getModuleById(moduleId)

      if (module) {
        _extensionGraph.delete(file)
        await server.reloadModule(module)
      }
    }
  }

  async function loadModuleAndUpdateGraph(
    id: string,
    options: LoadModuleOptions
  ) {
    const { module, paths } = await loadModule(options)

    for (const path of paths) {
      const ids = _extensionGraph.get(path) || new Set<string>()
      ids.add(id)
      _extensionGraph.set(path, ids)
    }

    return module
  }

  return {
    name: "@medusajs/admin-vite-plugin",
    configureServer(s) {
      server = s
      logger = s.config.logger

      watcher = chokidar.watch(Array.from(_sources), {
        persistent: true,
        ignoreInitial: true,
      })

      watcher.on("add", async (file) => {
        const type = getExtensionType(file)

        if (type === "none") {
          return
        }

        if (type === "widget") {
          await handleWidgetChange(file)
          return
        }

        if (type === "route") {
          await handleRouteChange(file)
          return
        }

        if (type === "setting") {
          await handleSettingChange(file)
          return
        }

        return
      })

      watcher.on("change", async (file) => {
        const type = getExtensionType(file)

        if (type === "none") {
          return
        }

        if (type === "widget") {
          await handleWidgetChange(file)
          return
        }

        if (type === "route") {
          await handleRouteChange(file)
          return
        }

        if (type === "setting") {
          await handleSettingChange(file)
          return
        }

        return
      })

      watcher.on("unlink", async (file) => {
        await handleExtensionUnlink(file)
        return
      })
    },
    resolveId(id) {
      if (MODULES.includes(id)) {
        return VIRTUAL_PREFIX + id
      }

      return null
    },
    async load(id: string) {
      if (!id.startsWith(VIRTUAL_PREFIX)) {
        return null
      }

      const idNoPrefix = id.slice(VIRTUAL_PREFIX.length)

      const moduleMap: Record<string, LoadModuleOptions> = {
        [ROUTE_PAGE_MODULE]: { type: "route", get: "page" },
        [ROUTE_LINK_MODULE]: { type: "route", get: "link" },
        [SETTING_PAGE_MODULE]: { type: "setting", get: "page" },
        [SETTING_CARD_MODULE]: { type: "setting", get: "card" },
      }

      if (WIDGET_MODULES.includes(idNoPrefix)) {
        const zone = idNoPrefix
          .replace(WIDGET_MODULE, "")
          .replace(/\//g, ".") as InjectionZone
        return loadModuleAndUpdateGraph(id, { type: "widget", get: zone })
      }

      const moduleOptions = moduleMap[idNoPrefix]

      if (moduleOptions) {
        return loadModuleAndUpdateGraph(id, moduleOptions)
      }

      return null
    },
    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    },
  }
}
