import fs from "fs-extra"
import path from "path"

export function resolveAdminCLI() {
  let adminCLI: string | null = null

  try {
    adminCLI = path.resolve(
      require.resolve("@medusajs/admin"),
      "../../",
      "bin",
      "medusa-admin.js"
    )
  } catch (_err) {
    // no-op
  }

  if (!adminCLI) {
    return null
  }

  const binExists = fs.existsSync(adminCLI)

  if (!binExists) {
    return null
  }

  return adminCLI
}
