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
  Medusa
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
    <img src="https://img.shields.io/badge/license-open--core-blue.svg" alt="Medusa uses an open-core licensing model." />
  </a>
  <a href="https://github.com/medusajs/medusa/blob/develop/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://discord.gg/medusajs">
    <img src="https://img.shields.io/badge/chat-on%20discord-7289DA.svg" alt="Discord Chat" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=medusajs">
    <img src="https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs" alt="Follow @medusajs" />
  </a>
</p>

Medusa is an open-source commerce platform with a built-in framework for customization. Use it to build B2B or DTC stores, marketplaces, distributor platforms, PoS systems, and other applications that need commerce primitives such as products, carts, orders, and payments, without reinventing core commerce logic.

## Getting Started

The fastest way to get started is with [Medusa Cloud](https://medusajs.com/cloud/), a managed environment for Medusa applications with automated deployments, scaling, and maintenance. [Get started on Medusa Cloud](https://cloud.medusajs.com).

To create a Medusa application locally, you need Node.js v22.22.0 or later and a running PostgreSQL database. Then run:

```bash
npx create-medusa-app@latest my-medusa-store
```

This sets up the Medusa server and admin dashboard, and optionally the Next.js Starter Storefront. See the [installation guide](https://docs.medusajs.com/learn/installation) for all options, or [install with Docker](https://docs.medusajs.com/learn/installation/docker).

## Repository structure

This is a Yarn workspaces monorepo. Every Medusa package published to npm lives under [`packages`](./packages).

| Path | Contents |
| --- | --- |
| [`packages/medusa`](./packages/medusa) | `@medusajs/medusa`: the main package installed in Medusa applications. Holds the Store and Admin API routes, CLI commands, subscribers, and jobs, and re-exports the modules and `@medusajs/core-flows`. |
| [`packages/core/*`](./packages/core) | Core libraries: the framework runtime (`framework`), types, utils, Workflows SDK, Modules SDK, predefined workflows (`core-flows`), Query, orchestration, and the JS SDK. |
| [`packages/modules/*`](./packages/modules) | Commerce Modules (product, cart, order, pricing, payment, and more) and Infrastructure Modules (event bus, caching, file, locking, workflow engine, and more). |
| [`packages/modules/providers/*`](./packages/modules/providers) | Module Providers, such as Stripe payments, S3 file storage, SendGrid notifications, Redis locking and caching, and auth providers for email/password, GitHub, Google, and OIDC. |
| [`packages/admin/*`](./packages/admin) | The Medusa Admin dashboard and the SDK, Vite plugin, and bundler used to build and extend it. |
| [`packages/design-system/*`](./packages/design-system) | Medusa UI: the React component library, icons, Tailwind preset, and a Figma import tool. |
| [`packages/cli/*`](./packages/cli) | CLI tools: `create-medusa-app`, the `medusa` CLI, OpenAPI tooling, and the HTTP types generator. |
| [`packages/plugins/*`](./packages/plugins) | Official plugins, such as draft orders and loyalty. |
| [`integration-tests`](./integration-tests) | HTTP and module integration test suites run against a real PostgreSQL database. |
| [`www`](./www) | The source of the [Medusa documentation](https://docs.medusajs.com) website. |

## About Medusa

Medusa's commerce modules are open-source and freely available on npm. Enterprise Edition features are identified separately in the repository.

Learn more about [Medusa's architecture](https://docs.medusajs.com/learn/introduction/architecture) and [Commerce Modules](https://docs.medusajs.com/resources/commerce-modules) in the documentation.

## Upgrades & Integrations

Follow the [Release Notes](https://github.com/medusajs/medusa/releases) to keep your Medusa project up-to-date.

Check out all [available Medusa integrations](https://docs.medusajs.com/resources/integrations).

## Community & Contributions

The core team is available in [GitHub Discussions](https://github.com/medusajs/medusa/discussions), where you can create issues, share ideas, and discuss the roadmap.

The [Contribution Guide](./CONTRIBUTING.md) describes how to contribute to the codebase and documentation.

Join the [Discord server](https://discord.gg/medusajs) to meet and discuss with other community members.

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Community Discord](https://discord.gg/medusajs)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)

## License

Medusa uses an open-core model. The core is licensed under the [MIT License](./LICENSE). The RBAC-based Enterprise Edition materials identified in [ENTERPRISE-LICENSE.md](./ENTERPRISE-LICENSE.md) require a commercial agreement with MedusaJS, Inc.
