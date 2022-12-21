import { existsSync, readFileSync } from "fs-extra"
import { resolve } from "path"
import { reporter } from "../reporter"

export function loadBuild() {
  let pkg: string | undefined

  try {
    pkg = require.resolve("@medusajs/admin-ui/build")
  } catch (_err) {
    pkg = undefined
  }

  if (!pkg) {
    reporter.error(
      "Could not find @medusajs/admin-ui. Make sure it is installed."
    )
    return
  }

  const path = resolve(pkg, "..")

  if (!existsSync(pkg)) {
    reporter.error(
      "Could not find index.html. Make sure to run `medusa-admin-cli build` first."
    )
    return
  }

  const html = readFileSync(pkg, "utf8")

  return { html, path }
}
