import { outdent } from "outdent"
import { generateCustomFieldDisplays } from "../custom-fields"
import { generateModule } from "../utils"

export async function generateVirtualDisplayModule(sources: Set<string>) {
  const displays = await generateCustomFieldDisplays(sources)

  const code = outdent`
    ${displays.imports.join("\n")}

    export default {
      ${displays.code}
    }
  `

  return generateModule(code)
}
