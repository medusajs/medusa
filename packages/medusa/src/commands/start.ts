import express from "express"
import { track } from "medusa-telemetry"
import { scheduleJob } from "node-schedule"

import { gqlSchemaToTypes, logger } from "@medusajs/framework"
import { GracefulShutdownServer } from "@medusajs/utils"
import loaders from "../loaders"
import path from "path"
import http, { IncomingMessage } from "http"

const EVERY_SIXTH_HOUR = "0 */6 * * *"
const CRON_SCHEDULE = EVERY_SIXTH_HOUR

async function start({ port, directory, types }) {
  async function internalStart() {
    track("CLI_START")

    const app = express()

    const http_ = http.createServer(async (req: any, res) => {
      await start.traceRequestHandler(async () => {
        return new Promise((resolve) => {
          res.on("finish", resolve)
          app(req, res)
        })
      }, req)
    })

    try {
      const { shutdown, gqlSchema } = await loaders({
        directory,
        expressApp: app,
      })

      if (gqlSchema && types) {
        const outputDirGeneratedTypes = path.join(directory, ".medusa")
        await gqlSchemaToTypes({
          outputDir: outputDirGeneratedTypes,
          schema: gqlSchema,
        })
        logger.info("Geneated modules types")
      }

      const serverActivity = logger.activity(`Creating server`)
      const server = GracefulShutdownServer.create(
        http_.listen(port).on("listening", () => {
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

  await internalStart()
}

/**
 * Wrap request handler inside custom implementation to enabled
 * instrumentation.
 */
start.traceRequestHandler = async (
  requestHandler: () => Promise<void>,
  _: IncomingMessage
) => {
  return await requestHandler()
}

export default start
