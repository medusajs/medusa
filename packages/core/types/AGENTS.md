# @medusajs/types

Type-only package with the TypeScript contracts for all of Medusa: module service interfaces (`I<Name>ModuleService`), DTOs, provider interfaces, `medusa-config` types, DAL/DML types, workflow types, and the `HttpTypes` request/response shapes shared by the API routes, JS SDK, and admin dashboard. Consumers import it as `@medusajs/framework/types`.

## Using this package

```ts
import type {
  HttpTypes,
  IProductModuleService,
  MedusaContainer,
  ProductDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

const productModule: IProductModuleService = container.resolve(Modules.PRODUCT)

function toCard(product: HttpTypes.StoreProduct) {
  return { id: product.id, title: product.title }
}
```

- Storefronts and admin extensions that only need HTTP shapes can import `HttpTypes` from `@medusajs/types` directly (no runtime cost).
- Namespaced bundles (`src/bundles.ts`): `HttpTypes`, `ProductTypes`, `OrderTypes`, `CartTypes`, `PricingTypes`, `ModulesSdkTypes`, `DAL`, `DmlTypes`, `SearchTypes`, `WorkflowsSdkTypes`, ...
- Provider contracts to implement for custom providers live here (e.g. `IPaymentProvider` in `payment/provider.ts`, `ITaxProvider` in `tax/provider.ts`, `ILockingProvider` in `locking/index.ts`, `ICachingProviderService` in `caching/index.ts`, `AuthMfaProvider` in `auth/mfa-provider.ts`).
- Typed module options in `defineConfig`: modules augment `ModuleOptions` keyed by their `resolve` string:

```ts
declare module "@medusajs/types" {
  interface ModuleOptions {
    "@medusajs/medusa/file": FileModuleOptions
  }
}
```

- Docs: https://docs.medusajs.com/learn/fundamentals/modules/service-constraints.md, https://docs.medusajs.com/learn/configurations/medusa-config.md

## Architecture

- Domain folders (`product/`, `order/`, `cart/`, ...) follow `common.ts` (DTOs + filterable props), `mutations.ts` (create/update inputs), `service.ts` (`I<Name>ModuleService`), `workflows.ts` (workflow input types), plus `provider.ts` where the module has providers.
- `src/http/<resource>/{admin,store}/` split into `entities.ts`, `payloads.ts`, `queries.ts`, `responses.ts`; shared shapes go in `src/http/<resource>/common.ts`. Some folders spell it `entitites.ts` (e.g. `http/product/admin/`); match the existing file name instead of creating a second one.
- `src/common/config-module.ts`: `ConfigModule`, `ProjectConfigOptions`, `AdminOptions`, `InputConfig`, `ModuleOptions`.
- `src/common/medusa-container.ts`: `MedusaContainer` and the empty `ModuleImplementations` interface, augmented in `packages/core/framework/src/types/container.ts` with `Modules.*` -> service interface.
- `src/modules-sdk/remote-query-entry-points.ts`: empty `RemoteQueryEntryPoints`, filled per project by generated `.medusa/types/query-entry-points` to type `query.graph`.

## Development

```bash
yarn build                                  # rimraf dist && tsc --build
yarn watch
```

- `yarn test` is `exit 0`: there are no tests. Validate changes by building this package and its dependents (`@medusajs/utils`, `@medusajs/framework`, `@medusajs/js-sdk`, the module whose types changed).
- TSDoc here is the source for generated reference docs (`www/apps/resources` references); follow the `writing-tsdocs` skill when adding or editing exported types.

## Gotchas

- Runtime dependency is only `bignumber.js`; `@medusajs/deps` is a dev dependency used with `import type`. Do not import from `@medusajs/utils`, `@medusajs/framework`, or any module package here (they depend on this package). The `@medusajs/framework/*` imports you see are inside TSDoc examples only.
- `vite` and `ioredis` are peer dependencies used for type imports only. `config-module.ts` has a `@ts-ignore` on the `vite` import because this CommonJS build can't resolve Vite's ESM-only types; `InlineConfig` degrades to `any`. Leave it.
- Interfaces meant to be augmented (`ModuleOptions`, `ModuleImplementations`, `RemoteQueryEntryPoints`) must stay `interface` (not `type`) and stay exported from the package root, or declaration merging silently stops working. `@medusajs/framework/types` re-declares `ModuleOptions` so augmentation also works through the framework path.
- Changing an `I<Name>ModuleService` signature is a public API change: the module's service in `packages/modules/<name>` must still satisfy it, and `HttpTypes` changes ripple into `@medusajs/js-sdk` and the admin dashboard.
