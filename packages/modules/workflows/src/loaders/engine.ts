import { asValue } from "@medusajs/framework/awilix"
import type {
  ConfigModule,
  LoaderOptions,
  Logger,
} from "@medusajs/framework/types"
import type { IEventBusModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import {
  createEngine,
  createOutbox,
  createRedisNotifier,
  EngineConfig,
  MemoryStore,
  Notifier,
} from "@medusajs/workflow-engine"
import { fromKnex, PostgresStore } from "@medusajs/workflow-engine/postgres"
import { createEventPublisher } from "../events/event-group-router"
import { checkLegacyExecutions } from "../legacy/check-legacy-executions"
import { tracingExtension } from "../middleware/tracing"
import type { WorkflowsModuleOptions } from "../types"

const DEFAULT_RECOVERY = {
  heartbeatIntervalMs: 5_000,
  leaseTtlMs: 30_000,
  reaperIntervalMs: 10_000,
}

function createNotifier(options: WorkflowsModuleOptions): Notifier | undefined {
  const notifier = options.notifier
  if (!notifier) {
    return undefined
  }
  if (notifier.type !== "redis" || !notifier.url) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'The notifier of the workflows module must be { type: "redis", url: "..." }.'
    )
  }
  // ioredis is an optional dependency, loaded only when configured.
  const Redis = require("ioredis")
  return createRedisNotifier({
    publisher: new Redis(notifier.url, { lazyConnect: true }),
    subscriber: new Redis(notifier.url, { lazyConnect: true }),
  })
}

export default async function engineLoader({
  container,
  options = {},
  logger,
}: LoaderOptions<WorkflowsModuleOptions>) {
  const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION, {
    allowUnregistered: true,
  }) as unknown as Parameters<typeof fromKnex>[0] | undefined
  const configModule = container.resolve<ConfigModule>(
    ContainerRegistrationKeys.CONFIG_MODULE,
    { allowUnregistered: true }
  )

  const storeType = options.store ?? (knex ? "postgres" : "memory")
  if (storeType === "postgres" && !knex) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'The workflows module is configured with store "postgres", but no database connection is available. Set the database URL or use store "memory".'
    )
  }
  const client = storeType === "postgres" ? fromKnex(knex!) : undefined
  const workerMode = configModule?.projectConfig?.workerMode ?? "shared"

  const store = client ? new PostgresStore({ client }) : new MemoryStore()

  // Grouped events are staged with the run and published, through the event
  // bus, when the root run succeeds.
  const outbox = createOutbox(store, {
    publish: createEventPublisher(() =>
      container.resolve<IEventBusModuleService>(Modules.EVENT_BUS, {
        allowUnregistered: true,
      })
    ),
    groupOf: (run) => run.context?.eventGroupId as string | undefined,
    releases: (run) => !run.context?.preventReleaseEvents,
    logger: logger
      ? { warn: (message) => (logger as Logger).warn(message) }
      : undefined,
  })

  const config: EngineConfig = {
    store,
    instanceId: options.instanceId,
    mode: workerMode,
    pollIntervalMs: options.pollIntervalMs,
    maxConcurrentRuns: options.maxConcurrentRuns,
    recovery:
      options.recovery === false || !client
        ? false
        : { ...DEFAULT_RECOVERY, ...(options.recovery ?? {}) },
    notifier: client ? createNotifier(options) : undefined,
    extensions: [tracingExtension(), outbox.extension],
    logger: logger
      ? {
          error: (message, error) =>
            (logger as Logger).error(
              error
                ? `${message}: ${(error as Error)?.stack ?? error}`
                : message
            ),
          warn: (message) => (logger as Logger).warn(message),
        }
      : undefined,
  }

  const engine = createEngine(config)
  container.register("workflowEngine", asValue(engine))
  container.register("workflowOutbox", asValue(outbox))
  container.register(
    "workflowEngineShutdownGraceMs",
    asValue(options.shutdownGraceMs)
  )
  // Checked by the instances serving requests, not by every worker.
  container.register(
    "workflowEngineLegacyCheck",
    asValue(
      client && logger && workerMode !== "worker"
        ? () => checkLegacyExecutions(client, logger)
        : undefined
    )
  )
}
