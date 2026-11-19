import type { Plugin } from "vite"
import { writeStaticFiles as writeStaticFilesUtils } from "../utils/write-static-files"

interface WriteStaticFilesPluginOptions {
  plugins?: string[]
  sources?: string[]
}

export const writeStaticFiles = (
  options: WriteStaticFilesPluginOptions
): Plugin => {
  return {
    name: "medusa:write-static-files",
    buildStart: async (ctx) => {
      await writeStaticFilesUtils(options.plugins, options.sources)
    },
  }
}
