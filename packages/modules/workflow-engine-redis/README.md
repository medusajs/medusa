<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  @medusajs/workflow-engine-redis
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

<p align="center">
  Building blocks for digital commerce
</p>
<p align="center">
  <a href="https://github.com/medusajs/medusa/blob/develop/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Medusa is released under the MIT license." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/xpCwq3Kfn8">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

Redis Workflow Engine Module for Medusa: runs workflows and tracks their executions, subscribers, retries, timeouts, and scheduled workflow jobs using Redis and BullMQ. It's the recommended Workflow Engine Module for production and replaces the default in-memory engine. It ships with `@medusajs/medusa` but isn't registered by default, so add it to `medusa-config.ts`.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/workflow-engine-redis` |
| Type | Infrastructure Module |
| Module key | `Modules.WORKFLOW_ENGINE` (`"workflows"`) |
| Registered by default | No (on Medusa Cloud, registered automatically when `REDIS_URL` is set) |
| Import from | `@medusajs/medusa/workflow-engine-redis` |

## Installation

No installation needed. The module ships with `@medusajs/medusa`. You need a running Redis server.

## Usage

Register the module in `medusa-config.ts`. All options go inside the `redis` object:

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          redisUrl: process.env.WE_REDIS_URL,
        },
      },
    },
  ],
})
```

## Configuration

Options of the `redis` object:

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `redisUrl` | `string` | Redis connection URL. Required (the module throws on startup without it or the deprecated `url`). | - |
| `redisOptions` | `RedisOptions` | [ioredis](https://github.com/redis/ioredis) client options. | - |
| `queueName` | `string` | Name of the main queue, which handles workflow retries, step timeouts, and transaction timeouts. | `"medusa-workflows"` |
| `jobQueueName` | `string` | Name of the queue that runs scheduled workflow jobs. | `"medusa-workflows-jobs"` |
| `queueOptions` | `QueueOptions` | [BullMQ](https://docs.bullmq.io) queue options (without `connection`) applied to all queues. | - |
| `workerOptions` | `WorkerOptions` | BullMQ worker options (without `connection`) applied to all workers. | - |
| `mainQueueOptions` | `QueueOptions` | Overrides `queueOptions` for the main queue. | - |
| `mainWorkerOptions` | `WorkerOptions` | Overrides `workerOptions` for the main worker. | - |
| `jobQueueOptions` | `QueueOptions` | Overrides `queueOptions` for the scheduled jobs queue. | - |
| `jobWorkerOptions` | `WorkerOptions` | Overrides `workerOptions` for the scheduled jobs worker. | - |
| `cleanerQueueOptions` | `QueueOptions` | Overrides `queueOptions` for the queue that removes expired workflow executions. | - |
| `cleanerWorkerOptions` | `WorkerOptions` | Overrides `workerOptions` for the cleaner worker. | - |
| `pubsub` | `{ url: string, options?: RedisOptions }` | Separate Redis connection for pub/sub. | Same connection as `redisUrl` and `redisOptions` |
| `url` | `string` | Deprecated. Use `redisUrl`. | - |
| `options` | `RedisOptions` | Deprecated. Use `redisOptions`. | - |

## Resources

- [Redis Workflow Engine Module](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine/redis)
- [Workflow Engine Module](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine)
- [How to Use the Workflow Engine Module](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine/how-to-use)
- [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows)
