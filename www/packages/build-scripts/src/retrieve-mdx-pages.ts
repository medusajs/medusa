import { readdirSync } from "fs"
import path from "path"

type Options = {
  basePath: string
}

export function retrieveMdxPages({ basePath }: Options): string[] {
  function retrieveMdxFilesInPath(dir: string): string[] {
    const urls = []
    const files = readdirSync(dir, {
      withFileTypes: true,
    })

    for (const file of files) {
      const filePath = path.join(dir, file.name)
      if (file.isDirectory()) {
        if (!file.name.startsWith("_")) {
          urls.push(...retrieveMdxFilesInPath(filePath))
        }
        continue
      } else if (file.name !== "page.mdx") {
        continue
      }

      urls.push(
        filePath.replace(basePath, "").replace(file.name, "").replace(/\/$/, "")
      )
    }

    return urls
  }

  return retrieveMdxFilesInPath(basePath)
}
