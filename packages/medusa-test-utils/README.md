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
  @medusajs/test-utils
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

`@medusajs/test-utils` provides Jest test runners for Medusa: `medusaIntegrationTestRunner` boots a full Medusa application against a test database for HTTP and workflow integration tests, and `moduleIntegrationTestRunner` boots a single module for module integration tests. Use it as a dev dependency in Medusa applications, plugins, and module packages.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/test-utils` |
| Type | Core library |
| Import from | `@medusajs/test-utils` |

## Features

- `medusaIntegrationTestRunner`: runs a test suite against a running Medusa application, passing `api` (an HTTP client), `getContainer`, `dbConnection`, and `utils.waitWorkflowExecutions`.
- `moduleIntegrationTestRunner`: runs a test suite against one module, passing its `service`, `medusaApp`, and `MikroOrmWrapper`. Accepts `moduleName`, `resolve`, `moduleModels`, `moduleOptions`, and `injectedDependencies`.
- `initModules`: initializes a set of modules for custom test setups.
- `TestEventUtils.waitSubscribersExecution`: waits until subscribers of an event finish running.
- `MockEventBusService`, `TestDatabaseUtils`, `JestUtils`, and `normalizeBigNumbers` helpers.

## Installation

```bash
npm install --save-dev @medusajs/test-utils jest @types/jest @swc/jest
```

Requires `@medusajs/framework` as a peer dependency; `@medusajs/medusa` and `@medusajs/core-flows` are optional peers.

## Usage

```ts
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    // TODO write tests...
  },
})

jest.setTimeout(60 * 1000)
```

## Configuration

The runners create a test database per Jest worker and connect to PostgreSQL with these environment variables:

| Environment variable | Description | Default |
| --- | --- | --- |
| `DB_HOST` | PostgreSQL host. | `localhost` |
| `DB_PORT` | PostgreSQL port. | `5432` |
| `DB_USERNAME` | PostgreSQL user. | - |
| `DB_PASSWORD` | PostgreSQL password. | - |

## Resources

- [Testing tools](https://docs.medusajs.com/learn/debugging-and-testing/testing-tools)
- [Integration tests](https://docs.medusajs.com/learn/debugging-and-testing/testing-tools/integration-tests)
- [Module tests](https://docs.medusajs.com/learn/debugging-and-testing/testing-tools/modules-tests)
