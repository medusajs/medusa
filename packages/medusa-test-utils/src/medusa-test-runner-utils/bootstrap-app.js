const path = require("path")
const express = require("express")
const getPort = require("get-port")
const { isObject, promiseAll } = require("@medusajs/utils")

async function bootstrapApp({ cwd, env = {} } = {}) {
  const app = express()

  if (isObject(env)) {
    Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
  }

  const loaders = require("@medusajs/medusa/dist/loaders").default

  const { container, dbConnection, pgConnection, shutdown } = await loaders({
    directory: path.resolve(cwd || process.cwd()),
    expressApp: app,
    isTest: false,
  })

  const PORT = await getPort()

  return {
    shutdown,
    container,
    db: dbConnection,
    pgConnection,
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
      db,
      pgConnection,
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
      await promiseAll([
        container.dispose(),
        expressServer.close(),
        db?.destroy(),
        pgConnection?.context?.destroy(),
        container.dispose(),
        medusaShutdown(),
      ])

      if (typeof global !== "undefined" && global?.gc) {
        global.gc()
      }
    }

    return await new Promise((resolve, reject) => {
      expressServer = app.listen(port, async (err) => {
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
    })
  },
}
