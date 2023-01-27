import { resolve } from "path"
import vite from "vite"
import { loadConfig } from "../utils/load-config"
import { reporter } from "../utils/reporter"

type BuildArgs = {
  outDir?: string
  backend?: string
  path?: string
}

export default async function build(args: BuildArgs) {
  let { path, build, serve } = loadConfig()

  /**
   * If any of the args are provided, we override the config
   */
  if (Object.values(args).some((v) => !!v)) {
    path = args.path || path
    build = {
      outDir: args.outDir || build.outDir,
      backend: args.backend || build.backend,
    }
  }

  const GLOBAL_VARIABLES = {
    __BASENAME__: JSON.stringify(path),
    __BACKEND__: JSON.stringify("/"),
  }

  let outDir = resolve(__dirname, "../build")

  if (!serve && build) {
    GLOBAL_VARIABLES.__BACKEND__ = JSON.stringify(build.backend)
    outDir = build.outDir ? resolve(process.cwd(), build.outDir) : outDir
  }

  await reporter.spinner(
    vite.build({
      define: GLOBAL_VARIABLES,
      base: path,
      root: resolve(__dirname, "../dashboard"),
      build: {
        outDir: outDir,
        emptyOutDir: true,
      },
      css: {
        postcss: resolve(__dirname, "../dashboard/postcss.config.js"),
      },
    }),
    {
      message: "Building admin dashboard",
      successMessage: "Successfully built admin dashboard",
      errorMessage: "Failed to build admin dashboard",
    }
  )
}
