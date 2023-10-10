import bundleSize from "@atomico/rollup-plugin-sizes"
import nodeResolve from "@rollup/plugin-node-resolve"
import replace from "@rollup/plugin-replace"
import esbuild from "rollup-plugin-esbuild"
import license from "rollup-plugin-license"
import { visualizer } from "rollup-plugin-visualizer"
import fs from "fs"
import path from "path"

const pkg = JSON.parse(fs.readFileSync(path.resolve("./package.json"), "utf-8"))

const plugins = (pkg, minify, esbuildOptions = {}) =>
  [
    esbuild({
      minify,
      ...esbuildOptions,
    }),
    license({
      banner: `${pkg.name} v${pkg.version} - ${pkg.license}`,
    }),
    bundleSize(),
    visualizer({
      sourcemap: true,
      filename: `stats/${pkg.name}${minify ? "-min" : ""}.html`,
    }),
    nodeResolve(),
  ].filter(Boolean)

const packageName = pkg.name
const outputFileName = "medusa-icons"
const outputDir = "dist"
const inputs = ["src/components/index.ts"]

const bundles = [
  {
    format: "umd",
    inputs,
    outputDir,
    minify: true,
    sourcemap: true,
  },
  {
    format: "cjs",
    inputs,
    outputDir,
    aliasesSupport: true,
    sourcemap: true,
  },
  {
    format: "esm",
    inputs,
    outputDir,
    preserveModules: true,
    aliasesSupport: true,
    sourcemap: true,
    dir: `${outputDir}/esm`, // Update this line
  },
]

const configs = bundles
  .map(
    ({ inputs, outputDir, format, minify, preserveModules, aliasesSupport }) =>
      inputs.map((input) => ({
        input,
        plugins: [
          ...(!aliasesSupport
            ? [
                replace({
                  "export * from './aliases';": "",
                  "export * as icons from './icons';": "",
                  delimiters: ["", ""],
                  preventAssignment: false,
                }),
              ]
            : []),
          ...plugins(pkg, minify),
        ],
        external: ["react", "prop-types"],
        output: {
          name: packageName,
          ...(preserveModules
            ? {
                dir: `${outputDir}/${format}`,
              }
            : {
                file: `${outputDir}/${format}/${outputFileName}${
                  minify ? ".min" : ""
                }.js`,
              }),
          format,
          sourcemap: true,
          preserveModules,
          globals: {
            react: "react",
            "prop-types": "PropTypes",
            "react-jsx": "jsx",
          },
        },
      }))
  )
  .flat()

export default configs
