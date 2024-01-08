import { resolveExecutable } from "./resolve-executable"

export function resolveAdminCLI(directory) {
  try {
    const adminExecutable = resolveExecutable(
      directory,
      "@medusajs/admin",
      "../../",
      "bin",
      "medusa-admin.js"
    )

    console.log("Admin executable: ", adminExecutable)

    return { cli: adminExecutable, binExists: true }
  } catch (e) {
    return { cli: null, binExists: false }
  }
}
