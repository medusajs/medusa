# @medusajs/toolbox

Internal CLI that generates Medusa UI assets from Medusa's Figma file: the React icon components in `@medusajs/icons` and the design tokens in `@medusajs/ui-preset`. It's private and only used inside the Medusa monorepo.

## At a glance

| | |
|---|---|
| Package | `@medusajs/toolbox` (private) |
| Type | Internal tooling |
| CLI | `toolbox` |

## Usage

Run it through the `generate` scripts of the packages that use it:

```bash
yarn workspace @medusajs/icons generate
yarn workspace @medusajs/ui-preset generate
```

## Commands

| Command | Description |
|---|---|
| `toolbox icons -o <path>` | Generate icon components from Figma into `<path>`. |
| `toolbox tokens -o <path>` | Generate design tokens from Figma into `<path>`. |

## Environment variables

| Variable | Description |
|---|---|
| `FIGMA_TOKEN` | Figma access token with access to the Medusa Figma organization. Required. |
