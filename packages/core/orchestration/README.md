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
  @medusajs/orchestration
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

Low-level transaction orchestration for Medusa: the engine that executes workflow steps, tracks their state, and runs compensation when a step fails. It powers the Workflows SDK and the Workflow Engine modules; to build workflows, use `@medusajs/framework/workflows-sdk` instead. When you need its classes or types directly, such as when building a custom workflow engine, import them from `@medusajs/framework/orchestration`, which re-exports this package; importing `@medusajs/orchestration` directly is discouraged.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/orchestration` |
| Type | Core library |
| Import from | `@medusajs/framework/orchestration` |

## Features

- `TransactionOrchestrator` and `DistributedTransaction` to run a flow of steps and track its state.
- `LocalWorkflow`, `GlobalWorkflow`, and `WorkflowManager` to register and run workflow definitions.
- `DistributedTransactionStorage` and `DistributedSchedulerStorage` abstract classes that workflow engines implement to persist executions and scheduled workflows.
- Step error classes, such as `PermanentStepFailureError` and `SkipStepResponse`, and state enums, such as `TransactionState`.

## Installation

No separate installation is needed in a Medusa application. It's installed with `@medusajs/framework`.

## Resources

- [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows)
- [Long-running workflows](https://docs.medusajs.com/learn/fundamentals/workflows/long-running-workflow)
