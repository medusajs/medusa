import type { Config } from "tailwindcss"
import path from "path"
import coreConfig from "../../tailwind.config"

// Get two levels up from require.resolve("@medusajs/ui")
const root = path.join(require.resolve("@medusajs/ui"), "../..")
const uiPath = path.join(root, "**/*.{js,ts,jsx,tsx,mdx}")

// filter out unwanted config from the core theme
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { spacing, ...coreTheme } = coreConfig.theme || {}
// filter out unwanted config from extended theme
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { borderRadius, ...extendedTheme } = coreConfig.theme?.extend || {}

const config: Config = {
  ...coreConfig,
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", uiPath],
  theme: {
    // ...coreTheme,
    extend: {
      ...extendedTheme,
      container: {
        center: true,
        screens: {
          "2xl": "1400px",
        },
      },
    },
  },
}

export default config
