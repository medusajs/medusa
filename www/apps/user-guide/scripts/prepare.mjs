import { generateSidebar } from "build-scripts"
import { sidebar } from "../sidebar.mjs"

async function main() {
  generateSidebar(sidebar)
}

void main()
