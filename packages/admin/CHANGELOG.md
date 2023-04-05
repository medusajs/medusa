# @medusajs/admin

## 2.0.0

### Patch Changes

- [#3461](https://github.com/medusajs/medusa/pull/3461) [`478903b55`](https://github.com/medusajs/medusa/commit/478903b55a6f7c276fa2285ee35bf8a2b51a72fb) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Admin UI fixes / enhancements

  - Inventory and order UI fixes and tweaks
  - focus-border clipping
  - Fix use of `expand` parameter on order page
  - Fix location address editing form state
  - ensure that the allocation indicator is correctly displayed
  - Fix inventory table pagination on location filter change
  - Try and ensure allocation table checkmarks align better
  - Add gap in table actions
  - remove allocate button if no more allcoations can be made
  - update edit-allocation sidebar
  - create/update/delete inventory items according to inventory items on the variant
  - Fix minor bugs related to the edit-allocation modal
  - move tailwind to direct dependency
  - display error messages for batch jobs
  - draft order shipping details
  - Implements redesigned public facing pages of admin UI.
  - Add location names to fulfilment rows and timeline events
  - Encode location id in URL on location table

- [#3410](https://github.com/medusajs/medusa/pull/3410) [`8ed67d2d7`](https://github.com/medusajs/medusa/commit/8ed67d2d7d36da2d0cb3541e42bba1770aefc60a) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(admin,oas-github-cli): Change public config to private to avoid publishing attempts + include `setup/` in npm release for `admin-ui`

- [#3706](https://github.com/medusajs/medusa/pull/3706) [`dae8da109`](https://github.com/medusajs/medusa/commit/dae8da1099bbe5fd3c59adc7fd2c28b41c0f71bc) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(admin): Duplicate product without prices

- [#3418](https://github.com/medusajs/medusa/pull/3418) [`8a7421db5`](https://github.com/medusajs/medusa/commit/8a7421db5bd235dd3cf88bf73d2438af8769f7ba) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin,admin-ui): Updates the default behaviour of the plugin, and makes building for external deployment easier

- [#3334](https://github.com/medusajs/medusa/pull/3334) [`40de54b01`](https://github.com/medusajs/medusa/commit/40de54b0101bdfd37f577d18c10ec9f1ab1ce8fe) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa,admin,admin-ui): Add new plugin to serve the admin dashboard from the server. Adds a new plugin injection step `setup`, code placed in the `setup` folder of a plugin will be run before any code from a plugin is injected into the Medusa server.

- Updated dependencies [[`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46), [`d6b1ad1cc`](https://github.com/medusajs/medusa/commit/d6b1ad1ccd9a8f91b169f30ff99492cf3adcccac), [`e143a8697`](https://github.com/medusajs/medusa/commit/e143a86976a5cc6a53b7a795e8486df4db1d1c09), [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724), [`478903b55`](https://github.com/medusajs/medusa/commit/478903b55a6f7c276fa2285ee35bf8a2b51a72fb), [`84e448968`](https://github.com/medusajs/medusa/commit/84e44896836b2c44017572ac5192ab1cd937048c), [`ca3b32d53`](https://github.com/medusajs/medusa/commit/ca3b32d53c6854716bcbfb641ed381fa0f019a58), [`33c6ccf05`](https://github.com/medusajs/medusa/commit/33c6ccf0591b8ef527f3b10a70b51e29751b4998), [`788ddc0f4`](https://github.com/medusajs/medusa/commit/788ddc0f43696df607f07133af15a04b29d5447d), [`5fd74b38a`](https://github.com/medusajs/medusa/commit/5fd74b38ae1b4f7dced191983b78db83f7b1f71b), [`30a320364`](https://github.com/medusajs/medusa/commit/30a3203640be9993ba2f8447abfdecc0d3e2f9b6), [`240d0ea7b`](https://github.com/medusajs/medusa/commit/240d0ea7b88ff494d0fe28c7c5348e958c14571f), [`6c0462472`](https://github.com/medusajs/medusa/commit/6c046247275c46d934f03d53471bdd555a19a9ad), [`589d1c09b`](https://github.com/medusajs/medusa/commit/589d1c09b085dcaf9667061201ac9deff3047466), [`0695ff642`](https://github.com/medusajs/medusa/commit/0695ff642b5836e7c28d40118aafe7a769023d5a), [`530740889`](https://github.com/medusajs/medusa/commit/53074088941719ac7ca435e76e3e64ba23fac200), [`a8423b8ac`](https://github.com/medusajs/medusa/commit/a8423b8acc8723dd3f5475d23bd9cb8be9c630c0), [`13f40d721`](https://github.com/medusajs/medusa/commit/13f40d721702fbcdf6c131354ec9a81322d4a662), [`4342ac884`](https://github.com/medusajs/medusa/commit/4342ac884bc3fe473576ef10d291f3547e0ffc62), [`fe9eea4c1`](https://github.com/medusajs/medusa/commit/fe9eea4c18b7e04ba91660716c92b11a49840a3c), [`a5ad6c054`](https://github.com/medusajs/medusa/commit/a5ad6c05428e1bb090bbc5a51345a00821781c06), [`748833383`](https://github.com/medusajs/medusa/commit/748833383f4bafd05109dac7afa1286fe851cba3), [`7e1d8ef59`](https://github.com/medusajs/medusa/commit/7e1d8ef599fe4588d439b449373debf1221e625d), [`7f87c4f2c`](https://github.com/medusajs/medusa/commit/7f87c4f2c8abb876213a595005e67d770be9cbe4), [`e5a2e9c8d`](https://github.com/medusajs/medusa/commit/e5a2e9c8d237bbe4e3563f5a7a892ca41f01ba24), [`0a02b70e5`](https://github.com/medusajs/medusa/commit/0a02b70e59cfbd8888fb58c29ee9aaf96eb8099a), [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4), [`fe4b8feb7`](https://github.com/medusajs/medusa/commit/fe4b8feb7e0af2ffc436ca77a769ecb37e16e652), [`aa690beed`](https://github.com/medusajs/medusa/commit/aa690beed775646cbc86b445fb5dc90dcac087d5), [`d1a6aa5a9`](https://github.com/medusajs/medusa/commit/d1a6aa5a90c147a34448e5398a1f205649598c09), [`5eb61fa0e`](https://github.com/medusajs/medusa/commit/5eb61fa0ef991b8a9fabb16c2c159e51b9541867), [`dae8da109`](https://github.com/medusajs/medusa/commit/dae8da1099bbe5fd3c59adc7fd2c28b41c0f71bc), [`f033711ad`](https://github.com/medusajs/medusa/commit/f033711ad649466d72dd9f673d75848c97c0861f), [`eed784d7d`](https://github.com/medusajs/medusa/commit/eed784d7d0b58aeddc9f6f5ea56fe80c608b22f5), [`f027bc26f`](https://github.com/medusajs/medusa/commit/f027bc26fca94931df61c1cc0c7450de08020975), [`3171b0e51`](https://github.com/medusajs/medusa/commit/3171b0e518aebcaa31bbe5c6e914d65282873cda), [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38), [`522e306e2`](https://github.com/medusajs/medusa/commit/522e306e2e9abf4afce63f30714389eba32bef7f), [`80b95a230`](https://github.com/medusajs/medusa/commit/80b95a230056d9ed15f7302f248094f879516faf), [`a1e59313c`](https://github.com/medusajs/medusa/commit/a1e59313c964a944a287b54f6654d1d19ac8a59b), [`10bf05c14`](https://github.com/medusajs/medusa/commit/10bf05c147cb65a263465129790edd44a6d8948b), [`8a7421db5`](https://github.com/medusajs/medusa/commit/8a7421db5bd235dd3cf88bf73d2438af8769f7ba), [`cbbf3ca05`](https://github.com/medusajs/medusa/commit/cbbf3ca054387a900c5777c2eb0218df2c72bae6), [`9ba09ba4d`](https://github.com/medusajs/medusa/commit/9ba09ba4d753f132537f0447097fe9f54922c074), [`bfef22b33`](https://github.com/medusajs/medusa/commit/bfef22b33e0aa4aa542d3f22fb32ee261f5a19ea), [`12d304307`](https://github.com/medusajs/medusa/commit/12d304307af87ea9287a41869eb33ef09f273d85), [`693015fde`](https://github.com/medusajs/medusa/commit/693015fde3218d67fb9c07eebeaea9950bf3f1f1), [`287c829c9`](https://github.com/medusajs/medusa/commit/287c829c9c5a9797fb8cd118b7a6066ad1935898), [`345005573`](https://github.com/medusajs/medusa/commit/345005573a337d63394b63d33d6740a4171d1479), [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`0cca13779`](https://github.com/medusajs/medusa/commit/0cca13779d0e84683193ad82ab163a10a807e903), [`0d0090338`](https://github.com/medusajs/medusa/commit/0d00903385df980e355c54cee9bcd4e8ede21635), [`aed7805c0`](https://github.com/medusajs/medusa/commit/aed7805c0e64b884007148bde90cfce7bee8aad4), [`e359d3f85`](https://github.com/medusajs/medusa/commit/e359d3f85bc12fd3868fc4b563cd994366e899dd), [`0d1b63d77`](https://github.com/medusajs/medusa/commit/0d1b63d773ad91846757a6f0b81b78b0b97b3f2b), [`4042beb10`](https://github.com/medusajs/medusa/commit/4042beb1026b9ad8b381aaa6e1a5214cd92db00f), [`809ab2e0e`](https://github.com/medusajs/medusa/commit/809ab2e0eb2d62054481fa6491d3f7cafbadab4f), [`455c56c4b`](https://github.com/medusajs/medusa/commit/455c56c4b3846c583f39ba56352d645128b0c967), [`f43e9f0f2`](https://github.com/medusajs/medusa/commit/f43e9f0f20a8b0637252951b2bdfed4d42fb9f5e), [`842423679`](https://github.com/medusajs/medusa/commit/8424236799c3789f884285cd3c8a491e91aef2ca), [`935870e01`](https://github.com/medusajs/medusa/commit/935870e010af1ec884259b1f1328421e99acc3af), [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46), [`15f47baf5`](https://github.com/medusajs/medusa/commit/15f47baf56e6722b7821cfaa2fb468e582dfa2c1), [`e6b5859af`](https://github.com/medusajs/medusa/commit/e6b5859af213185408e1087073c1cba10f7b33c2), [`999aeb116`](https://github.com/medusajs/medusa/commit/999aeb116c4742e5b5e0d80793af23f7727276f0), [`55c5fba0d`](https://github.com/medusajs/medusa/commit/55c5fba0d3dbd015c3ffd74d645a8057892d0f52), [`38503fff5`](https://github.com/medusajs/medusa/commit/38503fff56bbceb092e396ac11432a56967b53e9), [`5e405be02`](https://github.com/medusajs/medusa/commit/5e405be02cc94779222dc3d930e747027496d918), [`40de54b01`](https://github.com/medusajs/medusa/commit/40de54b0101bdfd37f577d18c10ec9f1ab1ce8fe), [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449), [`478d1af8d`](https://github.com/medusajs/medusa/commit/478d1af8d0df0af16baf4f130e19b0be34f5f295), [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73), [`f43f03bad`](https://github.com/medusajs/medusa/commit/f43f03badbfd1d3598f3c6bc6c81e6fa2e9c2a09), [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495), [`7e17e0ddc`](https://github.com/medusajs/medusa/commit/7e17e0ddc2e6b2891e9ee1420b04a541899d2a9d), [`bca1f80dd`](https://github.com/medusajs/medusa/commit/bca1f80dd501d878455e1ad4f5091cf20ef900ea), [`7f2223b65`](https://github.com/medusajs/medusa/commit/7f2223b6507b0a3c452977bfcdee92af2086fa29), [`7d585f5f8`](https://github.com/medusajs/medusa/commit/7d585f5f84a910c02d274df7a489dc3ff1ea273a), [`45fd0fb63`](https://github.com/medusajs/medusa/commit/45fd0fb639f05db6115be6823d42b85672c0891d), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def), [`95c9fbfdd`](https://github.com/medusajs/medusa/commit/95c9fbfdd5f290df0f22115f27b82f0812f8bd67), [`ef5ef9f5a`](https://github.com/medusajs/medusa/commit/ef5ef9f5a26febf0b64d9981606c1e59999ca76e), [`d4af87311`](https://github.com/medusajs/medusa/commit/d4af873113e4e3bb75ff1f5646870eb77b7a2b40), [`feaf8d2e1`](https://github.com/medusajs/medusa/commit/feaf8d2e19715585d154464d003759c3a1f4f322), [`f97b3d7cc`](https://github.com/medusajs/medusa/commit/f97b3d7ccee381d3491337ab5144bb44520382a7), [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46), [`55a1f232a`](https://github.com/medusajs/medusa/commit/55a1f232a3746a22adb1fcd1844b2659077a59f9), [`47d344076`](https://github.com/medusajs/medusa/commit/47d3440766efa26aba6638a05edec520a4e62828), [`966aea65c`](https://github.com/medusajs/medusa/commit/966aea65c221403bf316ae7665cc8f73bccd9c38), [`48ad2426a`](https://github.com/medusajs/medusa/commit/48ad2426aa7a604c226132e85ef3da5cce045f45), [`7428ffa30`](https://github.com/medusajs/medusa/commit/7428ffa300a1e5781ef18b86edf97b711df0b585)]:
  - @medusajs/admin-ui@1.8.0
  - @medusajs/medusa@1.8.0
  - medusa-core-utils@1.2.0

## 1.0.0-rc.8

### Patch Changes

- Updated dependencies [[`4488ec685`](https://github.com/medusajs/medusa/commit/4488ec68524f95f367cbd352e9e5eb1957d1d0d6)]:
  - @medusajs/medusa@1.8.0-rc.8
  - @medusajs/admin-ui@0.0.1-rc.8

## 1.0.0-rc.7

### Patch Changes

- [#3706](https://github.com/medusajs/medusa/pull/3706) [`dae8da109`](https://github.com/medusajs/medusa/commit/dae8da1099bbe5fd3c59adc7fd2c28b41c0f71bc) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(admin): Duplicate product without prices

- Updated dependencies [[`748833383`](https://github.com/medusajs/medusa/commit/748833383f4bafd05109dac7afa1286fe851cba3), [`e5a2e9c8d`](https://github.com/medusajs/medusa/commit/e5a2e9c8d237bbe4e3563f5a7a892ca41f01ba24), [`dae8da109`](https://github.com/medusajs/medusa/commit/dae8da1099bbe5fd3c59adc7fd2c28b41c0f71bc)]:
  - @medusajs/medusa@1.8.0-rc.7
  - @medusajs/admin-ui@0.0.1-rc.7

## 1.0.0-rc.6

### Patch Changes

- Updated dependencies [[`ca3b32d53`](https://github.com/medusajs/medusa/commit/ca3b32d53c6854716bcbfb641ed381fa0f019a58), [`788ddc0f4`](https://github.com/medusajs/medusa/commit/788ddc0f43696df607f07133af15a04b29d5447d), [`a5ad6c054`](https://github.com/medusajs/medusa/commit/a5ad6c05428e1bb090bbc5a51345a00821781c06), [`7f87c4f2c`](https://github.com/medusajs/medusa/commit/7f87c4f2c8abb876213a595005e67d770be9cbe4), [`eed784d7d`](https://github.com/medusajs/medusa/commit/eed784d7d0b58aeddc9f6f5ea56fe80c608b22f5), [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38), [`0cca13779`](https://github.com/medusajs/medusa/commit/0cca13779d0e84683193ad82ab163a10a807e903)]:
  - @medusajs/admin-ui@0.0.1-rc.6
  - @medusajs/medusa@1.8.0-rc.6

## 1.0.0-rc.5

### Patch Changes

- Updated dependencies [[`4342ac884`](https://github.com/medusajs/medusa/commit/4342ac884bc3fe473576ef10d291f3547e0ffc62), [`7e1d8ef59`](https://github.com/medusajs/medusa/commit/7e1d8ef599fe4588d439b449373debf1221e625d), [`809ab2e0e`](https://github.com/medusajs/medusa/commit/809ab2e0eb2d62054481fa6491d3f7cafbadab4f), [`e6b5859af`](https://github.com/medusajs/medusa/commit/e6b5859af213185408e1087073c1cba10f7b33c2), [`45fd0fb63`](https://github.com/medusajs/medusa/commit/45fd0fb639f05db6115be6823d42b85672c0891d)]:
  - @medusajs/admin-ui@0.0.1-rc.5
  - @medusajs/medusa@1.8.0-rc.5

## 1.0.0-rc.4

### Patch Changes

- Updated dependencies [[`5fd74b38a`](https://github.com/medusajs/medusa/commit/5fd74b38ae1b4f7dced191983b78db83f7b1f71b), [`0d0090338`](https://github.com/medusajs/medusa/commit/0d00903385df980e355c54cee9bcd4e8ede21635), [`999aeb116`](https://github.com/medusajs/medusa/commit/999aeb116c4742e5b5e0d80793af23f7727276f0), [`5e405be02`](https://github.com/medusajs/medusa/commit/5e405be02cc94779222dc3d930e747027496d918), [`a7e3f2d34`](https://github.com/medusajs/medusa/commit/a7e3f2d343c4059ba83022ec5c09f8101b251297), [`7428ffa30`](https://github.com/medusajs/medusa/commit/7428ffa300a1e5781ef18b86edf97b711df0b585)]:
  - @medusajs/medusa@1.8.0-rc.4
  - @medusajs/admin-ui@0.0.1-rc.4

## 1.0.0-rc.3

### Patch Changes

- Updated dependencies [[`0695ff642`](https://github.com/medusajs/medusa/commit/0695ff642b5836e7c28d40118aafe7a769023d5a), [`693015fde`](https://github.com/medusajs/medusa/commit/693015fde3218d67fb9c07eebeaea9950bf3f1f1)]:
  - @medusajs/medusa@1.8.0-rc.3
  - @medusajs/admin-ui@0.0.1-rc.3

## 1.0.0-rc.2

### Patch Changes

- Updated dependencies []:
  - @medusajs/admin-ui@0.0.1-rc.2
  - @medusajs/medusa@1.8.0-rc.2

## 1.0.0-rc.1

### Patch Changes

- Updated dependencies [[`530740889`](https://github.com/medusajs/medusa/commit/53074088941719ac7ca435e76e3e64ba23fac200), [`d1a6aa5a9`](https://github.com/medusajs/medusa/commit/d1a6aa5a90c147a34448e5398a1f205649598c09), [`345005573`](https://github.com/medusajs/medusa/commit/345005573a337d63394b63d33d6740a4171d1479), [`e359d3f85`](https://github.com/medusajs/medusa/commit/e359d3f85bc12fd3868fc4b563cd994366e899dd), [`455c56c4b`](https://github.com/medusajs/medusa/commit/455c56c4b3846c583f39ba56352d645128b0c967), [`bca1f80dd`](https://github.com/medusajs/medusa/commit/bca1f80dd501d878455e1ad4f5091cf20ef900ea), [`5f41cd9a6`](https://github.com/medusajs/medusa/commit/5f41cd9a67eb0962f999291594c0aac5e38eb916), [`1ce3cc5ae`](https://github.com/medusajs/medusa/commit/1ce3cc5ae4e4cb16eb03be49c9287503f759fc60), [`95c9fbfdd`](https://github.com/medusajs/medusa/commit/95c9fbfdd5f290df0f22115f27b82f0812f8bd67), [`332a9b686`](https://github.com/medusajs/medusa/commit/332a9b686bd0d224855215213dd11b4704283f62), [`feaf8d2e1`](https://github.com/medusajs/medusa/commit/feaf8d2e19715585d154464d003759c3a1f4f322)]:
  - @medusajs/medusa@1.8.0-rc.1
  - @medusajs/admin-ui@0.0.1-rc.1

## 1.0.0-rc.0

### Patch Changes

- [#3461](https://github.com/medusajs/medusa/pull/3461) [`478903b55`](https://github.com/medusajs/medusa/commit/478903b55a6f7c276fa2285ee35bf8a2b51a72fb) Thanks [@StephixOne](https://github.com/StephixOne)! - fix(admin-ui): Admin UI fixes / enhancements

  - Inventory and order UI fixes and tweaks
  - focus-border clipping
  - Fix use of `expand` parameter on order page
  - Fix location address editing form state
  - ensure that the allocation indicator is correctly displayed
  - Fix inventory table pagination on location filter change
  - Try and ensure allocation table checkmarks align better
  - Add gap in table actions
  - remove allocate button if no more allcoations can be made
  - update edit-allocation sidebar
  - create/update/delete inventory items according to inventory items on the variant
  - Fix minor bugs related to the edit-allocation modal
  - move tailwind to direct dependency
  - display error messages for batch jobs
  - draft order shipping details
  - Implements redesigned public facing pages of admin UI.
  - Add location names to fulfilment rows and timeline events
  - Encode location id in URL on location table

- [#3410](https://github.com/medusajs/medusa/pull/3410) [`8ed67d2d7`](https://github.com/medusajs/medusa/commit/8ed67d2d7d36da2d0cb3541e42bba1770aefc60a) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(admin,oas-github-cli): Change public config to private to avoid publishing attempts + include `setup/` in npm release for `admin-ui`

- [#3418](https://github.com/medusajs/medusa/pull/3418) [`8a7421db5`](https://github.com/medusajs/medusa/commit/8a7421db5bd235dd3cf88bf73d2438af8769f7ba) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin,admin-ui): Updates the default behaviour of the plugin, and makes building for external deployment easier

- [#3334](https://github.com/medusajs/medusa/pull/3334) [`40de54b01`](https://github.com/medusajs/medusa/commit/40de54b0101bdfd37f577d18c10ec9f1ab1ce8fe) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa,admin,admin-ui): Add new plugin to serve the admin dashboard from the server. Adds a new plugin injection step `setup`, code placed in the `setup` folder of a plugin will be run before any code from a plugin is injected into the Medusa server.

- Updated dependencies [[`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46), [`d6b1ad1cc`](https://github.com/medusajs/medusa/commit/d6b1ad1ccd9a8f91b169f30ff99492cf3adcccac), [`e143a8697`](https://github.com/medusajs/medusa/commit/e143a86976a5cc6a53b7a795e8486df4db1d1c09), [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724), [`478903b55`](https://github.com/medusajs/medusa/commit/478903b55a6f7c276fa2285ee35bf8a2b51a72fb), [`84e448968`](https://github.com/medusajs/medusa/commit/84e44896836b2c44017572ac5192ab1cd937048c), [`33c6ccf05`](https://github.com/medusajs/medusa/commit/33c6ccf0591b8ef527f3b10a70b51e29751b4998), [`30a320364`](https://github.com/medusajs/medusa/commit/30a3203640be9993ba2f8447abfdecc0d3e2f9b6), [`240d0ea7b`](https://github.com/medusajs/medusa/commit/240d0ea7b88ff494d0fe28c7c5348e958c14571f), [`6c0462472`](https://github.com/medusajs/medusa/commit/6c046247275c46d934f03d53471bdd555a19a9ad), [`589d1c09b`](https://github.com/medusajs/medusa/commit/589d1c09b085dcaf9667061201ac9deff3047466), [`a8423b8ac`](https://github.com/medusajs/medusa/commit/a8423b8acc8723dd3f5475d23bd9cb8be9c630c0), [`13f40d721`](https://github.com/medusajs/medusa/commit/13f40d721702fbcdf6c131354ec9a81322d4a662), [`fe9eea4c1`](https://github.com/medusajs/medusa/commit/fe9eea4c18b7e04ba91660716c92b11a49840a3c), [`0a02b70e5`](https://github.com/medusajs/medusa/commit/0a02b70e59cfbd8888fb58c29ee9aaf96eb8099a), [`fe4b8feb7`](https://github.com/medusajs/medusa/commit/fe4b8feb7e0af2ffc436ca77a769ecb37e16e652), [`aa690beed`](https://github.com/medusajs/medusa/commit/aa690beed775646cbc86b445fb5dc90dcac087d5), [`5eb61fa0e`](https://github.com/medusajs/medusa/commit/5eb61fa0ef991b8a9fabb16c2c159e51b9541867), [`f033711ad`](https://github.com/medusajs/medusa/commit/f033711ad649466d72dd9f673d75848c97c0861f), [`f027bc26f`](https://github.com/medusajs/medusa/commit/f027bc26fca94931df61c1cc0c7450de08020975), [`3171b0e51`](https://github.com/medusajs/medusa/commit/3171b0e518aebcaa31bbe5c6e914d65282873cda), [`522e306e2`](https://github.com/medusajs/medusa/commit/522e306e2e9abf4afce63f30714389eba32bef7f), [`80b95a230`](https://github.com/medusajs/medusa/commit/80b95a230056d9ed15f7302f248094f879516faf), [`a1e59313c`](https://github.com/medusajs/medusa/commit/a1e59313c964a944a287b54f6654d1d19ac8a59b), [`10bf05c14`](https://github.com/medusajs/medusa/commit/10bf05c147cb65a263465129790edd44a6d8948b), [`8a7421db5`](https://github.com/medusajs/medusa/commit/8a7421db5bd235dd3cf88bf73d2438af8769f7ba), [`cbbf3ca05`](https://github.com/medusajs/medusa/commit/cbbf3ca054387a900c5777c2eb0218df2c72bae6), [`9ba09ba4d`](https://github.com/medusajs/medusa/commit/9ba09ba4d753f132537f0447097fe9f54922c074), [`bfef22b33`](https://github.com/medusajs/medusa/commit/bfef22b33e0aa4aa542d3f22fb32ee261f5a19ea), [`12d304307`](https://github.com/medusajs/medusa/commit/12d304307af87ea9287a41869eb33ef09f273d85), [`287c829c9`](https://github.com/medusajs/medusa/commit/287c829c9c5a9797fb8cd118b7a6066ad1935898), [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`aed7805c0`](https://github.com/medusajs/medusa/commit/aed7805c0e64b884007148bde90cfce7bee8aad4), [`0d1b63d77`](https://github.com/medusajs/medusa/commit/0d1b63d773ad91846757a6f0b81b78b0b97b3f2b), [`4042beb10`](https://github.com/medusajs/medusa/commit/4042beb1026b9ad8b381aaa6e1a5214cd92db00f), [`f43e9f0f2`](https://github.com/medusajs/medusa/commit/f43e9f0f20a8b0637252951b2bdfed4d42fb9f5e), [`842423679`](https://github.com/medusajs/medusa/commit/8424236799c3789f884285cd3c8a491e91aef2ca), [`935870e01`](https://github.com/medusajs/medusa/commit/935870e010af1ec884259b1f1328421e99acc3af), [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46), [`15f47baf5`](https://github.com/medusajs/medusa/commit/15f47baf56e6722b7821cfaa2fb468e582dfa2c1), [`55c5fba0d`](https://github.com/medusajs/medusa/commit/55c5fba0d3dbd015c3ffd74d645a8057892d0f52), [`38503fff5`](https://github.com/medusajs/medusa/commit/38503fff56bbceb092e396ac11432a56967b53e9), [`40de54b01`](https://github.com/medusajs/medusa/commit/40de54b0101bdfd37f577d18c10ec9f1ab1ce8fe), [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449), [`478d1af8d`](https://github.com/medusajs/medusa/commit/478d1af8d0df0af16baf4f130e19b0be34f5f295), [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73), [`f43f03bad`](https://github.com/medusajs/medusa/commit/f43f03badbfd1d3598f3c6bc6c81e6fa2e9c2a09), [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495), [`7e17e0ddc`](https://github.com/medusajs/medusa/commit/7e17e0ddc2e6b2891e9ee1420b04a541899d2a9d), [`7f2223b65`](https://github.com/medusajs/medusa/commit/7f2223b6507b0a3c452977bfcdee92af2086fa29), [`7d585f5f8`](https://github.com/medusajs/medusa/commit/7d585f5f84a910c02d274df7a489dc3ff1ea273a), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def), [`ef5ef9f5a`](https://github.com/medusajs/medusa/commit/ef5ef9f5a26febf0b64d9981606c1e59999ca76e), [`d4af87311`](https://github.com/medusajs/medusa/commit/d4af873113e4e3bb75ff1f5646870eb77b7a2b40), [`46547f29c`](https://github.com/medusajs/medusa/commit/46547f29c755719e22d2977c5e5f8ab8a4a7fcae), [`f97b3d7cc`](https://github.com/medusajs/medusa/commit/f97b3d7ccee381d3491337ab5144bb44520382a7), [`f3bf351d2`](https://github.com/medusajs/medusa/commit/f3bf351d21d1c2a67ed2d603c8b7ed4ae5cbd366), [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46), [`d61d6c7b7`](https://github.com/medusajs/medusa/commit/d61d6c7b7f8549996090f5315597d22d2af968f9), [`55a1f232a`](https://github.com/medusajs/medusa/commit/55a1f232a3746a22adb1fcd1844b2659077a59f9), [`53eda215e`](https://github.com/medusajs/medusa/commit/53eda215e00509eb63e571f1b38b9c8884b8e6d5), [`026bdab05`](https://github.com/medusajs/medusa/commit/026bdab05d4da054d3ffd07b8cce8ccb1bded95d), [`47d344076`](https://github.com/medusajs/medusa/commit/47d3440766efa26aba6638a05edec520a4e62828), [`aefe5aa13`](https://github.com/medusajs/medusa/commit/aefe5aa133ea3ab98eb3c1ecd0ba51fb76c173de), [`966aea65c`](https://github.com/medusajs/medusa/commit/966aea65c221403bf316ae7665cc8f73bccd9c38), [`48ad2426a`](https://github.com/medusajs/medusa/commit/48ad2426aa7a604c226132e85ef3da5cce045f45)]:
  - @medusajs/admin-ui@0.0.1-rc.0
  - @medusajs/medusa@1.8.0-rc.0
  - medusa-core-utils@1.2.0-rc.0
