import { InjectionZone, isValidInjectionZone } from "@medusajs/admin-shared"
import fs from "fs/promises"
import outdent from "outdent"
import {
  File,
  isArrayExpression,
  isIdentifier,
  isObjectProperty,
  isStringLiteral,
  isTemplateLiteral,
  Node,
  parse,
  ParseResult,
  traverse,
} from "../babel"
import { logger } from "../logger"
import {
  getConfigObjectProperties,
  getParserOptions,
  hasDefaultExport,
  normalizePath,
} from "../utils"
import { getWidgetFilesFromSources } from "./helpers"

type WidgetConfig = {
  Component: string
  zone: InjectionZone[]
  /**
   * Code reference (e.g. `"WidgetConfig0.access"`) interpolated into the
   * generated widget object, or `undefined` when the config doesn't declare
   * `access`.
   */
  access?: string
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
        access: ${widget.access || "undefined"}
    }
  `
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

  const hasConfigAccess = await detectConfigAccess(ast, file)

  const import_ = generateImport(file, index)
  const widget = generateWidget(zone, index, hasConfigAccess)

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
  hasConfigAccess: boolean
): WidgetConfig {
  return {
    Component: generateWidgetComponentName(index),
    zone: zone,
    access: hasConfigAccess
      ? `${generateWidgetConfigName(index)}.access`
      : undefined,
  }
}

/**
 * Detects whether the widget file's `config` declares an `access` property.
 * The value itself is passed through by reference at runtime — we only need
 * a boolean here.
 */
async function detectConfigAccess(
  ast: ParseResult<File>,
  file: string
): Promise<boolean> {
  let hasAccess = false

  const inspect = (properties: Node[]) => {
    if (
      properties.some(
        (prop) =>
          isObjectProperty(prop) && isIdentifier(prop.key, { name: "access" })
      )
    ) {
      hasAccess = true
    }
  }

  try {
    traverse(ast, {
      VariableDeclarator(path) {
        if (hasAccess) {
          return
        }
        const properties = getConfigObjectProperties(path)
        if (properties) {
          inspect(properties as unknown as Node[])
        }
      },
      ExportNamedDeclaration(path) {
        if (hasAccess) {
          return
        }
        const properties = getConfigObjectProperties(path)
        if (properties) {
          inspect(properties as unknown as Node[])
        }
      },
    })
  } catch (e) {
    logger.error(`An error occurred while inspecting the widget config.`, {
      file,
      error: e,
    })
  }

  return hasAccess
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
