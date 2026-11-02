# @medusajs/ui

Medusa's React component library (Radix UI / react-aria primitives styled with Tailwind and `@medusajs/ui-preset` tokens). The Medusa Admin is built with it, and Admin widgets and UI routes should use it so they match the dashboard. It is versioned independently from the other `@medusajs/*` packages (4.x).

## Using this package

In Medusa Admin customizations (`src/admin/**`), `@medusajs/ui` and `@medusajs/icons` are already available through the dashboard, and Tailwind is pre-configured by `@medusajs/admin-bundler`:

```tsx
import { Button, Container, Heading, Text, toast, usePrompt } from "@medusajs/ui"

const Section = () => {
  const prompt = usePrompt()

  const onDelete = async () => {
    const confirmed = await prompt({
      title: "Delete brand?",
      description: "This can't be undone.",
    })
    if (confirmed) {
      toast.success("Brand deleted")
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Brand</Heading>
        <Button size="small" variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </div>
      <Text size="small" className="text-ui-fg-subtle px-6 py-4">...</Text>
    </Container>
  )
}
```

- Exports:
  - components: `Alert`, `Badge`, `Button`, `Container`, `Drawer`, `DropdownMenu`, `FocusModal`, `Heading`, `Input`, `Select`, `Table`, `Tabs`, `Text`, `Tooltip`, ...
  - `DataTable`, `useDataTable`, and helpers (from `src/blocks/data-table`)
  - hooks `usePrompt`, `useToggleState`
  - utils `clx`, `toast`
- In the admin, `Toaster` and `TooltipProvider` are already mounted by the dashboard. Call `toast.*` directly and don't render another `Toaster`.
- Style with the preset's semantic classes (`bg-ui-bg-base`, `text-ui-fg-subtle`, `border-ui-border-base`, `txt-compact-small-plus`) rather than raw Tailwind colors so light and dark themes work.
- Standalone projects need Tailwind v3 with `presets: [require("@medusajs/ui-preset")]` and `@medusajs/ui`'s `dist` in `content`.

Docs:
- https://docs.medusajs.com/ui/index.html.md
- https://docs.medusajs.com/ui/installation/medusa-admin-extension.md
- https://docs.medusajs.com/ui/installation/standalone-project.md
- https://docs.medusajs.com/ui/components/data-table.md

## Architecture

- `src/components/<name>/`: `<name>.tsx`, `<name>.spec.tsx`, `<name>.stories.tsx`, `index.ts`. Every public export must be added to `src/index.ts`.
- Conventions (see `button.tsx`):
  - `React.forwardRef` with `displayName`.
  - Variants via `cva`, class merging via `clx` (`clsx` + `tailwind-merge`).
  - Compound components via `Object.assign(Root, { Item, ... })`.
- Path aliases `@/components`, `@/hooks`, `@/utils`, `@/types`, `@/blocks` are rewritten by `tsc-alias` at build time.
- Prop docs on docs.medusajs.com/ui come from the JSDoc in this source:
  - `www/utils/packages/react-docs-generator` (`yarn generate:ui`) reads it into `www/apps/ui/specs/components`.
  - Document props with JSDoc on the destructured parameters, as `Button` does.

## Development

```bash
yarn build             # clean, then tsc + tsc-alias for cjs and esm
yarn typecheck
yarn lint
yarn test              # vitest --run, jsdom, setup-test.ts
yarn test src/components/button/button.spec.tsx
yarn storybook         # port 6006, loads src/main.css
```

## Gotchas

- `CONTRIBUTING.md`: new components from external contributors are not accepted. Propose them in an issue instead.
- Peer deps are `react` / `react-dom` `^18.3.1`. Don't use React 19-only APIs.
- `clx` uses `tailwind-merge`, so a consumer's `className` overrides conflicting variant classes. Pass user `className` last.
- Test config sets `css: false`. Tests can't assert on computed styles, only on class names.
- Changing a component's props or the exports in `src/index.ts` is a public API change for every admin extension. Regenerate the UI docs specs.
