import { generateEditedDates, generateSidebar, copyMdxToPublic } from "build-scripts"
import { sidebar } from "../sidebar.mjs"
import path from "path"

async function main() {
  await generateSidebar(sidebar)
  await generateEditedDates()
  if (process.env.CF_PAGES === "1") {
    await copyMdxToPublic({
      srcDir: path.join(process.cwd(), "app"),
      destDir: path.join(process.cwd(), "public", "raw-mdx"),
    })
  }
}

void main()
