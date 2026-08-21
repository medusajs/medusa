// Brings Vite's ambient module declarations into scope, notably
// `declare module "*.css"`, so the side-effect import below typechecks. Needed
// here because triple-slash references are file-scoped and this package's
// tsconfig sets no `types`, so the reference in `vite.config.ts` doesn't apply.
/// <reference types="vite/client" />

import { withThemeByDataAttribute } from "@storybook/addon-themes"
import type { Preview } from "@storybook/react"

import "../src/main.css"

export const decorators = [
  withThemeByDataAttribute({
    themes: {
      Light: "light",
      Dark: "dark",
    },
    defaultTheme: "light",
    attributeName: "data-mode",
  }),
]

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview
