/* eslint-disable @typescript-eslint/no-var-requires */
const getConfig = require("./utils/get-config")

module.exports = (options) => {
  return getConfig({
    ...options,
    generateModelsDiagram: true,
    diagramAddToFile: options.entryPointPath,
  })
}
