import fse from "fs-extra"
import path from "path"
import dedent from "ts-dedent"

/**
 * Determines the identifier for the extension. If the extensions is local,
 * meaning it is part of a Medusa project, the identifier will be "local".
 * If the extension is a plugin, the identifier will be the name of the plugin.
 * @returns identifier for the extension
 */
export async function getIdentifier() {
  const hasMedusaConfig = await fse.pathExists(
    path.join(process.cwd(), "medusa-config.js")
  )

  if (hasMedusaConfig) {
    return "local"
  }

  const pkg = await fse.readJSON(path.join(process.cwd(), "package.json"))

  if (!pkg) {
    throw new Error(
      dedent`
      [@medusajs/admin-sdk]: We could not find a "medusa-config.js" or "package.json" file. Your project is not a valid Medusa project or plugin.
      `
    )
  }

  if (!pkg.name) {
    throw new Error(
      dedent`
      [@medusajs/admin-sdk]: Your package.json file does not have a "name" property. Add one and try again.
      `
    )
  }

  return pkg.name as string
}
