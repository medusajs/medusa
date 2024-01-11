#!/usr/bin/env node

import { EOL } from "os"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Modules } from "@medusajs/modules-sdk"

import * as PaymentModels from "@models"

import { createPayments } from "../seed-utils"

const args = process.argv
const path = args.pop() as string

export default (async () => {
  const { config } = await import("dotenv")
  config()
  if (!path) {
    throw new Error(
      `filePath is required.${EOL}Example: medusa-payment-seed <filePath>`
    )
  }

  const run = ModulesSdkUtils.buildSeedScript({
    moduleName: Modules.PAYMENT,
    models: PaymentModels,
    pathToMigrations: __dirname + "/../../migrations",
    seedHandler: async ({ manager, data }) => {
      const { paymentsData } = data
      await createPayments(manager, paymentsData)
    },
  })
  await run({ path })
})()
