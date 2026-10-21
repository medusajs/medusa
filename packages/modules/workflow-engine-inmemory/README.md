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
  @medusajs/workflow-engine-inmemory
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

In-Memory Workflow Engine Module for Medusa: runs workflows and tracks their executions and subscribers in memory. It's the default Workflow Engine Module, installed and registered with `@medusajs/medusa`, and is meant for development and testing. For production, use the [Redis Workflow Engine Module](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine/redis) (`@medusajs/workflow-engine-redis`) instead.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/workflow-engine-inmemory` |
| Type | Infrastructure Module |
| Module key | `Modules.WORKFLOW_ENGINE` (`"workflows"`) |
| Registered by default | Yes |
| Import from | `@medusajs/medusa/workflow-engine-inmemory` |

## Installation

No installation needed. The module ships with `@medusajs/medusa` and is registered by `defineConfig`. It has no options.

## Resources

- [Workflow Engine Module](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine)
- [In-Memory Workflow Engine Module](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine/in-memory)
- [How to Use the Workflow Engine Module](https://docs.medusajs.com/resources/infrastructure-modules/workflow-engine/how-to-use)
- [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows)
