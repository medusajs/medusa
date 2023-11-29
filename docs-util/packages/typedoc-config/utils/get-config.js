/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("../_base")

/**
 *
 * @param {Record<string, any>} param0 - The configuration options
 * @returns {import('typedoc').TypeDocOptions}
 */
function getConfig({
  entryPointPath,
  tsConfigName,
  name,
  indexTitle = "",
  ...otherOptions
}) {
  return {
    ...globalTypedocOptions,
    entryPoints: [path.join(__dirname, "..", "..", "..", "..", entryPointPath)],
    tsconfig: path.join(__dirname, "..", "extended-tsconfig", tsConfigName),
    name,
    indexTitle,
    json: path.join(
      __dirname,
      "..",
      "..",
      "..",
      "typedoc-json-output",
      `${name}.json`
    ),
    ...otherOptions,
  }
}

module.exports = getConfig
