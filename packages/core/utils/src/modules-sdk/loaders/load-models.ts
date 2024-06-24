import { readdirSync, statSync } from "fs"
import { join } from "path"

/**
 * Load all the models from the given path
 * @param basePath
 */
export function loadModels(basePath: string) {
  const excludedExtensions = [".ts.map", ".js.map", ".d.ts"]

  let modelsFiles: any[] = []
  try {
    modelsFiles = readdirSync(basePath)
  } catch (e) {}

  return modelsFiles
    .flatMap((file) => {
      if (
        file.startsWith("index.") ||
        excludedExtensions.some((ext) => file.endsWith(ext))
      ) {
        return
      }

      const filePath = join(basePath, file)
      const stats = statSync(filePath)

      if (stats.isFile()) {
        try {
          const required = require(filePath)
          return Object.values(required).filter(
            (resource) => typeof resource === "function" && !!resource.name
          )
        } catch (e) {}
      }

      return
    })
    .filter(Boolean) as { name: string }[]
}
