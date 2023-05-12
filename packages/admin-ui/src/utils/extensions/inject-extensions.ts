import fse from "fs-extra"
import { resolve } from "path"
import { generateExtensionsEntrypoint } from "./generate-extensions-entrypoint"
import { getExtensions } from "./get-extensions"

export async function injectExtensions() {
  const uiPath = resolve(__dirname, "..", "..", "..", "ui")
  const tmpExtensionsPath = resolve(uiPath, "src", "extensions.ts")

  console.log("Injecting extensions at ", tmpExtensionsPath)

  const extensions = await getExtensions()

  const extensionsEntrypoint = await generateExtensionsEntrypoint(
    extensions,
    tmpExtensionsPath
  )

  await fse.writeFile(tmpExtensionsPath, extensionsEntrypoint)
}
