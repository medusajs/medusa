import { InjectionZone } from "@medusajs/admin-shared"
import outdent from "outdent"
import { generateModule } from "../utils"
import { generateWidgets } from "../widgets"

export async function generateVirtualWidgetModule(
  sources: Set<string>,
  injectionZone?: InjectionZone
) {
  const widgets = await generateWidgets(sources, injectionZone)

  const imports = [...widgets.imports]

  const code = outdent`
    ${imports.join("\n")}

    export default {
        ${widgets.code},
    }
  `

  return generateModule(code)
}
