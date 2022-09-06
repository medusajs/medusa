const path = require("path")
const express = require("express")
const getPort = require("get-port")
const importFrom = require("import-from")

module.exports = {
  bootstrapApp: async ({ cwd } = {}) => {
    const app = express()

    const loaders = importFrom(
      cwd || process.cwd(),
      "@medusajs/medusa/dist/loaders"
    ).default

    const { container, dbConnection } = await loaders({
      directory: path.resolve(cwd || process.cwd()),
      expressApp: app,
      isTest: false,
    })

    const PORT = await getPort()

    return {
      container,
      db: dbConnection,
      app,
      port: PORT,
    }
  },
}
