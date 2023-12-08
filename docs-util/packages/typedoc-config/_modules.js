/* eslint-disable @typescript-eslint/no-var-requires */
const globalTypedocOptions = require("./_base")
const getConfig = require("./utils/get-config")

module.exports = (options) => {
  return getConfig({
    ...options,
    tsConfigName: "types.json",
    entryPointStrategy: "expand",
    plugin: [...globalTypedocOptions.plugin, "typedoc-plugin-rename-defaults"],
    enableInternalResolve: true,
  })
}
