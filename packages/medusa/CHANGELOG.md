# Change Log

## 1.3.5

### Patch Changes

- [#1914](https://github.com/medusajs/medusa/pull/1914) [`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68) Thanks [@fPolic](https://github.com/fPolic)! - Version bump due to missing changesets in merged PRs

* [#1878](https://github.com/medusajs/medusa/pull/1878) [`8c283ac3b`](https://github.com/medusajs/medusa/commit/8c283ac3b03dea09203ac1b4c8d806efbc092290) Thanks [@srindom](https://github.com/srindom)! - Fixes issue with listing shipping options with a calculated price type

- [#1874](https://github.com/medusajs/medusa/pull/1874) [`b8ddb31f6`](https://github.com/medusajs/medusa/commit/b8ddb31f6fe296a11d2d988276ba8e991c37fa9b) Thanks [@adrien2p](https://github.com/adrien2p)! - Move search indexing into a separate subscriber to defer the work load

* [#1852](https://github.com/medusajs/medusa/pull/1852) [`dafbfa779`](https://github.com/medusajs/medusa/commit/dafbfa7799410a95f9a1ca02d1db718d1f8693eb) Thanks [@olivermrbl](https://github.com/olivermrbl)! - When marking a Draft Order as paid, we should generate tax lines before completing it

- [#1873](https://github.com/medusajs/medusa/pull/1873) [`df6637853`](https://github.com/medusajs/medusa/commit/df66378535727152bb329c71c38d614e5b642599) Thanks [@adrien2p](https://github.com/adrien2p)! - Adds support for:
  - Attaching Sales Channel to cart as part of creation
  - Updating Sales Channel on a cart and removing inapplicable line items

* [#1843](https://github.com/medusajs/medusa/pull/1843) [`716297231`](https://github.com/medusajs/medusa/commit/71629723185739a97fc2cf8eaa9029f7963bb120) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Fixes free text search for PriceList Products

- [#1884](https://github.com/medusajs/medusa/pull/1884) [`0e0b13148`](https://github.com/medusajs/medusa/commit/0e0b13148892b073a1b46900c6eb1b0d8e05cc37) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Expand store result to include default sales channel

* [#1851](https://github.com/medusajs/medusa/pull/1851) [`c148064b4`](https://github.com/medusajs/medusa/commit/c148064b4abdc4447d8216a6de0a6ce84e3a061c) Thanks [@srindom](https://github.com/srindom)! - Allow an array of region ids in list orders endpoint

* Updated dependencies [[`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68), [`b8ddb31f6`](https://github.com/medusajs/medusa/commit/b8ddb31f6fe296a11d2d988276ba8e991c37fa9b)]:
  - medusa-interfaces@1.3.2

## 1.3.4

### Patch Changes

- [#1819](https://github.com/medusajs/medusa/pull/1819) [`3e197e3a`](https://github.com/medusajs/medusa/commit/3e197e3adf0bcd39cdcf30c7dda381cc4b7ac779) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add feature flags to store response

* [#1807](https://github.com/medusajs/medusa/pull/1807) [`39f2c0c1`](https://github.com/medusajs/medusa/commit/39f2c0c15ee05b5b6941ea2ef16f0b4b1512ce4f) Thanks [@srindom](https://github.com/srindom)! - Calculates correct taxes and totals on line items when carts and orders have gift cards

- [#1812](https://github.com/medusajs/medusa/pull/1812) [`4d15e01c`](https://github.com/medusajs/medusa/commit/4d15e01c3ebbc341113505d3c2f60c0e082943ae) Thanks [@srindom](https://github.com/srindom)! - Calculate orders correctly when creating fulfillments by adding adjustments

* [#1825](https://github.com/medusajs/medusa/pull/1825) [`fb82d3dd`](https://github.com/medusajs/medusa/commit/fb82d3dd221efeba5b0110bd00908faecbdb30d7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - - Add migration that ensures the correct state of the batch job table regardless of previous migrations

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.3.3](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.3.2...@medusajs/medusa@1.3.3) (2022-07-05)

### Bug Fixes

- introduce listAndCount for gift cards to enable pagination ([#1754](https://github.com/medusajs/medusa/issues/1754)) ([9a14b84](https://github.com/medusajs/medusa/commit/9a14b84e58a7db2b38edaf9ce59dcb4416736c30))
- **medusa:** Remove deps `mongoose` + `mongodb` ([#1218](https://github.com/medusajs/medusa/issues/1218)) ([c76e23e](https://github.com/medusajs/medusa/commit/c76e23e84dd8cb08c3c709f9f95c4c17b9685439))
- add shipping taxes ([#1759](https://github.com/medusajs/medusa/issues/1759)) ([fee0f88](https://github.com/medusajs/medusa/commit/fee0f88a62d7e00c844fcd021d090f130ab4a532))
- **medusa:** Add images relation ([#1693](https://github.com/medusajs/medusa/issues/1693)) ([765c794](https://github.com/medusajs/medusa/commit/765c794b9775a12fffbed59a6312beb87442dc1a))
- **medusa:** Normalizes email before saving customer ([#1719](https://github.com/medusajs/medusa/issues/1719)) ([2a32609](https://github.com/medusajs/medusa/commit/2a32609b7458c12f047d3f9ba45d426fdc784d58))
- **medusa:** Plugin loader must also check for TransactionBaseService ([#1601](https://github.com/medusajs/medusa/issues/1601)) ([28ddf10](https://github.com/medusajs/medusa/commit/28ddf10446e689a32bf9d4d05dedd4aa090d66a0))
- **medusa:** Product export strategy ([#1713](https://github.com/medusajs/medusa/issues/1713)) ([89cb717](https://github.com/medusajs/medusa/commit/89cb7174613ffbced8abb3a7e8a4539134bd867c))
- **medusa:** Remove duplicate DiscountRuleType import ([#1699](https://github.com/medusajs/medusa/issues/1699)) ([46a6e1a](https://github.com/medusajs/medusa/commit/46a6e1a4d368241288d50cdd0aa35ac7dbf14764))
- **medusa:** update cron schedule to be every 6 hours ([#1658](https://github.com/medusajs/medusa/issues/1658)) ([cffb03d](https://github.com/medusajs/medusa/commit/cffb03d1978b6fe019007f9c7683b67171300255))
- adds tax calculation to product pricing ([#1354](https://github.com/medusajs/medusa/issues/1354)) ([14366f5](https://github.com/medusajs/medusa/commit/14366f536decc88546658e23521961a82409e842))
- includes variant prices when listing products using a search query ([#1607](https://github.com/medusajs/medusa/issues/1607)) ([247ad6d](https://github.com/medusajs/medusa/commit/247ad6dc6d7f55bdec5d9d1b59f96c380dbba9c9))

### Features

- add customer to fetch-draft-order payload ([#1444](https://github.com/medusajs/medusa/issues/1444)) ([3fb74bf](https://github.com/medusajs/medusa/commit/3fb74bf512644c4dc45615a608f27650a95fa791))
- **medusa:** Add batch strategy for order exports ([#1603](https://github.com/medusajs/medusa/issues/1603)) ([bf47d1a](https://github.com/medusajs/medusa/commit/bf47d1aecd74f4489667609444a8b09393e894d3))
- **medusa:** Add file size calculation for product export ([#1726](https://github.com/medusajs/medusa/issues/1726)) ([fb7abbf](https://github.com/medusajs/medusa/commit/fb7abbf40784dcc66dbde25d400f3af54141c237))
- **medusa:** Add line item totals to cart totals decoration ([#1740](https://github.com/medusajs/medusa/issues/1740)) ([c6dc908](https://github.com/medusajs/medusa/commit/c6dc9086cfa272db0c1a7f98f670bd3ed8ccfa78))
- **medusa:** Allow to filter the batch jobs with nullable date ([#1747](https://github.com/medusajs/medusa/issues/1747)) ([c0f624a](https://github.com/medusajs/medusa/commit/c0f624ad3b8ae507438c0c84d867dc19904f08ae))
- **medusa:** Apply query transformers to Collection and CustomerGroups ([#1667](https://github.com/medusajs/medusa/issues/1667)) ([e53c06e](https://github.com/medusajs/medusa/commit/e53c06eab8a37579f33c547d0373edc082cc308b))
- **medusa:** BatchJobStrategy and loaders ([#1434](https://github.com/medusajs/medusa/issues/1434)) ([886dcbc](https://github.com/medusajs/medusa/commit/886dcbc82fc5ec784e699ddf7b18f710535fdada))
- **medusa:** Convert GiftCardService to Typescript ([#1664](https://github.com/medusajs/medusa/issues/1664)) ([1585b7a](https://github.com/medusajs/medusa/commit/1585b7ae2b063adad9c22f6aac9d1e426ccac29f))
- **medusa:** Delete and download url endpoints ([#1705](https://github.com/medusajs/medusa/issues/1705)) ([cc29b64](https://github.com/medusajs/medusa/commit/cc29b641c9358415b46179371988e7ddc11d2664))
- **medusa:** Extend file-service interface + move to core ([#1577](https://github.com/medusajs/medusa/issues/1577)) ([8e42d37](https://github.com/medusajs/medusa/commit/8e42d37e84e80c003b9c0311117ab8a8871aa61b))
- **medusa:** Migrate utils to TS ([#1415](https://github.com/medusajs/medusa/issues/1415)) ([d98cd85](https://github.com/medusajs/medusa/commit/d98cd85d2370f179044ddfec43479dc7cdcc39bd))
- **medusa:** Parsing CSV files ([#1572](https://github.com/medusajs/medusa/issues/1572)) ([9e686a8](https://github.com/medusajs/medusa/commit/9e686a8e47c567ffdb57bb43af796dd38049294f))
- **medusa:** Support batch-job API ([#1547](https://github.com/medusajs/medusa/issues/1547)) ([4536886](https://github.com/medusajs/medusa/commit/453688682c79032737ea47197c00ea14e84aab02)), closes [#1434](https://github.com/medusajs/medusa/issues/1434) [#1548](https://github.com/medusajs/medusa/issues/1548) [#1453](https://github.com/medusajs/medusa/issues/1453)
- **medusa:** Support transformQuery/Body middleware, introduction of pipe feature ([#1593](https://github.com/medusajs/medusa/issues/1593)) ([3359e18](https://github.com/medusajs/medusa/commit/3359e189a70533692f85fbbff9b09018872abbf4))
- **medusa:** Update BuildQuery typings ([#1672](https://github.com/medusajs/medusa/issues/1672)) ([93aaaa7](https://github.com/medusajs/medusa/commit/93aaaa71bd07ba0675be05ea503580f3e9ec6806))
- **medusa-cli:** Allow to revert migrations from the CLI ([#1353](https://github.com/medusajs/medusa/issues/1353)) ([012513b](https://github.com/medusajs/medusa/commit/012513b6a1e90169e9e0e53f7a59841a34fbaeb3))
- **medusa,medusa-js,medusa-react:** Add BatchJob API support in `medusa-js` + `medusa-react` ([#1704](https://github.com/medusajs/medusa/issues/1704)) ([7302d76](https://github.com/medusajs/medusa/commit/7302d76e12683c989f340d2fcfaf4338dca6554a))
- **medusa/product-export-strategy:** Implement the Product export strategy ([#1688](https://github.com/medusajs/medusa/issues/1688)) ([7b09b8c](https://github.com/medusajs/medusa/commit/7b09b8c36cf8777ee874deed795bc98ba6653aa8))

## [1.3.2](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.3.0...@medusajs/medusa@1.3.2) (2022-06-19)

### Bug Fixes

- **medisa:** Deleting price list should use `remove` ([#1540](https://github.com/medusajs/medusa/issues/1540)) ([f0ecef6](https://github.com/medusajs/medusa/commit/f0ecef6b9ae878e83be0efaf13d6f3fef5d48e3a))
- **medusa:** `AddressPayload` typing and removes Joi validation from CustomerService ([#1520](https://github.com/medusajs/medusa/issues/1520)) ([8dd27ec](https://github.com/medusajs/medusa/commit/8dd27ecb7e1de70e84ed5332ea329827473c00aa))
- **medusa:** add `q` param to `listAndCount` product types and product tags ([#1531](https://github.com/medusajs/medusa/issues/1531)) ([46d9e6c](https://github.com/medusajs/medusa/commit/46d9e6c44cea190baf56874f86fe4a5e692b9a44))
- **medusa:** Allow de-selecting configurations in price lists ([#1596](https://github.com/medusajs/medusa/issues/1596)) ([3f23ede](https://github.com/medusajs/medusa/commit/3f23edea2314da5edd477280eeb93727500f7b84))
- **medusa:** allow price list `prices` update when `region_id` is provided ([#1472](https://github.com/medusajs/medusa/issues/1472)) ([03c5617](https://github.com/medusajs/medusa/commit/03c5617896d08b354932a470cadd9d36508f9d40))
- **medusa:** applicableness of discounts with conditions not related to customer groups ([#1534](https://github.com/medusajs/medusa/issues/1534)) ([a10ac19](https://github.com/medusajs/medusa/commit/a10ac19d8e12f8c1c69020ca9e09e7c4739a740c))
- **medusa:** CartService fix discounts empty array check on update ([#1516](https://github.com/medusajs/medusa/issues/1516)) ([e31fe4a](https://github.com/medusajs/medusa/commit/e31fe4af163ebd94eefaaa61e519607ec04c5622))
- **medusa:** CartService lost shipping address when using the id ([c442be4](https://github.com/medusajs/medusa/commit/c442be47d4a0b4cf3b46ce604b05e16424544046))
- **medusa:** discount types across model, service and api ([#1545](https://github.com/medusajs/medusa/issues/1545)) ([2f08167](https://github.com/medusajs/medusa/commit/2f08167480e23f64590d85c098ea6a18ad2d0270))
- **medusa:** Include adjustments in cart retrieval relations in setPaymentSessions ([#1518](https://github.com/medusajs/medusa/issues/1518)) ([02eab5e](https://github.com/medusajs/medusa/commit/02eab5ee86b92d8dfa6346b09d2353659c064b42))
- **medusa:** Include adjustments when authorizing payment ([#1697](https://github.com/medusajs/medusa/issues/1697)) ([6b23208](https://github.com/medusajs/medusa/commit/6b23208d63c6928a0587176bc3a6e40091922151))
- **medusa:** MoneyAmountRepository#findManyForVariantInRegion sql statement for constraint related to price_list ([#1462](https://github.com/medusajs/medusa/issues/1462)) ([3c75a65](https://github.com/medusajs/medusa/commit/3c75a657924938f2aeda8cca7ad84a1971629ee0))
- **medusa:** PluginLoaders when loading services should only look for js files ([#1473](https://github.com/medusajs/medusa/issues/1473)) ([c67d6be](https://github.com/medusajs/medusa/commit/c67d6bee303ad8e43f320fe16f807b0d22890c5b))
- **medusa:** Post /admin/discounts/:id not updating condition operator ([#1573](https://github.com/medusajs/medusa/issues/1573)) ([5414148](https://github.com/medusajs/medusa/commit/5414148254de9b54c0c292e9348f524f15334b96))
- **medusa:** Prevent discount type updates ([#1584](https://github.com/medusajs/medusa/issues/1584)) ([083ab09](https://github.com/medusajs/medusa/commit/083ab09361271e48fd39a7d60f2ca3e172c20b23))
- **medusa:** Proper fix of the cart service ([f5edaf5](https://github.com/medusajs/medusa/commit/f5edaf51ea2d49d662b00f7a5360449cf827d825))
- **medusa:** Remove line-item.js file ([#1414](https://github.com/medusajs/medusa/issues/1414)) ([9087029](https://github.com/medusajs/medusa/commit/90870292c62e2e96ca8c9ffc51e32c73493e0c0b))
- **medusa:** RMA on items from swaps and claims ([#1182](https://github.com/medusajs/medusa/issues/1182)) ([5ae5f15](https://github.com/medusajs/medusa/commit/5ae5f15e9883786eb5759b49b98b858822e72a96))
- **medusa:** support searching for price lists ([#1407](https://github.com/medusajs/medusa/issues/1407)) ([f71b9b3](https://github.com/medusajs/medusa/commit/f71b9b3a8733fdcfe4298fcf49fd06ae89850fc2))
- **medusa:** Use boolean on list shipping options params ([#1493](https://github.com/medusajs/medusa/issues/1493)) ([7605963](https://github.com/medusajs/medusa/commit/7605963ded737514e2328bb0d1fb9814c14b84a9))
- Cascade remove prices + option values on variant and product delete ([#1465](https://github.com/medusajs/medusa/issues/1465)) ([e7cb76a](https://github.com/medusajs/medusa/commit/e7cb76ab6e13fe756e090fd1a0a3ff645c30c69a))
- Use correct product price when fetching product for pricelist ([#1416](https://github.com/medusajs/medusa/issues/1416)) ([e2d0831](https://github.com/medusajs/medusa/commit/e2d08316dd03946453c5bf39c78a141d9fd57d3c))
- **medusa-cli:** allow spaces in develop command ([#1430](https://github.com/medusajs/medusa/issues/1430)) ([2260c2d](https://github.com/medusajs/medusa/commit/2260c2d09ec057d62b548c55142273e86eda1ca0))

### Features

- **medusa:** Add /admin/products/:id/variants end point ([#1471](https://github.com/medusajs/medusa/issues/1471)) ([edeac8a](https://github.com/medusajs/medusa/commit/edeac8ac720e139216bb8d9fe0b6c3df28dadc75))
- **medusa:** Add endpoint for retrieving a DiscountCondition ([#1525](https://github.com/medusajs/medusa/issues/1525)) ([a87e1cd](https://github.com/medusajs/medusa/commit/a87e1cdf6558fd56bd91540853ca0bb715eda46e))
- **medusa:** Add endpoints specific to DiscountConditions ([#1355](https://github.com/medusajs/medusa/issues/1355)) ([9ca45ea](https://github.com/medusajs/medusa/commit/9ca45ea492e755a88737322f900d60abdfa64024))
- **medusa:** Add writable type ([1499bc5](https://github.com/medusajs/medusa/commit/1499bc52e36616ca9d67fd55bf5965478dff390f))
- **medusa:** Export BaseEntity/SoftDeletableEntity from the core ([#1594](https://github.com/medusajs/medusa/issues/1594)) ([d0c679f](https://github.com/medusajs/medusa/commit/d0c679fc7ef318481bd767d50e91e2523e6f674d))
- **medusa:** Export transaction related methods to the transactionBaseService ([99146b7](https://github.com/medusajs/medusa/commit/99146b74037b89c6893c97e77e43a1aaf1c2a3d4))
- **medusa:** Improve base-service ([bfb81b8](https://github.com/medusajs/medusa/commit/bfb81b8b32fbba538010221f1a30fcc31aaa691e))
- **medusa:** Improve buildQuery as well as refactor the cart service as an example ([b90291b](https://github.com/medusajs/medusa/commit/b90291b18d438e3bb7f5239f4470eec7b3c5ff03))
- **medusa:** List batch jobs + Introduce composable handler pattern ([#1541](https://github.com/medusajs/medusa/issues/1541)) ([4489b75](https://github.com/medusajs/medusa/commit/4489b75f5ad669b7a53023e9afb07fb11dcb89d3))
- **medusa:** Move some typings into the common types ([3ad9174](https://github.com/medusajs/medusa/commit/3ad91741b2e729638902d7c62ac99fdfe9a40b91))
- **medusa:** Rename base-service.spec to transaction-base-service.spec ([f7ef3aa](https://github.com/medusajs/medusa/commit/f7ef3aac36ed3053c8880522cc95bb046c03ebda))
- **medusa:** Split base service to its related TransactionBaseService and utilities methods when required ([e7e715a](https://github.com/medusajs/medusa/commit/e7e715ac177bd0b883ffa0d72a208580012bfbab))
- **medusa:** Support deleting prices from a price list by product or variant ([#1555](https://github.com/medusajs/medusa/issues/1555)) ([fa031fd](https://github.com/medusajs/medusa/commit/fa031fd28be8b12ff38eaec6e56c373324e0beed))
- **medusa:** Update TransactionBaseService methods visibility ([ff9ff21](https://github.com/medusajs/medusa/commit/ff9ff214873a14b3b0abc419f53838b8d728eea9))

## [1.3.1](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.3.0...@medusajs/medusa@1.3.1) (2022-05-31)

### Bug Fixes

- **medisa:** Deleting price list should use `remove` ([#1540](https://github.com/medusajs/medusa/issues/1540)) ([f0ecef6](https://github.com/medusajs/medusa/commit/f0ecef6b9ae878e83be0efaf13d6f3fef5d48e3a))
- **medusa:** `AddressPayload` typing and removes Joi validation from CustomerService ([#1520](https://github.com/medusajs/medusa/issues/1520)) ([8dd27ec](https://github.com/medusajs/medusa/commit/8dd27ecb7e1de70e84ed5332ea329827473c00aa))
- **medusa:** add `q` param to `listAndCount` product types and product tags ([#1531](https://github.com/medusajs/medusa/issues/1531)) ([46d9e6c](https://github.com/medusajs/medusa/commit/46d9e6c44cea190baf56874f86fe4a5e692b9a44))
- **medusa:** Allow de-selecting configurations in price lists ([#1596](https://github.com/medusajs/medusa/issues/1596)) ([3f23ede](https://github.com/medusajs/medusa/commit/3f23edea2314da5edd477280eeb93727500f7b84))
- **medusa:** allow price list `prices` update when `region_id` is provided ([#1472](https://github.com/medusajs/medusa/issues/1472)) ([03c5617](https://github.com/medusajs/medusa/commit/03c5617896d08b354932a470cadd9d36508f9d40))
- **medusa:** applicableness of discounts with conditions not related to customer groups ([#1534](https://github.com/medusajs/medusa/issues/1534)) ([a10ac19](https://github.com/medusajs/medusa/commit/a10ac19d8e12f8c1c69020ca9e09e7c4739a740c))
- **medusa:** CartService fix discounts empty array check on update ([#1516](https://github.com/medusajs/medusa/issues/1516)) ([e31fe4a](https://github.com/medusajs/medusa/commit/e31fe4af163ebd94eefaaa61e519607ec04c5622))
- **medusa:** CartService lost shipping address when using the id ([c442be4](https://github.com/medusajs/medusa/commit/c442be47d4a0b4cf3b46ce604b05e16424544046))
- **medusa:** discount types across model, service and api ([#1545](https://github.com/medusajs/medusa/issues/1545)) ([2f08167](https://github.com/medusajs/medusa/commit/2f08167480e23f64590d85c098ea6a18ad2d0270))
- **medusa:** Include adjustments in cart retrieval relations in setPaymentSessions ([#1518](https://github.com/medusajs/medusa/issues/1518)) ([02eab5e](https://github.com/medusajs/medusa/commit/02eab5ee86b92d8dfa6346b09d2353659c064b42))
- **medusa:** MoneyAmountRepository#findManyForVariantInRegion sql statement for constraint related to price_list ([#1462](https://github.com/medusajs/medusa/issues/1462)) ([3c75a65](https://github.com/medusajs/medusa/commit/3c75a657924938f2aeda8cca7ad84a1971629ee0))
- **medusa:** PluginLoaders when loading services should only look for js files ([#1473](https://github.com/medusajs/medusa/issues/1473)) ([c67d6be](https://github.com/medusajs/medusa/commit/c67d6bee303ad8e43f320fe16f807b0d22890c5b))
- **medusa:** Post /admin/discounts/:id not updating condition operator ([#1573](https://github.com/medusajs/medusa/issues/1573)) ([5414148](https://github.com/medusajs/medusa/commit/5414148254de9b54c0c292e9348f524f15334b96))
- **medusa:** Prevent discount type updates ([#1584](https://github.com/medusajs/medusa/issues/1584)) ([083ab09](https://github.com/medusajs/medusa/commit/083ab09361271e48fd39a7d60f2ca3e172c20b23))
- **medusa:** Proper fix of the cart service ([f5edaf5](https://github.com/medusajs/medusa/commit/f5edaf51ea2d49d662b00f7a5360449cf827d825))
- **medusa:** Remove line-item.js file ([#1414](https://github.com/medusajs/medusa/issues/1414)) ([9087029](https://github.com/medusajs/medusa/commit/90870292c62e2e96ca8c9ffc51e32c73493e0c0b))
- **medusa:** RMA on items from swaps and claims ([#1182](https://github.com/medusajs/medusa/issues/1182)) ([5ae5f15](https://github.com/medusajs/medusa/commit/5ae5f15e9883786eb5759b49b98b858822e72a96))
- **medusa:** support searching for price lists ([#1407](https://github.com/medusajs/medusa/issues/1407)) ([f71b9b3](https://github.com/medusajs/medusa/commit/f71b9b3a8733fdcfe4298fcf49fd06ae89850fc2))
- **medusa:** Use boolean on list shipping options params ([#1493](https://github.com/medusajs/medusa/issues/1493)) ([7605963](https://github.com/medusajs/medusa/commit/7605963ded737514e2328bb0d1fb9814c14b84a9))
- Cascade remove prices + option values on variant and product delete ([#1465](https://github.com/medusajs/medusa/issues/1465)) ([e7cb76a](https://github.com/medusajs/medusa/commit/e7cb76ab6e13fe756e090fd1a0a3ff645c30c69a))
- Use correct product price when fetching product for pricelist ([#1416](https://github.com/medusajs/medusa/issues/1416)) ([e2d0831](https://github.com/medusajs/medusa/commit/e2d08316dd03946453c5bf39c78a141d9fd57d3c))
- **medusa-cli:** allow spaces in develop command ([#1430](https://github.com/medusajs/medusa/issues/1430)) ([2260c2d](https://github.com/medusajs/medusa/commit/2260c2d09ec057d62b548c55142273e86eda1ca0))

### Features

- **medusa:** Add /admin/products/:id/variants end point ([#1471](https://github.com/medusajs/medusa/issues/1471)) ([edeac8a](https://github.com/medusajs/medusa/commit/edeac8ac720e139216bb8d9fe0b6c3df28dadc75))
- **medusa:** Add endpoint for retrieving a DiscountCondition ([#1525](https://github.com/medusajs/medusa/issues/1525)) ([a87e1cd](https://github.com/medusajs/medusa/commit/a87e1cdf6558fd56bd91540853ca0bb715eda46e))
- **medusa:** Add endpoints specific to DiscountConditions ([#1355](https://github.com/medusajs/medusa/issues/1355)) ([9ca45ea](https://github.com/medusajs/medusa/commit/9ca45ea492e755a88737322f900d60abdfa64024))
- **medusa:** Add writable type ([1499bc5](https://github.com/medusajs/medusa/commit/1499bc52e36616ca9d67fd55bf5965478dff390f))
- **medusa:** Export BaseEntity/SoftDeletableEntity from the core ([#1594](https://github.com/medusajs/medusa/issues/1594)) ([d0c679f](https://github.com/medusajs/medusa/commit/d0c679fc7ef318481bd767d50e91e2523e6f674d))
- **medusa:** Export transaction related methods to the transactionBaseService ([99146b7](https://github.com/medusajs/medusa/commit/99146b74037b89c6893c97e77e43a1aaf1c2a3d4))
- **medusa:** Improve base-service ([bfb81b8](https://github.com/medusajs/medusa/commit/bfb81b8b32fbba538010221f1a30fcc31aaa691e))
- **medusa:** Improve buildQuery as well as refactor the cart service as an example ([b90291b](https://github.com/medusajs/medusa/commit/b90291b18d438e3bb7f5239f4470eec7b3c5ff03))
- **medusa:** List batch jobs + Introduce composable handler pattern ([#1541](https://github.com/medusajs/medusa/issues/1541)) ([4489b75](https://github.com/medusajs/medusa/commit/4489b75f5ad669b7a53023e9afb07fb11dcb89d3))
- **medusa:** Move some typings into the common types ([3ad9174](https://github.com/medusajs/medusa/commit/3ad91741b2e729638902d7c62ac99fdfe9a40b91))
- **medusa:** Rename base-service.spec to transaction-base-service.spec ([f7ef3aa](https://github.com/medusajs/medusa/commit/f7ef3aac36ed3053c8880522cc95bb046c03ebda))
- **medusa:** Split base service to its related TransactionBaseService and utilities methods when required ([e7e715a](https://github.com/medusajs/medusa/commit/e7e715ac177bd0b883ffa0d72a208580012bfbab))
- **medusa:** Support deleting prices from a price list by product or variant ([#1555](https://github.com/medusajs/medusa/issues/1555)) ([fa031fd](https://github.com/medusajs/medusa/commit/fa031fd28be8b12ff38eaec6e56c373324e0beed))
- **medusa:** Update TransactionBaseService methods visibility ([ff9ff21](https://github.com/medusajs/medusa/commit/ff9ff214873a14b3b0abc419f53838b8d728eea9))

# [1.3.0](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.2.1...@medusajs/medusa@1.3.0) (2022-05-01)

### Bug Fixes

- Invoke canCalculate with an entire shipping option ([#1397](https://github.com/medusajs/medusa/issues/1397)) ([40b63d0](https://github.com/medusajs/medusa/commit/40b63d092a50fea1f86af140d94b3c9c38f00658))
- Update `is_giftcard` type when filtering products ([#1427](https://github.com/medusajs/medusa/issues/1427)) ([f7386bf](https://github.com/medusajs/medusa/commit/f7386bf4b3c89363ae5ef15bd577a74b54345457))
- **medusa:** Lint and missing transaction usage ([#1297](https://github.com/medusajs/medusa/issues/1297)) ([ab2d81f](https://github.com/medusajs/medusa/commit/ab2d81f7865a7d660459f27d81ea6aa79cbebda6))
- **medusa:** Remove unsupported Discount endpoints ([#1367](https://github.com/medusajs/medusa/issues/1367)) ([9acee27](https://github.com/medusajs/medusa/commit/9acee2799ead683575edd0f7172f336878569dfe))
- **medusa:** Remove updatePaymentMethod store cart route ([#1382](https://github.com/medusajs/medusa/issues/1382)) ([89a6de4](https://github.com/medusajs/medusa/commit/89a6de466020e35c6feab9ca9e06486ad76c2a53))
- add tax service registration ([#1225](https://github.com/medusajs/medusa/issues/1225)) ([491b6eb](https://github.com/medusajs/medusa/commit/491b6eba2d1388c498583c232d3506f7775c8968))
- adds date filters on store collection + region list api ([#1216](https://github.com/medusajs/medusa/issues/1216)) ([3cd4108](https://github.com/medusajs/medusa/commit/3cd4108915bca2889550c18c5c2fc95b8300d520))
- allow offset and limit in products free text search ([#1082](https://github.com/medusajs/medusa/issues/1082)) ([c2241d1](https://github.com/medusajs/medusa/commit/c2241d110178d9ed992793d582ef652c4a23b729))
- ensures no duplicate tax lines when completing cart ([#1262](https://github.com/medusajs/medusa/issues/1262)) ([607a382](https://github.com/medusajs/medusa/commit/607a382b4ee190c25eafa345674b55b74a7d6349))
- exists flag on /store/auth/:email endpoint ([#1122](https://github.com/medusajs/medusa/issues/1122)) ([e844f4a](https://github.com/medusajs/medusa/commit/e844f4a5b72317ea4990c6e83501e168aba0c257))
- export params type ([4ee2af2](https://github.com/medusajs/medusa/commit/4ee2af2582d6c6420e7faf238447b77499e5d32d))
- export request types from add and remove product endpoints ([#1078](https://github.com/medusajs/medusa/issues/1078)) ([449e666](https://github.com/medusajs/medusa/commit/449e6664283edc2bce42b97b9d52def1841a9a18))
- list customers query error ([#1226](https://github.com/medusajs/medusa/issues/1226)) ([932f4b2](https://github.com/medusajs/medusa/commit/932f4b29a8506125f88f814a36d6d622ce56ceaf))
- merge conflicts ([562a1b4](https://github.com/medusajs/medusa/commit/562a1b427a6aeb634fbc8b1a6d023c451ca2cd62))
- Remove `region_id` from countries on region deletes ([#1330](https://github.com/medusajs/medusa/issues/1330)) ([edc6d9d](https://github.com/medusajs/medusa/commit/edc6d9d29c61924a476a1e83742508a2b7dcda08))
- storefront product filtering ([#1189](https://github.com/medusajs/medusa/issues/1189)) ([e3655b5](https://github.com/medusajs/medusa/commit/e3655b53f7b220f6dc270b5cdd3052579a573ba5))
- unit test case for `CustomerGroupServiceMock.retrieve` ([def8763](https://github.com/medusajs/medusa/commit/def8763ee203c60728815ef3d36e57b5533b97c8))
- variant price update ([#1093](https://github.com/medusajs/medusa/issues/1093)) ([cb7b211](https://github.com/medusajs/medusa/commit/cb7b211c9bb3188ecf072fa1734055a4ddfe7f86))

### Features

- line item adjustment migration script ([#1255](https://github.com/medusajs/medusa/issues/1255)) ([b8f1ae9](https://github.com/medusajs/medusa/commit/b8f1ae9ff5ce08d96f7b84fdb03071d5135ac243))
- **medusa:** Improve config loading ([#1290](https://github.com/medusajs/medusa/issues/1290)) ([313cb06](https://github.com/medusajs/medusa/commit/313cb0658bd58316ff57c3419d936c071f703f9b))
- **medusa:** Improve exported medusa API ([#1335](https://github.com/medusajs/medusa/issues/1335)) ([6830a12](https://github.com/medusajs/medusa/commit/6830a12b46335e65df974f0c1b2ad3904b04280f))
- add `extend` param for customer groups ([ecd6ed8](https://github.com/medusajs/medusa/commit/ecd6ed820e77904fe59ff6fcc9195533968dd9f3))
- add and remove products to/from collection in bulk endpoints ([#1032](https://github.com/medusajs/medusa/issues/1032)) ([6629403](https://github.com/medusajs/medusa/commit/66294038f0ccf0b81bcf099b590379acffb647ba))
- Add BatchJob entity ([#1324](https://github.com/medusajs/medusa/issues/1324)) ([8c420f4](https://github.com/medusajs/medusa/commit/8c420f42854ebbef77c5009265cdb0d0f642c1f4))
- Add DiscountConditions ([#1230](https://github.com/medusajs/medusa/issues/1230)) ([a610805](https://github.com/medusajs/medusa/commit/a610805917ee930d4cebde74905e541a468aa83b)), closes [#1146](https://github.com/medusajs/medusa/issues/1146) [#1149](https://github.com/medusajs/medusa/issues/1149) [#1156](https://github.com/medusajs/medusa/issues/1156) [#1170](https://github.com/medusajs/medusa/issues/1170) [#1172](https://github.com/medusajs/medusa/issues/1172) [#1212](https://github.com/medusajs/medusa/issues/1212) [#1224](https://github.com/medusajs/medusa/issues/1224) [#1228](https://github.com/medusajs/medusa/issues/1228)
- customer group update ([#1098](https://github.com/medusajs/medusa/issues/1098)) ([694e2df](https://github.com/medusajs/medusa/commit/694e2df20f8c1b125c51f7d24b1e3abdc4b3cff6))
- customer groups client endpoints ([#1147](https://github.com/medusajs/medusa/issues/1147)) ([93426bf](https://github.com/medusajs/medusa/commit/93426bfc0263b3a19e6d47e19cc498fea441fb30))
- GET customer group endpoint ([21d99a4](https://github.com/medusajs/medusa/commit/21d99a44a9fb2bd0f52c8bc8b5c75d200ef6d539))
- Implement PriceList and extend MoneyAmount ([#1152](https://github.com/medusajs/medusa/issues/1152)) ([5300926](https://github.com/medusajs/medusa/commit/5300926db87b61ccd38541eea529c838e7f065ea))
- line item adjustments ([#1319](https://github.com/medusajs/medusa/issues/1319)) ([1cfeb5d](https://github.com/medusajs/medusa/commit/1cfeb5dbd8c1ac0cbcef388ba1455e08965316bc)), closes [#1241](https://github.com/medusajs/medusa/issues/1241) [#1279](https://github.com/medusajs/medusa/issues/1279) [#1242](https://github.com/medusajs/medusa/issues/1242) [#1243](https://github.com/medusajs/medusa/issues/1243)
- list customer groups ([#1099](https://github.com/medusajs/medusa/issues/1099)) ([a514d84](https://github.com/medusajs/medusa/commit/a514d84ccf49cbb71fd57c2e4a3c7d245c89cc4b))
- new tax api ([#979](https://github.com/medusajs/medusa/issues/979)) ([c56660f](https://github.com/medusajs/medusa/commit/c56660fca9921a3f3637bc137d9794781c5b090f)), closes [#885](https://github.com/medusajs/medusa/issues/885) [#896](https://github.com/medusajs/medusa/issues/896) [#911](https://github.com/medusajs/medusa/issues/911) [#945](https://github.com/medusajs/medusa/issues/945) [#950](https://github.com/medusajs/medusa/issues/950) [#951](https://github.com/medusajs/medusa/issues/951) [#954](https://github.com/medusajs/medusa/issues/954) [#969](https://github.com/medusajs/medusa/issues/969) [#998](https://github.com/medusajs/medusa/issues/998) [#1017](https://github.com/medusajs/medusa/issues/1017) [#1110](https://github.com/medusajs/medusa/issues/1110)
- price list products ([#1239](https://github.com/medusajs/medusa/issues/1239)) ([fb33dba](https://github.com/medusajs/medusa/commit/fb33dbaca3f7a66f1f82481cd68f59d733a66a95))
- update customer groups ([#1075](https://github.com/medusajs/medusa/issues/1075)) ([75fb2ce](https://github.com/medusajs/medusa/commit/75fb2ce9c3a206a9d43cdbd80a356d9ba4d28f3f))

## [1.2.1](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.64...@medusajs/medusa@1.2.1) (2022-02-28)

### Bug Fixes

- Add tax repo to withTransaction in region service ([#1126](https://github.com/medusajs/medusa/issues/1126)) ([549ad3b](https://github.com/medusajs/medusa/commit/549ad3b907b27dd985157c4cb58d07162b1b739d))
- allow offset and limit in products free text search ([#1082](https://github.com/medusajs/medusa/issues/1082)) ([a81def2](https://github.com/medusajs/medusa/commit/a81def2f75a9fea4a113d2d2e92037c7ae0e4de6))
- export params type ([9d6489d](https://github.com/medusajs/medusa/commit/9d6489d7e24015cac399d687f38121edbc812487))
- export request types from add and remove product endpoints ([#1078](https://github.com/medusajs/medusa/issues/1078)) ([1f2ee04](https://github.com/medusajs/medusa/commit/1f2ee04abe9769cca9421cb9a3c96dce2eaac4cb))
- unit test case for `CustomerGroupServiceMock.retrieve` ([aa8bbfd](https://github.com/medusajs/medusa/commit/aa8bbfdd58240fc5b56cb79c0b5c3b4a834d937a))
- variant price update ([#1093](https://github.com/medusajs/medusa/issues/1093)) ([59d5d8a](https://github.com/medusajs/medusa/commit/59d5d8a185ad7035bdca89cf527509af1672e1c0))

### Features

- add `extend` param for customer groups ([bf3e04f](https://github.com/medusajs/medusa/commit/bf3e04f41ac3df14c7ecdb7355d7e2e0ec7cd8c0))
- add and remove products to/from collection in bulk endpoints ([#1032](https://github.com/medusajs/medusa/issues/1032)) ([1e4cc2f](https://github.com/medusajs/medusa/commit/1e4cc2fc80372613f26880c3cce3c9c1c0d1f2c6))
- customer group update ([#1098](https://github.com/medusajs/medusa/issues/1098)) ([d80eaa1](https://github.com/medusajs/medusa/commit/d80eaa172d9db928a2fee60a33a10032045ed74d))
- GET customer group endpoint ([de06b47](https://github.com/medusajs/medusa/commit/de06b47b15443aa3ec95028124fd65694921083f))
- new tax api ([#979](https://github.com/medusajs/medusa/issues/979)) ([47588e7](https://github.com/medusajs/medusa/commit/47588e7a8d3b2ae2fed0c1e87fdf1ee2db6bcdc2)), closes [#885](https://github.com/medusajs/medusa/issues/885) [#896](https://github.com/medusajs/medusa/issues/896) [#911](https://github.com/medusajs/medusa/issues/911) [#945](https://github.com/medusajs/medusa/issues/945) [#950](https://github.com/medusajs/medusa/issues/950) [#951](https://github.com/medusajs/medusa/issues/951) [#954](https://github.com/medusajs/medusa/issues/954) [#969](https://github.com/medusajs/medusa/issues/969) [#998](https://github.com/medusajs/medusa/issues/998) [#1017](https://github.com/medusajs/medusa/issues/1017) [#1110](https://github.com/medusajs/medusa/issues/1110)
- update customer groups ([#1075](https://github.com/medusajs/medusa/issues/1075)) ([73359a6](https://github.com/medusajs/medusa/commit/73359a632b2d65369b0db62d9e21979e5e26bea8))

# [1.2.0](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.64...@medusajs/medusa@1.2.0) (2022-02-25)

### Bug Fixes

- allow offset and limit in products free text search ([#1082](https://github.com/medusajs/medusa/issues/1082)) ([c2241d1](https://github.com/medusajs/medusa/commit/c2241d110178d9ed992793d582ef652c4a23b729))
- export params type ([4ee2af2](https://github.com/medusajs/medusa/commit/4ee2af2582d6c6420e7faf238447b77499e5d32d))
- export request types from add and remove product endpoints ([#1078](https://github.com/medusajs/medusa/issues/1078)) ([449e666](https://github.com/medusajs/medusa/commit/449e6664283edc2bce42b97b9d52def1841a9a18))
- unit test case for `CustomerGroupServiceMock.retrieve` ([def8763](https://github.com/medusajs/medusa/commit/def8763ee203c60728815ef3d36e57b5533b97c8))
- variant price update ([#1093](https://github.com/medusajs/medusa/issues/1093)) ([cb7b211](https://github.com/medusajs/medusa/commit/cb7b211c9bb3188ecf072fa1734055a4ddfe7f86))

### Features

- add `extend` param for customer groups ([ecd6ed8](https://github.com/medusajs/medusa/commit/ecd6ed820e77904fe59ff6fcc9195533968dd9f3))
- add and remove products to/from collection in bulk endpoints ([#1032](https://github.com/medusajs/medusa/issues/1032)) ([6629403](https://github.com/medusajs/medusa/commit/66294038f0ccf0b81bcf099b590379acffb647ba))
- customer group update ([#1098](https://github.com/medusajs/medusa/issues/1098)) ([694e2df](https://github.com/medusajs/medusa/commit/694e2df20f8c1b125c51f7d24b1e3abdc4b3cff6))
- GET customer group endpoint ([21d99a4](https://github.com/medusajs/medusa/commit/21d99a44a9fb2bd0f52c8bc8b5c75d200ef6d539))
- new tax api ([#979](https://github.com/medusajs/medusa/issues/979)) ([c56660f](https://github.com/medusajs/medusa/commit/c56660fca9921a3f3637bc137d9794781c5b090f)), closes [#885](https://github.com/medusajs/medusa/issues/885) [#896](https://github.com/medusajs/medusa/issues/896) [#911](https://github.com/medusajs/medusa/issues/911) [#945](https://github.com/medusajs/medusa/issues/945) [#950](https://github.com/medusajs/medusa/issues/950) [#951](https://github.com/medusajs/medusa/issues/951) [#954](https://github.com/medusajs/medusa/issues/954) [#969](https://github.com/medusajs/medusa/issues/969) [#998](https://github.com/medusajs/medusa/issues/998) [#1017](https://github.com/medusajs/medusa/issues/1017) [#1110](https://github.com/medusajs/medusa/issues/1110)
- update customer groups ([#1075](https://github.com/medusajs/medusa/issues/1075)) ([75fb2ce](https://github.com/medusajs/medusa/commit/75fb2ce9c3a206a9d43cdbd80a356d9ba4d28f3f))

## [1.1.64](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.63...@medusajs/medusa@1.1.64) (2022-02-06)

### Bug Fixes

- release ([fc3fbc8](https://github.com/medusajs/medusa/commit/fc3fbc897fad5c8a5d3eea828ac7277fba9d70af))

## [1.1.63](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.62...@medusajs/medusa@1.1.63) (2022-02-06)

### Bug Fixes

- adds order by functionality to products ([#1021](https://github.com/medusajs/medusa/issues/1021)) ([3bf32e5](https://github.com/medusajs/medusa/commit/3bf32e5dc9ad3150762b9bb744b0453d3640e204))
- adds return reasons to swaps ([#1026](https://github.com/medusajs/medusa/issues/1026)) ([7d2b5b8](https://github.com/medusajs/medusa/commit/7d2b5b8babea1846503c5934c9d81ce4d3b2635d))
- admin collections default relations ([#1023](https://github.com/medusajs/medusa/issues/1023)) ([d2a7534](https://github.com/medusajs/medusa/commit/d2a7534615b8870b235be136c8e6425c51dee19b))
- Support array of payment status filters when listing orders ([#1013](https://github.com/medusajs/medusa/issues/1013)) ([fdc493d](https://github.com/medusajs/medusa/commit/fdc493df7fdcb6fda35894ec5a3cc7990dc8ea13))
- Updating store currencies ([#984](https://github.com/medusajs/medusa/issues/984)) ([59bb413](https://github.com/medusajs/medusa/commit/59bb413245d8aa31cc3070a372d6f0d04ebc9415))

### Features

- medusa-react admin hooks ([#978](https://github.com/medusajs/medusa/issues/978)) ([2e38484](https://github.com/medusajs/medusa/commit/2e384842d5b2e9742a86b96f28a8f00357795b86)), closes [#1019](https://github.com/medusajs/medusa/issues/1019)

## [1.1.62](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.61...@medusajs/medusa@1.1.62) (2022-01-11)

### Bug Fixes

- Adds default currency to store currencies on create ([#982](https://github.com/medusajs/medusa/issues/982)) ([a0a21d1](https://github.com/medusajs/medusa/commit/a0a21d15efeda56d4245aa6937f4d67c673e5ab3))
- api claim types + tests ([#967](https://github.com/medusajs/medusa/issues/967)) ([d365839](https://github.com/medusajs/medusa/commit/d365839a086ba116f320b49880d621452ee4b301))
- Type in AdminProductListTagsRes to use tags instead of types ([#958](https://github.com/medusajs/medusa/issues/958)) ([0ac52b7](https://github.com/medusajs/medusa/commit/0ac52b70fa23d9aa3ba6b5e220943ed15db4e643))

### Features

- expand store product filtering ([#973](https://github.com/medusajs/medusa/issues/973)) ([f61eaee](https://github.com/medusajs/medusa/commit/f61eaeec12529919b74b64a35f26b6b42f24fa7b))

## [1.1.61](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.60...@medusajs/medusa@1.1.61) (2021-12-29)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.60](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.59...@medusajs/medusa@1.1.60) (2021-12-17)

### Features

- Add Discount Admin endpoint to JS client ([#919](https://github.com/medusajs/medusa/issues/919)) ([2ca1a87](https://github.com/medusajs/medusa/commit/2ca1a8762da5bc30a246e2e77521071ed91e6c12))
- add medusa-react ([#913](https://github.com/medusajs/medusa/issues/913)) ([d0d8dd7](https://github.com/medusajs/medusa/commit/d0d8dd7bf62eaac71df8714c2dfb4f204d192f51))
- add returns admin endpoints to medusa-js ([#935](https://github.com/medusajs/medusa/issues/935)) ([b9d6f95](https://github.com/medusajs/medusa/commit/b9d6f95dbd32c096e59057797fd0cf479ff23c7b))
- add store admin endpoints to medusa-js ([#938](https://github.com/medusajs/medusa/issues/938)) ([31fad74](https://github.com/medusajs/medusa/commit/31fad7439cc4b95e269e7b6bc5d813cb2479329c))
- Adds Auth Admin API to `medusa-js` ([#917](https://github.com/medusajs/medusa/issues/917)) ([5c47184](https://github.com/medusajs/medusa/commit/5c47184b1035fc36440ff95750a4bb461904246d))
- Adds Customer Admin routes to JS client ([#918](https://github.com/medusajs/medusa/issues/918)) ([25fe224](https://github.com/medusajs/medusa/commit/25fe224a10842a7ac93ed496a6724ef113b41916))
- medusa js admin regions ([#939](https://github.com/medusajs/medusa/issues/939)) ([8532c96](https://github.com/medusajs/medusa/commit/8532c966b59082ac60d221bc3bb7f92d6f94e5e4))
- medusa js admin shipping options ([#934](https://github.com/medusajs/medusa/issues/934)) ([8b1b551](https://github.com/medusajs/medusa/commit/8b1b551260c8f3764135ed65bd099b8e9a0f23da))
- medusa-js admin return reasons ([#931](https://github.com/medusajs/medusa/issues/931)) ([0acc462](https://github.com/medusajs/medusa/commit/0acc462e1ebe51368ceedeea85d6f51c6fc3bfc4))

## [1.1.59](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.58...@medusajs/medusa@1.1.59) (2021-12-08)

### Bug Fixes

- complete cart return type ([#902](https://github.com/medusajs/medusa/issues/902)) ([2e837fc](https://github.com/medusajs/medusa/commit/2e837fcdeeb1f9608c5b0c612c75c87c042d8286))

## [1.1.58](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.57...@medusajs/medusa@1.1.58) (2021-12-08)

### Bug Fixes

- create cart with items ([#851](https://github.com/medusajs/medusa/issues/851)) ([74bc9c6](https://github.com/medusajs/medusa/commit/74bc9c618f66fbb0c741b19ee46ea9db47f2e3c5))
- ensures that delayed restock notifications are being sent ([#881](https://github.com/medusajs/medusa/issues/881)) ([329767e](https://github.com/medusajs/medusa/commit/329767e27980253d456030dd5aad648662d39e3d))
- medusa-js complete cart types + oas comments ([#889](https://github.com/medusajs/medusa/issues/889)) ([487356a](https://github.com/medusajs/medusa/commit/487356a96ffc3886cf233e89e0b17dc3b6a665e5))
- **medusa:** migrate cart service to typescript ([#884](https://github.com/medusajs/medusa/issues/884)) ([ed04132](https://github.com/medusajs/medusa/commit/ed041325332e47c5939a301dfd8ace8ad6dbc28d))
- **medusa:** order tax_rate type ([#879](https://github.com/medusajs/medusa/issues/879)) ([89472b7](https://github.com/medusajs/medusa/commit/89472b7d88f930a12a2ac7a972ab7e15a0232ee1))
- refresh payment session oas comment ([#888](https://github.com/medusajs/medusa/issues/888)) ([efadffe](https://github.com/medusajs/medusa/commit/efadffe37a0d61f844e3aa6991f60ebb6a883e95))
- return reasons type ([#893](https://github.com/medusajs/medusa/issues/893)) ([e8b6d21](https://github.com/medusajs/medusa/commit/e8b6d2139dd167b0a46c7221a91e0b5bda3a89c6))
- widen range of discount limit conditions ([#895](https://github.com/medusajs/medusa/issues/895)) ([7d6fc5c](https://github.com/medusajs/medusa/commit/7d6fc5c9e18a1533f2dbf54a588fd3a71f07dcc2))

### Features

- Admin shipping options routes to Typescript ([#891](https://github.com/medusajs/medusa/issues/891)) ([6579c13](https://github.com/medusajs/medusa/commit/6579c13111b4bf5edb87380fdd701eb25dfef65d))
- medusa-source-shopify loader ([#563](https://github.com/medusajs/medusa/issues/563)) ([577bcc2](https://github.com/medusajs/medusa/commit/577bcc23d44c87b91b2b685fd4ddfc5d21a0aa47))

## [1.1.57](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.56...@medusajs/medusa@1.1.57) (2021-11-23)

### Bug Fixes

- bumps class-transformer to 0.5.1 ([#837](https://github.com/medusajs/medusa/issues/837)) ([38b0e29](https://github.com/medusajs/medusa/commit/38b0e295b23eccd281288d854d5876ff418de91d))

## [1.1.56](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.55...@medusajs/medusa@1.1.56) (2021-11-22)

### Bug Fixes

- Addresses breaking change from library `class-transformer` ([#835](https://github.com/medusajs/medusa/issues/835)) ([f387b49](https://github.com/medusajs/medusa/commit/f387b4919fb115b9f904b9ecb9f3bf30a89174ac))

## [1.1.55](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.52...@medusajs/medusa@1.1.55) (2021-11-19)

### Bug Fixes

- /api/routes/store/auth pass linting ([#645](https://github.com/medusajs/medusa/issues/645)) ([40ad748](https://github.com/medusajs/medusa/commit/40ad748cc3c38bad97690b83c3b4b19c6d6365c3))
- /api/routes/store/customers pass linting ([#646](https://github.com/medusajs/medusa/issues/646)) ([7cc94dc](https://github.com/medusajs/medusa/commit/7cc94dc479ee26df2d5a031bfeb9eb3709d03776))
- add product count to storefront ([#719](https://github.com/medusajs/medusa/issues/719)) ([45b344f](https://github.com/medusajs/medusa/commit/45b344fbe1a570620c4e47cf959bdb605fffddef))
- adds options to default relations in storefront product endpoints ([#712](https://github.com/medusajs/medusa/issues/712)) ([e82737a](https://github.com/medusajs/medusa/commit/e82737a03545f69a833d8329f52daef39cfca46d))
- api/routes/store/products pass linting ([#644](https://github.com/medusajs/medusa/issues/644)) ([2966242](https://github.com/medusajs/medusa/commit/2966242bc812f9e75f0bb9cca5662b66836fc6d8))
- delete region causes cascade error ([#672](https://github.com/medusajs/medusa/issues/672)) ([0a65eca](https://github.com/medusajs/medusa/commit/0a65eca3de4f339178315e88b4220bd92ebe2736))
- lint in packages/medusa/src/services/swap.js pass linting ([#587](https://github.com/medusajs/medusa/issues/587)) ([3156a0d](https://github.com/medusajs/medusa/commit/3156a0de31749c1f32d5bdfe2cf8f1a8044bb42e))
- make /api/routes/admin/gift-cards,routes/store/gift-cards,/routes/store/orders pass linting ([#643](https://github.com/medusajs/medusa/issues/643)) ([60e9432](https://github.com/medusajs/medusa/commit/60e943260b804efe1dec3e139e47180322e5b52e))
- make /swaps pass eslint ([#665](https://github.com/medusajs/medusa/issues/665)) ([623d5f2](https://github.com/medusajs/medusa/commit/623d5f2b6d3881e2334fa48be80928ab9340a7ce))
- make api/routes/admin/apps pass eslint ([#641](https://github.com/medusajs/medusa/issues/641)) ([c9234c2](https://github.com/medusajs/medusa/commit/c9234c2343e19b32b335b93f4fa53e54398a5fe6))
- make api/routes/store/swaps pass eslint ([#678](https://github.com/medusajs/medusa/issues/678)) ([d9ee127](https://github.com/medusajs/medusa/commit/d9ee1272841ef047cceb6047fc34b8e42b5f580f))
- make discounts pass eslint ([3df2b42](https://github.com/medusajs/medusa/commit/3df2b4279f363e746f3514d8d8aa78b0e8fa3906))
- make it possible to update order shipping address ([#668](https://github.com/medusajs/medusa/issues/668)) ([e0fa06f](https://github.com/medusajs/medusa/commit/e0fa06fe964b8000ca539efa875ed6c322f6d57b))
- make packages/medusa/src/api/routes/admin/auth and 3 others pass eslint ([#666](https://github.com/medusajs/medusa/issues/666)) ([95f80f8](https://github.com/medusajs/medusa/commit/95f80f8a6635d1cba74d3c7ccbf794809af2d0bb))
- make packages/medusa/src/api/routes/admin/notes pass eslint ([#690](https://github.com/medusajs/medusa/issues/690)) ([f011662](https://github.com/medusajs/medusa/commit/f01166272db7dc2d1b783223a7ea5c9e662a028b))
- make packages/medusa/src/api/routes/admin/orders pass eslint ([#649](https://github.com/medusajs/medusa/issues/649)) ([dc88210](https://github.com/medusajs/medusa/commit/dc8821095c65e73569bdda1c4a24762f7eb746fe))
- make packages/medusa/src/api/routes/admin/return-reasons pass eslint ([#654](https://github.com/medusajs/medusa/issues/654)) ([a8fc89a](https://github.com/medusajs/medusa/commit/a8fc89af066836224e4f760115d13ba85f89a359))
- make packages/medusa/src/api/routes/admin/returns pass eslint ([#653](https://github.com/medusajs/medusa/issues/653)) ([2f7deea](https://github.com/medusajs/medusa/commit/2f7deea1d0309b5a78d66b0dd0d3c2204717c02b))
- make packages/medusa/src/api/routes/admin/shipping-options pass eslint ([#674](https://github.com/medusajs/medusa/issues/674)) ([bd86d3c](https://github.com/medusajs/medusa/commit/bd86d3c995b27bae5c8d97a21eb900b6dd112068))
- make packages/medusa/src/api/routes/admin/shipping-profiles pass eslint ([#642](https://github.com/medusajs/medusa/issues/642)) ([ce4d361](https://github.com/medusajs/medusa/commit/ce4d3616d733b5472ebfc00b49ab17c5aa53daef))
- make packages/medusa/src/api/routes/admin/store pass eslint ([#686](https://github.com/medusajs/medusa/issues/686)) ([7a230ec](https://github.com/medusajs/medusa/commit/7a230ec7e96cae6628f9b68a41dc6da89559dfe9))
- make packages/medusa/src/api/routes/admin/upload pass eslint ([#627](https://github.com/medusajs/medusa/issues/627)) ([5fbce42](https://github.com/medusajs/medusa/commit/5fbce429489cba79340ae738c54a533bdc627a28))
- make packages/medusa/src/api/routes/admin/users pass eslint ([a6a612c](https://github.com/medusajs/medusa/commit/a6a612c941924722c51e389359393436655cfc65))
- make packages/medusa/src/api/routes/store/carts pass eslint ([#652](https://github.com/medusajs/medusa/issues/652)) ([1ba63cc](https://github.com/medusajs/medusa/commit/1ba63cce08d03edd47b3e651d60a34cf58d5c1e3))
- make packages/medusa/src/api/routes/store/shipping-options pass linting ([#648](https://github.com/medusajs/medusa/issues/648)) ([5cb1b56](https://github.com/medusajs/medusa/commit/5cb1b5687ee80448dfecd0c8ba683ccdfc6900fc))
- make packages/medusa/src/services/cart.js pass eslint ([#700](https://github.com/medusajs/medusa/issues/700)) ([0caba0d](https://github.com/medusajs/medusa/commit/0caba0d49113210af4f6d507e273e8b451a5eaaf))
- Make packages/medusa/src/services/claim-item.js pass linting ([#626](https://github.com/medusajs/medusa/issues/626)) ([0d30369](https://github.com/medusajs/medusa/commit/0d3036978a8203f9fb6e64a2bc82a19ef697db05))
- Make packages/medusa/src/services/oauth.js pass linting ([#604](https://github.com/medusajs/medusa/issues/604)) ([14608b0](https://github.com/medusajs/medusa/commit/14608b0f682e858ee38e4b996693962a25116749))
- make packages/medusa/src/services/payment-provider.js pass eslint ([#549](https://github.com/medusajs/medusa/issues/549)) ([caf4357](https://github.com/medusajs/medusa/commit/caf4357c4d1a2199ab1399dfabd18876dd0642c7)), closes [#692](https://github.com/medusajs/medusa/issues/692)
- Make packages/medusa/src/services/product-variant.js pass linting ([#693](https://github.com/medusajs/medusa/issues/693)) ([a351398](https://github.com/medusajs/medusa/commit/a3513983790eaf78285d32f1797d1d11eb446e5e))
- make packages/medusa/src/services/shipping-profile.js pass eslint ([#582](https://github.com/medusajs/medusa/issues/582)) ([2c415ea](https://github.com/medusajs/medusa/commit/2c415ea520ed700a0a474111b83021a699fbc851))
- make packages/medusa/src/services/totals.js pass eslint ([23e83af](https://github.com/medusajs/medusa/commit/23e83aff1cd858401fba42668f641270128068e1))
- make variants pass eslint ([a1e446c](https://github.com/medusajs/medusa/commit/a1e446c1214a79a799da46b3d1bdd62c64b99ebf))
- make variants pass eslint ([#647](https://github.com/medusajs/medusa/issues/647)) ([f4307c7](https://github.com/medusajs/medusa/commit/f4307c702a6c1420d1e344adc8b5ed880d9f1f8d))
- **medusa:** add total count for list queries in product ([#710](https://github.com/medusajs/medusa/issues/710)) ([109d400](https://github.com/medusajs/medusa/commit/109d4007204964f0a89759f48a6e2d5afc0b1dd9))
- Prepare routes for linting ([#603](https://github.com/medusajs/medusa/issues/603)) ([3e68069](https://github.com/medusajs/medusa/commit/3e68069a8959a2bf75f8639389cdd35b6a8058e7))
- release ([5fa4848](https://github.com/medusajs/medusa/commit/5fa4848b17a9dd432c2361e5d9485950494a2bc6))
- updates documentation and fixes script blockers ([#765](https://github.com/medusajs/medusa/issues/765)) ([3ea6aea](https://github.com/medusajs/medusa/commit/3ea6aea5beb2a50d1a3345fa3833eadb32d0a346))

### Features

- admin api - allow customers to be created and updated with metadata ([#824](https://github.com/medusajs/medusa/issues/824)) ([2d9879e](https://github.com/medusajs/medusa/commit/2d9879ea090898c08ad86a0ebc44d5b8965b5166))
- Algolia plugin for medusa ([#718](https://github.com/medusajs/medusa/issues/718)) ([8ce9b20](https://github.com/medusajs/medusa/commit/8ce9b20222e1f4db75f730898549f0ed09eb1574))
- Allow retrieval of soft-deleted products ([#723](https://github.com/medusajs/medusa/issues/723)) ([1e50aee](https://github.com/medusajs/medusa/commit/1e50aee4feb55092560dd4a9c51a0671363e8576))
- **medusa:** adds collection endpoints to storefront ([#711](https://github.com/medusajs/medusa/issues/711)) ([5812756](https://github.com/medusajs/medusa/commit/58127564d7110c674fb14fdd97fbc080afba156d))
- Typescript for API layer ([#817](https://github.com/medusajs/medusa/issues/817)) ([373532e](https://github.com/medusajs/medusa/commit/373532ecbc8196f47e71af95a8cf82a14a4b1f9e))

## [1.1.54](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.52...@medusajs/medusa@1.1.54) (2021-11-19)

### Bug Fixes

- /api/routes/store/auth pass linting ([#645](https://github.com/medusajs/medusa/issues/645)) ([40ad748](https://github.com/medusajs/medusa/commit/40ad748cc3c38bad97690b83c3b4b19c6d6365c3))
- /api/routes/store/customers pass linting ([#646](https://github.com/medusajs/medusa/issues/646)) ([7cc94dc](https://github.com/medusajs/medusa/commit/7cc94dc479ee26df2d5a031bfeb9eb3709d03776))
- add product count to storefront ([#719](https://github.com/medusajs/medusa/issues/719)) ([45b344f](https://github.com/medusajs/medusa/commit/45b344fbe1a570620c4e47cf959bdb605fffddef))
- adds options to default relations in storefront product endpoints ([#712](https://github.com/medusajs/medusa/issues/712)) ([e82737a](https://github.com/medusajs/medusa/commit/e82737a03545f69a833d8329f52daef39cfca46d))
- api/routes/store/products pass linting ([#644](https://github.com/medusajs/medusa/issues/644)) ([2966242](https://github.com/medusajs/medusa/commit/2966242bc812f9e75f0bb9cca5662b66836fc6d8))
- delete region causes cascade error ([#672](https://github.com/medusajs/medusa/issues/672)) ([0a65eca](https://github.com/medusajs/medusa/commit/0a65eca3de4f339178315e88b4220bd92ebe2736))
- lint in packages/medusa/src/services/swap.js pass linting ([#587](https://github.com/medusajs/medusa/issues/587)) ([3156a0d](https://github.com/medusajs/medusa/commit/3156a0de31749c1f32d5bdfe2cf8f1a8044bb42e))
- make /api/routes/admin/gift-cards,routes/store/gift-cards,/routes/store/orders pass linting ([#643](https://github.com/medusajs/medusa/issues/643)) ([60e9432](https://github.com/medusajs/medusa/commit/60e943260b804efe1dec3e139e47180322e5b52e))
- make /swaps pass eslint ([#665](https://github.com/medusajs/medusa/issues/665)) ([623d5f2](https://github.com/medusajs/medusa/commit/623d5f2b6d3881e2334fa48be80928ab9340a7ce))
- make api/routes/admin/apps pass eslint ([#641](https://github.com/medusajs/medusa/issues/641)) ([c9234c2](https://github.com/medusajs/medusa/commit/c9234c2343e19b32b335b93f4fa53e54398a5fe6))
- make api/routes/store/swaps pass eslint ([#678](https://github.com/medusajs/medusa/issues/678)) ([d9ee127](https://github.com/medusajs/medusa/commit/d9ee1272841ef047cceb6047fc34b8e42b5f580f))
- make discounts pass eslint ([3df2b42](https://github.com/medusajs/medusa/commit/3df2b4279f363e746f3514d8d8aa78b0e8fa3906))
- make it possible to update order shipping address ([#668](https://github.com/medusajs/medusa/issues/668)) ([e0fa06f](https://github.com/medusajs/medusa/commit/e0fa06fe964b8000ca539efa875ed6c322f6d57b))
- make packages/medusa/src/api/routes/admin/auth and 3 others pass eslint ([#666](https://github.com/medusajs/medusa/issues/666)) ([95f80f8](https://github.com/medusajs/medusa/commit/95f80f8a6635d1cba74d3c7ccbf794809af2d0bb))
- make packages/medusa/src/api/routes/admin/notes pass eslint ([#690](https://github.com/medusajs/medusa/issues/690)) ([f011662](https://github.com/medusajs/medusa/commit/f01166272db7dc2d1b783223a7ea5c9e662a028b))
- make packages/medusa/src/api/routes/admin/orders pass eslint ([#649](https://github.com/medusajs/medusa/issues/649)) ([dc88210](https://github.com/medusajs/medusa/commit/dc8821095c65e73569bdda1c4a24762f7eb746fe))
- make packages/medusa/src/api/routes/admin/return-reasons pass eslint ([#654](https://github.com/medusajs/medusa/issues/654)) ([a8fc89a](https://github.com/medusajs/medusa/commit/a8fc89af066836224e4f760115d13ba85f89a359))
- make packages/medusa/src/api/routes/admin/returns pass eslint ([#653](https://github.com/medusajs/medusa/issues/653)) ([2f7deea](https://github.com/medusajs/medusa/commit/2f7deea1d0309b5a78d66b0dd0d3c2204717c02b))
- make packages/medusa/src/api/routes/admin/shipping-options pass eslint ([#674](https://github.com/medusajs/medusa/issues/674)) ([bd86d3c](https://github.com/medusajs/medusa/commit/bd86d3c995b27bae5c8d97a21eb900b6dd112068))
- make packages/medusa/src/api/routes/admin/shipping-profiles pass eslint ([#642](https://github.com/medusajs/medusa/issues/642)) ([ce4d361](https://github.com/medusajs/medusa/commit/ce4d3616d733b5472ebfc00b49ab17c5aa53daef))
- make packages/medusa/src/api/routes/admin/store pass eslint ([#686](https://github.com/medusajs/medusa/issues/686)) ([7a230ec](https://github.com/medusajs/medusa/commit/7a230ec7e96cae6628f9b68a41dc6da89559dfe9))
- make packages/medusa/src/api/routes/admin/upload pass eslint ([#627](https://github.com/medusajs/medusa/issues/627)) ([5fbce42](https://github.com/medusajs/medusa/commit/5fbce429489cba79340ae738c54a533bdc627a28))
- make packages/medusa/src/api/routes/admin/users pass eslint ([a6a612c](https://github.com/medusajs/medusa/commit/a6a612c941924722c51e389359393436655cfc65))
- make packages/medusa/src/api/routes/store/carts pass eslint ([#652](https://github.com/medusajs/medusa/issues/652)) ([1ba63cc](https://github.com/medusajs/medusa/commit/1ba63cce08d03edd47b3e651d60a34cf58d5c1e3))
- make packages/medusa/src/api/routes/store/shipping-options pass linting ([#648](https://github.com/medusajs/medusa/issues/648)) ([5cb1b56](https://github.com/medusajs/medusa/commit/5cb1b5687ee80448dfecd0c8ba683ccdfc6900fc))
- make packages/medusa/src/services/cart.js pass eslint ([#700](https://github.com/medusajs/medusa/issues/700)) ([0caba0d](https://github.com/medusajs/medusa/commit/0caba0d49113210af4f6d507e273e8b451a5eaaf))
- Make packages/medusa/src/services/claim-item.js pass linting ([#626](https://github.com/medusajs/medusa/issues/626)) ([0d30369](https://github.com/medusajs/medusa/commit/0d3036978a8203f9fb6e64a2bc82a19ef697db05))
- Make packages/medusa/src/services/oauth.js pass linting ([#604](https://github.com/medusajs/medusa/issues/604)) ([14608b0](https://github.com/medusajs/medusa/commit/14608b0f682e858ee38e4b996693962a25116749))
- make packages/medusa/src/services/payment-provider.js pass eslint ([#549](https://github.com/medusajs/medusa/issues/549)) ([caf4357](https://github.com/medusajs/medusa/commit/caf4357c4d1a2199ab1399dfabd18876dd0642c7)), closes [#692](https://github.com/medusajs/medusa/issues/692)
- Make packages/medusa/src/services/product-variant.js pass linting ([#693](https://github.com/medusajs/medusa/issues/693)) ([a351398](https://github.com/medusajs/medusa/commit/a3513983790eaf78285d32f1797d1d11eb446e5e))
- make packages/medusa/src/services/shipping-profile.js pass eslint ([#582](https://github.com/medusajs/medusa/issues/582)) ([2c415ea](https://github.com/medusajs/medusa/commit/2c415ea520ed700a0a474111b83021a699fbc851))
- make packages/medusa/src/services/totals.js pass eslint ([23e83af](https://github.com/medusajs/medusa/commit/23e83aff1cd858401fba42668f641270128068e1))
- make variants pass eslint ([a1e446c](https://github.com/medusajs/medusa/commit/a1e446c1214a79a799da46b3d1bdd62c64b99ebf))
- make variants pass eslint ([#647](https://github.com/medusajs/medusa/issues/647)) ([f4307c7](https://github.com/medusajs/medusa/commit/f4307c702a6c1420d1e344adc8b5ed880d9f1f8d))
- **medusa:** add total count for list queries in product ([#710](https://github.com/medusajs/medusa/issues/710)) ([109d400](https://github.com/medusajs/medusa/commit/109d4007204964f0a89759f48a6e2d5afc0b1dd9))
- Prepare routes for linting ([#603](https://github.com/medusajs/medusa/issues/603)) ([3e68069](https://github.com/medusajs/medusa/commit/3e68069a8959a2bf75f8639389cdd35b6a8058e7))
- updates documentation and fixes script blockers ([#765](https://github.com/medusajs/medusa/issues/765)) ([3ea6aea](https://github.com/medusajs/medusa/commit/3ea6aea5beb2a50d1a3345fa3833eadb32d0a346))

### Features

- admin api - allow customers to be created and updated with metadata ([#824](https://github.com/medusajs/medusa/issues/824)) ([2d9879e](https://github.com/medusajs/medusa/commit/2d9879ea090898c08ad86a0ebc44d5b8965b5166))
- Algolia plugin for medusa ([#718](https://github.com/medusajs/medusa/issues/718)) ([8ce9b20](https://github.com/medusajs/medusa/commit/8ce9b20222e1f4db75f730898549f0ed09eb1574))
- Allow retrieval of soft-deleted products ([#723](https://github.com/medusajs/medusa/issues/723)) ([1e50aee](https://github.com/medusajs/medusa/commit/1e50aee4feb55092560dd4a9c51a0671363e8576))
- **medusa:** adds collection endpoints to storefront ([#711](https://github.com/medusajs/medusa/issues/711)) ([5812756](https://github.com/medusajs/medusa/commit/58127564d7110c674fb14fdd97fbc080afba156d))
- Typescript for API layer ([#817](https://github.com/medusajs/medusa/issues/817)) ([373532e](https://github.com/medusajs/medusa/commit/373532ecbc8196f47e71af95a8cf82a14a4b1f9e))

## [1.1.53](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.52...@medusajs/medusa@1.1.53) (2021-11-19)

### Bug Fixes

- /api/routes/store/auth pass linting ([#645](https://github.com/medusajs/medusa/issues/645)) ([40ad748](https://github.com/medusajs/medusa/commit/40ad748cc3c38bad97690b83c3b4b19c6d6365c3))
- /api/routes/store/customers pass linting ([#646](https://github.com/medusajs/medusa/issues/646)) ([7cc94dc](https://github.com/medusajs/medusa/commit/7cc94dc479ee26df2d5a031bfeb9eb3709d03776))
- add product count to storefront ([#719](https://github.com/medusajs/medusa/issues/719)) ([45b344f](https://github.com/medusajs/medusa/commit/45b344fbe1a570620c4e47cf959bdb605fffddef))
- adds options to default relations in storefront product endpoints ([#712](https://github.com/medusajs/medusa/issues/712)) ([e82737a](https://github.com/medusajs/medusa/commit/e82737a03545f69a833d8329f52daef39cfca46d))
- api/routes/store/products pass linting ([#644](https://github.com/medusajs/medusa/issues/644)) ([2966242](https://github.com/medusajs/medusa/commit/2966242bc812f9e75f0bb9cca5662b66836fc6d8))
- delete region causes cascade error ([#672](https://github.com/medusajs/medusa/issues/672)) ([0a65eca](https://github.com/medusajs/medusa/commit/0a65eca3de4f339178315e88b4220bd92ebe2736))
- lint in packages/medusa/src/services/swap.js pass linting ([#587](https://github.com/medusajs/medusa/issues/587)) ([3156a0d](https://github.com/medusajs/medusa/commit/3156a0de31749c1f32d5bdfe2cf8f1a8044bb42e))
- make /api/routes/admin/gift-cards,routes/store/gift-cards,/routes/store/orders pass linting ([#643](https://github.com/medusajs/medusa/issues/643)) ([60e9432](https://github.com/medusajs/medusa/commit/60e943260b804efe1dec3e139e47180322e5b52e))
- make /swaps pass eslint ([#665](https://github.com/medusajs/medusa/issues/665)) ([623d5f2](https://github.com/medusajs/medusa/commit/623d5f2b6d3881e2334fa48be80928ab9340a7ce))
- make api/routes/admin/apps pass eslint ([#641](https://github.com/medusajs/medusa/issues/641)) ([c9234c2](https://github.com/medusajs/medusa/commit/c9234c2343e19b32b335b93f4fa53e54398a5fe6))
- make api/routes/store/swaps pass eslint ([#678](https://github.com/medusajs/medusa/issues/678)) ([d9ee127](https://github.com/medusajs/medusa/commit/d9ee1272841ef047cceb6047fc34b8e42b5f580f))
- make discounts pass eslint ([3df2b42](https://github.com/medusajs/medusa/commit/3df2b4279f363e746f3514d8d8aa78b0e8fa3906))
- make it possible to update order shipping address ([#668](https://github.com/medusajs/medusa/issues/668)) ([e0fa06f](https://github.com/medusajs/medusa/commit/e0fa06fe964b8000ca539efa875ed6c322f6d57b))
- make packages/medusa/src/api/routes/admin/auth and 3 others pass eslint ([#666](https://github.com/medusajs/medusa/issues/666)) ([95f80f8](https://github.com/medusajs/medusa/commit/95f80f8a6635d1cba74d3c7ccbf794809af2d0bb))
- make packages/medusa/src/api/routes/admin/notes pass eslint ([#690](https://github.com/medusajs/medusa/issues/690)) ([f011662](https://github.com/medusajs/medusa/commit/f01166272db7dc2d1b783223a7ea5c9e662a028b))
- make packages/medusa/src/api/routes/admin/orders pass eslint ([#649](https://github.com/medusajs/medusa/issues/649)) ([dc88210](https://github.com/medusajs/medusa/commit/dc8821095c65e73569bdda1c4a24762f7eb746fe))
- make packages/medusa/src/api/routes/admin/return-reasons pass eslint ([#654](https://github.com/medusajs/medusa/issues/654)) ([a8fc89a](https://github.com/medusajs/medusa/commit/a8fc89af066836224e4f760115d13ba85f89a359))
- make packages/medusa/src/api/routes/admin/returns pass eslint ([#653](https://github.com/medusajs/medusa/issues/653)) ([2f7deea](https://github.com/medusajs/medusa/commit/2f7deea1d0309b5a78d66b0dd0d3c2204717c02b))
- make packages/medusa/src/api/routes/admin/shipping-options pass eslint ([#674](https://github.com/medusajs/medusa/issues/674)) ([bd86d3c](https://github.com/medusajs/medusa/commit/bd86d3c995b27bae5c8d97a21eb900b6dd112068))
- make packages/medusa/src/api/routes/admin/shipping-profiles pass eslint ([#642](https://github.com/medusajs/medusa/issues/642)) ([ce4d361](https://github.com/medusajs/medusa/commit/ce4d3616d733b5472ebfc00b49ab17c5aa53daef))
- make packages/medusa/src/api/routes/admin/store pass eslint ([#686](https://github.com/medusajs/medusa/issues/686)) ([7a230ec](https://github.com/medusajs/medusa/commit/7a230ec7e96cae6628f9b68a41dc6da89559dfe9))
- make packages/medusa/src/api/routes/admin/upload pass eslint ([#627](https://github.com/medusajs/medusa/issues/627)) ([5fbce42](https://github.com/medusajs/medusa/commit/5fbce429489cba79340ae738c54a533bdc627a28))
- make packages/medusa/src/api/routes/admin/users pass eslint ([a6a612c](https://github.com/medusajs/medusa/commit/a6a612c941924722c51e389359393436655cfc65))
- make packages/medusa/src/api/routes/store/carts pass eslint ([#652](https://github.com/medusajs/medusa/issues/652)) ([1ba63cc](https://github.com/medusajs/medusa/commit/1ba63cce08d03edd47b3e651d60a34cf58d5c1e3))
- make packages/medusa/src/api/routes/store/shipping-options pass linting ([#648](https://github.com/medusajs/medusa/issues/648)) ([5cb1b56](https://github.com/medusajs/medusa/commit/5cb1b5687ee80448dfecd0c8ba683ccdfc6900fc))
- make packages/medusa/src/services/cart.js pass eslint ([#700](https://github.com/medusajs/medusa/issues/700)) ([0caba0d](https://github.com/medusajs/medusa/commit/0caba0d49113210af4f6d507e273e8b451a5eaaf))
- Make packages/medusa/src/services/claim-item.js pass linting ([#626](https://github.com/medusajs/medusa/issues/626)) ([0d30369](https://github.com/medusajs/medusa/commit/0d3036978a8203f9fb6e64a2bc82a19ef697db05))
- Make packages/medusa/src/services/oauth.js pass linting ([#604](https://github.com/medusajs/medusa/issues/604)) ([14608b0](https://github.com/medusajs/medusa/commit/14608b0f682e858ee38e4b996693962a25116749))
- make packages/medusa/src/services/payment-provider.js pass eslint ([#549](https://github.com/medusajs/medusa/issues/549)) ([caf4357](https://github.com/medusajs/medusa/commit/caf4357c4d1a2199ab1399dfabd18876dd0642c7)), closes [#692](https://github.com/medusajs/medusa/issues/692)
- Make packages/medusa/src/services/product-variant.js pass linting ([#693](https://github.com/medusajs/medusa/issues/693)) ([a351398](https://github.com/medusajs/medusa/commit/a3513983790eaf78285d32f1797d1d11eb446e5e))
- make packages/medusa/src/services/shipping-profile.js pass eslint ([#582](https://github.com/medusajs/medusa/issues/582)) ([2c415ea](https://github.com/medusajs/medusa/commit/2c415ea520ed700a0a474111b83021a699fbc851))
- make packages/medusa/src/services/totals.js pass eslint ([23e83af](https://github.com/medusajs/medusa/commit/23e83aff1cd858401fba42668f641270128068e1))
- make variants pass eslint ([a1e446c](https://github.com/medusajs/medusa/commit/a1e446c1214a79a799da46b3d1bdd62c64b99ebf))
- make variants pass eslint ([#647](https://github.com/medusajs/medusa/issues/647)) ([f4307c7](https://github.com/medusajs/medusa/commit/f4307c702a6c1420d1e344adc8b5ed880d9f1f8d))
- **medusa:** add total count for list queries in product ([#710](https://github.com/medusajs/medusa/issues/710)) ([109d400](https://github.com/medusajs/medusa/commit/109d4007204964f0a89759f48a6e2d5afc0b1dd9))
- Prepare routes for linting ([#603](https://github.com/medusajs/medusa/issues/603)) ([3e68069](https://github.com/medusajs/medusa/commit/3e68069a8959a2bf75f8639389cdd35b6a8058e7))
- updates documentation and fixes script blockers ([#765](https://github.com/medusajs/medusa/issues/765)) ([3ea6aea](https://github.com/medusajs/medusa/commit/3ea6aea5beb2a50d1a3345fa3833eadb32d0a346))

### Features

- admin api - allow customers to be created and updated with metadata ([#824](https://github.com/medusajs/medusa/issues/824)) ([2d9879e](https://github.com/medusajs/medusa/commit/2d9879ea090898c08ad86a0ebc44d5b8965b5166))
- Algolia plugin for medusa ([#718](https://github.com/medusajs/medusa/issues/718)) ([8ce9b20](https://github.com/medusajs/medusa/commit/8ce9b20222e1f4db75f730898549f0ed09eb1574))
- Allow retrieval of soft-deleted products ([#723](https://github.com/medusajs/medusa/issues/723)) ([1e50aee](https://github.com/medusajs/medusa/commit/1e50aee4feb55092560dd4a9c51a0671363e8576))
- **medusa:** adds collection endpoints to storefront ([#711](https://github.com/medusajs/medusa/issues/711)) ([5812756](https://github.com/medusajs/medusa/commit/58127564d7110c674fb14fdd97fbc080afba156d))
- Typescript for API layer ([#817](https://github.com/medusajs/medusa/issues/817)) ([373532e](https://github.com/medusajs/medusa/commit/373532ecbc8196f47e71af95a8cf82a14a4b1f9e))

## [1.1.52](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.51...@medusajs/medusa@1.1.52) (2021-11-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.51](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.50...@medusajs/medusa@1.1.51) (2021-11-03)

### Bug Fixes

- include discount rule in swap retrieval ([#682](https://github.com/medusajs/medusa/issues/682)) ([a5fe1c2](https://github.com/medusajs/medusa/commit/a5fe1c2e284ff5cb757b792c1a3c8414c211e4e8))

## [1.1.50](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.49...@medusajs/medusa@1.1.50) (2021-11-02)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.49](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.48...@medusajs/medusa@1.1.49) (2021-10-26)

### Bug Fixes

- allow empty string to search product route ([52c47ab](https://github.com/medusajs/medusa/commit/52c47abd407704d02caf7a6bfb3c4777717828b7))

## [1.1.48](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.47...@medusajs/medusa@1.1.48) (2021-10-25)

### Bug Fixes

- make contentful data sync ([548f6c7](https://github.com/medusajs/medusa/commit/548f6c7138d9a08b6c2113ebdda27f13dee848ac))

## [1.1.47](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.46...@medusajs/medusa@1.1.47) (2021-10-23)

### Bug Fixes

- pull missing fields ([b82b43b](https://github.com/medusajs/medusa/commit/b82b43b4c64dc5bc705a439a214f9d1dc9976e21))

## [1.1.46](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.45...@medusajs/medusa@1.1.46) (2021-10-19)

### Bug Fixes

- add integration test ([38813ec](https://github.com/medusajs/medusa/commit/38813ec66f23526054f7e35adf4157ce98703167))
- allow changing regions safely ([06f5fe2](https://github.com/medusajs/medusa/commit/06f5fe267013d95231d96318fe8a055ad8040174))
- cleanup ([5441d47](https://github.com/medusajs/medusa/commit/5441d47f88d759742e3d3d29b29bc38feceac583))
- prettier ([5a67d1e](https://github.com/medusajs/medusa/commit/5a67d1e7fd3d9da9dca0781d0feab60db1f1099a))

## [1.1.45](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.44...@medusajs/medusa@1.1.45) (2021-10-18)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.44](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.43...@medusajs/medusa@1.1.44) (2021-10-18)

### Bug Fixes

- undefined references ([5afd0df](https://github.com/medusajs/medusa/commit/5afd0dfbabaebfb6b09f0e2f055386ac76059372))

## [1.1.43](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.41...@medusajs/medusa@1.1.43) (2021-10-18)

### Bug Fixes

- add possiblity to unset billing address ([dc7ecc9](https://github.com/medusajs/medusa/commit/dc7ecc959ae6792351a733fa9f24c95bb6e9e893))
- adjustments based on feedback ([52be911](https://github.com/medusajs/medusa/commit/52be911e506dfb80c2f39aac31d33a8805e4b6d2))
- adjustments based on seb's feedback ([dba1d5b](https://github.com/medusajs/medusa/commit/dba1d5bb69f02e822f883cc3081fc3c2e4e26dff))
- allow custom shipping options to bypass option requirements ([75e59ec](https://github.com/medusajs/medusa/commit/75e59ec6d540e19708929e8a76e97fdb1feef813))
- autofix ([d9608e1](https://github.com/medusajs/medusa/commit/d9608e15e815898aa58cdf253fd46c3834ce3bda))
- Creating shipping options with requirements ([#428](https://github.com/medusajs/medusa/issues/428)) ([ae0ab03](https://github.com/medusajs/medusa/commit/ae0ab03fac2747ec251abbb6161182dd21218ba6))
- customer endpoints shouldn't use customer id already provided through authentication ([#402](https://github.com/medusajs/medusa/issues/402)) ([bf43896](https://github.com/medusajs/medusa/commit/bf43896d1942d352efcf8b900f4a31fef0fe215d))
- example ([43a2b07](https://github.com/medusajs/medusa/commit/43a2b07866aab722ddb8dc24fe33d4afb7df1d1c))
- failing integration tests ([9c72acd](https://github.com/medusajs/medusa/commit/9c72acda408fea994da3828163f9e6d436846721))
- ILIKE operator not supported in sqlite ([#393](https://github.com/medusajs/medusa/issues/393)) ([49a1329](https://github.com/medusajs/medusa/commit/49a132976ded4d094a5129029743f73a020ecf04))
- include shipping profile and requirement relations when fetching custom shipping options ([569595d](https://github.com/medusajs/medusa/commit/569595d0bbe9cd19fcd94c0229dce3244c685b1e))
- jsdoc ([02ce006](https://github.com/medusajs/medusa/commit/02ce006440e3f366bedcb4e4cc7a195dc5a0fccc))
- jsdoc custom shipping option service ([f7c7659](https://github.com/medusajs/medusa/commit/f7c765945b65c55489be0372533fc556869b0d58))
- make /packages/medusa/src/services/gift-card.js pass eslint ([#533](https://github.com/medusajs/medusa/issues/533)) ([06ee5df](https://github.com/medusajs/medusa/commit/06ee5df9a0d56d52ca89611905c202281e26dc73))
- make /packages/medusa/src/services/line-item.js pass eslint ([#555](https://github.com/medusajs/medusa/issues/555)) ([f2d97df](https://github.com/medusajs/medusa/commit/f2d97dfb862ade395291e27c87f438758655ee0b))
- make medusa/src/services/fulfillment.js pass eslint ([#557](https://github.com/medusajs/medusa/issues/557)) ([fe599c7](https://github.com/medusajs/medusa/commit/fe599c709e1f7e0109ae69bd1d0efb396f959e6a))
- make packages/medusa/src/services/claim.js pass eslint ([#551](https://github.com/medusajs/medusa/issues/551)) ([ddeaf57](https://github.com/medusajs/medusa/commit/ddeaf57f598b5bde8d048fdf63199ba8789348e0))
- make packages/medusa/src/services/discount.js pass eslint ([#553](https://github.com/medusajs/medusa/issues/553)) ([1e13c83](https://github.com/medusajs/medusa/commit/1e13c831ab955d4221a887e921ee9d38b0b27225))
- make packages/medusa/src/services/draft-order.js pass eslint ([#554](https://github.com/medusajs/medusa/issues/554)) ([1791acb](https://github.com/medusajs/medusa/commit/1791acb0447d3e200d4ec3465e4d633ab4497c35))
- make packages/medusa/src/services/idempotency-key.js pass linting ([#568](https://github.com/medusajs/medusa/issues/568)) ([5b3c0c4](https://github.com/medusajs/medusa/commit/5b3c0c4471002064c3432d7d96c74b3b202ae5ad))
- make packages/medusa/src/services/note.js pass eslint ([#565](https://github.com/medusajs/medusa/issues/565)) ([275a0f1](https://github.com/medusajs/medusa/commit/275a0f1d573fd43cc419233b82bd9b7e697851f5))
- make packages/medusa/src/services/notification.js pass eslint ([#566](https://github.com/medusajs/medusa/issues/566)) ([38559b5](https://github.com/medusajs/medusa/commit/38559b5454935b404aad68f90d225df4bfb6ef33))
- make packages/medusa/src/services/region.js pass eslint ([#542](https://github.com/medusajs/medusa/issues/542)) ([f926e02](https://github.com/medusajs/medusa/commit/f926e0245c8372b050c5b48a90ef1671ee9525f5))
- Make packages/medusa/src/services/transaction.js pass linting ([#534](https://github.com/medusajs/medusa/issues/534)) ([10f1d9d](https://github.com/medusajs/medusa/commit/10f1d9df5c184ff723c71dbc618bc574e94228d9))
- make return-reason.js pass eslint ([#539](https://github.com/medusajs/medusa/issues/539)) ([b6efa6f](https://github.com/medusajs/medusa/commit/b6efa6f4712cce08a650244cb0b15afac0e2cbc0))
- make system-payment-provider.js pass eslint ([#574](https://github.com/medusajs/medusa/issues/574)) ([8e59ec8](https://github.com/medusajs/medusa/commit/8e59ec81e4280db432ea0290b0b92f098789e5ef))
- **medusa:** hide password hash ([#429](https://github.com/medusajs/medusa/issues/429)) ([cd4afd1](https://github.com/medusajs/medusa/commit/cd4afd15768627b3bf7579e7e4c67ed0698ea681))
- meiliesearch README.md + remove: searchService from silentResolver ([1444353](https://github.com/medusajs/medusa/commit/1444353b0af4e18a23cebbf46b6d1246aa495bb4))
- merge conflicts ([153366c](https://github.com/medusajs/medusa/commit/153366cbd30feac3dd99a2d718b2e5b0b1b19dcc))
- merge conflicts ([632ad17](https://github.com/medusajs/medusa/commit/632ad17e3fdf6fe1f0f336da134acee9668688e5))
- merge develop ([2297a84](https://github.com/medusajs/medusa/commit/2297a84cb90d960e4f8d1210f3b419e16bb15438))
- more adjustments ([3d088c3](https://github.com/medusajs/medusa/commit/3d088c351b4c430832dc22750c01220310577279))
- move subscriber to core ([700f8c3](https://github.com/medusajs/medusa/commit/700f8c39190469337c74d9bf3f046f293024e521))
- options relations on GET variant ([#532](https://github.com/medusajs/medusa/issues/532)) ([fc50aac](https://github.com/medusajs/medusa/commit/fc50aacde2e59fd3cc939dcdaa2630d788b4eca2))
- product ordering ([57a6612](https://github.com/medusajs/medusa/commit/57a6612e845c078aec023d0cc49d6bfc175a1b37))
- remove custom shipping options from swapService create method call ([71d433c](https://github.com/medusajs/medusa/commit/71d433c33583830fb7a3724154aa9918592888bd))
- remove verbose mode in integration test + fix jsdoc ([36aeb4f](https://github.com/medusajs/medusa/commit/36aeb4fffa662930db0172a8397ff3b928b0d5ec))
- shipping option updates ([#426](https://github.com/medusajs/medusa/issues/426)) ([22f3f2a](https://github.com/medusajs/medusa/commit/22f3f2af93fcebef5ebf89ce66cd926393ae5d25))
- tests ([db83448](https://github.com/medusajs/medusa/commit/db83448d188b092745c3df6f38e87d89836942cc))
- Throw on cart creation when no region exist ([#455](https://github.com/medusajs/medusa/issues/455)) ([17b192f](https://github.com/medusajs/medusa/commit/17b192fe37c14d978ae78a9537f552cf055bf5e2))
- update event ([6d21d0d](https://github.com/medusajs/medusa/commit/6d21d0d39835b15ac132c14b742ec21ffca307d0))
- update product images ([#494](https://github.com/medusajs/medusa/issues/494)) ([c0e947f](https://github.com/medusajs/medusa/commit/c0e947f47a009dcdf189bd4564485385b3019045))
- update seeder to product published ([#423](https://github.com/medusajs/medusa/issues/423)) ([d8e5318](https://github.com/medusajs/medusa/commit/d8e531890d758e374fdd586f8b718d9b09126320))
- use type to choose transformer before adding or replacing documents ([24eecd2](https://github.com/medusajs/medusa/commit/24eecd2922e0c3425f2d43549b3227c756820387))

### Features

- add product status ([#400](https://github.com/medusajs/medusa/issues/400)) ([a82332d](https://github.com/medusajs/medusa/commit/a82332da3e2c8940da814b27607182c2c888b49f))
- Allow backorder on swaps ([#404](https://github.com/medusajs/medusa/issues/404)) ([00ab03f](https://github.com/medusajs/medusa/commit/00ab03f3a2b0c59049f5c5a2af2cb5eee9d4c72d))
- allow product selection on discounts allocated to a specific item ([#395](https://github.com/medusajs/medusa/issues/395)) ([84d4d79](https://github.com/medusajs/medusa/commit/84d4d791eaf9508367a20d9f930ca959a7b707dd))
- customer-information ([#413](https://github.com/medusajs/medusa/issues/413)) ([a70e3ed](https://github.com/medusajs/medusa/commit/a70e3ed0aee0e9c19f7aaf8bb8d22eb68a9695b7))
- Product filtering ([#439](https://github.com/medusajs/medusa/issues/439)) ([5ef2a3f](https://github.com/medusajs/medusa/commit/5ef2a3fbcb108c8d49b7754ea14ac890af643950))
- rma shipping option + unit tests ([77ee0bf](https://github.com/medusajs/medusa/commit/77ee0bf1860c9ba3336c6f870d248d887d2f5fb3))

### Reverts

- Revert "fixed linting errors on packages/medusa/src/services/user.js #531 (#543)" (#547) ([ba2d923](https://github.com/medusajs/medusa/commit/ba2d92341d7fa5cdd334fd9161f86da0c986b524)), closes [#531](https://github.com/medusajs/medusa/issues/531) [#543](https://github.com/medusajs/medusa/issues/543) [#547](https://github.com/medusajs/medusa/issues/547)

## [1.1.42](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.41...@medusajs/medusa@1.1.42) (2021-10-18)

### Bug Fixes

- add possiblity to unset billing address ([dc7ecc9](https://github.com/medusajs/medusa/commit/dc7ecc959ae6792351a733fa9f24c95bb6e9e893))
- adjustments based on feedback ([52be911](https://github.com/medusajs/medusa/commit/52be911e506dfb80c2f39aac31d33a8805e4b6d2))
- adjustments based on seb's feedback ([dba1d5b](https://github.com/medusajs/medusa/commit/dba1d5bb69f02e822f883cc3081fc3c2e4e26dff))
- allow custom shipping options to bypass option requirements ([75e59ec](https://github.com/medusajs/medusa/commit/75e59ec6d540e19708929e8a76e97fdb1feef813))
- autofix ([d9608e1](https://github.com/medusajs/medusa/commit/d9608e15e815898aa58cdf253fd46c3834ce3bda))
- Creating shipping options with requirements ([#428](https://github.com/medusajs/medusa/issues/428)) ([ae0ab03](https://github.com/medusajs/medusa/commit/ae0ab03fac2747ec251abbb6161182dd21218ba6))
- customer endpoints shouldn't use customer id already provided through authentication ([#402](https://github.com/medusajs/medusa/issues/402)) ([bf43896](https://github.com/medusajs/medusa/commit/bf43896d1942d352efcf8b900f4a31fef0fe215d))
- example ([43a2b07](https://github.com/medusajs/medusa/commit/43a2b07866aab722ddb8dc24fe33d4afb7df1d1c))
- failing integration tests ([9c72acd](https://github.com/medusajs/medusa/commit/9c72acda408fea994da3828163f9e6d436846721))
- ILIKE operator not supported in sqlite ([#393](https://github.com/medusajs/medusa/issues/393)) ([49a1329](https://github.com/medusajs/medusa/commit/49a132976ded4d094a5129029743f73a020ecf04))
- include shipping profile and requirement relations when fetching custom shipping options ([569595d](https://github.com/medusajs/medusa/commit/569595d0bbe9cd19fcd94c0229dce3244c685b1e))
- jsdoc ([02ce006](https://github.com/medusajs/medusa/commit/02ce006440e3f366bedcb4e4cc7a195dc5a0fccc))
- jsdoc custom shipping option service ([f7c7659](https://github.com/medusajs/medusa/commit/f7c765945b65c55489be0372533fc556869b0d58))
- make /packages/medusa/src/services/gift-card.js pass eslint ([#533](https://github.com/medusajs/medusa/issues/533)) ([06ee5df](https://github.com/medusajs/medusa/commit/06ee5df9a0d56d52ca89611905c202281e26dc73))
- make /packages/medusa/src/services/line-item.js pass eslint ([#555](https://github.com/medusajs/medusa/issues/555)) ([f2d97df](https://github.com/medusajs/medusa/commit/f2d97dfb862ade395291e27c87f438758655ee0b))
- make medusa/src/services/fulfillment.js pass eslint ([#557](https://github.com/medusajs/medusa/issues/557)) ([fe599c7](https://github.com/medusajs/medusa/commit/fe599c709e1f7e0109ae69bd1d0efb396f959e6a))
- make packages/medusa/src/services/claim.js pass eslint ([#551](https://github.com/medusajs/medusa/issues/551)) ([ddeaf57](https://github.com/medusajs/medusa/commit/ddeaf57f598b5bde8d048fdf63199ba8789348e0))
- make packages/medusa/src/services/discount.js pass eslint ([#553](https://github.com/medusajs/medusa/issues/553)) ([1e13c83](https://github.com/medusajs/medusa/commit/1e13c831ab955d4221a887e921ee9d38b0b27225))
- make packages/medusa/src/services/draft-order.js pass eslint ([#554](https://github.com/medusajs/medusa/issues/554)) ([1791acb](https://github.com/medusajs/medusa/commit/1791acb0447d3e200d4ec3465e4d633ab4497c35))
- make packages/medusa/src/services/idempotency-key.js pass linting ([#568](https://github.com/medusajs/medusa/issues/568)) ([5b3c0c4](https://github.com/medusajs/medusa/commit/5b3c0c4471002064c3432d7d96c74b3b202ae5ad))
- make packages/medusa/src/services/note.js pass eslint ([#565](https://github.com/medusajs/medusa/issues/565)) ([275a0f1](https://github.com/medusajs/medusa/commit/275a0f1d573fd43cc419233b82bd9b7e697851f5))
- make packages/medusa/src/services/notification.js pass eslint ([#566](https://github.com/medusajs/medusa/issues/566)) ([38559b5](https://github.com/medusajs/medusa/commit/38559b5454935b404aad68f90d225df4bfb6ef33))
- make packages/medusa/src/services/region.js pass eslint ([#542](https://github.com/medusajs/medusa/issues/542)) ([f926e02](https://github.com/medusajs/medusa/commit/f926e0245c8372b050c5b48a90ef1671ee9525f5))
- Make packages/medusa/src/services/transaction.js pass linting ([#534](https://github.com/medusajs/medusa/issues/534)) ([10f1d9d](https://github.com/medusajs/medusa/commit/10f1d9df5c184ff723c71dbc618bc574e94228d9))
- make return-reason.js pass eslint ([#539](https://github.com/medusajs/medusa/issues/539)) ([b6efa6f](https://github.com/medusajs/medusa/commit/b6efa6f4712cce08a650244cb0b15afac0e2cbc0))
- make system-payment-provider.js pass eslint ([#574](https://github.com/medusajs/medusa/issues/574)) ([8e59ec8](https://github.com/medusajs/medusa/commit/8e59ec81e4280db432ea0290b0b92f098789e5ef))
- **medusa:** hide password hash ([#429](https://github.com/medusajs/medusa/issues/429)) ([cd4afd1](https://github.com/medusajs/medusa/commit/cd4afd15768627b3bf7579e7e4c67ed0698ea681))
- meiliesearch README.md + remove: searchService from silentResolver ([1444353](https://github.com/medusajs/medusa/commit/1444353b0af4e18a23cebbf46b6d1246aa495bb4))
- merge conflicts ([153366c](https://github.com/medusajs/medusa/commit/153366cbd30feac3dd99a2d718b2e5b0b1b19dcc))
- merge conflicts ([632ad17](https://github.com/medusajs/medusa/commit/632ad17e3fdf6fe1f0f336da134acee9668688e5))
- merge develop ([2297a84](https://github.com/medusajs/medusa/commit/2297a84cb90d960e4f8d1210f3b419e16bb15438))
- more adjustments ([3d088c3](https://github.com/medusajs/medusa/commit/3d088c351b4c430832dc22750c01220310577279))
- move subscriber to core ([700f8c3](https://github.com/medusajs/medusa/commit/700f8c39190469337c74d9bf3f046f293024e521))
- options relations on GET variant ([#532](https://github.com/medusajs/medusa/issues/532)) ([fc50aac](https://github.com/medusajs/medusa/commit/fc50aacde2e59fd3cc939dcdaa2630d788b4eca2))
- product ordering ([57a6612](https://github.com/medusajs/medusa/commit/57a6612e845c078aec023d0cc49d6bfc175a1b37))
- remove custom shipping options from swapService create method call ([71d433c](https://github.com/medusajs/medusa/commit/71d433c33583830fb7a3724154aa9918592888bd))
- remove verbose mode in integration test + fix jsdoc ([36aeb4f](https://github.com/medusajs/medusa/commit/36aeb4fffa662930db0172a8397ff3b928b0d5ec))
- shipping option updates ([#426](https://github.com/medusajs/medusa/issues/426)) ([22f3f2a](https://github.com/medusajs/medusa/commit/22f3f2af93fcebef5ebf89ce66cd926393ae5d25))
- tests ([db83448](https://github.com/medusajs/medusa/commit/db83448d188b092745c3df6f38e87d89836942cc))
- Throw on cart creation when no region exist ([#455](https://github.com/medusajs/medusa/issues/455)) ([17b192f](https://github.com/medusajs/medusa/commit/17b192fe37c14d978ae78a9537f552cf055bf5e2))
- update event ([6d21d0d](https://github.com/medusajs/medusa/commit/6d21d0d39835b15ac132c14b742ec21ffca307d0))
- update product images ([#494](https://github.com/medusajs/medusa/issues/494)) ([c0e947f](https://github.com/medusajs/medusa/commit/c0e947f47a009dcdf189bd4564485385b3019045))
- update seeder to product published ([#423](https://github.com/medusajs/medusa/issues/423)) ([d8e5318](https://github.com/medusajs/medusa/commit/d8e531890d758e374fdd586f8b718d9b09126320))
- use type to choose transformer before adding or replacing documents ([24eecd2](https://github.com/medusajs/medusa/commit/24eecd2922e0c3425f2d43549b3227c756820387))

### Features

- add product status ([#400](https://github.com/medusajs/medusa/issues/400)) ([a82332d](https://github.com/medusajs/medusa/commit/a82332da3e2c8940da814b27607182c2c888b49f))
- Allow backorder on swaps ([#404](https://github.com/medusajs/medusa/issues/404)) ([00ab03f](https://github.com/medusajs/medusa/commit/00ab03f3a2b0c59049f5c5a2af2cb5eee9d4c72d))
- allow product selection on discounts allocated to a specific item ([#395](https://github.com/medusajs/medusa/issues/395)) ([84d4d79](https://github.com/medusajs/medusa/commit/84d4d791eaf9508367a20d9f930ca959a7b707dd))
- customer-information ([#413](https://github.com/medusajs/medusa/issues/413)) ([a70e3ed](https://github.com/medusajs/medusa/commit/a70e3ed0aee0e9c19f7aaf8bb8d22eb68a9695b7))
- Product filtering ([#439](https://github.com/medusajs/medusa/issues/439)) ([5ef2a3f](https://github.com/medusajs/medusa/commit/5ef2a3fbcb108c8d49b7754ea14ac890af643950))
- rma shipping option + unit tests ([77ee0bf](https://github.com/medusajs/medusa/commit/77ee0bf1860c9ba3336c6f870d248d887d2f5fb3))

### Reverts

- Revert "fixed linting errors on packages/medusa/src/services/user.js #531 (#543)" (#547) ([ba2d923](https://github.com/medusajs/medusa/commit/ba2d92341d7fa5cdd334fd9161f86da0c986b524)), closes [#531](https://github.com/medusajs/medusa/issues/531) [#543](https://github.com/medusajs/medusa/issues/543) [#547](https://github.com/medusajs/medusa/issues/547)

## [1.1.41](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.40...@medusajs/medusa@1.1.41) (2021-09-15)

### Bug Fixes

- 404 product ([8c8c589](https://github.com/medusajs/medusa/commit/8c8c589b0fa720225a02005f9880ad7d1fbf5042))
- add default relations to variants to include prices ([#394](https://github.com/medusajs/medusa/issues/394)) ([d477ca9](https://github.com/medusajs/medusa/commit/d477ca9842eb58cc561e9e0fa9d01e2d0d2f6756))
- Ensure uniqueness for products, variants, collections and discounts ([#382](https://github.com/medusajs/medusa/issues/382)) ([2715095](https://github.com/medusajs/medusa/commit/27150959ffa70819cf3c4ad176288a1c70287942))
- make shipping_option_id on requirements optional ([#340](https://github.com/medusajs/medusa/issues/340)) ([16b0fa3](https://github.com/medusajs/medusa/commit/16b0fa377a577abd7976c2beaff83e2030969df8))

### Features

- update and cancel swaps, claims, and returns ([#310](https://github.com/medusajs/medusa/issues/310)) ([cf66f97](https://github.com/medusajs/medusa/commit/cf66f97758003a41737602d4b1b1051b266d4f81))

## [1.1.40](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.40...@medusajs/medusa@1.1.40) (2021-09-15)

### Bug Fixes

- 404 product ([8c8c589](https://github.com/medusajs/medusa/commit/8c8c589b0fa720225a02005f9880ad7d1fbf5042))
- add default relations to variants to include prices ([#394](https://github.com/medusajs/medusa/issues/394)) ([d477ca9](https://github.com/medusajs/medusa/commit/d477ca9842eb58cc561e9e0fa9d01e2d0d2f6756))
- Ensure uniqueness for products, variants, collections and discounts ([#382](https://github.com/medusajs/medusa/issues/382)) ([2715095](https://github.com/medusajs/medusa/commit/27150959ffa70819cf3c4ad176288a1c70287942))
- make shipping_option_id on requirements optional ([#340](https://github.com/medusajs/medusa/issues/340)) ([16b0fa3](https://github.com/medusajs/medusa/commit/16b0fa377a577abd7976c2beaff83e2030969df8))

### Features

- update and cancel swaps, claims, and returns ([#310](https://github.com/medusajs/medusa/issues/310)) ([cf66f97](https://github.com/medusajs/medusa/commit/cf66f97758003a41737602d4b1b1051b266d4f81))

## [1.1.39](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.40...@medusajs/medusa@1.1.39) (2021-09-14)

### Bug Fixes

- 404 product ([8c8c589](https://github.com/medusajs/medusa/commit/8c8c589b0fa720225a02005f9880ad7d1fbf5042))
- add default relations to variants to include prices ([#394](https://github.com/medusajs/medusa/issues/394)) ([d477ca9](https://github.com/medusajs/medusa/commit/d477ca9842eb58cc561e9e0fa9d01e2d0d2f6756))
- Ensure uniqueness for products, variants, collections and discounts ([#382](https://github.com/medusajs/medusa/issues/382)) ([2715095](https://github.com/medusajs/medusa/commit/27150959ffa70819cf3c4ad176288a1c70287942))
- make shipping_option_id on requirements optional ([#340](https://github.com/medusajs/medusa/issues/340)) ([16b0fa3](https://github.com/medusajs/medusa/commit/16b0fa377a577abd7976c2beaff83e2030969df8))

### Features

- update and cancel swaps, claims, and returns ([#310](https://github.com/medusajs/medusa/issues/310)) ([cf66f97](https://github.com/medusajs/medusa/commit/cf66f97758003a41737602d4b1b1051b266d4f81))

## [1.1.40](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.38...@medusajs/medusa@1.1.40) (2021-09-02)

### Bug Fixes

- Account for non-discountable items in getRefundTotal ([#347](https://github.com/medusajs/medusa/issues/347)) ([fd14e24](https://github.com/medusajs/medusa/commit/fd14e243daf2724ce91aaf85c29806f22f3b6623))

### Features

- creates support for swaps on the storefront ([#355](https://github.com/medusajs/medusa/issues/355)) ([ae82cfc](https://github.com/medusajs/medusa/commit/ae82cfc70a94655ff03fcf1d9b8596f14e8c2840))

## [1.1.39](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.38...@medusajs/medusa@1.1.39) (2021-08-31)

### Bug Fixes

- Account for non-discountable items in getRefundTotal ([#347](https://github.com/medusajs/medusa/issues/347)) ([fd14e24](https://github.com/medusajs/medusa/commit/fd14e243daf2724ce91aaf85c29806f22f3b6623))

### Features

- creates support for swaps on the storefront ([#355](https://github.com/medusajs/medusa/issues/355)) ([ae82cfc](https://github.com/medusajs/medusa/commit/ae82cfc70a94655ff03fcf1d9b8596f14e8c2840))

## [1.1.38](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.37...@medusajs/medusa@1.1.38) (2021-08-17)

### Bug Fixes

- add cross-spawn ([#341](https://github.com/medusajs/medusa/issues/341)) ([8f60f43](https://github.com/medusajs/medusa/commit/8f60f430cc3af7ffccd620cb84ebf8339c2e57d5))

## [1.1.37](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.36...@medusajs/medusa@1.1.37) (2021-08-17)

### Bug Fixes

- build openapi ([#338](https://github.com/medusajs/medusa/issues/338)) ([9467f7e](https://github.com/medusajs/medusa/commit/9467f7ecbd1df5bcd86a15f3cef3ed5968b34e5b))

## [1.1.36](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.35...@medusajs/medusa@1.1.36) (2021-08-11)

### Bug Fixes

- improves integration tests ([#332](https://github.com/medusajs/medusa/issues/332)) ([9a701ff](https://github.com/medusajs/medusa/commit/9a701ff22906e58465a00574c39e2cc284ee0e1a))

## [1.1.35](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.34...@medusajs/medusa@1.1.35) (2021-08-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.34](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.33...@medusajs/medusa@1.1.34) (2021-08-05)

### Bug Fixes

- canary assist ([b988b67](https://github.com/medusajs/medusa/commit/b988b67118553c88ef6c6d53ae99ef1ad9d67305))
- product and variant api route validation ([#331](https://github.com/medusajs/medusa/issues/331)) ([b101725](https://github.com/medusajs/medusa/commit/b101725396ed568666dcbae99a480db793cd20d1))
- return lines allow_discounts ([1295ceb](https://github.com/medusajs/medusa/commit/1295ceb7929f212937a5894ca62c3f87499d1d7b))

### Features

- Add discountable flag to product ([#329](https://github.com/medusajs/medusa/issues/329)) ([6053c4a](https://github.com/medusajs/medusa/commit/6053c4a8ddbc010d1c2a466b0406791a1dc02f3e))
- add route for retrieving a swap ([#326](https://github.com/medusajs/medusa/issues/326)) ([821d8be](https://github.com/medusajs/medusa/commit/821d8be7337608f28e87d96d71cc7aa3a161f117))
- In band inventory updates ([#311](https://github.com/medusajs/medusa/issues/311)) ([f07cc0f](https://github.com/medusajs/medusa/commit/f07cc0fa406d8f0fe33f9088fe6cb3ce8e78b05f))
- medusa-telemetry ([#328](https://github.com/medusajs/medusa/issues/328)) ([cfe19f7](https://github.com/medusajs/medusa/commit/cfe19f7f9d3bb17425348362b148a0b4b7a649ef))

## [1.1.33](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.32...@medusajs/medusa@1.1.33) (2021-07-26)

### Bug Fixes

- enforce 1 shipping method per profile ([#322](https://github.com/medusajs/medusa/issues/322)) ([b378a4f](https://github.com/medusajs/medusa/commit/b378a4f8bc8b57189c368fadb1a14ea2e5ea896e))
- parameterize integration tests' db credentials ([#319](https://github.com/medusajs/medusa/issues/319)) ([06fd882](https://github.com/medusajs/medusa/commit/06fd882a671b2808ef906430f6afd31be2d03280))

### Features

- CLI + local linking ([#313](https://github.com/medusajs/medusa/issues/313)) ([f4a7138](https://github.com/medusajs/medusa/commit/f4a7138a5888e69e19bebe8f4962afc42e9a945d)), closes [#320](https://github.com/medusajs/medusa/issues/320)

## [1.1.32](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.31...@medusajs/medusa@1.1.32) (2021-07-16)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.31](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.29...@medusajs/medusa@1.1.31) (2021-07-15)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.30](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.29...@medusajs/medusa@1.1.30) (2021-07-15)

### Bug Fixes

- adds tracking links to customer orders ([c013270](https://github.com/medusajs/medusa/commit/c0132700b78d171d6c7e29e2604b99129c5a1921))
- allow updating billing address on customer ([5a1cbc6](https://github.com/medusajs/medusa/commit/5a1cbc68b721fe80d223e4ff611ebc81346333d7))
- better store/customer support ([6342e68](https://github.com/medusajs/medusa/commit/6342e68d069636e5eb4877c7ebf7aac952b5e363))
- create fulfillment ([0603a86](https://github.com/medusajs/medusa/commit/0603a86d65a528af86bdbdc46227faa2f48a93bb))
- **medusa:** Resolve issue with soft-delete and unique indexes in DB ([#296](https://github.com/medusajs/medusa/issues/296)) ([6358f8f](https://github.com/medusajs/medusa/commit/6358f8fc756291710a82ce39a47d0cbec1395b87))

## [1.1.29](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.28...@medusajs/medusa@1.1.29) (2021-07-02)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.28](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.27...@medusajs/medusa@1.1.28) (2021-06-24)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.27](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.26...@medusajs/medusa@1.1.27) (2021-06-22)

### Bug Fixes

- adds transformer to map field names to field_id names ([88d96a2](https://github.com/medusajs/medusa/commit/88d96a29fd8dbc44ed7ba25154850d417577acad))
- giftcard-order relation ([c88c407](https://github.com/medusajs/medusa/commit/c88c4070960ad1a8126e65b1e9f60d7ba929246a))
- lint ([5829550](https://github.com/medusajs/medusa/commit/58295505178209d511046089d736395d121b9732))
- mobile pay support ([91511cb](https://github.com/medusajs/medusa/commit/91511cbdf8bc66f5688a36ecf56edb16a220cc82))
- region sync ([8e29e6e](https://github.com/medusajs/medusa/commit/8e29e6e63c305b684a37d817b504b3e471d697bd))
- release assist ([668e8a7](https://github.com/medusajs/medusa/commit/668e8a740200847fc2a41c91d2979097f1392532))

## [1.1.26](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.25...@medusajs/medusa@1.1.26) (2021-06-10)

### Bug Fixes

- avoid error message ([0a62590](https://github.com/medusajs/medusa/commit/0a62590044ab01eb81795de69c0f7017372394cc))

## [1.1.25](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.24...@medusajs/medusa@1.1.25) (2021-06-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.24](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.23...@medusajs/medusa@1.1.24) (2021-06-09)

### Bug Fixes

- babel ([813a1c9](https://github.com/medusajs/medusa/commit/813a1c95a86139a3293c6f8d8bc13f4eb76ef96e))
- bearer user id login development ([df50186](https://github.com/medusajs/medusa/commit/df5018669ce7b727798234e74cda30de262bbb91))
- common registration name formatter ([f4f67a3](https://github.com/medusajs/medusa/commit/f4f67a376dcb6a4d6734c227ba3c2a9e3353a5ce))
- migration dirs ([57a2de6](https://github.com/medusajs/medusa/commit/57a2de64b209544c39af5a7dae43f1230cf36058))
- migration dirs ([e764d8e](https://github.com/medusajs/medusa/commit/e764d8e465fb2ce1a2330cc55097d15dde647074))
- order order ([245ccdc](https://github.com/medusajs/medusa/commit/245ccdc4774965cdd27d4dbdb5fbb084c8066c66))
- PR ([e20ba1e](https://github.com/medusajs/medusa/commit/e20ba1e4faa8d13b3fc35c7c2fe8597c6ec8f41c))
- setup to allow login to Medusa Cloud ([bbd2f02](https://github.com/medusajs/medusa/commit/bbd2f02d549330df160c76cf1f4e4d5e7d08f246))
- test name registration ([e59dc3b](https://github.com/medusajs/medusa/commit/e59dc3b6c85db369c0b7dd3d097578fc2b527431))
- wip ([42d9a48](https://github.com/medusajs/medusa/commit/42d9a487ff1239f32a00bf47df3218ff3cf03217))
- **medusa:** Add free shipping functionality ([#241](https://github.com/medusajs/medusa/issues/241)) ([fb0613d](https://github.com/medusajs/medusa/commit/fb0613d3cbbfeb858b4a4a0f4da859b9692379bd))

### Features

- **cli:** adds seed script ([5136c77](https://github.com/medusajs/medusa/commit/5136c7740137afcda52393131ef931eb76ea9f5d))
- allow custom address on claims ([586f4d8](https://github.com/medusajs/medusa/commit/586f4d884c4b7b5b84fbd1f4dbf5c6fb2ffccf50))
- **medusa:** Swaps on swaps ([#229](https://github.com/medusajs/medusa/issues/229)) ([f8f1f57](https://github.com/medusajs/medusa/commit/f8f1f57fa1bcdc6f7ae4183e657a07e2641b1345))

## [1.1.23](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.23...@medusajs/medusa@1.1.23) (2021-06-09)

### Bug Fixes

- babel ([813a1c9](https://github.com/medusajs/medusa/commit/813a1c95a86139a3293c6f8d8bc13f4eb76ef96e))
- bearer user id login development ([df50186](https://github.com/medusajs/medusa/commit/df5018669ce7b727798234e74cda30de262bbb91))
- common registration name formatter ([f4f67a3](https://github.com/medusajs/medusa/commit/f4f67a376dcb6a4d6734c227ba3c2a9e3353a5ce))
- migration dirs ([57a2de6](https://github.com/medusajs/medusa/commit/57a2de64b209544c39af5a7dae43f1230cf36058))
- migration dirs ([e764d8e](https://github.com/medusajs/medusa/commit/e764d8e465fb2ce1a2330cc55097d15dde647074))
- order order ([245ccdc](https://github.com/medusajs/medusa/commit/245ccdc4774965cdd27d4dbdb5fbb084c8066c66))
- PR ([e20ba1e](https://github.com/medusajs/medusa/commit/e20ba1e4faa8d13b3fc35c7c2fe8597c6ec8f41c))
- setup to allow login to Medusa Cloud ([bbd2f02](https://github.com/medusajs/medusa/commit/bbd2f02d549330df160c76cf1f4e4d5e7d08f246))
- test name registration ([e59dc3b](https://github.com/medusajs/medusa/commit/e59dc3b6c85db369c0b7dd3d097578fc2b527431))
- wip ([42d9a48](https://github.com/medusajs/medusa/commit/42d9a487ff1239f32a00bf47df3218ff3cf03217))
- **medusa:** Add free shipping functionality ([#241](https://github.com/medusajs/medusa/issues/241)) ([fb0613d](https://github.com/medusajs/medusa/commit/fb0613d3cbbfeb858b4a4a0f4da859b9692379bd))

### Features

- **cli:** adds seed script ([5136c77](https://github.com/medusajs/medusa/commit/5136c7740137afcda52393131ef931eb76ea9f5d))
- allow custom address on claims ([586f4d8](https://github.com/medusajs/medusa/commit/586f4d884c4b7b5b84fbd1f4dbf5c6fb2ffccf50))
- **medusa:** Swaps on swaps ([#229](https://github.com/medusajs/medusa/issues/229)) ([f8f1f57](https://github.com/medusajs/medusa/commit/f8f1f57fa1bcdc6f7ae4183e657a07e2641b1345))

## [1.1.22](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.23...@medusajs/medusa@1.1.22) (2021-06-09)

### Bug Fixes

- babel ([813a1c9](https://github.com/medusajs/medusa/commit/813a1c95a86139a3293c6f8d8bc13f4eb76ef96e))
- bearer user id login development ([df50186](https://github.com/medusajs/medusa/commit/df5018669ce7b727798234e74cda30de262bbb91))
- common registration name formatter ([f4f67a3](https://github.com/medusajs/medusa/commit/f4f67a376dcb6a4d6734c227ba3c2a9e3353a5ce))
- migration dirs ([57a2de6](https://github.com/medusajs/medusa/commit/57a2de64b209544c39af5a7dae43f1230cf36058))
- migration dirs ([e764d8e](https://github.com/medusajs/medusa/commit/e764d8e465fb2ce1a2330cc55097d15dde647074))
- order order ([245ccdc](https://github.com/medusajs/medusa/commit/245ccdc4774965cdd27d4dbdb5fbb084c8066c66))
- PR ([e20ba1e](https://github.com/medusajs/medusa/commit/e20ba1e4faa8d13b3fc35c7c2fe8597c6ec8f41c))
- setup to allow login to Medusa Cloud ([bbd2f02](https://github.com/medusajs/medusa/commit/bbd2f02d549330df160c76cf1f4e4d5e7d08f246))
- test name registration ([e59dc3b](https://github.com/medusajs/medusa/commit/e59dc3b6c85db369c0b7dd3d097578fc2b527431))
- wip ([42d9a48](https://github.com/medusajs/medusa/commit/42d9a487ff1239f32a00bf47df3218ff3cf03217))
- **medusa:** Add free shipping functionality ([#241](https://github.com/medusajs/medusa/issues/241)) ([fb0613d](https://github.com/medusajs/medusa/commit/fb0613d3cbbfeb858b4a4a0f4da859b9692379bd))

### Features

- **cli:** adds seed script ([5136c77](https://github.com/medusajs/medusa/commit/5136c7740137afcda52393131ef931eb76ea9f5d))
- allow custom address on claims ([586f4d8](https://github.com/medusajs/medusa/commit/586f4d884c4b7b5b84fbd1f4dbf5c6fb2ffccf50))
- **medusa:** Swaps on swaps ([#229](https://github.com/medusajs/medusa/issues/229)) ([f8f1f57](https://github.com/medusajs/medusa/commit/f8f1f57fa1bcdc6f7ae4183e657a07e2641b1345))

## [1.1.20](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.23...@medusajs/medusa@1.1.20) (2021-06-08)

### Bug Fixes

- babel ([813a1c9](https://github.com/medusajs/medusa/commit/813a1c95a86139a3293c6f8d8bc13f4eb76ef96e))
- bearer user id login development ([df50186](https://github.com/medusajs/medusa/commit/df5018669ce7b727798234e74cda30de262bbb91))
- common registration name formatter ([f4f67a3](https://github.com/medusajs/medusa/commit/f4f67a376dcb6a4d6734c227ba3c2a9e3353a5ce))
- migration dirs ([57a2de6](https://github.com/medusajs/medusa/commit/57a2de64b209544c39af5a7dae43f1230cf36058))
- migration dirs ([e764d8e](https://github.com/medusajs/medusa/commit/e764d8e465fb2ce1a2330cc55097d15dde647074))
- PR ([e20ba1e](https://github.com/medusajs/medusa/commit/e20ba1e4faa8d13b3fc35c7c2fe8597c6ec8f41c))
- setup to allow login to Medusa Cloud ([bbd2f02](https://github.com/medusajs/medusa/commit/bbd2f02d549330df160c76cf1f4e4d5e7d08f246))
- test name registration ([e59dc3b](https://github.com/medusajs/medusa/commit/e59dc3b6c85db369c0b7dd3d097578fc2b527431))
- wip ([42d9a48](https://github.com/medusajs/medusa/commit/42d9a487ff1239f32a00bf47df3218ff3cf03217))
- **medusa:** Add free shipping functionality ([#241](https://github.com/medusajs/medusa/issues/241)) ([fb0613d](https://github.com/medusajs/medusa/commit/fb0613d3cbbfeb858b4a4a0f4da859b9692379bd))

### Features

- **cli:** adds seed script ([5136c77](https://github.com/medusajs/medusa/commit/5136c7740137afcda52393131ef931eb76ea9f5d))
- allow custom address on claims ([586f4d8](https://github.com/medusajs/medusa/commit/586f4d884c4b7b5b84fbd1f4dbf5c6fb2ffccf50))
- **medusa:** Swaps on swaps ([#229](https://github.com/medusajs/medusa/issues/229)) ([f8f1f57](https://github.com/medusajs/medusa/commit/f8f1f57fa1bcdc6f7ae4183e657a07e2641b1345))

## [1.1.23](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.22...@medusajs/medusa@1.1.23) (2021-04-29)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.22](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.19...@medusajs/medusa@1.1.22) (2021-04-28)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.21](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.20...@medusajs/medusa@1.1.21) (2021-04-20)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.20](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.19...@medusajs/medusa@1.1.20) (2021-04-20)

### Features

- **medusa:** Swaps on swaps ([#229](https://github.com/medusajs/medusa/issues/229)) ([f8f1f57](https://github.com/medusajs/medusa/commit/f8f1f57fa1bcdc6f7ae4183e657a07e2641b1345))

## [1.1.19](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.18...@medusajs/medusa@1.1.19) (2021-04-13)

### Bug Fixes

- adds tests ([69442a1](https://github.com/medusajs/medusa/commit/69442a1735193aeb010043f114d89037d4d76279))
- creates restock functionality ([2b25550](https://github.com/medusajs/medusa/commit/2b2555004e52e97c15bfca59e030fdfc3d86ae49))
- deps ([a9ea38c](https://github.com/medusajs/medusa/commit/a9ea38c2005beb63e14ed151e25ecd26819c748c))
- merge develop ([a468c45](https://github.com/medusajs/medusa/commit/a468c451e82c68f41b5005a2e480057f6124aaa6))
- working api ([9d81097](https://github.com/medusajs/medusa/commit/9d810971a7e0de2a586b5c9c372f0aad2818918b))
- **medusa:** Move discount usage from rule to discount ([d9cd52a](https://github.com/medusajs/medusa/commit/d9cd52a1776e9a334b155d37e58d73f456e3a028))

### Features

- restock service ([8bd5fa8](https://github.com/medusajs/medusa/commit/8bd5fa821286a90f3ab21e8c96993ac543fb7cab))

## [1.1.18](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.17...@medusajs/medusa@1.1.18) (2021-04-09)

### Bug Fixes

- adds tests ([69442a1](https://github.com/medusajs/medusa/commit/69442a1735193aeb010043f114d89037d4d76279))
- creates restock functionality ([2b25550](https://github.com/medusajs/medusa/commit/2b2555004e52e97c15bfca59e030fdfc3d86ae49))
- deps ([a9ea38c](https://github.com/medusajs/medusa/commit/a9ea38c2005beb63e14ed151e25ecd26819c748c))
- working api ([9d81097](https://github.com/medusajs/medusa/commit/9d810971a7e0de2a586b5c9c372f0aad2818918b))
- **medusa:** Move discount usage from rule to discount ([d9cd52a](https://github.com/medusajs/medusa/commit/d9cd52a1776e9a334b155d37e58d73f456e3a028))

### Features

- restock service ([8bd5fa8](https://github.com/medusajs/medusa/commit/8bd5fa821286a90f3ab21e8c96993ac543fb7cab))

## [1.1.17](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.16...@medusajs/medusa@1.1.17) (2021-03-30)

### Bug Fixes

- publish assist ([7719957](https://github.com/medusajs/medusa/commit/7719957b44a0c0d950eff948faf31188fe0e3ef1))

## [1.1.16](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.16...@medusajs/medusa@1.1.16) (2021-03-30)

### Bug Fixes

- publish assist ([7719957](https://github.com/medusajs/medusa/commit/7719957b44a0c0d950eff948faf31188fe0e3ef1))

## [1.1.15](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.16...@medusajs/medusa@1.1.15) (2021-03-30)

### Bug Fixes

- publish assist ([7719957](https://github.com/medusajs/medusa/commit/7719957b44a0c0d950eff948faf31188fe0e3ef1))

## [1.1.16](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.15...@medusajs/medusa@1.1.16) (2021-03-26)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.15](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.14...@medusajs/medusa@1.1.15) (2021-03-18)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.14](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.13...@medusajs/medusa@1.1.14) (2021-03-17)

### Bug Fixes

- expose statusses on order ([a26b12a](https://github.com/medusajs/medusa/commit/a26b12a5367738d9434dc46fadaea6f9a5d5a498))
- **medusa:** Add usage_count + usage_limit to discount ([c513813](https://github.com/medusajs/medusa/commit/c513813bb680486f309f68b03bf878151e0a7b1e))

## [1.1.13](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.11...@medusajs/medusa@1.1.13) (2021-03-17)

### Bug Fixes

- add region to gift-cards ([ffac0d3](https://github.com/medusajs/medusa/commit/ffac0d3a3de876a5fe5b6b75910ef02f249fae4c))
- adds integration test to create endpoint ([521d306](https://github.com/medusajs/medusa/commit/521d306b7126a820297d7374b9c16bea465fa643))
- allows shipping option filters in return ([#202](https://github.com/medusajs/medusa/issues/202)) ([7c7f86e](https://github.com/medusajs/medusa/commit/7c7f86e8e8be20173e774ea86b53e75c98e72e9a))
- contentful sync ([#206](https://github.com/medusajs/medusa/issues/206)) ([227cdb6](https://github.com/medusajs/medusa/commit/227cdb622234126df6087992203ce82ff9446974))
- enable gift-card creation without order_id ([9ce935a](https://github.com/medusajs/medusa/commit/9ce935a779aec90ff1ad301c73114ab69ce51b36))
- enable gift-card creation without order_id ([#195](https://github.com/medusajs/medusa/issues/195)) ([1263d24](https://github.com/medusajs/medusa/commit/1263d24ca380918345c844c1793f2706a49f85c6))
- merge ([49f1d0f](https://github.com/medusajs/medusa/commit/49f1d0f67a3eb285397d8b7c8e9033fcf42589ff))
- merge ([31d5bb0](https://github.com/medusajs/medusa/commit/31d5bb017d3028beb5325185ccec80cd1772165e))
- **medusa:** expose items.refundable ([3fbf38f](https://github.com/medusajs/medusa/commit/3fbf38ffc93b969adbb5033e5b7cb31aeff36896))
- merge api ([6ad2b0e](https://github.com/medusajs/medusa/commit/6ad2b0e6e9f339f60a3cc9d8674e5055121685b4))
- **medusa:** Upsert product images ([#200](https://github.com/medusajs/medusa/issues/200)) ([a031f1f](https://github.com/medusajs/medusa/commit/a031f1f33873dddd0246e668c5b98c12bbaa108b))
- round totals ([a1ba2e8](https://github.com/medusajs/medusa/commit/a1ba2e8b5cdf586ac2d646f2334e46ceae96bc8f))
- test ([caf1ecf](https://github.com/medusajs/medusa/commit/caf1ecfd5af58559d035d6c17a4993bdd6a5cc0b))

### Features

- **medusa:** Add support for filtering with gt, lt, gte and lte ([#190](https://github.com/medusajs/medusa/issues/190)) ([dd0491f](https://github.com/medusajs/medusa/commit/dd0491f52132aed24f642589b12fcf636b719580))
- **medusa:** cart context ([#201](https://github.com/medusajs/medusa/issues/201)) ([dd7b306](https://github.com/medusajs/medusa/commit/dd7b306333fbe1042f5cf2bed614bce84ea9475f))
- **medusa:** storefront return ([#194](https://github.com/medusajs/medusa/issues/194)) ([252db5e](https://github.com/medusajs/medusa/commit/252db5ef7e09e844fac72bbb8e2b2de34a541d25))

## [1.1.12](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.11...@medusajs/medusa@1.1.12) (2021-03-17)

### Bug Fixes

- add region to gift-cards ([ffac0d3](https://github.com/medusajs/medusa/commit/ffac0d3a3de876a5fe5b6b75910ef02f249fae4c))
- adds integration test to create endpoint ([521d306](https://github.com/medusajs/medusa/commit/521d306b7126a820297d7374b9c16bea465fa643))
- allows shipping option filters in return ([#202](https://github.com/medusajs/medusa/issues/202)) ([7c7f86e](https://github.com/medusajs/medusa/commit/7c7f86e8e8be20173e774ea86b53e75c98e72e9a))
- contentful sync ([#206](https://github.com/medusajs/medusa/issues/206)) ([227cdb6](https://github.com/medusajs/medusa/commit/227cdb622234126df6087992203ce82ff9446974))
- enable gift-card creation without order_id ([9ce935a](https://github.com/medusajs/medusa/commit/9ce935a779aec90ff1ad301c73114ab69ce51b36))
- enable gift-card creation without order_id ([#195](https://github.com/medusajs/medusa/issues/195)) ([1263d24](https://github.com/medusajs/medusa/commit/1263d24ca380918345c844c1793f2706a49f85c6))
- merge ([49f1d0f](https://github.com/medusajs/medusa/commit/49f1d0f67a3eb285397d8b7c8e9033fcf42589ff))
- merge ([31d5bb0](https://github.com/medusajs/medusa/commit/31d5bb017d3028beb5325185ccec80cd1772165e))
- **medusa:** expose items.refundable ([3fbf38f](https://github.com/medusajs/medusa/commit/3fbf38ffc93b969adbb5033e5b7cb31aeff36896))
- merge api ([6ad2b0e](https://github.com/medusajs/medusa/commit/6ad2b0e6e9f339f60a3cc9d8674e5055121685b4))
- **medusa:** Upsert product images ([#200](https://github.com/medusajs/medusa/issues/200)) ([a031f1f](https://github.com/medusajs/medusa/commit/a031f1f33873dddd0246e668c5b98c12bbaa108b))
- round totals ([a1ba2e8](https://github.com/medusajs/medusa/commit/a1ba2e8b5cdf586ac2d646f2334e46ceae96bc8f))
- test ([caf1ecf](https://github.com/medusajs/medusa/commit/caf1ecfd5af58559d035d6c17a4993bdd6a5cc0b))

### Features

- **medusa:** Add support for filtering with gt, lt, gte and lte ([#190](https://github.com/medusajs/medusa/issues/190)) ([dd0491f](https://github.com/medusajs/medusa/commit/dd0491f52132aed24f642589b12fcf636b719580))
- **medusa:** cart context ([#201](https://github.com/medusajs/medusa/issues/201)) ([dd7b306](https://github.com/medusajs/medusa/commit/dd7b306333fbe1042f5cf2bed614bce84ea9475f))
- **medusa:** storefront return ([#194](https://github.com/medusajs/medusa/issues/194)) ([252db5e](https://github.com/medusajs/medusa/commit/252db5ef7e09e844fac72bbb8e2b2de34a541d25))

## [1.1.11](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.10...@medusajs/medusa@1.1.11) (2021-02-25)

### Bug Fixes

- **medusa:** Add querying func. on customer retrievals ([#181](https://github.com/medusajs/medusa/issues/181)) ([22be418](https://github.com/medusajs/medusa/commit/22be418ec132944afe469106ba4b3b92f634d240))

## [1.1.10](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.10-next.1...@medusajs/medusa@1.1.10) (2021-02-25)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.10-next.1](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.10-next.0...@medusajs/medusa@1.1.10-next.1) (2021-02-25)

### Bug Fixes

- update-product ([0320788](https://github.com/medusajs/medusa/commit/0320788aacf93da8a8951c6a540656da1772dba4))

## [1.1.10-next.0](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.9...@medusajs/medusa@1.1.10-next.0) (2021-02-22)

### Features

- **medusa:** tracking links ([#177](https://github.com/medusajs/medusa/issues/177)) ([99ad43b](https://github.com/medusajs/medusa/commit/99ad43bf47c3922f391d433448b1c4affd88f457))

## [1.1.9](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.8...@medusajs/medusa@1.1.9) (2021-02-18)

### Bug Fixes

- performant relations ([5659d10](https://github.com/medusajs/medusa/commit/5659d106e3be139fcf2b32b48ce4c7fa5f678a8b))

## [1.1.8](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.7...@medusajs/medusa@1.1.8) (2021-02-17)

### Bug Fixes

- test ([4229e24](https://github.com/medusajs/medusa/commit/4229e241d03986039d283d98e034eaaefb50e04d))
- use parallel relation fetching ([#173](https://github.com/medusajs/medusa/issues/173)) ([46006e4](https://github.com/medusajs/medusa/commit/46006e4b0647bada1dc2cb417766e22f65bad23e))

### Features

- notifications ([#172](https://github.com/medusajs/medusa/issues/172)) ([7308946](https://github.com/medusajs/medusa/commit/7308946e567ed4e63e1ed3d9d31b30c4f1a73f0d))
- **medusa:** Product category, type and tags ([c4d1203](https://github.com/medusajs/medusa/commit/c4d1203155b7cc03e8892f0409efec83e030063e))

## [1.1.7](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.6...@medusajs/medusa@1.1.7) (2021-02-08)

### Features

- adds paypal ([#168](https://github.com/medusajs/medusa/issues/168)) ([#169](https://github.com/medusajs/medusa/issues/169)) ([427ae25](https://github.com/medusajs/medusa/commit/427ae25016bb3a22ebc05aa7b18017132846567c))

## [1.1.6](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.5...@medusajs/medusa@1.1.6) (2021-02-03)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.5](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.4...@medusajs/medusa@1.1.5) (2021-02-03)

### Features

- **medusa,brightpearl,segment,webshipper:** claims ([#163](https://github.com/medusajs/medusa/issues/163)) ([690d339](https://github.com/medusajs/medusa/commit/690d33966754a7dbe159c3ac09712a3c3bfaff0b))

## [1.1.4](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.3...@medusajs/medusa@1.1.4) (2021-01-29)

**Note:** Version bump only for package @medusajs/medusa

## [1.1.3](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.2...@medusajs/medusa@1.1.3) (2021-01-27)

### Bug Fixes

- tax_rate extraction in totals service ([#156](https://github.com/medusajs/medusa/issues/156)) ([178d12f](https://github.com/medusajs/medusa/commit/178d12fc7107875b62126a63a32c7e9738a69000))

## [1.1.2](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.1...@medusajs/medusa@1.1.2) (2021-01-27)

### Features

- adds discount code search functionality ([#155](https://github.com/medusajs/medusa/issues/155)) ([7e14da1](https://github.com/medusajs/medusa/commit/7e14da1225983dd58faabbd6d555818277ad4cc8))

## [1.1.1](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.1.0...@medusajs/medusa@1.1.1) (2021-01-26)

### Bug Fixes

- customer not found ([#152](https://github.com/medusajs/medusa/issues/152)) ([282eaae](https://github.com/medusajs/medusa/commit/282eaae67555f9989fa90c0aa3acf7de84957b46))

# [1.1.0](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.56...@medusajs/medusa@1.1.0) (2021-01-26)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.56](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.55...@medusajs/medusa@1.0.56) (2021-01-06)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.55](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.54...@medusajs/medusa@1.0.55) (2021-01-06)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.54](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.53...@medusajs/medusa@1.0.54) (2020-12-28)

### Features

- **medusa:** Adds filtering to order listing for use in admin ([#149](https://github.com/medusajs/medusa/issues/149)) ([09d7ed2](https://github.com/medusajs/medusa/commit/09d7ed232bb07e9dab3d7535ec98f5fd88ad8ca2))

## [1.0.53](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.52...@medusajs/medusa@1.0.53) (2020-12-17)

### Features

- **medusa:** Adds product variant sale price ([#148](https://github.com/medusajs/medusa/issues/148)) ([451451a](https://github.com/medusajs/medusa/commit/451451a38eeffa88e04f1992c4026882cd2be66f))

## [1.0.52](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.51...@medusajs/medusa@1.0.52) (2020-12-09)

### Bug Fixes

- .gitignore ([ed4d2b4](https://github.com/medusajs/medusa/commit/ed4d2b4b3d7ae4dce834e83d776781f2dbbccb52))

## [1.0.51](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.50...@medusajs/medusa@1.0.51) (2020-12-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.50](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.49...@medusajs/medusa@1.0.50) (2020-12-08)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.49](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.48...@medusajs/medusa@1.0.49) (2020-12-04)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.48](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.47...@medusajs/medusa@1.0.48) (2020-12-02)

### Bug Fixes

- allow swaps with total < 0 ([#143](https://github.com/medusajs/medusa/issues/143)) ([304431e](https://github.com/medusajs/medusa/commit/304431e7c35e73b5dcd3ad4f28574b7cda091355))

## [1.0.47](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.46...@medusajs/medusa@1.0.47) (2020-11-29)

### Bug Fixes

- swaps with discounts ([#142](https://github.com/medusajs/medusa/issues/142)) ([aae8d5e](https://github.com/medusajs/medusa/commit/aae8d5e1128daa433b333483094cceeba4389c17))

## [1.0.46](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.45...@medusajs/medusa@1.0.46) (2020-11-28)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.45](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.44...@medusajs/medusa@1.0.45) (2020-11-26)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.44](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.43...@medusajs/medusa@1.0.44) (2020-11-24)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.43](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.42...@medusajs/medusa@1.0.43) (2020-11-24)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.42](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.41...@medusajs/medusa@1.0.42) (2020-11-13)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.41](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.40...@medusajs/medusa@1.0.41) (2020-11-13)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.40](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.39...@medusajs/medusa@1.0.40) (2020-11-13)

### Features

- **medusa:** Adds shipped status to line items + Capture fails will give payment_status = requires_action ([6a3c545](https://github.com/medusajs/medusa/commit/6a3c5455371c33e47722c7ab433a48d1d9b5b511))

## [1.0.39](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.38...@medusajs/medusa@1.0.39) (2020-11-05)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.38](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.37...@medusajs/medusa@1.0.38) (2020-11-05)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.37](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.36...@medusajs/medusa@1.0.37) (2020-11-04)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.36](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.35...@medusajs/medusa@1.0.36) (2020-11-04)

### Features

- **medusa:** Adds set and delete metadata endpoints for region and orders ([#131](https://github.com/medusajs/medusa/issues/131)) ([d67b6e6](https://github.com/medusajs/medusa/commit/d67b6e6ebe30ad18c0d1a012732a75e47a3f4a35))

## [1.0.35](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.34...@medusajs/medusa@1.0.35) (2020-11-02)

### Bug Fixes

- add country code on preCartCreation ([e3faa64](https://github.com/medusajs/medusa/commit/e3faa646a7b91d2686b56718df46bea5b709731b))

## [1.0.34](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.33...@medusajs/medusa@1.0.34) (2020-10-31)

### Bug Fixes

- adds field selection to list order endpoint ([#133](https://github.com/medusajs/medusa/issues/133)) ([b1786ce](https://github.com/medusajs/medusa/commit/b1786ce9d8684b1611c994380e39b25c3ac181a1))

## [1.0.33](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.32...@medusajs/medusa@1.0.33) (2020-10-28)

### Features

- **medusa:** adds support for gift cards ([#132](https://github.com/medusajs/medusa/issues/132)) ([f2c62cd](https://github.com/medusajs/medusa/commit/f2c62cd2321c9013c15160a80598f912daef4647))

## [1.0.32](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.31...@medusajs/medusa@1.0.32) (2020-10-20)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.31](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.30...@medusajs/medusa@1.0.31) (2020-10-20)

### Features

- **medusa-interfaces:** Adds schema options to base model ([cc23a3b](https://github.com/medusajs/medusa/commit/cc23a3b0706c41ec57bb25ea3de9c6e39bd04f31))

## [1.0.30](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.29...@medusajs/medusa@1.0.30) (2020-10-20)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.29](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.28...@medusajs/medusa@1.0.29) (2020-10-20)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.28](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.27...@medusajs/medusa@1.0.28) (2020-10-19)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.27](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.26...@medusajs/medusa@1.0.27) (2020-10-17)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.26](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.25...@medusajs/medusa@1.0.26) (2020-10-14)

### Features

- return shipping and flow ([#125](https://github.com/medusajs/medusa/issues/125)) ([c1e821d](https://github.com/medusajs/medusa/commit/c1e821d9d4d33756c7309e5cf110d7aa9b67297d))

## [1.0.25](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.24...@medusajs/medusa@1.0.25) (2020-10-08)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.24](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.23...@medusajs/medusa@1.0.24) (2020-10-08)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.23](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.22...@medusajs/medusa@1.0.23) (2020-10-06)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.22](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.21...@medusajs/medusa@1.0.22) (2020-10-06)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.21](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.20...@medusajs/medusa@1.0.21) (2020-10-05)

### Bug Fixes

- **medusa-plugin-brightpearl:** reliable oauth ([#119](https://github.com/medusajs/medusa/issues/119)) ([0889059](https://github.com/medusajs/medusa/commit/0889059ba178e976c5f6c4a0e938a463dde29554))

## [1.0.20](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.19...@medusajs/medusa@1.0.20) (2020-10-05)

### Bug Fixes

- **medusa-plugin-addon:** Fixes admin endpoints, Adds flag to avoid merging add-on line-items ([d8483cd](https://github.com/medusajs/medusa/commit/d8483cd1352ecc587112723786b7c31882f9416e))

### Features

- webshipper ([#118](https://github.com/medusajs/medusa/issues/118)) ([893a7f6](https://github.com/medusajs/medusa/commit/893a7f69afea67e854a67fc3b92c8a10c9c1b75c))

## [1.0.19](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.18...@medusajs/medusa@1.0.19) (2020-09-21)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.18](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.17...@medusajs/medusa@1.0.18) (2020-09-21)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.17](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.16...@medusajs/medusa@1.0.17) (2020-09-18)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.16](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.15...@medusajs/medusa@1.0.16) (2020-09-11)

### Bug Fixes

- **medusa:** add line item to order.gift_card_created event ([c5019ca](https://github.com/medusajs/medusa/commit/c5019ca0d1ee708ab3be441e084023d0bbccef72))

## [1.0.15](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.14...@medusajs/medusa@1.0.15) (2020-09-10)

### Bug Fixes

- cron jobs and brightpearl auto refresh ([#107](https://github.com/medusajs/medusa/issues/107)) ([c7bd783](https://github.com/medusajs/medusa/commit/c7bd7838aa620d6f23d9f5e17592cc5a82818c9e))

## [1.0.14](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.13...@medusajs/medusa@1.0.14) (2020-09-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.13](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.12...@medusajs/medusa@1.0.13) (2020-09-09)

**Note:** Version bump only for package @medusajs/medusa

## [1.0.12](https://github.com/medusajs/medusa/compare/@medusajs/medusa@1.0.11...@medusajs/medusa@1.0.12) (2020-09-09)

### Features

- **plugins:** Adds add-on plugin ([3de1e6d](https://github.com/medusajs/medusa/commit/3de1e6dd4ad4a2a48d4d8116ebdd011efce2b22a))

## 1.0.11 (2020-09-09)

## 1.0.10 (2020-09-09)

### Bug Fixes

- updates license ([db519fb](https://github.com/medusajs/medusa/commit/db519fbaa6f8ad02c19cbecba5d4f28ba1ee81aa))

## 1.0.9 (2020-09-08)

## 1.0.8 (2020-09-08)

### Bug Fixes

- fulfillment api ([#104](https://github.com/medusajs/medusa/issues/104)) ([1e04be9](https://github.com/medusajs/medusa/commit/1e04be90c8fbea5bec3e0e30d68ce1458d640041))

## 1.0.7 (2020-09-07)

## 1.0.6 (2020-09-07)

### Bug Fixes

- **medusa:** secure cookies in staging ([7e2446f](https://github.com/medusajs/medusa/commit/7e2446f52e5cfcc4c5b9f5625dccccfab420500c))

## 1.0.1 (2020-09-05)

### Bug Fixes

- **medusa:** adds fulfillment_created event in order service ([#101](https://github.com/medusajs/medusa/issues/101)) ([021544d](https://github.com/medusajs/medusa/commit/021544d454d79a2a1ac15c3c378147b7b572acb7))

## 1.0.1-beta.0 (2020-09-04)

### Bug Fixes

- **medusa:** product variant metadata ([#98](https://github.com/medusajs/medusa/issues/98)) ([520115a](https://github.com/medusajs/medusa/commit/520115a2cef7ee3f0259a682bd82e693c6327790))

# 1.0.0 (2020-09-03)

# 1.0.0-y.25 (2020-09-03)

# 1.0.0-y.17 (2020-09-01)

### Bug Fixes

- all redis urls correct ([473d702](https://github.com/medusajs/medusa/commit/473d7025dfea9b0472f102877a1cebb9e10b9407))

# 1.0.0-y.16 (2020-09-01)

### Bug Fixes

- all redis urls correct ([11a9f38](https://github.com/medusajs/medusa/commit/11a9f38bce63c7d5907a04a21bf77802d5d19d64))

# 1.0.0-y.15 (2020-09-01)

### Bug Fixes

- debug ([aece0ff](https://github.com/medusajs/medusa/commit/aece0ff3abd0126f07273ed91b2b178a1cf00d3f))

# 1.0.0-y.14 (2020-09-01)

### Bug Fixes

- pass config to service loader ([d7cd7e9](https://github.com/medusajs/medusa/commit/d7cd7e9674da847fc9c9fc329cb7684e086840de))

# 1.0.0-y.13 (2020-09-01)

### Bug Fixes

- use medusa config for env vars ([61dc478](https://github.com/medusajs/medusa/commit/61dc4780842336d2f0e12334c461cd206c6ac4a1))

# 1.0.0-y.12 (2020-09-01)

### Bug Fixes

- asValue registrations ([5504281](https://github.com/medusajs/medusa/commit/5504281e8a659b34b8d2e2d4615765eadfca91dc))

# 1.0.0-y.11 (2020-09-01)

### Bug Fixes

- use fewer redis connections ([b5ee323](https://github.com/medusajs/medusa/commit/b5ee323bf68606af596fb8ba4a941b950f06abd3))

# 1.0.0-y.9 (2020-09-01)

### Bug Fixes

- more economical use of redis clients ([b85417a](https://github.com/medusajs/medusa/commit/b85417a9b7584a8153a1265bbb914ed7f9f75a8a))

# 1.0.0-y.8 (2020-09-01)

### Bug Fixes

- more economical use of redis clients ([fdfc213](https://github.com/medusajs/medusa/commit/fdfc213d243ee5b0d8685cae62ab5c3c6cfff1db))

# 1.0.0-y.4 (2020-08-31)

### Bug Fixes

- add tax_code to regions ([e8afb6b](https://github.com/medusajs/medusa/commit/e8afb6b9683857c1eced3dd43b39c1bbc2c911f5))

# 1.0.0-y.3 (2020-08-31)

### Bug Fixes

- auto pick country in 1 country regions ([d11eb8f](https://github.com/medusajs/medusa/commit/d11eb8fa65e0d036f88890ed7fd771a607f75cbc))

# 1.0.0-y.0 (2020-08-30)

### Bug Fixes

- removes unnecessary import ([270645d](https://github.com/medusajs/medusa/commit/270645deb2f9931cd7a48549ffd9254c53a62df4))

# 1.0.0-alpha.37 (2020-08-30)

### Bug Fixes

- update password hashing ([16d3c88](https://github.com/medusajs/medusa/commit/16d3c88c4f2416abc106ee318d1b1a05301ab9bf))

# 1.0.0-alpha.36 (2020-08-30)

# 1.0.0-alpha.31 (2020-08-28)

### Bug Fixes

- better rounding of totals ([3093cba](https://github.com/medusajs/medusa/commit/3093cba610992225ab51bee05ec1e5c84c7e0fed))

# 1.0.0-alpha.30 (2020-08-28)

# 1.0.0-alpha.27 (2020-08-27)

### Bug Fixes

- **completeOrder:** removes payment capture ([db3c332](https://github.com/medusajs/medusa/commit/db3c332a997101d86b935b5407d5e3b7382b3f2e))
- **contentful-plugin:** Keep existing entry fields ([eb47896](https://github.com/medusajs/medusa/commit/eb478966684776bb2aa48e98789519644b05cd33))
- **discount:** allow all updates on discounts ([d8aac75](https://github.com/medusajs/medusa/commit/d8aac759cf5067c640ca0f61ff7e557c5ed530e9))
- **medusa:** allow multiple fulfillments ([0856645](https://github.com/medusajs/medusa/commit/0856645a1156a3b4a97f0ef50cf529dab344d993))
- **order:** Adds display_id to free text search ([cfa7417](https://github.com/medusajs/medusa/commit/cfa74179dcad018e4a1fca1c98ae905a5721fb44))

### Features

- **pagination:** Adds MVP pagination to orders and products for admin routes ([9dc6999](https://github.com/medusajs/medusa/commit/9dc6999a9a0c11d33eb9affa953ad1b44bd5e8b8))

# 1.0.0-alpha.24 (2020-08-27)

# 1.0.0-alpha.22 (2020-08-25)

# 1.0.0-alpha.21 (2020-08-25)

### Bug Fixes

- **order:** sends order to fulfillment provider ([450f7d9](https://github.com/medusajs/medusa/commit/450f7d96f937a9e5eba6107bf3ad1cc880ed641c))

# 1.0.0-alpha.15 (2020-08-22)

# 1.0.0-alpha.14 (2020-08-22)

# 1.0.0-alpha.13 (2020-08-22)

# 1.0.0-alpha.12 (2020-08-22)

# 1.0.0-alpha.11 (2020-08-22)

# 1.0.0-alpha.10 (2020-08-22)

# 1.0.0-alpha.9 (2020-08-21)

# 1.0.0-alpha.8 (2020-08-21)

# 1.0.0-alpha.7 (2020-08-21)

# 1.0.0-alpha.6 (2020-08-21)

# 1.0.0-alpha.4 (2020-08-20)

# 1.0.0-alpha.3 (2020-08-20)

# 1.0.0-alpha.2 (2020-08-20)

# 1.0.0-alpha.1 (2020-08-20)

# 1.0.0-alpha.0 (2020-08-20)

# 0.3.0 (2020-04-06)

# 0.2.0 (2020-04-06)

# 0.2.0-alpha.0 (2020-04-04)

## 0.1.12-alpha.0 (2020-03-24)

## 0.1.11-alpha.0 (2020-03-24)

## 0.1.10-alpha.0 (2020-03-24)

## 0.1.9-alpha.0 (2020-03-24)

## 0.1.8-alpha.0 (2020-03-24)

## 0.1.7-alpha.0 (2020-03-24)

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
