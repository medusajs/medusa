import "core-js/stable"
import "regenerator-runtime/runtime"

import express from "express"
import { GracefulShutdownServer } from "../utils"
import { track } from "medusa-telemetry"
import { scheduleJob } from "node-schedule"

import loaders from "../loaders"
import Logger from "../loaders/logger"

const EVERY_SIXTH_HOUR = "0 */6 * * *"
const CRON_SCHEDULE = EVERY_SIXTH_HOUR

export default async function ({ port, directory }) {
  async function start() {
    track("CLI_START")

    const app = express()

    try {
      const { shutdown } = await loaders({
        directory,
        expressApp: app,
      })

      const serverActivity = Logger.activity(`Creating server`)
      const server = GracefulShutdownServer.create(
        app.listen(port).on("listening", () => {
          Logger.success(serverActivity, `Server is ready on port: ${port}`)
          track("CLI_START_COMPLETED")
        })
      )

      // Handle graceful shutdown
      const gracefulShutDown = () => {
        Logger.info("Gracefully shutting down server")
        server
          .shutdown()
          .then(async () => {
            await shutdown()
            process.exit(0)
          })
          .catch((e) => {
            Logger.error("Error received when shutting down the server.", e)
            process.exit(1)
          })
      }

      process.on("SIGTERM", gracefulShutDown)
      process.on("SIGINT", gracefulShutDown)

      scheduleJob(CRON_SCHEDULE, () => {
        track("PING")
      })

      return { server }
    } catch (err) {
      Logger.error("Error starting server", err)
      process.exit(1)
    }
  }

  await start()
}
