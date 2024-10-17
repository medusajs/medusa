import os from "os"
import path from "path"
import http from "http"
import express from "express"
import cluster from "cluster"
import { track } from "@medusajs/telemetry"
import { scheduleJob } from "node-schedule"

import {
  dynamicImport,
  FileSystem,
  gqlSchemaToTypes,
  GracefulShutdownServer,
  isPresent,
} from "@medusajs/framework/utils"
import { logger } from "@medusajs/framework/logger"

import loaders from "../loaders"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { MedusaContainer } from "@medusajs/framework/types"

const EVERY_SIXTH_HOUR = "0 */6 * * *"
const CRON_SCHEDULE = EVERY_SIXTH_HOUR
const INSTRUMENTATION_FILE = "instrumentation"

/**
 * Imports the "instrumentation.js" file from the root of the
 * directory and invokes the register function. The existence
 * of this file is optional, hence we ignore "ENOENT"
 * errors.
 */
export async function registerInstrumentation(directory: string) {
  const fileSystem = new FileSystem(directory)
  const exists =
    (await fileSystem.exists(`${INSTRUMENTATION_FILE}.ts`)) ||
    (await fileSystem.exists(`${INSTRUMENTATION_FILE}.js`))
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

function displayAdminUrl({
  container,
  port,
}: {
  port: string | number
  container: MedusaContainer
}) {
  const isProduction = ["production", "prod"].includes(
    process.env.NODE_ENV || ""
  )

  if (isProduction) {
    return
  }

  const logger = container.resolve("logger")
  const {
    admin: { path: adminPath, disable },
  } = container.resolve("configModule")

  if (disable) {
    return
  }

  logger.info(`Admin URL → http://localhost:${port}${adminPath}`)
}

async function start(args: {
  directory: string
  port?: number
  types?: boolean
  cluster?: number
}) {
  const { port = 9000, directory, types } = args

  async function internalStart(generateTypes: boolean) {
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
      const { shutdown, gqlSchema, container } = await loaders({
        directory,
        expressApp: app,
      })

      if (gqlSchema && generateTypes) {
        const outputDirGeneratedTypes = path.join(directory, ".medusa/types")
        await gqlSchemaToTypes({
          outputDir: outputDirGeneratedTypes,
          filename: "remote-query-entry-points",
          interfaceName: "RemoteQueryEntryPoints",
          schema: gqlSchema,
          joinerConfigs: MedusaModule.getAllJoinerConfigs(),
        })
        logger.info("Generated modules types")
      }

      const serverActivity = logger.activity(`Creating server`)
      const server = GracefulShutdownServer.create(
        http_.listen(port).on("listening", () => {
          logger.success(serverActivity, `Server is ready on port: ${port}`)
          displayAdminUrl({ container, port })
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

  /**
   * When the cluster flag is used we will start the process in
   * cluster mode
   */
  if ("cluster" in args) {
    const maxCpus = os.cpus().length
    const cpus = args.cluster ?? maxCpus

    if (cluster.isPrimary) {
      let isShuttingDown = false
      const numCPUs = Math.min(maxCpus, cpus)
      const killMainProccess = () => process.exit(0)
      const gracefulShutDown = () => {
        isShuttingDown = true
        for (const id of Object.keys(cluster.workers ?? {})) {
          cluster.workers?.[id]?.kill("SIGTERM")
        }
      }

      for (let index = 0; index < numCPUs; index++) {
        cluster.fork().send({ index })
      }

      cluster.on("exit", () => {
        if (!isShuttingDown) {
          cluster.fork()
        } else if (!isPresent(cluster.workers)) {
          setTimeout(killMainProccess, 100)
        }
      })

      process.on("SIGTERM", gracefulShutDown)
      process.on("SIGINT", gracefulShutDown)
    } else {
      process.on("message", async (msg: any) => {
        if (msg.index > 0) {
          process.env.PLUGIN_ADMIN_UI_SKIP_CACHE = "true"
        }

        await internalStart(!!types && msg.index === 0)
      })
    }
  } else {
    /**
     * Not in cluster mode
     */
    await internalStart(!!types)
  }
}

export default start
