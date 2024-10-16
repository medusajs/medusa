import { CustomFieldModel } from "@medusajs/admin-shared"
import fs from "fs/promises"
import {
  ExportDefaultDeclaration,
  File,
  isIdentifier,
  isObjectProperty,
  NodePath,
  ObjectProperty,
  parse,
  ParseResult,
  traverse,
} from "../babel"
import { logger } from "../logger"
import { crawl, getParserOptions, normalizePath } from "../utils"
import { getConfigArgument, getModel } from "./helpers"

type ParsedCustomFieldLink = {
  import: string
  model: CustomFieldModel
  link: string
}

export async function generateCustomFieldLinks(sources: Set<string>) {
  const files = await getFilesFromSources(sources)
  const results = await getCustomFieldLinkResults(files)

  const imports = results.map((result) => result.import)
  const code = generateCode(results)

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

function generateCode(results: ParsedCustomFieldLink[]): string {
  const groupedByModel = new Map<CustomFieldModel, ParsedCustomFieldLink[]>()

  results.forEach((result) => {
    const model = result.model
    if (!groupedByModel.has(model)) {
      groupedByModel.set(model, [])
    }
    groupedByModel.get(model)!.push(result)
  })

  const segments: string[] = []

  groupedByModel.forEach((results, model) => {
    const links = results.map((result) => result.link).join(",\n")

    segments.push(`
      ${model}: [
        ${links}
      ],
    `)
  })

  return `
    links: {
      ${segments.join("\n")}
    }
  `
}

async function getCustomFieldLinkResults(
  files: string[]
): Promise<ParsedCustomFieldLink[]> {
  return (
    await Promise.all(files.map(async (file, index) => parseFile(file, index)))
  ).filter(Boolean) as ParsedCustomFieldLink[]
}

async function parseFile(
  file: string,
  index: number
): Promise<ParsedCustomFieldLink | null> {
  const content = await fs.readFile(file, "utf8")
  let ast: ParseResult<File>

  try {
    ast = parse(content, getParserOptions(file))
  } catch (e) {
    logger.error(`An error occurred while parsing the file`, { file, error: e })
    return null
  }

  const import_ = generateImport(file, index)

  let link: string | null = null
  let model: CustomFieldModel | null = null
  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const _model = getModel(path, file)

        if (!_model) {
          return
        }

        model = _model
        link = getLink(path, index, file)
      },
    })
  } catch (err) {
    logger.error(`An error occurred while traversing the file.`, {
      file,
      error: err,
    })
    return null
  }

  if (!link || !model) {
    return null
  }

  return {
    import: import_,
    model,
    link,
  }
}

function generateCustomFieldConfigName(index: number): string {
  return `CustomFieldConfig${index}`
}

function generateImport(file: string, index: number): string {
  const path = normalizePath(file)
  return `import ${generateCustomFieldConfigName(index)} from "${path}"`
}

function getLink(
  path: NodePath<ExportDefaultDeclaration>,
  index: number,
  file: string
): string | null {
  const configArgument = getConfigArgument(path)

  if (!configArgument) {
    return null
  }

  const linkProperty = configArgument.properties.find(
    (p) => isObjectProperty(p) && isIdentifier(p.key, { name: "link" })
  ) as ObjectProperty | undefined

  if (!linkProperty) {
    logger.warn(`'link' is missing.`, { file })
    return null
  }

  const import_ = generateCustomFieldConfigName(index)

  return `${import_}.link`
}
