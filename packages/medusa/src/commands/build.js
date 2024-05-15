import "core-js/stable"
import "regenerator-runtime/runtime"
import { track } from "medusa-telemetry"
import { build } from "@medusajs/admin-sdk"
import { findFiles, medusaTransform } from "./utils/build-helpers"
import fs from "node:fs/promises"

const inputDir = "./src"
const outputDir = "./dist"

export default async function ({}) {
  async function buildCmd() {
    const started = Date.now()

    track("CLI_BUILD")

    const files = await findFiles(inputDir)
    await fs.rm(outputDir, { recursive: true }).catch(() => {})

    await Promise.all(files.map(async (file) => medusaTransform(file)))

    // const adminOptions = {
    //   disable: false,
    //   path: "/app",
    //   outDir: "./build",
    // }

    // await build(adminOptions)

    console.log(`Compiled all files in ${Date.now() - started}ms`)
    process.exit()
  }

  await buildCmd()
}
