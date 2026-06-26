import { SourceMap } from "magic-string"
import { rm, writeFile } from "node:fs/promises"
import path from "node:path"
import type * as Vite from "vite"
import { generateCustomFieldHashes } from "./custom-fields"
import { generateI18nHash } from "./i18n"
import { generateLayoutHash } from "./layouts"
import { generateRouteHashes } from "./routes"
import { MedusaVitePlugin } from "./types"
import { AdminSubdirectory, isFileInAdminSubdirectory } from "./utils"
import {
  generateVirtualDisplayModule,
  generateVirtualFormModule,
  generateVirtualI18nModule,
  generateVirtualLayoutModule,
  generateVirtualLinkModule,
  generateVirtualMenuItemModule,
  generateVirtualRouteModule,
  generateVirtualWidgetModule,
} from "./virtual-modules"
import {
  isResolvedVirtualModuleId,
  isVirtualModuleId,
  resolveVirtualId,
  VirtualModule,
  vmod,
} from "./vmod"
import { generateWidgetHash } from "./widgets"

enum Mode {
  PLUGIN = "plugin",
  APPLICATION = "application",
}

export const medusaVitePlugin: MedusaVitePlugin = (options) => {
  const hashMap = new Map<VirtualModule, string>()
  const _sources = new Set<string>(options?.sources ?? [])

  const mode = options?.pluginMode ? Mode.PLUGIN : Mode.APPLICATION

  let watcher: Vite.FSWatcher | undefined

  function isFileInSources(file: string): boolean {
    for (const source of _sources) {
      if (file.startsWith(path.resolve(source))) {
        return true
      }
    }
    return false
  }

  async function loadVirtualModule(
    config: ModuleConfig
  ): Promise<{ code: string; map: SourceMap } | null> {
    const hash = await config.hashGenerator(_sources)
    hashMap.set(config.hashKey, hash)

    return config.moduleGenerator(_sources)
  }

  async function handleFileChange(
    server: Vite.ViteDevServer,
    config: WatcherConfig
  ) {
    const hashes = await config.hashGenerator(_sources)

    for (const module of config.modules) {
      const newHash = hashes[module.hashKey]
      if (newHash !== hashMap.get(module.virtualModule)) {
        const moduleToReload = server.moduleGraph.getModuleById(
          module.resolvedModule
        )
        if (moduleToReload) {
          await server.reloadModule(moduleToReload)
        }
        hashMap.set(module.virtualModule, newHash)
      }
    }
  }

  // Function to generate the index.js file
  async function generatePluginEntryModule(
    sources: Set<string>
  ): Promise<string> {
    // Generate all the module content
    const widgetModule = await generateVirtualWidgetModule(sources, true)
    const routeModule = await generateVirtualRouteModule(sources, true)
    const menuItemModule = await generateVirtualMenuItemModule(sources, true)
    const formModule = await generateVirtualFormModule(sources, true)
    const displayModule = await generateVirtualDisplayModule(sources, true)
    const i18nModule = await generateVirtualI18nModule(sources, true)
    const layoutModule = await generateVirtualLayoutModule(sources, true)

    // Create the index.js content that re-exports everything
    return `
      // Auto-generated index file for Medusa Admin UI extensions
    ${widgetModule.code}
    ${routeModule.code}
    ${menuItemModule.code}
    ${formModule.code}
    ${displayModule.code}
    ${i18nModule.code}
    ${layoutModule.code}

    const plugin = {
      widgetModule,
      routeModule,
      menuItemModule,
      formModule,
      displayModule,
      i18nModule,
      layoutModule
    }

    export default plugin
    `
  }

  const pluginEntryFile = path.resolve(
    process.cwd(),
    "src/admin/__admin-extensions__.js"
  )

  return {
    name: "@medusajs/admin-vite-plugin",
    enforce: "pre",
    async buildStart() {
      switch (mode) {
        case Mode.PLUGIN: {
          const code = await generatePluginEntryModule(_sources)
          await writeFile(pluginEntryFile, code, "utf-8")
          break
        }
        case Mode.APPLICATION: {
          break
        }
      }
    },
    async buildEnd() {
      switch (mode) {
        case Mode.PLUGIN: {
          try {
            await rm(pluginEntryFile, { force: true })
          } catch (error) {
            // Ignore the error if the file doesn't exist
          }
          break
        }
        case Mode.APPLICATION: {
          break
        }
      }
    },
    configureServer(server) {
      watcher = server.watcher
      watcher?.add(Array.from(_sources))

      watcher?.on("all", async (_event, file) => {
        if (!isFileInSources(file)) {
          return
        }

        for (const config of watcherConfigs) {
          if (isFileInAdminSubdirectory(file, config.subdirectory)) {
            await handleFileChange(server, config)
          }
        }
      })
    },
    resolveId(id) {
      if (!isVirtualModuleId(id)) {
        return null
      }

      return resolveVirtualId(id)
    },
    async load(id) {
      if (!isResolvedVirtualModuleId(id)) {
        return null
      }

      const config = loadConfigs[id]

      if (!config) {
        return null
      }

      return loadVirtualModule(config)
    },
    async closeBundle() {
      if (watcher) {
        await watcher.close()
      }
    },
  }
}

