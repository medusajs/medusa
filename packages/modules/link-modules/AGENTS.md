# @medusajs/link-modules

Link Modules (`Modules.LINK` = `"link_modules"`): defines Medusa's built-in module links (the pivot tables and read-only relations between commerce modules) and turns every link definition, core or app-level, into a small generated "link module" with its own table and service.

## Using this package

- Applications never register it. `MedusaApp` (`packages/core/modules-sdk/src/medusa-app.ts`, `initializeLinks`) dynamically imports `@medusajs/medusa/link-modules` and calls `initialize(config, linkModules, ...)`, where `linkModules` = core definitions plus every `defineLink` from the app and plugins (`MedusaModule.getCustomLinks()`).
- Work with links through `ContainerRegistrationKeys.LINK` (`link.create/dismiss/delete/restore`) and Query, not through this package. Workflows: `createRemoteLinkStep` / `dismissRemoteLinkStep` in `@medusajs/core-flows`.
- Link tables are created by `npx medusa db:migrate` (unless `--skip-links`) or `npx medusa db:sync-links` (`--execute-safe`, `--execute-all`), not by MikroORM migrations.

Docs: https://docs.medusajs.com/learn/fundamentals/module-links.md, https://docs.medusajs.com/learn/fundamentals/module-links/link.md, https://docs.medusajs.com/learn/fundamentals/module-links/custom-columns.md, https://docs.medusajs.com/learn/fundamentals/module-links/read-only.md

## Built-in links vs app-level `defineLink`

Core links live in `src/definitions/*.ts` as raw `ModuleJoinerConfig` objects (`isLink: true`), exported from `src/definitions/index.ts`:

```ts
export const ProductVariantInventoryItem: ModuleJoinerConfig = {
  serviceName: LINKS.ProductVariantInventoryItem,
  isLink: true,
  databaseConfig: {
    tableName: "product_variant_inventory_item",
    idPrefix: "pvitem",
    extraFields: { required_quantity: { type: "decimal", defaultValue: "1" } },
  },
  primaryKeys: ["id", "variant_id", "inventory_item_id"],
  relationships: [/* exactly 2: { serviceName, entity, primaryKey, foreignKey, alias, args } */],
  extends: [/* adds `inventory_items` to ProductVariant, `variant_link` to InventoryItem */],
}
```

- Hand-written: explicit `tableName` (e.g. `product_variant_price_set`), `idPrefix`, `alias`, `fieldAlias` shortcuts (e.g. `variant.inventory` -> `inventory_items.inventory`), `deleteCascade`, `isList`. `serviceName` comes from the `LINKS` map in `packages/core/utils/src/link/links.ts`.
- `defineLink(a, b, options)` (`packages/core/utils/src/modules-sdk/define-link.ts`) generates the same `ModuleJoinerConfig` from data model references: `serviceName` = `composeLinkName(...)`, table name from `composeTableName(moduleA, keyA, moduleB, keyB)`, entry point `<aliasA>_<aliasB>`, validation of primary keys, plus `database.extraColumns`, `filterable` (Index Module) and `readOnly`. Both feed into the same `initialize()`.
- Read-only links (`src/definitions/readonly/`, `isReadOnlyLink: true`) have no table: they only `extends` an entity with a relation resolved through an existing foreign key column (e.g. `OrderLineItem.product_id` -> `Product`, `Cart.region_id` -> `Region`, `Store.currency_code` -> `Currency`).

Pivot tables defined here: `cart_payment_collection`, `cart_promotion`, `customer_account_holder`, `location_fulfillment_provider`, `location_fulfillment_set`, `invite_rbac_role`, `user_rbac_role`, `order_cart`, `order_fulfillment`, `order_payment_collection`, `order_promotion`, `return_fulfillment`, `product_sales_channel`, `product_shipping_profile`, `product_variant_inventory_item`, `product_variant_price_set`, `publishable_api_key_sales_channel`, `region_payment_provider`, `sales_channel_stock_location`, `shipping_option_price_set`.

## Architecture

- `src/initialize/index.ts` `initialize()`: for each definition, validates exactly 2 relationships (non-read-only), non-composite foreign key, `extraDataFields` present in `databaseConfig.extraFields`; skips the link if either module is not loaded (read-only links keep only extensions whose modules are loaded); builds a GraphQL schema (`src/utils/generate-schema.ts`) and boots it via `MedusaModule.bootstrapLink` with an EVENT_BUS dependency. Read-only links are keyed by a hash of `extends`.
- `src/utils/generate-entity.ts`: MikroORM `EntitySchema` per link: composite PK on the two foreign keys, `id`, extra fields, `created_at`/`updated_at`/`deleted_at`, partial indexes `WHERE deleted_at IS NULL`.
- `src/services/link-module-service.ts` (`getModuleService`): `list/listAndCount/retrieve/create/dismiss/delete/softDelete/restore`; emits `<entityName>.attached` on create/restore and `<entityName>.detached` on dismiss/delete/softDelete.
- `src/migration/index.ts` `MigrationsExecutionPlanner`: tracks tables in `link_module_migrations`, plans `create` / `update` / `delete` / `noop` / `notify` per link, renames tables whose name changed for the same from/to models, and runs under Postgres advisory locks.

## Development

```bash
cd packages/modules/link-modules
yarn build
yarn test                    # src/migration/__tests__
yarn test:integration        # needs Postgres
../../../node_modules/.bin/jest integration-tests/__tests__/migrations.spec.ts
```

- No `migration:create` script and no models: schema changes come from editing a definition, applied by `db:sync-links`.
- Integration tests: `integration-tests/__tests__/migrations.spec.ts`, `rename-migration.spec.ts`.
- New core link: add the file in `src/definitions/`, add a `LINKS` entry in `packages/core/utils/src/link/links.ts`, and export it from `src/definitions/index.ts`.

## Gotchas

- A definition that is not exported from `src/definitions/index.ts` is never loaded. `order-claim-payment-collection.ts` and `order-exchange-payment-collection.ts` currently exist but are not exported.
- Any SQL diff containing `alter column` or `drop column` becomes a `notify` action and is never applied automatically; `executePlan` skips `noop` and `notify` unless the action is changed to `update` (`db:sync-links --execute-all` does that).
- Removing a link definition plans a `delete` (DROP TABLE) for its tracked table: `db:sync-links` prompts for it, `--execute-all` drops it, `--execute-safe` skips it.
- `initialize()` errors are caught in `MedusaApp` and only logged as "Error initializing link modules."; `remoteLink` is then undefined.
- Duplicate service keys throw "Link module ... already defined."
