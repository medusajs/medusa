import outdent from "outdent"
import { generateLayouts } from "../layouts"
import { generateModule } from "../utils"

export async function generateVirtualLayoutModule(
  sources: Set<string>,
  pluginMode = false
) {
  const layouts = await generateLayouts(sources)

  const imports = [...layouts.imports]

  const code = outdent`
    ${imports.join("\n")}

    ${
      pluginMode
        ? `const layoutModule = { ${layouts.code} }`
        : `export default { ${layouts.code} }`
    }
  `

  return generateModule(code)
}
