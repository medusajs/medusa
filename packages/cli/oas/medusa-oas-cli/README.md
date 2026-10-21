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
  @medusajs/medusa-oas-cli
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

`@medusajs/medusa-oas-cli` is a CLI for generating and processing the OpenAPI Specifications (OAS) of the Medusa Store and Admin APIs. Use its `oas` command to produce an OAS file for Medusa's API routes (optionally merged with OAS JSDoc from your own routes), and its `docs` command to prepare an OAS file for Redocly's API documentation tools. The Medusa monorepo uses it to build the API reference.

## At a glance

| | |
| --- | --- |
| Package | `@medusajs/medusa-oas-cli` |
| Type | Internal tooling |
| Binary | `medusa-oas` |

## Installation

```bash
npm install --save-dev @medusajs/medusa-oas-cli
```

## Usage

Generate the Store API OAS, merged with the OAS JSDoc in your project's `src` directory:

```bash
npx medusa-oas oas --type store --paths ./src --out-dir ./oas
```

Preview it with Redocly:

```bash
npx medusa-oas docs --src-file ./oas/store.oas.json --preview
```

In the Medusa monorepo, run it with `yarn medusa-oas <command>` from the repository root.

## Commands

### `oas`

Generates `<type>.oas.json` (`admin.oas.json`, `store.oas.json`, or `combined.oas.json`). By default, it starts from the published OAS at `https://docs.medusajs.com/api/download/<type>`; with `--local`, it builds the OAS from the JSDoc in the installed `@medusajs/medusa` package. Invalid OAS throws an error and no file is written, unless `--force` is passed.

| Option | Description | Default |
| --- | --- | --- |
| `-t`, `--type <type>` | Required. API to generate: `admin`, `store`, or `combined` (admin and store merged). | - |
| `-o`, `--out-dir <outDir>` | Output directory. Created if missing. | Current directory |
| `-p`, `--paths <paths...>` | Additional directories to crawl for OAS JSDoc. Their paths and schemas are merged into the output. | - |
| `-b`, `--base <base>` | Custom base OAS file. Its paths, tags, and components are merged; other properties override the base. | - |
| `-D`, `--dry-run` | Validate without writing files. | `false` |
| `-F`, `--force` | Ignore OAS validation errors and write the files. | `false` |
| `--local` | Build from the local `@medusajs/medusa` JSDoc instead of the published OAS. | `false` |

### `docs`

Sanitizes an OAS file for Redocly's API documentation viewer and writes it as YAML.

| Option | Description | Default |
| --- | --- | --- |
| `-s`, `--src-file <srcFile>` | Required. Path to the source OAS file. | - |
| `-o`, `--out-dir <outDir>` | Output directory. Created if missing. | Current directory |
| `--config <config>` | Redocly config file merged with the default configuration. | - |
| `-D`, `--dry-run` | Sanitize without writing files. | `false` |
| `--clean` | Delete the output directory's contents first. | `false` |
| `--split` | Write a multi-file structure (`redocly split`). | `false` |
| `--preview` | Open a browser preview (`redocly preview-docs`). Doesn't write files. | `false` |
| `--html` | Generate a static HTML file (`redocly build-docs`). | `false` |
| `--main-file-name <mainFileName>` | Name of the main YAML file. | `openapi.yaml` |
