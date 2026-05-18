/* eslint-disable no-console */
import { readdirSync, writeFileSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const specsDir = path.resolve(__dirname, "../specs/components")
const outputPath = path.resolve(__dirname, "../generated/components-index.mjs")

export function generateSpecsIndex() {
  const componentDirs = readdirSync(specsDir, { withFileTypes: true }).filter(
    (entry) => entry.isDirectory()
  )

  /** @type {Record<string, string[]>} */
  const index = {}

  for (const dir of componentDirs) {
    const files = readdirSync(path.join(specsDir, dir.name)).filter((f) =>
      f.endsWith(".json")
    )
    index[dir.name] = files
  }

  const entries = Object.entries(index)
    .map(([component, files]) => {
      const filesStr = files.map((f) => `"${f}"`).join(", ")
      return `  "${component}": [${filesStr}]`
    })
    .join(",\n")

  const content = `/**
 * @type {Record<string, string[]>}
 */
export const ComponentSpecsIndex = {
${entries},
}
`

  writeFileSync(outputPath, content)
  console.log(`Generated specs index at ${outputPath}`)
}
