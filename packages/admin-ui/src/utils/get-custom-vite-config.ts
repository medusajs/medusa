import react from "@vitejs/plugin-react"
import fs from "fs"
import path, { resolve } from "path"
import { BuildOptions, InlineConfig } from "vite"
import medusaAdminExtensions from "../plugins/extensions"
import { AdminBuildConfig } from "../types"
import { formatBase } from "./format-base"

const EXTENSIONS_PATH = path.join(process.cwd(), "extensions")

export const getCustomViteConfig = (config: AdminBuildConfig): InlineConfig => {
  const { globals = {}, build = {} } = config

  const uiPath = resolve(__dirname, "..", "..", "ui")

  const globalReplacements = () => {
    let backend = undefined

    if (globals.backend) {
      try {
        // Test if the backend is a valid URL
        new URL(globals.backend)
        backend = globals.backend
      } catch (_e) {
        throw new Error(
          `The provided backend URL is not valid: ${globals.backend}. Please provide a valid URL (e.g. https://my-medusa-server.com).`
        )
      }
    }

    const global = {}

    global["__BASE__"] = JSON.stringify(globals.base ? `/${globals.base}` : "/")
    global["__MEDUSA_BACKEND_URL__"] = JSON.stringify(backend ? backend : "/")

    return global
  }

  const buildConfig = (): BuildOptions => {
    const { outDir } = build

    let destDir: string

    if (!outDir) {
      /**
       * Default build directory is at the root of the `@medusajs/admin-ui` package.
       */
      destDir = resolve(process.cwd(), "build")
    } else {
      /**
       * If a custom build directory is specified, it is resolved relative to the
       * current working directory.
       */
      destDir = resolve(process.cwd(), outDir)
    }

    return {
      outDir: destDir,
      emptyOutDir: true,
    }
  }

  return {
    plugins: [react(), medusaAdminExtensions()],
    root: uiPath,
    mode: "production",
    base: formatBase(globals.base),
    define: globalReplacements(),
    build: buildConfig(),
    resolve: {
      alias: {
        "@tanstack/react-query": resolve(
          require.resolve("@tanstack/react-query")
        ),
      },
    },
    // server: {
    //   port: 9000,
    //   proxy: {
    //     [`^/(?!${globals.base || "app"})`]: {
    //       target: process.env.API_URL
    //         ? process.env.API_URL
    //         : "http://localhost:9000",
    //       changeOrigin: true,
    //     },
    //   },
    //   fs: {
    //     allow: [
    //       searchForWorkspaceRoot(process.cwd()),
    //       ...getExtensionsRealPaths(),
    //     ],
    //   },
    // },
    clearScreen: false,
    logLevel: "error",
  }
}

function getExtensionsRealPaths() {
  return fs.existsSync(EXTENSIONS_PATH)
    ? fs
        .readdirSync(EXTENSIONS_PATH)
        .flatMap((typeDir) => {
          const extensionTypeDir = path.join(EXTENSIONS_PATH, typeDir)
          if (!fs.lstatSync(extensionTypeDir).isDirectory()) {
            return
          }
          return fs
            .readdirSync(extensionTypeDir)
            .map((dir) => fs.realpathSync(path.join(extensionTypeDir, dir)))
        })
        .filter((v) => v)
    : []
}
