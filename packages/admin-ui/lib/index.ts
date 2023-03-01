import fse from "fs-extra"
import { resolve } from "path"
import vite from "vite"
import { AdminBuildConfig } from "./types"
import { getCustomViteConfig } from "./utils"

async function build(options?: AdminBuildConfig) {
  const config = getCustomViteConfig(options)

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

export { build, watch, clean }
