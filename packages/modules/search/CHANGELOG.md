# @medusajs/search

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

- [#16545](https://github.com/medusajs/medusa/pull/16545) [`4857d15bdcaf5a0648e7adc5b0b40312e23b5c02`](https://github.com/medusajs/medusa/commit/4857d15bdcaf5a0648e7adc5b0b40312e23b5c02) Thanks [@sradevski](https://github.com/sradevski)! - Remove the in-memory local search provider. Indexes are created only by `db:migrate`, never at application start.

- [#16508](https://github.com/medusajs/medusa/pull/16508) [`c660642e0dcba2a581086b5176ab8fbc06127ed8`](https://github.com/medusajs/medusa/commit/c660642e0dcba2a581086b5176ab8fbc06127ed8) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(search, query, types): return fields and relations not in the search index

- [#16457](https://github.com/medusajs/medusa/pull/16457) [`693310310610cf439fabb73230187028f2755696`](https://github.com/medusajs/medusa/commit/693310310610cf439fabb73230187028f2755696) Thanks [@sradevski](https://github.com/sradevski)! - Implement Medusa Cloud as a built-in search provider

- [#16541](https://github.com/medusajs/medusa/pull/16541) [`c1e5a8f63988698df7f92b8f1e75f63ab8fdee64`](https://github.com/medusajs/medusa/commit/c1e5a8f63988698df7f92b8f1e75f63ab8fdee64) Thanks [@sradevski](https://github.com/sradevski)! - Drop the previous search provider's indexes when `db:migrate` switches engines.

  Log seed/reindex progress (count, rate, last key) so large catalogs can be followed.

- [#16643](https://github.com/medusajs/medusa/pull/16643) [`e01b039f256cb8224dd70a99662a49d0e8cf65d1`](https://github.com/medusajs/medusa/commit/e01b039f256cb8224dd70a99662a49d0e8cf65d1) Thanks [@sradevski](https://github.com/sradevski)! - Add multiple query support in query.search, move searchMany to provider

- Updated dependencies [[`847612908fdd1c11a4df09ccc2e8ab44d338bb04`](https://github.com/medusajs/medusa/commit/847612908fdd1c11a4df09ccc2e8ab44d338bb04), [`785fd2b8a978201638a4d8d5ae9eea483958c0fb`](https://github.com/medusajs/medusa/commit/785fd2b8a978201638a4d8d5ae9eea483958c0fb), [`706ce874672c9cd1d8fc0c5429fc0dd24e6910a9`](https://github.com/medusajs/medusa/commit/706ce874672c9cd1d8fc0c5429fc0dd24e6910a9), [`6a2fce501f3bcd459c21a67f586c7a15b905ff0f`](https://github.com/medusajs/medusa/commit/6a2fce501f3bcd459c21a67f586c7a15b905ff0f), [`5e06e544a296b9033f20f71f11c559f81a0e5739`](https://github.com/medusajs/medusa/commit/5e06e544a296b9033f20f71f11c559f81a0e5739)]:
  - @medusajs/framework@2.20.0

## 2.19.0

### Patch Changes

- [#16298](https://github.com/medusajs/medusa/pull/16298) [`5f4d93c374b0ad0b0a31e75de98c7557e0415677`](https://github.com/medusajs/medusa/commit/5f4d93c374b0ad0b0a31e75de98c7557e0415677) Thanks [@sradevski](https://github.com/sradevski)! - Add the Search Module: provider-backed search with an in-memory (Orama) provider, the `query.search` primitive, index definition discovery from `search/`, index migrations through `db:migrate`, event-driven ingestion, and an `/admin/search` endpoint

- Updated dependencies [[`372a1ab8fa4c8415f1eda294e3c4c5d9dbee4a30`](https://github.com/medusajs/medusa/commit/372a1ab8fa4c8415f1eda294e3c4c5d9dbee4a30), [`5f4d93c374b0ad0b0a31e75de98c7557e0415677`](https://github.com/medusajs/medusa/commit/5f4d93c374b0ad0b0a31e75de98c7557e0415677), [`5105fec20908cf7bcd7f5f859674acdd8a38b982`](https://github.com/medusajs/medusa/commit/5105fec20908cf7bcd7f5f859674acdd8a38b982)]:
  - @medusajs/framework@2.19.0
