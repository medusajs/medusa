/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")

const pathPrefix = path.join(__dirname, "..", "..", "..")

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  plugin: ["typedoc-plugin-custom"],
  readme: "none",
  eslintPathName: path.join(
    pathPrefix,
    "www/packages/eslint-config-docs/content.js"
  ),
  pluginsResolvePath: path.join(pathPrefix, "www"),
  exclude: [path.join(pathPrefix, "node_modules/**")],
  excludeInternal: true,
  excludeExternals: true,
  excludeReferences: true,
  disableSources: true,
  sort: ["source-order"],
  validation: {
    notExported: false,
    // invalidLink: false,
  },
  // logLevel: "Error",
  // Uncomment this when debugging
  // showConfig: true,
}
