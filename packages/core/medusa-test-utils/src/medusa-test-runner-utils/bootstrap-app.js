const path = require("path")
const express = require("express")
const getPort = require("get-port")
const { isObject, promiseAll } = require("@medusajs/utils")
const {
  GracefulShutdownServer,
} = require("@medusajs/medusa/dist/utils/graceful-shutdown-server")

async function bootstrapApp({ cwd, env = {} } = {}) {
  const app = express()

  if (isObject(env)) {
    Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
  }

  const loaders = require("@medusajs/medusa/dist/loaders").default

  const { container, shutdown } = await loaders({
    directory: path.resolve(cwd || process.cwd()),
    expressApp: app,
  })

  const PORT = await getPort()

  return {
    shutdown,
    container,
    app,
    port: PORT,
  }
}

module.exports = {
  startBootstrapApp: async ({
    cwd,
    env = {},
    skipExpressListen = false,
  } = {}) => {
    const {
      app,
      port,
      container,
      shutdown: medusaShutdown,
    } = await bootstrapApp({
      cwd,
      env,
    })

    let expressServer

    if (skipExpressListen) {
      return
    }

    const shutdown = async () => {
      await promiseAll([expressServer.shutdown(), medusaShutdown()])

      if (typeof global !== "undefined" && global?.gc) {
        global.gc()
      }
    }

    return await new Promise((resolve, reject) => {
      const server = app.listen(port, async (err) => {
        if (err) {
          await shutdown()
          return reject(err)
        }
        process.send(port)
        resolve({
          shutdown,
          container,
          port,
        })
      })

      expressServer = GracefulShutdownServer.create(server)
    })
  },
}
