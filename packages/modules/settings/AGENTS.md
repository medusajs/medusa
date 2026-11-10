# @medusajs/settings

Commerce module that stores admin UI settings: data table view configurations, admin layout configurations, per-user preferences, and custom property labels. It also discovers entities from module joiner configs to generate admin table columns. Registered as `Modules.SETTINGS` (`"settings"`).

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/settings`). No providers.
- The `/admin/views/[entity]/...` routes are gated by the `view_configurations` feature flag (`MEDUSA_FF_VIEW_CONFIGURATIONS`, default `false`); `/admin/layouts/configurations` is not. The module itself always loads.
- Only option: `entityOverrides` (`SettingsModuleOptions` in `src/types/index.ts`), merged into the built-in override registry at construction:

```ts
module.exports = defineConfig({
  modules: [
    {
      resolve: "@medusajs/medusa/settings",
      options: {
        entityOverrides: {
          Brand: {
            defaultVisibleFields: ["name", "products_count"],
            defaultFieldOrdering: { name: 100 },
            computedColumns: [
              {
                id: "products_count",
                name: "Product Count",
                renderMode: "count",
                requiredFields: ["products"],
              },
            ],
          },
        },
      },
    },
  ],
})
```

- Resolve with `container.resolve(Modules.SETTINGS)`, typed `SettingsTypes.ISettingsModuleService` from `@medusajs/framework/types`.
- The package also exports its column utilities (`src/utils`: entity discovery, overrides, computed columns, render modes, filter rules).

### Data models (`src/models`)

- `ViewConfiguration` (`vconf_`): `entity`, `name`, `user_id` (null for system defaults), `is_system_default`, `configuration` JSON (`visible_columns`, `column_order`, `column_widths`, `filters`, `sorting`, `search`).
- `LayoutConfiguration` (`lyconf_`): `zone`, `user_id`, `is_system_default`, `configuration`. Unique `(zone, user_id)` plus at most one system default per zone (partial unique index).
- `UserPreference` (`usrpref_`): `user_id`, `key`, `value` JSON, unique `(user_id, key)`.
- `PropertyLabel` (`plbl_`): `entity`, `property`, `label` and `description` (translatable), unique `(entity, property)`.

### Service methods (`src/services/settings-module-service.ts`)

Generated CRUD for all four models, plus:

- Views: overridden `createViewConfigurations` / `updateViewConfigurations`, `getActiveViewConfiguration(entity, userId)`, `setActiveViewConfiguration(entity, userId, id)`, `clearActiveViewConfiguration`, `getSystemDefaultViewConfiguration(entity)`.
- Layouts: `setLayoutConfiguration(zone, userId, ...)`, `setSystemDefaultLayoutConfiguration(zone, ...)`, `getSystemDefaultLayoutConfiguration(zone)`, `clearLayoutConfiguration`, `getActiveLayoutScope` / `setActiveLayoutScope` (`"personal" | "default" | null`).
- Preferences: `getUserPreference(userId, key)`, `setUserPreference(userId, key, value)`.
- Columns: `upsertPropertyLabels`, `listDiscoverableEntities`, `generateEntityColumns(entityKey)`, `hasEntity`, `isEntityDiscoveryInitialized`.

### Events and links

- Emits internal CRUD events (`settings.<model>.created|updated|deleted|restored`) through `MedusaService`.
- No module links; `user_id` is a plain text column, not a link to the User Module.

Docs: https://docs.medusajs.com/resources/commerce-modules/settings.md, https://docs.medusajs.com/resources/commerce-modules/settings/view-configurations.md, https://docs.medusajs.com/resources/commerce-modules/settings/configure-view-configurations.md, https://docs.medusajs.com/resources/commerce-modules/settings/layout-configurations.md

## Architecture

- Entity discovery is initialized in `__hooks.onApplicationStart` from `MedusaModule.getAllJoinerConfigs()`. Before that, `listDiscoverableEntities` returns `[]` and `generateEntityColumns` returns `null`.
- Active view and layout scope are stored as user preferences under keys `active_view.<entity>` and `active_layout.<zone>`.
- Source imports use the `@/models`, `@/services` tsconfig aliases, unlike the `@models` form other modules use.

## Development

```bash
cd packages/modules/settings
yarn build
yarn test
yarn test:integration           # integration-tests/__tests__ (needs Postgres, DB_* env vars)
yarn migration:create           # after any change in src/models
```

- Integration tests: `settings-module.spec.ts`, `entity-discovery.spec.ts`, `property-labels.spec.ts`; joiner-config fixtures in `integration-tests/__fixtures__/`.

## Gotchas

- Updating a view's `configuration` replaces the whole JSON (via `upsertWithReplace`); missing keys reset to defaults (`[]`, `{}`, `null`, `""`). Send the full configuration.
- A system default view cannot have a `user_id` (`INVALID_DATA`), and only one system default per entity is allowed (`DUPLICATE_ERROR`).
- `setActiveViewConfiguration` throws if the view belongs to another entity or to another user.
- `getActiveViewConfiguration` falls back from the stored preference, to the user's oldest personal view, to the system default. A stored `viewConfigurationId: null` skips the personal-view fallback.
