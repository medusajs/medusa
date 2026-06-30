import { InjectionZone, isValidInjectionZone } from "@medusajs/admin-shared"
import fs from "fs/promises"
import outdent from "outdent"
import {
  File,
  isArrayExpression,
  isStringLiteral,
  isTemplateLiteral,
  Node,
  parse,
  ParseResult,
  traverse,
  type ExportNamedDeclaration,
  type NodePath,
  type VariableDeclarator,
} from "../babel"
import { logger } from "../logger"
import {
  generateHash,
  getConfigObjectProperties,
  getParserOptions,
  hasDefaultExport,
  normalizePath,
} from "../utils"
import { getWidgetFilesFromSources } from "./helpers"

type WidgetConfig = {
  Component: string
  zone: InjectionZone[]
  widgetId: string
}

type ParsedWidgetConfig = {
  import: string
  widget: WidgetConfig
}

export async function generateWidgets(sources: Set<string>) {
  const files = await getWidgetFilesFromSources(sources)
  const results = await getWidgetResults(files)

  const imports = results.map((r) => r.import)
  const code = generateCode(results)

  return {
    imports,
    code,
  }
}

async function getWidgetResults(
  files: string[]
): Promise<ParsedWidgetConfig[]> {
  return (await Promise.all(files.map(parseFile))).filter(
    (r) => r !== null
  ) as ParsedWidgetConfig[]
}

function generateCode(results: ParsedWidgetConfig[]): string {
  return outdent`
    widgets: [
      ${results.map((r) => formatWidget(r.widget)).join(",\n")}
    ]
  `
}

function formatWidget(widget: WidgetConfig): string {
  return outdent`
    {
        Component: ${widget.Component},
        zone: [${widget.zone.map((z) => `"${z}"`).join(", ")}],
        widgetId: "${widget.widgetId}"
    }
  `
}

/**
 * Derives a stable, machine-independent identifier for a widget.
 *
 * Prefers an explicit `id` from the widget config. Otherwise falls back to a
 * `Widget-<short hash>` id, where the hash is derived from the file's path
 * relative to the admin source root (the segment from `widgets/` onward) so the
 * id is unaffected by where the project lives on disk or which machine builds
 * it, and only changes if the file itself is renamed.
 */
function getWidgetId(idOverride: string | null, file: string): string {
  if (idOverride) {
    return idOverride
  }

  const normalized = normalizePath(file)
  const marker = "/widgets/"
  const markerIndex = normalized.lastIndexOf(marker)
  const relative =
    markerIndex >= 0 ? normalized.slice(markerIndex + 1) : normalized

  return `Widget-${generateHash(relative).slice(0, 4)}`
}

async function parseFile(
  file: string,
  index: number
): Promise<ParsedWidgetConfig | null> {
  const code = await fs.readFile(file, "utf-8")
  let ast: ParseResult<File>

  try {
    ast = parse(code, getParserOptions(file))
  } catch (e) {
    logger.error(`An error occurred while parsing the file.`, {
      file,
      error: e,
    })
    return null
  }

  let fileHasDefaultExport = false

  try {
    fileHasDefaultExport = await hasDefaultExport(ast)
  } catch (e) {
    logger.error(`An error occurred while checking for a default export.`, {
      file,
      error: e,
    })
    return null
  }

  if (!fileHasDefaultExport) {
    return null
  }

  let zone: InjectionZone[] | null

  try {
    zone = await getWidgetZone(ast, file)
  } catch (e) {
    logger.error(`An error occurred while traversing the file.`, {
      file,
      error: e,
    })
    return null
  }

  if (!zone) {
    logger.warn(`'zone' property is missing from the widget config.`, { file })
    return null
  }

  let idOverride: string | null = null

  try {
    idOverride = getWidgetIdOverride(ast)
  } catch (e) {
    logger.error(`An error occurred while reading the widget id.`, {
      file,
      error: e,
    })
  }

  const import_ = generateImport(file, index)
  const widget = generateWidget(zone, index, getWidgetId(idOverride, file))

  return {
    widget,
    import: import_,
  }
}

function generateWidgetComponentName(index: number): string {
  return `WidgetComponent${index}`
}

function generateWidgetConfigName(index: number): string {
  return `WidgetConfig${index}`
}

function generateImport(file: string, index: number): string {
  const path = normalizePath(file)
  return `import ${generateWidgetComponentName(
    index
  )}, { config as ${generateWidgetConfigName(index)} } from "${path}"`
}

