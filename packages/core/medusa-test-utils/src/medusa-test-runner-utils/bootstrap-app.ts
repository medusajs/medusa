import express from "express"
import getPort from "get-port"
import { resolve } from "path"
import { isObject, promiseAll, GracefulShutdownServer } from "@medusajs/utils"
import { MedusaContainer } from "@medusajs/types"
import { applyEnvVarsToProcess } from "./apply-env-vars"

async function bootstrapApp({
  cwd,
  env = {},
}: { cwd?: string; env?: Record<any, any> } = {}) {
  const app = express()
  applyEnvVarsToProcess(env)

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

export async function startApp({
  cwd,
  env = {},
}: { cwd?: string; env?: Record<any, any> } = {}): Promise<{
  shutdown: () => Promise<void>
  container: MedusaContainer
  port: number
}> {
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
    await promiseAll([expressServer?.shutdown(), medusaShutdown()])

    if (typeof global !== "undefined" && global?.gc) {
      global.gc()
    }
  }

  return await new Promise((resolve, reject) => {
    const server = app
      .listen(port)
      .on("error", async (err) => {
        await shutdown()
        return reject(err)
      })
      .on("listening", () => {
        process.send?.(port)

        resolve({
          shutdown,
          container,
          port,
        })
      })

    // TODO: fix that once we find the appropriate place to put this util
    expressServer = GracefulShutdownServer.create(server)
  })
}
