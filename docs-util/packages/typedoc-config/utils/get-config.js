/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("../_base")

function getEntryPoints(entryPointPaths) {
  if (Array.isArray(entryPointPaths)) {
    return entryPointPaths.map((entryPath) =>
      path.join(__dirname, "..", "..", "..", "..", entryPath)
    )
  } else {
    return path.join(__dirname, "..", "..", "..", "..", entryPointPaths)
  }
}

/**
 *
 * @param {Partial<import('typedoc').TypeDocOptions>} param0 - The configuration options
 * @returns {import('typedoc').TypeDocOptions}
 */
function getConfig({
  entryPointPath,
  tsConfigName,
  name,
  jsonFileName,
  ...otherOptions
}) {
  return {
    ...globalTypedocOptions,
    entryPoints: getEntryPoints(entryPointPath),
    tsconfig: path.join(__dirname, "..", "extended-tsconfig", tsConfigName),
    name,
    json: path.join(
      __dirname,
      "..",
      "..",
      "..",
      "typedoc-json-output",
      `${jsonFileName || name}.json`
    ),
    ...otherOptions,
  }
}

module.exports = getConfig
