# @medusajs/search-postgres

## 2.20.2

### Patch Changes

- Updated dependencies [[`a4c0a845e8b3a7a5acfaacbb0c093cd539ac713b`](https://github.com/medusajs/medusa/commit/a4c0a845e8b3a7a5acfaacbb0c093cd539ac713b), [`c8701e77534f7b615c8b86814f8d5789c0104382`](https://github.com/medusajs/medusa/commit/c8701e77534f7b615c8b86814f8d5789c0104382)]:
  - @medusajs/framework@2.20.2

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
