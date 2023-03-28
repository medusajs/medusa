import path, { resolve } from "path"
import { PluginOption } from "vite"
import { ADMIN_SHARED_DEPS } from "../constants/extensions"

export default function medusaAdminExtensions(): PluginOption {
  const virtualExtensionsId = "virtual:medusa-extensions"

  const uiPath = resolve(__dirname, "..", "..", "ui")

  const extensionsEntrypoint = null

  return [
    {
      name: "medusa-extensions-serve",
      apply: "serve",
      config: () => ({
        optimizeDeps: {
          include: ADMIN_SHARED_DEPS,
        },
      }),
      async buildStart() {
        await loadExtensions()
      },
      resolveId(id) {
        if (id === virtualExtensionsId) {
          return id
        }
      },
      load(id) {
        if (id === virtualExtensionsId) {
          return extensionsEntrypoint
        }
      },
    },
    {
      name: "medusa-extensions-build",
      apply: "build",
      config: () => ({
        build: {
          rollupOptions: {
            input: {
              index: path.resolve(uiPath, "index.html"),
              ...ADMIN_SHARED_DEPS.reduce(
                (acc, dep) => ({ ...acc, [dep.replace(/\//g, "_")]: dep }),
                {}
              ),
            },
            output: {
              entryFileNames: "assets/[name].[hash].entry.js",
            },
            external: [virtualExtensionsId],
            preserveEntrySignatures: "exports-only",
          },
        },
      }),
    },
  ]

  async function loadExtensions() {
    return `
      const plugin = {
        id: "test-plugin",
        extension: {
          async register(app) {
          app.injectComponent("order", "details", {
            name: "test-component",
            Component: () => {
              return (
                <div>
                  <h1>Test component</h1>
                  <div>I am a injected component</div>
                </div>
              )
            },
          })
        },
      },
    }

    export const plugins = [plugin]
    `
  }
}
