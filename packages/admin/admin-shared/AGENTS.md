# @medusajs/admin-shared

Shared constants, types, and validators for the Admin extension system, used by `@medusajs/admin-sdk`, `@medusajs/admin-vite-plugin`, `@medusajs/admin-bundler`, and `@medusajs/dashboard`. It defines the set of valid injection zones, nested route positions, core layouts, custom-field zones, and virtual module ids.

## Using this package

App code rarely imports it directly. The main reason to use it is TypeScript augmentation in a plugin:

```ts
// my-plugin/index.d.ts (listed in package.json "files" and "exports"."."."types")
declare module "@medusajs/admin-shared" {
  interface InjectionZoneRegistry {
    "brand.details": true
    "brand.details.side": true
    "brand.list": true
  }
  interface LayoutSectionRegistry {
    "my-plugin:three-column": "main" | "left" | "right"
  }
}
```

- `InjectionZoneRegistry` augmentation adds zones to `defineWidgetConfig`'s `zone` autocomplete.
- `LayoutSectionRegistry` augmentation types `LayoutComposer`'s `sections` for a custom layout registered with `defineLayoutConfig`.
- `CORE_LAYOUT_IDS`: `core:single-column`, `core:single-row`, `core:two-column`, `core:settings-sidebar`.

Docs: https://docs.medusajs.com/learn/fundamentals/admin/custom-injection-zones.md

## Architecture

- `src/extensions/widgets/`:
  - `INJECTION_ZONES`: one `LEGACY_*` (`.before` / `.after`) and one current array per entity, spread into a single list.
  - `InjectionZoneRegistry`: an interface built from that list, so plugins can extend it.
  - `isValidInjectionZone`: accepts any string.
- `src/extensions/routes/`: `NESTED_ROUTE_POSITIONS` (`/orders`, `/products`, `/inventory`, `/customers`, `/promotions`, `/price-lists`).
- `src/extensions/layouts/`: `CORE_LAYOUT_IDS`, `LayoutSection` (`ordering`: `list` | `grid` | `horizontal-stretched` | `horizontal-list`), `LayoutSectionRegistry`.
- `src/extensions/custom-fields/`: models, form zones, tabs, and display zones for the experimental custom-fields API. Only `product` is implemented (`product/`).
- `src/virtual-modules/constants.ts`: `virtual:medusa/*` ids and the `VIRTUAL_MODULES` list.
- `src/utils/`: `deepMerge`, `isObject`.

## Development

```bash
yarn build   # tsup
```

No tests in this package. Behavior is covered by `@medusajs/admin-vite-plugin` specs.

## Gotchas

- Adding a zone to a core dashboard page:
  - Add the non-suffixed zone(s) to the entity's `*_INJECTION_ZONES` array and make sure that array is spread into `INJECTION_ZONES`.
  - Update the zone docs under `www/apps/resources/app/commerce-modules/*/admin-widget-zones/`.
- Never add new `.before` / `.after` zones. The layout composer ignores them (`login.before` / `login.after` are the only exception).
- `isValidInjectionZone` returns `true` for unknown strings and only logs a warning, so custom zones work but typos are not rejected at build time.
- Adding a virtual module means updating `VIRTUAL_MODULES` here, `vmod.ts` in `@medusajs/admin-vite-plugin`, and the `external` list in the dashboard's `tsup.config.cjs`.
- Any change to an exported union type is a public API change for `@medusajs/admin-sdk` users.
