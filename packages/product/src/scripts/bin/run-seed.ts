import { run } from "../seed"
import { EOL } from "os"

const args = process.argv
const path = args.pop() as string

export default (async () => {
  const { config } = await import("dotenv")
  config()
  if (!path) {
    throw new Error(
      `filePath is required.${EOL}Example: node_modules/@medusajs/product/dist/scripts/bin/run-seed.js <filePath>`
    )
  }

  await run({ path })
})()
