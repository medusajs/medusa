import {
  ALIASED_PACKAGES,
  findAllValidRoutes,
  findAllValidWidgets,
  logger,
} from "@medusajs/admin-ui"
import alias from "@rollup/plugin-alias"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import terser from "@rollup/plugin-terser"
import virtual from "@rollup/plugin-virtual"
import fse from "fs-extra"
import path from "node:path"
import { rollup } from "rollup"
import esbuild from "rollup-plugin-esbuild"
import dedent from "ts-dedent"

export async function bundle() {
  const adminDir = path.resolve(process.cwd(), "src", "admin")

  const pathExists = await fse.pathExists(adminDir)

  if (!pathExists) {
    logger.panic(
      "We could not find a `src/admin` directory. Your project does not seem to contain any admin extension."
    )
  }

  const pkg = await fse.readJSON(path.join(process.cwd(), "package.json"))

  if (!pkg) {
    logger.panic(
      "We could not find a `package.json` file. Your project is not a valid Medusa project or plugin."
    )
  }

  if (!pkg.name) {
    logger.panic(
      "Your `package.json` file does not have a `name` property. Add one and try again."
    )
  }

  const identifier = pkg.name as string

  const [routes, widgets] = await Promise.all([
    findAllValidRoutes(path.resolve(adminDir, "routes")),
    findAllValidWidgets(path.resolve(adminDir, "widgets")),
  ])

  const widgetImports = dedent`
    ${widgets
      .map((widget, i) => {
        return `import Widget${i}, { config as widgetConfig${i} } from "${widget}"`
      })
      .join("\n")}
  `

  const routeImports = dedent`
    ${routes
      .map((route, i) => {
        return `import Route${i}${
          route.hasConfig ? `, { config as routeConfig${i} }` : ""
        } from "${route}"`
      })
      .join("\n")}
    `

  const body = dedent`
    const entry = {
        identifier: "${identifier}",
        extensions: [
        ${routes
          .map(
            (r, i) => `{
            Component: Route${i},
            config: { path: ${r.path}${
              r.hasConfig ? `, ...routeConfig${i}` : ""
            } }
        }`
          )
          .join(",\n")}
        ${routes.length > 0 && widgets.length > 0 ? "," : ""}
        ${widgets
          .map(
            (_, i) => `{
            Component: Widget${i},
            config: widgetConfig${i}
        }`
          )
          .join(",\n")}
        ],
    }
  `

  const virtualEntry = dedent`
    ${widgetImports}
    ${routeImports}

    ${body}

    export default entry
  `

  const paths = [...routes.map((r) => r.path), ...widgets]

  const dependencies = Object.keys(pkg.dependencies || {})

  const peerDependencies = Object.keys(pkg.peerDependencies || {})

  const external = [...ALIASED_PACKAGES, ...dependencies, ...peerDependencies]

  const dist = path.resolve(process.cwd(), "dist", "admin")

  const distExists = await fse.pathExists(dist)

  if (distExists) {
    try {
      await fse.remove(dist)
    } catch (error) {
      logger.panic(
        "Failed to clean dist folder. Make sure that you have write access to the folder."
      )
    }
  }

  try {
    const bundle = await rollup({
      input: [...paths, "entry"],
      plugins: [
        esbuild({ include: /\.tsx?$/, sourceMap: true }),
        nodeResolve({ preferBuiltins: true, browser: true }),
        commonjs({
          extensions: [".mjs", ".js", ".json", ".node", ".jsx", ".ts", ".tsx"],
        }),
        json(),
        replace({
          values: {
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
          },
          preventAssignment: true,
        }),
        alias({
          entries: ALIASED_PACKAGES.reduce((acc, dep) => {
            acc[dep] = require.resolve(dep)

            return acc
          }, {} as { [key: string]: string }),
        }),
        virtual({
          entry: virtualEntry,
        }),
        terser(),
      ],
      external,
      onwarn: (warning, warn) => {
        if (
          warning.code === "CIRCULAR_DEPENDENCY" &&
          warning.ids?.every((id) => /\bnode_modules\b/.test(id))
        ) {
          return
        }

        warn(warning)
      },
    })

    await bundle.write({
      dir: path.resolve(process.cwd(), "dist", "admin"),
      chunkFileNames: "[name].js",
      format: "esm",
      exports: "named",
      preserveModules: true,
    })

    await bundle.close()

    logger.info("Successfully built extension bundle.")
  } catch (error) {
    logger.panic("Failed to build extension bundle.", error)
  }
}