function generateWidget(
  zone: InjectionZone[],
  index: number,
  widgetId: string
): WidgetConfig {
  return {
    Component: generateWidgetComponentName(index),
    zone: zone,
    widgetId,
  }
}

/**
 * Extracts an explicit string `id` from the widget config, if present. Uses the
 * shared `getConfigObjectProperties` helper so it works for both bundled
 * (`VariableDeclarator`) and unbundled (`ExportNamedDeclaration`) files.
 */
function getWidgetIdOverride(ast: ParseResult<File>): string | null {
  let id: string | null = null
  let found = false

  const readId = (path: NodePath<VariableDeclarator | ExportNamedDeclaration>) => {
    if (found) {
      return
    }
    const properties = getConfigObjectProperties(path)
    if (!properties) {
      return
    }
    const idProperty = properties.find(
      (p: any) => p.type === "ObjectProperty" && p.key.name === "id"
    )
    if (idProperty?.type === "ObjectProperty") {
      if (idProperty.value.type === "StringLiteral") {
        id = idProperty.value.value
      }
      found = true
    }
  }

  traverse(ast, {
    VariableDeclarator: readId,
    ExportNamedDeclaration: readId,
  })

  return id
}

async function getWidgetZone(
  ast: ParseResult<File>,
  file: string
): Promise<InjectionZone[] | null> {
  const zones: string[] = []

  /**
   * We need to keep track of whether we have found a zone in the file.
   * This is to avoid processing the same config both using the `ExportNamedDeclaration`
   * and `VariableDeclarator` paths, which would be the case for the unbundled files.
   */
  let zoneFound = false

  traverse(ast, {
    /**
     * In case we are processing a bundled file, the `config` will most likely
     * not be a named export. Instead we look for a `VariableDeclaration` named
     * `config` and extract the `zone` property from it.
     */
    VariableDeclarator(path) {
      if (zoneFound) {
        return
      }

      if (
        path.node.id.type === "Identifier" &&
        path.node.id.name === "config" &&
        path.node.init?.type === "CallExpression"
      ) {
        const arg = path.node.init.arguments[0]
        if (arg?.type === "ObjectExpression") {
          const zoneProperty = arg.properties.find(
            (p: any) => p.type === "ObjectProperty" && p.key.name === "zone"
          )
          if (zoneProperty?.type === "ObjectProperty") {
            extractZoneValues(zoneProperty.value, zones, file)
            zoneFound = true
          }
        }
      }
    },
    /**
     * For unbundled files, the `config` will always be a named export.
     */
    ExportNamedDeclaration(path) {
      if (zoneFound) {
        return
      }

      const declaration = path.node.declaration
      if (
        declaration?.type === "VariableDeclaration" &&
        declaration.declarations[0]?.type === "VariableDeclarator" &&
        declaration.declarations[0].id.type === "Identifier" &&
        declaration.declarations[0].id.name === "config" &&
        declaration.declarations[0].init?.type === "CallExpression"
      ) {
        const arg = declaration.declarations[0].init.arguments[0]
        if (arg?.type === "ObjectExpression") {
          const zoneProperty = arg.properties.find(
            (p: any) => p.type === "ObjectProperty" && p.key.name === "zone"
          )
          if (zoneProperty?.type === "ObjectProperty") {
            extractZoneValues(zoneProperty.value, zones, file)
            zoneFound = true
          }
        }
      }
    },
  })

  if (!zoneFound) {
    logger.warn(`'zone' property is missing from the widget config.`, { file })
    return null
  }

  const validatedZones = zones.filter(isValidInjectionZone)

  if (validatedZones.length === 0) {
    logger.warn(`'zone' property is not a valid injection zone.`, {
      file,
    })
    return null
  }

  return validatedZones
}

function extractZoneValues(value: Node, zones: string[], file: string) {
  if (isTemplateLiteral(value)) {
    logger.warn(
      `'zone' property cannot be a template literal (e.g. \`product.details.after\`).`,
      { file }
    )
    return
  }

  if (isStringLiteral(value)) {
    zones.push(value.value)
  } else if (isArrayExpression(value)) {
    const values = value.elements
      .filter((e) => isStringLiteral(e))
      .map((e) => e.value)
    zones.push(...values)
  } else {
    logger.warn(`'zone' property is not a string or array.`, { file })
    return
  }
}
