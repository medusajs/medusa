import fs from "fs/promises"
import outdent from "outdent"
import { File, parse, ParseResult, traverse } from "../babel"
import { logger } from "../logger"
import {
  getConfigObjectProperties,
  getParserOptions,
  hasDefaultExport,
  normalizePath,
} from "../utils"
import { getLayoutFilesFromSources } from "./helpers"

type ParsedLayoutConfig = {
  import: string
  componentName: string
  configName: string
}

export async function generateLayouts(sources: Set<string>) {
  const files = await getLayoutFilesFromSources(sources)
  const results = await getLayoutResults(files)

  const imports = results.map((r) => r.import)
  const code = generateCode(results)

  return { imports, code }
}

async function getLayoutResults(
  files: string[]
): Promise<ParsedLayoutConfig[]> {
  return (await Promise.all(files.map(parseFile))).filter(
    (r) => r !== null
  ) as ParsedLayoutConfig[]
}

function generateCode(results: ParsedLayoutConfig[]): string {
  return outdent`
    layouts: [
      ${results
        .map(
          ({ componentName, configName }) =>
            `{ ...${configName}, Component: ${componentName} }`
        )
        .join(",\n      ")}
    ]
  `
}

async function parseFile(
  file: string,
  index: number
): Promise<ParsedLayoutConfig | null> {
  const code = await fs.readFile(file, "utf-8")
  let ast: ParseResult<File>

  try {
    ast = parse(code, getParserOptions(file))
  } catch (e) {
    logger.error(`An error occurred while parsing the layout file.`, {
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
    logger.warn(`Layout file has no default export, skipping.`, { file })
    return null
  }

  if (!hasConfigExport(ast)) {
    logger.warn(
      `Layout file has no 'config' named export. Export 'export const config = defineLayoutConfig(...)'.`,
      { file }
    )
    return null
  }

  const componentName = `LayoutComponent${index}`
  const configName = `LayoutConfig${index}`

  return {
    import: generateImport(file, componentName, configName),
    componentName,
    configName,
  }
}

/**
 * Checks whether the file exports a `config` defined via `defineLayoutConfig(...)`.
 * This is a lightweight check — we don't validate the shape here; that
 * happens at runtime when the layout is registered.
 */
function hasConfigExport(ast: ParseResult<File>): boolean {
  let found = false

  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (found) {
        return
      }
      if (getConfigObjectProperties(path)) {
        found = true
      }
    },
  })

  return found
}

function generateImport(
  file: string,
  componentName: string,
  configName: string
): string {
  const path = normalizePath(file)
  return `import ${componentName}, { config as ${configName} } from "${path}"`
}
