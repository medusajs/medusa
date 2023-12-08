/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// copy colors from the `@medusajs/ui-preset` package
// to `src/config/colors.ts`

const originalPath = path.join(
  require.resolve("@medusajs/ui-preset"),
  "../..",
  "src/theme/tokens/colors.ts"
)
const newPath = path.join("src/config/colors.ts")

console.info(`Copying file from ${originalPath} to ${newPath}...`)

fs.copyFileSync(originalPath, newPath)

console.info(`File copied successfully`)

// fix possible eslint errors to avoid build errors
console.info("Running ESLint...")

execSync(`npx eslint ${newPath} --fix`)

console.info("Finished ESLint process")
