import {
  isValidCustomFieldDisplayPath,
  isValidCustomFieldDisplayZone,
  type CustomFieldContainerZone,
  type CustomFieldModel,
} from "@medusajs/admin-shared"
import fs from "fs/promises"
import {
  ExportDefaultDeclaration,
  File,
  isArrayExpression,
  isIdentifier,
  isObjectExpression,
  isObjectProperty,
  isStringLiteral,
  NodePath,
  ObjectProperty,
  parse,
  ParseResult,
  traverse,
} from "../babel"
import { logger } from "../logger"
import { crawl, getParserOptions, normalizePath } from "../utils"
import { getConfigArgument, getModel, validateLink } from "./helpers"

type CustomFieldDisplay = {
  zone: CustomFieldContainerZone
  Component: string
}

type ParsedCustomFieldDisplayConfig = {
  import: string
  model: CustomFieldModel
  displays: CustomFieldDisplay[] | null
}

export async function generateCustomFieldDisplays(sources: Set<string>) {
  const files = await getFilesFromSources(sources)
  const results = await getCustomFieldDisplayResults(files)

  const imports = results.map((result) => result.import).flat()
  const code = generateDisplayCode(results)

  return {
    imports,
    code,
  }
}

async function getFilesFromSources(sources: Set<string>): Promise<string[]> {
  const files = (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/custom-fields`)
      )
    )
  ).flat()
  return files
}

function generateDisplayCode(
  results: ParsedCustomFieldDisplayConfig[]
): string {
  const groupedByModel = new Map<
    CustomFieldModel,
    ParsedCustomFieldDisplayConfig[]
  >()

  results.forEach((result) => {
    const model = result.model
    if (!groupedByModel.has(model)) {
      groupedByModel.set(model, [])
    }
    groupedByModel.get(model)!.push(result)
  })

  const segments: string[] = []

  groupedByModel.forEach((results, model) => {
    const displays = results
      .map((result) => formatDisplays(result.displays))
      .filter((display) => display !== "")
      .join(",\n")

    segments.push(`
      ${model}: [
        ${displays}
      ],
    `)
  })

  return `
    displays: {
      ${segments.join("\n")}
    }
  `
}

function formatDisplays(displays: CustomFieldDisplay[] | null): string {
  if (!displays || displays.length === 0) {
    return ""
  }

  return displays
    .map(
      (display) => `
        {
          zone: "${display.zone}",
          Component: ${display.Component},
        }
      `
    )
    .join(",\n")
}

async function getCustomFieldDisplayResults(
  files: string[]
): Promise<ParsedCustomFieldDisplayConfig[]> {
  return (
    await Promise.all(
      files.map(async (file, index) => parseDisplayFile(file, index))
    )
  ).filter(Boolean) as ParsedCustomFieldDisplayConfig[]
}

async function parseDisplayFile(
  file: string,
  index: number
): Promise<ParsedCustomFieldDisplayConfig | null> {
  const content = await fs.readFile(file, "utf8")
  let ast: ParseResult<File>

  try {
    ast = parse(content, getParserOptions(file))
  } catch (e) {
    logger.error(`An error occurred while parsing the file`, { file, error: e })
    return null
  }

  const import_ = generateImport(file, index)

  let displays: CustomFieldDisplay[] | null = null
  let model: CustomFieldModel | null = null
  let hasLink = false
  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const _model = getModel(path, file)

        if (!_model) {
          return
        }

        model = _model
        displays = getDisplays(path, model, index, file)
        hasLink = validateLink(path, file)
      },
    })
  } catch (err) {
    logger.error(`An error occurred while traversing the file.`, {
      file,
      error: err,
    })
    return null
  }

  if (!model) {
    logger.warn(`'model' property is missing.`, { file })
    return null
  }

  if (!hasLink) {
    logger.warn(`'link' property is missing.`, { file })
    return null
  }

  return {
    import: import_,
    model,
    displays,
  }
}

function getDisplays(
  path: NodePath<ExportDefaultDeclaration>,
  model: CustomFieldModel,
  index: number,
  file: string
): CustomFieldDisplay[] | null {
  const configArgument = getConfigArgument(path)

  if (!configArgument) {
    return null
  }

  const displayProperty = configArgument.properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "displays" })
  ) as ObjectProperty | undefined

  if (!displayProperty) {
    return null
  }

  if (!isArrayExpression(displayProperty.value)) {
    logger.warn(
      `'displays' is not an array. The 'displays' property must be an array of objects.`,
      { file }
    )
    return null
  }

  const displays: CustomFieldDisplay[] = []

  displayProperty.value.elements.forEach((element, j) => {
    if (!isObjectExpression(element)) {
      return
    }

    const zoneProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "zone" })
    ) as ObjectProperty | undefined

    if (!zoneProperty) {
      logger.warn(
        `'zone' property is missing at the ${j} index of the 'displays' property.`,
        { file }
      )
      return
    }

    if (!isStringLiteral(zoneProperty.value)) {
      logger.warn(
        `'zone' property at index ${j} in the 'displays' property is not a string literal. 'zone' must be a string literal, e.g. 'general' or 'attributes'.`,
        { file }
      )
      return
    }

    const zone = zoneProperty.value.value
    const fullPath = getDisplayEntryPath(model, zone)

    if (
      !isValidCustomFieldDisplayZone(zone) ||
      !isValidCustomFieldDisplayPath(fullPath)
    ) {
      logger.warn(
        `'zone' is invalid at index ${j} in the 'displays' property. Received: ${zone}.`,
        { file }
      )
      return
    }

    const componentProperty = element.properties.find(
      (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "component" })
    ) as ObjectProperty | undefined

    if (!componentProperty) {
      logger.warn(
        `'component' property is missing at index ${j} in the 'displays' property.`,
        { file }
      )
      return
    }

    displays.push({
      zone: zone,
      Component: getDisplayComponent(index, j),
    })
  })

  return displays.length > 0 ? displays : null
}

function getDisplayEntryPath(model: CustomFieldModel, zone: string): string {
  return `${model}.${zone}.$display`
}

function getDisplayComponent(
  fileIndex: number,
  displayEntryIndex: number
): string {
  const import_ = generateCustomFieldConfigName(fileIndex)
  return `${import_}.displays[${displayEntryIndex}].component`
}

function generateCustomFieldConfigName(index: number): string {
  return `CustomFieldConfig${index}`
}

function generateImport(file: string, index: number): string {
  const path = normalizePath(file)
  return `import ${generateCustomFieldConfigName(index)} from "${path}"`
}
