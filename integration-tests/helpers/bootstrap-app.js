const path = require("path")
const ExpressAdapter = require('medusa-platform-express');
const getPort = require("get-port")
const importFrom = require("import-from")

module.exports = {
  bootstrapApp: async ({ cwd } = {}) => {
    const httpAdapter = new ExpressAdapter();

    const loaders = importFrom(
      cwd || process.cwd(),
      "@medusajs/medusa/dist/loaders"
    ).default

    const { app, container, dbConnection } = await loaders({
      directory: path.resolve(cwd || process.cwd()),
      httpAdapter,
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
