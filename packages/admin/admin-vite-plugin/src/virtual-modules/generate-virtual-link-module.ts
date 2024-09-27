import { outdent } from "outdent"
import { generateCustomFieldLinks } from "../custom-fields"
import { generateModule } from "../utils"

export async function generateVirtualLinkModule(sources: Set<string>) {
  const links = await generateCustomFieldLinks(sources)

  const code = outdent`
    ${links.imports.join("\n")}

    export default {
      ${links.code}
    }
  `

  return generateModule(code)
}
