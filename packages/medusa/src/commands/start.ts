import path from "path"
import express from "express"
import { track } from "medusa-telemetry"
import { scheduleJob } from "node-schedule"

import {
  dynamicImport,
  FileSystem,
  gqlSchemaToTypes,
  GracefulShutdownServer,
} from "@medusajs/framework/utils"
import http from "http"
import { logger } from "@medusajs/framework/logger"

import loaders from "../loaders"
import { MedusaModule } from "@medusajs/framework/modules-sdk"

const EVERY_SIXTH_HOUR = "0 */6 * * *"
const CRON_SCHEDULE = EVERY_SIXTH_HOUR
const INSTRUMENTATION_FILE = "instrumentation.js"

/**
 * Imports the "instrumentation.js" file from the root of the
 * directory and invokes the register function. The existence
 * of this file is optional, hence we ignore "ENOENT"
 * errors.
 */
export async function registerInstrumentation(directory: string) {
  const fileSystem = new FileSystem(directory)
  const exists = await fileSystem.exists(INSTRUMENTATION_FILE)
  if (!exists) {
    return
  }

  const instrumentation = await dynamicImport(
    path.join(directory, INSTRUMENTATION_FILE)
  )
  if (typeof instrumentation.register === "function") {
    logger.info("OTEL registered")
    instrumentation.register()
  } else {
    logger.info(
      "Skipping instrumentation registration. No register function found."
    )
  }
}

/**
 * Wrap request handler inside custom implementation to enabled
 * instrumentation.
 */
// eslint-disable-next-line no-var
export var traceRequestHandler: (...args: any[]) => Promise<any> = void 0 as any

async function start({ port, directory, types }) {
  async function internalStart() {
    track("CLI_START")
    await registerInstrumentation(directory)

    const app = express()

    const http_ = http.createServer(async (req, res) => {
      await new Promise((resolve) => {
        res.on("finish", resolve)
        if (traceRequestHandler) {
          void traceRequestHandler(
            async () => {
              app(req, res)
            },
            req,
            res
          )
        } else {
          app(req, res)
        }
      })
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
          filename: "remote-query-entry-points",
          interfaceName: "RemoteQueryEntryPoints",
          schema: gqlSchema,
          joinerConfigs: MedusaModule.getAllJoinerConfigs(),
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

export default start
