# @medusajs/toolbox

Private internal CLI (`toolbox`) that generates Medusa design-system code from the Medusa Figma file: icon components for `@medusajs/icons` and design tokens for `@medusajs/ui-preset`. It is not published or used outside the monorepo.

## Usage

Run it through the consuming packages' scripts, not directly:

```bash
# packages/design-system/icons
yarn generate   # rimraf ./src/components && toolbox icons -o ./src/components

# packages/design-system/ui-preset
yarn generate   # toolbox tokens -o ./src/theme
```

- Requires `FIGMA_TOKEN` with access to the Medusa Figma organization. It is read from the environment or a `.env` file in the current working directory (the consuming package).
- `bin/toolbox.js` requires `dist/index.js`, so run `yarn build` in this package first.

## Architecture

- `src/create-cli.ts`: `commander` program with two commands, each taking `-o, --output <path>`:
  - `icons`: `src/commands/icons/command.ts`
  - `tokens`: `src/commands/tokens/command.ts`
- `src/constants.ts`: `FIGMA_FILE_ID`, `FIGMA_ICONS_NODE_ID` (the icons page), and the font stacks written into the typography tokens.
- `src/figma/`, `src/figma-client.ts`: minimal Figma REST client (axios with retries).
  - Creating the client throws `FIGMA_TOKEN is not defined` at import time when the token is missing.
- `icons` command:
  - Fetches the components on the icons page, skipping the `Flags` frame.
  - Downloads the SVGs in batches of 20 and transforms each with SVGR (`src/transformers/transform-svg.ts`) using `defaultTemplate` / `fixedTemplate` from `src/templates/icon-templates.ts`.
  - Writes `<name>.tsx`, `__tests__/<name>.spec.tsx`, and an `index.ts`.
  - "Fixed" icons are the `Flags` and `Brands` frames, except Brands named `*-ex`.
- `tokens` command: reads the Figma file styles (fills, text, effects) and writes:
  - `tokens/colors.ts`, `tokens/effects.ts`, `tokens/typography.ts`, `tokens/components.ts`
  - `extension/theme.ts`

## Development

```bash
yarn build   # tsup (esm + cjs)
```

No tests. Verify changes by running `yarn generate` in `icons` or `ui-preset` and reviewing the diff.

## Gotchas

- A change to the icon templates or SVGR options affects every generated icon. Regenerate `@medusajs/icons` and review the full diff.
- Only `#18181B` is replaced with the `color` prop in non-fixed icons. Other hard-coded colors in a Figma icon stay as-is.
- Icons whose SVG URL fails to download are skipped with a warning, and `generate` in `@medusajs/icons` has already deleted `src/components`. Check the "Skipped N icons" log before committing.
- Font families in `src/constants.ts` differ from `packages/design-system/ui-preset/src/constants.ts`. Each package has its own list.
