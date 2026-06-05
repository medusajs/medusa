import {
  generateEditedDates,
  generateSplitSidebars,
  copyMdxToPublic,
} from "build-scripts"
import { main as generateSlugChanges } from "./generate-slug-changes.mjs"
import { main as generateFilesMap } from "./generate-files-map.mjs"
import { sidebar } from "../sidebar.mjs"
import path from "path"

async function main() {
  await generateSplitSidebars({
    sidebars: sidebar,
  })
  await generateSlugChanges()
  await generateFilesMap()
  await generateEditedDates()
  if (!!process.env.CLOUDFLARE_ENV) {
    await copyMdxToPublic({
      srcDir: path.join(process.cwd(), "app"),
      destDir: path.join(process.cwd(), "public", "raw-mdx"),
    })
  }
}

void main()
