import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import terser from "@rollup/plugin-terser"
import fse from "fs-extra"
import path from "path"
import {
  InputPluginOption,
  rollup,
  RollupOptions,
  watch as rollupWatch,
} from "rollup"
import esbuild from "rollup-plugin-esbuild"
import ts from "typescript"

const SHARED_DEPENDENCIES = [
  "@tanstack/react-query",
  "@medusajs/medusa-js",
  "medusa-react",
]

type BuildOptions = {
  watch?: boolean
}

const parseCompilerOptions = (compilerOptions?: any) => {
  if (!compilerOptions) return {}
  const { options } = ts.parseJsonConfigFileContent(
    { compilerOptions },
    ts.sys,
    "./"
  )
  return options
}

export async function build({ watch }: BuildOptions) {
  const indexFilePath = path.join(process.cwd(), "src", "admin", "index")

  // // Load package.json from the root of the project
  // const pkg = fse.readJSONSync(path.resolve(process.cwd(), "package.json"))

  // const deps = [...pkg.dependencies, ...pkg.peerDependencies]

  let language: "ts" | "js" = "js"

  if (fse.existsSync(`${indexFilePath}.ts`)) {
    language = "ts"
  }

  const entry = `${indexFilePath}.${language}`

  const plugins: InputPluginOption = [
    esbuild({ include: /\.tsx?$/, sourceMap: true }),
    nodeResolve({ preferBuiltins: false, browser: true }),
    commonjs({
      extensions: [".mjs", ".js", ".json", ".node", ".jsx", ".ts", ".tsx"],
    }),
    json(),
    replace({
      values: {
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      preventAssignment: true,
    }),
    alias({
      entries: SHARED_DEPENDENCIES.reduce((acc, dep) => {
        acc[dep] = require.resolve(dep)

        return acc
      }, {} as { [key: string]: string }),
    }),
    terser(),
  ]

  // // If the project is using TypeScript, we need to use the TypeScript plugin
  // if (language === "ts") {
  //   const tsconfigPath = path.resolve(process.cwd(), "tsconfig.admin.json")

  //   if (!fse.existsSync(tsconfigPath)) {
  //     throw new Error(
  //       `Could not find tsconfig.admin.json in the root of the project.`
  //     )
  //   }

  //   // Read the tsconfig file and extract the compiler options
  //   const tsconfig = fse.readJSONSync(tsconfigPath)
  //   const compilerOptions = parseCompilerOptions(tsconfig.compilerOptions)

  //   const dts = typescript({
  //     tsconfig: tsconfigPath,
  //     compilerOptions: {
  //       ...compilerOptions,
  //       outDir: compilerOptions.outDir || "./dist/admin",
  //       baseUrl: compilerOptions.baseUrl || "./",
  //       // Ensure ".d.ts" modules are generated
  //       declaration: true,
  //       // Skip ".js" generation
  //       noEmit: false,
  //       emitDeclarationOnly: true,
  //       // Skip code generation when error occurs
  //       noEmitOnError: true,
  //       // Avoid extra work
  //       checkJs: false,
  //       declarationMap: false,
  //       skipLibCheck: true,
  //       preserveSymlinks: false,
  //       // Ensure we can parse the latest code
  //       target: ts.ScriptTarget.ESNext,
  //     },
  //   })

  //   // Terser plugin should go last so we inject the TypeScript plugin in the second to last position
  //   plugins.splice(plugins.length - 1, 0, dts)
  // }

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
    onwarn(warning, warn) {
      if (
        warning.code === "CIRCULAR_DEPENDENCY" &&
        warning.ids?.every((id) => /\bnode_modules\b/.test(id))
      ) {
        return
      }

      warn(warning)
    },
    external: [
      "react",
      "medusa-react",
      "@medusajs/medusa-js",
      "@tanstack/react-query",
    ],
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
