import { track } from "@medusajs/telemetry"
import cluster from "cluster"
import express from "express"
import http from "http"
import { scheduleJob } from "node-schedule"
import os from "os"
import path from "path"

import {
  ContainerRegistrationKeys,
  dynamicImport,
  FeatureFlag,
  FileSystem,
  generateContainerTypes,
  generatePolicyTypes,
  gqlSchemaToTypes,
  GracefulShutdownServer,
  isFileSkipped,
  isPresent,
  promiseAll,
} from "@medusajs/framework/utils"

import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { Logger, MedusaContainer } from "@medusajs/framework/types"
import { parse } from "url"
import RbacFeatureFlag from "../feature-flags/rbac"
import loaders, { initializeContainer } from "../loaders"
import { reloadResources } from "./utils/dev-server"
import { HMRReloadError } from "./utils/dev-server/errors"

const EVERY_SIXTH_HOUR = "0 */6 * * *"
const CRON_SCHEDULE = EVERY_SIXTH_HOUR
const INSTRUMENTATION_FILE = "instrumentation"

function parseValueOrPercentage(value: string, base: number): number {
  if (typeof value !== "string") {
    throw new Error(`Invalid value: ${value}. Must be a string.`)
  }

  const trimmed = value.trim()
  if (trimmed.endsWith("%")) {
    const percent = parseFloat(trimmed.slice(0, -1))
    if (isNaN(percent)) {
      throw new Error(`Invalid percentage: ${value}`)
    }
    if (percent < 0 || percent > 100) {
      throw new Error(`Percentage must be between 0 and 100: ${value}`)
    }
    return Math.round((percent / 100) * base)
  } else {
    const num = parseInt(trimmed, 10)
    if (isNaN(num) || num < 0) {
      throw new Error(
        `Invalid number: ${value}. Must be a non-negative integer.`
      )
    }
    return num
  }
}

/**
 * Imports the "instrumentation.js" file from the root of the
 * directory and invokes the register function. The existence
 * of this file is optional, hence we ignore "ENOENT"
 * errors.
 */
export async function registerInstrumentation(directory: string) {
  const container = await initializeContainer(directory, {
    skipDbConnection: true,
  })
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

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

  if (
    typeof instrumentation.register === "function" &&
    !isFileSkipped(instrumentation)
  ) {
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
  host,
  port,
  container,
}: {
  host?: string
  port: string | number
  container: MedusaContainer
}) {
  const isProduction = ["production", "prod"].includes(
    process.env.NODE_ENV || ""
  )

  if (isProduction) {
    return
  }

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const {
    admin: { path: adminPath, disable },
  } = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)

  if (disable) {
    return
  }

  logger.info(`Admin URL → http://${host || "localhost"}:${port}${adminPath}`)
}

type ExpressStack = {
  name: string
  match: (url: string) => boolean
  route: { path: string }
  handle: { stack: ExpressStack[] }
}

/**
 * Retrieve the route path from the express stack based on the input url
 * @param stack - The express stack
 * @param url - The input url
 * @returns The route path
 */
function findExpressRoutePath({
  stack,
  url,
}: {
  stack: ExpressStack[]
  url: string
}): string | void {
  const stackToProcess = [...stack]

  while (stackToProcess.length > 0) {
    const layer = stackToProcess.pop()!

    if (layer.name === "bound dispatch" && layer.match(url)) {
      return layer.route.path
    }

    // Add nested stack items to be processed if they exist
    if (layer.handle?.stack?.length) {
      stackToProcess.push(...layer.handle.stack)
    }
  }

  return undefined
}

function handleHMRReload(logger: Logger) {
  // Set up HMR reload handler if running in HMR mode
  if (process.env.MEDUSA_HMR_ENABLED === "true" && process.send) {
    ;(global as any).__MEDUSA_HMR_ROUTE_REGISTRY__ = true

    process.on("message", async (msg: any) => {
      if (msg?.type === "hmr-reload") {
        const { action, file, rootDirectory } = msg

        const success = await reloadResources({
          logSource: "[HMR]",
          action,
          absoluteFilePath: file,
          logger,
          rootDirectory,
        })
          .then(() => true)
          .catch((error) => {
            if (HMRReloadError.isHMRReloadError(error)) {
              return false
            }
            logger.error("[HMR] Reload failed with unexpected error", error)
            return false
          })

        process.send!({ type: "hmr-result", success })
      }
    })
  }
}

