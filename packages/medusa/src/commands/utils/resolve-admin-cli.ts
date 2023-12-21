import fs from "fs-extra"
import path from "path"

export function resolveAdminCLI(directory) {
  let binExists = false
  let cli
  try {
    const pathToAdmin = require.resolve("@medusajs/admin", {
      paths: [directory],
    })
    cli = path.resolve(pathToAdmin, "../../", "bin", "medusa-admin.js")
    binExists = fs.existsSync(cli)
  } catch (error) {
    const parentDir = path.resolve(directory, "..")

    if (parentDir === directory) {
      return {
        binExists: false,
        cli: null,
      }
    }

    return resolveAdminCLI(parentDir)
  }

  return {
    binExists,
    cli,
  }
}
