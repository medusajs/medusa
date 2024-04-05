import { LoaderOptions } from "@medusajs/modules-sdk"
import { asValue } from "awilix"
import Redis from "ioredis"
import { RedisWorkflowsOptions } from "../types"

export default async ({
  container,
  logger,
  options,
  dataLoaderOnly,
}: LoaderOptions): Promise<void> => {
  const {
    url,
    options: redisOptions,
    pubsub,
  } = options?.redis as RedisWorkflowsOptions

  // TODO: get default from ENV VAR
  if (!url) {
    throw Error(
      "No `redis.url` provided in `workflowOrchestrator` module options. It is required for the Workflow Orchestrator Redis."
    )
  }

  const cnnPubSub = pubsub ?? { url, options: redisOptions }

  const queueName = options?.queueName ?? "medusa-workflows"

  let connection
  let redisPublisher
  let redisSubscriber
  let workerConnection

  try {
    connection = await getConnection(url, redisOptions)
    workerConnection = await getConnection(url, {
      ...(redisOptions ?? {}),
      maxRetriesPerRequest: null,
    })
    logger?.info(
      `Connection to Redis in module 'workflow-engine-redis' established`
    )
  } catch (err) {
    logger?.error(
      `An error occurred while connecting to Redis in module 'workflow-engine-redis': ${err}`
    )
  }

  try {
    redisPublisher = await getConnection(cnnPubSub.url, cnnPubSub.options)
    redisSubscriber = await getConnection(cnnPubSub.url, cnnPubSub.options)
    logger?.info(
      `Connection to Redis PubSub in module 'workflow-engine-redis' established`
    )
  } catch (err) {
    logger?.error(
      `An error occurred while connecting to Redis PubSub in module 'workflow-engine-redis': ${err}`
    )
  }

  container.register({
    partialLoading: asValue(true),
    redisConnection: asValue(connection),
    redisWorkerConnection: asValue(workerConnection),
    redisPublisher: asValue(redisPublisher),
    redisSubscriber: asValue(redisSubscriber),
    redisQueueName: asValue(queueName),
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
