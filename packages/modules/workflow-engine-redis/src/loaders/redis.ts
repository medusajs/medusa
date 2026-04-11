import {
  InternalModuleDeclaration,
  LoaderOptions,
} from "@medusajs/framework/types"
import { asValue } from "@medusajs/framework/awilix"
import Redis from "ioredis"
import { RedisWorkflowsOptions } from "../types"

export default async (
  { container, logger, options, dataLoaderOnly }: LoaderOptions,
  moduleDeclaration: InternalModuleDeclaration
): Promise<void> => {
  const {
    url,
    redisUrl,
    options: deprecatedRedisOptions,
    redisOptions: newRedisOptions,
    jobQueueName,
    queueName,
    // Shared options
    queueOptions,
    workerOptions,
    // Per-queue options
    mainQueueOptions,
    mainWorkerOptions,
    jobQueueOptions,
    jobWorkerOptions,
    cleanerQueueOptions,
    cleanerWorkerOptions,
    pubsub,
  } = options?.redis as RedisWorkflowsOptions

  // Handle backward compatibility for deprecated options
  const resolvedUrl = redisUrl ?? url
  const redisOptions = newRedisOptions ?? deprecatedRedisOptions

  // Log deprecation warnings
  if (url && !redisUrl) {
    logger?.warn(
      "[Workflow-engine-redis] The `url` option is deprecated. Please use `redisUrl` instead for consistency with other modules."
    )
  }
  if (deprecatedRedisOptions && !newRedisOptions) {
    logger?.warn(
      "[Workflow-engine-redis] The `options` option is deprecated. Please use `redisOptions` instead for consistency with other modules."
    )
  }

  // TODO: get default from ENV VAR
  if (!resolvedUrl) {
    throw Error(
      "No `redis.redisUrl` (or deprecated `redis.url`) provided in `workflowOrchestrator` module options. It is required for the Workflow Orchestrator Redis."
    )
  }

  const cnnPubSub = pubsub ?? { url: resolvedUrl, options: redisOptions }

  const queueName_ = queueName ?? "medusa-workflows"
  const jobQueueName_ = jobQueueName ?? "medusa-workflows-jobs"

  // Resolve per-queue options by merging shared defaults with per-queue overrides
  const resolvedMainQueueOptions = {
    ...(queueOptions ?? {}),
    ...(mainQueueOptions ?? {}),
  }
  const resolvedMainWorkerOptions = {
    ...(workerOptions ?? {}),
    ...(mainWorkerOptions ?? {}),
  }
  const resolvedJobQueueOptions = {
    ...(queueOptions ?? {}),
    ...(jobQueueOptions ?? {}),
  }
  const resolvedJobWorkerOptions = {
    ...(workerOptions ?? {}),
    ...(jobWorkerOptions ?? {}),
  }
  const resolvedCleanerQueueOptions = {
    ...(queueOptions ?? {}),
    ...(cleanerQueueOptions ?? {}),
  }
  const resolvedCleanerWorkerOptions = {
    ...(workerOptions ?? {}),
    ...(cleanerWorkerOptions ?? {}),
  }

  let connection
  let redisPublisher
  let redisSubscriber
  let workerConnection

  try {
    connection = await getConnection(resolvedUrl, redisOptions)
    workerConnection = await getConnection(resolvedUrl, {
      ...(redisOptions ?? {}),
      maxRetriesPerRequest: null,
    })
    logger?.info(
      `[Workflow-engine-redis] Connection to Redis in module 'workflow-engine-redis' established`
    )
  } catch (err) {
    logger?.error(
      `[Workflow-engine-redis] An error occurred while connecting to Redis in module 'workflow-engine-redis': ${err}`
    )
  }

  try {
    redisPublisher = await getConnection(cnnPubSub.url, cnnPubSub.options)
    redisSubscriber = await getConnection(cnnPubSub.url, cnnPubSub.options)
    logger?.info(
      `[Workflow-engine-redis] Connection to Redis PubSub in module 'workflow-engine-redis' established`
    )
  } catch (err) {
    logger?.error(
      `[Workflow-engine-redis] An error occurred while connecting to Redis PubSub in module 'workflow-engine-redis': ${err}`
    )
  }

  container.register({
    isWorkerMode: asValue(moduleDeclaration.worker_mode !== "server"),
    partialLoading: asValue(true),
    redisConnection: asValue(connection),
    redisWorkerConnection: asValue(workerConnection),
    redisPublisher: asValue(redisPublisher),
    redisSubscriber: asValue(redisSubscriber),
    redisQueueName: asValue(queueName_),
    redisJobQueueName: asValue(jobQueueName_),
    // Per-queue resolved options
    redisMainQueueOptions: asValue(resolvedMainQueueOptions),
    redisMainWorkerOptions: asValue(resolvedMainWorkerOptions),
    redisJobQueueOptions: asValue(resolvedJobQueueOptions),
    redisJobWorkerOptions: asValue(resolvedJobWorkerOptions),
    redisCleanerQueueOptions: asValue(resolvedCleanerQueueOptions),
    redisCleanerWorkerOptions: asValue(resolvedCleanerWorkerOptions),
    redisDisconnectHandler: asValue(async () => {
      connection.disconnect()
      workerConnection.disconnect()
      redisPublisher.disconnect()
      redisSubscriber.disconnect()
    }),
  })
}

async function getConnection(url, redisOptions) {
  const connection = new Redis(url, {
    lazyConnect: true,
    ...(redisOptions ?? {}),
  })

  await new Promise(async (resolve) => {
    await connection.connect(resolve)
  })

  return connection
}
