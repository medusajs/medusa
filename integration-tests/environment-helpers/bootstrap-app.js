const path = require("path")
const express = require("express")
const getPort = require("get-port")
const { isObject } = require("@medusajs/utils")
const { setContainer } = require("./use-container")
const { setPort, setExpressServer } = require("./use-api")

async function bootstrapApp({ cwd, env = {} } = {}) {
  const app = express()

  if (isObject(env)) {
    Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
  }

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
}

module.exports = {
  bootstrapApp,
  startBootstrapApp: async ({ cwd, env = {} } = {}) => {
    const { app, port, container } = await bootstrapApp({ cwd, env })

    setContainer(container)

    const expressServer = app.listen(port, (err) => {
      setPort(port)
      process.send(port)
    })

    setExpressServer(expressServer)
  },
}
