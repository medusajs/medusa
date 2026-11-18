# @medusajs/icons

React icon components for Medusa's design system, mostly generated from the Medusa Figma file. They are used by `@medusajs/ui`, the Medusa Admin, and admin extensions (for example, as the sidebar `icon` in `defineRouteConfig`).

## Using this package

Already available in Medusa Admin customizations. Import named components:

```tsx
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight, Spinner } from "@medusajs/icons"

export const config = defineRouteConfig({
  label: "Messages",
  icon: ChatBubbleLeftRight,
})

const Loading = () => <Spinner className="text-ui-fg-subtle animate-spin" />
```

- Component names are the Figma names in PascalCase; file names are kebab-case (`chat-bubble-left-right.tsx` exports `ChatBubbleLeftRight`). Check `src/components/index.ts` and `src/custom/index.ts` for the exact name before importing.
- Every icon is a `forwardRef<SVGSVGElement>` SVG (mostly 15x15) that accepts SVG attributes plus `color` (default `"currentColor"`), so it inherits text color (`text-ui-fg-*`).
- `Flags` and `Brands` icons (except Brands named `*-ex`) are "fixed": they keep their original colors and their props type omits `color`.
- Peer dep: `react ^18.3.1 || ^19.0.0`.

Docs: https://docs.medusajs.com/ui/icons/overview.md

## Architecture

- `src/components/` (generated):
  - one `<icon>.tsx` per icon
  - `index.ts`, headed "This file is generated automatically."
  - one smoke test per icon in `__tests__/<icon>.spec.tsx`
- `src/custom/`: icons that aren't in Figma, in the same layout and format as `src/components/` (`<icon>.tsx`, `index.ts`, `__tests__/`). `yarn generate` doesn't touch it.
- `src/index.ts`: re-exports `./components` and `./custom`.
- `src/types.ts` (hand-written): `IconProps`.
- Generation:
  - `yarn generate` runs `rimraf ./src/components && toolbox icons -o ./src/components`.
  - `toolbox icons` (`@medusajs/toolbox`) downloads the components on the Figma icons page as SVG and converts them with SVGR (`#18181B` is replaced by `{color}`). It skips the `Flags` frame.
- Build: Rollup bundles `src/index.ts` to `dist/cjs/medusa-icons.js`, `dist/esm` (preserved modules), and `dist/umd`, then `tsc --emitDeclarationOnly`. `rollup-plugin-visualizer` writes `stats/*.html`.

## Development

```bash
yarn build      # rollup bundles + tsc declarations
yarn test       # vitest --run, jsdom
yarn test src/components/__tests__/academic-cap.spec.tsx
yarn generate   # needs FIGMA_TOKEN (Medusa Figma org) and a built @medusajs/toolbox
```

## Gotchas

- Never hand-edit, add, or rename files in `src/components/` (icons, `index.ts`, `__tests__/`). `yarn generate` deletes the whole directory and recreates it from Figma.
- To add or change a Figma icon, change it in Figma, then run `yarn generate`. External contributors should open an issue (see `README.md`).
- An icon that isn't in Figma goes in `src/custom/`, in the same format the generator emits. Never put it in `src/components/`.
- Icon names must be unique across `src/components/` and `src/custom/`. When Figma gains an icon that exists in `src/custom/`, `yarn build:types` fails on the duplicate export: delete the custom copy, its spec, and its `src/custom/index.ts` line.
- To change how every icon is emitted, edit the templates and transformer in `packages/design-system/toolbox/src/` and regenerate.
- `stats/` is build output from the visualizer. Don't edit it.
- `IconProps` is not re-exported from `src/index.ts`. Consumers get it only through each component's props type.
