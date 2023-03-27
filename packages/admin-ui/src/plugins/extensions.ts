import path from "path"
import { PluginOption } from "vite"
import { ADMIN_SHARED_DEPS } from "../constants/extensions"
import { generateExtensionsEntrypoint } from "../utils/extensions/generate-extensions-entrypoint"
import { getLocalExtensions } from "../utils/extensions/get-extensions"

export default function medusaAdminExtensions(): PluginOption {
  const virtualExtensionsId = "@medusa-admin-extensions"

  let extensionsEntrypoint = null

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
              index: path.resolve(__dirname, "index.html"),
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
    const localExtensions = await getLocalExtensions()

    console.error("local extensions", JSON.stringify(localExtensions, null, 2))

    extensionsEntrypoint = generateExtensionsEntrypoint(localExtensions)
  }
}
