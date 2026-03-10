# @medusajs/core-flows

## 2.13.3

### Patch Changes

- [#14805](https://github.com/medusajs/medusa/pull/14805) [`5ccd523b41efaae2f2aaa6d5833b5ce88558d37b`](https://github.com/medusajs/medusa/commit/5ccd523b41efaae2f2aaa6d5833b5ce88558d37b) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): prevent exception when deleting product/variant with orphaned inventory

- Updated dependencies [[`dbaae9630d26a0806751d5614beadef3e0b4bf07`](https://github.com/medusajs/medusa/commit/dbaae9630d26a0806751d5614beadef3e0b4bf07)]:
  - @medusajs/framework@2.13.3

## 2.13.2

### Patch Changes

- [#14660](https://github.com/medusajs/medusa/pull/14660) [`05262c0197bcc3c9cec89a3d95863916dba47af3`](https://github.com/medusajs/medusa/commit/05262c0197bcc3c9cec89a3d95863916dba47af3) Thanks [@Fadyy22](https://github.com/Fadyy22)! - chore(core-flows,medusa): Pass `created_by` to `createOrderShipmentWorkflow` in create order shipment admin endpoint and pass `marked_shipped_by` to `createShipmentWorkflow`

- [#14715](https://github.com/medusajs/medusa/pull/14715) [`09a80ab97aad62b65320c745899eb8517d256b40`](https://github.com/medusajs/medusa/commit/09a80ab97aad62b65320c745899eb8517d256b40) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows,order): avoid returning recreated credit lines due to version bumping as new credit lines in createOrderCreditLinesWorkflow

- [#14670](https://github.com/medusajs/medusa/pull/14670) [`29d3dee13700d36a70aa55b8f2a01a5cbc0b42d0`](https://github.com/medusajs/medusa/commit/29d3dee13700d36a70aa55b8f2a01a5cbc0b42d0) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): only consider captures amounts for credit line amount computation

- [#14773](https://github.com/medusajs/medusa/pull/14773) [`7a27e8ad8d7771eeecd1fb648a458f56abab71f9`](https://github.com/medusajs/medusa/commit/7a27e8ad8d7771eeecd1fb648a458f56abab71f9) Thanks [@picardplaisimond](https://github.com/picardplaisimond)! - chore(core-flows): Expose product weight as fallback for shipping calculations

- [#14665](https://github.com/medusajs/medusa/pull/14665) [`77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8`](https://github.com/medusajs/medusa/commit/77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: add forbidden error 403

- [#14749](https://github.com/medusajs/medusa/pull/14749) [`fe529f214a789b7e94fd0438c631d9f6b5cf5290`](https://github.com/medusajs/medusa/commit/fe529f214a789b7e94fd0438c631d9f6b5cf5290) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - chore(core-flows): include `stock_location` in validation context for flate rate shipping options

- [#14539](https://github.com/medusajs/medusa/pull/14539) [`63b7d5f1bee265959db73236c509dc7c9d0c1525`](https://github.com/medusajs/medusa/commit/63b7d5f1bee265959db73236c509dc7c9d0c1525) Thanks [@pepijn-vanvlaanderen](https://github.com/pepijn-vanvlaanderen)! - chore(core-flows): Add original item totals for cart refresh

- [#14781](https://github.com/medusajs/medusa/pull/14781) [`2b795b6cc1ca1b0787f014784c9cbf06d6ab6e96`](https://github.com/medusajs/medusa/commit/2b795b6cc1ca1b0787f014784c9cbf06d6ab6e96) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): credit only successful refunds upon order cancellation

- Updated dependencies [[`7aca778ae56069371f5d26a757d3b2276d524776`](https://github.com/medusajs/medusa/commit/7aca778ae56069371f5d26a757d3b2276d524776), [`77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8`](https://github.com/medusajs/medusa/commit/77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8)]:
  - @medusajs/framework@2.13.2

## 2.13.1

### Patch Changes

- [#14511](https://github.com/medusajs/medusa/pull/14511) [`2e2fad6c62a51373f97adcd06941f9182657d9d0`](https://github.com/medusajs/medusa/commit/2e2fad6c62a51373f97adcd06941f9182657d9d0) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): recompute adjustments changes are added in some draft order flows

- Updated dependencies []:
  - @medusajs/framework@2.13.1

## 2.13.0

### Minor Changes

- [`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor bump

### Patch Changes

- Updated dependencies [[`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7)]:
  - @medusajs/framework@2.13.0

## 2.12.6

### Patch Changes

- [#14561](https://github.com/medusajs/medusa/pull/14561) [`dfb27a638d913916ee534ecb0a06ae30f6f8a9de`](https://github.com/medusajs/medusa/commit/dfb27a638d913916ee534ecb0a06ae30f6f8a9de) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): pass created_by to fulfillment input

- [#14536](https://github.com/medusajs/medusa/pull/14536) [`d60ea7268a00f386f803f0f9e6ffeec4bced50bf`](https://github.com/medusajs/medusa/commit/d60ea7268a00f386f803f0f9e6ffeec4bced50bf) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(translation,fulfillment,customer,product,region,tax,core-flows,medusa,types): Implement dynamic translation settings management

- [#14567](https://github.com/medusajs/medusa/pull/14567) [`733026f96c23f01d1ceb2fb09f88aa2b9bb65841`](https://github.com/medusajs/medusa/commit/733026f96c23f01d1ceb2fb09f88aa2b9bb65841) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): Prevent calling list methods unnecessarily in various update workflows

- [#14359](https://github.com/medusajs/medusa/pull/14359) [`cec8b8e428131d4743d6da98cd5fa0974b8ab9e1`](https://github.com/medusajs/medusa/commit/cec8b8e428131d4743d6da98cd5fa0974b8ab9e1) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(core-flows,types,utils,medusa): Translate tax lines

- [#14528](https://github.com/medusajs/medusa/pull/14528) [`28fae96ceed68e2c15c3f27316c5b8601f06c478`](https://github.com/medusajs/medusa/commit/28fae96ceed68e2c15c3f27316c5b8601f06c478) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): Avoid throwing if no prices found for variant when adding to cart custom price item

- [#14466](https://github.com/medusajs/medusa/pull/14466) [`cbc9f3d059a65cc5ee26595e5cbccf7f05781e41`](https://github.com/medusajs/medusa/commit/cbc9f3d059a65cc5ee26595e5cbccf7f05781e41) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - chore(core-flows): Emit cart updated event on `deleteLineItemsWorkflow`

- [#14476](https://github.com/medusajs/medusa/pull/14476) [`7307a5e63fdf8ed6f0ff201a0383f0a0bbfc7002`](https://github.com/medusajs/medusa/commit/7307a5e63fdf8ed6f0ff201a0383f0a0bbfc7002) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(events): Implement priority-based event processing

  - Internal events default to lowest priority (2,097,152) to prevent queue overload
  - Normal events default to priority 100
  - Order placed events explicitly set to priority 10 for immediate processing
  - Support for priority overrides at message, emit, and module levels

- [#14597](https://github.com/medusajs/medusa/pull/14597) [`b615b71a8e4e273018a09528a8b61116fca6de8b`](https://github.com/medusajs/medusa/commit/b615b71a8e4e273018a09528a8b61116fca6de8b) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows, types): ensure promotion calculation context has required rules data

- [#14527](https://github.com/medusajs/medusa/pull/14527) [`3df466dadde91b24f52504097c07e1ced4b2b8ff`](https://github.com/medusajs/medusa/commit/3df466dadde91b24f52504097c07e1ced4b2b8ff) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(core-flows): Allow payment session status captured to be processable upon cart completion

- [#14598](https://github.com/medusajs/medusa/pull/14598) [`89e6e3e5cbe96f1f64e2cdb33cc2e0d6a221f7a2`](https://github.com/medusajs/medusa/commit/89e6e3e5cbe96f1f64e2cdb33cc2e0d6a221f7a2) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows, types): improve product exports memory consumption

- [#14441](https://github.com/medusajs/medusa/pull/14441) [`1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b`](https://github.com/medusajs/medusa/commit/1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(deps,framework): add zod as framework dependency

- Updated dependencies [[`13476988763368b3b333fa5bc3f613e8eb174fdf`](https://github.com/medusajs/medusa/commit/13476988763368b3b333fa5bc3f613e8eb174fdf), [`8890f284705a4843a57a3800820208f593689a2a`](https://github.com/medusajs/medusa/commit/8890f284705a4843a57a3800820208f593689a2a), [`1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b`](https://github.com/medusajs/medusa/commit/1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b)]:
  - @medusajs/framework@2.12.6

## 2.12.5

### Patch Changes

- Updated dependencies [[`233ec261be200fac83002415aa7c0df082339a3f`](https://github.com/medusajs/medusa/commit/233ec261be200fac83002415aa7c0df082339a3f)]:
  - @medusajs/framework@2.12.5

## 2.12.4

### Patch Changes

- [#14177](https://github.com/medusajs/medusa/pull/14177) [`a464e9d907e30bca86a1e8677f8ebf22c38638a2`](https://github.com/medusajs/medusa/commit/a464e9d907e30bca86a1e8677f8ebf22c38638a2) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): Avoid checking inventory items on fulfillment cancel for unmanaged inventory variants

- [#14460](https://github.com/medusajs/medusa/pull/14460) [`60f68ff492bc98013fc2f6e0b0b252182a1ee59c`](https://github.com/medusajs/medusa/commit/60f68ff492bc98013fc2f6e0b0b252182a1ee59c) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows): export getTranslatedShippingOptionsStep

- [#14454](https://github.com/medusajs/medusa/pull/14454) [`0ffd79010953315494c1b2ba1def477b7b1d9e4b`](https://github.com/medusajs/medusa/commit/0ffd79010953315494c1b2ba1def477b7b1d9e4b) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(translation): Add support for locale to the graph query

- [#14388](https://github.com/medusajs/medusa/pull/14388) [`bf4cc12545edc5bf249edc6ecec115c5f7a2b31f`](https://github.com/medusajs/medusa/commit/bf4cc12545edc5bf249edc6ecec115c5f7a2b31f) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(core-flows,utils): Shipping options workflow events emission

- [#14338](https://github.com/medusajs/medusa/pull/14338) [`c0ec54fc15fece373ac77f547706ab85eb5bc844`](https://github.com/medusajs/medusa/commit/c0ec54fc15fece373ac77f547706ab85eb5bc844) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows): fix type of getTranslatedLineItemsStep

- [#14264](https://github.com/medusajs/medusa/pull/14264) [`8055a79c5268528261c88d5f6f245d1003d87a6d`](https://github.com/medusajs/medusa/commit/8055a79c5268528261c88d5f6f245d1003d87a6d) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): conditionally create customer on order email update if unset

- [#14417](https://github.com/medusajs/medusa/pull/14417) [`43305a562cfba914654da056b0a7e03c40849678`](https://github.com/medusajs/medusa/commit/43305a562cfba914654da056b0a7e03c40849678) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,utils,core-flows): add reset password metdata

- [#14358](https://github.com/medusajs/medusa/pull/14358) [`11de7e3e3449f3a93724aaeed770a66840ffcaf9`](https://github.com/medusajs/medusa/commit/11de7e3e3449f3a93724aaeed770a66840ffcaf9) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(translation,core-flows): translate remaining core entities and sync shipping option <> method translations

- [#14356](https://github.com/medusajs/medusa/pull/14356) [`7e3ed913a6008a25974634d489f9339c40066125`](https://github.com/medusajs/medusa/commit/7e3ed913a6008a25974634d489f9339c40066125) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Create publishable API key in defaults

- Updated dependencies [[`181d5fa67122e4e5f38b91f6b716d35f2d08a204`](https://github.com/medusajs/medusa/commit/181d5fa67122e4e5f38b91f6b716d35f2d08a204), [`d347e369ce555064e24f2dc3cd93b9e4e73a006d`](https://github.com/medusajs/medusa/commit/d347e369ce555064e24f2dc3cd93b9e4e73a006d)]:
  - @medusajs/framework@2.12.4

## 2.12.3

### Patch Changes

- [#14225](https://github.com/medusajs/medusa/pull/14225) [`b3cb904e9bce3bfad649e500a9e1be0c9bff0e1a`](https://github.com/medusajs/medusa/commit/b3cb904e9bce3bfad649e500a9e1be0c9bff0e1a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(utils): currency epsilon

- [#14278](https://github.com/medusajs/medusa/pull/14278) [`31a057558c0ec6ff7233489a28edc1fda0ec5375`](https://github.com/medusajs/medusa/commit/31a057558c0ec6ff7233489a28edc1fda0ec5375) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(types,translations): fix types for translation and locale updates

- [#14327](https://github.com/medusajs/medusa/pull/14327) [`1743ed7f04585c597c9398a99899817b11310463`](https://github.com/medusajs/medusa/commit/1743ed7f04585c597c9398a99899817b11310463) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): Cart translation sync

- [#14267](https://github.com/medusajs/medusa/pull/14267) [`f13c23a4b709e31f9b2d42e98acc6e342c494403`](https://github.com/medusajs/medusa/commit/f13c23a4b709e31f9b2d42e98acc6e342c494403) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Sync order translations

- Updated dependencies [[`7b4dda5a179c78de5e099231ec407836db4c8dbd`](https://github.com/medusajs/medusa/commit/7b4dda5a179c78de5e099231ec407836db4c8dbd), [`8964a03fa1b9e6a4c443bf5b21d65d41a8441d29`](https://github.com/medusajs/medusa/commit/8964a03fa1b9e6a4c443bf5b21d65d41a8441d29), [`c8a7122ba918751b215dc0b19cf9b09b2c011ab8`](https://github.com/medusajs/medusa/commit/c8a7122ba918751b215dc0b19cf9b09b2c011ab8)]:
  - @medusajs/framework@2.12.3

## 2.12.2

### Patch Changes

- [#14226](https://github.com/medusajs/medusa/pull/14226) [`e4877616c38777f583fe0b58bb10d1c7cf41c0b3`](https://github.com/medusajs/medusa/commit/e4877616c38777f583fe0b58bb10d1c7cf41c0b3) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): sync cart translation synced

- [#14277](https://github.com/medusajs/medusa/pull/14277) [`a78f68fa46dceb8e201fe60e770bd9ea654390d8`](https://github.com/medusajs/medusa/commit/a78f68fa46dceb8e201fe60e770bd9ea654390d8) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(utils,core-flows): add events constant for translations and use it in workflows

- [#13963](https://github.com/medusajs/medusa/pull/13963) [`842c0f500721e08d448b6c5c80a725072106ccff`](https://github.com/medusajs/medusa/commit/842c0f500721e08d448b6c5c80a725072106ccff) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): refresh payment collection inside updateCartPromotionsWorkflow

- [#14270](https://github.com/medusajs/medusa/pull/14270) [`bca145bdbe674a73731f1672047ca44d426a37c1`](https://github.com/medusajs/medusa/commit/bca145bdbe674a73731f1672047ca44d426a37c1) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Add locks to order edit flows

- [#13841](https://github.com/medusajs/medusa/pull/13841) [`fdc2b722d91f446499123d71386e64d9da9265eb`](https://github.com/medusajs/medusa/commit/fdc2b722d91f446499123d71386e64d9da9265eb) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(medusa): Allow 'id' in shipping_address and billing_address in validator of store udpate cart route
  fix(core-flows): Update addresses nested fields when 'id' is provided in payload for update-carts step

- [#14233](https://github.com/medusajs/medusa/pull/14233) [`fea3d4ec49c3a7f7eb7d66bd58499e55ae9ec648`](https://github.com/medusajs/medusa/commit/fea3d4ec49c3a7f7eb7d66bd58499e55ae9ec648) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): Access orderItem.variant safely inside convertDraftOrderWorkflow when containing custom items

- Updated dependencies [[`9f7846ae0babbad39947a1f33d236bff8b5098d0`](https://github.com/medusajs/medusa/commit/9f7846ae0babbad39947a1f33d236bff8b5098d0), [`fe49b567d6d55ae224095c06c710d31d40887653`](https://github.com/medusajs/medusa/commit/fe49b567d6d55ae224095c06c710d31d40887653), [`6dc0b8bed84a330c1c24f4f1331f1ed078430a47`](https://github.com/medusajs/medusa/commit/6dc0b8bed84a330c1c24f4f1331f1ed078430a47), [`356283c359e5c30e0d31e6c6fd0fb8e16c025b78`](https://github.com/medusajs/medusa/commit/356283c359e5c30e0d31e6c6fd0fb8e16c025b78)]:
  - @medusajs/framework@2.12.2

## 2.12.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.12.1

## 2.12.0

### Patch Changes

- [#14028](https://github.com/medusajs/medusa/pull/14028) [`83dd1b616a9e78810001645bb815347cacc5b4d1`](https://github.com/medusajs/medusa/commit/83dd1b616a9e78810001645bb815347cacc5b4d1) Thanks [@pepijn-vanvlaanderen](https://github.com/pepijn-vanvlaanderen)! - fix(core-flows): add order metadata for createFulfillment

- [#13977](https://github.com/medusajs/medusa/pull/13977) [`9fdc00350a4aa006e4bfc3eddcc499737f18bdf3`](https://github.com/medusajs/medusa/commit/9fdc00350a4aa006e4bfc3eddcc499737f18bdf3) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): Lock process payment to prevent ingesting payment processing t…

- [#13876](https://github.com/medusajs/medusa/pull/13876) [`5499cd27494a68836a242cd34eb70fe9c141a713`](https://github.com/medusajs/medusa/commit/5499cd27494a68836a242cd34eb70fe9c141a713) Thanks [@SGFGOV](https://github.com/SGFGOV)! - fix(core-flows): payment error handling

- [#14056](https://github.com/medusajs/medusa/pull/14056) [`929607f6925581da67a9e955eedded2aab2bdc16`](https://github.com/medusajs/medusa/commit/929607f6925581da67a9e955eedded2aab2bdc16) Thanks [@vethan](https://github.com/vethan)! - fix(fulfillment) Variants changed from managed inventory to unmanaged are now fulfillable

- [#14010](https://github.com/medusajs/medusa/pull/14010) [`3e2991e44719c2a829696215862ae5fbd368fe37`](https://github.com/medusajs/medusa/commit/3e2991e44719c2a829696215862ae5fbd368fe37) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): create reservations on draft order conversion to regular order

- [#13979](https://github.com/medusajs/medusa/pull/13979) [`a5c6f6b1fb944a730b605a120f84b4f38f608f9f`](https://github.com/medusajs/medusa/commit/a5c6f6b1fb944a730b605a120f84b4f38f608f9f) Thanks [@leobenzol](https://github.com/leobenzol)! - fix(core-flows): update SendNotificationsStepInput

- [#13306](https://github.com/medusajs/medusa/pull/13306) [`78842af1c30de9c7561f10b4129aba4e1f30db27`](https://github.com/medusajs/medusa/commit/78842af1c30de9c7561f10b4129aba4e1f30db27) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix: Compute "virtual" adjustments for order previews

- [#14111](https://github.com/medusajs/medusa/pull/14111) [`0e73d8d5e3d04d62d444d17138f9cf61b7a236a2`](https://github.com/medusajs/medusa/commit/0e73d8d5e3d04d62d444d17138f9cf61b7a236a2) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): lock mark as delivered fulfillment/order flows

- [#14176](https://github.com/medusajs/medusa/pull/14176) [`8ddf8b4d764ae359d279498f08d85146d55077f0`](https://github.com/medusajs/medusa/commit/8ddf8b4d764ae359d279498f08d85146d55077f0) Thanks [@fPolic](https://github.com/fPolic)! - fix: skip promotion usage limit checks on edit flows

- [#14108](https://github.com/medusajs/medusa/pull/14108) [`79582bc94eb420f02ad49a81bcbcc02521e5c414`](https://github.com/medusajs/medusa/commit/79582bc94eb420f02ad49a81bcbcc02521e5c414) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): prevent completing cart from webhook when order already exists

- [#14128](https://github.com/medusajs/medusa/pull/14128) [`5da51064d7936c6d7a459cfa8b34eada65163e03`](https://github.com/medusajs/medusa/commit/5da51064d7936c6d7a459cfa8b34eada65163e03) Thanks [@fPolic](https://github.com/fPolic)! - feat: carry over promotions toggle on exchanges

- [#14105](https://github.com/medusajs/medusa/pull/14105) [`0cb12021efd2b8ad1cd6dc6801c5f29a87b28ad1`](https://github.com/medusajs/medusa/commit/0cb12021efd2b8ad1cd6dc6801c5f29a87b28ad1) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): Add discountable properties in queried fields to avoid overriding discountable properties when set

- [#13809](https://github.com/medusajs/medusa/pull/13809) [`a9d33bc8d11637230052f1729e85af5e174b2423`](https://github.com/medusajs/medusa/commit/a9d33bc8d11637230052f1729e85af5e174b2423) Thanks [@willbouch](https://github.com/willbouch)! - fix(core-flows,types): change doc for upload file functions

- [#14022](https://github.com/medusajs/medusa/pull/14022) [`0a0c2f41d8ef2c70f6e3b73251eb34499e83ea32`](https://github.com/medusajs/medusa/commit/0a0c2f41d8ef2c70f6e3b73251eb34499e83ea32) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): avoid overriding customer and region from setPricingContext hook result

- [#14104](https://github.com/medusajs/medusa/pull/14104) [`b81f958d4126ab99f09b9fef3b1f790b4bca1515`](https://github.com/medusajs/medusa/commit/b81f958d4126ab99f09b9fef3b1f790b4bca1515) Thanks [@peterlgh7](https://github.com/peterlgh7)! - add provider_data to notification model

- [#14024](https://github.com/medusajs/medusa/pull/14024) [`6746fecd727823b233a90edb1819d08555124464`](https://github.com/medusajs/medusa/commit/6746fecd727823b233a90edb1819d08555124464) Thanks [@adrien2p](https://github.com/adrien2p)! - Chore/order custom display

- [#14102](https://github.com/medusajs/medusa/pull/14102) [`f67bfb9f92b9ea4c06910ea203c685e18fafe1d7`](https://github.com/medusajs/medusa/commit/f67bfb9f92b9ea4c06910ea203c685e18fafe1d7) Thanks [@peterlgh7](https://github.com/peterlgh7)! - add from to notification model

- Updated dependencies [[`c2c3ad5ba53f1959422fb2d37297a8de8d714782`](https://github.com/medusajs/medusa/commit/c2c3ad5ba53f1959422fb2d37297a8de8d714782), [`7e3eb6e41316d7b04d32bc7186ed0c78de1aa539`](https://github.com/medusajs/medusa/commit/7e3eb6e41316d7b04d32bc7186ed0c78de1aa539), [`beb91d88a2f224075e4fcf35a0ee9483b3124504`](https://github.com/medusajs/medusa/commit/beb91d88a2f224075e4fcf35a0ee9483b3124504)]:
  - @medusajs/framework@2.12.0

## 2.11.3

### Patch Changes

- [#13910](https://github.com/medusajs/medusa/pull/13910) [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Dependencies cleanup and improvements

- [#13940](https://github.com/medusajs/medusa/pull/13940) [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Cleanup and organize deps

- [#13931](https://github.com/medusajs/medusa/pull/13931) [`990691e78a77a46bc581353de47945dd8f5d6928`](https://github.com/medusajs/medusa/commit/990691e78a77a46bc581353de47945dd8f5d6928) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(medusa): do not use transactionId for cart operations

- Updated dependencies [[`28c3ea68f5634792848f146ac6af5b27c848bf21`](https://github.com/medusajs/medusa/commit/28c3ea68f5634792848f146ac6af5b27c848bf21), [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d), [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff), [`37563987b8fe75c9acfe62957a33e8398977647a`](https://github.com/medusajs/medusa/commit/37563987b8fe75c9acfe62957a33e8398977647a), [`13d7d15be594ca413785eebe8f86b47c36cb9830`](https://github.com/medusajs/medusa/commit/13d7d15be594ca413785eebe8f86b47c36cb9830)]:
  - @medusajs/framework@2.11.3

## 2.11.2

### Patch Changes

- [#13623](https://github.com/medusajs/medusa/pull/13623) [`47572816778e21432d0201f4b2642a765c86fdbc`](https://github.com/medusajs/medusa/commit/47572816778e21432d0201f4b2642a765c86fdbc) Thanks [@fPolic](https://github.com/fPolic)! - feat: scoped variant images

- Updated dependencies [[`85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2`](https://github.com/medusajs/medusa/commit/85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2)]:
  - @medusajs/framework@2.11.2

## 2.11.1

### Patch Changes

- [#13747](https://github.com/medusajs/medusa/pull/13747) [`5df903f5fb52d1e37d13bfe72ed9c226c1eb46b4`](https://github.com/medusajs/medusa/commit/5df903f5fb52d1e37d13bfe72ed9c226c1eb46b4) Thanks [@pepijn-vanvlaanderen](https://github.com/pepijn-vanvlaanderen)! - Added shipping method data to tax module context

- Updated dependencies []:
  - @medusajs/framework@2.11.1

## 2.11.0

### Patch Changes

- [#13702](https://github.com/medusajs/medusa/pull/13702) [`0cbd9f0bc315b3eda1770ac301061f1576856387`](https://github.com/medusajs/medusa/commit/0cbd9f0bc315b3eda1770ac301061f1576856387) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Improve caching rollout

- [#13439](https://github.com/medusajs/medusa/pull/13439) [`12a96a7c7015f011f5e29a1d387f835e514ba536`](https://github.com/medusajs/medusa/commit/12a96a7c7015f011f5e29a1d387f835e514ba536) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Move peer deps into a single package and re export from framework

- [#13182](https://github.com/medusajs/medusa/pull/13182) [`9c957e1da04c1f86d1caa7de279993453b76bb63`](https://github.com/medusajs/medusa/commit/9c957e1da04c1f86d1caa7de279993453b76bb63) Thanks [@leobenzol](https://github.com/leobenzol)! - chore(core-flows): only allow published products in addToCartWorkflow

- [#13594](https://github.com/medusajs/medusa/pull/13594) [`1b57e5c58ab5c656da398b69444c2b9baba2e35e`](https://github.com/medusajs/medusa/commit/1b57e5c58ab5c656da398b69444c2b9baba2e35e) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(core-flows): skip locking on sub workflows by default

- [#13451](https://github.com/medusajs/medusa/pull/13451) [`7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1`](https://github.com/medusajs/medusa/commit/7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1) Thanks [@fPolic](https://github.com/fPolic)! - feat: support limiting promotion usage by attribute

- [#13645](https://github.com/medusajs/medusa/pull/13645) [`76aa4a48b3cbec519ab16c96cc87ee3288de28de`](https://github.com/medusajs/medusa/commit/76aa4a48b3cbec519ab16c96cc87ee3288de28de) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix/workflows concurrency

- [#13435](https://github.com/medusajs/medusa/pull/13435) [`b9d6f73320c36c53235b12fb8397b30a448917f0`](https://github.com/medusajs/medusa/commit/b9d6f73320c36c53235b12fb8397b30a448917f0) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(): distributed caching

- [#13695](https://github.com/medusajs/medusa/pull/13695) [`924564bee505fc8787945c6d683243cef5799625`](https://github.com/medusajs/medusa/commit/924564bee505fc8787945c6d683243cef5799625) Thanks [@willbouch](https://github.com/willbouch)! - fix(core-flows): customer id filter not working in getOrderDetails

- [#13668](https://github.com/medusajs/medusa/pull/13668) [`8acfb88c2b627ba6ba4a2827bcb78c3bb74c22f8`](https://github.com/medusajs/medusa/commit/8acfb88c2b627ba6ba4a2827bcb78c3bb74c22f8) Thanks [@willbouch](https://github.com/willbouch)! - fix(core-flows): lock draft order workflows

- [#13724](https://github.com/medusajs/medusa/pull/13724) [`a61d1825eaef4bece20704fe6ae21d9da841b2f2`](https://github.com/medusajs/medusa/commit/a61d1825eaef4bece20704fe6ae21d9da841b2f2) Thanks [@willbouch](https://github.com/willbouch)! - fix(utils,core-flows): fix import erasing tags, categories and others

- [#13598](https://github.com/medusajs/medusa/pull/13598) [`087887fefb948e6676001ad2dc2cb265ae6f7430`](https://github.com/medusajs/medusa/commit/087887fefb948e6676001ad2dc2cb265ae6f7430) Thanks [@willbouch](https://github.com/willbouch)! - feat(core-flows): support ad hoc returns

- [#13450](https://github.com/medusajs/medusa/pull/13450) [`8ece06d8ed6a197ebb370918c49a3ec5c21dd186`](https://github.com/medusajs/medusa/commit/8ece06d8ed6a197ebb370918c49a3ec5c21dd186) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Upgrade mikro orm 6.5.4

- [#13649](https://github.com/medusajs/medusa/pull/13649) [`bb08edd41fd954306b0feacf6a6a69b87d9287dd`](https://github.com/medusajs/medusa/commit/bb08edd41fd954306b0feacf6a6a69b87d9287dd) Thanks [@willbouch](https://github.com/willbouch)! - fix(medusa,file-local,file-s3,core-flows): fix csv parsing special characters

- [#13511](https://github.com/medusajs/medusa/pull/13511) [`5ea32aaa44a47b143c46f895032478334b7379ca`](https://github.com/medusajs/medusa/commit/5ea32aaa44a47b143c46f895032478334b7379ca) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): Cart workflow price calculation for different items but same variant

- [#13712](https://github.com/medusajs/medusa/pull/13712) [`c54c5ed6de2c9686f89aeef86c5c607c4b5f1cf3`](https://github.com/medusajs/medusa/commit/c54c5ed6de2c9686f89aeef86c5c607c4b5f1cf3) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): improve cart operations + Mikro orm 6.4.16

- [#13744](https://github.com/medusajs/medusa/pull/13744) [`1d2b4566fda0bdd826c3d1fe090b1ee3efdbd9bd`](https://github.com/medusajs/medusa/commit/1d2b4566fda0bdd826c3d1fe090b1ee3efdbd9bd) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Change order of operations in refundPaymentWorkflow

- [#13527](https://github.com/medusajs/medusa/pull/13527) [`458dd04bbf70159ec42254e91675c7a1f1d344d8`](https://github.com/medusajs/medusa/commit/458dd04bbf70159ec42254e91675c7a1f1d344d8) Thanks [@leobenzol](https://github.com/leobenzol)! - fix(core-flows,types,medusa): pass /store/shipping-options fields to workflow

- [#13704](https://github.com/medusajs/medusa/pull/13704) [`86c975258b7f3a2f1d49117f7a4139806812a8e7`](https://github.com/medusajs/medusa/commit/86c975258b7f3a2f1d49117f7a4139806812a8e7) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(core-flows): fix shipping_total showing as 0 in createFulfillment method

- [#13738](https://github.com/medusajs/medusa/pull/13738) [`fc2ded4b100432236a14d9f6409e8c6ea5a84269`](https://github.com/medusajs/medusa/commit/fc2ded4b100432236a14d9f6409e8c6ea5a84269) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows): fix warning for when usage in updateOrderTaxLinesWorkflow

- [#13749](https://github.com/medusajs/medusa/pull/13749) [`4e3090ab263b8c0da97e91d6586275d0f8609db5`](https://github.com/medusajs/medusa/commit/4e3090ab263b8c0da97e91d6586275d0f8609db5) Thanks [@willbouch](https://github.com/willbouch)! - chore(core-flows): send error on csv parsing error

- [#13769](https://github.com/medusajs/medusa/pull/13769) [`516f5a38960f1ea05a2c696e0079d2e4c34d5c86`](https://github.com/medusajs/medusa/commit/516f5a38960f1ea05a2c696e0079d2e4c34d5c86) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: workflow async concurrency

- Updated dependencies [[`12a96a7c7015f011f5e29a1d387f835e514ba536`](https://github.com/medusajs/medusa/commit/12a96a7c7015f011f5e29a1d387f835e514ba536), [`b9d6f73320c36c53235b12fb8397b30a448917f0`](https://github.com/medusajs/medusa/commit/b9d6f73320c36c53235b12fb8397b30a448917f0), [`8ece06d8ed6a197ebb370918c49a3ec5c21dd186`](https://github.com/medusajs/medusa/commit/8ece06d8ed6a197ebb370918c49a3ec5c21dd186), [`92d30b28f45b4037cd73c180c8f257070cf49bd4`](https://github.com/medusajs/medusa/commit/92d30b28f45b4037cd73c180c8f257070cf49bd4), [`02b6d013822b9665f868c4ea6d1b5cfe58723459`](https://github.com/medusajs/medusa/commit/02b6d013822b9665f868c4ea6d1b5cfe58723459)]:
  - @medusajs/framework@2.11.0

## 2.10.3

### Patch Changes

- [#13516](https://github.com/medusajs/medusa/pull/13516) [`25634b038248ab6501af719faec79b59b496bada`](https://github.com/medusajs/medusa/commit/25634b038248ab6501af719faec79b59b496bada) Thanks [@adrien2p](https://github.com/adrien2p)! - test(): test dynamic max workers and improve CI

- [#13497](https://github.com/medusajs/medusa/pull/13497) [`9563ee446f2b3a2e0cd4a4a33959ed55be5f268a`](https://github.com/medusajs/medusa/commit/9563ee446f2b3a2e0cd4a4a33959ed55be5f268a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(utils): subtotal calculation discounting returned items

- [#13468](https://github.com/medusajs/medusa/pull/13468) [`1071296236d84b70b3b31034eb95984445feb020`](https://github.com/medusajs/medusa/commit/1071296236d84b70b3b31034eb95984445feb020) Thanks [@willbouch](https://github.com/willbouch)! - feat(core-flows): hook to set shipping opt context when listing

- [#13501](https://github.com/medusajs/medusa/pull/13501) [`040fbf3220420b43871e33acc6686a6cedcf88fc`](https://github.com/medusajs/medusa/commit/040fbf3220420b43871e33acc6686a6cedcf88fc) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(core-flows): use directory convention for locking steps

- [#13508](https://github.com/medusajs/medusa/pull/13508) [`8565dcfc46c9ccc923a44582bb215c615ac2792f`](https://github.com/medusajs/medusa/commit/8565dcfc46c9ccc923a44582bb215c615ac2792f) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows,medusa): don't allow negative line item quantity

- Updated dependencies [[`25634b038248ab6501af719faec79b59b496bada`](https://github.com/medusajs/medusa/commit/25634b038248ab6501af719faec79b59b496bada)]:
  - @medusajs/framework@2.10.3

## 2.10.2

### Patch Changes

- [#13353](https://github.com/medusajs/medusa/pull/13353) [`fb71bc64052ff7ddf4e5a44c6e91e6a3a3636317`](https://github.com/medusajs/medusa/commit/fb71bc64052ff7ddf4e5a44c6e91e6a3a3636317) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): handle cacluated shipping options on draft orders gracefully

- [#13424](https://github.com/medusajs/medusa/pull/13424) [`b776fd55dcd959fdd495dd11ff9b006a31a623ce`](https://github.com/medusajs/medusa/commit/b776fd55dcd959fdd495dd11ff9b006a31a623ce) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(core-flows): lock on cart operations

- [#13418](https://github.com/medusajs/medusa/pull/13418) [`2fe68a975b75a925e1e16c7e08c245abf63db0c5`](https://github.com/medusajs/medusa/commit/2fe68a975b75a925e1e16c7e08c245abf63db0c5) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Tweak update payment collection and refresh shipping method workflow execution

- [#13477](https://github.com/medusajs/medusa/pull/13477) [`29dca1ca481e34cc17678b7b4f0e854d3a404acd`](https://github.com/medusajs/medusa/commit/29dca1ca481e34cc17678b7b4f0e854d3a404acd) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): update cart line item route fetching

- [#13385](https://github.com/medusajs/medusa/pull/13385) [`ca471eb8f45d01cebe3eb65644de1b10e796e7ba`](https://github.com/medusajs/medusa/commit/ca471eb8f45d01cebe3eb65644de1b10e796e7ba) Thanks [@gladius882](https://github.com/gladius882)! - feat(core-flows): return type in createPaymentCollectionForCartWorkflow

- Updated dependencies [[`b4c0f131b70ba950339c1ca4d81b5ce062a588a3`](https://github.com/medusajs/medusa/commit/b4c0f131b70ba950339c1ca4d81b5ce062a588a3), [`a4b72f9a21fd1d278c622fcd45d24bb9bfb1e0a8`](https://github.com/medusajs/medusa/commit/a4b72f9a21fd1d278c622fcd45d24bb9bfb1e0a8)]:
  - @medusajs/framework@2.10.2

## 2.10.1

### Patch Changes

- [#13336](https://github.com/medusajs/medusa/pull/13336) [`8176d0f684be95331ce3bec31d67c5f857f9c85a`](https://github.com/medusajs/medusa/commit/8176d0f684be95331ce3bec31d67c5f857f9c85a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(core-flows): revert idempotent cart

- Updated dependencies []:
  - @medusajs/framework@2.10.1

## 2.10.0

### Minor Changes

- [#13236](https://github.com/medusajs/medusa/pull/13236) [`9412669e654c994e2dbee9cf61c18004d79f6475`](https://github.com/medusajs/medusa/commit/9412669e654c994e2dbee9cf61c18004d79f6475) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(core-flows): idempotent cart operations and nested workflow deletion lifecycle fix

### Patch Changes

- [#13263](https://github.com/medusajs/medusa/pull/13263) [`486621383a79e83c831933c1a0ffdae58a695cb0`](https://github.com/medusajs/medusa/commit/486621383a79e83c831933c1a0ffdae58a695cb0) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard,core-flows,js-sdk,link-modules,promotion): free shipping promotion in dashboard

- [#12572](https://github.com/medusajs/medusa/pull/12572) [`2f594291ad8d227b499b80a5bfe66f5963d42d6a`](https://github.com/medusajs/medusa/commit/2f594291ad8d227b499b80a5bfe66f5963d42d6a) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows, dashboard, types): improve allocation flows in Admin

- [#13302](https://github.com/medusajs/medusa/pull/13302) [`5382afccfa0740bba04372a8613c537ff6a69cbe`](https://github.com/medusajs/medusa/commit/5382afccfa0740bba04372a8613c537ff6a69cbe) Thanks [@fPolic](https://github.com/fPolic)! - chore(core-flows): throw Medusa error for exceptions in the fulifllment flows

- [#13226](https://github.com/medusajs/medusa/pull/13226) [`67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad`](https://github.com/medusajs/medusa/commit/67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard, core-flows): associate shipping option to type

- [#13280](https://github.com/medusajs/medusa/pull/13280) [`57077406f9ce5d3bc1008b643a055f294de838eb`](https://github.com/medusajs/medusa/commit/57077406f9ce5d3bc1008b643a055f294de838eb) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows, fulfillment): don't cascade delete shipping option type when shipping option is deleted

- [#13321](https://github.com/medusajs/medusa/pull/13321) [`b111d01898a621c4280457021677d9b89e20e10d`](https://github.com/medusajs/medusa/commit/b111d01898a621c4280457021677d9b89e20e10d) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(core-flows): order payment status precision

- [#13281](https://github.com/medusajs/medusa/pull/13281) [`fc4925327334c540c0125a91e81794c3c1f340e7`](https://github.com/medusajs/medusa/commit/fc4925327334c540c0125a91e81794c3c1f340e7) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(core, event-bus): Compensate emit event step utility

- [#13076](https://github.com/medusajs/medusa/pull/13076) [`6b04fbcc50cef6bbe2b65269d1b7d88949e4fa37`](https://github.com/medusajs/medusa/commit/6b04fbcc50cef6bbe2b65269d1b7d88949e4fa37) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): pass backorder flag when recreating reservations after fulfilment cancelation

- [#13191](https://github.com/medusajs/medusa/pull/13191) [`34c3c14e0a1491ab80473605018b97981544167d`](https://github.com/medusajs/medusa/commit/34c3c14e0a1491ab80473605018b97981544167d) Thanks [@willbouch](https://github.com/willbouch)! - chore(types, api): support shipping option type api endpoints

- [#13179](https://github.com/medusajs/medusa/pull/13179) [`eb376eb4cf9cc6fe0ce2a6724e0df81b27bc7b87`](https://github.com/medusajs/medusa/commit/eb376eb4cf9cc6fe0ce2a6724e0df81b27bc7b87) Thanks [@almousa1990](https://github.com/almousa1990)! - fix: handle missing variants and preserve zero unit_price in prepareLineItems

- [#13242](https://github.com/medusajs/medusa/pull/13242) [`492e0189573ffad4977a3559d71f39bf94d8b45d`](https://github.com/medusajs/medusa/commit/492e0189573ffad4977a3559d71f39bf94d8b45d) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard,core-flows,js-sdk,types,medusa): listing order's shipping option

- [#13251](https://github.com/medusajs/medusa/pull/13251) [`6264a6262b0220c70ad35c0d56a93a39218ccb80`](https://github.com/medusajs/medusa/commit/6264a6262b0220c70ad35c0d56a93a39218ccb80) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): Cart operation should calculate item prices accounting for quantity

- [#13316](https://github.com/medusajs/medusa/pull/13316) [`be62cf87c7ed975bd0880133588cc806751715cb`](https://github.com/medusajs/medusa/commit/be62cf87c7ed975bd0880133588cc806751715cb) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): list order shipping options param type

- Updated dependencies [[`e413cfefc2e0579ba7c5299dc4f4270310e39c2c`](https://github.com/medusajs/medusa/commit/e413cfefc2e0579ba7c5299dc4f4270310e39c2c), [`e2213448ac9eb93318570fde2807a3036108d44b`](https://github.com/medusajs/medusa/commit/e2213448ac9eb93318570fde2807a3036108d44b)]:
  - @medusajs/framework@2.10.0

## 2.9.0

### Minor Changes

- [#13140](https://github.com/medusajs/medusa/pull/13140) [`acf6bbc2ec1d90e3b0100c86f56e96b38fa7c67a`](https://github.com/medusajs/medusa/commit/acf6bbc2ec1d90e3b0100c86f56e96b38fa7c67a) Thanks [@willbouch](https://github.com/willbouch)! - chore(code-flows): throw error on invalid promo code

### Patch Changes

- [#13037](https://github.com/medusajs/medusa/pull/13037) [`9fb5baa912674b6d35492b147e0f22d8f8330a24`](https://github.com/medusajs/medusa/commit/9fb5baa912674b6d35492b147e0f22d8f8330a24) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): guest email change to another guest email

- [#13103](https://github.com/medusajs/medusa/pull/13103) [`f6736d96616aaff51399b2733905f9e340efc8be`](https://github.com/medusajs/medusa/commit/f6736d96616aaff51399b2733905f9e340efc8be) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(core-flows): refresh payment collection using raw total

- [#12960](https://github.com/medusajs/medusa/pull/12960) [`1bdf602f1c1da181e2839858d2f7e8aea503573a`](https://github.com/medusajs/medusa/commit/1bdf602f1c1da181e2839858d2f7e8aea503573a) Thanks [@scherddel](https://github.com/scherddel)! - This fixes the discount\_ calculation logic and promotion tax inclusiveness calculation

- [#13056](https://github.com/medusajs/medusa/pull/13056) [`6e66e36d0814a524440c05a99c849c3d62e48ed3`](https://github.com/medusajs/medusa/commit/6e66e36d0814a524440c05a99c849c3d62e48ed3) Thanks [@jbrigbyjs](https://github.com/jbrigbyjs)! - fix(core-flows): createCustomerGroupsStep rollback delete created customer groups.

- Updated dependencies []:
  - @medusajs/framework@2.9.0

## 2.8.8

### Patch Changes

- [#12919](https://github.com/medusajs/medusa/pull/12919) [`a28226af80a8880afbdb926a5001f0cb0d89fdc9`](https://github.com/medusajs/medusa/commit/a28226af80a8880afbdb926a5001f0cb0d89fdc9) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): updating tax lines when draft order shipping is removed

- [#12958](https://github.com/medusajs/medusa/pull/12958) [`40625c82d6deb28ecb4e4c0f911c28fdd7356bf7`](https://github.com/medusajs/medusa/commit/40625c82d6deb28ecb4e4c0f911c28fdd7356bf7) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): correctly delete related inventory item when deleting variant

- [#12920](https://github.com/medusajs/medusa/pull/12920) [`8c4228fc42e717f9ab72230040e708f606a585b7`](https://github.com/medusajs/medusa/commit/8c4228fc42e717f9ab72230040e708f606a585b7) Thanks [@riqwan](https://github.com/riqwan)! - fix(link-modules,core-flows): Carry over cart promotions to order promotions

- [#12969](https://github.com/medusajs/medusa/pull/12969) [`7669dbb03e2f65fa76cff1c5b90a0777e475cb47`](https://github.com/medusajs/medusa/commit/7669dbb03e2f65fa76cff1c5b90a0777e475cb47) Thanks [@juanzgc](https://github.com/juanzgc)! - fix: accepted values in import with template

- [#12962](https://github.com/medusajs/medusa/pull/12962) [`2c2528a08751945d6f0363473605f1a8ef1a8a2a`](https://github.com/medusajs/medusa/commit/2c2528a08751945d6f0363473605f1a8ef1a8a2a) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(core-flows): useQueryGraph util return type

- Updated dependencies [[`43fb06ecc2d87ea2a11e12524679c142eb890ec7`](https://github.com/medusajs/medusa/commit/43fb06ecc2d87ea2a11e12524679c142eb890ec7)]:
  - @medusajs/framework@2.8.8

## 2.8.7

### Patch Changes

- [#12881](https://github.com/medusajs/medusa/pull/12881) [`46bf7ae7aead3f33485ce8adebb602eda305088c`](https://github.com/medusajs/medusa/commit/46bf7ae7aead3f33485ce8adebb602eda305088c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(core-flows): Locations levels check in draft order and order edit flows

- Updated dependencies []:
  - @medusajs/framework@2.8.7

## 2.8.6

### Patch Changes

- [#12825](https://github.com/medusajs/medusa/pull/12825) [`9a62f359f1c954bcc09c57e4660f90d4b010e51c`](https://github.com/medusajs/medusa/commit/9a62f359f1c954bcc09c57e4660f90d4b010e51c) Thanks [@riqwan](https://github.com/riqwan)! - fix(core-flows,workflows-sdk): compensate account holders only when its created

- Updated dependencies []:
  - @medusajs/framework@2.8.6

## 2.8.5

### Patch Changes

- [#12643](https://github.com/medusajs/medusa/pull/12643) [`f2cb528a5650fe112ca8eeb4bdffc5f0b217338a`](https://github.com/medusajs/medusa/commit/f2cb528a5650fe112ca8eeb4bdffc5f0b217338a) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: wire up direct uploads with local file provider

- [#12813](https://github.com/medusajs/medusa/pull/12813) [`d517dbd66a47817d1270c278b03add9a5c4244cb`](https://github.com/medusajs/medusa/commit/d517dbd66a47817d1270c278b03add9a5c4244cb) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Add support for jwt asymetric keys

- [#12412](https://github.com/medusajs/medusa/pull/12412) [`2621f00bb035a6b909f9498a2bc98fdba8570ba9`](https://github.com/medusajs/medusa/commit/2621f00bb035a6b909f9498a2bc98fdba8570ba9) Thanks [@fPolic](https://github.com/fPolic)! - feat(promotion, dashboard, core-flows, cart, types, utils, medusa): tax inclusive promotions

- [#12493](https://github.com/medusajs/medusa/pull/12493) [`672871b733c6e82bd9e68cf90300ff78cf44727a`](https://github.com/medusajs/medusa/commit/672871b733c6e82bd9e68cf90300ff78cf44727a) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): cart complete order address creation

- Updated dependencies [[`cbf3644eb7c8a24eaed879647b58c9ece3373c0e`](https://github.com/medusajs/medusa/commit/cbf3644eb7c8a24eaed879647b58c9ece3373c0e), [`d517dbd66a47817d1270c278b03add9a5c4244cb`](https://github.com/medusajs/medusa/commit/d517dbd66a47817d1270c278b03add9a5c4244cb), [`820a936b9836ae83e7a45de1e1ed0488d8cde2fd`](https://github.com/medusajs/medusa/commit/820a936b9836ae83e7a45de1e1ed0488d8cde2fd), [`00505b4f8e49873123111752adfda47ccb35ab46`](https://github.com/medusajs/medusa/commit/00505b4f8e49873123111752adfda47ccb35ab46), [`94b62c67249d13ec6342411cf7efdedfd0ac47e1`](https://github.com/medusajs/medusa/commit/94b62c67249d13ec6342411cf7efdedfd0ac47e1)]:
  - @medusajs/framework@2.8.5

## 2.8.4

### Patch Changes

- [#12546](https://github.com/medusajs/medusa/pull/12546) [`c4dd29046183bfe3c99b7ec00414449e53478d22`](https://github.com/medusajs/medusa/commit/c4dd29046183bfe3c99b7ec00414449e53478d22) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): reservation management on order edit and draft order confirm

- [#12646](https://github.com/medusajs/medusa/pull/12646) [`490bd7647fca30951d14c7c78c1b809379ebd870`](https://github.com/medusajs/medusa/commit/490bd7647fca30951d14c7c78c1b809379ebd870) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(core-flows): use cart_id to complete cart on payment webhook and lock cart before completion

- [#12574](https://github.com/medusajs/medusa/pull/12574) [`cf0297f74af1b043363ffbd5a23ca0933097a69d`](https://github.com/medusajs/medusa/commit/cf0297f74af1b043363ffbd5a23ca0933097a69d) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: implement stream based processing of the files

- Updated dependencies [[`7685d66c0775167994150e61a8b628ad6289ce23`](https://github.com/medusajs/medusa/commit/7685d66c0775167994150e61a8b628ad6289ce23), [`cf0297f74af1b043363ffbd5a23ca0933097a69d`](https://github.com/medusajs/medusa/commit/cf0297f74af1b043363ffbd5a23ca0933097a69d), [`1f5f50010ae42f8d5b9924edcd75612b1f336463`](https://github.com/medusajs/medusa/commit/1f5f50010ae42f8d5b9924edcd75612b1f336463)]:
  - @medusajs/framework@2.8.4

## 2.8.3

### Patch Changes

- [#12527](https://github.com/medusajs/medusa/pull/12527) [`fca5ad77b41856867ec68b1e46d04f1bb71cbc76`](https://github.com/medusajs/medusa/commit/fca5ad77b41856867ec68b1e46d04f1bb71cbc76) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: process import from pre-processed chunks

- [#12567](https://github.com/medusajs/medusa/pull/12567) [`4e49cebcf0f053cb89012276e935a7ec62a12046`](https://github.com/medusajs/medusa/commit/4e49cebcf0f053cb89012276e935a7ec62a12046) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows, types): export steps and types related to credit lines

- [#12540](https://github.com/medusajs/medusa/pull/12540) [`3071d09a03205597158afe79d55dd43643a97026`](https://github.com/medusajs/medusa/commit/3071d09a03205597158afe79d55dd43643a97026) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): skip location check if variant is not managed when preparing inventory confirm

- Updated dependencies []:
  - @medusajs/framework@2.8.3

## 2.8.2

### Patch Changes

- [#12503](https://github.com/medusajs/medusa/pull/12503) [`9f4d32b2201d8c87d84c59b9a1ca59e00bcc6af1`](https://github.com/medusajs/medusa/commit/9f4d32b2201d8c87d84c59b9a1ca59e00bcc6af1) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): fulfilment cancelation with shared inventory kit item

- [#12473](https://github.com/medusajs/medusa/pull/12473) [`e149a998862272fff80573a623c4d9010cb0b104`](https://github.com/medusajs/medusa/commit/e149a998862272fff80573a623c4d9010cb0b104) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: define validators and use normalize-products step

- Updated dependencies []:
  - @medusajs/framework@2.8.2

## 2.8.1

### Patch Changes

- [#12396](https://github.com/medusajs/medusa/pull/12396) [`4602163b568962f8115b83971d67a6c55c2b8a98`](https://github.com/medusajs/medusa/commit/4602163b568962f8115b83971d67a6c55c2b8a98) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: create CSV normalizer to normalize a CSV file

- Updated dependencies []:
  - @medusajs/framework@2.8.1

## 2.8.0

### Minor Changes

- [#12455](https://github.com/medusajs/medusa/pull/12455) [`2c49e8b7332420c9fc949f9429a339fcbf5637af`](https://github.com/medusajs/medusa/commit/2c49e8b7332420c9fc949f9429a339fcbf5637af) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Restructure the cart-completion workflow

### Patch Changes

- [#12353](https://github.com/medusajs/medusa/pull/12353) [`469ecef3c52797b812c9cb8a4410f632e8de8b8c`](https://github.com/medusajs/medusa/commit/469ecef3c52797b812c9cb8a4410f632e8de8b8c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor revamp of cart completion

- [#12338](https://github.com/medusajs/medusa/pull/12338) [`a53d645f8aab30135baebac29f9645dd35d47632`](https://github.com/medusajs/medusa/commit/a53d645f8aab30135baebac29f9645dd35d47632) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows,utils): move fulfillment workflow events

- [#12326](https://github.com/medusajs/medusa/pull/12326) [`90c61d189806894c56bfd5686807406c800cfdeb`](https://github.com/medusajs/medusa/commit/90c61d189806894c56bfd5686807406c800cfdeb) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(core-flows): add missing remove remote links

- [#12380](https://github.com/medusajs/medusa/pull/12380) [`c4dd805849fee483d52ee61078e15f9be111b414`](https://github.com/medusajs/medusa/commit/c4dd805849fee483d52ee61078e15f9be111b414) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows): export order-related workflows

- [#12320](https://github.com/medusajs/medusa/pull/12320) [`89859987565b1fc872c7cd1c6d23144b97f454bc`](https://github.com/medusajs/medusa/commit/89859987565b1fc872c7cd1c6d23144b97f454bc) Thanks [@fPolic](https://github.com/fPolic)! - feat(core-flows,utils): add Order Edit events

- [#12269](https://github.com/medusajs/medusa/pull/12269) [`d7a273ff2def96420054f31114a46294be6ee968`](https://github.com/medusajs/medusa/commit/d7a273ff2def96420054f31114a46294be6ee968) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): handle inventory kit items in mark-as-shipped and mark-as-delivered flows

- [#12425](https://github.com/medusajs/medusa/pull/12425) [`fff285f8d2f3020a24b83066fa4250130fdcf229`](https://github.com/medusajs/medusa/commit/fff285f8d2f3020a24b83066fa4250130fdcf229) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(core-flows): Emit cart trasnferred customer

- [#12263](https://github.com/medusajs/medusa/pull/12263) [`5fe0e8250d0255866a68db32d4b54dab8ab66e52`](https://github.com/medusajs/medusa/commit/5fe0e8250d0255866a68db32d4b54dab8ab66e52) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): do not cancel authorized payment on cart complete failure

- Updated dependencies [[`b868a4ef4deb7df09d6156a907f4c883cd55a3fd`](https://github.com/medusajs/medusa/commit/b868a4ef4deb7df09d6156a907f4c883cd55a3fd)]:
  - @medusajs/framework@2.8.0

## 2.7.1

### Patch Changes

- [#12232](https://github.com/medusajs/medusa/pull/12232) [`24af8f2d8e27d0f842e6e596bc4c695882f67737`](https://github.com/medusajs/medusa/commit/24af8f2d8e27d0f842e6e596bc4c695882f67737) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: expose beforeRefreshingPaymentCollection hook

- [#12124](https://github.com/medusajs/medusa/pull/12124) [`01542f69737b48346d924670296c551e4c4b47ec`](https://github.com/medusajs/medusa/commit/01542f69737b48346d924670296c551e4c4b47ec) Thanks [@fPolic](https://github.com/fPolic)! - feat(core-flows,js-sdk,medusa): draft order shipping removal

- [#12115](https://github.com/medusajs/medusa/pull/12115) [`413a0da26c7e9acffe9cc087fd77500efc76191a`](https://github.com/medusajs/medusa/commit/413a0da26c7e9acffe9cc087fd77500efc76191a) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): draft order reservations + emit order placedevent on convert

- [#12227](https://github.com/medusajs/medusa/pull/12227) [`ad74ba2ca4c86b38c91c342edfad077cd132cc2f`](https://github.com/medusajs/medusa/commit/ad74ba2ca4c86b38c91c342edfad077cd132cc2f) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows, link-modules): return fulfillment creation

- [#12221](https://github.com/medusajs/medusa/pull/12221) [`19d71fdc63547886cfc238c6b680370a80d50b50`](https://github.com/medusajs/medusa/commit/19d71fdc63547886cfc238c6b680370a80d50b50) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows): export registerOrderDeliveryStep

- Updated dependencies [[`ee35f3ce9097832c10cdf2fd168763088e6c3fcb`](https://github.com/medusajs/medusa/commit/ee35f3ce9097832c10cdf2fd168763088e6c3fcb), [`2f6963a5fbea05537680cb1b1f6a2b9822c36325`](https://github.com/medusajs/medusa/commit/2f6963a5fbea05537680cb1b1f6a2b9822c36325), [`b8902637251e9ed4f8762ef280659bbab6d967de`](https://github.com/medusajs/medusa/commit/b8902637251e9ed4f8762ef280659bbab6d967de)]:
  - @medusajs/framework@2.7.1

## 2.7.0

### Minor Changes

- [`386205d0f41828b82d519d2f5b8e07b41907a8ae`](https://github.com/medusajs/medusa/commit/386205d0f41828b82d519d2f5b8e07b41907a8ae) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: Change customer to account_holder to be one-to-many

### Patch Changes

- [#12051](https://github.com/medusajs/medusa/pull/12051) [`5f3a82f5c341d4a98a7a2ab92563f6cdae1cdce1`](https://github.com/medusajs/medusa/commit/5f3a82f5c341d4a98a7a2ab92563f6cdae1cdce1) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): applying product type promotion

- [#11832](https://github.com/medusajs/medusa/pull/11832) [`95e89a39f347c8af6a5960943af56965bc3a07ba`](https://github.com/medusajs/medusa/commit/95e89a39f347c8af6a5960943af56965bc3a07ba) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): cancel/refund payment on cart complete error

- [#11891](https://github.com/medusajs/medusa/pull/11891) [`b1b3b484747a110f720d9c1d086696bbfba86bda`](https://github.com/medusajs/medusa/commit/b1b3b484747a110f720d9c1d086696bbfba86bda) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: Set pricing context hook

- [#11569](https://github.com/medusajs/medusa/pull/11569) [`cb6249320e7322e8eabfec8434f1278f8d63e96c`](https://github.com/medusajs/medusa/commit/cb6249320e7322e8eabfec8434f1278f8d63e96c) Thanks [@riqwan](https://github.com/riqwan)! - feat(order,types,medusa,core-flows): fix(types,order,medusa,core-flows): create order credit lines during order refund

- [#11994](https://github.com/medusajs/medusa/pull/11994) [`1f8fab36361aa8e473ffe6c411c8598a916a6d3f`](https://github.com/medusajs/medusa/commit/1f8fab36361aa8e473ffe6c411c8598a916a6d3f) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,types,order,cart): assign tax lines only to regular products

- [#11790](https://github.com/medusajs/medusa/pull/11790) [`8385a5e34d9528eb3d80d16f391ee7f44a6e5d90`](https://github.com/medusajs/medusa/commit/8385a5e34d9528eb3d80d16f391ee7f44a6e5d90) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): recreate fulfilment reservations on cancelation, handle inventory kits in fulfillment flows

- [#11958](https://github.com/medusajs/medusa/pull/11958) [`a8513019db08d1345e79a15aea7f11389b4918d4`](https://github.com/medusajs/medusa/commit/a8513019db08d1345e79a15aea7f11389b4918d4) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows,dashboard): handle PaymentCollection managemenet on OrderEdit when there is authorized amount

- [#11872](https://github.com/medusajs/medusa/pull/11872) [`9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234`](https://github.com/medusajs/medusa/commit/9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,types,utils): make payment optional when cart balance is 0

- [#11977](https://github.com/medusajs/medusa/pull/11977) [`01089d5bc81bc92311bb43b2d57d987fee378030`](https://github.com/medusajs/medusa/commit/01089d5bc81bc92311bb43b2d57d987fee378030) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(core-flows): skip prices list ops when no data

- [#12103](https://github.com/medusajs/medusa/pull/12103) [`9ac74eead4760d6c92676d451e6f25c2305b1852`](https://github.com/medusajs/medusa/commit/9ac74eead4760d6c92676d451e6f25c2305b1852) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(core-flows,types): export fetchShippingOptionForOrderWorkflow

- Updated dependencies [[`ec56a8bc857a74788df6523af25914da95c4c1d8`](https://github.com/medusajs/medusa/commit/ec56a8bc857a74788df6523af25914da95c4c1d8), [`2a18a75353f872b0cb4c203afc08cfd82f778428`](https://github.com/medusajs/medusa/commit/2a18a75353f872b0cb4c203afc08cfd82f778428)]:
  - @medusajs/framework@2.7.0

## 2.6.1

### Patch Changes

- [#11715](https://github.com/medusajs/medusa/pull/11715) [`b7678983a9b3e5c4d88282054b37b6c517329bd7`](https://github.com/medusajs/medusa/commit/b7678983a9b3e5c4d88282054b37b6c517329bd7) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore: improve tax lines

- [#11735](https://github.com/medusajs/medusa/pull/11735) [`70eaaa91965dbe3a641dc634b4e81069d73846ed`](https://github.com/medusajs/medusa/commit/70eaaa91965dbe3a641dc634b4e81069d73846ed) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows): fulfillment reservation check

- [#11738](https://github.com/medusajs/medusa/pull/11738) [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Remove ranges on Medusa packages

- [#11756](https://github.com/medusajs/medusa/pull/11756) [`84f991192ec288f90af36c5352448b2785901d1a`](https://github.com/medusajs/medusa/commit/84f991192ec288f90af36c5352448b2785901d1a) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(workflows-sdk): Allow when then in parallelize

- Updated dependencies [[`cc1309d3709b251683a0cda0ced448f8bf9f514e`](https://github.com/medusajs/medusa/commit/cc1309d3709b251683a0cda0ced448f8bf9f514e), [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861), [`20cd59e622463fbd46506275648ce681869adcdf`](https://github.com/medusajs/medusa/commit/20cd59e622463fbd46506275648ce681869adcdf)]:
  - @medusajs/framework@2.6.1

## 2.6.0

### Patch Changes

- [#11226](https://github.com/medusajs/medusa/pull/11226) [`93cbc6b6695f236fa39b66169de971228888f1b9`](https://github.com/medusajs/medusa/commit/93cbc6b6695f236fa39b66169de971228888f1b9) Thanks [@bouazzaayyoub](https://github.com/bouazzaayyoub)! - fix: add additionl data to product categories hook

- [#11617](https://github.com/medusajs/medusa/pull/11617) [`322d108c0395757b4655a1e0055d722acf127b36`](https://github.com/medusajs/medusa/commit/322d108c0395757b4655a1e0055d722acf127b36) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(core-flows): pass cart as reference to subflows

- [#11666](https://github.com/medusajs/medusa/pull/11666) [`d1efad9bf05ca80959e8b50d74b74167fc1b0064`](https://github.com/medusajs/medusa/commit/d1efad9bf05ca80959e8b50d74b74167fc1b0064) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Improve cart update line items

- [#11632](https://github.com/medusajs/medusa/pull/11632) [`caf83cf78cb6d2dbd1837f6814062dafecbd04fa`](https://github.com/medusajs/medusa/commit/caf83cf78cb6d2dbd1837f6814062dafecbd04fa) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Prevent workflow steps to even call modules when not necessary

- [#11631](https://github.com/medusajs/medusa/pull/11631) [`38beeb157eadcd7dabe814119c48b5ddbc17fe20`](https://github.com/medusajs/medusa/commit/38beeb157eadcd7dabe814119c48b5ddbc17fe20) Thanks [@riqwan](https://github.com/riqwan)! - fix(core-flows): support 0 as a valid unit price for custom line items

- [#11538](https://github.com/medusajs/medusa/pull/11538) [`03731c7660fe5dca3c6d3c38a2a71eb2ea89e192`](https://github.com/medusajs/medusa/commit/03731c7660fe5dca3c6d3c38a2a71eb2ea89e192) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(core-flows): reserve inventory from locations with availability

- [#11712](https://github.com/medusajs/medusa/pull/11712) [`7dbec10b3bdde8a9f869080d5ef2c3c97fca1077`](https://github.com/medusajs/medusa/commit/7dbec10b3bdde8a9f869080d5ef2c3c97fca1077) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(order): summary raw totals

- [#11602](https://github.com/medusajs/medusa/pull/11602) [`fa1793e8e92164251c776859dea7a5e312ef9432`](https://github.com/medusajs/medusa/commit/fa1793e8e92164251c776859dea7a5e312ef9432) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(core-flows): avoid overfetching to refresh cart

- [#11664](https://github.com/medusajs/medusa/pull/11664) [`e23f204b7ca0f195e36fef2ba0bae7a686b8da4f`](https://github.com/medusajs/medusa/commit/e23f204b7ca0f195e36fef2ba0bae7a686b8da4f) Thanks [@fPolic](https://github.com/fPolic)! - fix(core-flows, dashboard, medusa): prevent creatiion of a fulfilment without items

## 2.5.1

### Patch Changes

- [#11504](https://github.com/medusajs/medusa/pull/11504) [`efd66c0d59e043218fa66163a7e9cd72bb6b5de1`](https://github.com/medusajs/medusa/commit/efd66c0d59e043218fa66163a7e9cd72bb6b5de1) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(core-flows): Allow adding shipping methods through order edits

- [#11465](https://github.com/medusajs/medusa/pull/11465) [`b37010857ab1bccda96b4694298659cc6d8f14ef`](https://github.com/medusajs/medusa/commit/b37010857ab1bccda96b4694298659cc6d8f14ef) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(core-flows): Fix line item ids passed to deleteReservationsByLineItemsStep

## 2.5.0

### Patch Changes

- [#11190](https://github.com/medusajs/medusa/pull/11190) [`e98d3c615e8a42e09974ded9cc3ca3277e3a9217`](https://github.com/medusajs/medusa/commit/e98d3c615e8a42e09974ded9cc3ca3277e3a9217) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(orchestration): validate missing PK filters when throwIfKeyNotFound

- [#11315](https://github.com/medusajs/medusa/pull/11315) [`da25980d2445a09a51220c0d4f005f41659057a6`](https://github.com/medusajs/medusa/commit/da25980d2445a09a51220c0d4f005f41659057a6) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(core-flows): update the TSDocs of new steps

- [#11362](https://github.com/medusajs/medusa/pull/11362) [`acefcd7d8052601308d75daf004069e95eb78a89`](https://github.com/medusajs/medusa/commit/acefcd7d8052601308d75daf004069e95eb78a89) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(core-flows): Fix broken import of MedusaError

- [#11285](https://github.com/medusajs/medusa/pull/11285) [`f07af7b93c86673e730dc4e5eba8df2572013f9f`](https://github.com/medusajs/medusa/commit/f07af7b93c86673e730dc4e5eba8df2572013f9f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(dashboard,core-flows,types,medusa): Allow editing Order metadata

## 2.4.0

### Minor Changes

- [#10292](https://github.com/medusajs/medusa/pull/10292) [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore: upgrade to mikro-orm 6

### Patch Changes

- [#11061](https://github.com/medusajs/medusa/pull/11061) [`2d0e50624fa37af5f74e46048a83ce3b39b210aa`](https://github.com/medusajs/medusa/commit/2d0e50624fa37af5f74e46048a83ce3b39b210aa) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows): change some types to interfaces

- Updated dependencies [[`0deffe7b9b9a1055813249b17057b7bba01b78ac`](https://github.com/medusajs/medusa/commit/0deffe7b9b9a1055813249b17057b7bba01b78ac), [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547), [`13fe2f6776b22c401d131f184fc3600ef4008383`](https://github.com/medusajs/medusa/commit/13fe2f6776b22c401d131f184fc3600ef4008383), [`e53b8b0a9708d2eb46258ca417b6ff6abbd5f3d9`](https://github.com/medusajs/medusa/commit/e53b8b0a9708d2eb46258ca417b6ff6abbd5f3d9)]:
  - @medusajs/framework@2.4.0

## 2.3.1

## 2.3.0

### Patch Changes

- [#10888](https://github.com/medusajs/medusa/pull/10888) [`1758bfb8d042fa9fc82f23c36ccd61e4a439448e`](https://github.com/medusajs/medusa/commit/1758bfb8d042fa9fc82f23c36ccd61e4a439448e) Thanks [@riqwan](https://github.com/riqwan)! - fix(dashboard, core-flows): improvements to order page on canceled orders

- [#11012](https://github.com/medusajs/medusa/pull/11012) [`7be47354e1eb95141f420ef9c74f98b3e2bd8315`](https://github.com/medusajs/medusa/commit/7be47354e1eb95141f420ef9c74f98b3e2bd8315) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows,medusa): use deleteRefundReasonsWorkflow in delete /admin/refund-reasons/:id

- [#10958](https://github.com/medusajs/medusa/pull/10958) [`c5a207144e2f04f232a1beb3586422fc93047ed2`](https://github.com/medusajs/medusa/commit/c5a207144e2f04f232a1beb3586422fc93047ed2) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(core-flows): process payment capture condition

- [#10967](https://github.com/medusajs/medusa/pull/10967) [`11f98f374cb0b77b1c80e72328fc68b5e22d5b87`](https://github.com/medusajs/medusa/commit/11f98f374cb0b77b1c80e72328fc68b5e22d5b87) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(core-flows): validation hook on cart mutations

- [#10923](https://github.com/medusajs/medusa/pull/10923) [`7232a8a93053adedd964659c1f370aa9fddc0e44`](https://github.com/medusajs/medusa/commit/7232a8a93053adedd964659c1f370aa9fddc0e44) Thanks [@riqwan](https://github.com/riqwan)! - fix(core-flows): return refunded when all captured payments have been refunded

- [#10630](https://github.com/medusajs/medusa/pull/10630) [`bc22b81cdf9591912744f448c74d45bcb0f11e0c`](https://github.com/medusajs/medusa/commit/bc22b81cdf9591912744f448c74d45bcb0f11e0c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(inventory,dashboard,core-flows,js-sdk,types,medusa): Improve inventory management UX

## 2.2.0

### Patch Changes

- [#10732](https://github.com/medusajs/medusa/pull/10732) [`699bb6dc2424053bdc73e70eecdd8fb8372b32a4`](https://github.com/medusajs/medusa/commit/699bb6dc2424053bdc73e70eecdd8fb8372b32a4) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows): export updateTaxRegionsStep

- [#10832](https://github.com/medusajs/medusa/pull/10832) [`99a06102a246c119f69d1873f3cdeee9ff1241a0`](https://github.com/medusajs/medusa/commit/99a06102a246c119f69d1873f3cdeee9ff1241a0) Thanks [@riqwan](https://github.com/riqwan)! - fix(stock-location,core-flows,types): update existing address when updating stock location address

- [#10768](https://github.com/medusajs/medusa/pull/10768) [`bbf790ea44d0ce0a128a07e66224735f5a2dccf0`](https://github.com/medusajs/medusa/commit/bbf790ea44d0ce0a128a07e66224735f5a2dccf0) Thanks [@thetutlage](https://github.com/thetutlage)! - Refactor/deprecate remote link

- [#10667](https://github.com/medusajs/medusa/pull/10667) [`47594192b79fbc798cfaf21821b60673745d1374`](https://github.com/medusajs/medusa/commit/47594192b79fbc798cfaf21821b60673745d1374) Thanks [@riqwan](https://github.com/riqwan)! - feat(dashboard,core-flows,types,utils,medusa,order): Order cancelations will refund payments

## 2.1.3

### Patch Changes

- [#10408](https://github.com/medusajs/medusa/pull/10408) [`c9b8db04c1b35f1cf129bb9ad74789fbc2881815`](https://github.com/medusajs/medusa/commit/c9b8db04c1b35f1cf129bb9ad74789fbc2881815) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Support custom line items

- [#10643](https://github.com/medusajs/medusa/pull/10643) [`9d85e663b8bac2240ec3e3bf99377dd0eac72160`](https://github.com/medusajs/medusa/commit/9d85e663b8bac2240ec3e3bf99377dd0eac72160) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows): use useQueryGraphStep instead of useQueryStep

- [#10673](https://github.com/medusajs/medusa/pull/10673) [`5d1098ceb9713225186fce16c0306b0539d71fc5`](https://github.com/medusajs/medusa/commit/5d1098ceb9713225186fce16c0306b0539d71fc5) Thanks [@riqwan](https://github.com/riqwan)! - fix(core-flows): refresh payment collections upon shipping changes

- [#10640](https://github.com/medusajs/medusa/pull/10640) [`1232a43fcec50b01477149089bbb957dec15ba76`](https://github.com/medusajs/medusa/commit/1232a43fcec50b01477149089bbb957dec15ba76) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows): export getItemTaxLinesStep

## 2.1.2

### Patch Changes

- [#10579](https://github.com/medusajs/medusa/pull/10579) [`6367bccde88158d524dfa01e5a8123ffa3461c10`](https://github.com/medusajs/medusa/commit/6367bccde88158d524dfa01e5a8123ffa3461c10) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, pricing): Cart workflows handle pricing context accurately

## 2.1.1

### Patch Changes

- [#10459](https://github.com/medusajs/medusa/pull/10459) [`90ae187e097c42a224c701f31cbc2924ea6ee86b`](https://github.com/medusajs/medusa/commit/90ae187e097c42a224c701f31cbc2924ea6ee86b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix: when/then step name

- [#10489](https://github.com/medusajs/medusa/pull/10489) [`f95c4e240c4a5ca0fb88a09636c3d8a2266de279`](https://github.com/medusajs/medusa/commit/f95c4e240c4a5ca0fb88a09636c3d8a2266de279) Thanks [@riqwan](https://github.com/riqwan)! - fix(promotion, core-flows): updating cart with removed promotion removes adjustments

- [#10193](https://github.com/medusajs/medusa/pull/10193) [`559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a`](https://github.com/medusajs/medusa/commit/559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): Deleted default sales channel should be prevented

## 2.1.0

### Patch Changes

- [#10374](https://github.com/medusajs/medusa/pull/10374) [`11bd55613304350a5478fd4c001e2309cca3a995`](https://github.com/medusajs/medusa/commit/11bd55613304350a5478fd4c001e2309cca3a995) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,framework,medusa): list shipping options pass in cart as pricing context

## 2.0.7

### Patch Changes

- [#10313](https://github.com/medusajs/medusa/pull/10313) [`030ee871506cfe178702853714feaaa33f1d9cf4`](https://github.com/medusajs/medusa/commit/030ee871506cfe178702853714feaaa33f1d9cf4) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(core-workflows): Fix data returned from reset password event.

  Deprecate `actorType` in favor of `actor_type`. The field `actorType` will be removed in a future version, so please update your code to use `actor_type` instead.

## 2.0.6

## 2.0.5

### Patch Changes

- [#10065](https://github.com/medusajs/medusa/pull/10065) [`fc5d2b5fcacddc7e4451997b8cd1c70e6f95326c`](https://github.com/medusajs/medusa/commit/fc5d2b5fcacddc7e4451997b8cd1c70e6f95326c) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Order edit quantity diff

- [#10136](https://github.com/medusajs/medusa/pull/10136) [`d933b3f1e4a92e841e881a1fd173df806008cc4a`](https://github.com/medusajs/medusa/commit/d933b3f1e4a92e841e881a1fd173df806008cc4a) Thanks [@thetutlage](https://github.com/thetutlage)! - Refactor/finish rename order

- [#10207](https://github.com/medusajs/medusa/pull/10207) [`6486f2bcce1d128ae8126091f252e67aa896ff17`](https://github.com/medusajs/medusa/commit/6486f2bcce1d128ae8126091f252e67aa896ff17) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa): remove cart customer validation + rename workflow

- [#9980](https://github.com/medusajs/medusa/pull/9980) [`2344012d1ccfae998bceb0c2b75ba9a17f84c18b`](https://github.com/medusajs/medusa/commit/2344012d1ccfae998bceb0c2b75ba9a17f84c18b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Create Order before payment capture

## 2.0.4

## 2.0.3

### Patch Changes

- [#9977](https://github.com/medusajs/medusa/pull/9977) [`1bae311a293096c9a8019b825a2fcd07e1918632`](https://github.com/medusajs/medusa/commit/1bae311a293096c9a8019b825a2fcd07e1918632) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Keep customer when updating cart

## 2.0.2

### Patch Changes

- [#9929](https://github.com/medusajs/medusa/pull/9929) [`c1c85ef952441eacfe8b6c2ffa9304ac4433053f`](https://github.com/medusajs/medusa/commit/c1c85ef952441eacfe8b6c2ffa9304ac4433053f) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(core-flows,medusa): Include region_id in shipping option retrieval

## 2.0.1

## 2.0.0

### Major Changes

- [#7341](https://github.com/medusajs/medusa/pull/7341) [`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Medusa 2.0

### Patch Changes

- Updated dependencies [[`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e)]:
  - @medusajs/framework@2.0.0

## 0.0.9

### Patch Changes

- [#7077](https://github.com/medusajs/medusa/pull/7077) [`8d356217bd`](https://github.com/medusajs/medusa/commit/8d356217bd31c97a196e861ee243822a4d924df7) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,core-flows,types): add batch updates to price list prices

- [#6864](https://github.com/medusajs/medusa/pull/6864) [`e944a627f0`](https://github.com/medusajs/medusa/commit/e944a627f074fb39a56f4bc7b3d6d315736ebf7c) Thanks [@adrien2p](https://github.com/adrien2p)! - feat: region payment providers management workflows/api

- [#6880](https://github.com/medusajs/medusa/pull/6880) [`1a48fe0282`](https://github.com/medusajs/medusa/commit/1a48fe0282a8bc1f8548a4736255e457d173da09) Thanks [@sradevski](https://github.com/sradevski)! - Add v2 product type endpoints and adjust the product module

- [#6872](https://github.com/medusajs/medusa/pull/6872) [`86f499de2f`](https://github.com/medusajs/medusa/commit/86f499de2f31356ab36ad5e93f27345443b3e5f6) Thanks [@sradevski](https://github.com/sradevski)! - Aligned pricing module price set API with convention

- [#6876](https://github.com/medusajs/medusa/pull/6876) [`1bcb13f892`](https://github.com/medusajs/medusa/commit/1bcb13f892bc61db21b3fc6bdbce85f747aeec4c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: Remove sales channels from pub keys

- [#7095](https://github.com/medusajs/medusa/pull/7095) [`62b9dcc6c1`](https://github.com/medusajs/medusa/commit/62b9dcc6c1ce46aadb7944215006c12da3c9f619) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): cancel fulfillments API

- [#6851](https://github.com/medusajs/medusa/pull/6851) [`ea8d9d4d42`](https://github.com/medusajs/medusa/commit/ea8d9d4d42210a5598b308656922c0e93c90b7c8) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: API key sales channel link

- [#7175](https://github.com/medusajs/medusa/pull/7175) [`e26cda4b6a`](https://github.com/medusajs/medusa/commit/e26cda4b6afb7fb25f0b0a7a7ce20b7f914d35db) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa, core-flows, types): Allow to update the rules from a shipping options

- [#7101](https://github.com/medusajs/medusa/pull/7101) [`18f3aacee6`](https://github.com/medusajs/medusa/commit/18f3aacee6752854d377faa806f4cc67bc71456b) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): add create shipment api for fulfillments

- [#6962](https://github.com/medusajs/medusa/pull/6962) [`65794f4bb5`](https://github.com/medusajs/medusa/commit/65794f4bb56e4fd3f0ccb7656a948f856f05324e) Thanks [@adrien2p](https://github.com/adrien2p)! - feat: Create shipping options API

- [#6905](https://github.com/medusajs/medusa/pull/6905) [`edafe7db47`](https://github.com/medusajs/medusa/commit/edafe7db4780631601d07e43b18f80c3406166f0) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(link-modules, core-flows, medusa): add sales channel location management endpoint

- [#6800](https://github.com/medusajs/medusa/pull/6800) [`4cf71af07d`](https://github.com/medusajs/medusa/commit/4cf71af07d1807c83df3889c1774f82cbd1b9a6f) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(core-flows, medusa): add update stock location endpoint to api-v2

- [#7153](https://github.com/medusajs/medusa/pull/7153) [`4b57c5d286`](https://github.com/medusajs/medusa/commit/4b57c5d286f9dc6e2098c67e9fecb0d93175b5a1) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remote query supporting context

- [#7028](https://github.com/medusajs/medusa/pull/7028) [`c78915c7c5`](https://github.com/medusajs/medusa/commit/c78915c7c5e91a99c1b1bae932656c8d86b17daf) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Add support for shipping options prices update

- [#7101](https://github.com/medusajs/medusa/pull/7101) [`18f3aacee6`](https://github.com/medusajs/medusa/commit/18f3aacee6752854d377faa806f4cc67bc71456b) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): fulfillment API: create

- [#7150](https://github.com/medusajs/medusa/pull/7150) [`d2393f004e`](https://github.com/medusajs/medusa/commit/d2393f004e0d02450300ad34dbbf98e859dae844) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows, medusa): add shipping methods to cart API

- [#7018](https://github.com/medusajs/medusa/pull/7018) [`f175cac4af`](https://github.com/medusajs/medusa/commit/f175cac4af63b71066a8398ecf9beaa6f28b20cc) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(core-flows, medusa, types): add reservation item endpoints

- [#6995](https://github.com/medusajs/medusa/pull/6995) [`0a9b9b073d`](https://github.com/medusajs/medusa/commit/0a9b9b073dd2d3f4aa5e5cb1c16e2221a7200e0d) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa, core-flows,types): delete fulfillment set, delete shipping profile

- Updated dependencies [[`e603726985`](https://github.com/medusajs/medusa/commit/e60372698565315145037eb40fbe86c43f91cc16), [`d333db0842`](https://github.com/medusajs/medusa/commit/d333db08429611c0571a0b173adf37103b8a8aa6), [`1eeb1e9de3`](https://github.com/medusajs/medusa/commit/1eeb1e9de3e0b571735437b00968ee96e4aabad5), [`20e8df914e`](https://github.com/medusajs/medusa/commit/20e8df914ec5fdf8d562d4fa84f72c58c7056195), [`a164c0d512`](https://github.com/medusajs/medusa/commit/a164c0d5126a40e2bc669f9fc2883be502a15036), [`e0b02a1012`](https://github.com/medusajs/medusa/commit/e0b02a1012981c29830d7779f59ebe805bbfd137), [`e944a627f0`](https://github.com/medusajs/medusa/commit/e944a627f074fb39a56f4bc7b3d6d315736ebf7c), [`cc557c8752`](https://github.com/medusajs/medusa/commit/cc557c8752fd0554f5a1b58522d9a88dc43a8509), [`dd35a4dbff`](https://github.com/medusajs/medusa/commit/dd35a4dbff10c86ea3c5f7f817c18b6e60d599e3), [`1bcb13f892`](https://github.com/medusajs/medusa/commit/1bcb13f892bc61db21b3fc6bdbce85f747aeec4c), [`82a176e30e`](https://github.com/medusajs/medusa/commit/82a176e30e47a7d11caaf31c3023bd8db588b465), [`5d9aea053c`](https://github.com/medusajs/medusa/commit/5d9aea053ce6e04f242f86fb9053c13dec515d5b), [`232322d035`](https://github.com/medusajs/medusa/commit/232322d03515f81e56867ff8c765b8409399ee68), [`45c49e89f2`](https://github.com/medusajs/medusa/commit/45c49e89f28123ef622fc1c07253bae94fd74875), [`71aeda7347`](https://github.com/medusajs/medusa/commit/71aeda7347a1dc7039be05071ce90a6dca5f9154), [`528ef4ca90`](https://github.com/medusajs/medusa/commit/528ef4ca90bb2cf6173dccc9fd6a9f9932ff9b76), [`65794f4bb5`](https://github.com/medusajs/medusa/commit/65794f4bb56e4fd3f0ccb7656a948f856f05324e), [`4b57c5d286`](https://github.com/medusajs/medusa/commit/4b57c5d286f9dc6e2098c67e9fecb0d93175b5a1), [`3affcc2525`](https://github.com/medusajs/medusa/commit/3affcc252599c93cf52fef24ec4f3695d65db79a), [`667c8609cc`](https://github.com/medusajs/medusa/commit/667c8609ccf3850f5df8cf784723a95bd0d6d2a6), [`edcafa140c`](https://github.com/medusajs/medusa/commit/edcafa140c1869df3c420c2becfbf23b6af75ddc), [`a6562d2a41`](https://github.com/medusajs/medusa/commit/a6562d2a41453cbe7aa43be352c4924e3e4c79d5), [`8fd1488938`](https://github.com/medusajs/medusa/commit/8fd148893850eb66c5eae00c4ca9391a80ea2eb9), [`1c6ba4468e`](https://github.com/medusajs/medusa/commit/1c6ba4468eab1440931c88929affd5b4c593f377)]:
  - @medusajs/workflows-sdk@0.1.6
  - @medusajs/orchestration@0.5.7
  - @medusajs/modules-sdk@1.12.11
  - @medusajs/utils@1.11.9

## 0.0.8

### Patch Changes

- [#6759](https://github.com/medusajs/medusa/pull/6759) [`70859397c0`](https://github.com/medusajs/medusa/commit/70859397c00ad0b45a517547e2792ed4f6882d73) Thanks [@sradevski](https://github.com/sradevski)! - Align the v2 product HTTP endpoints to follow conventions

- [#6801](https://github.com/medusajs/medusa/pull/6801) [`deab12e27e`](https://github.com/medusajs/medusa/commit/deab12e27e8249e26d24d7bc904c18195679ff24) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(types, medusa, core-flows): add delete-stock-location endpoint to api-v2

- [#6778](https://github.com/medusajs/medusa/pull/6778) [`7e93eda1a4`](https://github.com/medusajs/medusa/commit/7e93eda1a44310311d2f3f8a1d634f60e7c48cb5) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Feat: workflow cancel

- [#6796](https://github.com/medusajs/medusa/pull/6796) [`9073d7aba3`](https://github.com/medusajs/medusa/commit/9073d7aba3419e4dc0a206473291a46ebd79b8c1) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): rename psma to prices

- [#6819](https://github.com/medusajs/medusa/pull/6819) [`7bc7adeeb4`](https://github.com/medusajs/medusa/commit/7bc7adeeb4568ad85a81df08e3d6d3b5023cee13) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: Create user account

- [#6787](https://github.com/medusajs/medusa/pull/6787) [`68b9812aa1`](https://github.com/medusajs/medusa/commit/68b9812aa1fe8a9e368112e721cd868919369980) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(core-flows, medusa): add create stock location endpoint for api-v2

- [#6748](https://github.com/medusajs/medusa/pull/6748) [`05e857d256`](https://github.com/medusajs/medusa/commit/05e857d25657b5576a891c9b48c19c1759c70701) Thanks [@sradevski](https://github.com/sradevski)! - Updated the signature of the product module variant and options endpoints to follow our conventions

- [#6791](https://github.com/medusajs/medusa/pull/6791) [`20132d7cea`](https://github.com/medusajs/medusa/commit/20132d7cea13b7c7ae77b33684d01a9ab40f7ed3) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa, core-flows): add retrieve stock location endpoint to api-v2

- Updated dependencies [[`06f22bb48a`](https://github.com/medusajs/medusa/commit/06f22bb48ad1fe73577657b8c5db055312f16a0d), [`7e93eda1a4`](https://github.com/medusajs/medusa/commit/7e93eda1a44310311d2f3f8a1d634f60e7c48cb5), [`56481e683d`](https://github.com/medusajs/medusa/commit/56481e683d33ff98f0d4c4e144873bb23f993c9c), [`9073d7aba3`](https://github.com/medusajs/medusa/commit/9073d7aba3419e4dc0a206473291a46ebd79b8c1), [`4974f5e455`](https://github.com/medusajs/medusa/commit/4974f5e4557bd64a328a881ec02b91e15485bd23), [`3ca957ec0f`](https://github.com/medusajs/medusa/commit/3ca957ec0fdcdc966a3d2ca94b8222d68767cf9a), [`1ef9c78cea`](https://github.com/medusajs/medusa/commit/1ef9c78cea080c3b7c136f909c6cddec9d8f0c62)]:
  - @medusajs/modules-sdk@1.12.10
  - @medusajs/orchestration@0.5.6
  - @medusajs/workflows-sdk@0.1.5
  - @medusajs/utils@1.11.8

## 0.0.7

### Patch Changes

- [#6648](https://github.com/medusajs/medusa/pull/6648) [`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,utils): added price list prices upsert and delete workflows + endpoints

- [#6539](https://github.com/medusajs/medusa/pull/6539) [`557d86afbf`](https://github.com/medusajs/medusa/commit/557d86afbfef707d2998e4e5d1ce3559ec22f9f8) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,core-flows): update cart adjustments on item updates

- [#6474](https://github.com/medusajs/medusa/pull/6474) [`ac86362e81`](https://github.com/medusajs/medusa/commit/ac86362e81d8523cb8e3dfad026fc94658513018) Thanks [@riqwan](https://github.com/riqwan)! - feat(workflows-sdk,core-flows,medusa,types): add workflow to add promotions to cart

- [#6580](https://github.com/medusajs/medusa/pull/6580) [`e4acde1aa2`](https://github.com/medusajs/medusa/commit/e4acde1aa2eb57f07e6692fe8b61f728948b9a96) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,core-flows,types): add cart <> tax integration workflows + steps

- [#6696](https://github.com/medusajs/medusa/pull/6696) [`04a532e5ef`](https://github.com/medusajs/medusa/commit/04a532e5efabbf75b1e4155520b1da175b686ffc) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): remove rules from promotion endpoints + workflows

- [#6418](https://github.com/medusajs/medusa/pull/6418) [`1ba35b02dd`](https://github.com/medusajs/medusa/commit/1ba35b02dd52eeca9f3e1bee073c5e7a17edbc33) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: Cart SalesChannel link

- [#6692](https://github.com/medusajs/medusa/pull/6692) [`640eccd5dd`](https://github.com/medusajs/medusa/commit/640eccd5ddbb163e0f987ce6c772f1129c2e2632) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): add rules to promotion endpoints + workflow

- [#6667](https://github.com/medusajs/medusa/pull/6667) [`c3c4f49fc2`](https://github.com/medusajs/medusa/commit/c3c4f49fc2126f950e69e291ca939ca88a15afd3) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): add automatic-taxes to region + generate tax lines endpoint

- [#6648](https://github.com/medusajs/medusa/pull/6648) [`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,pricing,types,utils): added price list workflows + endpoints

- [#6684](https://github.com/medusajs/medusa/pull/6684) [`b78f863d80`](https://github.com/medusajs/medusa/commit/b78f863d80cad0e7075585cd400dc47ac05f4bf1) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa): added api + workflows for rule types CRUD

- [#6711](https://github.com/medusajs/medusa/pull/6711) [`0c705d7bd4`](https://github.com/medusajs/medusa/commit/0c705d7bd41a768c48017ae95b3c8414d96c6acb) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types): split upsert workflow to create and update

- [#6727](https://github.com/medusajs/medusa/pull/6727) [`c20eb15cd9`](https://github.com/medusajs/medusa/commit/c20eb15cd9b1bd90c8d01f68eca6f0f181cd902d) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa, core-flows, types): Add delete-location-level api-v2 endpoints

- [#6702](https://github.com/medusajs/medusa/pull/6702) [`e5945479e0`](https://github.com/medusajs/medusa/commit/e5945479e091d9560ae3e7240306a31031ef4584) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,core-flows,types): adds update promotion rule endpoint + workflow

- [#6514](https://github.com/medusajs/medusa/pull/6514) [`f5c2256286`](https://github.com/medusajs/medusa/commit/f5c22562867f412040f8bc6c55ab5de3a3735e62) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): adds update cart API with promotions

- [#6561](https://github.com/medusajs/medusa/pull/6561) [`d550be3685`](https://github.com/medusajs/medusa/commit/d550be3685423218d47a20c57a5e06758f4a961a) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,link-modules,modules-sdk): add cart <> promotion link as source of truth

- [#6708](https://github.com/medusajs/medusa/pull/6708) [`62d5803b20`](https://github.com/medusajs/medusa/commit/62d5803b2085daa682ea9bfbe7a3593057c7da4e) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa, core-flows, inventory-next): add delete-inventory-item endpoint

- [#6327](https://github.com/medusajs/medusa/pull/6327) [`4d51f095b3`](https://github.com/medusajs/medusa/commit/4d51f095b3f98f468cefb760512563f7b77bb9cf) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(core-flows, types, utils, medusa): add user endpoints to api-v2

- [#6698](https://github.com/medusajs/medusa/pull/6698) [`cc1b66842c`](https://github.com/medusajs/medusa/commit/cc1b66842cbb37c6eab84e2d8b74844c214f38d7) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): add/remove fulfillment shipping option rules

- [#6392](https://github.com/medusajs/medusa/pull/6392) [`24fb102a56`](https://github.com/medusajs/medusa/commit/24fb102a564b1253d1f8b039bb1e435cc5312fbb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat: CartRegion link, definition + workflow

- Updated dependencies [[`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c), [`ac86362e81`](https://github.com/medusajs/medusa/commit/ac86362e81d8523cb8e3dfad026fc94658513018), [`56cbf88115`](https://github.com/medusajs/medusa/commit/56cbf88115994adea7037c3f2814f0c96af3cfc0), [`36a61658f9`](https://github.com/medusajs/medusa/commit/36a61658f969a7b19c84a1e621ad1464927cafb1), [`0c2a460751`](https://github.com/medusajs/medusa/commit/0c2a460751644021056d0f99d9b1fffe509fb7ab), [`25d176b851`](https://github.com/medusajs/medusa/commit/25d176b851c041ecc7901163b704b36b7e585076), [`c319edb8e0`](https://github.com/medusajs/medusa/commit/c319edb8e0ecd13d086652147667916e5abab2d8), [`0b9fcb6324`](https://github.com/medusajs/medusa/commit/0b9fcb6324eee9f2556c7e6317775fae93b12a47), [`586df9da25`](https://github.com/medusajs/medusa/commit/586df9da250e492442769f5bac2f8b3de1d46f05), [`b3d826497b`](https://github.com/medusajs/medusa/commit/b3d826497b3dae5e1b26b7924706c24fd5e87ca5), [`a86c87fe14`](https://github.com/medusajs/medusa/commit/a86c87fe1442afce9285e39255914e01012b4449), [`640eccd5dd`](https://github.com/medusajs/medusa/commit/640eccd5ddbb163e0f987ce6c772f1129c2e2632), [`8ea37d03c9`](https://github.com/medusajs/medusa/commit/8ea37d03c914a5004a3e42770668b2d1f7f8f564), [`339a946f38`](https://github.com/medusajs/medusa/commit/339a946f389033c21e05338f9dbf07d88e140533), [`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c), [`8dad2b51a2`](https://github.com/medusajs/medusa/commit/8dad2b51a26c4c3c14a6c95f70424c8bef2ad63e), [`8a946beb75`](https://github.com/medusajs/medusa/commit/8a946beb75dd2560baffb5adc508969bf1fe8ef5), [`a6d7070dd6`](https://github.com/medusajs/medusa/commit/a6d7070dd669c21ea19d70434d42c2f8167dc309), [`168f02f138`](https://github.com/medusajs/medusa/commit/168f02f138ad101e1013f2c8c3f8dc19de12accf), [`f5c2256286`](https://github.com/medusajs/medusa/commit/f5c22562867f412040f8bc6c55ab5de3a3735e62), [`000eb61e33`](https://github.com/medusajs/medusa/commit/000eb61e33e0302db95ee6ad1656ea9b430ed471), [`d550be3685`](https://github.com/medusajs/medusa/commit/d550be3685423218d47a20c57a5e06758f4a961a), [`4b06c17dc0`](https://github.com/medusajs/medusa/commit/4b06c17dc00dc9ed50898573aee704b84dd181b3), [`62a7bcc30c`](https://github.com/medusajs/medusa/commit/62a7bcc30cbc7b234b2b51d7858439951a84edeb), [`f611865553`](https://github.com/medusajs/medusa/commit/f611865553b1f6914bed58ef2eacdf5e929d60dc), [`a8794d48de`](https://github.com/medusajs/medusa/commit/a8794d48de11c4b31f7d8f0dd254caf17daf052e), [`8f8a4f9b13`](https://github.com/medusajs/medusa/commit/8f8a4f9b1353087d98f6cc75346d43a7f49901a8), [`6500f18b9b`](https://github.com/medusajs/medusa/commit/6500f18b9b80c5c9c473489e7e740d55dca74303), [`ce39b9b66e`](https://github.com/medusajs/medusa/commit/ce39b9b66e8c277ec0691ea6d0a950003be09cc1), [`a6a4b3f01a`](https://github.com/medusajs/medusa/commit/a6a4b3f01a6d2bd97b1580c59134279a1b033a5d), [`4625bd1241`](https://github.com/medusajs/medusa/commit/4625bd12416275b09c22cde4a09cb0f68df5d7c1), [`56b0b45304`](https://github.com/medusajs/medusa/commit/56b0b4530401a6ec5aa155874d371e45bb388fe2), [`cc1b66842c`](https://github.com/medusajs/medusa/commit/cc1b66842cbb37c6eab84e2d8b74844c214f38d7), [`24fb102a56`](https://github.com/medusajs/medusa/commit/24fb102a564b1253d1f8b039bb1e435cc5312fbb), [`e85463b2a7`](https://github.com/medusajs/medusa/commit/e85463b2a717751de2e21c39a4c745449b31affe)]:
  - @medusajs/utils@1.11.7
  - @medusajs/workflows-sdk@0.1.4
  - @medusajs/orchestration@0.5.5
  - @medusajs/modules-sdk@1.12.9

## 0.0.6

### Patch Changes

- [#5923](https://github.com/medusajs/medusa/pull/5923) [`3db2f95e65`](https://github.com/medusajs/medusa/commit/3db2f95e65909f4fff432990b48be74509052e83) Thanks [@fPolic](https://github.com/fPolic)! - feat: Sales Channel module

- Updated dependencies [[`12054f5c0`](https://github.com/medusajs/medusa/commit/12054f5c01915899223ddc6da734151b31fbb23b), [`3db2f95e65`](https://github.com/medusajs/medusa/commit/3db2f95e65909f4fff432990b48be74509052e83), [`96ba49329`](https://github.com/medusajs/medusa/commit/96ba49329b6b05922c90f0c55f16455cb40aa5ca), [`45134e4d1`](https://github.com/medusajs/medusa/commit/45134e4d11cfcdc08dbd10aae687bfbe9e848ab9), [`884428a1b`](https://github.com/medusajs/medusa/commit/884428a1b573e499d7659aefed639bf797147428), [`882aa549b`](https://github.com/medusajs/medusa/commit/882aa549bdcc6f378934eab2a7c485df354f46aa)]:
  - @medusajs/utils@1.11.5
  - @medusajs/modules-sdk@1.12.8
  - @medusajs/orchestration@0.5.4
  - @medusajs/workflows-sdk@0.1.3

## 0.0.5

### Patch Changes

- [#6152](https://github.com/medusajs/medusa/pull/6152) [`99045848f`](https://github.com/medusajs/medusa/commit/99045848fd3e863359c7878d9bc05271ed083a0e) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types,core-flows,utils): added delete endpoints for campaigns and promotions

- [#6130](https://github.com/medusajs/medusa/pull/6130) [`da5cc4cf7`](https://github.com/medusajs/medusa/commit/da5cc4cf7f7f0ef40d409704a95b025ce95477f4) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,utils): promotion and campaign create/update endpoint

- Updated dependencies [[`68ddd866a5`](https://github.com/medusajs/medusa/commit/68ddd866a5ff9414e2db5b80d75acc5e81948540), [`72bc52231c`](https://github.com/medusajs/medusa/commit/72bc52231ca3a72fa6d197a248fe07a938ed0d85), [`99045848f`](https://github.com/medusajs/medusa/commit/99045848fd3e863359c7878d9bc05271ed083a0e), [`a9b4214503`](https://github.com/medusajs/medusa/commit/a9b42145032ee88aa922a11fe03e777b140c68f4), [`d85fee42e`](https://github.com/medusajs/medusa/commit/d85fee42ee7f661310584dfee5741d6c53b989bb), [`5e655dd59`](https://github.com/medusajs/medusa/commit/5e655dd59bda4ffface28db38021ba71cae6de10), [`b782d3bcb7`](https://github.com/medusajs/medusa/commit/b782d3bcb7e8088a962584b9a55200dd29c2161c), [`2b9f98895e`](https://github.com/medusajs/medusa/commit/2b9f98895eaca255e01278674b11cd7cb69b388f), [`302323916`](https://github.com/medusajs/medusa/commit/302323916b6d8eaf571cd59b5fc92a913af207de), [`da5cc4cf7`](https://github.com/medusajs/medusa/commit/da5cc4cf7f7f0ef40d409704a95b025ce95477f4), [`daecd82a7`](https://github.com/medusajs/medusa/commit/daecd82a7cdf7315599f464999690414c20d6748), [`738e9115e`](https://github.com/medusajs/medusa/commit/738e9115ec920d48bc52b8a690847e58c87ca28e), [`06b33a9b4`](https://github.com/medusajs/medusa/commit/06b33a9b4525b77b1b14b35b973209700945654e), [`b6ac768698`](https://github.com/medusajs/medusa/commit/b6ac768698a3b49d0162cb49e628386f3352d034), [`19bbae61f8`](https://github.com/medusajs/medusa/commit/19bbae61f8de1ac0ed574caff17b33e17705005a), [`130c641e5c`](https://github.com/medusajs/medusa/commit/130c641e5c91cf831de64fb87aebbfdc4d23530d), [`fade8ea7bf`](https://github.com/medusajs/medusa/commit/fade8ea7bf560343ecbde116d226ac44053cdb8e), [`8472460f53`](https://github.com/medusajs/medusa/commit/8472460f533322cc4535199aa768ac163021bc79)]:
  - @medusajs/utils@1.11.4
  - @medusajs/modules-sdk@1.12.7
  - @medusajs/orchestration@0.5.3
  - @medusajs/workflows-sdk@0.1.2

## 0.0.4

### Patch Changes

- [#5810](https://github.com/medusajs/medusa/pull/5810) [`fe007d01b`](https://github.com/medusajs/medusa/commit/fe007d01bd827f0e09ee545e48cef18913540c68) Thanks [@fPolic](https://github.com/fPolic)! - feat: sales channel <> order link

- [#5459](https://github.com/medusajs/medusa/pull/5459) [`76332ca6c`](https://github.com/medusajs/medusa/commit/76332ca6c153a786acc07d3f06ff45c3b9346fd3) Thanks [@fPolic](https://github.com/fPolic)! - feat: SalesChannel <> Cart joiner config

- Updated dependencies [[`6d1e3cc02`](https://github.com/medusajs/medusa/commit/6d1e3cc0285ef157fd6486060e8b32c00c01aa80), [`42cc8ae3f`](https://github.com/medusajs/medusa/commit/42cc8ae3f89ed7d642e51654d1a3cca011f13155), [`45996d58a2`](https://github.com/medusajs/medusa/commit/45996d58a2665d72335faad11bea958f8da74195), [`9cc787cac4`](https://github.com/medusajs/medusa/commit/9cc787cac4bf1c5d8edf1c4b548bb3205100e822), [`bf63c4e6a`](https://github.com/medusajs/medusa/commit/bf63c4e6a32258565e1d361b8919afbf93cc2c72), [`355075097`](https://github.com/medusajs/medusa/commit/3550750975a0c9359fd887929377733606ef03af), [`8402f4697`](https://github.com/medusajs/medusa/commit/8402f46970c007bab9e0f1f6ae653d955650d503), [`925feea04`](https://github.com/medusajs/medusa/commit/925feea04a8222285175c33577548e50516069a7), [`3f6d79961`](https://github.com/medusajs/medusa/commit/3f6d79961dec1c5eb8950f8eacd94a5d87a4acde), [`fbee006e5`](https://github.com/medusajs/medusa/commit/fbee006e512ef2d56ffb23eeabad8b51b56be285), [`c41f3002f`](https://github.com/medusajs/medusa/commit/c41f3002f3118b1f195c5c822fe0f400091d115b), [`a0dd18c12`](https://github.com/medusajs/medusa/commit/a0dd18c12ac5ab6280366d93d7b47cdb3036914b), [`d16d10619`](https://github.com/medusajs/medusa/commit/d16d10619dfbd3966a4709753de3d8cc37c6f2eb), [`890e76a5c`](https://github.com/medusajs/medusa/commit/890e76a5c53039576c42ca4d46af6f6977cdebd1), [`fe007d01b`](https://github.com/medusajs/medusa/commit/fe007d01bd827f0e09ee545e48cef18913540c68), [`76332ca6c`](https://github.com/medusajs/medusa/commit/76332ca6c153a786acc07d3f06ff45c3b9346fd3)]:
  - @medusajs/modules-sdk@1.12.6
  - @medusajs/utils@1.11.3
  - @medusajs/orchestration@0.5.2
  - @medusajs/workflows-sdk@0.1.1

## 0.0.3

### Patch Changes

- [#5752](https://github.com/medusajs/medusa/pull/5752) [`079f0da83`](https://github.com/medusajs/medusa/commit/079f0da83f482562bbb525807ee1a7e32993b4da) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,pricing,medusa,pricing,types,utils): Price List Prices can have their own rules

- [#5811](https://github.com/medusajs/medusa/pull/5811) [`07107f356`](https://github.com/medusajs/medusa/commit/07107f3565bc2c97e9b89818b390210454f0566d) Thanks [@riqwan](https://github.com/riqwan)! - feat(orchestration,core-flows,medusa): product import uses workflows

- [#5725](https://github.com/medusajs/medusa/pull/5725) [`85cda7ce3`](https://github.com/medusajs/medusa/commit/85cda7ce3754e2a8ecb207f29d462a9bcd442ade) Thanks [@adrien2p](https://github.com/adrien2p)! - slightly improve create cart workflow

- Updated dependencies [[`079f0da83`](https://github.com/medusajs/medusa/commit/079f0da83f482562bbb525807ee1a7e32993b4da), [`c4deeee48`](https://github.com/medusajs/medusa/commit/c4deeee481399f5371d773173e20dc149d502e20), [`07107f356`](https://github.com/medusajs/medusa/commit/07107f3565bc2c97e9b89818b390210454f0566d), [`8f25ed8a1`](https://github.com/medusajs/medusa/commit/8f25ed8a10fe23e9342dc3d03545546b4ad4d6da)]:
  - @medusajs/utils@1.11.2
  - @medusajs/modules-sdk@1.12.5
  - @medusajs/orchestration@0.5.1

## 0.0.2

### Patch Changes

- [#5705](https://github.com/medusajs/medusa/pull/5705) [`ddbeed4ea`](https://github.com/medusajs/medusa/commit/ddbeed4ea67d67a7aef04eb3135087551a7e9b37) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(workflows, core-flows, ...): Split workflows tooling and definitions

- Updated dependencies [[`1e39a95f8`](https://github.com/medusajs/medusa/commit/1e39a95f8a136427d04ea20cd320337af0923e31), [`a39ce125c`](https://github.com/medusajs/medusa/commit/a39ce125cc96f14732d5a6301313d2376484fa23), [`ddbeed4ea`](https://github.com/medusajs/medusa/commit/ddbeed4ea67d67a7aef04eb3135087551a7e9b37), [`18afe0b9a`](https://github.com/medusajs/medusa/commit/18afe0b9addb33ec2e3b285651b4eb1ef8065845), [`de8f74867`](https://github.com/medusajs/medusa/commit/de8f748674bfd19b3dbadb9695d9080aa91940de), [`ffb0c7b4c`](https://github.com/medusajs/medusa/commit/ffb0c7b4cdbc83b61f70c881001a69de6ec8ae99), [`010560fd2`](https://github.com/medusajs/medusa/commit/010560fd2a4c12eb7a551919df33e58e7cbe920f), [`9f9db3969`](https://github.com/medusajs/medusa/commit/9f9db396987776039ad0c2b8d5792d0ebdbf8792), [`dc5750dd6`](https://github.com/medusajs/medusa/commit/dc5750dd665a91d35c0246ba83c7f90ec74907f4)]:
  - @medusajs/workflows-sdk@0.1.0
  - @medusajs/orchestration@0.5.0
  - @medusajs/utils@1.11.1
  - @medusajs/modules-sdk@1.12.4
