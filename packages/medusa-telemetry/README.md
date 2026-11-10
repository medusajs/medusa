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
  @medusajs/telemetry
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

`@medusajs/telemetry` collects anonymous, non-sensitive usage data from the Medusa CLI and application, such as OS and Node.js version and the Medusa version in use. It is an internal dependency of `@medusajs/medusa`, `@medusajs/framework`, and `@medusajs/cli`; you don't install or call it directly, but you can opt out of it.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/telemetry` |
| Type | Internal tooling |

## Opting out

Set the environment variable:

```bash
MEDUSA_DISABLE_TELEMETRY=true
```

Or run the CLI command in your project:

```bash
npx medusa telemetry --disable
```

## Configuration

| Environment variable | Description | Default |
| --- | --- | --- |
| `MEDUSA_DISABLE_TELEMETRY` | Disables telemetry collection when truthy. | - |
| `MEDUSA_TELEMETRY_VERBOSE` | Logs telemetry activity to the console when truthy. | - |

## Resources

- [Usage information](https://docs.medusajs.com/learn/resources/usage)
- [`medusa telemetry` command](https://docs.medusajs.com/resources/medusa-cli/commands/telemtry)
