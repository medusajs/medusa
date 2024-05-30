# Change Log

## 1.2.2

### Patch Changes

- [#7003](https://github.com/medusajs/medusa/pull/7003) [`c3efac5a0d`](https://github.com/medusajs/medusa/commit/c3efac5a0d6cfa38e1af8d248138fa83934a8ceb) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa-core-utils): add missing awilix dependency

## 1.2.1

### Patch Changes

- [#5983](https://github.com/medusajs/medusa/pull/5983) [`f86877586`](https://github.com/medusajs/medusa/commit/f86877586147ecedbf7f56a1c57f37ef0c33286c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(create-medusa-app,medusa-core-utils): Use NodeJS.Timeout instead of NodeJS.Timer as the latter was deprecated in v14.
  chore(icons): Update icons to latest version.

- [#6001](https://github.com/medusajs/medusa/pull/6001) [`46d610bc5`](https://github.com/medusajs/medusa/commit/46d610bc555797df2ae81eb89b18faf1411b33b8) Thanks [@abusaidm](https://github.com/abusaidm)! - Add missing country in admin region and set Libya to formal name

## 1.2.0

### Minor Changes

- [#3408](https://github.com/medusajs/medusa/pull/3408) [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Http Server Graceful Shutdown

- [#3329](https://github.com/medusajs/medusa/pull/3329) [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Inventory and Stock location modules supporting isolated connection

### Patch Changes

- [#3041](https://github.com/medusajs/medusa/pull/3041) [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): Typeorm fixes / enhancements

  - upgrade typeorm from 0.2.51 to 0.3.11
  - Plugin repository loader to work with Typeorm update

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

## 1.2.0-rc.0

### Minor Changes

- [#3408](https://github.com/medusajs/medusa/pull/3408) [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Http Server Graceful Shutdown

- [#3329](https://github.com/medusajs/medusa/pull/3329) [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Inventory and Stock location modules supporting isolated connection

### Patch Changes

- [#3041](https://github.com/medusajs/medusa/pull/3041) [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): Typeorm fixes / enhancements

  - upgrade typeorm from 0.2.51 to 0.3.11
  - Plugin repository loader to work with Typeorm update

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

## 1.1.39

### Patch Changes

- [#3217](https://github.com/medusajs/medusa/pull/3217) [`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Fix npm packages files included

## 1.1.38

### Patch Changes

- [#3185](https://github.com/medusajs/medusa/pull/3185) [`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Patches all dependencies + minor bumps `winston` to include a [fix for a significant memory leak](https://github.com/winstonjs/winston/pull/2057)

## 1.1.37

### Patch Changes

- [#2783](https://github.com/medusajs/medusa/pull/2783) [`7cced6006`](https://github.com/medusajs/medusa/commit/7cced6006a9a6f9108009e9f3e191e9f3ba1b168) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: getConfigFile typings

## 1.1.36

### Patch Changes

- [#2670](https://github.com/medusajs/medusa/pull/2670) [`1b21af87a`](https://github.com/medusajs/medusa/commit/1b21af87ab80c18013f0f44434e59b873c2313aa) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa-core-utils): Migrate to TS

## 1.1.35

### Patch Changes

- [#2646](https://github.com/medusajs/medusa/pull/2646) [`e7c4cc375`](https://github.com/medusajs/medusa/commit/e7c4cc375174775bb0cfe52e5dc0270237150b3c) Thanks [@pKorsholm](https://github.com/pKorsholm)! - jwt fix

## 1.1.34

### Patch Changes

- [#2514](https://github.com/medusajs/medusa/pull/2514) [`ea3d73882`](https://github.com/medusajs/medusa/commit/ea3d7388234f23c4a5bc7ceb55c493a097b76c12) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Feat(medusa): invalid medusa-config handling in loaders

## 1.1.33

### Patch Changes

- [`5cb7618a2`](https://github.com/medusajs/medusa/commit/5cb7618a220c420ec2917875f91b8c1f814298f2) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Force bump medusa-core-utils

## 1.1.32

### Patch Changes

- [#2210](https://github.com/medusajs/medusa/pull/2210) [`7dc8d3a0c`](https://github.com/medusajs/medusa/commit/7dc8d3a0c90ce06e3f11a6a46dec1f9ec3f26e81) Thanks [@srindom](https://github.com/srindom)! - Adds `computerizeAmount` utility to convert human money format into the DB format Medusa uses (integer of lowest currency unit)

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.31](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.30...medusa-core-utils@1.1.31) (2021-12-08)

### Bug Fixes

- **medusa:** migrate cart service to typescript ([#884](https://github.com/medusajs/medusa/issues/884)) ([ed04132](https://github.com/medusajs/medusa/commit/ed041325332e47c5939a301dfd8ace8ad6dbc28d))

### Features

- medusa-source-shopify loader ([#563](https://github.com/medusajs/medusa/issues/563)) ([577bcc2](https://github.com/medusajs/medusa/commit/577bcc23d44c87b91b2b685fd4ddfc5d21a0aa47))

## [1.1.30](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.29...medusa-core-utils@1.1.30) (2021-11-23)

### Bug Fixes

- bumps class-transformer to 0.5.1 ([#837](https://github.com/medusajs/medusa/issues/837)) ([38b0e29](https://github.com/medusajs/medusa/commit/38b0e295b23eccd281288d854d5876ff418de91d))

## [1.1.29](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.28...medusa-core-utils@1.1.29) (2021-11-22)

**Note:** Version bump only for package medusa-core-utils

## [1.1.28](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.27...medusa-core-utils@1.1.28) (2021-11-19)

**Note:** Version bump only for package medusa-core-utils

## [1.1.27](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.26...medusa-core-utils@1.1.27) (2021-11-19)

### Features

- Typescript for API layer ([#817](https://github.com/medusajs/medusa/issues/817)) ([373532e](https://github.com/medusajs/medusa/commit/373532ecbc8196f47e71af95a8cf82a14a4b1f9e))

## [1.1.26](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.25...medusa-core-utils@1.1.26) (2021-10-18)

**Note:** Version bump only for package medusa-core-utils

## [1.1.25](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.24...medusa-core-utils@1.1.25) (2021-10-18)

**Note:** Version bump only for package medusa-core-utils

## [1.1.24](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.22...medusa-core-utils@1.1.24) (2021-10-18)

### Bug Fixes

- use type to choose transformer before adding or replacing documents ([24eecd2](https://github.com/medusajs/medusa/commit/24eecd2922e0c3425f2d43549b3227c756820387))

### Features

- Product filtering ([#439](https://github.com/medusajs/medusa/issues/439)) ([5ef2a3f](https://github.com/medusajs/medusa/commit/5ef2a3fbcb108c8d49b7754ea14ac890af643950))

## [1.1.23](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.22...medusa-core-utils@1.1.23) (2021-10-18)

### Bug Fixes

- use type to choose transformer before adding or replacing documents ([24eecd2](https://github.com/medusajs/medusa/commit/24eecd2922e0c3425f2d43549b3227c756820387))

### Features

- Product filtering ([#439](https://github.com/medusajs/medusa/issues/439)) ([5ef2a3f](https://github.com/medusajs/medusa/commit/5ef2a3fbcb108c8d49b7754ea14ac890af643950))

## [1.1.22](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.21...medusa-core-utils@1.1.22) (2021-09-15)

**Note:** Version bump only for package medusa-core-utils

## [1.1.21](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.20...medusa-core-utils@1.1.21) (2021-09-14)

**Note:** Version bump only for package medusa-core-utils

## [1.1.20](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.19...medusa-core-utils@1.1.20) (2021-08-05)

### Features

- In band inventory updates ([#311](https://github.com/medusajs/medusa/issues/311)) ([f07cc0f](https://github.com/medusajs/medusa/commit/f07cc0fa406d8f0fe33f9088fe6cb3ce8e78b05f))

## [1.1.19](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.18...medusa-core-utils@1.1.19) (2021-07-26)

**Note:** Version bump only for package medusa-core-utils

## [1.1.18](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.16...medusa-core-utils@1.1.18) (2021-07-15)

**Note:** Version bump only for package medusa-core-utils

## [1.1.17](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.16...medusa-core-utils@1.1.17) (2021-07-15)

### Bug Fixes

- better store/customer support ([6342e68](https://github.com/medusajs/medusa/commit/6342e68d069636e5eb4877c7ebf7aac952b5e363))

## [1.1.16](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.15...medusa-core-utils@1.1.16) (2021-07-02)

**Note:** Version bump only for package medusa-core-utils

## [1.1.15](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.14...medusa-core-utils@1.1.15) (2021-06-22)

### Bug Fixes

- adds transformer to map field names to field_id names ([88d96a2](https://github.com/medusajs/medusa/commit/88d96a29fd8dbc44ed7ba25154850d417577acad))
- release assist ([668e8a7](https://github.com/medusajs/medusa/commit/668e8a740200847fc2a41c91d2979097f1392532))

## [1.1.14](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.13...medusa-core-utils@1.1.14) (2021-06-09)

**Note:** Version bump only for package medusa-core-utils

## [1.1.13](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.12...medusa-core-utils@1.1.13) (2021-06-09)

**Note:** Version bump only for package medusa-core-utils

## [1.1.12](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.11...medusa-core-utils@1.1.12) (2021-06-09)

**Note:** Version bump only for package medusa-core-utils

## [1.1.11](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.10...medusa-core-utils@1.1.11) (2021-06-09)

**Note:** Version bump only for package medusa-core-utils

## [1.1.10](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.9...medusa-core-utils@1.1.10) (2021-06-08)

**Note:** Version bump only for package medusa-core-utils

## [1.1.9](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.6...medusa-core-utils@1.1.9) (2021-04-28)

**Note:** Version bump only for package medusa-core-utils

## [1.1.8](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.7...medusa-core-utils@1.1.8) (2021-04-20)

**Note:** Version bump only for package medusa-core-utils

## [1.1.7](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.6...medusa-core-utils@1.1.7) (2021-04-20)

**Note:** Version bump only for package medusa-core-utils

## [1.1.6](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.5...medusa-core-utils@1.1.6) (2021-04-13)

**Note:** Version bump only for package medusa-core-utils

## [1.1.5](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.4...medusa-core-utils@1.1.5) (2021-04-09)

**Note:** Version bump only for package medusa-core-utils

## [1.1.4](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.3...medusa-core-utils@1.1.4) (2021-03-30)

### Bug Fixes

- don't divide zero decimal currencies ([cfab2d4](https://github.com/medusajs/medusa/commit/cfab2d408a296a938266d0989b1de67d060b2ed5))

## [1.1.3](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.2...medusa-core-utils@1.1.3) (2021-03-17)

**Note:** Version bump only for package medusa-core-utils

## [1.1.2](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.0...medusa-core-utils@1.1.2) (2021-03-17)

### Features

- **medusa:** Add support for filtering with gt, lt, gte and lte ([#190](https://github.com/medusajs/medusa/issues/190)) ([dd0491f](https://github.com/medusajs/medusa/commit/dd0491f52132aed24f642589b12fcf636b719580))
- **medusa:** cart context ([#201](https://github.com/medusajs/medusa/issues/201)) ([dd7b306](https://github.com/medusajs/medusa/commit/dd7b306333fbe1042f5cf2bed614bce84ea9475f))

## [1.1.1](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.1.0...medusa-core-utils@1.1.1) (2021-03-17)

### Features

- **medusa:** Add support for filtering with gt, lt, gte and lte ([#190](https://github.com/medusajs/medusa/issues/190)) ([dd0491f](https://github.com/medusajs/medusa/commit/dd0491f52132aed24f642589b12fcf636b719580))
- **medusa:** cart context ([#201](https://github.com/medusajs/medusa/issues/201)) ([dd7b306](https://github.com/medusajs/medusa/commit/dd7b306333fbe1042f5cf2bed614bce84ea9475f))

# [1.1.0](https://github.com/medusajs/medusa/compare/medusa-core-utils@1.0.11...medusa-core-utils@1.1.0) (2021-01-26)

**Note:** Version bump only for package medusa-core-utils

## 1.0.11 (2020-11-24)

## 1.0.10 (2020-09-09)

### Bug Fixes

- updates license ([db519fb](https://github.com/medusajs/medusa/commit/db519fbaa6f8ad02c19cbecba5d4f28ba1ee81aa))

## 1.0.7 (2020-09-07)

### Bug Fixes

- **medusa-core-utils:** adds country utils ([00cbf84](https://github.com/medusajs/medusa/commit/00cbf8444d7b64ae8040db187748a63c64509686))

## 1.0.1 (2020-09-05)

## 1.0.1-beta.0 (2020-09-04)

### Bug Fixes

- **medusa:** product variant metadata ([#98](https://github.com/medusajs/medusa/issues/98)) ([520115a](https://github.com/medusajs/medusa/commit/520115a2cef7ee3f0259a682bd82e693c6327790))

# 1.0.0 (2020-09-03)

# 1.0.0-alpha.30 (2020-08-28)

# 1.0.0-alpha.27 (2020-08-27)

### Bug Fixes

- **contentful-plugin:** Keep existing entry fields ([eb47896](https://github.com/medusajs/medusa/commit/eb478966684776bb2aa48e98789519644b05cd33))

# 1.0.0-alpha.24 (2020-08-27)

# 1.0.0-alpha.3 (2020-08-20)

# 1.0.0-alpha.2 (2020-08-20)

# 1.0.0-alpha.1 (2020-08-20)

# 1.0.0-alpha.0 (2020-08-20)

# 0.3.0 (2020-04-06)

# 0.2.0 (2020-04-06)

# 0.2.0-alpha.0 (2020-04-04)

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
