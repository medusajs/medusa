# @medusajs/query

## 2.20.2

### Patch Changes

- Updated dependencies [[`b650b6c9a486f50ac437614ba36c7f42a203a458`](https://github.com/medusajs/medusa/commit/b650b6c9a486f50ac437614ba36c7f42a203a458), [`bda24b9725ac697ec5e8f706b503013e20babf12`](https://github.com/medusajs/medusa/commit/bda24b9725ac697ec5e8f706b503013e20babf12)]:
  - @medusajs/utils@2.20.2
  - @medusajs/deps@2.20.2

## 2.20.1

### Patch Changes

- Updated dependencies [[`75c26e85f3bebc0c921064e9aa37987a76cc24ae`](https://github.com/medusajs/medusa/commit/75c26e85f3bebc0c921064e9aa37987a76cc24ae)]:
  - @medusajs/utils@2.20.1
  - @medusajs/deps@2.20.1

## 2.20.0

### Patch Changes

- [#16508](https://github.com/medusajs/medusa/pull/16508) [`c660642e0dcba2a581086b5176ab8fbc06127ed8`](https://github.com/medusajs/medusa/commit/c660642e0dcba2a581086b5176ab8fbc06127ed8) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(search, query, types): return fields and relations not in the search index

- [#16643](https://github.com/medusajs/medusa/pull/16643) [`e01b039f256cb8224dd70a99662a49d0e8cf65d1`](https://github.com/medusajs/medusa/commit/e01b039f256cb8224dd70a99662a49d0e8cf65d1) Thanks [@sradevski](https://github.com/sradevski)! - Add multiple query support in query.search, move searchMany to provider

- Updated dependencies [[`4857d15bdcaf5a0648e7adc5b0b40312e23b5c02`](https://github.com/medusajs/medusa/commit/4857d15bdcaf5a0648e7adc5b0b40312e23b5c02), [`51c48dcb472c3b232b88337030945b2b651e90f8`](https://github.com/medusajs/medusa/commit/51c48dcb472c3b232b88337030945b2b651e90f8), [`4528357cfe3c3bcf76a20b2ac2fe3637fb649a9d`](https://github.com/medusajs/medusa/commit/4528357cfe3c3bcf76a20b2ac2fe3637fb649a9d), [`693310310610cf439fabb73230187028f2755696`](https://github.com/medusajs/medusa/commit/693310310610cf439fabb73230187028f2755696), [`b9f3d12440a7f02ec3b68443934195193e4ecba8`](undefined), [`7f5bc532f92cd2cacea4c4750f64bc5b337f6f36`](undefined), [`c1e5a8f63988698df7f92b8f1e75f63ab8fdee64`](https://github.com/medusajs/medusa/commit/c1e5a8f63988698df7f92b8f1e75f63ab8fdee64), [`f7317903600e5b64f06c21c29a73e0e569d2fe3a`](https://github.com/medusajs/medusa/commit/f7317903600e5b64f06c21c29a73e0e569d2fe3a), [`2a5dd813a7e1d5094cb81f688e2e9e7cc8fd3543`](https://github.com/medusajs/medusa/commit/2a5dd813a7e1d5094cb81f688e2e9e7cc8fd3543), [`e01b039f256cb8224dd70a99662a49d0e8cf65d1`](https://github.com/medusajs/medusa/commit/e01b039f256cb8224dd70a99662a49d0e8cf65d1)]:
  - @medusajs/utils@2.20.0
  - @medusajs/deps@2.20.0

## 2.19.0

### Patch Changes

- [#16354](https://github.com/medusajs/medusa/pull/16354) [`372a1ab8fa4c8415f1eda294e3c4c5d9dbee4a30`](https://github.com/medusajs/medusa/commit/372a1ab8fa4c8415f1eda294e3c4c5d9dbee4a30) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(caching,core-flows,framework,query,types,utils): pass non automatically computed tags to various cached queries.

- [#16298](https://github.com/medusajs/medusa/pull/16298) [`5f4d93c374b0ad0b0a31e75de98c7557e0415677`](https://github.com/medusajs/medusa/commit/5f4d93c374b0ad0b0a31e75de98c7557e0415677) Thanks [@sradevski](https://github.com/sradevski)! - Add the Search Module: provider-backed search with an in-memory (Orama) provider, the `query.search` primitive, index definition discovery from `search/`, index migrations through `db:migrate`, event-driven ingestion, and an `/admin/search` endpoint

- Updated dependencies [[`b31b64270e19a785ee1d396766a0e0c0a37f8354`](https://github.com/medusajs/medusa/commit/b31b64270e19a785ee1d396766a0e0c0a37f8354), [`be4ccf3f6a5ae40eff1ed55743d3518bdefeb07d`](https://github.com/medusajs/medusa/commit/be4ccf3f6a5ae40eff1ed55743d3518bdefeb07d), [`c13aaa96b3968b7f021131529f630b1de7bd6970`](https://github.com/medusajs/medusa/commit/c13aaa96b3968b7f021131529f630b1de7bd6970), [`372a1ab8fa4c8415f1eda294e3c4c5d9dbee4a30`](https://github.com/medusajs/medusa/commit/372a1ab8fa4c8415f1eda294e3c4c5d9dbee4a30), [`18e02fb06f5c925c0b3ebc1943407bf58f83e7b7`](https://github.com/medusajs/medusa/commit/18e02fb06f5c925c0b3ebc1943407bf58f83e7b7), [`5f4d93c374b0ad0b0a31e75de98c7557e0415677`](https://github.com/medusajs/medusa/commit/5f4d93c374b0ad0b0a31e75de98c7557e0415677), [`1fb31df2728659578b2aab697322b80b7501b66b`](https://github.com/medusajs/medusa/commit/1fb31df2728659578b2aab697322b80b7501b66b), [`9fa4bd9eb941a266c560b35683e8230af33a3352`](https://github.com/medusajs/medusa/commit/9fa4bd9eb941a266c560b35683e8230af33a3352)]:
  - @medusajs/utils@2.19.0
  - @medusajs/deps@2.19.0

## 2.18.0

### Patch Changes

- [`2962faf657018e6ad180ba9ac1fec771c3040c56`](undefined) - Refactor query logic in a dedicated package

- Updated dependencies [[`b83aeae9b03e52dedbf3cd37be5f838e23875014`](https://github.com/medusajs/medusa/commit/b83aeae9b03e52dedbf3cd37be5f838e23875014), [`1621e14330fe64a968510991408ace8fdac84ce9`](https://github.com/medusajs/medusa/commit/1621e14330fe64a968510991408ace8fdac84ce9), [`6d1622265c96e2417b64aa69fd867a89522e6b76`](https://github.com/medusajs/medusa/commit/6d1622265c96e2417b64aa69fd867a89522e6b76), [`04daac9a7639435a89446578b9012ad0a673ac6b`](https://github.com/medusajs/medusa/commit/04daac9a7639435a89446578b9012ad0a673ac6b), [`45646168b9769a306c3783fa605a7109f9df4ee9`](https://github.com/medusajs/medusa/commit/45646168b9769a306c3783fa605a7109f9df4ee9), [`b18d4de91c2c229ba7a03a9d541e1b8de71f52a9`](https://github.com/medusajs/medusa/commit/b18d4de91c2c229ba7a03a9d541e1b8de71f52a9), [`a48e78b953943efd11204f48890608020f7949e0`](https://github.com/medusajs/medusa/commit/a48e78b953943efd11204f48890608020f7949e0), [`af4ab2f5f7721f8b99c80158c78fba3b5c4db64d`](https://github.com/medusajs/medusa/commit/af4ab2f5f7721f8b99c80158c78fba3b5c4db64d), [`f85473ca88249bed7bfed81b01326a7abc46ac12`](https://github.com/medusajs/medusa/commit/f85473ca88249bed7bfed81b01326a7abc46ac12), [`0e7973e2fc3c45da39136cf3f66c90358571ffc5`](https://github.com/medusajs/medusa/commit/0e7973e2fc3c45da39136cf3f66c90358571ffc5), [`7d7edad6fdf47ae36c06cd5f5b71232c9d51c70b`](https://github.com/medusajs/medusa/commit/7d7edad6fdf47ae36c06cd5f5b71232c9d51c70b), [`7c0f94c207796bc443fd36d3999f1533bba255be`](https://github.com/medusajs/medusa/commit/7c0f94c207796bc443fd36d3999f1533bba255be), [`3382c8189bfc9f44e86123496ef3665e92ac91c9`](https://github.com/medusajs/medusa/commit/3382c8189bfc9f44e86123496ef3665e92ac91c9), [`d6b2a87da1dbfd065336c80e41cb7c086dc2a340`](https://github.com/medusajs/medusa/commit/d6b2a87da1dbfd065336c80e41cb7c086dc2a340), [`935a14c0098580a2b6ef8af11321e931c8ac80da`](https://github.com/medusajs/medusa/commit/935a14c0098580a2b6ef8af11321e931c8ac80da), [`e78ef6ce51a00e6b303b654c5046cd1e60c8dc68`](https://github.com/medusajs/medusa/commit/e78ef6ce51a00e6b303b654c5046cd1e60c8dc68), [`99f2ea9c85a64a08c56196ba963db2c8dd0b7923`](https://github.com/medusajs/medusa/commit/99f2ea9c85a64a08c56196ba963db2c8dd0b7923), [`9cd0501b26c401431a11e0d7f4ae6719100b9296`](https://github.com/medusajs/medusa/commit/9cd0501b26c401431a11e0d7f4ae6719100b9296), [`70c122753875f3cca03ff49b8a0ea9fe2c5e1165`](https://github.com/medusajs/medusa/commit/70c122753875f3cca03ff49b8a0ea9fe2c5e1165), [`a48e78b953943efd11204f48890608020f7949e0`](https://github.com/medusajs/medusa/commit/a48e78b953943efd11204f48890608020f7949e0)]:
  - @medusajs/utils@2.18.0
  - @medusajs/deps@2.18.0
