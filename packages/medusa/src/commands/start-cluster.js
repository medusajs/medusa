import "core-js/stable"
import "regenerator-runtime/runtime"

import cluster from "cluster"
import express from "express"
import { GracefulShutdownServer } from "medusa-core-utils"
import { track } from "medusa-telemetry"
import { scheduleJob } from "node-schedule"
import os from "os"

import loaders from "../loaders"
import Logger from "../loaders/logger"

const EVERY_SIXTH_HOUR = "0 */6 * * *"
const CRON_SCHEDULE = EVERY_SIXTH_HOUR

let isShuttingDown = false
export default async function ({ port, cpus, directory }) {
  if (cluster.isPrimary) {
    const killMainProccess = () => process.exit(0)

    cpus ??= os.cpus().length
    const numCPUs = Math.min(os.cpus().length, cpus)

    for (let index = 0; index < numCPUs; index++) {
      const worker = cluster.fork()
      worker.send({ index })
    }

    cluster.on("exit", (worker) => {
      if (!isShuttingDown) {
        cluster.fork()
      } else if (Object.keys(cluster.workers).length === 0) {
        setTimeout(killMainProccess, 100)
      }
    })

    const gracefulShutDown = () => {
      isShuttingDown = true
      for (const id of Object.keys(cluster.workers)) {
        cluster.workers[id].kill("SIGTERM")
      }
    }

    scheduleJob(CRON_SCHEDULE, () => {
      track("PING")
    })

    process.on("SIGTERM", gracefulShutDown)
    process.on("SIGINT", gracefulShutDown)
  } else {
    const start = async () => {
      track("CLI_START")

      const app = express()

      const { dbConnection, shutdown, prepareShutdown } = await loaders({
        directory,
        expressApp: app,
      })
      const serverActivity = Logger.activity(`Creating server`)
      const server = GracefulShutdownServer.create(
        app.listen(port, (err) => {
          if (err) {
            return
          }
          Logger.success(serverActivity, `Server is ready on port: ${port}`)
          track("CLI_START_COMPLETED")
        })
      )

      const gracefulShutDown = () => {
        server
          .shutdown()
          .then(async () => {
            return await prepareShutdown()
          })
          .then(async () => {
            await shutdown()
            process.exit(0)
          })
          .catch((e) => {
            process.exit(1)
          })
      }

      process.on("SIGTERM", gracefulShutDown)
      process.on("SIGINT", gracefulShutDown)

      return { dbConnection, server }
    }

    process.on("message", async (msg) => {
      if (msg.index > 0) {
        process.env.PLUGIN_ADMIN_UI_SKIP_CACHE = true
      }

      await start()
    })
  }
}
