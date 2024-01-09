import { LoaderOptions } from "@medusajs/modules-sdk"
import { asValue } from "awilix"
import Redis from "ioredis"
import { RedisWorkflowOrchestratorOptions } from "../types"

export default async ({
  container,
  logger,
  options,
}: LoaderOptions): Promise<void> => {
  const {
    url,
    options: redisOptions,
    pubsub,
  } = options?.redis as RedisWorkflowOrchestratorOptions

  // TODO: get default from ENV VAR
  if (!url) {
    throw Error(
      "No `redis.url` provided in `workflowOrchestrator` module options. It is required for the Workflow Orchestrator Redis."
    )
  }

  const cnnPubSub = pubsub ?? { url, options: redisOptions }

  let connection, redisPublisher, redisSubscriber

  try {
    connection = await getConnection(url, redisOptions)
    logger?.info(
      `Connection to Redis in module 'workflow-orchestrator-redis' established`
    )
  } catch (err) {
    logger?.error(
      `An error occurred while connecting to Redis in module 'workflow-orchestrator-redis': ${err}`
    )
  }

  try {
    redisPublisher = await getConnection(cnnPubSub.url, cnnPubSub.options)
    redisSubscriber = await getConnection(cnnPubSub.url, cnnPubSub.options)
    logger?.info(
      `Connection to Redis PubSub in module 'workflow-orchestrator-redis' established`
    )
  } catch (err) {
    logger?.error(
      `An error occurred while connecting to Redis PubSub in module 'workflow-orchestrator-redis': ${err}`
    )
  }

  container.register({
    redisConnection: asValue(connection),
    redisPublisher: asValue(redisPublisher),
    redisSubscriber: asValue(redisSubscriber),
  })
}

async function getConnection(url, redisOptions) {
  const connection = new Redis(url, {
    lazyConnect: true,
    ...(redisOptions ?? {}),
  })

  await connection.connect()

  return connection
}
