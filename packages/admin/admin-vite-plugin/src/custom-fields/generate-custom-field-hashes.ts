import fs from "fs/promises"
import {
  File,
  isIdentifier,
  isObjectProperty,
  parse,
  ParseResult,
  traverse,
} from "../babel"
import { logger } from "../logger"
import { crawl, generateHash, getParserOptions } from "../utils"
import { getConfigArgument } from "./helpers"

export async function generateCustomFieldHashes(
  sources: Set<string>
): Promise<{ linkHash: string; formHash: string; displayHash: string }> {
  const files = await getFilesFromSources(sources)
  const contents = await Promise.all(files.map(getCustomFieldContents))

  const linkContents = contents.map((c) => c.link).filter(Boolean)
  const formContents = contents.map((c) => c.form).filter(Boolean)
  const displayContents = contents.map((c) => c.display).filter(Boolean)

  const totalLinkContent = linkContents.join("")
  const totalFormContent = formContents.join("")
  const totalDisplayContent = displayContents.join("")

  return {
    linkHash: generateHash(totalLinkContent),
    formHash: generateHash(totalFormContent),
    displayHash: generateHash(totalDisplayContent),
  }
}

async function getFilesFromSources(sources: Set<string>): Promise<string[]> {
  return (
    await Promise.all(
      Array.from(sources).map(async (source) =>
        crawl(`${source}/custom-fields`)
      )
    )
  ).flat()
}

async function getCustomFieldContents(file: string): Promise<{
  link: string | null
  form: string | null
  display: string | null
}> {
  const code = await fs.readFile(file, "utf-8")

  let ast: ParseResult<File> | null = null

  try {
    ast = parse(code, getParserOptions(file))
  } catch (e) {
    logger.error(`An error occurred while parsing the file.`, {
      file,
      error: e,
    })
    return { link: null, form: null, display: null }
  }

  let linkContent: string | null = null
  let formContent: string | null = null
  let displayContent: string | null = null

  try {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        const configArgument = getConfigArgument(path)
        if (!configArgument) {
          return
        }

        configArgument.properties.forEach((prop) => {
          if (!isObjectProperty(prop) || !prop.key || !isIdentifier(prop.key)) {
            return
          }

          switch (prop.key.name) {
            case "link":
              linkContent = code.slice(prop.start!, prop.end!)
              break
            case "forms":
              formContent = code.slice(prop.start!, prop.end!)
              break
            case "display":
              displayContent = code.slice(prop.start!, prop.end!)
              break
          }
        })
      },
    })
  } catch (e) {
    logger.error(
      `An error occurred while processing ${file}. See the below error for more details:\n${e}`,
      { file, error: e }
    )
    return { link: null, form: null, display: null }
  }

  return { link: linkContent, form: formContent, display: displayContent }
}
