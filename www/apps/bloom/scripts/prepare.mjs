import { generateEditedDates, generateSidebar } from "build-scripts"
import { sidebar } from "../sidebar.mjs"

async function main() {
  await generateSidebar(sidebar)
  await generateEditedDates()
}

void main()
