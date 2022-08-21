# Change Log

## 1.2.5

### Patch Changes

- [#1985](https://github.com/medusajs/medusa/pull/1985) [`badda5233`](https://github.com/medusajs/medusa/commit/badda5233cf90bfcf974d60dcfa059f6396b0251) Thanks [@adrien2p](https://github.com/adrien2p)! - Only include payload on POST and DELETE requests

## 1.2.4

### Patch Changes

- [#1914](https://github.com/medusajs/medusa/pull/1914) [`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68) Thanks [@fPolic](https://github.com/fPolic)! - Version bump due to missing changesets in merged PRs

- Updated dependencies [[`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68), [`8c283ac3b`](https://github.com/medusajs/medusa/commit/8c283ac3b03dea09203ac1b4c8d806efbc092290), [`b8ddb31f6`](https://github.com/medusajs/medusa/commit/b8ddb31f6fe296a11d2d988276ba8e991c37fa9b), [`dafbfa779`](https://github.com/medusajs/medusa/commit/dafbfa7799410a95f9a1ca02d1db718d1f8693eb), [`df6637853`](https://github.com/medusajs/medusa/commit/df66378535727152bb329c71c38d614e5b642599), [`716297231`](https://github.com/medusajs/medusa/commit/71629723185739a97fc2cf8eaa9029f7963bb120), [`0e0b13148`](https://github.com/medusajs/medusa/commit/0e0b13148892b073a1b46900c6eb1b0d8e05cc37), [`c148064b4`](https://github.com/medusajs/medusa/commit/c148064b4abdc4447d8216a6de0a6ce84e3a061c)]:
  - @medusajs/medusa@1.3.5

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.3](https://github.com/medusajs/medusa/compare/@medusajs/medusa-js@1.2.2...@medusajs/medusa-js@1.2.3) (2022-07-05)

### Bug Fixes

- **medusa-js:** Fix `stringifyNullProperties` util ([#1766](https://github.com/medusajs/medusa/issues/1766)) ([7bee57f](https://github.com/medusajs/medusa/commit/7bee57f7c55e15b6a6c847dfda433e67f258ef8e))

### Features

- **medusa-js:** Create utils to stringify null values and respect object types ([#1748](https://github.com/medusajs/medusa/issues/1748)) ([fc1cbe7](https://github.com/medusajs/medusa/commit/fc1cbe72c7b0cd2879a8b112a6f63fa94c728a19))
- **medusa,medusa-js,medusa-react:** Add BatchJob API support in `medusa-js` + `medusa-react` ([#1704](https://github.com/medusajs/medusa/issues/1704)) ([7302d76](https://github.com/medusajs/medusa/commit/7302d76e12683c989f340d2fcfaf4338dca6554a))

## [1.2.2](https://github.com/medusajs/medusa/compare/@medusajs/medusa-js@1.2.0...@medusajs/medusa-js@1.2.2) (2022-06-19)

### Bug Fixes

- **medusa-js:** Updated URLs for JS Client ([#1435](https://github.com/medusajs/medusa/issues/1435)) ([98f5c4e](https://github.com/medusajs/medusa/commit/98f5c4ec8bc9809de44223e90a36dfdfd6835503))

### Features

- **medusa:** Add endpoint for retrieving a DiscountCondition ([#1525](https://github.com/medusajs/medusa/issues/1525)) ([a87e1cd](https://github.com/medusajs/medusa/commit/a87e1cdf6558fd56bd91540853ca0bb715eda46e))
- **medusa:** Add endpoints specific to DiscountConditions ([#1355](https://github.com/medusajs/medusa/issues/1355)) ([9ca45ea](https://github.com/medusajs/medusa/commit/9ca45ea492e755a88737322f900d60abdfa64024))
- **medusa:** Support deleting prices from a price list by product or variant ([#1555](https://github.com/medusajs/medusa/issues/1555)) ([fa031fd](https://github.com/medusajs/medusa/commit/fa031fd28be8b12ff38eaec6e56c373324e0beed))

## [1.2.1](https://github.com/medusajs/medusa/compare/@medusajs/medusa-js@1.2.0...@medusajs/medusa-js@1.2.1) (2022-05-31)

### Bug Fixes

- **medusa-js:** Updated URLs for JS Client ([#1435](https://github.com/medusajs/medusa/issues/1435)) ([98f5c4e](https://github.com/medusajs/medusa/commit/98f5c4ec8bc9809de44223e90a36dfdfd6835503))

### Features

- **medusa:** Add endpoint for retrieving a DiscountCondition ([#1525](https://github.com/medusajs/medusa/issues/1525)) ([a87e1cd](https://github.com/medusajs/medusa/commit/a87e1cdf6558fd56bd91540853ca0bb715eda46e))
- **medusa:** Add endpoints specific to DiscountConditions ([#1355](https://github.com/medusajs/medusa/issues/1355)) ([9ca45ea](https://github.com/medusajs/medusa/commit/9ca45ea492e755a88737322f900d60abdfa64024))
- **medusa:** Support deleting prices from a price list by product or variant ([#1555](https://github.com/medusajs/medusa/issues/1555)) ([fa031fd](https://github.com/medusajs/medusa/commit/fa031fd28be8b12ff38eaec6e56c373324e0beed))

# [1.2.0](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.1.1...@medusajs/medusa-js@1.2.0) (2022-05-01)

### Bug Fixes

- **medusa:** Remove unsupported Discount endpoints ([#1367](https://github.com/medusajs/medusa-js/issues/1367)) ([9acee27](https://github.com/medusajs/medusa-js/commit/9acee2799ead683575edd0f7172f336878569dfe))
- `CustomerGroups` missing features in the clients ([#1159](https://github.com/medusajs/medusa-js/issues/1159)) ([218b20b](https://github.com/medusajs/medusa-js/commit/218b20b26db46f0a91736ece2530a83fa94aed97))
- default `POST` request payloads to an empty object ([#1141](https://github.com/medusajs/medusa-js/issues/1141)) ([4e7435e](https://github.com/medusajs/medusa-js/commit/4e7435e4d706e9237e08e1bef1818c4d564a5f9c))
- merge conflicts ([562a1b4](https://github.com/medusajs/medusa-js/commit/562a1b427a6aeb634fbc8b1a6d023c451ca2cd62))
- use /admin/returns/:id/receive for swap returns ([#1041](https://github.com/medusajs/medusa-js/issues/1041)) ([7ae754b](https://github.com/medusajs/medusa-js/commit/7ae754bb6187db17c45b2cfadc625df8f997f5ab))

### Features

- customer group customers client endpoints ([#1221](https://github.com/medusajs/medusa-js/issues/1221)) ([b7f6996](https://github.com/medusajs/medusa-js/commit/b7f699654bd8c5b08919667d4e29c835901e1af9))
- customer groups client endpoints ([#1147](https://github.com/medusajs/medusa-js/issues/1147)) ([93426bf](https://github.com/medusajs/medusa-js/commit/93426bfc0263b3a19e6d47e19cc498fea441fb30))
- customer groups react hooks ([#1153](https://github.com/medusajs/medusa-js/issues/1153)) ([daf49bc](https://github.com/medusajs/medusa-js/commit/daf49bcaf31e6e86cfd13a24efd5b3de626617a4))
- new tax api ([#979](https://github.com/medusajs/medusa-js/issues/979)) ([c56660f](https://github.com/medusajs/medusa-js/commit/c56660fca9921a3f3637bc137d9794781c5b090f)), closes [#885](https://github.com/medusajs/medusa-js/issues/885) [#896](https://github.com/medusajs/medusa-js/issues/896) [#911](https://github.com/medusajs/medusa-js/issues/911) [#945](https://github.com/medusajs/medusa-js/issues/945) [#950](https://github.com/medusajs/medusa-js/issues/950) [#951](https://github.com/medusajs/medusa-js/issues/951) [#954](https://github.com/medusajs/medusa-js/issues/954) [#969](https://github.com/medusajs/medusa-js/issues/969) [#998](https://github.com/medusajs/medusa-js/issues/998) [#1017](https://github.com/medusajs/medusa-js/issues/1017) [#1110](https://github.com/medusajs/medusa-js/issues/1110)

## [1.1.1](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.12...@medusajs/medusa-js@1.1.1) (2022-02-28)

### Bug Fixes

- use /admin/returns/:id/receive for swap returns ([#1041](https://github.com/medusajs/medusa-js/issues/1041)) ([7a3a183](https://github.com/medusajs/medusa-js/commit/7a3a1837a1db067c3629f1dfd7c6a95a56d649ca))

### Features

- new tax api ([#979](https://github.com/medusajs/medusa-js/issues/979)) ([47588e7](https://github.com/medusajs/medusa-js/commit/47588e7a8d3b2ae2fed0c1e87fdf1ee2db6bcdc2)), closes [#885](https://github.com/medusajs/medusa-js/issues/885) [#896](https://github.com/medusajs/medusa-js/issues/896) [#911](https://github.com/medusajs/medusa-js/issues/911) [#945](https://github.com/medusajs/medusa-js/issues/945) [#950](https://github.com/medusajs/medusa-js/issues/950) [#951](https://github.com/medusajs/medusa-js/issues/951) [#954](https://github.com/medusajs/medusa-js/issues/954) [#969](https://github.com/medusajs/medusa-js/issues/969) [#998](https://github.com/medusajs/medusa-js/issues/998) [#1017](https://github.com/medusajs/medusa-js/issues/1017) [#1110](https://github.com/medusajs/medusa-js/issues/1110)

# [1.1.0](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.12...@medusajs/medusa-js@1.1.0) (2022-02-25)

### Bug Fixes

- use /admin/returns/:id/receive for swap returns ([#1041](https://github.com/medusajs/medusa-js/issues/1041)) ([7ae754b](https://github.com/medusajs/medusa-js/commit/7ae754bb6187db17c45b2cfadc625df8f997f5ab))

### Features

- new tax api ([#979](https://github.com/medusajs/medusa-js/issues/979)) ([c56660f](https://github.com/medusajs/medusa-js/commit/c56660fca9921a3f3637bc137d9794781c5b090f)), closes [#885](https://github.com/medusajs/medusa-js/issues/885) [#896](https://github.com/medusajs/medusa-js/issues/896) [#911](https://github.com/medusajs/medusa-js/issues/911) [#945](https://github.com/medusajs/medusa-js/issues/945) [#950](https://github.com/medusajs/medusa-js/issues/950) [#951](https://github.com/medusajs/medusa-js/issues/951) [#954](https://github.com/medusajs/medusa-js/issues/954) [#969](https://github.com/medusajs/medusa-js/issues/969) [#998](https://github.com/medusajs/medusa-js/issues/998) [#1017](https://github.com/medusajs/medusa-js/issues/1017) [#1110](https://github.com/medusajs/medusa-js/issues/1110)

## [1.0.12](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.11...@medusajs/medusa-js@1.0.12) (2022-02-06)

### Bug Fixes

- release ([fc3fbc8](https://github.com/medusajs/medusa-js/commit/fc3fbc897fad5c8a5d3eea828ac7277fba9d70af))

## [1.0.11](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.10...@medusajs/medusa-js@1.0.11) (2022-02-06)

### Bug Fixes

- adds order by functionality to products ([#1021](https://github.com/medusajs/medusa-js/issues/1021)) ([3bf32e5](https://github.com/medusajs/medusa-js/commit/3bf32e5dc9ad3150762b9bb744b0453d3640e204))

### Features

- medusa-react admin hooks ([#978](https://github.com/medusajs/medusa-js/issues/978)) ([2e38484](https://github.com/medusajs/medusa-js/commit/2e384842d5b2e9742a86b96f28a8f00357795b86)), closes [#1019](https://github.com/medusajs/medusa-js/issues/1019)

## [1.0.10](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.9...@medusajs/medusa-js@1.0.10) (2022-01-11)

### Bug Fixes

- client admin endpoints ([#956](https://github.com/medusajs/medusa-js/issues/956)) ([2efab08](https://github.com/medusajs/medusa-js/commit/2efab08040917a2971852d741b82f86134dda075))
- medusa-js admin endpoint types ([#968](https://github.com/medusajs/medusa-js/issues/968)) ([7cc3640](https://github.com/medusajs/medusa-js/commit/7cc36407962f4cc2b3ddc33ace0e2ffb8cc61c1b))
- Type in AdminProductListTagsRes to use tags instead of types ([#958](https://github.com/medusajs/medusa-js/issues/958)) ([0ac52b7](https://github.com/medusajs/medusa-js/commit/0ac52b70fa23d9aa3ba6b5e220943ed15db4e643))

## [1.0.9](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.8...@medusajs/medusa-js@1.0.9) (2021-12-29)

**Note:** Version bump only for package @medusajs/medusa-js

## [1.0.8](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.7...@medusajs/medusa-js@1.0.8) (2021-12-17)

### Features

- Add Discount Admin endpoint to JS client ([#919](https://github.com/medusajs/medusa-js/issues/919)) ([2ca1a87](https://github.com/medusajs/medusa-js/commit/2ca1a8762da5bc30a246e2e77521071ed91e6c12))
- add medusa-react ([#913](https://github.com/medusajs/medusa-js/issues/913)) ([d0d8dd7](https://github.com/medusajs/medusa-js/commit/d0d8dd7bf62eaac71df8714c2dfb4f204d192f51))
- add returns admin endpoints to medusa-js ([#935](https://github.com/medusajs/medusa-js/issues/935)) ([b9d6f95](https://github.com/medusajs/medusa-js/commit/b9d6f95dbd32c096e59057797fd0cf479ff23c7b))
- add store admin endpoints to medusa-js ([#938](https://github.com/medusajs/medusa-js/issues/938)) ([31fad74](https://github.com/medusajs/medusa-js/commit/31fad7439cc4b95e269e7b6bc5d813cb2479329c))
- Adds Auth Admin API to `medusa-js` ([#917](https://github.com/medusajs/medusa-js/issues/917)) ([5c47184](https://github.com/medusajs/medusa-js/commit/5c47184b1035fc36440ff95750a4bb461904246d))
- Adds Customer Admin routes to JS client ([#918](https://github.com/medusajs/medusa-js/issues/918)) ([25fe224](https://github.com/medusajs/medusa-js/commit/25fe224a10842a7ac93ed496a6724ef113b41916))
- medusa js admin regions ([#939](https://github.com/medusajs/medusa-js/issues/939)) ([8532c96](https://github.com/medusajs/medusa-js/commit/8532c966b59082ac60d221bc3bb7f92d6f94e5e4))
- medusa js admin shipping options ([#934](https://github.com/medusajs/medusa-js/issues/934)) ([8b1b551](https://github.com/medusajs/medusa-js/commit/8b1b551260c8f3764135ed65bd099b8e9a0f23da))
- medusa-js admin return reasons ([#931](https://github.com/medusajs/medusa-js/issues/931)) ([0acc462](https://github.com/medusajs/medusa-js/commit/0acc462e1ebe51368ceedeea85d6f51c6fc3bfc4))

## [1.0.7](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.6...@medusajs/medusa-js@1.0.7) (2021-12-08)

### Bug Fixes

- complete cart return type ([#902](https://github.com/medusajs/medusa-js/issues/902)) ([2e837fc](https://github.com/medusajs/medusa-js/commit/2e837fcdeeb1f9608c5b0c612c75c87c042d8286))

## [1.0.6](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.5...@medusajs/medusa-js@1.0.6) (2021-12-08)

### Bug Fixes

- medusa-js complete cart types + oas comments ([#889](https://github.com/medusajs/medusa-js/issues/889)) ([487356a](https://github.com/medusajs/medusa-js/commit/487356a96ffc3886cf233e89e0b17dc3b6a665e5))
- medusa-js fine-tuning ([#836](https://github.com/medusajs/medusa-js/issues/836)) ([ded496c](https://github.com/medusajs/medusa-js/commit/ded496cee5c8fb9b28b664e308dfb782e441c99b))
- update payment session route ([#887](https://github.com/medusajs/medusa-js/issues/887)) ([e006402](https://github.com/medusajs/medusa-js/commit/e0064026eddc44c437aa09fc06d38b0005ab80c8))

## [1.0.5](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.4...@medusajs/medusa-js@1.0.5) (2021-11-23)

**Note:** Version bump only for package @medusajs/medusa-js

## [1.0.4](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.3...@medusajs/medusa-js@1.0.4) (2021-11-22)

**Note:** Version bump only for package @medusajs/medusa-js

## [1.0.3](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.2...@medusajs/medusa-js@1.0.3) (2021-11-19)

### Bug Fixes

- release ([5fa4848](https://github.com/medusajs/medusa-js/commit/5fa4848b17a9dd432c2361e5d9485950494a2bc6))

## [1.0.2](https://github.com/medusajs/medusa-js/compare/@medusajs/medusa-js@1.0.1...@medusajs/medusa-js@1.0.2) (2021-11-19)

**Note:** Version bump only for package @medusajs/medusa-js

## 1.0.1 (2021-11-19)

### Features

- Typescript for API layer ([#817](https://github.com/medusajs/medusa-js/issues/817)) ([373532e](https://github.com/medusajs/medusa-js/commit/373532ecbc8196f47e71af95a8cf82a14a4b1f9e))
