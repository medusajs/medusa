import fs from "fs-extra"
import path from "path"

export function resolveAdminCLI(directory) {
  let binExists = false
  let cli
  try {
    const pathToAdmin = require.resolve("@medusajs/admin")
    cli = path.resolve(pathToAdmin, "../../", "bin", "medusa-admin.js")
  } catch (error) {
    const parentDir = path.resolve(directory, "..")

    // reached root directory
    if (parentDir === directory) {
      console.warn("Couldn't find Admin CLI executable")
      return {
        binExists: false,
        cli: null,
      }
    }

    return resolveAdminCLI(parentDir)
  }

  binExists = fs.existsSync(cli)

  return {
    binExists,
    cli,
  }
}
