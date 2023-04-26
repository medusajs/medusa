import fse from "fs-extra"
import path from "path"
export const getLocalExtensions = async () => {
  const entry = path.resolve(process.cwd(), "dist", "admin", "index.js")

  const hasLocalEntry = await fse.pathExists(entry)

  if (!hasLocalEntry) {
    return null
  }

  return entry
}
