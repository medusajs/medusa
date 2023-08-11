import * as fse from "fs-extra"
import path from "path"
import dedent from "ts-dedent"

type EjectParams = {
  outDir?: string
}

const DEFAULT_DESTINATION = "medusa-admin-ui"

export default async function eject({
  outDir = DEFAULT_DESTINATION,
}: EjectParams) {
  const projectPath = require.resolve("@medusajs/admin-ui")
  const uiPath = path.join(projectPath, "..", "..", "ui")

  const packageJsonPath = path.join(projectPath, "..", "..", "package.json")
  const pkg = await fse.readJSON(packageJsonPath)

  const fieldsToRemove = ["exports", "types", "files", "main", "packageManager"]
  fieldsToRemove.forEach((field) => delete pkg[field])

  pkg.type = "module"

  const dependenciesToMove = [
    "tailwindcss",
    "autoprefixer",
    "postcss",
    "tailwindcss-radix",
    "@tailwindcss/forms",
    "vite",
    "@vitejs/plugin-react",
  ]

  // Get dependencies in array from pkg.dependencies and move them to pkg.devDependencies
  const dependencies = Object.keys(pkg.dependencies).filter((dep) =>
    dependenciesToMove.includes(dep)
  )

  dependencies.forEach((dep) => {
    pkg.devDependencies[dep] = pkg.dependencies[dep]
    delete pkg.dependencies[dep]
  })

  pkg.scripts = {
    build: "vite build",
    dev: "vite --port 7001",
    preview: "vite preview",
  }

  const viteConfig = dedent`
  import { defineConfig } from "vite"
  import dns from "dns"
  import react from "@vitejs/plugin-react"

    // Resolve localhost for Node v16 and older.
    // @see https://vitejs.dev/config/server-options.html#server-host.
    dns.setDefaultResultOrder("verbatim")

    // https://vitejs.dev/config/
    export default defineConfig({
        plugins: [react()],
        define: {
            __BASE__: JSON.stringify("/"),
            __MEDUSA_BACKEND_URL__: JSON.stringify("http://localhost:9000"),
        },
    })
  `

  // Create new tailwind.config.js file based on the current one
  const tailwindConfig = await fse.readFile(
    path.join(uiPath, "tailwind.config.js"),
    "utf-8"
  )

  // Overwrite content field of module.exports in tailwind.config.js
  let newTailwindConfig = tailwindConfig.replace(
    /content:\s*\[[\s\S]*?\]/,
    `content: ["src/**/*.{js,ts,jsx,tsx}", "./index.html"]`
  )

  // Remove require of "path" in tailwind.config.js
  newTailwindConfig = newTailwindConfig.replace(
    /const path = require\("path"\)/,
    ""
  )

  // Create a new postcss.config.js file
  const postcssConfig = dedent`
    module.exports = {
        plugins: {
            "tailwindcss/nesting": {},
            tailwindcss: {},
            autoprefixer: {},
        }
    }
`

  const tmpPath = path.join(process.cwd(), outDir)

  await fse.copy(uiPath, tmpPath)
  await fse.remove(path.join(tmpPath, "tailwind.config.js"))
  await fse.remove(path.join(tmpPath, "postcss.config.js"))
  await fse.writeJSON(path.join(tmpPath, "package.json"), pkg)
  await fse.writeFile(path.join(tmpPath, "vite.config.ts"), viteConfig)
  await fse.writeFile(
    path.join(tmpPath, "tailwind.config.cjs"),
    newTailwindConfig
  )
  await fse.writeFile(path.join(tmpPath, "postcss.config.cjs"), postcssConfig)
}
