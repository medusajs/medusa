/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const globalTypedocOptions = require("./_base")
const getConfig = require("./utils/get-config")

const pathPrefix = path.join(__dirname, "..", "..", "..")

module.exports = getConfig({
  entryPointPath: "packages/medusa-js/src/resources",
  tsConfigName: "js-client.json",
  name: "js-client",
  plugin: [...globalTypedocOptions.plugin, "typedoc-plugin-rename-defaults"],
  exclude: [
    ...globalTypedocOptions.exclude,
    path.join(pathPrefix, "packages/medusa-js/src/resources/base.ts"),
  ],
  ignoreApi: true,
})