type ModuleConfig = {
  hashGenerator: (sources: Set<string>) => Promise<string>
  moduleGenerator: (
    sources: Set<string>
  ) => Promise<{ code: string; map: SourceMap }>
  hashKey: VirtualModule
}

const loadConfigs: Record<string, ModuleConfig> = {
  [vmod.resolved.widget]: {
    hashGenerator: async (sources) => generateWidgetHash(sources),
    moduleGenerator: async (sources) => generateVirtualWidgetModule(sources),
    hashKey: vmod.virtual.widget,
  },
  [vmod.resolved.link]: {
    hashGenerator: async (sources) =>
      (await generateCustomFieldHashes(sources)).linkHash,
    moduleGenerator: async (sources) => generateVirtualLinkModule(sources),
    hashKey: vmod.virtual.link,
  },
  [vmod.resolved.form]: {
    hashGenerator: async (sources) =>
      (await generateCustomFieldHashes(sources)).formHash,
    moduleGenerator: async (sources) => generateVirtualFormModule(sources),
    hashKey: vmod.virtual.form,
  },
  [vmod.resolved.display]: {
    hashGenerator: async (sources) =>
      (await generateCustomFieldHashes(sources)).displayHash,
    moduleGenerator: async (sources) => generateVirtualDisplayModule(sources),
    hashKey: vmod.virtual.display,
  },
  [vmod.resolved.route]: {
    hashGenerator: async (sources) =>
      (await generateRouteHashes(sources)).defaultExportHash,
    moduleGenerator: async (sources) => generateVirtualRouteModule(sources),
    hashKey: vmod.virtual.route,
  },
  [vmod.resolved.menuItem]: {
    hashGenerator: async (sources) =>
      (await generateRouteHashes(sources)).configHash,
    moduleGenerator: async (sources) => generateVirtualMenuItemModule(sources),
    hashKey: vmod.virtual.menuItem,
  },
  [vmod.resolved.i18n]: {
    hashGenerator: async (sources) => generateI18nHash(sources),
    moduleGenerator: async (sources) => generateVirtualI18nModule(sources),
    hashKey: vmod.virtual.i18n,
  },
  [vmod.resolved.layout]: {
    hashGenerator: async (sources) => generateLayoutHash(sources),
    moduleGenerator: async (sources) => generateVirtualLayoutModule(sources),
    hashKey: vmod.virtual.layout,
  },
}

type WatcherConfig = {
  subdirectory: AdminSubdirectory
  hashGenerator: (sources: Set<string>) => Promise<Record<string, string>>
  modules: {
    virtualModule: VirtualModule
    resolvedModule: string
    hashKey: string
  }[]
}

const watcherConfigs: WatcherConfig[] = [
  {
    subdirectory: "routes",
    hashGenerator: async (sources) => generateRouteHashes(sources),
    modules: [
      {
        virtualModule: vmod.virtual.route,
        resolvedModule: vmod.resolved.route,
        hashKey: "defaultExportHash",
      },
      {
        virtualModule: vmod.virtual.menuItem,
        resolvedModule: vmod.resolved.menuItem,
        hashKey: "configHash",
      },
    ],
  },
  {
    subdirectory: "widgets",
    hashGenerator: async (sources) => ({
      widgetConfigHash: await generateWidgetHash(sources),
    }),
    modules: [
      {
        virtualModule: vmod.virtual.widget,
        resolvedModule: vmod.resolved.widget,
        hashKey: "widgetConfigHash",
      },
    ],
  },
  {
    subdirectory: "custom-fields",
    hashGenerator: async (sources) => generateCustomFieldHashes(sources),
    modules: [
      {
        virtualModule: vmod.virtual.link,
        resolvedModule: vmod.resolved.link,
        hashKey: "linkHash",
      },
      {
        virtualModule: vmod.virtual.form,
        resolvedModule: vmod.resolved.form,
        hashKey: "formHash",
      },
      {
        virtualModule: vmod.virtual.display,
        resolvedModule: vmod.resolved.display,
        hashKey: "displayHash",
      },
    ],
  },
  {
    subdirectory: "i18n",
    hashGenerator: async (sources) => ({
      i18nHash: await generateI18nHash(sources),
    }),
    modules: [
      {
        virtualModule: vmod.virtual.i18n,
        resolvedModule: vmod.resolved.i18n,
        hashKey: "i18nHash",
      },
    ],
  },
  {
    subdirectory: "layouts",
    hashGenerator: async (sources) => ({
      layoutConfigHash: await generateLayoutHash(sources),
    }),
    modules: [
      {
        virtualModule: vmod.virtual.layout,
        resolvedModule: vmod.resolved.layout,
        hashKey: "layoutConfigHash",
      },
    ],
  },
]
