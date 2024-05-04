import type { Config } from "tailwindcss"

import plugin from "./plugin"

const preset = {
  content: [],
  plugins: [plugin, require("tailwindcss-animate")] as Config["plugins"],
} satisfies Config

export { preset }
