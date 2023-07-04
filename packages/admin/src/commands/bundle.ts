import {
  ALIASED_PACKAGES,
  findAllValidRoutes,
  findAllValidSettings,
  findAllValidWidgets,
  logger,
  normalizePath,
} from "@medusajs/admin-ui"
import commonjs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import virtual from "@rollup/plugin-virtual"
import fse from "fs-extra"
import path from "path"
import { rollup } from "rollup"
import esbuild from "rollup-plugin-esbuild"
import dedent from "ts-dedent"

export async function bundle() {
  const adminDir = path.resolve(process.cwd(), "src", "admin")

  const pathExists = await fse.pathExists(adminDir)

  if (!pathExists) {
    logger.panic(
      "The `src/admin` directory could not be found. It appears that your project does not include any admin extensions."
    )
  }

  const pkg = await fse.readJSON(path.join(process.cwd(), "package.json"))

  if (!pkg) {
    logger.panic(
      "The `package.json` file could not be found. Your project does not meet the requirements of a valid Medusa plugin."
    )
  }

  if (!pkg.name) {
    logger.panic(
      "The `package.json` does not contain a `name` field. Your project does not meet the requirements of a valid Medusa plugin."
    )
  }

  const identifier = pkg.name as string

  const [routes, widgets, settings] = await Promise.all([
    findAllValidRoutes(path.resolve(adminDir, "routes")),
    findAllValidWidgets(path.resolve(adminDir, "widgets")),
    findAllValidSettings(path.resolve(adminDir, "settings")),
  ])

  const widgetImports = dedent`
    ${widgets
      .map((widget, i) => {
        return `import Widget${i}, { config as widgetConfig${i} } from "${normalizePath(
          widget
        )}"`
      })
      .join("\n")}
  `

  const routeImports = dedent`
    ${routes
      .map((route, i) => {
        return `import Route${i}${
          route.hasConfig ? `, { config as routeConfig${i} }` : ""
        } from "${normalizePath(route.file)}"`
      })
      .join("\n")}
    `

  const settingImports = dedent`
    ${settings
      .map((setting, i) => {
        return `import Setting${i}, { config as settingConfig${i} } from "${normalizePath(
          setting.file
        )}"`
      })
      .join("\n")}
    `

  const body = dedent`
    const entry = {
      identifier: "${identifier}",
      extensions: [
        ${
          routes.length > 0
            ? routes
                .map(
                  (r, i) => `{
                Component: Route${i},
                config: { path: "${r.path}", type: "route"${
                    r.hasConfig ? `, ...routeConfig${i}` : ""
                  } }
            }`
                )
                .join(",\n")
            : ""
        }
        ${routes.length > 0 && settings.length > 0 ? "," : ""}
        ${
          settings.length > 0
            ? settings
                .map(
                  (r, i) => `{
                Component: Route${i},
                config: { path: "${r.path}", type: "setting", ...settingConfig${i} }
            }`
                )
                .join(",\n")
            : ""
        }
        ${settings.length > 0 && widgets.length > 0 ? "," : ""}
        ${widgets
          .map(
            (_, i) => `{
            Component: Widget${i},
            config: { type: "widget", ...widgetConfig${i} }
        }`
          )
          .join(",\n")}
      ],
    }
  `

  const virtualEntry = dedent`
    ${widgetImports}
    ${routeImports}
    ${settingImports}

    ${body}

    export default entry
  `

  const dependencies = Object.keys(pkg.dependencies || {})

  const peerDependencies = Object.keys(pkg.peerDependencies || {})

  const external = [
    ...ALIASED_PACKAGES,
    ...dependencies,
    ...peerDependencies,
    "react/jsx-runtime",
  ]

  const dist = path.resolve(process.cwd(), "dist", "admin")

  const distExists = await fse.pathExists(dist)

  if (distExists) {
    try {
      await fse.remove(dist)
    } catch (error) {
      logger.panic(
        `Failed to clean ${dist}. Make sure that you have write access to the folder.`
      )
    }
  }

  try {
    const bundle = await rollup({
      input: ["entry"],
      external,
      plugins: [
        virtual({
          entry: virtualEntry,
        }),
        nodeResolve({
          preferBuiltins: true,
          browser: true,
          extensions: [".mjs", ".js", ".json", ".node", "jsx", "ts", "tsx"],
        }),
        commonjs(),
        esbuild({
          include: /\.[jt]sx?$/, // Transpile .js, .jsx, .ts, and .tsx files
          exclude: /node_modules/,
          minify: process.env.NODE_ENV === "production",
          target: "es2017",
          jsxFactory: "React.createElement",
          jsxFragment: "React.Fragment",
          jsx: "automatic",
        }),
        json(),
        replace({
          values: {
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
          },
          preventAssignment: true,
        }),
      ],
      onwarn: (warning, warn) => {
        if (
          warning.code === "CIRCULAR_DEPENDENCY" &&
          warning.ids?.every((id) => /\bnode_modules\b/.test(id))
        ) {
          return
        }

        warn(warning)
      },
    }).catch((error) => {
      throw error
    })

    await bundle.write({
      dir: path.resolve(process.cwd(), "dist", "admin"),
      chunkFileNames: "[name].js",
      format: "esm",
      exports: "named",
    })

    await bundle.close()

    logger.info("The extension bundle has been built successfully")
  } catch (error) {
    logger.panic(
      `Error encountered while building the extension bundle: ${error}`,
      error
    )
  }
}
