import {
  RESOLVED_CUSTOM_FIELD_DISPLAY_MODULES,
  RESOLVED_CUSTOM_FIELD_FORM_CONFIG_MODULES,
  RESOLVED_CUSTOM_FIELD_FORM_FIELD_MODULES,
  RESOLVED_CUSTOM_FIELD_LINK_MODULES,
  RESOLVED_ROUTE_MODULES,
  RESOLVED_WIDGET_MODULES,
  resolveVirtualId,
  VIRTUAL_MODULES,
} from "@medusajs/admin-shared"
import outdent from "outdent"
import path from "path"
import type * as Vite from "vite"
import { createCustomFieldEntrypoint } from "./custom-fields/create-custom-field-entrypoint"
import { createRouteEntrypoint } from "./routes/create-route-entrypoint"
import { MedusaVitePlugin } from "./types"
import { generateModule } from "./utils"
import { createWidgetEntrypoint } from "./widgets/create-widget-entrypoint"

const VIRTUAL_MODULE = `virtual:medusa/extensions`
const RESOLVED_VIRTUAL_MODULE = `\0${VIRTUAL_MODULE}`

export const medusaVitePlugin: MedusaVitePlugin = (options) => {
  const _sources = new Set<string>(options?.sources ?? [])

  let watcher: Vite.FSWatcher | undefined

  function isFileInSources(file: string): boolean {
    for (const source of _sources) {
      if (file.startsWith(path.resolve(source))) {
        return true
      }
    }
    return false
  }

  return {
    name: "@medusajs/admin-vite-plugin",
    enforce: "pre",
    configureServer(_server) {
      watcher = _server.watcher
      watcher?.add(Array.from(_sources))

      watcher?.on("all", async (_event, file) => {
        if (isFileInSources(file)) {
          const module = _server.moduleGraph.getModuleById(
            RESOLVED_VIRTUAL_MODULE
          )

          if (module) {
            await _server.reloadModule(module)
          }
        }
      })
    },
    resolveId(id) {
      if ([...VIRTUAL_MODULES, VIRTUAL_MODULE].includes(id)) {
        return resolveVirtualId(id)
      }

      return null
    },
    async load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE) {
        const routing = await createRouteEntrypoint(_sources)
        const widgets = await createWidgetEntrypoint(_sources)
        const customFields = await createCustomFieldEntrypoint(_sources)

        const imports = [
          ...routing.imports,
          ...widgets.imports,
          ...customFields.imports,
        ]

        const code = outdent`
          ${imports.join("\n")}

          export default {
            ${routing.code},
            ${widgets.code},
            ${customFields.code},
          }
        `

        return generateModule(code)
      }

      if (RESOLVED_CUSTOM_FIELD_DISPLAY_MODULES.includes(id)) {
        const code = `export default {
            containers: [],
        }`

        return generateModule(code)
      }

      if (RESOLVED_CUSTOM_FIELD_FORM_FIELD_MODULES.includes(id)) {
        const code = `export default {
            sections: [],
        }`

        return generateModule(code)
      }

      if (RESOLVED_CUSTOM_FIELD_FORM_CONFIG_MODULES.includes(id)) {
        const code = `export default {
            configs: [],
        }`

        return generateModule(code)
      }

      if (RESOLVED_CUSTOM_FIELD_LINK_MODULES.includes(id)) {
        const code = `export default {
            links: [],
        }`

        return generateModule(code)
      }

      if (RESOLVED_ROUTE_MODULES.includes(id)) {
        if (id.includes("link")) {
          const code = `export default {
            links: [],
          }`

          return generateModule(code)
        }

        const code = `export default {
          pages: [],
        }`

        return generateModule(code)
      }

      if (RESOLVED_WIDGET_MODULES.includes(id)) {
        const code = `export default {
          widgets: [],
        }`

        return generateModule(code)
      }
    },
    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    },
  }
}
