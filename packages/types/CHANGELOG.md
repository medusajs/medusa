# @medusajs/types

## 1.11.9

### Patch Changes

- [#5752](https://github.com/medusajs/medusa/pull/5752) [`079f0da83`](https://github.com/medusajs/medusa/commit/079f0da83f482562bbb525807ee1a7e32993b4da) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,pricing,medusa,pricing,types,utils): Price List Prices can have their own rules

## 1.11.8

### Patch Changes

- [#5668](https://github.com/medusajs/medusa/pull/5668) [`a39ce125c`](https://github.com/medusajs/medusa/commit/a39ce125cc96f14732d5a6301313d2376484fa23) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(workflows, product, types): Fix issues relating to update-variant workflow and options

- [#5713](https://github.com/medusajs/medusa/pull/5713) [`18afe0b9a`](https://github.com/medusajs/medusa/commit/18afe0b9addb33ec2e3b285651b4eb1ef8065845) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(stock-location, inventory, medusa, types, utils): allow buildQuery to take null as an argument in order to prevent default pagination

- [#5664](https://github.com/medusajs/medusa/pull/5664) [`6025c702f`](https://github.com/medusajs/medusa/commit/6025c702f37d43e18af32bd716f33410d95efd19) Thanks [@riqwan](https://github.com/riqwan)! - fix(pricing,types): remove is_dynamic from model + types

- [#5711](https://github.com/medusajs/medusa/pull/5711) [`fc1ef29ed`](https://github.com/medusajs/medusa/commit/fc1ef29ed935e192f0943a2bf4b8fbb05ce6890d) Thanks [@riqwan](https://github.com/riqwan)! - fix(medusa,pricing,types): rules only gets updated/deleted upon passing an explicit object

- [#5709](https://github.com/medusajs/medusa/pull/5709) [`0df1c7d42`](https://github.com/medusajs/medusa/commit/0df1c7d4273545bc717555611b9294a5c222e5ae) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(pricing, types): update pricingModule.calculateprices return type to match actual type

- [#5536](https://github.com/medusajs/medusa/pull/5536) [`dc5750dd6`](https://github.com/medusajs/medusa/commit/dc5750dd665a91d35c0246ba83c7f90ec74907f4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,types,workflows,utils,product,pricing): PricingModule Integration of PriceLists into Core

## 1.11.7

### Patch Changes

- [#5630](https://github.com/medusajs/medusa/pull/5630) [`61aef4aaa`](https://github.com/medusajs/medusa/commit/61aef4aaa7295f178c61c9a891f03a0a48b15c81) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(types): Fix types used in the IInventoryService

- [#5498](https://github.com/medusajs/medusa/pull/5498) [`1772e80ed`](https://github.com/medusajs/medusa/commit/1772e80ed1ecab27741be80204f5df92eaa3f2b4) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing,types): price list API + price calculations with price lists

## 1.11.6

### Patch Changes

- [#5582](https://github.com/medusajs/medusa/pull/5582) [`91615f9c4`](https://github.com/medusajs/medusa/commit/91615f9c459a2d8cb842561c5edb335680d30298) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(@medusajs/client-types): Fix types and TSDocs
  fix(medusa-react): Fix response type of Publishable API Key's list sales channels.
  fix(@medusajs/medusa-js): Fix incorrect parameter and response types.
  fix(@medusajs/medusa): Fix incorrect types and add TSDocs
  fix(@medusajs/types): Fix incorrect types and add TSDocs

- [#5496](https://github.com/medusajs/medusa/pull/5496) [`154c9b43b`](https://github.com/medusajs/medusa/commit/154c9b43bde1fdff562aba9da8a79af2660b29b3) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa, modules-sdk, types, utils): Re work modules loading and remove legacy functions

## 1.11.5

### Patch Changes

- [#5304](https://github.com/medusajs/medusa/pull/5304) [`148f537b4`](https://github.com/medusajs/medusa/commit/148f537b47635e8b73ebaa27bbfbe58624bfe641) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa): add migration script for pricing module

## 1.11.4

### Patch Changes

- [#5294](https://github.com/medusajs/medusa/pull/5294) [`378ca1b36`](https://github.com/medusajs/medusa/commit/378ca1b36e909a67e39c69ea5ca94ec58a345878) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing,types,utils): Move calculate pricing query to a repository + rule type validation

- [#5281](https://github.com/medusajs/medusa/pull/5281) [`69cf7215f`](https://github.com/medusajs/medusa/commit/69cf7215f1f730ffb332129e65211470be1f88f1) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, types): Mark properties as nullable to reflect their correct types

- [#5387](https://github.com/medusajs/medusa/pull/5387) [`453297f52`](https://github.com/medusajs/medusa/commit/453297f525bd9f3aaa95bf0b28ff6cd31e6696b4) Thanks [@riqwan](https://github.com/riqwan)! - chore(product,types): fix interfaces for product module

- [#5301](https://github.com/medusajs/medusa/pull/5301) [`66413d094`](https://github.com/medusajs/medusa/commit/66413d094e916debbdb74b68800c96ca2c9302c9) Thanks [@srindom](https://github.com/srindom)! - fix: move create inventory workflow to @medusajs/workflows

## 1.11.3

### Patch Changes

- [#5242](https://github.com/medusajs/medusa/pull/5242) [`130cbc1f4`](https://github.com/medusajs/medusa/commit/130cbc1f437af211b6d05f80128d90138abcd38d) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Modules exporting schema with entities and fields

- [#5237](https://github.com/medusajs/medusa/pull/5237) [`c5703a476`](https://github.com/medusajs/medusa/commit/c5703a4765a55da697885438cf3089d923669f21) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing,types): addPrice and removePricremoveRules APIs

## 1.11.2

### Patch Changes

- [#5214](https://github.com/medusajs/medusa/pull/5214) [`1e7db5a5c`](https://github.com/medusajs/medusa/commit/1e7db5a5cb7c955e72c52e64df8a16b1607eef70) Thanks [@riqwan](https://github.com/riqwan)! - feat(types,pricing,utils): Exact match based on context + fallback on rule priority if not

## 1.11.1

### Patch Changes

- [#5018](https://github.com/medusajs/medusa/pull/5018) [`4fa675ec2`](https://github.com/medusajs/medusa/commit/4fa675ec25b3d6fccd881c4f5a5b91f0e9e13e82) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa, modules-sdk, types): Refactor modules loading from medusa

- [#4961](https://github.com/medusajs/medusa/pull/4961) [`6273b4b16`](https://github.com/medusajs/medusa/commit/6273b4b160493463e1199e5db4e9cfa4cff6fbe4) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(utils, module-sdk, medusa, types): Extract pg connection utils to utils package

- [#4969](https://github.com/medusajs/medusa/pull/4969) [`30863fee5`](https://github.com/medusajs/medusa/commit/30863fee529ed035f161c749fda3cd64fa48efb1) Thanks [@adrien2p](https://github.com/adrien2p)! - feat: store List products remote query with product isolation

- [#5025](https://github.com/medusajs/medusa/pull/5025) [`3d68be2b6`](https://github.com/medusajs/medusa/commit/3d68be2b6b93ae928f5c955e102ebdf2c34fb364) Thanks [@riqwan](https://github.com/riqwan)! - fix(orchestration,link-modules,pricing,types): fix shippingprofile error outside of core + change link alias name

- [#4990](https://github.com/medusajs/medusa/pull/4990) [`a87d07655`](https://github.com/medusajs/medusa/commit/a87d07655bd8a1da8b90feb739daddd09295f724) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(link-modules): Fix link module initialization

- [#4977](https://github.com/medusajs/medusa/pull/4977) [`edf90eecb`](https://github.com/medusajs/medusa/commit/edf90eecb487f6e031f2e2d0899de5ca2504cb12) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(pricing,types): Add price set rule type

- [#5023](https://github.com/medusajs/medusa/pull/5023) [`107aaa371`](https://github.com/medusajs/medusa/commit/107aaa371c444843874d125bf8bd493ef89f5756) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(orchestration, types): Improve fieldAlias and prevent infinite loop by validating at development time

- [#4978](https://github.com/medusajs/medusa/pull/4978) [`834da5c41`](https://github.com/medusajs/medusa/commit/834da5c41a7c043373f72239b6fdbf7815d9b4aa) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing,types,link-modules): PriceSets as an entry point to pricing module

## 1.11.0

### Minor Changes

- [#4695](https://github.com/medusajs/medusa/pull/4695) [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Medusa App Loader

- [#4695](https://github.com/medusajs/medusa/pull/4695) [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - introduce @medusajs/link-modules

### Patch Changes

- [#4860](https://github.com/medusajs/medusa/pull/4860) [`460161a69`](https://github.com/medusajs/medusa/commit/460161a69f22cf6d561952e92e7d9b56912113e6) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing, types, utils, medusa-sdk): Pricing Module Setup + Currency service

- [#4909](https://github.com/medusajs/medusa/pull/4909) [`fcb6b4f51`](https://github.com/medusajs/medusa/commit/fcb6b4f510dba2757570625acb5da9476b7544fd) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing, utils, types): adds money amount to pricing module

- [#4965](https://github.com/medusajs/medusa/pull/4965) [`66bd9a835`](https://github.com/medusajs/medusa/commit/66bd9a835c61b139af7051e5faf6c9de3c7134bb) Thanks [@riqwan](https://github.com/riqwan)! - feat(products,types,pricing): allow scoping products by collection_id, allow scoping pricing by currency_code

- [#4695](https://github.com/medusajs/medusa/pull/4695) [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Add extra fields to link modules

## 1.10.3

### Patch Changes

- [#4788](https://github.com/medusajs/medusa/pull/4788) [`d8a6e3e0d`](https://github.com/medusajs/medusa/commit/d8a6e3e0d8a86aba7209f4a767cd08ebe3e49c26) Thanks [@fPolic](https://github.com/fPolic)! - feat(medusa-file-local): local file service streaming methods

## 1.10.2

### Patch Changes

- [#4716](https://github.com/medusajs/medusa/pull/4716) [`ac866ebb5`](https://github.com/medusajs/medusa/commit/ac866ebb5197ee694dda91824b501109012a3dd1) Thanks [@adrien2p](https://github.com/adrien2p)! - test(): Test the create product workflow compensation
  fix(orchestration): Fix the transaction state after compensating with no compensation steps in the middle
  chore(workflows): Export and naming
  feat(types): Update product workflow input types
  feat(medusa): Update product workflow usage and cleanup endpoint

- [#4626](https://github.com/medusajs/medusa/pull/4626) [`3f3a84262`](https://github.com/medusajs/medusa/commit/3f3a84262ce9cbd911923278a54e301fbe9a4634) Thanks [@adrien2p](https://github.com/adrien2p)! - [WIP] feat(types, product, utils, medusa): Include shared connection for modules

- [#4685](https://github.com/medusajs/medusa/pull/4685) [`281b0746c`](https://github.com/medusajs/medusa/commit/281b0746cfbe80b83c6a67d1ea120b47a0ea7121) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,workflows,types) Create cart workflow

## 1.10.1

### Patch Changes

- [#4654](https://github.com/medusajs/medusa/pull/4654) [`8af55aed8`](https://github.com/medusajs/medusa/commit/8af55aed87da7252c7c261175bc98331466a0da8) Thanks [@riqwan](https://github.com/riqwan)! - feat(product,types): added event bus events for products

- [#4701](https://github.com/medusajs/medusa/pull/4701) [`5c60aad17`](https://github.com/medusajs/medusa/commit/5c60aad177a99574ffff5ebdc02ce9dc86ef9af9) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa, utils): Allow object feature flags

- [#4631](https://github.com/medusajs/medusa/pull/4631) [`4073b7313`](https://github.com/medusajs/medusa/commit/4073b73130c874dc7d2240726224a01b7b19b1a1) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(product): Move mikro orm utils to the utils package

## 1.10.0

### Minor Changes

- [`ce3f914e0`](https://github.com/medusajs/medusa/commit/ce3f914e01b0e2881182be230cf29d51ce711913) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Add changeset with minor bump

### Patch Changes

- [#4623](https://github.com/medusajs/medusa/pull/4623) [`107ae23a3`](https://github.com/medusajs/medusa/commit/107ae23a3f41ef0d676e9d03f53dafc7c1af6118) Thanks [@riqwan](https://github.com/riqwan)! - fix(utils, types, medusa-plugin-meilisearch, medusa-plugin-algolia): move SoftDeletableFilterKey, variantKeys, indexTypes from types to utils

## 1.9.0

### Minor Changes

- [#4553](https://github.com/medusajs/medusa/pull/4553) [`f12299deb`](https://github.com/medusajs/medusa/commit/f12299deb10baadab1505cd4ac353dd5d1c8fa7c) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Medusa workflows package

### Patch Changes

- [#4602](https://github.com/medusajs/medusa/pull/4602) [`585ebf245`](https://github.com/medusajs/medusa/commit/585ebf2454719ed36957ba798a189a45a5274c5a) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(product): Serialize typings

- [#4535](https://github.com/medusajs/medusa/pull/4535) [`131477faf`](https://github.com/medusajs/medusa/commit/131477faf0409c49d4aacf26ea591e33b2fa22fd) Thanks [@riqwan](https://github.com/riqwan)! - feat(product,types,utils): Add tags, types, categories, collection and options CRUD to product module services

- [#4504](https://github.com/medusajs/medusa/pull/4504) [`caea44ebf`](https://github.com/medusajs/medusa/commit/caea44ebfdf7393ace931ce2a9884105dadc4f8d) Thanks [@riqwan](https://github.com/riqwan)! - feat(product, types): added product module service update

## 1.8.11

### Patch Changes

- [#4503](https://github.com/medusajs/medusa/pull/4503) [`d184d23c6`](https://github.com/medusajs/medusa/commit/d184d23c6384d5f8bf52827826b62c6bef37f884) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,inventory,types,brightpearl): update some inventory methods to be bulk-operation enabled

- [#4459](https://github.com/medusajs/medusa/pull/4459) [`befc2f1c8`](https://github.com/medusajs/medusa/commit/befc2f1c80b6aaeb3a5153f7fdeaa96cf832e46f) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: added collection methods for module and collection service

## 1.8.10

### Patch Changes

- [#4098](https://github.com/medusajs/medusa/pull/4098) [`499c3478c`](https://github.com/medusajs/medusa/commit/499c3478c910c8b922a15cc6f4d9fbad122a347f) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: Remote Joiner

- [#4420](https://github.com/medusajs/medusa/pull/4420) [`6f1fa244f`](https://github.com/medusajs/medusa/commit/6f1fa244fa47d4ecdaa7363483bd7da555dbbf32) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa-cli): Cleanup plugin setup + include Logger type update which is used across multiple packages

## 1.8.9

### Patch Changes

- [#4348](https://github.com/medusajs/medusa/pull/4348) [`dc120121c`](https://github.com/medusajs/medusa/commit/dc120121c12bd2722d97c65e242888bb552ef78a) Thanks [@riqwan](https://github.com/riqwan)! - fix(product, types): correct path for migration files + fix types on product module service interface

## 1.8.8

### Patch Changes

- [#4211](https://github.com/medusajs/medusa/pull/4211) [`d76ba0cd2`](https://github.com/medusajs/medusa/commit/d76ba0cd29694c2e31f9f89992a9fbc14659c1ae) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Order edit missing transaction when consuming the inventory module

- [#4161](https://github.com/medusajs/medusa/pull/4161) [`14c0f62f8`](https://github.com/medusajs/medusa/commit/14c0f62f84704a4c87beff3daaff60a52f5c88b8) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(product): Experimental product module

## 1.8.7

### Patch Changes

- [#3979](https://github.com/medusajs/medusa/pull/3979) [`3a38c84f8`](https://github.com/medusajs/medusa/commit/3a38c84f88b05f74ee0a172af3e3f78b2ec8c2d2) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(client-types, inventory, medusa, types): add additional filtering capabilities to list-reservations

## 1.8.6

### Patch Changes

- [#4073](https://github.com/medusajs/medusa/pull/4073) [`a86f0e815`](https://github.com/medusajs/medusa/commit/a86f0e815a9e75d7d562fbe516c5bb7e0ab1f6ee) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa): Expose `ioredis` options

- [#4072](https://github.com/medusajs/medusa/pull/4072) [`6511959e2`](https://github.com/medusajs/medusa/commit/6511959e23177f3b4831915db0e8e788bc9047fa) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Revert to official Typeorm package

## 1.8.5

### Patch Changes

- [#3971](https://github.com/medusajs/medusa/pull/3971) [`7fd22ecb4`](https://github.com/medusajs/medusa/commit/7fd22ecb4d5190e92c6750a9fbf2d8534bb9f4ab) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat(client-types, inventory, medusa, types): add `title`, `thumbnail` and `description to inventory item and `description` to reservation item.

## 1.8.4

### Patch Changes

- [#4002](https://github.com/medusajs/medusa/pull/4002) [`0e488e71b`](https://github.com/medusajs/medusa/commit/0e488e71b186f7d08b18c4c6ba409ef3cadb8152) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, event-bus-redis, event-bus-local): Revert retrieveSubscribers as the wildcard prevent us from filtering

- [#3981](https://github.com/medusajs/medusa/pull/3981) [`d539c6fee`](https://github.com/medusajs/medusa/commit/d539c6feeba8ee431f9a655b6cd4e9102cba2b25) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Bump Typeorm to Medusa fork

## 1.8.3

### Patch Changes

- [#3835](https://github.com/medusajs/medusa/pull/3835) [`af710f1b4`](https://github.com/medusajs/medusa/commit/af710f1b48a4545a5064029a557013af34c4c100) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Bulk create variant and pass transaction to the inventory service context methods

## 1.8.2

### Patch Changes

- [#3785](https://github.com/medusajs/medusa/pull/3785) [`4f58ddee0`](https://github.com/medusajs/medusa/commit/4f58ddee03509a4c46af160e5824cba80d4c950a) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,utils): add server level configurable http compression

## 1.8.1

### Patch Changes

- [#3778](https://github.com/medusajs/medusa/pull/3778) [`654a54622`](https://github.com/medusajs/medusa/commit/654a54622303139e7180538bd686630ad9a46cfd) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Bump Typeorm

## 1.8.0

### Patch Changes

- [#3685](https://github.com/medusajs/medusa/pull/3685) [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Fix RC package versions

- [#3510](https://github.com/medusajs/medusa/pull/3510) [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-plugin-algolia): Revamp Algolia search plugin

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules

## 0.0.2-rc.1

### Patch Changes

- chore: Fix RC package versions

## 0.0.2-rc.0

### Patch Changes

- [#3510](https://github.com/medusajs/medusa/pull/3510) [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-plugin-algolia): Revamp Algolia search plugin

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules
