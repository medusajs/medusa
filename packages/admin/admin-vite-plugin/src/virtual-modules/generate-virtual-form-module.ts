import outdent from "outdent"
import { generateCustomFieldForms } from "../custom-fields"
import { generateMenuItems } from "../routes"
import { generateModule } from "../utils"
import { generateWidgets } from "../widgets"

export async function generateVirtualFormModule(sources: Set<string>) {
  const menuItems = await generateMenuItems(sources)
  const widgets = await generateWidgets(sources)
  const customFields = await generateCustomFieldForms(sources)

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
