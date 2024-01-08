import { resolveExecutable } from "./resolve-executable"

export function resolveAdminCLI(directory) {
  const adminExecutable = resolveExecutable(
    directory,
    "@medusajs/admin",
    "../../",
    "bin",
    "medusa-admin.js"
  )

  return { cli: adminExecutable, binExists: adminExecutable ? true : false }
}
