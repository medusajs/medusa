import outdent from "outdent"
import fs from "fs/promises"
import path from "path"
import { generateModule } from "../utils"

export async function generateVirtualCellRendererModule(
  sources: Set<string>,
  pluginMode = false
) {
  const imports: string[] = []

  // Check which sources have the cell-renderers.tsx file
  for (const source of sources) {
    const cellRenderersPath = path.join(source, "cell-renderers.tsx")
    try {
      await fs.access(cellRenderersPath)
      // File exists, add import for side effects
      imports.push(`import "${cellRenderersPath}"`)
    } catch {
      // File doesn't exist, skip
    }
  }

  const code = outdent`
    ${imports.join("\n")}

    ${
      pluginMode
        ? `const cellRendererModule = {}`
        : `export default {}`
    }
  `

  return generateModule(code)
}
