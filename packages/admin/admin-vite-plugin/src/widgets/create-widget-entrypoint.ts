import { InjectionZone, isValidInjectionZone } from "@medusajs/admin-shared"
import fs from "fs/promises"
import outdent from "outdent"
import { File, ObjectProperty, parse, ParseResult, traverse } from "../babel"
import { logger } from "../logger"
import {
  crawl,
  getConfigObjectProperties,
  getParserOptions,
  hasDefaultExport,
} from "../utils"

type Widget = {
  Component: string
  zone: InjectionZone[]
}

type WidgetResult = {
  import: string
  widget: Widget
}

type WidgetEntrypoint = {
  imports: string[]
  code: string
}

export async function createWidgetEntrypoint(
  sources: Set<string>
): Promise<WidgetEntrypoint> {
  const files = await getFilesFromSources(sources)
  const results = await getWidgetResults(files)

  const imports = results.map((r) => r.import)
  const code = generateCode(results)

  return {
    imports,
    code,
  }
}

async function getFilesFromSources(sources: Set<string>): Promise<string[]> {
  return (
    await Promise.all(
      Array.from(sources).map(async (source) => crawl(`${source}/widgets`))
    )
  ).flat()
}

async function getWidgetResults(files: string[]): Promise<WidgetResult[]> {
  return (await Promise.all(files.map(parseFile))).filter(
    (r) => r !== null
  ) as WidgetResult[]
}

function generateCode(results: WidgetResult[]): string {
  return outdent`
    widgets: [
      ${results.map((r) => formatWidget(r.widget)).join(",\n")}
    ]
  `
}

function formatWidget(widget: Widget): string {
  return outdent`
    {
        Component: ${widget.Component},
        zone: [${widget.zone.map((z) => `"${z}"`).join(", ")}]
    }
  `
}

async function parseFile(
  file: string,
  index: number
): Promise<WidgetResult | null> {
  const code = await fs.readFile(file, "utf-8")
  let ast: ParseResult<File>

  try {
    ast = parse(code, getParserOptions(file))
  } catch (e) {
    logger.error(
      `An error occurred while parsing ${file}. The file will be ignored. See the below error for more details:\n${e}`
    )
    return null
  }

  let fileHasDefaultExport = false

  try {
    fileHasDefaultExport = await hasDefaultExport(ast)
  } catch (e) {
    logger.error(
      `An error occurred while checking for a default export in ${file}. The file will be ignored. See the below error for more details:\n${e}`
    )
    return null
  }

  if (!fileHasDefaultExport) {
    return null
  }

  let zone: InjectionZone[] | null

  try {
    zone = await getWidgetZone(ast)
  } catch (e) {
    logger.error(
      `An error occurred while traversing ${file}. The file will be ignored. See the below error for more details:\n${e}`
    )
    return null
  }

  if (!zone) {
    logger.warn(
      `The 'zone' property is missing from the widget config for ${file}. The 'zone' property is required to load the widget config.`
    )
    return null
  }

  const import_ = generateImport(file, index)
  const widget = generateWidget(zone, index)

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
  return `import ${generateWidgetComponentName(
    index
  )}, { config as ${generateWidgetConfigName(index)} } from "${file}"`
}

function generateWidget(zone: InjectionZone[], index: number): Widget {
  return {
    Component: generateWidgetComponentName(index),
    zone: zone,
  }
}

async function getWidgetZone(
  ast: ParseResult<File>
): Promise<InjectionZone[] | null> {
  const zones: string[] = []

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const properties = getConfigObjectProperties(path)
      if (!properties) {
        return
      }

      const zoneProperty = properties.find(
        (p) =>
          p.type === "ObjectProperty" &&
          p.key.type === "Identifier" &&
          p.key.name === "zone"
      ) as ObjectProperty | undefined

      if (!zoneProperty) {
        return
      }

      if (zoneProperty.value.type === "StringLiteral") {
        zones.push(zoneProperty.value.value)
      } else if (zoneProperty.value.type === "ArrayExpression") {
        const values: string[] = []

        for (const element of zoneProperty.value.elements) {
          if (element && element.type === "StringLiteral") {
            values.push(element.value)
          }
        }

        zones.push(...values)
      }
    },
  })

  const validatedZones = zones.filter(isValidInjectionZone)
  return validatedZones.length > 0 ? validatedZones : null
}
