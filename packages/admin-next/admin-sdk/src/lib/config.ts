import path from "path"
import { Config } from "tailwindcss"
import type { InlineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"

import { BundlerOptions } from "../types"

export async function getViteConfig(
  options: BundlerOptions
): Promise<InlineConfig> {
  const { searchForWorkspaceRoot } = await import("vite")
  const { default: react } = await import("@vitejs/plugin-react")
  const { default: inject } = await import("@medusajs/admin-vite-plugin")

  const getPort = await import("get-port")
  const hmrPort = await getPort.default()

  const root = path.resolve(__dirname, "./")

  const backendUrl = options.backendUrl ?? ""

  return {
    root: path.resolve(__dirname, "./"),
    base: options.path,
    build: {
      emptyOutDir: true,
      outDir: path.resolve(process.cwd(), options.outDir),
    },
    optimizeDeps: {
      include: ["@medusajs/dashboard", "react-dom/client"],
    },
    define: {
      __BASE__: JSON.stringify(options.path),
      __BACKEND_URL__: JSON.stringify(backendUrl),
    },
    server: {
      open: true,
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          path.resolve(__dirname, "../../medusa"),
          path.resolve(__dirname, "../../app"),
        ],
      },
      hmr: {
        port: hmrPort,
      },
      middlewareMode: true,
    },
    css: {
      postcss: {
        plugins: [
          require("tailwindcss")({
            config: createTailwindConfig(root),
          }),
        ],
      },
    },
    /**
     * TODO: Remove polyfills, they are currently only required for the
     * `axios` dependency in the dashboard. Once we have the new SDK,
     * we should remove this, and leave it up to the user to include
     * polyfills if they need them.
     */
    plugins: [
      react(),
      inject(),
      nodePolyfills({
        include: ["crypto", "util", "stream"],
      }),
    ],
  }
}

function createTailwindConfig(entry: string) {
  const root = path.join(entry, "**/*.{js,ts,jsx,tsx}")
  const html = path.join(entry, "index.html")

  let dashboard = ""

  try {
    dashboard = path.join(
      path.dirname(require.resolve("@medusajs/dashboard")),
      "**/*.{js,ts,jsx,tsx}"
    )
  } catch (_e) {
    // ignore
  }

  let ui: string = ""

  try {
    ui = path.join(
      path.dirname(require.resolve("@medusajs/ui")),
      "**/*.{js,ts,jsx,tsx}"
    )
  } catch (_e) {
    // ignore
  }

  const config: Config = {
    presets: [require("@medusajs/ui-preset")],
    content: [html, root, dashboard, ui],
    darkMode: "class",
  }

  return config
}
