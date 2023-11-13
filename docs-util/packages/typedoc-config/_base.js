/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")

const pathPrefix = path.join(__dirname, "..", "..", "..")

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  // extends: [typedocConfig],
  plugin: ["typedoc-plugin-markdown-medusa", "typedoc-plugin-custom"],
  readme: "none",
  eslintPathName: path.join(
    pathPrefix,
    "www/packages/eslint-config-docs/content.js"
  ),
  pluginsResolvePath: path.join(pathPrefix, "www"),
  exclude: [path.join(pathPrefix, "node_modules/**")],
  // Uncomment this when debugging
  // showConfig: true,
}
