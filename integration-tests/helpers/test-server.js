const path = require("path")
const express = require("express")
const getPort = require("get-port")
const importFrom = require("import-from")
const workerId = parseInt(process.env.JEST_WORKER_ID || "1")

const initialize = async () => {
  const configPath = path.resolve(path.join(process.cwd(), `medusa-config.js`))
  const configModule = require(configPath)
  configModule.projectConfig.database_url = `${configModule.projectConfig.database_url}-${workerId}`

  const app = express()

  const loaders = importFrom(
    process.cwd(),
    "@medusajs/medusa/dist/loaders"
  ).default

  const { dbConnection } = await loaders({
    directory: path.resolve(process.cwd()),
    expressApp: app,
    configModule,
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
