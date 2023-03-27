import path from "path"
import { LoadedExtension } from "../../types/extensions"
import { listDirectories } from "./list-directories"

export const getLocalExtensions = async () => {
  const root = path.resolve(process.cwd(), "extensions")

  const extensionNames = await listDirectories(root)

  const extensions: LoadedExtension[] = []

  for (const extensionName of extensionNames) {
    extensions.push({
      name: extensionName,
      path: path.resolve(root, extensionName),
      entrypoint: "index.js",
    })
  }

  return extensions
}
