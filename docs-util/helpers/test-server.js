const path = require("path")
const express = require("express")
const getPort = require("get-port")
const importFrom = require("import-from")

const initialize = async () => {
  const app = express()

  const cwd = process.cwd()
  const loaders = importFrom(cwd, "@medusajs/medusa/dist/loaders").default

  const { dbConnection } = await loaders({
    directory: path.resolve(process.cwd()),
    expressApp: app,
  })

  const PORT = await getPort()

  return {
    db: dbConnection,
    app,
    port: PORT,
  }
}

const setup = async () => {
  const { app, port } = await initialize()

  app.listen(port, (err) => {
    process.send(port)
  })
}

setup()
