# @medusajs/search-postgres

## 2.22.2

### Patch Changes

- Updated dependencies [[`ca881e5`](https://github.com/medusajs/medusa/commit/ca881e5e758c49cfcbac4130d7e626dc06f439a6), [`9d55082`](https://github.com/medusajs/medusa/commit/9d55082bf9706e45b148100808f4d4550b9105bc), [`26e5807`](https://github.com/medusajs/medusa/commit/26e58070c1661c14aedc02ee6cfb0b2bb28d497b), [`52caddd`](https://github.com/medusajs/medusa/commit/52cadddcf34fdbbc70be34aecd036d6885e8fa5d)]:
  - @medusajs/framework@2.22.2

## 2.22.1

### Patch Changes

- [#17437](https://github.com/medusajs/medusa/pull/17437) [`99bcfeb5ee60b9e2df56d3d2d38e82470eaab68d`](https://github.com/medusajs/medusa/commit/99bcfeb5ee60b9e2df56d3d2d38e82470eaab68d) Thanks [@medusa-os-bot](https://github.com/apps/medusa-os-bot)! - fix(search-postgres): apply min_score to facet counts for keyword search

- Updated dependencies []:
  - @medusajs/framework@2.22.1

## 2.22.0

### Minor Changes

- [#17089](https://github.com/medusajs/medusa/pull/17089) [`d249d29ddef76d0bde0b68899b9fe5f9faa1ef6a`](https://github.com/medusajs/medusa/commit/d249d29ddef76d0bde0b68899b9fe5f9faa1ef6a) Thanks [@shahednasser](https://github.com/shahednasser)! - chore: drop Node.js 20 support and require Node.js v22.22.0 or later

### Patch Changes

- [#17382](https://github.com/medusajs/medusa/pull/17382) [`1db74006ede40300afe64970024688a1a9c2a936`](https://github.com/medusajs/medusa/commit/1db74006ede40300afe64970024688a1a9c2a936) Thanks [@shahednasser](https://github.com/shahednasser)! - chore: ship AGENTS.md in published packages and add agent discovery fields to package.json

- Updated dependencies [[`d249d29ddef76d0bde0b68899b9fe5f9faa1ef6a`](https://github.com/medusajs/medusa/commit/d249d29ddef76d0bde0b68899b9fe5f9faa1ef6a), [`14499a2e9309d653c0e4ec6aec3f88079751b4d2`](https://github.com/medusajs/medusa/commit/14499a2e9309d653c0e4ec6aec3f88079751b4d2), [`44db0ca6357ab4d4681a8004e869fde339c3117a`](https://github.com/medusajs/medusa/commit/44db0ca6357ab4d4681a8004e869fde339c3117a), [`1db74006ede40300afe64970024688a1a9c2a936`](https://github.com/medusajs/medusa/commit/1db74006ede40300afe64970024688a1a9c2a936)]:
  - @medusajs/framework@2.22.0

## 2.21.2

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.21.2

## 2.21.1

### Patch Changes

- [#16891](https://github.com/medusajs/medusa/pull/16891) [`b18e369e76ece5a9079289a934425673100b9e58`](https://github.com/medusajs/medusa/commit/b18e369e76ece5a9079289a934425673100b9e58) Thanks [@sradevski](https://github.com/sradevski)! - feat(search-postgres): ignore vector fields instead of refusing the index

  Vector search is only available on the lakebase engine, and a vector field in an
  index definition used to make the native engine reject the whole index. That
  made a definition that is valid on one provider unusable on another. The native
  engine now logs which vector fields it is dropping and builds the index without
  them.

  Queries that explicitly ask for `search_options.vector` on the native engine are
  still rejected, since answering them with keyword results would be wrong.

- Updated dependencies [[`c000d377f1a90d14bcda41500b1ed5bc2734902e`](https://github.com/medusajs/medusa/commit/c000d377f1a90d14bcda41500b1ed5bc2734902e)]:
  - @medusajs/framework@2.21.1

## 2.21.0

### Patch Changes

- Updated dependencies [[`e9d1f84dbfacd35d7787d1af03215a6ae5a176d8`](https://github.com/medusajs/medusa/commit/e9d1f84dbfacd35d7787d1af03215a6ae5a176d8), [`a4c0a845e8b3a7a5acfaacbb0c093cd539ac713b`](https://github.com/medusajs/medusa/commit/a4c0a845e8b3a7a5acfaacbb0c093cd539ac713b), [`c8701e77534f7b615c8b86814f8d5789c0104382`](https://github.com/medusajs/medusa/commit/c8701e77534f7b615c8b86814f8d5789c0104382), [`df8c278d615229436be5b299ebdc76a576695fc3`](https://github.com/medusajs/medusa/commit/df8c278d615229436be5b299ebdc76a576695fc3)]:
  - @medusajs/framework@2.21.0

## 2.20.1

### Patch Changes

- [#16703](https://github.com/medusajs/medusa/pull/16703) [`75c26e85f3bebc0c921064e9aa37987a76cc24ae`](https://github.com/medusajs/medusa/commit/75c26e85f3bebc0c921064e9aa37987a76cc24ae) Thanks [@sradevski](https://github.com/sradevski)! - Remove correlated flag on search until supported

- Updated dependencies [[`f373c17dd60cb1e7df1d0c70db31d516d2a0cb4f`](https://github.com/medusajs/medusa/commit/f373c17dd60cb1e7df1d0c70db31d516d2a0cb4f)]:
  - @medusajs/framework@2.20.1

## 2.20.0

### Patch Changes

- [#16545](https://github.com/medusajs/medusa/pull/16545) [`4857d15bdcaf5a0648e7adc5b0b40312e23b5c02`](https://github.com/medusajs/medusa/commit/4857d15bdcaf5a0648e7adc5b0b40312e23b5c02) Thanks [@sradevski](https://github.com/sradevski)! - Match admin search prefixes on the last query term so "dtc sta" still finds "Dtc starter".

- [#16361](https://github.com/medusajs/medusa/pull/16361) [`51c48dcb472c3b232b88337030945b2b651e90f8`](https://github.com/medusajs/medusa/commit/51c48dcb472c3b232b88337030945b2b651e90f8) Thanks [@sradevski](https://github.com/sradevski)! - Add a postgres search provider

- [#16581](https://github.com/medusajs/medusa/pull/16581) [`fcee02e4215ba3d7d2f97d24adeb3bed583f43ee`](https://github.com/medusajs/medusa/commit/fcee02e4215ba3d7d2f97d24adeb3bed583f43ee) Thanks [@sradevski](https://github.com/sradevski)! - Install Lakebase Search extensions during `db:migrate` with `CREATE EXTENSION ... CASCADE`, now that Lakebase no longer requires a preload step.

- [#16457](https://github.com/medusajs/medusa/pull/16457) [`693310310610cf439fabb73230187028f2755696`](https://github.com/medusajs/medusa/commit/693310310610cf439fabb73230187028f2755696) Thanks [@sradevski](https://github.com/sradevski)! - Implement Medusa Cloud as a built-in search provider

- [#16643](https://github.com/medusajs/medusa/pull/16643) [`e01b039f256cb8224dd70a99662a49d0e8cf65d1`](https://github.com/medusajs/medusa/commit/e01b039f256cb8224dd70a99662a49d0e8cf65d1) Thanks [@sradevski](https://github.com/sradevski)! - Add multiple query support in query.search, move searchMany to provider

- Updated dependencies [[`847612908fdd1c11a4df09ccc2e8ab44d338bb04`](https://github.com/medusajs/medusa/commit/847612908fdd1c11a4df09ccc2e8ab44d338bb04), [`785fd2b8a978201638a4d8d5ae9eea483958c0fb`](https://github.com/medusajs/medusa/commit/785fd2b8a978201638a4d8d5ae9eea483958c0fb), [`706ce874672c9cd1d8fc0c5429fc0dd24e6910a9`](https://github.com/medusajs/medusa/commit/706ce874672c9cd1d8fc0c5429fc0dd24e6910a9), [`6a2fce501f3bcd459c21a67f586c7a15b905ff0f`](https://github.com/medusajs/medusa/commit/6a2fce501f3bcd459c21a67f586c7a15b905ff0f), [`5e06e544a296b9033f20f71f11c559f81a0e5739`](https://github.com/medusajs/medusa/commit/5e06e544a296b9033f20f71f11c559f81a0e5739)]:
  - @medusajs/framework@2.20.0
