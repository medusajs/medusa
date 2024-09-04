import express from "express"
import { track } from "medusa-telemetry"
import { scheduleJob } from "node-schedule"

import { gqlSchemaToTypes, logger } from "@medusajs/framework"
import { GracefulShutdownServer } from "@medusajs/utils"
import loaders from "../loaders"
import path from "path"

const EVERY_SIXTH_HOUR = "0 */6 * * *"
const CRON_SCHEDULE = EVERY_SIXTH_HOUR

export default async function ({ port, directory }) {
  async function start() {
    track("CLI_START")

    const app = express()

    try {
      const { shutdown, gqlSchema } = await loaders({
        directory,
        expressApp: app,
      })

      if (gqlSchema && process.env?.NODE_ENV?.startsWith("dev")) {
        const outputDirGeneratedTypes = path.join(directory, "src/.medusa")
        await gqlSchemaToTypes({
          outputDir: outputDirGeneratedTypes,
          schema: gqlSchema,
        })
      }

      const serverActivity = logger.activity(`Creating server`)
      const server = GracefulShutdownServer.create(
        app.listen(port).on("listening", () => {
          logger.success(serverActivity, `Server is ready on port: ${port}`)
          track("CLI_START_COMPLETED")
        })
      )

      // Handle graceful shutdown
      const gracefulShutDown = () => {
        logger.info("Gracefully shutting down server")
        server
          .shutdown()
          .then(async () => {
            await shutdown()
            process.exit(0)
          })
          .catch((e) => {
            logger.error("Error received when shutting down the server.", e)
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
      logger.error("Error starting server", err)
      process.exit(1)
    }
  }

  await start()
}
