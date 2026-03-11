# @medusajs/utils

## 2.13.3

### Patch Changes

- Updated dependencies []:
  - @medusajs/deps@2.13.3

## 2.13.2

### Patch Changes

- [#14720](https://github.com/medusajs/medusa/pull/14720) [`f37f029799cad7ee0337aeab625df5e272de2363`](https://github.com/medusajs/medusa/commit/f37f029799cad7ee0337aeab625df5e272de2363) Thanks [@arjusmoon860](https://github.com/arjusmoon860)! - feat(dashboard, admin-bundler, utils, types): add configurable maximum file upload size

- [#14565](https://github.com/medusajs/medusa/pull/14565) [`d0e6f710c3f8305b58ac39131a125274987cae05`](https://github.com/medusajs/medusa/commit/d0e6f710c3f8305b58ac39131a125274987cae05) Thanks [@Mohammed-AlSharafi](https://github.com/Mohammed-AlSharafi)! - fix: Prevent translation crash when entity contains arrays of primitive values (e.g. strings)

- [#14665](https://github.com/medusajs/medusa/pull/14665) [`77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8`](https://github.com/medusajs/medusa/commit/77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: add forbidden error 403

- Updated dependencies []:
  - @medusajs/deps@2.13.2

## 2.13.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/deps@2.13.1

## 2.13.0

### Minor Changes

- [`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor bump

### Patch Changes

- Updated dependencies [[`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7)]:
  - @medusajs/deps@2.13.0

## 2.12.6

### Patch Changes

- [#14478](https://github.com/medusajs/medusa/pull/14478) [`13476988763368b3b333fa5bc3f613e8eb174fdf`](https://github.com/medusajs/medusa/commit/13476988763368b3b333fa5bc3f613e8eb174fdf) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat/enable event configuration in medusa config
  enables event priority configuration through the Medusa config, allowing users to configure event processing options (like priority) for specific events at the module level.

- [#14477](https://github.com/medusajs/medusa/pull/14477) [`55d2a704700433c34edd0f7f10dfd042d2f9333a`](https://github.com/medusajs/medusa/commit/55d2a704700433c34edd0f7f10dfd042d2f9333a) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(config): Default event worker concurrency to 3 on cloud

- [#14595](https://github.com/medusajs/medusa/pull/14595) [`39b9f84affcdda267bca0ee486825daca2e4a896`](https://github.com/medusajs/medusa/commit/39b9f84affcdda267bca0ee486825daca2e4a896) Thanks [@adrien2p](https://github.com/adrien2p)! - Chore/reset event worker concurrency to 1

- [#14519](https://github.com/medusajs/medusa/pull/14519) [`41e1d5e5066719569d4f639415d3d1fdae1ddc0b`](https://github.com/medusajs/medusa/commit/41e1d5e5066719569d4f639415d3d1fdae1ddc0b) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(utils): fix import of caching and translation modules

- [#14359](https://github.com/medusajs/medusa/pull/14359) [`cec8b8e428131d4743d6da98cd5fa0974b8ab9e1`](https://github.com/medusajs/medusa/commit/cec8b8e428131d4743d6da98cd5fa0974b8ab9e1) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(core-flows,types,utils,medusa): Translate tax lines

- [#14576](https://github.com/medusajs/medusa/pull/14576) [`95e9dfdcaf008b86e2ed3d1ad273b369776bc90e`](https://github.com/medusajs/medusa/commit/95e9dfdcaf008b86e2ed3d1ad273b369776bc90e) Thanks [@riqwan](https://github.com/riqwan)! - fix(utils): support both path and parentPath in migration file

- [#14441](https://github.com/medusajs/medusa/pull/14441) [`1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b`](https://github.com/medusajs/medusa/commit/1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(deps,framework): add zod as framework dependency

- Updated dependencies [[`1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b`](https://github.com/medusajs/medusa/commit/1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b)]:
  - @medusajs/deps@2.12.6

## 2.12.5

### Patch Changes

- [#14494](https://github.com/medusajs/medusa/pull/14494) [`08c55e703573f3c11532228d2c626f7b7f16228f`](https://github.com/medusajs/medusa/commit/08c55e703573f3c11532228d2c626f7b7f16228f) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(DML): Add a new translatable property modifier applicable on text

- Updated dependencies []:
  - @medusajs/deps@2.12.5

## 2.12.4

### Patch Changes

- [#14388](https://github.com/medusajs/medusa/pull/14388) [`bf4cc12545edc5bf249edc6ecec115c5f7a2b31f`](https://github.com/medusajs/medusa/commit/bf4cc12545edc5bf249edc6ecec115c5f7a2b31f) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(core-flows,utils): Shipping options workflow events emission

- [#14395](https://github.com/medusajs/medusa/pull/14395) [`001923da2bbebb3d42373f0f66e517830d9c0187`](https://github.com/medusajs/medusa/commit/001923da2bbebb3d42373f0f66e517830d9c0187) Thanks [@peterlgh7](https://github.com/peterlgh7)! - add Medusa Cloud auth provider

- [#14417](https://github.com/medusajs/medusa/pull/14417) [`43305a562cfba914654da056b0a7e03c40849678`](https://github.com/medusajs/medusa/commit/43305a562cfba914654da056b0a7e03c40849678) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,utils,core-flows): add reset password metdata

- Updated dependencies []:
  - @medusajs/deps@2.12.4

## 2.12.3

### Patch Changes

- [#14225](https://github.com/medusajs/medusa/pull/14225) [`b3cb904e9bce3bfad649e500a9e1be0c9bff0e1a`](https://github.com/medusajs/medusa/commit/b3cb904e9bce3bfad649e500a9e1be0c9bff0e1a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(utils): currency epsilon

- [#14315](https://github.com/medusajs/medusa/pull/14315) [`d813fc4ff91e98b475a4eae11780ddc00caf66a8`](https://github.com/medusajs/medusa/commit/d813fc4ff91e98b475a4eae11780ddc00caf66a8) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Migration generator fix generated import

- Updated dependencies []:
  - @medusajs/deps@2.12.3

## 2.12.2

### Patch Changes

- [#14237](https://github.com/medusajs/medusa/pull/14237) [`4dbf46f2cb64240092843ebfdef766ec5b2a7116`](https://github.com/medusajs/medusa/commit/4dbf46f2cb64240092843ebfdef766ec5b2a7116) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(utils): avoid inflating refundable_total for tax inclusive pricing

- [#14277](https://github.com/medusajs/medusa/pull/14277) [`a78f68fa46dceb8e201fe60e770bd9ea654390d8`](https://github.com/medusajs/medusa/commit/a78f68fa46dceb8e201fe60e770bd9ea654390d8) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(utils,core-flows): add events constant for translations and use it in workflows

- [#14074](https://github.com/medusajs/medusa/pull/14074) [`fe49b567d6d55ae224095c06c710d31d40887653`](https://github.com/medusajs/medusa/commit/fe49b567d6d55ae224095c06c710d31d40887653) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Backend HMR (expriemental)

- [#14218](https://github.com/medusajs/medusa/pull/14218) [`b517137466726c15d5e31ab0c9f42aa57af90c4e`](https://github.com/medusajs/medusa/commit/b517137466726c15d5e31ab0c9f42aa57af90c4e) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(utils): fix error when generating migrations for a module with existing snapshot

- [#14190](https://github.com/medusajs/medusa/pull/14190) [`fd3965974dc0b750d377ff621387d34611760957`](https://github.com/medusajs/medusa/commit/fd3965974dc0b750d377ff621387d34611760957) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Pluralized props for list readonly link

- Updated dependencies []:
  - @medusajs/deps@2.12.2

## 2.12.1

### Patch Changes

- [#14196](https://github.com/medusajs/medusa/pull/14196) [`391d8dc6cd50c79b678059fdeb7774a72e243143`](https://github.com/medusajs/medusa/commit/391d8dc6cd50c79b678059fdeb7774a72e243143) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): event emitting

- Updated dependencies []:
  - @medusajs/deps@2.12.1

## 2.12.0

### Patch Changes

- [#13306](https://github.com/medusajs/medusa/pull/13306) [`78842af1c30de9c7561f10b4129aba4e1f30db27`](https://github.com/medusajs/medusa/commit/78842af1c30de9c7561f10b4129aba4e1f30db27) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix: Compute "virtual" adjustments for order previews

- [#13760](https://github.com/medusajs/medusa/pull/13760) [`536a3f802c92960b1eab48c37db25a8c542fd231`](https://github.com/medusajs/medusa/commit/536a3f802c92960b1eab48c37db25a8c542fd231) Thanks [@fPolic](https://github.com/fPolic)! - feat: promotion usage limit

- [#14036](https://github.com/medusajs/medusa/pull/14036) [`e59cdae3365981339d55ec01224f09995250e67d`](https://github.com/medusajs/medusa/commit/e59cdae3365981339d55ec01224f09995250e67d) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): Proper schema usage when running migrations

- [`9d9d0397a88c398683f75ac3d6f539c1a686d278`](undefined) - fix(): Index integration tests flackyness

- Updated dependencies []:
  - @medusajs/deps@2.12.0

## 2.11.3

### Patch Changes

- [#13910](https://github.com/medusajs/medusa/pull/13910) [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Dependencies cleanup and improvements

- [#13940](https://github.com/medusajs/medusa/pull/13940) [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Cleanup and organize deps

- [#13938](https://github.com/medusajs/medusa/pull/13938) [`e66f7cf59e516f12e5446e191e9fdd1aede9c8ab`](https://github.com/medusajs/medusa/commit/e66f7cf59e516f12e5446e191e9fdd1aede9c8ab) Thanks [@peterlgh7](https://github.com/peterlgh7)! - quote column names in created indexes

- [#13932](https://github.com/medusajs/medusa/pull/13932) [`37563987b8fe75c9acfe62957a33e8398977647a`](https://github.com/medusajs/medusa/commit/37563987b8fe75c9acfe62957a33e8398977647a) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Fix dependencies vulnerabilities

- [#13898](https://github.com/medusajs/medusa/pull/13898) [`13d7d15be594ca413785eebe8f86b47c36cb9830`](https://github.com/medusajs/medusa/commit/13d7d15be594ca413785eebe8f86b47c36cb9830) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(modules-sdk): parallel migrations

- Updated dependencies [[`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d), [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff)]:
  - @medusajs/deps@2.11.3

## 2.11.2

### Patch Changes

- [#13781](https://github.com/medusajs/medusa/pull/13781) [`cc2614ded7f83cdbe7e7f7f809d05f5ab6059fe4`](https://github.com/medusajs/medusa/commit/cc2614ded7f83cdbe7e7f7f809d05f5ab6059fe4) Thanks [@peterlgh7](https://github.com/peterlgh7)! - add Medusa Cloud Email provider

- [#13911](https://github.com/medusajs/medusa/pull/13911) [`66bbe39a8ee812ae88b7f06f7d911b8254b1c87e`](https://github.com/medusajs/medusa/commit/66bbe39a8ee812ae88b7f06f7d911b8254b1c87e) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Throw on migration up/down fail

- [#13913](https://github.com/medusajs/medusa/pull/13913) [`c9701c70da33bb81aca1560ac5b96ea53fb61060`](https://github.com/medusajs/medusa/commit/c9701c70da33bb81aca1560ac5b96ea53fb61060) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(utils): db migration big number default value

- [#13893](https://github.com/medusajs/medusa/pull/13893) [`6d7ba778f5ace76350ac6f249b855b21fb43a03e`](https://github.com/medusajs/medusa/commit/6d7ba778f5ace76350ac6f249b855b21fb43a03e) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Generate migrations with correct mikro orm import path

- [#13879](https://github.com/medusajs/medusa/pull/13879) [`1defb3c29bfe018fd5f89b5a9e27fc8a31d72cdd`](https://github.com/medusajs/medusa/commit/1defb3c29bfe018fd5f89b5a9e27fc8a31d72cdd) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Inject sandbox handle in cloud config

- Updated dependencies []:
  - @medusajs/deps@2.11.2

## 2.11.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/deps@2.11.1

## 2.11.0

### Patch Changes

- [#13439](https://github.com/medusajs/medusa/pull/13439) [`12a96a7c7015f011f5e29a1d387f835e514ba536`](https://github.com/medusajs/medusa/commit/12a96a7c7015f011f5e29a1d387f835e514ba536) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Move peer deps into a single package and re export from framework

- [#13703](https://github.com/medusajs/medusa/pull/13703) [`c61f3150c138de016c6886e79d79984bc267273c`](https://github.com/medusajs/medusa/commit/c61f3150c138de016c6886e79d79984bc267273c) Thanks [@willbouch](https://github.com/willbouch)! - fix(medusa,utils,types): inventory management nullable

- [#13585](https://github.com/medusajs/medusa/pull/13585) [`45f180a2b558edcf69603f3d8da983e92c4e212d`](https://github.com/medusajs/medusa/commit/45f180a2b558edcf69603f3d8da983e92c4e212d) Thanks [@aldo-roman](https://github.com/aldo-roman)! - Fix autogenerated type for float attributes

- [#13451](https://github.com/medusajs/medusa/pull/13451) [`7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1`](https://github.com/medusajs/medusa/commit/7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1) Thanks [@fPolic](https://github.com/fPolic)! - feat: support limiting promotion usage by attribute

- [#13435](https://github.com/medusajs/medusa/pull/13435) [`b9d6f73320c36c53235b12fb8397b30a448917f0`](https://github.com/medusajs/medusa/commit/b9d6f73320c36c53235b12fb8397b30a448917f0) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(): distributed caching

- [#13663](https://github.com/medusajs/medusa/pull/13663) [`51859c38a728c5f05cf30f09f4c6a55657895de7`](https://github.com/medusajs/medusa/commit/51859c38a728c5f05cf30f09f4c6a55657895de7) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Default caching configuration and gracefull redis error handling

- [#13680](https://github.com/medusajs/medusa/pull/13680) [`41651721450c99e5f38cfbb87a6a47ab067ece86`](https://github.com/medusajs/medusa/commit/41651721450c99e5f38cfbb87a6a47ab067ece86) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Test strategy

- [#13724](https://github.com/medusajs/medusa/pull/13724) [`a61d1825eaef4bece20704fe6ae21d9da841b2f2`](https://github.com/medusajs/medusa/commit/a61d1825eaef4bece20704fe6ae21d9da841b2f2) Thanks [@willbouch](https://github.com/willbouch)! - fix(utils,core-flows): fix import erasing tags, categories and others

- [#13450](https://github.com/medusajs/medusa/pull/13450) [`8ece06d8ed6a197ebb370918c49a3ec5c21dd186`](https://github.com/medusajs/medusa/commit/8ece06d8ed6a197ebb370918c49a3ec5c21dd186) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Upgrade mikro orm 6.5.4

- [#13580](https://github.com/medusajs/medusa/pull/13580) [`fc67fd0b36f53f0c0897df54ecea02061e65e816`](https://github.com/medusajs/medusa/commit/fc67fd0b36f53f0c0897df54ecea02061e65e816) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(utils): make upsert with replace more efficient

- [#13712](https://github.com/medusajs/medusa/pull/13712) [`c54c5ed6de2c9686f89aeef86c5c607c4b5f1cf3`](https://github.com/medusajs/medusa/commit/c54c5ed6de2c9686f89aeef86c5c607c4b5f1cf3) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): improve cart operations + Mikro orm 6.4.16

- [#13568](https://github.com/medusajs/medusa/pull/13568) [`92d30b28f45b4037cd73c180c8f257070cf49bd4`](https://github.com/medusajs/medusa/commit/92d30b28f45b4037cd73c180c8f257070cf49bd4) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): remove ssl_mode from url and also use sslmode

- Updated dependencies [[`0cbd9f0bc315b3eda1770ac301061f1576856387`](https://github.com/medusajs/medusa/commit/0cbd9f0bc315b3eda1770ac301061f1576856387), [`12a96a7c7015f011f5e29a1d387f835e514ba536`](https://github.com/medusajs/medusa/commit/12a96a7c7015f011f5e29a1d387f835e514ba536), [`41651721450c99e5f38cfbb87a6a47ab067ece86`](https://github.com/medusajs/medusa/commit/41651721450c99e5f38cfbb87a6a47ab067ece86), [`fc67fd0b36f53f0c0897df54ecea02061e65e816`](https://github.com/medusajs/medusa/commit/fc67fd0b36f53f0c0897df54ecea02061e65e816), [`c54c5ed6de2c9686f89aeef86c5c607c4b5f1cf3`](https://github.com/medusajs/medusa/commit/c54c5ed6de2c9686f89aeef86c5c607c4b5f1cf3), [`02b6d013822b9665f868c4ea6d1b5cfe58723459`](https://github.com/medusajs/medusa/commit/02b6d013822b9665f868c4ea6d1b5cfe58723459)]:
  - @medusajs/deps@2.11.0

## 2.10.3

### Patch Changes

- [#13516](https://github.com/medusajs/medusa/pull/13516) [`25634b038248ab6501af719faec79b59b496bada`](https://github.com/medusajs/medusa/commit/25634b038248ab6501af719faec79b59b496bada) Thanks [@adrien2p](https://github.com/adrien2p)! - test(): test dynamic max workers and improve CI

- [#13497](https://github.com/medusajs/medusa/pull/13497) [`9563ee446f2b3a2e0cd4a4a33959ed55be5f268a`](https://github.com/medusajs/medusa/commit/9563ee446f2b3a2e0cd4a4a33959ed55be5f268a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(utils): subtotal calculation discounting returned items

- Updated dependencies [[`2a29c6f82c73ff6720cc21e885125c984419226c`](https://github.com/medusajs/medusa/commit/2a29c6f82c73ff6720cc21e885125c984419226c), [`9563ee446f2b3a2e0cd4a4a33959ed55be5f268a`](https://github.com/medusajs/medusa/commit/9563ee446f2b3a2e0cd4a4a33959ed55be5f268a), [`88748ba09d6578608d3d9858718fbbfba956f67b`](https://github.com/medusajs/medusa/commit/88748ba09d6578608d3d9858718fbbfba956f67b)]:
  - @medusajs/types@2.10.3

## 2.10.2

### Patch Changes

- [#13296](https://github.com/medusajs/medusa/pull/13296) [`e8822f3e693bde33fdfd8b0d6140b4e59b40af98`](https://github.com/medusajs/medusa/commit/e8822f3e693bde33fdfd8b0d6140b4e59b40af98) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Module Internal Events

- [#13312](https://github.com/medusajs/medusa/pull/13312) [`b4c0f131b70ba950339c1ca4d81b5ce062a588a3`](https://github.com/medusajs/medusa/commit/b4c0f131b70ba950339c1ca4d81b5ce062a588a3) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(framework): load custom flags before medusa config

- [#13394](https://github.com/medusajs/medusa/pull/13394) [`faae150a589bb29d08719ebb1d2617234e1f5e3a`](https://github.com/medusajs/medusa/commit/faae150a589bb29d08719ebb1d2617234e1f5e3a) Thanks [@willbouch](https://github.com/willbouch)! - fix(utils): big bumber should give numeric value of 0 for small numbers

- [#13413](https://github.com/medusajs/medusa/pull/13413) [`55a35e47218c65190e36a1a6088031890edc1b14`](https://github.com/medusajs/medusa/commit/55a35e47218c65190e36a1a6088031890edc1b14) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(workflows-sdk, utils): Prevent unnecessary serialization

- [#13325](https://github.com/medusajs/medusa/pull/13325) [`b85a46e85bb741b942e7fa23bef48f447d2b7c5a`](https://github.com/medusajs/medusa/commit/b85a46e85bb741b942e7fa23bef48f447d2b7c5a) Thanks [@adrien2p](https://github.com/adrien2p)! - Chore/faster serialization

- [#13421](https://github.com/medusajs/medusa/pull/13421) [`8e5c22a8e8c54daa313b4685e453e49699d75e9a`](https://github.com/medusajs/medusa/commit/8e5c22a8e8c54daa313b4685e453e49699d75e9a) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Improve workflows sdk tooling

- [#13313](https://github.com/medusajs/medusa/pull/13313) [`2f6edf367abb9d3e71f398c3b98a749b73517ea6`](https://github.com/medusajs/medusa/commit/2f6edf367abb9d3e71f398c3b98a749b73517ea6) Thanks [@willbouch](https://github.com/willbouch)! - feat(dashboard,cart,types,utils): refine order details summary

- [#13458](https://github.com/medusajs/medusa/pull/13458) [`0700a2448c54438482cd3b422e66c591bc5c1df8`](https://github.com/medusajs/medusa/commit/0700a2448c54438482cd3b422e66c591bc5c1df8) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Remove extra manager fork

- [#13462](https://github.com/medusajs/medusa/pull/13462) [`823a5c75ff97cf0acbd4ddf00f43ab3b49f0f210`](https://github.com/medusajs/medusa/commit/823a5c75ff97cf0acbd4ddf00f43ab3b49f0f210) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix/order module index

- [#13178](https://github.com/medusajs/medusa/pull/13178) [`1b681a79da02aec3f872baa2213a4b2423d73e97`](https://github.com/medusajs/medusa/commit/1b681a79da02aec3f872baa2213a4b2423d73e97) Thanks [@Amirkhon](https://github.com/Amirkhon)! - feat(dashboard,currency): added Tajikistani somoni currency

- Updated dependencies [[`0000ed69982b95f4bff80fd6182347291d25f7b8`](https://github.com/medusajs/medusa/commit/0000ed69982b95f4bff80fd6182347291d25f7b8), [`d7692100e7a2b2f078756cac9ca2b33784d3d1ff`](https://github.com/medusajs/medusa/commit/d7692100e7a2b2f078756cac9ca2b33784d3d1ff), [`6634765cedc68f605f005766845350d611db142c`](https://github.com/medusajs/medusa/commit/6634765cedc68f605f005766845350d611db142c), [`2f6edf367abb9d3e71f398c3b98a749b73517ea6`](https://github.com/medusajs/medusa/commit/2f6edf367abb9d3e71f398c3b98a749b73517ea6)]:
  - @medusajs/types@2.10.2

## 2.10.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/types@2.10.1

## 2.10.0

### Minor Changes

- [#13225](https://github.com/medusajs/medusa/pull/13225) [`fd4e79142880f1b2da63a38adef8c647da9c48e4`](https://github.com/medusajs/medusa/commit/fd4e79142880f1b2da63a38adef8c647da9c48e4) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(utils): auto generated update method return

### Patch Changes

- [#13283](https://github.com/medusajs/medusa/pull/13283) [`e413cfefc2e0579ba7c5299dc4f4270310e39c2c`](https://github.com/medusajs/medusa/commit/e413cfefc2e0579ba7c5299dc4f4270310e39c2c) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: define file config and improved feature flag support

- [#13199](https://github.com/medusajs/medusa/pull/13199) [`3cc512ef39b6d64b1fe04c1bcdb2e23fa03526f6`](https://github.com/medusajs/medusa/commit/3cc512ef39b6d64b1fe04c1bcdb2e23fa03526f6) Thanks [@riqwan](https://github.com/riqwan)! - fix(utils): fix promotion case of each allocation not applying its amount

- [#13314](https://github.com/medusajs/medusa/pull/13314) [`cbaa40374480a6254d9e568c3003517308be0a44`](https://github.com/medusajs/medusa/commit/cbaa40374480a6254d9e568c3003517308be0a44) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Enable draft order plugin by default

- [#13200](https://github.com/medusajs/medusa/pull/13200) [`cbfe646ce14d8436adbaa72cda95d38e6cdcd908`](https://github.com/medusajs/medusa/commit/cbfe646ce14d8436adbaa72cda95d38e6cdcd908) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(utils): round to zero promotions and credit lines

- [#13281](https://github.com/medusajs/medusa/pull/13281) [`fc4925327334c540c0125a91e81794c3c1f340e7`](https://github.com/medusajs/medusa/commit/fc4925327334c540c0125a91e81794c3c1f340e7) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(core, event-bus): Compensate emit event step utility

- [#13156](https://github.com/medusajs/medusa/pull/13156) [`e2213448ac9eb93318570fde2807a3036108d44b`](https://github.com/medusajs/medusa/commit/e2213448ac9eb93318570fde2807a3036108d44b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: custom logger on medusa-config

- [#13191](https://github.com/medusajs/medusa/pull/13191) [`34c3c14e0a1491ab80473605018b97981544167d`](https://github.com/medusajs/medusa/commit/34c3c14e0a1491ab80473605018b97981544167d) Thanks [@willbouch](https://github.com/willbouch)! - chore(types, api): support shipping option type api endpoints

- Updated dependencies [[`486621383a79e83c831933c1a0ffdae58a695cb0`](https://github.com/medusajs/medusa/commit/486621383a79e83c831933c1a0ffdae58a695cb0), [`2f594291ad8d227b499b80a5bfe66f5963d42d6a`](https://github.com/medusajs/medusa/commit/2f594291ad8d227b499b80a5bfe66f5963d42d6a), [`e413cfefc2e0579ba7c5299dc4f4270310e39c2c`](https://github.com/medusajs/medusa/commit/e413cfefc2e0579ba7c5299dc4f4270310e39c2c), [`67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad`](https://github.com/medusajs/medusa/commit/67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad), [`9412669e654c994e2dbee9cf61c18004d79f6475`](https://github.com/medusajs/medusa/commit/9412669e654c994e2dbee9cf61c18004d79f6475), [`f764b3a36471a0ad9e9e05f125183464680e3a2d`](https://github.com/medusajs/medusa/commit/f764b3a36471a0ad9e9e05f125183464680e3a2d), [`fc4925327334c540c0125a91e81794c3c1f340e7`](https://github.com/medusajs/medusa/commit/fc4925327334c540c0125a91e81794c3c1f340e7), [`e2213448ac9eb93318570fde2807a3036108d44b`](https://github.com/medusajs/medusa/commit/e2213448ac9eb93318570fde2807a3036108d44b), [`34c3c14e0a1491ab80473605018b97981544167d`](https://github.com/medusajs/medusa/commit/34c3c14e0a1491ab80473605018b97981544167d), [`492e0189573ffad4977a3559d71f39bf94d8b45d`](https://github.com/medusajs/medusa/commit/492e0189573ffad4977a3559d71f39bf94d8b45d), [`6264a6262b0220c70ad35c0d56a93a39218ccb80`](https://github.com/medusajs/medusa/commit/6264a6262b0220c70ad35c0d56a93a39218ccb80)]:
  - @medusajs/types@2.10.0

## 2.9.0

### Patch Changes

- [#13145](https://github.com/medusajs/medusa/pull/13145) [`a52708769da675e2ade6cb6fe28e1cd9741c562d`](https://github.com/medusajs/medusa/commit/a52708769da675e2ade6cb6fe28e1cd9741c562d) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(utils): avoid limit precision for promotion value

- [#13131](https://github.com/medusajs/medusa/pull/13131) [`51d4751d9502c0996ee5640f29d0253da980082a`](https://github.com/medusajs/medusa/commit/51d4751d9502c0996ee5640f29d0253da980082a) Thanks [@scherddel](https://github.com/scherddel)! - Fix on precision for high quantities for items when promotion is applied

- [#12960](https://github.com/medusajs/medusa/pull/12960) [`1bdf602f1c1da181e2839858d2f7e8aea503573a`](https://github.com/medusajs/medusa/commit/1bdf602f1c1da181e2839858d2f7e8aea503573a) Thanks [@scherddel](https://github.com/scherddel)! - This fixes the discount\_ calculation logic and promotion tax inclusiveness calculation

- [#13106](https://github.com/medusajs/medusa/pull/13106) [`9766570827ebf50d49d8daf956deecce6666a8cc`](https://github.com/medusajs/medusa/commit/9766570827ebf50d49d8daf956deecce6666a8cc) Thanks [@scherddel](https://github.com/scherddel)! - Moved calculation logic from total to original_total to ensure consistent base values

- Updated dependencies [[`f1da73cb588a45afdeb80572d7d59987b5559252`](https://github.com/medusajs/medusa/commit/f1da73cb588a45afdeb80572d7d59987b5559252), [`1bdf602f1c1da181e2839858d2f7e8aea503573a`](https://github.com/medusajs/medusa/commit/1bdf602f1c1da181e2839858d2f7e8aea503573a), [`9766570827ebf50d49d8daf956deecce6666a8cc`](https://github.com/medusajs/medusa/commit/9766570827ebf50d49d8daf956deecce6666a8cc)]:
  - @medusajs/types@2.9.0

## 2.8.8

### Patch Changes

- [#12969](https://github.com/medusajs/medusa/pull/12969) [`7669dbb03e2f65fa76cff1c5b90a0777e475cb47`](https://github.com/medusajs/medusa/commit/7669dbb03e2f65fa76cff1c5b90a0777e475cb47) Thanks [@juanzgc](https://github.com/juanzgc)! - fix: accepted values in import with template

- Updated dependencies [[`468b81c2cbdbc24b26e31bf6e347d3633a4fb4f8`](https://github.com/medusajs/medusa/commit/468b81c2cbdbc24b26e31bf6e347d3633a4fb4f8), [`919c53e44e2c7bb16bc513b5c96c93ac47bd6ce5`](https://github.com/medusajs/medusa/commit/919c53e44e2c7bb16bc513b5c96c93ac47bd6ce5)]:
  - @medusajs/types@2.8.8

## 2.8.7

### Patch Changes

- Updated dependencies [[`42be9a88d61a11db7aebde2d6f4d96d43f54ea79`](https://github.com/medusajs/medusa/commit/42be9a88d61a11db7aebde2d6f4d96d43f54ea79)]:
  - @medusajs/types@2.8.7

## 2.8.6

### Patch Changes

- [#12834](https://github.com/medusajs/medusa/pull/12834) [`95d282e8ef8f2185737d493dea8b6f1677684543`](https://github.com/medusajs/medusa/commit/95d282e8ef8f2185737d493dea8b6f1677684543) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix/test utils events

- Updated dependencies []:
  - @medusajs/types@2.8.6

## 2.8.5

### Patch Changes

- [#12715](https://github.com/medusajs/medusa/pull/12715) [`ab634a14ba709f1b1d12eb4cd5c7f3db6bfe6470`](https://github.com/medusajs/medusa/commit/ab634a14ba709f1b1d12eb4cd5c7f3db6bfe6470) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(utils): medusa internal service returned data should match typings

- [#12803](https://github.com/medusajs/medusa/pull/12803) [`ba1e6595b74ae69f4ee066d545f8def8aff77dd3`](https://github.com/medusajs/medusa/commit/ba1e6595b74ae69f4ee066d545f8def8aff77dd3) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(payment): round currency decimal precision

- [#12713](https://github.com/medusajs/medusa/pull/12713) [`cbf3644eb7c8a24eaed879647b58c9ece3373c0e`](https://github.com/medusajs/medusa/commit/cbf3644eb7c8a24eaed879647b58c9ece3373c0e) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Add retry strategy to database connection

- [#12813](https://github.com/medusajs/medusa/pull/12813) [`d517dbd66a47817d1270c278b03add9a5c4244cb`](https://github.com/medusajs/medusa/commit/d517dbd66a47817d1270c278b03add9a5c4244cb) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Add support for jwt asymetric keys

- [#12412](https://github.com/medusajs/medusa/pull/12412) [`2621f00bb035a6b909f9498a2bc98fdba8570ba9`](https://github.com/medusajs/medusa/commit/2621f00bb035a6b909f9498a2bc98fdba8570ba9) Thanks [@fPolic](https://github.com/fPolic)! - feat(promotion, dashboard, core-flows, cart, types, utils, medusa): tax inclusive promotions

- [#12795](https://github.com/medusajs/medusa/pull/12795) [`316a325b63e92003df25452faf88e577e9133064`](https://github.com/medusajs/medusa/commit/316a325b63e92003df25452faf88e577e9133064) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(workflow-engine-\*): Cleanup expired executions

- Updated dependencies [[`6ca755ede7bfe3211464447412ca0d97e1207742`](https://github.com/medusajs/medusa/commit/6ca755ede7bfe3211464447412ca0d97e1207742), [`d517dbd66a47817d1270c278b03add9a5c4244cb`](https://github.com/medusajs/medusa/commit/d517dbd66a47817d1270c278b03add9a5c4244cb), [`b316924572fc2cf529e0d91b84955da20b34248a`](https://github.com/medusajs/medusa/commit/b316924572fc2cf529e0d91b84955da20b34248a), [`820a936b9836ae83e7a45de1e1ed0488d8cde2fd`](https://github.com/medusajs/medusa/commit/820a936b9836ae83e7a45de1e1ed0488d8cde2fd), [`44d1d186890cd44b20e41b60d1e217bc3d4b2a51`](https://github.com/medusajs/medusa/commit/44d1d186890cd44b20e41b60d1e217bc3d4b2a51), [`2621f00bb035a6b909f9498a2bc98fdba8570ba9`](https://github.com/medusajs/medusa/commit/2621f00bb035a6b909f9498a2bc98fdba8570ba9), [`bd6d9777c50d69115a20334a103a8ab9997b259d`](https://github.com/medusajs/medusa/commit/bd6d9777c50d69115a20334a103a8ab9997b259d)]:
  - @medusajs/types@2.8.5

## 2.8.4

### Patch Changes

- [#12614](https://github.com/medusajs/medusa/pull/12614) [`791276e80f5745c8885352b7979c0faa979110f4`](https://github.com/medusajs/medusa/commit/791276e80f5745c8885352b7979c0faa979110f4) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: introduce bulkDelete method for IFileProvider

- [#12636](https://github.com/medusajs/medusa/pull/12636) [`3d65807d9924c057ccce6ccaf1c6e0eee8e7c245`](https://github.com/medusajs/medusa/commit/3d65807d9924c057ccce6ccaf1c6e0eee8e7c245) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(utils): export payment events in core flows

- [#12592](https://github.com/medusajs/medusa/pull/12592) [`f6f34cc0e419a0c4be0971f13eb59b2a1e3aa31d`](https://github.com/medusajs/medusa/commit/f6f34cc0e419a0c4be0971f13eb59b2a1e3aa31d) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: module import paths to contain unix slash

- [#12646](https://github.com/medusajs/medusa/pull/12646) [`490bd7647fca30951d14c7c78c1b809379ebd870`](https://github.com/medusajs/medusa/commit/490bd7647fca30951d14c7c78c1b809379ebd870) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(core-flows): use cart_id to complete cart on payment webhook and lock cart before completion

- [#12574](https://github.com/medusajs/medusa/pull/12574) [`cf0297f74af1b043363ffbd5a23ca0933097a69d`](https://github.com/medusajs/medusa/commit/cf0297f74af1b043363ffbd5a23ca0933097a69d) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: implement stream based processing of the files

- Updated dependencies [[`791276e80f5745c8885352b7979c0faa979110f4`](https://github.com/medusajs/medusa/commit/791276e80f5745c8885352b7979c0faa979110f4)]:
  - @medusajs/types@2.8.4

## 2.8.3

### Patch Changes

- [#12501](https://github.com/medusajs/medusa/pull/12501) [`59bbff62d81861282d55a32d6c0c45285203c4e0`](https://github.com/medusajs/medusa/commit/59bbff62d81861282d55a32d6c0c45285203c4e0) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(index): limit partition table name and index enum fields

- [#12518](https://github.com/medusajs/medusa/pull/12518) [`85d2b3c992cf361a9a18a14659484c57f4923197`](https://github.com/medusajs/medusa/commit/85d2b3c992cf361a9a18a14659484c57f4923197) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(utils): Missing zod deps

- [#12478](https://github.com/medusajs/medusa/pull/12478) [`c5a6573e26b403b86f53b88c307ea311a1bd9230`](https://github.com/medusajs/medusa/commit/c5a6573e26b403b86f53b88c307ea311a1bd9230) Thanks [@fPolic](https://github.com/fPolic)! - fix(product, utils): handle metadata key deletion on product update

- Updated dependencies [[`4e49cebcf0f053cb89012276e935a7ec62a12046`](https://github.com/medusajs/medusa/commit/4e49cebcf0f053cb89012276e935a7ec62a12046), [`59bbff62d81861282d55a32d6c0c45285203c4e0`](https://github.com/medusajs/medusa/commit/59bbff62d81861282d55a32d6c0c45285203c4e0), [`52bd9f9a53f6e63e5fbe0beb1fb2c650d88f7c88`](https://github.com/medusajs/medusa/commit/52bd9f9a53f6e63e5fbe0beb1fb2c650d88f7c88), [`ebe5cc7acddb7c61dc82fd8ec7f2fe3779104a99`](https://github.com/medusajs/medusa/commit/ebe5cc7acddb7c61dc82fd8ec7f2fe3779104a99)]:
  - @medusajs/types@2.8.3

## 2.8.2

### Patch Changes

- [#12473](https://github.com/medusajs/medusa/pull/12473) [`e149a998862272fff80573a623c4d9010cb0b104`](https://github.com/medusajs/medusa/commit/e149a998862272fff80573a623c4d9010cb0b104) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: define validators and use normalize-products step

- Updated dependencies [[`b2984f48f5fcf535177c98e921baa58fcf45bbe5`](https://github.com/medusajs/medusa/commit/b2984f48f5fcf535177c98e921baa58fcf45bbe5)]:
  - @medusajs/types@2.8.2

## 2.8.1

### Patch Changes

- [#12396](https://github.com/medusajs/medusa/pull/12396) [`4602163b568962f8115b83971d67a6c55c2b8a98`](https://github.com/medusajs/medusa/commit/4602163b568962f8115b83971d67a6c55c2b8a98) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: create CSV normalizer to normalize a CSV file

- [#12486](https://github.com/medusajs/medusa/pull/12486) [`142a1f0a5be60d2cc013ecb174bca7b1381c6551`](https://github.com/medusajs/medusa/commit/142a1f0a5be60d2cc013ecb174bca7b1381c6551) Thanks [@peterlgh7](https://github.com/peterlgh7)! - fix returned updates order in upsertWithReplace

- Updated dependencies []:
  - @medusajs/types@2.8.1

## 2.8.0

### Patch Changes

- [#12338](https://github.com/medusajs/medusa/pull/12338) [`a53d645f8aab30135baebac29f9645dd35d47632`](https://github.com/medusajs/medusa/commit/a53d645f8aab30135baebac29f9645dd35d47632) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(core-flows,utils): move fulfillment workflow events

- [#12320](https://github.com/medusajs/medusa/pull/12320) [`89859987565b1fc872c7cd1c6d23144b97f454bc`](https://github.com/medusajs/medusa/commit/89859987565b1fc872c7cd1c6d23144b97f454bc) Thanks [@fPolic](https://github.com/fPolic)! - feat(core-flows,utils): add Order Edit events

- [#12425](https://github.com/medusajs/medusa/pull/12425) [`fff285f8d2f3020a24b83066fa4250130fdcf229`](https://github.com/medusajs/medusa/commit/fff285f8d2f3020a24b83066fa4250130fdcf229) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(core-flows): Emit cart trasnferred customer

- [#11898](https://github.com/medusajs/medusa/pull/11898) [`b868a4ef4deb7df09d6156a907f4c883cd55a3fd`](https://github.com/medusajs/medusa/commit/b868a4ef4deb7df09d6156a907f4c883cd55a3fd) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(index): add filterable fields to link definition

- [#12418](https://github.com/medusajs/medusa/pull/12418) [`9d4bc81d0f1ac1614ab1ffb95d708f622c836ceb`](https://github.com/medusajs/medusa/commit/9d4bc81d0f1ac1614ab1ffb95d708f622c836ceb) Thanks [@Betanoir](https://github.com/Betanoir)! - fix(plugins): plugin admin folder loading with backslash on Windows

- Updated dependencies [[`9cedeb182dc19d6127b602fc06e4b8850490e2a9`](https://github.com/medusajs/medusa/commit/9cedeb182dc19d6127b602fc06e4b8850490e2a9), [`b868a4ef4deb7df09d6156a907f4c883cd55a3fd`](https://github.com/medusajs/medusa/commit/b868a4ef4deb7df09d6156a907f4c883cd55a3fd)]:
  - @medusajs/types@2.8.0

## 2.7.1

### Patch Changes

- [#12157](https://github.com/medusajs/medusa/pull/12157) [`2f6963a5fbea05537680cb1b1f6a2b9822c36325`](https://github.com/medusajs/medusa/commit/2f6963a5fbea05537680cb1b1f6a2b9822c36325) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: event group propagation and event managements

- [#12140](https://github.com/medusajs/medusa/pull/12140) [`b8902637251e9ed4f8762ef280659bbab6d967de`](https://github.com/medusajs/medusa/commit/b8902637251e9ed4f8762ef280659bbab6d967de) Thanks [@thetutlage](https://github.com/thetutlage)! - Add support for dynamoDB for storing sessions and some types cleanup

- Updated dependencies [[`e180253d608103cd8dfba8fddd3af2ba6ff2455a`](https://github.com/medusajs/medusa/commit/e180253d608103cd8dfba8fddd3af2ba6ff2455a), [`2f6963a5fbea05537680cb1b1f6a2b9822c36325`](https://github.com/medusajs/medusa/commit/2f6963a5fbea05537680cb1b1f6a2b9822c36325), [`b8902637251e9ed4f8762ef280659bbab6d967de`](https://github.com/medusajs/medusa/commit/b8902637251e9ed4f8762ef280659bbab6d967de), [`1f73281ab88c064404ecf7cc9dd0977dfd369723`](https://github.com/medusajs/medusa/commit/1f73281ab88c064404ecf7cc9dd0977dfd369723)]:
  - @medusajs/types@2.7.1

## 2.7.0

### Patch Changes

- [#12097](https://github.com/medusajs/medusa/pull/12097) [`74381addc3d6af42f0292e778948aabb60a6dad9`](https://github.com/medusajs/medusa/commit/74381addc3d6af42f0292e778948aabb60a6dad9) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Emit events in batch and index process event ids in batch

- [#11720](https://github.com/medusajs/medusa/pull/11720) [`ec56a8bc857a74788df6523af25914da95c4c1d8`](https://github.com/medusajs/medusa/commit/ec56a8bc857a74788df6523af25914da95c4c1d8) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,utils,test-utils,types,framework,dashboard,admin-vite-plugin,admib-bundler): Fix broken plugin dependencies in development server

- [#11771](https://github.com/medusajs/medusa/pull/11771) [`72d2cf92075b3e0849251f233517e2972de1b19c`](https://github.com/medusajs/medusa/commit/72d2cf92075b3e0849251f233517e2972de1b19c) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: workflow retry interval race condition

- [#11767](https://github.com/medusajs/medusa/pull/11767) [`cae47d9e49e9a17d8395f7b390f6ec0a2f9b8dc2`](https://github.com/medusajs/medusa/commit/cae47d9e49e9a17d8395f7b390f6ec0a2f9b8dc2) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add check for uniqueness when creating links with isList=false

- [#12017](https://github.com/medusajs/medusa/pull/12017) [`79cfc1a69ee166fec298aa706b994253a1284520`](https://github.com/medusajs/medusa/commit/79cfc1a69ee166fec298aa706b994253a1284520) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(utils): Enable Redis locking by default in Cloud

- [#11802](https://github.com/medusajs/medusa/pull/11802) [`375c4a5ab1b2805ef2a3d792327c325fa11740a5`](https://github.com/medusajs/medusa/commit/375c4a5ab1b2805ef2a3d792327c325fa11740a5) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: use module name as the snapshot name

- [#12025](https://github.com/medusajs/medusa/pull/12025) [`2f7eb0ee030966844b45dd00b2259e68b9fb0e83`](https://github.com/medusajs/medusa/commit/2f7eb0ee030966844b45dd00b2259e68b9fb0e83) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: validate module names to disallow unallowed characters

- [#11872](https://github.com/medusajs/medusa/pull/11872) [`9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234`](https://github.com/medusajs/medusa/commit/9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,types,utils): make payment optional when cart balance is 0

- [#11992](https://github.com/medusajs/medusa/pull/11992) [`c870a7a1baf7db748a831265f06dd4b7378b262e`](https://github.com/medusajs/medusa/commit/c870a7a1baf7db748a831265f06dd4b7378b262e) Thanks [@riqwan](https://github.com/riqwan)! - fix(promotion,utils): fix case where multiple percentage promotions werent applied

- Updated dependencies [[`74381addc3d6af42f0292e778948aabb60a6dad9`](https://github.com/medusajs/medusa/commit/74381addc3d6af42f0292e778948aabb60a6dad9), [`ec56a8bc857a74788df6523af25914da95c4c1d8`](https://github.com/medusajs/medusa/commit/ec56a8bc857a74788df6523af25914da95c4c1d8), [`95e89a39f347c8af6a5960943af56965bc3a07ba`](https://github.com/medusajs/medusa/commit/95e89a39f347c8af6a5960943af56965bc3a07ba), [`c3440e5e3812e3d1c6b82e9d4e41287398451611`](https://github.com/medusajs/medusa/commit/c3440e5e3812e3d1c6b82e9d4e41287398451611), [`3dba58785fb2d8e79f1ea89daa9e4ab8810821c8`](https://github.com/medusajs/medusa/commit/3dba58785fb2d8e79f1ea89daa9e4ab8810821c8), [`0625f76cd4f040963829b61dcc70563e1d1b7070`](https://github.com/medusajs/medusa/commit/0625f76cd4f040963829b61dcc70563e1d1b7070), [`0cc306bf562d8f1f1f1c09d9658463e2c8def465`](https://github.com/medusajs/medusa/commit/0cc306bf562d8f1f1f1c09d9658463e2c8def465), [`cb6249320e7322e8eabfec8434f1278f8d63e96c`](https://github.com/medusajs/medusa/commit/cb6249320e7322e8eabfec8434f1278f8d63e96c), [`1f8fab36361aa8e473ffe6c411c8598a916a6d3f`](https://github.com/medusajs/medusa/commit/1f8fab36361aa8e473ffe6c411c8598a916a6d3f), [`13e159d8ad7ebb3e6977969b4bb10877d7bb7850`](https://github.com/medusajs/medusa/commit/13e159d8ad7ebb3e6977969b4bb10877d7bb7850), [`9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234`](https://github.com/medusajs/medusa/commit/9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234), [`9ac74eead4760d6c92676d451e6f25c2305b1852`](https://github.com/medusajs/medusa/commit/9ac74eead4760d6c92676d451e6f25c2305b1852)]:
  - @medusajs/types@2.7.0

## 2.6.1

### Patch Changes

- [#11738](https://github.com/medusajs/medusa/pull/11738) [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Remove ranges on Medusa packages

- Updated dependencies [[`b7678983a9b3e5c4d88282054b37b6c517329bd7`](https://github.com/medusajs/medusa/commit/b7678983a9b3e5c4d88282054b37b6c517329bd7)]:
  - @medusajs/types@2.6.1

## 2.6.0

### Patch Changes

- [#11585](https://github.com/medusajs/medusa/pull/11585) [`eeebb35758ea443468dd2355a7ea761dfe24babc`](https://github.com/medusajs/medusa/commit/eeebb35758ea443468dd2355a7ea761dfe24babc) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(product): Remove upsertWithReplace where needed

- [#11636](https://github.com/medusajs/medusa/pull/11636) [`ca6a15717d05de112ca00ca56d65beb2ab0f2598`](https://github.com/medusajs/medusa/commit/ca6a15717d05de112ca00ca56d65beb2ab0f2598) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Add support for extra pool configuration

- [#11618](https://github.com/medusajs/medusa/pull/11618) [`d254b2ddba3fba4fb60e1076a6bc4e7d425bbd30`](https://github.com/medusajs/medusa/commit/d254b2ddba3fba4fb60e1076a6bc4e7d425bbd30) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Improve cascade soft deletetion and update

- [#11601](https://github.com/medusajs/medusa/pull/11601) [`b42f151be31161a5d7a73132ee6794b990403d76`](https://github.com/medusajs/medusa/commit/b42f151be31161a5d7a73132ee6794b990403d76) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Improve internal repository delete algo

- [#11693](https://github.com/medusajs/medusa/pull/11693) [`ab96ad3b8213b117b067ae0ab66b94f74b8bd031`](https://github.com/medusajs/medusa/commit/ab96ad3b8213b117b067ae0ab66b94f74b8bd031) Thanks [@riqwan](https://github.com/riqwan)! - feat(utils): add error message when manager is not found

- Updated dependencies [[`8bb0a25f573c62ca1d1bcd7af184b0d0cf98e125`](https://github.com/medusajs/medusa/commit/8bb0a25f573c62ca1d1bcd7af184b0d0cf98e125), [`698a520729a3045cd13eed5ee0e5120a563e9261`](https://github.com/medusajs/medusa/commit/698a520729a3045cd13eed5ee0e5120a563e9261), [`51b0af193c7dde4899a696a515b59373b465d907`](https://github.com/medusajs/medusa/commit/51b0af193c7dde4899a696a515b59373b465d907), [`93cbc6b6695f236fa39b66169de971228888f1b9`](https://github.com/medusajs/medusa/commit/93cbc6b6695f236fa39b66169de971228888f1b9), [`d1efad9bf05ca80959e8b50d74b74167fc1b0064`](https://github.com/medusajs/medusa/commit/d1efad9bf05ca80959e8b50d74b74167fc1b0064), [`d814d9540e76256be23d733b73cf5a63aa380c8b`](https://github.com/medusajs/medusa/commit/d814d9540e76256be23d733b73cf5a63aa380c8b), [`b42f151be31161a5d7a73132ee6794b990403d76`](https://github.com/medusajs/medusa/commit/b42f151be31161a5d7a73132ee6794b990403d76)]:
  - @medusajs/types@2.6.0

## 2.5.1

### Patch Changes

- [#11399](https://github.com/medusajs/medusa/pull/11399) [`d1cbe4c61ed99bbeccf1be49721e0aa7b74edd71`](https://github.com/medusajs/medusa/commit/d1cbe4c61ed99bbeccf1be49721e0aa7b74edd71) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: relationships to accept ids

- [#11469](https://github.com/medusajs/medusa/pull/11469) [`63f0774569643ffe473daef2fcfd8944954d72c0`](https://github.com/medusajs/medusa/commit/63f0774569643ffe473daef2fcfd8944954d72c0) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(utils): Backport metadata management

- [#11400](https://github.com/medusajs/medusa/pull/11400) [`d6c03ee5427457237e3c739545a8816cc3a3198e`](https://github.com/medusajs/medusa/commit/d6c03ee5427457237e3c739545a8816cc3a3198e) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(utils): custom linkable keys

- [#11431](https://github.com/medusajs/medusa/pull/11431) [`448dbcb5963c732c9c3b822b81330556bcf883cd`](https://github.com/medusajs/medusa/commit/448dbcb5963c732c9c3b822b81330556bcf883cd) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa): index engine feature flag

- [#11468](https://github.com/medusajs/medusa/pull/11468) [`32c5015f563b7d60221a472635b44820fe4ef1f6`](https://github.com/medusajs/medusa/commit/32c5015f563b7d60221a472635b44820fe4ef1f6) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: generate posix paths for migrations

- Updated dependencies [[`22276648ad0aef12206464b555efdce97e316bb4`](https://github.com/medusajs/medusa/commit/22276648ad0aef12206464b555efdce97e316bb4), [`d1cbe4c61ed99bbeccf1be49721e0aa7b74edd71`](https://github.com/medusajs/medusa/commit/d1cbe4c61ed99bbeccf1be49721e0aa7b74edd71), [`1a3843a92a6db83b9249e9c0aece7b3d13a600a9`](https://github.com/medusajs/medusa/commit/1a3843a92a6db83b9249e9c0aece7b3d13a600a9), [`3b4997840e624ef8da1a75744b4bfb5c5a371f7c`](https://github.com/medusajs/medusa/commit/3b4997840e624ef8da1a75744b4bfb5c5a371f7c), [`0c957350a6688c78572361b51c1f16a452a31aed`](https://github.com/medusajs/medusa/commit/0c957350a6688c78572361b51c1f16a452a31aed), [`065df75e7d5b90a4de43873d8c08e1aab65e3fd7`](https://github.com/medusajs/medusa/commit/065df75e7d5b90a4de43873d8c08e1aab65e3fd7), [`47edd01deec79b394552cea349f1e41b7b88723b`](https://github.com/medusajs/medusa/commit/47edd01deec79b394552cea349f1e41b7b88723b)]:
  - @medusajs/types@2.5.1

## 2.5.0

### Patch Changes

- [#11344](https://github.com/medusajs/medusa/pull/11344) [`cb0f065c9dd59fe54a52c337f9b5392723f9db58`](https://github.com/medusajs/medusa/commit/cb0f065c9dd59fe54a52c337f9b5392723f9db58) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(utils): add static identifier to AbstractNotificationProviderService

- [#11216](https://github.com/medusajs/medusa/pull/11216) [`016e332e9b98f316cded6eb999927fc942ce56c5`](https://github.com/medusajs/medusa/commit/016e332e9b98f316cded6eb999927fc942ce56c5) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: make AbstractModuleService create method type-safe

- [#11178](https://github.com/medusajs/medusa/pull/11178) [`a33aebd8957f4bab10afd5e50a810cf738879b0d`](https://github.com/medusajs/medusa/commit/a33aebd8957f4bab10afd5e50a810cf738879b0d) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(indes): full sync

- [#11188](https://github.com/medusajs/medusa/pull/11188) [`c9821171866a5a66ce5b7f0b8a414de48dbcdc7e`](https://github.com/medusajs/medusa/commit/c9821171866a5a66ce5b7f0b8a414de48dbcdc7e) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: always load .env file alongside the environment specific file

- [#11388](https://github.com/medusajs/medusa/pull/11388) [`244cd714b2e8dc742afbefd0d175649f8fc45eed`](https://github.com/medusajs/medusa/commit/244cd714b2e8dc742afbefd0d175649f8fc45eed) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: add foreign keys to the generated query types output

- [#11295](https://github.com/medusajs/medusa/pull/11295) [`3c51709daf07dcdd5563fa08fec2446a42cc8058`](https://github.com/medusajs/medusa/commit/3c51709daf07dcdd5563fa08fec2446a42cc8058) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: map container types for core services to interface

- Updated dependencies [[`6db96c80d05730a9188937599baba2602f4e2a92`](https://github.com/medusajs/medusa/commit/6db96c80d05730a9188937599baba2602f4e2a92), [`9f1a3b2a4214ef23a22972e6d28c5f43f87da353`](https://github.com/medusajs/medusa/commit/9f1a3b2a4214ef23a22972e6d28c5f43f87da353), [`65fae943c9d919f658c8660e5b46626c1b302e31`](https://github.com/medusajs/medusa/commit/65fae943c9d919f658c8660e5b46626c1b302e31), [`f07af7b93c86673e730dc4e5eba8df2572013f9f`](https://github.com/medusajs/medusa/commit/f07af7b93c86673e730dc4e5eba8df2572013f9f), [`3c51709daf07dcdd5563fa08fec2446a42cc8058`](https://github.com/medusajs/medusa/commit/3c51709daf07dcdd5563fa08fec2446a42cc8058)]:
  - @medusajs/types@2.5.0

## 2.4.0

### Minor Changes

- [#10292](https://github.com/medusajs/medusa/pull/10292) [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore: upgrade to mikro-orm 6

### Patch Changes

- [#11136](https://github.com/medusajs/medusa/pull/11136) [`a76208ed0217e5a3993d48e1884e855966691fd8`](https://github.com/medusajs/medusa/commit/a76208ed0217e5a3993d48e1884e855966691fd8) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(utils): patch unique index migration

- [#11047](https://github.com/medusajs/medusa/pull/11047) [`ecc8efcb049f5c77cb7e38c2b6a273860590a5f4`](https://github.com/medusajs/medusa/commit/ecc8efcb049f5c77cb7e38c2b6a273860590a5f4) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(event): Subscriber ID missusage

- [#11048](https://github.com/medusajs/medusa/pull/11048) [`da3906efa42ee729c11696e2d3255a60ac3fa958`](https://github.com/medusajs/medusa/commit/da3906efa42ee729c11696e2d3255a60ac3fa958) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: Unique constraint should account for soft deleted records

- Updated dependencies [[`d4e042e9ad838cfc3b3c83c342afaf76adb281d2`](https://github.com/medusajs/medusa/commit/d4e042e9ad838cfc3b3c83c342afaf76adb281d2), [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547)]:
  - @medusajs/types@2.4.0

## 2.3.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/types@2.3.1

## 2.3.0

### Patch Changes

- [#10880](https://github.com/medusajs/medusa/pull/10880) [`67782350a9da278457c3280c300ebec65bdc6326`](https://github.com/medusajs/medusa/commit/67782350a9da278457c3280c300ebec65bdc6326) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add default retry strategy for redis

- [#10950](https://github.com/medusajs/medusa/pull/10950) [`5eab9e739919594ae7e7e416942ec93d84b699fd`](https://github.com/medusajs/medusa/commit/5eab9e739919594ae7e7e416942ec93d84b699fd) Thanks [@riqwan](https://github.com/riqwan)! - feat(promotion,dashboard,types,utils,medusa): Add statuses to promotions

- [#10895](https://github.com/medusajs/medusa/pull/10895) [`c1930bd6568043d145e34d8360015e7207e18e4a`](https://github.com/medusajs/medusa/commit/c1930bd6568043d145e34d8360015e7207e18e4a) Thanks [@thetutlage](https://github.com/thetutlage)! - Feat/merge plugin modules

- [#10874](https://github.com/medusajs/medusa/pull/10874) [`28febfc6438351fddb5b214b86f96aff89db688e`](https://github.com/medusajs/medusa/commit/28febfc6438351fddb5b214b86f96aff89db688e) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: remove dead code and refactor the logic of resolving plugins

- Updated dependencies [[`ff725090bb4ec848cb82c5411bdc25c4b72252ab`](https://github.com/medusajs/medusa/commit/ff725090bb4ec848cb82c5411bdc25c4b72252ab), [`5eab9e739919594ae7e7e416942ec93d84b699fd`](https://github.com/medusajs/medusa/commit/5eab9e739919594ae7e7e416942ec93d84b699fd), [`c75678d6d41d3b88d07681ad7e24472d6cbde672`](https://github.com/medusajs/medusa/commit/c75678d6d41d3b88d07681ad7e24472d6cbde672), [`c1930bd6568043d145e34d8360015e7207e18e4a`](https://github.com/medusajs/medusa/commit/c1930bd6568043d145e34d8360015e7207e18e4a), [`28febfc6438351fddb5b214b86f96aff89db688e`](https://github.com/medusajs/medusa/commit/28febfc6438351fddb5b214b86f96aff89db688e), [`bc22b81cdf9591912744f448c74d45bcb0f11e0c`](https://github.com/medusajs/medusa/commit/bc22b81cdf9591912744f448c74d45bcb0f11e0c)]:
  - @medusajs/types@2.3.0

## 2.2.0

### Patch Changes

- [#10791](https://github.com/medusajs/medusa/pull/10791) [`ecc09fd77db01fcb7e8eb8e60cd19e16e2b5ea81`](https://github.com/medusajs/medusa/commit/ecc09fd77db01fcb7e8eb8e60cd19e16e2b5ea81) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: generate modules mappings at runtime

- [#10768](https://github.com/medusajs/medusa/pull/10768) [`bbf790ea44d0ce0a128a07e66224735f5a2dccf0`](https://github.com/medusajs/medusa/commit/bbf790ea44d0ce0a128a07e66224735f5a2dccf0) Thanks [@thetutlage](https://github.com/thetutlage)! - Refactor/deprecate remote link

- [#10667](https://github.com/medusajs/medusa/pull/10667) [`47594192b79fbc798cfaf21821b60673745d1374`](https://github.com/medusajs/medusa/commit/47594192b79fbc798cfaf21821b60673745d1374) Thanks [@riqwan](https://github.com/riqwan)! - feat(dashboard,core-flows,types,utils,medusa,order): Order cancelations will refund payments

- Updated dependencies [[`ecc09fd77db01fcb7e8eb8e60cd19e16e2b5ea81`](https://github.com/medusajs/medusa/commit/ecc09fd77db01fcb7e8eb8e60cd19e16e2b5ea81), [`13ddf27c68fc2831b3661940bc5f27bab23ce8c0`](https://github.com/medusajs/medusa/commit/13ddf27c68fc2831b3661940bc5f27bab23ce8c0), [`99a06102a246c119f69d1873f3cdeee9ff1241a0`](https://github.com/medusajs/medusa/commit/99a06102a246c119f69d1873f3cdeee9ff1241a0), [`4f897661eb7a855a881d460c565c2da6459367eb`](https://github.com/medusajs/medusa/commit/4f897661eb7a855a881d460c565c2da6459367eb), [`5e9d86d75d1f2745c24a4bcd4a5c0df066578ef5`](https://github.com/medusajs/medusa/commit/5e9d86d75d1f2745c24a4bcd4a5c0df066578ef5), [`47594192b79fbc798cfaf21821b60673745d1374`](https://github.com/medusajs/medusa/commit/47594192b79fbc798cfaf21821b60673745d1374), [`0559d54c18d2e79c78c2b9a348b9873d1a786dea`](https://github.com/medusajs/medusa/commit/0559d54c18d2e79c78c2b9a348b9873d1a786dea)]:
  - @medusajs/types@2.2.0

## 2.1.3

### Patch Changes

- [#10617](https://github.com/medusajs/medusa/pull/10617) [`100da64242838739816351ed259461f2d7c258e3`](https://github.com/medusajs/medusa/commit/100da64242838739816351ed259461f2d7c258e3) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: fulfillment module DML

- [#10408](https://github.com/medusajs/medusa/pull/10408) [`c9b8db04c1b35f1cf129bb9ad74789fbc2881815`](https://github.com/medusajs/medusa/commit/c9b8db04c1b35f1cf129bb9ad74789fbc2881815) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Support custom line items

- Updated dependencies [[`100da64242838739816351ed259461f2d7c258e3`](https://github.com/medusajs/medusa/commit/100da64242838739816351ed259461f2d7c258e3), [`c9b8db04c1b35f1cf129bb9ad74789fbc2881815`](https://github.com/medusajs/medusa/commit/c9b8db04c1b35f1cf129bb9ad74789fbc2881815), [`2ad08c4c440706dd2ffe2215807b89ee4a7f325b`](https://github.com/medusajs/medusa/commit/2ad08c4c440706dd2ffe2215807b89ee4a7f325b), [`048620884b5d458b109ac496e7a2056c202bd459`](https://github.com/medusajs/medusa/commit/048620884b5d458b109ac496e7a2056c202bd459)]:
  - @medusajs/types@2.1.3

## 2.1.2

### Patch Changes

- [#10569](https://github.com/medusajs/medusa/pull/10569) [`729eb5da7b6daf9781b8bdcbc2fab344e942d444`](https://github.com/medusajs/medusa/commit/729eb5da7b6daf9781b8bdcbc2fab344e942d444) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore: Inventory DML

- [#10499](https://github.com/medusajs/medusa/pull/10499) [`16d27ea6e4c2e4290820fe2328f08557534fcb8f`](https://github.com/medusajs/medusa/commit/16d27ea6e4c2e4290820fe2328f08557534fcb8f) Thanks [@thetutlage](https://github.com/thetutlage)! - Feat/customer dml

- [#10410](https://github.com/medusajs/medusa/pull/10410) [`fad85a9d293acee1dae784afa223a080b9b8b85b`](https://github.com/medusajs/medusa/commit/fad85a9d293acee1dae784afa223a080b9b8b85b) Thanks [@thetutlage](https://github.com/thetutlage)! - refactor: migrate promotion module

- [#10551](https://github.com/medusajs/medusa/pull/10551) [`885c82ded63e504739bf39a113f820c87c9e2d52`](https://github.com/medusajs/medusa/commit/885c82ded63e504739bf39a113f820c87c9e2d52) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add support for float properties

- [#10579](https://github.com/medusajs/medusa/pull/10579) [`6367bccde88158d524dfa01e5a8123ffa3461c10`](https://github.com/medusajs/medusa/commit/6367bccde88158d524dfa01e5a8123ffa3461c10) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, pricing): Cart workflows handle pricing context accurately

- Updated dependencies [[`729eb5da7b6daf9781b8bdcbc2fab344e942d444`](https://github.com/medusajs/medusa/commit/729eb5da7b6daf9781b8bdcbc2fab344e942d444), [`16d27ea6e4c2e4290820fe2328f08557534fcb8f`](https://github.com/medusajs/medusa/commit/16d27ea6e4c2e4290820fe2328f08557534fcb8f), [`885c82ded63e504739bf39a113f820c87c9e2d52`](https://github.com/medusajs/medusa/commit/885c82ded63e504739bf39a113f820c87c9e2d52), [`90ad2566fdde2215447100d10c3fe9b17ce826b5`](https://github.com/medusajs/medusa/commit/90ad2566fdde2215447100d10c3fe9b17ce826b5), [`6367bccde88158d524dfa01e5a8123ffa3461c10`](https://github.com/medusajs/medusa/commit/6367bccde88158d524dfa01e5a8123ffa3461c10)]:
  - @medusajs/types@2.1.2

## 2.1.1

### Patch Changes

- [#10459](https://github.com/medusajs/medusa/pull/10459) [`90ae187e097c42a224c701f31cbc2924ea6ee86b`](https://github.com/medusajs/medusa/commit/90ae187e097c42a224c701f31cbc2924ea6ee86b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix: when/then step name

- [#10477](https://github.com/medusajs/medusa/pull/10477) [`0a077d48e14976bafcf19705fc48e66756362fd6`](https://github.com/medusajs/medusa/commit/0a077d48e14976bafcf19705fc48e66756362fd6) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(workflow-engine): Migrate to DML

- [#10442](https://github.com/medusajs/medusa/pull/10442) [`90d7f4ff3949ade9f6a7335c9611aae6633be908`](https://github.com/medusajs/medusa/commit/90d7f4ff3949ade9f6a7335c9611aae6633be908) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(utils): DML#hasOne allow mappedBy to not be defined

- [#10476](https://github.com/medusajs/medusa/pull/10476) [`f65a3cc06df9faca3615f30eb4d3bf889efa5765`](https://github.com/medusajs/medusa/commit/f65a3cc06df9faca3615f30eb4d3bf889efa5765) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix: avoid optional fields on graphql generated types

- [#10415](https://github.com/medusajs/medusa/pull/10415) [`b160fd3cbf6edf06702fa15b694709375557d188`](https://github.com/medusajs/medusa/commit/b160fd3cbf6edf06702fa15b694709375557d188) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(utils): DML one to one definition

- [#10385](https://github.com/medusajs/medusa/pull/10385) [`0a16efa4266f93302b31589349e777bc8d24dc07`](https://github.com/medusajs/medusa/commit/0a16efa4266f93302b31589349e777bc8d24dc07) Thanks [@thetutlage](https://github.com/thetutlage)! - refactor: migrate cart module to DML

- [#10482](https://github.com/medusajs/medusa/pull/10482) [`69f4c4f4e06022990fcd9c66d8f1a68ff0ff97b1`](https://github.com/medusajs/medusa/commit/69f4c4f4e06022990fcd9c66d8f1a68ff0ff97b1) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore: index module to DML

- Updated dependencies [[`a1a1e0e789424546443ce195b95f652d081d7b3b`](https://github.com/medusajs/medusa/commit/a1a1e0e789424546443ce195b95f652d081d7b3b), [`16663ec8132e99bac7fbfe2adda542a5294d2384`](https://github.com/medusajs/medusa/commit/16663ec8132e99bac7fbfe2adda542a5294d2384), [`559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a`](https://github.com/medusajs/medusa/commit/559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a), [`864f53011b892e1ed0abee2e241b662eccef7e6d`](https://github.com/medusajs/medusa/commit/864f53011b892e1ed0abee2e241b662eccef7e6d), [`69f4c4f4e06022990fcd9c66d8f1a68ff0ff97b1`](https://github.com/medusajs/medusa/commit/69f4c4f4e06022990fcd9c66d8f1a68ff0ff97b1)]:
  - @medusajs/types@2.1.1

## 2.1.0

### Patch Changes

- [#10360](https://github.com/medusajs/medusa/pull/10360) [`194361b95a0ed2c182e0a3c107fde9b4b6a7bcf7`](https://github.com/medusajs/medusa/commit/194361b95a0ed2c182e0a3c107fde9b4b6a7bcf7) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: do not rely on model loading order to find an implicit owner

- [#10391](https://github.com/medusajs/medusa/pull/10391) [`3e98364bd1631f96846cd3199bf7497702cf5923`](https://github.com/medusajs/medusa/commit/3e98364bd1631f96846cd3199bf7497702cf5923) Thanks [@thetutlage](https://github.com/thetutlage)! - feature: add support for check constraints in DML

- Updated dependencies [[`3e98364bd1631f96846cd3199bf7497702cf5923`](https://github.com/medusajs/medusa/commit/3e98364bd1631f96846cd3199bf7497702cf5923), [`324b4ab438662f44de495ffe4d9137677a032a00`](https://github.com/medusajs/medusa/commit/324b4ab438662f44de495ffe4d9137677a032a00)]:
  - @medusajs/types@2.1.0

## 2.0.7

### Patch Changes

- [#10318](https://github.com/medusajs/medusa/pull/10318) [`e9003c3124f284eae7e1457101bf10c1beccbac1`](https://github.com/medusajs/medusa/commit/e9003c3124f284eae7e1457101bf10c1beccbac1) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(utils): set readonly property on recursive dir read

- Updated dependencies []:
  - @medusajs/types@2.0.7

## 2.0.6

### Patch Changes

- Updated dependencies []:
  - @medusajs/types@2.0.6

## 2.0.5

### Patch Changes

- [#10159](https://github.com/medusajs/medusa/pull/10159) [`9dff05cddeeca40fab47760fa15e07ca087664ed`](https://github.com/medusajs/medusa/commit/9dff05cddeeca40fab47760fa15e07ca087664ed) Thanks [@thetutlage](https://github.com/thetutlage)! - Revert "feat: add optional fields"

- [#10179](https://github.com/medusajs/medusa/pull/10179) [`42c08fa8e00d33e93e152b3058d2f73476b9a0c3`](https://github.com/medusajs/medusa/commit/42c08fa8e00d33e93e152b3058d2f73476b9a0c3) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Fix loaders path

- [#10085](https://github.com/medusajs/medusa/pull/10085) [`3e265229f2ae5c3d55f64a445574c13c40b52c14`](https://github.com/medusajs/medusa/commit/3e265229f2ae5c3d55f64a445574c13c40b52c14) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Improve event bus error handling

- [#10172](https://github.com/medusajs/medusa/pull/10172) [`7390c14c20f7b5053458de1b1a58870dc8e441cc`](https://github.com/medusajs/medusa/commit/7390c14c20f7b5053458de1b1a58870dc8e441cc) Thanks [@thetutlage](https://github.com/thetutlage)! - feat(utils): add support for making relationships searchable

- Updated dependencies [[`9dff05cddeeca40fab47760fa15e07ca087664ed`](https://github.com/medusajs/medusa/commit/9dff05cddeeca40fab47760fa15e07ca087664ed), [`1659c9be5d3ace1bed9f3a6e7206fe54e60645c0`](https://github.com/medusajs/medusa/commit/1659c9be5d3ace1bed9f3a6e7206fe54e60645c0), [`3fee17747f059a331e9fbe40622205b968404faf`](https://github.com/medusajs/medusa/commit/3fee17747f059a331e9fbe40622205b968404faf)]:
  - @medusajs/types@2.0.5

## 2.0.4

### Patch Changes

- Updated dependencies [[`34f4f695c0b8359a6e9efd45fd081ea743a1c439`](https://github.com/medusajs/medusa/commit/34f4f695c0b8359a6e9efd45fd081ea743a1c439), [`bc2d556c2c57adab637308fb65247b17b8cd2ed5`](https://github.com/medusajs/medusa/commit/bc2d556c2c57adab637308fb65247b17b8cd2ed5)]:
  - @medusajs/types@2.0.4

## 2.0.3

### Patch Changes

- [#9955](https://github.com/medusajs/medusa/pull/9955) [`03f4b66b90625634f13409be35cd57081f0eb7d5`](https://github.com/medusajs/medusa/commit/03f4b66b90625634f13409be35cd57081f0eb7d5) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Generate graph schema with readonly links

- Updated dependencies [[`03f4b66b90625634f13409be35cd57081f0eb7d5`](https://github.com/medusajs/medusa/commit/03f4b66b90625634f13409be35cd57081f0eb7d5)]:
  - @medusajs/types@2.0.3

## 2.0.2

### Patch Changes

- [#9917](https://github.com/medusajs/medusa/pull/9917) [`16b4cc433e996d1a54e4ff043daaa148981ba63d`](https://github.com/medusajs/medusa/commit/16b4cc433e996d1a54e4ff043daaa148981ba63d) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(utils): Mikro orm repository update many to many should detach all items by default

- [#9932](https://github.com/medusajs/medusa/pull/9932) [`879ce33090c7e99ae8b466c31c5dc0c67cdbc08f`](https://github.com/medusajs/medusa/commit/879ce33090c7e99ae8b466c31c5dc0c67cdbc08f) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(utils/dml): set-relationship graphql generator from DML wrong managed belongsTo

- [#9947](https://github.com/medusajs/medusa/pull/9947) [`b3cbc160eb94025402b5a0ef21653c207bbe8ccd`](https://github.com/medusajs/medusa/commit/b3cbc160eb94025402b5a0ef21653c207bbe8ccd) Thanks [@sradevski](https://github.com/sradevski)! - fix: Default to a relative path for backend URL in admin

- Updated dependencies [[`bbf4af17258ea34adeeb8ff3a6cd213a12d67c76`](https://github.com/medusajs/medusa/commit/bbf4af17258ea34adeeb8ff3a6cd213a12d67c76), [`c1c85ef952441eacfe8b6c2ffa9304ac4433053f`](https://github.com/medusajs/medusa/commit/c1c85ef952441eacfe8b6c2ffa9304ac4433053f), [`b3cbc160eb94025402b5a0ef21653c207bbe8ccd`](https://github.com/medusajs/medusa/commit/b3cbc160eb94025402b5a0ef21653c207bbe8ccd)]:
  - @medusajs/types@2.0.2

## 2.0.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/types@2.0.1

## 2.0.0

### Major Changes

- [#7341](https://github.com/medusajs/medusa/pull/7341) [`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Medusa 2.0

### Patch Changes

- Updated dependencies [[`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e)]:
  - @medusajs/types@2.0.0

## 1.11.9

### Patch Changes

- [#6922](https://github.com/medusajs/medusa/pull/6922) [`20e8df914e`](https://github.com/medusajs/medusa/commit/20e8df914ec5fdf8d562d4fa84f72c58c7056195) Thanks [@sradevski](https://github.com/sradevski)! - Return normalized DB errors from the mikro ORM repository

- [#6836](https://github.com/medusajs/medusa/pull/6836) [`e0b02a1012`](https://github.com/medusajs/medusa/commit/e0b02a1012981c29830d7779f59ebe805bbfd137) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(utils): custom serialization that allows for non self ref

- [#6864](https://github.com/medusajs/medusa/pull/6864) [`e944a627f0`](https://github.com/medusajs/medusa/commit/e944a627f074fb39a56f4bc7b3d6d315736ebf7c) Thanks [@adrien2p](https://github.com/adrien2p)! - feat: region payment providers management workflows/api

- [`cc557c8752`](https://github.com/medusajs/medusa/commit/cc557c8752fd0554f5a1b58522d9a88dc43a8509) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Order endpoints and Cart totals

- [#6842](https://github.com/medusajs/medusa/pull/6842) [`5d9aea053c`](https://github.com/medusajs/medusa/commit/5d9aea053ce6e04f242f86fb9053c13dec515d5b) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(utils): Mikro orm prop filtering should check existence

- [#6973](https://github.com/medusajs/medusa/pull/6973) [`232322d035`](https://github.com/medusajs/medusa/commit/232322d03515f81e56867ff8c765b8409399ee68) Thanks [@adrien2p](https://github.com/adrien2p)! - Chores: Do not disable foreign keys by default

- [#7153](https://github.com/medusajs/medusa/pull/7153) [`4b57c5d286`](https://github.com/medusajs/medusa/commit/4b57c5d286f9dc6e2098c67e9fecb0d93175b5a1) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remote query supporting context

- [#6813](https://github.com/medusajs/medusa/pull/6813) [`a6562d2a41`](https://github.com/medusajs/medusa/commit/a6562d2a41453cbe7aa43be352c4924e3e4c79d5) Thanks [@sradevski](https://github.com/sradevski)! - Added an upsertWithReplace method to the mikro orm repository

- Updated dependencies [[`0c0b425de7`](https://github.com/medusajs/medusa/commit/0c0b425de7b154b80b712ab17b16215cf62d1e83), [`8d356217bd`](https://github.com/medusajs/medusa/commit/8d356217bd31c97a196e861ee243822a4d924df7), [`27f4f0d724`](https://github.com/medusajs/medusa/commit/27f4f0d7243367c2dfc6012bf1f6b7400a77ec7b), [`e944a627f0`](https://github.com/medusajs/medusa/commit/e944a627f074fb39a56f4bc7b3d6d315736ebf7c), [`1a48fe0282`](https://github.com/medusajs/medusa/commit/1a48fe0282a8bc1f8548a4736255e457d173da09), [`86f499de2f`](https://github.com/medusajs/medusa/commit/86f499de2f31356ab36ad5e93f27345443b3e5f6), [`09a2220569`](https://github.com/medusajs/medusa/commit/09a22205693da62fbf8fd450535d5024cb9c01d1), [`78f603e4f1`](https://github.com/medusajs/medusa/commit/78f603e4f18c9d16f4b58a2189c959026453d8b2), [`cc557c8752`](https://github.com/medusajs/medusa/commit/cc557c8752fd0554f5a1b58522d9a88dc43a8509), [`58c68f6715`](https://github.com/medusajs/medusa/commit/58c68f67156e993255fbc25d91db15ae23bc95c0), [`82a176e30e`](https://github.com/medusajs/medusa/commit/82a176e30e47a7d11caaf31c3023bd8db588b465), [`11517f0faf`](https://github.com/medusajs/medusa/commit/11517f0fafdf00af256240448b58d149d8b6f600), [`62b9dcc6c1`](https://github.com/medusajs/medusa/commit/62b9dcc6c1ce46aadb7944215006c12da3c9f619), [`e26cda4b6a`](https://github.com/medusajs/medusa/commit/e26cda4b6afb7fb25f0b0a7a7ce20b7f914d35db), [`bc06ad2db4`](https://github.com/medusajs/medusa/commit/bc06ad2db48c999023ab823fefc1375196976e9b), [`18f3aacee6`](https://github.com/medusajs/medusa/commit/18f3aacee6752854d377faa806f4cc67bc71456b), [`38c971f111`](https://github.com/medusajs/medusa/commit/38c971f111af69f176e7e9892eb59f5bae831fa7), [`45c49e89f2`](https://github.com/medusajs/medusa/commit/45c49e89f28123ef622fc1c07253bae94fd74875), [`528ef4ca90`](https://github.com/medusajs/medusa/commit/528ef4ca90bb2cf6173dccc9fd6a9f9932ff9b76), [`65794f4bb5`](https://github.com/medusajs/medusa/commit/65794f4bb56e4fd3f0ccb7656a948f856f05324e), [`93ef94cad3`](https://github.com/medusajs/medusa/commit/93ef94cad3ddc5b6973b4e48e422b0aa0e6ddbbe), [`4cf71af07d`](https://github.com/medusajs/medusa/commit/4cf71af07d1807c83df3889c1774f82cbd1b9a6f), [`4b57c5d286`](https://github.com/medusajs/medusa/commit/4b57c5d286f9dc6e2098c67e9fecb0d93175b5a1), [`c78915c7c5`](https://github.com/medusajs/medusa/commit/c78915c7c5e91a99c1b1bae932656c8d86b17daf), [`18f3aacee6`](https://github.com/medusajs/medusa/commit/18f3aacee6752854d377faa806f4cc67bc71456b), [`f175cac4af`](https://github.com/medusajs/medusa/commit/f175cac4af63b71066a8398ecf9beaa6f28b20cc), [`0a9b9b073d`](https://github.com/medusajs/medusa/commit/0a9b9b073dd2d3f4aa5e5cb1c16e2221a7200e0d), [`a6562d2a41`](https://github.com/medusajs/medusa/commit/a6562d2a41453cbe7aa43be352c4924e3e4c79d5), [`00e6b21bb5`](https://github.com/medusajs/medusa/commit/00e6b21bb50dbc886bc37ad052a1c40ce865294e), [`8fd1488938`](https://github.com/medusajs/medusa/commit/8fd148893850eb66c5eae00c4ca9391a80ea2eb9), [`1c6ba4468e`](https://github.com/medusajs/medusa/commit/1c6ba4468eab1440931c88929affd5b4c593f377)]:
  - @medusajs/types@1.11.16

## 1.11.8

### Patch Changes

- [#6796](https://github.com/medusajs/medusa/pull/6796) [`9073d7aba3`](https://github.com/medusajs/medusa/commit/9073d7aba3419e4dc0a206473291a46ebd79b8c1) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): rename psma to prices

- [#6751](https://github.com/medusajs/medusa/pull/6751) [`4974f5e455`](https://github.com/medusajs/medusa/commit/4974f5e4557bd64a328a881ec02b91e15485bd23) Thanks [@riqwan](https://github.com/riqwan)! - feat(utils): autogenerates create and update methods when dto is provided

- [#6772](https://github.com/medusajs/medusa/pull/6772) [`1ef9c78cea`](https://github.com/medusajs/medusa/commit/1ef9c78cea080c3b7c136f909c6cddec9d8f0c62) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: v2 - deprecate extra in favor of driver options

- Updated dependencies [[`deab12e27e`](https://github.com/medusajs/medusa/commit/deab12e27e8249e26d24d7bc904c18195679ff24), [`56481e683d`](https://github.com/medusajs/medusa/commit/56481e683d33ff98f0d4c4e144873bb23f993c9c), [`9073d7aba3`](https://github.com/medusajs/medusa/commit/9073d7aba3419e4dc0a206473291a46ebd79b8c1), [`05e857d256`](https://github.com/medusajs/medusa/commit/05e857d25657b5576a891c9b48c19c1759c70701), [`1ef9c78cea`](https://github.com/medusajs/medusa/commit/1ef9c78cea080c3b7c136f909c6cddec9d8f0c62)]:
  - @medusajs/types@1.11.15

## 1.11.7

### Patch Changes

- [#6648](https://github.com/medusajs/medusa/pull/6648) [`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,utils): added price list prices upsert and delete workflows + endpoints

- [#6504](https://github.com/medusajs/medusa/pull/6504) [`56cbf88115`](https://github.com/medusajs/medusa/commit/56cbf88115994adea7037c3f2814f0c96af3cfc0) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(utils): Soft delete should allow self referencing circular deps

- [#6473](https://github.com/medusajs/medusa/pull/6473) [`36a61658f9`](https://github.com/medusajs/medusa/commit/36a61658f969a7b19c84a1e621ad1464927cafb1) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(utils): Fix big number decorator and cleanup

- [#6436](https://github.com/medusajs/medusa/pull/6436) [`c319edb8e0`](https://github.com/medusajs/medusa/commit/c319edb8e0ecd13d086652147667916e5abab2d8) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(utils): Add default ordering to the internal service factory list/listAndCount

- [#6531](https://github.com/medusajs/medusa/pull/6531) [`0b9fcb6324`](https://github.com/medusajs/medusa/commit/0b9fcb6324eee9f2556c7e6317775fae93b12a47) Thanks [@riqwan](https://github.com/riqwan)! - feat(utils): consolidate promotion utils + refactor

- [#6525](https://github.com/medusajs/medusa/pull/6525) [`b3d826497b`](https://github.com/medusajs/medusa/commit/b3d826497b3dae5e1b26b7924706c24fd5e87ca5) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(utils): Improve big number decorator

- [#6386](https://github.com/medusajs/medusa/pull/6386) [`a86c87fe14`](https://github.com/medusajs/medusa/commit/a86c87fe1442afce9285e39255914e01012b4449) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(utils): make psql index util return index instead of constraint for unique indicies becuase partial constraints don't exist :'(

- [#6692](https://github.com/medusajs/medusa/pull/6692) [`640eccd5dd`](https://github.com/medusajs/medusa/commit/640eccd5ddbb163e0f987ce6c772f1129c2e2632) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): add rules to promotion endpoints + workflow

- [#6499](https://github.com/medusajs/medusa/pull/6499) [`8ea37d03c9`](https://github.com/medusajs/medusa/commit/8ea37d03c914a5004a3e42770668b2d1f7f8f564) Thanks [@riqwan](https://github.com/riqwan)! - fix(utils): bignumber util considers nullable options when setting value

- [#6399](https://github.com/medusajs/medusa/pull/6399) [`339a946f38`](https://github.com/medusajs/medusa/commit/339a946f389033c21e05338f9dbf07d88e140533) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Initial Order module implementation

- [#6648](https://github.com/medusajs/medusa/pull/6648) [`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,pricing,types,utils): added price list workflows + endpoints

- [#6441](https://github.com/medusajs/medusa/pull/6441) [`8dad2b51a2`](https://github.com/medusajs/medusa/commit/8dad2b51a26c4c3c14a6c95f70424c8bef2ad63e) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa-react,medusa,utils): fix login for medusa v2 admin next dashboard

- [#6289](https://github.com/medusajs/medusa/pull/6289) [`a6d7070dd6`](https://github.com/medusajs/medusa/commit/a6d7070dd669c21ea19d70434d42c2f8167dc309) Thanks [@riqwan](https://github.com/riqwan)! - feat(types): add util to transform get response to an update request

- [#6489](https://github.com/medusajs/medusa/pull/6489) [`168f02f138`](https://github.com/medusajs/medusa/commit/168f02f138ad101e1013f2c8c3f8dc19de12accf) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(util): Detect circular dependencies on soft delete

- [#6514](https://github.com/medusajs/medusa/pull/6514) [`f5c2256286`](https://github.com/medusajs/medusa/commit/f5c22562867f412040f8bc6c55ab5de3a3735e62) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): adds update cart API with promotions

- [#6592](https://github.com/medusajs/medusa/pull/6592) [`000eb61e33`](https://github.com/medusajs/medusa/commit/000eb61e33e0302db95ee6ad1656ea9b430ed471) Thanks [@riqwan](https://github.com/riqwan)! - feat(pricing,medusa,utils): added list + get endpoints for price lists

- [#6524](https://github.com/medusajs/medusa/pull/6524) [`62a7bcc30c`](https://github.com/medusajs/medusa/commit/62a7bcc30cbc7b234b2b51d7858439951a84edeb) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(fulfillment): service provider registration + fulfillment management

- [#6700](https://github.com/medusajs/medusa/pull/6700) [`8f8a4f9b13`](https://github.com/medusajs/medusa/commit/8f8a4f9b1353087d98f6cc75346d43a7f49901a8) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Version all modules to allow for initial testing

- [#6396](https://github.com/medusajs/medusa/pull/6396) [`6500f18b9b`](https://github.com/medusajs/medusa/commit/6500f18b9b80c5c9c473489e7e740d55dca74303) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Prevent from soft deleting all entities

- [#6311](https://github.com/medusajs/medusa/pull/6311) [`ce39b9b66e`](https://github.com/medusajs/medusa/commit/ce39b9b66e8c277ec0691ea6d0a950003be09cc1) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(payment-stripe): new Stripe payment provider

- [#6308](https://github.com/medusajs/medusa/pull/6308) [`a6a4b3f01a`](https://github.com/medusajs/medusa/commit/a6a4b3f01a6d2bd97b1580c59134279a1b033a5d) Thanks [@fPolic](https://github.com/fPolic)! - feat(types, utils): payment module - provider service

- [#6435](https://github.com/medusajs/medusa/pull/6435) [`56b0b45304`](https://github.com/medusajs/medusa/commit/56b0b4530401a6ec5aa155874d371e45bb388fe2) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - BigNumberField decorator

- [#6698](https://github.com/medusajs/medusa/pull/6698) [`cc1b66842c`](https://github.com/medusajs/medusa/commit/cc1b66842cbb37c6eab84e2d8b74844c214f38d7) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,types,utils): add/remove fulfillment shipping option rules

- [#6383](https://github.com/medusajs/medusa/pull/6383) [`e85463b2a7`](https://github.com/medusajs/medusa/commit/e85463b2a717751de2e21c39a4c745449b31affe) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Fix database test utils and utils

- Updated dependencies [[`1fd0457c15`](https://github.com/medusajs/medusa/commit/1fd0457c153b2ef7657c052878d8e5364e1b324a), [`d4b921f3db`](https://github.com/medusajs/medusa/commit/d4b921f3dbe0a38f1565a8de759996c70798d58e), [`ac86362e81`](https://github.com/medusajs/medusa/commit/ac86362e81d8523cb8e3dfad026fc94658513018), [`e4acde1aa2`](https://github.com/medusajs/medusa/commit/e4acde1aa2eb57f07e6692fe8b61f728948b9a96), [`1a661adf3e`](https://github.com/medusajs/medusa/commit/1a661adf3ef4991aa6e237dd894b6a5c47cd4aca), [`04a532e5ef`](https://github.com/medusajs/medusa/commit/04a532e5efabbf75b1e4155520b1da175b686ffc), [`640eccd5dd`](https://github.com/medusajs/medusa/commit/640eccd5ddbb163e0f987ce6c772f1129c2e2632), [`339a946f38`](https://github.com/medusajs/medusa/commit/339a946f389033c21e05338f9dbf07d88e140533), [`ac829fc67f`](https://github.com/medusajs/medusa/commit/ac829fc67f7495b08f28e55923c59f0fd6320311), [`d9d5afc3cf`](https://github.com/medusajs/medusa/commit/d9d5afc3cfc29221d0e65bff7b78474a8fb8f31f), [`c3c4f49fc2`](https://github.com/medusajs/medusa/commit/c3c4f49fc2126f950e69e291ca939ca88a15afd3), [`9288f53327`](https://github.com/medusajs/medusa/commit/9288f53327b8ce617af92ed8d14d9459cbfeb13c), [`0d46abf0ff`](https://github.com/medusajs/medusa/commit/0d46abf0ffa4c5e03bf7d2a9cdf1db828a76bea8), [`fafde4f54d`](https://github.com/medusajs/medusa/commit/fafde4f54d3ef75a7d382e6cbf94e38b3deae99b), [`0c705d7bd4`](https://github.com/medusajs/medusa/commit/0c705d7bd41a768c48017ae95b3c8414d96c6acb), [`1d91b7429b`](https://github.com/medusajs/medusa/commit/1d91b7429beebd6f09d5027f7f7e1fe74ce3a8ff), [`1ed5f918c3`](https://github.com/medusajs/medusa/commit/1ed5f918c31794a70aca4a4e4cd83cf456593baa), [`c20eb15cd9`](https://github.com/medusajs/medusa/commit/c20eb15cd9b1bd90c8d01f68eca6f0f181cd902d), [`e5945479e0`](https://github.com/medusajs/medusa/commit/e5945479e091d9560ae3e7240306a31031ef4584), [`f5c2256286`](https://github.com/medusajs/medusa/commit/f5c22562867f412040f8bc6c55ab5de3a3735e62), [`62a7bcc30c`](https://github.com/medusajs/medusa/commit/62a7bcc30cbc7b234b2b51d7858439951a84edeb), [`8f8a4f9b13`](https://github.com/medusajs/medusa/commit/8f8a4f9b1353087d98f6cc75346d43a7f49901a8), [`ce39b9b66e`](https://github.com/medusajs/medusa/commit/ce39b9b66e8c277ec0691ea6d0a950003be09cc1), [`a6a4b3f01a`](https://github.com/medusajs/medusa/commit/a6a4b3f01a6d2bd97b1580c59134279a1b033a5d), [`4d51f095b3`](https://github.com/medusajs/medusa/commit/4d51f095b3f98f468cefb760512563f7b77bb9cf), [`56b0b45304`](https://github.com/medusajs/medusa/commit/56b0b4530401a6ec5aa155874d371e45bb388fe2), [`cc1b66842c`](https://github.com/medusajs/medusa/commit/cc1b66842cbb37c6eab84e2d8b74844c214f38d7), [`24fb102a56`](https://github.com/medusajs/medusa/commit/24fb102a564b1253d1f8b039bb1e435cc5312fbb)]:
  - @medusajs/types@1.11.14

## 1.11.6

### Patch Changes

- [#6328](https://github.com/medusajs/medusa/pull/6328) [`3fd68d197`](https://github.com/medusajs/medusa/commit/3fd68d1979828e3cde6e028e9e6ab0d0fadcb77b) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(fulfillment): Initialize models work

- Updated dependencies [[`3fd68d197`](https://github.com/medusajs/medusa/commit/3fd68d1979828e3cde6e028e9e6ab0d0fadcb77b)]:
  - @medusajs/types@1.11.13

## 1.11.5

### Patch Changes

- [#6319](https://github.com/medusajs/medusa/pull/6319) [`12054f5c0`](https://github.com/medusajs/medusa/commit/12054f5c01915899223ddc6da734151b31fbb23b) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat/shipping method init

- [#6263](https://github.com/medusajs/medusa/pull/6263) [`45134e4d1`](https://github.com/medusajs/medusa/commit/45134e4d11cfcdc08dbd10aae687bfbe9e848ab9) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Workflows passing MedusaContext as argument

- [#6218](https://github.com/medusajs/medusa/pull/6218) [`884428a1b`](https://github.com/medusajs/medusa/commit/884428a1b573e499d7659aefed639bf797147428) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Feat: Event Aggregator

- [#6314](https://github.com/medusajs/medusa/pull/6314) [`882aa549b`](https://github.com/medusajs/medusa/commit/882aa549bdcc6f378934eab2a7c485df354f46aa) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(utils): return array or single entity based on input for modules created by internal module service factory

- Updated dependencies [[`12054f5c0`](https://github.com/medusajs/medusa/commit/12054f5c01915899223ddc6da734151b31fbb23b), [`3db2f95e65`](https://github.com/medusajs/medusa/commit/3db2f95e65909f4fff432990b48be74509052e83), [`96ba49329`](https://github.com/medusajs/medusa/commit/96ba49329b6b05922c90f0c55f16455cb40aa5ca), [`45134e4d1`](https://github.com/medusajs/medusa/commit/45134e4d11cfcdc08dbd10aae687bfbe9e848ab9), [`82c728bec`](https://github.com/medusajs/medusa/commit/82c728bec7232a245a67dca0b01b28572ebea75d), [`e749dd653`](https://github.com/medusajs/medusa/commit/e749dd653c755bfc3632b134d32c15ceaee0a852), [`884428a1b`](https://github.com/medusajs/medusa/commit/884428a1b573e499d7659aefed639bf797147428), [`d1c18a309`](https://github.com/medusajs/medusa/commit/d1c18a3090d71c68a98343fdbb53516f416504c5)]:
  - @medusajs/types@1.11.12

## 1.11.4

### Patch Changes

- [#6094](https://github.com/medusajs/medusa/pull/6094) [`68ddd866a5`](https://github.com/medusajs/medusa/commit/68ddd866a5ff9414e2db5b80d75acc5e81948540) Thanks [@riqwan](https://github.com/riqwan)! - feat(utils,types): add registerUsages for promotion's computed actions

- [#6062](https://github.com/medusajs/medusa/pull/6062) [`72bc52231c`](https://github.com/medusajs/medusa/commit/72bc52231ca3a72fa6d197a248fe07a938ed0d85) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(utils): Update base repository to infer primary keys and support composite

- [#6152](https://github.com/medusajs/medusa/pull/6152) [`99045848f`](https://github.com/medusajs/medusa/commit/99045848fd3e863359c7878d9bc05271ed083a0e) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa,types,core-flows,utils): added delete endpoints for campaigns and promotions

- [#6021](https://github.com/medusajs/medusa/pull/6021) [`a9b4214503`](https://github.com/medusajs/medusa/commit/a9b42145032ee88aa922a11fe03e777b140c68f4) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(utils, product): Attempt to simplify module scripts export

- [#6127](https://github.com/medusajs/medusa/pull/6127) [`5e655dd59`](https://github.com/medusajs/medusa/commit/5e655dd59bda4ffface28db38021ba71cae6de10) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Hide repository creation if they are not custom + add upsert support by default

- [#6050](https://github.com/medusajs/medusa/pull/6050) [`b782d3bcb7`](https://github.com/medusajs/medusa/commit/b782d3bcb7e8088a962584b9a55200dd29c2161c) Thanks [@riqwan](https://github.com/riqwan)! - feat(utils,types): added item/shipping adjustments for order/items/shipping_methods

- [#6128](https://github.com/medusajs/medusa/pull/6128) [`302323916`](https://github.com/medusajs/medusa/commit/302323916b6d8eaf571cd59b5fc92a913af207de) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Modules: Workflows Engine in-memory and Redis

- [#6130](https://github.com/medusajs/medusa/pull/6130) [`da5cc4cf7`](https://github.com/medusajs/medusa/commit/da5cc4cf7f7f0ef40d409704a95b025ce95477f4) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,medusa,utils): promotion and campaign create/update endpoint

- [#6161](https://github.com/medusajs/medusa/pull/6161) [`daecd82a7`](https://github.com/medusajs/medusa/commit/daecd82a7cdf7315599f464999690414c20d6748) Thanks [@riqwan](https://github.com/riqwan)! - feat(utils): update joiner config for campaigns

- [#6112](https://github.com/medusajs/medusa/pull/6112) [`06b33a9b4`](https://github.com/medusajs/medusa/commit/06b33a9b4525b77b1b14b35b973209700945654e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(cart): Line item adjustments

- [#6035](https://github.com/medusajs/medusa/pull/6035) [`b6ac768698`](https://github.com/medusajs/medusa/commit/b6ac768698a3b49d0162cb49e628386f3352d034) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Attempt to abstract the modules repository

- [#6087](https://github.com/medusajs/medusa/pull/6087) [`130c641e5c`](https://github.com/medusajs/medusa/commit/130c641e5c91cf831de64fb87aebbfdc4d23530d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Abstract module services

- [#6063](https://github.com/medusajs/medusa/pull/6063) [`fade8ea7bf`](https://github.com/medusajs/medusa/commit/fade8ea7bf560343ecbde116d226ac44053cdb8e) Thanks [@riqwan](https://github.com/riqwan)! - feat(utils,types): campaigns and campaign budgets + services CRUD

- Updated dependencies [[`68ddd866a5`](https://github.com/medusajs/medusa/commit/68ddd866a5ff9414e2db5b80d75acc5e81948540), [`99045848f`](https://github.com/medusajs/medusa/commit/99045848fd3e863359c7878d9bc05271ed083a0e), [`af7af7374`](https://github.com/medusajs/medusa/commit/af7af737455daa0f330840a9678e6339e519dfe6), [`fc6b1772a7`](https://github.com/medusajs/medusa/commit/fc6b1772a71582bb48602c5cac7b2297e9d267a9), [`d85fee42e`](https://github.com/medusajs/medusa/commit/d85fee42ee7f661310584dfee5741d6c53b989bb), [`5e655dd59`](https://github.com/medusajs/medusa/commit/5e655dd59bda4ffface28db38021ba71cae6de10), [`b132ff7669`](https://github.com/medusajs/medusa/commit/b132ff76693148b3a06373c168e8dd5e02970757), [`e28fa7fbdf`](https://github.com/medusajs/medusa/commit/e28fa7fbdf45c5b1fa19848db731132a0bf1757d), [`a12c28b7d5`](https://github.com/medusajs/medusa/commit/a12c28b7d5faed733bebbb4963dff50b9c8a33bc), [`b782d3bcb7`](https://github.com/medusajs/medusa/commit/b782d3bcb7e8088a962584b9a55200dd29c2161c), [`7f7cb2a263`](https://github.com/medusajs/medusa/commit/7f7cb2a263c26baf540b05a40ab3732ffeb0c73c), [`302323916`](https://github.com/medusajs/medusa/commit/302323916b6d8eaf571cd59b5fc92a913af207de), [`ce81cade88`](https://github.com/medusajs/medusa/commit/ce81cade887659cefe9638e3c1c2807378191c62), [`fd78f5e24`](https://github.com/medusajs/medusa/commit/fd78f5e24263f5e158c3b7d11fbf0a4436e9c17a), [`192bc336cc`](https://github.com/medusajs/medusa/commit/192bc336cc2b6ec3820d94524c046dcd3c4ac7d9), [`06b33a9b4`](https://github.com/medusajs/medusa/commit/06b33a9b4525b77b1b14b35b973209700945654e), [`130c641e5c`](https://github.com/medusajs/medusa/commit/130c641e5c91cf831de64fb87aebbfdc4d23530d), [`fade8ea7bf`](https://github.com/medusajs/medusa/commit/fade8ea7bf560343ecbde116d226ac44053cdb8e), [`8472460f53`](https://github.com/medusajs/medusa/commit/8472460f533322cc4535199aa768ac163021bc79), [`68d8daccd`](https://github.com/medusajs/medusa/commit/68d8daccd2a8508a13e211130e49017198b51fab)]:
  - @medusajs/types@1.11.11

## 1.11.3

### Patch Changes

- [#5957](https://github.com/medusajs/medusa/pull/5957) [`42cc8ae3f`](https://github.com/medusajs/medusa/commit/42cc8ae3f89ed7d642e51654d1a3cca011f13155) Thanks [@riqwan](https://github.com/riqwan)! - feat(types,utils): added promotion create with rules

- [#5869](https://github.com/medusajs/medusa/pull/5869) [`45996d58a2`](https://github.com/medusajs/medusa/commit/45996d58a2665d72335faad11bea958f8da74195) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa, interfaces, utils, webshiper): Uniformise class checks

- [#5728](https://github.com/medusajs/medusa/pull/5728) [`9cc787cac4`](https://github.com/medusajs/medusa/commit/9cc787cac4bf1c5d8edf1c4b548bb3205100e822) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(workflows-sdk): Configurable retries upon step creation

- [#5858](https://github.com/medusajs/medusa/pull/5858) [`355075097`](https://github.com/medusajs/medusa/commit/3550750975a0c9359fd887929377733606ef03af) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(pricing, types): add soft deletion for money-amounts
  feat(utils): cascade soft delete across 1:1 relationships

- [#6020](https://github.com/medusajs/medusa/pull/6020) [`fbee006e5`](https://github.com/medusajs/medusa/commit/fbee006e512ef2d56ffb23eeabad8b51b56be285) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa, orchestration, utils, workflows-sdk): add transaction options support and cleanup

- [#5929](https://github.com/medusajs/medusa/pull/5929) [`c41f3002f`](https://github.com/medusajs/medusa/commit/c41f3002f3118b1f195c5c822fe0f400091d115b) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix/utils object from string path

- [#5985](https://github.com/medusajs/medusa/pull/5985) [`d16d10619`](https://github.com/medusajs/medusa/commit/d16d10619dfbd3966a4709753de3d8cc37c6f2eb) Thanks [@pKorsholm](https://github.com/pKorsholm)! - fix(medusa-test-utils, utils, link-modules, pricing, product): upgrade mikro-orm version

- [#5945](https://github.com/medusajs/medusa/pull/5945) [`890e76a5c`](https://github.com/medusajs/medusa/commit/890e76a5c53039576c42ca4d46af6f6977cdebd1) Thanks [@riqwan](https://github.com/riqwan)! - feat(types,utils): add promotions create with application method

- [#5810](https://github.com/medusajs/medusa/pull/5810) [`fe007d01b`](https://github.com/medusajs/medusa/commit/fe007d01bd827f0e09ee545e48cef18913540c68) Thanks [@fPolic](https://github.com/fPolic)! - feat: sales channel <> order link

- [#5459](https://github.com/medusajs/medusa/pull/5459) [`76332ca6c`](https://github.com/medusajs/medusa/commit/76332ca6c153a786acc07d3f06ff45c3b9346fd3) Thanks [@fPolic](https://github.com/fPolic)! - feat: SalesChannel <> Cart joiner config

- Updated dependencies [[`6d1e3cc02`](https://github.com/medusajs/medusa/commit/6d1e3cc0285ef157fd6486060e8b32c00c01aa80), [`42cc8ae3f`](https://github.com/medusajs/medusa/commit/42cc8ae3f89ed7d642e51654d1a3cca011f13155), [`355075097`](https://github.com/medusajs/medusa/commit/3550750975a0c9359fd887929377733606ef03af), [`dc46ee118`](https://github.com/medusajs/medusa/commit/dc46ee1189c3eb719355da6a1d701c14a77e4578), [`925feea04`](https://github.com/medusajs/medusa/commit/925feea04a8222285175c33577548e50516069a7), [`3f6d79961`](https://github.com/medusajs/medusa/commit/3f6d79961dec1c5eb8950f8eacd94a5d87a4acde), [`c1c470e6b`](https://github.com/medusajs/medusa/commit/c1c470e6b8646c5f0b4bca56a8e785f6c34e1fef), [`890e76a5c`](https://github.com/medusajs/medusa/commit/890e76a5c53039576c42ca4d46af6f6977cdebd1)]:
  - @medusajs/types@1.11.10

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
