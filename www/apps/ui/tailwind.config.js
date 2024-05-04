import path from "path"
import coreConfig from "tailwind"

// Get two levels up from require.resolve("@medusajs/ui")
const root = path.join(require.resolve("@medusajs/ui"), "../..")
const uiPath = path.join(root, "**/*.{js,ts,jsx,tsx,mdx}")

// filter out unwanted config from the core theme
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { spacing, ...coreTheme } = coreConfig.theme || {}
// filter out unwanted config from extended theme
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { borderRadius, ...extendedTheme } = coreConfig.theme?.extend || {}

// remove core spacing except those having "docs" prefix
const modifiedSpacing = {}
Object.entries(coreConfig.theme.spacing)
  .filter(([key]) => key.startsWith("docs_"))
  .map(([key, value]) => {
    modifiedSpacing[key] = value
  })

// remove core border radius except those having "docs" prefix
const modifiedRadius = {}
Object.entries(coreConfig.theme.extend.borderRadius)
  .filter(([key]) => key.startsWith("docs_"))
  .map(([key, value]) => {
    modifiedRadius[key] = value
  })

module.exports = {
  ...coreConfig,
  content: [...coreConfig.content, "./src/**/*.{js,ts,jsx,tsx,mdx}", uiPath],
  theme: {
    ...coreTheme,
    extend: {
      ...extendedTheme,
      container: {
        center: true,
        screens: {
          "2xl": "1400px",
        },
      },
      borderRadius: modifiedRadius,
      spacing: modifiedSpacing,
    },
  },
}
