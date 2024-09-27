import { outdent } from "outdent"
import { generateRoutes } from "../routes"
import { generateModule } from "../utils"

export async function generateVirtualRouteModule(sources: Set<string>) {
  const routes = await generateRoutes(sources)

  const imports = [...routes.imports]

  const code = outdent`
    ${imports.join("\n")}

    export default {
      ${routes.code}
    }
  `

  return generateModule(code)
}
