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
  @medusajs/core-flows
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

Medusa's built-in commerce workflows and steps: the business flows behind the Medusa API routes, such as creating products, completing carts, and managing orders, returns, and exchanges. Use them in API routes, subscribers, scheduled jobs, or your own workflows to reuse Medusa's logic, or consume their hooks to extend it. Medusa applications import them from `@medusajs/medusa/core-flows`, which re-exports this package.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/core-flows` |
| Type | Core library |
| Import from | `@medusajs/medusa/core-flows` |

## Features

- Workflows and steps grouped by commerce domain under `src/<domain>/`, such as `cart`, `order`, `product`, `payment`, `fulfillment`, `inventory`, `pricing`, `promotion`, `customer`, and `auth`.
- Each domain has a `workflows/` directory and a `steps/` directory. `locking` and `notification` only have steps.
- `common` holds generic steps used across domains, such as `useQueryGraphStep`, `createRemoteLinkStep`, and `emitEventStep`.
- Naming convention: workflows end in `Workflow` (for example, `createProductsWorkflow`), steps end in `Step` (for example, `createProductsStep`), and each has a matching ID constant (for example, `createProductsWorkflowId`).
- Many workflows expose hooks, such as `createProductsWorkflow.hooks.productsCreated`, to run custom logic within the workflow.

## Installation

No separate installation is needed in a Medusa application. It's installed with `@medusajs/medusa`.

## Usage

Run a workflow by passing it the Medusa container, then calling `run`:

```ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await createProductsWorkflow(req.scope).run({
    input: {
      products: [
        {
          title: "Shirt",
        },
      ],
    },
  })

  res.json({ products: result })
}
```

Steps, such as `useQueryGraphStep`, are used inside your own workflows created with `createWorkflow` from `@medusajs/framework/workflows-sdk`.

## Resources

- [Workflows reference](https://docs.medusajs.com/resources/medusa-workflows-reference)
- [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows)
- [Workflow hooks](https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks)
