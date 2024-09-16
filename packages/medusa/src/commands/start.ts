import path from "path"
import express from "express"
import { track } from "medusa-telemetry"
import { scheduleJob } from "node-schedule"

import { GracefulShutdownServer } from "@medusajs/utils"
import http, { IncomingMessage, ServerResponse } from "http"
import { gqlSchemaToTypes, logger } from "@medusajs/framework"

import loaders from "../loaders"

const EVERY_SIXTH_HOUR = "0 */6 * * *"
const CRON_SCHEDULE = EVERY_SIXTH_HOUR

/**
 * Imports the "instrumentation.js" file from the root of the
 * directory and invokes the register function. The existence
 * of this file is optional, hence we ignore "ENOENT"
 * errors.
 */
async function registerInstrumentation(directory: string) {
  try {
    const instrumentation = await import(
      path.join(directory, "instrumentation.js")
    )
    if (typeof instrumentation.register === "function") {
      logger.info("OTEL registered")
      instrumentation.register()
    }
  } catch (error) {
    if (!["ENOENT", "MODULE_NOT_FOUND"].includes(error.code)) {
      throw error
    }
  }
}

async function start({ port, directory, types }) {
  async function internalStart() {
    track("CLI_START")
    await registerInstrumentation(directory)

    const app = express()

    const http_ = http.createServer(async (req, res) => {
      await start.traceRequestHandler(
        async () => {
          return new Promise((resolve) => {
            res.on("finish", resolve)
            app(req, res)
          })
        },
        req,
        res
      )
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
  _: IncomingMessage,
  __: ServerResponse
) => {
  return await requestHandler()
}

export default start
