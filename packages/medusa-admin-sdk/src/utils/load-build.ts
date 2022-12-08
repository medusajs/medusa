import { existsSync, readFileSync } from "fs-extra"
import { resolve } from "path"
import { Logger } from "../logger"

const logger = new Logger("Load HTML")

export function loadBuild() {
  let pkg: string | undefined

  try {
    pkg = require.resolve("@medusajs/admin-ui")
  } catch (_err) {
    pkg = undefined
  }

  if (!pkg) {
    logger.error(
      "Could not find @medusajs/admin-ui. Make sure it is installed."
    )
    return
  }

  const path = resolve(pkg, "build")
  const htmlPath = resolve(path, "index.html")

  if (!existsSync(htmlPath)) {
    logger.error(
      "Could not find index.html. Make sure to run `medusa-admin-cli build` first."
    )
    return
  }

  const html = readFileSync(htmlPath, "utf8")

  return { html, path }
}
