// eslint-disable-next-line spaced-comment
/// <reference types="vitest" />
import react from "@vitejs/plugin-react"
import dns from "dns"
import fs from "fs"
import colors from "picocolors"
import { defineConfig } from "vite"

// Resolve localhost for Node v16 and older.
// @see https://vitejs.dev/config/server-options.html#server-host.
dns.setDefaultResultOrder("verbatim")

// https://vitejs.dev/config/
export default defineConfig(() => {
  const extFileExists = fs.existsSync("./ui/src/extensions.ts")

  /**
   * Create extensions file if it doesn't exist.
   * This is needed to prevent Vite import:analysis from failing.
   * NOTE that the file is ignored by git.
   */
  if (!extFileExists) {
    console.log(
      colors.cyan("[@medusajs/admin-ui]: Creating empty extensions file")
    )

    fs.writeFileSync(
      "./ui/src/extensions.ts",
      `const extensions = []\n\nexport default extensions\n`
    )
  }

  const tailwindContentExists = fs.existsSync("./ui/tailwind.content.js")

  /**
   * Create tailwind content file if it doesn't exist.
   * This is needed to prevent Vite import:analysis from failing.
   * NOTE that the file is ignored by git.
   */
  if (!tailwindContentExists) {
    console.log(
      colors.cyan("[@medusajs/admin-ui]: Creating empty tailwind content file")
    )

    fs.writeFileSync(
      "./ui/tailwind.content.js",
      `module.exports = {
        content: []
      }\n\n`
    )
  }

  return {
    plugins: [react()],
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["/test/setup.ts"],
    },
    root: "ui",
    define: {
      __BASE__: JSON.stringify("/"),
      __MEDUSA_BACKEND_URL__: JSON.stringify("http://localhost:9000"),
    },
    build: {
      outDir: "preview",
    },
    resolve: {
      alias: {
        "@tanstack/react-query": require.resolve("@tanstack/react-query"),
      },
    },
  }
})
