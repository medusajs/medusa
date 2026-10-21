# @medusajs/draft-order

An official Medusa plugin that adds the Draft Orders UI to the Medusa Admin (Orders > Drafts). It is admin-only: there are no API routes, workflows, or modules in `src/`. The backend lives in core: `packages/medusa/src/api/admin/draft-orders`, `packages/core/core-flows/src/draft-order`, and `sdk.admin.draftOrder` in `packages/core/js-sdk/src/admin/draft-order.ts`.

## Using this package

- Nothing to install or configure. `@medusajs/medusa` depends on it, and `defineConfig` (`packages/core/utils/src/common/define-config.ts`) always adds `{ resolve: "@medusajs/draft-order", options: {} }` to `plugins`.
- To change its entry, list it yourself in `medusa-config.ts`; user entries replace the default by `resolve` key:

```ts
module.exports = defineConfig({
  plugins: [{ resolve: "@medusajs/draft-order", options: {} }],
})
```

- The plugin takes no options.
- Custom draft-order logic belongs in core workflows/routes (or your app's own routes), not here.
- Docs: https://docs.medusajs.com/resources/commerce-modules/order/draft-orders.md

## Architecture

- `src/admin/routes/draft-orders/`: list page (`page.tsx`, `defineRouteConfig({ label: "Drafts", nested: "/orders" })`), `@create` modal, and `[id]` detail with parallel `@<section>` routes (items, shipping, addresses, promotions, email, metadata, sales-channel, transfer-ownership, custom-items).
- `src/admin/hooks/api/`: React Query hooks wrapping `sdk.admin.*` calls; `draft-orders.tsx` covers the edit flow (`beginEdit`, `requestEdit`, `cancelEdit`, `convertToOrder`, action-item updates).
- `src/admin/lib/queries/sdk.ts`: JS SDK client configured from the admin build globals `__BACKEND_URL__`, `__AUTH_TYPE__`, `__JWT_TOKEN_STORAGE_KEY__` (declared in `src/admin/vite-env.d.ts`).
- `src/admin/components/`: local copies of dashboard UI primitives (modals, forms, data table). Layout comes from `@medusajs/dashboard/components`.
- `src/types/http/`: local HTTP types for draft orders and orders used by the admin code.
- `src/index.ts` and `index.d.ts` are intentional no-ops for the TypeScript compiler.

## Development

```bash
yarn build:plugin          # medusa plugin:build -> .medusa/server (the only published dir)
yarn dev                   # medusa plugin:develop (watch + publish to local registry)
```

- There is no unit test setup. Draft-order behaviour is covered by HTTP integration tests in `integration-tests/http/__tests__/draft-order/admin/`, which exercise the core routes.
- Root `yarn build` runs `build:plugin` through turbo, after `@medusajs/medusa#build`.
- Plugin docs: https://docs.medusajs.com/learn/fundamentals/plugins.md

## Gotchas

- Don't add `@medusajs/medusa` as a dependency: it already depends on this package. `@medusajs/cli` detects plugin projects through the `@medusajs/cli` devDependency instead.
- `tsconfig.json` excludes `src/admin`; admin code is type-checked with `src/admin/tsconfig.json` (bundler resolution, `noEmit`, strict) and bundled by `plugin:build`.
- Tailwind scans only `./src/admin/**/*.{ts,tsx}` with the `@medusajs/ui-preset` preset.
- The `exports` map lists `./workflows`, `./modules/*` and `./providers/*` from the plugin template, but none exist in `src/`. Only `./admin` resolves to real code.
- A UI change that needs new backend behaviour usually means changing the core route, workflow, JS SDK method and `HttpTypes` together, and adding changesets for those packages too.
