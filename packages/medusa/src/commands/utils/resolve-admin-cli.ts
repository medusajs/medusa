import fs from "fs-extra"
import path from "path"

export function resolveAdminCLI() {
  const cli = path.resolve(
    require.resolve("@medusajs/admin"),
    "../../",
    "bin",
    "medusa-admin.js"
  )

  const binExists = fs.existsSync(cli)

  return {
    binExists,
    cli,
  }
}
