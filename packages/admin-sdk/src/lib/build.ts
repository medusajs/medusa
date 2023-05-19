import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import terser from "@rollup/plugin-terser"
import fse from "fs-extra"
import path from "path"
import colors from "picocolors"
import type {
  InputPluginOption,
  RollupOptions,
  WarningHandlerWithDefault,
} from "rollup"
import esbuild from "rollup-plugin-esbuild"

const SHARED_DEPENDENCIES = [
  "@tanstack/react-query",
  "@tanstack/react-table",
  "@medusajs/medusa-js",
  "medusa-react",
  "react",
]

type BuildOptions = {
  watch?: boolean
  minify?: boolean
}

const env = process.env.NODE_ENV

const onwarn: WarningHandlerWithDefault = (warning, warn) => {
  if (
    warning.code === "CIRCULAR_DEPENDENCY" &&
    warning.ids?.every((id) => /\bnode_modules\b/.test(id))
  ) {
    return
  }

  warn(warning)
}

export async function build({ watch, minify = true }: BuildOptions) {
  const indexFilePath = path.join(process.cwd(), "src", "admin", "index")

  let language: "ts" | "js" = "js"

  if (fse.existsSync(`${indexFilePath}.ts`)) {
    language = "ts"
  }

  const entry = `${indexFilePath}.${language}`

  const plugins: InputPluginOption = [
    esbuild({ include: /\.tsx?$/, sourceMap: true }),
    nodeResolve({ preferBuiltins: true, browser: true }),
    commonjs({
      extensions: [".mjs", ".js", ".json", ".node", ".jsx", ".ts", ".tsx"],
    }),
    json(),
    replace({
      values: {
        "process.env.NODE_ENV": JSON.stringify(env),
      },
      preventAssignment: true,
    }),
    alias({
      entries: SHARED_DEPENDENCIES.reduce((acc, dep) => {
        acc[dep] = require.resolve(dep)

        return acc
      }, {} as { [key: string]: string }),
    }),
  ]

  if (minify) {
    plugins.push(terser())
  }

  const dist = path.resolve(process.cwd(), "dist", "admin")

  const rollupOptions: RollupOptions = {
    input: entry,
    output: {
      dir: dist,
      chunkFileNames: "[name].js",
      format: "esm",
      exports: "named",
    },
    plugins,
    onwarn,
    external: SHARED_DEPENDENCIES,
  }

  if (watch) {
    const { watch: rollupWatch } = await import("rollup")

    const watcher = rollupWatch({
      ...rollupOptions,
      watch: {
        clearScreen: true,
      },
    })

    process.on("SIGTERM", () => {
      watcher.close()
    })

    watcher.on("event", (event) => {
      if (event.code === "BUNDLE_END") {
        console.log(
          colors.green("[@medusajs/admin-sdk]: Extension bundle updated")
        )
      }
    })
  } else {
    const { rollup } = await import("rollup")

    const bundle = await rollup(rollupOptions)

    await bundle.write({
      dir: dist,
    })
  }
}