async function start(args: {
  directory: string
  host?: string
  port?: number
  types?: boolean
  cluster?: string
  workers?: string
  servers?: string
}): Promise<{
  server: GracefulShutdownServer
  gracefulShutDown: () => void
} | void> {
  const {
    port = 9000,
    host,
    directory,
    types,
    cluster: clusterSize,
    workers,
    servers,
  } = args

  const maxCpus = os.cpus().length
  const clusterSizeNum = clusterSize
    ? parseValueOrPercentage(clusterSize, maxCpus)
    : maxCpus
  const serversCount = servers
    ? parseValueOrPercentage(servers, clusterSizeNum)
    : 0
  const workersCount = workers
    ? parseValueOrPercentage(workers, clusterSizeNum)
    : 0

  async function internalStart(generateTypes: boolean) {
    track("CLI_START")

    const container = await initializeContainer(directory, {
      skipDbConnection: true,
    })
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const serverActivity = logger.activity(`Creating server`)

    await registerInstrumentation(directory)

    const app = express()

    const http_ = http.createServer(async (req, res) => {
      const stack = app._router.stack
      await new Promise((resolve) => {
        res.on("finish", resolve)
        if (traceRequestHandler) {
          const expressHandlerPath = findExpressRoutePath({
            stack,
            url: parse(req.url!, false).pathname!,
          })
          void traceRequestHandler(
            async () => {
              app(req, res)
            },
            req,
            res,
            expressHandlerPath
          )
        } else {
          app(req, res)
        }
      })
    })

    try {
      const { shutdown, gqlSchema, container, modules } = await loaders({
        directory,
        expressApp: app,
      })

      if (generateTypes) {
        const typesDirectory = path.join(directory, ".medusa/types")

        const fileGenPromises: Promise<void>[] = []

        fileGenPromises.push(
          generateContainerTypes(modules, {
            outputDir: typesDirectory,
            interfaceName: "ModuleImplementations",
          })
        )

        if (gqlSchema) {
          fileGenPromises.push(
            gqlSchemaToTypes({
              outputDir: typesDirectory,
              filename: "query-entry-points",
              interfaceName: "RemoteQueryEntryPoints",
              schema: gqlSchema,
              joinerConfigs: MedusaModule.getAllJoinerConfigs(),
            })
          )
        }

        if (FeatureFlag.isFeatureEnabled(RbacFeatureFlag.key)) {
          fileGenPromises.push(
            generatePolicyTypes({
              outputDir: typesDirectory,
            })
          )
        }

        await promiseAll(fileGenPromises)
        logger.debug("Generated policy types")
      }

      // Register a health check endpoint. Ideally this also checks the readiness of the service, rather than just returning a static response.
      app.get("/health", (_, res) => {
        res.status(200).send("OK")
      })

      const server = GracefulShutdownServer.create(
        http_.listen(port, host).on("listening", () => {
          logger.success(serverActivity, `Server is ready on port: ${port}`)
          displayAdminUrl({ container, host, port })
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

      handleHMRReload(logger)

      return { server, gracefulShutDown }
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
    const cpus = clusterSizeNum
    const numCPUs = Math.min(maxCpus, cpus)

    if (serversCount + workersCount > numCPUs) {
      throw new Error(
        `Sum of servers (${serversCount}) and workers (${workersCount}) cannot exceed cluster size (${numCPUs})`
      )
    }

    if (cluster.isPrimary) {
      let isShuttingDown = false
      const killMainProccess = () => process.exit(0)
      const gracefulShutDown = () => {
        isShuttingDown = true
      }

      for (let index = 0; index < numCPUs; index++) {
        const worker = cluster.fork()
        let workerMode: "server" | "worker" | "shared" = "shared"
        if (index < serversCount) {
          workerMode = "server"
        } else if (index < serversCount + workersCount) {
          workerMode = "worker"
        }
        worker.on("online", () => {
          worker.send({ index, workerMode })
        })
      }

      cluster.on("exit", () => {
        if (!isShuttingDown) {
          cluster.fork()
        } else if (!isPresent(cluster.workers)) {
          setTimeout(killMainProccess, 100).unref()
        }
      })

      process.on("SIGTERM", gracefulShutDown)
      process.on("SIGINT", gracefulShutDown)
    } else {
      process.on("message", async (msg: any) => {
        if (msg.workerMode) {
          process.env.MEDUSA_WORKER_MODE = msg.workerMode
        }

        if (msg.index > 0) {
          process.env.PLUGIN_ADMIN_UI_SKIP_CACHE = "true"
        }

        return await internalStart(!!types && msg.index === 0)
      })
    }
  } else {
    /**
     * Not in cluster mode
     */
    return await internalStart(!!types)
  }
}

export default start
