import { writeFileSync } from "fs"
import getSlugs from "../utils/get-slugs.mjs"
import path from "path"

export async function main() {
  // Only app pages need slug-change tracking now. References use the JSON
  // doc-model, whose final slug is baked into each page and indexed directly
  // in the files map.
  const slugs = await getSlugs()

  // write generated slugs
  writeFileSync(
    path.resolve("generated", "slug-changes.mjs"),
    `export const slugChanges = ${JSON.stringify(slugs, null, 2)}`
  )
}
