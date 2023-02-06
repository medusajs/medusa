import react from "@vitejs/plugin-react"
import { resolve } from "path"
import { BuildOptions, InlineConfig } from "vite"
import { AdminBuildConfig } from "../types"
import { formatBase } from "./format-base"

export const getCustomViteConfig = (config: AdminBuildConfig): InlineConfig => {
  const { globals = {}, build = {} } = config

  const uiPath = resolve(__dirname, "..", "..", "ui")

  const globalReplacements = () => {
    const { base = "dashboard", backend = "/" } = globals

    return {
      __BASE__: JSON.stringify(`/${base}`),
      __BACKEND__: JSON.stringify(backend),
    }
  }

  const buildConfig = (): BuildOptions => {
    const { outDir } = build

    let destDir: string

    if (!outDir) {
      /**
       * Default build directory is at the root of the `@medusajs/admin-ui` package.
       */
      destDir = resolve(__dirname, "..", "..", "build")
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
    plugins: [react()],
    root: uiPath,
    mode: "production",
    base: formatBase(globals.base),
    define: globalReplacements(),
    build: buildConfig(),
    clearScreen: false,
    logLevel: "error",
  }
}
