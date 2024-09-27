import outdent from "outdent"

import { generateMenuItems } from "../routes"
import { generateModule } from "../utils"

export async function generateVirtualMenuItemModule(sources: Set<string>) {
  const menuItems = await generateMenuItems(sources)

  const code = outdent`
          ${menuItems.imports.join("\n")}

          export default {
            ${menuItems.code},
          }
        `

  return generateModule(code)
}
