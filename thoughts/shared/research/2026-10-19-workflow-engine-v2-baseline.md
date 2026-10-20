# Workflow engine v2: integration test baseline on develop

Recorded on 2026-10-19 from `develop` at `69d9176929`, in a separate worktree, before any engine changes. Local machine, Postgres 16 and Redis running, `npx jest --maxWorkers=4` in `integration-tests/http` (one run, no sharding).

Milestone 4 compares against this list: a spec that fails here is not a regression unless it fails differently.

## HTTP suite, run 1

- Suites: 122 total, 27 failed
- Tests: 1461 total, 1326 passed, 94 failed, 37 pending

| Spec | Failed tests | First failures |
|---|---|---|
| `auth/admin/mfa.spec.ts` | 4 | MFA HTTP routes enrolls and verifies a TOTP factor; MFA HTTP routes requires an MFA challenge when logging in with an enabled factor |
| `cart/store/cart-tax-data.spec.ts` | 1 | Tax line data field should persist provider data on cart line item tax lines |
| `cart/store/concurrent-promotions.spec.ts` | 1 | Store Carts API: Concurrent promotion requests POST /store/carts/:id/promotions should not create duplicate adjustments when the same promo code is sent concurrently |
| `collection/store/collection.spec.ts` | 5 | /store/collections /store/collections/:id gets collection; /store/collections /store/collections lists collections matching external_id search param |
| `currency/admin/currency.spec.ts` | 2 | GET /admin/currencies should retrieve the currencies; GET /admin/currencies should retrieve the currencies filtered with q param |
| `customer/admin/customer-export.spec.ts` | 3 | POST /admin/customers/export should export a JSON file with the customer's PII and addresses; POST /admin/customers/export should export a CSV file when the format is csv |
| `event-bus/subscriber-registration.spec.ts` | 1 | Event Bus - Server Worker Mode should register subscribers, queue events with subscribers, and skip events without subscribers |
| `feature-flag/resources-with-flags.spec.ts` | 5 | Resources loaded with feature flags should load migration when feature flag is enabled and run job; Resources loaded with feature flags should load workflow when feature flag is enabled |
| `fulfillment/admin/fulfillment-provider.spec.ts` | 2 | Admin: Fulfillment Provider API GET /admin/fulfillment-providers should list all fulfillment providers successfully; Admin: Fulfillment Provider API GET /admin/fulfillment-providers should list all fulfillment providers scoped by stock location |
| `index/index.spec.ts` | 7 | Admin Index API GET /admin/index/details should return index information with metadata; Admin Index API GET /admin/index/details POST /admin/index/sync should trigger sync with default strategy (continue) |
| `order-edits/order-edit-tax-data.spec.ts` | 1 | Order edit tax line data field should persist provider data on tax lines after order edit retax |
| `order/store/order.spec.ts` | 5 | GET /store/orders should successfully list non draft orders; GET /store/orders should throw an error when customer isn't authenticated |
| `payment-collection/admin/payment-collection.spec.ts` | 1 | /admin/payment-collections lists payment collections |
| `payment-collection/store/payment-session-region.spec.ts` | 3 | POST /store/payment-collections/:id/payment-sessions creates a session when the provider is enabled in the cart's region; POST /store/payment-collections/:id/payment-sessions rejects a provider that is not enabled in the cart's region |
| `price-list/admin/price-list.spec.ts` | 0 | Suite failed to run:  |
| `product-category/admin/product-category.spec.ts` | 0 | Suite failed to run:  |
| `product-tag/admin/product-tag.spec.ts` | 3 | GET /admin/product-tags returns a list of product tags; GET /admin/product-tags returns a list of product tags matching free text search param |
| `product-tag/store/product-tag.spec.ts` | 8 | GET /store/product-tags returns a list of product tags; GET /store/product-tags returns a list of product tags matching external_id search param |
| `product-type/admin/product-type.spec.ts` | 4 | /admin/product-types returns a list of product types; /admin/product-types returns a list of product types matching external_id search param |
| `product-type/store/product-type.spec.ts` | 7 | GET /store/product-types returns a list of product types; GET /store/product-types returns a list of product types matching external_id search param |
| `product/admin/product.spec.ts` | 0 | Suite failed to run:  |
| `product/admin/variant.spec.ts` | 0 | Suite failed to run:  |
| `product/store/product.spec.ts` | 0 | Suite failed to run:  |
| `promotions/admin/promotions.spec.ts` | 0 | Suite failed to run:  |
| `refund-reason/refund-reason.spec.ts` | 7 | GET /admin/refund-reasons should list refund reasons and query count; GET /admin/refund-reasons should list refund-reasons with specific query |
| `region/store/region.spec.ts` | 1 | GET /store/regions/:id should list payment providers |
| `search/ingestion.spec.ts` | 3 | built-in search ingestion subscriber indexes a product created over the API, without a reindex; built-in search ingestion subscriber reindexes a product updated over the API |
| `search/search-fallback.spec.ts` | 6 | GET /admin/search (graph fallback) searches unindexed entities and groups the results; GET /admin/search (graph fallback) returns a group with no hits rather than dropping the entity |
| `shipping-option-type/admin/shipping-option-type.spec.ts` | 4 | /admin/shipping-option-types returns a list of shipping option types; /admin/shipping-option-types returns a list of shipping option types matching free text search param |
| `shipping-option/admin/shipping-option.spec.ts` | 0 | Suite failed to run:  |
| `shipping-profile/admin/shipping-profile.spec.ts` | 1 | Admin - Shipping Profiles should test the entire lifecycle of a shipping profile |
| `stock-location/admin/fulfillment-provider.spec.ts` | 2 | POST /admin/stock-locations/:id/fulfillment-providers should add a fulfillment provider to a stock location successfully; POST /admin/stock-locations/:id/fulfillment-providers should detach a fulfillment provider from a stock location successfully |
| `tax-region/admin/tax-region.spec.ts` | 5 | /admin/tax-regions POST /admin/tax-regions/:id should successfully update a tax region's fieleds; /admin/tax-regions POST /admin/tax-regions/:id should create a province tax region without a provider |
| `upload/admin/presigned-urls.spec.ts` | 2 | POST /admin/uploads/presigned-urls should generate a signed URL to upload a file; POST /admin/uploads/presigned-urls should return error when mime type is invalid |
| `user/admin/user.spec.ts` | 0 | Suite failed to run:  |

