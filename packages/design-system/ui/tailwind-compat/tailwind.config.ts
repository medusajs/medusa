import path from "path"
import { preset } from "../../ui-preset/src/preset"

export default {
  presets: [preset],
  content: [path.join(__dirname, "../src/**/*.{ts,tsx}")],
  darkMode: ["class", '[data-mode="dark"]'],
}
