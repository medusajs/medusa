import { outdent } from "outdent"
import { generateCustomFieldLinks } from "../custom-fields"
import { generateModule } from "../utils"

export async function generateVirtualLinkModule(sources: Set<string>) {
  const links = await generateCustomFieldLinks(sources)

  const imports = [...links.imports]

  const code = outdent`
    ${imports.join("\n")}

    export default {
      ${links.code}
    }
  `

  return generateModule(code)
}
