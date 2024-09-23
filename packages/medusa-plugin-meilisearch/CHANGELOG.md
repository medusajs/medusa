# Change Log

## 2.0.11

### Patch Changes

- [`52520d9080`](https://github.com/medusajs/medusa/commit/52520d90800e473e89254c4a424d5dffc6edfc30) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Add missing changeset

- Updated dependencies [[`52520d9080`](https://github.com/medusajs/medusa/commit/52520d90800e473e89254c4a424d5dffc6edfc30)]:
  - @medusajs/utils@1.11.10
  - @medusajs/modules-sdk@1.12.12

## 2.0.10

### Patch Changes

- [#4623](https://github.com/medusajs/medusa/pull/4623) [`107ae23a3`](https://github.com/medusajs/medusa/commit/107ae23a3f41ef0d676e9d03f53dafc7c1af6118) Thanks [@riqwan](https://github.com/riqwan)! - fix(utils, types, medusa-plugin-meilisearch, medusa-plugin-algolia): move SoftDeletableFilterKey, variantKeys, indexTypes from types to utils

- Updated dependencies [[`107ae23a3`](https://github.com/medusajs/medusa/commit/107ae23a3f41ef0d676e9d03f53dafc7c1af6118)]:
  - @medusajs/utils@1.9.4

## 2.0.9

### Patch Changes

- [#4420](https://github.com/medusajs/medusa/pull/4420) [`6f1fa244f`](https://github.com/medusajs/medusa/commit/6f1fa244fa47d4ecdaa7363483bd7da555dbbf32) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa-cli): Cleanup plugin setup + include Logger type update which is used across multiple packages

- Updated dependencies [[`499c3478c`](https://github.com/medusajs/medusa/commit/499c3478c910c8b922a15cc6f4d9fbad122a347f), [`9dcdc0041`](https://github.com/medusajs/medusa/commit/9dcdc0041a2b08cc0723343dd8d9127d9977b086), [`9760d4a96`](https://github.com/medusajs/medusa/commit/9760d4a96c27f6f89a8c3f3b6e73b17547f97f2a)]:
  - @medusajs/utils@1.9.2

## 2.0.8

### Patch Changes

- chore: Update deps

## 2.0.7

### Patch Changes

- [#4276](https://github.com/medusajs/medusa/pull/4276) [`afd1b67f1`](https://github.com/medusajs/medusa/commit/afd1b67f1c7de8cf07fd9fcbdde599a37914e9b5) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Use caret range

- Updated dependencies [[`f98ba5bde`](https://github.com/medusajs/medusa/commit/f98ba5bde83ba785eead31b0c9eb9f135d664178), [`14c0f62f8`](https://github.com/medusajs/medusa/commit/14c0f62f84704a4c87beff3daaff60a52f5c88b8)]:
  - @medusajs/utils@1.9.1
  - @medusajs/modules-sdk@1.8.8

## 2.0.6

### Patch Changes

- Updated dependencies [[`a91987fab`](https://github.com/medusajs/medusa/commit/a91987fab33745f9864eab21bd1c27e8e3e24571), [`db4199530`](https://github.com/medusajs/medusa/commit/db419953075e0907b8c4d27ab5188e9bd3e3d72b), [`c0e527d6e`](https://github.com/medusajs/medusa/commit/c0e527d6e0a67d0c53577a0b9c3d16ee8dc5740f)]:
  - @medusajs/utils@1.9.0

## 2.0.5

### Patch Changes

- Updated dependencies [[`cdbac2c84`](https://github.com/medusajs/medusa/commit/cdbac2c8403a3c15c0e11993f6b7dab268fa5c08), [`6511959e2`](https://github.com/medusajs/medusa/commit/6511959e23177f3b4831915db0e8e788bc9047fa)]:
  - @medusajs/utils@1.8.5

## 2.0.4

### Patch Changes

- Updated dependencies [[`1ea57c3a6`](https://github.com/medusajs/medusa/commit/1ea57c3a69a5377a8dd0821df819743ded4a222b)]:
  - @medusajs/utils@1.8.4

## 2.0.3

### Patch Changes

- Updated dependencies [[`0e488e71b`](https://github.com/medusajs/medusa/commit/0e488e71b186f7d08b18c4c6ba409ef3cadb8152), [`d539c6fee`](https://github.com/medusajs/medusa/commit/d539c6feeba8ee431f9a655b6cd4e9102cba2b25)]:
  - @medusajs/utils@1.8.3

## 2.0.2

### Patch Changes

- [#3898](https://github.com/medusajs/medusa/pull/3898) [`aec7ae219`](https://github.com/medusajs/medusa/commit/aec7ae219de9e84a43e4945cb62b04d96672d6d2) Thanks [@pevey](https://github.com/pevey)! - Update meilisearch library dependency

- Updated dependencies [[`af710f1b4`](https://github.com/medusajs/medusa/commit/af710f1b48a4545a5064029a557013af34c4c100), [`491566df6`](https://github.com/medusajs/medusa/commit/491566df6b7ced35f655f810961422945e10ecd0)]:
  - @medusajs/utils@1.8.2

## 2.0.1

### Patch Changes

- Updated dependencies [[`654a54622`](https://github.com/medusajs/medusa/commit/654a54622303139e7180538bd686630ad9a46cfd), [`abdb74d99`](https://github.com/medusajs/medusa/commit/abdb74d997f49f994bff49787a396179982843b0)]:
  - @medusajs/utils@1.8.1

## 2.0.0

### Major Changes

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

### Patch Changes

- [#3685](https://github.com/medusajs/medusa/pull/3685) [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Fix RC package versions

- [#3510](https://github.com/medusajs/medusa/pull/3510) [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-plugin-algolia): Revamp Algolia search plugin

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules

- Updated dependencies [[`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4), [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38), [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def)]:
  - @medusajs/utils@1.8.0

## 2.0.0-rc.2

### Patch Changes

- Updated dependencies [[`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38)]:
  - @medusajs/utils@0.0.2-rc.2

## 2.0.0-rc.1

### Patch Changes

- chore: Fix RC package versions

- Updated dependencies []:
  - @medusajs/utils@0.0.2-rc.1

## 2.0.0-rc.0

### Major Changes

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

### Patch Changes

- [#3510](https://github.com/medusajs/medusa/pull/3510) [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-plugin-algolia): Revamp Algolia search plugin

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules

- Updated dependencies [[`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def)]:
  - @medusajs/utils@0.0.2-rc.0

## 1.0.4

### Patch Changes

- [#3217](https://github.com/medusajs/medusa/pull/3217) [`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Fix npm packages files included

- Updated dependencies [[`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0)]:
  - medusa-core-utils@1.1.39
  - medusa-interfaces@1.3.6

## 1.0.3

### Patch Changes

- [#3185](https://github.com/medusajs/medusa/pull/3185) [`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Patches all dependencies + minor bumps `winston` to include a [fix for a significant memory leak](https://github.com/winstonjs/winston/pull/2057)

- Updated dependencies [[`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4)]:
  - medusa-core-utils@1.1.38
  - medusa-interfaces@1.3.5

## 1.0.2

### Patch Changes

- [#3025](https://github.com/medusajs/medusa/pull/3025) [`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): test, build and watch scripts

- Updated dependencies [[`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2)]:
  - medusa-interfaces@1.3.4

## 1.0.1

### Patch Changes

- [#2808](https://github.com/medusajs/medusa/pull/2808) [`0a9c89185`](https://github.com/medusajs/medusa/commit/0a9c891853c4d16b553d38268a3408ca1daa71f0) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - chore: explicitly add devDependencies for monorepo peerDependencies

- Updated dependencies [[`7cced6006`](https://github.com/medusajs/medusa/commit/7cced6006a9a6f9108009e9f3e191e9f3ba1b168)]:
  - medusa-core-utils@1.1.37

## 1.0.0

### Major Changes

- [#2140](https://github.com/medusajs/medusa/pull/2140) [`e707b4649`](https://github.com/medusajs/medusa/commit/e707b46499e05e7244fe7a9788995a826680d4ed) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Update meilisearch deps to respect latest breaking changes

  BREAKING CHANGE

## 0.2.5

### Patch Changes

- Updated dependencies [[`c97ccd3fb`](https://github.com/medusajs/medusa/commit/c97ccd3fb5dbe796b0e4fbf37def5bb6e8201557)]:
  - medusa-interfaces@1.3.3

## 0.2.4

### Patch Changes

- [#1914](https://github.com/medusajs/medusa/pull/1914) [`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68) Thanks [@fPolic](https://github.com/fPolic)! - Version bump due to missing changesets in merged PRs

- Updated dependencies [[`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68), [`b8ddb31f6`](https://github.com/medusajs/medusa/commit/b8ddb31f6fe296a11d2d988276ba8e991c37fa9b)]:
  - medusa-interfaces@1.3.2

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.3](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.2.2...medusa-plugin-meilisearch@0.2.3) (2022-07-05)

### Bug Fixes

- **meilisearch:** remove medusa-interfaces dependency ([#1751](https://github.com/medusajs/medusa/issues/1751)) ([f7e300e](https://github.com/medusajs/medusa/commit/f7e300e8cec082cab23626907333682e9a643238))

## [0.2.2](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.2.0...medusa-plugin-meilisearch@0.2.2) (2022-06-19)

**Note:** Version bump only for package medusa-plugin-meilisearch

## [0.2.1](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.2.0...medusa-plugin-meilisearch@0.2.1) (2022-05-31)

**Note:** Version bump only for package medusa-plugin-meilisearch

# [0.2.0](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.1.1...medusa-plugin-meilisearch@0.2.0) (2022-05-01)

**Note:** Version bump only for package medusa-plugin-meilisearch

## [0.1.1](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.14...medusa-plugin-meilisearch@0.1.1) (2022-02-28)

**Note:** Version bump only for package medusa-plugin-meilisearch

# [0.1.0](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.14...medusa-plugin-meilisearch@0.1.0) (2022-02-25)

**Note:** Version bump only for package medusa-plugin-meilisearch

## [0.0.14](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.13...medusa-plugin-meilisearch@0.0.14) (2022-02-06)

### Bug Fixes

- release ([fc3fbc8](https://github.com/medusajs/medusa/commit/fc3fbc897fad5c8a5d3eea828ac7277fba9d70af))

## [0.0.13](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.12...medusa-plugin-meilisearch@0.0.13) (2022-02-06)

**Note:** Version bump only for package medusa-plugin-meilisearch

## [0.0.12](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.11...medusa-plugin-meilisearch@0.0.12) (2021-12-08)

**Note:** Version bump only for package medusa-plugin-meilisearch

## [0.0.11](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.10...medusa-plugin-meilisearch@0.0.11) (2021-11-23)

**Note:** Version bump only for package medusa-plugin-meilisearch

## [0.0.10](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.9...medusa-plugin-meilisearch@0.0.10) (2021-11-22)

**Note:** Version bump only for package medusa-plugin-meilisearch

## [0.0.9](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.8...medusa-plugin-meilisearch@0.0.9) (2021-11-19)

**Note:** Version bump only for package medusa-plugin-meilisearch

## [0.0.8](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.7...medusa-plugin-meilisearch@0.0.8) (2021-11-19)

**Note:** Version bump only for package medusa-plugin-meilisearch

## [0.0.7](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.6...medusa-plugin-meilisearch@0.0.7) (2021-11-03)

### Bug Fixes

- include discount rule in swap retrieval ([#682](https://github.com/medusajs/medusa/issues/682)) ([a5fe1c2](https://github.com/medusajs/medusa/commit/a5fe1c2e284ff5cb757b792c1a3c8414c211e4e8))

## [0.0.6](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.5...medusa-plugin-meilisearch@0.0.6) (2021-10-19)

### Bug Fixes

- allow changing regions safely ([06f5fe2](https://github.com/medusajs/medusa/commit/06f5fe267013d95231d96318fe8a055ad8040174))
- cleanup ([5441d47](https://github.com/medusajs/medusa/commit/5441d47f88d759742e3d3d29b29bc38feceac583))

## [0.0.5](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.4...medusa-plugin-meilisearch@0.0.5) (2021-10-18)

**Note:** Version bump only for package medusa-plugin-meilisearch

## [0.0.4](https://github.com/medusajs/medusa/compare/medusa-plugin-meilisearch@0.0.3...medusa-plugin-meilisearch@0.0.4) (2021-10-18)

**Note:** Version bump only for package medusa-plugin-meilisearch

## 0.0.3 (2021-10-18)

### Bug Fixes

- meiliesearch README.md + remove: searchService from silentResolver ([1444353](https://github.com/medusajs/medusa/commit/1444353b0af4e18a23cebbf46b6d1246aa495bb4))
- move subscriber to core ([700f8c3](https://github.com/medusajs/medusa/commit/700f8c39190469337c74d9bf3f046f293024e521))
- remove package-lock ([08b2d8f](https://github.com/medusajs/medusa/commit/08b2d8fc39e7e04fadbfb012fcbc083febf9c290))
- use type to choose transformer before adding or replacing documents ([24eecd2](https://github.com/medusajs/medusa/commit/24eecd2922e0c3425f2d43549b3227c756820387))

## 0.0.2 (2021-10-18)

### Bug Fixes

- meiliesearch README.md + remove: searchService from silentResolver ([1444353](https://github.com/medusajs/medusa/commit/1444353b0af4e18a23cebbf46b6d1246aa495bb4))
- move subscriber to core ([700f8c3](https://github.com/medusajs/medusa/commit/700f8c39190469337c74d9bf3f046f293024e521))
- remove package-lock ([08b2d8f](https://github.com/medusajs/medusa/commit/08b2d8fc39e7e04fadbfb012fcbc083febf9c290))
- use type to choose transformer before adding or replacing documents ([24eecd2](https://github.com/medusajs/medusa/commit/24eecd2922e0c3425f2d43549b3227c756820387))
