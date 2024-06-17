import { writeFileSync } from "fs"
import getSlugs from "../utils/get-slugs.mjs"
import path from "path"

export async function main() {
  const slugs = await getSlugs()
  slugs.push(
    ...(await getSlugs({
      basePath: path.resolve("references"),
      baseSlug: path.resolve(),
    }))
  )

  // write generated slugs
  writeFileSync(
    path.resolve("generated", "slug-changes.mjs"),
    `export const slugChanges = ${JSON.stringify(slugs, null, 2)}`
  )
}
