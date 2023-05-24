import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import terser from "@rollup/plugin-terser"
import virtual from "@rollup/plugin-virtual"
import type {
  InputOptions,
  OutputOptions,
  WarningHandlerWithDefault,
} from "rollup"
import esbuild from "rollup-plugin-esbuild"
import { DIST, ENV, SHARED_DEPENDENCIES, SRC } from "../constants"
import {
  createVirtualEntry,
  findExtensions,
  getExternalDependencies,
  getIdentifier,
  log,
} from "../utils"

type BuildOptions = {
  watch?: boolean
  minify?: boolean
}

/**
 * Ignores circular dependencies that are part of node_modules
 * @param warning - warning object
 * @param warn - warn function
 * @returns void
 */
const onwarn: WarningHandlerWithDefault = (warning, warn) => {
  if (
    warning.code === "CIRCULAR_DEPENDENCY" &&
    warning.ids?.every((id) => /\bnode_modules\b/.test(id))
  ) {
    return
  }

  warn(warning)
}

const outputOptions: OutputOptions = {
  dir: DIST,
  chunkFileNames: "[name].js",
  format: "esm",
  exports: "named",
  preserveModules: true,
}

/**
 * Creates the input options for Rollup.
 */
async function createInputOptions(minify?: boolean): Promise<InputOptions> {
  const extensions = await findExtensions(SRC)

  if (!extensions?.length) {
    return null
  }

  const identifier = await getIdentifier()

  const virtualEntry = await createVirtualEntry(extensions, identifier)

  const external = await getExternalDependencies()

  return {
    input: [...extensions, "entry"],
    plugins: [
      esbuild({ include: /\.tsx?$/, sourceMap: true }),
      nodeResolve({ preferBuiltins: true, browser: true }),
      commonjs({
        extensions: [".mjs", ".js", ".json", ".node", ".jsx", ".ts", ".tsx"],
      }),
      json(),
      replace({
        values: {
          "process.env.NODE_ENV": JSON.stringify(ENV),
        },
        preventAssignment: true,
      }),
      alias({
        entries: SHARED_DEPENDENCIES.reduce((acc, dep) => {
          acc[dep] = require.resolve(dep)

          return acc
        }, {} as { [key: string]: string }),
      }),
      virtual({
        entry: virtualEntry,
      }),
      minify && terser(),
    ],
    onwarn,
    external,
  }
}

export async function build({ watch, minify = true }: BuildOptions) {
  const { rollup } = await import("rollup")

  if (watch) {
    const { watch: chokidar } = await import("chokidar")

    const watcher = chokidar(SRC)

    const rebuild = async () => {
      const inputOptions = await createInputOptions(minify)

      const bundle = await rollup(inputOptions)

      await bundle.write(outputOptions)

      await bundle.close()
    }

    watcher
      .on("change", async (file) => {
        log.info(`File ${file} changed. Rebuilding extension bundle...`)

        await rebuild()
      })
      .on("unlink", async (file) => {
        log.info(`File ${file} removed. Rebuilding extension bundle...`)

        await rebuild()
      })
      .on("add", async (file) => {
        log.info(`File ${file} added. Rebuilding extension bundle...`)

        await rebuild()
      })
      .on("error", (error) => {
        log.error(
          `Watcher error: ${error}. Waiting for changes before retrying...`
        )
      })
  } else {
    let buildFailed = false

    try {
      const rollupOptions = await createInputOptions(minify)

      const bundle = await rollup(rollupOptions)

      await bundle.write(outputOptions)

      await bundle.close()

      log.info("Successfully built extension bundle.")
    } catch (error) {
      log.error(`Failed to build extension bundle: ${error}`)
      buildFailed = true
    }

    process.exit(buildFailed ? 1 : 0)
  }
}
