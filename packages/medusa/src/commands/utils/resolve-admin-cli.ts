import fs from "fs-extra"
import path from "path"

export function resolveAdminCLI(directory: string) {
  const cli = path.join(directory, "node_modules", ".bin", "medusa-admin")

  const binExists = fs.existsSync(cli)

  return {
    binExists,
    cli,
  }
}
