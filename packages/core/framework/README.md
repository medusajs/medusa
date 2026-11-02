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
  @medusajs/framework
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

`@medusajs/framework` is the Medusa Framework: the single package Medusa applications, plugins, and custom modules import from to build API routes, workflows, modules, data models, subscribers, scheduled jobs, and configuration. It re-exports the core libraries (`@medusajs/utils`, `@medusajs/types`, `@medusajs/workflows-sdk`, `@medusajs/modules-sdk`, `@medusajs/orchestration`) and pinned third-party dependencies through subpath entry points, so apps should import from `@medusajs/framework/*` instead of those packages directly.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/framework` |
| Type | Core library |
| Import from | `@medusajs/framework/<subpath>` |

## Entry points

| Import path | Provides |
| --- | --- |
| `@medusajs/framework/utils` | Re-export of `@medusajs/utils`: `defineConfig`, `loadEnv`, `Modules`, `ContainerRegistrationKeys`, `MedusaError`, `MedusaService`, `Module`, `ModuleProvider`, `model`, `defineLink`, and more |
| `@medusajs/framework/types` | Re-export of `@medusajs/types`: DTOs, module service interfaces, and the `HttpTypes` namespace |
| `@medusajs/framework/workflows-sdk` | Re-export of `@medusajs/workflows-sdk`: `createWorkflow`, `createStep`, `StepResponse`, `WorkflowResponse`, `transform`, `when`, `createHook` |
| `@medusajs/framework/workflows-sdk/composer` | Re-export of `@medusajs/workflows-sdk/composer` |
| `@medusajs/framework/modules-sdk` | Re-export of `@medusajs/modules-sdk` |
| `@medusajs/framework/orchestration` | Re-export of `@medusajs/orchestration` |
| `@medusajs/framework/http` | `MedusaRequest`, `AuthenticatedMedusaRequest`, `MedusaResponse`, `defineMiddlewares`, `authenticate`, `validateAndTransformBody`, `validateAndTransformQuery` |
| `@medusajs/framework/subscribers` | `SubscriberArgs`, `SubscriberConfig` |
| `@medusajs/framework/jobs` | Scheduled job loader and types |
| `@medusajs/framework/logger` | The Medusa `logger` |
| `@medusajs/framework/config` | Config loader and `ConfigModule` types |
| `@medusajs/framework/telemetry` | `Tracer` for OpenTelemetry instrumentation |
| `@medusajs/framework/feature-flags` | Feature flag loader and router |
| `@medusajs/framework/database`, `/links`, `/search`, `/workflows`, `/migrations`, `/build-tools` | Loaders and tooling used by the Medusa application and CLI |
| `@medusajs/framework/zod` | Re-export of the `zod` version Medusa uses |
| `@medusajs/framework/awilix`, `/pg` | Re-exports of `awilix` and `pg` |
| `@medusajs/framework/mikro-orm/{core,knex,postgresql,migrations,cli}` | Re-exports of the pinned MikroORM packages |
| `@medusajs/framework/opentelemetry/{api,resources,sdk-node,sdk-trace-node,instrumentation-pg}` | Re-exports of the pinned OpenTelemetry packages |

The package also ships a `medusa-mikro-orm` binary that wraps the MikroORM CLI.

## Installation

Projects created with `create-medusa-app` already include it. To add it to a plugin or module package:

```bash
npm install @medusajs/framework
```

## Usage

```ts
import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  res.json({
    message: "[GET] Hello world!",
  })
}
```

## Resources

- [Framework overview](https://docs.medusajs.com/learn/fundamentals/framework)
- [API routes](https://docs.medusajs.com/learn/fundamentals/api-routes)
- [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows)
- [Modules](https://docs.medusajs.com/learn/fundamentals/modules)
- [Data models](https://docs.medusajs.com/learn/fundamentals/data-models)
- [Medusa configuration](https://docs.medusajs.com/learn/configurations/medusa-config)
