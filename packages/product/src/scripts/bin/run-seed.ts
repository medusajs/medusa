#!/usr/bin/env node

import { run } from "../seed"
import { EOL } from "os"

const args = process.argv
const path = args.pop() as string

export default (async () => {
  const { config } = await import("dotenv")
  config()
  if (!path) {
    throw new Error(
      `filePath is required.${EOL}Example: medusa-product-seed <filePath>`
    )
  }

  await run({ path })
})()
