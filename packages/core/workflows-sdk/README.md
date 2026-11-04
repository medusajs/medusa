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
  @medusajs/workflows-sdk
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

Workflows SDK for Medusa: the tools to define durable, multi-step workflows with steps, compensation (rollback), hooks, and conditions. Use it to build custom commerce flows in a Medusa application, module, or plugin. Applications import it through `@medusajs/framework/workflows-sdk`, which re-exports this package; importing `@medusajs/workflows-sdk` directly is discouraged.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/workflows-sdk` |
| Type | Core library |
| Import from | `@medusajs/framework/workflows-sdk` |
| Entry points | `.`, `./composer` (available as `@medusajs/framework/workflows-sdk/composer`) |

## Features

- `createStep` and `StepResponse` to define steps with an optional compensation function.
- `createWorkflow` and `WorkflowResponse` to compose steps into a workflow.
- `transform`, `when`, and `parallelize` to manipulate data, run steps conditionally, and run steps in parallel inside a workflow.
- `createHook` to expose hooks that other code can consume to extend a workflow.

## Installation

No separate installation is needed in a Medusa application. It's installed with `@medusajs/framework`.

## Usage

```ts
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

type WorkflowInput = {
  name: string
}

const greetStep = createStep(
  "greet-step",
  async ({ name }: WorkflowInput) => {
    return new StepResponse(`Hello ${name}!`)
  }
)

const helloWorldWorkflow = createWorkflow(
  "hello-world",
  function (input: WorkflowInput) {
    const message = greetStep(input)

    return new WorkflowResponse({ message })
  }
)

export default helloWorldWorkflow
```

Execute the workflow by passing it the Medusa container, for example in an API route:

```ts
const { result } = await helloWorldWorkflow(req.scope).run({
  input: { name: "John" },
})
```

## Resources

- [Workflows](https://docs.medusajs.com/learn/fundamentals/workflows)
- [Compensation function](https://docs.medusajs.com/learn/fundamentals/workflows/compensation-function)
- [Workflow hooks](https://docs.medusajs.com/learn/fundamentals/workflows/workflow-hooks)
- [Long-running workflows](https://docs.medusajs.com/learn/fundamentals/workflows/long-running-workflow)
