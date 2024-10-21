import fs from "fs/promises"
import { File, parse, ParseResult, traverse } from "../babel"
import { logger } from "../logger"
import {
  crawl,
  generateHash,
  getConfigObjectProperties,
  getParserOptions,
} from "../utils"

export async function generateRouteHashes(
  sources: Set<string>
): Promise<{ defaultExportHash: string; configHash: string }> {
  const files = await getFilesFromSources(sources)
  const contents = await Promise.all(files.map(getRouteContents))

  const defaultExportContents = contents
    .map((c) => c.defaultExport)
    .filter(Boolean)
  const configContents = contents.map((c) => c.config).filter(Boolean)

  const totalDefaultExportContent = defaultExportContents.join("")
  const totalConfigContent = configContents.join("")

  return {
    defaultExportHash: generateHash(totalDefaultExportContent),
    configHash: generateHash(totalConfigContent),
  }
}

async function getFilesFromSources(sources: Set<string>): Promise<string[]> {
  return (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/routes`, "page", { min: 1 })
      )
    )
  ).flat()
}

async function getRouteContents(
  file: string
): Promise<{ defaultExport: string | null; config: string | null }> {
  const code = await fs.readFile(file, "utf-8")

  let ast: ParseResult<File> | null = null

  try {
    ast = parse(code, getParserOptions(file))
  } catch (e) {
    logger.error(`An error occurred while parsing the file.`, {
      file,
      error: e,
    })
    return { defaultExport: null, config: null }
  }

  let defaultExportContent: string | null = null
  let configContent: string | null = null

  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        defaultExportContent = code.slice(path.node.start!, path.node.end!)
      },
      ExportNamedDeclaration(path) {
        const properties = getConfigObjectProperties(path)
        if (properties) {
          configContent = code.slice(path.node.start!, path.node.end!)
        }
      },
    })
  } catch (e) {
    logger.error(
      `An error occurred while processing ${file}. See the below error for more details:\n${e}`,
      { file, error: e }
    )
    return { defaultExport: null, config: null }
  }

  return { defaultExport: defaultExportContent, config: configContent }
}