## Module suite, run 1

- Suites: 110 total, 11 failed
- Tests: 454 total, 438 passed, 10 failed, 6 pending

| Spec | Failed tests | First failures |
|---|---|---|
| `auth/admin/email-password-provider.spec.ts` | 0 | Suite failed to run:  |
| `currency/store/currency.spec.ts` | 1 | Currency - Store should correctly retrieve and list currencies |
| `customer-group/admin/create-customer-group.ts` | 1 | POST /admin/customer-groups should create a customer group |
| `customer-group/admin/delete-customer-group.ts` | 0 | Suite failed to run: ● Test suite failed to run |
| `customer-group/admin/retrieve-customer-group.ts` | 1 | GET /admin/customer-groups/:id should retrieve customer group |
| `customer/admin/delete-customer.ts` | 1 | DELETE /admin/customers/:id should delete a customer |
| `customer/store/create-customer.spec.ts` | 0 | Suite failed to run:  |
| `event-bus/index.spec.ts` | 1 | EventBusModule should emit event with the expected shape to be received by the subscribers |
| `fulfillment-providers/index.spec.ts` | 1 | GET /admin/fulfillment-providers should list all fulfillment providers |
| `invites/list-invites.spec.ts` | 1 | GET /admin/invites should list invites |
| `invites/retrieve-invite.spec.ts` | 1 | GET /admin/invites/:id should retrieve a single invite |
| `price-lists/admin/price-lists.spec.ts` | 0 | Suite failed to run:  |
| `price-lists/store/get-product.ts` | 0 | Suite failed to run:  |
| `users/get-me.spec.ts` | 1 | POST /admin/users/me gets the current user |
| `users/update-user.spec.ts` | 1 | POST /admin/users/:id should update a single user |
