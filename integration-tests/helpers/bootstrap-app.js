const path = require("path")
const express = require("express")
const getPort = require("get-port")

module.exports = {
  bootstrapApp: async ({ cwd } = {}) => {
    const app = express()

    const loaders = require("@medusajs/medusa/dist/loaders").default

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
