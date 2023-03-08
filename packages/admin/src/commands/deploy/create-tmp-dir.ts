import * as fse from "fs-extra"
import path from "path"
import dedent from "ts-dedent"

const animals = [
  "aardvark",
  "albatross",
  "alligator",
  "alpaca",
  "ant",
  "anteater",
  "antelope",
]

/**
 * Creates a temporary directory that contains a version of the admin UI
 * that can be deployed externally. This is necessary because the admin
 * per default is configured to be build within the the context of a Medusa
 * server project.
 *
 * The temporary directory will contain a package.json that has been modified
 * to remove fields that are not needed for the deployment, as well as placing
 * dependencies in the correct location. The temporary directory will also
 * contain a vite.config.ts file based on the user specified config.
 *
 * @returns The path to the temporary directory
 */
export async function createTmpDir() {
  const projectPath = require.resolve("@medusajs/admin-ui")
  const uiPath = path.join(projectPath, "..", "..", "ui")

  // Get path to package.json
  const packageJsonPath = path.join(projectPath, "..", "..", "package.json")

  // Create a new package.json based on the current one that we can modify
  const pkg = await fse.readJSON(packageJsonPath)

  // Remove exports field
  delete pkg.exports

  // Remove types field
  delete pkg.types

  // Remove files field
  delete pkg.files

  // Remove main field
  delete pkg.main

  // Remove package manager field
  delete pkg.packageManager

  // Add type field
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

  // TESTING ONLY: Set the version of the dependency `medusa-react` to `next`
  pkg.dependencies["medusa-react"] = "next"

  // Overwrite scripts field
  pkg.scripts = {
    build: "vite build",
  }

  // Create a vite.config.ts file
  const viteConfig = dedent`
    import react from "@vitejs/plugin-react"
    import { defineConfig } from "vite"

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

  const randomDir = `${
    animals[Math.floor(Math.random() * animals.length)]
  }-${Math.floor(Math.random() * 1000)}`

  // Copy UI folder to a temporary folder
  const tmpPath = path.join(process.cwd(), randomDir)
  await fse.copy(uiPath, tmpPath)

  // Remove old tailwind.config.js
  await fse.remove(path.join(tmpPath, "tailwind.config.js"))

  // Remove old postcss.config.js
  await fse.remove(path.join(tmpPath, "postcss.config.js"))

  // Write new package.json to temporary folder
  await fse.writeJSON(path.join(tmpPath, "package.json"), pkg)

  // Write vite.config.ts to temporary folder
  await fse.writeFile(path.join(tmpPath, "vite.config.ts"), viteConfig)

  // Write new tailwind.config.js to temporary folder
  await fse.writeFile(
    path.join(tmpPath, "tailwind.config.cjs"),
    newTailwindConfig
  )

  // Write postcss.config.js to temporary folder
  await fse.writeFile(path.join(tmpPath, "postcss.config.cjs"), postcssConfig)

  return tmpPath
}
