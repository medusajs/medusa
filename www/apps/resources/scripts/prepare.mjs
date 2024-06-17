import { generateSidebar } from "build-scripts"
import { main as generateSlugChanges } from "./generate-slug-changes.mjs"
import { main as generateFilesMap } from "./generate-files-map.mjs"
import { sidebar } from "../sidebar.mjs"

async function main() {
  await generateSidebar(sidebar)
  await generateSlugChanges()
  await generateFilesMap()
}

void main()
