import dns from "dns"
import fse from "fs-extra"
import { resolve } from "path"
import vite from "vite"
import { AdminBuildConfig } from "./types"
import { AdminDevConfig } from "./types/dev"
import { getCustomViteConfig, getCustomViteDevConfig } from "./utils"
import { generateExtensionsEntrypoint } from "./utils/extensions/generate-extensions-entrypoint"
import { getExtensions } from "./utils/extensions/get-extensions"

async function build(options?: AdminBuildConfig) {
  const config = getCustomViteConfig(options)

  const uiPath = resolve(__dirname, "..", "ui")
  const tmpExtensionsPath = resolve(uiPath, "src", "extensions.ts")

  const extensions = await getExtensions()

  const extensionsEntrypoint = await generateExtensionsEntrypoint(
    extensions,
    tmpExtensionsPath
  )

  await fse.writeFile(tmpExtensionsPath, extensionsEntrypoint)

  await vite.build(config).catch((_err) => {
    process.exit(1)
  })

  await fse.writeJSON(
    resolve(config.build.outDir, "build-manifest.json"),
    options
  )
}

async function watch() {
  throw new Error("Not implemented")
}

async function clean() {
  throw new Error("Not implemented")
}

async function dev(options: AdminDevConfig) {
  // Resolve localhost for Node v16 and older.
  // @see https://vitejs.dev/config/server-options.html#server-host.
  dns.setDefaultResultOrder("verbatim")

  const server = await vite.createServer(getCustomViteDevConfig(options))
  await server.listen()

  server.printUrls()
}

export { build, dev, watch, clean }
export type { AdminBuildConfig, AdminDevConfig }
