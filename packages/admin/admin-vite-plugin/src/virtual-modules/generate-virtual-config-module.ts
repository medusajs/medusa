import outdent from "outdent"
import { generateCustomFields } from "../custom-fields"
import { generateMenuItems } from "../routing"
import { generateModule } from "../utils"
import { generateWidgets } from "../widgets"

export async function generateVirtualConfigModule(sources: Set<string>) {
  const menuItems = await generateMenuItems(sources)
  const widgets = await generateWidgets(sources)
  const customFields = await generateCustomFields(sources)

  const imports = [
    ...menuItems.imports,
    ...widgets.imports,
    ...customFields.imports,
  ]

  const code = outdent`
          ${imports.join("\n")}

          export default {
            ${menuItems.code},
            ${widgets.code},
            ${customFields.code},
          }
        `

  return generateModule(code)
}
