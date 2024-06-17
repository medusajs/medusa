#!/usr/bin/env node

import { Modules } from "@medusajs/modules-sdk"
import { ModulesSdkUtils } from "@medusajs/utils"
import * as RegionModels from "@models"
import { EOL } from "os"
import { createRegions } from "../seed-utils"

const args = process.argv
const path = args.pop() as string

export default (async () => {
  const { config } = await import("dotenv")
  config()
  if (!path) {
    throw new Error(
      `filePath is required.${EOL}Example: medusa-region-seed <filePath>`
    )
  }

  const run = ModulesSdkUtils.buildSeedScript({
    moduleName: Modules.REGION,
    models: RegionModels,
    pathToMigrations: __dirname + "/../../migrations",
    seedHandler: async ({ manager, data }) => {
      const { regionData } = data
      await createRegions(manager, regionData)
    },
  })
  await run({ path })
})()
