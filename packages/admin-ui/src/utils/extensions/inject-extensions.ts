import fse from "fs-extra"
import { resolve } from "path"
import colors from "picocolors"
import { generateExtensionsEntrypoint } from "./generate-extensions-entrypoint"
import { getExtensions } from "./get-extensions"

export async function injectExtensions() {
  const uiPath = resolve(__dirname, "..", "..", "..", "ui")
  const tmpExtensionsPath = resolve(uiPath, "src", "extensions.ts")

  const extensions = await getExtensions()

  const extensionsEntrypoint = await generateExtensionsEntrypoint(
    extensions,
    tmpExtensionsPath
  )

  console.warn(
    colors.yellow(
      `[@medusajs/admin-ui]: Creating extensions file at: ${colors.bold(
        tmpExtensionsPath
      )}`
    )
  )

  await fse.writeFile(tmpExtensionsPath, extensionsEntrypoint)
}
