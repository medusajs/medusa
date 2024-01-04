# @medusajs/utils

## 1.11.2

### Patch Changes

- [#5752](https://github.com/medusajs/medusa/pull/5752) [`079f0da83`](https://github.com/medusajs/medusa/commit/079f0da83f482562bbb525807ee1a7e32993b4da) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,pricing,medusa,pricing,types,utils): Price List Prices can have their own rules

- [#5755](https://github.com/medusajs/medusa/pull/5755) [`8f25ed8a1`](https://github.com/medusajs/medusa/commit/8f25ed8a10fe23e9342dc3d03545546b4ad4d6da) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(link-modules, pricing, product, utils): Should be able to set some custom database config even in shared mode

- Updated dependencies [[`079f0da83`](https://github.com/medusajs/medusa/commit/079f0da83f482562bbb525807ee1a7e32993b4da)]:
  - @medusajs/types@1.11.9

## 1.11.1

### Patch Changes

- [#5713](https://github.com/medusajs/medusa/pull/5713) [`18afe0b9a`](https://github.com/medusajs/medusa/commit/18afe0b9addb33ec2e3b285651b4eb1ef8065845) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(stock-location, inventory, medusa, types, utils): allow buildQuery to take null as an argument in order to prevent default pagination

- [#5732](https://github.com/medusajs/medusa/pull/5732) [`de8f74867`](https://github.com/medusajs/medusa/commit/de8f748674bfd19b3dbadb9695d9080aa91940de) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(link-modules, utils): remove limtis if primary key exists in filter for buildquery and no limit is present

- [#5536](https://github.com/medusajs/medusa/pull/5536) [`dc5750dd6`](https://github.com/medusajs/medusa/commit/dc5750dd665a91d35c0246ba83c7f90ec74907f4) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,types,workflows,utils,product,pricing): PricingModule Integration of PriceLists into Core

- Updated dependencies [[`a39ce125c`](https://github.com/medusajs/medusa/commit/a39ce125cc96f14732d5a6301313d2376484fa23), [`18afe0b9a`](https://github.com/medusajs/medusa/commit/18afe0b9addb33ec2e3b285651b4eb1ef8065845), [`6025c702f`](https://github.com/medusajs/medusa/commit/6025c702f37d43e18af32bd716f33410d95efd19), [`fc1ef29ed`](https://github.com/medusajs/medusa/commit/fc1ef29ed935e192f0943a2bf4b8fbb05ce6890d), [`0df1c7d42`](https://github.com/medusajs/medusa/commit/0df1c7d4273545bc717555611b9294a5c222e5ae), [`dc5750dd6`](https://github.com/medusajs/medusa/commit/dc5750dd665a91d35c0246ba83c7f90ec74907f4)]:
  - @medusajs/types@1.11.8

## 1.11.0

### Minor Changes

- [#5603](https://github.com/medusajs/medusa/pull/5603) [`cedab5833`](https://github.com/medusajs/medusa/commit/cedab583395275444001f0268e4b9ccab9b2b262) Thanks [@riqwan](https://github.com/riqwan)! - feat(workflows,medusa,utils): add medusa v2 feature flag

### Patch Changes

- Updated dependencies [[`61aef4aaa`](https://github.com/medusajs/medusa/commit/61aef4aaa7295f178c61c9a891f03a0a48b15c81), [`1772e80ed`](https://github.com/medusajs/medusa/commit/1772e80ed1ecab27741be80204f5df92eaa3f2b4)]:
  - @medusajs/types@1.11.7

## 1.10.5

### Patch Changes

- [`c39bf69a5`](https://github.com/medusajs/medusa/commit/c39bf69a5e5cae75d7fa12aa6022b10903557a32) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Add missing version bumps

- [#5496](https://github.com/medusajs/medusa/pull/5496) [`154c9b43b`](https://github.com/medusajs/medusa/commit/154c9b43bde1fdff562aba9da8a79af2660b29b3) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa, modules-sdk, types, utils): Re work modules loading and remove legacy functions

- Updated dependencies [[`91615f9c4`](https://github.com/medusajs/medusa/commit/91615f9c459a2d8cb842561c5edb335680d30298), [`154c9b43b`](https://github.com/medusajs/medusa/commit/154c9b43bde1fdff562aba9da8a79af2660b29b3)]:
  - @medusajs/types@1.11.6

## 1.10.4

### Patch Changes

- [#5294](https://github.com/medusajs/medusa/pull/5294) [`378ca1b36`](https://github.com/medusajs/medusa/commit/378ca1b36e909a67e39c69ea5ca94ec58a345878) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing,types,utils): Move calculate pricing query to a repository + rule type validation

- [#5337](https://github.com/medusajs/medusa/pull/5337) [`e47461d95`](https://github.com/medusajs/medusa/commit/e47461d95caecf3a447ee9fa0b0950340b93f282) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(orchestration): prevent throwing on already defined workflow

- [#5301](https://github.com/medusajs/medusa/pull/5301) [`66413d094`](https://github.com/medusajs/medusa/commit/66413d094e916debbdb74b68800c96ca2c9302c9) Thanks [@srindom](https://github.com/srindom)! - fix: move create inventory workflow to @medusajs/workflows

- Updated dependencies [[`378ca1b36`](https://github.com/medusajs/medusa/commit/378ca1b36e909a67e39c69ea5ca94ec58a345878), [`69cf7215f`](https://github.com/medusajs/medusa/commit/69cf7215f1f730ffb332129e65211470be1f88f1), [`453297f52`](https://github.com/medusajs/medusa/commit/453297f525bd9f3aaa95bf0b28ff6cd31e6696b4), [`66413d094`](https://github.com/medusajs/medusa/commit/66413d094e916debbdb74b68800c96ca2c9302c9)]:
  - @medusajs/types@1.11.4

## 1.10.3

### Patch Changes

- [#5216](https://github.com/medusajs/medusa/pull/5216) [`eeceec791`](https://github.com/medusajs/medusa/commit/eeceec791c141996cf7fd06555afb6e738b52840) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(utils): Convert remote query object to string array of fields and relations from GQL schema

- [#5242](https://github.com/medusajs/medusa/pull/5242) [`130cbc1f4`](https://github.com/medusajs/medusa/commit/130cbc1f437af211b6d05f80128d90138abcd38d) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Modules exporting schema with entities and fields

- [#5213](https://github.com/medusajs/medusa/pull/5213) [`cb569c2df`](https://github.com/medusajs/medusa/commit/cb569c2dfe2d83e1ff72a49f2331450a83b73325) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(utils): Utils to create an object select, relation from a string[]

- Updated dependencies [[`130cbc1f4`](https://github.com/medusajs/medusa/commit/130cbc1f437af211b6d05f80128d90138abcd38d), [`c5703a476`](https://github.com/medusajs/medusa/commit/c5703a4765a55da697885438cf3089d923669f21)]:
  - @medusajs/types@1.11.3

## 1.10.2

### Patch Changes

- [#5161](https://github.com/medusajs/medusa/pull/5161) [`cc4169a94`](https://github.com/medusajs/medusa/commit/cc4169a94c7c5f5bf4d04f7b6e815b409a0a8192) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(utils): Provide an utils that allows to convert an array of fields to a complete remote query object

- [#5214](https://github.com/medusajs/medusa/pull/5214) [`1e7db5a5c`](https://github.com/medusajs/medusa/commit/1e7db5a5cb7c955e72c52e64df8a16b1607eef70) Thanks [@riqwan](https://github.com/riqwan)! - feat(types,pricing,utils): Exact match based on context + fallback on rule priority if not

- Updated dependencies [[`1e7db5a5c`](https://github.com/medusajs/medusa/commit/1e7db5a5cb7c955e72c52e64df8a16b1607eef70)]:
  - @medusajs/types@1.11.2

## 1.10.1

### Patch Changes

- [#4961](https://github.com/medusajs/medusa/pull/4961) [`6273b4b16`](https://github.com/medusajs/medusa/commit/6273b4b160493463e1199e5db4e9cfa4cff6fbe4) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(utils, module-sdk, medusa, types): Extract pg connection utils to utils package

- Updated dependencies [[`4fa675ec2`](https://github.com/medusajs/medusa/commit/4fa675ec25b3d6fccd881c4f5a5b91f0e9e13e82), [`6273b4b16`](https://github.com/medusajs/medusa/commit/6273b4b160493463e1199e5db4e9cfa4cff6fbe4), [`30863fee5`](https://github.com/medusajs/medusa/commit/30863fee529ed035f161c749fda3cd64fa48efb1), [`3d68be2b6`](https://github.com/medusajs/medusa/commit/3d68be2b6b93ae928f5c955e102ebdf2c34fb364), [`a87d07655`](https://github.com/medusajs/medusa/commit/a87d07655bd8a1da8b90feb739daddd09295f724), [`edf90eecb`](https://github.com/medusajs/medusa/commit/edf90eecb487f6e031f2e2d0899de5ca2504cb12), [`107aaa371`](https://github.com/medusajs/medusa/commit/107aaa371c444843874d125bf8bd493ef89f5756), [`834da5c41`](https://github.com/medusajs/medusa/commit/834da5c41a7c043373f72239b6fdbf7815d9b4aa)]:
  - @medusajs/types@1.11.1

## 1.10.0

### Minor Changes

- [#4695](https://github.com/medusajs/medusa/pull/4695) [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Medusa App Loader

- [#4695](https://github.com/medusajs/medusa/pull/4695) [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - introduce @medusajs/link-modules

### Patch Changes

- [#4860](https://github.com/medusajs/medusa/pull/4860) [`460161a69`](https://github.com/medusajs/medusa/commit/460161a69f22cf6d561952e92e7d9b56912113e6) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing, types, utils, medusa-sdk): Pricing Module Setup + Currency service

- [#4909](https://github.com/medusajs/medusa/pull/4909) [`fcb6b4f51`](https://github.com/medusajs/medusa/commit/fcb6b4f510dba2757570625acb5da9476b7544fd) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing, utils, types): adds money amount to pricing module

- [#4915](https://github.com/medusajs/medusa/pull/4915) [`87bade096`](https://github.com/medusajs/medusa/commit/87bade096e3d536f29ddc57dbc4c04e5d7a46e4b) Thanks [@riqwan](https://github.com/riqwan)! - fix(utils, product, pricing, link-modules): add missing dependencies for utils + fix migration path issue

- Updated dependencies [[`460161a69`](https://github.com/medusajs/medusa/commit/460161a69f22cf6d561952e92e7d9b56912113e6), [`fcb6b4f51`](https://github.com/medusajs/medusa/commit/fcb6b4f510dba2757570625acb5da9476b7544fd), [`66bd9a835`](https://github.com/medusajs/medusa/commit/66bd9a835c61b139af7051e5faf6c9de3c7134bb), [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef), [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef), [`4d16acf5f`](https://github.com/medusajs/medusa/commit/4d16acf5f096b5656b645f510f9c971e7c2dc9ef)]:
  - @medusajs/types@1.11.0

## 1.9.7

### Patch Changes

- [#4825](https://github.com/medusajs/medusa/pull/4825) [`c53fa6cd3`](https://github.com/medusajs/medusa/commit/c53fa6cd3be8b1af5625fc2db7871f9f69e761ad) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Fix mikro-orm connection loader

## 1.9.6

### Patch Changes

- [#4626](https://github.com/medusajs/medusa/pull/4626) [`3f3a84262`](https://github.com/medusajs/medusa/commit/3f3a84262ce9cbd911923278a54e301fbe9a4634) Thanks [@adrien2p](https://github.com/adrien2p)! - [WIP] feat(types, product, utils, medusa): Include shared connection for modules

- [#4733](https://github.com/medusajs/medusa/pull/4733) [`30ce35b16`](https://github.com/medusajs/medusa/commit/30ce35b163afa25f4e1d8d1bd392f401a3b413df) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(create-medusa-app, utils, medusa-cli): add database options + remove util from `@medusajs/utils`

## 1.9.5

### Patch Changes

- [#4701](https://github.com/medusajs/medusa/pull/4701) [`5c60aad17`](https://github.com/medusajs/medusa/commit/5c60aad177a99574ffff5ebdc02ce9dc86ef9af9) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa, utils): Allow object feature flags

- [#4631](https://github.com/medusajs/medusa/pull/4631) [`4073b7313`](https://github.com/medusajs/medusa/commit/4073b73130c874dc7d2240726224a01b7b19b1a1) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(product): Move mikro orm utils to the utils package

## 1.9.4

### Patch Changes

- [#4623](https://github.com/medusajs/medusa/pull/4623) [`107ae23a3`](https://github.com/medusajs/medusa/commit/107ae23a3f41ef0d676e9d03f53dafc7c1af6118) Thanks [@riqwan](https://github.com/riqwan)! - fix(utils, types, medusa-plugin-meilisearch, medusa-plugin-algolia): move SoftDeletableFilterKey, variantKeys, indexTypes from types to utils

## 1.9.3

### Patch Changes

- [#4535](https://github.com/medusajs/medusa/pull/4535) [`131477faf`](https://github.com/medusajs/medusa/commit/131477faf0409c49d4aacf26ea591e33b2fa22fd) Thanks [@riqwan](https://github.com/riqwan)! - feat(product,types,utils): Add tags, types, categories, collection and options CRUD to product module services

## 1.9.2

### Patch Changes

- [#4098](https://github.com/medusajs/medusa/pull/4098) [`499c3478c`](https://github.com/medusajs/medusa/commit/499c3478c910c8b922a15cc6f4d9fbad122a347f) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: Remote Joiner

- [#4389](https://github.com/medusajs/medusa/pull/4389) [`9dcdc0041`](https://github.com/medusajs/medusa/commit/9dcdc0041a2b08cc0723343dd8d9127d9977b086) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, utils): fix the way selects are consumed alongside the relations

- [#4398](https://github.com/medusajs/medusa/pull/4398) [`9760d4a96`](https://github.com/medusajs/medusa/commit/9760d4a96c27f6f89a8c3f3b6e73b17547f97f2a) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, utils): improve devx for core entity customizations

## 1.9.1

### Patch Changes

- [#4273](https://github.com/medusajs/medusa/pull/4273) [`f98ba5bde`](https://github.com/medusajs/medusa/commit/f98ba5bde83ba785eead31b0c9eb9f135d664178) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(create-medusa-app,medusa-cli): Allow clearing project

- [#4161](https://github.com/medusajs/medusa/pull/4161) [`14c0f62f8`](https://github.com/medusajs/medusa/commit/14c0f62f84704a4c87beff3daaff60a52f5c88b8) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(product): Experimental product module

## 1.9.0

### Minor Changes

- [#4146](https://github.com/medusajs/medusa/pull/4146) [`db4199530`](https://github.com/medusajs/medusa/commit/db419953075e0907b8c4d27ab5188e9bd3e3d72b) Thanks [@fPolic](https://github.com/fPolic)! - chore(medusa, utils, inventory, stock-location): clear deps in the utils package

### Patch Changes

- [#4026](https://github.com/medusajs/medusa/pull/4026) [`a91987fab`](https://github.com/medusajs/medusa/commit/a91987fab33745f9864eab21bd1c27e8e3e24571) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa): Remove sqlite support

- [#4148](https://github.com/medusajs/medusa/pull/4148) [`c0e527d6e`](https://github.com/medusajs/medusa/commit/c0e527d6e0a67d0c53577a0b9c3d16ee8dc5740f) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): Align build query utils

## 1.8.5

### Patch Changes

- [#4046](https://github.com/medusajs/medusa/pull/4046) [`cdbac2c84`](https://github.com/medusajs/medusa/commit/cdbac2c8403a3c15c0e11993f6b7dab268fa5c08) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa, medusa-utils): Add support for multiple where condition on the same column

- [#4072](https://github.com/medusajs/medusa/pull/4072) [`6511959e2`](https://github.com/medusajs/medusa/commit/6511959e23177f3b4831915db0e8e788bc9047fa) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Revert to official Typeorm package

## 1.8.4

### Patch Changes

- [#4032](https://github.com/medusajs/medusa/pull/4032) [`1ea57c3a6`](https://github.com/medusajs/medusa/commit/1ea57c3a69a5377a8dd0821df819743ded4a222b) Thanks [@pevey](https://github.com/pevey)! - update class-validator to 0.14.0 in utils package

## 1.8.3

### Patch Changes

- [#4002](https://github.com/medusajs/medusa/pull/4002) [`0e488e71b`](https://github.com/medusajs/medusa/commit/0e488e71b186f7d08b18c4c6ba409ef3cadb8152) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, event-bus-redis, event-bus-local): Revert retrieveSubscribers as the wildcard prevent us from filtering

- [#3981](https://github.com/medusajs/medusa/pull/3981) [`d539c6fee`](https://github.com/medusajs/medusa/commit/d539c6feeba8ee431f9a655b6cd4e9102cba2b25) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Bump Typeorm to Medusa fork

## 1.8.2

### Patch Changes

- [#3835](https://github.com/medusajs/medusa/pull/3835) [`af710f1b4`](https://github.com/medusajs/medusa/commit/af710f1b48a4545a5064029a557013af34c4c100) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Bulk create variant and pass transaction to the inventory service context methods

- [#3905](https://github.com/medusajs/medusa/pull/3905) [`491566df6`](https://github.com/medusajs/medusa/commit/491566df6b7ced35f655f810961422945e10ecd0) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa,utils): Searching indexing product subscriber

## 1.8.1

### Patch Changes

- [#3778](https://github.com/medusajs/medusa/pull/3778) [`654a54622`](https://github.com/medusajs/medusa/commit/654a54622303139e7180538bd686630ad9a46cfd) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Bump Typeorm

- [#3738](https://github.com/medusajs/medusa/pull/3738) [`abdb74d99`](https://github.com/medusajs/medusa/commit/abdb74d997f49f994bff49787a396179982843b0) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa, utils): rename buildLegacyFieldsListFrom to objectToStringPath

## 1.8.0

### Patch Changes

- [#3685](https://github.com/medusajs/medusa/pull/3685) [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Fix RC package versions

- [#3688](https://github.com/medusajs/medusa/pull/3688) [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa-cli): Add missing utils dep

- [#3510](https://github.com/medusajs/medusa/pull/3510) [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-plugin-algolia): Revamp Algolia search plugin

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules

## 0.0.2-rc.2

### Patch Changes

- [#3688](https://github.com/medusajs/medusa/pull/3688) [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore(medusa-cli): Add missing utils dep

## 0.0.2-rc.1

### Patch Changes

- chore: Fix RC package versions

## 0.0.2-rc.0

### Patch Changes

- [#3510](https://github.com/medusajs/medusa/pull/3510) [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-plugin-algolia): Revamp Algolia search plugin

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules
