import path from "path"
import coreConfig from "./modified.tailwind.config"

// Get two levels up from require.resolve("@medusajs/ui")
const root = path.join(require.resolve("docs-ui"), "../..")
const uiPath = path.join(root, "**/*.{js,ts,jsx,tsx,mdx}")

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...coreConfig,
  content: [uiPath],
}
