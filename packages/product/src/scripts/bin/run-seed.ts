import { run } from "../seed"
import { EOL } from "os"
import { config } from "dotenv"

config()

const args = process.argv
const path = args.pop() as string
console.log(path)

export default (async () => {
  if (!path) {
    throw new Error(
      `filePath is required.${EOL}Example: node_modules/@medusajs/product/dist/scripts/bin/run-seed.js <filePath>`
    )
  }

  await run({ path })
})()
