import express from "express"
import getPort from "get-port"
import { resolve } from "path"
import { isObject, promiseAll } from "@medusajs/utils"
// TODO: fix that once we find the appropriate place to put this util
const {
  GracefulShutdownServer,
} = require("@medusajs/medusa/dist/utils/graceful-shutdown-server")

async function bootstrapApp({
  cwd,
  env = {},
}: { cwd?: string; env?: Record<any, any> } = {}) {
  const app = express()

  if (isObject(env)) {
    Object.entries(env).forEach(([k, v]) => (process.env[k] = v))
  }

  const loaders = require("@medusajs/medusa/dist/loaders").default

  const { container, shutdown } = await loaders({
    directory: resolve(cwd || process.cwd()),
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

export default {
  startBootstrapApp: async ({
    cwd,
    env = {},
  }: { cwd?: string; env?: Record<any, any> } = {}) => {
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

    const shutdown = async () => {
      await promiseAll([expressServer.shutdown(), medusaShutdown()])

      if (typeof global !== "undefined" && global?.gc) {
        global.gc()
      }
    }

    return await new Promise((resolve, reject) => {
      const server = app.listen(port).on("error", async (err) => {
        if (err) {
          await shutdown()
          return reject(err)
        }

        process.send?.(port)

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
