/** Widget utilities */

import { InjectionZone, isValidInjectionZone } from "@medusajs/admin-shared"
import fs from "fs/promises"
import {
  parse,
  traverse,
  type ExportNamedDeclaration,
  type File,
  type NodePath,
  type ObjectProperty,
  type ParseResult,
} from "./babel"
import {
  convertToImportPath,
  crawl,
  generateModule,
  getConfigObjectProperties,
  getParserOptions,
  isDefaultExportComponent,
} from "./utils"

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
export async function validateWidget(
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

export async function generateWidgetEntrypoint(
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
    .map(
      (path, index) =>
        `import WidgetExt${index} from "${convertToImportPath(path)}";`
    )
    .join("\n")

  const exportString = `export default {
      widgets: [${validatedWidgets
        .map((_, index) => `{ Component: WidgetExt${index} }`)
        .join(", ")}],
    }`

  const code = `${importString}\n${exportString}`

  return { module: generateModule(code), paths: validatedWidgets }
}
