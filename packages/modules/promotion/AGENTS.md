# @medusajs/promotion

Commerce module that stores promotions, campaigns, and campaign budgets, and computes the discount adjustments to apply to cart items and shipping methods. Registered as `Modules.PROMOTION` (`"promotion"`).

## Using this package

- Loaded by default through `defineConfig` (`@medusajs/medusa/promotion`); no options, no providers. Only add it to `modules` in `medusa-config.ts` to override it.
- Resolve it in steps, workflows, or routes:

```ts
import { Modules } from "@medusajs/framework/utils"
import type { IPromotionModuleService } from "@medusajs/framework/types"

const promotionModuleService: IPromotionModuleService =
  container.resolve(Modules.PROMOTION)
```

- Prefer the existing workflows in `@medusajs/core-flows` (cart promotion workflows, `registerUsageStep` in `core-flows/src/promotion/steps/register-usage.ts`, whose compensation calls `revertUsage`) over calling the service directly.
- Enums (`PromotionType`, `PromotionStatus`, `ApplicationMethodType`, `ApplicationMethodTargetType`, `ApplicationMethodAllocation`, `CampaignBudgetType`, `ComputedActions`) come from `@medusajs/framework/utils`.

### Data models (`src/models`)

- `Promotion` (`promo_`): `code` (unique among non-deleted), `type` (`standard` | `buyget`), `status` (`draft` | `active` | `inactive`), `is_automatic`, `is_tax_inclusive`, `limit` / `used`, `campaign`, `application_method`, `rules`.
- `ApplicationMethod` (`proappmet_`): `value`, `currency_code`, `type`, `target_type` (`order` | `items` | `shipping_methods`), `allocation` (`each` | `across` | `once`), `max_quantity`, `apply_to_quantity`, `buy_rules_min_quantity`, `target_rules`, `buy_rules`.
- `PromotionRule` (`prorul_`) + `PromotionRuleValue` (`prorulval_`): `attribute`, `operator`, `values`. Shared by promotion rules, target rules, and buy rules.
- `Campaign` (`procamp_`), `CampaignBudget` (`probudg_`, type `spend` | `usage` | `use_by_attribute` | `spend_by_attribute`), `CampaignBudgetUsage` (`probudgus_`, per-attribute-value usage).

### Service methods (`src/services/promotion-module.ts`)

Generated CRUD for every model above, plus custom methods:

- `computeActions(codes, context, { prevent_auto_promotions, skip_usage_limit_checks })`: returns `addItemAdjustment`, `addShippingMethodAdjustment`, `remove*Adjustment`, `campaignBudgetExceeded`, `promotionLimitExceeded` actions. Automatic promotions are included unless `prevent_auto_promotions` is set.
- `registerUsage(computedActions, registrationContext)` / `revertUsage(...)`: increment/decrement `promotion.used` and campaign budget usage.
- `listActivePromotions(filters, config)`: `status: active` and campaign within `starts_at` / `ends_at`.
- Overridden `createPromotions`, `updatePromotions`, `createCampaigns`, `updateCampaigns` (nested application method, rules, budget).
- Rules: `addPromotionRules`, `addPromotionTargetRules`, `addPromotionBuyRules`, `updatePromotionRules`, `removePromotionRules`, `removePromotionTargetRules`, `removePromotionBuyRules`.
- Campaigns: `addPromotionsToCampaign`, `removePromotionsFromCampaign`.

### Events and links

- Emits the module's internal CRUD events (`promotion.<model>.created|updated|deleted|restored`) through `MedusaService`.
- Module links (`packages/modules/link-modules/src/definitions`): `cart-promotion` (`cart_promotion`), `order-promotion` (`order_promotion`), and read-only `line-item-adjustment-promotion`.

Docs: https://docs.medusajs.com/resources/commerce-modules/promotion.md, https://docs.medusajs.com/resources/commerce-modules/promotion/actions.md, https://docs.medusajs.com/resources/commerce-modules/promotion/campaign.md, https://docs.medusajs.com/resources/commerce-modules/promotion/application-method.md

## Architecture

- `src/utils/compute-actions/`: `line-items.ts`, `shipping-methods.ts`, `buy-get.ts`, `usage.ts`, `sort-by-price.ts`. `buyget` promotions are applied before `standard` (`sortByBuyGetType`); each promotion discounts the amount remaining after earlier promotions in the same call.
- `build-promotion-rule-query-filter-from-context.ts` pre-filters automatic promotions in SQL from the context before rules are evaluated in memory.
- `src/utils/validations/`: application method and rule validation (`validateApplicationMethodAttributes`, `validatePromotionRuleAttributes`, `areRulesValidForContext`, `evaluateRuleValueCondition`).

## Development

```bash
cd packages/modules/promotion
yarn build
yarn test                       # unit tests under src
yarn test:integration           # integration-tests/__tests__ (needs Postgres, DB_* env vars)
yarn test:integration integration-tests/__tests__/services/promotion-module/compute-actions.spec.ts
yarn migration:create           # after any change in src/models
```

- Integration tests: `integration-tests/__tests__/services/promotion-module/` (`compute-actions`, `register-usage`, `revert-usage`, `campaign`, `promotion`), fixtures in `integration-tests/__fixtures__/`. They use `moduleIntegrationTestRunner` from `@medusajs/test-utils`.

## Gotchas

- `registerUsage` must run inside a transaction: it takes `SELECT ... FOR UPDATE` locks on `promotion` and `promotion_campaign_budget` rows (ordered by id, `lock_timeout = '3s'`) and throws `UNEXPECTED_STATE` otherwise. Re-reads use `options: { refresh: true }`; keep that when touching this code.
- Exceeding `promotion.limit` or a budget limit in `registerUsage` throws `NOT_ALLOWED`; `computeActions` instead returns `promotionLimitExceeded` / `campaignBudgetExceeded` actions unless `skip_usage_limit_checks` is set.
- `use_by_attribute` budgets require the budget `attribute` value (e.g. `customer_id`) in the compute context, otherwise `computeActions` throws `INVALID_DATA`.
- Rule attributes for target rules are prefixed by scope (`items.` / `shipping_methods.`); the prefix is stripped before evaluating against the item or shipping method.
- `buyget` promotions require `apply_to_quantity`, `buy_rules_min_quantity`, and `max_quantity >= apply_to_quantity`; `max_quantity` is not allowed with `across` allocation; percentage values must be 0-100.
