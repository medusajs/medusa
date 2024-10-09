import fs from "fs/promises"
import { File, parse, ParseResult, traverse } from "../babel"
import { logger } from "../logger"
import {
  generateHash,
  getConfigObjectProperties,
  getParserOptions,
} from "../utils"
import { getWidgetFilesFromSources } from "./helpers"

export async function generateWidgetHash(
  sources: Set<string>
): Promise<string> {
  const files = await getWidgetFilesFromSources(sources)
  const contents = await Promise.all(files.map(getWidgetContents))
  const totalContent = contents
    .flatMap(({ config, defaultExport }) => [config, defaultExport])
    .filter(Boolean)
    .join("")

  return generateHash(totalContent)
}

async function getWidgetContents(
  file: string
): Promise<{ config: string | null; defaultExport: string | null }> {
  const code = await fs.readFile(file, "utf-8")
  let ast: ParseResult<File>

  try {
    ast = parse(code, getParserOptions(file))
  } catch (e) {
    logger.error(
      `An error occurred while parsing the file. Due to the error we cannot validate whether the widget has changed. If your changes aren't correctly reflected try restarting the dev server.`,
      {
        file,
        error: e,
      }
    )
    return { config: null, defaultExport: null }
  }

  let configContent: string | null = null
  let defaultExportContent: string | null = null

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const properties = getConfigObjectProperties(path)
      if (properties) {
        configContent = code.slice(path.node.start!, path.node.end!)
      }
    },
    ExportDefaultDeclaration(path) {
      defaultExportContent = code.slice(path.node.start!, path.node.end!)
    },
  })

  return { config: configContent, defaultExport: defaultExportContent }
}
