# Change Log

## 2.13.3

### Patch Changes

- Updated dependencies [[`dbaae9630d26a0806751d5614beadef3e0b4bf07`](https://github.com/medusajs/medusa/commit/dbaae9630d26a0806751d5614beadef3e0b4bf07), [`5ccd523b41efaae2f2aaa6d5833b5ce88558d37b`](https://github.com/medusajs/medusa/commit/5ccd523b41efaae2f2aaa6d5833b5ce88558d37b)]:
  - @medusajs/framework@2.13.3
  - @medusajs/core-flows@2.13.3
  - @medusajs/analytics@2.13.3
  - @medusajs/api-key@2.13.3
  - @medusajs/auth@2.13.3
  - @medusajs/cache-inmemory@2.13.3
  - @medusajs/cache-redis@2.13.3
  - @medusajs/caching@2.13.3
  - @medusajs/cart@2.13.3
  - @medusajs/currency@2.13.3
  - @medusajs/customer@2.13.3
  - @medusajs/event-bus-local@2.13.3
  - @medusajs/event-bus-redis@2.13.3
  - @medusajs/file@2.13.3
  - @medusajs/fulfillment@2.13.3
  - @medusajs/index@2.13.3
  - @medusajs/inventory@2.13.3
  - @medusajs/link-modules@2.13.3
  - @medusajs/locking@2.13.3
  - @medusajs/notification@2.13.3
  - @medusajs/order@2.13.3
  - @medusajs/payment@2.13.3
  - @medusajs/pricing@2.13.3
  - @medusajs/product@2.13.3
  - @medusajs/promotion@2.13.3
  - @medusajs/analytics-local@2.13.3
  - @medusajs/analytics-posthog@2.13.3
  - @medusajs/auth-emailpass@2.13.3
  - @medusajs/auth-github@2.13.3
  - @medusajs/auth-google@2.13.3
  - @medusajs/caching-redis@2.13.3
  - @medusajs/file-local@2.13.3
  - @medusajs/file-s3@2.13.3
  - @medusajs/fulfillment-manual@2.13.3
  - @medusajs/locking-postgres@2.13.3
  - @medusajs/locking-redis@2.13.3
  - @medusajs/notification-local@2.13.3
  - @medusajs/notification-sendgrid@2.13.3
  - @medusajs/payment-stripe@2.13.3
  - @medusajs/rbac@2.13.3
  - @medusajs/region@2.13.3
  - @medusajs/sales-channel@2.13.3
  - @medusajs/settings@2.13.3
  - @medusajs/stock-location@2.13.3
  - @medusajs/store@2.13.3
  - @medusajs/tax@2.13.3
  - @medusajs/translation@2.13.3
  - @medusajs/user@2.13.3
  - @medusajs/workflow-engine-inmemory@2.13.3
  - @medusajs/workflow-engine-redis@2.13.3
  - @medusajs/draft-order@2.13.3
  - @medusajs/admin-bundler@2.13.3
  - @medusajs/telemetry@2.13.3

## 2.13.2

### Patch Changes

- [#14660](https://github.com/medusajs/medusa/pull/14660) [`05262c0197bcc3c9cec89a3d95863916dba47af3`](https://github.com/medusajs/medusa/commit/05262c0197bcc3c9cec89a3d95863916dba47af3) Thanks [@Fadyy22](https://github.com/Fadyy22)! - chore(core-flows,medusa): Pass `created_by` to `createOrderShipmentWorkflow` in create order shipment admin endpoint and pass `marked_shipped_by` to `createShipmentWorkflow`

- [#14146](https://github.com/medusajs/medusa/pull/14146) [`d2ce360875bafc3fc0c367384b9b631e77130726`](https://github.com/medusajs/medusa/commit/d2ce360875bafc3fc0c367384b9b631e77130726) Thanks [@adevinwild](https://github.com/adevinwild)! - Introduce filtering orders by total price on the API and Admin UI

- [#14557](https://github.com/medusajs/medusa/pull/14557) [`42322f44eaaf997e9ab7af2ca1e8621a08a8ca01`](https://github.com/medusajs/medusa/commit/42322f44eaaf997e9ab7af2ca1e8621a08a8ca01) Thanks [@bouazzaayyoub](https://github.com/bouazzaayyoub)! - feat(medusa,types): add metadata field to AdminUpsertStockLocationAddress and validators

- [#14053](https://github.com/medusajs/medusa/pull/14053) [`074a3ea05f2b86ce72a5e668a7616768e81293dd`](https://github.com/medusajs/medusa/commit/074a3ea05f2b86ce72a5e668a7616768e81293dd) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(medusa): resolve user_id from user linked to secret key on draft order edit with api-key auth

- [#14676](https://github.com/medusajs/medusa/pull/14676) [`1b5e5739b1d553d230b5602092f4c809479cf572`](https://github.com/medusajs/medusa/commit/1b5e5739b1d553d230b5602092f4c809479cf572) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(medusa): add role users endpoint

- [#14663](https://github.com/medusajs/medusa/pull/14663) [`dc2b87810254ccabd382ececca0ae771cb9e64be`](https://github.com/medusajs/medusa/commit/dc2b87810254ccabd382ececca0ae771cb9e64be) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(medusa): admin list policies

- Updated dependencies [[`05262c0197bcc3c9cec89a3d95863916dba47af3`](https://github.com/medusajs/medusa/commit/05262c0197bcc3c9cec89a3d95863916dba47af3), [`f37f029799cad7ee0337aeab625df5e272de2363`](https://github.com/medusajs/medusa/commit/f37f029799cad7ee0337aeab625df5e272de2363), [`ff80a437e3fed60a48698c21b2cb325cd75b1f07`](https://github.com/medusajs/medusa/commit/ff80a437e3fed60a48698c21b2cb325cd75b1f07), [`09a80ab97aad62b65320c745899eb8517d256b40`](https://github.com/medusajs/medusa/commit/09a80ab97aad62b65320c745899eb8517d256b40), [`29d3dee13700d36a70aa55b8f2a01a5cbc0b42d0`](https://github.com/medusajs/medusa/commit/29d3dee13700d36a70aa55b8f2a01a5cbc0b42d0), [`7aca778ae56069371f5d26a757d3b2276d524776`](https://github.com/medusajs/medusa/commit/7aca778ae56069371f5d26a757d3b2276d524776), [`7a27e8ad8d7771eeecd1fb648a458f56abab71f9`](https://github.com/medusajs/medusa/commit/7a27e8ad8d7771eeecd1fb648a458f56abab71f9), [`77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8`](https://github.com/medusajs/medusa/commit/77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8), [`ec8f2566aa2547921f68d5aeba8d11ec4bcea9a2`](https://github.com/medusajs/medusa/commit/ec8f2566aa2547921f68d5aeba8d11ec4bcea9a2), [`fe529f214a789b7e94fd0438c631d9f6b5cf5290`](https://github.com/medusajs/medusa/commit/fe529f214a789b7e94fd0438c631d9f6b5cf5290), [`63b7d5f1bee265959db73236c509dc7c9d0c1525`](https://github.com/medusajs/medusa/commit/63b7d5f1bee265959db73236c509dc7c9d0c1525), [`2b795b6cc1ca1b0787f014784c9cbf06d6ab6e96`](https://github.com/medusajs/medusa/commit/2b795b6cc1ca1b0787f014784c9cbf06d6ab6e96)]:
  - @medusajs/core-flows@2.13.2
  - @medusajs/admin-bundler@2.13.2
  - @medusajs/payment-stripe@2.13.2
  - @medusajs/order@2.13.2
  - @medusajs/framework@2.13.2
  - @medusajs/event-bus-redis@2.13.2
  - @medusajs/draft-order@2.13.2
  - @medusajs/analytics@2.13.2
  - @medusajs/api-key@2.13.2
  - @medusajs/auth@2.13.2
  - @medusajs/cache-inmemory@2.13.2
  - @medusajs/cache-redis@2.13.2
  - @medusajs/caching@2.13.2
  - @medusajs/cart@2.13.2
  - @medusajs/currency@2.13.2
  - @medusajs/customer@2.13.2
  - @medusajs/event-bus-local@2.13.2
  - @medusajs/file@2.13.2
  - @medusajs/fulfillment@2.13.2
  - @medusajs/index@2.13.2
  - @medusajs/inventory@2.13.2
  - @medusajs/link-modules@2.13.2
  - @medusajs/locking@2.13.2
  - @medusajs/notification@2.13.2
  - @medusajs/payment@2.13.2
  - @medusajs/pricing@2.13.2
  - @medusajs/product@2.13.2
  - @medusajs/promotion@2.13.2
  - @medusajs/analytics-local@2.13.2
  - @medusajs/analytics-posthog@2.13.2
  - @medusajs/auth-emailpass@2.13.2
  - @medusajs/auth-github@2.13.2
  - @medusajs/auth-google@2.13.2
  - @medusajs/caching-redis@2.13.2
  - @medusajs/file-local@2.13.2
  - @medusajs/file-s3@2.13.2
  - @medusajs/fulfillment-manual@2.13.2
  - @medusajs/locking-postgres@2.13.2
  - @medusajs/locking-redis@2.13.2
  - @medusajs/notification-local@2.13.2
  - @medusajs/notification-sendgrid@2.13.2
  - @medusajs/rbac@2.13.2
  - @medusajs/region@2.13.2
  - @medusajs/sales-channel@2.13.2
  - @medusajs/settings@2.13.2
  - @medusajs/stock-location@2.13.2
  - @medusajs/store@2.13.2
  - @medusajs/tax@2.13.2
  - @medusajs/translation@2.13.2
  - @medusajs/user@2.13.2
  - @medusajs/workflow-engine-inmemory@2.13.2
  - @medusajs/workflow-engine-redis@2.13.2
  - @medusajs/telemetry@2.13.2

## 2.13.1

### Patch Changes

- [#14612](https://github.com/medusajs/medusa/pull/14612) [`de08ea732b599374a071c016fa8af2e4f3e31075`](https://github.com/medusajs/medusa/commit/de08ea732b599374a071c016fa8af2e4f3e31075) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa): use http type for batch translation settings request

- Updated dependencies [[`4021571067d33fdd415456fc538ee0035ccd0753`](https://github.com/medusajs/medusa/commit/4021571067d33fdd415456fc538ee0035ccd0753), [`2e2fad6c62a51373f97adcd06941f9182657d9d0`](https://github.com/medusajs/medusa/commit/2e2fad6c62a51373f97adcd06941f9182657d9d0)]:
  - @medusajs/order@2.13.1
  - @medusajs/core-flows@2.13.1
  - @medusajs/analytics@2.13.1
  - @medusajs/api-key@2.13.1
  - @medusajs/auth@2.13.1
  - @medusajs/caching@2.13.1
  - @medusajs/cart@2.13.1
  - @medusajs/currency@2.13.1
  - @medusajs/customer@2.13.1
  - @medusajs/file@2.13.1
  - @medusajs/fulfillment@2.13.1
  - @medusajs/index@2.13.1
  - @medusajs/inventory@2.13.1
  - @medusajs/link-modules@2.13.1
  - @medusajs/locking@2.13.1
  - @medusajs/notification@2.13.1
  - @medusajs/payment@2.13.1
  - @medusajs/pricing@2.13.1
  - @medusajs/product@2.13.1
  - @medusajs/promotion@2.13.1
  - @medusajs/region@2.13.1
  - @medusajs/sales-channel@2.13.1
  - @medusajs/settings@2.13.1
  - @medusajs/stock-location@2.13.1
  - @medusajs/store@2.13.1
  - @medusajs/tax@2.13.1
  - @medusajs/translation@2.13.1
  - @medusajs/user@2.13.1
  - @medusajs/workflow-engine-inmemory@2.13.1
  - @medusajs/workflow-engine-redis@2.13.1
  - @medusajs/draft-order@2.13.1
  - @medusajs/admin-bundler@2.13.1
  - @medusajs/framework@2.13.1
  - @medusajs/telemetry@2.13.1
  - @medusajs/cache-inmemory@2.13.1
  - @medusajs/cache-redis@2.13.1
  - @medusajs/event-bus-local@2.13.1
  - @medusajs/event-bus-redis@2.13.1
  - @medusajs/analytics-local@2.13.1
  - @medusajs/analytics-posthog@2.13.1
  - @medusajs/auth-emailpass@2.13.1
  - @medusajs/auth-github@2.13.1
  - @medusajs/auth-google@2.13.1
  - @medusajs/caching-redis@2.13.1
  - @medusajs/file-local@2.13.1
  - @medusajs/file-s3@2.13.1
  - @medusajs/fulfillment-manual@2.13.1
  - @medusajs/locking-postgres@2.13.1
  - @medusajs/locking-redis@2.13.1
  - @medusajs/notification-local@2.13.1
  - @medusajs/notification-sendgrid@2.13.1
  - @medusajs/payment-stripe@2.13.1

## 2.13.0

### Minor Changes

- [`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor bump

### Patch Changes

- Updated dependencies [[`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7), [`4a33c44f79808a3b5b907e2b053427d2ba6d7015`](https://github.com/medusajs/medusa/commit/4a33c44f79808a3b5b907e2b053427d2ba6d7015)]:
  - @medusajs/admin-bundler@2.13.0
  - @medusajs/core-flows@2.13.0
  - @medusajs/framework@2.13.0
  - @medusajs/telemetry@2.13.0
  - @medusajs/analytics@2.13.0
  - @medusajs/api-key@2.13.0
  - @medusajs/auth@2.13.0
  - @medusajs/cache-inmemory@2.13.0
  - @medusajs/cache-redis@2.13.0
  - @medusajs/caching@2.13.0
  - @medusajs/cart@2.13.0
  - @medusajs/currency@2.13.0
  - @medusajs/customer@2.13.0
  - @medusajs/event-bus-local@2.13.0
  - @medusajs/event-bus-redis@2.13.0
  - @medusajs/file@2.13.0
  - @medusajs/fulfillment@2.13.0
  - @medusajs/index@2.13.0
  - @medusajs/inventory@2.13.0
  - @medusajs/link-modules@2.13.0
  - @medusajs/locking@2.13.0
  - @medusajs/notification@2.13.0
  - @medusajs/order@2.13.0
  - @medusajs/payment@2.13.0
  - @medusajs/pricing@2.13.0
  - @medusajs/product@2.13.0
  - @medusajs/promotion@2.13.0
  - @medusajs/analytics-local@2.13.0
  - @medusajs/analytics-posthog@2.13.0
  - @medusajs/auth-emailpass@2.13.0
  - @medusajs/auth-github@2.13.0
  - @medusajs/auth-google@2.13.0
  - @medusajs/caching-redis@2.13.0
  - @medusajs/file-local@2.13.0
  - @medusajs/file-s3@2.13.0
  - @medusajs/fulfillment-manual@2.13.0
  - @medusajs/locking-postgres@2.13.0
  - @medusajs/locking-redis@2.13.0
  - @medusajs/notification-local@2.13.0
  - @medusajs/notification-sendgrid@2.13.0
  - @medusajs/payment-stripe@2.13.0
  - @medusajs/region@2.13.0
  - @medusajs/sales-channel@2.13.0
  - @medusajs/settings@2.13.0
  - @medusajs/stock-location@2.13.0
  - @medusajs/store@2.13.0
  - @medusajs/tax@2.13.0
  - @medusajs/translation@2.13.0
  - @medusajs/user@2.13.0
  - @medusajs/workflow-engine-inmemory@2.13.0
  - @medusajs/workflow-engine-redis@2.13.0
  - @medusajs/draft-order@2.13.0

## 2.12.6

### Patch Changes

- [#14541](https://github.com/medusajs/medusa/pull/14541) [`a9b5797e2de093e26286808876262b724e26671a`](https://github.com/medusajs/medusa/commit/a9b5797e2de093e26286808876262b724e26671a) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(dashboard,translation,js-sdk,medusa,types): Translation settings management UI

- [#14536](https://github.com/medusajs/medusa/pull/14536) [`d60ea7268a00f386f803f0f9e6ffeec4bced50bf`](https://github.com/medusajs/medusa/commit/d60ea7268a00f386f803f0f9e6ffeec4bced50bf) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(translation,fulfillment,customer,product,region,tax,core-flows,medusa,types): Implement dynamic translation settings management

- [#14540](https://github.com/medusajs/medusa/pull/14540) [`8890f284705a4843a57a3800820208f593689a2a`](https://github.com/medusajs/medusa/commit/8890f284705a4843a57a3800820208f593689a2a) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Prevent build command from throwing on missing config

- [#14359](https://github.com/medusajs/medusa/pull/14359) [`cec8b8e428131d4743d6da98cd5fa0974b8ab9e1`](https://github.com/medusajs/medusa/commit/cec8b8e428131d4743d6da98cd5fa0974b8ab9e1) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(core-flows,types,utils,medusa): Translate tax lines

- [#14441](https://github.com/medusajs/medusa/pull/14441) [`1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b`](https://github.com/medusajs/medusa/commit/1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(deps,framework): add zod as framework dependency

- Updated dependencies [[`d5cea0e0c84539027e20cefc2007d53990933175`](https://github.com/medusajs/medusa/commit/d5cea0e0c84539027e20cefc2007d53990933175), [`13476988763368b3b333fa5bc3f613e8eb174fdf`](https://github.com/medusajs/medusa/commit/13476988763368b3b333fa5bc3f613e8eb174fdf), [`514cc329f8fccd05a9497bf03fb27ba2de0265f4`](https://github.com/medusajs/medusa/commit/514cc329f8fccd05a9497bf03fb27ba2de0265f4), [`e91ce2ee4b0d15948d4021b2d74c1c9744ef0ae2`](https://github.com/medusajs/medusa/commit/e91ce2ee4b0d15948d4021b2d74c1c9744ef0ae2), [`dfb27a638d913916ee534ecb0a06ae30f6f8a9de`](https://github.com/medusajs/medusa/commit/dfb27a638d913916ee534ecb0a06ae30f6f8a9de), [`a9b5797e2de093e26286808876262b724e26671a`](https://github.com/medusajs/medusa/commit/a9b5797e2de093e26286808876262b724e26671a), [`d60ea7268a00f386f803f0f9e6ffeec4bced50bf`](https://github.com/medusajs/medusa/commit/d60ea7268a00f386f803f0f9e6ffeec4bced50bf), [`5c695b5d499519d153be7c925e865c227301097b`](https://github.com/medusajs/medusa/commit/5c695b5d499519d153be7c925e865c227301097b), [`8890f284705a4843a57a3800820208f593689a2a`](https://github.com/medusajs/medusa/commit/8890f284705a4843a57a3800820208f593689a2a), [`733026f96c23f01d1ceb2fb09f88aa2b9bb65841`](https://github.com/medusajs/medusa/commit/733026f96c23f01d1ceb2fb09f88aa2b9bb65841), [`cec8b8e428131d4743d6da98cd5fa0974b8ab9e1`](https://github.com/medusajs/medusa/commit/cec8b8e428131d4743d6da98cd5fa0974b8ab9e1), [`28fae96ceed68e2c15c3f27316c5b8601f06c478`](https://github.com/medusajs/medusa/commit/28fae96ceed68e2c15c3f27316c5b8601f06c478), [`3751b10337c056c3a61a4726046ebf4c31a3530b`](https://github.com/medusajs/medusa/commit/3751b10337c056c3a61a4726046ebf4c31a3530b), [`6cbbd033e4efdae5ea2a758b507bcc1a0fef26c2`](undefined), [`cbc9f3d059a65cc5ee26595e5cbccf7f05781e41`](https://github.com/medusajs/medusa/commit/cbc9f3d059a65cc5ee26595e5cbccf7f05781e41), [`7307a5e63fdf8ed6f0ff201a0383f0a0bbfc7002`](https://github.com/medusajs/medusa/commit/7307a5e63fdf8ed6f0ff201a0383f0a0bbfc7002), [`b615b71a8e4e273018a09528a8b61116fca6de8b`](https://github.com/medusajs/medusa/commit/b615b71a8e4e273018a09528a8b61116fca6de8b), [`d5cea0e0c84539027e20cefc2007d53990933175`](https://github.com/medusajs/medusa/commit/d5cea0e0c84539027e20cefc2007d53990933175), [`3df466dadde91b24f52504097c07e1ced4b2b8ff`](https://github.com/medusajs/medusa/commit/3df466dadde91b24f52504097c07e1ced4b2b8ff), [`89e6e3e5cbe96f1f64e2cdb33cc2e0d6a221f7a2`](https://github.com/medusajs/medusa/commit/89e6e3e5cbe96f1f64e2cdb33cc2e0d6a221f7a2), [`1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b`](https://github.com/medusajs/medusa/commit/1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b)]:
  - @medusajs/analytics-posthog@2.12.6
  - @medusajs/event-bus-redis@2.12.6
  - @medusajs/draft-order@2.12.6
  - @medusajs/framework@2.12.6
  - @medusajs/translation@2.12.6
  - @medusajs/core-flows@2.12.6
  - @medusajs/fulfillment@2.12.6
  - @medusajs/customer@2.12.6
  - @medusajs/product@2.12.6
  - @medusajs/region@2.12.6
  - @medusajs/tax@2.12.6
  - @medusajs/order@2.12.6
  - @medusajs/analytics@2.12.6
  - @medusajs/api-key@2.12.6
  - @medusajs/auth@2.12.6
  - @medusajs/cache-inmemory@2.12.6
  - @medusajs/cache-redis@2.12.6
  - @medusajs/caching@2.12.6
  - @medusajs/cart@2.12.6
  - @medusajs/currency@2.12.6
  - @medusajs/event-bus-local@2.12.6
  - @medusajs/file@2.12.6
  - @medusajs/index@2.12.6
  - @medusajs/inventory@2.12.6
  - @medusajs/link-modules@2.12.6
  - @medusajs/locking@2.12.6
  - @medusajs/notification@2.12.6
  - @medusajs/payment@2.12.6
  - @medusajs/pricing@2.12.6
  - @medusajs/promotion@2.12.6
  - @medusajs/analytics-local@2.12.6
  - @medusajs/auth-emailpass@2.12.6
  - @medusajs/auth-github@2.12.6
  - @medusajs/auth-google@2.12.6
  - @medusajs/caching-redis@2.12.6
  - @medusajs/file-local@2.12.6
  - @medusajs/file-s3@2.12.6
  - @medusajs/fulfillment-manual@2.12.6
  - @medusajs/locking-postgres@2.12.6
  - @medusajs/locking-redis@2.12.6
  - @medusajs/notification-local@2.12.6
  - @medusajs/notification-sendgrid@2.12.6
  - @medusajs/payment-stripe@2.12.6
  - @medusajs/sales-channel@2.12.6
  - @medusajs/settings@2.12.6
  - @medusajs/stock-location@2.12.6
  - @medusajs/store@2.12.6
  - @medusajs/user@2.12.6
  - @medusajs/workflow-engine-inmemory@2.12.6
  - @medusajs/workflow-engine-redis@2.12.6
  - @medusajs/admin-bundler@2.12.6
  - @medusajs/telemetry@2.12.6

## 2.12.5

### Patch Changes

- [#14502](https://github.com/medusajs/medusa/pull/14502) [`233ec261be200fac83002415aa7c0df082339a3f`](https://github.com/medusajs/medusa/commit/233ec261be200fac83002415aa7c0df082339a3f) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix/add schema only flag

- Updated dependencies [[`bb599a26deed6d5b98e6ce6308c447dca5b90f10`](https://github.com/medusajs/medusa/commit/bb599a26deed6d5b98e6ce6308c447dca5b90f10), [`568742826fae7240b33e6cc7356a12c3715d05b1`](https://github.com/medusajs/medusa/commit/568742826fae7240b33e6cc7356a12c3715d05b1), [`233ec261be200fac83002415aa7c0df082339a3f`](https://github.com/medusajs/medusa/commit/233ec261be200fac83002415aa7c0df082339a3f)]:
  - @medusajs/link-modules@2.12.5
  - @medusajs/analytics@2.12.5
  - @medusajs/auth@2.12.5
  - @medusajs/cache-redis@2.12.5
  - @medusajs/caching@2.12.5
  - @medusajs/event-bus-redis@2.12.5
  - @medusajs/file@2.12.5
  - @medusajs/locking@2.12.5
  - @medusajs/notification@2.12.5
  - @medusajs/payment@2.12.5
  - @medusajs/workflow-engine-redis@2.12.5
  - @medusajs/framework@2.12.5
  - @medusajs/admin-bundler@2.12.5
  - @medusajs/draft-order@2.12.5
  - @medusajs/core-flows@2.12.5
  - @medusajs/api-key@2.12.5
  - @medusajs/cache-inmemory@2.12.5
  - @medusajs/cart@2.12.5
  - @medusajs/currency@2.12.5
  - @medusajs/customer@2.12.5
  - @medusajs/event-bus-local@2.12.5
  - @medusajs/fulfillment@2.12.5
  - @medusajs/index@2.12.5
  - @medusajs/inventory@2.12.5
  - @medusajs/order@2.12.5
  - @medusajs/pricing@2.12.5
  - @medusajs/product@2.12.5
  - @medusajs/promotion@2.12.5
  - @medusajs/analytics-local@2.12.5
  - @medusajs/analytics-posthog@2.12.5
  - @medusajs/auth-emailpass@2.12.5
  - @medusajs/auth-github@2.12.5
  - @medusajs/auth-google@2.12.5
  - @medusajs/caching-redis@2.12.5
  - @medusajs/file-local@2.12.5
  - @medusajs/file-s3@2.12.5
  - @medusajs/fulfillment-manual@2.12.5
  - @medusajs/locking-postgres@2.12.5
  - @medusajs/locking-redis@2.12.5
  - @medusajs/notification-local@2.12.5
  - @medusajs/notification-sendgrid@2.12.5
  - @medusajs/payment-stripe@2.12.5
  - @medusajs/region@2.12.5
  - @medusajs/sales-channel@2.12.5
  - @medusajs/settings@2.12.5
  - @medusajs/stock-location@2.12.5
  - @medusajs/store@2.12.5
  - @medusajs/tax@2.12.5
  - @medusajs/translation@2.12.5
  - @medusajs/user@2.12.5
  - @medusajs/workflow-engine-inmemory@2.12.5
  - @medusajs/telemetry@2.12.5

## 2.12.4

### Patch Changes

- [#14454](https://github.com/medusajs/medusa/pull/14454) [`0ffd79010953315494c1b2ba1def477b7b1d9e4b`](https://github.com/medusajs/medusa/commit/0ffd79010953315494c1b2ba1def477b7b1d9e4b) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(translation): Add support for locale to the graph query

- [#14381](https://github.com/medusajs/medusa/pull/14381) [`6380c1fdf42d023f7a103260ba204efbe37d5c0f`](https://github.com/medusajs/medusa/commit/6380c1fdf42d023f7a103260ba204efbe37d5c0f) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa): allow passing null to cart API routes

- [#14448](https://github.com/medusajs/medusa/pull/14448) [`9cad05c8df1c3f2591da46b5efa415b4850e0602`](https://github.com/medusajs/medusa/commit/9cad05c8df1c3f2591da46b5efa415b4850e0602) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - chore(medusa): add missing fields and filters to product variants endpoint

- [#14355](https://github.com/medusajs/medusa/pull/14355) [`b21a599d118f126e64d2993d46ba60f4a4e94545`](https://github.com/medusajs/medusa/commit/b21a599d118f126e64d2993d46ba60f4a4e94545) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Translation settings + user configuration + js/admin

- [#14337](https://github.com/medusajs/medusa/pull/14337) [`181d5fa67122e4e5f38b91f6b716d35f2d08a204`](https://github.com/medusajs/medusa/commit/181d5fa67122e4e5f38b91f6b716d35f2d08a204) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Auto generated types generation upon build

- [#14390](https://github.com/medusajs/medusa/pull/14390) [`d347e369ce555064e24f2dc3cd93b9e4e73a006d`](https://github.com/medusajs/medusa/commit/d347e369ce555064e24f2dc3cd93b9e4e73a006d) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(medusa,framework): hmr file watch

- [#14417](https://github.com/medusajs/medusa/pull/14417) [`43305a562cfba914654da056b0a7e03c40849678`](https://github.com/medusajs/medusa/commit/43305a562cfba914654da056b0a7e03c40849678) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,utils,core-flows): add reset password metdata

- [#14342](https://github.com/medusajs/medusa/pull/14342) [`92d240d7493ed350aed8b8af80c1dfc62b07a88c`](https://github.com/medusajs/medusa/commit/92d240d7493ed350aed8b8af80c1dfc62b07a88c) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa): fix type of product variant request param

- Updated dependencies [[`5f807ee657c81178f1bf04f695b20ebdb996762c`](https://github.com/medusajs/medusa/commit/5f807ee657c81178f1bf04f695b20ebdb996762c), [`a464e9d907e30bca86a1e8677f8ebf22c38638a2`](https://github.com/medusajs/medusa/commit/a464e9d907e30bca86a1e8677f8ebf22c38638a2), [`60f68ff492bc98013fc2f6e0b0b252182a1ee59c`](https://github.com/medusajs/medusa/commit/60f68ff492bc98013fc2f6e0b0b252182a1ee59c), [`9d2c78db4eac010d60b8943e769e68d506cfd529`](https://github.com/medusajs/medusa/commit/9d2c78db4eac010d60b8943e769e68d506cfd529), [`0ffd79010953315494c1b2ba1def477b7b1d9e4b`](https://github.com/medusajs/medusa/commit/0ffd79010953315494c1b2ba1def477b7b1d9e4b), [`bf4cc12545edc5bf249edc6ecec115c5f7a2b31f`](https://github.com/medusajs/medusa/commit/bf4cc12545edc5bf249edc6ecec115c5f7a2b31f), [`c0ec54fc15fece373ac77f547706ab85eb5bc844`](https://github.com/medusajs/medusa/commit/c0ec54fc15fece373ac77f547706ab85eb5bc844), [`0277062fecc278e630bf2110761a545339f6b9fe`](https://github.com/medusajs/medusa/commit/0277062fecc278e630bf2110761a545339f6b9fe), [`fb6a6b52fa36128d9a03f09ec168744ded881308`](https://github.com/medusajs/medusa/commit/fb6a6b52fa36128d9a03f09ec168744ded881308), [`b21a599d118f126e64d2993d46ba60f4a4e94545`](https://github.com/medusajs/medusa/commit/b21a599d118f126e64d2993d46ba60f4a4e94545), [`181d5fa67122e4e5f38b91f6b716d35f2d08a204`](https://github.com/medusajs/medusa/commit/181d5fa67122e4e5f38b91f6b716d35f2d08a204), [`001923da2bbebb3d42373f0f66e517830d9c0187`](https://github.com/medusajs/medusa/commit/001923da2bbebb3d42373f0f66e517830d9c0187), [`d347e369ce555064e24f2dc3cd93b9e4e73a006d`](https://github.com/medusajs/medusa/commit/d347e369ce555064e24f2dc3cd93b9e4e73a006d), [`8055a79c5268528261c88d5f6f245d1003d87a6d`](https://github.com/medusajs/medusa/commit/8055a79c5268528261c88d5f6f245d1003d87a6d), [`1c89acc536b9b15a7a2984a34783cf3b08db6317`](https://github.com/medusajs/medusa/commit/1c89acc536b9b15a7a2984a34783cf3b08db6317), [`43305a562cfba914654da056b0a7e03c40849678`](https://github.com/medusajs/medusa/commit/43305a562cfba914654da056b0a7e03c40849678), [`242f1d7d7f96ec27f3d2c9aafa8324f2ee9b28fd`](https://github.com/medusajs/medusa/commit/242f1d7d7f96ec27f3d2c9aafa8324f2ee9b28fd), [`11de7e3e3449f3a93724aaeed770a66840ffcaf9`](https://github.com/medusajs/medusa/commit/11de7e3e3449f3a93724aaeed770a66840ffcaf9), [`7e3ed913a6008a25974634d489f9339c40066125`](https://github.com/medusajs/medusa/commit/7e3ed913a6008a25974634d489f9339c40066125)]:
  - @medusajs/order@2.12.4
  - @medusajs/core-flows@2.12.4
  - @medusajs/translation@2.12.4
  - @medusajs/framework@2.12.4
  - @medusajs/auth@2.12.4
  - @medusajs/draft-order@2.12.4
  - @medusajs/admin-bundler@2.12.4
  - @medusajs/analytics@2.12.4
  - @medusajs/api-key@2.12.4
  - @medusajs/cache-inmemory@2.12.4
  - @medusajs/cache-redis@2.12.4
  - @medusajs/caching@2.12.4
  - @medusajs/cart@2.12.4
  - @medusajs/currency@2.12.4
  - @medusajs/customer@2.12.4
  - @medusajs/event-bus-local@2.12.4
  - @medusajs/event-bus-redis@2.12.4
  - @medusajs/file@2.12.4
  - @medusajs/fulfillment@2.12.4
  - @medusajs/index@2.12.4
  - @medusajs/inventory@2.12.4
  - @medusajs/link-modules@2.12.4
  - @medusajs/locking@2.12.4
  - @medusajs/notification@2.12.4
  - @medusajs/payment@2.12.4
  - @medusajs/pricing@2.12.4
  - @medusajs/product@2.12.4
  - @medusajs/promotion@2.12.4
  - @medusajs/analytics-local@2.12.4
  - @medusajs/analytics-posthog@2.12.4
  - @medusajs/auth-emailpass@2.12.4
  - @medusajs/auth-github@2.12.4
  - @medusajs/auth-google@2.12.4
  - @medusajs/caching-redis@2.12.4
  - @medusajs/file-local@2.12.4
  - @medusajs/file-s3@2.12.4
  - @medusajs/fulfillment-manual@2.12.4
  - @medusajs/locking-postgres@2.12.4
  - @medusajs/locking-redis@2.12.4
  - @medusajs/notification-local@2.12.4
  - @medusajs/notification-sendgrid@2.12.4
  - @medusajs/payment-stripe@2.12.4
  - @medusajs/region@2.12.4
  - @medusajs/sales-channel@2.12.4
  - @medusajs/settings@2.12.4
  - @medusajs/stock-location@2.12.4
  - @medusajs/store@2.12.4
  - @medusajs/tax@2.12.4
  - @medusajs/user@2.12.4
  - @medusajs/workflow-engine-inmemory@2.12.4
  - @medusajs/workflow-engine-redis@2.12.4
  - @medusajs/telemetry@2.12.4

## 2.12.3

### Patch Changes

- [#14314](https://github.com/medusajs/medusa/pull/14314) [`accb778039a52fae8eefbada77044c527b136114`](https://github.com/medusajs/medusa/commit/accb778039a52fae8eefbada77044c527b136114) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(js-sdk,types,medusa): add list locales store method to JS SDK

- [#14305](https://github.com/medusajs/medusa/pull/14305) [`7b4dda5a179c78de5e099231ec407836db4c8dbd`](https://github.com/medusajs/medusa/commit/7b4dda5a179c78de5e099231ec407836db4c8dbd) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): apply locale middleware to all store routes

- [#14300](https://github.com/medusajs/medusa/pull/14300) [`8964a03fa1b9e6a4c443bf5b21d65d41a8441d29`](https://github.com/medusajs/medusa/commit/8964a03fa1b9e6a4c443bf5b21d65d41a8441d29) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - chore(): Remove default_locale from StoreLocale

- [#14319](https://github.com/medusajs/medusa/pull/14319) [`6815b3d7dbad2931895ba81c6de19208427d9c50`](https://github.com/medusajs/medusa/commit/6815b3d7dbad2931895ba81c6de19208427d9c50) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Apply translation feature flag broaderly

- [#14311](https://github.com/medusajs/medusa/pull/14311) [`e94e1a4676d68950df76a496a30a9acc61e4b799`](https://github.com/medusajs/medusa/commit/e94e1a4676d68950df76a496a30a9acc61e4b799) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Add product type and collection translation support

- [#14299](https://github.com/medusajs/medusa/pull/14299) [`ba6ed8d9dd22be8646d311d9531c65aea1b7986a`](https://github.com/medusajs/medusa/commit/ba6ed8d9dd22be8646d311d9531c65aea1b7986a) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Translation statistics

- [#14138](https://github.com/medusajs/medusa/pull/14138) [`70929ecac3e5610d90d47a40a517eac3cf3173a4`](https://github.com/medusajs/medusa/commit/70929ecac3e5610d90d47a40a517eac3cf3173a4) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(dashboard,medusa,types): improve performance for price list prices retrieval

- [#14267](https://github.com/medusajs/medusa/pull/14267) [`f13c23a4b709e31f9b2d42e98acc6e342c494403`](https://github.com/medusajs/medusa/commit/f13c23a4b709e31f9b2d42e98acc6e342c494403) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Sync order translations

- [#14307](https://github.com/medusajs/medusa/pull/14307) [`0f1566c64456a6f29a7bfb1dda5a7c470a84ace7`](https://github.com/medusajs/medusa/commit/0f1566c64456a6f29a7bfb1dda5a7c470a84ace7) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Add support for store locales end point

- Updated dependencies [[`b3cb904e9bce3bfad649e500a9e1be0c9bff0e1a`](https://github.com/medusajs/medusa/commit/b3cb904e9bce3bfad649e500a9e1be0c9bff0e1a), [`31a057558c0ec6ff7233489a28edc1fda0ec5375`](https://github.com/medusajs/medusa/commit/31a057558c0ec6ff7233489a28edc1fda0ec5375), [`e199f1eb01ed8e25e0864f77580e75f19412d6c5`](https://github.com/medusajs/medusa/commit/e199f1eb01ed8e25e0864f77580e75f19412d6c5), [`7b4dda5a179c78de5e099231ec407836db4c8dbd`](https://github.com/medusajs/medusa/commit/7b4dda5a179c78de5e099231ec407836db4c8dbd), [`8964a03fa1b9e6a4c443bf5b21d65d41a8441d29`](https://github.com/medusajs/medusa/commit/8964a03fa1b9e6a4c443bf5b21d65d41a8441d29), [`e94e1a4676d68950df76a496a30a9acc61e4b799`](https://github.com/medusajs/medusa/commit/e94e1a4676d68950df76a496a30a9acc61e4b799), [`dd3eb10b1afd0659a6095b6a642d0bf5322285cd`](https://github.com/medusajs/medusa/commit/dd3eb10b1afd0659a6095b6a642d0bf5322285cd), [`f5ec359c4c4c81c007d57069df32ad6cc1f31c5d`](https://github.com/medusajs/medusa/commit/f5ec359c4c4c81c007d57069df32ad6cc1f31c5d), [`ba6ed8d9dd22be8646d311d9531c65aea1b7986a`](https://github.com/medusajs/medusa/commit/ba6ed8d9dd22be8646d311d9531c65aea1b7986a), [`1743ed7f04585c597c9398a99899817b11310463`](https://github.com/medusajs/medusa/commit/1743ed7f04585c597c9398a99899817b11310463), [`b5edbb994084b6095ee523e018b835f19e73df3a`](https://github.com/medusajs/medusa/commit/b5edbb994084b6095ee523e018b835f19e73df3a), [`f13c23a4b709e31f9b2d42e98acc6e342c494403`](https://github.com/medusajs/medusa/commit/f13c23a4b709e31f9b2d42e98acc6e342c494403), [`8c29d85f0f7fdd27b67974d26e3b774e3270e5a9`](https://github.com/medusajs/medusa/commit/8c29d85f0f7fdd27b67974d26e3b774e3270e5a9), [`c8a7122ba918751b215dc0b19cf9b09b2c011ab8`](https://github.com/medusajs/medusa/commit/c8a7122ba918751b215dc0b19cf9b09b2c011ab8), [`d813fc4ff91e98b475a4eae11780ddc00caf66a8`](https://github.com/medusajs/medusa/commit/d813fc4ff91e98b475a4eae11780ddc00caf66a8), [`0f1566c64456a6f29a7bfb1dda5a7c470a84ace7`](https://github.com/medusajs/medusa/commit/0f1566c64456a6f29a7bfb1dda5a7c470a84ace7)]:
  - @medusajs/core-flows@2.12.3
  - @medusajs/index@2.12.3
  - @medusajs/framework@2.12.3
  - @medusajs/store@2.12.3
  - @medusajs/translation@2.12.3
  - @medusajs/link-modules@2.12.3
  - @medusajs/pricing@2.12.3
  - @medusajs/order@2.12.3
  - @medusajs/cart@2.12.3
  - @medusajs/fulfillment@2.12.3
  - @medusajs/notification@2.12.3
  - @medusajs/payment@2.12.3
  - @medusajs/product@2.12.3
  - @medusajs/promotion@2.12.3
  - @medusajs/admin-bundler@2.12.3
  - @medusajs/draft-order@2.12.3
  - @medusajs/analytics@2.12.3
  - @medusajs/api-key@2.12.3
  - @medusajs/auth@2.12.3
  - @medusajs/cache-inmemory@2.12.3
  - @medusajs/cache-redis@2.12.3
  - @medusajs/caching@2.12.3
  - @medusajs/currency@2.12.3
  - @medusajs/customer@2.12.3
  - @medusajs/event-bus-local@2.12.3
  - @medusajs/event-bus-redis@2.12.3
  - @medusajs/file@2.12.3
  - @medusajs/inventory@2.12.3
  - @medusajs/locking@2.12.3
  - @medusajs/analytics-local@2.12.3
  - @medusajs/analytics-posthog@2.12.3
  - @medusajs/auth-emailpass@2.12.3
  - @medusajs/auth-github@2.12.3
  - @medusajs/auth-google@2.12.3
  - @medusajs/caching-redis@2.12.3
  - @medusajs/file-local@2.12.3
  - @medusajs/file-s3@2.12.3
  - @medusajs/fulfillment-manual@2.12.3
  - @medusajs/locking-postgres@2.12.3
  - @medusajs/locking-redis@2.12.3
  - @medusajs/notification-local@2.12.3
  - @medusajs/notification-sendgrid@2.12.3
  - @medusajs/payment-stripe@2.12.3
  - @medusajs/region@2.12.3
  - @medusajs/sales-channel@2.12.3
  - @medusajs/settings@2.12.3
  - @medusajs/stock-location@2.12.3
  - @medusajs/tax@2.12.3
  - @medusajs/user@2.12.3
  - @medusajs/workflow-engine-inmemory@2.12.3
  - @medusajs/workflow-engine-redis@2.12.3
  - @medusajs/telemetry@2.12.3

## 2.12.2

### Patch Changes

- [#14226](https://github.com/medusajs/medusa/pull/14226) [`e4877616c38777f583fe0b58bb10d1c7cf41c0b3`](https://github.com/medusajs/medusa/commit/e4877616c38777f583fe0b58bb10d1c7cf41c0b3) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): sync cart translation synced

- [#14074](https://github.com/medusajs/medusa/pull/14074) [`fe49b567d6d55ae224095c06c710d31d40887653`](https://github.com/medusajs/medusa/commit/fe49b567d6d55ae224095c06c710d31d40887653) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Backend HMR (expriemental)

- [#14202](https://github.com/medusajs/medusa/pull/14202) [`24c469d2173e814a567e18454f5cc5c81f5dcc6a`](https://github.com/medusajs/medusa/commit/24c469d2173e814a567e18454f5cc5c81f5dcc6a) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Run some commands in server mode only

- [#13841](https://github.com/medusajs/medusa/pull/13841) [`fdc2b722d91f446499123d71386e64d9da9265eb`](https://github.com/medusajs/medusa/commit/fdc2b722d91f446499123d71386e64d9da9265eb) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(medusa): Allow 'id' in shipping_address and billing_address in validator of store udpate cart route
  fix(core-flows): Update addresses nested fields when 'id' is provided in payload for update-carts step

- [#14262](https://github.com/medusajs/medusa/pull/14262) [`356283c359e5c30e0d31e6c6fd0fb8e16c025b78`](https://github.com/medusajs/medusa/commit/356283c359e5c30e0d31e6c6fd0fb8e16c025b78) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Accept an extra agument 'all-or-nothing' on the migrate command

- [#14266](https://github.com/medusajs/medusa/pull/14266) [`dd74ce34ba4e273719d1205a2ec6d76f06c7c94e`](https://github.com/medusajs/medusa/commit/dd74ce34ba4e273719d1205a2ec6d76f06c7c94e) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Add translations/locale integration tests and fix locale end…

- [#14004](https://github.com/medusajs/medusa/pull/14004) [`5b7e3c0e7649a3a61b0a4fe796f37e5f7fbe9a3a`](https://github.com/medusajs/medusa/commit/5b7e3c0e7649a3a61b0a4fe796f37e5f7fbe9a3a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(link-modules): ignore duplicates link creation

- [#14238](https://github.com/medusajs/medusa/pull/14238) [`4de555b546c33c67653a211987aca5f80341e637`](https://github.com/medusajs/medusa/commit/4de555b546c33c67653a211987aca5f80341e637) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(medusa): use customer query config on delete address route

- Updated dependencies [[`6176f93ac5ad403dd5fb733d6d22632747ccfca3`](https://github.com/medusajs/medusa/commit/6176f93ac5ad403dd5fb733d6d22632747ccfca3), [`9f7846ae0babbad39947a1f33d236bff8b5098d0`](https://github.com/medusajs/medusa/commit/9f7846ae0babbad39947a1f33d236bff8b5098d0), [`e4877616c38777f583fe0b58bb10d1c7cf41c0b3`](https://github.com/medusajs/medusa/commit/e4877616c38777f583fe0b58bb10d1c7cf41c0b3), [`a78f68fa46dceb8e201fe60e770bd9ea654390d8`](https://github.com/medusajs/medusa/commit/a78f68fa46dceb8e201fe60e770bd9ea654390d8), [`fe49b567d6d55ae224095c06c710d31d40887653`](https://github.com/medusajs/medusa/commit/fe49b567d6d55ae224095c06c710d31d40887653), [`842c0f500721e08d448b6c5c80a725072106ccff`](https://github.com/medusajs/medusa/commit/842c0f500721e08d448b6c5c80a725072106ccff), [`bca145bdbe674a73731f1672047ca44d426a37c1`](https://github.com/medusajs/medusa/commit/bca145bdbe674a73731f1672047ca44d426a37c1), [`6dc0b8bed84a330c1c24f4f1331f1ed078430a47`](https://github.com/medusajs/medusa/commit/6dc0b8bed84a330c1c24f4f1331f1ed078430a47), [`bff0142e7a0d65c9204864b04a28cada2caaa894`](https://github.com/medusajs/medusa/commit/bff0142e7a0d65c9204864b04a28cada2caaa894), [`fdc2b722d91f446499123d71386e64d9da9265eb`](https://github.com/medusajs/medusa/commit/fdc2b722d91f446499123d71386e64d9da9265eb), [`356283c359e5c30e0d31e6c6fd0fb8e16c025b78`](https://github.com/medusajs/medusa/commit/356283c359e5c30e0d31e6c6fd0fb8e16c025b78), [`b7adfb225b4e81bd388c01afe254e2de140266b9`](https://github.com/medusajs/medusa/commit/b7adfb225b4e81bd388c01afe254e2de140266b9), [`144f0f4e2ef4bf27e0e3fc48dd7d79bb6fbedef9`](https://github.com/medusajs/medusa/commit/144f0f4e2ef4bf27e0e3fc48dd7d79bb6fbedef9), [`8bd1d22765edef3b3d2ff31c8f8935049d8b280a`](https://github.com/medusajs/medusa/commit/8bd1d22765edef3b3d2ff31c8f8935049d8b280a), [`5b7e3c0e7649a3a61b0a4fe796f37e5f7fbe9a3a`](https://github.com/medusajs/medusa/commit/5b7e3c0e7649a3a61b0a4fe796f37e5f7fbe9a3a), [`fea3d4ec49c3a7f7eb7d66bd58499e55ae9ec648`](https://github.com/medusajs/medusa/commit/fea3d4ec49c3a7f7eb7d66bd58499e55ae9ec648), [`d7398736e84cfab77db70a8eddf832bb64e89fe5`](https://github.com/medusajs/medusa/commit/d7398736e84cfab77db70a8eddf832bb64e89fe5), [`9852a7c74d3c27d38b60f865061fd39bc0c46911`](https://github.com/medusajs/medusa/commit/9852a7c74d3c27d38b60f865061fd39bc0c46911)]:
  - @medusajs/order@2.12.2
  - @medusajs/framework@2.12.2
  - @medusajs/cart@2.12.2
  - @medusajs/core-flows@2.12.2
  - @medusajs/event-bus-local@2.12.2
  - @medusajs/product@2.12.2
  - @medusajs/customer@2.12.2
  - @medusajs/promotion@2.12.2
  - @medusajs/file-s3@2.12.2
  - @medusajs/event-bus-redis@2.12.2
  - @medusajs/workflow-engine-redis@2.12.2
  - @medusajs/link-modules@2.12.2
  - @medusajs/admin-bundler@2.12.2
  - @medusajs/analytics@2.12.2
  - @medusajs/api-key@2.12.2
  - @medusajs/auth@2.12.2
  - @medusajs/cache-inmemory@2.12.2
  - @medusajs/cache-redis@2.12.2
  - @medusajs/caching@2.12.2
  - @medusajs/currency@2.12.2
  - @medusajs/file@2.12.2
  - @medusajs/fulfillment@2.12.2
  - @medusajs/index@2.12.2
  - @medusajs/inventory@2.12.2
  - @medusajs/locking@2.12.2
  - @medusajs/notification@2.12.2
  - @medusajs/payment@2.12.2
  - @medusajs/pricing@2.12.2
  - @medusajs/analytics-local@2.12.2
  - @medusajs/analytics-posthog@2.12.2
  - @medusajs/auth-emailpass@2.12.2
  - @medusajs/auth-github@2.12.2
  - @medusajs/auth-google@2.12.2
  - @medusajs/caching-redis@2.12.2
  - @medusajs/file-local@2.12.2
  - @medusajs/fulfillment-manual@2.12.2
  - @medusajs/locking-postgres@2.12.2
  - @medusajs/locking-redis@2.12.2
  - @medusajs/notification-local@2.12.2
  - @medusajs/notification-sendgrid@2.12.2
  - @medusajs/payment-stripe@2.12.2
  - @medusajs/region@2.12.2
  - @medusajs/sales-channel@2.12.2
  - @medusajs/settings@2.12.2
  - @medusajs/stock-location@2.12.2
  - @medusajs/store@2.12.2
  - @medusajs/tax@2.12.2
  - @medusajs/translation@2.12.2
  - @medusajs/user@2.12.2
  - @medusajs/workflow-engine-inmemory@2.12.2
  - @medusajs/draft-order@2.12.2
  - @medusajs/telemetry@2.12.2

## 2.12.1

### Patch Changes

- [#14196](https://github.com/medusajs/medusa/pull/14196) [`391d8dc6cd50c79b678059fdeb7774a72e243143`](https://github.com/medusajs/medusa/commit/391d8dc6cd50c79b678059fdeb7774a72e243143) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): event emitting

- Updated dependencies [[`ef162f8b5ff32c9ce779119eb8eabffea62655be`](https://github.com/medusajs/medusa/commit/ef162f8b5ff32c9ce779119eb8eabffea62655be)]:
  - @medusajs/order@2.12.1
  - @medusajs/framework@2.12.1
  - @medusajs/analytics@2.12.1
  - @medusajs/api-key@2.12.1
  - @medusajs/auth@2.12.1
  - @medusajs/caching@2.12.1
  - @medusajs/cart@2.12.1
  - @medusajs/currency@2.12.1
  - @medusajs/customer@2.12.1
  - @medusajs/file@2.12.1
  - @medusajs/fulfillment@2.12.1
  - @medusajs/index@2.12.1
  - @medusajs/inventory@2.12.1
  - @medusajs/link-modules@2.12.1
  - @medusajs/locking@2.12.1
  - @medusajs/notification@2.12.1
  - @medusajs/payment@2.12.1
  - @medusajs/pricing@2.12.1
  - @medusajs/product@2.12.1
  - @medusajs/promotion@2.12.1
  - @medusajs/region@2.12.1
  - @medusajs/sales-channel@2.12.1
  - @medusajs/settings@2.12.1
  - @medusajs/stock-location@2.12.1
  - @medusajs/store@2.12.1
  - @medusajs/tax@2.12.1
  - @medusajs/user@2.12.1
  - @medusajs/workflow-engine-inmemory@2.12.1
  - @medusajs/workflow-engine-redis@2.12.1
  - @medusajs/draft-order@2.12.1
  - @medusajs/core-flows@2.12.1
  - @medusajs/cache-inmemory@2.12.1
  - @medusajs/cache-redis@2.12.1
  - @medusajs/event-bus-local@2.12.1
  - @medusajs/event-bus-redis@2.12.1
  - @medusajs/analytics-local@2.12.1
  - @medusajs/analytics-posthog@2.12.1
  - @medusajs/auth-emailpass@2.12.1
  - @medusajs/auth-github@2.12.1
  - @medusajs/auth-google@2.12.1
  - @medusajs/caching-redis@2.12.1
  - @medusajs/file-local@2.12.1
  - @medusajs/file-s3@2.12.1
  - @medusajs/fulfillment-manual@2.12.1
  - @medusajs/locking-postgres@2.12.1
  - @medusajs/locking-redis@2.12.1
  - @medusajs/notification-local@2.12.1
  - @medusajs/notification-sendgrid@2.12.1
  - @medusajs/payment-stripe@2.12.1
  - @medusajs/admin-bundler@2.12.1
  - @medusajs/telemetry@2.12.1

## 2.12.0

### Patch Changes

- [#13977](https://github.com/medusajs/medusa/pull/13977) [`9fdc00350a4aa006e4bfc3eddcc499737f18bdf3`](https://github.com/medusajs/medusa/commit/9fdc00350a4aa006e4bfc3eddcc499737f18bdf3) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): Lock process payment to prevent ingesting payment processing t…

- [#14145](https://github.com/medusajs/medusa/pull/14145) [`bbf294fc31ac12d3dcdd1687340e58574fb4cfea`](https://github.com/medusajs/medusa/commit/bbf294fc31ac12d3dcdd1687340e58574fb4cfea) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Update medusa exec worker mode

- [#13960](https://github.com/medusajs/medusa/pull/13960) [`6b4f2c1d3282501fce5b9a4f35bbcecf8a18fe93`](https://github.com/medusajs/medusa/commit/6b4f2c1d3282501fce5b9a4f35bbcecf8a18fe93) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(medusa): allow users deletion

- [#14023](https://github.com/medusajs/medusa/pull/14023) [`7e3eb6e41316d7b04d32bc7186ed0c78de1aa539`](https://github.com/medusajs/medusa/commit/7e3eb6e41316d7b04d32bc7186ed0c78de1aa539) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: cleanup/improve bootstrap

- [#14066](https://github.com/medusajs/medusa/pull/14066) [`32eaa9dd81a58e9208cce700b0087d14eec8cd5c`](https://github.com/medusajs/medusa/commit/32eaa9dd81a58e9208cce700b0087d14eec8cd5c) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(medusa): avoid throwing on error on set step failure endpoint

- [#13974](https://github.com/medusajs/medusa/pull/13974) [`aae92d5447c067fce9889403da30f3abcdf5be23`](https://github.com/medusajs/medusa/commit/aae92d5447c067fce9889403da30f3abcdf5be23) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(medusa): fix query http type parameter for get claim route

- [#14082](https://github.com/medusajs/medusa/pull/14082) [`1cfc88ee5530d1d45dc583412234d86d6fe7a777`](https://github.com/medusajs/medusa/commit/1cfc88ee5530d1d45dc583412234d86d6fe7a777) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Improve product list when there is a single sales channel

- [#14169](https://github.com/medusajs/medusa/pull/14169) [`00aa2c13bc37223029e40b38f3e2bedd8ed1e816`](https://github.com/medusajs/medusa/commit/00aa2c13bc37223029e40b38f3e2bedd8ed1e816) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(js-sdk,types,medusa): add HTTP types for update order change API route

- [#13760](https://github.com/medusajs/medusa/pull/13760) [`536a3f802c92960b1eab48c37db25a8c542fd231`](https://github.com/medusajs/medusa/commit/536a3f802c92960b1eab48c37db25a8c542fd231) Thanks [@fPolic](https://github.com/fPolic)! - feat: promotion usage limit

- [#14128](https://github.com/medusajs/medusa/pull/14128) [`5da51064d7936c6d7a459cfa8b34eada65163e03`](https://github.com/medusajs/medusa/commit/5da51064d7936c6d7a459cfa8b34eada65163e03) Thanks [@fPolic](https://github.com/fPolic)! - feat: carry over promotions toggle on exchanges

- [#13997](https://github.com/medusajs/medusa/pull/13997) [`4bbf0d23674856f2d9fd0a9d137a478bc90b4cdb`](https://github.com/medusajs/medusa/commit/4bbf0d23674856f2d9fd0a9d137a478bc90b4cdb) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(medusa): preprocess `version` as number in AdminGetOrdersOrderParams validator

- [#14024](https://github.com/medusajs/medusa/pull/14024) [`6746fecd727823b233a90edb1819d08555124464`](https://github.com/medusajs/medusa/commit/6746fecd727823b233a90edb1819d08555124464) Thanks [@adrien2p](https://github.com/adrien2p)! - Chore/order custom display

- Updated dependencies [[`83dd1b616a9e78810001645bb815347cacc5b4d1`](https://github.com/medusajs/medusa/commit/83dd1b616a9e78810001645bb815347cacc5b4d1), [`9fdc00350a4aa006e4bfc3eddcc499737f18bdf3`](https://github.com/medusajs/medusa/commit/9fdc00350a4aa006e4bfc3eddcc499737f18bdf3), [`0ddd9e36b51267f774ec53e8dd110b601196fa51`](https://github.com/medusajs/medusa/commit/0ddd9e36b51267f774ec53e8dd110b601196fa51), [`113f200a99ccb2f0fbef0017340da5107c700a74`](https://github.com/medusajs/medusa/commit/113f200a99ccb2f0fbef0017340da5107c700a74), [`5499cd27494a68836a242cd34eb70fe9c141a713`](https://github.com/medusajs/medusa/commit/5499cd27494a68836a242cd34eb70fe9c141a713), [`929607f6925581da67a9e955eedded2aab2bdc16`](https://github.com/medusajs/medusa/commit/929607f6925581da67a9e955eedded2aab2bdc16), [`c2c3ad5ba53f1959422fb2d37297a8de8d714782`](https://github.com/medusajs/medusa/commit/c2c3ad5ba53f1959422fb2d37297a8de8d714782), [`ef15868ca8b309dc902470b2da0096255da82c5d`](https://github.com/medusajs/medusa/commit/ef15868ca8b309dc902470b2da0096255da82c5d), [`3e2991e44719c2a829696215862ae5fbd368fe37`](https://github.com/medusajs/medusa/commit/3e2991e44719c2a829696215862ae5fbd368fe37), [`7e3eb6e41316d7b04d32bc7186ed0c78de1aa539`](https://github.com/medusajs/medusa/commit/7e3eb6e41316d7b04d32bc7186ed0c78de1aa539), [`beb91d88a2f224075e4fcf35a0ee9483b3124504`](https://github.com/medusajs/medusa/commit/beb91d88a2f224075e4fcf35a0ee9483b3124504), [`a5c6f6b1fb944a730b605a120f84b4f38f608f9f`](https://github.com/medusajs/medusa/commit/a5c6f6b1fb944a730b605a120f84b4f38f608f9f), [`78842af1c30de9c7561f10b4129aba4e1f30db27`](https://github.com/medusajs/medusa/commit/78842af1c30de9c7561f10b4129aba4e1f30db27), [`91499081f4584d53690db07f6a9c9f104cd5674e`](https://github.com/medusajs/medusa/commit/91499081f4584d53690db07f6a9c9f104cd5674e), [`e75e67f27d2966a16214ac4aa780fe15ef2501c1`](https://github.com/medusajs/medusa/commit/e75e67f27d2966a16214ac4aa780fe15ef2501c1), [`0e73d8d5e3d04d62d444d17138f9cf61b7a236a2`](https://github.com/medusajs/medusa/commit/0e73d8d5e3d04d62d444d17138f9cf61b7a236a2), [`8ddf8b4d764ae359d279498f08d85146d55077f0`](https://github.com/medusajs/medusa/commit/8ddf8b4d764ae359d279498f08d85146d55077f0), [`79582bc94eb420f02ad49a81bcbcc02521e5c414`](https://github.com/medusajs/medusa/commit/79582bc94eb420f02ad49a81bcbcc02521e5c414), [`536a3f802c92960b1eab48c37db25a8c542fd231`](https://github.com/medusajs/medusa/commit/536a3f802c92960b1eab48c37db25a8c542fd231), [`5da51064d7936c6d7a459cfa8b34eada65163e03`](https://github.com/medusajs/medusa/commit/5da51064d7936c6d7a459cfa8b34eada65163e03), [`0cb12021efd2b8ad1cd6dc6801c5f29a87b28ad1`](https://github.com/medusajs/medusa/commit/0cb12021efd2b8ad1cd6dc6801c5f29a87b28ad1), [`a9d33bc8d11637230052f1729e85af5e174b2423`](https://github.com/medusajs/medusa/commit/a9d33bc8d11637230052f1729e85af5e174b2423), [`0a0c2f41d8ef2c70f6e3b73251eb34499e83ea32`](https://github.com/medusajs/medusa/commit/0a0c2f41d8ef2c70f6e3b73251eb34499e83ea32), [`1ea932a56f1d85fd1ebbe4a77f3619fe58d2947a`](https://github.com/medusajs/medusa/commit/1ea932a56f1d85fd1ebbe4a77f3619fe58d2947a), [`b81f958d4126ab99f09b9fef3b1f790b4bca1515`](https://github.com/medusajs/medusa/commit/b81f958d4126ab99f09b9fef3b1f790b4bca1515), [`62d103b44f6402529a156202e37ec5ece01244b4`](https://github.com/medusajs/medusa/commit/62d103b44f6402529a156202e37ec5ece01244b4), [`e59cdae3365981339d55ec01224f09995250e67d`](https://github.com/medusajs/medusa/commit/e59cdae3365981339d55ec01224f09995250e67d), [`6bc5bf4fc976a827ea1d1a5b095e370e717a9b24`](https://github.com/medusajs/medusa/commit/6bc5bf4fc976a827ea1d1a5b095e370e717a9b24), [`3a1ed748390865c80d487133e4c8e9df030eb4f7`](https://github.com/medusajs/medusa/commit/3a1ed748390865c80d487133e4c8e9df030eb4f7), [`b74ef4a784d3728ff2c657a8186095e87fc3f0d4`](https://github.com/medusajs/medusa/commit/b74ef4a784d3728ff2c657a8186095e87fc3f0d4), [`6746fecd727823b233a90edb1819d08555124464`](https://github.com/medusajs/medusa/commit/6746fecd727823b233a90edb1819d08555124464), [`a85778679e99c40421b3be0122d153f991efbc80`](https://github.com/medusajs/medusa/commit/a85778679e99c40421b3be0122d153f991efbc80), [`6c3ec528f146738f55a29e69ee13e9cdb8e3c9b5`](https://github.com/medusajs/medusa/commit/6c3ec528f146738f55a29e69ee13e9cdb8e3c9b5), [`c93f77d1b20395db171016b2710a6ddf95da9851`](https://github.com/medusajs/medusa/commit/c93f77d1b20395db171016b2710a6ddf95da9851), [`f67bfb9f92b9ea4c06910ea203c685e18fafe1d7`](https://github.com/medusajs/medusa/commit/f67bfb9f92b9ea4c06910ea203c685e18fafe1d7)]:
  - @medusajs/core-flows@2.12.0
  - @medusajs/product@2.12.0
  - @medusajs/event-bus-local@2.12.0
  - @medusajs/event-bus-redis@2.12.0
  - @medusajs/framework@2.12.0
  - @medusajs/admin-bundler@2.12.0
  - @medusajs/telemetry@2.12.0
  - @medusajs/promotion@2.12.0
  - @medusajs/order@2.12.0
  - @medusajs/draft-order@2.12.0
  - @medusajs/workflow-engine-inmemory@2.12.0
  - @medusajs/workflow-engine-redis@2.12.0
  - @medusajs/notification@2.12.0
  - @medusajs/payment@2.12.0
  - @medusajs/link-modules@2.12.0
  - @medusajs/payment-stripe@2.12.0
  - @medusajs/fulfillment@2.12.0
  - @medusajs/analytics@2.12.0
  - @medusajs/api-key@2.12.0
  - @medusajs/auth@2.12.0
  - @medusajs/cache-inmemory@2.12.0
  - @medusajs/cache-redis@2.12.0
  - @medusajs/caching@2.12.0
  - @medusajs/cart@2.12.0
  - @medusajs/currency@2.12.0
  - @medusajs/customer@2.12.0
  - @medusajs/file@2.12.0
  - @medusajs/index@2.12.0
  - @medusajs/inventory@2.12.0
  - @medusajs/locking@2.12.0
  - @medusajs/pricing@2.12.0
  - @medusajs/analytics-local@2.12.0
  - @medusajs/analytics-posthog@2.12.0
  - @medusajs/auth-emailpass@2.12.0
  - @medusajs/auth-github@2.12.0
  - @medusajs/auth-google@2.12.0
  - @medusajs/caching-redis@2.12.0
  - @medusajs/file-local@2.12.0
  - @medusajs/file-s3@2.12.0
  - @medusajs/fulfillment-manual@2.12.0
  - @medusajs/locking-postgres@2.12.0
  - @medusajs/locking-redis@2.12.0
  - @medusajs/notification-local@2.12.0
  - @medusajs/notification-sendgrid@2.12.0
  - @medusajs/region@2.12.0
  - @medusajs/sales-channel@2.12.0
  - @medusajs/settings@2.12.0
  - @medusajs/stock-location@2.12.0
  - @medusajs/store@2.12.0
  - @medusajs/tax@2.12.0
  - @medusajs/user@2.12.0

## 2.11.3

### Patch Changes

- [#13928](https://github.com/medusajs/medusa/pull/13928) [`42b270ed2df09474f528d8d23816e0affcf4bd25`](https://github.com/medusajs/medusa/commit/42b270ed2df09474f528d8d23816e0affcf4bd25) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(types, medusa): fixes to http types and validators

- [#13961](https://github.com/medusajs/medusa/pull/13961) [`018871f8cd6121ea6af40644f784256891b11849`](https://github.com/medusajs/medusa/commit/018871f8cd6121ea6af40644f784256891b11849) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - Fix regression preventing region_id to be resolved from store's default region when retrieving priced products

- [#13910](https://github.com/medusajs/medusa/pull/13910) [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Dependencies cleanup and improvements

- [#13931](https://github.com/medusajs/medusa/pull/13931) [`990691e78a77a46bc581353de47945dd8f5d6928`](https://github.com/medusajs/medusa/commit/990691e78a77a46bc581353de47945dd8f5d6928) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(medusa): do not use transactionId for cart operations

- [#13932](https://github.com/medusajs/medusa/pull/13932) [`37563987b8fe75c9acfe62957a33e8398977647a`](https://github.com/medusajs/medusa/commit/37563987b8fe75c9acfe62957a33e8398977647a) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Fix dependencies vulnerabilities

- [#13898](https://github.com/medusajs/medusa/pull/13898) [`13d7d15be594ca413785eebe8f86b47c36cb9830`](https://github.com/medusajs/medusa/commit/13d7d15be594ca413785eebe8f86b47c36cb9830) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(modules-sdk): parallel migrations

- Updated dependencies [[`28c3ea68f5634792848f146ac6af5b27c848bf21`](https://github.com/medusajs/medusa/commit/28c3ea68f5634792848f146ac6af5b27c848bf21), [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d), [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff), [`990691e78a77a46bc581353de47945dd8f5d6928`](https://github.com/medusajs/medusa/commit/990691e78a77a46bc581353de47945dd8f5d6928), [`37563987b8fe75c9acfe62957a33e8398977647a`](https://github.com/medusajs/medusa/commit/37563987b8fe75c9acfe62957a33e8398977647a), [`7c72e7bae960088df1efca1cba7275d95ecdaf12`](https://github.com/medusajs/medusa/commit/7c72e7bae960088df1efca1cba7275d95ecdaf12), [`13d7d15be594ca413785eebe8f86b47c36cb9830`](https://github.com/medusajs/medusa/commit/13d7d15be594ca413785eebe8f86b47c36cb9830)]:
  - @medusajs/framework@2.11.3
  - @medusajs/admin-bundler@2.11.3
  - @medusajs/analytics@2.11.3
  - @medusajs/analytics-local@2.11.3
  - @medusajs/analytics-posthog@2.11.3
  - @medusajs/api-key@2.11.3
  - @medusajs/auth@2.11.3
  - @medusajs/auth-emailpass@2.11.3
  - @medusajs/auth-github@2.11.3
  - @medusajs/auth-google@2.11.3
  - @medusajs/cache-inmemory@2.11.3
  - @medusajs/cache-redis@2.11.3
  - @medusajs/caching@2.11.3
  - @medusajs/caching-redis@2.11.3
  - @medusajs/cart@2.11.3
  - @medusajs/core-flows@2.11.3
  - @medusajs/currency@2.11.3
  - @medusajs/customer@2.11.3
  - @medusajs/draft-order@2.11.3
  - @medusajs/event-bus-local@2.11.3
  - @medusajs/event-bus-redis@2.11.3
  - @medusajs/file@2.11.3
  - @medusajs/file-local@2.11.3
  - @medusajs/file-s3@2.11.3
  - @medusajs/fulfillment@2.11.3
  - @medusajs/fulfillment-manual@2.11.3
  - @medusajs/index@2.11.3
  - @medusajs/inventory@2.11.3
  - @medusajs/link-modules@2.11.3
  - @medusajs/locking@2.11.3
  - @medusajs/locking-postgres@2.11.3
  - @medusajs/locking-redis@2.11.3
  - @medusajs/notification@2.11.3
  - @medusajs/notification-local@2.11.3
  - @medusajs/notification-sendgrid@2.11.3
  - @medusajs/order@2.11.3
  - @medusajs/payment@2.11.3
  - @medusajs/payment-stripe@2.11.3
  - @medusajs/pricing@2.11.3
  - @medusajs/product@2.11.3
  - @medusajs/promotion@2.11.3
  - @medusajs/region@2.11.3
  - @medusajs/sales-channel@2.11.3
  - @medusajs/settings@2.11.3
  - @medusajs/stock-location@2.11.3
  - @medusajs/store@2.11.3
  - @medusajs/tax@2.11.3
  - @medusajs/telemetry@2.11.3
  - @medusajs/user@2.11.3
  - @medusajs/workflow-engine-inmemory@2.11.3
  - @medusajs/workflow-engine-redis@2.11.3

## 2.11.2

### Patch Changes

- [#13730](https://github.com/medusajs/medusa/pull/13730) [`25a20ca95f702dfb8a34fe9e4f3c565a47c2655e`](https://github.com/medusajs/medusa/commit/25a20ca95f702dfb8a34fe9e4f3c565a47c2655e) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa,types): product variant store endpoints

- [#13833](https://github.com/medusajs/medusa/pull/13833) [`ec4443287601f5fe1544b305873f3aa151ed1bd7`](https://github.com/medusajs/medusa/commit/ec4443287601f5fe1544b305873f3aa151ed1bd7) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(types,medusa): clean up HTTP and request type arguments

- [#13623](https://github.com/medusajs/medusa/pull/13623) [`47572816778e21432d0201f4b2642a765c86fdbc`](https://github.com/medusajs/medusa/commit/47572816778e21432d0201f4b2642a765c86fdbc) Thanks [@fPolic](https://github.com/fPolic)! - feat: scoped variant images

- [#13869](https://github.com/medusajs/medusa/pull/13869) [`85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2`](https://github.com/medusajs/medusa/commit/85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(index): Add support for API end points to interact with the index module

- Updated dependencies [[`f055bfd723e47b381a780b23dc230203b989088c`](https://github.com/medusajs/medusa/commit/f055bfd723e47b381a780b23dc230203b989088c), [`cc2614ded7f83cdbe7e7f7f809d05f5ab6059fe4`](https://github.com/medusajs/medusa/commit/cc2614ded7f83cdbe7e7f7f809d05f5ab6059fe4), [`01ee437926f0a4ec587510c65f8282620bf72d3f`](https://github.com/medusajs/medusa/commit/01ee437926f0a4ec587510c65f8282620bf72d3f), [`0f79f22ebc35b3e4d8151789b92c932f014de85e`](https://github.com/medusajs/medusa/commit/0f79f22ebc35b3e4d8151789b92c932f014de85e), [`47572816778e21432d0201f4b2642a765c86fdbc`](https://github.com/medusajs/medusa/commit/47572816778e21432d0201f4b2642a765c86fdbc), [`ef7b9b937562144d1f077a16ceb8279c84f3b6af`](https://github.com/medusajs/medusa/commit/ef7b9b937562144d1f077a16ceb8279c84f3b6af), [`0b202cc50946fdd0d0ccf4c76ae2d4f801895378`](https://github.com/medusajs/medusa/commit/0b202cc50946fdd0d0ccf4c76ae2d4f801895378), [`85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2`](https://github.com/medusajs/medusa/commit/85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2), [`1defb3c29bfe018fd5f89b5a9e27fc8a31d72cdd`](https://github.com/medusajs/medusa/commit/1defb3c29bfe018fd5f89b5a9e27fc8a31d72cdd)]:
  - @medusajs/pricing@2.11.2
  - @medusajs/notification@2.11.2
  - @medusajs/payment@2.11.2
  - @medusajs/core-flows@2.11.2
  - @medusajs/product@2.11.2
  - @medusajs/index@2.11.2
  - @medusajs/framework@2.11.2
  - @medusajs/admin-bundler@2.11.2
  - @medusajs/draft-order@2.11.2
  - @medusajs/analytics@2.11.2
  - @medusajs/api-key@2.11.2
  - @medusajs/auth@2.11.2
  - @medusajs/cache-inmemory@2.11.2
  - @medusajs/cache-redis@2.11.2
  - @medusajs/caching@2.11.2
  - @medusajs/cart@2.11.2
  - @medusajs/currency@2.11.2
  - @medusajs/customer@2.11.2
  - @medusajs/event-bus-local@2.11.2
  - @medusajs/event-bus-redis@2.11.2
  - @medusajs/file@2.11.2
  - @medusajs/fulfillment@2.11.2
  - @medusajs/inventory@2.11.2
  - @medusajs/link-modules@2.11.2
  - @medusajs/locking@2.11.2
  - @medusajs/order@2.11.2
  - @medusajs/promotion@2.11.2
  - @medusajs/analytics-local@2.11.2
  - @medusajs/analytics-posthog@2.11.2
  - @medusajs/auth-emailpass@2.11.2
  - @medusajs/auth-github@2.11.2
  - @medusajs/auth-google@2.11.2
  - @medusajs/caching-redis@2.11.2
  - @medusajs/file-local@2.11.2
  - @medusajs/file-s3@2.11.2
  - @medusajs/fulfillment-manual@2.11.2
  - @medusajs/locking-postgres@2.11.2
  - @medusajs/locking-redis@2.11.2
  - @medusajs/notification-local@2.11.2
  - @medusajs/notification-sendgrid@2.11.2
  - @medusajs/payment-stripe@2.11.2
  - @medusajs/region@2.11.2
  - @medusajs/sales-channel@2.11.2
  - @medusajs/settings@2.11.2
  - @medusajs/stock-location@2.11.2
  - @medusajs/store@2.11.2
  - @medusajs/tax@2.11.2
  - @medusajs/user@2.11.2
  - @medusajs/workflow-engine-inmemory@2.11.2
  - @medusajs/workflow-engine-redis@2.11.2
  - @medusajs/telemetry@2.11.2

## 2.11.1

### Patch Changes

- [#13813](https://github.com/medusajs/medusa/pull/13813) [`90162ebeacf6e093a06b70ac2e87de9f12674a17`](https://github.com/medusajs/medusa/commit/90162ebeacf6e093a06b70ac2e87de9f12674a17) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): images recreate on product update

- Updated dependencies [[`226984cf0f229bec00ee33a3a1a981b57889c11a`](https://github.com/medusajs/medusa/commit/226984cf0f229bec00ee33a3a1a981b57889c11a), [`d51ae2768be0dad5ece49324aa4866bb591e7ad0`](https://github.com/medusajs/medusa/commit/d51ae2768be0dad5ece49324aa4866bb591e7ad0), [`bad0858348dca100533bb6fcdcdefe90b0668407`](https://github.com/medusajs/medusa/commit/bad0858348dca100533bb6fcdcdefe90b0668407), [`17fb3e2e10e4e53bfb4d7d33e004c59225a71861`](https://github.com/medusajs/medusa/commit/17fb3e2e10e4e53bfb4d7d33e004c59225a71861), [`fe4e7481a9ee6e360623d15ecfaf51f3df00f9d7`](https://github.com/medusajs/medusa/commit/fe4e7481a9ee6e360623d15ecfaf51f3df00f9d7), [`5df903f5fb52d1e37d13bfe72ed9c226c1eb46b4`](https://github.com/medusajs/medusa/commit/5df903f5fb52d1e37d13bfe72ed9c226c1eb46b4), [`a34fcfab351a79badfb24255602ca3c6ff60bffd`](https://github.com/medusajs/medusa/commit/a34fcfab351a79badfb24255602ca3c6ff60bffd)]:
  - @medusajs/admin-bundler@2.11.1
  - @medusajs/workflow-engine-inmemory@2.11.1
  - @medusajs/workflow-engine-redis@2.11.1
  - @medusajs/payment-stripe@2.11.1
  - @medusajs/order@2.11.1
  - @medusajs/core-flows@2.11.1
  - @medusajs/cart@2.11.1
  - @medusajs/customer@2.11.1
  - @medusajs/inventory@2.11.1
  - @medusajs/product@2.11.1
  - @medusajs/framework@2.11.1
  - @medusajs/draft-order@2.11.1
  - @medusajs/analytics@2.11.1
  - @medusajs/api-key@2.11.1
  - @medusajs/auth@2.11.1
  - @medusajs/caching@2.11.1
  - @medusajs/currency@2.11.1
  - @medusajs/file@2.11.1
  - @medusajs/fulfillment@2.11.1
  - @medusajs/index@2.11.1
  - @medusajs/link-modules@2.11.1
  - @medusajs/locking@2.11.1
  - @medusajs/notification@2.11.1
  - @medusajs/payment@2.11.1
  - @medusajs/pricing@2.11.1
  - @medusajs/promotion@2.11.1
  - @medusajs/region@2.11.1
  - @medusajs/sales-channel@2.11.1
  - @medusajs/settings@2.11.1
  - @medusajs/stock-location@2.11.1
  - @medusajs/store@2.11.1
  - @medusajs/tax@2.11.1
  - @medusajs/user@2.11.1
  - @medusajs/cache-inmemory@2.11.1
  - @medusajs/cache-redis@2.11.1
  - @medusajs/event-bus-local@2.11.1
  - @medusajs/event-bus-redis@2.11.1
  - @medusajs/analytics-local@2.11.1
  - @medusajs/analytics-posthog@2.11.1
  - @medusajs/auth-emailpass@2.11.1
  - @medusajs/auth-github@2.11.1
  - @medusajs/auth-google@2.11.1
  - @medusajs/caching-redis@2.11.1
  - @medusajs/file-local@2.11.1
  - @medusajs/file-s3@2.11.1
  - @medusajs/fulfillment-manual@2.11.1
  - @medusajs/locking-postgres@2.11.1
  - @medusajs/locking-redis@2.11.1
  - @medusajs/notification-local@2.11.1
  - @medusajs/notification-sendgrid@2.11.1
  - @medusajs/telemetry@2.11.1

## 2.11.0

### Minor Changes

- [`57030fa43e084ed8300e6b74399c5402b1587e80`](undefined) - chore: Prepare minor bump

### Patch Changes

- [#13439](https://github.com/medusajs/medusa/pull/13439) [`12a96a7c7015f011f5e29a1d387f835e514ba536`](https://github.com/medusajs/medusa/commit/12a96a7c7015f011f5e29a1d387f835e514ba536) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Move peer deps into a single package and re export from framework

- [#13703](https://github.com/medusajs/medusa/pull/13703) [`c61f3150c138de016c6886e79d79984bc267273c`](https://github.com/medusajs/medusa/commit/c61f3150c138de016c6886e79d79984bc267273c) Thanks [@willbouch](https://github.com/willbouch)! - fix(medusa,utils,types): inventory management nullable

- [#13451](https://github.com/medusajs/medusa/pull/13451) [`7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1`](https://github.com/medusajs/medusa/commit/7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1) Thanks [@fPolic](https://github.com/fPolic)! - feat: support limiting promotion usage by attribute

- [#13645](https://github.com/medusajs/medusa/pull/13645) [`76aa4a48b3cbec519ab16c96cc87ee3288de28de`](https://github.com/medusajs/medusa/commit/76aa4a48b3cbec519ab16c96cc87ee3288de28de) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix/workflows concurrency

- [`5c77b10fa64d28c315e5196da1c9608c1c0a2ab7`](undefined) - fix(medusa): plugin:db:generate skip modules with no data models

- [`9d8ed70130867466f81834adf13b7b60bdfc0b6a`](undefined) - feat(cli): servers and workers in cluster mode

- [`730d73306d699634121a793f2b4049fd3e09bc47`](undefined) - chore(medusa): remove empty object type for set cart's customer route

- [#13435](https://github.com/medusajs/medusa/pull/13435) [`b9d6f73320c36c53235b12fb8397b30a448917f0`](https://github.com/medusajs/medusa/commit/b9d6f73320c36c53235b12fb8397b30a448917f0) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(): distributed caching

- [`71014bafa6942709d4b763cbc82dc7f6d4860ba6`](undefined) - fix(medusa): fixes db setup command to not load connection before creating db

- [#13450](https://github.com/medusajs/medusa/pull/13450) [`8ece06d8ed6a197ebb370918c49a3ec5c21dd186`](https://github.com/medusajs/medusa/commit/8ece06d8ed6a197ebb370918c49a3ec5c21dd186) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Upgrade mikro orm 6.5.4

- [#13649](https://github.com/medusajs/medusa/pull/13649) [`bb08edd41fd954306b0feacf6a6a69b87d9287dd`](https://github.com/medusajs/medusa/commit/bb08edd41fd954306b0feacf6a6a69b87d9287dd) Thanks [@willbouch](https://github.com/willbouch)! - fix(medusa,file-local,file-s3,core-flows): fix csv parsing special characters

- [#13566](https://github.com/medusajs/medusa/pull/13566) [`459fbcdf998a506d80abb758bc7648126c6c96f8`](https://github.com/medusajs/medusa/commit/459fbcdf998a506d80abb758bc7648126c6c96f8) Thanks [@docloulou](https://github.com/docloulou)! - feat(medusa,dashboard): Add support for configurable additional columns in entity views

- [`137b237c8498fe4c195a3b8344e16b61193b9329`](undefined) - feat(medusa): export feature-flags config objects

- [`907fbc89a2566f516c65a4eefdfeeb4f9dcb3579`](undefined) - feat(medusa): include user_metadata in auth routes jwt

- [#13527](https://github.com/medusajs/medusa/pull/13527) [`458dd04bbf70159ec42254e91675c7a1f1d344d8`](https://github.com/medusajs/medusa/commit/458dd04bbf70159ec42254e91675c7a1f1d344d8) Thanks [@leobenzol](https://github.com/leobenzol)! - fix(core-flows,types,medusa): pass /store/shipping-options fields to workflow

- [`3960c80e9f55bdf41f9f257e12ed72c713577598`](undefined) - fix(medusa): start cluster

- [`9d3c71fefd12d09ecd3be1aeff7744e809872481`](undefined) - fix(medusa): cart now returns 404 when not found

- Updated dependencies [[`0695c5844f7e28e46dc3a6087b981e69ed4e41ba`](https://github.com/medusajs/medusa/commit/0695c5844f7e28e46dc3a6087b981e69ed4e41ba), [`0cbd9f0bc315b3eda1770ac301061f1576856387`](https://github.com/medusajs/medusa/commit/0cbd9f0bc315b3eda1770ac301061f1576856387), [`12a96a7c7015f011f5e29a1d387f835e514ba536`](https://github.com/medusajs/medusa/commit/12a96a7c7015f011f5e29a1d387f835e514ba536), [`9c957e1da04c1f86d1caa7de279993453b76bb63`](https://github.com/medusajs/medusa/commit/9c957e1da04c1f86d1caa7de279993453b76bb63), [`1b57e5c58ab5c656da398b69444c2b9baba2e35e`](https://github.com/medusajs/medusa/commit/1b57e5c58ab5c656da398b69444c2b9baba2e35e), [`a501364b2d26a3ca0670eb345d9933b83964abc1`](undefined), [`7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1`](https://github.com/medusajs/medusa/commit/7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1), [`9c7c1d48c7779023172d5e7003674b2d7107b733`](https://github.com/medusajs/medusa/commit/9c7c1d48c7779023172d5e7003674b2d7107b733), [`0c7cbfb2e7bfeab89759cbd9cdf25462a3df1711`](undefined), [`3758303a1dd95332383bbf0b13746b8d771085c5`](undefined), [`76aa4a48b3cbec519ab16c96cc87ee3288de28de`](https://github.com/medusajs/medusa/commit/76aa4a48b3cbec519ab16c96cc87ee3288de28de), [`6e806942c7961eeb1d80abca0f9b4bf2e663f6b3`](https://github.com/medusajs/medusa/commit/6e806942c7961eeb1d80abca0f9b4bf2e663f6b3), [`62d340b897685631dc1a10122fe7b64f9206bf77`](undefined), [`5346079d4717933d31d57f549d4158f3d433551c`](undefined), [`5b135a41fe40ccda9ef0e867748a77c619214d0a`](undefined), [`150aa50397825ae800f3acf4bbc68fe28e397582`](https://github.com/medusajs/medusa/commit/150aa50397825ae800f3acf4bbc68fe28e397582), [`9fc32ba7c7454b083a62deca2b74112a0e9f0c5c`](undefined), [`4c1c1dd4c0790597d7d881bb979bb9c8d8fd35e3`](undefined), [`b9d6f73320c36c53235b12fb8397b30a448917f0`](https://github.com/medusajs/medusa/commit/b9d6f73320c36c53235b12fb8397b30a448917f0), [`9633e0676e0d0b8ff681b45e47ef97402d8a9831`](undefined), [`924564bee505fc8787945c6d683243cef5799625`](https://github.com/medusajs/medusa/commit/924564bee505fc8787945c6d683243cef5799625), [`cb716856b653c31178a5977b17ec77eed4c9c241`](undefined), [`9361f9c25aae3ce2107f8d3d585517b767c3d3d1`](undefined), [`2d45ba7be12bf5edab13934365041d428473fcfd`](undefined), [`51859c38a728c5f05cf30f09f4c6a55657895de7`](https://github.com/medusajs/medusa/commit/51859c38a728c5f05cf30f09f4c6a55657895de7), [`8acfb88c2b627ba6ba4a2827bcb78c3bb74c22f8`](https://github.com/medusajs/medusa/commit/8acfb88c2b627ba6ba4a2827bcb78c3bb74c22f8), [`b43b285125a66455ed6567543414eddcbe54781e`](undefined), [`41651721450c99e5f38cfbb87a6a47ab067ece86`](https://github.com/medusajs/medusa/commit/41651721450c99e5f38cfbb87a6a47ab067ece86), [`a61d1825eaef4bece20704fe6ae21d9da841b2f2`](https://github.com/medusajs/medusa/commit/a61d1825eaef4bece20704fe6ae21d9da841b2f2), [`d58462c9c91a3e335d03f758438e109caad1f839`](undefined), [`087887fefb948e6676001ad2dc2cb265ae6f7430`](https://github.com/medusajs/medusa/commit/087887fefb948e6676001ad2dc2cb265ae6f7430), [`5e827ec95d0f721e62c0d4e8c603bda7ddc0929c`](https://github.com/medusajs/medusa/commit/5e827ec95d0f721e62c0d4e8c603bda7ddc0929c), [`8ece06d8ed6a197ebb370918c49a3ec5c21dd186`](https://github.com/medusajs/medusa/commit/8ece06d8ed6a197ebb370918c49a3ec5c21dd186), [`8fb7e04be7d586453d32ee73e292834ca2de2378`](undefined), [`fc67fd0b36f53f0c0897df54ecea02061e65e816`](https://github.com/medusajs/medusa/commit/fc67fd0b36f53f0c0897df54ecea02061e65e816), [`bb08edd41fd954306b0feacf6a6a69b87d9287dd`](https://github.com/medusajs/medusa/commit/bb08edd41fd954306b0feacf6a6a69b87d9287dd), [`ea3d0100a9d4994f15e901f518a45390d596bebf`](undefined), [`5ea32aaa44a47b143c46f895032478334b7379ca`](https://github.com/medusajs/medusa/commit/5ea32aaa44a47b143c46f895032478334b7379ca), [`c54c5ed6de2c9686f89aeef86c5c607c4b5f1cf3`](https://github.com/medusajs/medusa/commit/c54c5ed6de2c9686f89aeef86c5c607c4b5f1cf3), [`1d2b4566fda0bdd826c3d1fe090b1ee3efdbd9bd`](https://github.com/medusajs/medusa/commit/1d2b4566fda0bdd826c3d1fe090b1ee3efdbd9bd), [`458dd04bbf70159ec42254e91675c7a1f1d344d8`](https://github.com/medusajs/medusa/commit/458dd04bbf70159ec42254e91675c7a1f1d344d8), [`ee1c77a01f6463dd7a1d8bc2046e91b932900602`](undefined), [`86c975258b7f3a2f1d49117f7a4139806812a8e7`](https://github.com/medusajs/medusa/commit/86c975258b7f3a2f1d49117f7a4139806812a8e7), [`68a643bb3aafc6bb8f7d15ebc49870dd7f53976e`](undefined), [`92d30b28f45b4037cd73c180c8f257070cf49bd4`](https://github.com/medusajs/medusa/commit/92d30b28f45b4037cd73c180c8f257070cf49bd4), [`ca334b7cc1eef297cbde2356746adfd0121d348f`](undefined), [`fc2ded4b100432236a14d9f6409e8c6ea5a84269`](https://github.com/medusajs/medusa/commit/fc2ded4b100432236a14d9f6409e8c6ea5a84269), [`02b6d013822b9665f868c4ea6d1b5cfe58723459`](https://github.com/medusajs/medusa/commit/02b6d013822b9665f868c4ea6d1b5cfe58723459), [`4e3090ab263b8c0da97e91d6586275d0f8609db5`](https://github.com/medusajs/medusa/commit/4e3090ab263b8c0da97e91d6586275d0f8609db5), [`516f5a38960f1ea05a2c696e0079d2e4c34d5c86`](https://github.com/medusajs/medusa/commit/516f5a38960f1ea05a2c696e0079d2e4c34d5c86)]:
  - @medusajs/auth-emailpass@2.11.0
  - @medusajs/core-flows@2.11.0
  - @medusajs/framework@2.11.0
  - @medusajs/analytics@2.11.0
  - @medusajs/api-key@2.11.0
  - @medusajs/auth@2.11.0
  - @medusajs/cache-redis@2.11.0
  - @medusajs/cart@2.11.0
  - @medusajs/currency@2.11.0
  - @medusajs/customer@2.11.0
  - @medusajs/event-bus-redis@2.11.0
  - @medusajs/file@2.11.0
  - @medusajs/fulfillment@2.11.0
  - @medusajs/index@2.11.0
  - @medusajs/inventory@2.11.0
  - @medusajs/link-modules@2.11.0
  - @medusajs/locking@2.11.0
  - @medusajs/notification@2.11.0
  - @medusajs/order@2.11.0
  - @medusajs/payment@2.11.0
  - @medusajs/pricing@2.11.0
  - @medusajs/product@2.11.0
  - @medusajs/promotion@2.11.0
  - @medusajs/locking-postgres@2.11.0
  - @medusajs/payment-stripe@2.11.0
  - @medusajs/region@2.11.0
  - @medusajs/sales-channel@2.11.0
  - @medusajs/settings@2.11.0
  - @medusajs/stock-location@2.11.0
  - @medusajs/store@2.11.0
  - @medusajs/tax@2.11.0
  - @medusajs/user@2.11.0
  - @medusajs/workflow-engine-inmemory@2.11.0
  - @medusajs/workflow-engine-redis@2.11.0
  - @medusajs/draft-order@2.11.0
  - @medusajs/caching@2.11.0
  - @medusajs/event-bus-local@2.11.0
  - @medusajs/caching-redis@2.11.0
  - @medusajs/file-local@2.11.0
  - @medusajs/file-s3@2.11.0
  - @medusajs/admin-bundler@2.11.0
  - @medusajs/cache-inmemory@2.11.0
  - @medusajs/analytics-local@2.11.0
  - @medusajs/analytics-posthog@2.11.0
  - @medusajs/auth-github@2.11.0
  - @medusajs/auth-google@2.11.0
  - @medusajs/fulfillment-manual@2.11.0
  - @medusajs/locking-redis@2.11.0
  - @medusajs/notification-local@2.11.0
  - @medusajs/notification-sendgrid@2.11.0
  - @medusajs/telemetry@2.11.0

## 2.10.3

### Patch Changes

- [#13516](https://github.com/medusajs/medusa/pull/13516) [`25634b038248ab6501af719faec79b59b496bada`](https://github.com/medusajs/medusa/commit/25634b038248ab6501af719faec79b59b496bada) Thanks [@adrien2p](https://github.com/adrien2p)! - test(): test dynamic max workers and improve CI

- [#13497](https://github.com/medusajs/medusa/pull/13497) [`9563ee446f2b3a2e0cd4a4a33959ed55be5f268a`](https://github.com/medusajs/medusa/commit/9563ee446f2b3a2e0cd4a4a33959ed55be5f268a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(utils): subtotal calculation discounting returned items

- [#13495](https://github.com/medusajs/medusa/pull/13495) [`90cc3f42d98bce04d45a72165399193e7933a54f`](https://github.com/medusajs/medusa/commit/90cc3f42d98bce04d45a72165399193e7933a54f) Thanks [@willbouch](https://github.com/willbouch)! - feat(medusa): allow filtering by id for collections

- [#13508](https://github.com/medusajs/medusa/pull/13508) [`8565dcfc46c9ccc923a44582bb215c615ac2792f`](https://github.com/medusajs/medusa/commit/8565dcfc46c9ccc923a44582bb215c615ac2792f) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows,medusa): don't allow negative line item quantity

- Updated dependencies [[`ebf33bea43bb6fe03a60a3099b2bc62608f0d13b`](https://github.com/medusajs/medusa/commit/ebf33bea43bb6fe03a60a3099b2bc62608f0d13b), [`25634b038248ab6501af719faec79b59b496bada`](https://github.com/medusajs/medusa/commit/25634b038248ab6501af719faec79b59b496bada), [`57897c232e23db042f523cbe83b6318b97de519d`](https://github.com/medusajs/medusa/commit/57897c232e23db042f523cbe83b6318b97de519d), [`9563ee446f2b3a2e0cd4a4a33959ed55be5f268a`](https://github.com/medusajs/medusa/commit/9563ee446f2b3a2e0cd4a4a33959ed55be5f268a), [`4736c58da5de67f6868b4552351a093e67715e4b`](https://github.com/medusajs/medusa/commit/4736c58da5de67f6868b4552351a093e67715e4b), [`1071296236d84b70b3b31034eb95984445feb020`](https://github.com/medusajs/medusa/commit/1071296236d84b70b3b31034eb95984445feb020), [`040fbf3220420b43871e33acc6686a6cedcf88fc`](https://github.com/medusajs/medusa/commit/040fbf3220420b43871e33acc6686a6cedcf88fc), [`8565dcfc46c9ccc923a44582bb215c615ac2792f`](https://github.com/medusajs/medusa/commit/8565dcfc46c9ccc923a44582bb215c615ac2792f)]:
  - @medusajs/workflow-engine-inmemory@2.10.3
  - @medusajs/workflow-engine-redis@2.10.3
  - @medusajs/analytics@2.10.3
  - @medusajs/api-key@2.10.3
  - @medusajs/auth@2.10.3
  - @medusajs/cart@2.10.3
  - @medusajs/currency@2.10.3
  - @medusajs/customer@2.10.3
  - @medusajs/event-bus-local@2.10.3
  - @medusajs/event-bus-redis@2.10.3
  - @medusajs/file@2.10.3
  - @medusajs/fulfillment@2.10.3
  - @medusajs/index@2.10.3
  - @medusajs/inventory@2.10.3
  - @medusajs/link-modules@2.10.3
  - @medusajs/core-flows@2.10.3
  - @medusajs/framework@2.10.3
  - @medusajs/promotion@2.10.3
  - @medusajs/order@2.10.3
  - @medusajs/admin-bundler@2.10.3
  - @medusajs/draft-order@2.10.3
  - @medusajs/cache-inmemory@2.10.3
  - @medusajs/cache-redis@2.10.3
  - @medusajs/locking@2.10.3
  - @medusajs/notification@2.10.3
  - @medusajs/payment@2.10.3
  - @medusajs/pricing@2.10.3
  - @medusajs/product@2.10.3
  - @medusajs/analytics-local@2.10.3
  - @medusajs/analytics-posthog@2.10.3
  - @medusajs/auth-emailpass@2.10.3
  - @medusajs/auth-github@2.10.3
  - @medusajs/auth-google@2.10.3
  - @medusajs/file-local@2.10.3
  - @medusajs/file-s3@2.10.3
  - @medusajs/fulfillment-manual@2.10.3
  - @medusajs/locking-postgres@2.10.3
  - @medusajs/locking-redis@2.10.3
  - @medusajs/notification-local@2.10.3
  - @medusajs/notification-sendgrid@2.10.3
  - @medusajs/payment-stripe@2.10.3
  - @medusajs/region@2.10.3
  - @medusajs/sales-channel@2.10.3
  - @medusajs/settings@2.10.3
  - @medusajs/stock-location@2.10.3
  - @medusajs/store@2.10.3
  - @medusajs/tax@2.10.3
  - @medusajs/user@2.10.3
  - @medusajs/telemetry@2.10.3

## 2.10.2

### Patch Changes

- [#13376](https://github.com/medusajs/medusa/pull/13376) [`0000ed69982b95f4bff80fd6182347291d25f7b8`](https://github.com/medusajs/medusa/commit/0000ed69982b95f4bff80fd6182347291d25f7b8) Thanks [@fPolic](https://github.com/fPolic)! - fix(draft-order,medusa,types): draft order promotion UI polish

- [#13312](https://github.com/medusajs/medusa/pull/13312) [`b4c0f131b70ba950339c1ca4d81b5ce062a588a3`](https://github.com/medusajs/medusa/commit/b4c0f131b70ba950339c1ca4d81b5ce062a588a3) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(framework): load custom flags before medusa config

- [#13469](https://github.com/medusajs/medusa/pull/13469) [`d622c61ce2008f3efdfbbaa4154c4329d7978d2b`](https://github.com/medusajs/medusa/commit/d622c61ce2008f3efdfbbaa4154c4329d7978d2b) Thanks [@v0eak](https://github.com/v0eak)! - chore(medusa): add metadata field to AdminCreateInvite

- [#13429](https://github.com/medusajs/medusa/pull/13429) [`637d4cf7ef792622830d49446283d3c578c4f09c`](https://github.com/medusajs/medusa/commit/637d4cf7ef792622830d49446283d3c578c4f09c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Fix issue with missing DB traces

- [#13487](https://github.com/medusajs/medusa/pull/13487) [`4fded2602bfbb63c8d648d2af717c2eb3bbb6f49`](https://github.com/medusajs/medusa/commit/4fded2602bfbb63c8d648d2af717c2eb3bbb6f49) Thanks [@willbouch](https://github.com/willbouch)! - fix(medusa,product): fix ordering product categories

- [#13375](https://github.com/medusajs/medusa/pull/13375) [`8e119988950479345c90e88b541198eba53496a3`](https://github.com/medusajs/medusa/commit/8e119988950479345c90e88b541198eba53496a3) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Use default logger in plugin:develop

- [#13477](https://github.com/medusajs/medusa/pull/13477) [`29dca1ca481e34cc17678b7b4f0e854d3a404acd`](https://github.com/medusajs/medusa/commit/29dca1ca481e34cc17678b7b4f0e854d3a404acd) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): update cart line item route fetching

- [#13438](https://github.com/medusajs/medusa/pull/13438) [`e0943f3c9012a4a7b63c455bc23ade6ada26b33e`](https://github.com/medusajs/medusa/commit/e0943f3c9012a4a7b63c455bc23ade6ada26b33e) Thanks [@willbouch](https://github.com/willbouch)! - "fix(medusa): stop loading entry points in exec command

- Updated dependencies [[`e8822f3e693bde33fdfd8b0d6140b4e59b40af98`](https://github.com/medusajs/medusa/commit/e8822f3e693bde33fdfd8b0d6140b4e59b40af98), [`0000ed69982b95f4bff80fd6182347291d25f7b8`](https://github.com/medusajs/medusa/commit/0000ed69982b95f4bff80fd6182347291d25f7b8), [`71d8a0031f2b75de24c4c4e80ef3314661020420`](https://github.com/medusajs/medusa/commit/71d8a0031f2b75de24c4c4e80ef3314661020420), [`2b89510df3b87c153beae5207b1f9184002129d7`](https://github.com/medusajs/medusa/commit/2b89510df3b87c153beae5207b1f9184002129d7), [`de9a21a9da38b82c6de28bd6272c9e87ca72bccc`](https://github.com/medusajs/medusa/commit/de9a21a9da38b82c6de28bd6272c9e87ca72bccc), [`d828005354587d248f699656d04c7cb4cbe1fc87`](https://github.com/medusajs/medusa/commit/d828005354587d248f699656d04c7cb4cbe1fc87), [`49a4caa62daf9f12eda0999c236bb39ea01fccb9`](https://github.com/medusajs/medusa/commit/49a4caa62daf9f12eda0999c236bb39ea01fccb9), [`bd206cb2505a832d0e426040f7a8cf10a947d346`](https://github.com/medusajs/medusa/commit/bd206cb2505a832d0e426040f7a8cf10a947d346), [`8dd9ae3d35b90b54f3490df3e0da61180f671ca4`](https://github.com/medusajs/medusa/commit/8dd9ae3d35b90b54f3490df3e0da61180f671ca4), [`b4c0f131b70ba950339c1ca4d81b5ce062a588a3`](https://github.com/medusajs/medusa/commit/b4c0f131b70ba950339c1ca4d81b5ce062a588a3), [`fb71bc64052ff7ddf4e5a44c6e91e6a3a3636317`](https://github.com/medusajs/medusa/commit/fb71bc64052ff7ddf4e5a44c6e91e6a3a3636317), [`afe21741c43efb3ae233da82eba0227cbc74a6f8`](https://github.com/medusajs/medusa/commit/afe21741c43efb3ae233da82eba0227cbc74a6f8), [`8e849074e44fe3b967dbfb3bbbef527f4aed3eed`](https://github.com/medusajs/medusa/commit/8e849074e44fe3b967dbfb3bbbef527f4aed3eed), [`b776fd55dcd959fdd495dd11ff9b006a31a623ce`](https://github.com/medusajs/medusa/commit/b776fd55dcd959fdd495dd11ff9b006a31a623ce), [`d7692100e7a2b2f078756cac9ca2b33784d3d1ff`](https://github.com/medusajs/medusa/commit/d7692100e7a2b2f078756cac9ca2b33784d3d1ff), [`55a35e47218c65190e36a1a6088031890edc1b14`](https://github.com/medusajs/medusa/commit/55a35e47218c65190e36a1a6088031890edc1b14), [`4fded2602bfbb63c8d648d2af717c2eb3bbb6f49`](https://github.com/medusajs/medusa/commit/4fded2602bfbb63c8d648d2af717c2eb3bbb6f49), [`2fe68a975b75a925e1e16c7e08c245abf63db0c5`](https://github.com/medusajs/medusa/commit/2fe68a975b75a925e1e16c7e08c245abf63db0c5), [`fc4d5f0ac94afaf48fdf39f1d6bd3ac97259a8c5`](https://github.com/medusajs/medusa/commit/fc4d5f0ac94afaf48fdf39f1d6bd3ac97259a8c5), [`ac09b3cbeffc11c76b8e5972ee25688b17e5fa58`](https://github.com/medusajs/medusa/commit/ac09b3cbeffc11c76b8e5972ee25688b17e5fa58), [`58e20fa3fc266cbecc69b45998ef1fadd7056f9a`](https://github.com/medusajs/medusa/commit/58e20fa3fc266cbecc69b45998ef1fadd7056f9a), [`29dca1ca481e34cc17678b7b4f0e854d3a404acd`](https://github.com/medusajs/medusa/commit/29dca1ca481e34cc17678b7b4f0e854d3a404acd), [`368c1d1e1737fb9cd1e60632c8a2c46a2ce34f46`](https://github.com/medusajs/medusa/commit/368c1d1e1737fb9cd1e60632c8a2c46a2ce34f46), [`ca471eb8f45d01cebe3eb65644de1b10e796e7ba`](https://github.com/medusajs/medusa/commit/ca471eb8f45d01cebe3eb65644de1b10e796e7ba), [`a4b72f9a21fd1d278c622fcd45d24bb9bfb1e0a8`](https://github.com/medusajs/medusa/commit/a4b72f9a21fd1d278c622fcd45d24bb9bfb1e0a8), [`823a5c75ff97cf0acbd4ddf00f43ab3b49f0f210`](https://github.com/medusajs/medusa/commit/823a5c75ff97cf0acbd4ddf00f43ab3b49f0f210), [`1b681a79da02aec3f872baa2213a4b2423d73e97`](https://github.com/medusajs/medusa/commit/1b681a79da02aec3f872baa2213a4b2423d73e97)]:
  - @medusajs/api-key@2.10.2
  - @medusajs/cart@2.10.2
  - @medusajs/customer@2.10.2
  - @medusajs/fulfillment@2.10.2
  - @medusajs/inventory@2.10.2
  - @medusajs/notification@2.10.2
  - @medusajs/order@2.10.2
  - @medusajs/payment@2.10.2
  - @medusajs/pricing@2.10.2
  - @medusajs/product@2.10.2
  - @medusajs/draft-order@2.10.2
  - @medusajs/index@2.10.2
  - @medusajs/workflow-engine-inmemory@2.10.2
  - @medusajs/workflow-engine-redis@2.10.2
  - @medusajs/link-modules@2.10.2
  - @medusajs/framework@2.10.2
  - @medusajs/core-flows@2.10.2
  - @medusajs/sales-channel@2.10.2
  - @medusajs/event-bus-local@2.10.2
  - @medusajs/promotion@2.10.2
  - @medusajs/currency@2.10.2
  - @medusajs/admin-bundler@2.10.2
  - @medusajs/analytics@2.10.2
  - @medusajs/auth@2.10.2
  - @medusajs/file@2.10.2
  - @medusajs/locking@2.10.2
  - @medusajs/region@2.10.2
  - @medusajs/settings@2.10.2
  - @medusajs/stock-location@2.10.2
  - @medusajs/store@2.10.2
  - @medusajs/tax@2.10.2
  - @medusajs/user@2.10.2
  - @medusajs/cache-inmemory@2.10.2
  - @medusajs/cache-redis@2.10.2
  - @medusajs/event-bus-redis@2.10.2
  - @medusajs/analytics-local@2.10.2
  - @medusajs/analytics-posthog@2.10.2
  - @medusajs/auth-emailpass@2.10.2
  - @medusajs/auth-github@2.10.2
  - @medusajs/auth-google@2.10.2
  - @medusajs/file-local@2.10.2
  - @medusajs/file-s3@2.10.2
  - @medusajs/fulfillment-manual@2.10.2
  - @medusajs/locking-postgres@2.10.2
  - @medusajs/locking-redis@2.10.2
  - @medusajs/notification-local@2.10.2
  - @medusajs/notification-sendgrid@2.10.2
  - @medusajs/payment-stripe@2.10.2
  - @medusajs/telemetry@2.10.2

## 2.10.1

### Patch Changes

- Updated dependencies [[`8176d0f684be95331ce3bec31d67c5f857f9c85a`](https://github.com/medusajs/medusa/commit/8176d0f684be95331ce3bec31d67c5f857f9c85a)]:
  - @medusajs/core-flows@2.10.1
  - @medusajs/analytics@2.10.1
  - @medusajs/api-key@2.10.1
  - @medusajs/auth@2.10.1
  - @medusajs/cart@2.10.1
  - @medusajs/currency@2.10.1
  - @medusajs/customer@2.10.1
  - @medusajs/file@2.10.1
  - @medusajs/fulfillment@2.10.1
  - @medusajs/index@2.10.1
  - @medusajs/inventory@2.10.1
  - @medusajs/link-modules@2.10.1
  - @medusajs/locking@2.10.1
  - @medusajs/notification@2.10.1
  - @medusajs/order@2.10.1
  - @medusajs/payment@2.10.1
  - @medusajs/pricing@2.10.1
  - @medusajs/product@2.10.1
  - @medusajs/promotion@2.10.1
  - @medusajs/region@2.10.1
  - @medusajs/sales-channel@2.10.1
  - @medusajs/settings@2.10.1
  - @medusajs/stock-location@2.10.1
  - @medusajs/store@2.10.1
  - @medusajs/tax@2.10.1
  - @medusajs/user@2.10.1
  - @medusajs/workflow-engine-inmemory@2.10.1
  - @medusajs/workflow-engine-redis@2.10.1
  - @medusajs/draft-order@2.10.1
  - @medusajs/admin-bundler@2.10.1
  - @medusajs/framework@2.10.1
  - @medusajs/telemetry@2.10.1
  - @medusajs/cache-inmemory@2.10.1
  - @medusajs/cache-redis@2.10.1
  - @medusajs/event-bus-local@2.10.1
  - @medusajs/event-bus-redis@2.10.1
  - @medusajs/analytics-local@2.10.1
  - @medusajs/analytics-posthog@2.10.1
  - @medusajs/auth-emailpass@2.10.1
  - @medusajs/auth-github@2.10.1
  - @medusajs/auth-google@2.10.1
  - @medusajs/file-local@2.10.1
  - @medusajs/file-s3@2.10.1
  - @medusajs/fulfillment-manual@2.10.1
  - @medusajs/locking-postgres@2.10.1
  - @medusajs/locking-redis@2.10.1
  - @medusajs/notification-local@2.10.1
  - @medusajs/notification-sendgrid@2.10.1
  - @medusajs/payment-stripe@2.10.1

## 2.10.0

### Minor Changes

- [#13236](https://github.com/medusajs/medusa/pull/13236) [`9412669e654c994e2dbee9cf61c18004d79f6475`](https://github.com/medusajs/medusa/commit/9412669e654c994e2dbee9cf61c18004d79f6475) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(core-flows): idempotent cart operations and nested workflow deletion lifecycle fix

### Patch Changes

- [#13283](https://github.com/medusajs/medusa/pull/13283) [`e413cfefc2e0579ba7c5299dc4f4270310e39c2c`](https://github.com/medusajs/medusa/commit/e413cfefc2e0579ba7c5299dc4f4270310e39c2c) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: define file config and improved feature flag support

- [#13314](https://github.com/medusajs/medusa/pull/13314) [`cbaa40374480a6254d9e568c3003517308be0a44`](https://github.com/medusajs/medusa/commit/cbaa40374480a6254d9e568c3003517308be0a44) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Enable draft order plugin by default

- [#13226](https://github.com/medusajs/medusa/pull/13226) [`67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad`](https://github.com/medusajs/medusa/commit/67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard, core-flows): associate shipping option to type

- [#13020](https://github.com/medusajs/medusa/pull/13020) [`71818e43cb6c90d26d5173d01c476d2480355110`](https://github.com/medusajs/medusa/commit/71818e43cb6c90d26d5173d01c476d2480355110) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): fetching a product without a category with categories filed passed

- [#13156](https://github.com/medusajs/medusa/pull/13156) [`e2213448ac9eb93318570fde2807a3036108d44b`](https://github.com/medusajs/medusa/commit/e2213448ac9eb93318570fde2807a3036108d44b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: custom logger on medusa-config

- [#13272](https://github.com/medusajs/medusa/pull/13272) [`7f5b9fc5fa47e8e73c7afe54aa1bde4dd035086e`](https://github.com/medusajs/medusa/commit/7f5b9fc5fa47e8e73c7afe54aa1bde4dd035086e) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,dashboard): Retrieve `metadata` for product_tags by default and add metadta UI to product tag domain in admin dashboard

- [#13191](https://github.com/medusajs/medusa/pull/13191) [`34c3c14e0a1491ab80473605018b97981544167d`](https://github.com/medusajs/medusa/commit/34c3c14e0a1491ab80473605018b97981544167d) Thanks [@willbouch](https://github.com/willbouch)! - chore(types, api): support shipping option type api endpoints

- [#13242](https://github.com/medusajs/medusa/pull/13242) [`492e0189573ffad4977a3559d71f39bf94d8b45d`](https://github.com/medusajs/medusa/commit/492e0189573ffad4977a3559d71f39bf94d8b45d) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard,core-flows,js-sdk,types,medusa): listing order's shipping option

- [#13244](https://github.com/medusajs/medusa/pull/13244) [`6602e893b88f1c8f0c8165101dd609baaf60d925`](https://github.com/medusajs/medusa/commit/6602e893b88f1c8f0c8165101dd609baaf60d925) Thanks [@willbouch](https://github.com/willbouch)! - chore(medusa): fetch shipping related attributes

- Updated dependencies [[`486621383a79e83c831933c1a0ffdae58a695cb0`](https://github.com/medusajs/medusa/commit/486621383a79e83c831933c1a0ffdae58a695cb0), [`2f594291ad8d227b499b80a5bfe66f5963d42d6a`](https://github.com/medusajs/medusa/commit/2f594291ad8d227b499b80a5bfe66f5963d42d6a), [`5382afccfa0740bba04372a8613c537ff6a69cbe`](https://github.com/medusajs/medusa/commit/5382afccfa0740bba04372a8613c537ff6a69cbe), [`e413cfefc2e0579ba7c5299dc4f4270310e39c2c`](https://github.com/medusajs/medusa/commit/e413cfefc2e0579ba7c5299dc4f4270310e39c2c), [`cbaa40374480a6254d9e568c3003517308be0a44`](https://github.com/medusajs/medusa/commit/cbaa40374480a6254d9e568c3003517308be0a44), [`67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad`](https://github.com/medusajs/medusa/commit/67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad), [`338a42f72808052f8d4dcbda8e070b97048bac87`](https://github.com/medusajs/medusa/commit/338a42f72808052f8d4dcbda8e070b97048bac87), [`9412669e654c994e2dbee9cf61c18004d79f6475`](https://github.com/medusajs/medusa/commit/9412669e654c994e2dbee9cf61c18004d79f6475), [`57077406f9ce5d3bc1008b643a055f294de838eb`](https://github.com/medusajs/medusa/commit/57077406f9ce5d3bc1008b643a055f294de838eb), [`059bfc147590b01458432539be4a7746bc433c51`](https://github.com/medusajs/medusa/commit/059bfc147590b01458432539be4a7746bc433c51), [`83d2ce762c952c01b8d3e83cc64fd95c9e9573f5`](https://github.com/medusajs/medusa/commit/83d2ce762c952c01b8d3e83cc64fd95c9e9573f5), [`b111d01898a621c4280457021677d9b89e20e10d`](https://github.com/medusajs/medusa/commit/b111d01898a621c4280457021677d9b89e20e10d), [`f764b3a36471a0ad9e9e05f125183464680e3a2d`](https://github.com/medusajs/medusa/commit/f764b3a36471a0ad9e9e05f125183464680e3a2d), [`a0fca165701a85f0f2b71efa590ee42f0cc2fd69`](https://github.com/medusajs/medusa/commit/a0fca165701a85f0f2b71efa590ee42f0cc2fd69), [`06ef9197f825c78b9d8d3e1f4f3a0ca995853331`](https://github.com/medusajs/medusa/commit/06ef9197f825c78b9d8d3e1f4f3a0ca995853331), [`fc4925327334c540c0125a91e81794c3c1f340e7`](https://github.com/medusajs/medusa/commit/fc4925327334c540c0125a91e81794c3c1f340e7), [`e2213448ac9eb93318570fde2807a3036108d44b`](https://github.com/medusajs/medusa/commit/e2213448ac9eb93318570fde2807a3036108d44b), [`6b04fbcc50cef6bbe2b65269d1b7d88949e4fa37`](https://github.com/medusajs/medusa/commit/6b04fbcc50cef6bbe2b65269d1b7d88949e4fa37), [`34c3c14e0a1491ab80473605018b97981544167d`](https://github.com/medusajs/medusa/commit/34c3c14e0a1491ab80473605018b97981544167d), [`ff152e7ace60232c02932bbd06a759e555a823d4`](https://github.com/medusajs/medusa/commit/ff152e7ace60232c02932bbd06a759e555a823d4), [`eb376eb4cf9cc6fe0ce2a6724e0df81b27bc7b87`](https://github.com/medusajs/medusa/commit/eb376eb4cf9cc6fe0ce2a6724e0df81b27bc7b87), [`4b3c43fe92d99a98b3d7b9ee6705114de01cbc5d`](https://github.com/medusajs/medusa/commit/4b3c43fe92d99a98b3d7b9ee6705114de01cbc5d), [`492e0189573ffad4977a3559d71f39bf94d8b45d`](https://github.com/medusajs/medusa/commit/492e0189573ffad4977a3559d71f39bf94d8b45d), [`6264a6262b0220c70ad35c0d56a93a39218ccb80`](https://github.com/medusajs/medusa/commit/6264a6262b0220c70ad35c0d56a93a39218ccb80), [`be62cf87c7ed975bd0880133588cc806751715cb`](https://github.com/medusajs/medusa/commit/be62cf87c7ed975bd0880133588cc806751715cb)]:
  - @medusajs/link-modules@2.10.0
  - @medusajs/promotion@2.10.0
  - @medusajs/core-flows@2.10.0
  - @medusajs/framework@2.10.0
  - @medusajs/draft-order@2.10.0
  - @medusajs/fulfillment@2.10.0
  - @medusajs/workflow-engine-inmemory@2.10.0
  - @medusajs/workflow-engine-redis@2.10.0
  - @medusajs/locking-redis@2.10.0
  - @medusajs/index@2.10.0
  - @medusajs/pricing@2.10.0
  - @medusajs/event-bus-local@2.10.0
  - @medusajs/event-bus-redis@2.10.0
  - @medusajs/admin-bundler@2.10.0
  - @medusajs/analytics@2.10.0
  - @medusajs/api-key@2.10.0
  - @medusajs/auth@2.10.0
  - @medusajs/cache-inmemory@2.10.0
  - @medusajs/cache-redis@2.10.0
  - @medusajs/cart@2.10.0
  - @medusajs/currency@2.10.0
  - @medusajs/customer@2.10.0
  - @medusajs/file@2.10.0
  - @medusajs/inventory@2.10.0
  - @medusajs/locking@2.10.0
  - @medusajs/notification@2.10.0
  - @medusajs/order@2.10.0
  - @medusajs/payment@2.10.0
  - @medusajs/product@2.10.0
  - @medusajs/analytics-local@2.10.0
  - @medusajs/analytics-posthog@2.10.0
  - @medusajs/auth-emailpass@2.10.0
  - @medusajs/auth-github@2.10.0
  - @medusajs/auth-google@2.10.0
  - @medusajs/file-local@2.10.0
  - @medusajs/file-s3@2.10.0
  - @medusajs/fulfillment-manual@2.10.0
  - @medusajs/locking-postgres@2.10.0
  - @medusajs/notification-local@2.10.0
  - @medusajs/notification-sendgrid@2.10.0
  - @medusajs/payment-stripe@2.10.0
  - @medusajs/region@2.10.0
  - @medusajs/sales-channel@2.10.0
  - @medusajs/settings@2.10.0
  - @medusajs/stock-location@2.10.0
  - @medusajs/store@2.10.0
  - @medusajs/tax@2.10.0
  - @medusajs/user@2.10.0
  - @medusajs/telemetry@2.10.0

## 2.9.0

### Patch Changes

- [#12960](https://github.com/medusajs/medusa/pull/12960) [`1bdf602f1c1da181e2839858d2f7e8aea503573a`](https://github.com/medusajs/medusa/commit/1bdf602f1c1da181e2839858d2f7e8aea503573a) Thanks [@scherddel](https://github.com/scherddel)! - This fixes the discount\_ calculation logic and promotion tax inclusiveness calculation

- Updated dependencies [[`9fb5baa912674b6d35492b147e0f22d8f8330a24`](https://github.com/medusajs/medusa/commit/9fb5baa912674b6d35492b147e0f22d8f8330a24), [`02dd83f59a0f02badd99f6e05c083aabbe6daa96`](https://github.com/medusajs/medusa/commit/02dd83f59a0f02badd99f6e05c083aabbe6daa96), [`9725bff25d321011da7ba5096fe0946c5a8f0059`](https://github.com/medusajs/medusa/commit/9725bff25d321011da7ba5096fe0946c5a8f0059), [`93d7a93b2806d7e7660a6702c9e9b60d01dfe936`](https://github.com/medusajs/medusa/commit/93d7a93b2806d7e7660a6702c9e9b60d01dfe936), [`f6736d96616aaff51399b2733905f9e340efc8be`](https://github.com/medusajs/medusa/commit/f6736d96616aaff51399b2733905f9e340efc8be), [`acf6bbc2ec1d90e3b0100c86f56e96b38fa7c67a`](https://github.com/medusajs/medusa/commit/acf6bbc2ec1d90e3b0100c86f56e96b38fa7c67a), [`1bdf602f1c1da181e2839858d2f7e8aea503573a`](https://github.com/medusajs/medusa/commit/1bdf602f1c1da181e2839858d2f7e8aea503573a), [`75320e744f680afba06d8ad852f169242736fb19`](https://github.com/medusajs/medusa/commit/75320e744f680afba06d8ad852f169242736fb19), [`6e66e36d0814a524440c05a99c849c3d62e48ed3`](https://github.com/medusajs/medusa/commit/6e66e36d0814a524440c05a99c849c3d62e48ed3), [`9766570827ebf50d49d8daf956deecce6666a8cc`](https://github.com/medusajs/medusa/commit/9766570827ebf50d49d8daf956deecce6666a8cc), [`b1cba9fdeba901c9d4c7bddd414ed2fd085fa7b0`](https://github.com/medusajs/medusa/commit/b1cba9fdeba901c9d4c7bddd414ed2fd085fa7b0)]:
  - @medusajs/core-flows@2.9.0
  - @medusajs/pricing@2.9.0
  - @medusajs/index@2.9.0
  - @medusajs/link-modules@2.9.0
  - @medusajs/promotion@2.9.0
  - @medusajs/cart@2.9.0
  - @medusajs/workflow-engine-inmemory@2.9.0
  - @medusajs/framework@2.9.0
  - @medusajs/admin-bundler@2.9.0
  - @medusajs/analytics@2.9.0
  - @medusajs/api-key@2.9.0
  - @medusajs/auth@2.9.0
  - @medusajs/cache-inmemory@2.9.0
  - @medusajs/cache-redis@2.9.0
  - @medusajs/currency@2.9.0
  - @medusajs/customer@2.9.0
  - @medusajs/event-bus-local@2.9.0
  - @medusajs/event-bus-redis@2.9.0
  - @medusajs/file@2.9.0
  - @medusajs/fulfillment@2.9.0
  - @medusajs/inventory@2.9.0
  - @medusajs/locking@2.9.0
  - @medusajs/notification@2.9.0
  - @medusajs/order@2.9.0
  - @medusajs/payment@2.9.0
  - @medusajs/product@2.9.0
  - @medusajs/analytics-local@2.9.0
  - @medusajs/analytics-posthog@2.9.0
  - @medusajs/auth-emailpass@2.9.0
  - @medusajs/auth-github@2.9.0
  - @medusajs/auth-google@2.9.0
  - @medusajs/file-local@2.9.0
  - @medusajs/file-s3@2.9.0
  - @medusajs/fulfillment-manual@2.9.0
  - @medusajs/locking-postgres@2.9.0
  - @medusajs/locking-redis@2.9.0
  - @medusajs/notification-local@2.9.0
  - @medusajs/notification-sendgrid@2.9.0
  - @medusajs/payment-stripe@2.9.0
  - @medusajs/region@2.9.0
  - @medusajs/sales-channel@2.9.0
  - @medusajs/stock-location@2.9.0
  - @medusajs/store@2.9.0
  - @medusajs/tax@2.9.0
  - @medusajs/user@2.9.0
  - @medusajs/workflow-engine-redis@2.9.0
  - @medusajs/telemetry@2.9.0

## 2.8.8

### Patch Changes

- Updated dependencies [[`a28226af80a8880afbdb926a5001f0cb0d89fdc9`](https://github.com/medusajs/medusa/commit/a28226af80a8880afbdb926a5001f0cb0d89fdc9), [`40625c82d6deb28ecb4e4c0f911c28fdd7356bf7`](https://github.com/medusajs/medusa/commit/40625c82d6deb28ecb4e4c0f911c28fdd7356bf7), [`822217fa366d4399d3f6a0407451c9649197d5d9`](https://github.com/medusajs/medusa/commit/822217fa366d4399d3f6a0407451c9649197d5d9), [`97a8e5cb2e8819672803bfcd9cde19cb1ce1acc0`](https://github.com/medusajs/medusa/commit/97a8e5cb2e8819672803bfcd9cde19cb1ce1acc0), [`7b1debfe12fc096f7b4e20f13bdeb925c96085c1`](https://github.com/medusajs/medusa/commit/7b1debfe12fc096f7b4e20f13bdeb925c96085c1), [`43fb06ecc2d87ea2a11e12524679c142eb890ec7`](https://github.com/medusajs/medusa/commit/43fb06ecc2d87ea2a11e12524679c142eb890ec7), [`eb83954f23077c0714125b6f2f19fd0ef0f288f9`](https://github.com/medusajs/medusa/commit/eb83954f23077c0714125b6f2f19fd0ef0f288f9), [`8c4228fc42e717f9ab72230040e708f606a585b7`](https://github.com/medusajs/medusa/commit/8c4228fc42e717f9ab72230040e708f606a585b7), [`439c7118450c5f9ee0b541de9014093a42b7d0ea`](https://github.com/medusajs/medusa/commit/439c7118450c5f9ee0b541de9014093a42b7d0ea), [`238e7d53c13a1c033886d7c33254919f8b5b22dc`](https://github.com/medusajs/medusa/commit/238e7d53c13a1c033886d7c33254919f8b5b22dc), [`7669dbb03e2f65fa76cff1c5b90a0777e475cb47`](https://github.com/medusajs/medusa/commit/7669dbb03e2f65fa76cff1c5b90a0777e475cb47), [`2c2528a08751945d6f0363473605f1a8ef1a8a2a`](https://github.com/medusajs/medusa/commit/2c2528a08751945d6f0363473605f1a8ef1a8a2a), [`798ac0068ed841d31f6aefc11c58738dc6bf8bd0`](https://github.com/medusajs/medusa/commit/798ac0068ed841d31f6aefc11c58738dc6bf8bd0)]:
  - @medusajs/core-flows@2.8.8
  - @medusajs/pricing@2.8.8
  - @medusajs/link-modules@2.8.8
  - @medusajs/workflow-engine-inmemory@2.8.8
  - @medusajs/framework@2.8.8
  - @medusajs/workflow-engine-redis@2.8.8
  - @medusajs/product@2.8.8
  - @medusajs/payment@2.8.8
  - @medusajs/admin-bundler@2.8.8
  - @medusajs/analytics@2.8.8
  - @medusajs/api-key@2.8.8
  - @medusajs/auth@2.8.8
  - @medusajs/cache-inmemory@2.8.8
  - @medusajs/cache-redis@2.8.8
  - @medusajs/cart@2.8.8
  - @medusajs/currency@2.8.8
  - @medusajs/customer@2.8.8
  - @medusajs/event-bus-local@2.8.8
  - @medusajs/event-bus-redis@2.8.8
  - @medusajs/file@2.8.8
  - @medusajs/fulfillment@2.8.8
  - @medusajs/index@2.8.8
  - @medusajs/inventory@2.8.8
  - @medusajs/locking@2.8.8
  - @medusajs/notification@2.8.8
  - @medusajs/order@2.8.8
  - @medusajs/promotion@2.8.8
  - @medusajs/analytics-local@2.8.8
  - @medusajs/analytics-posthog@2.8.8
  - @medusajs/auth-emailpass@2.8.8
  - @medusajs/auth-github@2.8.8
  - @medusajs/auth-google@2.8.8
  - @medusajs/file-local@2.8.8
  - @medusajs/file-s3@2.8.8
  - @medusajs/fulfillment-manual@2.8.8
  - @medusajs/locking-postgres@2.8.8
  - @medusajs/locking-redis@2.8.8
  - @medusajs/notification-local@2.8.8
  - @medusajs/notification-sendgrid@2.8.8
  - @medusajs/payment-stripe@2.8.8
  - @medusajs/region@2.8.8
  - @medusajs/sales-channel@2.8.8
  - @medusajs/stock-location@2.8.8
  - @medusajs/store@2.8.8
  - @medusajs/tax@2.8.8
  - @medusajs/user@2.8.8
  - @medusajs/telemetry@2.8.8

## 2.8.7

### Patch Changes

- [#12885](https://github.com/medusajs/medusa/pull/12885) [`42be9a88d61a11db7aebde2d6f4d96d43f54ea79`](https://github.com/medusajs/medusa/commit/42be9a88d61a11db7aebde2d6f4d96d43f54ea79) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix: Update TIP on promotions

- Updated dependencies [[`46bf7ae7aead3f33485ce8adebb602eda305088c`](https://github.com/medusajs/medusa/commit/46bf7ae7aead3f33485ce8adebb602eda305088c), [`2f70f133511857b499a992b65a0a4d6170e03ab9`](https://github.com/medusajs/medusa/commit/2f70f133511857b499a992b65a0a4d6170e03ab9), [`fa76f85bba253528964bacf86c061fef6d3d0742`](https://github.com/medusajs/medusa/commit/fa76f85bba253528964bacf86c061fef6d3d0742)]:
  - @medusajs/core-flows@2.8.7
  - @medusajs/api-key@2.8.7
  - @medusajs/auth@2.8.7
  - @medusajs/cart@2.8.7
  - @medusajs/currency@2.8.7
  - @medusajs/file@2.8.7
  - @medusajs/fulfillment@2.8.7
  - @medusajs/index@2.8.7
  - @medusajs/inventory@2.8.7
  - @medusajs/locking@2.8.7
  - @medusajs/notification@2.8.7
  - @medusajs/order@2.8.7
  - @medusajs/payment@2.8.7
  - @medusajs/pricing@2.8.7
  - @medusajs/product@2.8.7
  - @medusajs/promotion@2.8.7
  - @medusajs/region@2.8.7
  - @medusajs/sales-channel@2.8.7
  - @medusajs/stock-location@2.8.7
  - @medusajs/store@2.8.7
  - @medusajs/locking-postgres@2.8.7
  - @medusajs/admin-bundler@2.8.7
  - @medusajs/analytics@2.8.7
  - @medusajs/customer@2.8.7
  - @medusajs/link-modules@2.8.7
  - @medusajs/tax@2.8.7
  - @medusajs/user@2.8.7
  - @medusajs/workflow-engine-inmemory@2.8.7
  - @medusajs/workflow-engine-redis@2.8.7
  - @medusajs/framework@2.8.7
  - @medusajs/cache-inmemory@2.8.7
  - @medusajs/cache-redis@2.8.7
  - @medusajs/event-bus-local@2.8.7
  - @medusajs/event-bus-redis@2.8.7
  - @medusajs/analytics-local@2.8.7
  - @medusajs/analytics-posthog@2.8.7
  - @medusajs/auth-emailpass@2.8.7
  - @medusajs/auth-github@2.8.7
  - @medusajs/auth-google@2.8.7
  - @medusajs/file-local@2.8.7
  - @medusajs/file-s3@2.8.7
  - @medusajs/fulfillment-manual@2.8.7
  - @medusajs/locking-redis@2.8.7
  - @medusajs/notification-local@2.8.7
  - @medusajs/notification-sendgrid@2.8.7
  - @medusajs/payment-stripe@2.8.7
  - @medusajs/telemetry@2.8.7

## 2.8.6

### Patch Changes

- Updated dependencies [[`9a62f359f1c954bcc09c57e4660f90d4b010e51c`](https://github.com/medusajs/medusa/commit/9a62f359f1c954bcc09c57e4660f90d4b010e51c), [`95d282e8ef8f2185737d493dea8b6f1677684543`](https://github.com/medusajs/medusa/commit/95d282e8ef8f2185737d493dea8b6f1677684543), [`10dff3e26663bf23e3154f7d7c79b53280d57e8e`](https://github.com/medusajs/medusa/commit/10dff3e26663bf23e3154f7d7c79b53280d57e8e)]:
  - @medusajs/core-flows@2.8.6
  - @medusajs/workflow-engine-inmemory@2.8.6
  - @medusajs/workflow-engine-redis@2.8.6
  - @medusajs/file-s3@2.8.6
  - @medusajs/framework@2.8.6
  - @medusajs/analytics@2.8.6
  - @medusajs/api-key@2.8.6
  - @medusajs/auth@2.8.6
  - @medusajs/cart@2.8.6
  - @medusajs/currency@2.8.6
  - @medusajs/customer@2.8.6
  - @medusajs/file@2.8.6
  - @medusajs/fulfillment@2.8.6
  - @medusajs/index@2.8.6
  - @medusajs/inventory@2.8.6
  - @medusajs/link-modules@2.8.6
  - @medusajs/locking@2.8.6
  - @medusajs/notification@2.8.6
  - @medusajs/order@2.8.6
  - @medusajs/payment@2.8.6
  - @medusajs/pricing@2.8.6
  - @medusajs/product@2.8.6
  - @medusajs/promotion@2.8.6
  - @medusajs/region@2.8.6
  - @medusajs/sales-channel@2.8.6
  - @medusajs/stock-location@2.8.6
  - @medusajs/store@2.8.6
  - @medusajs/tax@2.8.6
  - @medusajs/user@2.8.6
  - @medusajs/cache-inmemory@2.8.6
  - @medusajs/cache-redis@2.8.6
  - @medusajs/event-bus-local@2.8.6
  - @medusajs/event-bus-redis@2.8.6
  - @medusajs/analytics-local@2.8.6
  - @medusajs/analytics-posthog@2.8.6
  - @medusajs/auth-emailpass@2.8.6
  - @medusajs/auth-github@2.8.6
  - @medusajs/auth-google@2.8.6
  - @medusajs/file-local@2.8.6
  - @medusajs/fulfillment-manual@2.8.6
  - @medusajs/locking-postgres@2.8.6
  - @medusajs/locking-redis@2.8.6
  - @medusajs/notification-local@2.8.6
  - @medusajs/notification-sendgrid@2.8.6
  - @medusajs/payment-stripe@2.8.6
  - @medusajs/admin-bundler@2.8.6
  - @medusajs/telemetry@2.8.6

## 2.8.5

### Patch Changes

- [#12815](https://github.com/medusajs/medusa/pull/12815) [`6ca755ede7bfe3211464447412ca0d97e1207742`](https://github.com/medusajs/medusa/commit/6ca755ede7bfe3211464447412ca0d97e1207742) Thanks [@anteprimorac](https://github.com/anteprimorac)! - Enable filtering admin products API by variant EAN, UPC, and barcode

- [#12713](https://github.com/medusajs/medusa/pull/12713) [`cbf3644eb7c8a24eaed879647b58c9ece3373c0e`](https://github.com/medusajs/medusa/commit/cbf3644eb7c8a24eaed879647b58c9ece3373c0e) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Add retry strategy to database connection

- [#12813](https://github.com/medusajs/medusa/pull/12813) [`d517dbd66a47817d1270c278b03add9a5c4244cb`](https://github.com/medusajs/medusa/commit/d517dbd66a47817d1270c278b03add9a5c4244cb) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Add support for jwt asymetric keys

- [#12412](https://github.com/medusajs/medusa/pull/12412) [`2621f00bb035a6b909f9498a2bc98fdba8570ba9`](https://github.com/medusajs/medusa/commit/2621f00bb035a6b909f9498a2bc98fdba8570ba9) Thanks [@fPolic](https://github.com/fPolic)! - feat(promotion, dashboard, core-flows, cart, types, utils, medusa): tax inclusive promotions

- [#12761](https://github.com/medusajs/medusa/pull/12761) [`94b62c67249d13ec6342411cf7efdedfd0ac47e1`](https://github.com/medusajs/medusa/commit/94b62c67249d13ec6342411cf7efdedfd0ac47e1) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: fallback to console with req.scope is undefined

- Updated dependencies [[`ab634a14ba709f1b1d12eb4cd5c7f3db6bfe6470`](https://github.com/medusajs/medusa/commit/ab634a14ba709f1b1d12eb4cd5c7f3db6bfe6470), [`ba1e6595b74ae69f4ee066d545f8def8aff77dd3`](https://github.com/medusajs/medusa/commit/ba1e6595b74ae69f4ee066d545f8def8aff77dd3), [`f2cb528a5650fe112ca8eeb4bdffc5f0b217338a`](https://github.com/medusajs/medusa/commit/f2cb528a5650fe112ca8eeb4bdffc5f0b217338a), [`cbf3644eb7c8a24eaed879647b58c9ece3373c0e`](https://github.com/medusajs/medusa/commit/cbf3644eb7c8a24eaed879647b58c9ece3373c0e), [`d517dbd66a47817d1270c278b03add9a5c4244cb`](https://github.com/medusajs/medusa/commit/d517dbd66a47817d1270c278b03add9a5c4244cb), [`820a936b9836ae83e7a45de1e1ed0488d8cde2fd`](https://github.com/medusajs/medusa/commit/820a936b9836ae83e7a45de1e1ed0488d8cde2fd), [`2621f00bb035a6b909f9498a2bc98fdba8570ba9`](https://github.com/medusajs/medusa/commit/2621f00bb035a6b909f9498a2bc98fdba8570ba9), [`672871b733c6e82bd9e68cf90300ff78cf44727a`](https://github.com/medusajs/medusa/commit/672871b733c6e82bd9e68cf90300ff78cf44727a), [`bd6d9777c50d69115a20334a103a8ab9997b259d`](https://github.com/medusajs/medusa/commit/bd6d9777c50d69115a20334a103a8ab9997b259d), [`316a325b63e92003df25452faf88e577e9133064`](https://github.com/medusajs/medusa/commit/316a325b63e92003df25452faf88e577e9133064), [`00505b4f8e49873123111752adfda47ccb35ab46`](https://github.com/medusajs/medusa/commit/00505b4f8e49873123111752adfda47ccb35ab46), [`7a8f639b382e20328879ce6d9e93ea2c79f380b5`](https://github.com/medusajs/medusa/commit/7a8f639b382e20328879ce6d9e93ea2c79f380b5), [`94b62c67249d13ec6342411cf7efdedfd0ac47e1`](https://github.com/medusajs/medusa/commit/94b62c67249d13ec6342411cf7efdedfd0ac47e1), [`1a7847660890ae84648123567ce8dc4c9a0eca03`](https://github.com/medusajs/medusa/commit/1a7847660890ae84648123567ce8dc4c9a0eca03)]:
  - @medusajs/auth@2.8.5
  - @medusajs/customer@2.8.5
  - @medusajs/fulfillment@2.8.5
  - @medusajs/inventory@2.8.5
  - @medusajs/payment@2.8.5
  - @medusajs/file-local@2.8.5
  - @medusajs/core-flows@2.8.5
  - @medusajs/framework@2.8.5
  - @medusajs/user@2.8.5
  - @medusajs/auth-google@2.8.5
  - @medusajs/promotion@2.8.5
  - @medusajs/cart@2.8.5
  - @medusajs/workflow-engine-inmemory@2.8.5
  - @medusajs/workflow-engine-redis@2.8.5
  - @medusajs/admin-bundler@2.8.5
  - @medusajs/analytics@2.8.5
  - @medusajs/api-key@2.8.5
  - @medusajs/currency@2.8.5
  - @medusajs/file@2.8.5
  - @medusajs/index@2.8.5
  - @medusajs/link-modules@2.8.5
  - @medusajs/locking@2.8.5
  - @medusajs/notification@2.8.5
  - @medusajs/order@2.8.5
  - @medusajs/pricing@2.8.5
  - @medusajs/product@2.8.5
  - @medusajs/region@2.8.5
  - @medusajs/sales-channel@2.8.5
  - @medusajs/stock-location@2.8.5
  - @medusajs/store@2.8.5
  - @medusajs/tax@2.8.5
  - @medusajs/cache-inmemory@2.8.5
  - @medusajs/cache-redis@2.8.5
  - @medusajs/event-bus-local@2.8.5
  - @medusajs/event-bus-redis@2.8.5
  - @medusajs/analytics-local@2.8.5
  - @medusajs/analytics-posthog@2.8.5
  - @medusajs/auth-emailpass@2.8.5
  - @medusajs/auth-github@2.8.5
  - @medusajs/file-s3@2.8.5
  - @medusajs/fulfillment-manual@2.8.5
  - @medusajs/locking-postgres@2.8.5
  - @medusajs/locking-redis@2.8.5
  - @medusajs/notification-local@2.8.5
  - @medusajs/notification-sendgrid@2.8.5
  - @medusajs/payment-stripe@2.8.5
  - @medusajs/telemetry@2.8.5

## 2.8.4

### Patch Changes

- Updated dependencies [[`7685d66c0775167994150e61a8b628ad6289ce23`](https://github.com/medusajs/medusa/commit/7685d66c0775167994150e61a8b628ad6289ce23), [`820965e21aa7b7cfb57936ef903c6d1f5a7a7a77`](https://github.com/medusajs/medusa/commit/820965e21aa7b7cfb57936ef903c6d1f5a7a7a77), [`791276e80f5745c8885352b7979c0faa979110f4`](https://github.com/medusajs/medusa/commit/791276e80f5745c8885352b7979c0faa979110f4), [`c4dd29046183bfe3c99b7ec00414449e53478d22`](https://github.com/medusajs/medusa/commit/c4dd29046183bfe3c99b7ec00414449e53478d22), [`490bd7647fca30951d14c7c78c1b809379ebd870`](https://github.com/medusajs/medusa/commit/490bd7647fca30951d14c7c78c1b809379ebd870), [`cf0297f74af1b043363ffbd5a23ca0933097a69d`](https://github.com/medusajs/medusa/commit/cf0297f74af1b043363ffbd5a23ca0933097a69d), [`1f5f50010ae42f8d5b9924edcd75612b1f336463`](https://github.com/medusajs/medusa/commit/1f5f50010ae42f8d5b9924edcd75612b1f336463)]:
  - @medusajs/framework@2.8.4
  - @medusajs/analytics@2.8.4
  - @medusajs/file@2.8.4
  - @medusajs/file-local@2.8.4
  - @medusajs/file-s3@2.8.4
  - @medusajs/core-flows@2.8.4
  - @medusajs/api-key@2.8.4
  - @medusajs/auth@2.8.4
  - @medusajs/cache-inmemory@2.8.4
  - @medusajs/cache-redis@2.8.4
  - @medusajs/cart@2.8.4
  - @medusajs/currency@2.8.4
  - @medusajs/customer@2.8.4
  - @medusajs/event-bus-local@2.8.4
  - @medusajs/event-bus-redis@2.8.4
  - @medusajs/fulfillment@2.8.4
  - @medusajs/index@2.8.4
  - @medusajs/inventory@2.8.4
  - @medusajs/link-modules@2.8.4
  - @medusajs/locking@2.8.4
  - @medusajs/notification@2.8.4
  - @medusajs/order@2.8.4
  - @medusajs/payment@2.8.4
  - @medusajs/pricing@2.8.4
  - @medusajs/product@2.8.4
  - @medusajs/promotion@2.8.4
  - @medusajs/analytics-local@2.8.4
  - @medusajs/analytics-posthog@2.8.4
  - @medusajs/auth-emailpass@2.8.4
  - @medusajs/auth-github@2.8.4
  - @medusajs/auth-google@2.8.4
  - @medusajs/fulfillment-manual@2.8.4
  - @medusajs/locking-postgres@2.8.4
  - @medusajs/locking-redis@2.8.4
  - @medusajs/notification-local@2.8.4
  - @medusajs/notification-sendgrid@2.8.4
  - @medusajs/payment-stripe@2.8.4
  - @medusajs/region@2.8.4
  - @medusajs/sales-channel@2.8.4
  - @medusajs/stock-location@2.8.4
  - @medusajs/store@2.8.4
  - @medusajs/tax@2.8.4
  - @medusajs/user@2.8.4
  - @medusajs/workflow-engine-inmemory@2.8.4
  - @medusajs/workflow-engine-redis@2.8.4
  - @medusajs/admin-bundler@2.8.4
  - @medusajs/telemetry@2.8.4

## 2.8.3

### Patch Changes

- [#12539](https://github.com/medusajs/medusa/pull/12539) [`d9fdabe96d05108355c01081ea15d39467e40268`](https://github.com/medusajs/medusa/commit/d9fdabe96d05108355c01081ea15d39467e40268) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: mark posthog-node as a peer dependency

- [#12527](https://github.com/medusajs/medusa/pull/12527) [`fca5ad77b41856867ec68b1e46d04f1bb71cbc76`](https://github.com/medusajs/medusa/commit/fca5ad77b41856867ec68b1e46d04f1bb71cbc76) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: process import from pre-processed chunks

- [#12467](https://github.com/medusajs/medusa/pull/12467) [`32be40a2c09be2f793b5d348a3dd62e9312f46c9`](https://github.com/medusajs/medusa/commit/32be40a2c09be2f793b5d348a3dd62e9312f46c9) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(medusa): add estimate count property on admin/products

- Updated dependencies [[`dd667204048d3d9e0a6a9edc5426128293145c86`](https://github.com/medusajs/medusa/commit/dd667204048d3d9e0a6a9edc5426128293145c86), [`d9fdabe96d05108355c01081ea15d39467e40268`](https://github.com/medusajs/medusa/commit/d9fdabe96d05108355c01081ea15d39467e40268), [`fca5ad77b41856867ec68b1e46d04f1bb71cbc76`](https://github.com/medusajs/medusa/commit/fca5ad77b41856867ec68b1e46d04f1bb71cbc76), [`ac49eb9a6c4ba0bd82b146f465790fd4546701c9`](https://github.com/medusajs/medusa/commit/ac49eb9a6c4ba0bd82b146f465790fd4546701c9), [`4e49cebcf0f053cb89012276e935a7ec62a12046`](https://github.com/medusajs/medusa/commit/4e49cebcf0f053cb89012276e935a7ec62a12046), [`59bbff62d81861282d55a32d6c0c45285203c4e0`](https://github.com/medusajs/medusa/commit/59bbff62d81861282d55a32d6c0c45285203c4e0), [`499381d1194b33c8212e6e995a3208364c3ab188`](https://github.com/medusajs/medusa/commit/499381d1194b33c8212e6e995a3208364c3ab188), [`52bd9f9a53f6e63e5fbe0beb1fb2c650d88f7c88`](https://github.com/medusajs/medusa/commit/52bd9f9a53f6e63e5fbe0beb1fb2c650d88f7c88), [`ebe5cc7acddb7c61dc82fd8ec7f2fe3779104a99`](https://github.com/medusajs/medusa/commit/ebe5cc7acddb7c61dc82fd8ec7f2fe3779104a99), [`41054a34199168f0b949c3cda0bbe667da2c5993`](https://github.com/medusajs/medusa/commit/41054a34199168f0b949c3cda0bbe667da2c5993), [`c5a6573e26b403b86f53b88c307ea311a1bd9230`](https://github.com/medusajs/medusa/commit/c5a6573e26b403b86f53b88c307ea311a1bd9230), [`3071d09a03205597158afe79d55dd43643a97026`](https://github.com/medusajs/medusa/commit/3071d09a03205597158afe79d55dd43643a97026)]:
  - @medusajs/index@2.8.3
  - @medusajs/analytics-posthog@2.8.3
  - @medusajs/core-flows@2.8.3
  - @medusajs/link-modules@2.8.3
  - @medusajs/product@2.8.3
  - @medusajs/admin-bundler@2.8.3
  - @medusajs/framework@2.8.3
  - @medusajs/analytics@2.8.3
  - @medusajs/api-key@2.8.3
  - @medusajs/auth@2.8.3
  - @medusajs/cart@2.8.3
  - @medusajs/currency@2.8.3
  - @medusajs/customer@2.8.3
  - @medusajs/file@2.8.3
  - @medusajs/fulfillment@2.8.3
  - @medusajs/inventory@2.8.3
  - @medusajs/locking@2.8.3
  - @medusajs/notification@2.8.3
  - @medusajs/order@2.8.3
  - @medusajs/payment@2.8.3
  - @medusajs/pricing@2.8.3
  - @medusajs/promotion@2.8.3
  - @medusajs/region@2.8.3
  - @medusajs/sales-channel@2.8.3
  - @medusajs/stock-location@2.8.3
  - @medusajs/store@2.8.3
  - @medusajs/tax@2.8.3
  - @medusajs/user@2.8.3
  - @medusajs/workflow-engine-inmemory@2.8.3
  - @medusajs/workflow-engine-redis@2.8.3
  - @medusajs/cache-inmemory@2.8.3
  - @medusajs/cache-redis@2.8.3
  - @medusajs/event-bus-local@2.8.3
  - @medusajs/event-bus-redis@2.8.3
  - @medusajs/analytics-local@2.8.3
  - @medusajs/auth-emailpass@2.8.3
  - @medusajs/auth-github@2.8.3
  - @medusajs/auth-google@2.8.3
  - @medusajs/file-local@2.8.3
  - @medusajs/file-s3@2.8.3
  - @medusajs/fulfillment-manual@2.8.3
  - @medusajs/locking-postgres@2.8.3
  - @medusajs/locking-redis@2.8.3
  - @medusajs/notification-local@2.8.3
  - @medusajs/notification-sendgrid@2.8.3
  - @medusajs/payment-stripe@2.8.3
  - @medusajs/telemetry@2.8.3

## 2.8.2

### Patch Changes

- Updated dependencies [[`9f4d32b2201d8c87d84c59b9a1ca59e00bcc6af1`](https://github.com/medusajs/medusa/commit/9f4d32b2201d8c87d84c59b9a1ca59e00bcc6af1), [`e149a998862272fff80573a623c4d9010cb0b104`](https://github.com/medusajs/medusa/commit/e149a998862272fff80573a623c4d9010cb0b104)]:
  - @medusajs/core-flows@2.8.2
  - @medusajs/admin-bundler@2.8.2
  - @medusajs/framework@2.8.2
  - @medusajs/api-key@2.8.2
  - @medusajs/auth@2.8.2
  - @medusajs/cache-inmemory@2.8.2
  - @medusajs/cache-redis@2.8.2
  - @medusajs/cart@2.8.2
  - @medusajs/currency@2.8.2
  - @medusajs/customer@2.8.2
  - @medusajs/event-bus-local@2.8.2
  - @medusajs/event-bus-redis@2.8.2
  - @medusajs/file@2.8.2
  - @medusajs/fulfillment@2.8.2
  - @medusajs/index@2.8.2
  - @medusajs/inventory@2.8.2
  - @medusajs/link-modules@2.8.2
  - @medusajs/locking@2.8.2
  - @medusajs/notification@2.8.2
  - @medusajs/order@2.8.2
  - @medusajs/payment@2.8.2
  - @medusajs/pricing@2.8.2
  - @medusajs/product@2.8.2
  - @medusajs/promotion@2.8.2
  - @medusajs/auth-emailpass@2.8.2
  - @medusajs/auth-github@2.8.2
  - @medusajs/auth-google@2.8.2
  - @medusajs/file-local@2.8.2
  - @medusajs/file-s3@2.8.2
  - @medusajs/fulfillment-manual@2.8.2
  - @medusajs/locking-postgres@2.8.2
  - @medusajs/locking-redis@2.8.2
  - @medusajs/notification-local@2.8.2
  - @medusajs/notification-sendgrid@2.8.2
  - @medusajs/payment-stripe@2.8.2
  - @medusajs/region@2.8.2
  - @medusajs/sales-channel@2.8.2
  - @medusajs/stock-location@2.8.2
  - @medusajs/store@2.8.2
  - @medusajs/tax@2.8.2
  - @medusajs/user@2.8.2
  - @medusajs/workflow-engine-inmemory@2.8.2
  - @medusajs/workflow-engine-redis@2.8.2
  - @medusajs/telemetry@2.8.2

## 2.8.1

### Patch Changes

- Updated dependencies [[`4602163b568962f8115b83971d67a6c55c2b8a98`](https://github.com/medusajs/medusa/commit/4602163b568962f8115b83971d67a6c55c2b8a98), [`c661e064885ca0a874a443b293f9bb48b2742cf7`](https://github.com/medusajs/medusa/commit/c661e064885ca0a874a443b293f9bb48b2742cf7), [`ab22faaa52008ad952d50f0a3b6b1148515b10c9`](https://github.com/medusajs/medusa/commit/ab22faaa52008ad952d50f0a3b6b1148515b10c9), [`142a1f0a5be60d2cc013ecb174bca7b1381c6551`](https://github.com/medusajs/medusa/commit/142a1f0a5be60d2cc013ecb174bca7b1381c6551)]:
  - @medusajs/core-flows@2.8.1
  - @medusajs/index@2.8.1
  - @medusajs/workflow-engine-inmemory@2.8.1
  - @medusajs/workflow-engine-redis@2.8.1
  - @medusajs/product@2.8.1
  - @medusajs/framework@2.8.1
  - @medusajs/api-key@2.8.1
  - @medusajs/auth@2.8.1
  - @medusajs/cart@2.8.1
  - @medusajs/currency@2.8.1
  - @medusajs/customer@2.8.1
  - @medusajs/file@2.8.1
  - @medusajs/fulfillment@2.8.1
  - @medusajs/inventory@2.8.1
  - @medusajs/link-modules@2.8.1
  - @medusajs/locking@2.8.1
  - @medusajs/notification@2.8.1
  - @medusajs/order@2.8.1
  - @medusajs/payment@2.8.1
  - @medusajs/pricing@2.8.1
  - @medusajs/promotion@2.8.1
  - @medusajs/region@2.8.1
  - @medusajs/sales-channel@2.8.1
  - @medusajs/stock-location@2.8.1
  - @medusajs/store@2.8.1
  - @medusajs/tax@2.8.1
  - @medusajs/user@2.8.1
  - @medusajs/cache-inmemory@2.8.1
  - @medusajs/cache-redis@2.8.1
  - @medusajs/event-bus-local@2.8.1
  - @medusajs/event-bus-redis@2.8.1
  - @medusajs/auth-emailpass@2.8.1
  - @medusajs/auth-github@2.8.1
  - @medusajs/auth-google@2.8.1
  - @medusajs/file-local@2.8.1
  - @medusajs/file-s3@2.8.1
  - @medusajs/fulfillment-manual@2.8.1
  - @medusajs/locking-postgres@2.8.1
  - @medusajs/locking-redis@2.8.1
  - @medusajs/notification-local@2.8.1
  - @medusajs/notification-sendgrid@2.8.1
  - @medusajs/payment-stripe@2.8.1
  - @medusajs/admin-bundler@2.8.1
  - @medusajs/telemetry@2.8.1

## 2.8.0

### Patch Changes

- [#12353](https://github.com/medusajs/medusa/pull/12353) [`469ecef3c52797b812c9cb8a4410f632e8de8b8c`](https://github.com/medusajs/medusa/commit/469ecef3c52797b812c9cb8a4410f632e8de8b8c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor revamp of cart completion

- [#12345](https://github.com/medusajs/medusa/pull/12345) [`aba4cba373aa6499ca7cce77e7515613c38c681d`](https://github.com/medusajs/medusa/commit/aba4cba373aa6499ca7cce77e7515613c38c681d) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Support additional data on admin/collections

- [#12393](https://github.com/medusajs/medusa/pull/12393) [`2dd885ebc12303b9b1741a2785560da44d4e4e28`](https://github.com/medusajs/medusa/commit/2dd885ebc12303b9b1741a2785560da44d4e4e28) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): check if tax module is installed when running tax migration script

- [#12266](https://github.com/medusajs/medusa/pull/12266) [`cb53b8a5290708b395e1cf1f1a75ec6ff518f7b7`](https://github.com/medusajs/medusa/commit/cb53b8a5290708b395e1cf1f1a75ec6ff518f7b7) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: upgrade opentelemetry packages to support the latest release

- [#12297](https://github.com/medusajs/medusa/pull/12297) [`9cedeb182dc19d6127b602fc06e4b8850490e2a9`](https://github.com/medusajs/medusa/commit/9cedeb182dc19d6127b602fc06e4b8850490e2a9) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard, js-sdk, medusa, tax, types): custom tax providers

- [#12450](https://github.com/medusajs/medusa/pull/12450) [`32e0194772cd44efa1930f2ee99f147fa2976f1f`](https://github.com/medusajs/medusa/commit/32e0194772cd44efa1930f2ee99f147fa2976f1f) Thanks [@fPolic](https://github.com/fPolic)! - fix(dashboard, medusa): validate provider exists when creating a top level tax region

- Updated dependencies [[`469ecef3c52797b812c9cb8a4410f632e8de8b8c`](https://github.com/medusajs/medusa/commit/469ecef3c52797b812c9cb8a4410f632e8de8b8c), [`0d8af119c5f000addcbc2431c61711b51e7b34b1`](https://github.com/medusajs/medusa/commit/0d8af119c5f000addcbc2431c61711b51e7b34b1), [`77c3023200f5c718a77220f39b300e9149a92a4f`](https://github.com/medusajs/medusa/commit/77c3023200f5c718a77220f39b300e9149a92a4f), [`a53d645f8aab30135baebac29f9645dd35d47632`](https://github.com/medusajs/medusa/commit/a53d645f8aab30135baebac29f9645dd35d47632), [`90c61d189806894c56bfd5686807406c800cfdeb`](https://github.com/medusajs/medusa/commit/90c61d189806894c56bfd5686807406c800cfdeb), [`c4dd805849fee483d52ee61078e15f9be111b414`](https://github.com/medusajs/medusa/commit/c4dd805849fee483d52ee61078e15f9be111b414), [`89859987565b1fc872c7cd1c6d23144b97f454bc`](https://github.com/medusajs/medusa/commit/89859987565b1fc872c7cd1c6d23144b97f454bc), [`2c49e8b7332420c9fc949f9429a339fcbf5637af`](https://github.com/medusajs/medusa/commit/2c49e8b7332420c9fc949f9429a339fcbf5637af), [`9cedeb182dc19d6127b602fc06e4b8850490e2a9`](https://github.com/medusajs/medusa/commit/9cedeb182dc19d6127b602fc06e4b8850490e2a9), [`e4d853185f103ffc81fcf14df02e84cd5c538f9a`](https://github.com/medusajs/medusa/commit/e4d853185f103ffc81fcf14df02e84cd5c538f9a), [`d7a273ff2def96420054f31114a46294be6ee968`](https://github.com/medusajs/medusa/commit/d7a273ff2def96420054f31114a46294be6ee968), [`fff285f8d2f3020a24b83066fa4250130fdcf229`](https://github.com/medusajs/medusa/commit/fff285f8d2f3020a24b83066fa4250130fdcf229), [`b868a4ef4deb7df09d6156a907f4c883cd55a3fd`](https://github.com/medusajs/medusa/commit/b868a4ef4deb7df09d6156a907f4c883cd55a3fd), [`80007f3afda76eabd5b148fa6bb5590fa6987265`](https://github.com/medusajs/medusa/commit/80007f3afda76eabd5b148fa6bb5590fa6987265), [`5fe0e8250d0255866a68db32d4b54dab8ab66e52`](https://github.com/medusajs/medusa/commit/5fe0e8250d0255866a68db32d4b54dab8ab66e52)]:
  - @medusajs/core-flows@2.8.0
  - @medusajs/product@2.8.0
  - @medusajs/tax@2.8.0
  - @medusajs/index@2.8.0
  - @medusajs/framework@2.8.0
  - @medusajs/link-modules@2.8.0
  - @medusajs/pricing@2.8.0
  - @medusajs/workflow-engine-inmemory@2.8.0
  - @medusajs/workflow-engine-redis@2.8.0
  - @medusajs/admin-bundler@2.8.0
  - @medusajs/api-key@2.8.0
  - @medusajs/auth@2.8.0
  - @medusajs/cache-inmemory@2.8.0
  - @medusajs/cache-redis@2.8.0
  - @medusajs/cart@2.8.0
  - @medusajs/currency@2.8.0
  - @medusajs/customer@2.8.0
  - @medusajs/event-bus-local@2.8.0
  - @medusajs/event-bus-redis@2.8.0
  - @medusajs/file@2.8.0
  - @medusajs/fulfillment@2.8.0
  - @medusajs/inventory@2.8.0
  - @medusajs/locking@2.8.0
  - @medusajs/notification@2.8.0
  - @medusajs/order@2.8.0
  - @medusajs/payment@2.8.0
  - @medusajs/promotion@2.8.0
  - @medusajs/auth-emailpass@2.8.0
  - @medusajs/auth-github@2.8.0
  - @medusajs/auth-google@2.8.0
  - @medusajs/file-local@2.8.0
  - @medusajs/file-s3@2.8.0
  - @medusajs/fulfillment-manual@2.8.0
  - @medusajs/locking-postgres@2.8.0
  - @medusajs/locking-redis@2.8.0
  - @medusajs/notification-local@2.8.0
  - @medusajs/notification-sendgrid@2.8.0
  - @medusajs/payment-stripe@2.8.0
  - @medusajs/region@2.8.0
  - @medusajs/sales-channel@2.8.0
  - @medusajs/stock-location@2.8.0
  - @medusajs/store@2.8.0
  - @medusajs/user@2.8.0
  - @medusajs/telemetry@2.8.0

## 2.7.1

### Patch Changes

- [#12124](https://github.com/medusajs/medusa/pull/12124) [`01542f69737b48346d924670296c551e4c4b47ec`](https://github.com/medusajs/medusa/commit/01542f69737b48346d924670296c551e4c4b47ec) Thanks [@fPolic](https://github.com/fPolic)! - feat(core-flows,js-sdk,medusa): draft order shipping removal

- Updated dependencies [[`24af8f2d8e27d0f842e6e596bc4c695882f67737`](https://github.com/medusajs/medusa/commit/24af8f2d8e27d0f842e6e596bc4c695882f67737), [`ee35f3ce9097832c10cdf2fd168763088e6c3fcb`](https://github.com/medusajs/medusa/commit/ee35f3ce9097832c10cdf2fd168763088e6c3fcb), [`01542f69737b48346d924670296c551e4c4b47ec`](https://github.com/medusajs/medusa/commit/01542f69737b48346d924670296c551e4c4b47ec), [`413a0da26c7e9acffe9cc087fd77500efc76191a`](https://github.com/medusajs/medusa/commit/413a0da26c7e9acffe9cc087fd77500efc76191a), [`4ea1a2e09fc220555166c9bb013c0e11c99b4235`](https://github.com/medusajs/medusa/commit/4ea1a2e09fc220555166c9bb013c0e11c99b4235), [`2f6963a5fbea05537680cb1b1f6a2b9822c36325`](https://github.com/medusajs/medusa/commit/2f6963a5fbea05537680cb1b1f6a2b9822c36325), [`b8902637251e9ed4f8762ef280659bbab6d967de`](https://github.com/medusajs/medusa/commit/b8902637251e9ed4f8762ef280659bbab6d967de), [`ad74ba2ca4c86b38c91c342edfad077cd132cc2f`](https://github.com/medusajs/medusa/commit/ad74ba2ca4c86b38c91c342edfad077cd132cc2f), [`8618e6ee3843069ea189ea64d5191d93db52dc9d`](https://github.com/medusajs/medusa/commit/8618e6ee3843069ea189ea64d5191d93db52dc9d), [`19d71fdc63547886cfc238c6b680370a80d50b50`](https://github.com/medusajs/medusa/commit/19d71fdc63547886cfc238c6b680370a80d50b50)]:
  - @medusajs/core-flows@2.7.1
  - @medusajs/framework@2.7.1
  - @medusajs/index@2.7.1
  - @medusajs/event-bus-local@2.7.1
  - @medusajs/workflow-engine-inmemory@2.7.1
  - @medusajs/workflow-engine-redis@2.7.1
  - @medusajs/api-key@2.7.1
  - @medusajs/auth@2.7.1
  - @medusajs/cache-inmemory@2.7.1
  - @medusajs/cache-redis@2.7.1
  - @medusajs/cart@2.7.1
  - @medusajs/currency@2.7.1
  - @medusajs/customer@2.7.1
  - @medusajs/event-bus-redis@2.7.1
  - @medusajs/file@2.7.1
  - @medusajs/fulfillment@2.7.1
  - @medusajs/inventory@2.7.1
  - @medusajs/link-modules@2.7.1
  - @medusajs/locking@2.7.1
  - @medusajs/notification@2.7.1
  - @medusajs/order@2.7.1
  - @medusajs/payment@2.7.1
  - @medusajs/pricing@2.7.1
  - @medusajs/product@2.7.1
  - @medusajs/promotion@2.7.1
  - @medusajs/auth-emailpass@2.7.1
  - @medusajs/auth-github@2.7.1
  - @medusajs/auth-google@2.7.1
  - @medusajs/file-local@2.7.1
  - @medusajs/file-s3@2.7.1
  - @medusajs/fulfillment-manual@2.7.1
  - @medusajs/locking-postgres@2.7.1
  - @medusajs/locking-redis@2.7.1
  - @medusajs/notification-local@2.7.1
  - @medusajs/notification-sendgrid@2.7.1
  - @medusajs/payment-stripe@2.7.1
  - @medusajs/region@2.7.1
  - @medusajs/sales-channel@2.7.1
  - @medusajs/stock-location@2.7.1
  - @medusajs/store@2.7.1
  - @medusajs/tax@2.7.1
  - @medusajs/user@2.7.1
  - @medusajs/admin-bundler@2.7.1
  - @medusajs/telemetry@2.7.1

## 2.7.0

### Patch Changes

- [#11720](https://github.com/medusajs/medusa/pull/11720) [`ec56a8bc857a74788df6523af25914da95c4c1d8`](https://github.com/medusajs/medusa/commit/ec56a8bc857a74788df6523af25914da95c4c1d8) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,utils,test-utils,types,framework,dashboard,admin-vite-plugin,admib-bundler): Fix broken plugin dependencies in development server

- [#12113](https://github.com/medusajs/medusa/pull/12113) [`2a18a75353f872b0cb4c203afc08cfd82f778428`](https://github.com/medusajs/medusa/commit/2a18a75353f872b0cb4c203afc08cfd82f778428) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(framework): slightly improve maybe apply link filter middleware

- [#11876](https://github.com/medusajs/medusa/pull/11876) [`c3440e5e3812e3d1c6b82e9d4e41287398451611`](https://github.com/medusajs/medusa/commit/c3440e5e3812e3d1c6b82e9d4e41287398451611) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types,js-sdk): add enabled plugins route

- [#12028](https://github.com/medusajs/medusa/pull/12028) [`3dba58785fb2d8e79f1ea89daa9e4ab8810821c8`](https://github.com/medusajs/medusa/commit/3dba58785fb2d8e79f1ea89daa9e4ab8810821c8) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard,medusa,types): allow searching for promotion rule options

- [#12006](https://github.com/medusajs/medusa/pull/12006) [`1895d8cc1141b28525acfc21715f6f523b8194a2`](https://github.com/medusajs/medusa/commit/1895d8cc1141b28525acfc21715f6f523b8194a2) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(medusa): skip index module when tags or categories present

- [#11821](https://github.com/medusajs/medusa/pull/11821) [`5cf0bf4d93b5fd965680223dd448324c5135426e`](https://github.com/medusajs/medusa/commit/5cf0bf4d93b5fd965680223dd448324c5135426e) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore: transform filter before query.index

- [#11569](https://github.com/medusajs/medusa/pull/11569) [`cb6249320e7322e8eabfec8434f1278f8d63e96c`](https://github.com/medusajs/medusa/commit/cb6249320e7322e8eabfec8434f1278f8d63e96c) Thanks [@riqwan](https://github.com/riqwan)! - feat(order,types,medusa,core-flows): fix(types,order,medusa,core-flows): create order credit lines during order refund

- [#12025](https://github.com/medusajs/medusa/pull/12025) [`2f7eb0ee030966844b45dd00b2259e68b9fb0e83`](https://github.com/medusajs/medusa/commit/2f7eb0ee030966844b45dd00b2259e68b9fb0e83) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: validate module names to disallow unallowed characters

- Updated dependencies [[`386205d0f41828b82d519d2f5b8e07b41907a8ae`](https://github.com/medusajs/medusa/commit/386205d0f41828b82d519d2f5b8e07b41907a8ae), [`07252691c59f0e945730e987d0f1a97976b4c7f0`](https://github.com/medusajs/medusa/commit/07252691c59f0e945730e987d0f1a97976b4c7f0), [`9bf1e52d25131d0a976b50992ad4cd230ac90d8e`](https://github.com/medusajs/medusa/commit/9bf1e52d25131d0a976b50992ad4cd230ac90d8e), [`74381addc3d6af42f0292e778948aabb60a6dad9`](https://github.com/medusajs/medusa/commit/74381addc3d6af42f0292e778948aabb60a6dad9), [`ec56a8bc857a74788df6523af25914da95c4c1d8`](https://github.com/medusajs/medusa/commit/ec56a8bc857a74788df6523af25914da95c4c1d8), [`2a18a75353f872b0cb4c203afc08cfd82f778428`](https://github.com/medusajs/medusa/commit/2a18a75353f872b0cb4c203afc08cfd82f778428), [`5f3a82f5c341d4a98a7a2ab92563f6cdae1cdce1`](https://github.com/medusajs/medusa/commit/5f3a82f5c341d4a98a7a2ab92563f6cdae1cdce1), [`72d2cf92075b3e0849251f233517e2972de1b19c`](https://github.com/medusajs/medusa/commit/72d2cf92075b3e0849251f233517e2972de1b19c), [`95e89a39f347c8af6a5960943af56965bc3a07ba`](https://github.com/medusajs/medusa/commit/95e89a39f347c8af6a5960943af56965bc3a07ba), [`b1b3b484747a110f720d9c1d086696bbfba86bda`](https://github.com/medusajs/medusa/commit/b1b3b484747a110f720d9c1d086696bbfba86bda), [`67b308c8eb52950991df34ac1c8d007a14cfaa1e`](https://github.com/medusajs/medusa/commit/67b308c8eb52950991df34ac1c8d007a14cfaa1e), [`fc652ea51e4fdc19e8b15f1ac8a08effbc68ea30`](https://github.com/medusajs/medusa/commit/fc652ea51e4fdc19e8b15f1ac8a08effbc68ea30), [`0625f76cd4f040963829b61dcc70563e1d1b7070`](https://github.com/medusajs/medusa/commit/0625f76cd4f040963829b61dcc70563e1d1b7070), [`aa6d5aa3cf45a07f6276bea8592ad0743c846165`](https://github.com/medusajs/medusa/commit/aa6d5aa3cf45a07f6276bea8592ad0743c846165), [`cae47d9e49e9a17d8395f7b390f6ec0a2f9b8dc2`](https://github.com/medusajs/medusa/commit/cae47d9e49e9a17d8395f7b390f6ec0a2f9b8dc2), [`3a1cf2212ac3d92eebee1bbea07e8731e53e4c72`](https://github.com/medusajs/medusa/commit/3a1cf2212ac3d92eebee1bbea07e8731e53e4c72), [`d87b25203c3e1aa9b975dc68818d66fe877657a6`](https://github.com/medusajs/medusa/commit/d87b25203c3e1aa9b975dc68818d66fe877657a6), [`5cf0bf4d93b5fd965680223dd448324c5135426e`](https://github.com/medusajs/medusa/commit/5cf0bf4d93b5fd965680223dd448324c5135426e), [`cb26c224ea3e0e06fa9efb1c317d4529bfcb2d49`](https://github.com/medusajs/medusa/commit/cb26c224ea3e0e06fa9efb1c317d4529bfcb2d49), [`cb6249320e7322e8eabfec8434f1278f8d63e96c`](https://github.com/medusajs/medusa/commit/cb6249320e7322e8eabfec8434f1278f8d63e96c), [`6053ec3976d5ebd18680eba5eff3c71038a108cb`](https://github.com/medusajs/medusa/commit/6053ec3976d5ebd18680eba5eff3c71038a108cb), [`1f8fab36361aa8e473ffe6c411c8598a916a6d3f`](https://github.com/medusajs/medusa/commit/1f8fab36361aa8e473ffe6c411c8598a916a6d3f), [`13e159d8ad7ebb3e6977969b4bb10877d7bb7850`](https://github.com/medusajs/medusa/commit/13e159d8ad7ebb3e6977969b4bb10877d7bb7850), [`6015dcc16d6d9af15575bee98fb5727c6a6d9fd2`](https://github.com/medusajs/medusa/commit/6015dcc16d6d9af15575bee98fb5727c6a6d9fd2), [`8385a5e34d9528eb3d80d16f391ee7f44a6e5d90`](https://github.com/medusajs/medusa/commit/8385a5e34d9528eb3d80d16f391ee7f44a6e5d90), [`a8513019db08d1345e79a15aea7f11389b4918d4`](https://github.com/medusajs/medusa/commit/a8513019db08d1345e79a15aea7f11389b4918d4), [`9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234`](https://github.com/medusajs/medusa/commit/9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234), [`2270f29ec544b14c26b246a59f80be121f8014a1`](https://github.com/medusajs/medusa/commit/2270f29ec544b14c26b246a59f80be121f8014a1), [`01089d5bc81bc92311bb43b2d57d987fee378030`](https://github.com/medusajs/medusa/commit/01089d5bc81bc92311bb43b2d57d987fee378030), [`c870a7a1baf7db748a831265f06dd4b7378b262e`](https://github.com/medusajs/medusa/commit/c870a7a1baf7db748a831265f06dd4b7378b262e), [`9ac74eead4760d6c92676d451e6f25c2305b1852`](https://github.com/medusajs/medusa/commit/9ac74eead4760d6c92676d451e6f25c2305b1852)]:
  - @medusajs/core-flows@2.7.0
  - @medusajs/link-modules@2.7.0
  - @medusajs/pricing@2.7.0
  - @medusajs/order@2.7.0
  - @medusajs/fulfillment@2.7.0
  - @medusajs/index@2.7.0
  - @medusajs/inventory@2.7.0
  - @medusajs/user@2.7.0
  - @medusajs/admin-bundler@2.7.0
  - @medusajs/framework@2.7.0
  - @medusajs/workflow-engine-inmemory@2.7.0
  - @medusajs/workflow-engine-redis@2.7.0
  - @medusajs/promotion@2.7.0
  - @medusajs/locking@2.7.0
  - @medusajs/cart@2.7.0
  - @medusajs/product@2.7.0
  - @medusajs/api-key@2.7.0
  - @medusajs/auth@2.7.0
  - @medusajs/currency@2.7.0
  - @medusajs/customer@2.7.0
  - @medusajs/file@2.7.0
  - @medusajs/notification@2.7.0
  - @medusajs/payment@2.7.0
  - @medusajs/region@2.7.0
  - @medusajs/sales-channel@2.7.0
  - @medusajs/stock-location@2.7.0
  - @medusajs/store@2.7.0
  - @medusajs/tax@2.7.0
  - @medusajs/cache-inmemory@2.7.0
  - @medusajs/cache-redis@2.7.0
  - @medusajs/event-bus-local@2.7.0
  - @medusajs/event-bus-redis@2.7.0
  - @medusajs/auth-emailpass@2.7.0
  - @medusajs/auth-github@2.7.0
  - @medusajs/auth-google@2.7.0
  - @medusajs/file-local@2.7.0
  - @medusajs/file-s3@2.7.0
  - @medusajs/fulfillment-manual@2.7.0
  - @medusajs/locking-postgres@2.7.0
  - @medusajs/locking-redis@2.7.0
  - @medusajs/notification-local@2.7.0
  - @medusajs/notification-sendgrid@2.7.0
  - @medusajs/payment-stripe@2.7.0
  - @medusajs/telemetry@2.7.0

## 2.6.1

### Patch Changes

- [#11789](https://github.com/medusajs/medusa/pull/11789) [`62e429178f3abe0a528f7a574eb6a09ac525bf9c`](https://github.com/medusajs/medusa/commit/62e429178f3abe0a528f7a574eb6a09ac525bf9c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Use correct query config for customer address

- [#11788](https://github.com/medusajs/medusa/pull/11788) [`90964a404edbb079d7de332a11ab97c4f5643d67`](https://github.com/medusajs/medusa/commit/90964a404edbb079d7de332a11ab97c4f5643d67) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Apply middleware to GET customers/:id/addresses/:address_id

- [#11724](https://github.com/medusajs/medusa/pull/11724) [`cc1309d3709b251683a0cda0ced448f8bf9f514e`](https://github.com/medusajs/medusa/commit/cc1309d3709b251683a0cda0ced448f8bf9f514e) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(product): Improve product normalization

- [#11738](https://github.com/medusajs/medusa/pull/11738) [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Remove ranges on Medusa packages

- [#11759](https://github.com/medusajs/medusa/pull/11759) [`2a0bd86204c9dd51a012763016f2de822d3c45b6`](https://github.com/medusajs/medusa/commit/2a0bd86204c9dd51a012763016f2de822d3c45b6) Thanks [@thetutlage](https://github.com/thetutlage)! - chore: pin swc to 1.5.7

- Updated dependencies [[`b7678983a9b3e5c4d88282054b37b6c517329bd7`](https://github.com/medusajs/medusa/commit/b7678983a9b3e5c4d88282054b37b6c517329bd7), [`cc1309d3709b251683a0cda0ced448f8bf9f514e`](https://github.com/medusajs/medusa/commit/cc1309d3709b251683a0cda0ced448f8bf9f514e), [`70eaaa91965dbe3a641dc634b4e81069d73846ed`](https://github.com/medusajs/medusa/commit/70eaaa91965dbe3a641dc634b4e81069d73846ed), [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861), [`20cd59e622463fbd46506275648ce681869adcdf`](https://github.com/medusajs/medusa/commit/20cd59e622463fbd46506275648ce681869adcdf), [`84f991192ec288f90af36c5352448b2785901d1a`](https://github.com/medusajs/medusa/commit/84f991192ec288f90af36c5352448b2785901d1a), [`16d7294de805e314f36b302c7b3bbdb126ae5c96`](https://github.com/medusajs/medusa/commit/16d7294de805e314f36b302c7b3bbdb126ae5c96), [`cc8422d3a163d18492e1bd6de50e0796ca34a41f`](https://github.com/medusajs/medusa/commit/cc8422d3a163d18492e1bd6de50e0796ca34a41f)]:
  - @medusajs/core-flows@2.6.1
  - @medusajs/cart@2.6.1
  - @medusajs/product@2.6.1
  - @medusajs/framework@2.6.1
  - @medusajs/notification-sendgrid@2.6.1
  - @medusajs/fulfillment-manual@2.6.1
  - @medusajs/notification-local@2.6.1
  - @medusajs/locking-postgres@2.6.1
  - @medusajs/auth-emailpass@2.6.1
  - @medusajs/payment-stripe@2.6.1
  - @medusajs/workflow-engine-inmemory@2.6.1
  - @medusajs/locking-redis@2.6.1
  - @medusajs/auth-github@2.6.1
  - @medusajs/auth-google@2.6.1
  - @medusajs/workflow-engine-redis@2.6.1
  - @medusajs/file-local@2.6.1
  - @medusajs/file-s3@2.6.1
  - @medusajs/event-bus-local@2.6.1
  - @medusajs/event-bus-redis@2.6.1
  - @medusajs/cache-inmemory@2.6.1
  - @medusajs/stock-location@2.6.1
  - @medusajs/sales-channel@2.6.1
  - @medusajs/link-modules@2.6.1
  - @medusajs/notification@2.6.1
  - @medusajs/admin-bundler@2.6.1
  - @medusajs/cache-redis@2.6.1
  - @medusajs/fulfillment@2.6.1
  - @medusajs/inventory@2.6.1
  - @medusajs/promotion@2.6.1
  - @medusajs/currency@2.6.1
  - @medusajs/customer@2.6.1
  - @medusajs/api-key@2.6.1
  - @medusajs/locking@2.6.1
  - @medusajs/payment@2.6.1
  - @medusajs/pricing@2.6.1
  - @medusajs/region@2.6.1
  - @medusajs/index@2.6.1
  - @medusajs/order@2.6.1
  - @medusajs/store@2.6.1
  - @medusajs/auth@2.6.1
  - @medusajs/file@2.6.1
  - @medusajs/user@2.6.1
  - @medusajs/tax@2.6.1
  - @medusajs/telemetry@2.6.1

## 2.6.0

### Minor Changes

- [`d172ad8ebc4677bba73c36465c973f4784dc50ae`](https://github.com/medusajs/medusa/commit/d172ad8ebc4677bba73c36465c973f4784dc50ae) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Move token from query params to authorization header

### Patch Changes

- [#11604](https://github.com/medusajs/medusa/pull/11604) [`8bb0a25f573c62ca1d1bcd7af184b0d0cf98e125`](https://github.com/medusajs/medusa/commit/8bb0a25f573c62ca1d1bcd7af184b0d0cf98e125) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(types, medusa): remove fulfillment and payment status filters from validator + http types

- [#11692](https://github.com/medusajs/medusa/pull/11692) [`51b0af193c7dde4899a696a515b59373b465d907`](https://github.com/medusajs/medusa/commit/51b0af193c7dde4899a696a515b59373b465d907) Thanks [@riqwan](https://github.com/riqwan)! - fix(types,medusa): calculate taxes for original price

- [#11226](https://github.com/medusajs/medusa/pull/11226) [`93cbc6b6695f236fa39b66169de971228888f1b9`](https://github.com/medusajs/medusa/commit/93cbc6b6695f236fa39b66169de971228888f1b9) Thanks [@bouazzaayyoub](https://github.com/bouazzaayyoub)! - fix: add additionl data to product categories hook

- [#11664](https://github.com/medusajs/medusa/pull/11664) [`e23f204b7ca0f195e36fef2ba0bae7a686b8da4f`](https://github.com/medusajs/medusa/commit/e23f204b7ca0f195e36fef2ba0bae7a686b8da4f) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows, dashboard, medusa): prevent creatiion of a fulfilment without items

- [#11646](https://github.com/medusajs/medusa/pull/11646) [`aabbbb7292a59ec029a6165451aa6d949844b2ea`](https://github.com/medusajs/medusa/commit/aabbbb7292a59ec029a6165451aa6d949844b2ea) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: Replace existing router with the new implementation

- Updated dependencies [[`eeebb35758ea443468dd2355a7ea761dfe24babc`](https://github.com/medusajs/medusa/commit/eeebb35758ea443468dd2355a7ea761dfe24babc), [`93cbc6b6695f236fa39b66169de971228888f1b9`](https://github.com/medusajs/medusa/commit/93cbc6b6695f236fa39b66169de971228888f1b9), [`322d108c0395757b4655a1e0055d722acf127b36`](https://github.com/medusajs/medusa/commit/322d108c0395757b4655a1e0055d722acf127b36), [`d1efad9bf05ca80959e8b50d74b74167fc1b0064`](https://github.com/medusajs/medusa/commit/d1efad9bf05ca80959e8b50d74b74167fc1b0064), [`caf83cf78cb6d2dbd1837f6814062dafecbd04fa`](https://github.com/medusajs/medusa/commit/caf83cf78cb6d2dbd1837f6814062dafecbd04fa), [`c250de79192bda1b1cd217bcca37f458c693de1d`](https://github.com/medusajs/medusa/commit/c250de79192bda1b1cd217bcca37f458c693de1d), [`228b7b608dfa935618179684fa3d005f7a9aaf01`](https://github.com/medusajs/medusa/commit/228b7b608dfa935618179684fa3d005f7a9aaf01), [`38beeb157eadcd7dabe814119c48b5ddbc17fe20`](https://github.com/medusajs/medusa/commit/38beeb157eadcd7dabe814119c48b5ddbc17fe20), [`b42f151be31161a5d7a73132ee6794b990403d76`](https://github.com/medusajs/medusa/commit/b42f151be31161a5d7a73132ee6794b990403d76), [`03731c7660fe5dca3c6d3c38a2a71eb2ea89e192`](https://github.com/medusajs/medusa/commit/03731c7660fe5dca3c6d3c38a2a71eb2ea89e192), [`cad8b40c130e371d615d3bd953bb466fb4ac54a8`](https://github.com/medusajs/medusa/commit/cad8b40c130e371d615d3bd953bb466fb4ac54a8), [`7dbec10b3bdde8a9f869080d5ef2c3c97fca1077`](https://github.com/medusajs/medusa/commit/7dbec10b3bdde8a9f869080d5ef2c3c97fca1077), [`fa1793e8e92164251c776859dea7a5e312ef9432`](https://github.com/medusajs/medusa/commit/fa1793e8e92164251c776859dea7a5e312ef9432), [`e23f204b7ca0f195e36fef2ba0bae7a686b8da4f`](https://github.com/medusajs/medusa/commit/e23f204b7ca0f195e36fef2ba0bae7a686b8da4f)]:
  - @medusajs/product@2.6.0
  - @medusajs/core-flows@2.6.0
  - @medusajs/cart@2.6.0
  - @medusajs/cache-redis@2.6.0
  - @medusajs/event-bus-redis@2.6.0
  - @medusajs/workflow-engine-redis@2.6.0
  - @medusajs/locking-redis@2.6.0
  - @medusajs/link-modules@2.6.0
  - @medusajs/inventory@2.6.0
  - @medusajs/order@2.6.0
  - @medusajs/admin-bundler@2.6.0
  - @medusajs/telemetry@2.6.0
  - @medusajs/api-key@2.6.0
  - @medusajs/auth@2.6.0
  - @medusajs/cache-inmemory@2.6.0
  - @medusajs/currency@2.6.0
  - @medusajs/customer@2.6.0
  - @medusajs/event-bus-local@2.6.0
  - @medusajs/file@2.6.0
  - @medusajs/fulfillment@2.6.0
  - @medusajs/index@2.6.0
  - @medusajs/locking@2.6.0
  - @medusajs/notification@2.6.0
  - @medusajs/payment@2.6.0
  - @medusajs/pricing@2.6.0
  - @medusajs/promotion@2.6.0
  - @medusajs/auth-emailpass@2.6.0
  - @medusajs/auth-github@2.6.0
  - @medusajs/auth-google@2.6.0
  - @medusajs/file-local@2.6.0
  - @medusajs/file-s3@2.6.0
  - @medusajs/fulfillment-manual@2.6.0
  - @medusajs/locking-postgres@2.6.0
  - @medusajs/notification-local@2.6.0
  - @medusajs/notification-sendgrid@2.6.0
  - @medusajs/payment-stripe@2.6.0
  - @medusajs/region@2.6.0
  - @medusajs/sales-channel@2.6.0
  - @medusajs/stock-location@2.6.0
  - @medusajs/store@2.6.0
  - @medusajs/tax@2.6.0
  - @medusajs/user@2.6.0
  - @medusajs/workflow-engine-inmemory@2.6.0

## 2.5.1

### Patch Changes

- [#11485](https://github.com/medusajs/medusa/pull/11485) [`a5ff1b92cefe6744bc1abfc164cdcd6515b1a6d4`](https://github.com/medusajs/medusa/commit/a5ff1b92cefe6744bc1abfc164cdcd6515b1a6d4) Thanks [@thetutlage](https://github.com/thetutlage)! - refactor: remove host from the server ready log

- [#11460](https://github.com/medusajs/medusa/pull/11460) [`bc02fde2367c257738bbf9b8ac2ad02cbe2a8f55`](https://github.com/medusajs/medusa/commit/bc02fde2367c257738bbf9b8ac2ad02cbe2a8f55) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: allow all NodeSDK options via registerOtel

- [#11398](https://github.com/medusajs/medusa/pull/11398) [`681121bb192145669b500ce3a01ad7d06356a396`](https://github.com/medusajs/medusa/commit/681121bb192145669b500ce3a01ad7d06356a396) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Make Shipping Methods optional on create draft orders endpoint, and allow passing a address ID for both billing and shipping address.

- [#11472](https://github.com/medusajs/medusa/pull/11472) [`825b8ad260df1e71843fbd62c7f4b2978617033d`](https://github.com/medusajs/medusa/commit/825b8ad260df1e71843fbd62c7f4b2978617033d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Allow filtering products by handle and title as either string or array of strings

- [#11514](https://github.com/medusajs/medusa/pull/11514) [`3b4997840e624ef8da1a75744b4bfb5c5a371f7c`](https://github.com/medusajs/medusa/commit/3b4997840e624ef8da1a75744b4bfb5c5a371f7c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,js-sdk,types): Add basic draft order operations to js-sdk

- [#11431](https://github.com/medusajs/medusa/pull/11431) [`448dbcb5963c732c9c3b822b81330556bcf883cd`](https://github.com/medusajs/medusa/commit/448dbcb5963c732c9c3b822b81330556bcf883cd) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): index engine feature flag

- [#11519](https://github.com/medusajs/medusa/pull/11519) [`0e6ffad30f1bd9e9f18c9040447c63077df09da2`](https://github.com/medusajs/medusa/commit/0e6ffad30f1bd9e9f18c9040447c63077df09da2) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: allow setting DB_PORT and DATABASE_URL env variables

- [#11468](https://github.com/medusajs/medusa/pull/11468) [`32c5015f563b7d60221a472635b44820fe4ef1f6`](https://github.com/medusajs/medusa/commit/32c5015f563b7d60221a472635b44820fe4ef1f6) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: generate posix paths for migrations

- [#11464](https://github.com/medusajs/medusa/pull/11464) [`ceb99d073a3cb1d1b63b3c5dffd193c7664d75eb`](https://github.com/medusajs/medusa/commit/ceb99d073a3cb1d1b63b3c5dffd193c7664d75eb) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Re throw error in instrumentation after reporting it

- Updated dependencies [[`22276648ad0aef12206464b555efdce97e316bb4`](https://github.com/medusajs/medusa/commit/22276648ad0aef12206464b555efdce97e316bb4), [`77f37c5f97562825895900861ca9b27327cee5fb`](https://github.com/medusajs/medusa/commit/77f37c5f97562825895900861ca9b27327cee5fb), [`d6c03ee5427457237e3c739545a8816cc3a3198e`](https://github.com/medusajs/medusa/commit/d6c03ee5427457237e3c739545a8816cc3a3198e), [`efd66c0d59e043218fa66163a7e9cd72bb6b5de1`](https://github.com/medusajs/medusa/commit/efd66c0d59e043218fa66163a7e9cd72bb6b5de1), [`0c957350a6688c78572361b51c1f16a452a31aed`](https://github.com/medusajs/medusa/commit/0c957350a6688c78572361b51c1f16a452a31aed), [`448dbcb5963c732c9c3b822b81330556bcf883cd`](https://github.com/medusajs/medusa/commit/448dbcb5963c732c9c3b822b81330556bcf883cd), [`065df75e7d5b90a4de43873d8c08e1aab65e3fd7`](https://github.com/medusajs/medusa/commit/065df75e7d5b90a4de43873d8c08e1aab65e3fd7), [`47edd01deec79b394552cea349f1e41b7b88723b`](https://github.com/medusajs/medusa/commit/47edd01deec79b394552cea349f1e41b7b88723b), [`b37010857ab1bccda96b4694298659cc6d8f14ef`](https://github.com/medusajs/medusa/commit/b37010857ab1bccda96b4694298659cc6d8f14ef)]:
  - @medusajs/index@2.5.1
  - @medusajs/file@2.5.1
  - @medusajs/core-flows@2.5.1
  - @medusajs/order@2.5.1
  - @medusajs/product@2.5.1
  - @medusajs/admin-bundler@2.5.1
  - @medusajs/telemetry@2.5.1
  - @medusajs/api-key@2.5.1
  - @medusajs/auth@2.5.1
  - @medusajs/cache-inmemory@2.5.1
  - @medusajs/cache-redis@2.5.1
  - @medusajs/cart@2.5.1
  - @medusajs/currency@2.5.1
  - @medusajs/customer@2.5.1
  - @medusajs/event-bus-local@2.5.1
  - @medusajs/event-bus-redis@2.5.1
  - @medusajs/fulfillment@2.5.1
  - @medusajs/inventory@2.5.1
  - @medusajs/link-modules@2.5.1
  - @medusajs/locking@2.5.1
  - @medusajs/notification@2.5.1
  - @medusajs/payment@2.5.1
  - @medusajs/pricing@2.5.1
  - @medusajs/promotion@2.5.1
  - @medusajs/auth-emailpass@2.5.1
  - @medusajs/auth-github@2.5.1
  - @medusajs/auth-google@2.5.1
  - @medusajs/file-local@2.5.1
  - @medusajs/file-s3@2.5.1
  - @medusajs/fulfillment-manual@2.5.1
  - @medusajs/locking-postgres@2.5.1
  - @medusajs/locking-redis@2.5.1
  - @medusajs/notification-local@2.5.1
  - @medusajs/notification-sendgrid@2.5.1
  - @medusajs/payment-stripe@2.5.1
  - @medusajs/region@2.5.1
  - @medusajs/sales-channel@2.5.1
  - @medusajs/stock-location@2.5.1
  - @medusajs/store@2.5.1
  - @medusajs/tax@2.5.1
  - @medusajs/user@2.5.1
  - @medusajs/workflow-engine-inmemory@2.5.1
  - @medusajs/workflow-engine-redis@2.5.1

## 2.5.0

### Patch Changes

- [#11304](https://github.com/medusajs/medusa/pull/11304) [`9f1a3b2a4214ef23a22972e6d28c5f43f87da353`](https://github.com/medusajs/medusa/commit/9f1a3b2a4214ef23a22972e6d28c5f43f87da353) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa, types): fix promotion HTTP types in cart

- [#11206](https://github.com/medusajs/medusa/pull/11206) [`716de2cb3ab5d504ec763fc322dc11b542b7e8ca`](https://github.com/medusajs/medusa/commit/716de2cb3ab5d504ec763fc322dc11b542b7e8ca) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: exit process with a status code when build fails

- [#11170](https://github.com/medusajs/medusa/pull/11170) [`040b7b274ee602e31f2b0ffa16605d6f38285f3e`](https://github.com/medusajs/medusa/commit/040b7b274ee602e31f2b0ffa16605d6f38285f3e) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa): use correct request / response types

- [#11272](https://github.com/medusajs/medusa/pull/11272) [`f4c2cd112ed54757ed35a55297b46b36152829cb`](https://github.com/medusajs/medusa/commit/f4c2cd112ed54757ed35a55297b46b36152829cb) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: issues with peer dependencies

- [#11285](https://github.com/medusajs/medusa/pull/11285) [`f07af7b93c86673e730dc4e5eba8df2572013f9f`](https://github.com/medusajs/medusa/commit/f07af7b93c86673e730dc4e5eba8df2572013f9f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard,core-flows,types,medusa): Allow editing Order metadata

- Updated dependencies [[`e98d3c615e8a42e09974ded9cc3ca3277e3a9217`](https://github.com/medusajs/medusa/commit/e98d3c615e8a42e09974ded9cc3ca3277e3a9217), [`da25980d2445a09a51220c0d4f005f41659057a6`](https://github.com/medusajs/medusa/commit/da25980d2445a09a51220c0d4f005f41659057a6), [`016e332e9b98f316cded6eb999927fc942ce56c5`](https://github.com/medusajs/medusa/commit/016e332e9b98f316cded6eb999927fc942ce56c5), [`a33aebd8957f4bab10afd5e50a810cf738879b0d`](https://github.com/medusajs/medusa/commit/a33aebd8957f4bab10afd5e50a810cf738879b0d), [`65d8d6dc0eae23c7c969664d0c2d127511cc0bd9`](https://github.com/medusajs/medusa/commit/65d8d6dc0eae23c7c969664d0c2d127511cc0bd9), [`c8376a9f15ba728506411e567ed4389c7b64406f`](https://github.com/medusajs/medusa/commit/c8376a9f15ba728506411e567ed4389c7b64406f), [`16fe43f214ecd1fb7fe6622c0c6e825e998c1be9`](https://github.com/medusajs/medusa/commit/16fe43f214ecd1fb7fe6622c0c6e825e998c1be9), [`f4c2cd112ed54757ed35a55297b46b36152829cb`](https://github.com/medusajs/medusa/commit/f4c2cd112ed54757ed35a55297b46b36152829cb), [`acefcd7d8052601308d75daf004069e95eb78a89`](https://github.com/medusajs/medusa/commit/acefcd7d8052601308d75daf004069e95eb78a89), [`f07af7b93c86673e730dc4e5eba8df2572013f9f`](https://github.com/medusajs/medusa/commit/f07af7b93c86673e730dc4e5eba8df2572013f9f), [`d3bf59bb7a208a9a280743212601522da5448c1b`](https://github.com/medusajs/medusa/commit/d3bf59bb7a208a9a280743212601522da5448c1b)]:
  - @medusajs/core-flows@2.5.0
  - @medusajs/api-key@2.5.0
  - @medusajs/auth@2.5.0
  - @medusajs/cart@2.5.0
  - @medusajs/customer@2.5.0
  - @medusajs/fulfillment@2.5.0
  - @medusajs/inventory@2.5.0
  - @medusajs/notification@2.5.0
  - @medusajs/order@2.5.0
  - @medusajs/payment@2.5.0
  - @medusajs/pricing@2.5.0
  - @medusajs/product@2.5.0
  - @medusajs/promotion@2.5.0
  - @medusajs/region@2.5.0
  - @medusajs/sales-channel@2.5.0
  - @medusajs/stock-location@2.5.0
  - @medusajs/store@2.5.0
  - @medusajs/tax@2.5.0
  - @medusajs/user@2.5.0
  - @medusajs/index@2.5.0
  - @medusajs/admin-bundler@2.5.0
  - @medusajs/workflow-engine-inmemory@2.5.0
  - @medusajs/workflow-engine-redis@2.5.0
  - @medusajs/telemetry@2.5.0
  - @medusajs/cache-inmemory@2.5.0
  - @medusajs/cache-redis@2.5.0
  - @medusajs/currency@2.5.0
  - @medusajs/event-bus-local@2.5.0
  - @medusajs/event-bus-redis@2.5.0
  - @medusajs/file@2.5.0
  - @medusajs/link-modules@2.5.0
  - @medusajs/locking@2.5.0
  - @medusajs/auth-emailpass@2.5.0
  - @medusajs/auth-github@2.5.0
  - @medusajs/auth-google@2.5.0
  - @medusajs/file-local@2.5.0
  - @medusajs/file-s3@2.5.0
  - @medusajs/fulfillment-manual@2.5.0
  - @medusajs/locking-postgres@2.5.0
  - @medusajs/locking-redis@2.5.0
  - @medusajs/notification-local@2.5.0
  - @medusajs/notification-sendgrid@2.5.0
  - @medusajs/payment-stripe@2.5.0

## 2.4.0

### Minor Changes

- [#10292](https://github.com/medusajs/medusa/pull/10292) [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore: upgrade to mikro-orm 6

### Patch Changes

- [#11110](https://github.com/medusajs/medusa/pull/11110) [`0deffe7b9b9a1055813249b17057b7bba01b78ac`](https://github.com/medusajs/medusa/commit/0deffe7b9b9a1055813249b17057b7bba01b78ac) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: switch from tsc watch to chokidar

- [#11072](https://github.com/medusajs/medusa/pull/11072) [`13fe2f6776b22c401d131f184fc3600ef4008383`](https://github.com/medusajs/medusa/commit/13fe2f6776b22c401d131f184fc3600ef4008383) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(framework): migration scripts regexp

- [#11055](https://github.com/medusajs/medusa/pull/11055) [`45b47bf8136d05b1b9939b81cd892d4426b569f2`](https://github.com/medusajs/medusa/commit/45b47bf8136d05b1b9939b81cd892d4426b569f2) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa): use correct request and response types for batch location levels route

- [#11084](https://github.com/medusajs/medusa/pull/11084) [`e53b8b0a9708d2eb46258ca417b6ff6abbd5f3d9`](https://github.com/medusajs/medusa/commit/e53b8b0a9708d2eb46258ca417b6ff6abbd5f3d9) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: Flaky behavior of Yalc

- Updated dependencies [[`0deffe7b9b9a1055813249b17057b7bba01b78ac`](https://github.com/medusajs/medusa/commit/0deffe7b9b9a1055813249b17057b7bba01b78ac), [`2d0e50624fa37af5f74e46048a83ce3b39b210aa`](https://github.com/medusajs/medusa/commit/2d0e50624fa37af5f74e46048a83ce3b39b210aa), [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547), [`8119d9964b1617ef2a8b06998f02ce4486484344`](https://github.com/medusajs/medusa/commit/8119d9964b1617ef2a8b06998f02ce4486484344), [`57892bee0054eb5f3e9075014b1f6b966dc531db`](https://github.com/medusajs/medusa/commit/57892bee0054eb5f3e9075014b1f6b966dc531db), [`ecc8efcb049f5c77cb7e38c2b6a273860590a5f4`](https://github.com/medusajs/medusa/commit/ecc8efcb049f5c77cb7e38c2b6a273860590a5f4), [`13fe2f6776b22c401d131f184fc3600ef4008383`](https://github.com/medusajs/medusa/commit/13fe2f6776b22c401d131f184fc3600ef4008383), [`da3906efa42ee729c11696e2d3255a60ac3fa958`](https://github.com/medusajs/medusa/commit/da3906efa42ee729c11696e2d3255a60ac3fa958), [`e53b8b0a9708d2eb46258ca417b6ff6abbd5f3d9`](https://github.com/medusajs/medusa/commit/e53b8b0a9708d2eb46258ca417b6ff6abbd5f3d9), [`5aa47978734b4deae5139a4fd5eba15fd20cb874`](https://github.com/medusajs/medusa/commit/5aa47978734b4deae5139a4fd5eba15fd20cb874), [`b9c469a6d445dfb2f692bc16753c660426a48bdc`](https://github.com/medusajs/medusa/commit/b9c469a6d445dfb2f692bc16753c660426a48bdc)]:
  - @medusajs/framework@2.4.0
  - @medusajs/core-flows@2.4.0
  - @medusajs/locking-postgres@2.4.0
  - @medusajs/workflow-engine-inmemory@2.4.0
  - @medusajs/workflow-engine-redis@2.4.0
  - @medusajs/stock-location@2.4.0
  - @medusajs/sales-channel@2.4.0
  - @medusajs/link-modules@2.4.0
  - @medusajs/notification@2.4.0
  - @medusajs/fulfillment@2.4.0
  - @medusajs/inventory@2.4.0
  - @medusajs/promotion@2.4.0
  - @medusajs/currency@2.4.0
  - @medusajs/customer@2.4.0
  - @medusajs/api-key@2.4.0
  - @medusajs/locking@2.4.0
  - @medusajs/payment@2.4.0
  - @medusajs/pricing@2.4.0
  - @medusajs/product@2.4.0
  - @medusajs/region@2.4.0
  - @medusajs/index@2.4.0
  - @medusajs/order@2.4.0
  - @medusajs/store@2.4.0
  - @medusajs/auth@2.4.0
  - @medusajs/cart@2.4.0
  - @medusajs/file@2.4.0
  - @medusajs/user@2.4.0
  - @medusajs/tax@2.4.0
  - @medusajs/admin-bundler@2.4.0
  - @medusajs/event-bus-local@2.4.0
  - @medusajs/telemetry@2.4.0
  - @medusajs/cache-inmemory@2.4.0
  - @medusajs/cache-redis@2.4.0
  - @medusajs/event-bus-redis@2.4.0
  - @medusajs/auth-emailpass@2.4.0
  - @medusajs/auth-github@2.4.0
  - @medusajs/auth-google@2.4.0
  - @medusajs/file-local@2.4.0
  - @medusajs/file-s3@2.4.0
  - @medusajs/fulfillment-manual@2.4.0
  - @medusajs/locking-redis@2.4.0
  - @medusajs/notification-local@2.4.0
  - @medusajs/notification-sendgrid@2.4.0
  - @medusajs/payment-stripe@2.4.0

## 2.3.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/admin-bundler@2.3.1
  - @medusajs/core-flows@2.3.1
  - @medusajs/telemetry@2.3.1
  - @medusajs/api-key@2.3.1
  - @medusajs/auth@2.3.1
  - @medusajs/cache-inmemory@2.3.1
  - @medusajs/cache-redis@2.3.1
  - @medusajs/cart@2.3.1
  - @medusajs/currency@2.3.1
  - @medusajs/customer@2.3.1
  - @medusajs/event-bus-local@2.3.1
  - @medusajs/event-bus-redis@2.3.1
  - @medusajs/file@2.3.1
  - @medusajs/fulfillment@2.3.1
  - @medusajs/index@2.3.1
  - @medusajs/inventory@2.3.1
  - @medusajs/link-modules@2.3.1
  - @medusajs/locking@2.3.1
  - @medusajs/notification@2.3.1
  - @medusajs/order@2.3.1
  - @medusajs/payment@2.3.1
  - @medusajs/pricing@2.3.1
  - @medusajs/product@2.3.1
  - @medusajs/promotion@2.3.1
  - @medusajs/auth-emailpass@2.3.1
  - @medusajs/auth-github@2.3.1
  - @medusajs/auth-google@2.3.1
  - @medusajs/file-local@2.3.1
  - @medusajs/file-s3@2.3.1
  - @medusajs/fulfillment-manual@2.3.1
  - @medusajs/locking-postgres@2.3.1
  - @medusajs/locking-redis@2.3.1
  - @medusajs/notification-local@2.3.1
  - @medusajs/notification-sendgrid@2.3.1
  - @medusajs/payment-stripe@2.3.1
  - @medusajs/region@2.3.1
  - @medusajs/sales-channel@2.3.1
  - @medusajs/stock-location@2.3.1
  - @medusajs/store@2.3.1
  - @medusajs/tax@2.3.1
  - @medusajs/user@2.3.1
  - @medusajs/workflow-engine-inmemory@2.3.1
  - @medusajs/workflow-engine-redis@2.3.1

## 2.3.0

### Patch Changes

- [#10935](https://github.com/medusajs/medusa/pull/10935) [`b0f581cc7cb9f173666502d9ed2ea2c128b517be`](https://github.com/medusajs/medusa/commit/b0f581cc7cb9f173666502d9ed2ea2c128b517be) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add plugin build command

- [#10941](https://github.com/medusajs/medusa/pull/10941) [`4bc3f5b845f832959bed3d5f2bd320b55a8fb50f`](https://github.com/medusajs/medusa/commit/4bc3f5b845f832959bed3d5f2bd320b55a8fb50f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa,admin-bundler,cli,framework): Integrate admin extensions into plugin build

- [#11012](https://github.com/medusajs/medusa/pull/11012) [`7be47354e1eb95141f420ef9c74f98b3e2bd8315`](https://github.com/medusajs/medusa/commit/7be47354e1eb95141f420ef9c74f98b3e2bd8315) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows,medusa): use deleteRefundReasonsWorkflow in delete /admin/refund-reasons/:id

- [#10926](https://github.com/medusajs/medusa/pull/10926) [`69e2a6d6951c133295947d00fa1f99547da467d2`](https://github.com/medusajs/medusa/commit/69e2a6d6951c133295947d00fa1f99547da467d2) Thanks [@thetutlage](https://github.com/thetutlage)! - Feat/plugin develop

- [#10938](https://github.com/medusajs/medusa/pull/10938) [`b7a37598249a60c91ce70c999ff8b0dfa6246e49`](https://github.com/medusajs/medusa/commit/b7a37598249a60c91ce70c999ff8b0dfa6246e49) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(cli): Add plugin:publish and plugin:add commands support

- [#10835](https://github.com/medusajs/medusa/pull/10835) [`899b1fba4afeed61c343aa0ff5d171bfe6dc5ca8`](https://github.com/medusajs/medusa/commit/899b1fba4afeed61c343aa0ff5d171bfe6dc5ca8) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Add handler path to the http tracing to be able to group by

- [#10950](https://github.com/medusajs/medusa/pull/10950) [`5eab9e739919594ae7e7e416942ec93d84b699fd`](https://github.com/medusajs/medusa/commit/5eab9e739919594ae7e7e416942ec93d84b699fd) Thanks [@riqwan](https://github.com/riqwan)! - feat(promotion,dashboard,types,utils,medusa): Add statuses to promotions

- [#10975](https://github.com/medusajs/medusa/pull/10975) [`c75678d6d41d3b88d07681ad7e24472d6cbde672`](https://github.com/medusajs/medusa/commit/c75678d6d41d3b88d07681ad7e24472d6cbde672) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add support for loading admin extensions from the source

- [#10988](https://github.com/medusajs/medusa/pull/10988) [`0cfaab5bb16daf403966e9d0a5931e2c64d44138`](https://github.com/medusajs/medusa/commit/0cfaab5bb16daf403966e9d0a5931e2c64d44138) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(medusa, cli): plugin db generate

- [#10960](https://github.com/medusajs/medusa/pull/10960) [`0924164e86ecc256e2fa56a4e8c504abf7663131`](https://github.com/medusajs/medusa/commit/0924164e86ecc256e2fa56a4e8c504abf7663131) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(core, medusa, cli): Enable migration scripts

- [#10869](https://github.com/medusajs/medusa/pull/10869) [`1ba2fadf22a30de9f94aee4f195163ef5e9e84d2`](https://github.com/medusajs/medusa/commit/1ba2fadf22a30de9f94aee4f195163ef5e9e84d2) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin-bundler,admin-vite-plugin): Support loading loading admin extensions from plugins.

- [#10996](https://github.com/medusajs/medusa/pull/10996) [`114b2133aa7a82b7a152022e95d29e1a489ad99e`](https://github.com/medusajs/medusa/commit/114b2133aa7a82b7a152022e95d29e1a489ad99e) Thanks [@thetutlage](https://github.com/thetutlage)! - chore: lazy import admin-bundler and run scripts during publish

- [#10895](https://github.com/medusajs/medusa/pull/10895) [`c1930bd6568043d145e34d8360015e7207e18e4a`](https://github.com/medusajs/medusa/commit/c1930bd6568043d145e34d8360015e7207e18e4a) Thanks [@thetutlage](https://github.com/thetutlage)! - Feat/merge plugin modules

- [#10874](https://github.com/medusajs/medusa/pull/10874) [`28febfc6438351fddb5b214b86f96aff89db688e`](https://github.com/medusajs/medusa/commit/28febfc6438351fddb5b214b86f96aff89db688e) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: remove dead code and refactor the logic of resolving plugins

- [#10630](https://github.com/medusajs/medusa/pull/10630) [`bc22b81cdf9591912744f448c74d45bcb0f11e0c`](https://github.com/medusajs/medusa/commit/bc22b81cdf9591912744f448c74d45bcb0f11e0c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(inventory,dashboard,core-flows,js-sdk,types,medusa): Improve inventory management UX

- [#10904](https://github.com/medusajs/medusa/pull/10904) [`428fce53134bd0b224f636a9a15d369d1f03cde8`](https://github.com/medusajs/medusa/commit/428fce53134bd0b224f636a9a15d369d1f03cde8) Thanks [@thetutlage](https://github.com/thetutlage)! - chore: move build utilities to Compiler class

- Updated dependencies [[`4bc3f5b845f832959bed3d5f2bd320b55a8fb50f`](https://github.com/medusajs/medusa/commit/4bc3f5b845f832959bed3d5f2bd320b55a8fb50f), [`1758bfb8d042fa9fc82f23c36ccd61e4a439448e`](https://github.com/medusajs/medusa/commit/1758bfb8d042fa9fc82f23c36ccd61e4a439448e), [`7be47354e1eb95141f420ef9c74f98b3e2bd8315`](https://github.com/medusajs/medusa/commit/7be47354e1eb95141f420ef9c74f98b3e2bd8315), [`c5a207144e2f04f232a1beb3586422fc93047ed2`](https://github.com/medusajs/medusa/commit/c5a207144e2f04f232a1beb3586422fc93047ed2), [`5eab9e739919594ae7e7e416942ec93d84b699fd`](https://github.com/medusajs/medusa/commit/5eab9e739919594ae7e7e416942ec93d84b699fd), [`3fec01ab494dcd91ee5b2f17597e24e653ddc801`](https://github.com/medusajs/medusa/commit/3fec01ab494dcd91ee5b2f17597e24e653ddc801), [`8792d0c062d9da15da3ff3cbb92c6c06ec4102c0`](https://github.com/medusajs/medusa/commit/8792d0c062d9da15da3ff3cbb92c6c06ec4102c0), [`5faf48b8c236007cd9b229219d466681c9c884c0`](https://github.com/medusajs/medusa/commit/5faf48b8c236007cd9b229219d466681c9c884c0), [`a625bce7b022c28a256f81777b7ebab15ab1d930`](https://github.com/medusajs/medusa/commit/a625bce7b022c28a256f81777b7ebab15ab1d930), [`11f98f374cb0b77b1c80e72328fc68b5e22d5b87`](https://github.com/medusajs/medusa/commit/11f98f374cb0b77b1c80e72328fc68b5e22d5b87), [`7232a8a93053adedd964659c1f370aa9fddc0e44`](https://github.com/medusajs/medusa/commit/7232a8a93053adedd964659c1f370aa9fddc0e44), [`1ba2fadf22a30de9f94aee4f195163ef5e9e84d2`](https://github.com/medusajs/medusa/commit/1ba2fadf22a30de9f94aee4f195163ef5e9e84d2), [`bc22b81cdf9591912744f448c74d45bcb0f11e0c`](https://github.com/medusajs/medusa/commit/bc22b81cdf9591912744f448c74d45bcb0f11e0c)]:
  - @medusajs/admin-bundler@2.3.0
  - @medusajs/core-flows@2.3.0
  - @medusajs/promotion@2.3.0
  - @medusajs/pricing@2.3.0
  - @medusajs/index@2.3.0
  - @medusajs/payment@2.3.0
  - @medusajs/inventory@2.3.0
  - @medusajs/telemetry@2.3.0
  - @medusajs/api-key@2.3.0
  - @medusajs/auth@2.3.0
  - @medusajs/cache-inmemory@2.3.0
  - @medusajs/cache-redis@2.3.0
  - @medusajs/cart@2.3.0
  - @medusajs/currency@2.3.0
  - @medusajs/customer@2.3.0
  - @medusajs/event-bus-local@2.3.0
  - @medusajs/event-bus-redis@2.3.0
  - @medusajs/file@2.3.0
  - @medusajs/fulfillment@2.3.0
  - @medusajs/link-modules@2.3.0
  - @medusajs/locking@2.3.0
  - @medusajs/notification@2.3.0
  - @medusajs/order@2.3.0
  - @medusajs/product@2.3.0
  - @medusajs/auth-emailpass@2.3.0
  - @medusajs/auth-github@2.3.0
  - @medusajs/auth-google@2.3.0
  - @medusajs/file-local@2.3.0
  - @medusajs/file-s3@2.3.0
  - @medusajs/fulfillment-manual@2.3.0
  - @medusajs/locking-postgres@2.3.0
  - @medusajs/locking-redis@2.3.0
  - @medusajs/notification-local@2.3.0
  - @medusajs/notification-sendgrid@2.3.0
  - @medusajs/payment-stripe@2.3.0
  - @medusajs/region@2.3.0
  - @medusajs/sales-channel@2.3.0
  - @medusajs/stock-location@2.3.0
  - @medusajs/store@2.3.0
  - @medusajs/tax@2.3.0
  - @medusajs/user@2.3.0
  - @medusajs/workflow-engine-inmemory@2.3.0
  - @medusajs/workflow-engine-redis@2.3.0

## 2.2.0

### Patch Changes

- [#10791](https://github.com/medusajs/medusa/pull/10791) [`ecc09fd77db01fcb7e8eb8e60cd19e16e2b5ea81`](https://github.com/medusajs/medusa/commit/ecc09fd77db01fcb7e8eb8e60cd19e16e2b5ea81) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: generate modules mappings at runtime

- [#10707](https://github.com/medusajs/medusa/pull/10707) [`13ddf27c68fc2831b3661940bc5f27bab23ce8c0`](https://github.com/medusajs/medusa/commit/13ddf27c68fc2831b3661940bc5f27bab23ce8c0) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa,types,js-sdk): fix request query parameter types for store product routes

- [#10773](https://github.com/medusajs/medusa/pull/10773) [`5e9d86d75d1f2745c24a4bcd4a5c0df066578ef5`](https://github.com/medusajs/medusa/commit/5e9d86d75d1f2745c24a4bcd4a5c0df066578ef5) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: deprecate remoteQueryConfig in favor of queryConfig

- [#10717](https://github.com/medusajs/medusa/pull/10717) [`83925f5c7a2de5ffd7db21f620d6864bcf59fd04`](https://github.com/medusajs/medusa/commit/83925f5c7a2de5ffd7db21f620d6864bcf59fd04) Thanks [@ranjithkumar8352](https://github.com/ranjithkumar8352)! - Fix medusa develop command crashing on file change on windows

- [#10808](https://github.com/medusajs/medusa/pull/10808) [`988931a5513fadb12f24d1fda9ed7af32b3128af`](https://github.com/medusajs/medusa/commit/988931a5513fadb12f24d1fda9ed7af32b3128af) Thanks [@thetutlage](https://github.com/thetutlage)! - Fix/product variants filter

- [#10831](https://github.com/medusajs/medusa/pull/10831) [`e40878d9f387314c93e7ae1df36c3289240193c7`](https://github.com/medusajs/medusa/commit/e40878d9f387314c93e7ae1df36c3289240193c7) Thanks [@thetutlage](https://github.com/thetutlage)! - chore: rename remote-query-entry-points.d.ts to query-entry-points.d.ts

- [#10667](https://github.com/medusajs/medusa/pull/10667) [`47594192b79fbc798cfaf21821b60673745d1374`](https://github.com/medusajs/medusa/commit/47594192b79fbc798cfaf21821b60673745d1374) Thanks [@riqwan](https://github.com/riqwan)! - feat(dashboard,core-flows,types,utils,medusa,order): Order cancelations will refund payments

- Updated dependencies [[`699bb6dc2424053bdc73e70eecdd8fb8372b32a4`](https://github.com/medusajs/medusa/commit/699bb6dc2424053bdc73e70eecdd8fb8372b32a4), [`99a06102a246c119f69d1873f3cdeee9ff1241a0`](https://github.com/medusajs/medusa/commit/99a06102a246c119f69d1873f3cdeee9ff1241a0), [`4f897661eb7a855a881d460c565c2da6459367eb`](https://github.com/medusajs/medusa/commit/4f897661eb7a855a881d460c565c2da6459367eb), [`bbf790ea44d0ce0a128a07e66224735f5a2dccf0`](https://github.com/medusajs/medusa/commit/bbf790ea44d0ce0a128a07e66224735f5a2dccf0), [`6d989bc8cdcb2a0c8e33742e2b4c9f52b37beb57`](https://github.com/medusajs/medusa/commit/6d989bc8cdcb2a0c8e33742e2b4c9f52b37beb57), [`f7ffa3540f6e293507a1a96c0993b784a58ea507`](https://github.com/medusajs/medusa/commit/f7ffa3540f6e293507a1a96c0993b784a58ea507), [`3a0c69fbe0acd5fac907a86393a8ccf86d9837af`](https://github.com/medusajs/medusa/commit/3a0c69fbe0acd5fac907a86393a8ccf86d9837af), [`47594192b79fbc798cfaf21821b60673745d1374`](https://github.com/medusajs/medusa/commit/47594192b79fbc798cfaf21821b60673745d1374)]:
  - @medusajs/core-flows@2.2.0
  - @medusajs/stock-location@2.2.0
  - @medusajs/auth@2.2.0
  - @medusajs/auth-github@2.2.0
  - @medusajs/auth-google@2.2.0
  - @medusajs/pricing@2.2.0
  - @medusajs/promotion@2.2.0
  - @medusajs/fulfillment@2.2.0
  - @medusajs/order@2.2.0
  - @medusajs/admin-bundler@2.2.0
  - @medusajs/telemetry@2.2.0
  - @medusajs/api-key@2.2.0
  - @medusajs/cache-inmemory@2.2.0
  - @medusajs/cache-redis@2.2.0
  - @medusajs/cart@2.2.0
  - @medusajs/currency@2.2.0
  - @medusajs/customer@2.2.0
  - @medusajs/event-bus-local@2.2.0
  - @medusajs/event-bus-redis@2.2.0
  - @medusajs/file@2.2.0
  - @medusajs/index@2.2.0
  - @medusajs/inventory@2.2.0
  - @medusajs/link-modules@2.2.0
  - @medusajs/locking@2.2.0
  - @medusajs/notification@2.2.0
  - @medusajs/payment@2.2.0
  - @medusajs/product@2.2.0
  - @medusajs/auth-emailpass@2.2.0
  - @medusajs/file-local@2.2.0
  - @medusajs/file-s3@2.2.0
  - @medusajs/fulfillment-manual@2.2.0
  - @medusajs/locking-postgres@2.2.0
  - @medusajs/locking-redis@2.2.0
  - @medusajs/notification-local@2.2.0
  - @medusajs/notification-sendgrid@2.2.0
  - @medusajs/payment-stripe@2.2.0
  - @medusajs/region@2.2.0
  - @medusajs/sales-channel@2.2.0
  - @medusajs/store@2.2.0
  - @medusajs/tax@2.2.0
  - @medusajs/user@2.2.0
  - @medusajs/workflow-engine-inmemory@2.2.0
  - @medusajs/workflow-engine-redis@2.2.0

## 2.1.3

### Patch Changes

- [#10617](https://github.com/medusajs/medusa/pull/10617) [`100da64242838739816351ed259461f2d7c258e3`](https://github.com/medusajs/medusa/commit/100da64242838739816351ed259461f2d7c258e3) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: fulfillment module DML

- [#10408](https://github.com/medusajs/medusa/pull/10408) [`c9b8db04c1b35f1cf129bb9ad74789fbc2881815`](https://github.com/medusajs/medusa/commit/c9b8db04c1b35f1cf129bb9ad74789fbc2881815) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Support custom line items

- Updated dependencies [[`100da64242838739816351ed259461f2d7c258e3`](https://github.com/medusajs/medusa/commit/100da64242838739816351ed259461f2d7c258e3), [`d08b71f9b87c68350e57016e62e406a9bdd82342`](https://github.com/medusajs/medusa/commit/d08b71f9b87c68350e57016e62e406a9bdd82342), [`c9b8db04c1b35f1cf129bb9ad74789fbc2881815`](https://github.com/medusajs/medusa/commit/c9b8db04c1b35f1cf129bb9ad74789fbc2881815), [`9d85e663b8bac2240ec3e3bf99377dd0eac72160`](https://github.com/medusajs/medusa/commit/9d85e663b8bac2240ec3e3bf99377dd0eac72160), [`5d1098ceb9713225186fce16c0306b0539d71fc5`](https://github.com/medusajs/medusa/commit/5d1098ceb9713225186fce16c0306b0539d71fc5), [`1232a43fcec50b01477149089bbb957dec15ba76`](https://github.com/medusajs/medusa/commit/1232a43fcec50b01477149089bbb957dec15ba76)]:
  - @medusajs/fulfillment@2.1.3
  - @medusajs/product@2.1.3
  - @medusajs/core-flows@2.1.3
  - @medusajs/cart@2.1.3
  - @medusajs/admin-bundler@2.1.3
  - @medusajs/telemetry@2.1.3
  - @medusajs/api-key@2.1.3
  - @medusajs/auth@2.1.3
  - @medusajs/cache-inmemory@2.1.3
  - @medusajs/cache-redis@2.1.3
  - @medusajs/currency@2.1.3
  - @medusajs/customer@2.1.3
  - @medusajs/event-bus-local@2.1.3
  - @medusajs/event-bus-redis@2.1.3
  - @medusajs/file@2.1.3
  - @medusajs/index@2.1.3
  - @medusajs/inventory@2.1.3
  - @medusajs/link-modules@2.1.3
  - @medusajs/locking@2.1.3
  - @medusajs/notification@2.1.3
  - @medusajs/order@2.1.3
  - @medusajs/payment@2.1.3
  - @medusajs/pricing@2.1.3
  - @medusajs/promotion@2.1.3
  - @medusajs/auth-emailpass@2.1.3
  - @medusajs/auth-github@2.1.3
  - @medusajs/auth-google@2.1.3
  - @medusajs/file-local@2.1.3
  - @medusajs/file-s3@2.1.3
  - @medusajs/fulfillment-manual@2.1.3
  - @medusajs/locking-postgres@2.1.3
  - @medusajs/locking-redis@2.1.3
  - @medusajs/notification-local@2.1.3
  - @medusajs/notification-sendgrid@2.1.3
  - @medusajs/payment-stripe@2.1.3
  - @medusajs/region@2.1.3
  - @medusajs/sales-channel@2.1.3
  - @medusajs/stock-location@2.1.3
  - @medusajs/store@2.1.3
  - @medusajs/tax@2.1.3
  - @medusajs/user@2.1.3
  - @medusajs/workflow-engine-inmemory@2.1.3
  - @medusajs/workflow-engine-redis@2.1.3

## 2.1.2

### Patch Changes

- [#10579](https://github.com/medusajs/medusa/pull/10579) [`6367bccde88158d524dfa01e5a8123ffa3461c10`](https://github.com/medusajs/medusa/commit/6367bccde88158d524dfa01e5a8123ffa3461c10) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, pricing): Cart workflows handle pricing context accurately

- Updated dependencies [[`729eb5da7b6daf9781b8bdcbc2fab344e942d444`](https://github.com/medusajs/medusa/commit/729eb5da7b6daf9781b8bdcbc2fab344e942d444), [`16192d9b3077e36c6b1df7409a0c0f26f643cc6d`](https://github.com/medusajs/medusa/commit/16192d9b3077e36c6b1df7409a0c0f26f643cc6d), [`95baacfd00f54de028226731b016917caacde5af`](https://github.com/medusajs/medusa/commit/95baacfd00f54de028226731b016917caacde5af), [`16d27ea6e4c2e4290820fe2328f08557534fcb8f`](https://github.com/medusajs/medusa/commit/16d27ea6e4c2e4290820fe2328f08557534fcb8f), [`fad85a9d293acee1dae784afa223a080b9b8b85b`](https://github.com/medusajs/medusa/commit/fad85a9d293acee1dae784afa223a080b9b8b85b), [`4ad9ac1e5f3b583514015ffd35b88d0f60b2b38a`](https://github.com/medusajs/medusa/commit/4ad9ac1e5f3b583514015ffd35b88d0f60b2b38a), [`90ad2566fdde2215447100d10c3fe9b17ce826b5`](https://github.com/medusajs/medusa/commit/90ad2566fdde2215447100d10c3fe9b17ce826b5), [`0264294ab55fc34a728834b5d217e0c8a7bf5a90`](https://github.com/medusajs/medusa/commit/0264294ab55fc34a728834b5d217e0c8a7bf5a90), [`e021c9258cd3bf7b92213b0bd2d529f72200142e`](https://github.com/medusajs/medusa/commit/e021c9258cd3bf7b92213b0bd2d529f72200142e), [`6367bccde88158d524dfa01e5a8123ffa3461c10`](https://github.com/medusajs/medusa/commit/6367bccde88158d524dfa01e5a8123ffa3461c10)]:
  - @medusajs/inventory@2.1.2
  - @medusajs/product@2.1.2
  - @medusajs/cart@2.1.2
  - @medusajs/customer@2.1.2
  - @medusajs/promotion@2.1.2
  - @medusajs/stock-location@2.1.2
  - @medusajs/fulfillment@2.1.2
  - @medusajs/payment@2.1.2
  - @medusajs/tax@2.1.2
  - @medusajs/core-flows@2.1.2
  - @medusajs/pricing@2.1.2
  - @medusajs/admin-bundler@2.1.2
  - @medusajs/telemetry@2.1.2
  - @medusajs/api-key@2.1.2
  - @medusajs/auth@2.1.2
  - @medusajs/cache-inmemory@2.1.2
  - @medusajs/cache-redis@2.1.2
  - @medusajs/currency@2.1.2
  - @medusajs/event-bus-local@2.1.2
  - @medusajs/event-bus-redis@2.1.2
  - @medusajs/file@2.1.2
  - @medusajs/index@2.1.2
  - @medusajs/link-modules@2.1.2
  - @medusajs/locking@2.1.2
  - @medusajs/notification@2.1.2
  - @medusajs/order@2.1.2
  - @medusajs/auth-emailpass@2.1.2
  - @medusajs/auth-github@2.1.2
  - @medusajs/auth-google@2.1.2
  - @medusajs/file-local@2.1.2
  - @medusajs/file-s3@2.1.2
  - @medusajs/fulfillment-manual@2.1.2
  - @medusajs/locking-postgres@2.1.2
  - @medusajs/locking-redis@2.1.2
  - @medusajs/notification-local@2.1.2
  - @medusajs/notification-sendgrid@2.1.2
  - @medusajs/payment-stripe@2.1.2
  - @medusajs/region@2.1.2
  - @medusajs/sales-channel@2.1.2
  - @medusajs/store@2.1.2
  - @medusajs/user@2.1.2
  - @medusajs/workflow-engine-inmemory@2.1.2
  - @medusajs/workflow-engine-redis@2.1.2

## 2.1.1

### Patch Changes

- [#10469](https://github.com/medusajs/medusa/pull/10469) [`c8cb9b5c1addb5dcd30ca559813b96e5fba1d6a3`](https://github.com/medusajs/medusa/commit/c8cb9b5c1addb5dcd30ca559813b96e5fba1d6a3) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa): add query type argument to RequestWithContext

- Updated dependencies [[`90ae187e097c42a224c701f31cbc2924ea6ee86b`](https://github.com/medusajs/medusa/commit/90ae187e097c42a224c701f31cbc2924ea6ee86b), [`0a077d48e14976bafcf19705fc48e66756362fd6`](https://github.com/medusajs/medusa/commit/0a077d48e14976bafcf19705fc48e66756362fd6), [`a04238a7f1b77e6f6fe0e51951251286cd207115`](https://github.com/medusajs/medusa/commit/a04238a7f1b77e6f6fe0e51951251286cd207115), [`70d77ea22fb73021bc1f4da0780a2235f1e86fb7`](https://github.com/medusajs/medusa/commit/70d77ea22fb73021bc1f4da0780a2235f1e86fb7), [`f95c4e240c4a5ca0fb88a09636c3d8a2266de279`](https://github.com/medusajs/medusa/commit/f95c4e240c4a5ca0fb88a09636c3d8a2266de279), [`f3c91c908a1c8d38eb31c21dbd94d4ad6cea9688`](https://github.com/medusajs/medusa/commit/f3c91c908a1c8d38eb31c21dbd94d4ad6cea9688), [`559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a`](https://github.com/medusajs/medusa/commit/559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a), [`b0448a7c35135f5a0e41e0195a507b10ce4b2131`](https://github.com/medusajs/medusa/commit/b0448a7c35135f5a0e41e0195a507b10ce4b2131), [`be15240909c5da4c585f30a1c3b5f0212121f8f5`](https://github.com/medusajs/medusa/commit/be15240909c5da4c585f30a1c3b5f0212121f8f5), [`0a16efa4266f93302b31589349e777bc8d24dc07`](https://github.com/medusajs/medusa/commit/0a16efa4266f93302b31589349e777bc8d24dc07), [`69f4c4f4e06022990fcd9c66d8f1a68ff0ff97b1`](https://github.com/medusajs/medusa/commit/69f4c4f4e06022990fcd9c66d8f1a68ff0ff97b1)]:
  - @medusajs/workflow-engine-redis@2.1.1
  - @medusajs/core-flows@2.1.1
  - @medusajs/workflow-engine-inmemory@2.1.1
  - @medusajs/payment@2.1.1
  - @medusajs/api-key@2.1.1
  - @medusajs/promotion@2.1.1
  - @medusajs/store@2.1.1
  - @medusajs/locking-postgres@2.1.1
  - @medusajs/sales-channel@2.1.1
  - @medusajs/cart@2.1.1
  - @medusajs/index@2.1.1
  - @medusajs/admin-bundler@2.1.1
  - @medusajs/telemetry@2.1.1
  - @medusajs/auth@2.1.1
  - @medusajs/cache-inmemory@2.1.1
  - @medusajs/cache-redis@2.1.1
  - @medusajs/currency@2.1.1
  - @medusajs/customer@2.1.1
  - @medusajs/event-bus-local@2.1.1
  - @medusajs/event-bus-redis@2.1.1
  - @medusajs/file@2.1.1
  - @medusajs/fulfillment@2.1.1
  - @medusajs/inventory@2.1.1
  - @medusajs/link-modules@2.1.1
  - @medusajs/locking@2.1.1
  - @medusajs/notification@2.1.1
  - @medusajs/order@2.1.1
  - @medusajs/pricing@2.1.1
  - @medusajs/product@2.1.1
  - @medusajs/auth-emailpass@2.1.1
  - @medusajs/auth-github@2.1.1
  - @medusajs/auth-google@2.1.1
  - @medusajs/file-local@2.1.1
  - @medusajs/file-s3@2.1.1
  - @medusajs/fulfillment-manual@2.1.1
  - @medusajs/locking-redis@2.1.1
  - @medusajs/notification-local@2.1.1
  - @medusajs/notification-sendgrid@2.1.1
  - @medusajs/payment-stripe@2.1.1
  - @medusajs/region@2.1.1
  - @medusajs/stock-location@2.1.1
  - @medusajs/tax@2.1.1
  - @medusajs/user@2.1.1

## 2.1.0

### Patch Changes

- [#10327](https://github.com/medusajs/medusa/pull/10327) [`ef046844cca26deddc02008cd50675fcfb4c8af4`](https://github.com/medusajs/medusa/commit/ef046844cca26deddc02008cd50675fcfb4c8af4) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa): remove request body type argument from cancel order transfer routes

- [#10374](https://github.com/medusajs/medusa/pull/10374) [`11bd55613304350a5478fd4c001e2309cca3a995`](https://github.com/medusajs/medusa/commit/11bd55613304350a5478fd4c001e2309cca3a995) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,framework,medusa): list shipping options pass in cart as pricing context

- Updated dependencies [[`324b4ab438662f44de495ffe4d9137677a032a00`](https://github.com/medusajs/medusa/commit/324b4ab438662f44de495ffe4d9137677a032a00), [`4ef353a7b9e807f727d97025954306c9312ff786`](https://github.com/medusajs/medusa/commit/4ef353a7b9e807f727d97025954306c9312ff786), [`2838100efc8f1bef7f1bea022912dfbfa064bb56`](https://github.com/medusajs/medusa/commit/2838100efc8f1bef7f1bea022912dfbfa064bb56), [`ac7958523218fe01528ad25ef6a203f620ecb6dd`](https://github.com/medusajs/medusa/commit/ac7958523218fe01528ad25ef6a203f620ecb6dd), [`11bd55613304350a5478fd4c001e2309cca3a995`](https://github.com/medusajs/medusa/commit/11bd55613304350a5478fd4c001e2309cca3a995)]:
  - @medusajs/pricing@2.1.0
  - @medusajs/auth@2.1.0
  - @medusajs/product@2.1.0
  - @medusajs/user@2.1.0
  - @medusajs/core-flows@2.1.0
  - @medusajs/admin-bundler@2.1.0
  - @medusajs/telemetry@2.1.0
  - @medusajs/api-key@2.1.0
  - @medusajs/cache-inmemory@2.1.0
  - @medusajs/cache-redis@2.1.0
  - @medusajs/cart@2.1.0
  - @medusajs/currency@2.1.0
  - @medusajs/customer@2.1.0
  - @medusajs/event-bus-local@2.1.0
  - @medusajs/event-bus-redis@2.1.0
  - @medusajs/file@2.1.0
  - @medusajs/fulfillment@2.1.0
  - @medusajs/index@2.1.0
  - @medusajs/inventory@2.1.0
  - @medusajs/link-modules@2.1.0
  - @medusajs/locking@2.1.0
  - @medusajs/notification@2.1.0
  - @medusajs/order@2.1.0
  - @medusajs/payment@2.1.0
  - @medusajs/promotion@2.1.0
  - @medusajs/auth-emailpass@2.1.0
  - @medusajs/auth-github@2.1.0
  - @medusajs/auth-google@2.1.0
  - @medusajs/file-local@2.1.0
  - @medusajs/file-s3@2.1.0
  - @medusajs/fulfillment-manual@2.1.0
  - @medusajs/locking-postgres@2.1.0
  - @medusajs/locking-redis@2.1.0
  - @medusajs/notification-local@2.1.0
  - @medusajs/notification-sendgrid@2.1.0
  - @medusajs/payment-stripe@2.1.0
  - @medusajs/region@2.1.0
  - @medusajs/sales-channel@2.1.0
  - @medusajs/stock-location@2.1.0
  - @medusajs/store@2.1.0
  - @medusajs/tax@2.1.0
  - @medusajs/workflow-engine-inmemory@2.1.0
  - @medusajs/workflow-engine-redis@2.1.0

## 2.0.7

### Patch Changes

- Updated dependencies [[`030ee871506cfe178702853714feaaa33f1d9cf4`](https://github.com/medusajs/medusa/commit/030ee871506cfe178702853714feaaa33f1d9cf4)]:
  - @medusajs/core-flows@2.0.7
  - @medusajs/admin-bundler@2.0.7
  - @medusajs/telemetry@2.0.7
  - @medusajs/api-key@2.0.7
  - @medusajs/auth@2.0.7
  - @medusajs/cache-inmemory@2.0.7
  - @medusajs/cache-redis@2.0.7
  - @medusajs/cart@2.0.7
  - @medusajs/currency@2.0.7
  - @medusajs/customer@2.0.7
  - @medusajs/event-bus-local@2.0.7
  - @medusajs/event-bus-redis@2.0.7
  - @medusajs/file@2.0.7
  - @medusajs/fulfillment@2.0.7
  - @medusajs/index@2.0.7
  - @medusajs/inventory@2.0.7
  - @medusajs/link-modules@2.0.7
  - @medusajs/locking@2.0.7
  - @medusajs/notification@2.0.7
  - @medusajs/order@2.0.7
  - @medusajs/payment@2.0.7
  - @medusajs/pricing@2.0.7
  - @medusajs/product@2.0.7
  - @medusajs/promotion@2.0.7
  - @medusajs/auth-emailpass@2.0.7
  - @medusajs/auth-github@2.0.7
  - @medusajs/auth-google@2.0.7
  - @medusajs/file-local@2.0.7
  - @medusajs/file-s3@2.0.7
  - @medusajs/fulfillment-manual@2.0.7
  - @medusajs/locking-postgres@2.0.7
  - @medusajs/locking-redis@2.0.7
  - @medusajs/notification-local@2.0.7
  - @medusajs/notification-sendgrid@2.0.7
  - @medusajs/payment-stripe@2.0.7
  - @medusajs/region@2.0.7
  - @medusajs/sales-channel@2.0.7
  - @medusajs/stock-location@2.0.7
  - @medusajs/store@2.0.7
  - @medusajs/tax@2.0.7
  - @medusajs/user@2.0.7
  - @medusajs/workflow-engine-inmemory@2.0.7
  - @medusajs/workflow-engine-redis@2.0.7

## 2.0.6

### Patch Changes

- Updated dependencies [[`c28d0db1647a5c8edaf0ba0faba6426e8a740399`](https://github.com/medusajs/medusa/commit/c28d0db1647a5c8edaf0ba0faba6426e8a740399)]:
  - @medusajs/product@2.0.6
  - @medusajs/admin-bundler@2.0.6
  - @medusajs/core-flows@2.0.6
  - @medusajs/telemetry@2.0.6
  - @medusajs/api-key@2.0.6
  - @medusajs/auth@2.0.6
  - @medusajs/cache-inmemory@2.0.6
  - @medusajs/cache-redis@2.0.6
  - @medusajs/cart@2.0.6
  - @medusajs/currency@2.0.6
  - @medusajs/customer@2.0.6
  - @medusajs/event-bus-local@2.0.6
  - @medusajs/event-bus-redis@2.0.6
  - @medusajs/file@2.0.6
  - @medusajs/fulfillment@2.0.6
  - @medusajs/index@2.0.6
  - @medusajs/inventory@2.0.6
  - @medusajs/link-modules@2.0.6
  - @medusajs/locking@2.0.6
  - @medusajs/notification@2.0.6
  - @medusajs/order@2.0.6
  - @medusajs/payment@2.0.6
  - @medusajs/pricing@2.0.6
  - @medusajs/promotion@2.0.6
  - @medusajs/auth-emailpass@2.0.6
  - @medusajs/auth-github@2.0.6
  - @medusajs/auth-google@2.0.6
  - @medusajs/file-local@2.0.6
  - @medusajs/file-s3@2.0.6
  - @medusajs/fulfillment-manual@2.0.6
  - @medusajs/locking-postgres@2.0.6
  - @medusajs/locking-redis@2.0.6
  - @medusajs/notification-local@2.0.6
  - @medusajs/notification-sendgrid@2.0.6
  - @medusajs/payment-stripe@2.0.6
  - @medusajs/region@2.0.6
  - @medusajs/sales-channel@2.0.6
  - @medusajs/stock-location@2.0.6
  - @medusajs/store@2.0.6
  - @medusajs/tax@2.0.6
  - @medusajs/user@2.0.6
  - @medusajs/workflow-engine-inmemory@2.0.6
  - @medusajs/workflow-engine-redis@2.0.6

## 2.0.5

### Patch Changes

- [#10073](https://github.com/medusajs/medusa/pull/10073) [`d9d4e575f60b303f8143815ea8a3b3d9d14cd0ec`](https://github.com/medusajs/medusa/commit/d9d4e575f60b303f8143815ea8a3b3d9d14cd0ec) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: do not update the .env.template file with the database name

- [#10136](https://github.com/medusajs/medusa/pull/10136) [`d933b3f1e4a92e841e881a1fd173df806008cc4a`](https://github.com/medusajs/medusa/commit/d933b3f1e4a92e841e881a1fd173df806008cc4a) Thanks [@thetutlage](https://github.com/thetutlage)! - Refactor/finish rename order

- [#10207](https://github.com/medusajs/medusa/pull/10207) [`6486f2bcce1d128ae8126091f252e67aa896ff17`](https://github.com/medusajs/medusa/commit/6486f2bcce1d128ae8126091f252e67aa896ff17) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa): remove cart customer validation + rename workflow

- [#9980](https://github.com/medusajs/medusa/pull/9980) [`2344012d1ccfae998bceb0c2b75ba9a17f84c18b`](https://github.com/medusajs/medusa/commit/2344012d1ccfae998bceb0c2b75ba9a17f84c18b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Create Order before payment capture

- Updated dependencies [[`47ca1d4b54de78fe952619a7d331ea4b0ab3d7a6`](https://github.com/medusajs/medusa/commit/47ca1d4b54de78fe952619a7d331ea4b0ab3d7a6), [`1659c9be5d3ace1bed9f3a6e7206fe54e60645c0`](https://github.com/medusajs/medusa/commit/1659c9be5d3ace1bed9f3a6e7206fe54e60645c0), [`4c983557f9483cb5ace561974b27697911cee7cc`](https://github.com/medusajs/medusa/commit/4c983557f9483cb5ace561974b27697911cee7cc), [`fc5d2b5fcacddc7e4451997b8cd1c70e6f95326c`](https://github.com/medusajs/medusa/commit/fc5d2b5fcacddc7e4451997b8cd1c70e6f95326c), [`1f44281ed6bc2de0ba8ffec43f0671902b711520`](https://github.com/medusajs/medusa/commit/1f44281ed6bc2de0ba8ffec43f0671902b711520), [`d933b3f1e4a92e841e881a1fd173df806008cc4a`](https://github.com/medusajs/medusa/commit/d933b3f1e4a92e841e881a1fd173df806008cc4a), [`6486f2bcce1d128ae8126091f252e67aa896ff17`](https://github.com/medusajs/medusa/commit/6486f2bcce1d128ae8126091f252e67aa896ff17), [`3e265229f2ae5c3d55f64a445574c13c40b52c14`](https://github.com/medusajs/medusa/commit/3e265229f2ae5c3d55f64a445574c13c40b52c14), [`2822972e04f12d2ca9378dd09529ab6ca308a286`](https://github.com/medusajs/medusa/commit/2822972e04f12d2ca9378dd09529ab6ca308a286), [`06ce16c90ba1cc20daa8c10fadab067d9381a7d1`](https://github.com/medusajs/medusa/commit/06ce16c90ba1cc20daa8c10fadab067d9381a7d1), [`b1b7a4abf10956d2d2863ba2b7e08e39b1abfbc1`](https://github.com/medusajs/medusa/commit/b1b7a4abf10956d2d2863ba2b7e08e39b1abfbc1), [`1eef324af33cfb70b414ac564788f28dfd6d2c18`](https://github.com/medusajs/medusa/commit/1eef324af33cfb70b414ac564788f28dfd6d2c18), [`2344012d1ccfae998bceb0c2b75ba9a17f84c18b`](https://github.com/medusajs/medusa/commit/2344012d1ccfae998bceb0c2b75ba9a17f84c18b), [`7aa990795cf262f98b86adb7f14d6f146620bc1d`](https://github.com/medusajs/medusa/commit/7aa990795cf262f98b86adb7f14d6f146620bc1d)]:
  - @medusajs/inventory@2.0.5
  - @medusajs/product@2.0.5
  - @medusajs/auth-google@2.0.5
  - @medusajs/core-flows@2.0.5
  - @medusajs/event-bus-local@2.0.5
  - @medusajs/event-bus-redis@2.0.5
  - @medusajs/api-key@2.0.5
  - @medusajs/auth@2.0.5
  - @medusajs/cart@2.0.5
  - @medusajs/currency@2.0.5
  - @medusajs/file@2.0.5
  - @medusajs/fulfillment@2.0.5
  - @medusajs/index@2.0.5
  - @medusajs/locking@2.0.5
  - @medusajs/notification@2.0.5
  - @medusajs/order@2.0.5
  - @medusajs/payment@2.0.5
  - @medusajs/pricing@2.0.5
  - @medusajs/promotion@2.0.5
  - @medusajs/region@2.0.5
  - @medusajs/sales-channel@2.0.5
  - @medusajs/stock-location@2.0.5
  - @medusajs/store@2.0.5
  - @medusajs/tax@2.0.5
  - @medusajs/user@2.0.5
  - @medusajs/workflow-engine-inmemory@2.0.5
  - @medusajs/workflow-engine-redis@2.0.5
  - @medusajs/locking-postgres@2.0.5
  - @medusajs/file-local@2.0.5
  - @medusajs/payment-stripe@2.0.5
  - @medusajs/admin-bundler@2.0.5
  - @medusajs/telemetry@2.0.5
  - @medusajs/cache-inmemory@2.0.5
  - @medusajs/cache-redis@2.0.5
  - @medusajs/customer@2.0.5
  - @medusajs/link-modules@2.0.5
  - @medusajs/auth-emailpass@2.0.5
  - @medusajs/auth-github@2.0.5
  - @medusajs/file-s3@2.0.5
  - @medusajs/fulfillment-manual@2.0.5
  - @medusajs/locking-redis@2.0.5
  - @medusajs/notification-local@2.0.5
  - @medusajs/notification-sendgrid@2.0.5

## 2.0.4

### Patch Changes

- [#10027](https://github.com/medusajs/medusa/pull/10027) [`0ef92cce2848ed447028434c43e4041f094cb402`](https://github.com/medusajs/medusa/commit/0ef92cce2848ed447028434c43e4041f094cb402) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(medusa): show success message after user is created

- Updated dependencies []:
  - @medusajs/admin-bundler@2.0.4
  - @medusajs/core-flows@2.0.4
  - @medusajs/telemetry@2.0.4
  - @medusajs/api-key@2.0.4
  - @medusajs/auth@2.0.4
  - @medusajs/cache-inmemory@2.0.4
  - @medusajs/cache-redis@2.0.4
  - @medusajs/cart@2.0.4
  - @medusajs/currency@2.0.4
  - @medusajs/customer@2.0.4
  - @medusajs/event-bus-local@2.0.4
  - @medusajs/event-bus-redis@2.0.4
  - @medusajs/file@2.0.4
  - @medusajs/fulfillment@2.0.4
  - @medusajs/index@2.0.4
  - @medusajs/inventory@2.0.4
  - @medusajs/link-modules@2.0.4
  - @medusajs/locking@2.0.4
  - @medusajs/notification@2.0.4
  - @medusajs/order@2.0.4
  - @medusajs/payment@2.0.4
  - @medusajs/pricing@2.0.4
  - @medusajs/product@2.0.4
  - @medusajs/promotion@2.0.4
  - @medusajs/auth-emailpass@2.0.4
  - @medusajs/auth-github@2.0.4
  - @medusajs/auth-google@2.0.4
  - @medusajs/file-local@2.0.4
  - @medusajs/file-s3@2.0.4
  - @medusajs/fulfillment-manual@2.0.4
  - @medusajs/locking-postgres@2.0.4
  - @medusajs/locking-redis@2.0.4
  - @medusajs/notification-local@2.0.4
  - @medusajs/notification-sendgrid@2.0.4
  - @medusajs/payment-stripe@2.0.4
  - @medusajs/region@2.0.4
  - @medusajs/sales-channel@2.0.4
  - @medusajs/stock-location@2.0.4
  - @medusajs/store@2.0.4
  - @medusajs/tax@2.0.4
  - @medusajs/user@2.0.4
  - @medusajs/workflow-engine-inmemory@2.0.4
  - @medusajs/workflow-engine-redis@2.0.4

## 2.0.3

### Patch Changes

- Updated dependencies [[`cd578e89ff4cc26f2fd570c34858e44bb0143e10`](https://github.com/medusajs/medusa/commit/cd578e89ff4cc26f2fd570c34858e44bb0143e10), [`1bae311a293096c9a8019b825a2fcd07e1918632`](https://github.com/medusajs/medusa/commit/1bae311a293096c9a8019b825a2fcd07e1918632), [`03f4b66b90625634f13409be35cd57081f0eb7d5`](https://github.com/medusajs/medusa/commit/03f4b66b90625634f13409be35cd57081f0eb7d5), [`6ead7bf92d69036c7900bf5b1a8af67bbd7585ae`](https://github.com/medusajs/medusa/commit/6ead7bf92d69036c7900bf5b1a8af67bbd7585ae)]:
  - @medusajs/auth-google@2.0.3
  - @medusajs/core-flows@2.0.3
  - @medusajs/link-modules@2.0.3
  - @medusajs/payment-stripe@2.0.3
  - @medusajs/admin-bundler@2.0.3
  - @medusajs/telemetry@2.0.3
  - @medusajs/api-key@2.0.3
  - @medusajs/auth@2.0.3
  - @medusajs/cache-inmemory@2.0.3
  - @medusajs/cache-redis@2.0.3
  - @medusajs/cart@2.0.3
  - @medusajs/currency@2.0.3
  - @medusajs/customer@2.0.3
  - @medusajs/event-bus-local@2.0.3
  - @medusajs/event-bus-redis@2.0.3
  - @medusajs/file@2.0.3
  - @medusajs/fulfillment@2.0.3
  - @medusajs/index@2.0.3
  - @medusajs/inventory@2.0.3
  - @medusajs/locking@2.0.3
  - @medusajs/notification@2.0.3
  - @medusajs/order@2.0.3
  - @medusajs/payment@2.0.3
  - @medusajs/pricing@2.0.3
  - @medusajs/product@2.0.3
  - @medusajs/promotion@2.0.3
  - @medusajs/auth-emailpass@2.0.3
  - @medusajs/auth-github@2.0.3
  - @medusajs/file-local@2.0.3
  - @medusajs/file-s3@2.0.3
  - @medusajs/fulfillment-manual@2.0.3
  - @medusajs/locking-postgres@2.0.3
  - @medusajs/locking-redis@2.0.3
  - @medusajs/notification-local@2.0.3
  - @medusajs/notification-sendgrid@2.0.3
  - @medusajs/region@2.0.3
  - @medusajs/sales-channel@2.0.3
  - @medusajs/stock-location@2.0.3
  - @medusajs/store@2.0.3
  - @medusajs/tax@2.0.3
  - @medusajs/user@2.0.3
  - @medusajs/workflow-engine-inmemory@2.0.3
  - @medusajs/workflow-engine-redis@2.0.3

## 2.0.2

### Patch Changes

- [#9939](https://github.com/medusajs/medusa/pull/9939) [`de228d209f30dfbb5b500d5cb49932b63e06f52a`](https://github.com/medusajs/medusa/commit/de228d209f30dfbb5b500d5cb49932b63e06f52a) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(telemetry): Pointing and resolving packages wrongly

- [#9929](https://github.com/medusajs/medusa/pull/9929) [`c1c85ef952441eacfe8b6c2ffa9304ac4433053f`](https://github.com/medusajs/medusa/commit/c1c85ef952441eacfe8b6c2ffa9304ac4433053f) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(core-flows,medusa): Include region_id in shipping option retrieval

- Updated dependencies [[`de228d209f30dfbb5b500d5cb49932b63e06f52a`](https://github.com/medusajs/medusa/commit/de228d209f30dfbb5b500d5cb49932b63e06f52a), [`c1c85ef952441eacfe8b6c2ffa9304ac4433053f`](https://github.com/medusajs/medusa/commit/c1c85ef952441eacfe8b6c2ffa9304ac4433053f), [`898a437db0c411aae9fa15d4ceefbdc3eeb5e335`](https://github.com/medusajs/medusa/commit/898a437db0c411aae9fa15d4ceefbdc3eeb5e335)]:
  - @medusajs/telemetry@2.0.2
  - @medusajs/core-flows@2.0.2
  - @medusajs/locking@2.0.2
  - @medusajs/admin-bundler@2.0.2
  - @medusajs/api-key@2.0.2
  - @medusajs/auth@2.0.2
  - @medusajs/cache-inmemory@2.0.2
  - @medusajs/cache-redis@2.0.2
  - @medusajs/cart@2.0.2
  - @medusajs/currency@2.0.2
  - @medusajs/customer@2.0.2
  - @medusajs/event-bus-local@2.0.2
  - @medusajs/event-bus-redis@2.0.2
  - @medusajs/file@2.0.2
  - @medusajs/fulfillment@2.0.2
  - @medusajs/index@2.0.2
  - @medusajs/inventory@2.0.2
  - @medusajs/link-modules@2.0.2
  - @medusajs/notification@2.0.2
  - @medusajs/order@2.0.2
  - @medusajs/payment@2.0.2
  - @medusajs/pricing@2.0.2
  - @medusajs/product@2.0.2
  - @medusajs/promotion@2.0.2
  - @medusajs/auth-emailpass@2.0.2
  - @medusajs/auth-github@2.0.2
  - @medusajs/auth-google@2.0.2
  - @medusajs/file-local@2.0.2
  - @medusajs/file-s3@2.0.2
  - @medusajs/fulfillment-manual@2.0.2
  - @medusajs/locking-postgres@2.0.2
  - @medusajs/locking-redis@2.0.2
  - @medusajs/notification-local@2.0.2
  - @medusajs/notification-sendgrid@2.0.2
  - @medusajs/payment-stripe@2.0.2
  - @medusajs/region@2.0.2
  - @medusajs/sales-channel@2.0.2
  - @medusajs/stock-location@2.0.2
  - @medusajs/store@2.0.2
  - @medusajs/tax@2.0.2
  - @medusajs/user@2.0.2
  - @medusajs/workflow-engine-inmemory@2.0.2
  - @medusajs/workflow-engine-redis@2.0.2

## 2.0.1

### Patch Changes

- [#9748](https://github.com/medusajs/medusa/pull/9748) [`471f7e4a10fe415064480b2a0aa5b8b23174c141`](https://github.com/medusajs/medusa/commit/471f7e4a10fe415064480b2a0aa5b8b23174c141) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Admin validator filtering and pagination

- Updated dependencies []:
  - @medusajs/admin-bundler@2.0.1
  - @medusajs/core-flows@2.0.1
  - @medusajs/telemetry@2.0.1
  - @medusajs/api-key@2.0.1
  - @medusajs/auth@2.0.1
  - @medusajs/cache-inmemory@2.0.1
  - @medusajs/cache-redis@2.0.1
  - @medusajs/cart@2.0.1
  - @medusajs/currency@2.0.1
  - @medusajs/customer@2.0.1
  - @medusajs/event-bus-local@2.0.1
  - @medusajs/event-bus-redis@2.0.1
  - @medusajs/file@2.0.1
  - @medusajs/fulfillment@2.0.1
  - @medusajs/index@2.0.1
  - @medusajs/inventory@2.0.1
  - @medusajs/link-modules@2.0.1
  - @medusajs/locking@2.0.1
  - @medusajs/notification@2.0.1
  - @medusajs/order@2.0.1
  - @medusajs/payment@2.0.1
  - @medusajs/pricing@2.0.1
  - @medusajs/product@2.0.1
  - @medusajs/promotion@2.0.1
  - @medusajs/auth-emailpass@2.0.1
  - @medusajs/auth-github@2.0.1
  - @medusajs/auth-google@2.0.1
  - @medusajs/file-local@2.0.1
  - @medusajs/file-s3@2.0.1
  - @medusajs/fulfillment-manual@2.0.1
  - @medusajs/locking-postgres@2.0.1
  - @medusajs/locking-redis@2.0.1
  - @medusajs/notification-local@2.0.1
  - @medusajs/notification-sendgrid@2.0.1
  - @medusajs/payment-stripe@2.0.1
  - @medusajs/region@2.0.1
  - @medusajs/sales-channel@2.0.1
  - @medusajs/stock-location@2.0.1
  - @medusajs/store@2.0.1
  - @medusajs/tax@2.0.1
  - @medusajs/user@2.0.1
  - @medusajs/workflow-engine-inmemory@2.0.1
  - @medusajs/workflow-engine-redis@2.0.1

## 2.0.0

### Major Changes

- [#7341](https://github.com/medusajs/medusa/pull/7341) [`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Medusa 2.0

### Patch Changes

- Updated dependencies [[`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e)]:
  - @medusajs/core-flows@2.0.0
  - @medusajs/telemetry@2.0.0
  - @medusajs/api-key@2.0.0
  - @medusajs/auth@2.0.0
  - @medusajs/auth-emailpass@2.0.0
  - @medusajs/auth-google@2.0.0
  - @medusajs/cache-inmemory@2.0.0
  - @medusajs/cache-redis@2.0.0
  - @medusajs/cart@2.0.0
  - @medusajs/currency@2.0.0
  - @medusajs/customer@2.0.0
  - @medusajs/event-bus-local@2.0.0
  - @medusajs/event-bus-redis@2.0.0
  - @medusajs/file@2.0.0
  - @medusajs/fulfillment@2.0.0
  - @medusajs/inventory@2.0.0
  - @medusajs/link-modules@2.0.0
  - @medusajs/notification@2.0.0
  - @medusajs/order@2.0.0
  - @medusajs/payment@2.0.0
  - @medusajs/pricing@2.0.0
  - @medusajs/product@2.0.0
  - @medusajs/promotion@2.0.0
  - @medusajs/file-local@2.0.0
  - @medusajs/file-s3@2.0.0
  - @medusajs/fulfillment-manual@2.0.0
  - @medusajs/notification-local@2.0.0
  - @medusajs/notification-sendgrid@2.0.0
  - @medusajs/payment-stripe@2.0.0
  - @medusajs/region@2.0.0
  - @medusajs/sales-channel@2.0.0
  - @medusajs/stock-location@2.0.0
  - @medusajs/store@2.0.0
  - @medusajs/tax@2.0.0
  - @medusajs/user@2.0.0
  - @medusajs/workflow-engine-inmemory@2.0.0
  - @medusajs/workflow-engine-redis@2.0.0
  - @medusajs/admin-bundler@2.0.0
  - @medusajs/framework@2.0.0
  - @medusajs/index@2.0.0
  - @medusajs/locking@2.0.0
  - @medusajs/locking-redis@2.0.0
  - @medusajs/locking-postgres@2.0.0
  - @medusajs/auth-github@2.0.0

## 1.20.5

### Patch Changes

- [#6827](https://github.com/medusajs/medusa/pull/6827) [`0c0b425de7`](https://github.com/medusajs/medusa/commit/0c0b425de7b154b80b712ab17b16215cf62d1e83) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa-react,medusa,types,dashboard): added empty state for promotions list page

- [#6913](https://github.com/medusajs/medusa/pull/6913) [`49f16ab08d`](https://github.com/medusajs/medusa/commit/49f16ab08d0a270f3fa9232539a85ae3746f5fe7) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Fix get-query-config backward compatiblity

- [#7077](https://github.com/medusajs/medusa/pull/7077) [`8d356217bd`](https://github.com/medusajs/medusa/commit/8d356217bd31c97a196e861ee243822a4d924df7) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,core-flows,types): add batch updates to price list prices

- [#6850](https://github.com/medusajs/medusa/pull/6850) [`e58e81fd25`](https://github.com/medusajs/medusa/commit/e58e81fd2583acfaf091daff79937934c13fb0ba) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): associate refund with order when calling `refundFromPayment`

- [#7128](https://github.com/medusajs/medusa/pull/7128) [`40686ba980`](https://github.com/medusajs/medusa/commit/40686ba98077c1c509744c0bd44fea4d4786abaa) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,admin-ui): Remove forced `backendUrl` from develop command. Allow specifying an alternative host value

- [#6864](https://github.com/medusajs/medusa/pull/6864) [`e944a627f0`](https://github.com/medusajs/medusa/commit/e944a627f074fb39a56f4bc7b3d6d315736ebf7c) Thanks [@adrien2p](https://github.com/adrien2p)! - feat: region payment providers management workflows/api

- [#6880](https://github.com/medusajs/medusa/pull/6880) [`1a48fe0282`](https://github.com/medusajs/medusa/commit/1a48fe0282a8bc1f8548a4736255e457d173da09) Thanks [@sradevski](https://github.com/sradevski)! - Add v2 product type endpoints and adjust the product module

- [#6911](https://github.com/medusajs/medusa/pull/6911) [`483bf98a49`](https://github.com/medusajs/medusa/commit/483bf98a49f39132bde849b4a30abc570b70f2cf) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): added endpoints for rule attribute/operator/values options

- [#7166](https://github.com/medusajs/medusa/pull/7166) [`08a9297f76`](https://github.com/medusajs/medusa/commit/08a9297f76afce17a2c7992513c7b79f00bf8b1e) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Remove require id from update shipping options validator

- [`cc557c8752`](https://github.com/medusajs/medusa/commit/cc557c8752fd0554f5a1b58522d9a88dc43a8509) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Order endpoints and Cart totals

- [#6943](https://github.com/medusajs/medusa/pull/6943) [`58c68f6715`](https://github.com/medusajs/medusa/commit/58c68f67156e993255fbc25d91db15ae23bc95c0) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa, types): list payment providers endpoint

- [#6876](https://github.com/medusajs/medusa/pull/6876) [`1bcb13f892`](https://github.com/medusajs/medusa/commit/1bcb13f892bc61db21b3fc6bdbce85f747aeec4c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: Remove sales channels from pub keys

- [#6901](https://github.com/medusajs/medusa/pull/6901) [`82a176e30e`](https://github.com/medusajs/medusa/commit/82a176e30e47a7d11caaf31c3023bd8db588b465) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa-test-utils): Handle errors gracefully + Do not set Distributed storage on partial loading

- [#7144](https://github.com/medusajs/medusa/pull/7144) [`11517f0faf`](https://github.com/medusajs/medusa/commit/11517f0fafdf00af256240448b58d149d8b6f600) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types): added store apis for products

- [#6878](https://github.com/medusajs/medusa/pull/6878) [`85a27c3572`](https://github.com/medusajs/medusa/commit/85a27c357295d01be5c66bf33ae93c1bbd239439) Thanks [@gempain](https://github.com/gempain)! - Fix logging error when trying to migrate products for enabling inventory module.

- [#7095](https://github.com/medusajs/medusa/pull/7095) [`62b9dcc6c1`](https://github.com/medusajs/medusa/commit/62b9dcc6c1ce46aadb7944215006c12da3c9f619) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): cancel fulfillments API

- [#7089](https://github.com/medusajs/medusa/pull/7089) [`82cb6cfd36`](https://github.com/medusajs/medusa/commit/82cb6cfd361db4147584b0073cfd01ff100a52e6) Thanks [@kevinfurmanski](https://github.com/kevinfurmanski)! - fix: correct calculations of subtotal for shipping option requirements

- [#6851](https://github.com/medusajs/medusa/pull/6851) [`ea8d9d4d42`](https://github.com/medusajs/medusa/commit/ea8d9d4d42210a5598b308656922c0e93c90b7c8) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: API key sales channel link

- [#7175](https://github.com/medusajs/medusa/pull/7175) [`e26cda4b6a`](https://github.com/medusajs/medusa/commit/e26cda4b6afb7fb25f0b0a7a7ce20b7f914d35db) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa, core-flows, types): Allow to update the rules from a shipping options

- [#6837](https://github.com/medusajs/medusa/pull/6837) [`6113af0a66`](https://github.com/medusajs/medusa/commit/6113af0a66addd287335b792e8e8ac7915b9cb3f) Thanks [@pepijn-vanvlaanderen](https://github.com/pepijn-vanvlaanderen)! - Fix deleted discount missing on order

- [#7178](https://github.com/medusajs/medusa/pull/7178) [`efa3308d78`](https://github.com/medusajs/medusa/commit/efa3308d78993a7801fd14cde597a502423d8d94) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): add middleware filters + scope products

- [#6977](https://github.com/medusajs/medusa/pull/6977) [`bc06ad2db4`](https://github.com/medusajs/medusa/commit/bc06ad2db48c999023ab823fefc1375196976e9b) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat/shipping options api 3

- [#7101](https://github.com/medusajs/medusa/pull/7101) [`18f3aacee6`](https://github.com/medusajs/medusa/commit/18f3aacee6752854d377faa806f4cc67bc71456b) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): add create shipment api for fulfillments

- [#7124](https://github.com/medusajs/medusa/pull/7124) [`38c971f111`](https://github.com/medusajs/medusa/commit/38c971f111af69f176e7e9892eb59f5bae831fa7) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types): add fulfillment provider list api

- [#6858](https://github.com/medusajs/medusa/pull/6858) [`6bf4d40856`](https://github.com/medusajs/medusa/commit/6bf4d40856839b755ce33f85ee30d046be7341ab) Thanks [@srindom](https://github.com/srindom)! - chore(medusa-test-utils): create declaration file

- [#6883](https://github.com/medusajs/medusa/pull/6883) [`eadc5e8a79`](https://github.com/medusajs/medusa/commit/eadc5e8a794ec07f7b523808aa0fec2ac394c984) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: Admin V2 API keys

- [#6882](https://github.com/medusajs/medusa/pull/6882) [`5e30b8cce6`](https://github.com/medusajs/medusa/commit/5e30b8cce63524d939a5068050798b0d8fcb9a53) Thanks [@riqwan](https://github.com/riqwan)! - feat(dashboard): added details page for promotions

- [#6962](https://github.com/medusajs/medusa/pull/6962) [`65794f4bb5`](https://github.com/medusajs/medusa/commit/65794f4bb56e4fd3f0ccb7656a948f856f05324e) Thanks [@adrien2p](https://github.com/adrien2p)! - feat: Create shipping options API

- [#6917](https://github.com/medusajs/medusa/pull/6917) [`b3a3993423`](https://github.com/medusajs/medusa/commit/b3a3993423f4872c84b52a68cc3e56766f9ad5a1) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa-test-utils): recompute driver options

- [#7029](https://github.com/medusajs/medusa/pull/7029) [`93ef94cad3`](https://github.com/medusajs/medusa/commit/93ef94cad3ddc5b6973b4e48e422b0aa0e6ddbbe) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types): create promotion flows

- [#6905](https://github.com/medusajs/medusa/pull/6905) [`edafe7db47`](https://github.com/medusajs/medusa/commit/edafe7db4780631601d07e43b18f80c3406166f0) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(link-modules, core-flows, medusa): add sales channel location management endpoint

- [#6800](https://github.com/medusajs/medusa/pull/6800) [`4cf71af07d`](https://github.com/medusajs/medusa/commit/4cf71af07d1807c83df3889c1774f82cbd1b9a6f) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(core-flows, medusa): add update stock location endpoint to api-v2

- [#7028](https://github.com/medusajs/medusa/pull/7028) [`c78915c7c5`](https://github.com/medusajs/medusa/commit/c78915c7c5e91a99c1b1bae932656c8d86b17daf) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Add support for shipping options prices update

- [#7101](https://github.com/medusajs/medusa/pull/7101) [`18f3aacee6`](https://github.com/medusajs/medusa/commit/18f3aacee6752854d377faa806f4cc67bc71456b) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): fulfillment API: create

- [#7150](https://github.com/medusajs/medusa/pull/7150) [`d2393f004e`](https://github.com/medusajs/medusa/commit/d2393f004e0d02450300ad34dbbf98e859dae844) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows, medusa): add shipping methods to cart API

- [#7130](https://github.com/medusajs/medusa/pull/7130) [`2446151420`](https://github.com/medusajs/medusa/commit/2446151420747794711ba9d7149f2a55269b4bd9) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): migrate store cart endpoints to zod

- [#7018](https://github.com/medusajs/medusa/pull/7018) [`f175cac4af`](https://github.com/medusajs/medusa/commit/f175cac4af63b71066a8398ecf9beaa6f28b20cc) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(core-flows, medusa, types): add reservation item endpoints

- [#6995](https://github.com/medusajs/medusa/pull/6995) [`0a9b9b073d`](https://github.com/medusajs/medusa/commit/0a9b9b073dd2d3f4aa5e5cb1c16e2221a7200e0d) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa, core-flows,types): delete fulfillment set, delete shipping profile

- [#6998](https://github.com/medusajs/medusa/pull/6998) [`4f88743591`](https://github.com/medusajs/medusa/commit/4f8874359127e24df548d6c25440177d0dcd53ef) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa, customer): Add list filtering capabilities for customers

- [#7026](https://github.com/medusajs/medusa/pull/7026) [`00e6b21bb5`](https://github.com/medusajs/medusa/commit/00e6b21bb50dbc886bc37ad052a1c40ce865294e) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types): added tax flows end to end

- [#6788](https://github.com/medusajs/medusa/pull/6788) [`18438a695a`](https://github.com/medusajs/medusa/commit/18438a695a9af8c44387d49d9593d803498e2d21) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa, stock-location-next): add list-stock-locations endpoint to api-v2

- [#6865](https://github.com/medusajs/medusa/pull/6865) [`8fd1488938`](https://github.com/medusajs/medusa/commit/8fd148893850eb66c5eae00c4ca9391a80ea2eb9) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: medusa shutdown

- [#7081](https://github.com/medusajs/medusa/pull/7081) [`7e66dd0dd0`](https://github.com/medusajs/medusa/commit/7e66dd0dd03f856add42056008aaf00e170cdf3a) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Fix validation of V2 POST /customers and POST /customers/:id

- Updated dependencies [[`e603726985`](https://github.com/medusajs/medusa/commit/e60372698565315145037eb40fbe86c43f91cc16), [`8d356217bd`](https://github.com/medusajs/medusa/commit/8d356217bd31c97a196e861ee243822a4d924df7), [`d333db0842`](https://github.com/medusajs/medusa/commit/d333db08429611c0571a0b173adf37103b8a8aa6), [`1eeb1e9de3`](https://github.com/medusajs/medusa/commit/1eeb1e9de3e0b571735437b00968ee96e4aabad5), [`20e8df914e`](https://github.com/medusajs/medusa/commit/20e8df914ec5fdf8d562d4fa84f72c58c7056195), [`a164c0d512`](https://github.com/medusajs/medusa/commit/a164c0d5126a40e2bc669f9fc2883be502a15036), [`e0b02a1012`](https://github.com/medusajs/medusa/commit/e0b02a1012981c29830d7779f59ebe805bbfd137), [`e944a627f0`](https://github.com/medusajs/medusa/commit/e944a627f074fb39a56f4bc7b3d6d315736ebf7c), [`1a48fe0282`](https://github.com/medusajs/medusa/commit/1a48fe0282a8bc1f8548a4736255e457d173da09), [`86f499de2f`](https://github.com/medusajs/medusa/commit/86f499de2f31356ab36ad5e93f27345443b3e5f6), [`cc557c8752`](https://github.com/medusajs/medusa/commit/cc557c8752fd0554f5a1b58522d9a88dc43a8509), [`dd35a4dbff`](https://github.com/medusajs/medusa/commit/dd35a4dbff10c86ea3c5f7f817c18b6e60d599e3), [`1bcb13f892`](https://github.com/medusajs/medusa/commit/1bcb13f892bc61db21b3fc6bdbce85f747aeec4c), [`82a176e30e`](https://github.com/medusajs/medusa/commit/82a176e30e47a7d11caaf31c3023bd8db588b465), [`62b9dcc6c1`](https://github.com/medusajs/medusa/commit/62b9dcc6c1ce46aadb7944215006c12da3c9f619), [`5d9aea053c`](https://github.com/medusajs/medusa/commit/5d9aea053ce6e04f242f86fb9053c13dec515d5b), [`ea8d9d4d42`](https://github.com/medusajs/medusa/commit/ea8d9d4d42210a5598b308656922c0e93c90b7c8), [`e26cda4b6a`](https://github.com/medusajs/medusa/commit/e26cda4b6afb7fb25f0b0a7a7ce20b7f914d35db), [`18f3aacee6`](https://github.com/medusajs/medusa/commit/18f3aacee6752854d377faa806f4cc67bc71456b), [`232322d035`](https://github.com/medusajs/medusa/commit/232322d03515f81e56867ff8c765b8409399ee68), [`45c49e89f2`](https://github.com/medusajs/medusa/commit/45c49e89f28123ef622fc1c07253bae94fd74875), [`71aeda7347`](https://github.com/medusajs/medusa/commit/71aeda7347a1dc7039be05071ce90a6dca5f9154), [`c3efac5a0d`](https://github.com/medusajs/medusa/commit/c3efac5a0d6cfa38e1af8d248138fa83934a8ceb), [`528ef4ca90`](https://github.com/medusajs/medusa/commit/528ef4ca90bb2cf6173dccc9fd6a9f9932ff9b76), [`65794f4bb5`](https://github.com/medusajs/medusa/commit/65794f4bb56e4fd3f0ccb7656a948f856f05324e), [`edafe7db47`](https://github.com/medusajs/medusa/commit/edafe7db4780631601d07e43b18f80c3406166f0), [`4cf71af07d`](https://github.com/medusajs/medusa/commit/4cf71af07d1807c83df3889c1774f82cbd1b9a6f), [`4b57c5d286`](https://github.com/medusajs/medusa/commit/4b57c5d286f9dc6e2098c67e9fecb0d93175b5a1), [`c78915c7c5`](https://github.com/medusajs/medusa/commit/c78915c7c5e91a99c1b1bae932656c8d86b17daf), [`18f3aacee6`](https://github.com/medusajs/medusa/commit/18f3aacee6752854d377faa806f4cc67bc71456b), [`3affcc2525`](https://github.com/medusajs/medusa/commit/3affcc252599c93cf52fef24ec4f3695d65db79a), [`667c8609cc`](https://github.com/medusajs/medusa/commit/667c8609ccf3850f5df8cf784723a95bd0d6d2a6), [`d2393f004e`](https://github.com/medusajs/medusa/commit/d2393f004e0d02450300ad34dbbf98e859dae844), [`f175cac4af`](https://github.com/medusajs/medusa/commit/f175cac4af63b71066a8398ecf9beaa6f28b20cc), [`edcafa140c`](https://github.com/medusajs/medusa/commit/edcafa140c1869df3c420c2becfbf23b6af75ddc), [`0a9b9b073d`](https://github.com/medusajs/medusa/commit/0a9b9b073dd2d3f4aa5e5cb1c16e2221a7200e0d), [`a6562d2a41`](https://github.com/medusajs/medusa/commit/a6562d2a41453cbe7aa43be352c4924e3e4c79d5), [`8fd1488938`](https://github.com/medusajs/medusa/commit/8fd148893850eb66c5eae00c4ca9391a80ea2eb9), [`1c6ba4468e`](https://github.com/medusajs/medusa/commit/1c6ba4468eab1440931c88929affd5b4c593f377)]:
  - @medusajs/workflows-sdk@0.1.6
  - @medusajs/orchestration@0.5.7
  - @medusajs/core-flows@0.0.9
  - @medusajs/modules-sdk@1.12.11
  - @medusajs/utils@1.11.9
  - @medusajs/link-modules@0.2.11
  - medusa-core-utils@1.2.2

## 1.20.4

### Patch Changes

- [#6803](https://github.com/medusajs/medusa/pull/6803) [`0168c819da`](https://github.com/medusajs/medusa/commit/0168c819da2bcdf2391c5fb5501342ea140882df) Thanks [@srindom](https://github.com/srindom)! - fix(medusa-test-utils): make module test runner models configurable

- [#6759](https://github.com/medusajs/medusa/pull/6759) [`70859397c0`](https://github.com/medusajs/medusa/commit/70859397c00ad0b45a517547e2792ed4f6882d73) Thanks [@sradevski](https://github.com/sradevski)! - Align the v2 product HTTP endpoints to follow conventions

- [#6801](https://github.com/medusajs/medusa/pull/6801) [`deab12e27e`](https://github.com/medusajs/medusa/commit/deab12e27e8249e26d24d7bc904c18195679ff24) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(types, medusa, core-flows): add delete-stock-location endpoint to api-v2

- [#6739](https://github.com/medusajs/medusa/pull/6739) [`56481e683d`](https://github.com/medusajs/medusa/commit/56481e683d33ff98f0d4c4e144873bb23f993c9c) Thanks [@srindom](https://github.com/srindom)! - feat: v2 - add worker mode

- [#6796](https://github.com/medusajs/medusa/pull/6796) [`9073d7aba3`](https://github.com/medusajs/medusa/commit/9073d7aba3419e4dc0a206473291a46ebd79b8c1) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): rename psma to prices

- [#6819](https://github.com/medusajs/medusa/pull/6819) [`7bc7adeeb4`](https://github.com/medusajs/medusa/commit/7bc7adeeb4568ad85a81df08e3d6d3b5023cee13) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: Create user account

- [#6820](https://github.com/medusajs/medusa/pull/6820) [`509ddf9a56`](https://github.com/medusajs/medusa/commit/509ddf9a5631b4c8a4c2641595c40d7f9261e563) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): migrate medusa unit tests to run with swc jest

- [#6787](https://github.com/medusajs/medusa/pull/6787) [`68b9812aa1`](https://github.com/medusajs/medusa/commit/68b9812aa1fe8a9e368112e721cd868919369980) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(core-flows, medusa): add create stock location endpoint for api-v2

- [#6771](https://github.com/medusajs/medusa/pull/6771) [`205573f5e3`](https://github.com/medusajs/medusa/commit/205573f5e3bb826abe1cc1bc16855f079aa490e4) Thanks [@srindom](https://github.com/srindom)! - fix(medusa): ensure feature flags are loaded properly in migrate command

- [#6680](https://github.com/medusajs/medusa/pull/6680) [`26531c5a38`](https://github.com/medusajs/medusa/commit/26531c5a38bf09ab3e77a1444cefd65a073ae713) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui-preset): Pull latest styles from Figma.
  fix(ui): Fix invalid state styling of Select, so it correctly shows when aria-invalid is true.
  fix(medusa): Align query params between `/admin/products/:id/variants` and `/admin/variants`.
  chore(client-types): Update `medusa` client types to reflect changes to the API.

- [#6772](https://github.com/medusajs/medusa/pull/6772) [`1ef9c78cea`](https://github.com/medusajs/medusa/commit/1ef9c78cea080c3b7c136f909c6cddec9d8f0c62) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: v2 - deprecate extra in favor of driver options

- [#6791](https://github.com/medusajs/medusa/pull/6791) [`20132d7cea`](https://github.com/medusajs/medusa/commit/20132d7cea13b7c7ae77b33684d01a9ab40f7ed3) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa, core-flows): add retrieve stock location endpoint to api-v2

- Updated dependencies [[`0168c819da`](https://github.com/medusajs/medusa/commit/0168c819da2bcdf2391c5fb5501342ea140882df), [`70859397c0`](https://github.com/medusajs/medusa/commit/70859397c00ad0b45a517547e2792ed4f6882d73), [`06f22bb48a`](https://github.com/medusajs/medusa/commit/06f22bb48ad1fe73577657b8c5db055312f16a0d), [`deab12e27e`](https://github.com/medusajs/medusa/commit/deab12e27e8249e26d24d7bc904c18195679ff24), [`60070fb65f`](https://github.com/medusajs/medusa/commit/60070fb65fa58872219a1145a8eace837f0cafde), [`7e93eda1a4`](https://github.com/medusajs/medusa/commit/7e93eda1a44310311d2f3f8a1d634f60e7c48cb5), [`56481e683d`](https://github.com/medusajs/medusa/commit/56481e683d33ff98f0d4c4e144873bb23f993c9c), [`9073d7aba3`](https://github.com/medusajs/medusa/commit/9073d7aba3419e4dc0a206473291a46ebd79b8c1), [`7bc7adeeb4`](https://github.com/medusajs/medusa/commit/7bc7adeeb4568ad85a81df08e3d6d3b5023cee13), [`68b9812aa1`](https://github.com/medusajs/medusa/commit/68b9812aa1fe8a9e368112e721cd868919369980), [`4974f5e455`](https://github.com/medusajs/medusa/commit/4974f5e4557bd64a328a881ec02b91e15485bd23), [`05e857d256`](https://github.com/medusajs/medusa/commit/05e857d25657b5576a891c9b48c19c1759c70701), [`3ca957ec0f`](https://github.com/medusajs/medusa/commit/3ca957ec0fdcdc966a3d2ca94b8222d68767cf9a), [`1ef9c78cea`](https://github.com/medusajs/medusa/commit/1ef9c78cea080c3b7c136f909c6cddec9d8f0c62), [`20132d7cea`](https://github.com/medusajs/medusa/commit/20132d7cea13b7c7ae77b33684d01a9ab40f7ed3)]:
  - medusa-test-utils@1.1.43
  - @medusajs/core-flows@0.0.8
  - @medusajs/modules-sdk@1.12.10
  - @medusajs/orchestration@0.5.6
  - @medusajs/link-modules@0.2.10
  - @medusajs/workflows-sdk@0.1.5
  - @medusajs/utils@1.11.8

## 1.20.3

### Patch Changes

- [#6648](https://github.com/medusajs/medusa/pull/6648) [`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,utils): added price list prices upsert and delete workflows + endpoints

- [#6633](https://github.com/medusajs/medusa/pull/6633) [`e124762873`](https://github.com/medusajs/medusa/commit/e124762873cd43af8eefa9fee4698450fdf8c30f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Allows to filter price list products by multiple ids.

- [#6678](https://github.com/medusajs/medusa/pull/6678) [`d4b921f3db`](https://github.com/medusajs/medusa/commit/d4b921f3dbe0a38f1565a8de759996c70798d58e) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,pricing,types): added get endpoints for pricing rule types

- [#6539](https://github.com/medusajs/medusa/pull/6539) [`557d86afbf`](https://github.com/medusajs/medusa/commit/557d86afbfef707d2998e4e5d1ce3559ec22f9f8) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,core-flows): update cart adjustments on item updates

- [#6474](https://github.com/medusajs/medusa/pull/6474) [`ac86362e81`](https://github.com/medusajs/medusa/commit/ac86362e81d8523cb8e3dfad026fc94658513018) Thanks [@riqwan](https://github.com/riqwan)! - feat(workflows-sdk,core-flows,medusa,types): add workflow to add promotions to cart

- [#6580](https://github.com/medusajs/medusa/pull/6580) [`e4acde1aa2`](https://github.com/medusajs/medusa/commit/e4acde1aa2eb57f07e6692fe8b61f728948b9a96) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,core-flows,types): add cart <> tax integration workflows + steps

- [#6697](https://github.com/medusajs/medusa/pull/6697) [`1a661adf3e`](https://github.com/medusajs/medusa/commit/1a661adf3ef4991aa6e237dd894b6a5c47cd4aca) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types): GET admin promotion endpoint to fetch by code

- [#6711](https://github.com/medusajs/medusa/pull/6711) [`0c705d7bd4`](https://github.com/medusajs/medusa/commit/0c705d7bd41a768c48017ae95b3c8414d96c6acb) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): rework prices add/remove to batch spec

- [#6631](https://github.com/medusajs/medusa/pull/6631) [`56504c99f0`](https://github.com/medusajs/medusa/commit/56504c99f0df7a375b303084c43ee4f15db828a3) Thanks [@madsleejensen](https://github.com/madsleejensen)! - bug: fix constraint on customer table to allow soft-deletes

- [#6703](https://github.com/medusajs/medusa/pull/6703) [`c3f26a6826`](https://github.com/medusajs/medusa/commit/c3f26a68266ce2b4427c04b03120e4a441f29eec) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Include `country` in draft orders' carts' default relations to allow properly displaying addresses.

- [#6696](https://github.com/medusajs/medusa/pull/6696) [`04a532e5ef`](https://github.com/medusajs/medusa/commit/04a532e5efabbf75b1e4155520b1da175b686ffc) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): remove rules from promotion endpoints + workflows

- [#6595](https://github.com/medusajs/medusa/pull/6595) [`f0ef0a8784`](https://github.com/medusajs/medusa/commit/f0ef0a87845764bae7610ee854592bb9800210f5) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: integration-tests/modules

- [#6544](https://github.com/medusajs/medusa/pull/6544) [`296d7faad4`](https://github.com/medusajs/medusa/commit/296d7faad45d77fffb39de13457f996dce5256ed) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: V2 core loader + modules integration-tests

- [#6330](https://github.com/medusajs/medusa/pull/6330) [`0c2a460751`](https://github.com/medusajs/medusa/commit/0c2a460751644021056d0f99d9b1fffe509fb7ab) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Workflow engine API

- [#6677](https://github.com/medusajs/medusa/pull/6677) [`25d176b851`](https://github.com/medusajs/medusa/commit/25d176b851c041ecc7901163b704b36b7e585076) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: List shipping options for cart

- [#6418](https://github.com/medusajs/medusa/pull/6418) [`1ba35b02dd`](https://github.com/medusajs/medusa/commit/1ba35b02dd52eeca9f3e1bee073c5e7a17edbc33) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: Cart SalesChannel link

- [#6617](https://github.com/medusajs/medusa/pull/6617) [`7c46b0f88b`](https://github.com/medusajs/medusa/commit/7c46b0f88b65467a9fb734061a7cc8e7bdb3c85c) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): added list price list products endpoint

- [#6411](https://github.com/medusajs/medusa/pull/6411) [`586df9da25`](https://github.com/medusajs/medusa/commit/586df9da250e492442769f5bac2f8b3de1d46f05) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Fix custom modules loader

- [#6692](https://github.com/medusajs/medusa/pull/6692) [`640eccd5dd`](https://github.com/medusajs/medusa/commit/640eccd5ddbb163e0f987ce6c772f1129c2e2632) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): add rules to promotion endpoints + workflow

- [#6550](https://github.com/medusajs/medusa/pull/6550) [`fb25471e92`](https://github.com/medusajs/medusa/commit/fb25471e927c0cc91525f5e0134b935cd36596b5) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Adds updated_at query param to list-reservations. Fixes OAS for list-inventory-items.

- [#6667](https://github.com/medusajs/medusa/pull/6667) [`c3c4f49fc2`](https://github.com/medusajs/medusa/commit/c3c4f49fc2126f950e69e291ca939ca88a15afd3) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): add automatic-taxes to region + generate tax lines endpoint

- [#6606](https://github.com/medusajs/medusa/pull/6606) [`c2d56ca12b`](https://github.com/medusajs/medusa/commit/c2d56ca12b89af078b885a0acced20e29bf6f8f5) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Fixes pagination on list Tax Rate endpoint, and also adds missing query params like order, search and filters.

- [#6648](https://github.com/medusajs/medusa/pull/6648) [`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,pricing,types,utils): added price list workflows + endpoints

- [#6684](https://github.com/medusajs/medusa/pull/6684) [`b78f863d80`](https://github.com/medusajs/medusa/commit/b78f863d80cad0e7075585cd400dc47ac05f4bf1) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa): added api + workflows for rule types CRUD

- [#6441](https://github.com/medusajs/medusa/pull/6441) [`8dad2b51a2`](https://github.com/medusajs/medusa/commit/8dad2b51a26c4c3c14a6c95f70424c8bef2ad63e) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa-react,medusa,utils): fix login for medusa v2 admin next dashboard

- [#6564](https://github.com/medusajs/medusa/pull/6564) [`2d00625729`](https://github.com/medusajs/medusa/commit/2d00625729e7dab02149751327239992dea3a8e1) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,ui) Export param types for workflow endpoints. Add support for JSON to CodeBlock component.

- [#6731](https://github.com/medusajs/medusa/pull/6731) [`873c21355c`](https://github.com/medusajs/medusa/commit/873c21355c94c7c38c6f5575ca807c5aa4adcadb) Thanks [@srindom](https://github.com/srindom)! - fix(medusa): make subscribers work in v2

- [#6490](https://github.com/medusajs/medusa/pull/6490) [`608c10383a`](https://github.com/medusajs/medusa/commit/608c10383a1a86068f0648d5aa641cbf11ffd323) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): add `order` param to discounts list

- [#6711](https://github.com/medusajs/medusa/pull/6711) [`0c705d7bd4`](https://github.com/medusajs/medusa/commit/0c705d7bd41a768c48017ae95b3c8414d96c6acb) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): split upsert workflow to create and update

- [#6658](https://github.com/medusajs/medusa/pull/6658) [`78e5ec459a`](https://github.com/medusajs/medusa/commit/78e5ec459a637946482a3ee9f8b437656686988f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Add missing query params to draft order list endpoint

- [#6380](https://github.com/medusajs/medusa/pull/6380) [`d37ff8024d`](https://github.com/medusajs/medusa/commit/d37ff8024d8affbe84db3c0b6d79cd41016bfac4) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,ui): Fixes list query params for the following endpoints: "/admin/customers", "/admin/customer-groups", "/admin/gift-cards", and "/admin/collections".

- [#6701](https://github.com/medusajs/medusa/pull/6701) [`7be0a2cf6d`](https://github.com/medusajs/medusa/commit/7be0a2cf6dc753247dff9fea6891fe64f58b9812) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): use batch/add and batch/remove endpoints for promotion rules

- [#6408](https://github.com/medusajs/medusa/pull/6408) [`1d91b7429b`](https://github.com/medusajs/medusa/commit/1d91b7429beebd6f09d5027f7f7e1fe74ce3a8ff) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(fulfillment): implementation part 2

- [#6483](https://github.com/medusajs/medusa/pull/6483) [`e076590ff2`](https://github.com/medusajs/medusa/commit/e076590ff2a9587d66ffdac672bdd254cb9918f1) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Add query params to Pub. API key endpoint

- [#6727](https://github.com/medusajs/medusa/pull/6727) [`c20eb15cd9`](https://github.com/medusajs/medusa/commit/c20eb15cd9b1bd90c8d01f68eca6f0f181cd902d) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa, core-flows, types): Add delete-location-level api-v2 endpoints

- [#6702](https://github.com/medusajs/medusa/pull/6702) [`e5945479e0`](https://github.com/medusajs/medusa/commit/e5945479e091d9560ae3e7240306a31031ef4584) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,core-flows,types): adds update promotion rule endpoint + workflow

- [#6514](https://github.com/medusajs/medusa/pull/6514) [`f5c2256286`](https://github.com/medusajs/medusa/commit/f5c22562867f412040f8bc6c55ab5de3a3735e62) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): adds update cart API with promotions

- [#6592](https://github.com/medusajs/medusa/pull/6592) [`000eb61e33`](https://github.com/medusajs/medusa/commit/000eb61e33e0302db95ee6ad1656ea9b430ed471) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing,medusa,utils): added list + get endpoints for price lists

- [#6708](https://github.com/medusajs/medusa/pull/6708) [`62d5803b20`](https://github.com/medusajs/medusa/commit/62d5803b2085daa682ea9bfbe7a3593057c7da4e) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa, core-flows, inventory-next): add delete-inventory-item endpoint

- [#6700](https://github.com/medusajs/medusa/pull/6700) [`8f8a4f9b13`](https://github.com/medusajs/medusa/commit/8f8a4f9b1353087d98f6cc75346d43a7f49901a8) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Version all modules to allow for initial testing

- [#6704](https://github.com/medusajs/medusa/pull/6704) [`56a6ec0227`](https://github.com/medusajs/medusa/commit/56a6ec0227eafe9371d199c68ab8600d8ac76b69) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): add get-inventory-item endpoint to api v2

- [#6543](https://github.com/medusajs/medusa/pull/6543) [`4d38eb3bf8`](https://github.com/medusajs/medusa/commit/4d38eb3bf8bf0497439624f806495ae8957c7a4d) Thanks [@sradevski](https://github.com/sradevski)! - chore: Use default countries and currencies from utils

- [#6311](https://github.com/medusajs/medusa/pull/6311) [`ce39b9b66e`](https://github.com/medusajs/medusa/commit/ce39b9b66e8c277ec0691ea6d0a950003be09cc1) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(payment-stripe): new Stripe payment provider

- [#6327](https://github.com/medusajs/medusa/pull/6327) [`4d51f095b3`](https://github.com/medusajs/medusa/commit/4d51f095b3f98f468cefb760512563f7b77bb9cf) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(core-flows, types, utils, medusa): add user endpoints to api-v2

- [#6415](https://github.com/medusajs/medusa/pull/6415) [`8ff838970e`](https://github.com/medusajs/medusa/commit/8ff838970e5b3b8d773b63d31d60c1f432c51c34) Thanks [@fPolic](https://github.com/fPolic)! - fix(maedusa): register logger when running migrations

- [#6428](https://github.com/medusajs/medusa/pull/6428) [`44d43e8155`](https://github.com/medusajs/medusa/commit/44d43e8155d1b1ca0af5e900787411c7d0b027c0) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa,medusa-js,medusa-react,icons): Fixes GET /admin/products/:id/variants endpoint in the core, and medusa-js and medusa-react. Pulls latest icons from Figma into `@medusajs/icons`.

- [#6698](https://github.com/medusajs/medusa/pull/6698) [`cc1b66842c`](https://github.com/medusajs/medusa/commit/cc1b66842cbb37c6eab84e2d8b74844c214f38d7) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): add/remove fulfillment shipping option rules

- [#6392](https://github.com/medusajs/medusa/pull/6392) [`24fb102a56`](https://github.com/medusajs/medusa/commit/24fb102a564b1253d1f8b039bb1e435cc5312fbb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: CartRegion link, definition + workflow

- Updated dependencies [[`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c), [`557d86afbf`](https://github.com/medusajs/medusa/commit/557d86afbfef707d2998e4e5d1ce3559ec22f9f8), [`ac86362e81`](https://github.com/medusajs/medusa/commit/ac86362e81d8523cb8e3dfad026fc94658513018), [`e4acde1aa2`](https://github.com/medusajs/medusa/commit/e4acde1aa2eb57f07e6692fe8b61f728948b9a96), [`56d97ebef9`](https://github.com/medusajs/medusa/commit/56d97ebef96a51b4af0939c9cdf4383c33b2ec87), [`56cbf88115`](https://github.com/medusajs/medusa/commit/56cbf88115994adea7037c3f2814f0c96af3cfc0), [`36a61658f9`](https://github.com/medusajs/medusa/commit/36a61658f969a7b19c84a1e621ad1464927cafb1), [`04a532e5ef`](https://github.com/medusajs/medusa/commit/04a532e5efabbf75b1e4155520b1da175b686ffc), [`f0ef0a8784`](https://github.com/medusajs/medusa/commit/f0ef0a87845764bae7610ee854592bb9800210f5), [`0c2a460751`](https://github.com/medusajs/medusa/commit/0c2a460751644021056d0f99d9b1fffe509fb7ab), [`25d176b851`](https://github.com/medusajs/medusa/commit/25d176b851c041ecc7901163b704b36b7e585076), [`1ba35b02dd`](https://github.com/medusajs/medusa/commit/1ba35b02dd52eeca9f3e1bee073c5e7a17edbc33), [`c319edb8e0`](https://github.com/medusajs/medusa/commit/c319edb8e0ecd13d086652147667916e5abab2d8), [`0b9fcb6324`](https://github.com/medusajs/medusa/commit/0b9fcb6324eee9f2556c7e6317775fae93b12a47), [`586df9da25`](https://github.com/medusajs/medusa/commit/586df9da250e492442769f5bac2f8b3de1d46f05), [`b3d826497b`](https://github.com/medusajs/medusa/commit/b3d826497b3dae5e1b26b7924706c24fd5e87ca5), [`a86c87fe14`](https://github.com/medusajs/medusa/commit/a86c87fe1442afce9285e39255914e01012b4449), [`640eccd5dd`](https://github.com/medusajs/medusa/commit/640eccd5ddbb163e0f987ce6c772f1129c2e2632), [`8ea37d03c9`](https://github.com/medusajs/medusa/commit/8ea37d03c914a5004a3e42770668b2d1f7f8f564), [`339a946f38`](https://github.com/medusajs/medusa/commit/339a946f389033c21e05338f9dbf07d88e140533), [`c3c4f49fc2`](https://github.com/medusajs/medusa/commit/c3c4f49fc2126f950e69e291ca939ca88a15afd3), [`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c), [`b78f863d80`](https://github.com/medusajs/medusa/commit/b78f863d80cad0e7075585cd400dc47ac05f4bf1), [`8dad2b51a2`](https://github.com/medusajs/medusa/commit/8dad2b51a26c4c3c14a6c95f70424c8bef2ad63e), [`0c705d7bd4`](https://github.com/medusajs/medusa/commit/0c705d7bd41a768c48017ae95b3c8414d96c6acb), [`8a946beb75`](https://github.com/medusajs/medusa/commit/8a946beb75dd2560baffb5adc508969bf1fe8ef5), [`a6d7070dd6`](https://github.com/medusajs/medusa/commit/a6d7070dd669c21ea19d70434d42c2f8167dc309), [`1d91b7429b`](https://github.com/medusajs/medusa/commit/1d91b7429beebd6f09d5027f7f7e1fe74ce3a8ff), [`168f02f138`](https://github.com/medusajs/medusa/commit/168f02f138ad101e1013f2c8c3f8dc19de12accf), [`c20eb15cd9`](https://github.com/medusajs/medusa/commit/c20eb15cd9b1bd90c8d01f68eca6f0f181cd902d), [`e5945479e0`](https://github.com/medusajs/medusa/commit/e5945479e091d9560ae3e7240306a31031ef4584), [`f5c2256286`](https://github.com/medusajs/medusa/commit/f5c22562867f412040f8bc6c55ab5de3a3735e62), [`000eb61e33`](https://github.com/medusajs/medusa/commit/000eb61e33e0302db95ee6ad1656ea9b430ed471), [`d550be3685`](https://github.com/medusajs/medusa/commit/d550be3685423218d47a20c57a5e06758f4a961a), [`62d5803b20`](https://github.com/medusajs/medusa/commit/62d5803b2085daa682ea9bfbe7a3593057c7da4e), [`4b06c17dc0`](https://github.com/medusajs/medusa/commit/4b06c17dc00dc9ed50898573aee704b84dd181b3), [`62a7bcc30c`](https://github.com/medusajs/medusa/commit/62a7bcc30cbc7b234b2b51d7858439951a84edeb), [`f611865553`](https://github.com/medusajs/medusa/commit/f611865553b1f6914bed58ef2eacdf5e929d60dc), [`a8794d48de`](https://github.com/medusajs/medusa/commit/a8794d48de11c4b31f7d8f0dd254caf17daf052e), [`8f8a4f9b13`](https://github.com/medusajs/medusa/commit/8f8a4f9b1353087d98f6cc75346d43a7f49901a8), [`6500f18b9b`](https://github.com/medusajs/medusa/commit/6500f18b9b80c5c9c473489e7e740d55dca74303), [`ce39b9b66e`](https://github.com/medusajs/medusa/commit/ce39b9b66e8c277ec0691ea6d0a950003be09cc1), [`a6a4b3f01a`](https://github.com/medusajs/medusa/commit/a6a4b3f01a6d2bd97b1580c59134279a1b033a5d), [`4d51f095b3`](https://github.com/medusajs/medusa/commit/4d51f095b3f98f468cefb760512563f7b77bb9cf), [`51bb6f1e89`](https://github.com/medusajs/medusa/commit/51bb6f1e89424c7ae9f566b43ba26b3f5a48e3f6), [`4625bd1241`](https://github.com/medusajs/medusa/commit/4625bd12416275b09c22cde4a09cb0f68df5d7c1), [`56b0b45304`](https://github.com/medusajs/medusa/commit/56b0b4530401a6ec5aa155874d371e45bb388fe2), [`cc1b66842c`](https://github.com/medusajs/medusa/commit/cc1b66842cbb37c6eab84e2d8b74844c214f38d7), [`24fb102a56`](https://github.com/medusajs/medusa/commit/24fb102a564b1253d1f8b039bb1e435cc5312fbb), [`e85463b2a7`](https://github.com/medusajs/medusa/commit/e85463b2a717751de2e21c39a4c745449b31affe)]:
  - @medusajs/core-flows@0.0.7
  - @medusajs/utils@1.11.7
  - @medusajs/workflows-sdk@0.1.4
  - medusa-test-utils@1.1.42
  - @medusajs/orchestration@0.5.5
  - @medusajs/link-modules@0.2.9
  - @medusajs/modules-sdk@1.12.9

## 1.20.2

### Patch Changes

- [#5923](https://github.com/medusajs/medusa/pull/5923) [`3db2f95e65`](https://github.com/medusajs/medusa/commit/3db2f95e65909f4fff432990b48be74509052e83) Thanks [@fPolic](https://github.com/fPolic)! - feat: Sales Channel module

- [#6258](https://github.com/medusajs/medusa/pull/6258) [`90cff0777`](https://github.com/medusajs/medusa/commit/90cff0777fd351771f3713bf84f4c327c64d276c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Adds support for ordering GET /admin/orders

- [#6263](https://github.com/medusajs/medusa/pull/6263) [`45134e4d1`](https://github.com/medusajs/medusa/commit/45134e4d11cfcdc08dbd10aae687bfbe9e848ab9) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Workflows passing MedusaContext as argument

- [#6333](https://github.com/medusajs/medusa/pull/6333) [`82c728bec`](https://github.com/medusajs/medusa/commit/82c728bec7232a245a67dca0b01b28572ebea75d) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Allow configuring of staged job polling batch size

- [#6218](https://github.com/medusajs/medusa/pull/6218) [`884428a1b`](https://github.com/medusajs/medusa/commit/884428a1b573e499d7659aefed639bf797147428) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Feat: Event Aggregator

- [#6197](https://github.com/medusajs/medusa/pull/6197) [`d1c18a309`](https://github.com/medusajs/medusa/commit/d1c18a3090d71c68a98343fdbb53516f416504c5) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(stock-location, medusa, types): add `q` and `order` query parameters to stock locations list endpoint

- [#6259](https://github.com/medusajs/medusa/pull/6259) [`3ded2314a`](https://github.com/medusajs/medusa/commit/3ded2314a5b56f810c8a7d6727d7cdc9ffc900d1) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa): fix constructor container type for abstract services

- [#6240](https://github.com/medusajs/medusa/pull/6240) [`360c71e39a`](https://github.com/medusajs/medusa/commit/360c71e39a31b96e82828563f46f8269b80595cc) Thanks [@srindom](https://github.com/srindom)! - fix(medusa): improve error message on incorrect service export

- Updated dependencies [[`12054f5c0`](https://github.com/medusajs/medusa/commit/12054f5c01915899223ddc6da734151b31fbb23b), [`3db2f95e65`](https://github.com/medusajs/medusa/commit/3db2f95e65909f4fff432990b48be74509052e83), [`96ba49329`](https://github.com/medusajs/medusa/commit/96ba49329b6b05922c90f0c55f16455cb40aa5ca), [`45134e4d1`](https://github.com/medusajs/medusa/commit/45134e4d11cfcdc08dbd10aae687bfbe9e848ab9), [`884428a1b`](https://github.com/medusajs/medusa/commit/884428a1b573e499d7659aefed639bf797147428), [`882aa549b`](https://github.com/medusajs/medusa/commit/882aa549bdcc6f378934eab2a7c485df354f46aa)]:
  - @medusajs/utils@1.11.5
  - @medusajs/modules-sdk@1.12.8
  - @medusajs/core-flows@0.0.6
  - @medusajs/link-modules@0.2.8
  - @medusajs/orchestration@0.5.4
  - @medusajs/workflows-sdk@0.1.3

## 1.20.1

### Patch Changes

- [#6201](https://github.com/medusajs/medusa/pull/6201) [`489b7effb`](https://github.com/medusajs/medusa/commit/489b7effb013b2ffb38693ace14fb8cce2dd7ab4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Support q search in currencies

- [#6152](https://github.com/medusajs/medusa/pull/6152) [`99045848f`](https://github.com/medusajs/medusa/commit/99045848fd3e863359c7878d9bc05271ed083a0e) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types,core-flows,utils): added delete endpoints for campaigns and promotions

- [#6125](https://github.com/medusajs/medusa/pull/6125) [`af7af7374`](https://github.com/medusajs/medusa/commit/af7af737455daa0f330840a9678e6339e519dfe6) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,utils): added campaign get endpoints

- [#6155](https://github.com/medusajs/medusa/pull/6155) [`db4da5602`](https://github.com/medusajs/medusa/commit/db4da56023c1c0563a545bffb2bec9cf0e1c4c4a) Thanks [@lukebui](https://github.com/lukebui)! - fix(@medusajs/medusa-js): correct invite resend path

- [#6208](https://github.com/medusajs/medusa/pull/6208) [`134af7766`](https://github.com/medusajs/medusa/commit/134af77667c278622e3731ba41602d297852fedb) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Enable pagination, search and ordering of shipping option list endpoint

- [#6110](https://github.com/medusajs/medusa/pull/6110) [`a12c28b7d5`](https://github.com/medusajs/medusa/commit/a12c28b7d5faed733bebbb4963dff50b9c8a33bc) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types): add promotion list and get endpoint

- [#6190](https://github.com/medusajs/medusa/pull/6190) [`d68089b2a`](https://github.com/medusajs/medusa/commit/d68089b2aa2fb4ab52640424ed1a378cd649364f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Implements `listAndCount` method for UserService, and updates list endpoint to accept the expected params.
  fix(medusa-js): Update `admin.users.list` to accept query params.
  fix(medusa-react): Update `useAdminUsers` hook to accept query params.

- [#6204](https://github.com/medusajs/medusa/pull/6204) [`6404b9abd`](https://github.com/medusajs/medusa/commit/6404b9abd12000ca00873d9d7a7f8273b77e0db4) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Update list return type of `GET /admin/users`.

- [#6130](https://github.com/medusajs/medusa/pull/6130) [`da5cc4cf7`](https://github.com/medusajs/medusa/commit/da5cc4cf7f7f0ef40d409704a95b025ce95477f4) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,utils): promotion and campaign create/update endpoint

- [#6100](https://github.com/medusajs/medusa/pull/6100) [`4792c5522`](https://github.com/medusajs/medusa/commit/4792c552269c147d3c07da49a175e9038f9260a8) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(@medusajs/medusa): add missing constructor to some services
  fix(@medusajs/file-local): Fix argument passed to the constructor
  fix(medusa-file-minio): Fix argument passed to the constructor
  fix(medusa-file-s3): Fix argument passed to the constructor

- [#6202](https://github.com/medusajs/medusa/pull/6202) [`8ad7539eb`](https://github.com/medusajs/medusa/commit/8ad7539ebc3172fe2c724cf41ec1db5829819446) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Support q search and order in list regions

- [#6159](https://github.com/medusajs/medusa/pull/6159) [`68d8daccd`](https://github.com/medusajs/medusa/commit/68d8daccd2a8508a13e211130e49017198b51fab) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types): added buyget support for modules

- Updated dependencies [[`68ddd866a5`](https://github.com/medusajs/medusa/commit/68ddd866a5ff9414e2db5b80d75acc5e81948540), [`72bc52231c`](https://github.com/medusajs/medusa/commit/72bc52231ca3a72fa6d197a248fe07a938ed0d85), [`99045848f`](https://github.com/medusajs/medusa/commit/99045848fd3e863359c7878d9bc05271ed083a0e), [`a9b4214503`](https://github.com/medusajs/medusa/commit/a9b42145032ee88aa922a11fe03e777b140c68f4), [`d85fee42e`](https://github.com/medusajs/medusa/commit/d85fee42ee7f661310584dfee5741d6c53b989bb), [`5e655dd59`](https://github.com/medusajs/medusa/commit/5e655dd59bda4ffface28db38021ba71cae6de10), [`b782d3bcb7`](https://github.com/medusajs/medusa/commit/b782d3bcb7e8088a962584b9a55200dd29c2161c), [`2b9f98895e`](https://github.com/medusajs/medusa/commit/2b9f98895eaca255e01278674b11cd7cb69b388f), [`302323916`](https://github.com/medusajs/medusa/commit/302323916b6d8eaf571cd59b5fc92a913af207de), [`da5cc4cf7`](https://github.com/medusajs/medusa/commit/da5cc4cf7f7f0ef40d409704a95b025ce95477f4), [`daecd82a7`](https://github.com/medusajs/medusa/commit/daecd82a7cdf7315599f464999690414c20d6748), [`738e9115e`](https://github.com/medusajs/medusa/commit/738e9115ec920d48bc52b8a690847e58c87ca28e), [`06b33a9b4`](https://github.com/medusajs/medusa/commit/06b33a9b4525b77b1b14b35b973209700945654e), [`b6ac768698`](https://github.com/medusajs/medusa/commit/b6ac768698a3b49d0162cb49e628386f3352d034), [`19bbae61f8`](https://github.com/medusajs/medusa/commit/19bbae61f8de1ac0ed574caff17b33e17705005a), [`130c641e5c`](https://github.com/medusajs/medusa/commit/130c641e5c91cf831de64fb87aebbfdc4d23530d), [`fade8ea7bf`](https://github.com/medusajs/medusa/commit/fade8ea7bf560343ecbde116d226ac44053cdb8e), [`8472460f53`](https://github.com/medusajs/medusa/commit/8472460f533322cc4535199aa768ac163021bc79)]:
  - @medusajs/utils@1.11.4
  - @medusajs/core-flows@0.0.5
  - @medusajs/modules-sdk@1.12.7
  - @medusajs/orchestration@0.5.3
  - @medusajs/workflows-sdk@0.1.2
  - @medusajs/link-modules@0.2.7

## 1.20.0

### Minor Changes

- [`f4734a7ac`](https://github.com/medusajs/medusa/commit/f4734a7ac644a9a6f53f61043932d8faae228b9b) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Add missing changeset

## 1.19.1

### Patch Changes

- [#5869](https://github.com/medusajs/medusa/pull/5869) [`45996d58a2`](https://github.com/medusajs/medusa/commit/45996d58a2665d72335faad11bea958f8da74195) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa, interfaces, utils, webshiper): Uniformise class checks

- [#5450](https://github.com/medusajs/medusa/pull/5450) [`1d7888afca`](https://github.com/medusajs/medusa/commit/1d7888afca3900f8a29b72f8fd149fc3e1e2ea4a) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa, link-module): SalesChannel<>Product joiner config

- [#5853](https://github.com/medusajs/medusa/pull/5853) [`6b0b3fed7`](https://github.com/medusajs/medusa/commit/6b0b3fed7a3fb18c8f781eb08b7549317dcbfaeb) Thanks [@Sajarin-M](https://github.com/Sajarin-M)! - Fix typo in discounts error message

- [#5901](https://github.com/medusajs/medusa/pull/5901) [`1a2f513d53`](https://github.com/medusajs/medusa/commit/1a2f513d5361101b4c606b710a3905025118289e) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Passport loader resolving to early

- [#5952](https://github.com/medusajs/medusa/pull/5952) [`487067fb4`](https://github.com/medusajs/medusa/commit/487067fb4802cb4bc0da1fcd154b0a89f4a0ef3a) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Resolve babel executable with npx

- [#6020](https://github.com/medusajs/medusa/pull/6020) [`fbee006e5`](https://github.com/medusajs/medusa/commit/fbee006e512ef2d56ffb23eeabad8b51b56be285) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa, orchestration, utils, workflows-sdk): add transaction options support and cleanup

- [#5838](https://github.com/medusajs/medusa/pull/5838) [`99a4f94db`](https://github.com/medusajs/medusa/commit/99a4f94db5ae25dd1688fe29556ba46923715e5f) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-payment-stripe): Add delay to Stripe webhook

- [#6001](https://github.com/medusajs/medusa/pull/6001) [`46d610bc5`](https://github.com/medusajs/medusa/commit/46d610bc555797df2ae81eb89b18faf1411b33b8) Thanks [@abusaidm](https://github.com/abusaidm)! - Add missing country in admin region and set Libya to formal name

- [#5926](https://github.com/medusajs/medusa/pull/5926) [`f25ca30b3`](https://github.com/medusajs/medusa/commit/f25ca30b3aec558094b1dffe70583fcbba64b29a) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa, medusa-js): publishable api key bugs

- [#5857](https://github.com/medusajs/medusa/pull/5857) [`2d79eeeecc`](https://github.com/medusajs/medusa/commit/2d79eeeecc8086d30e7f26e45f2e1aa03ca14145) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): add currency to region responses

- [#5820](https://github.com/medusajs/medusa/pull/5820) [`6fc6a9de6`](https://github.com/medusajs/medusa/commit/6fc6a9de6a336204fa0e1037502cb5cf801089dc) Thanks [@fPolic](https://github.com/fPolic)! - feat: PubKey <> SC joiner config

- [#5980](https://github.com/medusajs/medusa/pull/5980) [`278b7fb20`](https://github.com/medusajs/medusa/commit/278b7fb203f505ce163efe38055e9f36388985ea) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Update cart sales channel should not remove all line items

- [#5995](https://github.com/medusajs/medusa/pull/5995) [`37fba9a16`](https://github.com/medusajs/medusa/commit/37fba9a168199fd4fed68614b5186afc5a686cb8) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): cart completion payment sessions

- [#5991](https://github.com/medusajs/medusa/pull/5991) [`7f62ab1b5`](https://github.com/medusajs/medusa/commit/7f62ab1b583f8ea39cc2aad169d98a5c514f40b1) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, medusa-payment-stripe): fix stripe error handling

- [#5814](https://github.com/medusajs/medusa/pull/5814) [`496dcf10c4`](https://github.com/medusajs/medusa/commit/496dcf10c430b9ff9c21ee8bf8fae34ba01902de) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat/cart completion conflict fixes

- [#5990](https://github.com/medusajs/medusa/pull/5990) [`47be2ad72`](https://github.com/medusajs/medusa/commit/47be2ad7230966f9ce0f7afe5c845bf2abde5071) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Ordering management using joins and pagination

- [#5810](https://github.com/medusajs/medusa/pull/5810) [`fe007d01b`](https://github.com/medusajs/medusa/commit/fe007d01bd827f0e09ee545e48cef18913540c68) Thanks [@fPolic](https://github.com/fPolic)! - feat: sales channel <> order link

- [#5459](https://github.com/medusajs/medusa/pull/5459) [`76332ca6c`](https://github.com/medusajs/medusa/commit/76332ca6c153a786acc07d3f06ff45c3b9346fd3) Thanks [@fPolic](https://github.com/fPolic)! - feat: SalesChannel <> Cart joiner config

- Updated dependencies [[`6d1e3cc02`](https://github.com/medusajs/medusa/commit/6d1e3cc0285ef157fd6486060e8b32c00c01aa80), [`42cc8ae3f`](https://github.com/medusajs/medusa/commit/42cc8ae3f89ed7d642e51654d1a3cca011f13155), [`45996d58a2`](https://github.com/medusajs/medusa/commit/45996d58a2665d72335faad11bea958f8da74195), [`1d7888afca`](https://github.com/medusajs/medusa/commit/1d7888afca3900f8a29b72f8fd149fc3e1e2ea4a), [`9cc787cac4`](https://github.com/medusajs/medusa/commit/9cc787cac4bf1c5d8edf1c4b548bb3205100e822), [`bf63c4e6a`](https://github.com/medusajs/medusa/commit/bf63c4e6a32258565e1d361b8919afbf93cc2c72), [`355075097`](https://github.com/medusajs/medusa/commit/3550750975a0c9359fd887929377733606ef03af), [`f86877586`](https://github.com/medusajs/medusa/commit/f86877586147ecedbf7f56a1c57f37ef0c33286c), [`8402f4697`](https://github.com/medusajs/medusa/commit/8402f46970c007bab9e0f1f6ae653d955650d503), [`925feea04`](https://github.com/medusajs/medusa/commit/925feea04a8222285175c33577548e50516069a7), [`3f6d79961`](https://github.com/medusajs/medusa/commit/3f6d79961dec1c5eb8950f8eacd94a5d87a4acde), [`fbee006e5`](https://github.com/medusajs/medusa/commit/fbee006e512ef2d56ffb23eeabad8b51b56be285), [`c41f3002f`](https://github.com/medusajs/medusa/commit/c41f3002f3118b1f195c5c822fe0f400091d115b), [`46d610bc5`](https://github.com/medusajs/medusa/commit/46d610bc555797df2ae81eb89b18faf1411b33b8), [`a0dd18c12`](https://github.com/medusajs/medusa/commit/a0dd18c12ac5ab6280366d93d7b47cdb3036914b), [`d16d10619`](https://github.com/medusajs/medusa/commit/d16d10619dfbd3966a4709753de3d8cc37c6f2eb), [`6fc6a9de6`](https://github.com/medusajs/medusa/commit/6fc6a9de6a336204fa0e1037502cb5cf801089dc), [`890e76a5c`](https://github.com/medusajs/medusa/commit/890e76a5c53039576c42ca4d46af6f6977cdebd1), [`fe007d01b`](https://github.com/medusajs/medusa/commit/fe007d01bd827f0e09ee545e48cef18913540c68), [`76332ca6c`](https://github.com/medusajs/medusa/commit/76332ca6c153a786acc07d3f06ff45c3b9346fd3)]:
  - @medusajs/modules-sdk@1.12.6
  - @medusajs/utils@1.11.3
  - @medusajs/link-modules@0.2.6
  - @medusajs/orchestration@0.5.2
  - @medusajs/workflows-sdk@0.1.1
  - medusa-core-utils@1.2.1
  - medusa-test-utils@1.1.41
  - @medusajs/core-flows@0.0.4

## 1.19.0

### Minor Changes

- [#5766](https://github.com/medusajs/medusa/pull/5766) [`428331a65`](https://github.com/medusajs/medusa/commit/428331a653b613767174d210fb96cc3b7eacb93a) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Respond with order when cart is already completed

- [#5656](https://github.com/medusajs/medusa/pull/5656) [`a53ae1e29`](https://github.com/medusajs/medusa/commit/a53ae1e29b53e08e7885f663a5bff5cfa193d338) Thanks [@pepijn-vanvlaanderen](https://github.com/pepijn-vanvlaanderen)! - Replaced Node Redis with ioredis

### Patch Changes

- [#5752](https://github.com/medusajs/medusa/pull/5752) [`079f0da83`](https://github.com/medusajs/medusa/commit/079f0da83f482562bbb525807ee1a7e32993b4da) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,pricing,medusa,pricing,types,utils): Price List Prices can have their own rules

- [#5811](https://github.com/medusajs/medusa/pull/5811) [`07107f356`](https://github.com/medusajs/medusa/commit/07107f3565bc2c97e9b89818b390210454f0566d) Thanks [@riqwan](https://github.com/riqwan)! - feat(orchestration,core-flows,medusa): product import uses workflows

- [#5825](https://github.com/medusajs/medusa/pull/5825) [`d9e29e8e4`](https://github.com/medusajs/medusa/commit/d9e29e8e456de4a7b2c32585670911639f5acb9e) Thanks [@josetr](https://github.com/josetr)! - Updating note doesn't require loading author relationship

- [#5723](https://github.com/medusajs/medusa/pull/5723) [`fd317f1a6`](https://github.com/medusajs/medusa/commit/fd317f1a6ba0952999e2de5c4e649376e6afab21) Thanks [@driver005](https://github.com/driver005)! - feat(medusa): add monorepo support command develop

- [#5846](https://github.com/medusajs/medusa/pull/5846) [`b5748ab59`](https://github.com/medusajs/medusa/commit/b5748ab59eac1b5adac32779fd0b88d56b1628af) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Prefer logger instead of console.log

- [#5867](https://github.com/medusajs/medusa/pull/5867) [`2826605b0`](https://github.com/medusajs/medusa/commit/2826605b01ddfca78b84979999b671a4f25dd5f9) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Order edit confirmation conflict line items update

- [#5701](https://github.com/medusajs/medusa/pull/5701) [`6975eacb3`](https://github.com/medusajs/medusa/commit/6975eacb338874b976c14aae030c74362d57410c) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa, medusa-cli): Improve add line item + cluster starting with medusa cli

- [#5745](https://github.com/medusajs/medusa/pull/5745) [`e4bfa6c88`](https://github.com/medusajs/medusa/commit/e4bfa6c88ae56934528e66a7f8cc0edf3ad49e04) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): raise error properly in api-key middleware if product is not found

- [#5816](https://github.com/medusajs/medusa/pull/5816) [`6f96ced40`](https://github.com/medusajs/medusa/commit/6f96ced40f01a6cccee2a5eb0d30964bc8f43163) Thanks [@Arsenalist](https://github.com/Arsenalist)! - Emit event when discount is created

- [#5725](https://github.com/medusajs/medusa/pull/5725) [`85cda7ce3`](https://github.com/medusajs/medusa/commit/85cda7ce3754e2a8ecb207f29d462a9bcd442ade) Thanks [@adrien2p](https://github.com/adrien2p)! - slightly improve create cart workflow

- [#5781](https://github.com/medusajs/medusa/pull/5781) [`9b447f99f`](https://github.com/medusajs/medusa/commit/9b447f99ff25812ad07fe3b49656fd099df69e42) Thanks [@mortenengel](https://github.com/mortenengel)! - fix(medusa): Product option values in CSV Export

- Updated dependencies [[`079f0da83`](https://github.com/medusajs/medusa/commit/079f0da83f482562bbb525807ee1a7e32993b4da), [`c4deeee48`](https://github.com/medusajs/medusa/commit/c4deeee481399f5371d773173e20dc149d502e20), [`07107f356`](https://github.com/medusajs/medusa/commit/07107f3565bc2c97e9b89818b390210454f0566d), [`6975eacb3`](https://github.com/medusajs/medusa/commit/6975eacb338874b976c14aae030c74362d57410c), [`85cda7ce3`](https://github.com/medusajs/medusa/commit/85cda7ce3754e2a8ecb207f29d462a9bcd442ade), [`8f25ed8a1`](https://github.com/medusajs/medusa/commit/8f25ed8a10fe23e9342dc3d03545546b4ad4d6da)]:
  - @medusajs/core-flows@0.0.3
  - @medusajs/utils@1.11.2
  - @medusajs/modules-sdk@1.12.5
  - @medusajs/orchestration@0.5.1
  - @medusajs/medusa-cli@1.3.22
  - @medusajs/link-modules@0.2.5

## 1.18.1

### Patch Changes

- [#5685](https://github.com/medusajs/medusa/pull/5685) [`1e39a95f8`](https://github.com/medusajs/medusa/commit/1e39a95f8a136427d04ea20cd320337af0923e31) Thanks [@riqwan](https://github.com/riqwan)! - fix(workflows, pricing, medusa): update region variants fix + pricing module migration scripts

- [#5703](https://github.com/medusajs/medusa/pull/5703) [`22bea2724`](https://github.com/medusajs/medusa/commit/22bea2724d48f7635f96b7c229c3084dee70b37a) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Exclude subscribers correctly on Windows

- [#5705](https://github.com/medusajs/medusa/pull/5705) [`ddbeed4ea`](https://github.com/medusajs/medusa/commit/ddbeed4ea67d67a7aef04eb3135087551a7e9b37) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(workflows, core-flows, ...): Split workflows tooling and definitions

- [#5713](https://github.com/medusajs/medusa/pull/5713) [`18afe0b9a`](https://github.com/medusajs/medusa/commit/18afe0b9addb33ec2e3b285651b4eb1ef8065845) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(stock-location, inventory, medusa, types, utils): allow buildQuery to take null as an argument in order to prevent default pagination

- [#5708](https://github.com/medusajs/medusa/pull/5708) [`712c4496c`](https://github.com/medusajs/medusa/commit/712c4496ce3cbf00e3ae4f1e9e1f94ffbe8a53bd) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): update default admin query with product categories

- [#5715](https://github.com/medusajs/medusa/pull/5715) [`aa6c4cbac`](https://github.com/medusajs/medusa/commit/aa6c4cbac5a67edff7bdeb9d406ac63ea2463249) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): alwyas add price_list_id and price_list to money_amounts when listing for pricing module

- [#5711](https://github.com/medusajs/medusa/pull/5711) [`fc1ef29ed`](https://github.com/medusajs/medusa/commit/fc1ef29ed935e192f0943a2bf4b8fbb05ce6890d) Thanks [@riqwan](https://github.com/riqwan)! - fix(medusa,pricing,types): rules only gets updated/deleted upon passing an explicit object

- [#5730](https://github.com/medusajs/medusa/pull/5730) [`2e6b11031`](https://github.com/medusajs/medusa/commit/2e6b1103161a2eb637e69dbd316197434fd0e0db) Thanks [@riqwan](https://github.com/riqwan)! - fix(medusa,pricing): fix migrations for existing databases

- [#5607](https://github.com/medusajs/medusa/pull/5607) [`9f9db3969`](https://github.com/medusajs/medusa/commit/9f9db396987776039ad0c2b8d5792d0ebdbf8792) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Workflows composer api

- [#5536](https://github.com/medusajs/medusa/pull/5536) [`dc5750dd6`](https://github.com/medusajs/medusa/commit/dc5750dd665a91d35c0246ba83c7f90ec74907f4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,types,workflows,utils,product,pricing): PricingModule Integration of PriceLists into Core

- Updated dependencies [[`1e39a95f8`](https://github.com/medusajs/medusa/commit/1e39a95f8a136427d04ea20cd320337af0923e31), [`a39ce125c`](https://github.com/medusajs/medusa/commit/a39ce125cc96f14732d5a6301313d2376484fa23), [`ddbeed4ea`](https://github.com/medusajs/medusa/commit/ddbeed4ea67d67a7aef04eb3135087551a7e9b37), [`18afe0b9a`](https://github.com/medusajs/medusa/commit/18afe0b9addb33ec2e3b285651b4eb1ef8065845), [`de8f74867`](https://github.com/medusajs/medusa/commit/de8f748674bfd19b3dbadb9695d9080aa91940de), [`ffb0c7b4c`](https://github.com/medusajs/medusa/commit/ffb0c7b4cdbc83b61f70c881001a69de6ec8ae99), [`010560fd2`](https://github.com/medusajs/medusa/commit/010560fd2a4c12eb7a551919df33e58e7cbe920f), [`9f9db3969`](https://github.com/medusajs/medusa/commit/9f9db396987776039ad0c2b8d5792d0ebdbf8792), [`dc5750dd6`](https://github.com/medusajs/medusa/commit/dc5750dd665a91d35c0246ba83c7f90ec74907f4)]:
  - @medusajs/workflows-sdk@0.1.0
  - @medusajs/core-flows@0.0.2
  - @medusajs/orchestration@0.5.0
  - @medusajs/utils@1.11.1
  - @medusajs/link-modules@0.2.4
  - @medusajs/modules-sdk@1.12.4

## 1.18.0

### Minor Changes

- [#5603](https://github.com/medusajs/medusa/pull/5603) [`cedab5833`](https://github.com/medusajs/medusa/commit/cedab583395275444001f0268e4b9ccab9b2b262) Thanks [@riqwan](https://github.com/riqwan)! - feat(workflows,medusa,utils): add medusa v2 feature flag

- [`b53ab22a7`](https://github.com/medusajs/medusa/commit/b53ab22a7c47a1ff24bc0bdc5035c4229a7753af) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(changesets): Minor-bump @medusajs/medusa

### Patch Changes

- [#5597](https://github.com/medusajs/medusa/pull/5597) [`2947f57db`](https://github.com/medusajs/medusa/commit/2947f57db1cabb343644bde379fa9ec54e9d7750) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Update wrapHandler so that it is also able to catch errors for sync handlers

- [#5624](https://github.com/medusajs/medusa/pull/5624) [`57573ed4d`](https://github.com/medusajs/medusa/commit/57573ed4d7d657d0d98bf00fb756cfbfb9cbcd8d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa): Adds a new alternative syntax for creating Subscribers in Medusa, as well as adding a new API for creating scheduled jobs.

- [#5599](https://github.com/medusajs/medusa/pull/5599) [`b3093c3e3`](https://github.com/medusajs/medusa/commit/b3093c3e3d64e4c024a04d76fb0f727c1c38108b) Thanks [@bqst](https://github.com/bqst)! - feat(medusa): Add `metadata` to Product Category

- [#5635](https://github.com/medusajs/medusa/pull/5635) [`7226f5b69`](https://github.com/medusajs/medusa/commit/7226f5b6997a69bfcdbdd16ec16b209746023f0c) Thanks [@chemicalkosek](https://github.com/chemicalkosek)! - fix(medusa): Add missing import of promiseAll

- [#5634](https://github.com/medusajs/medusa/pull/5634) [`52800710a`](https://github.com/medusajs/medusa/commit/52800710a294e32ebda6ba8a224fe85d289bfa0f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Ensure that errorHandler middleware is applied if no middleware config exists

- Updated dependencies [[`cedab5833`](https://github.com/medusajs/medusa/commit/cedab583395275444001f0268e4b9ccab9b2b262)]:
  - @medusajs/workflows@0.3.0
  - @medusajs/utils@1.11.0

## 1.17.4

### Patch Changes

- [#5594](https://github.com/medusajs/medusa/pull/5594) [`4ad66c179`](https://github.com/medusajs/medusa/commit/4ad66c1795af2b5e9f0a0e958447b688e525651a) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Load legacy modules entities

- [#5582](https://github.com/medusajs/medusa/pull/5582) [`91615f9c4`](https://github.com/medusajs/medusa/commit/91615f9c459a2d8cb842561c5edb335680d30298) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(@medusajs/client-types): Fix types and TSDocs
  fix(medusa-react): Fix response type of Publishable API Key's list sales channels.
  fix(@medusajs/medusa-js): Fix incorrect parameter and response types.
  fix(@medusajs/medusa): Fix incorrect types and add TSDocs
  fix(@medusajs/types): Fix incorrect types and add TSDocs

- [#5510](https://github.com/medusajs/medusa/pull/5510) [`203e1fccb`](https://github.com/medusajs/medusa/commit/203e1fccb404a7408b53767456eee52ea719356c) Thanks [@adamlamaa](https://github.com/adamlamaa)! - feat(medusa): Include Product Collections in Seed command

- [#5496](https://github.com/medusajs/medusa/pull/5496) [`154c9b43b`](https://github.com/medusajs/medusa/commit/154c9b43bde1fdff562aba9da8a79af2660b29b3) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa, modules-sdk, types, utils): Re work modules loading and remove legacy functions

- [#5543](https://github.com/medusajs/medusa/pull/5543) [`f90ba0208`](https://github.com/medusajs/medusa/commit/f90ba02087778d8131aed3a59a6dc9c8ca3c95f4) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(utils): Introduce promiseAll util

- Updated dependencies [[`c39bf69a5`](https://github.com/medusajs/medusa/commit/c39bf69a5e5cae75d7fa12aa6022b10903557a32), [`154c9b43b`](https://github.com/medusajs/medusa/commit/154c9b43bde1fdff562aba9da8a79af2660b29b3)]:
  - @medusajs/modules-sdk@1.12.3
  - @medusajs/orchestration@0.4.4
  - @medusajs/utils@1.10.5
  - @medusajs/workflows@0.2.5
  - @medusajs/link-modules@0.2.3

## 1.17.3

### Patch Changes

- [#5304](https://github.com/medusajs/medusa/pull/5304) [`148f537b4`](https://github.com/medusajs/medusa/commit/148f537b47635e8b73ebaa27bbfbe58624bfe641) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): add migration script for pricing module

- [#5075](https://github.com/medusajs/medusa/pull/5075) [`e64823d1b`](https://github.com/medusajs/medusa/commit/e64823d1b9e7556d8bc12c553accefa0b2a8b714) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): totals calculation with gift card

- [#5187](https://github.com/medusajs/medusa/pull/5187) [`9ff22110a`](https://github.com/medusajs/medusa/commit/9ff22110a60da6d91ca49e93de509512382a46a3) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): decorate inventory for variants returned through carts

- [#5468](https://github.com/medusajs/medusa/pull/5468) [`a45da9215`](https://github.com/medusajs/medusa/commit/a45da9215d2a7834c368037726aaa3961caadaf9) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, modules-sdk, modules): Module loading was missing the expected dependencies and remote query reference fix

- [#5497](https://github.com/medusajs/medusa/pull/5497) [`2548ea8e5`](https://github.com/medusajs/medusa/commit/2548ea8e5ed3374143500baa37e2accf0fa367a0) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Ensures that file based routing is compatible with Windows pathing

- [#5428](https://github.com/medusajs/medusa/pull/5428) [`ebba93e03`](https://github.com/medusajs/medusa/commit/ebba93e03d223fb3a79276090f7cfad612d70243) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Update status type in API payload definition

- [#5304](https://github.com/medusajs/medusa/pull/5304) [`148f537b4`](https://github.com/medusajs/medusa/commit/148f537b47635e8b73ebaa27bbfbe58624bfe641) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): integrate pricing into reads

- [#5410](https://github.com/medusajs/medusa/pull/5410) [`4d52082bf`](https://github.com/medusajs/medusa/commit/4d52082bf05fce18b55dae7f982c0c2cf4c65194) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): variant creation with prices in productservice.create

- [#5480](https://github.com/medusajs/medusa/pull/5480) [`a780b92b8`](https://github.com/medusajs/medusa/commit/a780b92b8d590baa0e86682d1154f9e5b0869ea1) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): admin get product should return prices when expected

- Updated dependencies [[`a45da9215`](https://github.com/medusajs/medusa/commit/a45da9215d2a7834c368037726aaa3961caadaf9), [`5c77029cb`](https://github.com/medusajs/medusa/commit/5c77029cb021690a4f617b83b4999ed55bf9dea1)]:
  - @medusajs/link-modules@0.2.2
  - @medusajs/modules-sdk@1.12.2
  - @medusajs/orchestration@0.4.3

## 1.17.2

### Patch Changes

- [#5408](https://github.com/medusajs/medusa/pull/5408) [`c1cabac72`](https://github.com/medusajs/medusa/commit/c1cabac721d80f631875e00b26247b32e3f6e4da) Thanks [@FlorentQuienne42](https://github.com/FlorentQuienne42)! - Dont 'set' in cache if ignore_cache option is true

- [#5281](https://github.com/medusajs/medusa/pull/5281) [`69cf7215f`](https://github.com/medusajs/medusa/commit/69cf7215f1f730ffb332129e65211470be1f88f1) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, types): Mark properties as nullable to reflect their correct types

- [#5385](https://github.com/medusajs/medusa/pull/5385) [`0d7c5543d`](https://github.com/medusajs/medusa/commit/0d7c5543dd200a3545fac6b8601c0542ddd20c82) Thanks [@pepijn-vanvlaanderen](https://github.com/pepijn-vanvlaanderen)! - Expose item tax total and shipping tax total

- [#5247](https://github.com/medusajs/medusa/pull/5247) [`ec27d02d9`](https://github.com/medusajs/medusa/commit/ec27d02d9951558f024fc154a03e9d4db56f0354) Thanks [@DidierGuyon](https://github.com/DidierGuyon)! - Fixed filter statement in partitionItems\_ method of Fulfillment Service

- [#5365](https://github.com/medusajs/medusa/pull/5365) [`ddff91965`](https://github.com/medusajs/medusa/commit/ddff9196557c662cbdfb463dc5c76bf7bee6c087) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa): Introduces a new file based routing system as an alternative to the current approach. File based routing is optional, and the previous approach can still be used. The two approaches can also be used together allowing for incremental adoption.

- [#5301](https://github.com/medusajs/medusa/pull/5301) [`66413d094`](https://github.com/medusajs/medusa/commit/66413d094e916debbdb74b68800c96ca2c9302c9) Thanks [@srindom](https://github.com/srindom)! - fix: move create inventory workflow to @medusajs/workflows

- [#5394](https://github.com/medusajs/medusa/pull/5394) [`a0963f0ed`](https://github.com/medusajs/medusa/commit/a0963f0edf909f6cfea17bd7a0c7899707808057) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(admin-ui): Remove t() on product.status update

- Updated dependencies [[`378ca1b36`](https://github.com/medusajs/medusa/commit/378ca1b36e909a67e39c69ea5ca94ec58a345878), [`b62af612c`](https://github.com/medusajs/medusa/commit/b62af612c7baa244075e546c949b89c4589bd2cf), [`e47461d95`](https://github.com/medusajs/medusa/commit/e47461d95caecf3a447ee9fa0b0950340b93f282), [`66413d094`](https://github.com/medusajs/medusa/commit/66413d094e916debbdb74b68800c96ca2c9302c9)]:
  - @medusajs/utils@1.10.4
  - @medusajs/link-modules@0.2.1
  - @medusajs/modules-sdk@1.12.1
  - @medusajs/orchestration@0.4.2
  - @medusajs/workflows@0.2.4

## 1.17.1

### Patch Changes

- [#5275](https://github.com/medusajs/medusa/pull/5275) [`90e24c593`](https://github.com/medusajs/medusa/commit/90e24c593f66276e8e93734e067f4e8c877f6001) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): update unit_price for line-items with quantity pricing when merging on create

- [#5242](https://github.com/medusajs/medusa/pull/5242) [`130cbc1f4`](https://github.com/medusajs/medusa/commit/130cbc1f437af211b6d05f80128d90138abcd38d) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Modules exporting schema with entities and fields

- [#5279](https://github.com/medusajs/medusa/pull/5279) [`f9264c479`](https://github.com/medusajs/medusa/commit/f9264c479e2628911bd3d753c99c141f97335fba) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Accept invite should not require first/last name

- [#5233](https://github.com/medusajs/medusa/pull/5233) [`0f34e0f38`](https://github.com/medusajs/medusa/commit/0f34e0f381833a4790ee590a9cbf93b7660634f3) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin-ui, medusa, medusa-react, medusa-js): Price List UI revamp

- Updated dependencies [[`eeceec791`](https://github.com/medusajs/medusa/commit/eeceec791c141996cf7fd06555afb6e738b52840), [`130cbc1f4`](https://github.com/medusajs/medusa/commit/130cbc1f437af211b6d05f80128d90138abcd38d), [`cb569c2df`](https://github.com/medusajs/medusa/commit/cb569c2dfe2d83e1ff72a49f2331450a83b73325)]:
  - @medusajs/utils@1.10.3
  - @medusajs/modules-sdk@1.12.0
  - @medusajs/link-modules@0.2.0

## 1.17.0

### Minor Changes

- [#4064](https://github.com/medusajs/medusa/pull/4064) [`2caff2efc`](https://github.com/medusajs/medusa/commit/2caff2efc757a3738ae8b7ee6fde77ee7100f995) Thanks [@dPreininger](https://github.com/dPreininger)! - feat(medusa): Authentication overhaul

### Patch Changes

- [#5200](https://github.com/medusajs/medusa/pull/5200) [`240c439be`](https://github.com/medusajs/medusa/commit/240c439beb76626e58006ceb86a1cd425f14d4fa) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Product model before insert hook

- [#5137](https://github.com/medusajs/medusa/pull/5137) [`2b91049f5`](https://github.com/medusajs/medusa/commit/2b91049f58b2bd70cbee53e1ace7d36f59da6fa4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): quantity prices for line item updates

- [#5046](https://github.com/medusajs/medusa/pull/5046) [`f1512605d`](https://github.com/medusajs/medusa/commit/f1512605d2d8b758be21f21d0b118e14b914d7d2) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): admin list product with product isolated module

- [#5168](https://github.com/medusajs/medusa/pull/5168) [`dfa5d041c`](https://github.com/medusajs/medusa/commit/dfa5d041c90b849b288f8ae9f5a0a1aa3ee1b32e) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat/update cart product isolation

- [#5081](https://github.com/medusajs/medusa/pull/5081) [`202049f8a`](https://github.com/medusajs/medusa/commit/202049f8aa3682df7e545b1c42ab0bdab1c52639) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, workflows): Create product workflow with Isolated modules + module registration

- [#5054](https://github.com/medusajs/medusa/pull/5054) [`5f76b967d`](https://github.com/medusajs/medusa/commit/5f76b967d9c6ae3a3f554c2d854299f5e22ee83e) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Admin get product with isolated module

- [#5196](https://github.com/medusajs/medusa/pull/5196) [`f285a6712`](https://github.com/medusajs/medusa/commit/f285a671232f34a35d9cd9c9a0e6faa8a899a674) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Remove create product unnecessary input config workflow

- [#5207](https://github.com/medusajs/medusa/pull/5207) [`a9972d7d6`](https://github.com/medusajs/medusa/commit/a9972d7d6fa5c9698318a55173440f635ebf0a11) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa-react): `@medusajs/medusa-js` import

- [#5224](https://github.com/medusajs/medusa/pull/5224) [`c68ba63c1`](https://github.com/medusajs/medusa/commit/c68ba63c1b4ac551cb53bfb494bf7046e652e083) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): In product isolation, throw if product not found

- [#5177](https://github.com/medusajs/medusa/pull/5177) [`c1b8f089e`](https://github.com/medusajs/medusa/commit/c1b8f089e3277f2aa4b7188bf914253e4ad0fe95) Thanks [@srindom](https://github.com/srindom)! - fix(medusa-payment-stripe): adds missing undefined check

- Updated dependencies [[`cc4169a94`](https://github.com/medusajs/medusa/commit/cc4169a94c7c5f5bf4d04f7b6e815b409a0a8192), [`30233712c`](https://github.com/medusajs/medusa/commit/30233712cb93b38de50c266a9841cea413949611), [`dfa5d041c`](https://github.com/medusajs/medusa/commit/dfa5d041c90b849b288f8ae9f5a0a1aa3ee1b32e), [`202049f8a`](https://github.com/medusajs/medusa/commit/202049f8aa3682df7e545b1c42ab0bdab1c52639), [`1e7db5a5c`](https://github.com/medusajs/medusa/commit/1e7db5a5cb7c955e72c52e64df8a16b1607eef70)]:
  - @medusajs/utils@1.10.2
  - @medusajs/orchestration@0.4.1
  - @medusajs/modules-sdk@1.11.3
  - @medusajs/workflows@0.2.3

## 1.16.1

### Patch Changes

- [#5145](https://github.com/medusajs/medusa/pull/5145) [`6c808dd6d`](https://github.com/medusajs/medusa/commit/6c808dd6d9c7db1f51787553eff4414641c33554) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Handle variant error during line item generation

- Updated dependencies [[`47603f479`](https://github.com/medusajs/medusa/commit/47603f479731ad495938b056da7a493991a1d9a9)]:
  - @medusajs/modules-sdk@1.11.2

## 1.16.0

### Minor Changes

- [`77c85fc6c`](https://github.com/medusajs/medusa/commit/77c85fc6c6c940244b7714aee3a458ee4f86aad0) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor bump @medusajs/medusa

### Patch Changes

- [#5037](https://github.com/medusajs/medusa/pull/5037) [`7231f6583`](https://github.com/medusajs/medusa/commit/7231f658331485640aeac2b6109c824fd05ce19b) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Prevent default SC to be assigned if the isolated product flag is enabled

- [#5018](https://github.com/medusajs/medusa/pull/5018) [`4fa675ec2`](https://github.com/medusajs/medusa/commit/4fa675ec25b3d6fccd881c4f5a5b91f0e9e13e82) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa, modules-sdk, types): Refactor modules loading from medusa

- [#5053](https://github.com/medusajs/medusa/pull/5053) [`dc94f053d`](https://github.com/medusajs/medusa/commit/dc94f053d31d3544c313b23ac1d6d1465e8336db) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Support `fields` param in list-variants

- [#4961](https://github.com/medusajs/medusa/pull/4961) [`6273b4b16`](https://github.com/medusajs/medusa/commit/6273b4b160493463e1199e5db4e9cfa4cff6fbe4) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(utils, module-sdk, medusa, types): Extract pg connection utils to utils package

- [#4556](https://github.com/medusajs/medusa/pull/4556) [`2b078f06d`](https://github.com/medusajs/medusa/commit/2b078f06d930e6219b46720f4a916b20015329e5) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): include default sales channel for store/variant endpoints if no other channel is selected

- [#4969](https://github.com/medusajs/medusa/pull/4969) [`30863fee5`](https://github.com/medusajs/medusa/commit/30863fee529ed035f161c749fda3cd64fa48efb1) Thanks [@adrien2p](https://github.com/adrien2p)! - feat: store List products remote query with product isolation

- [#5042](https://github.com/medusajs/medusa/pull/5042) [`5362bfc34`](https://github.com/medusajs/medusa/commit/5362bfc348cad3aecb4fb93b21920355ad9d9ffc) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Migrations to remove FKs related to product

- [#5071](https://github.com/medusajs/medusa/pull/5071) [`60360d2fd`](https://github.com/medusajs/medusa/commit/60360d2fd26528e08c9ac93d316738c397b51169) Thanks [@adrien2p](https://github.com/adrien2p)! - style(medusa): Fix order service linting issues

- [#5010](https://github.com/medusajs/medusa/pull/5010) [`05a32683a`](https://github.com/medusajs/medusa/commit/05a32683a341451fc4d3526687ec775926e1ba68) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Get product with isolated product module

- [#5029](https://github.com/medusajs/medusa/pull/5029) [`05fcfd803`](https://github.com/medusajs/medusa/commit/05fcfd803e5f06bf29354b20eb57bbc9c2c72d8e) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Fix duplicated migration - AddTimestempsToProductShippingProfiles1692870898425

- Updated dependencies [[`d8649baca`](https://github.com/medusajs/medusa/commit/d8649bacaa2ed784b9e7b2b0e1f1194d3697bb92), [`4fa675ec2`](https://github.com/medusajs/medusa/commit/4fa675ec25b3d6fccd881c4f5a5b91f0e9e13e82), [`6273b4b16`](https://github.com/medusajs/medusa/commit/6273b4b160493463e1199e5db4e9cfa4cff6fbe4), [`30863fee5`](https://github.com/medusajs/medusa/commit/30863fee529ed035f161c749fda3cd64fa48efb1), [`3d68be2b6`](https://github.com/medusajs/medusa/commit/3d68be2b6b93ae928f5c955e102ebdf2c34fb364), [`107aaa371`](https://github.com/medusajs/medusa/commit/107aaa371c444843874d125bf8bd493ef89f5756)]:
  - @medusajs/orchestration@0.4.0
  - @medusajs/modules-sdk@1.11.0
  - @medusajs/utils@1.10.1
  - @medusajs/workflows@0.2.2

## 1.15.1

### Patch Changes

- [#4899](https://github.com/medusajs/medusa/pull/4899) [`bb5ea9d5c`](https://github.com/medusajs/medusa/commit/bb5ea9d5ca92d96a64652cbb679284c817b68bff) Thanks [@josipmatichr](https://github.com/josipmatichr)! - fix(medusa): Double tax issue on return refund amount

- [#4913](https://github.com/medusajs/medusa/pull/4913) [`4bf8acbdd`](https://github.com/medusajs/medusa/commit/4bf8acbdd4244aed0425fae4bb1f2f26e79d5640) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): csv parser check `match` prop on column

- [#4884](https://github.com/medusajs/medusa/pull/4884) [`046b0dcfa`](https://github.com/medusajs/medusa/commit/046b0dcfa5acfdbf98f5a5593b42673c7567430d) Thanks [@pevey](https://github.com/pevey)! - Chore(medusa-file-s3): Add cache-control option, fix delete function, update to sdk v3

- [#4855](https://github.com/medusajs/medusa/pull/4855) [`4d439bed3`](https://github.com/medusajs/medusa/commit/4d439bed3812e4d4c45bd5c0a872c9b0fd111af8) Thanks [@hanam1ni](https://github.com/hanam1ni)! - fix(medusa): Make event enqueuer reconnect the database when it lost the connection

- [#4922](https://github.com/medusajs/medusa/pull/4922) [`17d91c276`](https://github.com/medusajs/medusa/commit/17d91c276a68de4d2b360335f32fcce48a16c9ec) Thanks [@olivermrbl](https://github.com/olivermrbl)! - [wip] feat(medusa): Add AbstractFulfillmentService

- [#4963](https://github.com/medusajs/medusa/pull/4963) [`b71776738`](https://github.com/medusajs/medusa/commit/b71776738cce2add34306f23838ca576daa9d946) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Event bus db failure handling

- [#4846](https://github.com/medusajs/medusa/pull/4846) [`c7b149a7b`](https://github.com/medusajs/medusa/commit/c7b149a7bc87dc4df1c78edccb36b45f19ee8e36) Thanks [@josipmatichr](https://github.com/josipmatichr)! - feat(medusa-fulfillment-webshipper): Create webshipper return order

- [#4953](https://github.com/medusajs/medusa/pull/4953) [`9781089ca`](https://github.com/medusajs/medusa/commit/9781089ca301221011c58423add3bf81b74b068b) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa): fix types for upload endpoints

- [#4834](https://github.com/medusajs/medusa/pull/4834) [`470379e63`](https://github.com/medusajs/medusa/commit/470379e631ca17ee486a28c50ec828344c61d727) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(medusa, admin-ui): Allow soft-deleted return reason restoration

- [#4889](https://github.com/medusajs/medusa/pull/4889) [`a1110b343`](https://github.com/medusajs/medusa/commit/a1110b34383e4626197e572eac05b1a6164cabcb) Thanks [@riqwan](https://github.com/riqwan)! - fix(medusa): category_id and q params for list products endpoint should work

- [#4695](https://github.com/medusajs/medusa/pull/4695) [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - introduce @medusajs/link-modules

- [#4925](https://github.com/medusajs/medusa/pull/4925) [`a4906d0ac`](https://github.com/medusajs/medusa/commit/a4906d0ac0af36b1382d3befe64281b404387bd7) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Use MedusaApp on core and initial JoinerConfig for internal services

- Updated dependencies [[`c3dba0694`](https://github.com/medusajs/medusa/commit/c3dba069488952945150117a30b1306a2e0bb3ce), [`460161a69`](https://github.com/medusajs/medusa/commit/460161a69f22cf6d561952e92e7d9b56912113e6), [`240b03800`](https://github.com/medusajs/medusa/commit/240b038006924d4872de068c98e2d6862145cb52), [`fcb6b4f51`](https://github.com/medusajs/medusa/commit/fcb6b4f510dba2757570625acb5da9476b7544fd), [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef), [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef), [`87bade096`](https://github.com/medusajs/medusa/commit/87bade096e3d536f29ddc57dbc4c04e5d7a46e4b), [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef), [`a4906d0ac`](https://github.com/medusajs/medusa/commit/a4906d0ac0af36b1382d3befe64281b404387bd7)]:
  - @medusajs/modules-sdk@1.10.0
  - @medusajs/orchestration@0.3.0
  - @medusajs/utils@1.10.0
  - @medusajs/medusa-cli@1.3.21
  - @medusajs/workflows@0.2.1

## 1.15.0

### Minor Changes

- [#4788](https://github.com/medusajs/medusa/pull/4788) [`d8a6e3e0d`](https://github.com/medusajs/medusa/commit/d8a6e3e0d8a86aba7209f4a767cd08ebe3e49c26) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa-file-local): local file service streaming methods

### Patch Changes

- [#4771](https://github.com/medusajs/medusa/pull/4771) [`edf9ed4e5`](https://github.com/medusajs/medusa/commit/edf9ed4e593063622aa39cdbebef4810bf2a5fb1) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa-interfaces, medusa-file-\*): add `ìsPrivate` flag to the streaming methods, fix minio default bucket

- [#4842](https://github.com/medusajs/medusa/pull/4842) [`8b860416d`](https://github.com/medusajs/medusa/commit/8b860416d26ce77eb13a643eb616ed6e221d3d66) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa): `PriceListImportStrategy` descriptive error handling

- Updated dependencies [[`c58588904`](https://github.com/medusajs/medusa/commit/c58588904c5631111603b15afacf7cdc4c738cc4)]:
  - medusa-telemetry@0.0.17
  - @medusajs/medusa-cli@1.3.20

## 1.14.0

### Minor Changes

- [`5cf59a5b9`](https://github.com/medusajs/medusa/commit/5cf59a5b9c0ab6323927f14782f03fc1b91547f7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Add minor changeset for @medusajs/medusa

### Patch Changes

- [#4710](https://github.com/medusajs/medusa/pull/4710) [`d1e298f5d`](https://github.com/medusajs/medusa/commit/d1e298f5dcd3eb23c6172cf76025660aac50500f) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Remove FlagRouter from core

- [#4716](https://github.com/medusajs/medusa/pull/4716) [`ac866ebb5`](https://github.com/medusajs/medusa/commit/ac866ebb5197ee694dda91824b501109012a3dd1) Thanks [@adrien2p](https://github.com/adrien2p)! - test(): Test the create product workflow compensation
  fix(orchestration): Fix the transaction state after compensating with no compensation steps in the middle
  chore(workflows): Export and naming
  feat(types): Update product workflow input types
  feat(medusa): Update product workflow usage and cleanup endpoint

- [#4725](https://github.com/medusajs/medusa/pull/4725) [`d8a908bd8`](https://github.com/medusajs/medusa/commit/d8a908bd8ee83cd5ca61b1a8078603eacbab65a9) Thanks [@SimonsThijs](https://github.com/SimonsThijs)! - fix(medusa): removal of shipping methods on addOrUpdateLineItems

- [#4626](https://github.com/medusajs/medusa/pull/4626) [`3f3a84262`](https://github.com/medusajs/medusa/commit/3f3a84262ce9cbd911923278a54e301fbe9a4634) Thanks [@adrien2p](https://github.com/adrien2p)! - [WIP] feat(types, product, utils, medusa): Include shared connection for modules

- [#4761](https://github.com/medusajs/medusa/pull/4761) [`f1a05f472`](https://github.com/medusajs/medusa/commit/f1a05f4725dcc45150f014769562bd3dfbc0f1f8) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin, admin-ui, medusa, medusa-js, medusa-react, stripe-plugin): Support admin extensions

- [#4715](https://github.com/medusajs/medusa/pull/4715) [`a2d7540e4`](https://github.com/medusajs/medusa/commit/a2d7540e40461c138f953865e5374c42842928ac) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Remove shipping on updates to `cart.items`

- [#4751](https://github.com/medusajs/medusa/pull/4751) [`9d8f87b03`](https://github.com/medusajs/medusa/commit/9d8f87b03b62b9145b95aa902f209d49c939bb6a) Thanks [@srindom](https://github.com/srindom)! - fix: ignore region_id update w/o value change

- [#4685](https://github.com/medusajs/medusa/pull/4685) [`281b0746c`](https://github.com/medusajs/medusa/commit/281b0746cfbe80b83c6a67d1ea120b47a0ea7121) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,workflows,types) Create cart workflow

- Updated dependencies [[`8ae31aff4`](https://github.com/medusajs/medusa/commit/8ae31aff4b23c980a2ecc8300a75798c263f0298), [`ac866ebb5`](https://github.com/medusajs/medusa/commit/ac866ebb5197ee694dda91824b501109012a3dd1), [`3f3a84262`](https://github.com/medusajs/medusa/commit/3f3a84262ce9cbd911923278a54e301fbe9a4634), [`30ce35b16`](https://github.com/medusajs/medusa/commit/30ce35b163afa25f4e1d8d1bd392f401a3b413df), [`281b0746c`](https://github.com/medusajs/medusa/commit/281b0746cfbe80b83c6a67d1ea120b47a0ea7121), [`c0ca00290`](https://github.com/medusajs/medusa/commit/c0ca00290106fbdc8e15077bc8d1c3eafbef59f2)]:
  - @medusajs/workflows@0.2.0
  - @medusajs/orchestration@0.2.0
  - @medusajs/modules-sdk@1.9.2
  - @medusajs/utils@1.9.6
  - @medusajs/medusa-cli@1.3.19

## 1.13.1

### Patch Changes

- [#4662](https://github.com/medusajs/medusa/pull/4662) [`fc6c9df03`](https://github.com/medusajs/medusa/commit/fc6c9df03561dd262d00dda2a8426200745eebdb) Thanks [@zhangpengchen](https://github.com/zhangpengchen)! - fix(medusa): Assign metadata when creating a draft order or creating a line item

- [#4630](https://github.com/medusajs/medusa/pull/4630) [`dae34297e`](https://github.com/medusajs/medusa/commit/dae34297ebd405766dcea921dfc290e49aa17713) Thanks [@zhangpengchen](https://github.com/zhangpengchen)! - feat(medusa): Expose commonly used utils isType, validator, cleanResponseData

- [#4696](https://github.com/medusajs/medusa/pull/4696) [`03fb0479c`](https://github.com/medusajs/medusa/commit/03fb0479c0c5389d2569d622b6bec188fcee0ad6) Thanks [@pevey](https://github.com/pevey)! - Feat/allow logging to file

- [#4701](https://github.com/medusajs/medusa/pull/4701) [`5c60aad17`](https://github.com/medusajs/medusa/commit/5c60aad177a99574ffff5ebdc02ce9dc86ef9af9) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa, utils): Allow object feature flags

- [#4636](https://github.com/medusajs/medusa/pull/4636) [`9c682ce28`](https://github.com/medusajs/medusa/commit/9c682ce288072592dad3824a64789f94d7c41dee) Thanks [@pevey](https://github.com/pevey)! - feat(medusa): update request-ip dependency version

- Updated dependencies [[`03fb0479c`](https://github.com/medusajs/medusa/commit/03fb0479c0c5389d2569d622b6bec188fcee0ad6), [`4b80ba8a3`](https://github.com/medusajs/medusa/commit/4b80ba8a356806da3c92634e40e8946da25e35ee), [`8af55aed8`](https://github.com/medusajs/medusa/commit/8af55aed87da7252c7c261175bc98331466a0da8), [`5c60aad17`](https://github.com/medusajs/medusa/commit/5c60aad177a99574ffff5ebdc02ce9dc86ef9af9), [`e78c47b66`](https://github.com/medusajs/medusa/commit/e78c47b66fe99f5d242ca119dea580804a31768c), [`43f34866c`](https://github.com/medusajs/medusa/commit/43f34866c817da43ca2b865fd58e5fc8c3dc891b), [`4073b7313`](https://github.com/medusajs/medusa/commit/4073b73130c874dc7d2240726224a01b7b19b1a1)]:
  - @medusajs/medusa-cli@1.3.18
  - @medusajs/modules-sdk@1.9.1
  - @medusajs/utils@1.9.5
  - @medusajs/workflows@0.1.1

## 1.13.0

### Minor Changes

- [`30e8bb275`](https://github.com/medusajs/medusa/commit/30e8bb2757e07ccb997c508c730a8d8ef8bcc5d1) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Add changeset with minor bump

- [#4553](https://github.com/medusajs/medusa/pull/4553) [`f12299deb`](https://github.com/medusajs/medusa/commit/f12299deb10baadab1505cd4ac353dd5d1c8fa7c) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Medusa workflows package

### Patch Changes

- [#4600](https://github.com/medusajs/medusa/pull/4600) [`9129ca08a`](https://github.com/medusajs/medusa/commit/9129ca08a724f4e0c9e6a69b8bea9c0fb7b0f1b9) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Clean response data should takes the full path of sub relations

- [#4595](https://github.com/medusajs/medusa/pull/4595) [`ae33f4825`](https://github.com/medusajs/medusa/commit/ae33f4825fc1a388813cde72de03a26c41b8b387) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Removing the line items should remove the tax lines as well

- [#4578](https://github.com/medusajs/medusa/pull/4578) [`c9989529e`](https://github.com/medusajs/medusa/commit/c9989529ed8c347fefe10d57b3d23fa60aa35fe7) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): update how price lists are filtered in price selection strategy

- [#4609](https://github.com/medusajs/medusa/pull/4609) [`f18f1b9bf`](https://github.com/medusajs/medusa/commit/f18f1b9bfef897974ba034ce41cd64aa833e4767) Thanks [@zhangpengchen](https://github.com/zhangpengchen)! - feat(medusa): Expose error handler from middlewares

- Updated dependencies [[`131477faf`](https://github.com/medusajs/medusa/commit/131477faf0409c49d4aacf26ea591e33b2fa22fd), [`379c83933`](https://github.com/medusajs/medusa/commit/379c83933ed12a4ec712e7f3c9b0252e4a4601dd), [`f174bb6fa`](https://github.com/medusajs/medusa/commit/f174bb6fa1b105b39065478a67b6be0b968f707a), [`f12299deb`](https://github.com/medusajs/medusa/commit/f12299deb10baadab1505cd4ac353dd5d1c8fa7c)]:
  - @medusajs/utils@1.9.3
  - @medusajs/modules-sdk@1.9.0
  - @medusajs/orchestration@0.1.0

## 1.12.3

### Patch Changes

- [#4459](https://github.com/medusajs/medusa/pull/4459) [`befc2f1c8`](https://github.com/medusajs/medusa/commit/befc2f1c80b6aaeb3a5153f7fdeaa96cf832e46f) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(product): product module create - delete - soft delete - restore - create workflow

- [#4503](https://github.com/medusajs/medusa/pull/4503) [`d184d23c6`](https://github.com/medusajs/medusa/commit/d184d23c6384d5f8bf52827826b62c6bef37f884) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,inventory,types,brightpearl): update some inventory methods to be bulk-operation enabled

- [#4514](https://github.com/medusajs/medusa/pull/4514) [`56d1d326d`](https://github.com/medusajs/medusa/commit/56d1d326d4492626e9297e4cac9b4cb44ae0f165) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): provide correct count of regions

- [#4472](https://github.com/medusajs/medusa/pull/4472) [`43427b889`](https://github.com/medusajs/medusa/commit/43427b8893baedd7abe7b38cf5360aa2d245293d) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Transaction Orchestrator Flow Builder

- [#4230](https://github.com/medusajs/medusa/pull/4230) [`2f283996f`](https://github.com/medusajs/medusa/commit/2f283996f80313b074b96c690bcd953c67665c1b) Thanks [@erikengervall](https://github.com/erikengervall)! - feat(medusa): Add `metadata` to `StorePostCartsCartLineItemsItemReq`

## 1.12.2

### Patch Changes

- [#4410](https://github.com/medusajs/medusa/pull/4410) [`85eb12883`](https://github.com/medusajs/medusa/commit/85eb12883e0571d494687e7a7e2f310c878f721d) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Improve error messaging in plugin loader

- [#4389](https://github.com/medusajs/medusa/pull/4389) [`9dcdc0041`](https://github.com/medusajs/medusa/commit/9dcdc0041a2b08cc0723343dd8d9127d9977b086) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, utils): fix the way selects are consumed alongside the relations

- [#4397](https://github.com/medusajs/medusa/pull/4397) [`01245ac89`](https://github.com/medusajs/medusa/commit/01245ac89e13b687ac346c35168f9f28014e613d) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Allow to register extended validators seemlesly

- [#4420](https://github.com/medusajs/medusa/pull/4420) [`6f1fa244f`](https://github.com/medusajs/medusa/commit/6f1fa244fa47d4ecdaa7363483bd7da555dbbf32) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa-cli): Cleanup plugin setup + include Logger type update which is used across multiple packages

- [#4443](https://github.com/medusajs/medusa/pull/4443) [`bdd9c5a7e`](https://github.com/medusajs/medusa/commit/bdd9c5a7e9a9b1a6b4d1e2dcf22f67540494fedc) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): model loader with customizations

- [#4398](https://github.com/medusajs/medusa/pull/4398) [`9760d4a96`](https://github.com/medusajs/medusa/commit/9760d4a96c27f6f89a8c3f3b6e73b17547f97f2a) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, utils): improve devx for core entity customizations

- [#4442](https://github.com/medusajs/medusa/pull/4442) [`4264302f2`](https://github.com/medusajs/medusa/commit/4264302f214f0717e8b3218a15d43def9122879c) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa, stripe, paypal): Add update payment session support to the abstract payment processor API

- [#4367](https://github.com/medusajs/medusa/pull/4367) [`7bf7d2ade`](https://github.com/medusajs/medusa/commit/7bf7d2adef53b80230a36c22e639b471e501e52e) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Concurrently get the items and count instead of sequentially

- Updated dependencies [[`499c3478c`](https://github.com/medusajs/medusa/commit/499c3478c910c8b922a15cc6f4d9fbad122a347f), [`9dcdc0041`](https://github.com/medusajs/medusa/commit/9dcdc0041a2b08cc0723343dd8d9127d9977b086), [`6f1fa244f`](https://github.com/medusajs/medusa/commit/6f1fa244fa47d4ecdaa7363483bd7da555dbbf32), [`9760d4a96`](https://github.com/medusajs/medusa/commit/9760d4a96c27f6f89a8c3f3b6e73b17547f97f2a)]:
  - @medusajs/utils@1.9.2
  - @medusajs/medusa-cli@1.3.17

## 1.12.1

### Patch Changes

- [#4293](https://github.com/medusajs/medusa/pull/4293) [`2c0074031`](https://github.com/medusajs/medusa/commit/2c0074031be2576e59c8f545b786b4a61a35b802) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): getAvailableContext should first check if the inventory service is present

- [#4338](https://github.com/medusajs/medusa/pull/4338) [`13294fff3`](https://github.com/medusajs/medusa/commit/13294fff3ff334c83a34e054c34204fdd30c4dce) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): medusa develop does not take execArgv into account properly

- [#1860](https://github.com/medusajs/medusa/pull/1860) [`ca477c86a`](https://github.com/medusajs/medusa/commit/ca477c86af38f08c3b9a34147e9145f6a4e84677) Thanks [@liamjcooper](https://github.com/liamjcooper)! - feat(medusa): Preserve node flags in develop command

- [#4115](https://github.com/medusajs/medusa/pull/4115) [`79cca2ab8`](https://github.com/medusajs/medusa/commit/79cca2ab809b77606e65706c19f9fce37b174365) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): add `created_by` as a filter for reservations

- [#4211](https://github.com/medusajs/medusa/pull/4211) [`d76ba0cd2`](https://github.com/medusajs/medusa/commit/d76ba0cd29694c2e31f9f89992a9fbc14659c1ae) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Order edit missing transaction when consuming the inventory module

- [#4294](https://github.com/medusajs/medusa/pull/4294) [`8e708aadd`](https://github.com/medusajs/medusa/commit/8e708aaddf85a78b73d81844812dd8d60fcf99b1) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Remove items.refundable from the order default store fields

- [#4213](https://github.com/medusajs/medusa/pull/4213) [`02b1bd07c`](https://github.com/medusajs/medusa/commit/02b1bd07cd4e6be6348c936431d5e3952cac0f3b) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Query parser issues with large array

- [#4203](https://github.com/medusajs/medusa/pull/4203) [`eadf13cb2`](https://github.com/medusajs/medusa/commit/eadf13cb2101b2b12753428df0fb775f828cd9ac) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): add allowed relation to expand params for product and variant endpoints

- [#4254](https://github.com/medusajs/medusa/pull/4254) [`2db6a1d40`](https://github.com/medusajs/medusa/commit/2db6a1d4076fb84248149d9e1388d3e6ca81ab70) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Improve database loader error handling

- [#4221](https://github.com/medusajs/medusa/pull/4221) [`109096465`](https://github.com/medusajs/medusa/commit/109096465dacdc5879a816a56ef4f2d7a9927e1a) Thanks [@josipmatichr](https://github.com/josipmatichr)! - fix(medusa-fulfillment-manual): Missing retrieveDocuments override

- [#4268](https://github.com/medusajs/medusa/pull/4268) [`81dfeb43e`](https://github.com/medusajs/medusa/commit/81dfeb43ea5aee92771a84c4dbf8d73bc3166522) Thanks [@dwene](https://github.com/dwene)! - feat(medusa): add ability to prefix all redis cache keys in project config

- [#4232](https://github.com/medusajs/medusa/pull/4232) [`af2dc4f75`](https://github.com/medusajs/medusa/commit/af2dc4f75a2ed109495ca83b1bc6ae6941c2f716) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa, inventory, stock-location): Remove unnecessary transaction usage in the modules and list products end points

- [#4192](https://github.com/medusajs/medusa/pull/4192) [`8676ee7a2`](https://github.com/medusajs/medusa/commit/8676ee7a2e3da9fecc2e81db3ab12693d02f63f4) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(medusa,medusa-cli): Added an invite option to the create user command, and allow seeding publishable api keys

- [#4214](https://github.com/medusajs/medusa/pull/4214) [`260dc55b6`](https://github.com/medusajs/medusa/commit/260dc55b6f122351f8e1d75a4b5ca797745735be) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa,medusa-cli): Clean up new command + fix CI

- [#4267](https://github.com/medusajs/medusa/pull/4267) [`f8643361c`](https://github.com/medusajs/medusa/commit/f8643361cdcb549c61e645d4ee275f20883e00d9) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa, admin-ui): remove reservations feature flag

- [#4276](https://github.com/medusajs/medusa/pull/4276) [`afd1b67f1`](https://github.com/medusajs/medusa/commit/afd1b67f1c7de8cf07fd9fcbdde599a37914e9b5) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Use caret range

- Updated dependencies [[`f98ba5bde`](https://github.com/medusajs/medusa/commit/f98ba5bde83ba785eead31b0c9eb9f135d664178), [`14c0f62f8`](https://github.com/medusajs/medusa/commit/14c0f62f84704a4c87beff3daaff60a52f5c88b8), [`8676ee7a2`](https://github.com/medusajs/medusa/commit/8676ee7a2e3da9fecc2e81db3ab12693d02f63f4), [`260dc55b6`](https://github.com/medusajs/medusa/commit/260dc55b6f122351f8e1d75a4b5ca797745735be), [`afd1b67f1`](https://github.com/medusajs/medusa/commit/afd1b67f1c7de8cf07fd9fcbdde599a37914e9b5)]:
  - @medusajs/medusa-cli@1.3.16
  - @medusajs/utils@1.9.1
  - @medusajs/modules-sdk@1.8.8

## 1.12.0

### Minor Changes

- [`81eeaa329`](https://github.com/medusajs/medusa/commit/81eeaa32942b1a7148126a7218ceb168ce8d6cac) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa): Minor bump

### Patch Changes

- [#4154](https://github.com/medusajs/medusa/pull/4154) [`0a35f21af`](https://github.com/medusajs/medusa/commit/0a35f21af7ac8b6cdc1af12a403e95f9bf6142fe) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat(medusa,inventory): search inventory items based on title and description

- [#4066](https://github.com/medusajs/medusa/pull/4066) [`4fb443c0e`](https://github.com/medusajs/medusa/commit/4fb443c0ea38bde3148bce059c0ee3b91dfff3d4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,client-types): add location_id filtering to list-location levels

- [#4071](https://github.com/medusajs/medusa/pull/4071) [`0476f5251`](https://github.com/medusajs/medusa/commit/0476f52519237c622b37d29de0718f9774b6add7) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feaet(medusa): add description to reservation default fields

- [#4184](https://github.com/medusajs/medusa/pull/4184) [`0f87d3d64`](https://github.com/medusajs/medusa/commit/0f87d3d642b56bf19de8136e1f5bfedf364c5193) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa,admin-ui): Add reservations FF

- [#3703](https://github.com/medusajs/medusa/pull/3703) [`ed382f2ee`](https://github.com/medusajs/medusa/commit/ed382f2ee510cbf96164991efa7ff75e3ce659ff) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Improve prices flow

- [#4174](https://github.com/medusajs/medusa/pull/4174) [`92f01cefb`](https://github.com/medusajs/medusa/commit/92f01cefbc4a190defce425fb237d2d68728fa9a) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): fix CSV parsing issues by downgrading the version of the parsing library

- [#3956](https://github.com/medusajs/medusa/pull/3956) [`e3cfbcd4a`](https://github.com/medusajs/medusa/commit/e3cfbcd4a78073c63ecd9829bc531e50d3944f07) Thanks [@dwene](https://github.com/dwene)! - fix(medusa): migrations cli should look for migrations in plugin dist folder

- [#4189](https://github.com/medusajs/medusa/pull/4189) [`6998666c6`](https://github.com/medusajs/medusa/commit/6998666c6edd6617ca61a8d39c26435bad1273e3) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Upserting tax rates

- [#4094](https://github.com/medusajs/medusa/pull/4094) [`e2d29d35c`](https://github.com/medusajs/medusa/commit/e2d29d35c4c477bc9b4a3ddce1279276fd072875) Thanks [@juanzgc](https://github.com/juanzgc)! - feat(plugins): Pass Config Modules to plugin

- [#3979](https://github.com/medusajs/medusa/pull/3979) [`3a38c84f8`](https://github.com/medusajs/medusa/commit/3a38c84f88b05f74ee0a172af3e3f78b2ec8c2d2) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(client-types, inventory, medusa, types): add additional filtering capabilities to list-reservations

- [#4081](https://github.com/medusajs/medusa/pull/4081) [`4f3c8f5d7`](https://github.com/medusajs/medusa/commit/4f3c8f5d70b5ae4a11e9d4a2fea4a8410b2daf47) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,client-types,medusa-js,admin-ui,medusa-react): add reservation table and creation

- [#4026](https://github.com/medusajs/medusa/pull/4026) [`a91987fab`](https://github.com/medusajs/medusa/commit/a91987fab33745f9864eab21bd1c27e8e3e24571) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Remove sqlite support

- [#4130](https://github.com/medusajs/medusa/pull/4130) [`bf18bd0c8`](https://github.com/medusajs/medusa/commit/bf18bd0c8a284dd0042d4c54d84acb2e7c10edd3) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Revert pricing service setVariantPrices API

- [#4146](https://github.com/medusajs/medusa/pull/4146) [`db4199530`](https://github.com/medusajs/medusa/commit/db419953075e0907b8c4d27ab5188e9bd3e3d72b) Thanks [@fPolic](https://github.com/fPolic)! - chore(medusa, utils, inventory, stock-location): clear deps in the utils package

- Updated dependencies [[`3a38c84f8`](https://github.com/medusajs/medusa/commit/3a38c84f88b05f74ee0a172af3e3f78b2ec8c2d2), [`a91987fab`](https://github.com/medusajs/medusa/commit/a91987fab33745f9864eab21bd1c27e8e3e24571), [`e73c3e51c`](https://github.com/medusajs/medusa/commit/e73c3e51c9cd192eeae7a57b24b07bd466214145), [`db4199530`](https://github.com/medusajs/medusa/commit/db419953075e0907b8c4d27ab5188e9bd3e3d72b), [`c0e527d6e`](https://github.com/medusajs/medusa/commit/c0e527d6e0a67d0c53577a0b9c3d16ee8dc5740f)]:
  - @medusajs/types@1.8.7
  - @medusajs/medusa-cli@1.3.15
  - @medusajs/utils@1.9.0
  - @medusajs/modules-sdk@1.8.7

## 1.11.0

### Minor Changes

- [`26963acc0`](https://github.com/medusajs/medusa/commit/26963acc0a5caa1bca97cfe4cbcee113a8d75b84) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor bump @medusajs/medusa

### Patch Changes

- [#4083](https://github.com/medusajs/medusa/pull/4083) [`a66646233`](https://github.com/medusajs/medusa/commit/a666462333d20821a3e50e3fbc65bc8a511c726f) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Cart custom query strategy

- [#4084](https://github.com/medusajs/medusa/pull/4084) [`9518efcca`](https://github.com/medusajs/medusa/commit/9518efccae1961d9b3cd1e85148e293a3744eedb) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Revert product repo to prevent typeorm issues + cleanup and improvements

- [#4073](https://github.com/medusajs/medusa/pull/4073) [`a86f0e815`](https://github.com/medusajs/medusa/commit/a86f0e815a9e75d7d562fbe516c5bb7e0ab1f6ee) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa): Expose `ioredis` options

- [#4046](https://github.com/medusajs/medusa/pull/4046) [`cdbac2c84`](https://github.com/medusajs/medusa/commit/cdbac2c8403a3c15c0e11993f6b7dab268fa5c08) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa, medusa-utils): Add support for multiple where condition on the same column

- Updated dependencies [[`a86f0e815`](https://github.com/medusajs/medusa/commit/a86f0e815a9e75d7d562fbe516c5bb7e0ab1f6ee), [`cdbac2c84`](https://github.com/medusajs/medusa/commit/cdbac2c8403a3c15c0e11993f6b7dab268fa5c08), [`6511959e2`](https://github.com/medusajs/medusa/commit/6511959e23177f3b4831915db0e8e788bc9047fa)]:
  - @medusajs/types@1.8.6
  - @medusajs/utils@1.8.5
  - @medusajs/modules-sdk@1.8.6
  - @medusajs/medusa-cli@1.3.14

## 1.10.1

### Patch Changes

- [#4018](https://github.com/medusajs/medusa/pull/4018) [`3d6bcaaf6`](https://github.com/medusajs/medusa/commit/3d6bcaaf65b3a43dfb251460d73e448870b5105f) Thanks [@patpich](https://github.com/patpich)! - fix(medusa): ShippingOptionService.list method param type

- [#3971](https://github.com/medusajs/medusa/pull/3971) [`7fd22ecb4`](https://github.com/medusajs/medusa/commit/7fd22ecb4d5190e92c6750a9fbf2d8534bb9f4ab) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat(client-types, inventory, medusa, types): add `title`, `thumbnail` and `description to inventory item and `description` to reservation item.

- [#4023](https://github.com/medusajs/medusa/pull/4023) [`bd53adb23`](https://github.com/medusajs/medusa/commit/bd53adb238a64640533698fbccb98a39a0346590) Thanks [@dwene](https://github.com/dwene)! - fix(variant-update): hasChanges function incorrectly calculates if there are changes

- [#4032](https://github.com/medusajs/medusa/pull/4032) [`1ea57c3a6`](https://github.com/medusajs/medusa/commit/1ea57c3a69a5377a8dd0821df819743ded4a222b) Thanks [@pevey](https://github.com/pevey)! - update class-validator to 0.14.0 in utils package

- [#3967](https://github.com/medusajs/medusa/pull/3967) [`0c58ead6d`](https://github.com/medusajs/medusa/commit/0c58ead6d869f5605cbd2b8aca129984b7493bcf) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): validate `customer_id` when completing a cart

- [#4025](https://github.com/medusajs/medusa/pull/4025) [`cff54d732`](https://github.com/medusajs/medusa/commit/cff54d73253a4c2d16a174a28f0f5d31c94bcebd) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa-payment-stripe): Catch on idempotency key retrieve if not found

- [#3842](https://github.com/medusajs/medusa/pull/3842) [`a8e73942e`](https://github.com/medusajs/medusa/commit/a8e73942e69662ca673ccc4300e270ff6ab523d1) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa): handle product categories in import/export strategies

- [#4008](https://github.com/medusajs/medusa/pull/4008) [`ff37cd190`](https://github.com/medusajs/medusa/commit/ff37cd190fa455f4ba4f76cfb4d641b1611cc32e) Thanks [@patpich](https://github.com/patpich)! - fix(search): add missing default product relations

- Updated dependencies [[`7fd22ecb4`](https://github.com/medusajs/medusa/commit/7fd22ecb4d5190e92c6750a9fbf2d8534bb9f4ab), [`1ea57c3a6`](https://github.com/medusajs/medusa/commit/1ea57c3a69a5377a8dd0821df819743ded4a222b)]:
  - @medusajs/types@1.8.5
  - @medusajs/utils@1.8.4
  - @medusajs/modules-sdk@1.8.5
  - @medusajs/medusa-cli@1.3.13

## 1.10.0

### Minor Changes

- [`8b93bae8f`](https://github.com/medusajs/medusa/commit/8b93bae8f8ad1f6eb43931a7ba03bfa691475eca) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa): Minor bump

### Patch Changes

- [#4002](https://github.com/medusajs/medusa/pull/4002) [`0e488e71b`](https://github.com/medusajs/medusa/commit/0e488e71b186f7d08b18c4c6ba409ef3cadb8152) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, event-bus-redis, event-bus-local): Revert retrieveSubscribers as the wildcard prevent us from filtering

- [#3098](https://github.com/medusajs/medusa/pull/3098) [`538c9874b`](https://github.com/medusajs/medusa/commit/538c9874ba18c1352284089a789d4a90652bc795) Thanks [@rajshrimohanks](https://github.com/rajshrimohanks)! - fix(medusa): Fix broken migration in the case of fresh installations

- [#3981](https://github.com/medusajs/medusa/pull/3981) [`d539c6fee`](https://github.com/medusajs/medusa/commit/d539c6feeba8ee431f9a655b6cd4e9102cba2b25) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Bump Typeorm to Medusa fork

- [#3984](https://github.com/medusajs/medusa/pull/3984) [`b7a782639`](https://github.com/medusajs/medusa/commit/b7a7826394ecd621ca80e6d4ce445ea1c26804ac) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Use query relation load strategy on Carts

- [#3921](https://github.com/medusajs/medusa/pull/3921) [`983872319`](https://github.com/medusajs/medusa/commit/98387231927e9872f54c9e72597576f3273de506) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): update query performance for getting product and variant avaiability

- [#4010](https://github.com/medusajs/medusa/pull/4010) [`284f1eed9`](https://github.com/medusajs/medusa/commit/284f1eed9a9fc7272df3fccdb162ea93750999de) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Only set product availability if variants are requested

- [#3926](https://github.com/medusajs/medusa/pull/3926) [`4e8045a0a`](https://github.com/medusajs/medusa/commit/4e8045a0ac44b1541ee3cd846079f55d3e0dc957) Thanks [@riqwan](https://github.com/riqwan)! - fix(medusa): products retrieve uses query strategy for performance

- [#3998](https://github.com/medusajs/medusa/pull/3998) [`d2443d83e`](https://github.com/medusajs/medusa/commit/d2443d83e60fee3c3f28b762d66378c3f07f1b5f) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat(medusa): Add sales_channel_id to create-swap

- Updated dependencies [[`0e488e71b`](https://github.com/medusajs/medusa/commit/0e488e71b186f7d08b18c4c6ba409ef3cadb8152), [`d539c6fee`](https://github.com/medusajs/medusa/commit/d539c6feeba8ee431f9a655b6cd4e9102cba2b25)]:
  - @medusajs/types@1.8.4
  - @medusajs/utils@1.8.3
  - @medusajs/modules-sdk@1.8.4
  - @medusajs/medusa-cli@1.3.12

## 1.9.0

### Minor Changes

- [#3835](https://github.com/medusajs/medusa/pull/3835) [`af710f1b4`](https://github.com/medusajs/medusa/commit/af710f1b48a4545a5064029a557013af34c4c100) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Bulk create variant and pass transaction to the inventory service context methods

### Patch Changes

- [#3884](https://github.com/medusajs/medusa/pull/3884) [`440f900af`](https://github.com/medusajs/medusa/commit/440f900af03dd0af29c9b16f01576d3eff45cd04) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa-plugin-ip-lookup): Remove outdated Typeorm usage

- [#3870](https://github.com/medusajs/medusa/pull/3870) [`366b12fce`](https://github.com/medusajs/medusa/commit/366b12fcea679551c55baaeeaaf41bbddf04b972) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Add missing relations when creating return

- [#3879](https://github.com/medusajs/medusa/pull/3879) [`7e213f210`](https://github.com/medusajs/medusa/commit/7e213f2106ed76449fbdfa6eda5594b59522443a) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa,medusa-fulfillment-webshipper): Add missing variant + product relation on items

- [#3845](https://github.com/medusajs/medusa/pull/3845) [`d2826872f`](https://github.com/medusajs/medusa/commit/d2826872fe487a027b677aeb43704f761a6b4e80) Thanks [@pevey](https://github.com/pevey)! - Bump package versions to address security vulnerabilities

- [#3881](https://github.com/medusajs/medusa/pull/3881) [`0d0e9bf20`](https://github.com/medusajs/medusa/commit/0d0e9bf2069718ac54684efbe4d449942bb2ef32) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(medusa): inventory quantity calculations

- [#3811](https://github.com/medusajs/medusa/pull/3811) [`2be144ff0`](https://github.com/medusajs/medusa/commit/2be144ff05e852a3541a9a972942cfc15ef3bd38) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): add purchasable property

- [#3914](https://github.com/medusajs/medusa/pull/3914) [`935abeae6`](https://github.com/medusajs/medusa/commit/935abeae68012a93d820789c743941c3c1a1b802) Thanks [@riqwan](https://github.com/riqwan)! - fix(medusa): fix category list api bug where limit skews results

- [#3694](https://github.com/medusajs/medusa/pull/3694) [`3a77e8a88`](https://github.com/medusajs/medusa/commit/3a77e8a88fd327aca579bcd09d767d9315a04d7f) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(medusa): Middleware to add default SC on store products query if no SC provided

- [#3905](https://github.com/medusajs/medusa/pull/3905) [`491566df6`](https://github.com/medusajs/medusa/commit/491566df6b7ced35f655f810961422945e10ecd0) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa,utils): Searching indexing product subscriber

- [#3883](https://github.com/medusajs/medusa/pull/3883) [`966ddd2f1`](https://github.com/medusajs/medusa/commit/966ddd2f1648d5d3c1c68094f488f307e3186d92) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(inventory): Minor fixes to upserting inventory items

- [#3909](https://github.com/medusajs/medusa/pull/3909) [`3b3236cc0`](https://github.com/medusajs/medusa/commit/3b3236cc01fc8b7448c1bdbad066a19c2c3de2c3) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Remove discounts.regions relation from cart retrieval

- [#3192](https://github.com/medusajs/medusa/pull/3192) [`4a8562743`](https://github.com/medusajs/medusa/commit/4a8562743569f5bbb7bd0894b025a74725726529) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa-plugin-brightpearl, inventory, medusa): Multiwarehouse integration for brightpearl

- Updated dependencies [[`af710f1b4`](https://github.com/medusajs/medusa/commit/af710f1b48a4545a5064029a557013af34c4c100), [`491566df6`](https://github.com/medusajs/medusa/commit/491566df6b7ced35f655f810961422945e10ecd0)]:
  - @medusajs/types@1.8.3
  - @medusajs/utils@1.8.2
  - @medusajs/modules-sdk@1.8.3
  - @medusajs/medusa-cli@1.3.11

## 1.8.2

### Patch Changes

- [#3829](https://github.com/medusajs/medusa/pull/3829) [`6bb1654b6`](https://github.com/medusajs/medusa/commit/6bb1654b61880f8658bf1395e4ccef860780aac4) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): List products end points

- [#3825](https://github.com/medusajs/medusa/pull/3825) [`95d338262`](https://github.com/medusajs/medusa/commit/95d338262b63e3daa6697bb23806980a8b5e5cdc) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): allow category api to be filtered by handle

- [#3785](https://github.com/medusajs/medusa/pull/3785) [`4f58ddee0`](https://github.com/medusajs/medusa/commit/4f58ddee03509a4c46af160e5824cba80d4c950a) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,utils): add server level configurable http compression

- Updated dependencies [[`4f58ddee0`](https://github.com/medusajs/medusa/commit/4f58ddee03509a4c46af160e5824cba80d4c950a)]:
  - @medusajs/types@1.8.2
  - @medusajs/modules-sdk@1.8.2

## 1.8.1

### Patch Changes

- [#3797](https://github.com/medusajs/medusa/pull/3797) [`78ff64e78`](https://github.com/medusajs/medusa/commit/78ff64e7837f6506c641a3c97ffdfa6ee17419ee) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa); validate customer id when applying a customer group discount

- [#3766](https://github.com/medusajs/medusa/pull/3766) [`1a60c6f58`](https://github.com/medusajs/medusa/commit/1a60c6f58dd80d2d8cb8ee10c186975b39325d13) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Throw upon draft order creation if a variant does not have any prices

- [#3728](https://github.com/medusajs/medusa/pull/3728) [`713d85a92`](https://github.com/medusajs/medusa/commit/713d85a92cf5249e3b75b96f8bf2c25e4f9b0c90) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): migrate SalesChannel / ProductCategory repository

- [#3699](https://github.com/medusajs/medusa/pull/3699) [`914d57336`](https://github.com/medusajs/medusa/commit/914d57336bc8355533d743745989f793ffd4d513) Thanks [@adrien2p](https://github.com/adrien2p)! - chores(medusa): cleanup registrations life time

- [#3724](https://github.com/medusajs/medusa/pull/3724) [`60abb91b7`](https://github.com/medusajs/medusa/commit/60abb91b7c568c6c4cce3b2da7cfb8d54b078299) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Migrate payment repository api

- [#3695](https://github.com/medusajs/medusa/pull/3695) [`089f1eb19`](https://github.com/medusajs/medusa/commit/089f1eb19e2bb43659c5b300fccb8163c1d60b5c) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(tests): harmonize and clean-up yarn test commands convention

- [#3739](https://github.com/medusajs/medusa/pull/3739) [`08f85fa33`](https://github.com/medusajs/medusa/commit/08f85fa33b35e15f944a833e1401c7ba2081d3ec) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): invalidate price selection cache on update

- [#3725](https://github.com/medusajs/medusa/pull/3725) [`282e239df`](https://github.com/medusajs/medusa/commit/282e239dfc0a74f0eb72b17426c8c8bffd86064a) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Migrate price list repository

- [#3738](https://github.com/medusajs/medusa/pull/3738) [`abdb74d99`](https://github.com/medusajs/medusa/commit/abdb74d997f49f994bff49787a396179982843b0) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa, utils): rename buildLegacyFieldsListFrom to objectToStringPath

- [#3726](https://github.com/medusajs/medusa/pull/3726) [`eab2d22f7`](https://github.com/medusajs/medusa/commit/eab2d22f7d22ec53c68398558ffda32d2a734983) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Migrate product tag repository

- [#3739](https://github.com/medusajs/medusa/pull/3739) [`08f85fa33`](https://github.com/medusajs/medusa/commit/08f85fa33b35e15f944a833e1401c7ba2081d3ec) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): align prices formating in the import & export strategies

- [#3704](https://github.com/medusajs/medusa/pull/3704) [`085fedb1f`](https://github.com/medusajs/medusa/commit/085fedb1f7e982859cff3ef3f1d870dce3bcc8b6) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa): Upgrade ioredis-mock

- [#3727](https://github.com/medusajs/medusa/pull/3727) [`4d69d8ef6`](https://github.com/medusajs/medusa/commit/4d69d8ef6aef0a05d0bbb00eed045c2de511be56) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Migrate product type repository

- [#3777](https://github.com/medusajs/medusa/pull/3777) [`7f6dc44be`](https://github.com/medusajs/medusa/commit/7f6dc44beb9789088f6d6b796f7545beb3653094) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Add totals when retrieving order by cart id

- [#3768](https://github.com/medusajs/medusa/pull/3768) [`d533caa4c`](https://github.com/medusajs/medusa/commit/d533caa4c2986c1c9e320cce97423b0cdc213b6c) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, admin-ui): add description field to product categories

- Updated dependencies [[`654a54622`](https://github.com/medusajs/medusa/commit/654a54622303139e7180538bd686630ad9a46cfd), [`abdb74d99`](https://github.com/medusajs/medusa/commit/abdb74d997f49f994bff49787a396179982843b0)]:
  - @medusajs/types@1.8.1
  - @medusajs/utils@1.8.1
  - @medusajs/modules-sdk@1.8.1
  - @medusajs/medusa-cli@1.3.10

## 1.8.0

### Minor Changes

- [#3041](https://github.com/medusajs/medusa/pull/3041) [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): Typeorm fixes / enhancements

  - upgrade typeorm from 0.2.51 to 0.3.11
  - Plugin repository loader to work with Typeorm update

- [#3554](https://github.com/medusajs/medusa/pull/3554) [`5fd74b38a`](https://github.com/medusajs/medusa/commit/5fd74b38ae1b4f7dced191983b78db83f7b1f71b) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): remove reservations if cart completion fails after reservation creation

- [#3257](https://github.com/medusajs/medusa/pull/3257) [`589d1c09b`](https://github.com/medusajs/medusa/commit/589d1c09b085dcaf9667061201ac9deff3047466) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa-payment-stripe): Implement payment processor API on stripe plugin and fix web hook issues

- [#3552](https://github.com/medusajs/medusa/pull/3552) [`0695ff642`](https://github.com/medusajs/medusa/commit/0695ff642b5836e7c28d40118aafe7a769023d5a) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): remove limit of the number of levels to list when joining levels

- [#3172](https://github.com/medusajs/medusa/pull/3172) [`5eb61fa0e`](https://github.com/medusajs/medusa/commit/5eb61fa0ef991b8a9fabb16c2c159e51b9541867) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add inventory management to create-fulfillment flow

- [#3586](https://github.com/medusajs/medusa/pull/3586) [`e359d3f85`](https://github.com/medusajs/medusa/commit/e359d3f85bc12fd3868fc4b563cd994366e899dd) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(medusa): include quantities when listing admin products with an inventory module installed

- [#3544](https://github.com/medusajs/medusa/pull/3544) [`5e405be02`](https://github.com/medusajs/medusa/commit/5e405be02cc94779222dc3d930e747027496d918) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): remove reservations for all old line items when an order edit is accepted

- [#3408](https://github.com/medusajs/medusa/pull/3408) [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Http Server Graceful Shutdown

- [#3329](https://github.com/medusajs/medusa/pull/3329) [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Inventory and Stock location modules supporting isolated connection

- [#2599](https://github.com/medusajs/medusa/pull/2599) [`ef5ef9f5a`](https://github.com/medusajs/medusa/commit/ef5ef9f5a26febf0b64d9981606c1e59999ca76e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa,event-bus-local,event-bus-redis): Event Bus module (Redis + Local)

- [#3187](https://github.com/medusajs/medusa/pull/3187) [`f97b3d7cc`](https://github.com/medusajs/medusa/commit/f97b3d7ccee381d3491337ab5144bb44520382a7) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa, cache-redis, cache-inmemory): Added cache modules

### Patch Changes

- [#3350](https://github.com/medusajs/medusa/pull/3350) [`d6b1ad1cc`](https://github.com/medusajs/medusa/commit/d6b1ad1ccd9a8f91b169f30ff99492cf3adcccac) Thanks [@adrien2p](https://github.com/adrien2p)! - Chores(medusa): draft order create improvement perf (first step)

- [#3345](https://github.com/medusajs/medusa/pull/3345) [`e143a8697`](https://github.com/medusajs/medusa/commit/e143a86976a5cc6a53b7a795e8486df4db1d1c09) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Plugin repository loader to work with Typeorm update

- [#3374](https://github.com/medusajs/medusa/pull/3374) [`84e448968`](https://github.com/medusajs/medusa/commit/84e44896836b2c44017572ac5192ab1cd937048c) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Little improvement in draft order creation

- [#3362](https://github.com/medusajs/medusa/pull/3362) [`33c6ccf05`](https://github.com/medusajs/medusa/commit/33c6ccf0591b8ef527f3b10a70b51e29751b4998) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medeusa): Transform query includes options should only be added to allowed props if there is already at least one allowed props

- [#3676](https://github.com/medusajs/medusa/pull/3676) [`788ddc0f4`](https://github.com/medusajs/medusa/commit/788ddc0f43696df607f07133af15a04b29d5447d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-ui, medusa-react, medusa): Minor fixes to GC domain in admin UI. Also fixes GC update payload type in medusa-react and medusa.

- [#3462](https://github.com/medusajs/medusa/pull/3462) [`30a320364`](https://github.com/medusajs/medusa/commit/30a3203640be9993ba2f8447abfdecc0d3e2f9b6) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): Include location_id in fulfillment body

- [#3391](https://github.com/medusajs/medusa/pull/3391) [`240d0ea7b`](https://github.com/medusajs/medusa/commit/240d0ea7b88ff494d0fe28c7c5348e958c14571f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(ci,oas) move oas ci script to a package under the oas workspace

- [#3087](https://github.com/medusajs/medusa/pull/3087) [`6c0462472`](https://github.com/medusajs/medusa/commit/6c046247275c46d934f03d53471bdd555a19a9ad) Thanks [@fPolic](https://github.com/fPolic)! - chore(feature-flag): Remove PublishableAPIKeys feature flag

- [#3414](https://github.com/medusajs/medusa/pull/3414) [`530740889`](https://github.com/medusajs/medusa/commit/53074088941719ac7ca435e76e3e64ba23fac200) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa-payment-paypal): Migrate to the new payment processor API

- [#3483](https://github.com/medusajs/medusa/pull/3483) [`13f40d721`](https://github.com/medusajs/medusa/commit/13f40d721702fbcdf6c131354ec9a81322d4a662) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-expanded-relations - Admin

- [#3644](https://github.com/medusajs/medusa/pull/3644) [`4342ac884`](https://github.com/medusajs/medusa/commit/4342ac884bc3fe473576ef10d291f3547e0ffc62) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin-ui): Adds metadata forms to all applicable domains in the UI.
  fix(medusa): Fixes an issue where metadata was not being set for order addresses using `setMetadata`.

- [#3435](https://github.com/medusajs/medusa/pull/3435) [`fe9eea4c1`](https://github.com/medusajs/medusa/commit/fe9eea4c18b7e04ba91660716c92b11a49840a3c) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add create-inventory-item endpoint

- [#3670](https://github.com/medusajs/medusa/pull/3670) [`a5ad6c054`](https://github.com/medusajs/medusa/commit/a5ad6c05428e1bb090bbc5a51345a00821781c06) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(admin-ui,medusa): Ensure stock locations are created with a name

- [#3665](https://github.com/medusajs/medusa/pull/3665) [`748833383`](https://github.com/medusajs/medusa/commit/748833383f4bafd05109dac7afa1286fe851cba3) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): draft order adjustments for mw

- [#3686](https://github.com/medusajs/medusa/pull/3686) [`7f87c4f2c`](https://github.com/medusajs/medusa/commit/7f87c4f2c8abb876213a595005e67d770be9cbe4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa-react): Query key invalidation

- [#3705](https://github.com/medusajs/medusa/pull/3705) [`e5a2e9c8d`](https://github.com/medusajs/medusa/commit/e5a2e9c8d237bbe4e3563f5a7a892ca41f01ba24) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): circular loading

- [#3328](https://github.com/medusajs/medusa/pull/3328) [`0a02b70e5`](https://github.com/medusajs/medusa/commit/0a02b70e59cfbd8888fb58c29ee9aaf96eb8099a) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Register reservation endpoints + Fix a type issue for get variant inventory

- [#3685](https://github.com/medusajs/medusa/pull/3685) [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Fix RC package versions

- [#3495](https://github.com/medusajs/medusa/pull/3495) [`fe4b8feb7`](https://github.com/medusajs/medusa/commit/fe4b8feb7e0af2ffc436ca77a769ecb37e16e652) Thanks [@davorbacic](https://github.com/davorbacic)! - feat(medusa): Add event emitter to ProductCollectionService

- [#3352](https://github.com/medusajs/medusa/pull/3352) [`aa690beed`](https://github.com/medusajs/medusa/commit/aa690beed775646cbc86b445fb5dc90dcac087d5) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(medusa): Modules initializer

  ### Loading modules in a project

  Example

  ```typescript
  import {
    InventoryServiceInitializeOptions,
    initialize,
  } from "@medusajs/inventory"

  const options: InventoryServiceInitializeOptions = {
    database: {
      type: "postgres",
      url: DB_URL,
    },
  }

  const inventoryService = await initialize(options)
  const newInventoryItem = await inventoryService.createInventoryItem({
    sku: "sku_123",
  })
  ```

- [#3349](https://github.com/medusajs/medusa/pull/3349) [`f033711ad`](https://github.com/medusajs/medusa/commit/f033711ad649466d72dd9f673d75848c97c0861f) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Add Lifetime support on project/plugin services

- [#3660](https://github.com/medusajs/medusa/pull/3660) [`eed784d7d`](https://github.com/medusajs/medusa/commit/eed784d7d0b58aeddc9f6f5ea56fe80c608b22f5) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui, medusa): resolve bugs for orders with variants without inventory items

- [#3555](https://github.com/medusajs/medusa/pull/3555) [`3171b0e51`](https://github.com/medusajs/medusa/commit/3171b0e518aebcaa31bbe5c6e914d65282873cda) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): if no headerkey is provided when initilizing idempotency key, no attempt is made at fetching the key

- [#3688](https://github.com/medusajs/medusa/pull/3688) [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa-cli): Add missing utils dep

- [#3482](https://github.com/medusajs/medusa/pull/3482) [`522e306e2`](https://github.com/medusajs/medusa/commit/522e306e2e9abf4afce63f30714389eba32bef7f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-expanded-relations - Store

- [#3419](https://github.com/medusajs/medusa/pull/3419) [`80b95a230`](https://github.com/medusajs/medusa/commit/80b95a230056d9ed15f7302f248094f879516faf) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): Resolve on scope instead of req

- [#3324](https://github.com/medusajs/medusa/pull/3324) [`a1e59313c`](https://github.com/medusajs/medusa/commit/a1e59313c964a944a287b54f6654d1d19ac8a59b) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add filtering of stock locations based on sales channels

- [#3460](https://github.com/medusajs/medusa/pull/3460) [`10bf05c14`](https://github.com/medusajs/medusa/commit/10bf05c147cb65a263465129790edd44a6d8948b) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(inventory, medusa): ensure no orphaned reservations and invenotry levels on location removal

- [#3323](https://github.com/medusajs/medusa/pull/3323) [`cbbf3ca05`](https://github.com/medusajs/medusa/commit/cbbf3ca054387a900c5777c2eb0218df2c72bae6) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Clean response data usage for admin and store fields/expand

- [#3436](https://github.com/medusajs/medusa/pull/3436) [`9ba09ba4d`](https://github.com/medusajs/medusa/commit/9ba09ba4d753f132537f0447097fe9f54922c074) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, medusa-js, medusa-react): Add store queries to react medusa

- [#3110](https://github.com/medusajs/medusa/pull/3110) [`12d304307`](https://github.com/medusajs/medusa/commit/12d304307af87ea9287a41869eb33ef09f273d85) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(medusa,medusa-js,medusa-react): Add inventory module endpoints

- [#3622](https://github.com/medusajs/medusa/pull/3622) [`693015fde`](https://github.com/medusajs/medusa/commit/693015fde3218d67fb9c07eebeaea9950bf3f1f1) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa): EOL causing logging to hang

- [#3314](https://github.com/medusajs/medusa/pull/3314) [`287c829c9`](https://github.com/medusajs/medusa/commit/287c829c9c5a9797fb8cd118b7a6066ad1935898) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): include `/admin` and `/store` in paths URLs

- [#3510](https://github.com/medusajs/medusa/pull/3510) [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-plugin-algolia): Revamp Algolia search plugin

- [#3684](https://github.com/medusajs/medusa/pull/3684) [`0cca13779`](https://github.com/medusajs/medusa/commit/0cca13779d0e84683193ad82ab163a10a807e903) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): inventory stocked quantity regulation

- [#3514](https://github.com/medusajs/medusa/pull/3514) [`aed7805c0`](https://github.com/medusajs/medusa/commit/aed7805c0e64b884007148bde90cfce7bee8aad4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): Error messages for reset tokens

- [#3498](https://github.com/medusajs/medusa/pull/3498) [`0d1b63d77`](https://github.com/medusajs/medusa/commit/0d1b63d773ad91846757a6f0b81b78b0b97b3f2b) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): use get instead of indexing into map

- [#3423](https://github.com/medusajs/medusa/pull/3423) [`4042beb10`](https://github.com/medusajs/medusa/commit/4042beb1026b9ad8b381aaa6e1a5214cd92db00f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): add @schema OAS for address request payloads

- [#3653](https://github.com/medusajs/medusa/pull/3653) [`809ab2e0e`](https://github.com/medusajs/medusa/commit/809ab2e0eb2d62054481fa6491d3f7cafbadab4f) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Rounding issues on line item adjustments

- [#2978](https://github.com/medusajs/medusa/pull/2978) [`f43e9f0f2`](https://github.com/medusajs/medusa/commit/f43e9f0f20a8b0637252951b2bdfed4d42fb9f5e) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Load PaymentProcessors

  - Add loading of PaymentProcessors
  - Add PaymentProcessor support in the payment-provider
  - Add backward compatibility for the PaymentService

- [#3344](https://github.com/medusajs/medusa/pull/3344) [`842423679`](https://github.com/medusajs/medusa/commit/8424236799c3789f884285cd3c8a491e91aef2ca) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Update types to reflect actual return-type

- [#3312](https://github.com/medusajs/medusa/pull/3312) [`935870e01`](https://github.com/medusajs/medusa/commit/935870e010af1ec884259b1f1328421e99acc3af) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas): add missing x-codegen + fix schema naming and $ref

- [#3403](https://github.com/medusajs/medusa/pull/3403) [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(medusa): add get-variant endpoint

- [#3395](https://github.com/medusajs/medusa/pull/3395) [`15f47baf5`](https://github.com/medusajs/medusa/commit/15f47baf56e6722b7821cfaa2fb468e582dfa2c1) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui, medusa): Minor ui fixes relating to stock locations

- [#3624](https://github.com/medusajs/medusa/pull/3624) [`999aeb116`](https://github.com/medusajs/medusa/commit/999aeb116c4742e5b5e0d80793af23f7727276f0) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): Fix hanging inventory item migration script

- [#3522](https://github.com/medusajs/medusa/pull/3522) [`55c5fba0d`](https://github.com/medusajs/medusa/commit/55c5fba0d3dbd015c3ffd74d645a8057892d0f52) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,admin): location_ids in swap and claim creation

- [#3282](https://github.com/medusajs/medusa/pull/3282) [`38503fff5`](https://github.com/medusajs/medusa/commit/38503fff56bbceb092e396ac11432a56967b53e9) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): identify required fields in responses - store

- [#3334](https://github.com/medusajs/medusa/pull/3334) [`40de54b01`](https://github.com/medusajs/medusa/commit/40de54b0101bdfd37f577d18c10ec9f1ab1ce8fe) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa,admin,admin-ui): Add new plugin to serve the admin dashboard from the server. Adds a new plugin injection step `setup`, code placed in the `setup` folder of a plugin will be run before any code from a plugin is injected into the Medusa server.

- [#3416](https://github.com/medusajs/medusa/pull/3416) [`478d1af8d`](https://github.com/medusajs/medusa/commit/478d1af8d0df0af16baf4f130e19b0be34f5f295) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, admin-ui, medusa-react): Improvements to product categories

  - Adds name as required in category create form
  - Adds name and handle as required in category edit form
  - Updates message on create/update forms
  - Adds category indicators for is_internal and is_active fields in the tree list
  - Fixes bug where tree is not reset when update fails
  - allow appending all category descendants with a param in list endpoint
  - fix rank order changing on category update
  - invalidate products query on category delete
  - adds category ui for tree/list, edit, create, delete
  - add product category queries and mutations
  - category list API can return all descendant
  - added breadcrumbs for categories on create/edit modal
  - add empty state for product categories
  - increase tree depth + scope categories on store + allow categories relation in products API
  - categories can be ranked based on position
  - seed command can create product categories
  - hide categories in products behind feature flag
  - fixes bug for mpath incorrectly updated for nested categories

- [#3478](https://github.com/medusajs/medusa/pull/3478) [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas,js,react): use AdminExtendedStoresRes instead of AdminStoresRes

- [#3377](https://github.com/medusajs/medusa/pull/3377) [`7e17e0ddc`](https://github.com/medusajs/medusa/commit/7e17e0ddc2e6b2891e9ee1420b04a541899d2a9d) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-plugin-meilisearch): Update + improve Meilisearch plugin

  **What**

  - Bumps `meilisearch` dep to latest major
  - Migrates plugin to TypeScript
  - Changes the way indexes are configured in `medusa-config.js`:

  **Before**

  ```
  {
      resolve: `medusa-plugin-meilisearch`,
      options: {
        config: { host: "...", apiKey: "..." },
        settings: {
          products: {
            searchableAttributes: ["title"],
            displayedAttributes: ["title"],
          },
        },
      },
    },
  ```

  **After**

  ```
  {
      resolve: `medusa-plugin-meilisearch`,
      options: {
        config: { host: "...", apiKey: "..." },
        settings: {
          products: {
            **indexSettings**: {
              searchableAttributes: ["title"],
              displayedAttributes: ["title"],
            },
          },
        },
      },
    },
  ```

  This is done to allow for additional configuration of indexes, that are not necessarily passed on query-time.

  We introduce two new settings:

  ```
  settings: {
    products: {
      indexSettings: {
        searchableAttributes: ["title"],
        displayedAttributes: ["title"],,
      },
      primaryKey: "id"
      transformer: (document) => ({ id: "yo" })
    },
  },
  ```

  Meilisearch changed their primary key inference in the major release. Now we must be explicit when multiple properties end with `id`. Read more in their [docs](https://docs.meilisearch.com/learn/core_concepts/primary_key.html#primary-field).

  The transformer allows developers to specify how their documents are stored in Meilisearch. It is configurable for each index.

- [#3605](https://github.com/medusajs/medusa/pull/3605) [`bca1f80dd`](https://github.com/medusajs/medusa/commit/bca1f80dd501d878455e1ad4f5091cf20ef900ea) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Improved error message if default module is not installed

- [#3534](https://github.com/medusajs/medusa/pull/3534) [`7f2223b65`](https://github.com/medusajs/medusa/commit/7f2223b6507b0a3c452977bfcdee92af2086fa29) Thanks [@riqwan](https://github.com/riqwan)! - fix(medusa): fix bug with parent not being saved correctly

- [#3288](https://github.com/medusajs/medusa/pull/3288) [`7d585f5f8`](https://github.com/medusajs/medusa/commit/7d585f5f84a910c02d274df7a489dc3ff1ea273a) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas): fix paths and fix schema names to match convention

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules

- [#3541](https://github.com/medusajs/medusa/pull/3541) [`feaf8d2e1`](https://github.com/medusajs/medusa/commit/feaf8d2e19715585d154464d003759c3a1f4f322) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa, admin-ui): refine create-fulfillment flow

- [#3451](https://github.com/medusajs/medusa/pull/3451) [`55a1f232a`](https://github.com/medusajs/medusa/commit/55a1f232a3746a22adb1fcd1844b2659077a59f9) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,admin-ui): support location_id in

- [#3411](https://github.com/medusajs/medusa/pull/3411) [`966aea65c`](https://github.com/medusajs/medusa/commit/966aea65c221403bf316ae7665cc8f73bccd9c38) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas-cli): combine admin + store + custom OAS

- [#3278](https://github.com/medusajs/medusa/pull/3278) [`48ad2426a`](https://github.com/medusajs/medusa/commit/48ad2426aa7a604c226132e85ef3da5cce045f45) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): identify required fields in responses - admin
  feat(medusa): Update transaction base service to expose an activeManager\_ getter
  feat(admin-ui): move customs and shipping into manage inventory modal
  Feat(medusa): fulfill swaps and claims with locations
  fix(medusa): Issue when ordering with multiple columns
  fix(medusa): Category seeding result in non null constraint error
  fix(medusa): Account for multiple inventory items when getting inventory
  feat(oas): pluralize OAS tags
  feat(medusa): Improve store list products
  feat(admin-ui): add errors and block receiving returns dependent on existing inventory item levels
  feat(medusa): invalidate price selection caching within update request
  feat(medusa): remove soft delete from categories + adds indexes for categories
- Updated dependencies [[`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724), [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4), [`aa690beed`](https://github.com/medusajs/medusa/commit/aa690beed775646cbc86b445fb5dc90dcac087d5), [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38), [`cd54c7dca`](https://github.com/medusajs/medusa/commit/cd54c7dca9f7444dd2bfa91b4e3e3359dc6658cf), [`55e94d0b4`](https://github.com/medusajs/medusa/commit/55e94d0b45776776639d3970d4264b8f5c5385dd), [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449), [`bd12a9508`](https://github.com/medusajs/medusa/commit/bd12a95083b69a70b83ad38578c5a68738c41b2b), [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73), [`bca1f80dd`](https://github.com/medusajs/medusa/commit/bca1f80dd501d878455e1ad4f5091cf20ef900ea), [`271844aed`](https://github.com/medusajs/medusa/commit/271844aedbe45c369e188b5d06458dbd6984cd39), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def)]:
  - medusa-core-utils@1.2.0
  - medusa-interfaces@1.3.7
  - medusa-test-utils@1.1.40
  - @medusajs/modules-sdk@1.8.0
  - @medusajs/types@1.8.0
  - @medusajs/utils@1.8.0
  - @medusajs/medusa-cli@1.3.9

## 1.8.0-rc.8

### Patch Changes

- [#3713](https://github.com/medusajs/medusa/pull/3713) [`4488ec685`](https://github.com/medusajs/medusa/commit/4488ec68524f95f367cbd352e9e5eb1957d1d0d6) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Category seeding result in non null constraint error

## 1.8.0-rc.7

### Patch Changes

- [#3665](https://github.com/medusajs/medusa/pull/3665) [`748833383`](https://github.com/medusajs/medusa/commit/748833383f4bafd05109dac7afa1286fe851cba3) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): draft order adjustments for mw

- [#3705](https://github.com/medusajs/medusa/pull/3705) [`e5a2e9c8d`](https://github.com/medusajs/medusa/commit/e5a2e9c8d237bbe4e3563f5a7a892ca41f01ba24) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): circular loading

## 1.8.0-rc.6

### Patch Changes

- [#3676](https://github.com/medusajs/medusa/pull/3676) [`788ddc0f4`](https://github.com/medusajs/medusa/commit/788ddc0f43696df607f07133af15a04b29d5447d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-ui, medusa-react, medusa): Minor fixes to GC domain in admin UI. Also fixes GC update payload type in medusa-react and medusa.

- [#3670](https://github.com/medusajs/medusa/pull/3670) [`a5ad6c054`](https://github.com/medusajs/medusa/commit/a5ad6c05428e1bb090bbc5a51345a00821781c06) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(admin-ui,medusa): Ensure stock locations are created with a name

- [#3686](https://github.com/medusajs/medusa/pull/3686) [`7f87c4f2c`](https://github.com/medusajs/medusa/commit/7f87c4f2c8abb876213a595005e67d770be9cbe4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa-react): Query key invalidation

- [#3660](https://github.com/medusajs/medusa/pull/3660) [`eed784d7d`](https://github.com/medusajs/medusa/commit/eed784d7d0b58aeddc9f6f5ea56fe80c608b22f5) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui, medusa): resolve bugs for orders with variants without inventory items

- [#3688](https://github.com/medusajs/medusa/pull/3688) [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa-cli): Add missing utils dep

- [#3684](https://github.com/medusajs/medusa/pull/3684) [`0cca13779`](https://github.com/medusajs/medusa/commit/0cca13779d0e84683193ad82ab163a10a807e903) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): inventory stocked quantity regulation

- Updated dependencies [[`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38), [`bd12a9508`](https://github.com/medusajs/medusa/commit/bd12a95083b69a70b83ad38578c5a68738c41b2b)]:
  - @medusajs/medusa-cli@1.3.9-rc.2
  - @medusajs/utils@0.0.2-rc.2
  - @medusajs/modules-sdk@0.1.0-rc.4

## 1.8.0-rc.5

### Patch Changes

- [#3644](https://github.com/medusajs/medusa/pull/3644) [`4342ac884`](https://github.com/medusajs/medusa/commit/4342ac884bc3fe473576ef10d291f3547e0ffc62) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin-ui): Adds metadata forms to all applicable domains in the UI.
  fix(medusa): Fixes an issue where metadata was not being set for order addresses using `setMetadata`.

- [#3653](https://github.com/medusajs/medusa/pull/3653) [`809ab2e0e`](https://github.com/medusajs/medusa/commit/809ab2e0eb2d62054481fa6491d3f7cafbadab4f) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Rounding issues on line item adjustments

## 1.8.0-rc.4

### Minor Changes

- [#3554](https://github.com/medusajs/medusa/pull/3554) [`5fd74b38a`](https://github.com/medusajs/medusa/commit/5fd74b38ae1b4f7dced191983b78db83f7b1f71b) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): remove reservations if cart completion fails after reservation creation

- [#3544](https://github.com/medusajs/medusa/pull/3544) [`5e405be02`](https://github.com/medusajs/medusa/commit/5e405be02cc94779222dc3d930e747027496d918) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): remove reservations for all old line items when an order edit is accepted

- [#3591](https://github.com/medusajs/medusa/pull/3591) [`a7e3f2d34`](https://github.com/medusajs/medusa/commit/a7e3f2d343c4059ba83022ec5c09f8101b251297) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(admin-ui): move customs and shipping into manage inventory modal

### Patch Changes

- [#3624](https://github.com/medusajs/medusa/pull/3624) [`999aeb116`](https://github.com/medusajs/medusa/commit/999aeb116c4742e5b5e0d80793af23f7727276f0) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): Fix hanging inventory item migration script

## 1.8.0-rc.3

### Minor Changes

- [#3552](https://github.com/medusajs/medusa/pull/3552) [`0695ff642`](https://github.com/medusajs/medusa/commit/0695ff642b5836e7c28d40118aafe7a769023d5a) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): remove limit of the number of levels to list when joining levels

### Patch Changes

- [#3622](https://github.com/medusajs/medusa/pull/3622) [`693015fde`](https://github.com/medusajs/medusa/commit/693015fde3218d67fb9c07eebeaea9950bf3f1f1) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa): EOL causing logging to hang

- Updated dependencies [[`cd54c7dca`](https://github.com/medusajs/medusa/commit/cd54c7dca9f7444dd2bfa91b4e3e3359dc6658cf), [`55e94d0b4`](https://github.com/medusajs/medusa/commit/55e94d0b45776776639d3970d4264b8f5c5385dd)]:
  - @medusajs/medusa-cli@1.3.9-rc.1
  - @medusajs/modules-sdk@0.1.0-rc.3

## 1.8.0-rc.2

### Patch Changes

- chore: Fix RC package versions

- Updated dependencies []:
  - @medusajs/modules-sdk@0.1.0-rc.2
  - @medusajs/types@0.0.2-rc.1
  - @medusajs/utils@0.0.2-rc.1

## 1.8.0-rc.1

### Minor Changes

- [#3586](https://github.com/medusajs/medusa/pull/3586) [`e359d3f85`](https://github.com/medusajs/medusa/commit/e359d3f85bc12fd3868fc4b563cd994366e899dd) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(medusa): include quantities when listing admin products with an inventory module installed

### Patch Changes

- [#3414](https://github.com/medusajs/medusa/pull/3414) [`530740889`](https://github.com/medusajs/medusa/commit/53074088941719ac7ca435e76e3e64ba23fac200) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa-payment-paypal): Migrate to the new payment processor API

- [#3605](https://github.com/medusajs/medusa/pull/3605) [`bca1f80dd`](https://github.com/medusajs/medusa/commit/bca1f80dd501d878455e1ad4f5091cf20ef900ea) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Improved error message if default module is not installed

- [#3589](https://github.com/medusajs/medusa/pull/3589) [`5f41cd9a6`](https://github.com/medusajs/medusa/commit/5f41cd9a67eb0962f999291594c0aac5e38eb916) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): remove soft delete from categories + adds indexes for categories

- [#3553](https://github.com/medusajs/medusa/pull/3553) [`1ce3cc5ae`](https://github.com/medusajs/medusa/commit/1ce3cc5ae4e4cb16eb03be49c9287503f759fc60) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa): invalidate price selection caching within update request

- [#3473](https://github.com/medusajs/medusa/pull/3473) [`332a9b686`](https://github.com/medusajs/medusa/commit/332a9b686bd0d224855215213dd11b4704283f62) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(admin-ui): add errors and block receiving returns dependent on existing inventory item levels

- [#3541](https://github.com/medusajs/medusa/pull/3541) [`feaf8d2e1`](https://github.com/medusajs/medusa/commit/feaf8d2e19715585d154464d003759c3a1f4f322) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa, admin-ui): refine create-fulfillment flow

- Updated dependencies [[`bca1f80dd`](https://github.com/medusajs/medusa/commit/bca1f80dd501d878455e1ad4f5091cf20ef900ea)]:
  - @medusajs/modules-sdk@0.1.0-rc.1

## 1.8.0-rc.0

### Minor Changes

- [#3041](https://github.com/medusajs/medusa/pull/3041) [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): Typeorm fixes / enhancements

  - upgrade typeorm from 0.2.51 to 0.3.11
  - Plugin repository loader to work with Typeorm update

- [#3257](https://github.com/medusajs/medusa/pull/3257) [`589d1c09b`](https://github.com/medusajs/medusa/commit/589d1c09b085dcaf9667061201ac9deff3047466) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa-payment-stripe): Implement payment processor API on stripe plugin and fix web hook issues

- [#3172](https://github.com/medusajs/medusa/pull/3172) [`5eb61fa0e`](https://github.com/medusajs/medusa/commit/5eb61fa0ef991b8a9fabb16c2c159e51b9541867) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add inventory management to create-fulfillment flow

- [#3408](https://github.com/medusajs/medusa/pull/3408) [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Http Server Graceful Shutdown

- [#3329](https://github.com/medusajs/medusa/pull/3329) [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Inventory and Stock location modules supporting isolated connection

- [#2599](https://github.com/medusajs/medusa/pull/2599) [`ef5ef9f5a`](https://github.com/medusajs/medusa/commit/ef5ef9f5a26febf0b64d9981606c1e59999ca76e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa,event-bus-local,event-bus-redis): Event Bus module (Redis + Local)

- [#3187](https://github.com/medusajs/medusa/pull/3187) [`f97b3d7cc`](https://github.com/medusajs/medusa/commit/f97b3d7ccee381d3491337ab5144bb44520382a7) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa, cache-redis, cache-inmemory): Added cache modules

### Patch Changes

- [#3350](https://github.com/medusajs/medusa/pull/3350) [`d6b1ad1cc`](https://github.com/medusajs/medusa/commit/d6b1ad1ccd9a8f91b169f30ff99492cf3adcccac) Thanks [@adrien2p](https://github.com/adrien2p)! - Chores(medusa): draft order create improvement perf (first step)

- [#3345](https://github.com/medusajs/medusa/pull/3345) [`e143a8697`](https://github.com/medusajs/medusa/commit/e143a86976a5cc6a53b7a795e8486df4db1d1c09) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Plugin repository loader to work with Typeorm update

- [#3374](https://github.com/medusajs/medusa/pull/3374) [`84e448968`](https://github.com/medusajs/medusa/commit/84e44896836b2c44017572ac5192ab1cd937048c) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Little improvement in draft order creation

- [#3362](https://github.com/medusajs/medusa/pull/3362) [`33c6ccf05`](https://github.com/medusajs/medusa/commit/33c6ccf0591b8ef527f3b10a70b51e29751b4998) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medeusa): Transform query includes options should only be added to allowed props if there is already at least one allowed props

- [#3462](https://github.com/medusajs/medusa/pull/3462) [`30a320364`](https://github.com/medusajs/medusa/commit/30a3203640be9993ba2f8447abfdecc0d3e2f9b6) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): Include location_id in fulfillment body

- [#3391](https://github.com/medusajs/medusa/pull/3391) [`240d0ea7b`](https://github.com/medusajs/medusa/commit/240d0ea7b88ff494d0fe28c7c5348e958c14571f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(ci,oas) move oas ci script to a package under the oas workspace

- [#3087](https://github.com/medusajs/medusa/pull/3087) [`6c0462472`](https://github.com/medusajs/medusa/commit/6c046247275c46d934f03d53471bdd555a19a9ad) Thanks [@fPolic](https://github.com/fPolic)! - chore(feature-flag): Remove PublishableAPIKeys feature flag

- [#3483](https://github.com/medusajs/medusa/pull/3483) [`13f40d721`](https://github.com/medusajs/medusa/commit/13f40d721702fbcdf6c131354ec9a81322d4a662) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-expanded-relations - Admin

- [#3435](https://github.com/medusajs/medusa/pull/3435) [`fe9eea4c1`](https://github.com/medusajs/medusa/commit/fe9eea4c18b7e04ba91660716c92b11a49840a3c) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add create-inventory-item endpoint

- [#3328](https://github.com/medusajs/medusa/pull/3328) [`0a02b70e5`](https://github.com/medusajs/medusa/commit/0a02b70e59cfbd8888fb58c29ee9aaf96eb8099a) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Register reservation endpoints + Fix a type issue for get variant inventory

- [#3495](https://github.com/medusajs/medusa/pull/3495) [`fe4b8feb7`](https://github.com/medusajs/medusa/commit/fe4b8feb7e0af2ffc436ca77a769ecb37e16e652) Thanks [@davorbacic](https://github.com/davorbacic)! - feat(medusa): Add event emitter to ProductCollectionService

- [#3352](https://github.com/medusajs/medusa/pull/3352) [`aa690beed`](https://github.com/medusajs/medusa/commit/aa690beed775646cbc86b445fb5dc90dcac087d5) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(medusa): Modules initializer

  ### Loading modules in a project

  Example

  ```typescript
  import {
    InventoryServiceInitializeOptions,
    initialize,
  } from "@medusajs/inventory"

  const options: InventoryServiceInitializeOptions = {
    database: {
      type: "postgres",
      url: DB_URL,
    },
  }

  const inventoryService = await initialize(options)
  const newInventoryItem = await inventoryService.createInventoryItem({
    sku: "sku_123",
  })
  ```

- [#3349](https://github.com/medusajs/medusa/pull/3349) [`f033711ad`](https://github.com/medusajs/medusa/commit/f033711ad649466d72dd9f673d75848c97c0861f) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Add Lifetime support on project/plugin services

- [#3555](https://github.com/medusajs/medusa/pull/3555) [`3171b0e51`](https://github.com/medusajs/medusa/commit/3171b0e518aebcaa31bbe5c6e914d65282873cda) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): if no headerkey is provided when initilizing idempotency key, no attempt is made at fetching the key

- [#3482](https://github.com/medusajs/medusa/pull/3482) [`522e306e2`](https://github.com/medusajs/medusa/commit/522e306e2e9abf4afce63f30714389eba32bef7f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-expanded-relations - Store

- [#3419](https://github.com/medusajs/medusa/pull/3419) [`80b95a230`](https://github.com/medusajs/medusa/commit/80b95a230056d9ed15f7302f248094f879516faf) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): Resolve on scope instead of req

- [#3324](https://github.com/medusajs/medusa/pull/3324) [`a1e59313c`](https://github.com/medusajs/medusa/commit/a1e59313c964a944a287b54f6654d1d19ac8a59b) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add filtering of stock locations based on sales channels

- [#3460](https://github.com/medusajs/medusa/pull/3460) [`10bf05c14`](https://github.com/medusajs/medusa/commit/10bf05c147cb65a263465129790edd44a6d8948b) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(inventory, medusa): ensure no orphaned reservations and invenotry levels on location removal

- [#3323](https://github.com/medusajs/medusa/pull/3323) [`cbbf3ca05`](https://github.com/medusajs/medusa/commit/cbbf3ca054387a900c5777c2eb0218df2c72bae6) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Clean response data usage for admin and store fields/expand

- [#3436](https://github.com/medusajs/medusa/pull/3436) [`9ba09ba4d`](https://github.com/medusajs/medusa/commit/9ba09ba4d753f132537f0447097fe9f54922c074) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, medusa-js, medusa-react): Add store queries to react medusa

- [#3110](https://github.com/medusajs/medusa/pull/3110) [`12d304307`](https://github.com/medusajs/medusa/commit/12d304307af87ea9287a41869eb33ef09f273d85) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(medusa,medusa-js,medusa-react): Add inventory module endpoints

- [#3314](https://github.com/medusajs/medusa/pull/3314) [`287c829c9`](https://github.com/medusajs/medusa/commit/287c829c9c5a9797fb8cd118b7a6066ad1935898) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): include `/admin` and `/store` in paths URLs

- [#3510](https://github.com/medusajs/medusa/pull/3510) [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-plugin-algolia): Revamp Algolia search plugin

- [#3514](https://github.com/medusajs/medusa/pull/3514) [`aed7805c0`](https://github.com/medusajs/medusa/commit/aed7805c0e64b884007148bde90cfce7bee8aad4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): Error messages for reset tokens

- [#3498](https://github.com/medusajs/medusa/pull/3498) [`0d1b63d77`](https://github.com/medusajs/medusa/commit/0d1b63d773ad91846757a6f0b81b78b0b97b3f2b) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): use get instead of indexing into map

- [#3423](https://github.com/medusajs/medusa/pull/3423) [`4042beb10`](https://github.com/medusajs/medusa/commit/4042beb1026b9ad8b381aaa6e1a5214cd92db00f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): add @schema OAS for address request payloads

- [#2978](https://github.com/medusajs/medusa/pull/2978) [`f43e9f0f2`](https://github.com/medusajs/medusa/commit/f43e9f0f20a8b0637252951b2bdfed4d42fb9f5e) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Load PaymentProcessors

  - Add loading of PaymentProcessors
  - Add PaymentProcessor support in the payment-provider
  - Add backward compatibility for the PaymentService

- [#3344](https://github.com/medusajs/medusa/pull/3344) [`842423679`](https://github.com/medusajs/medusa/commit/8424236799c3789f884285cd3c8a491e91aef2ca) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Update types to reflect actual return-type

- [#3312](https://github.com/medusajs/medusa/pull/3312) [`935870e01`](https://github.com/medusajs/medusa/commit/935870e010af1ec884259b1f1328421e99acc3af) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas): add missing x-codegen + fix schema naming and $ref

- [#3403](https://github.com/medusajs/medusa/pull/3403) [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(medusa): add get-variant endpoint

- [#3395](https://github.com/medusajs/medusa/pull/3395) [`15f47baf5`](https://github.com/medusajs/medusa/commit/15f47baf56e6722b7821cfaa2fb468e582dfa2c1) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(admin-ui, medusa): Minor ui fixes relating to stock locations

- [#3522](https://github.com/medusajs/medusa/pull/3522) [`55c5fba0d`](https://github.com/medusajs/medusa/commit/55c5fba0d3dbd015c3ffd74d645a8057892d0f52) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,admin): location_ids in swap and claim creation

- [#3282](https://github.com/medusajs/medusa/pull/3282) [`38503fff5`](https://github.com/medusajs/medusa/commit/38503fff56bbceb092e396ac11432a56967b53e9) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): identify required fields in responses - store

- [#3334](https://github.com/medusajs/medusa/pull/3334) [`40de54b01`](https://github.com/medusajs/medusa/commit/40de54b0101bdfd37f577d18c10ec9f1ab1ce8fe) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa,admin,admin-ui): Add new plugin to serve the admin dashboard from the server. Adds a new plugin injection step `setup`, code placed in the `setup` folder of a plugin will be run before any code from a plugin is injected into the Medusa server.

- [#3416](https://github.com/medusajs/medusa/pull/3416) [`478d1af8d`](https://github.com/medusajs/medusa/commit/478d1af8d0df0af16baf4f130e19b0be34f5f295) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, admin-ui, medusa-react): Improvements to product categories

  - Adds name as required in category create form
  - Adds name and handle as required in category edit form
  - Updates message on create/update forms
  - Adds category indicators for is_internal and is_active fields in the tree list
  - Fixes bug where tree is not reset when update fails
  - allow appending all category descendants with a param in list endpoint
  - fix rank order changing on category update
  - invalidate products query on category delete
  - adds category ui for tree/list, edit, create, delete
  - add product category queries and mutations
  - category list API can return all descendant
  - added breadcrumbs for categories on create/edit modal
  - add empty state for product categories
  - increase tree depth + scope categories on store + allow categories relation in products API
  - categories can be ranked based on position
  - seed command can create product categories
  - hide categories in products behind feature flag
  - fixes bug for mpath incorrectly updated for nested categories

- [#3478](https://github.com/medusajs/medusa/pull/3478) [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas,js,react): use AdminExtendedStoresRes instead of AdminStoresRes

- [#3377](https://github.com/medusajs/medusa/pull/3377) [`7e17e0ddc`](https://github.com/medusajs/medusa/commit/7e17e0ddc2e6b2891e9ee1420b04a541899d2a9d) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-plugin-meilisearch): Update + improve Meilisearch plugin

  **What**

  - Bumps `meilisearch` dep to latest major
  - Migrates plugin to TypeScript
  - Changes the way indexes are configured in `medusa-config.js`:

  **Before**

  ```
  {
      resolve: `medusa-plugin-meilisearch`,
      options: {
        config: { host: "...", apiKey: "..." },
        settings: {
          products: {
            searchableAttributes: ["title"],
            displayedAttributes: ["title"],
          },
        },
      },
    },
  ```

  **After**

  ```
  {
      resolve: `medusa-plugin-meilisearch`,
      options: {
        config: { host: "...", apiKey: "..." },
        settings: {
          products: {
            **indexSettings**: {
              searchableAttributes: ["title"],
              displayedAttributes: ["title"],
            },
          },
        },
      },
    },
  ```

  This is done to allow for additional configuration of indexes, that are not necessarily passed on query-time.

  We introduce two new settings:

  ```
  settings: {
    products: {
      indexSettings: {
        searchableAttributes: ["title"],
        displayedAttributes: ["title"],,
      },
      primaryKey: "id"
      transformer: (document) => ({ id: "yo" })
    },
  },
  ```

  Meilisearch changed their primary key inference in the major release. Now we must be explicit when multiple properties end with `id`. Read more in their [docs](https://docs.meilisearch.com/learn/core_concepts/primary_key.html#primary-field).

  The transformer allows developers to specify how their documents are stored in Meilisearch. It is configurable for each index.

- [#3534](https://github.com/medusajs/medusa/pull/3534) [`7f2223b65`](https://github.com/medusajs/medusa/commit/7f2223b6507b0a3c452977bfcdee92af2086fa29) Thanks [@riqwan](https://github.com/riqwan)! - fix(medusa): fix bug with parent not being saved correctly

- [#3288](https://github.com/medusajs/medusa/pull/3288) [`7d585f5f8`](https://github.com/medusajs/medusa/commit/7d585f5f84a910c02d274df7a489dc3ff1ea273a) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas): fix paths and fix schema names to match convention

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules

- [#3252](https://github.com/medusajs/medusa/pull/3252) [`46547f29c`](https://github.com/medusajs/medusa/commit/46547f29c755719e22d2977c5e5f8ab8a4a7fcae) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Improve store list products

- [#3315](https://github.com/medusajs/medusa/pull/3315) [`f3bf351d2`](https://github.com/medusajs/medusa/commit/f3bf351d21d1c2a67ed2d603c8b7ed4ae5cbd366) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): pluralize OAS tags

- [#3094](https://github.com/medusajs/medusa/pull/3094) [`d61d6c7b7`](https://github.com/medusajs/medusa/commit/d61d6c7b7f8549996090f5315597d22d2af968f9) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): Account for multiple inventory items when getting inventory

- [#3451](https://github.com/medusajs/medusa/pull/3451) [`55a1f232a`](https://github.com/medusajs/medusa/commit/55a1f232a3746a22adb1fcd1844b2659077a59f9) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,admin-ui): support location_id in

- [#3385](https://github.com/medusajs/medusa/pull/3385) [`53eda215e`](https://github.com/medusajs/medusa/commit/53eda215e00509eb63e571f1b38b9c8884b8e6d5) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Issue when ordering with multiple columns

- [#3518](https://github.com/medusajs/medusa/pull/3518) [`026bdab05`](https://github.com/medusajs/medusa/commit/026bdab05d4da054d3ffd07b8cce8ccb1bded95d) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat(medusa): fulfill swaps and claims with locations

- [#3256](https://github.com/medusajs/medusa/pull/3256) [`aefe5aa13`](https://github.com/medusajs/medusa/commit/aefe5aa133ea3ab98eb3c1ecd0ba51fb76c173de) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Update transaction base service to expose an activeManager\_ getter

- [#3411](https://github.com/medusajs/medusa/pull/3411) [`966aea65c`](https://github.com/medusajs/medusa/commit/966aea65c221403bf316ae7665cc8f73bccd9c38) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas-cli): combine admin + store + custom OAS

- [#3278](https://github.com/medusajs/medusa/pull/3278) [`48ad2426a`](https://github.com/medusajs/medusa/commit/48ad2426aa7a604c226132e85ef3da5cce045f45) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): identify required fields in responses - admin

- Updated dependencies [[`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724), [`aa690beed`](https://github.com/medusajs/medusa/commit/aa690beed775646cbc86b445fb5dc90dcac087d5), [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449), [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73), [`271844aed`](https://github.com/medusajs/medusa/commit/271844aedbe45c369e188b5d06458dbd6984cd39), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def)]:
  - medusa-core-utils@1.2.0-rc.0
  - medusa-interfaces@1.3.7-rc.0
  - medusa-test-utils@1.1.40-rc.0
  - @medusajs/types@0.0.2-rc.0
  - @medusajs/utils@0.0.2-rc.0
  - @medusajs/modules-sdk@0.1.0-rc.0
  - @medusajs/medusa-cli@1.3.9-rc.0

## 1.7.15

### Patch Changes

- [#3539](https://github.com/medusajs/medusa/pull/3539) [`98fe8fd00`](https://github.com/medusajs/medusa/commit/98fe8fd00a1912fde1d2a93b434bda500a213c14) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix(medusa): Variant update should include the id for the listeners to be able to identify the entity

- [#3491](https://github.com/medusajs/medusa/pull/3491) [`2869763ea`](https://github.com/medusajs/medusa/commit/2869763ea9673cf5c5a3aa10b58f61b8e830ce21) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Fix eventBus.emit using redis mock

## 1.7.14

### Patch Changes

- [`902ed3c0b`](https://github.com/medusajs/medusa/commit/902ed3c0b21cd525d9975e59b7a8120ae5f7a895) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Issue with fixed total discount with tax-inclusive pricing enabled

- [#3417](https://github.com/medusajs/medusa/pull/3417) [`fa4049cb5`](https://github.com/medusajs/medusa/commit/fa4049cb51232b2ed7091b1322c3fc14cd23e451) Thanks [@adrien2p](https://github.com/adrien2p)! - chores(medusa): Refactoring product update flow to improve handling and performances

- Updated dependencies [[`fa4049cb5`](https://github.com/medusajs/medusa/commit/fa4049cb51232b2ed7091b1322c3fc14cd23e451)]:
  - medusa-test-utils@1.1.40

## 1.7.13

### Patch Changes

- [#3431](https://github.com/medusajs/medusa/pull/3431) [`601d20e7a`](https://github.com/medusajs/medusa/commit/601d20e7ab293728cd81f0723805841016812120) Thanks [@adrien2p](https://github.com/adrien2p)! - chores(medusa): Improve draft order creation perf flow

- [#3407](https://github.com/medusajs/medusa/pull/3407) [`f0a1355fe`](https://github.com/medusajs/medusa/commit/f0a1355feb5160ff7de1f3d3da769efe29d0d8ed) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Bulk emit events

- Updated dependencies [[`f0a1355fe`](https://github.com/medusajs/medusa/commit/f0a1355feb5160ff7de1f3d3da769efe29d0d8ed)]:
  - medusa-test-utils@1.1.39

## 1.7.12

### Patch Changes

- [#3394](https://github.com/medusajs/medusa/pull/3394) [`ce577f269`](https://github.com/medusajs/medusa/commit/ce577f2696aa2181bef8f3096b1a639feabe2714) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Add global job options for events

- [#3388](https://github.com/medusajs/medusa/pull/3388) [`aa0d1f321`](https://github.com/medusajs/medusa/commit/aa0d1f32153f82c6219efe5cfc08862db5e5a129) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Remove default job age option from EventBus

- [#3384](https://github.com/medusajs/medusa/pull/3384) [`9f508c8bd`](https://github.com/medusajs/medusa/commit/9f508c8bd8bee63677504cc8b86f1643579945d8) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(medusa): Column naming on migrations

## 1.7.11

### Patch Changes

- [#3357](https://github.com/medusajs/medusa/pull/3357) [`c43248131`](https://github.com/medusajs/medusa/commit/c432481319cc205938081c3fcf60e75053b659ca) Thanks [@riqwan](https://github.com/riqwan)! - fix(medusa): fix error on creating product without FF sales channel

## 1.7.10

### Patch Changes

- [#3346](https://github.com/medusajs/medusa/pull/3346) [`b458615ed`](https://github.com/medusajs/medusa/commit/b458615ed50a7c637e9e77f29f21c7ab300ed5d8) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix(medusa): All payment sessions should be removed if cart total reach 0

- [#3351](https://github.com/medusajs/medusa/pull/3351) [`4b114cc41`](https://github.com/medusajs/medusa/commit/4b114cc4191ba20832b66072ec82386b22a3533c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Use Bull `jobId` option to identify duplicates

## 1.7.9

### Patch Changes

- [#3335](https://github.com/medusajs/medusa/pull/3335) [`370bd472e`](https://github.com/medusajs/medusa/commit/370bd472ed8c9038f66defd012a886e0f83c32cf) Thanks [@pepijn-vanvlaanderen](https://github.com/pepijn-vanvlaanderen)! - fix(medusa): Fix regression in job scheduler service

## 1.7.8

### Patch Changes

- [#3285](https://github.com/medusajs/medusa/pull/3285) [`9690f07bc`](https://github.com/medusajs/medusa/commit/9690f07bc062c85fcf8b7f0f35a162b930944183) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas): patch circular references in docs

- [#3298](https://github.com/medusajs/medusa/pull/3298) [`5301a1e9d`](https://github.com/medusajs/medusa/commit/5301a1e9d632ddac94e7864fecfdc860a4c2a66d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Remove payment service deprecation temporarely

- [#3276](https://github.com/medusajs/medusa/pull/3276) [`d11ab924b`](https://github.com/medusajs/medusa/commit/d11ab924b88211bc18ed019ca300f6d452972167) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Configurable returnable_items on order decorate totals

- [#3267](https://github.com/medusajs/medusa/pull/3267) [`f88af0c28`](https://github.com/medusajs/medusa/commit/f88af0c28d3fa574cdeea3694607d4df563cb88d) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Received quantity on return lines

## 1.7.7

### Patch Changes

- [#3210](https://github.com/medusajs/medusa/pull/3210) [`507ad00be`](https://github.com/medusajs/medusa/commit/507ad00bec74bb63b17eae8a4a3313eb6e0d2503) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas) - accurate model OAS representation - F to O

- [#3222](https://github.com/medusajs/medusa/pull/3222) [`6e443dc70`](https://github.com/medusajs/medusa/commit/6e443dc708ffe20bf96d45ddc207ed274c28e344) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Improve addShippingMethod on store cart route to use new totals calculation algo

- [#3220](https://github.com/medusajs/medusa/pull/3220) [`eee928381`](https://github.com/medusajs/medusa/commit/eee9283818b1717f37f084c319201ea7144fdf8a) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Allow empty fields/expand

- [#3244](https://github.com/medusajs/medusa/pull/3244) [`4cb44a3a2`](https://github.com/medusajs/medusa/commit/4cb44a3a2ec5bcf3d90e3b6a0e1f6bb9ff45e2b6) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Discount allocation precision issues

- [#3224](https://github.com/medusajs/medusa/pull/3224) [`472f96d7f`](https://github.com/medusajs/medusa/commit/472f96d7fb8668a15df6e6f9ea31291891b3e688) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Missing refund amount when creating claim

- [#3219](https://github.com/medusajs/medusa/pull/3219) [`61b0b2f3a`](https://github.com/medusajs/medusa/commit/61b0b2f3aa1d54d539b216a99032549485136a82) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): use transformer middleware config when querying store products and store orders endpoints

- [#3249](https://github.com/medusajs/medusa/pull/3249) [`80452332d`](https://github.com/medusajs/medusa/commit/80452332d852ad7d33d74e1f08f12f45d7a35503) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(medusa): default sales channel on product create

- [#3246](https://github.com/medusajs/medusa/pull/3246) [`bbbb3d888`](https://github.com/medusajs/medusa/commit/bbbb3d888292391976355c88ecb0fcf8a7c115bc) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Get cart missing transaction on update

- [#3254](https://github.com/medusajs/medusa/pull/3254) [`10ff72c30`](https://github.com/medusajs/medusa/commit/10ff72c30ae59d2174d876b0c4141aad135d9a1c) Thanks [@josetr](https://github.com/josetr)! - fix(medusa): Add missing scoped transaction on update currency endpoint

- [#3237](https://github.com/medusajs/medusa/pull/3237) [`968eb8fc6`](https://github.com/medusajs/medusa/commit/968eb8fc6b7ccd7221f88f42d75717f3a0547861) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Refund amount on returns in claim flow

- [#3223](https://github.com/medusajs/medusa/pull/3223) [`a59bd84e4`](https://github.com/medusajs/medusa/commit/a59bd84e41fb5d8fc2edc7bdc43d3cbf74d9d7dc) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas) - accurate model OAS representation - PA to PU

- [#3217](https://github.com/medusajs/medusa/pull/3217) [`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Fix npm packages files included

- [#3250](https://github.com/medusajs/medusa/pull/3250) [`cac13a88d`](https://github.com/medusajs/medusa/commit/cac13a88da42fa986bd7352fbc12a318b566d98f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas) - accurate model OAS representation - R to U

- [#3247](https://github.com/medusajs/medusa/pull/3247) [`a2cc084db`](https://github.com/medusajs/medusa/commit/a2cc084db817f8f7699e9b0daceda274b5f0e0c0) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Generate adjustment missing transaction on calculateDiscountForLineItem

- [#3238](https://github.com/medusajs/medusa/pull/3238) [`8194d19b0`](https://github.com/medusajs/medusa/commit/8194d19b0e933310fdc65af25300da5dd185e669) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa-plugin-sendgrid): Undefined order

- Updated dependencies [[`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0)]:
  - @medusajs/medusa-cli@1.3.8
  - medusa-core-utils@1.1.39
  - medusa-interfaces@1.3.6

## 1.7.6

### Patch Changes

- [#3011](https://github.com/medusajs/medusa/pull/3011) [`ce866475b`](https://github.com/medusajs/medusa/commit/ce866475b4b6c8b453638000f7b1df7a27daf45d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(_-payment-_): cleanup payment provider plugins

- [#3198](https://github.com/medusajs/medusa/pull/3198) [`53532df8d`](https://github.com/medusajs/medusa/commit/53532df8d597ed5471c07296981b6959cba4ddc3) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(OAS): sanitize circular reference for Redocly

- [#2599](https://github.com/medusajs/medusa/pull/2599) [`d8ffbe25b`](https://github.com/medusajs/medusa/commit/d8ffbe25b047fda0f644240c9f518f95e74f03cb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(oas): declare x-codegen on Admin routes - S to V

- [#3065](https://github.com/medusajs/medusa/pull/3065) [`2d525237b`](https://github.com/medusajs/medusa/commit/2d525237b682e89495b6cc8e3aa677bfad4d0726) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Fix (stock-location): stock location address required

- [#3085](https://github.com/medusajs/medusa/pull/3085) [`5b63533c7`](https://github.com/medusajs/medusa/commit/5b63533c77528cab31755cedab9e768f7461f373) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa): preserve custom adjustments when refreshing adjustments

- [#3090](https://github.com/medusajs/medusa/pull/3090) [`09dc9c667`](https://github.com/medusajs/medusa/commit/09dc9c6677c0d64cf765b27290e707ea75edd4aa) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-codegen on Admin routes - A to D

- [#3155](https://github.com/medusajs/medusa/pull/3155) [`4105405f2`](https://github.com/medusajs/medusa/commit/4105405f28c3f3e54a6077c95a575a268fb5569f) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): Filter products by category params in store/admin

- [#3114](https://github.com/medusajs/medusa/pull/3114) [`ee42b60a2`](https://github.com/medusajs/medusa/commit/ee42b60a20db2afc5e9b6b958502f9e86ec37d80) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): add or remove categories from products

- [#3154](https://github.com/medusajs/medusa/pull/3154) [`d0adaf57e`](https://github.com/medusajs/medusa/commit/d0adaf57ed1018f29bebf01e5cffde5f7192f89f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Fixes payloads associated with shipping profile requests, as well as fixes to the shippingProfileService. Also adds test suite for shipping profiles.

- [#2971](https://github.com/medusajs/medusa/pull/2971) [`f65f590a2`](https://github.com/medusajs/medusa/commit/f65f590a2771d6e526d7dfc7ca721be74c8f79a9) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Adding inventory items api

- [#3141](https://github.com/medusajs/medusa/pull/3141) [`5ec6d438f`](https://github.com/medusajs/medusa/commit/5ec6d438fb1f909be925461c788f3a3a958528e4) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): batch remove products from a category

- [#2989](https://github.com/medusajs/medusa/pull/2989) [`5c1d2a5e8`](https://github.com/medusajs/medusa/commit/5c1d2a5e83c3654ae468d17c900892c32ef76060) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Option to override existing cron job

- [#3092](https://github.com/medusajs/medusa/pull/3092) [`8e41c6996`](https://github.com/medusajs/medusa/commit/8e41c6996601142661bde877b9ee1d80b8325f5f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-codegen on Admin routes - D to PRI

- [#3097](https://github.com/medusajs/medusa/pull/3097) [`d50db84a3`](https://github.com/medusajs/medusa/commit/d50db84a336da2de9c06a59aa79f2a5e9aa558f1) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - ProductService.update no longer create product variants. It was moved to the endpoint handler update-product.ts

- [#3046](https://github.com/medusajs/medusa/pull/3046) [`82da3605f`](https://github.com/medusajs/medusa/commit/82da3605fb50cef182699900552109ad654f0df2) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa-payment-stripe): Avoid unnecessary customer update if the stripe id already exists

- [#3153](https://github.com/medusajs/medusa/pull/3153) [`b242e2232`](https://github.com/medusajs/medusa/commit/b242e22326ce74d5437d0da6863f22facbb5964c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Upsert addresses on Orders

- [#3184](https://github.com/medusajs/medusa/pull/3184) [`4339d47e1`](https://github.com/medusajs/medusa/commit/4339d47e1f6c9f6c8f100b3ac72c8a394b6dd44d) Thanks [@pevey](https://github.com/pevey)! - feat(medusa): Include `rolling` in session options config with default of false

- [#3083](https://github.com/medusajs/medusa/pull/3083) [`2e7e16b91`](https://github.com/medusajs/medusa/commit/2e7e16b9173e2779946776b9b07ce7232c683f36) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): Added models + repo for products in multiple categories

- [#3162](https://github.com/medusajs/medusa/pull/3162) [`9ebb50104`](https://github.com/medusajs/medusa/commit/9ebb50104cc1f6c8ef1cea446ae595fb2eb532a2) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Expose session options

- [#3185](https://github.com/medusajs/medusa/pull/3185) [`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Patches all dependencies + minor bumps `winston` to include a [fix for a significant memory leak](https://github.com/winstonjs/winston/pull/2057)

- [#2980](https://github.com/medusajs/medusa/pull/2980) [`e22a383f4`](https://github.com/medusajs/medusa/commit/e22a383f4738e8bc80394ccaba3ac9a4ae678955) Thanks [@fPolic](https://github.com/fPolic)! - fix(medusa): `fields` param in store products/orders endpoints

- [#2040](https://github.com/medusajs/medusa/pull/2040) [`dc156861d`](https://github.com/medusajs/medusa/commit/dc156861d413ecfe3fd264bcd5ad736d83d8a08e) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): ShippingOption type on `listAndCount`

- [#2970](https://github.com/medusajs/medusa/pull/2970) [`8f4c84121`](https://github.com/medusajs/medusa/commit/8f4c84121bd9b8c7067d72f03125e13afe4d2571) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat(medusa): Add multi warehouse to create-variant and add list-inventory for variant endpoints

- [#3197](https://github.com/medusajs/medusa/pull/3197) [`bfa33f444`](https://github.com/medusajs/medusa/commit/bfa33f444cd225906149777c5c6e842685f3dd7c) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Applying Discounts (with Conditions) on DraftOrders and Carts

- [#3109](https://github.com/medusajs/medusa/pull/3109) [`f776ed234`](https://github.com/medusajs/medusa/commit/f776ed234fcfccf23041ffebecbae6c9a8b7e922) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(medusa): Run shared module migrations

- [#3108](https://github.com/medusajs/medusa/pull/3108) [`4d6e63d68`](https://github.com/medusajs/medusa/commit/4d6e63d68f4e64c365ecbba133876d95e6528763) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa): decorate order edit line items with totals

- [#3055](https://github.com/medusajs/medusa/pull/3055) [`fcba70570`](https://github.com/medusajs/medusa/commit/fcba705701b8013183fafb39e8dda4a85718080a) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Allow users to unset metadata fields in updates.

- [#3123](https://github.com/medusajs/medusa/pull/3123) [`4f0d8992a`](https://github.com/medusajs/medusa/commit/4f0d8992a091a05e93dd5be3762dfa47f074610e) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): Products can be added to categories in batch request

- [#3093](https://github.com/medusajs/medusa/pull/3093) [`d25a53104`](https://github.com/medusajs/medusa/commit/d25a531045143d3be68d3cd3b5764bbbc792ee3a) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas): declare x-codegen on Admin routes - PRO to R

- [#3152](https://github.com/medusajs/medusa/pull/3152) [`86c87c7b1`](https://github.com/medusajs/medusa/commit/86c87c7b1020ab6bb02f931e1ee113f2857cf527) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): findVariantPricesNotIn now finds obsolete prices to delete

- [#3186](https://github.com/medusajs/medusa/pull/3186) [`78650ea66`](https://github.com/medusajs/medusa/commit/78650ea66517b0a77100228615d8122f84ad235b) Thanks [@pevey](https://github.com/pevey)! - feat(medusa): Include `name` in session options

- [#3205](https://github.com/medusajs/medusa/pull/3205) [`b9bda3bf4`](https://github.com/medusajs/medusa/commit/b9bda3bf4e0f95675041085cea5008268c37edd5) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Allows passing data object on shipping methods during claim creation and updates

- [#3126](https://github.com/medusajs/medusa/pull/3126) [`e581d3bd9`](https://github.com/medusajs/medusa/commit/e581d3bd90f9bc40105e7eaf34e0c94d4f657f7a) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: fix flaky tests

- [#3203](https://github.com/medusajs/medusa/pull/3203) [`4d3210bfb`](https://github.com/medusajs/medusa/commit/4d3210bfbb84877d951f7319d2e87c1acbdd6aad) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(oas) - accurate model OAS representation - A to D

- Updated dependencies [[`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4)]:
  - @medusajs/medusa-cli@1.3.7
  - medusa-core-utils@1.1.38
  - medusa-interfaces@1.3.5

## 1.7.5

### Patch Changes

- [#3069](https://github.com/medusajs/medusa/pull/3069) [`9c2169422`](https://github.com/medusajs/medusa/commit/9c2169422dd51be727118fa4830dadc58c24568a) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Only add SC relation when enabled

- [#3067](https://github.com/medusajs/medusa/pull/3067) [`9427bc7f2`](https://github.com/medusajs/medusa/commit/9427bc7f256c563befe3035bc3d67380066f304b) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Move migration to correct folder

## 1.7.4

### Patch Changes

- [#2997](https://github.com/medusajs/medusa/pull/2997) [`9dbccd9ca`](https://github.com/medusajs/medusa/commit/9dbccd9ca78b8b66f9a21947bb863622e7ff326b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(medusa, stock-location, inventory): Allow modules to integrate with core

- [#3043](https://github.com/medusajs/medusa/pull/3043) [`542daeead`](https://github.com/medusajs/medusa/commit/542daeeadd78d939f5144c690e8907374da6d085) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - chore(oas): replace response with $ref class JSDoc (Store A-PAY)

- [#3027](https://github.com/medusajs/medusa/pull/3027) [`8c08d0031`](https://github.com/medusajs/medusa/commit/8c08d003198b94c00f8428a51c0e79d2ca9d1dc7) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Legacy total service should accept custom items

- [#2861](https://github.com/medusajs/medusa/pull/2861) [`017538883`](https://github.com/medusajs/medusa/commit/017538883588792e1ff37abcab0fd2872c9af932) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(medusa): Transaction Orchestrator

- [#3004](https://github.com/medusajs/medusa/pull/3004) [`b2839e2e4`](https://github.com/medusajs/medusa/commit/b2839e2e4dc0d9344fa2ac8d4d16b796def4c56d) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): create a store endpoint to retrieve a product category

- [#3040](https://github.com/medusajs/medusa/pull/3040) [`76d175231`](https://github.com/medusajs/medusa/commit/76d17523105d3860028a90a45b6038a64040e5ce) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix inventory adjustments

- [#3006](https://github.com/medusajs/medusa/pull/3006) [`9e3beaf53`](https://github.com/medusajs/medusa/commit/9e3beaf5319dc785cf84b856cfcc8193df90c3a4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(feature-flags): Remove OrderEditing feature flag

- [#3023](https://github.com/medusajs/medusa/pull/3023) [`7d4b8b9cc`](https://github.com/medusajs/medusa/commit/7d4b8b9cc59672d01cdf0c6f331bc3d1eeec9bee) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): store - added category list endpoint

- [#2986](https://github.com/medusajs/medusa/pull/2986) [`aab163bab`](https://github.com/medusajs/medusa/commit/aab163babb91759a05b852d34c299cdfac96d800) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): added admin endpoint to update product categories

- [#3030](https://github.com/medusajs/medusa/pull/3030) [`a0c4cfe0f`](https://github.com/medusajs/medusa/commit/a0c4cfe0f74cf30c45956c32c2fb22bf833bea68) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - chore(oas): replace response with $ref class JSDoc (Admin PR0-SAL)

- [#3031](https://github.com/medusajs/medusa/pull/3031) [`27a29ef24`](https://github.com/medusajs/medusa/commit/27a29ef24e5ea1ba2bc0be8ecb7dd747d4c7c65b) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - chore(oas): replace response with $ref class JSDoc (Admin SHI-V)

- [#3003](https://github.com/medusajs/medusa/pull/3003) [`aef842123`](https://github.com/medusajs/medusa/commit/aef8421235d8fff68d7d4f8b73f77484073311a5) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): emit events on product category mutation

- [#2963](https://github.com/medusajs/medusa/pull/2963) [`1dc79590b`](https://github.com/medusajs/medusa/commit/1dc79590b3539af09dbc8fbf931d9b5ee225fb0d) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(medusa): rename variant inventory item quantity to required_quantity

- [#2995](https://github.com/medusajs/medusa/pull/2995) [`9c4647383`](https://github.com/medusajs/medusa/commit/9c4647383ebf0a183ccc566636bcf7af06409060) Thanks [@pKorsholm](https://github.com/pKorsholm)! - add reservation endpoints

- [#3030](https://github.com/medusajs/medusa/pull/3030) [`a0c4cfe0f`](https://github.com/medusajs/medusa/commit/a0c4cfe0f74cf30c45956c32c2fb22bf833bea68) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - chore(oas): replace response with $ref class JSDoc (Admin PR0-SAL)

- [#3007](https://github.com/medusajs/medusa/pull/3007) [`b80124d32`](https://github.com/medusajs/medusa/commit/b80124d32d950790c2a01b49e8c34d562b1d57f4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Allow custom created_by on order edits

- [#3044](https://github.com/medusajs/medusa/pull/3044) [`cb1ec0076`](https://github.com/medusajs/medusa/commit/cb1ec0076b4fd932c686d6027e8b060ceded3a64) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - chore(oas): replace response with $ref class JSDoc (Store PRO-V)

- [#3010](https://github.com/medusajs/medusa/pull/3010) [`142c8aa70`](https://github.com/medusajs/medusa/commit/142c8aa70f583d9b11a6add2b8f988e9ba4cf979) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Payment collection should provider the region_id, total and id in the partial cart data

- [#3033](https://github.com/medusajs/medusa/pull/3033) [`1547dd814`](https://github.com/medusajs/medusa/commit/1547dd8143889fc30045fc3d0241de8e69acb76e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Add module options to transaction base service to use in modules

- [#3013](https://github.com/medusajs/medusa/pull/3013) [`d2c692aa9`](https://github.com/medusajs/medusa/commit/d2c692aa96ea89c053f9a694a9ae6dba77e89b14) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Add default sales channel to product in seeding

- [#3051](https://github.com/medusajs/medusa/pull/3051) [`150696de9`](https://github.com/medusajs/medusa/commit/150696de99fc852c5d72a746f168b6f62b2086ed) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa, medusa-js, medusa-react): Add endpoint to retrieve Product Tags through the Storefront API

- [#3025](https://github.com/medusajs/medusa/pull/3025) [`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): test, build and watch scripts

- [#3008](https://github.com/medusajs/medusa/pull/3008) [`b3e4be720`](https://github.com/medusajs/medusa/commit/b3e4be72087d0b528c3cce322edf9325b855c8ae) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Draft order totals not working with custom items

- Updated dependencies [[`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2)]:
  - @medusajs/medusa-cli@1.3.6
  - medusa-interfaces@1.3.4
  - medusa-telemetry@0.0.16

## 1.7.3

### Patch Changes

- [#2976](https://github.com/medusajs/medusa/pull/2976) [`1817b810f`](https://github.com/medusajs/medusa/commit/1817b810fc8563a08119b74b86ec0587d9e443a1) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Cancel order missing refunds relation

- [#2965](https://github.com/medusajs/medusa/pull/2965) [`28bec599a`](https://github.com/medusajs/medusa/commit/28bec599ae34d29b626b1dc36f762fc0b2fe8f17) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: Repository util mention of entity specifics

- [#2945](https://github.com/medusajs/medusa/pull/2945) [`3f44abe01`](https://github.com/medusajs/medusa/commit/3f44abe01a7807adf0e807811d4bc52b713cd6b5) Thanks [@riqwan](https://github.com/riqwan)! - feat(nested-categories): Introduces a model and migration to create category table that can be nested

- [#2985](https://github.com/medusajs/medusa/pull/2985) [`8ed4eab73`](https://github.com/medusajs/medusa/commit/8ed4eab73a2b067e19da5a1c8498cbff7125ea8d) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): added admin create endpoint for product categories

- [#2913](https://github.com/medusajs/medusa/pull/2913) [`645e0d0ec`](https://github.com/medusajs/medusa/commit/645e0d0ec5e2e49048887c62db662427c8a39cdf) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Make orders queryable by customer fields

- [#2961](https://github.com/medusajs/medusa/pull/2961) [`47d075351`](https://github.com/medusajs/medusa/commit/47d075351fa4fdeaf32d48f2bd7e72943a293d9b) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): Admin API endpoint to fetch a Product Category

- [#2947](https://github.com/medusajs/medusa/pull/2947) [`32b038fc3`](https://github.com/medusajs/medusa/commit/32b038fc3fb5f8fab09a7d23f881847c7ae02c0c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): "Idempotent" retries of job subscribers

- [#2928](https://github.com/medusajs/medusa/pull/2928) [`3d200c41f`](https://github.com/medusajs/medusa/commit/3d200c41f953c3c979a1586f6425a2fbdf159e7e) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: refactor payment collection setPaymentSession

- [#2931](https://github.com/medusajs/medusa/pull/2931) [`16716f5a4`](https://github.com/medusajs/medusa/commit/16716f5a4f94cb6bc1dcea278d1789da760f2767) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Multi Warehouse: Add locations for fulfillments

- [#2975](https://github.com/medusajs/medusa/pull/2975) [`71fa60892`](https://github.com/medusajs/medusa/commit/71fa60892cd7c00dd9cb8c222a1794ad6577fc1b) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa): added admin delete category endpoint

- [#2498](https://github.com/medusajs/medusa/pull/2498) [`cc10c20f3`](https://github.com/medusajs/medusa/commit/cc10c20f356d4fe98336d879f8c9523bb63e9e48) Thanks [@chiubaca](https://github.com/chiubaca)! - Include optional `external_id` property for CreateProductInput type

- [#2909](https://github.com/medusajs/medusa/pull/2909) [`eda26f6e8`](https://github.com/medusajs/medusa/commit/eda26f6e818a56672cdcce1d794c307c5490f956) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Add tax inclusive flag to return lines from line item

- [#2953](https://github.com/medusajs/medusa/pull/2953) [`077e4d960`](https://github.com/medusajs/medusa/commit/077e4d960687a909fd254cd69f4dd5b3e0bad204) Thanks [@pKorsholm](https://github.com/pKorsholm)! - OAS update

- [#2973](https://github.com/medusajs/medusa/pull/2973) [`f3ced106a`](https://github.com/medusajs/medusa/commit/f3ced106ad24fe21f099e10bee5666e1f65a9fc7) Thanks [@riqwan](https://github.com/riqwan)! - feat(nested-categories) adds a list endpoint to admin nested categories

- [#2958](https://github.com/medusajs/medusa/pull/2958) [`baeacd1cc`](https://github.com/medusajs/medusa/commit/baeacd1cc52c548eef6896fd83e606c858cf2165) Thanks [@adrien2p](https://github.com/adrien2p)! - feat: Deactivate search service product subscribers when search engine not enabled

- [#2962](https://github.com/medusajs/medusa/pull/2962) [`e4af96853`](https://github.com/medusajs/medusa/commit/e4af9685313077ece7e3fb7bd27053108cd9d5f8) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: Custom repository take/skip wrongly applied when there is no relations in the findWihtRelationAndCount

- [#2937](https://github.com/medusajs/medusa/pull/2937) [`cac81749e`](https://github.com/medusajs/medusa/commit/cac81749eaa06b3b00ac5494591c96a0fcd7bf57) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Update cart payment session management

- [#2737](https://github.com/medusajs/medusa/pull/2737) [`4a50786fb`](https://github.com/medusajs/medusa/commit/4a50786fbc78b36147f1f45d77c55dc0a582caba) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Payment Processor API

- [#2907](https://github.com/medusajs/medusa/pull/2907) [`c07ffb616`](https://github.com/medusajs/medusa/commit/c07ffb61658b0cdbff00461d1fa267c6be2d1967) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Stock locations module added

- [#2707](https://github.com/medusajs/medusa/pull/2707) [`8ba0addea`](https://github.com/medusajs/medusa/commit/8ba0addea3997c27efe4a50733b02a31e02f55e5) Thanks [@olivermrbl](https://github.com/olivermrbl)! - tests(integration-tests): Add integration test suite for database options

- [#2883](https://github.com/medusajs/medusa/pull/2883) [`b9680b641`](https://github.com/medusajs/medusa/commit/b9680b641f2984eddbc1f49a37c050499fbaff69) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add services:
  - `sales-channel-inventory`
  - `sales-channel-location`
  - `product-variant-inventory`
- Updated dependencies [[`47d075351`](https://github.com/medusajs/medusa/commit/47d075351fa4fdeaf32d48f2bd7e72943a293d9b)]:
  - medusa-test-utils@1.1.38

## 1.7.2

### Patch Changes

- [#2889](https://github.com/medusajs/medusa/pull/2889) [`d843bc102`](https://github.com/medusajs/medusa/commit/d843bc10235f33db9eecb72d74018966e43c26d6) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Assign jobSchedulerService in EventBusService

## 1.7.1

### Patch Changes

- [#2783](https://github.com/medusajs/medusa/pull/2783) [`7cced6006`](https://github.com/medusajs/medusa/commit/7cced6006a9a6f9108009e9f3e191e9f3ba1b168) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: getConfigFile typings

- [#2815](https://github.com/medusajs/medusa/pull/2815) [`463f83ffd`](https://github.com/medusajs/medusa/commit/463f83ffdd450d5325a57fe742b68bfb32ef1a42) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Order products on retrieval

- [#2772](https://github.com/medusajs/medusa/pull/2772) [`17c3f34e3`](https://github.com/medusajs/medusa/commit/17c3f34e3df0a4c3656ad8909608331e207155f1) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix: add missing medusa-telemetry dependency to package.json

- [#2811](https://github.com/medusajs/medusa/pull/2811) [`c16522d6c`](https://github.com/medusajs/medusa/commit/c16522d6ce806aa6289d626b868818409f41c66e) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add has_account to filter only registered or unregistered customer in the admin

- [#2819](https://github.com/medusajs/medusa/pull/2819) [`2e5ceb795`](https://github.com/medusajs/medusa/commit/2e5ceb795008fbf53d19bb79ac561561dd11311e) Thanks [@josetr](https://github.com/josetr)! - Allow custom database schema

- [#2802](https://github.com/medusajs/medusa/pull/2802) [`71b536e01`](https://github.com/medusajs/medusa/commit/71b536e01e32e3ab3fb5d295df9d67497a8bbe6d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Replace all usage of redis for the cache in favour of the cache service

- [#2813](https://github.com/medusajs/medusa/pull/2813) [`9e05fef4b`](https://github.com/medusajs/medusa/commit/9e05fef4b973ceb60a2b975c839de96ca743597b) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - Fixes a bug where using the q param with the endpoint /admin/price-lists/:id/products would also return products not associated with the price list.

- [#2719](https://github.com/medusajs/medusa/pull/2719) [`3113d8024`](https://github.com/medusajs/medusa/commit/3113d8024fdeb09230675c2053fcefe811e575fd) Thanks [@josetr](https://github.com/josetr)! - feat(medusa): Create draft orders without items

- [#2869](https://github.com/medusajs/medusa/pull/2869) [`e27b1940c`](https://github.com/medusajs/medusa/commit/e27b1940c7249e835404ac5490cf39e93053d2bb) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: Order with totals should include the variant relation to the items

- [#2812](https://github.com/medusajs/medusa/pull/2812) [`5e4decbc1`](https://github.com/medusajs/medusa/commit/5e4decbc1c4cc25cb1adb1f63b2f8ea8669d352e) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: Batch job not saving the errors properly

- [#2867](https://github.com/medusajs/medusa/pull/2867) [`b700c6ba5`](https://github.com/medusajs/medusa/commit/b700c6ba5b323c7c5e200f721f0335f40b3e357a) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - chore(oas): replace requestBody with $ref to req class JSDoc OAS

- [#2777](https://github.com/medusajs/medusa/pull/2777) [`8a60a7338`](https://github.com/medusajs/medusa/commit/8a60a73389c1b5c8abf96fbbcc7be7c4d427041d) Thanks [@riqwan](https://github.com/riqwan)! - fix: Gift cart tax claculation wrongly calculated

  Adds tax_rate column to gift_card table to calculate tax accurately for a gift card. This change includes a backfill migration to update gift cards that were already created.

- [#2821](https://github.com/medusajs/medusa/pull/2821) [`ba6bb3e54`](https://github.com/medusajs/medusa/commit/ba6bb3e54b9989cecf476c7411c406a43562efe1) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Extract cron jobs logic from the EventBusService to its own service JobSchedulerService

- [#2810](https://github.com/medusajs/medusa/pull/2810) [`ea460b4e0`](https://github.com/medusajs/medusa/commit/ea460b4e0b1a9aa0fe1ab66bc21a8c40f76a65b3) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa): add `q` param to PKs sales channels retrieval

- [#2743](https://github.com/medusajs/medusa/pull/2743) [`c8724da50`](https://github.com/medusajs/medusa/commit/c8724da50300b94255c5fb4ffe9904be279b5923) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa,medusa-payment-stripe): Move database mutation from plugin to core

- [#2738](https://github.com/medusajs/medusa/pull/2738) [`8dcc805cc`](https://github.com/medusajs/medusa/commit/8dcc805ccf8da619549e77f009d6c4d7b2b6c99a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(medusa): Validate required id in `[someService].retrieve`

- [#2847](https://github.com/medusajs/medusa/pull/2847) [`a027d5ff9`](https://github.com/medusajs/medusa/commit/a027d5ff9eb821a1c8728476e4f8bf5f4dd102c8) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - chore(oas): PascalCase for schemas + remove x-resourceId

- Updated dependencies [[`7cced6006`](https://github.com/medusajs/medusa/commit/7cced6006a9a6f9108009e9f3e191e9f3ba1b168)]:
  - medusa-core-utils@1.1.37

## 1.7.0

### Minor Changes

- [#2710](https://github.com/medusajs/medusa/pull/2710) [`a6243618f`](https://github.com/medusajs/medusa/commit/a6243618fef5f9dd51ccba9e07e7849dd177202c) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat: allow customers to claim orders

  BREAKING CHANGE: `customerService.retrieveByEmail` is being deprecated in favor of two methods: `customerService.retrieveRegisteredByEmail` and `customerService.retrieveUnRegisteredByEmail`. Please use `customerService.list({ email: <customer email> })` in the future

### Patch Changes

- [#2701](https://github.com/medusajs/medusa/pull/2701) [`198fe78c1`](https://github.com/medusajs/medusa/commit/198fe78c138455f16d02406234fcfb05c4581372) Thanks [@srindom](https://github.com/srindom)! - fix(medusa): allow passing idempotency key to service layer create

- [#2747](https://github.com/medusajs/medusa/pull/2747) [`72f70bc78`](https://github.com/medusajs/medusa/commit/72f70bc789e7c4a9df512745f7fc809595a3b503) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - Decorate orders returned by /store/orders/:id with totals.

- [#2761](https://github.com/medusajs/medusa/pull/2761) [`e63777e3c`](https://github.com/medusajs/medusa/commit/e63777e3c52fe34ed502c3b0ceb82e3e1e993474) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: cart completion strategy tax lines management

- [#2687](https://github.com/medusajs/medusa/pull/2687) [`70a8d3450`](https://github.com/medusajs/medusa/commit/70a8d3450fb8551bb25a3e50be4ef74dc361c946) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa): Use requireCustomerAuthentication middleware in get-session

- [#2670](https://github.com/medusajs/medusa/pull/2670) [`1b21af87a`](https://github.com/medusajs/medusa/commit/1b21af87ab80c18013f0f44434e59b873c2313aa) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa-core-utils): Migrate to TS

- [#2667](https://github.com/medusajs/medusa/pull/2667) [`ed121922b`](https://github.com/medusajs/medusa/commit/ed121922b04e2e2af672fa6ab5ad69cd3cf17040) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Order service legacy decorate totals should still apply the totals to the items

- [#2770](https://github.com/medusajs/medusa/pull/2770) [`346461755`](https://github.com/medusajs/medusa/commit/3464617553770353a5d781caea8bdf880c72909f) Thanks [@fPolic](https://github.com/fPolic)! - Properly setting "refunded" and "partially refunded" statuses on orders

- [#2668](https://github.com/medusajs/medusa/pull/2668) [`e18b59de6`](https://github.com/medusajs/medusa/commit/e18b59de66ef52698d3f6b5ebec9f212a52fce02) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: update awilix to v8

- [#2648](https://github.com/medusajs/medusa/pull/2648) [`42d9c7222`](https://github.com/medusajs/medusa/commit/42d9c7222b05ea231a920ea0694f6be8c13a956a) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(medusa): Optimize the cart creation with time line and therefore the response time

- [#2683](https://github.com/medusajs/medusa/pull/2683) [`33aa3edb8`](https://github.com/medusajs/medusa/commit/33aa3edb805c217cf8e024af4c5be1835eb397dd) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix: Fixes a bug where `country_code` was dropped when partially updating a shipping and/or billing address on a cart.

- [#2712](https://github.com/medusajs/medusa/pull/2712) [`1dc816039`](https://github.com/medusajs/medusa/commit/1dc816039cdd332d50e3d979f78c5ee0f820db97) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - chore(oas): explicitly declare type:object on schemas with properties

- [#2729](https://github.com/medusajs/medusa/pull/2729) [`cb2a32a82`](https://github.com/medusajs/medusa/commit/cb2a32a82b2a4d89e57a120262a9eee002ee29a9) Thanks [@riqwan](https://github.com/riqwan)! - Enforces a validation for discounts that makes regions a required parameter

- [#2771](https://github.com/medusajs/medusa/pull/2771) [`c2c38dd09`](https://github.com/medusajs/medusa/commit/c2c38dd091dd0938c8be63e515ccbc3158f72378) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - Adds appropriate optional type to several endpoint fields related to products. Also fixes the use of wrong payload type for `useAdminUpdateVariant` hook in `medusa-react`.

- [#2764](https://github.com/medusajs/medusa/pull/2764) [`424efff91`](https://github.com/medusajs/medusa/commit/424efff91943dad3982b44a8549e828678c3e1b4) Thanks [@adrien2p](https://github.com/adrien2p)! - feat: Allow to assign a collection to a product during the import

- [#2628](https://github.com/medusajs/medusa/pull/2628) [`b2ea8b7d4`](https://github.com/medusajs/medusa/commit/b2ea8b7d45e91f671cd8c20fe9270c0e9c5f94cc) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Throw on flat rate shipping options with no amount

- [#1935](https://github.com/medusajs/medusa/pull/1935) [`b5d6682db`](https://github.com/medusajs/medusa/commit/b5d6682db66a7e4f6729c24fbec075a2faef87c4) Thanks [@adrien2p](https://github.com/adrien2p)! - Allow regular expression in CORS configuration

- [#2751](https://github.com/medusajs/medusa/pull/2751) [`d68e81fb3`](https://github.com/medusajs/medusa/commit/d68e81fb3df116af70738eef93e227f41b72d80b) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Should update the adjustments upon cart discount removal

- Updated dependencies [[`1b21af87a`](https://github.com/medusajs/medusa/commit/1b21af87ab80c18013f0f44434e59b873c2313aa)]:
  - medusa-core-utils@1.1.36

## 1.6.5

### Patch Changes

- [#2594](https://github.com/medusajs/medusa/pull/2594) [`f60267a49`](https://github.com/medusajs/medusa/commit/f60267a494f95d85b6007e617a1f9b0146854bae) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Update staging action for automatic releases

- [#2579](https://github.com/medusajs/medusa/pull/2579) [`022a84691`](https://github.com/medusajs/medusa/commit/022a84691eb84f408bcc36921d23703d498c847f) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(draft-order): create tax-inclusive with discount

- [#2632](https://github.com/medusajs/medusa/pull/2632) [`5d977a8f5`](https://github.com/medusajs/medusa/commit/5d977a8f57552af02eae0a44016b2213609b6d92) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Performance improvements of listing shipping options

- [#2607](https://github.com/medusajs/medusa/pull/2607) [`e09f6e8a1`](https://github.com/medusajs/medusa/commit/e09f6e8a1e4a759fe70664bea0538c61b7cea70a) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa-payment-stripe): handle webhook sirialization failure

- [#2603](https://github.com/medusajs/medusa/pull/2603) [`9e91a50df`](https://github.com/medusajs/medusa/commit/9e91a50df17b4f542db8d9678b5f489218511adb) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa-payment-stripe): missing transaction on create payment

- [#2612](https://github.com/medusajs/medusa/pull/2612) [`a77780671`](https://github.com/medusajs/medusa/commit/a77780671aadc311c0e8a541104cbff1ea769ac7) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Transaction lock issues on create/update cart items

- [#2597](https://github.com/medusajs/medusa/pull/2597) [`d7997ef25`](https://github.com/medusajs/medusa/commit/d7997ef256b7fd98d96be720c9aec694e426f92f) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Expose Module Resolution API

- Updated dependencies []:
  - @medusajs/medusa-cli@1.3.5

## 1.6.4

### Patch Changes

- [#2646](https://github.com/medusajs/medusa/pull/2646) [`e7c4cc375`](https://github.com/medusajs/medusa/commit/e7c4cc375174775bb0cfe52e5dc0270237150b3c) Thanks [@pKorsholm](https://github.com/pKorsholm)! - jwt fix

- Updated dependencies [[`e7c4cc375`](https://github.com/medusajs/medusa/commit/e7c4cc375174775bb0cfe52e5dc0270237150b3c)]:
  - medusa-core-utils@1.1.35

## 1.6.3

### Patch Changes

- [#2583](https://github.com/medusajs/medusa/pull/2583) [`699bb1d57`](https://github.com/medusajs/medusa/commit/699bb1d57bfe532a6bcff1aea7a75bc793c135cd) Thanks [@adrien2p](https://github.com/adrien2p)! - Retrieve deleted regions on orders

## 1.6.2

### Patch Changes

- [#2568](https://github.com/medusajs/medusa/pull/2568) [`2d095a0ce`](https://github.com/medusajs/medusa/commit/2d095a0ce14ab7f24b4e6856cb4850cea18af21c) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): fix missing throw in the store cart create-payment-sessions

* [#2566](https://github.com/medusajs/medusa/pull/2566) [`8069ed5e9`](https://github.com/medusajs/medusa/commit/8069ed5e99dc53a912df9bb860114d2258044108) Thanks [@srindom](https://github.com/srindom)! - fix(medusa): add support for retrying failed event bus jobs

- [#2552](https://github.com/medusajs/medusa/pull/2552) [`7b0ceeffb`](https://github.com/medusajs/medusa/commit/7b0ceeffb4616c3f4e0cf51aba2ab381c61ea5d7) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(medusa, medusa-js, medusa-react): /store api product types

* [#2460](https://github.com/medusajs/medusa/pull/2460) [`5ea4b728e`](https://github.com/medusajs/medusa/commit/5ea4b728e728a7e6d4d6fe7255ea80395ab75bd3) Thanks [@github-actions](https://github.com/apps/github-actions)! - Order/cart decorate totals should assign items totals, shipping option requirements should be tax-inclusive if shipping option is, ensure swaps can be created on orders with discounts

* Updated dependencies []:
  - @medusajs/medusa-cli@1.3.4

## 1.6.1

### Patch Changes

- [#2514](https://github.com/medusajs/medusa/pull/2514) [`ea3d73882`](https://github.com/medusajs/medusa/commit/ea3d7388234f23c4a5bc7ceb55c493a097b76c12) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat(medusa): invalid medusa-config handling in loaders

* [#2531](https://github.com/medusajs/medusa/pull/2531) [`38d4a7db3`](https://github.com/medusajs/medusa/commit/38d4a7db3d762fc7f746825c64026d2711db5bd8) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat(Medusa): Allow custom shipping price on draft orders

- [#2532](https://github.com/medusajs/medusa/pull/2532) [`222423625`](https://github.com/medusajs/medusa/commit/222423625db22d955dafb53cf543caa37f8551b2) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Enable analytics feature flag by default

- Updated dependencies [[`ea3d73882`](https://github.com/medusajs/medusa/commit/ea3d7388234f23c4a5bc7ceb55c493a097b76c12)]:
  - medusa-core-utils@1.1.34

## 1.6.0

### Minor Changes

- [#2358](https://github.com/medusajs/medusa/pull/2358) [`9deec0fc3`](https://github.com/medusajs/medusa/commit/9deec0fc3c3ff9d89ca194b8b05948141799a412) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Idempotency workStage used within transaction

* [#2471](https://github.com/medusajs/medusa/pull/2471) [`299c4ae7f`](https://github.com/medusajs/medusa/commit/299c4ae7f55b0586f283d7f21792b7b204df421a) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Align columns between product import/export, re visit the way the columns are defined and treated

### Patch Changes

- [#2427](https://github.com/medusajs/medusa/pull/2427) [`211720f24`](https://github.com/medusajs/medusa/commit/211720f24cbcb1f01c36aa35660e1ff0c4518ebd) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - Changes type to type_id for the list products endpoints in both the Store and Admin API.

* [#2411](https://github.com/medusajs/medusa/pull/2411) [`c71744245`](https://github.com/medusajs/medusa/commit/c717442451cf9fc2e0961edded5b49ea5a78760e) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Allow to filter collections by discount condition id

- [#2433](https://github.com/medusajs/medusa/pull/2433) [`3c5e31c64`](https://github.com/medusajs/medusa/commit/3c5e31c6455695f854e9df7a3592c12b899fa1e1) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add protected uploads to fileservices

* [#2469](https://github.com/medusajs/medusa/pull/2469) [`13611e3e5`](https://github.com/medusajs/medusa/commit/13611e3e53d449fbfab7a88f848f6652a360bd14) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Select config should be undefined if length === 0

- [#2430](https://github.com/medusajs/medusa/pull/2430) [`765a2cccd`](https://github.com/medusajs/medusa/commit/765a2cccda2c4c552ede9ec23e0c1e3dd4ea44fc) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(medusa, medusa-js, medusa-react): add resources to discount condition by batch

* [#2270](https://github.com/medusajs/medusa/pull/2270) [`69e579758`](https://github.com/medusajs/medusa/commit/69e579758f81332094d6f0dfa6fbcbc359b0d92c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - Adds the use of price selection strategy to retrieving variants in the admin API. This moves the responsibility of tax calculations from the frontend (admin) to the backend.

- [#2424](https://github.com/medusajs/medusa/pull/2424) [`05f921711`](https://github.com/medusajs/medusa/commit/05f921711fb0ac3603d29955648d8ba563a7da7d) Thanks [@fPolic](https://github.com/fPolic)! - Product import - allow null product type

* [#2359](https://github.com/medusajs/medusa/pull/2359) [`19ca18e71`](https://github.com/medusajs/medusa/commit/19ca18e71c8feea7277e09db3c5e9e6316adb6ab) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Allow to query product types by discount condition id

- [#2340](https://github.com/medusajs/medusa/pull/2340) [`a9c703d56`](https://github.com/medusajs/medusa/commit/a9c703d56c2678fb509af7f9e1fe2cb65f95ba9d) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Allow to query product tags by condition id

* [#2482](https://github.com/medusajs/medusa/pull/2482) [`58c7ffdc6`](https://github.com/medusajs/medusa/commit/58c7ffdc6ec1d06f76aaa9427505dc452398770f) Thanks [@srindom](https://github.com/srindom)! - fix(medusa): allow filtering collections by handle

- [#2444](https://github.com/medusajs/medusa/pull/2444) [`48411157b`](https://github.com/medusajs/medusa/commit/48411157b1cdec0a67f91e06de8ac547af89d7af) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Support batch remove resources on discount condition

* [#2402](https://github.com/medusajs/medusa/pull/2402) [`144ce0e42`](https://github.com/medusajs/medusa/commit/144ce0e42cd894a2cd5b40b68c095fd1eda851a9) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Capture DraftOrder payment immediately in register-payment.ts

- [#2464](https://github.com/medusajs/medusa/pull/2464) [`8be67c734`](https://github.com/medusajs/medusa/commit/8be67c734c970ef03bf0afaf74cc3818e305466d) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Filter product list by discount condition id

## 1.5.0

### Minor Changes

- [#2372](https://github.com/medusajs/medusa/pull/2372) [`3d255302b`](https://github.com/medusajs/medusa/commit/3d255302b022a06b492807774412b1db05fa8d06) Thanks [@srindom](https://github.com/srindom)! - Improve performance of cart total calculations

### Patch Changes

- [#2369](https://github.com/medusajs/medusa/pull/2369) [`d2b272fab`](https://github.com/medusajs/medusa/commit/d2b272fab649bb272b8af4f2f00aafe89965995e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Trim discount code on insert and retrieve

* [#2210](https://github.com/medusajs/medusa/pull/2210) [`7dc8d3a0c`](https://github.com/medusajs/medusa/commit/7dc8d3a0c90ce06e3f11a6a46dec1f9ec3f26e81) Thanks [@srindom](https://github.com/srindom)! - Adds a BatchJob strategy for importing prices to PriceLists

- [#2276](https://github.com/medusajs/medusa/pull/2276) [`678a06752`](https://github.com/medusajs/medusa/commit/678a06752a03f71d77265a874fd7d07361337862) Thanks [@adrien2p](https://github.com/adrien2p)! - Finalise service migration and fix super constructor arguments

* [#2351](https://github.com/medusajs/medusa/pull/2351) [`d8a5942d3`](https://github.com/medusajs/medusa/commit/d8a5942d3d85671e2923668bdbf2867957f5554b) Thanks [@ayushthe1](https://github.com/ayushthe1)! - Fix wrongly referenced product id in ProductImportStrategy
  Fix assigning nested objects properly

- [#2374](https://github.com/medusajs/medusa/pull/2374) [`edd35631f`](https://github.com/medusajs/medusa/commit/edd35631f722009bdcb2439ff8c2326025425d33) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Add sales channel to order on creation

* [#1790](https://github.com/medusajs/medusa/pull/1790) [`df62e618b`](https://github.com/medusajs/medusa/commit/df62e618bcc365ef376b96705d63b465b48b0191) Thanks [@adrien2p](https://github.com/adrien2p)! - Migrate Stripe providers to the new AbstractPaymentService

- [#2224](https://github.com/medusajs/medusa/pull/2224) [`3f7317028`](https://github.com/medusajs/medusa/commit/3f7317028808cd3c1b44cb7b66694501a7c706c4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Normalize discount code before querying DB in `DiscountService.retrieveByCode`

- Updated dependencies [[`7dc8d3a0c`](https://github.com/medusajs/medusa/commit/7dc8d3a0c90ce06e3f11a6a46dec1f9ec3f26e81)]:
  - medusa-core-utils@1.1.32

## 1.4.1

### Patch Changes

- [`d2932d328`](https://github.com/medusajs/medusa/commit/d2932d328c30a2b40a49853fa337ae0e35b29ae8) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Expose list-currencies endpoint by removing the feature flag guard on router

* [`d2932d328`](https://github.com/medusajs/medusa/commit/d2932d328c30a2b40a49853fa337ae0e35b29ae8) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Cleanup Tax lines in case of a failed cart completion

## 1.4.0

### Minor Changes

- [#2185](https://github.com/medusajs/medusa/pull/2185) [`64949dc72`](https://github.com/medusajs/medusa/commit/64949dc721a6c697e3eb7091db9f2d261111a766) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - Adds missing response types for currency endpoints and exports route. Adds currency endpoints to medusa-js and medusa-react.

### Patch Changes

- [#2150](https://github.com/medusajs/medusa/pull/2150) [`b6161d240`](https://github.com/medusajs/medusa/commit/b6161d24043b8b910320475b8616b7e29a96f6cd) Thanks [@adrien2p](https://github.com/adrien2p)! - Handle new line char in csv cell and fix import strategy

* [#2155](https://github.com/medusajs/medusa/pull/2155) [`af80e0fd2`](https://github.com/medusajs/medusa/commit/af80e0fd2ed75cd3c15282ddcbfb949060dfdd33) Thanks [@srindom](https://github.com/srindom)! - Make prices optional param when updating a variant

## 1.3.9

### Patch Changes

- [#2197](https://github.com/medusajs/medusa/pull/2197) [`eb3b02baf`](https://github.com/medusajs/medusa/commit/eb3b02baf422ec2038d5e229d7ac1e35ddc3c561) Thanks [@srindom](https://github.com/srindom)! - Create cart with country code in shipping address

## 1.3.8

### Patch Changes

- [#2069](https://github.com/medusajs/medusa/pull/2069) [`ad717b953`](https://github.com/medusajs/medusa/commit/ad717b9533a0500e20c4e312d1ee48b35ea9d5e1) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Remove deprecated dependency `@hapi/joi`

* [#1846](https://github.com/medusajs/medusa/pull/1846) [`d14a0398f`](https://github.com/medusajs/medusa/commit/d14a0398fb884a1cd472c147af8ff5fa6fdbe4cb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Fixes an error thrown when deleting product options on a product without variants

- [#2000](https://github.com/medusajs/medusa/pull/2000) [`ba6416f09`](https://github.com/medusajs/medusa/commit/ba6416f095e465cc07e35bfc6d6f311c12f57574) Thanks [@fPolic](https://github.com/fPolic)! - Convert SwapService to TypeScript

- Updated dependencies [[`ad717b953`](https://github.com/medusajs/medusa/commit/ad717b9533a0500e20c4e312d1ee48b35ea9d5e1)]:
  - @medusajs/medusa-cli@1.3.3

## 1.3.7

### Patch Changes

- [#2105](https://github.com/medusajs/medusa/pull/2105) [`846ae637e`](https://github.com/medusajs/medusa/commit/846ae637e2be6d557df37f45421da689127b9da6) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Fix development hot reload on Windows

## 1.3.6

### Patch Changes

- [#2045](https://github.com/medusajs/medusa/pull/2045) [`15a5b029a`](https://github.com/medusajs/medusa/commit/15a5b029ae3bd954481c558beeac87ace7ab945d) Thanks [@srindom](https://github.com/srindom)! - Join tracking links to all fulfillments in admin/orders

* [#2017](https://github.com/medusajs/medusa/pull/2017) [`900260c5b`](https://github.com/medusajs/medusa/commit/900260c5b9df4f4f927db5bb6921e5e139ff269a) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Adds enabled features flags to tracking event in `medusa-telemetry`

- [#1976](https://github.com/medusajs/medusa/pull/1976) [`42ed20951`](https://github.com/medusajs/medusa/commit/42ed209518bf0278d1bef3c4c47d0ee21cae84c8) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Convert CollectionService to TypeScript

* [#975](https://github.com/medusajs/medusa/pull/975) [`a54dc68db`](https://github.com/medusajs/medusa/commit/a54dc68db7a7d476cf4bf8d36c122c7f34629c90) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Allow filtering of customer orders

- [#1995](https://github.com/medusajs/medusa/pull/1995) [`aaebb38ea`](https://github.com/medusajs/medusa/commit/aaebb38eae883a225779b03556900ea813c991d2) Thanks [@adrien2p](https://github.com/adrien2p)! - Convert IdempotencyKeyService to TypeScript
  Add await to retrieve in lock method

* [#1854](https://github.com/medusajs/medusa/pull/1854) [`9e0cb1212`](https://github.com/medusajs/medusa/commit/9e0cb1212023d7035165ddd269edab3efc7ebe29) Thanks [@srindom](https://github.com/srindom)! - Fixes issue where failed cart completion attempts could not be retried without 500 error

- [#1962](https://github.com/medusajs/medusa/pull/1962) [`c97ccd3fb`](https://github.com/medusajs/medusa/commit/c97ccd3fb5dbe796b0e4fbf37def5bb6e8201557) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Convert FulfillmentService to TypeScript

* [#1963](https://github.com/medusajs/medusa/pull/1963) [`152934f8b`](https://github.com/medusajs/medusa/commit/152934f8b07cb3095788091df6823f9665fdf43d) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Convert ShippingProfileService to TypeScript

- [#2067](https://github.com/medusajs/medusa/pull/2067) [`8c4be3353`](https://github.com/medusajs/medusa/commit/8c4be3353630efd18759eb893666e44b1b49e2b7) Thanks [@endigo](https://github.com/endigo)! - add Mongolian native currency tugrug

* [#1914](https://github.com/medusajs/medusa/pull/1914) [`bda83a84b`](https://github.com/medusajs/medusa/commit/bda83a84bc99a4741da2076f59071c177bc5534f) Thanks [@fPolic](https://github.com/fPolic)! - Convert RegionService to TypeScript

- [#1983](https://github.com/medusajs/medusa/pull/1983) [`11fab121f`](https://github.com/medusajs/medusa/commit/11fab121f4c4b5ec3b6a3afccd4c44844bc5e3d9) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Convert OauthService to TypeScript

* [#1982](https://github.com/medusajs/medusa/pull/1982) [`40ae53567`](https://github.com/medusajs/medusa/commit/40ae53567a23ebe562e571fa22f1721eed174c82) Thanks [@chemicalkosek](https://github.com/chemicalkosek)! - Add payment providers Przelewy24 and Blik through Stripe

- [#1988](https://github.com/medusajs/medusa/pull/1988) [`80e02130b`](https://github.com/medusajs/medusa/commit/80e02130b4a444287920989654b607f07dd8d4f8) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Convert SystemPaymentProvider to TypeScript

* [#2024](https://github.com/medusajs/medusa/pull/2024) [`c31290c91`](https://github.com/medusajs/medusa/commit/c31290c911450a06d5e4da3dc5e4e3977071a6ea) Thanks [@adrien2p](https://github.com/adrien2p)! - Add new `isDefined` utility

- [#1968](https://github.com/medusajs/medusa/pull/1968) [`4b663cca3`](https://github.com/medusajs/medusa/commit/4b663cca3acf43b0e02a1fb94b8d4f14913bfe45) Thanks [@adrien2p](https://github.com/adrien2p)! - Use transactions in CartCompletionStrategy phases

- Updated dependencies [[`c97ccd3fb`](https://github.com/medusajs/medusa/commit/c97ccd3fb5dbe796b0e4fbf37def5bb6e8201557)]:
  - medusa-interfaces@1.3.3

## 1.3.5

### Patch Changes

- [#1914](https://github.com/medusajs/medusa/pull/1914) [`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68) Thanks [@fPolic](https://github.com/fPolic)! - Version bump due to missing changesets in merged PRs

* [#1878](https://github.com/medusajs/medusa/pull/1878) [`8c283ac3b`](https://github.com/medusajs/medusa/commit/8c283ac3b03dea09203ac1b4c8d806efbc092290) Thanks [@srindom](https://github.com/srindom)! - Fixes issue with listing shipping options with a calculated price type

- [#1874](https://github.com/medusajs/medusa/pull/1874) [`b8ddb31f6`](https://github.com/medusajs/medusa/commit/b8ddb31f6fe296a11d2d988276ba8e991c37fa9b) Thanks [@adrien2p](https://github.com/adrien2p)! - Move search indexing into a separate subscriber to defer the work load

* [#1852](https://github.com/medusajs/medusa/pull/1852) [`dafbfa779`](https://github.com/medusajs/medusa/commit/dafbfa7799410a95f9a1ca02d1db718d1f8693eb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - When marking a Draft Order as paid, we should generate tax lines before completing it

- [#1873](https://github.com/medusajs/medusa/pull/1873) [`df6637853`](https://github.com/medusajs/medusa/commit/df66378535727152bb329c71c38d614e5b642599) Thanks [@adrien2p](https://github.com/adrien2p)! - Adds support for:
  - Attaching Sales Channel to cart as part of creation
  - Updating Sales Channel on a cart and removing inapplicable line items

* [#1843](https://github.com/medusajs/medusa/pull/1843) [`716297231`](https://github.com/medusajs/medusa/commit/71629723185739a97fc2cf8eaa9029f7963bb120) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Fixes free text search for PriceList Products

- [#1884](https://github.com/medusajs/medusa/pull/1884) [`0e0b13148`](https://github.com/medusajs/medusa/commit/0e0b13148892b073a1b46900c6eb1b0d8e05cc37) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Expand store result to include default sales channel

* [#1851](https://github.com/medusajs/medusa/pull/1851) [`c148064b4`](https://github.com/medusajs/medusa/commit/c148064b4abdc4447d8216a6de0a6ce84e3a061c) Thanks [@srindom](https://github.com/srindom)! - Allow an array of region ids in list orders endpoint

* Updated dependencies [[`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68), [`b8ddb31f6`](https://github.com/medusajs/medusa/commit/b8ddb31f6fe296a11d2d988276ba8e991c37fa9b)]:
  - medusa-interfaces@1.3.2

## 1.3.4

### Patch Changes

- [#1819](https://github.com/medusajs/medusa/pull/1819) [`3e197e3a`](https://github.com/medusajs/medusa/commit/3e197e3adf0bcd39cdcf30c7dda381cc4b7ac779) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add feature flags to store response

* [#1807](https://github.com/medusajs/medusa/pull/1807) [`39f2c0c1`](https://github.com/medusajs/medusa/commit/39f2c0c15ee05b5b6941ea2ef16f0b4b1512ce4f) Thanks [@srindom](https://github.com/srindom)! - Calculates correct taxes and totals on line items when carts and orders have gift cards

- [#1812](https://github.com/medusajs/medusa/pull/1812) [`4d15e01c`](https://github.com/medusajs/medusa/commit/4d15e01c3ebbc341113505d3c2f60c0e082943ae) Thanks [@srindom](https://github.com/srindom)! - Calculate orders correctly when creating fulfillments by adding adjustments

* [#1825](https://github.com/medusajs/medusa/pull/1825) [`fb82d3dd`](https://github.com/medusajs/medusa/commit/fb82d3dd221efeba5b0110bd00908faecbdb30d7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - - Add migration that ensures the correct state of the batch job table regardless of previous migrations

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.3.3](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.3.2...@medusajs/medusa@1.3.3) (2022-07-05)

### Bug Fixes

- introduce listAndCount for gift cards to enable pagination ([#1754](https://github.com/medusajs/medusa/issues/1754)) ([9a14b84](https://github.com/medusajs/medusa/commit/9a14b84e58a7db2b38edaf9ce59dcb4416736c30))
- **medusa:** Remove deps `mongoose` + `mongodb` ([#1218](https://github.com/medusajs/medusa/issues/1218)) ([c76e23e](https://github.com/medusajs/medusa/commit/c76e23e84dd8cb08c3c709f9f95c4c17b9685439))
- add shipping taxes ([#1759](https://github.com/medusajs/medusa/issues/1759)) ([fee0f88](https://github.com/medusajs/medusa/commit/fee0f88a62d7e00c844fcd021d090f130ab4a532))
- **medusa:** Add images relation ([#1693](https://github.com/medusajs/medusa/issues/1693)) ([765c794](https://github.com/medusajs/medusa/commit/765c794b9775a12fffbed59a6312beb87442dc1a))
- **medusa:** Normalizes email before saving customer ([#1719](https://github.com/medusajs/medusa/issues/1719)) ([2a32609](https://github.com/medusajs/medusa/commit/2a32609b7458c12f047d3f9ba45d426fdc784d58))
- **medusa:** Plugin loader must also check for TransactionBaseService ([#1601](https://github.com/medusajs/medusa/issues/1601)) ([28ddf10](https://github.com/medusajs/medusa/commit/28ddf10446e689a32bf9d4d05dedd4aa090d66a0))
- **medusa:** Product export strategy ([#1713](https://github.com/medusajs/medusa/issues/1713)) ([89cb717](https://github.com/medusajs/medusa/commit/89cb7174613ffbced8abb3a7e8a4539134bd867c))
- **medusa:** Remove duplicate DiscountRuleType import ([#1699](https://github.com/medusajs/medusa/issues/1699)) ([46a6e1a](https://github.com/medusajs/medusa/commit/46a6e1a4d368241288d50cdd0aa35ac7dbf14764))
- **medusa:** update cron schedule to be every 6 hours ([#1658](https://github.com/medusajs/medusa/issues/1658)) ([cffb03d](https://github.com/medusajs/medusa/commit/cffb03d1978b6fe019007f9c7683b67171300255))
- adds tax calculation to product pricing ([#1354](https://github.com/medusajs/medusa/issues/1354)) ([14366f5](https://github.com/medusajs/medusa/commit/14366f536decc88546658e23521961a82409e842))
- includes variant prices when listing products using a search query ([#1607](https://github.com/medusajs/medusa/issues/1607)) ([247ad6d](https://github.com/medusajs/medusa/commit/247ad6dc6d7f55bdec5d9d1b59f96c380dbba9c9))

### Features

- add customer to fetch-draft-order payload ([#1444](https://github.com/medusajs/medusa/issues/1444)) ([3fb74bf](https://github.com/medusajs/medusa/commit/3fb74bf512644c4dc45615a608f27650a95fa791))
- **medusa:** Add batch strategy for order exports ([#1603](https://github.com/medusajs/medusa/issues/1603)) ([bf47d1a](https://github.com/medusajs/medusa/commit/bf47d1aecd74f4489667609444a8b09393e894d3))
- **medusa:** Add file size calculation for product export ([#1726](https://github.com/medusajs/medusa/issues/1726)) ([fb7abbf](https://github.com/medusajs/medusa/commit/fb7abbf40784dcc66dbde25d400f3af54141c237))
- **medusa:** Add line item totals to cart totals decoration ([#1740](https://github.com/medusajs/medusa/issues/1740)) ([c6dc908](https://github.com/medusajs/medusa/commit/c6dc9086cfa272db0c1a7f98f670bd3ed8ccfa78))
- **medusa:** Allow to filter the batch jobs with nullable date ([#1747](https://github.com/medusajs/medusa/issues/1747)) ([c0f624a](https://github.com/medusajs/medusa/commit/c0f624ad3b8ae507438c0c84d867dc19904f08ae))
- **medusa:** Apply query transformers to Collection and CustomerGroups ([#1667](https://github.com/medusajs/medusa/issues/1667)) ([e53c06e](https://github.com/medusajs/medusa/commit/e53c06eab8a37579f33c547d0373edc082cc308b))
- **medusa:** BatchJobStrategy and loaders ([#1434](https://github.com/medusajs/medusa/issues/1434)) ([886dcbc](https://github.com/medusajs/medusa/commit/886dcbc82fc5ec784e699ddf7b18f710535fdada))
- **medusa:** Convert GiftCardService to Typescript ([#1664](https://github.com/medusajs/medusa/issues/1664)) ([1585b7a](https://github.com/medusajs/medusa/commit/1585b7ae2b063adad9c22f6aac9d1e426ccac29f))
- **medusa:** Delete and download url endpoints ([#1705](https://github.com/medusajs/medusa/issues/1705)) ([cc29b64](https://github.com/medusajs/medusa/commit/cc29b641c9358415b46179371988e7ddc11d2664))
- **medusa:** Extend file-service interface + move to core ([#1577](https://github.com/medusajs/medusa/issues/1577)) ([8e42d37](https://github.com/medusajs/medusa/commit/8e42d37e84e80c003b9c0311117ab8a8871aa61b))
- **medusa:** Migrate utils to TS ([#1415](https://github.com/medusajs/medusa/issues/1415)) ([d98cd85](https://github.com/medusajs/medusa/commit/d98cd85d2370f179044ddfec43479dc7cdcc39bd))
- **medusa:** Parsing CSV files ([#1572](https://github.com/medusajs/medusa/issues/1572)) ([9e686a8](https://github.com/medusajs/medusa/commit/9e686a8e47c567ffdb57bb43af796dd38049294f))
- **medusa:** Support batch-job API ([#1547](https://github.com/medusajs/medusa/issues/1547)) ([4536886](https://github.com/medusajs/medusa/commit/453688682c79032737ea47197c00ea14e84aab02)), closes [#1434](https://github.com/medusajs/medusa/issues/1434) [#1548](https://github.com/medusajs/medusa/issues/1548) [#1453](https://github.com/medusajs/medusa/issues/1453)
- **medusa:** Support transformQuery/Body middleware, introduction of pipe feature ([#1593](https://github.com/medusajs/medusa/issues/1593)) ([3359e18](https://github.com/medusajs/medusa/commit/3359e189a70533692f85fbbff9b09018872abbf4))
- **medusa:** Update BuildQuery typings ([#1672](https://github.com/medusajs/medusa/issues/1672)) ([93aaaa7](https://github.com/medusajs/medusa/commit/93aaaa71bd07ba0675be05ea503580f3e9ec6806))
- **medusa-cli:** Allow to revert migrations from the CLI ([#1353](https://github.com/medusajs/medusa/issues/1353)) ([012513b](https://github.com/medusajs/medusa/commit/012513b6a1e90169e9e0e53f7a59841a34fbaeb3))
- **medusa,medusa-js,medusa-react:** Add BatchJob API support in `medusa-js` + `medusa-react` ([#1704](https://github.com/medusajs/medusa/issues/1704)) ([7302d76](https://github.com/medusajs/medusa/commit/7302d76e12683c989f340d2fcfaf4338dca6554a))
- **medusa/product-export-strategy:** Implement the Product export strategy ([#1688](https://github.com/medusajs/medusa/issues/1688)) ([7b09b8c](https://github.com/medusajs/medusa/commit/7b09b8c36cf8777ee874deed795bc98ba6653aa8))

## [1.3.2](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.3.0...@medusajs/medusa@1.3.2) (2022-06-19)

### Bug Fixes

- **medisa:** Deleting price list should use `remove` ([#1540](https://github.com/medusajs/medusa/issues/1540)) ([f0ecef6](https://github.com/medusajs/medusa/commit/f0ecef6b9ae878e83be0efaf13d6f3fef5d48e3a))
- **medusa:** `AddressPayload` typing and removes Joi validation from CustomerService ([#1520](https://github.com/medusajs/medusa/issues/1520)) ([8dd27ec](https://github.com/medusajs/medusa/commit/8dd27ecb7e1de70e84ed5332ea329827473c00aa))
- **medusa:** add `q` param to `listAndCount` product types and product tags ([#1531](https://github.com/medusajs/medusa/issues/1531)) ([46d9e6c](https://github.com/medusajs/medusa/commit/46d9e6c44cea190baf56874f86fe4a5e692b9a44))
- **medusa:** Allow de-selecting configurations in price lists ([#1596](https://github.com/medusajs/medusa/issues/1596)) ([3f23ede](https://github.com/medusajs/medusa/commit/3f23edea2314da5edd477280eeb93727500f7b84))
- **medusa:** allow price list `prices` update when `region_id` is provided ([#1472](https://github.com/medusajs/medusa/issues/1472)) ([03c5617](https://github.com/medusajs/medusa/commit/03c5617896d08b354932a470cadd9d36508f9d40))
- **medusa:** applicableness of discounts with conditions not related to customer groups ([#1534](https://github.com/medusajs/medusa/issues/1534)) ([a10ac19](https://github.com/medusajs/medusa/commit/a10ac19d8e12f8c1c69020ca9e09e7c4739a740c))
- **medusa:** CartService fix discounts empty array check on update ([#1516](https://github.com/medusajs/medusa/issues/1516)) ([e31fe4a](https://github.com/medusajs/medusa/commit/e31fe4af163ebd94eefaaa61e519607ec04c5622))
- **medusa:** CartService lost shipping address when using the id ([c442be4](https://github.com/medusajs/medusa/commit/c442be47d4a0b4cf3b46ce604b05e16424544046))
- **medusa:** discount types across model, service and api ([#1545](https://github.com/medusajs/medusa/issues/1545)) ([2f08167](https://github.com/medusajs/medusa/commit/2f08167480e23f64590d85c098ea6a18ad2d0270))
- **medusa:** Include adjustments in cart retrieval relations in setPaymentSessions ([#1518](https://github.com/medusajs/medusa/issues/1518)) ([02eab5e](https://github.com/medusajs/medusa/commit/02eab5ee86b92d8dfa6346b09d2353659c064b42))
- **medusa:** Include adjustments when authorizing payment ([#1697](https://github.com/medusajs/medusa/issues/1697)) ([6b23208](https://github.com/medusajs/medusa/commit/6b23208d63c6928a0587176bc3a6e40091922151))
- **medusa:** MoneyAmountRepository#findManyForVariantInRegion sql statement for constraint related to price_list ([#1462](https://github.com/medusajs/medusa/issues/1462)) ([3c75a65](https://github.com/medusajs/medusa/commit/3c75a657924938f2aeda8cca7ad84a1971629ee0))
- **medusa:** PluginLoaders when loading services should only look for js files ([#1473](https://github.com/medusajs/medusa/issues/1473)) ([c67d6be](https://github.com/medusajs/medusa/commit/c67d6bee303ad8e43f320fe16f807b0d22890c5b))
- **medusa:** Post /admin/discounts/:id not updating condition operator ([#1573](https://github.com/medusajs/medusa/issues/1573)) ([5414148](https://github.com/medusajs/medusa/commit/5414148254de9b54c0c292e9348f524f15334b96))
- **medusa:** Prevent discount type updates ([#1584](https://github.com/medusajs/medusa/issues/1584)) ([083ab09](https://github.com/medusajs/medusa/commit/083ab09361271e48fd39a7d60f2ca3e172c20b23))
- **medusa:** Proper fix of the cart service ([f5edaf5](https://github.com/medusajs/medusa/commit/f5edaf51ea2d49d662b00f7a5360449cf827d825))
- **medusa:** Remove line-item.js file ([#1414](https://github.com/medusajs/medusa/issues/1414)) ([9087029](https://github.com/medusajs/medusa/commit/90870292c62e2e96ca8c9ffc51e32c73493e0c0b))
- **medusa:** RMA on items from swaps and claims ([#1182](https://github.com/medusajs/medusa/issues/1182)) ([5ae5f15](https://github.com/medusajs/medusa/commit/5ae5f15e9883786eb5759b49b98b858822e72a96))
- **medusa:** support searching for price lists ([#1407](https://github.com/medusajs/medusa/issues/1407)) ([f71b9b3](https://github.com/medusajs/medusa/commit/f71b9b3a8733fdcfe4298fcf49fd06ae89850fc2))
- **medusa:** Use boolean on list shipping options params ([#1493](https://github.com/medusajs/medusa/issues/1493)) ([7605963](https://github.com/medusajs/medusa/commit/7605963ded737514e2328bb0d1fb9814c14b84a9))
- Cascade remove prices + option values on variant and product delete ([#1465](https://github.com/medusajs/medusa/issues/1465)) ([e7cb76a](https://github.com/medusajs/medusa/commit/e7cb76ab6e13fe756e090fd1a0a3ff645c30c69a))
- Use correct product price when fetching product for pricelist ([#1416](https://github.com/medusajs/medusa/issues/1416)) ([e2d0831](https://github.com/medusajs/medusa/commit/e2d08316dd03946453c5bf39c78a141d9fd57d3c))
- **medusa-cli:** allow spaces in develop command ([#1430](https://github.com/medusajs/medusa/issues/1430)) ([2260c2d](https://github.com/medusajs/medusa/commit/2260c2d09ec057d62b548c55142273e86eda1ca0))

### Features

- **medusa:** Add /admin/products/:id/variants end point ([#1471](https://github.com/medusajs/medusa/issues/1471)) ([edeac8a](https://github.com/medusajs/medusa/commit/edeac8ac720e139216bb8d9fe0b6c3df28dadc75))
- **medusa:** Add endpoint for retrieving a DiscountCondition ([#1525](https://github.com/medusajs/medusa/issues/1525)) ([a87e1cd](https://github.com/medusajs/medusa/commit/a87e1cdf6558fd56bd91540853ca0bb715eda46e))
- **medusa:** Add endpoints specific to DiscountConditions ([#1355](https://github.com/medusajs/medusa/issues/1355)) ([9ca45ea](https://github.com/medusajs/medusa/commit/9ca45ea492e755a88737322f900d60abdfa64024))
- **medusa:** Add writable type ([1499bc5](https://github.com/medusajs/medusa/commit/1499bc52e36616ca9d67fd55bf5965478dff390f))
- **medusa:** Export BaseEntity/SoftDeletableEntity from the core ([#1594](https://github.com/medusajs/medusa/issues/1594)) ([d0c679f](https://github.com/medusajs/medusa/commit/d0c679fc7ef318481bd767d50e91e2523e6f674d))
- **medusa:** Export transaction related methods to the transactionBaseService ([99146b7](https://github.com/medusajs/medusa/commit/99146b74037b89c6893c97e77e43a1aaf1c2a3d4))
- **medusa:** Improve base-service ([bfb81b8](https://github.com/medusajs/medusa/commit/bfb81b8b32fbba538010221f1a30fcc31aaa691e))
- **medusa:** Improve buildQuery as well as refactor the cart service as an example ([b90291b](https://github.com/medusajs/medusa/commit/b90291b18d438e3bb7f5239f4470eec7b3c5ff03))
- **medusa:** List batch jobs + Introduce composable handler pattern ([#1541](https://github.com/medusajs/medusa/issues/1541)) ([4489b75](https://github.com/medusajs/medusa/commit/4489b75f5ad669b7a53023e9afb07fb11dcb89d3))
- **medusa:** Move some typings into the common types ([3ad9174](https://github.com/medusajs/medusa/commit/3ad91741b2e729638902d7c62ac99fdfe9a40b91))
- **medusa:** Rename base-service.spec to transaction-base-service.spec ([f7ef3aa](https://github.com/medusajs/medusa/commit/f7ef3aac36ed3053c8880522cc95bb046c03ebda))
- **medusa:** Split base service to its related TransactionBaseService and utilities methods when required ([e7e715a](https://github.com/medusajs/medusa/commit/e7e715ac177bd0b883ffa0d72a208580012bfbab))
- **medusa:** Support deleting prices from a price list by product or variant ([#1555](https://github.com/medusajs/medusa/issues/1555)) ([fa031fd](https://github.com/medusajs/medusa/commit/fa031fd28be8b12ff38eaec6e56c373324e0beed))
- **medusa:** Update TransactionBaseService methods visibility ([ff9ff21](https://github.com/medusajs/medusa/commit/ff9ff214873a14b3b0abc419f53838b8d728eea9))

## [1.3.1](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.3.0...@medusajs/medusa@1.3.1) (2022-05-31)

### Bug Fixes

- **medisa:** Deleting price list should use `remove` ([#1540](https://github.com/medusajs/medusa/issues/1540)) ([f0ecef6](https://github.com/medusajs/medusa/commit/f0ecef6b9ae878e83be0efaf13d6f3fef5d48e3a))
- **medusa:** `AddressPayload` typing and removes Joi validation from CustomerService ([#1520](https://github.com/medusajs/medusa/issues/1520)) ([8dd27ec](https://github.com/medusajs/medusa/commit/8dd27ecb7e1de70e84ed5332ea329827473c00aa))
- **medusa:** add `q` param to `listAndCount` product types and product tags ([#1531](https://github.com/medusajs/medusa/issues/1531)) ([46d9e6c](https://github.com/medusajs/medusa/commit/46d9e6c44cea190baf56874f86fe4a5e692b9a44))
- **medusa:** Allow de-selecting configurations in price lists ([#1596](https://github.com/medusajs/medusa/issues/1596)) ([3f23ede](https://github.com/medusajs/medusa/commit/3f23edea2314da5edd477280eeb93727500f7b84))
- **medusa:** allow price list `prices` update when `region_id` is provided ([#1472](https://github.com/medusajs/medusa/issues/1472)) ([03c5617](https://github.com/medusajs/medusa/commit/03c5617896d08b354932a470cadd9d36508f9d40))
- **medusa:** applicableness of discounts with conditions not related to customer groups ([#1534](https://github.com/medusajs/medusa/issues/1534)) ([a10ac19](https://github.com/medusajs/medusa/commit/a10ac19d8e12f8c1c69020ca9e09e7c4739a740c))
- **medusa:** CartService fix discounts empty array check on update ([#1516](https://github.com/medusajs/medusa/issues/1516)) ([e31fe4a](https://github.com/medusajs/medusa/commit/e31fe4af163ebd94eefaaa61e519607ec04c5622))
- **medusa:** CartService lost shipping address when using the id ([c442be4](https://github.com/medusajs/medusa/commit/c442be47d4a0b4cf3b46ce604b05e16424544046))
- **medusa:** discount types across model, service and api ([#1545](https://github.com/medusajs/medusa/issues/1545)) ([2f08167](https://github.com/medusajs/medusa/commit/2f08167480e23f64590d85c098ea6a18ad2d0270))
- **medusa:** Include adjustments in cart retrieval relations in setPaymentSessions ([#1518](https://github.com/medusajs/medusa/issues/1518)) ([02eab5e](https://github.com/medusajs/medusa/commit/02eab5ee86b92d8dfa6346b09d2353659c064b42))
- **medusa:** MoneyAmountRepository#findManyForVariantInRegion sql statement for constraint related to price_list ([#1462](https://github.com/medusajs/medusa/issues/1462)) ([3c75a65](https://github.com/medusajs/medusa/commit/3c75a657924938f2aeda8cca7ad84a1971629ee0))
- **medusa:** PluginLoaders when loading services should only look for js files ([#1473](https://github.com/medusajs/medusa/issues/1473)) ([c67d6be](https://github.com/medusajs/medusa/commit/c67d6bee303ad8e43f320fe16f807b0d22890c5b))
- **medusa:** Post /admin/discounts/:id not updating condition operator ([#1573](https://github.com/medusajs/medusa/issues/1573)) ([5414148](https://github.com/medusajs/medusa/commit/5414148254de9b54c0c292e9348f524f15334b96))
- **medusa:** Prevent discount type updates ([#1584](https://github.com/medusajs/medusa/issues/1584)) ([083ab09](https://github.com/medusajs/medusa/commit/083ab09361271e48fd39a7d60f2ca3e172c20b23))
- **medusa:** Proper fix of the cart service ([f5edaf5](https://github.com/medusajs/medusa/commit/f5edaf51ea2d49d662b00f7a5360449cf827d825))
- **medusa:** Remove line-item.js file ([#1414](https://github.com/medusajs/medusa/issues/1414)) ([9087029](https://github.com/medusajs/medusa/commit/90870292c62e2e96ca8c9ffc51e32c73493e0c0b))
- **medusa:** RMA on items from swaps and claims ([#1182](https://github.com/medusajs/medusa/issues/1182)) ([5ae5f15](https://github.com/medusajs/medusa/commit/5ae5f15e9883786eb5759b49b98b858822e72a96))
- **medusa:** support searching for price lists ([#1407](https://github.com/medusajs/medusa/issues/1407)) ([f71b9b3](https://github.com/medusajs/medusa/commit/f71b9b3a8733fdcfe4298fcf49fd06ae89850fc2))
- **medusa:** Use boolean on list shipping options params ([#1493](https://github.com/medusajs/medusa/issues/1493)) ([7605963](https://github.com/medusajs/medusa/commit/7605963ded737514e2328bb0d1fb9814c14b84a9))
- Cascade remove prices + option values on variant and product delete ([#1465](https://github.com/medusajs/medusa/issues/1465)) ([e7cb76a](https://github.com/medusajs/medusa/commit/e7cb76ab6e13fe756e090fd1a0a3ff645c30c69a))
- Use correct product price when fetching product for pricelist ([#1416](https://github.com/medusajs/medusa/issues/1416)) ([e2d0831](https://github.com/medusajs/medusa/commit/e2d08316dd03946453c5bf39c78a141d9fd57d3c))
- **medusa-cli:** allow spaces in develop command ([#1430](https://github.com/medusajs/medusa/issues/1430)) ([2260c2d](https://github.com/medusajs/medusa/commit/2260c2d09ec057d62b548c55142273e86eda1ca0))

### Features

- **medusa:** Add /admin/products/:id/variants end point ([#1471](https://github.com/medusajs/medusa/issues/1471)) ([edeac8a](https://github.com/medusajs/medusa/commit/edeac8ac720e139216bb8d9fe0b6c3df28dadc75))
- **medusa:** Add endpoint for retrieving a DiscountCondition ([#1525](https://github.com/medusajs/medusa/issues/1525)) ([a87e1cd](https://github.com/medusajs/medusa/commit/a87e1cdf6558fd56bd91540853ca0bb715eda46e))
- **medusa:** Add endpoints specific to DiscountConditions ([#1355](https://github.com/medusajs/medusa/issues/1355)) ([9ca45ea](https://github.com/medusajs/medusa/commit/9ca45ea492e755a88737322f900d60abdfa64024))
- **medusa:** Add writable type ([1499bc5](https://github.com/medusajs/medusa/commit/1499bc52e36616ca9d67fd55bf5965478dff390f))
- **medusa:** Export BaseEntity/SoftDeletableEntity from the core ([#1594](https://github.com/medusajs/medusa/issues/1594)) ([d0c679f](https://github.com/medusajs/medusa/commit/d0c679fc7ef318481bd767d50e91e2523e6f674d))
- **medusa:** Export transaction related methods to the transactionBaseService ([99146b7](https://github.com/medusajs/medusa/commit/99146b74037b89c6893c97e77e43a1aaf1c2a3d4))
- **medusa:** Improve base-service ([bfb81b8](https://github.com/medusajs/medusa/commit/bfb81b8b32fbba538010221f1a30fcc31aaa691e))
- **medusa:** Improve buildQuery as well as refactor the cart service as an example ([b90291b](https://github.com/medusajs/medusa/commit/b90291b18d438e3bb7f5239f4470eec7b3c5ff03))
- **medusa:** List batch jobs + Introduce composable handler pattern ([#1541](https://github.com/medusajs/medusa/issues/1541)) ([4489b75](https://github.com/medusajs/medusa/commit/4489b75f5ad669b7a53023e9afb07fb11dcb89d3))
- **medusa:** Move some typings into the common types ([3ad9174](https://github.com/medusajs/medusa/commit/3ad91741b2e729638902d7c62ac99fdfe9a40b91))
- **medusa:** Rename base-service.spec to transaction-base-service.spec ([f7ef3aa](https://github.com/medusajs/medusa/commit/f7ef3aac36ed3053c8880522cc95bb046c03ebda))
- **medusa:** Split base service to its related TransactionBaseService and utilities methods when required ([e7e715a](https://github.com/medusajs/medusa/commit/e7e715ac177bd0b883ffa0d72a208580012bfbab))
- **medusa:** Support deleting prices from a price list by product or variant ([#1555](https://github.com/medusajs/medusa/issues/1555)) ([fa031fd](https://github.com/medusajs/medusa/commit/fa031fd28be8b12ff38eaec6e56c373324e0beed))
- **medusa:** Update TransactionBaseService methods visibility ([ff9ff21](https://github.com/medusajs/medusa/commit/ff9ff214873a14b3b0abc419f53838b8d728eea9))

# [1.3.0](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.2.1...@medusajs/medusa@1.3.0) (2022-05-01)

### Bug Fixes

- Invoke canCalculate with an entire shipping option ([#1397](https://github.com/medusajs/medusa/issues/1397)) ([40b63d0](https://github.com/medusajs/medusa/commit/40b63d092a50fea1f86af140d94b3c9c38f00658))
- Update `is_giftcard` type when filtering products ([#1427](https://github.com/medusajs/medusa/issues/1427)) ([f7386bf](https://github.com/medusajs/medusa/commit/f7386bf4b3c89363ae5ef15bd577a74b54345457))
- **medusa:** Lint and missing transaction usage ([#1297](https://github.com/medusajs/medusa/issues/1297)) ([ab2d81f](https://github.com/medusajs/medusa/commit/ab2d81f7865a7d660459f27d81ea6aa79cbebda6))
- **medusa:** Remove unsupported Discount endpoints ([#1367](https://github.com/medusajs/medusa/issues/1367)) ([9acee27](https://github.com/medusajs/medusa/commit/9acee2799ead683575edd0f7172f336878569dfe))
- **medusa:** Remove updatePaymentMethod store cart route ([#1382](https://github.com/medusajs/medusa/issues/1382)) ([89a6de4](https://github.com/medusajs/medusa/commit/89a6de466020e35c6feab9ca9e06486ad76c2a53))
- add tax service registration ([#1225](https://github.com/medusajs/medusa/issues/1225)) ([491b6eb](https://github.com/medusajs/medusa/commit/491b6eba2d1388c498583c232d3506f7775c8968))
- adds date filters on store collection + region list api ([#1216](https://github.com/medusajs/medusa/issues/1216)) ([3cd4108](https://github.com/medusajs/medusa/commit/3cd4108915bca2889550c18c5c2fc95b8300d520))
- allow offset and limit in products free text search ([#1082](https://github.com/medusajs/medusa/issues/1082)) ([c2241d1](https://github.com/medusajs/medusa/commit/c2241d110178d9ed992793d582ef652c4a23b729))
- ensures no duplicate tax lines when completing cart ([#1262](https://github.com/medusajs/medusa/issues/1262)) ([607a382](https://github.com/medusajs/medusa/commit/607a382b4ee190c25eafa345674b55b74a7d6349))
- exists flag on /store/auth/:email endpoint ([#1122](https://github.com/medusajs/medusa/issues/1122)) ([e844f4a](https://github.com/medusajs/medusa/commit/e844f4a5b72317ea4990c6e83501e168aba0c257))
- export params type ([4ee2af2](https://github.com/medusajs/medusa/commit/4ee2af2582d6c6420e7faf238447b77499e5d32d))
- export request types from add and remove product endpoints ([#1078](https://github.com/medusajs/medusa/issues/1078)) ([449e666](https://github.com/medusajs/medusa/commit/449e6664283edc2bce42b97b9d52def1841a9a18))
- list customers query error ([#1226](https://github.com/medusajs/medusa/issues/1226)) ([932f4b2](https://github.com/medusajs/medusa/commit/932f4b29a8506125f88f814a36d6d622ce56ceaf))
- merge conflicts ([562a1b4](https://github.com/medusajs/medusa/commit/562a1b427a6aeb634fbc8b1a6d023c451ca2cd62))
- Remove `region_id` from countries on region deletes ([#1330](https://github.com/medusajs/medusa/issues/1330)) ([edc6d9d](https://github.com/medusajs/medusa/commit/edc6d9d29c61924a476a1e83742508a2b7dcda08))
- storefront product filtering ([#1189](https://github.com/medusajs/medusa/issues/1189)) ([e3655b5](https://github.com/medusajs/medusa/commit/e3655b53f7b220f6dc270b5cdd3052579a573ba5))
- unit test case for `CustomerGroupServiceMock.retrieve` ([def8763](https://github.com/medusajs/medusa/commit/def8763ee203c60728815ef3d36e57b5533b97c8))
- variant price update ([#1093](https://github.com/medusajs/medusa/issues/1093)) ([cb7b211](https://github.com/medusajs/medusa/commit/cb7b211c9bb3188ecf072fa1734055a4ddfe7f86))

### Features

- line item adjustment migration script ([#1255](https://github.com/medusajs/medusa/issues/1255)) ([b8f1ae9](https://github.com/medusajs/medusa/commit/b8f1ae9ff5ce08d96f7b84fdb03071d5135ac243))
- **medusa:** Improve config loading ([#1290](https://github.com/medusajs/medusa/issues/1290)) ([313cb06](https://github.com/medusajs/medusa/commit/313cb0658bd58316ff57c3419d936c071f703f9b))
- **medusa:** Improve exported medusa API ([#1335](https://github.com/medusajs/medusa/issues/1335)) ([6830a12](https://github.com/medusajs/medusa/commit/6830a12b46335e65df974f0c1b2ad3904b04280f))
- add `extend` param for customer groups ([ecd6ed8](https://github.com/medusajs/medusa/commit/ecd6ed820e77904fe59ff6fcc9195533968dd9f3))
- add and remove products to/from collection in bulk endpoints ([#1032](https://github.com/medusajs/medusa/issues/1032)) ([6629403](https://github.com/medusajs/medusa/commit/66294038f0ccf0b81bcf099b590379acffb647ba))
- Add BatchJob entity ([#1324](https://github.com/medusajs/medusa/issues/1324)) ([8c420f4](https://github.com/medusajs/medusa/commit/8c420f42854ebbef77c5009265cdb0d0f642c1f4))
- Add DiscountConditions ([#1230](https://github.com/medusajs/medusa/issues/1230)) ([a610805](https://github.com/medusajs/medusa/commit/a610805917ee930d4cebde74905e541a468aa83b)), closes [#1146](https://github.com/medusajs/medusa/issues/1146) [#1149](https://github.com/medusajs/medusa/issues/1149) [#1156](https://github.com/medusajs/medusa/issues/1156) [#1170](https://github.com/medusajs/medusa/issues/1170) [#1172](https://github.com/medusajs/medusa/issues/1172) [#1212](https://github.com/medusajs/medusa/issues/1212) [#1224](https://github.com/medusajs/medusa/issues/1224) [#1228](https://github.com/medusajs/medusa/issues/1228)
- customer group update ([#1098](https://github.com/medusajs/medusa/issues/1098)) ([694e2df](https://github.com/medusajs/medusa/commit/694e2df20f8c1b125c51f7d24b1e3abdc4b3cff6))
- customer groups client endpoints ([#1147](https://github.com/medusajs/medusa/issues/1147)) ([93426bf](https://github.com/medusajs/medusa/commit/93426bfc0263b3a19e6d47e19cc498fea441fb30))
- GET customer group endpoint ([21d99a4](https://github.com/medusajs/medusa/commit/21d99a44a9fb2bd0f52c8bc8b5c75d200ef6d539))
- Implement PriceList and extend MoneyAmount ([#1152](https://github.com/medusajs/medusa/issues/1152)) ([5300926](https://github.com/medusajs/medusa/commit/5300926db87b61ccd38541eea529c838e7f065ea))
- line item adjustments ([#1319](https://github.com/medusajs/medusa/issues/1319)) ([1cfeb5d](https://github.com/medusajs/medusa/commit/1cfeb5dbd8c1ac0cbcef388ba1455e08965316bc)), closes [#1241](https://github.com/medusajs/medusa/issues/1241) [#1279](https://github.com/medusajs/medusa/issues/1279) [#1242](https://github.com/medusajs/medusa/issues/1242) [#1243](https://github.com/medusajs/medusa/issues/1243)
- list customer groups ([#1099](https://github.com/medusajs/medusa/issues/1099)) ([a514d84](https://github.com/medusajs/medusa/commit/a514d84ccf49cbb71fd57c2e4a3c7d245c89cc4b))
- new tax api ([#979](https://github.com/medusajs/medusa/issues/979)) ([c56660f](https://github.com/medusajs/medusa/commit/c56660fca9921a3f3637bc137d9794781c5b090f)), closes [#885](https://github.com/medusajs/medusa/issues/885) [#896](https://github.com/medusajs/medusa/issues/896) [#911](https://github.com/medusajs/medusa/issues/911) [#945](https://github.com/medusajs/medusa/issues/945) [#950](https://github.com/medusajs/medusa/issues/950) [#951](https://github.com/medusajs/medusa/issues/951) [#954](https://github.com/medusajs/medusa/issues/954) [#969](https://github.com/medusajs/medusa/issues/969) [#998](https://github.com/medusajs/medusa/issues/998) [#1017](https://github.com/medusajs/medusa/issues/1017) [#1110](https://github.com/medusajs/medusa/issues/1110)
- price list products ([#1239](https://github.com/medusajs/medusa/issues/1239)) ([fb33dba](https://github.com/medusajs/medusa/commit/fb33dbaca3f7a66f1f82481cd68f59d733a66a95))
- update customer groups ([#1075](https://github.com/medusajs/medusa/issues/1075)) ([75fb2ce](https://github.com/medusajs/medusa/commit/75fb2ce9c3a206a9d43cdbd80a356d9ba4d28f3f))

## [1.2.1](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.64...@medusajs/medusa@1.2.1) (2022-02-28)

### Bug Fixes

- Add tax repo to withTransaction in region service ([#1126](https://github.com/medusajs/medusa/issues/1126)) ([549ad3b](https://github.com/medusajs/medusa/commit/549ad3b907b27dd985157c4cb58d07162b1b739d))
- allow offset and limit in products free text search ([#1082](https://github.com/medusajs/medusa/issues/1082)) ([a81def2](https://github.com/medusajs/medusa/commit/a81def2f75a9fea4a113d2d2e92037c7ae0e4de6))
- export params type ([9d6489d](https://github.com/medusajs/medusa/commit/9d6489d7e24015cac399d687f38121edbc812487))
- export request types from add and remove product endpoints ([#1078](https://github.com/medusajs/medusa/issues/1078)) ([1f2ee04](https://github.com/medusajs/medusa/commit/1f2ee04abe9769cca9421cb9a3c96dce2eaac4cb))
- unit test case for `CustomerGroupServiceMock.retrieve` ([aa8bbfd](https://github.com/medusajs/medusa/commit/aa8bbfdd58240fc5b56cb79c0b5c3b4a834d937a))
- variant price update ([#1093](https://github.com/medusajs/medusa/issues/1093)) ([59d5d8a](https://github.com/medusajs/medusa/commit/59d5d8a185ad7035bdca89cf527509af1672e1c0))

### Features

- add `extend` param for customer groups ([bf3e04f](https://github.com/medusajs/medusa/commit/bf3e04f41ac3df14c7ecdb7355d7e2e0ec7cd8c0))
- add and remove products to/from collection in bulk endpoints ([#1032](https://github.com/medusajs/medusa/issues/1032)) ([1e4cc2f](https://github.com/medusajs/medusa/commit/1e4cc2fc80372613f26880c3cce3c9c1c0d1f2c6))
- customer group update ([#1098](https://github.com/medusajs/medusa/issues/1098)) ([d80eaa1](https://github.com/medusajs/medusa/commit/d80eaa172d9db928a2fee60a33a10032045ed74d))
- GET customer group endpoint ([de06b47](https://github.com/medusajs/medusa/commit/de06b47b15443aa3ec95028124fd65694921083f))
- new tax api ([#979](https://github.com/medusajs/medusa/issues/979)) ([47588e7](https://github.com/medusajs/medusa/commit/47588e7a8d3b2ae2fed0c1e87fdf1ee2db6bcdc2)), closes [#885](https://github.com/medusajs/medusa/issues/885) [#896](https://github.com/medusajs/medusa/issues/896) [#911](https://github.com/medusajs/medusa/issues/911) [#945](https://github.com/medusajs/medusa/issues/945) [#950](https://github.com/medusajs/medusa/issues/950) [#951](https://github.com/medusajs/medusa/issues/951) [#954](https://github.com/medusajs/medusa/issues/954) [#969](https://github.com/medusajs/medusa/issues/969) [#998](https://github.com/medusajs/medusa/issues/998) [#1017](https://github.com/medusajs/medusa/issues/1017) [#1110](https://github.com/medusajs/medusa/issues/1110)
- update customer groups ([#1075](https://github.com/medusajs/medusa/issues/1075)) ([73359a6](https://github.com/medusajs/medusa/commit/73359a632b2d65369b0db62d9e21979e5e26bea8))

# [1.2.0](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.64...@medusajs/medusa@1.2.0) (2022-02-25)

### Bug Fixes

- allow offset and limit in products free text search ([#1082](https://github.com/medusajs/medusa/issues/1082)) ([c2241d1](https://github.com/medusajs/medusa/commit/c2241d110178d9ed992793d582ef652c4a23b729))
- export params type ([4ee2af2](https://github.com/medusajs/medusa/commit/4ee2af2582d6c6420e7faf238447b77499e5d32d))
- export request types from add and remove product endpoints ([#1078](https://github.com/medusajs/medusa/issues/1078)) ([449e666](https://github.com/medusajs/medusa/commit/449e6664283edc2bce42b97b9d52def1841a9a18))
- unit test case for `CustomerGroupServiceMock.retrieve` ([def8763](https://github.com/medusajs/medusa/commit/def8763ee203c60728815ef3d36e57b5533b97c8))
- variant price update ([#1093](https://github.com/medusajs/medusa/issues/1093)) ([cb7b211](https://github.com/medusajs/medusa/commit/cb7b211c9bb3188ecf072fa1734055a4ddfe7f86))

### Features

- add `extend` param for customer groups ([ecd6ed8](https://github.com/medusajs/medusa/commit/ecd6ed820e77904fe59ff6fcc9195533968dd9f3))
- add and remove products to/from collection in bulk endpoints ([#1032](https://github.com/medusajs/medusa/issues/1032)) ([6629403](https://github.com/medusajs/medusa/commit/66294038f0ccf0b81bcf099b590379acffb647ba))
- customer group update ([#1098](https://github.com/medusajs/medusa/issues/1098)) ([694e2df](https://github.com/medusajs/medusa/commit/694e2df20f8c1b125c51f7d24b1e3abdc4b3cff6))
- GET customer group endpoint ([21d99a4](https://github.com/medusajs/medusa/commit/21d99a44a9fb2bd0f52c8bc8b5c75d200ef6d539))
- new tax api ([#979](https://github.com/medusajs/medusa/issues/979)) ([c56660f](https://github.com/medusajs/medusa/commit/c56660fca9921a3f3637bc137d9794781c5b090f)), closes [#885](https://github.com/medusajs/medusa/issues/885) [#896](https://github.com/medusajs/medusa/issues/896) [#911](https://github.com/medusajs/medusa/issues/911) [#945](https://github.com/medusajs/medusa/issues/945) [#950](https://github.com/medusajs/medusa/issues/950) [#951](https://github.com/medusajs/medusa/issues/951) [#954](https://github.com/medusajs/medusa/issues/954) [#969](https://github.com/medusajs/medusa/issues/969) [#998](https://github.com/medusajs/medusa/issues/998) [#1017](https://github.com/medusajs/medusa/issues/1017) [#1110](https://github.com/medusajs/medusa/issues/1110)
- update customer groups ([#1075](https://github.com/medusajs/medusa/issues/1075)) ([75fb2ce](https://github.com/medusajs/medusa/commit/75fb2ce9c3a206a9d43cdbd80a356d9ba4d28f3f))

## [1.1.64](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.63...@medusajs/medusa@1.1.64) (2022-02-06)

### Bug Fixes

- release ([fc3fbc8](https://github.com/medusajs/medusa/commit/fc3fbc897fad5c8a5d3eea828ac7277fba9d70af))

## [1.1.63](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.62...@medusajs/medusa@1.1.63) (2022-02-06)

### Bug Fixes

- adds order by functionality to products ([#1021](https://github.com/medusajs/medusa/issues/1021)) ([3bf32e5](https://github.com/medusajs/medusa/commit/3bf32e5dc9ad3150762b9bb744b0453d3640e204))
- adds return reasons to swaps ([#1026](https://github.com/medusajs/medusa/issues/1026)) ([7d2b5b8](https://github.com/medusajs/medusa/commit/7d2b5b8babea1846503c5934c9d81ce4d3b2635d))
- admin collections default relations ([#1023](https://github.com/medusajs/medusa/issues/1023)) ([d2a7534](https://github.com/medusajs/medusa/commit/d2a7534615b8870b235be136c8e6425c51dee19b))
- Support array of payment status filters when listing orders ([#1013](https://github.com/medusajs/medusa/issues/1013)) ([fdc493d](https://github.com/medusajs/medusa/commit/fdc493df7fdcb6fda35894ec5a3cc7990dc8ea13))
- Updating store currencies ([#984](https://github.com/medusajs/medusa/issues/984)) ([59bb413](https://github.com/medusajs/medusa/commit/59bb413245d8aa31cc3070a372d6f0d04ebc9415))

### Features

- medusa-react admin hooks ([#978](https://github.com/medusajs/medusa/issues/978)) ([2e38484](https://github.com/medusajs/medusa/commit/2e384842d5b2e9742a86b96f28a8f00357795b86)), closes [#1019](https://github.com/medusajs/medusa/issues/1019)

## [1.1.62](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.61...@medusajs/medusa@1.1.62) (2022-01-11)

### Bug Fixes

- Adds default currency to store currencies on create ([#982](https://github.com/medusajs/medusa/issues/982)) ([a0a21d1](https://github.com/medusajs/medusa/commit/a0a21d15efeda56d4245aa6937f4d67c673e5ab3))
- api claim types + tests ([#967](https://github.com/medusajs/medusa/issues/967)) ([d365839](https://github.com/medusajs/medusa/commit/d365839a086ba116f320b49880d621452ee4b301))
- Type in AdminProductListTagsRes to use tags instead of types ([#958](https://github.com/medusajs/medusa/issues/958)) ([0ac52b7](https://github.com/medusajs/medusa/commit/0ac52b70fa23d9aa3ba6b5e220943ed15db4e643))

### Features

- expand store product filtering ([#973](https://github.com/medusajs/medusa/issues/973)) ([f61eaee](https://github.com/medusajs/medusa/commit/f61eaeec12529919b74b64a35f26b6b42f24fa7b))

## [1.1.61](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.60...@medusajs/medusa@1.1.61) (2021-12-29)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.60](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.59...@medusajs/medusa@1.1.60) (2021-12-17)

### Features

- Add Discount Admin endpoint to JS client ([#919](https://github.com/medusajs/medusa/issues/919)) ([2ca1a87](https://github.com/medusajs/medusa/commit/2ca1a8762da5bc30a246e2e77521071ed91e6c12))
- add medusa-react ([#913](https://github.com/medusajs/medusa/issues/913)) ([d0d8dd7](https://github.com/medusajs/medusa/commit/d0d8dd7bf62eaac71df8714c2dfb4f204d192f51))
- add returns admin endpoints to medusa-js ([#935](https://github.com/medusajs/medusa/issues/935)) ([b9d6f95](https://github.com/medusajs/medusa/commit/b9d6f95dbd32c096e59057797fd0cf479ff23c7b))
- add store admin endpoints to medusa-js ([#938](https://github.com/medusajs/medusa/issues/938)) ([31fad74](https://github.com/medusajs/medusa/commit/31fad7439cc4b95e269e7b6bc5d813cb2479329c))
- Adds Auth Admin API to `medusa-js` ([#917](https://github.com/medusajs/medusa/issues/917)) ([5c47184](https://github.com/medusajs/medusa/commit/5c47184b1035fc36440ff95750a4bb461904246d))
- Adds Customer Admin routes to JS client ([#918](https://github.com/medusajs/medusa/issues/918)) ([25fe224](https://github.com/medusajs/medusa/commit/25fe224a10842a7ac93ed496a6724ef113b41916))
- medusa js admin regions ([#939](https://github.com/medusajs/medusa/issues/939)) ([8532c96](https://github.com/medusajs/medusa/commit/8532c966b59082ac60d221bc3bb7f92d6f94e5e4))
- medusa js admin shipping options ([#934](https://github.com/medusajs/medusa/issues/934)) ([8b1b551](https://github.com/medusajs/medusa/commit/8b1b551260c8f3764135ed65bd099b8e9a0f23da))
- medusa-js admin return reasons ([#931](https://github.com/medusajs/medusa/issues/931)) ([0acc462](https://github.com/medusajs/medusa/commit/0acc462e1ebe51368ceedeea85d6f51c6fc3bfc4))

## [1.1.59](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.58...@medusajs/medusa@1.1.59) (2021-12-08)

### Bug Fixes

- complete cart return type ([#902](https://github.com/medusajs/medusa/issues/902)) ([2e837fc](https://github.com/medusajs/medusa/commit/2e837fcdeeb1f9608c5b0c612c75c87c042d8286))

## [1.1.58](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.57...@medusajs/medusa@1.1.58) (2021-12-08)

### Bug Fixes

- create cart with items ([#851](https://github.com/medusajs/medusa/issues/851)) ([74bc9c6](https://github.com/medusajs/medusa/commit/74bc9c618f66fbb0c741b19ee46ea9db47f2e3c5))
- ensures that delayed restock notifications are being sent ([#881](https://github.com/medusajs/medusa/issues/881)) ([329767e](https://github.com/medusajs/medusa/commit/329767e27980253d456030dd5aad648662d39e3d))
- medusa-js complete cart types + oas comments ([#889](https://github.com/medusajs/medusa/issues/889)) ([487356a](https://github.com/medusajs/medusa/commit/487356a96ffc3886cf233e89e0b17dc3b6a665e5))
- **medusa:** migrate cart service to typescript ([#884](https://github.com/medusajs/medusa/issues/884)) ([ed04132](https://github.com/medusajs/medusa/commit/ed041325332e47c5939a301dfd8ace8ad6dbc28d))
- **medusa:** order tax_rate type ([#879](https://github.com/medusajs/medusa/issues/879)) ([89472b7](https://github.com/medusajs/medusa/commit/89472b7d88f930a12a2ac7a972ab7e15a0232ee1))
- refresh payment session oas comment ([#888](https://github.com/medusajs/medusa/issues/888)) ([efadffe](https://github.com/medusajs/medusa/commit/efadffe37a0d61f844e3aa6991f60ebb6a883e95))
- return reasons type ([#893](https://github.com/medusajs/medusa/issues/893)) ([e8b6d21](https://github.com/medusajs/medusa/commit/e8b6d2139dd167b0a46c7221a91e0b5bda3a89c6))
- widen range of discount limit conditions ([#895](https://github.com/medusajs/medusa/issues/895)) ([7d6fc5c](https://github.com/medusajs/medusa/commit/7d6fc5c9e18a1533f2dbf54a588fd3a71f07dcc2))

### Features

- Admin shipping options routes to Typescript ([#891](https://github.com/medusajs/medusa/issues/891)) ([6579c13](https://github.com/medusajs/medusa/commit/6579c13111b4bf5edb87380fdd701eb25dfef65d))
- medusa-source-shopify loader ([#563](https://github.com/medusajs/medusa/issues/563)) ([577bcc2](https://github.com/medusajs/medusa/commit/577bcc23d44c87b91b2b685fd4ddfc5d21a0aa47))

## [1.1.57](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.56...@medusajs/medusa@1.1.57) (2021-11-23)

### Bug Fixes

- bumps class-transformer to 0.5.1 ([#837](https://github.com/medusajs/medusa/issues/837)) ([38b0e29](https://github.com/medusajs/medusa/commit/38b0e295b23eccd281288d854d5876ff418de91d))

## [1.1.56](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.55...@medusajs/medusa@1.1.56) (2021-11-22)

### Bug Fixes

- Addresses breaking change from library `class-transformer` ([#835](https://github.com/medusajs/medusa/issues/835)) ([f387b49](https://github.com/medusajs/medusa/commit/f387b4919fb115b9f904b9ecb9f3bf30a89174ac))

## [1.1.55](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.52...@medusajs/medusa@1.1.55) (2021-11-19)

### Bug Fixes

- /api/routes/store/auth pass linting ([#645](https://github.com/medusajs/medusa/issues/645)) ([40ad748](https://github.com/medusajs/medusa/commit/40ad748cc3c38bad97690b83c3b4b19c6d6365c3))
- /api/routes/store/customers pass linting ([#646](https://github.com/medusajs/medusa/issues/646)) ([7cc94dc](https://github.com/medusajs/medusa/commit/7cc94dc479ee26df2d5a031bfeb9eb3709d03776))
- add product count to storefront ([#719](https://github.com/medusajs/medusa/issues/719)) ([45b344f](https://github.com/medusajs/medusa/commit/45b344fbe1a570620c4e47cf959bdb605fffddef))
- adds options to default relations in storefront product endpoints ([#712](https://github.com/medusajs/medusa/issues/712)) ([e82737a](https://github.com/medusajs/medusa/commit/e82737a03545f69a833d8329f52daef39cfca46d))
- api/routes/store/products pass linting ([#644](https://github.com/medusajs/medusa/issues/644)) ([2966242](https://github.com/medusajs/medusa/commit/2966242bc812f9e75f0bb9cca5662b66836fc6d8))
- delete region causes cascade error ([#672](https://github.com/medusajs/medusa/issues/672)) ([0a65eca](https://github.com/medusajs/medusa/commit/0a65eca3de4f339178315e88b4220bd92ebe2736))
- lint in packages/medusa/src/services/swap.js pass linting ([#587](https://github.com/medusajs/medusa/issues/587)) ([3156a0d](https://github.com/medusajs/medusa/commit/3156a0de31749c1f32d5bdfe2cf8f1a8044bb42e))
- make /api/routes/admin/gift-cards,routes/store/gift-cards,/routes/store/orders pass linting ([#643](https://github.com/medusajs/medusa/issues/643)) ([60e9432](https://github.com/medusajs/medusa/commit/60e943260b804efe1dec3e139e47180322e5b52e))
- make /swaps pass eslint ([#665](https://github.com/medusajs/medusa/issues/665)) ([623d5f2](https://github.com/medusajs/medusa/commit/623d5f2b6d3881e2334fa48be80928ab9340a7ce))
- make api/routes/admin/apps pass eslint ([#641](https://github.com/medusajs/medusa/issues/641)) ([c9234c2](https://github.com/medusajs/medusa/commit/c9234c2343e19b32b335b93f4fa53e54398a5fe6))
- make api/routes/store/swaps pass eslint ([#678](https://github.com/medusajs/medusa/issues/678)) ([d9ee127](https://github.com/medusajs/medusa/commit/d9ee1272841ef047cceb6047fc34b8e42b5f580f))
- make discounts pass eslint ([3df2b42](https://github.com/medusajs/medusa/commit/3df2b4279f363e746f3514d8d8aa78b0e8fa3906))
- make it possible to update order shipping address ([#668](https://github.com/medusajs/medusa/issues/668)) ([e0fa06f](https://github.com/medusajs/medusa/commit/e0fa06fe964b8000ca539efa875ed6c322f6d57b))
- make packages/medusa/src/api/routes/admin/auth and 3 others pass eslint ([#666](https://github.com/medusajs/medusa/issues/666)) ([95f80f8](https://github.com/medusajs/medusa/commit/95f80f8a6635d1cba74d3c7ccbf794809af2d0bb))
- make packages/medusa/src/api/routes/admin/notes pass eslint ([#690](https://github.com/medusajs/medusa/issues/690)) ([f011662](https://github.com/medusajs/medusa/commit/f01166272db7dc2d1b783223a7ea5c9e662a028b))
- make packages/medusa/src/api/routes/admin/orders pass eslint ([#649](https://github.com/medusajs/medusa/issues/649)) ([dc88210](https://github.com/medusajs/medusa/commit/dc8821095c65e73569bdda1c4a24762f7eb746fe))
- make packages/medusa/src/api/routes/admin/return-reasons pass eslint ([#654](https://github.com/medusajs/medusa/issues/654)) ([a8fc89a](https://github.com/medusajs/medusa/commit/a8fc89af066836224e4f760115d13ba85f89a359))
- make packages/medusa/src/api/routes/admin/returns pass eslint ([#653](https://github.com/medusajs/medusa/issues/653)) ([2f7deea](https://github.com/medusajs/medusa/commit/2f7deea1d0309b5a78d66b0dd0d3c2204717c02b))
- make packages/medusa/src/api/routes/admin/shipping-options pass eslint ([#674](https://github.com/medusajs/medusa/issues/674)) ([bd86d3c](https://github.com/medusajs/medusa/commit/bd86d3c995b27bae5c8d97a21eb900b6dd112068))
- make packages/medusa/src/api/routes/admin/shipping-profiles pass eslint ([#642](https://github.com/medusajs/medusa/issues/642)) ([ce4d361](https://github.com/medusajs/medusa/commit/ce4d3616d733b5472ebfc00b49ab17c5aa53daef))
- make packages/medusa/src/api/routes/admin/store pass eslint ([#686](https://github.com/medusajs/medusa/issues/686)) ([7a230ec](https://github.com/medusajs/medusa/commit/7a230ec7e96cae6628f9b68a41dc6da89559dfe9))
- make packages/medusa/src/api/routes/admin/upload pass eslint ([#627](https://github.com/medusajs/medusa/issues/627)) ([5fbce42](https://github.com/medusajs/medusa/commit/5fbce429489cba79340ae738c54a533bdc627a28))
- make packages/medusa/src/api/routes/admin/users pass eslint ([a6a612c](https://github.com/medusajs/medusa/commit/a6a612c941924722c51e389359393436655cfc65))
- make packages/medusa/src/api/routes/store/carts pass eslint ([#652](https://github.com/medusajs/medusa/issues/652)) ([1ba63cc](https://github.com/medusajs/medusa/commit/1ba63cce08d03edd47b3e651d60a34cf58d5c1e3))
- make packages/medusa/src/api/routes/store/shipping-options pass linting ([#648](https://github.com/medusajs/medusa/issues/648)) ([5cb1b56](https://github.com/medusajs/medusa/commit/5cb1b5687ee80448dfecd0c8ba683ccdfc6900fc))
- make packages/medusa/src/services/cart.js pass eslint ([#700](https://github.com/medusajs/medusa/issues/700)) ([0caba0d](https://github.com/medusajs/medusa/commit/0caba0d49113210af4f6d507e273e8b451a5eaaf))
- Make packages/medusa/src/services/claim-item.js pass linting ([#626](https://github.com/medusajs/medusa/issues/626)) ([0d30369](https://github.com/medusajs/medusa/commit/0d3036978a8203f9fb6e64a2bc82a19ef697db05))
- Make packages/medusa/src/services/oauth.js pass linting ([#604](https://github.com/medusajs/medusa/issues/604)) ([14608b0](https://github.com/medusajs/medusa/commit/14608b0f682e858ee38e4b996693962a25116749))
- make packages/medusa/src/services/payment-provider.js pass eslint ([#549](https://github.com/medusajs/medusa/issues/549)) ([caf4357](https://github.com/medusajs/medusa/commit/caf4357c4d1a2199ab1399dfabd18876dd0642c7)), closes [#692](https://github.com/medusajs/medusa/issues/692)
- Make packages/medusa/src/services/product-variant.js pass linting ([#693](https://github.com/medusajs/medusa/issues/693)) ([a351398](https://github.com/medusajs/medusa/commit/a3513983790eaf78285d32f1797d1d11eb446e5e))
- make packages/medusa/src/services/shipping-profile.js pass eslint ([#582](https://github.com/medusajs/medusa/issues/582)) ([2c415ea](https://github.com/medusajs/medusa/commit/2c415ea520ed700a0a474111b83021a699fbc851))
- make packages/medusa/src/services/totals.js pass eslint ([23e83af](https://github.com/medusajs/medusa/commit/23e83aff1cd858401fba42668f641270128068e1))
- make variants pass eslint ([a1e446c](https://github.com/medusajs/medusa/commit/a1e446c1214a79a799da46b3d1bdd62c64b99ebf))
- make variants pass eslint ([#647](https://github.com/medusajs/medusa/issues/647)) ([f4307c7](https://github.com/medusajs/medusa/commit/f4307c702a6c1420d1e344adc8b5ed880d9f1f8d))
- **medusa:** add total count for list queries in product ([#710](https://github.com/medusajs/medusa/issues/710)) ([109d400](https://github.com/medusajs/medusa/commit/109d4007204964f0a89759f48a6e2d5afc0b1dd9))
- Prepare routes for linting ([#603](https://github.com/medusajs/medusa/issues/603)) ([3e68069](https://github.com/medusajs/medusa/commit/3e68069a8959a2bf75f8639389cdd35b6a8058e7))
- release ([5fa4848](https://github.com/medusajs/medusa/commit/5fa4848b17a9dd432c2361e5d9485950494a2bc6))
- updates documentation and fixes script blockers ([#765](https://github.com/medusajs/medusa/issues/765)) ([3ea6aea](https://github.com/medusajs/medusa/commit/3ea6aea5beb2a50d1a3345fa3833eadb32d0a346))

### Features

- admin api - allow customers to be created and updated with metadata ([#824](https://github.com/medusajs/medusa/issues/824)) ([2d9879e](https://github.com/medusajs/medusa/commit/2d9879ea090898c08ad86a0ebc44d5b8965b5166))
- Algolia plugin for medusa ([#718](https://github.com/medusajs/medusa/issues/718)) ([8ce9b20](https://github.com/medusajs/medusa/commit/8ce9b20222e1f4db75f730898549f0ed09eb1574))
- Allow retrieval of soft-deleted products ([#723](https://github.com/medusajs/medusa/issues/723)) ([1e50aee](https://github.com/medusajs/medusa/commit/1e50aee4feb55092560dd4a9c51a0671363e8576))
- **medusa:** adds collection endpoints to storefront ([#711](https://github.com/medusajs/medusa/issues/711)) ([5812756](https://github.com/medusajs/medusa/commit/58127564d7110c674fb14fdd97fbc080afba156d))
- Typescript for API layer ([#817](https://github.com/medusajs/medusa/issues/817)) ([373532e](https://github.com/medusajs/medusa/commit/373532ecbc8196f47e71af95a8cf82a14a4b1f9e))

## [1.1.54](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.52...@medusajs/medusa@1.1.54) (2021-11-19)

### Bug Fixes

- /api/routes/store/auth pass linting ([#645](https://github.com/medusajs/medusa/issues/645)) ([40ad748](https://github.com/medusajs/medusa/commit/40ad748cc3c38bad97690b83c3b4b19c6d6365c3))
- /api/routes/store/customers pass linting ([#646](https://github.com/medusajs/medusa/issues/646)) ([7cc94dc](https://github.com/medusajs/medusa/commit/7cc94dc479ee26df2d5a031bfeb9eb3709d03776))
- add product count to storefront ([#719](https://github.com/medusajs/medusa/issues/719)) ([45b344f](https://github.com/medusajs/medusa/commit/45b344fbe1a570620c4e47cf959bdb605fffddef))
- adds options to default relations in storefront product endpoints ([#712](https://github.com/medusajs/medusa/issues/712)) ([e82737a](https://github.com/medusajs/medusa/commit/e82737a03545f69a833d8329f52daef39cfca46d))
- api/routes/store/products pass linting ([#644](https://github.com/medusajs/medusa/issues/644)) ([2966242](https://github.com/medusajs/medusa/commit/2966242bc812f9e75f0bb9cca5662b66836fc6d8))
- delete region causes cascade error ([#672](https://github.com/medusajs/medusa/issues/672)) ([0a65eca](https://github.com/medusajs/medusa/commit/0a65eca3de4f339178315e88b4220bd92ebe2736))
- lint in packages/medusa/src/services/swap.js pass linting ([#587](https://github.com/medusajs/medusa/issues/587)) ([3156a0d](https://github.com/medusajs/medusa/commit/3156a0de31749c1f32d5bdfe2cf8f1a8044bb42e))
- make /api/routes/admin/gift-cards,routes/store/gift-cards,/routes/store/orders pass linting ([#643](https://github.com/medusajs/medusa/issues/643)) ([60e9432](https://github.com/medusajs/medusa/commit/60e943260b804efe1dec3e139e47180322e5b52e))
- make /swaps pass eslint ([#665](https://github.com/medusajs/medusa/issues/665)) ([623d5f2](https://github.com/medusajs/medusa/commit/623d5f2b6d3881e2334fa48be80928ab9340a7ce))
- make api/routes/admin/apps pass eslint ([#641](https://github.com/medusajs/medusa/issues/641)) ([c9234c2](https://github.com/medusajs/medusa/commit/c9234c2343e19b32b335b93f4fa53e54398a5fe6))
- make api/routes/store/swaps pass eslint ([#678](https://github.com/medusajs/medusa/issues/678)) ([d9ee127](https://github.com/medusajs/medusa/commit/d9ee1272841ef047cceb6047fc34b8e42b5f580f))
- make discounts pass eslint ([3df2b42](https://github.com/medusajs/medusa/commit/3df2b4279f363e746f3514d8d8aa78b0e8fa3906))
- make it possible to update order shipping address ([#668](https://github.com/medusajs/medusa/issues/668)) ([e0fa06f](https://github.com/medusajs/medusa/commit/e0fa06fe964b8000ca539efa875ed6c322f6d57b))
- make packages/medusa/src/api/routes/admin/auth and 3 others pass eslint ([#666](https://github.com/medusajs/medusa/issues/666)) ([95f80f8](https://github.com/medusajs/medusa/commit/95f80f8a6635d1cba74d3c7ccbf794809af2d0bb))
- make packages/medusa/src/api/routes/admin/notes pass eslint ([#690](https://github.com/medusajs/medusa/issues/690)) ([f011662](https://github.com/medusajs/medusa/commit/f01166272db7dc2d1b783223a7ea5c9e662a028b))
- make packages/medusa/src/api/routes/admin/orders pass eslint ([#649](https://github.com/medusajs/medusa/issues/649)) ([dc88210](https://github.com/medusajs/medusa/commit/dc8821095c65e73569bdda1c4a24762f7eb746fe))
- make packages/medusa/src/api/routes/admin/return-reasons pass eslint ([#654](https://github.com/medusajs/medusa/issues/654)) ([a8fc89a](https://github.com/medusajs/medusa/commit/a8fc89af066836224e4f760115d13ba85f89a359))
- make packages/medusa/src/api/routes/admin/returns pass eslint ([#653](https://github.com/medusajs/medusa/issues/653)) ([2f7deea](https://github.com/medusajs/medusa/commit/2f7deea1d0309b5a78d66b0dd0d3c2204717c02b))
- make packages/medusa/src/api/routes/admin/shipping-options pass eslint ([#674](https://github.com/medusajs/medusa/issues/674)) ([bd86d3c](https://github.com/medusajs/medusa/commit/bd86d3c995b27bae5c8d97a21eb900b6dd112068))
- make packages/medusa/src/api/routes/admin/shipping-profiles pass eslint ([#642](https://github.com/medusajs/medusa/issues/642)) ([ce4d361](https://github.com/medusajs/medusa/commit/ce4d3616d733b5472ebfc00b49ab17c5aa53daef))
- make packages/medusa/src/api/routes/admin/store pass eslint ([#686](https://github.com/medusajs/medusa/issues/686)) ([7a230ec](https://github.com/medusajs/medusa/commit/7a230ec7e96cae6628f9b68a41dc6da89559dfe9))
- make packages/medusa/src/api/routes/admin/upload pass eslint ([#627](https://github.com/medusajs/medusa/issues/627)) ([5fbce42](https://github.com/medusajs/medusa/commit/5fbce429489cba79340ae738c54a533bdc627a28))
- make packages/medusa/src/api/routes/admin/users pass eslint ([a6a612c](https://github.com/medusajs/medusa/commit/a6a612c941924722c51e389359393436655cfc65))
- make packages/medusa/src/api/routes/store/carts pass eslint ([#652](https://github.com/medusajs/medusa/issues/652)) ([1ba63cc](https://github.com/medusajs/medusa/commit/1ba63cce08d03edd47b3e651d60a34cf58d5c1e3))
- make packages/medusa/src/api/routes/store/shipping-options pass linting ([#648](https://github.com/medusajs/medusa/issues/648)) ([5cb1b56](https://github.com/medusajs/medusa/commit/5cb1b5687ee80448dfecd0c8ba683ccdfc6900fc))
- make packages/medusa/src/services/cart.js pass eslint ([#700](https://github.com/medusajs/medusa/issues/700)) ([0caba0d](https://github.com/medusajs/medusa/commit/0caba0d49113210af4f6d507e273e8b451a5eaaf))
- Make packages/medusa/src/services/claim-item.js pass linting ([#626](https://github.com/medusajs/medusa/issues/626)) ([0d30369](https://github.com/medusajs/medusa/commit/0d3036978a8203f9fb6e64a2bc82a19ef697db05))
- Make packages/medusa/src/services/oauth.js pass linting ([#604](https://github.com/medusajs/medusa/issues/604)) ([14608b0](https://github.com/medusajs/medusa/commit/14608b0f682e858ee38e4b996693962a25116749))
- make packages/medusa/src/services/payment-provider.js pass eslint ([#549](https://github.com/medusajs/medusa/issues/549)) ([caf4357](https://github.com/medusajs/medusa/commit/caf4357c4d1a2199ab1399dfabd18876dd0642c7)), closes [#692](https://github.com/medusajs/medusa/issues/692)
- Make packages/medusa/src/services/product-variant.js pass linting ([#693](https://github.com/medusajs/medusa/issues/693)) ([a351398](https://github.com/medusajs/medusa/commit/a3513983790eaf78285d32f1797d1d11eb446e5e))
- make packages/medusa/src/services/shipping-profile.js pass eslint ([#582](https://github.com/medusajs/medusa/issues/582)) ([2c415ea](https://github.com/medusajs/medusa/commit/2c415ea520ed700a0a474111b83021a699fbc851))
- make packages/medusa/src/services/totals.js pass eslint ([23e83af](https://github.com/medusajs/medusa/commit/23e83aff1cd858401fba42668f641270128068e1))
- make variants pass eslint ([a1e446c](https://github.com/medusajs/medusa/commit/a1e446c1214a79a799da46b3d1bdd62c64b99ebf))
- make variants pass eslint ([#647](https://github.com/medusajs/medusa/issues/647)) ([f4307c7](https://github.com/medusajs/medusa/commit/f4307c702a6c1420d1e344adc8b5ed880d9f1f8d))
- **medusa:** add total count for list queries in product ([#710](https://github.com/medusajs/medusa/issues/710)) ([109d400](https://github.com/medusajs/medusa/commit/109d4007204964f0a89759f48a6e2d5afc0b1dd9))
- Prepare routes for linting ([#603](https://github.com/medusajs/medusa/issues/603)) ([3e68069](https://github.com/medusajs/medusa/commit/3e68069a8959a2bf75f8639389cdd35b6a8058e7))
- updates documentation and fixes script blockers ([#765](https://github.com/medusajs/medusa/issues/765)) ([3ea6aea](https://github.com/medusajs/medusa/commit/3ea6aea5beb2a50d1a3345fa3833eadb32d0a346))

### Features

- admin api - allow customers to be created and updated with metadata ([#824](https://github.com/medusajs/medusa/issues/824)) ([2d9879e](https://github.com/medusajs/medusa/commit/2d9879ea090898c08ad86a0ebc44d5b8965b5166))
- Algolia plugin for medusa ([#718](https://github.com/medusajs/medusa/issues/718)) ([8ce9b20](https://github.com/medusajs/medusa/commit/8ce9b20222e1f4db75f730898549f0ed09eb1574))
- Allow retrieval of soft-deleted products ([#723](https://github.com/medusajs/medusa/issues/723)) ([1e50aee](https://github.com/medusajs/medusa/commit/1e50aee4feb55092560dd4a9c51a0671363e8576))
- **medusa:** adds collection endpoints to storefront ([#711](https://github.com/medusajs/medusa/issues/711)) ([5812756](https://github.com/medusajs/medusa/commit/58127564d7110c674fb14fdd97fbc080afba156d))
- Typescript for API layer ([#817](https://github.com/medusajs/medusa/issues/817)) ([373532e](https://github.com/medusajs/medusa/commit/373532ecbc8196f47e71af95a8cf82a14a4b1f9e))

## [1.1.53](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.52...@medusajs/medusa@1.1.53) (2021-11-19)

### Bug Fixes

- /api/routes/store/auth pass linting ([#645](https://github.com/medusajs/medusa/issues/645)) ([40ad748](https://github.com/medusajs/medusa/commit/40ad748cc3c38bad97690b83c3b4b19c6d6365c3))
- /api/routes/store/customers pass linting ([#646](https://github.com/medusajs/medusa/issues/646)) ([7cc94dc](https://github.com/medusajs/medusa/commit/7cc94dc479ee26df2d5a031bfeb9eb3709d03776))
- add product count to storefront ([#719](https://github.com/medusajs/medusa/issues/719)) ([45b344f](https://github.com/medusajs/medusa/commit/45b344fbe1a570620c4e47cf959bdb605fffddef))
- adds options to default relations in storefront product endpoints ([#712](https://github.com/medusajs/medusa/issues/712)) ([e82737a](https://github.com/medusajs/medusa/commit/e82737a03545f69a833d8329f52daef39cfca46d))
- api/routes/store/products pass linting ([#644](https://github.com/medusajs/medusa/issues/644)) ([2966242](https://github.com/medusajs/medusa/commit/2966242bc812f9e75f0bb9cca5662b66836fc6d8))
- delete region causes cascade error ([#672](https://github.com/medusajs/medusa/issues/672)) ([0a65eca](https://github.com/medusajs/medusa/commit/0a65eca3de4f339178315e88b4220bd92ebe2736))
- lint in packages/medusa/src/services/swap.js pass linting ([#587](https://github.com/medusajs/medusa/issues/587)) ([3156a0d](https://github.com/medusajs/medusa/commit/3156a0de31749c1f32d5bdfe2cf8f1a8044bb42e))
- make /api/routes/admin/gift-cards,routes/store/gift-cards,/routes/store/orders pass linting ([#643](https://github.com/medusajs/medusa/issues/643)) ([60e9432](https://github.com/medusajs/medusa/commit/60e943260b804efe1dec3e139e47180322e5b52e))
- make /swaps pass eslint ([#665](https://github.com/medusajs/medusa/issues/665)) ([623d5f2](https://github.com/medusajs/medusa/commit/623d5f2b6d3881e2334fa48be80928ab9340a7ce))
- make api/routes/admin/apps pass eslint ([#641](https://github.com/medusajs/medusa/issues/641)) ([c9234c2](https://github.com/medusajs/medusa/commit/c9234c2343e19b32b335b93f4fa53e54398a5fe6))
- make api/routes/store/swaps pass eslint ([#678](https://github.com/medusajs/medusa/issues/678)) ([d9ee127](https://github.com/medusajs/medusa/commit/d9ee1272841ef047cceb6047fc34b8e42b5f580f))
- make discounts pass eslint ([3df2b42](https://github.com/medusajs/medusa/commit/3df2b4279f363e746f3514d8d8aa78b0e8fa3906))
- make it possible to update order shipping address ([#668](https://github.com/medusajs/medusa/issues/668)) ([e0fa06f](https://github.com/medusajs/medusa/commit/e0fa06fe964b8000ca539efa875ed6c322f6d57b))
- make packages/medusa/src/api/routes/admin/auth and 3 others pass eslint ([#666](https://github.com/medusajs/medusa/issues/666)) ([95f80f8](https://github.com/medusajs/medusa/commit/95f80f8a6635d1cba74d3c7ccbf794809af2d0bb))
- make packages/medusa/src/api/routes/admin/notes pass eslint ([#690](https://github.com/medusajs/medusa/issues/690)) ([f011662](https://github.com/medusajs/medusa/commit/f01166272db7dc2d1b783223a7ea5c9e662a028b))
- make packages/medusa/src/api/routes/admin/orders pass eslint ([#649](https://github.com/medusajs/medusa/issues/649)) ([dc88210](https://github.com/medusajs/medusa/commit/dc8821095c65e73569bdda1c4a24762f7eb746fe))
- make packages/medusa/src/api/routes/admin/return-reasons pass eslint ([#654](https://github.com/medusajs/medusa/issues/654)) ([a8fc89a](https://github.com/medusajs/medusa/commit/a8fc89af066836224e4f760115d13ba85f89a359))
- make packages/medusa/src/api/routes/admin/returns pass eslint ([#653](https://github.com/medusajs/medusa/issues/653)) ([2f7deea](https://github.com/medusajs/medusa/commit/2f7deea1d0309b5a78d66b0dd0d3c2204717c02b))
- make packages/medusa/src/api/routes/admin/shipping-options pass eslint ([#674](https://github.com/medusajs/medusa/issues/674)) ([bd86d3c](https://github.com/medusajs/medusa/commit/bd86d3c995b27bae5c8d97a21eb900b6dd112068))
- make packages/medusa/src/api/routes/admin/shipping-profiles pass eslint ([#642](https://github.com/medusajs/medusa/issues/642)) ([ce4d361](https://github.com/medusajs/medusa/commit/ce4d3616d733b5472ebfc00b49ab17c5aa53daef))
- make packages/medusa/src/api/routes/admin/store pass eslint ([#686](https://github.com/medusajs/medusa/issues/686)) ([7a230ec](https://github.com/medusajs/medusa/commit/7a230ec7e96cae6628f9b68a41dc6da89559dfe9))
- make packages/medusa/src/api/routes/admin/upload pass eslint ([#627](https://github.com/medusajs/medusa/issues/627)) ([5fbce42](https://github.com/medusajs/medusa/commit/5fbce429489cba79340ae738c54a533bdc627a28))
- make packages/medusa/src/api/routes/admin/users pass eslint ([a6a612c](https://github.com/medusajs/medusa/commit/a6a612c941924722c51e389359393436655cfc65))
- make packages/medusa/src/api/routes/store/carts pass eslint ([#652](https://github.com/medusajs/medusa/issues/652)) ([1ba63cc](https://github.com/medusajs/medusa/commit/1ba63cce08d03edd47b3e651d60a34cf58d5c1e3))
- make packages/medusa/src/api/routes/store/shipping-options pass linting ([#648](https://github.com/medusajs/medusa/issues/648)) ([5cb1b56](https://github.com/medusajs/medusa/commit/5cb1b5687ee80448dfecd0c8ba683ccdfc6900fc))
- make packages/medusa/src/services/cart.js pass eslint ([#700](https://github.com/medusajs/medusa/issues/700)) ([0caba0d](https://github.com/medusajs/medusa/commit/0caba0d49113210af4f6d507e273e8b451a5eaaf))
- Make packages/medusa/src/services/claim-item.js pass linting ([#626](https://github.com/medusajs/medusa/issues/626)) ([0d30369](https://github.com/medusajs/medusa/commit/0d3036978a8203f9fb6e64a2bc82a19ef697db05))
- Make packages/medusa/src/services/oauth.js pass linting ([#604](https://github.com/medusajs/medusa/issues/604)) ([14608b0](https://github.com/medusajs/medusa/commit/14608b0f682e858ee38e4b996693962a25116749))
- make packages/medusa/src/services/payment-provider.js pass eslint ([#549](https://github.com/medusajs/medusa/issues/549)) ([caf4357](https://github.com/medusajs/medusa/commit/caf4357c4d1a2199ab1399dfabd18876dd0642c7)), closes [#692](https://github.com/medusajs/medusa/issues/692)
- Make packages/medusa/src/services/product-variant.js pass linting ([#693](https://github.com/medusajs/medusa/issues/693)) ([a351398](https://github.com/medusajs/medusa/commit/a3513983790eaf78285d32f1797d1d11eb446e5e))
- make packages/medusa/src/services/shipping-profile.js pass eslint ([#582](https://github.com/medusajs/medusa/issues/582)) ([2c415ea](https://github.com/medusajs/medusa/commit/2c415ea520ed700a0a474111b83021a699fbc851))
- make packages/medusa/src/services/totals.js pass eslint ([23e83af](https://github.com/medusajs/medusa/commit/23e83aff1cd858401fba42668f641270128068e1))
- make variants pass eslint ([a1e446c](https://github.com/medusajs/medusa/commit/a1e446c1214a79a799da46b3d1bdd62c64b99ebf))
- make variants pass eslint ([#647](https://github.com/medusajs/medusa/issues/647)) ([f4307c7](https://github.com/medusajs/medusa/commit/f4307c702a6c1420d1e344adc8b5ed880d9f1f8d))
- **medusa:** add total count for list queries in product ([#710](https://github.com/medusajs/medusa/issues/710)) ([109d400](https://github.com/medusajs/medusa/commit/109d4007204964f0a89759f48a6e2d5afc0b1dd9))
- Prepare routes for linting ([#603](https://github.com/medusajs/medusa/issues/603)) ([3e68069](https://github.com/medusajs/medusa/commit/3e68069a8959a2bf75f8639389cdd35b6a8058e7))
- updates documentation and fixes script blockers ([#765](https://github.com/medusajs/medusa/issues/765)) ([3ea6aea](https://github.com/medusajs/medusa/commit/3ea6aea5beb2a50d1a3345fa3833eadb32d0a346))

### Features

- admin api - allow customers to be created and updated with metadata ([#824](https://github.com/medusajs/medusa/issues/824)) ([2d9879e](https://github.com/medusajs/medusa/commit/2d9879ea090898c08ad86a0ebc44d5b8965b5166))
- Algolia plugin for medusa ([#718](https://github.com/medusajs/medusa/issues/718)) ([8ce9b20](https://github.com/medusajs/medusa/commit/8ce9b20222e1f4db75f730898549f0ed09eb1574))
- Allow retrieval of soft-deleted products ([#723](https://github.com/medusajs/medusa/issues/723)) ([1e50aee](https://github.com/medusajs/medusa/commit/1e50aee4feb55092560dd4a9c51a0671363e8576))
- **medusa:** adds collection endpoints to storefront ([#711](https://github.com/medusajs/medusa/issues/711)) ([5812756](https://github.com/medusajs/medusa/commit/58127564d7110c674fb14fdd97fbc080afba156d))
- Typescript for API layer ([#817](https://github.com/medusajs/medusa/issues/817)) ([373532e](https://github.com/medusajs/medusa/commit/373532ecbc8196f47e71af95a8cf82a14a4b1f9e))

## [1.1.52](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.51...@medusajs/medusa@1.1.52) (2021-11-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.51](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.50...@medusajs/medusa@1.1.51) (2021-11-03)

### Bug Fixes

- include discount rule in swap retrieval ([#682](https://github.com/medusajs/medusa/issues/682)) ([a5fe1c2](https://github.com/medusajs/medusa/commit/a5fe1c2e284ff5cb757b792c1a3c8414c211e4e8))

## [1.1.50](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.49...@medusajs/medusa@1.1.50) (2021-11-02)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.49](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.48...@medusajs/medusa@1.1.49) (2021-10-26)

### Bug Fixes

- allow empty string to search product route ([52c47ab](https://github.com/medusajs/medusa/commit/52c47abd407704d02caf7a6bfb3c4777717828b7))

## [1.1.48](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.47...@medusajs/medusa@1.1.48) (2021-10-25)

### Bug Fixes

- make contentful data sync ([548f6c7](https://github.com/medusajs/medusa/commit/548f6c7138d9a08b6c2113ebdda27f13dee848ac))

## [1.1.47](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.46...@medusajs/medusa@1.1.47) (2021-10-23)

### Bug Fixes

- pull missing fields ([b82b43b](https://github.com/medusajs/medusa/commit/b82b43b4c64dc5bc705a439a214f9d1dc9976e21))

## [1.1.46](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.45...@medusajs/medusa@1.1.46) (2021-10-19)

### Bug Fixes

- add integration test ([38813ec](https://github.com/medusajs/medusa/commit/38813ec66f23526054f7e35adf4157ce98703167))
- allow changing regions safely ([06f5fe2](https://github.com/medusajs/medusa/commit/06f5fe267013d95231d96318fe8a055ad8040174))
- cleanup ([5441d47](https://github.com/medusajs/medusa/commit/5441d47f88d759742e3d3d29b29bc38feceac583))
- prettier ([5a67d1e](https://github.com/medusajs/medusa/commit/5a67d1e7fd3d9da9dca0781d0feab60db1f1099a))

## [1.1.45](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.44...@medusajs/medusa@1.1.45) (2021-10-18)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.44](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.43...@medusajs/medusa@1.1.44) (2021-10-18)

### Bug Fixes

- undefined references ([5afd0df](https://github.com/medusajs/medusa/commit/5afd0dfbabaebfb6b09f0e2f055386ac76059372))

## [1.1.43](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.41...@medusajs/medusa@1.1.43) (2021-10-18)

### Bug Fixes

- add possiblity to unset billing address ([dc7ecc9](https://github.com/medusajs/medusa/commit/dc7ecc959ae6792351a733fa9f24c95bb6e9e893))
- adjustments based on feedback ([52be911](https://github.com/medusajs/medusa/commit/52be911e506dfb80c2f39aac31d33a8805e4b6d2))
- adjustments based on seb's feedback ([dba1d5b](https://github.com/medusajs/medusa/commit/dba1d5bb69f02e822f883cc3081fc3c2e4e26dff))
- allow custom shipping options to bypass option requirements ([75e59ec](https://github.com/medusajs/medusa/commit/75e59ec6d540e19708929e8a76e97fdb1feef813))
- autofix ([d9608e1](https://github.com/medusajs/medusa/commit/d9608e15e815898aa58cdf253fd46c3834ce3bda))
- Creating shipping options with requirements ([#428](https://github.com/medusajs/medusa/issues/428)) ([ae0ab03](https://github.com/medusajs/medusa/commit/ae0ab03fac2747ec251abbb6161182dd21218ba6))
- customer endpoints shouldn't use customer id already provided through authentication ([#402](https://github.com/medusajs/medusa/issues/402)) ([bf43896](https://github.com/medusajs/medusa/commit/bf43896d1942d352efcf8b900f4a31fef0fe215d))
- example ([43a2b07](https://github.com/medusajs/medusa/commit/43a2b07866aab722ddb8dc24fe33d4afb7df1d1c))
- failing integration tests ([9c72acd](https://github.com/medusajs/medusa/commit/9c72acda408fea994da3828163f9e6d436846721))
- ILIKE operator not supported in sqlite ([#393](https://github.com/medusajs/medusa/issues/393)) ([49a1329](https://github.com/medusajs/medusa/commit/49a132976ded4d094a5129029743f73a020ecf04))
- include shipping profile and requirement relations when fetching custom shipping options ([569595d](https://github.com/medusajs/medusa/commit/569595d0bbe9cd19fcd94c0229dce3244c685b1e))
- jsdoc ([02ce006](https://github.com/medusajs/medusa/commit/02ce006440e3f366bedcb4e4cc7a195dc5a0fccc))
- jsdoc custom shipping option service ([f7c7659](https://github.com/medusajs/medusa/commit/f7c765945b65c55489be0372533fc556869b0d58))
- make /packages/medusa/src/services/gift-card.js pass eslint ([#533](https://github.com/medusajs/medusa/issues/533)) ([06ee5df](https://github.com/medusajs/medusa/commit/06ee5df9a0d56d52ca89611905c202281e26dc73))
- make /packages/medusa/src/services/line-item.js pass eslint ([#555](https://github.com/medusajs/medusa/issues/555)) ([f2d97df](https://github.com/medusajs/medusa/commit/f2d97dfb862ade395291e27c87f438758655ee0b))
- make medusa/src/services/fulfillment.js pass eslint ([#557](https://github.com/medusajs/medusa/issues/557)) ([fe599c7](https://github.com/medusajs/medusa/commit/fe599c709e1f7e0109ae69bd1d0efb396f959e6a))
- make packages/medusa/src/services/claim.js pass eslint ([#551](https://github.com/medusajs/medusa/issues/551)) ([ddeaf57](https://github.com/medusajs/medusa/commit/ddeaf57f598b5bde8d048fdf63199ba8789348e0))
- make packages/medusa/src/services/discount.js pass eslint ([#553](https://github.com/medusajs/medusa/issues/553)) ([1e13c83](https://github.com/medusajs/medusa/commit/1e13c831ab955d4221a887e921ee9d38b0b27225))
- make packages/medusa/src/services/draft-order.js pass eslint ([#554](https://github.com/medusajs/medusa/issues/554)) ([1791acb](https://github.com/medusajs/medusa/commit/1791acb0447d3e200d4ec3465e4d633ab4497c35))
- make packages/medusa/src/services/idempotency-key.js pass linting ([#568](https://github.com/medusajs/medusa/issues/568)) ([5b3c0c4](https://github.com/medusajs/medusa/commit/5b3c0c4471002064c3432d7d96c74b3b202ae5ad))
- make packages/medusa/src/services/note.js pass eslint ([#565](https://github.com/medusajs/medusa/issues/565)) ([275a0f1](https://github.com/medusajs/medusa/commit/275a0f1d573fd43cc419233b82bd9b7e697851f5))
- make packages/medusa/src/services/notification.js pass eslint ([#566](https://github.com/medusajs/medusa/issues/566)) ([38559b5](https://github.com/medusajs/medusa/commit/38559b5454935b404aad68f90d225df4bfb6ef33))
- make packages/medusa/src/services/region.js pass eslint ([#542](https://github.com/medusajs/medusa/issues/542)) ([f926e02](https://github.com/medusajs/medusa/commit/f926e0245c8372b050c5b48a90ef1671ee9525f5))
- Make packages/medusa/src/services/transaction.js pass linting ([#534](https://github.com/medusajs/medusa/issues/534)) ([10f1d9d](https://github.com/medusajs/medusa/commit/10f1d9df5c184ff723c71dbc618bc574e94228d9))
- make return-reason.js pass eslint ([#539](https://github.com/medusajs/medusa/issues/539)) ([b6efa6f](https://github.com/medusajs/medusa/commit/b6efa6f4712cce08a650244cb0b15afac0e2cbc0))
- make system-payment-provider.js pass eslint ([#574](https://github.com/medusajs/medusa/issues/574)) ([8e59ec8](https://github.com/medusajs/medusa/commit/8e59ec81e4280db432ea0290b0b92f098789e5ef))
- **medusa:** hide password hash ([#429](https://github.com/medusajs/medusa/issues/429)) ([cd4afd1](https://github.com/medusajs/medusa/commit/cd4afd15768627b3bf7579e7e4c67ed0698ea681))
- meiliesearch README.md + remove: searchService from silentResolver ([1444353](https://github.com/medusajs/medusa/commit/1444353b0af4e18a23cebbf46b6d1246aa495bb4))
- merge conflicts ([153366c](https://github.com/medusajs/medusa/commit/153366cbd30feac3dd99a2d718b2e5b0b1b19dcc))
- merge conflicts ([632ad17](https://github.com/medusajs/medusa/commit/632ad17e3fdf6fe1f0f336da134acee9668688e5))
- merge develop ([2297a84](https://github.com/medusajs/medusa/commit/2297a84cb90d960e4f8d1210f3b419e16bb15438))
- more adjustments ([3d088c3](https://github.com/medusajs/medusa/commit/3d088c351b4c430832dc22750c01220310577279))
- move subscriber to core ([700f8c3](https://github.com/medusajs/medusa/commit/700f8c39190469337c74d9bf3f046f293024e521))
- options relations on GET variant ([#532](https://github.com/medusajs/medusa/issues/532)) ([fc50aac](https://github.com/medusajs/medusa/commit/fc50aacde2e59fd3cc939dcdaa2630d788b4eca2))
- product ordering ([57a6612](https://github.com/medusajs/medusa/commit/57a6612e845c078aec023d0cc49d6bfc175a1b37))
- remove custom shipping options from swapService create method call ([71d433c](https://github.com/medusajs/medusa/commit/71d433c33583830fb7a3724154aa9918592888bd))
- remove verbose mode in integration test + fix jsdoc ([36aeb4f](https://github.com/medusajs/medusa/commit/36aeb4fffa662930db0172a8397ff3b928b0d5ec))
- shipping option updates ([#426](https://github.com/medusajs/medusa/issues/426)) ([22f3f2a](https://github.com/medusajs/medusa/commit/22f3f2af93fcebef5ebf89ce66cd926393ae5d25))
- tests ([db83448](https://github.com/medusajs/medusa/commit/db83448d188b092745c3df6f38e87d89836942cc))
- Throw on cart creation when no region exist ([#455](https://github.com/medusajs/medusa/issues/455)) ([17b192f](https://github.com/medusajs/medusa/commit/17b192fe37c14d978ae78a9537f552cf055bf5e2))
- update event ([6d21d0d](https://github.com/medusajs/medusa/commit/6d21d0d39835b15ac132c14b742ec21ffca307d0))
- update product images ([#494](https://github.com/medusajs/medusa/issues/494)) ([c0e947f](https://github.com/medusajs/medusa/commit/c0e947f47a009dcdf189bd4564485385b3019045))
- update seeder to product published ([#423](https://github.com/medusajs/medusa/issues/423)) ([d8e5318](https://github.com/medusajs/medusa/commit/d8e531890d758e374fdd586f8b718d9b09126320))
- use type to choose transformer before adding or replacing documents ([24eecd2](https://github.com/medusajs/medusa/commit/24eecd2922e0c3425f2d43549b3227c756820387))

### Features

- add product status ([#400](https://github.com/medusajs/medusa/issues/400)) ([a82332d](https://github.com/medusajs/medusa/commit/a82332da3e2c8940da814b27607182c2c888b49f))
- Allow backorder on swaps ([#404](https://github.com/medusajs/medusa/issues/404)) ([00ab03f](https://github.com/medusajs/medusa/commit/00ab03f3a2b0c59049f5c5a2af2cb5eee9d4c72d))
- allow product selection on discounts allocated to a specific item ([#395](https://github.com/medusajs/medusa/issues/395)) ([84d4d79](https://github.com/medusajs/medusa/commit/84d4d791eaf9508367a20d9f930ca959a7b707dd))
- customer-information ([#413](https://github.com/medusajs/medusa/issues/413)) ([a70e3ed](https://github.com/medusajs/medusa/commit/a70e3ed0aee0e9c19f7aaf8bb8d22eb68a9695b7))
- Product filtering ([#439](https://github.com/medusajs/medusa/issues/439)) ([5ef2a3f](https://github.com/medusajs/medusa/commit/5ef2a3fbcb108c8d49b7754ea14ac890af643950))
- rma shipping option + unit tests ([77ee0bf](https://github.com/medusajs/medusa/commit/77ee0bf1860c9ba3336c6f870d248d887d2f5fb3))

### Reverts

- Revert "fixed linting errors on packages/medusa/src/services/user.js #531 (#543)" (#547) ([ba2d923](https://github.com/medusajs/medusa/commit/ba2d92341d7fa5cdd334fd9161f86da0c986b524)), closes [#531](https://github.com/medusajs/medusa/issues/531) [#543](https://github.com/medusajs/medusa/issues/543) [#547](https://github.com/medusajs/medusa/issues/547)

## [1.1.42](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.41...@medusajs/medusa@1.1.42) (2021-10-18)

### Bug Fixes

- add possiblity to unset billing address ([dc7ecc9](https://github.com/medusajs/medusa/commit/dc7ecc959ae6792351a733fa9f24c95bb6e9e893))
- adjustments based on feedback ([52be911](https://github.com/medusajs/medusa/commit/52be911e506dfb80c2f39aac31d33a8805e4b6d2))
- adjustments based on seb's feedback ([dba1d5b](https://github.com/medusajs/medusa/commit/dba1d5bb69f02e822f883cc3081fc3c2e4e26dff))
- allow custom shipping options to bypass option requirements ([75e59ec](https://github.com/medusajs/medusa/commit/75e59ec6d540e19708929e8a76e97fdb1feef813))
- autofix ([d9608e1](https://github.com/medusajs/medusa/commit/d9608e15e815898aa58cdf253fd46c3834ce3bda))
- Creating shipping options with requirements ([#428](https://github.com/medusajs/medusa/issues/428)) ([ae0ab03](https://github.com/medusajs/medusa/commit/ae0ab03fac2747ec251abbb6161182dd21218ba6))
- customer endpoints shouldn't use customer id already provided through authentication ([#402](https://github.com/medusajs/medusa/issues/402)) ([bf43896](https://github.com/medusajs/medusa/commit/bf43896d1942d352efcf8b900f4a31fef0fe215d))
- example ([43a2b07](https://github.com/medusajs/medusa/commit/43a2b07866aab722ddb8dc24fe33d4afb7df1d1c))
- failing integration tests ([9c72acd](https://github.com/medusajs/medusa/commit/9c72acda408fea994da3828163f9e6d436846721))
- ILIKE operator not supported in sqlite ([#393](https://github.com/medusajs/medusa/issues/393)) ([49a1329](https://github.com/medusajs/medusa/commit/49a132976ded4d094a5129029743f73a020ecf04))
- include shipping profile and requirement relations when fetching custom shipping options ([569595d](https://github.com/medusajs/medusa/commit/569595d0bbe9cd19fcd94c0229dce3244c685b1e))
- jsdoc ([02ce006](https://github.com/medusajs/medusa/commit/02ce006440e3f366bedcb4e4cc7a195dc5a0fccc))
- jsdoc custom shipping option service ([f7c7659](https://github.com/medusajs/medusa/commit/f7c765945b65c55489be0372533fc556869b0d58))
- make /packages/medusa/src/services/gift-card.js pass eslint ([#533](https://github.com/medusajs/medusa/issues/533)) ([06ee5df](https://github.com/medusajs/medusa/commit/06ee5df9a0d56d52ca89611905c202281e26dc73))
- make /packages/medusa/src/services/line-item.js pass eslint ([#555](https://github.com/medusajs/medusa/issues/555)) ([f2d97df](https://github.com/medusajs/medusa/commit/f2d97dfb862ade395291e27c87f438758655ee0b))
- make medusa/src/services/fulfillment.js pass eslint ([#557](https://github.com/medusajs/medusa/issues/557)) ([fe599c7](https://github.com/medusajs/medusa/commit/fe599c709e1f7e0109ae69bd1d0efb396f959e6a))
- make packages/medusa/src/services/claim.js pass eslint ([#551](https://github.com/medusajs/medusa/issues/551)) ([ddeaf57](https://github.com/medusajs/medusa/commit/ddeaf57f598b5bde8d048fdf63199ba8789348e0))
- make packages/medusa/src/services/discount.js pass eslint ([#553](https://github.com/medusajs/medusa/issues/553)) ([1e13c83](https://github.com/medusajs/medusa/commit/1e13c831ab955d4221a887e921ee9d38b0b27225))
- make packages/medusa/src/services/draft-order.js pass eslint ([#554](https://github.com/medusajs/medusa/issues/554)) ([1791acb](https://github.com/medusajs/medusa/commit/1791acb0447d3e200d4ec3465e4d633ab4497c35))
- make packages/medusa/src/services/idempotency-key.js pass linting ([#568](https://github.com/medusajs/medusa/issues/568)) ([5b3c0c4](https://github.com/medusajs/medusa/commit/5b3c0c4471002064c3432d7d96c74b3b202ae5ad))
- make packages/medusa/src/services/note.js pass eslint ([#565](https://github.com/medusajs/medusa/issues/565)) ([275a0f1](https://github.com/medusajs/medusa/commit/275a0f1d573fd43cc419233b82bd9b7e697851f5))
- make packages/medusa/src/services/notification.js pass eslint ([#566](https://github.com/medusajs/medusa/issues/566)) ([38559b5](https://github.com/medusajs/medusa/commit/38559b5454935b404aad68f90d225df4bfb6ef33))
- make packages/medusa/src/services/region.js pass eslint ([#542](https://github.com/medusajs/medusa/issues/542)) ([f926e02](https://github.com/medusajs/medusa/commit/f926e0245c8372b050c5b48a90ef1671ee9525f5))
- Make packages/medusa/src/services/transaction.js pass linting ([#534](https://github.com/medusajs/medusa/issues/534)) ([10f1d9d](https://github.com/medusajs/medusa/commit/10f1d9df5c184ff723c71dbc618bc574e94228d9))
- make return-reason.js pass eslint ([#539](https://github.com/medusajs/medusa/issues/539)) ([b6efa6f](https://github.com/medusajs/medusa/commit/b6efa6f4712cce08a650244cb0b15afac0e2cbc0))
- make system-payment-provider.js pass eslint ([#574](https://github.com/medusajs/medusa/issues/574)) ([8e59ec8](https://github.com/medusajs/medusa/commit/8e59ec81e4280db432ea0290b0b92f098789e5ef))
- **medusa:** hide password hash ([#429](https://github.com/medusajs/medusa/issues/429)) ([cd4afd1](https://github.com/medusajs/medusa/commit/cd4afd15768627b3bf7579e7e4c67ed0698ea681))
- meiliesearch README.md + remove: searchService from silentResolver ([1444353](https://github.com/medusajs/medusa/commit/1444353b0af4e18a23cebbf46b6d1246aa495bb4))
- merge conflicts ([153366c](https://github.com/medusajs/medusa/commit/153366cbd30feac3dd99a2d718b2e5b0b1b19dcc))
- merge conflicts ([632ad17](https://github.com/medusajs/medusa/commit/632ad17e3fdf6fe1f0f336da134acee9668688e5))
- merge develop ([2297a84](https://github.com/medusajs/medusa/commit/2297a84cb90d960e4f8d1210f3b419e16bb15438))
- more adjustments ([3d088c3](https://github.com/medusajs/medusa/commit/3d088c351b4c430832dc22750c01220310577279))
- move subscriber to core ([700f8c3](https://github.com/medusajs/medusa/commit/700f8c39190469337c74d9bf3f046f293024e521))
- options relations on GET variant ([#532](https://github.com/medusajs/medusa/issues/532)) ([fc50aac](https://github.com/medusajs/medusa/commit/fc50aacde2e59fd3cc939dcdaa2630d788b4eca2))
- product ordering ([57a6612](https://github.com/medusajs/medusa/commit/57a6612e845c078aec023d0cc49d6bfc175a1b37))
- remove custom shipping options from swapService create method call ([71d433c](https://github.com/medusajs/medusa/commit/71d433c33583830fb7a3724154aa9918592888bd))
- remove verbose mode in integration test + fix jsdoc ([36aeb4f](https://github.com/medusajs/medusa/commit/36aeb4fffa662930db0172a8397ff3b928b0d5ec))
- shipping option updates ([#426](https://github.com/medusajs/medusa/issues/426)) ([22f3f2a](https://github.com/medusajs/medusa/commit/22f3f2af93fcebef5ebf89ce66cd926393ae5d25))
- tests ([db83448](https://github.com/medusajs/medusa/commit/db83448d188b092745c3df6f38e87d89836942cc))
- Throw on cart creation when no region exist ([#455](https://github.com/medusajs/medusa/issues/455)) ([17b192f](https://github.com/medusajs/medusa/commit/17b192fe37c14d978ae78a9537f552cf055bf5e2))
- update event ([6d21d0d](https://github.com/medusajs/medusa/commit/6d21d0d39835b15ac132c14b742ec21ffca307d0))
- update product images ([#494](https://github.com/medusajs/medusa/issues/494)) ([c0e947f](https://github.com/medusajs/medusa/commit/c0e947f47a009dcdf189bd4564485385b3019045))
- update seeder to product published ([#423](https://github.com/medusajs/medusa/issues/423)) ([d8e5318](https://github.com/medusajs/medusa/commit/d8e531890d758e374fdd586f8b718d9b09126320))
- use type to choose transformer before adding or replacing documents ([24eecd2](https://github.com/medusajs/medusa/commit/24eecd2922e0c3425f2d43549b3227c756820387))

### Features

- add product status ([#400](https://github.com/medusajs/medusa/issues/400)) ([a82332d](https://github.com/medusajs/medusa/commit/a82332da3e2c8940da814b27607182c2c888b49f))
- Allow backorder on swaps ([#404](https://github.com/medusajs/medusa/issues/404)) ([00ab03f](https://github.com/medusajs/medusa/commit/00ab03f3a2b0c59049f5c5a2af2cb5eee9d4c72d))
- allow product selection on discounts allocated to a specific item ([#395](https://github.com/medusajs/medusa/issues/395)) ([84d4d79](https://github.com/medusajs/medusa/commit/84d4d791eaf9508367a20d9f930ca959a7b707dd))
- customer-information ([#413](https://github.com/medusajs/medusa/issues/413)) ([a70e3ed](https://github.com/medusajs/medusa/commit/a70e3ed0aee0e9c19f7aaf8bb8d22eb68a9695b7))
- Product filtering ([#439](https://github.com/medusajs/medusa/issues/439)) ([5ef2a3f](https://github.com/medusajs/medusa/commit/5ef2a3fbcb108c8d49b7754ea14ac890af643950))
- rma shipping option + unit tests ([77ee0bf](https://github.com/medusajs/medusa/commit/77ee0bf1860c9ba3336c6f870d248d887d2f5fb3))

### Reverts

- Revert "fixed linting errors on packages/medusa/src/services/user.js #531 (#543)" (#547) ([ba2d923](https://github.com/medusajs/medusa/commit/ba2d92341d7fa5cdd334fd9161f86da0c986b524)), closes [#531](https://github.com/medusajs/medusa/issues/531) [#543](https://github.com/medusajs/medusa/issues/543) [#547](https://github.com/medusajs/medusa/issues/547)

## [1.1.41](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.40...@medusajs/medusa@1.1.41) (2021-09-15)

### Bug Fixes

- 404 product ([8c8c589](https://github.com/medusajs/medusa/commit/8c8c589b0fa720225a02005f9880ad7d1fbf5042))
- add default relations to variants to include prices ([#394](https://github.com/medusajs/medusa/issues/394)) ([d477ca9](https://github.com/medusajs/medusa/commit/d477ca9842eb58cc561e9e0fa9d01e2d0d2f6756))
- Ensure uniqueness for products, variants, collections and discounts ([#382](https://github.com/medusajs/medusa/issues/382)) ([2715095](https://github.com/medusajs/medusa/commit/27150959ffa70819cf3c4ad176288a1c70287942))
- make shipping_option_id on requirements optional ([#340](https://github.com/medusajs/medusa/issues/340)) ([16b0fa3](https://github.com/medusajs/medusa/commit/16b0fa377a577abd7976c2beaff83e2030969df8))

### Features

- update and cancel swaps, claims, and returns ([#310](https://github.com/medusajs/medusa/issues/310)) ([cf66f97](https://github.com/medusajs/medusa/commit/cf66f97758003a41737602d4b1b1051b266d4f81))

## [1.1.40](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.40...@medusajs/medusa@1.1.40) (2021-09-15)

### Bug Fixes

- 404 product ([8c8c589](https://github.com/medusajs/medusa/commit/8c8c589b0fa720225a02005f9880ad7d1fbf5042))
- add default relations to variants to include prices ([#394](https://github.com/medusajs/medusa/issues/394)) ([d477ca9](https://github.com/medusajs/medusa/commit/d477ca9842eb58cc561e9e0fa9d01e2d0d2f6756))
- Ensure uniqueness for products, variants, collections and discounts ([#382](https://github.com/medusajs/medusa/issues/382)) ([2715095](https://github.com/medusajs/medusa/commit/27150959ffa70819cf3c4ad176288a1c70287942))
- make shipping_option_id on requirements optional ([#340](https://github.com/medusajs/medusa/issues/340)) ([16b0fa3](https://github.com/medusajs/medusa/commit/16b0fa377a577abd7976c2beaff83e2030969df8))

### Features

- update and cancel swaps, claims, and returns ([#310](https://github.com/medusajs/medusa/issues/310)) ([cf66f97](https://github.com/medusajs/medusa/commit/cf66f97758003a41737602d4b1b1051b266d4f81))

## [1.1.39](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.40...@medusajs/medusa@1.1.39) (2021-09-14)

### Bug Fixes

- 404 product ([8c8c589](https://github.com/medusajs/medusa/commit/8c8c589b0fa720225a02005f9880ad7d1fbf5042))
- add default relations to variants to include prices ([#394](https://github.com/medusajs/medusa/issues/394)) ([d477ca9](https://github.com/medusajs/medusa/commit/d477ca9842eb58cc561e9e0fa9d01e2d0d2f6756))
- Ensure uniqueness for products, variants, collections and discounts ([#382](https://github.com/medusajs/medusa/issues/382)) ([2715095](https://github.com/medusajs/medusa/commit/27150959ffa70819cf3c4ad176288a1c70287942))
- make shipping_option_id on requirements optional ([#340](https://github.com/medusajs/medusa/issues/340)) ([16b0fa3](https://github.com/medusajs/medusa/commit/16b0fa377a577abd7976c2beaff83e2030969df8))

### Features

- update and cancel swaps, claims, and returns ([#310](https://github.com/medusajs/medusa/issues/310)) ([cf66f97](https://github.com/medusajs/medusa/commit/cf66f97758003a41737602d4b1b1051b266d4f81))

## [1.1.40](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.38...@medusajs/medusa@1.1.40) (2021-09-02)

### Bug Fixes

- Account for non-discountable items in getRefundTotal ([#347](https://github.com/medusajs/medusa/issues/347)) ([fd14e24](https://github.com/medusajs/medusa/commit/fd14e243daf2724ce91aaf85c29806f22f3b6623))

### Features

- creates support for swaps on the storefront ([#355](https://github.com/medusajs/medusa/issues/355)) ([ae82cfc](https://github.com/medusajs/medusa/commit/ae82cfc70a94655ff03fcf1d9b8596f14e8c2840))

## [1.1.39](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.38...@medusajs/medusa@1.1.39) (2021-08-31)

### Bug Fixes

- Account for non-discountable items in getRefundTotal ([#347](https://github.com/medusajs/medusa/issues/347)) ([fd14e24](https://github.com/medusajs/medusa/commit/fd14e243daf2724ce91aaf85c29806f22f3b6623))

### Features

- creates support for swaps on the storefront ([#355](https://github.com/medusajs/medusa/issues/355)) ([ae82cfc](https://github.com/medusajs/medusa/commit/ae82cfc70a94655ff03fcf1d9b8596f14e8c2840))

## [1.1.38](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.37...@medusajs/medusa@1.1.38) (2021-08-17)

### Bug Fixes

- add cross-spawn ([#341](https://github.com/medusajs/medusa/issues/341)) ([8f60f43](https://github.com/medusajs/medusa/commit/8f60f430cc3af7ffccd620cb84ebf8339c2e57d5))

## [1.1.37](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.36...@medusajs/medusa@1.1.37) (2021-08-17)

### Bug Fixes

- build openapi ([#338](https://github.com/medusajs/medusa/issues/338)) ([9467f7e](https://github.com/medusajs/medusa/commit/9467f7ecbd1df5bcd86a15f3cef3ed5968b34e5b))

## [1.1.36](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.35...@medusajs/medusa@1.1.36) (2021-08-11)

### Bug Fixes

- improves integration tests ([#332](https://github.com/medusajs/medusa/issues/332)) ([9a701ff](https://github.com/medusajs/medusa/commit/9a701ff22906e58465a00574c39e2cc284ee0e1a))

## [1.1.35](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.34...@medusajs/medusa@1.1.35) (2021-08-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.34](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.33...@medusajs/medusa@1.1.34) (2021-08-05)

### Bug Fixes

- canary assist ([b988b67](https://github.com/medusajs/medusa/commit/b988b67118553c88ef6c6d53ae99ef1ad9d67305))
- product and variant api route validation ([#331](https://github.com/medusajs/medusa/issues/331)) ([b101725](https://github.com/medusajs/medusa/commit/b101725396ed568666dcbae99a480db793cd20d1))
- return lines allow_discounts ([1295ceb](https://github.com/medusajs/medusa/commit/1295ceb7929f212937a5894ca62c3f87499d1d7b))

### Features

- Add discountable flag to product ([#329](https://github.com/medusajs/medusa/issues/329)) ([6053c4a](https://github.com/medusajs/medusa/commit/6053c4a8ddbc010d1c2a466b0406791a1dc02f3e))
- add route for retrieving a swap ([#326](https://github.com/medusajs/medusa/issues/326)) ([821d8be](https://github.com/medusajs/medusa/commit/821d8be7337608f28e87d96d71cc7aa3a161f117))
- In band inventory updates ([#311](https://github.com/medusajs/medusa/issues/311)) ([f07cc0f](https://github.com/medusajs/medusa/commit/f07cc0fa406d8f0fe33f9088fe6cb3ce8e78b05f))
- medusa-telemetry ([#328](https://github.com/medusajs/medusa/issues/328)) ([cfe19f7](https://github.com/medusajs/medusa/commit/cfe19f7f9d3bb17425348362b148a0b4b7a649ef))

## [1.1.33](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.32...@medusajs/medusa@1.1.33) (2021-07-26)

### Bug Fixes

- enforce 1 shipping method per profile ([#322](https://github.com/medusajs/medusa/issues/322)) ([b378a4f](https://github.com/medusajs/medusa/commit/b378a4f8bc8b57189c368fadb1a14ea2e5ea896e))
- parameterize integration tests' db credentials ([#319](https://github.com/medusajs/medusa/issues/319)) ([06fd882](https://github.com/medusajs/medusa/commit/06fd882a671b2808ef906430f6afd31be2d03280))

### Features

- CLI + local linking ([#313](https://github.com/medusajs/medusa/issues/313)) ([f4a7138](https://github.com/medusajs/medusa/commit/f4a7138a5888e69e19bebe8f4962afc42e9a945d)), closes [#320](https://github.com/medusajs/medusa/issues/320)

## [1.1.32](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.31...@medusajs/medusa@1.1.32) (2021-07-16)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.31](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.29...@medusajs/medusa@1.1.31) (2021-07-15)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.30](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.29...@medusajs/medusa@1.1.30) (2021-07-15)

### Bug Fixes

- adds tracking links to customer orders ([c013270](https://github.com/medusajs/medusa/commit/c0132700b78d171d6c7e29e2604b99129c5a1921))
- allow updating billing address on customer ([5a1cbc6](https://github.com/medusajs/medusa/commit/5a1cbc68b721fe80d223e4ff611ebc81346333d7))
- better store/customer support ([6342e68](https://github.com/medusajs/medusa/commit/6342e68d069636e5eb4877c7ebf7aac952b5e363))
- create fulfillment ([0603a86](https://github.com/medusajs/medusa/commit/0603a86d65a528af86bdbdc46227faa2f48a93bb))
- **medusa:** Resolve issue with soft-delete and unique indexes in DB ([#296](https://github.com/medusajs/medusa/issues/296)) ([6358f8f](https://github.com/medusajs/medusa/commit/6358f8fc756291710a82ce39a47d0cbec1395b87))

## [1.1.29](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.28...@medusajs/medusa@1.1.29) (2021-07-02)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.28](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.27...@medusajs/medusa@1.1.28) (2021-06-24)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.27](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.26...@medusajs/medusa@1.1.27) (2021-06-22)

### Bug Fixes

- adds transformer to map field names to field_id names ([88d96a2](https://github.com/medusajs/medusa/commit/88d96a29fd8dbc44ed7ba25154850d417577acad))
- giftcard-order relation ([c88c407](https://github.com/medusajs/medusa/commit/c88c4070960ad1a8126e65b1e9f60d7ba929246a))
- lint ([5829550](https://github.com/medusajs/medusa/commit/58295505178209d511046089d736395d121b9732))
- mobile pay support ([91511cb](https://github.com/medusajs/medusa/commit/91511cbdf8bc66f5688a36ecf56edb16a220cc82))
- region sync ([8e29e6e](https://github.com/medusajs/medusa/commit/8e29e6e63c305b684a37d817b504b3e471d697bd))
- release assist ([668e8a7](https://github.com/medusajs/medusa/commit/668e8a740200847fc2a41c91d2979097f1392532))

## [1.1.26](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.25...@medusajs/medusa@1.1.26) (2021-06-10)

### Bug Fixes

- avoid error message ([0a62590](https://github.com/medusajs/medusa/commit/0a62590044ab01eb81795de69c0f7017372394cc))

## [1.1.25](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.24...@medusajs/medusa@1.1.25) (2021-06-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.24](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.23...@medusajs/medusa@1.1.24) (2021-06-09)

### Bug Fixes

- babel ([813a1c9](https://github.com/medusajs/medusa/commit/813a1c95a86139a3293c6f8d8bc13f4eb76ef96e))
- bearer user id login development ([df50186](https://github.com/medusajs/medusa/commit/df5018669ce7b727798234e74cda30de262bbb91))
- common registration name formatter ([f4f67a3](https://github.com/medusajs/medusa/commit/f4f67a376dcb6a4d6734c227ba3c2a9e3353a5ce))
- migration dirs ([57a2de6](https://github.com/medusajs/medusa/commit/57a2de64b209544c39af5a7dae43f1230cf36058))
- migration dirs ([e764d8e](https://github.com/medusajs/medusa/commit/e764d8e465fb2ce1a2330cc55097d15dde647074))
- order order ([245ccdc](https://github.com/medusajs/medusa/commit/245ccdc4774965cdd27d4dbdb5fbb084c8066c66))
- PR ([e20ba1e](https://github.com/medusajs/medusa/commit/e20ba1e4faa8d13b3fc35c7c2fe8597c6ec8f41c))
- setup to allow login to Medusa Cloud ([bbd2f02](https://github.com/medusajs/medusa/commit/bbd2f02d549330df160c76cf1f4e4d5e7d08f246))
- test name registration ([e59dc3b](https://github.com/medusajs/medusa/commit/e59dc3b6c85db369c0b7dd3d097578fc2b527431))
- wip ([42d9a48](https://github.com/medusajs/medusa/commit/42d9a487ff1239f32a00bf47df3218ff3cf03217))
- **medusa:** Add free shipping functionality ([#241](https://github.com/medusajs/medusa/issues/241)) ([fb0613d](https://github.com/medusajs/medusa/commit/fb0613d3cbbfeb858b4a4a0f4da859b9692379bd))

### Features

- **cli:** adds seed script ([5136c77](https://github.com/medusajs/medusa/commit/5136c7740137afcda52393131ef931eb76ea9f5d))
- allow custom address on claims ([586f4d8](https://github.com/medusajs/medusa/commit/586f4d884c4b7b5b84fbd1f4dbf5c6fb2ffccf50))
- **medusa:** Swaps on swaps ([#229](https://github.com/medusajs/medusa/issues/229)) ([f8f1f57](https://github.com/medusajs/medusa/commit/f8f1f57fa1bcdc6f7ae4183e657a07e2641b1345))

## [1.1.23](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.23...@medusajs/medusa@1.1.23) (2021-06-09)

### Bug Fixes

- babel ([813a1c9](https://github.com/medusajs/medusa/commit/813a1c95a86139a3293c6f8d8bc13f4eb76ef96e))
- bearer user id login development ([df50186](https://github.com/medusajs/medusa/commit/df5018669ce7b727798234e74cda30de262bbb91))
- common registration name formatter ([f4f67a3](https://github.com/medusajs/medusa/commit/f4f67a376dcb6a4d6734c227ba3c2a9e3353a5ce))
- migration dirs ([57a2de6](https://github.com/medusajs/medusa/commit/57a2de64b209544c39af5a7dae43f1230cf36058))
- migration dirs ([e764d8e](https://github.com/medusajs/medusa/commit/e764d8e465fb2ce1a2330cc55097d15dde647074))
- order order ([245ccdc](https://github.com/medusajs/medusa/commit/245ccdc4774965cdd27d4dbdb5fbb084c8066c66))
- PR ([e20ba1e](https://github.com/medusajs/medusa/commit/e20ba1e4faa8d13b3fc35c7c2fe8597c6ec8f41c))
- setup to allow login to Medusa Cloud ([bbd2f02](https://github.com/medusajs/medusa/commit/bbd2f02d549330df160c76cf1f4e4d5e7d08f246))
- test name registration ([e59dc3b](https://github.com/medusajs/medusa/commit/e59dc3b6c85db369c0b7dd3d097578fc2b527431))
- wip ([42d9a48](https://github.com/medusajs/medusa/commit/42d9a487ff1239f32a00bf47df3218ff3cf03217))
- **medusa:** Add free shipping functionality ([#241](https://github.com/medusajs/medusa/issues/241)) ([fb0613d](https://github.com/medusajs/medusa/commit/fb0613d3cbbfeb858b4a4a0f4da859b9692379bd))

### Features

- **cli:** adds seed script ([5136c77](https://github.com/medusajs/medusa/commit/5136c7740137afcda52393131ef931eb76ea9f5d))
- allow custom address on claims ([586f4d8](https://github.com/medusajs/medusa/commit/586f4d884c4b7b5b84fbd1f4dbf5c6fb2ffccf50))
- **medusa:** Swaps on swaps ([#229](https://github.com/medusajs/medusa/issues/229)) ([f8f1f57](https://github.com/medusajs/medusa/commit/f8f1f57fa1bcdc6f7ae4183e657a07e2641b1345))

## [1.1.22](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.23...@medusajs/medusa@1.1.22) (2021-06-09)

### Bug Fixes

- babel ([813a1c9](https://github.com/medusajs/medusa/commit/813a1c95a86139a3293c6f8d8bc13f4eb76ef96e))
- bearer user id login development ([df50186](https://github.com/medusajs/medusa/commit/df5018669ce7b727798234e74cda30de262bbb91))
- common registration name formatter ([f4f67a3](https://github.com/medusajs/medusa/commit/f4f67a376dcb6a4d6734c227ba3c2a9e3353a5ce))
- migration dirs ([57a2de6](https://github.com/medusajs/medusa/commit/57a2de64b209544c39af5a7dae43f1230cf36058))
- migration dirs ([e764d8e](https://github.com/medusajs/medusa/commit/e764d8e465fb2ce1a2330cc55097d15dde647074))
- order order ([245ccdc](https://github.com/medusajs/medusa/commit/245ccdc4774965cdd27d4dbdb5fbb084c8066c66))
- PR ([e20ba1e](https://github.com/medusajs/medusa/commit/e20ba1e4faa8d13b3fc35c7c2fe8597c6ec8f41c))
- setup to allow login to Medusa Cloud ([bbd2f02](https://github.com/medusajs/medusa/commit/bbd2f02d549330df160c76cf1f4e4d5e7d08f246))
- test name registration ([e59dc3b](https://github.com/medusajs/medusa/commit/e59dc3b6c85db369c0b7dd3d097578fc2b527431))
- wip ([42d9a48](https://github.com/medusajs/medusa/commit/42d9a487ff1239f32a00bf47df3218ff3cf03217))
- **medusa:** Add free shipping functionality ([#241](https://github.com/medusajs/medusa/issues/241)) ([fb0613d](https://github.com/medusajs/medusa/commit/fb0613d3cbbfeb858b4a4a0f4da859b9692379bd))

### Features

- **cli:** adds seed script ([5136c77](https://github.com/medusajs/medusa/commit/5136c7740137afcda52393131ef931eb76ea9f5d))
- allow custom address on claims ([586f4d8](https://github.com/medusajs/medusa/commit/586f4d884c4b7b5b84fbd1f4dbf5c6fb2ffccf50))
- **medusa:** Swaps on swaps ([#229](https://github.com/medusajs/medusa/issues/229)) ([f8f1f57](https://github.com/medusajs/medusa/commit/f8f1f57fa1bcdc6f7ae4183e657a07e2641b1345))

## [1.1.20](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.23...@medusajs/medusa@1.1.20) (2021-06-08)

### Bug Fixes

- babel ([813a1c9](https://github.com/medusajs/medusa/commit/813a1c95a86139a3293c6f8d8bc13f4eb76ef96e))
- bearer user id login development ([df50186](https://github.com/medusajs/medusa/commit/df5018669ce7b727798234e74cda30de262bbb91))
- common registration name formatter ([f4f67a3](https://github.com/medusajs/medusa/commit/f4f67a376dcb6a4d6734c227ba3c2a9e3353a5ce))
- migration dirs ([57a2de6](https://github.com/medusajs/medusa/commit/57a2de64b209544c39af5a7dae43f1230cf36058))
- migration dirs ([e764d8e](https://github.com/medusajs/medusa/commit/e764d8e465fb2ce1a2330cc55097d15dde647074))
- PR ([e20ba1e](https://github.com/medusajs/medusa/commit/e20ba1e4faa8d13b3fc35c7c2fe8597c6ec8f41c))
- setup to allow login to Medusa Cloud ([bbd2f02](https://github.com/medusajs/medusa/commit/bbd2f02d549330df160c76cf1f4e4d5e7d08f246))
- test name registration ([e59dc3b](https://github.com/medusajs/medusa/commit/e59dc3b6c85db369c0b7dd3d097578fc2b527431))
- wip ([42d9a48](https://github.com/medusajs/medusa/commit/42d9a487ff1239f32a00bf47df3218ff3cf03217))
- **medusa:** Add free shipping functionality ([#241](https://github.com/medusajs/medusa/issues/241)) ([fb0613d](https://github.com/medusajs/medusa/commit/fb0613d3cbbfeb858b4a4a0f4da859b9692379bd))

### Features

- **cli:** adds seed script ([5136c77](https://github.com/medusajs/medusa/commit/5136c7740137afcda52393131ef931eb76ea9f5d))
- allow custom address on claims ([586f4d8](https://github.com/medusajs/medusa/commit/586f4d884c4b7b5b84fbd1f4dbf5c6fb2ffccf50))
- **medusa:** Swaps on swaps ([#229](https://github.com/medusajs/medusa/issues/229)) ([f8f1f57](https://github.com/medusajs/medusa/commit/f8f1f57fa1bcdc6f7ae4183e657a07e2641b1345))

## [1.1.23](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.22...@medusajs/medusa@1.1.23) (2021-04-29)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.22](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.19...@medusajs/medusa@1.1.22) (2021-04-28)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.21](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.20...@medusajs/medusa@1.1.21) (2021-04-20)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.20](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.19...@medusajs/medusa@1.1.20) (2021-04-20)

### Features

- **medusa:** Swaps on swaps ([#229](https://github.com/medusajs/medusa/issues/229)) ([f8f1f57](https://github.com/medusajs/medusa/commit/f8f1f57fa1bcdc6f7ae4183e657a07e2641b1345))

## [1.1.19](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.18...@medusajs/medusa@1.1.19) (2021-04-13)

### Bug Fixes

- adds tests ([69442a1](https://github.com/medusajs/medusa/commit/69442a1735193aeb010043f114d89037d4d76279))
- creates restock functionality ([2b25550](https://github.com/medusajs/medusa/commit/2b2555004e52e97c15bfca59e030fdfc3d86ae49))
- deps ([a9ea38c](https://github.com/medusajs/medusa/commit/a9ea38c2005beb63e14ed151e25ecd26819c748c))
- merge develop ([a468c45](https://github.com/medusajs/medusa/commit/a468c451e82c68f41b5005a2e480057f6124aaa6))
- working api ([9d81097](https://github.com/medusajs/medusa/commit/9d810971a7e0de2a586b5c9c372f0aad2818918b))
- **medusa:** Move discount usage from rule to discount ([d9cd52a](https://github.com/medusajs/medusa/commit/d9cd52a1776e9a334b155d37e58d73f456e3a028))

### Features

- restock service ([8bd5fa8](https://github.com/medusajs/medusa/commit/8bd5fa821286a90f3ab21e8c96993ac543fb7cab))

## [1.1.18](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.17...@medusajs/medusa@1.1.18) (2021-04-09)

### Bug Fixes

- adds tests ([69442a1](https://github.com/medusajs/medusa/commit/69442a1735193aeb010043f114d89037d4d76279))
- creates restock functionality ([2b25550](https://github.com/medusajs/medusa/commit/2b2555004e52e97c15bfca59e030fdfc3d86ae49))
- deps ([a9ea38c](https://github.com/medusajs/medusa/commit/a9ea38c2005beb63e14ed151e25ecd26819c748c))
- working api ([9d81097](https://github.com/medusajs/medusa/commit/9d810971a7e0de2a586b5c9c372f0aad2818918b))
- **medusa:** Move discount usage from rule to discount ([d9cd52a](https://github.com/medusajs/medusa/commit/d9cd52a1776e9a334b155d37e58d73f456e3a028))

### Features

- restock service ([8bd5fa8](https://github.com/medusajs/medusa/commit/8bd5fa821286a90f3ab21e8c96993ac543fb7cab))

## [1.1.17](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.16...@medusajs/medusa@1.1.17) (2021-03-30)

### Bug Fixes

- publish assist ([7719957](https://github.com/medusajs/medusa/commit/7719957b44a0c0d950eff948faf31188fe0e3ef1))

## [1.1.16](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.16...@medusajs/medusa@1.1.16) (2021-03-30)

### Bug Fixes

- publish assist ([7719957](https://github.com/medusajs/medusa/commit/7719957b44a0c0d950eff948faf31188fe0e3ef1))

## [1.1.15](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.16...@medusajs/medusa@1.1.15) (2021-03-30)

### Bug Fixes

- publish assist ([7719957](https://github.com/medusajs/medusa/commit/7719957b44a0c0d950eff948faf31188fe0e3ef1))

## [1.1.16](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.15...@medusajs/medusa@1.1.16) (2021-03-26)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.15](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.14...@medusajs/medusa@1.1.15) (2021-03-18)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.14](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.13...@medusajs/medusa@1.1.14) (2021-03-17)

### Bug Fixes

- expose statusses on order ([a26b12a](https://github.com/medusajs/medusa/commit/a26b12a5367738d9434dc46fadaea6f9a5d5a498))
- **medusa:** Add usage_count + usage_limit to discount ([c513813](https://github.com/medusajs/medusa/commit/c513813bb680486f309f68b03bf878151e0a7b1e))

## [1.1.13](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.11...@medusajs/medusa@1.1.13) (2021-03-17)

### Bug Fixes

- add region to gift-cards ([ffac0d3](https://github.com/medusajs/medusa/commit/ffac0d3a3de876a5fe5b6b75910ef02f249fae4c))
- adds integration test to create endpoint ([521d306](https://github.com/medusajs/medusa/commit/521d306b7126a820297d7374b9c16bea465fa643))
- allows shipping option filters in return ([#202](https://github.com/medusajs/medusa/issues/202)) ([7c7f86e](https://github.com/medusajs/medusa/commit/7c7f86e8e8be20173e774ea86b53e75c98e72e9a))
- contentful sync ([#206](https://github.com/medusajs/medusa/issues/206)) ([227cdb6](https://github.com/medusajs/medusa/commit/227cdb622234126df6087992203ce82ff9446974))
- enable gift-card creation without order_id ([9ce935a](https://github.com/medusajs/medusa/commit/9ce935a779aec90ff1ad301c73114ab69ce51b36))
- enable gift-card creation without order_id ([#195](https://github.com/medusajs/medusa/issues/195)) ([1263d24](https://github.com/medusajs/medusa/commit/1263d24ca380918345c844c1793f2706a49f85c6))
- merge ([49f1d0f](https://github.com/medusajs/medusa/commit/49f1d0f67a3eb285397d8b7c8e9033fcf42589ff))
- merge ([31d5bb0](https://github.com/medusajs/medusa/commit/31d5bb017d3028beb5325185ccec80cd1772165e))
- **medusa:** expose items.refundable ([3fbf38f](https://github.com/medusajs/medusa/commit/3fbf38ffc93b969adbb5033e5b7cb31aeff36896))
- merge api ([6ad2b0e](https://github.com/medusajs/medusa/commit/6ad2b0e6e9f339f60a3cc9d8674e5055121685b4))
- **medusa:** Upsert product images ([#200](https://github.com/medusajs/medusa/issues/200)) ([a031f1f](https://github.com/medusajs/medusa/commit/a031f1f33873dddd0246e668c5b98c12bbaa108b))
- round totals ([a1ba2e8](https://github.com/medusajs/medusa/commit/a1ba2e8b5cdf586ac2d646f2334e46ceae96bc8f))
- test ([caf1ecf](https://github.com/medusajs/medusa/commit/caf1ecfd5af58559d035d6c17a4993bdd6a5cc0b))

### Features

- **medusa:** Add support for filtering with gt, lt, gte and lte ([#190](https://github.com/medusajs/medusa/issues/190)) ([dd0491f](https://github.com/medusajs/medusa/commit/dd0491f52132aed24f642589b12fcf636b719580))
- **medusa:** cart context ([#201](https://github.com/medusajs/medusa/issues/201)) ([dd7b306](https://github.com/medusajs/medusa/commit/dd7b306333fbe1042f5cf2bed614bce84ea9475f))
- **medusa:** storefront return ([#194](https://github.com/medusajs/medusa/issues/194)) ([252db5e](https://github.com/medusajs/medusa/commit/252db5ef7e09e844fac72bbb8e2b2de34a541d25))

## [1.1.12](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.11...@medusajs/medusa@1.1.12) (2021-03-17)

### Bug Fixes

- add region to gift-cards ([ffac0d3](https://github.com/medusajs/medusa/commit/ffac0d3a3de876a5fe5b6b75910ef02f249fae4c))
- adds integration test to create endpoint ([521d306](https://github.com/medusajs/medusa/commit/521d306b7126a820297d7374b9c16bea465fa643))
- allows shipping option filters in return ([#202](https://github.com/medusajs/medusa/issues/202)) ([7c7f86e](https://github.com/medusajs/medusa/commit/7c7f86e8e8be20173e774ea86b53e75c98e72e9a))
- contentful sync ([#206](https://github.com/medusajs/medusa/issues/206)) ([227cdb6](https://github.com/medusajs/medusa/commit/227cdb622234126df6087992203ce82ff9446974))
- enable gift-card creation without order_id ([9ce935a](https://github.com/medusajs/medusa/commit/9ce935a779aec90ff1ad301c73114ab69ce51b36))
- enable gift-card creation without order_id ([#195](https://github.com/medusajs/medusa/issues/195)) ([1263d24](https://github.com/medusajs/medusa/commit/1263d24ca380918345c844c1793f2706a49f85c6))
- merge ([49f1d0f](https://github.com/medusajs/medusa/commit/49f1d0f67a3eb285397d8b7c8e9033fcf42589ff))
- merge ([31d5bb0](https://github.com/medusajs/medusa/commit/31d5bb017d3028beb5325185ccec80cd1772165e))
- **medusa:** expose items.refundable ([3fbf38f](https://github.com/medusajs/medusa/commit/3fbf38ffc93b969adbb5033e5b7cb31aeff36896))
- merge api ([6ad2b0e](https://github.com/medusajs/medusa/commit/6ad2b0e6e9f339f60a3cc9d8674e5055121685b4))
- **medusa:** Upsert product images ([#200](https://github.com/medusajs/medusa/issues/200)) ([a031f1f](https://github.com/medusajs/medusa/commit/a031f1f33873dddd0246e668c5b98c12bbaa108b))
- round totals ([a1ba2e8](https://github.com/medusajs/medusa/commit/a1ba2e8b5cdf586ac2d646f2334e46ceae96bc8f))
- test ([caf1ecf](https://github.com/medusajs/medusa/commit/caf1ecfd5af58559d035d6c17a4993bdd6a5cc0b))

### Features

- **medusa:** Add support for filtering with gt, lt, gte and lte ([#190](https://github.com/medusajs/medusa/issues/190)) ([dd0491f](https://github.com/medusajs/medusa/commit/dd0491f52132aed24f642589b12fcf636b719580))
- **medusa:** cart context ([#201](https://github.com/medusajs/medusa/issues/201)) ([dd7b306](https://github.com/medusajs/medusa/commit/dd7b306333fbe1042f5cf2bed614bce84ea9475f))
- **medusa:** storefront return ([#194](https://github.com/medusajs/medusa/issues/194)) ([252db5e](https://github.com/medusajs/medusa/commit/252db5ef7e09e844fac72bbb8e2b2de34a541d25))

## [1.1.11](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.10...@medusajs/medusa@1.1.11) (2021-02-25)

### Bug Fixes

- **medusa:** Add querying func. on customer retrievals ([#181](https://github.com/medusajs/medusa/issues/181)) ([22be418](https://github.com/medusajs/medusa/commit/22be418ec132944afe469106ba4b3b92f634d240))

## [1.1.10](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.10-next.1...@medusajs/medusa@1.1.10) (2021-02-25)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.10-next.1](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.10-next.0...@medusajs/medusa@1.1.10-next.1) (2021-02-25)

### Bug Fixes

- update-product ([0320788](https://github.com/medusajs/medusa/commit/0320788aacf93da8a8951c6a540656da1772dba4))

## [1.1.10-next.0](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.9...@medusajs/medusa@1.1.10-next.0) (2021-02-22)

### Features

- **medusa:** tracking links ([#177](https://github.com/medusajs/medusa/issues/177)) ([99ad43b](https://github.com/medusajs/medusa/commit/99ad43bf47c3922f391d433448b1c4affd88f457))

## [1.1.9](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.8...@medusajs/medusa@1.1.9) (2021-02-18)

### Bug Fixes

- performant relations ([5659d10](https://github.com/medusajs/medusa/commit/5659d106e3be139fcf2b32b48ce4c7fa5f678a8b))

## [1.1.8](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.7...@medusajs/medusa@1.1.8) (2021-02-17)

### Bug Fixes

- test ([4229e24](https://github.com/medusajs/medusa/commit/4229e241d03986039d283d98e034eaaefb50e04d))
- use parallel relation fetching ([#173](https://github.com/medusajs/medusa/issues/173)) ([46006e4](https://github.com/medusajs/medusa/commit/46006e4b0647bada1dc2cb417766e22f65bad23e))

### Features

- notifications ([#172](https://github.com/medusajs/medusa/issues/172)) ([7308946](https://github.com/medusajs/medusa/commit/7308946e567ed4e63e1ed3d9d31b30c4f1a73f0d))
- **medusa:** Product category, type and tags ([c4d1203](https://github.com/medusajs/medusa/commit/c4d1203155b7cc03e8892f0409efec83e030063e))

## [1.1.7](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.6...@medusajs/medusa@1.1.7) (2021-02-08)

### Features

- adds paypal ([#168](https://github.com/medusajs/medusa/issues/168)) ([#169](https://github.com/medusajs/medusa/issues/169)) ([427ae25](https://github.com/medusajs/medusa/commit/427ae25016bb3a22ebc05aa7b18017132846567c))

## [1.1.6](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.5...@medusajs/medusa@1.1.6) (2021-02-03)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.5](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.4...@medusajs/medusa@1.1.5) (2021-02-03)

### Features

- **medusa,brightpearl,segment,webshipper:** claims ([#163](https://github.com/medusajs/medusa/issues/163)) ([690d339](https://github.com/medusajs/medusa/commit/690d33966754a7dbe159c3ac09712a3c3bfaff0b))

## [1.1.4](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.3...@medusajs/medusa@1.1.4) (2021-01-29)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.3](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.2...@medusajs/medusa@1.1.3) (2021-01-27)

### Bug Fixes

- tax_rate extraction in totals service ([#156](https://github.com/medusajs/medusa/issues/156)) ([178d12f](https://github.com/medusajs/medusa/commit/178d12fc7107875b62126a63a32c7e9738a69000))

## [1.1.2](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.1...@medusajs/medusa@1.1.2) (2021-01-27)

### Features

- adds discount code search functionality ([#155](https://github.com/medusajs/medusa/issues/155)) ([7e14da1](https://github.com/medusajs/medusa/commit/7e14da1225983dd58faabbd6d555818277ad4cc8))

## [1.1.1](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.0...@medusajs/medusa@1.1.1) (2021-01-26)

### Bug Fixes

- customer not found ([#152](https://github.com/medusajs/medusa/issues/152)) ([282eaae](https://github.com/medusajs/medusa/commit/282eaae67555f9989fa90c0aa3acf7de84957b46))

# [1.1.0](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.56...@medusajs/medusa@1.1.0) (2021-01-26)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.56](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.55...@medusajs/medusa@1.0.56) (2021-01-06)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.55](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.54...@medusajs/medusa@1.0.55) (2021-01-06)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.54](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.53...@medusajs/medusa@1.0.54) (2020-12-28)

### Features

- **medusa:** Adds filtering to order listing for use in admin ([#149](https://github.com/medusajs/medusa/issues/149)) ([09d7ed2](https://github.com/medusajs/medusa/commit/09d7ed232bb07e9dab3d7535ec98f5fd88ad8ca2))

## [1.0.53](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.52...@medusajs/medusa@1.0.53) (2020-12-17)

### Features

- **medusa:** Adds product variant sale price ([#148](https://github.com/medusajs/medusa/issues/148)) ([451451a](https://github.com/medusajs/medusa/commit/451451a38eeffa88e04f1992c4026882cd2be66f))

## [1.0.52](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.51...@medusajs/medusa@1.0.52) (2020-12-09)

### Bug Fixes

- .gitignore ([ed4d2b4](https://github.com/medusajs/medusa/commit/ed4d2b4b3d7ae4dce834e83d776781f2dbbccb52))

## [1.0.51](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.50...@medusajs/medusa@1.0.51) (2020-12-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.50](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.49...@medusajs/medusa@1.0.50) (2020-12-08)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.49](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.48...@medusajs/medusa@1.0.49) (2020-12-04)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.48](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.47...@medusajs/medusa@1.0.48) (2020-12-02)

### Bug Fixes

- allow swaps with total < 0 ([#143](https://github.com/medusajs/medusa/issues/143)) ([304431e](https://github.com/medusajs/medusa/commit/304431e7c35e73b5dcd3ad4f28574b7cda091355))

## [1.0.47](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.46...@medusajs/medusa@1.0.47) (2020-11-29)

### Bug Fixes

- swaps with discounts ([#142](https://github.com/medusajs/medusa/issues/142)) ([aae8d5e](https://github.com/medusajs/medusa/commit/aae8d5e1128daa433b333483094cceeba4389c17))

## [1.0.46](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.45...@medusajs/medusa@1.0.46) (2020-11-28)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.45](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.44...@medusajs/medusa@1.0.45) (2020-11-26)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.44](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.43...@medusajs/medusa@1.0.44) (2020-11-24)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.43](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.42...@medusajs/medusa@1.0.43) (2020-11-24)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.42](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.41...@medusajs/medusa@1.0.42) (2020-11-13)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.41](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.40...@medusajs/medusa@1.0.41) (2020-11-13)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.40](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.39...@medusajs/medusa@1.0.40) (2020-11-13)

### Features

- **medusa:** Adds shipped status to line items + Capture fails will give payment_status = requires_action ([6a3c545](https://github.com/medusajs/medusa/commit/6a3c5455371c33e47722c7ab433a48d1d9b5b511))

## [1.0.39](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.38...@medusajs/medusa@1.0.39) (2020-11-05)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.38](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.37...@medusajs/medusa@1.0.38) (2020-11-05)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.37](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.36...@medusajs/medusa@1.0.37) (2020-11-04)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.36](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.35...@medusajs/medusa@1.0.36) (2020-11-04)

### Features

- **medusa:** Adds set and delete metadata endpoints for region and orders ([#131](https://github.com/medusajs/medusa/issues/131)) ([d67b6e6](https://github.com/medusajs/medusa/commit/d67b6e6ebe30ad18c0d1a012732a75e47a3f4a35))

## [1.0.35](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.34...@medusajs/medusa@1.0.35) (2020-11-02)

### Bug Fixes

- add country code on preCartCreation ([e3faa64](https://github.com/medusajs/medusa/commit/e3faa646a7b91d2686b56718df46bea5b709731b))

## [1.0.34](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.33...@medusajs/medusa@1.0.34) (2020-10-31)

### Bug Fixes

- adds field selection to list order endpoint ([#133](https://github.com/medusajs/medusa/issues/133)) ([b1786ce](https://github.com/medusajs/medusa/commit/b1786ce9d8684b1611c994380e39b25c3ac181a1))

## [1.0.33](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.32...@medusajs/medusa@1.0.33) (2020-10-28)

### Features

- **medusa:** adds support for gift cards ([#132](https://github.com/medusajs/medusa/issues/132)) ([f2c62cd](https://github.com/medusajs/medusa/commit/f2c62cd2321c9013c15160a80598f912daef4647))

## [1.0.32](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.31...@medusajs/medusa@1.0.32) (2020-10-20)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.31](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.30...@medusajs/medusa@1.0.31) (2020-10-20)

### Features

- **medusa-interfaces:** Adds schema options to base model ([cc23a3b](https://github.com/medusajs/medusa/commit/cc23a3b0706c41ec57bb25ea3de9c6e39bd04f31))

## [1.0.30](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.29...@medusajs/medusa@1.0.30) (2020-10-20)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.29](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.28...@medusajs/medusa@1.0.29) (2020-10-20)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.28](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.27...@medusajs/medusa@1.0.28) (2020-10-19)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.27](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.26...@medusajs/medusa@1.0.27) (2020-10-17)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.26](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.25...@medusajs/medusa@1.0.26) (2020-10-14)

### Features

- return shipping and flow ([#125](https://github.com/medusajs/medusa/issues/125)) ([c1e821d](https://github.com/medusajs/medusa/commit/c1e821d9d4d33756c7309e5cf110d7aa9b67297d))

## [1.0.25](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.24...@medusajs/medusa@1.0.25) (2020-10-08)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.24](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.23...@medusajs/medusa@1.0.24) (2020-10-08)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.23](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.22...@medusajs/medusa@1.0.23) (2020-10-06)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.22](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.21...@medusajs/medusa@1.0.22) (2020-10-06)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.21](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.20...@medusajs/medusa@1.0.21) (2020-10-05)

### Bug Fixes

- **medusa-plugin-brightpearl:** reliable oauth ([#119](https://github.com/medusajs/medusa/issues/119)) ([0889059](https://github.com/medusajs/medusa/commit/0889059ba178e976c5f6c4a0e938a463dde29554))

## [1.0.20](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.19...@medusajs/medusa@1.0.20) (2020-10-05)

### Bug Fixes

- **medusa-plugin-addon:** Fixes admin endpoints, Adds flag to avoid merging add-on line-items ([d8483cd](https://github.com/medusajs/medusa/commit/d8483cd1352ecc587112723786b7c31882f9416e))

### Features

- webshipper ([#118](https://github.com/medusajs/medusa/issues/118)) ([893a7f6](https://github.com/medusajs/medusa/commit/893a7f69afea67e854a67fc3b92c8a10c9c1b75c))

## [1.0.19](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.18...@medusajs/medusa@1.0.19) (2020-09-21)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.18](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.17...@medusajs/medusa@1.0.18) (2020-09-21)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.17](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.16...@medusajs/medusa@1.0.17) (2020-09-18)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.16](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.15...@medusajs/medusa@1.0.16) (2020-09-11)

### Bug Fixes

- **medusa:** add line item to order.gift_card_created event ([c5019ca](https://github.com/medusajs/medusa/commit/c5019ca0d1ee708ab3be441e084023d0bbccef72))

## [1.0.15](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.14...@medusajs/medusa@1.0.15) (2020-09-10)

### Bug Fixes

- cron jobs and brightpearl auto refresh ([#107](https://github.com/medusajs/medusa/issues/107)) ([c7bd783](https://github.com/medusajs/medusa/commit/c7bd7838aa620d6f23d9f5e17592cc5a82818c9e))

## [1.0.14](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.13...@medusajs/medusa@1.0.14) (2020-09-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.13](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.12...@medusajs/medusa@1.0.13) (2020-09-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.12](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.11...@medusajs/medusa@1.0.12) (2020-09-09)

### Features

- **plugins:** Adds add-on plugin ([3de1e6d](https://github.com/medusajs/medusa/commit/3de1e6dd4ad4a2a48d4d8116ebdd011efce2b22a))

## 1.0.11 (2020-09-09)

## 1.0.10 (2020-09-09)

### Bug Fixes

- updates license ([db519fb](https://github.com/medusajs/medusa/commit/db519fbaa6f8ad02c19cbecba5d4f28ba1ee81aa))

## 1.0.9 (2020-09-08)

## 1.0.8 (2020-09-08)

### Bug Fixes

- fulfillment api ([#104](https://github.com/medusajs/medusa/issues/104)) ([1e04be9](https://github.com/medusajs/medusa/commit/1e04be90c8fbea5bec3e0e30d68ce1458d640041))

## 1.0.7 (2020-09-07)

## 1.0.6 (2020-09-07)

### Bug Fixes

- **medusa:** secure cookies in staging ([7e2446f](https://github.com/medusajs/medusa/commit/7e2446f52e5cfcc4c5b9f5625dccccfab420500c))

## 1.0.1 (2020-09-05)

### Bug Fixes

- **medusa:** adds fulfillment_created event in order service ([#101](https://github.com/medusajs/medusa/issues/101)) ([021544d](https://github.com/medusajs/medusa/commit/021544d454d79a2a1ac15c3c378147b7b572acb7))

## 1.0.1-beta.0 (2020-09-04)

### Bug Fixes

- **medusa:** product variant metadata ([#98](https://github.com/medusajs/medusa/issues/98)) ([520115a](https://github.com/medusajs/medusa/commit/520115a2cef7ee3f0259a682bd82e693c6327790))

# 1.0.0 (2020-09-03)

# 1.0.0-y.25 (2020-09-03)

# 1.0.0-y.17 (2020-09-01)

### Bug Fixes

- all redis urls correct ([473d702](https://github.com/medusajs/medusa/commit/473d7025dfea9b0472f102877a1cebb9e10b9407))

# 1.0.0-y.16 (2020-09-01)

### Bug Fixes

- all redis urls correct ([11a9f38](https://github.com/medusajs/medusa/commit/11a9f38bce63c7d5907a04a21bf77802d5d19d64))

# 1.0.0-y.15 (2020-09-01)

### Bug Fixes

- debug ([aece0ff](https://github.com/medusajs/medusa/commit/aece0ff3abd0126f07273ed91b2b178a1cf00d3f))

# 1.0.0-y.14 (2020-09-01)

### Bug Fixes

- pass config to service loader ([d7cd7e9](https://github.com/medusajs/medusa/commit/d7cd7e9674da847fc9c9fc329cb7684e086840de))

# 1.0.0-y.13 (2020-09-01)

### Bug Fixes

- use medusa config for env vars ([61dc478](https://github.com/medusajs/medusa/commit/61dc4780842336d2f0e12334c461cd206c6ac4a1))

# 1.0.0-y.12 (2020-09-01)

### Bug Fixes

- asValue registrations ([5504281](https://github.com/medusajs/medusa/commit/5504281e8a659b34b8d2e2d4615765eadfca91dc))

# 1.0.0-y.11 (2020-09-01)

### Bug Fixes

- use fewer redis connections ([b5ee323](https://github.com/medusajs/medusa/commit/b5ee323bf68606af596fb8ba4a941b950f06abd3))

# 1.0.0-y.9 (2020-09-01)

### Bug Fixes

- more economical use of redis clients ([b85417a](https://github.com/medusajs/medusa/commit/b85417a9b7584a8153a1265bbb914ed7f9f75a8a))

# 1.0.0-y.8 (2020-09-01)

### Bug Fixes

- more economical use of redis clients ([fdfc213](https://github.com/medusajs/medusa/commit/fdfc213d243ee5b0d8685cae62ab5c3c6cfff1db))

# 1.0.0-y.4 (2020-08-31)

### Bug Fixes

- add tax_code to regions ([e8afb6b](https://github.com/medusajs/medusa/commit/e8afb6b9683857c1eced3dd43b39c1bbc2c911f5))

# 1.0.0-y.3 (2020-08-31)

### Bug Fixes

- auto pick country in 1 country regions ([d11eb8f](https://github.com/medusajs/medusa/commit/d11eb8fa65e0d036f88890ed7fd771a607f75cbc))

# 1.0.0-y.0 (2020-08-30)

### Bug Fixes

- removes unnecessary import ([270645d](https://github.com/medusajs/medusa/commit/270645deb2f9931cd7a48549ffd9254c53a62df4))

# 1.0.0-alpha.37 (2020-08-30)

### Bug Fixes

- update password hashing ([16d3c88](https://github.com/medusajs/medusa/commit/16d3c88c4f2416abc106ee318d1b1a05301ab9bf))

# 1.0.0-alpha.36 (2020-08-30)

# 1.0.0-alpha.31 (2020-08-28)

### Bug Fixes

- better rounding of totals ([3093cba](https://github.com/medusajs/medusa/commit/3093cba610992225ab51bee05ec1e5c84c7e0fed))

# 1.0.0-alpha.30 (2020-08-28)

# 1.0.0-alpha.27 (2020-08-27)

### Bug Fixes

- **completeOrder:** removes payment capture ([db3c332](https://github.com/medusajs/medusa/commit/db3c332a997101d86b935b5407d5e3b7382b3f2e))
- **contentful-plugin:** Keep existing entry fields ([eb47896](https://github.com/medusajs/medusa/commit/eb478966684776bb2aa48e98789519644b05cd33))
- **discount:** allow all updates on discounts ([d8aac75](https://github.com/medusajs/medusa/commit/d8aac759cf5067c640ca0f61ff7e557c5ed530e9))
- **medusa:** allow multiple fulfillments ([0856645](https://github.com/medusajs/medusa/commit/0856645a1156a3b4a97f0ef50cf529dab344d993))
- **order:** Adds display_id to free text search ([cfa7417](https://github.com/medusajs/medusa/commit/cfa74179dcad018e4a1fca1c98ae905a5721fb44))

### Features

- **pagination:** Adds MVP pagination to orders and products for admin routes ([9dc6999](https://github.com/medusajs/medusa/commit/9dc6999a9a0c11d33eb9affa953ad1b44bd5e8b8))

# 1.0.0-alpha.24 (2020-08-27)

# 1.0.0-alpha.22 (2020-08-25)

# 1.0.0-alpha.21 (2020-08-25)

### Bug Fixes

- **order:** sends order to fulfillment provider ([450f7d9](https://github.com/medusajs/medusa/commit/450f7d96f937a9e5eba6107bf3ad1cc880ed641c))

# 1.0.0-alpha.15 (2020-08-22)

# 1.0.0-alpha.14 (2020-08-22)

# 1.0.0-alpha.13 (2020-08-22)

# 1.0.0-alpha.12 (2020-08-22)

# 1.0.0-alpha.11 (2020-08-22)

# 1.0.0-alpha.10 (2020-08-22)

# 1.0.0-alpha.9 (2020-08-21)

# 1.0.0-alpha.8 (2020-08-21)

# 1.0.0-alpha.7 (2020-08-21)

# 1.0.0-alpha.6 (2020-08-21)

# 1.0.0-alpha.4 (2020-08-20)

# 1.0.0-alpha.3 (2020-08-20)

# 1.0.0-alpha.2 (2020-08-20)

# 1.0.0-alpha.1 (2020-08-20)

# 1.0.0-alpha.0 (2020-08-20)

# 0.3.0 (2020-04-06)

# 0.2.0 (2020-04-06)

# 0.2.0-alpha.0 (2020-04-04)

## 0.1.12-alpha.0 (2020-03-24)

## 0.1.11-alpha.0 (2020-03-24)

## 0.1.10-alpha.0 (2020-03-24)

## 0.1.9-alpha.0 (2020-03-24)

## 0.1.8-alpha.0 (2020-03-24)

## 0.1.7-alpha.0 (2020-03-24)

## 0.1.6-alpha.0 (2020-03-24)

## 0.1.5-alpha.0 (2020-03-24)

## 0.1.4-alpha.0 (2020-03-24)

## 0.1.3-alpha.0 (2020-03-24)

## 0.1.2-alpha.0 (2020-03-24)

## 0.1.1-alpha.0 (2020-03-24)

# 0.1.0-alpha.0 (2020-03-24)

## [1.0.10](https://github.com/medusajs/medusa/compare/v1.0.9...v1.0.10) (2020-09-09)

### Bug Fixes

- updates license ([db519fb](https://github.com/medusajs/medusa/commit/db519fbaa6f8ad02c19cbecba5d4f28ba1ee81aa))
