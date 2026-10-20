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
  @medusajs/workflows
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

Workflow Engine Module for Medusa: runs your workflows, retries and compensates failed steps, runs scheduled workflows, and keeps a record of their executions. It runs on [`@medusajs/workflow-engine`](../../core/workflow-engine) and stores executions, timers and schedules in your application's PostgreSQL database, so a single instance and a deployment with many server and worker instances use the same module. It ships with `@medusajs/medusa` and is registered by default.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/workflows` |
| Type | Infrastructure Module |
| Module key | `Modules.WORKFLOW_ENGINE` (`"workflows"`) |
| Registered by default | Yes |

## Installation

No installation needed. The module ships with `@medusajs/medusa`.

## Usage

```ts
import { defineConfig } from "@medusajs/framework/utils"

module.exports = defineConfig({
  // ...
  modules: [
    {
      resolve: "@medusajs/medusa/workflows",
      options: {
        notifier: {
          type: "redis",
          url: process.env.REDIS_URL,
        },
      },
    },
  ],
})
```

## Configuration

| Option | Type | Description | Default |
| --- | --- | --- | --- |
| `store` | `"postgres" \| "memory"` | Where executions are stored. `"memory"` needs no database and suits a single instance, such as in development: executions are lost on restart and are not recovered after a crash. | `"postgres"` with a database connection, otherwise `"memory"` |
| `notifier` | `{ type: "redis", url: string }` | Lets instances wake each other up when work is due instead of waiting for their next check. | None |
| `pollIntervalMs` | `number` | How often an idle instance checks for due work. | `1000`, or `30000` with a notifier |
| `recovery` | `false \| { heartbeatIntervalMs?, leaseTtlMs?, reaperIntervalMs? }` | Resumes executions of instances that stopped, for example after a crash. | `{ heartbeatIntervalMs: 5000, leaseTtlMs: 30000, reaperIntervalMs: 10000 }` |
| `maxConcurrentRuns` | `number` | Executions one instance takes on at once from timers and schedules. | `50` |
| `shutdownGraceMs` | `number` | How long shutdown waits for running steps before handing executions over. | `10000` |

## Resources

- [Workflow Engine Module](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine)
- [Long-running workflows](https://docs.medusajs.com/learn/fundamentals/workflows/long-running-workflow)
