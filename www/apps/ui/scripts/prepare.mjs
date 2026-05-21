/* eslint-disable no-console */
import { generateEditedDates, generateSidebar } from "build-scripts"
import { sidebar } from "../sidebar.mjs"
import path from "path"
import { copyFileSync } from "fs"
import { execSync } from "child_process"
import { fileURLToPath } from "url"

async function main() {
  await generateSidebar(sidebar)
  await generateEditedDates()

  // copy colors from the `@medusajs/ui-preset` package
  const resolvedURL = import.meta.resolve("@medusajs/ui-preset")
  const resolvedPath = fileURLToPath(resolvedURL)
  const originalPath = path.join(
    resolvedPath,
    "../..",
    "src/theme/tokens/colors.ts"
  )
  const newPath = path.resolve("config", "colors.ts")

  console.info(`Copying file from ${originalPath} to ${newPath}...`)

  copyFileSync(originalPath, newPath)

  console.info(`File copied successfully`)

  // fix possible eslint errors to avoid build errors
  console.info("Running ESLint...")

  execSync(`npx eslint ${newPath} --fix`)

  console.info("Finished ESLint process")
}

void main()
