import { generateEditedDates, generateSplitSidebars } from "build-scripts"
import { main as generateSlugChanges } from "./generate-slug-changes.mjs"
import { main as generateFilesMap } from "./generate-files-map.mjs"
import { sidebar } from "../sidebar.mjs"

async function main() {
  await generateSplitSidebars({
    sidebars: sidebar,
  })
  await generateSlugChanges()
  await generateFilesMap()
  await generateEditedDates()
}

void main()
