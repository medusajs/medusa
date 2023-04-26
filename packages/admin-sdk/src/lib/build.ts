import commonjs from "@rollup/plugin-commonjs"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import typescript from "@rollup/plugin-typescript"
import fse from "fs-extra"

import path from "path"
import {
  InputPluginOption,
  rollup,
  RollupOptions,
  watch as rollupWatch,
} from "rollup"

type BuildOptions = {
  watch?: boolean
}

export async function build({ watch }: BuildOptions) {
  const indexFilePath = path.join(process.cwd(), "src", "admin", "index")

  let language: "ts" | "js" = "js"

  if (fse.existsSync(`${indexFilePath}.ts`)) {
    language = "ts"
  }

  const entry = `${indexFilePath}.${language}`

  const plugins: InputPluginOption = [nodeResolve(), commonjs(), terser()]

  // If the project is using TypeScript, we need to use the TypeScript plugin
  if (language === "ts") {
    const tsconfigPath = path.resolve(process.cwd(), "tsconfig.admin.json")

    if (!fse.existsSync(tsconfigPath)) {
      throw new Error(
        `Could not find tsconfig.admin.json in the root of the project.`
      )
    }

    // Terser plugin should go last so we inject the TypeScript plugin in the second to last position
    plugins.splice(
      plugins.length - 1,
      0,
      typescript({ tsconfig: tsconfigPath, module: "esnext" })
    )
  }

  const dist = path.resolve(process.cwd(), "dist", "admin")

  const rollupOptions: RollupOptions = {
    input: entry,
    output: {
      dir: dist,
      chunkFileNames: "[name].js",
      format: "es",
    },
    plugins,
    external: ["react"],
  }

  if (watch) {
    // Watch for file changes and rebuild on each change
    const watcher = rollupWatch({
      ...rollupOptions,
      watch: {
        clearScreen: true,
      },
    })

    // Stop the watcher when the process exits
    process.on("SIGTERM", () => {
      watcher.close()
    })

    // Print a message every time the watcher rebuilds
    watcher.on("event", (event) => {
      if (event.code === "BUNDLE_END") {
        console.log("Rebuilt successfully.")
      }
    })
  } else {
    // Build once and exit
    const bundle = await rollup(rollupOptions)

    await bundle.write({
      dir: dist,
    })
  }
}
