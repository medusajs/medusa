import fs from "fs/promises"
import outdent from "outdent"
import { File, parse, ParseResult, traverse } from "../babel"
import { logger } from "../logger"
import {
  generateHash,
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
  if (results.length === 0) {
    return "layouts: []"
  }

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

  const hash = generateHash(normalizePath(file))
  const componentName = `LayoutComponent${index}_${hash.slice(0, 6)}`
  const configName = `LayoutConfig${index}_${hash.slice(0, 6)}`

  return {
    import: generateImport(file, componentName, configName),
    componentName,
    configName,
  }
}

/**
 * Checks whether the file exports a named `config` symbol.
 * This is a lightweight check — we don't validate the shape here; that
 * happens at runtime when the layout is registered.
 */
function hasConfigExport(ast: ParseResult<File>): boolean {
  let found = false

  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (found) return
      const { declaration, specifiers } = path.node

      if (declaration?.type === "VariableDeclaration") {
        if (
          declaration.declarations.some(
            (d) =>
              d.type === "VariableDeclarator" &&
              d.id.type === "Identifier" &&
              d.id.name === "config"
          )
        ) {
          found = true
        }
      }

      if (
        specifiers?.some(
          (s) => s.type === "ExportSpecifier" && s.local.name === "config"
        )
      ) {
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

export async function generateLayoutHash(
  sources: Set<string>
): Promise<string> {
  const files = await getLayoutFilesFromSources(sources)
  const content = files.sort().join("|")
  return generateHash(content)
}
