import outdent from "outdent"
import { findSearchEntityFile } from "../search-entities"
import { generateModule, normalizePath } from "../utils"

export async function generateVirtualSearchEntityModule(
  sources: Set<string>,
  pluginMode = false
) {
  const imports: string[] = []

  for (const source of sources) {
    const searchEntitiesPath = await findSearchEntityFile(source)

    if (searchEntitiesPath) {
      imports.push(`import "${normalizePath(searchEntitiesPath)}"`)
    }
  }

  const code = outdent`
    ${imports.join("\n")}

    ${
      pluginMode
        ? `const searchEntityModule = {}`
        : `export default {}`
    }
  `

  return generateModule(code)
}
