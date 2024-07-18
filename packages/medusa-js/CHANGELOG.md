# Change Log

## 6.1.9

### Patch Changes

- [`52520d9080`](https://github.com/medusajs/medusa/commit/52520d90800e473e89254c4a424d5dffc6edfc30) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Add missing changeset

## 6.1.8

### Patch Changes

- [#6700](https://github.com/medusajs/medusa/pull/6700) [`8f8a4f9b13`](https://github.com/medusajs/medusa/commit/8f8a4f9b1353087d98f6cc75346d43a7f49901a8) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Version all modules to allow for initial testing

- [#6428](https://github.com/medusajs/medusa/pull/6428) [`44d43e8155`](https://github.com/medusajs/medusa/commit/44d43e8155d1b1ca0af5e900787411c7d0b027c0) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa,medusa-js,medusa-react,icons): Fixes GET /admin/products/:id/variants endpoint in the core, and medusa-js and medusa-react. Pulls latest icons from Figma into `@medusajs/icons`.

## 6.1.7

### Patch Changes

- [`20cefa033`](https://github.com/medusajs/medusa/commit/20cefa0335384e3c37f593c9698651895765234e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-js): add axios adapter to config

## 6.1.6

### Patch Changes

- [#6155](https://github.com/medusajs/medusa/pull/6155) [`db4da5602`](https://github.com/medusajs/medusa/commit/db4da56023c1c0563a545bffb2bec9cf0e1c4c4a) Thanks [@lukebui](https://github.com/lukebui)! - fix(@medusajs/medusa-js): correct invite resend path

- [#6190](https://github.com/medusajs/medusa/pull/6190) [`d68089b2a`](https://github.com/medusajs/medusa/commit/d68089b2aa2fb4ab52640424ed1a378cd649364f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa): Implements `listAndCount` method for UserService, and updates list endpoint to accept the expected params.
  fix(medusa-js): Update `admin.users.list` to accept query params.
  fix(medusa-react): Update `useAdminUsers` hook to accept query params.

- [`4c4c0f655`](https://github.com/medusajs/medusa/commit/4c4c0f655bad4feb4c34848d195cac4fe8a902d4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-js): add axios adapter to config #6214

## 6.1.5

### Patch Changes

- [#5941](https://github.com/medusajs/medusa/pull/5941) [`bfd10dada`](https://github.com/medusajs/medusa/commit/bfd10dadaf6286aa26dac96d7c0cc5bc24e43c9b) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa-js): remove unnecessary `query` field in `AdminInventoryItemsResource.deleteLocationLevel` method

- [#5926](https://github.com/medusajs/medusa/pull/5926) [`f25ca30b3`](https://github.com/medusajs/medusa/commit/f25ca30b3aec558094b1dffe70583fcbba64b29a) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa, medusa-js): publishable api key bugs

## 6.1.4

### Patch Changes

- [#5582](https://github.com/medusajs/medusa/pull/5582) [`91615f9c4`](https://github.com/medusajs/medusa/commit/91615f9c459a2d8cb842561c5edb335680d30298) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(@medusajs/client-types): Fix types and TSDocs
  fix(medusa-react): Fix response type of Publishable API Key's list sales channels.
  fix(@medusajs/medusa-js): Fix incorrect parameter and response types.
  fix(@medusajs/medusa): Fix incorrect types and add TSDocs
  fix(@medusajs/types): Fix incorrect types and add TSDocs

## 6.1.3

### Patch Changes

- [`045d1b6a0`](https://github.com/medusajs/medusa/commit/045d1b6a0c2b0d03e5fa1db886d1f81c843059ce) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Bump @medusajs/medusa dep

## 6.1.2

### Patch Changes

- [#5400](https://github.com/medusajs/medusa/pull/5400) [`5a5c96e21`](https://github.com/medusajs/medusa/commit/5a5c96e2118e50a558d9d6dc340e505454d4c593) Thanks [@dwene](https://github.com/dwene)! - add types to exports to help projects using moduleResolution bundler

- [#5406](https://github.com/medusajs/medusa/pull/5406) [`98e275551`](https://github.com/medusajs/medusa/commit/98e275551415583602763cf457c3f95400209d0a) Thanks [@dPreininger](https://github.com/dPreininger)! - Fix(medusa-js): Fix JwtTokenManager.register for store domain

## 6.1.1

### Patch Changes

- [#5233](https://github.com/medusajs/medusa/pull/5233) [`0f34e0f38`](https://github.com/medusajs/medusa/commit/0f34e0f381833a4790ee590a9cbf93b7660634f3) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin-ui, medusa, medusa-react, medusa-js): Price List UI revamp

## 6.1.0

### Minor Changes

- [#4064](https://github.com/medusajs/medusa/pull/4064) [`2caff2efc`](https://github.com/medusajs/medusa/commit/2caff2efc757a3738ae8b7ee6fde77ee7100f995) Thanks [@dPreininger](https://github.com/dPreininger)! - feat(medusa): Authentication overhaul

## 6.0.4

### Patch Changes

- [#5074](https://github.com/medusajs/medusa/pull/5074) [`7d3572302`](https://github.com/medusajs/medusa/commit/7d35723023ed5bcfaf06ff2480e97508527e8665) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa-react): fix `useAdminAddStoreCurrency` hook

## 6.0.3

### Patch Changes

- [#4747](https://github.com/medusajs/medusa/pull/4747) [`9469063f6`](https://github.com/medusajs/medusa/commit/9469063f643180002ede7a8e94c6de53d2770d04) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa-js): return type of collection hook + export

- [#4761](https://github.com/medusajs/medusa/pull/4761) [`f1a05f472`](https://github.com/medusajs/medusa/commit/f1a05f4725dcc45150f014769562bd3dfbc0f1f8) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(admin, admin-ui, medusa, medusa-js, medusa-react, stripe-plugin): Support admin extensions

## 6.0.2

### Patch Changes

- [#4409](https://github.com/medusajs/medusa/pull/4409) [`fe25c8a91`](https://github.com/medusajs/medusa/commit/fe25c8a91f4462c9ac5a15594fa71155df48c1eb) Thanks [@pevey](https://github.com/pevey)! - feat(medusa-react,medusa-js): Allow custom headers

- [#4501](https://github.com/medusajs/medusa/pull/4501) [`708a55199`](https://github.com/medusajs/medusa/commit/708a55199aeb23f5a75fd240ddd10af2c95f3957) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa-js): Update ambiguous type export

## 6.0.1

### Patch Changes

- [#4276](https://github.com/medusajs/medusa/pull/4276) [`afd1b67f1`](https://github.com/medusajs/medusa/commit/afd1b67f1c7de8cf07fd9fcbdde599a37914e9b5) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Use caret range

## 6.0.0

### Patch Changes

- [#4081](https://github.com/medusajs/medusa/pull/4081) [`4f3c8f5d7`](https://github.com/medusajs/medusa/commit/4f3c8f5d70b5ae4a11e9d4a2fea4a8410b2daf47) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa,client-types,medusa-js,admin-ui,medusa-react): add reservation table and creation

- Updated dependencies [[`0a35f21af`](https://github.com/medusajs/medusa/commit/0a35f21af7ac8b6cdc1af12a403e95f9bf6142fe), [`4fb443c0e`](https://github.com/medusajs/medusa/commit/4fb443c0ea38bde3148bce059c0ee3b91dfff3d4), [`0476f5251`](https://github.com/medusajs/medusa/commit/0476f52519237c622b37d29de0718f9774b6add7), [`0f87d3d64`](https://github.com/medusajs/medusa/commit/0f87d3d642b56bf19de8136e1f5bfedf364c5193), [`ed382f2ee`](https://github.com/medusajs/medusa/commit/ed382f2ee510cbf96164991efa7ff75e3ce659ff), [`92f01cefb`](https://github.com/medusajs/medusa/commit/92f01cefbc4a190defce425fb237d2d68728fa9a), [`e3cfbcd4a`](https://github.com/medusajs/medusa/commit/e3cfbcd4a78073c63ecd9829bc531e50d3944f07), [`6998666c6`](https://github.com/medusajs/medusa/commit/6998666c6edd6617ca61a8d39c26435bad1273e3), [`81eeaa329`](https://github.com/medusajs/medusa/commit/81eeaa32942b1a7148126a7218ceb168ce8d6cac), [`e2d29d35c`](https://github.com/medusajs/medusa/commit/e2d29d35c4c477bc9b4a3ddce1279276fd072875), [`3a38c84f8`](https://github.com/medusajs/medusa/commit/3a38c84f88b05f74ee0a172af3e3f78b2ec8c2d2), [`4f3c8f5d7`](https://github.com/medusajs/medusa/commit/4f3c8f5d70b5ae4a11e9d4a2fea4a8410b2daf47), [`a91987fab`](https://github.com/medusajs/medusa/commit/a91987fab33745f9864eab21bd1c27e8e3e24571), [`bf18bd0c8`](https://github.com/medusajs/medusa/commit/bf18bd0c8a284dd0042d4c54d84acb2e7c10edd3), [`db4199530`](https://github.com/medusajs/medusa/commit/db419953075e0907b8c4d27ab5188e9bd3e3d72b)]:
  - @medusajs/medusa@1.12.0

## 5.0.0

### Patch Changes

- Updated dependencies [[`a66646233`](https://github.com/medusajs/medusa/commit/a666462333d20821a3e50e3fbc65bc8a511c726f), [`9518efcca`](https://github.com/medusajs/medusa/commit/9518efccae1961d9b3cd1e85148e293a3744eedb), [`a86f0e815`](https://github.com/medusajs/medusa/commit/a86f0e815a9e75d7d562fbe516c5bb7e0ab1f6ee), [`cdbac2c84`](https://github.com/medusajs/medusa/commit/cdbac2c8403a3c15c0e11993f6b7dab268fa5c08), [`26963acc0`](https://github.com/medusajs/medusa/commit/26963acc0a5caa1bca97cfe4cbcee113a8d75b84)]:
  - @medusajs/medusa@1.11.0

## 4.0.1

### Patch Changes

- Updated dependencies [[`3d6bcaaf6`](https://github.com/medusajs/medusa/commit/3d6bcaaf65b3a43dfb251460d73e448870b5105f), [`7fd22ecb4`](https://github.com/medusajs/medusa/commit/7fd22ecb4d5190e92c6750a9fbf2d8534bb9f4ab), [`bd53adb23`](https://github.com/medusajs/medusa/commit/bd53adb238a64640533698fbccb98a39a0346590), [`1ea57c3a6`](https://github.com/medusajs/medusa/commit/1ea57c3a69a5377a8dd0821df819743ded4a222b), [`0c58ead6d`](https://github.com/medusajs/medusa/commit/0c58ead6d869f5605cbd2b8aca129984b7493bcf), [`cff54d732`](https://github.com/medusajs/medusa/commit/cff54d73253a4c2d16a174a28f0f5d31c94bcebd), [`a8e73942e`](https://github.com/medusajs/medusa/commit/a8e73942e69662ca673ccc4300e270ff6ab523d1), [`ff37cd190`](https://github.com/medusajs/medusa/commit/ff37cd190fa455f4ba4f76cfb4d641b1611cc32e)]:
  - @medusajs/medusa@1.10.1

## 4.0.0

### Patch Changes

- Updated dependencies [[`0e488e71b`](https://github.com/medusajs/medusa/commit/0e488e71b186f7d08b18c4c6ba409ef3cadb8152), [`538c9874b`](https://github.com/medusajs/medusa/commit/538c9874ba18c1352284089a789d4a90652bc795), [`d539c6fee`](https://github.com/medusajs/medusa/commit/d539c6feeba8ee431f9a655b6cd4e9102cba2b25), [`b7a782639`](https://github.com/medusajs/medusa/commit/b7a7826394ecd621ca80e6d4ce445ea1c26804ac), [`983872319`](https://github.com/medusajs/medusa/commit/98387231927e9872f54c9e72597576f3273de506), [`284f1eed9`](https://github.com/medusajs/medusa/commit/284f1eed9a9fc7272df3fccdb162ea93750999de), [`4e8045a0a`](https://github.com/medusajs/medusa/commit/4e8045a0ac44b1541ee3cd846079f55d3e0dc957), [`d2443d83e`](https://github.com/medusajs/medusa/commit/d2443d83e60fee3c3f28b762d66378c3f07f1b5f), [`8b93bae8f`](https://github.com/medusajs/medusa/commit/8b93bae8f8ad1f6eb43931a7ba03bfa691475eca)]:
  - @medusajs/medusa@1.10.0

## 3.0.0

### Patch Changes

- Updated dependencies [[`440f900af`](https://github.com/medusajs/medusa/commit/440f900af03dd0af29c9b16f01576d3eff45cd04), [`366b12fce`](https://github.com/medusajs/medusa/commit/366b12fcea679551c55baaeeaaf41bbddf04b972), [`7e213f210`](https://github.com/medusajs/medusa/commit/7e213f2106ed76449fbdfa6eda5594b59522443a), [`d2826872f`](https://github.com/medusajs/medusa/commit/d2826872fe487a027b677aeb43704f761a6b4e80), [`0d0e9bf20`](https://github.com/medusajs/medusa/commit/0d0e9bf2069718ac54684efbe4d449942bb2ef32), [`2be144ff0`](https://github.com/medusajs/medusa/commit/2be144ff05e852a3541a9a972942cfc15ef3bd38), [`935abeae6`](https://github.com/medusajs/medusa/commit/935abeae68012a93d820789c743941c3c1a1b802), [`3a77e8a88`](https://github.com/medusajs/medusa/commit/3a77e8a88fd327aca579bcd09d767d9315a04d7f), [`af710f1b4`](https://github.com/medusajs/medusa/commit/af710f1b48a4545a5064029a557013af34c4c100), [`491566df6`](https://github.com/medusajs/medusa/commit/491566df6b7ced35f655f810961422945e10ecd0), [`966ddd2f1`](https://github.com/medusajs/medusa/commit/966ddd2f1648d5d3c1c68094f488f307e3186d92), [`3b3236cc0`](https://github.com/medusajs/medusa/commit/3b3236cc01fc8b7448c1bdbad066a19c2c3de2c3), [`4a8562743`](https://github.com/medusajs/medusa/commit/4a8562743569f5bbb7bd0894b025a74725726529)]:
  - @medusajs/medusa@1.9.0

## 2.0.2

### Patch Changes

- Updated dependencies [[`6bb1654b6`](https://github.com/medusajs/medusa/commit/6bb1654b61880f8658bf1395e4ccef860780aac4), [`95d338262`](https://github.com/medusajs/medusa/commit/95d338262b63e3daa6697bb23806980a8b5e5cdc), [`4f58ddee0`](https://github.com/medusajs/medusa/commit/4f58ddee03509a4c46af160e5824cba80d4c950a)]:
  - @medusajs/medusa@1.8.2

## 2.0.1

### Patch Changes

- Updated dependencies [[`78ff64e78`](https://github.com/medusajs/medusa/commit/78ff64e7837f6506c641a3c97ffdfa6ee17419ee), [`1a60c6f58`](https://github.com/medusajs/medusa/commit/1a60c6f58dd80d2d8cb8ee10c186975b39325d13), [`713d85a92`](https://github.com/medusajs/medusa/commit/713d85a92cf5249e3b75b96f8bf2c25e4f9b0c90), [`914d57336`](https://github.com/medusajs/medusa/commit/914d57336bc8355533d743745989f793ffd4d513), [`60abb91b7`](https://github.com/medusajs/medusa/commit/60abb91b7c568c6c4cce3b2da7cfb8d54b078299), [`089f1eb19`](https://github.com/medusajs/medusa/commit/089f1eb19e2bb43659c5b300fccb8163c1d60b5c), [`08f85fa33`](https://github.com/medusajs/medusa/commit/08f85fa33b35e15f944a833e1401c7ba2081d3ec), [`282e239df`](https://github.com/medusajs/medusa/commit/282e239dfc0a74f0eb72b17426c8c8bffd86064a), [`abdb74d99`](https://github.com/medusajs/medusa/commit/abdb74d997f49f994bff49787a396179982843b0), [`eab2d22f7`](https://github.com/medusajs/medusa/commit/eab2d22f7d22ec53c68398558ffda32d2a734983), [`08f85fa33`](https://github.com/medusajs/medusa/commit/08f85fa33b35e15f944a833e1401c7ba2081d3ec), [`085fedb1f`](https://github.com/medusajs/medusa/commit/085fedb1f7e982859cff3ef3f1d870dce3bcc8b6), [`4d69d8ef6`](https://github.com/medusajs/medusa/commit/4d69d8ef6aef0a05d0bbb00eed045c2de511be56), [`7f6dc44be`](https://github.com/medusajs/medusa/commit/7f6dc44beb9789088f6d6b796f7545beb3653094), [`d533caa4c`](https://github.com/medusajs/medusa/commit/d533caa4c2986c1c9e320cce97423b0cdc213b6c)]:
  - @medusajs/medusa@1.8.1

## 2.0.0

### Patch Changes

- [#3041](https://github.com/medusajs/medusa/pull/3041) [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): Typeorm fixes / enhancements

  - upgrade typeorm from 0.2.51 to 0.3.11
  - Plugin repository loader to work with Typeorm update

- [#3435](https://github.com/medusajs/medusa/pull/3435) [`fe9eea4c1`](https://github.com/medusajs/medusa/commit/fe9eea4c18b7e04ba91660716c92b11a49840a3c) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add create-inventory-item endpoint

- [#3685](https://github.com/medusajs/medusa/pull/3685) [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Fix RC package versions

- [#3436](https://github.com/medusajs/medusa/pull/3436) [`9ba09ba4d`](https://github.com/medusajs/medusa/commit/9ba09ba4d753f132537f0447097fe9f54922c074) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, medusa-js, medusa-react): Add store queries to react medusa

- [#3110](https://github.com/medusajs/medusa/pull/3110) [`12d304307`](https://github.com/medusajs/medusa/commit/12d304307af87ea9287a41869eb33ef09f273d85) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(medusa,medusa-js,medusa-react): Add inventory module endpoints

- [#3478](https://github.com/medusajs/medusa/pull/3478) [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas,js,react): use AdminExtendedStoresRes instead of AdminStoresRes

- [#3288](https://github.com/medusajs/medusa/pull/3288) [`7d585f5f8`](https://github.com/medusajs/medusa/commit/7d585f5f84a910c02d274df7a489dc3ff1ea273a) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas): fix paths and fix schema names to match convention

- [#3474](https://github.com/medusajs/medusa/pull/3474) [`02c77d705`](https://github.com/medusajs/medusa/commit/02c77d7059b7e4cb9f6ebfa8cbec2b84e86118ec) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(medusa): Adjust reservations correctly

- Updated dependencies [[`d6b1ad1cc`](https://github.com/medusajs/medusa/commit/d6b1ad1ccd9a8f91b169f30ff99492cf3adcccac), [`e143a8697`](https://github.com/medusajs/medusa/commit/e143a86976a5cc6a53b7a795e8486df4db1d1c09), [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724), [`84e448968`](https://github.com/medusajs/medusa/commit/84e44896836b2c44017572ac5192ab1cd937048c), [`33c6ccf05`](https://github.com/medusajs/medusa/commit/33c6ccf0591b8ef527f3b10a70b51e29751b4998), [`788ddc0f4`](https://github.com/medusajs/medusa/commit/788ddc0f43696df607f07133af15a04b29d5447d), [`5fd74b38a`](https://github.com/medusajs/medusa/commit/5fd74b38ae1b4f7dced191983b78db83f7b1f71b), [`30a320364`](https://github.com/medusajs/medusa/commit/30a3203640be9993ba2f8447abfdecc0d3e2f9b6), [`240d0ea7b`](https://github.com/medusajs/medusa/commit/240d0ea7b88ff494d0fe28c7c5348e958c14571f), [`6c0462472`](https://github.com/medusajs/medusa/commit/6c046247275c46d934f03d53471bdd555a19a9ad), [`589d1c09b`](https://github.com/medusajs/medusa/commit/589d1c09b085dcaf9667061201ac9deff3047466), [`0695ff642`](https://github.com/medusajs/medusa/commit/0695ff642b5836e7c28d40118aafe7a769023d5a), [`530740889`](https://github.com/medusajs/medusa/commit/53074088941719ac7ca435e76e3e64ba23fac200), [`13f40d721`](https://github.com/medusajs/medusa/commit/13f40d721702fbcdf6c131354ec9a81322d4a662), [`4342ac884`](https://github.com/medusajs/medusa/commit/4342ac884bc3fe473576ef10d291f3547e0ffc62), [`fe9eea4c1`](https://github.com/medusajs/medusa/commit/fe9eea4c18b7e04ba91660716c92b11a49840a3c), [`a5ad6c054`](https://github.com/medusajs/medusa/commit/a5ad6c05428e1bb090bbc5a51345a00821781c06), [`748833383`](https://github.com/medusajs/medusa/commit/748833383f4bafd05109dac7afa1286fe851cba3), [`7f87c4f2c`](https://github.com/medusajs/medusa/commit/7f87c4f2c8abb876213a595005e67d770be9cbe4), [`e5a2e9c8d`](https://github.com/medusajs/medusa/commit/e5a2e9c8d237bbe4e3563f5a7a892ca41f01ba24), [`0a02b70e5`](https://github.com/medusajs/medusa/commit/0a02b70e59cfbd8888fb58c29ee9aaf96eb8099a), [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4), [`fe4b8feb7`](https://github.com/medusajs/medusa/commit/fe4b8feb7e0af2ffc436ca77a769ecb37e16e652), [`aa690beed`](https://github.com/medusajs/medusa/commit/aa690beed775646cbc86b445fb5dc90dcac087d5), [`5eb61fa0e`](https://github.com/medusajs/medusa/commit/5eb61fa0ef991b8a9fabb16c2c159e51b9541867), [`f033711ad`](https://github.com/medusajs/medusa/commit/f033711ad649466d72dd9f673d75848c97c0861f), [`eed784d7d`](https://github.com/medusajs/medusa/commit/eed784d7d0b58aeddc9f6f5ea56fe80c608b22f5), [`3171b0e51`](https://github.com/medusajs/medusa/commit/3171b0e518aebcaa31bbe5c6e914d65282873cda), [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38), [`522e306e2`](https://github.com/medusajs/medusa/commit/522e306e2e9abf4afce63f30714389eba32bef7f), [`80b95a230`](https://github.com/medusajs/medusa/commit/80b95a230056d9ed15f7302f248094f879516faf), [`a1e59313c`](https://github.com/medusajs/medusa/commit/a1e59313c964a944a287b54f6654d1d19ac8a59b), [`10bf05c14`](https://github.com/medusajs/medusa/commit/10bf05c147cb65a263465129790edd44a6d8948b), [`cbbf3ca05`](https://github.com/medusajs/medusa/commit/cbbf3ca054387a900c5777c2eb0218df2c72bae6), [`9ba09ba4d`](https://github.com/medusajs/medusa/commit/9ba09ba4d753f132537f0447097fe9f54922c074), [`12d304307`](https://github.com/medusajs/medusa/commit/12d304307af87ea9287a41869eb33ef09f273d85), [`693015fde`](https://github.com/medusajs/medusa/commit/693015fde3218d67fb9c07eebeaea9950bf3f1f1), [`287c829c9`](https://github.com/medusajs/medusa/commit/287c829c9c5a9797fb8cd118b7a6066ad1935898), [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`0cca13779`](https://github.com/medusajs/medusa/commit/0cca13779d0e84683193ad82ab163a10a807e903), [`aed7805c0`](https://github.com/medusajs/medusa/commit/aed7805c0e64b884007148bde90cfce7bee8aad4), [`e359d3f85`](https://github.com/medusajs/medusa/commit/e359d3f85bc12fd3868fc4b563cd994366e899dd), [`0d1b63d77`](https://github.com/medusajs/medusa/commit/0d1b63d773ad91846757a6f0b81b78b0b97b3f2b), [`4042beb10`](https://github.com/medusajs/medusa/commit/4042beb1026b9ad8b381aaa6e1a5214cd92db00f), [`809ab2e0e`](https://github.com/medusajs/medusa/commit/809ab2e0eb2d62054481fa6491d3f7cafbadab4f), [`f43e9f0f2`](https://github.com/medusajs/medusa/commit/f43e9f0f20a8b0637252951b2bdfed4d42fb9f5e), [`842423679`](https://github.com/medusajs/medusa/commit/8424236799c3789f884285cd3c8a491e91aef2ca), [`935870e01`](https://github.com/medusajs/medusa/commit/935870e010af1ec884259b1f1328421e99acc3af), [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46), [`15f47baf5`](https://github.com/medusajs/medusa/commit/15f47baf56e6722b7821cfaa2fb468e582dfa2c1), [`999aeb116`](https://github.com/medusajs/medusa/commit/999aeb116c4742e5b5e0d80793af23f7727276f0), [`55c5fba0d`](https://github.com/medusajs/medusa/commit/55c5fba0d3dbd015c3ffd74d645a8057892d0f52), [`38503fff5`](https://github.com/medusajs/medusa/commit/38503fff56bbceb092e396ac11432a56967b53e9), [`5e405be02`](https://github.com/medusajs/medusa/commit/5e405be02cc94779222dc3d930e747027496d918), [`40de54b01`](https://github.com/medusajs/medusa/commit/40de54b0101bdfd37f577d18c10ec9f1ab1ce8fe), [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449), [`478d1af8d`](https://github.com/medusajs/medusa/commit/478d1af8d0df0af16baf4f130e19b0be34f5f295), [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73), [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495), [`7e17e0ddc`](https://github.com/medusajs/medusa/commit/7e17e0ddc2e6b2891e9ee1420b04a541899d2a9d), [`bca1f80dd`](https://github.com/medusajs/medusa/commit/bca1f80dd501d878455e1ad4f5091cf20ef900ea), [`7f2223b65`](https://github.com/medusajs/medusa/commit/7f2223b6507b0a3c452977bfcdee92af2086fa29), [`7d585f5f8`](https://github.com/medusajs/medusa/commit/7d585f5f84a910c02d274df7a489dc3ff1ea273a), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def), [`ef5ef9f5a`](https://github.com/medusajs/medusa/commit/ef5ef9f5a26febf0b64d9981606c1e59999ca76e), [`feaf8d2e1`](https://github.com/medusajs/medusa/commit/feaf8d2e19715585d154464d003759c3a1f4f322), [`f97b3d7cc`](https://github.com/medusajs/medusa/commit/f97b3d7ccee381d3491337ab5144bb44520382a7), [`55a1f232a`](https://github.com/medusajs/medusa/commit/55a1f232a3746a22adb1fcd1844b2659077a59f9), [`966aea65c`](https://github.com/medusajs/medusa/commit/966aea65c221403bf316ae7665cc8f73bccd9c38), [`48ad2426a`](https://github.com/medusajs/medusa/commit/48ad2426aa7a604c226132e85ef3da5cce045f45)]:
  - @medusajs/medusa@1.8.0

## 2.0.0-rc.8

### Patch Changes

- Updated dependencies [[`4488ec685`](https://github.com/medusajs/medusa/commit/4488ec68524f95f367cbd352e9e5eb1957d1d0d6)]:
  - @medusajs/medusa@1.8.0-rc.8

## 2.0.0-rc.7

### Patch Changes

- Updated dependencies [[`748833383`](https://github.com/medusajs/medusa/commit/748833383f4bafd05109dac7afa1286fe851cba3), [`e5a2e9c8d`](https://github.com/medusajs/medusa/commit/e5a2e9c8d237bbe4e3563f5a7a892ca41f01ba24)]:
  - @medusajs/medusa@1.8.0-rc.7

## 2.0.0-rc.6

### Patch Changes

- Updated dependencies [[`788ddc0f4`](https://github.com/medusajs/medusa/commit/788ddc0f43696df607f07133af15a04b29d5447d), [`a5ad6c054`](https://github.com/medusajs/medusa/commit/a5ad6c05428e1bb090bbc5a51345a00821781c06), [`7f87c4f2c`](https://github.com/medusajs/medusa/commit/7f87c4f2c8abb876213a595005e67d770be9cbe4), [`eed784d7d`](https://github.com/medusajs/medusa/commit/eed784d7d0b58aeddc9f6f5ea56fe80c608b22f5), [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38), [`0cca13779`](https://github.com/medusajs/medusa/commit/0cca13779d0e84683193ad82ab163a10a807e903)]:
  - @medusajs/medusa@1.8.0-rc.6

## 2.0.0-rc.5

### Patch Changes

- Updated dependencies [[`4342ac884`](https://github.com/medusajs/medusa/commit/4342ac884bc3fe473576ef10d291f3547e0ffc62), [`809ab2e0e`](https://github.com/medusajs/medusa/commit/809ab2e0eb2d62054481fa6491d3f7cafbadab4f)]:
  - @medusajs/medusa@1.8.0-rc.5

## 2.0.0-rc.4

### Patch Changes

- Updated dependencies [[`5fd74b38a`](https://github.com/medusajs/medusa/commit/5fd74b38ae1b4f7dced191983b78db83f7b1f71b), [`999aeb116`](https://github.com/medusajs/medusa/commit/999aeb116c4742e5b5e0d80793af23f7727276f0), [`5e405be02`](https://github.com/medusajs/medusa/commit/5e405be02cc94779222dc3d930e747027496d918), [`a7e3f2d34`](https://github.com/medusajs/medusa/commit/a7e3f2d343c4059ba83022ec5c09f8101b251297)]:
  - @medusajs/medusa@1.8.0-rc.4

## 2.0.0-rc.3

### Patch Changes

- Updated dependencies [[`0695ff642`](https://github.com/medusajs/medusa/commit/0695ff642b5836e7c28d40118aafe7a769023d5a), [`693015fde`](https://github.com/medusajs/medusa/commit/693015fde3218d67fb9c07eebeaea9950bf3f1f1)]:
  - @medusajs/medusa@1.8.0-rc.3

## 2.0.0-rc.2

### Patch Changes

- chore: Fix RC package versions

- Updated dependencies []:
  - @medusajs/medusa@1.8.0-rc.2

## 2.0.0-rc.1

### Patch Changes

- Updated dependencies [[`530740889`](https://github.com/medusajs/medusa/commit/53074088941719ac7ca435e76e3e64ba23fac200), [`e359d3f85`](https://github.com/medusajs/medusa/commit/e359d3f85bc12fd3868fc4b563cd994366e899dd), [`bca1f80dd`](https://github.com/medusajs/medusa/commit/bca1f80dd501d878455e1ad4f5091cf20ef900ea), [`5f41cd9a6`](https://github.com/medusajs/medusa/commit/5f41cd9a67eb0962f999291594c0aac5e38eb916), [`1ce3cc5ae`](https://github.com/medusajs/medusa/commit/1ce3cc5ae4e4cb16eb03be49c9287503f759fc60), [`332a9b686`](https://github.com/medusajs/medusa/commit/332a9b686bd0d224855215213dd11b4704283f62), [`feaf8d2e1`](https://github.com/medusajs/medusa/commit/feaf8d2e19715585d154464d003759c3a1f4f322)]:
  - @medusajs/medusa@1.8.0-rc.1

## 2.0.0-rc.0

### Patch Changes

- [#3041](https://github.com/medusajs/medusa/pull/3041) [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): Typeorm fixes / enhancements

  - upgrade typeorm from 0.2.51 to 0.3.11
  - Plugin repository loader to work with Typeorm update

- [#3435](https://github.com/medusajs/medusa/pull/3435) [`fe9eea4c1`](https://github.com/medusajs/medusa/commit/fe9eea4c18b7e04ba91660716c92b11a49840a3c) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add create-inventory-item endpoint

- [#3436](https://github.com/medusajs/medusa/pull/3436) [`9ba09ba4d`](https://github.com/medusajs/medusa/commit/9ba09ba4d753f132537f0447097fe9f54922c074) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa, medusa-js, medusa-react): Add store queries to react medusa

- [#3110](https://github.com/medusajs/medusa/pull/3110) [`12d304307`](https://github.com/medusajs/medusa/commit/12d304307af87ea9287a41869eb33ef09f273d85) Thanks [@StephixOne](https://github.com/StephixOne)! - feat(medusa,medusa-js,medusa-react): Add inventory module endpoints

- [#3478](https://github.com/medusajs/medusa/pull/3478) [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas,js,react): use AdminExtendedStoresRes instead of AdminStoresRes

- [#3288](https://github.com/medusajs/medusa/pull/3288) [`7d585f5f8`](https://github.com/medusajs/medusa/commit/7d585f5f84a910c02d274df7a489dc3ff1ea273a) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix(oas): fix paths and fix schema names to match convention

- [#3474](https://github.com/medusajs/medusa/pull/3474) [`02c77d705`](https://github.com/medusajs/medusa/commit/02c77d7059b7e4cb9f6ebfa8cbec2b84e86118ec) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(medusa): Adjust reservations correctly

- Updated dependencies [[`d6b1ad1cc`](https://github.com/medusajs/medusa/commit/d6b1ad1ccd9a8f91b169f30ff99492cf3adcccac), [`e143a8697`](https://github.com/medusajs/medusa/commit/e143a86976a5cc6a53b7a795e8486df4db1d1c09), [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724), [`84e448968`](https://github.com/medusajs/medusa/commit/84e44896836b2c44017572ac5192ab1cd937048c), [`33c6ccf05`](https://github.com/medusajs/medusa/commit/33c6ccf0591b8ef527f3b10a70b51e29751b4998), [`30a320364`](https://github.com/medusajs/medusa/commit/30a3203640be9993ba2f8447abfdecc0d3e2f9b6), [`240d0ea7b`](https://github.com/medusajs/medusa/commit/240d0ea7b88ff494d0fe28c7c5348e958c14571f), [`6c0462472`](https://github.com/medusajs/medusa/commit/6c046247275c46d934f03d53471bdd555a19a9ad), [`589d1c09b`](https://github.com/medusajs/medusa/commit/589d1c09b085dcaf9667061201ac9deff3047466), [`13f40d721`](https://github.com/medusajs/medusa/commit/13f40d721702fbcdf6c131354ec9a81322d4a662), [`fe9eea4c1`](https://github.com/medusajs/medusa/commit/fe9eea4c18b7e04ba91660716c92b11a49840a3c), [`0a02b70e5`](https://github.com/medusajs/medusa/commit/0a02b70e59cfbd8888fb58c29ee9aaf96eb8099a), [`fe4b8feb7`](https://github.com/medusajs/medusa/commit/fe4b8feb7e0af2ffc436ca77a769ecb37e16e652), [`aa690beed`](https://github.com/medusajs/medusa/commit/aa690beed775646cbc86b445fb5dc90dcac087d5), [`5eb61fa0e`](https://github.com/medusajs/medusa/commit/5eb61fa0ef991b8a9fabb16c2c159e51b9541867), [`f033711ad`](https://github.com/medusajs/medusa/commit/f033711ad649466d72dd9f673d75848c97c0861f), [`3171b0e51`](https://github.com/medusajs/medusa/commit/3171b0e518aebcaa31bbe5c6e914d65282873cda), [`522e306e2`](https://github.com/medusajs/medusa/commit/522e306e2e9abf4afce63f30714389eba32bef7f), [`80b95a230`](https://github.com/medusajs/medusa/commit/80b95a230056d9ed15f7302f248094f879516faf), [`a1e59313c`](https://github.com/medusajs/medusa/commit/a1e59313c964a944a287b54f6654d1d19ac8a59b), [`10bf05c14`](https://github.com/medusajs/medusa/commit/10bf05c147cb65a263465129790edd44a6d8948b), [`cbbf3ca05`](https://github.com/medusajs/medusa/commit/cbbf3ca054387a900c5777c2eb0218df2c72bae6), [`9ba09ba4d`](https://github.com/medusajs/medusa/commit/9ba09ba4d753f132537f0447097fe9f54922c074), [`12d304307`](https://github.com/medusajs/medusa/commit/12d304307af87ea9287a41869eb33ef09f273d85), [`287c829c9`](https://github.com/medusajs/medusa/commit/287c829c9c5a9797fb8cd118b7a6066ad1935898), [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`aed7805c0`](https://github.com/medusajs/medusa/commit/aed7805c0e64b884007148bde90cfce7bee8aad4), [`0d1b63d77`](https://github.com/medusajs/medusa/commit/0d1b63d773ad91846757a6f0b81b78b0b97b3f2b), [`4042beb10`](https://github.com/medusajs/medusa/commit/4042beb1026b9ad8b381aaa6e1a5214cd92db00f), [`f43e9f0f2`](https://github.com/medusajs/medusa/commit/f43e9f0f20a8b0637252951b2bdfed4d42fb9f5e), [`842423679`](https://github.com/medusajs/medusa/commit/8424236799c3789f884285cd3c8a491e91aef2ca), [`935870e01`](https://github.com/medusajs/medusa/commit/935870e010af1ec884259b1f1328421e99acc3af), [`57d7728dd`](https://github.com/medusajs/medusa/commit/57d7728dd9d00df712e1a872899b8397955dfe46), [`15f47baf5`](https://github.com/medusajs/medusa/commit/15f47baf56e6722b7821cfaa2fb468e582dfa2c1), [`55c5fba0d`](https://github.com/medusajs/medusa/commit/55c5fba0d3dbd015c3ffd74d645a8057892d0f52), [`38503fff5`](https://github.com/medusajs/medusa/commit/38503fff56bbceb092e396ac11432a56967b53e9), [`40de54b01`](https://github.com/medusajs/medusa/commit/40de54b0101bdfd37f577d18c10ec9f1ab1ce8fe), [`54dcc1871`](https://github.com/medusajs/medusa/commit/54dcc1871c8f28bea962dbb9df6e79b038d56449), [`478d1af8d`](https://github.com/medusajs/medusa/commit/478d1af8d0df0af16baf4f130e19b0be34f5f295), [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73), [`6748877c6`](https://github.com/medusajs/medusa/commit/6748877c694c1433f666c6987f20af76b201b495), [`7e17e0ddc`](https://github.com/medusajs/medusa/commit/7e17e0ddc2e6b2891e9ee1420b04a541899d2a9d), [`7f2223b65`](https://github.com/medusajs/medusa/commit/7f2223b6507b0a3c452977bfcdee92af2086fa29), [`7d585f5f8`](https://github.com/medusajs/medusa/commit/7d585f5f84a910c02d274df7a489dc3ff1ea273a), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def), [`ef5ef9f5a`](https://github.com/medusajs/medusa/commit/ef5ef9f5a26febf0b64d9981606c1e59999ca76e), [`46547f29c`](https://github.com/medusajs/medusa/commit/46547f29c755719e22d2977c5e5f8ab8a4a7fcae), [`f97b3d7cc`](https://github.com/medusajs/medusa/commit/f97b3d7ccee381d3491337ab5144bb44520382a7), [`f3bf351d2`](https://github.com/medusajs/medusa/commit/f3bf351d21d1c2a67ed2d603c8b7ed4ae5cbd366), [`d61d6c7b7`](https://github.com/medusajs/medusa/commit/d61d6c7b7f8549996090f5315597d22d2af968f9), [`55a1f232a`](https://github.com/medusajs/medusa/commit/55a1f232a3746a22adb1fcd1844b2659077a59f9), [`53eda215e`](https://github.com/medusajs/medusa/commit/53eda215e00509eb63e571f1b38b9c8884b8e6d5), [`026bdab05`](https://github.com/medusajs/medusa/commit/026bdab05d4da054d3ffd07b8cce8ccb1bded95d), [`aefe5aa13`](https://github.com/medusajs/medusa/commit/aefe5aa133ea3ab98eb3c1ecd0ba51fb76c173de), [`966aea65c`](https://github.com/medusajs/medusa/commit/966aea65c221403bf316ae7665cc8f73bccd9c38), [`48ad2426a`](https://github.com/medusajs/medusa/commit/48ad2426aa7a604c226132e85ef3da5cce045f45)]:
  - @medusajs/medusa@1.8.0-rc.0

## 1.3.10

### Patch Changes

- [#3271](https://github.com/medusajs/medusa/pull/3271) [`3a911091f`](https://github.com/medusajs/medusa/commit/3a911091f18c03260d92d81498f63bba31ba61ac) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - hotfix(medusa-js): Export all resources and make client of medusa-js public

- Updated dependencies [[`9690f07bc`](https://github.com/medusajs/medusa/commit/9690f07bc062c85fcf8b7f0f35a162b930944183), [`5301a1e9d`](https://github.com/medusajs/medusa/commit/5301a1e9d632ddac94e7864fecfdc860a4c2a66d), [`d11ab924b`](https://github.com/medusajs/medusa/commit/d11ab924b88211bc18ed019ca300f6d452972167), [`f88af0c28`](https://github.com/medusajs/medusa/commit/f88af0c28d3fa574cdeea3694607d4df563cb88d)]:
  - @medusajs/medusa@1.7.8

## 1.3.9

### Patch Changes

- [#3217](https://github.com/medusajs/medusa/pull/3217) [`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Fix npm packages files included

- Updated dependencies [[`507ad00be`](https://github.com/medusajs/medusa/commit/507ad00bec74bb63b17eae8a4a3313eb6e0d2503), [`6e443dc70`](https://github.com/medusajs/medusa/commit/6e443dc708ffe20bf96d45ddc207ed274c28e344), [`eee928381`](https://github.com/medusajs/medusa/commit/eee9283818b1717f37f084c319201ea7144fdf8a), [`4cb44a3a2`](https://github.com/medusajs/medusa/commit/4cb44a3a2ec5bcf3d90e3b6a0e1f6bb9ff45e2b6), [`472f96d7f`](https://github.com/medusajs/medusa/commit/472f96d7fb8668a15df6e6f9ea31291891b3e688), [`61b0b2f3a`](https://github.com/medusajs/medusa/commit/61b0b2f3aa1d54d539b216a99032549485136a82), [`80452332d`](https://github.com/medusajs/medusa/commit/80452332d852ad7d33d74e1f08f12f45d7a35503), [`bbbb3d888`](https://github.com/medusajs/medusa/commit/bbbb3d888292391976355c88ecb0fcf8a7c115bc), [`10ff72c30`](https://github.com/medusajs/medusa/commit/10ff72c30ae59d2174d876b0c4141aad135d9a1c), [`968eb8fc6`](https://github.com/medusajs/medusa/commit/968eb8fc6b7ccd7221f88f42d75717f3a0547861), [`a59bd84e4`](https://github.com/medusajs/medusa/commit/a59bd84e41fb5d8fc2edc7bdc43d3cbf74d9d7dc), [`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0), [`cac13a88d`](https://github.com/medusajs/medusa/commit/cac13a88da42fa986bd7352fbc12a318b566d98f), [`a2cc084db`](https://github.com/medusajs/medusa/commit/a2cc084db817f8f7699e9b0daceda274b5f0e0c0), [`8194d19b0`](https://github.com/medusajs/medusa/commit/8194d19b0e933310fdc65af25300da5dd185e669)]:
  - @medusajs/medusa@1.7.7

## 1.3.8

### Patch Changes

- [#2971](https://github.com/medusajs/medusa/pull/2971) [`f65f590a2`](https://github.com/medusajs/medusa/commit/f65f590a2771d6e526d7dfc7ca721be74c8f79a9) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Adding inventory items api

- [#3185](https://github.com/medusajs/medusa/pull/3185) [`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Patches all dependencies + minor bumps `winston` to include a [fix for a significant memory leak](https://github.com/winstonjs/winston/pull/2057)

- [#3157](https://github.com/medusajs/medusa/pull/3157) [`be0d36432`](https://github.com/medusajs/medusa/commit/be0d36432a552b7a559f15916c5d9141980c95d1) Thanks [@riqwan](https://github.com/riqwan)! - feat(medusa-js): added resources for product categories

- Updated dependencies [[`ce866475b`](https://github.com/medusajs/medusa/commit/ce866475b4b6c8b453638000f7b1df7a27daf45d), [`53532df8d`](https://github.com/medusajs/medusa/commit/53532df8d597ed5471c07296981b6959cba4ddc3), [`d8ffbe25b`](https://github.com/medusajs/medusa/commit/d8ffbe25b047fda0f644240c9f518f95e74f03cb), [`2d525237b`](https://github.com/medusajs/medusa/commit/2d525237b682e89495b6cc8e3aa677bfad4d0726), [`5b63533c7`](https://github.com/medusajs/medusa/commit/5b63533c77528cab31755cedab9e768f7461f373), [`09dc9c667`](https://github.com/medusajs/medusa/commit/09dc9c6677c0d64cf765b27290e707ea75edd4aa), [`4105405f2`](https://github.com/medusajs/medusa/commit/4105405f28c3f3e54a6077c95a575a268fb5569f), [`ee42b60a2`](https://github.com/medusajs/medusa/commit/ee42b60a20db2afc5e9b6b958502f9e86ec37d80), [`d0adaf57e`](https://github.com/medusajs/medusa/commit/d0adaf57ed1018f29bebf01e5cffde5f7192f89f), [`f65f590a2`](https://github.com/medusajs/medusa/commit/f65f590a2771d6e526d7dfc7ca721be74c8f79a9), [`5ec6d438f`](https://github.com/medusajs/medusa/commit/5ec6d438fb1f909be925461c788f3a3a958528e4), [`5c1d2a5e8`](https://github.com/medusajs/medusa/commit/5c1d2a5e83c3654ae468d17c900892c32ef76060), [`8e41c6996`](https://github.com/medusajs/medusa/commit/8e41c6996601142661bde877b9ee1d80b8325f5f), [`d50db84a3`](https://github.com/medusajs/medusa/commit/d50db84a336da2de9c06a59aa79f2a5e9aa558f1), [`82da3605f`](https://github.com/medusajs/medusa/commit/82da3605fb50cef182699900552109ad654f0df2), [`b242e2232`](https://github.com/medusajs/medusa/commit/b242e22326ce74d5437d0da6863f22facbb5964c), [`4339d47e1`](https://github.com/medusajs/medusa/commit/4339d47e1f6c9f6c8f100b3ac72c8a394b6dd44d), [`2e7e16b91`](https://github.com/medusajs/medusa/commit/2e7e16b9173e2779946776b9b07ce7232c683f36), [`9ebb50104`](https://github.com/medusajs/medusa/commit/9ebb50104cc1f6c8ef1cea446ae595fb2eb532a2), [`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4), [`e22a383f4`](https://github.com/medusajs/medusa/commit/e22a383f4738e8bc80394ccaba3ac9a4ae678955), [`dc156861d`](https://github.com/medusajs/medusa/commit/dc156861d413ecfe3fd264bcd5ad736d83d8a08e), [`8f4c84121`](https://github.com/medusajs/medusa/commit/8f4c84121bd9b8c7067d72f03125e13afe4d2571), [`bfa33f444`](https://github.com/medusajs/medusa/commit/bfa33f444cd225906149777c5c6e842685f3dd7c), [`f776ed234`](https://github.com/medusajs/medusa/commit/f776ed234fcfccf23041ffebecbae6c9a8b7e922), [`4d6e63d68`](https://github.com/medusajs/medusa/commit/4d6e63d68f4e64c365ecbba133876d95e6528763), [`fcba70570`](https://github.com/medusajs/medusa/commit/fcba705701b8013183fafb39e8dda4a85718080a), [`4f0d8992a`](https://github.com/medusajs/medusa/commit/4f0d8992a091a05e93dd5be3762dfa47f074610e), [`d25a53104`](https://github.com/medusajs/medusa/commit/d25a531045143d3be68d3cd3b5764bbbc792ee3a), [`86c87c7b1`](https://github.com/medusajs/medusa/commit/86c87c7b1020ab6bb02f931e1ee113f2857cf527), [`78650ea66`](https://github.com/medusajs/medusa/commit/78650ea66517b0a77100228615d8122f84ad235b), [`b9bda3bf4`](https://github.com/medusajs/medusa/commit/b9bda3bf4e0f95675041085cea5008268c37edd5), [`e581d3bd9`](https://github.com/medusajs/medusa/commit/e581d3bd90f9bc40105e7eaf34e0c94d4f657f7a), [`4d3210bfb`](https://github.com/medusajs/medusa/commit/4d3210bfbb84877d951f7319d2e87c1acbdd6aad)]:
  - @medusajs/medusa@1.7.6

## 1.3.7

### Patch Changes

- [#3051](https://github.com/medusajs/medusa/pull/3051) [`150696de9`](https://github.com/medusajs/medusa/commit/150696de99fc852c5d72a746f168b6f62b2086ed) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa, medusa-js, medusa-react): Add endpoint to retrieve Product Tags through the Storefront API

- [#3038](https://github.com/medusajs/medusa/pull/3038) [`cb2524400`](https://github.com/medusajs/medusa/commit/cb252440079f34ddfdfff1b891f6f73b98db9d59) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - hotfix: Fixes bundling error making JS client unable to run in Node enviornments. Also fixes wrong payload type of admin file uploads.

- Updated dependencies [[`9dbccd9ca`](https://github.com/medusajs/medusa/commit/9dbccd9ca78b8b66f9a21947bb863622e7ff326b), [`542daeead`](https://github.com/medusajs/medusa/commit/542daeeadd78d939f5144c690e8907374da6d085), [`8c08d0031`](https://github.com/medusajs/medusa/commit/8c08d003198b94c00f8428a51c0e79d2ca9d1dc7), [`017538883`](https://github.com/medusajs/medusa/commit/017538883588792e1ff37abcab0fd2872c9af932), [`b2839e2e4`](https://github.com/medusajs/medusa/commit/b2839e2e4dc0d9344fa2ac8d4d16b796def4c56d), [`76d175231`](https://github.com/medusajs/medusa/commit/76d17523105d3860028a90a45b6038a64040e5ce), [`9e3beaf53`](https://github.com/medusajs/medusa/commit/9e3beaf5319dc785cf84b856cfcc8193df90c3a4), [`7d4b8b9cc`](https://github.com/medusajs/medusa/commit/7d4b8b9cc59672d01cdf0c6f331bc3d1eeec9bee), [`aab163bab`](https://github.com/medusajs/medusa/commit/aab163babb91759a05b852d34c299cdfac96d800), [`a0c4cfe0f`](https://github.com/medusajs/medusa/commit/a0c4cfe0f74cf30c45956c32c2fb22bf833bea68), [`27a29ef24`](https://github.com/medusajs/medusa/commit/27a29ef24e5ea1ba2bc0be8ecb7dd747d4c7c65b), [`aef842123`](https://github.com/medusajs/medusa/commit/aef8421235d8fff68d7d4f8b73f77484073311a5), [`1dc79590b`](https://github.com/medusajs/medusa/commit/1dc79590b3539af09dbc8fbf931d9b5ee225fb0d), [`9c4647383`](https://github.com/medusajs/medusa/commit/9c4647383ebf0a183ccc566636bcf7af06409060), [`a0c4cfe0f`](https://github.com/medusajs/medusa/commit/a0c4cfe0f74cf30c45956c32c2fb22bf833bea68), [`b80124d32`](https://github.com/medusajs/medusa/commit/b80124d32d950790c2a01b49e8c34d562b1d57f4), [`cb1ec0076`](https://github.com/medusajs/medusa/commit/cb1ec0076b4fd932c686d6027e8b060ceded3a64), [`142c8aa70`](https://github.com/medusajs/medusa/commit/142c8aa70f583d9b11a6add2b8f988e9ba4cf979), [`1547dd814`](https://github.com/medusajs/medusa/commit/1547dd8143889fc30045fc3d0241de8e69acb76e), [`d2c692aa9`](https://github.com/medusajs/medusa/commit/d2c692aa96ea89c053f9a694a9ae6dba77e89b14), [`150696de9`](https://github.com/medusajs/medusa/commit/150696de99fc852c5d72a746f168b6f62b2086ed), [`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2), [`b3e4be720`](https://github.com/medusajs/medusa/commit/b3e4be72087d0b528c3cce322edf9325b855c8ae)]:
  - @medusajs/medusa@1.7.4

## 1.3.6

### Patch Changes

- [#2964](https://github.com/medusajs/medusa/pull/2964) [`f6c81dab9`](https://github.com/medusajs/medusa/commit/f6c81dab9ecc1388b822d914c845f40c33f950ae) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - Changes build process from using `tsc` to `rollup`. This change ensures that the package works with modern build tools such as Vite@4 and esbuild.

- [#2907](https://github.com/medusajs/medusa/pull/2907) [`c07ffb616`](https://github.com/medusajs/medusa/commit/c07ffb61658b0cdbff00461d1fa267c6be2d1967) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Stock locations module added

- Updated dependencies [[`1817b810f`](https://github.com/medusajs/medusa/commit/1817b810fc8563a08119b74b86ec0587d9e443a1), [`28bec599a`](https://github.com/medusajs/medusa/commit/28bec599ae34d29b626b1dc36f762fc0b2fe8f17), [`3f44abe01`](https://github.com/medusajs/medusa/commit/3f44abe01a7807adf0e807811d4bc52b713cd6b5), [`8ed4eab73`](https://github.com/medusajs/medusa/commit/8ed4eab73a2b067e19da5a1c8498cbff7125ea8d), [`645e0d0ec`](https://github.com/medusajs/medusa/commit/645e0d0ec5e2e49048887c62db662427c8a39cdf), [`47d075351`](https://github.com/medusajs/medusa/commit/47d075351fa4fdeaf32d48f2bd7e72943a293d9b), [`32b038fc3`](https://github.com/medusajs/medusa/commit/32b038fc3fb5f8fab09a7d23f881847c7ae02c0c), [`3d200c41f`](https://github.com/medusajs/medusa/commit/3d200c41f953c3c979a1586f6425a2fbdf159e7e), [`16716f5a4`](https://github.com/medusajs/medusa/commit/16716f5a4f94cb6bc1dcea278d1789da760f2767), [`71fa60892`](https://github.com/medusajs/medusa/commit/71fa60892cd7c00dd9cb8c222a1794ad6577fc1b), [`cc10c20f3`](https://github.com/medusajs/medusa/commit/cc10c20f356d4fe98336d879f8c9523bb63e9e48), [`eda26f6e8`](https://github.com/medusajs/medusa/commit/eda26f6e818a56672cdcce1d794c307c5490f956), [`077e4d960`](https://github.com/medusajs/medusa/commit/077e4d960687a909fd254cd69f4dd5b3e0bad204), [`f3ced106a`](https://github.com/medusajs/medusa/commit/f3ced106ad24fe21f099e10bee5666e1f65a9fc7), [`baeacd1cc`](https://github.com/medusajs/medusa/commit/baeacd1cc52c548eef6896fd83e606c858cf2165), [`e4af96853`](https://github.com/medusajs/medusa/commit/e4af9685313077ece7e3fb7bd27053108cd9d5f8), [`cac81749e`](https://github.com/medusajs/medusa/commit/cac81749eaa06b3b00ac5494591c96a0fcd7bf57), [`4a50786fb`](https://github.com/medusajs/medusa/commit/4a50786fbc78b36147f1f45d77c55dc0a582caba), [`c07ffb616`](https://github.com/medusajs/medusa/commit/c07ffb61658b0cdbff00461d1fa267c6be2d1967), [`8ba0addea`](https://github.com/medusajs/medusa/commit/8ba0addea3997c27efe4a50733b02a31e02f55e5), [`b9680b641`](https://github.com/medusajs/medusa/commit/b9680b641f2984eddbc1f49a37c050499fbaff69)]:
  - @medusajs/medusa@1.7.3

## 1.3.5

### Patch Changes

- [#2804](https://github.com/medusajs/medusa/pull/2804) [`7bb9cd6af`](https://github.com/medusajs/medusa/commit/7bb9cd6aff1d832e6e159f2c878be88a054eddaa) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - fix: missing devDependency was failing repo build task

- Updated dependencies [[`7cced6006`](https://github.com/medusajs/medusa/commit/7cced6006a9a6f9108009e9f3e191e9f3ba1b168), [`463f83ffd`](https://github.com/medusajs/medusa/commit/463f83ffdd450d5325a57fe742b68bfb32ef1a42), [`17c3f34e3`](https://github.com/medusajs/medusa/commit/17c3f34e3df0a4c3656ad8909608331e207155f1), [`c16522d6c`](https://github.com/medusajs/medusa/commit/c16522d6ce806aa6289d626b868818409f41c66e), [`2e5ceb795`](https://github.com/medusajs/medusa/commit/2e5ceb795008fbf53d19bb79ac561561dd11311e), [`71b536e01`](https://github.com/medusajs/medusa/commit/71b536e01e32e3ab3fb5d295df9d67497a8bbe6d), [`9e05fef4b`](https://github.com/medusajs/medusa/commit/9e05fef4b973ceb60a2b975c839de96ca743597b), [`3113d8024`](https://github.com/medusajs/medusa/commit/3113d8024fdeb09230675c2053fcefe811e575fd), [`e27b1940c`](https://github.com/medusajs/medusa/commit/e27b1940c7249e835404ac5490cf39e93053d2bb), [`5e4decbc1`](https://github.com/medusajs/medusa/commit/5e4decbc1c4cc25cb1adb1f63b2f8ea8669d352e), [`b700c6ba5`](https://github.com/medusajs/medusa/commit/b700c6ba5b323c7c5e200f721f0335f40b3e357a), [`8a60a7338`](https://github.com/medusajs/medusa/commit/8a60a73389c1b5c8abf96fbbcc7be7c4d427041d), [`ba6bb3e54`](https://github.com/medusajs/medusa/commit/ba6bb3e54b9989cecf476c7411c406a43562efe1), [`ea460b4e0`](https://github.com/medusajs/medusa/commit/ea460b4e0b1a9aa0fe1ab66bc21a8c40f76a65b3), [`c8724da50`](https://github.com/medusajs/medusa/commit/c8724da50300b94255c5fb4ffe9904be279b5923), [`8dcc805cc`](https://github.com/medusajs/medusa/commit/8dcc805ccf8da619549e77f009d6c4d7b2b6c99a), [`a027d5ff9`](https://github.com/medusajs/medusa/commit/a027d5ff9eb821a1c8728476e4f8bf5f4dd102c8)]:
  - @medusajs/medusa@1.7.1

## 1.3.4

### Patch Changes

- Correct missing version bump

## 1.3.3

### Patch Changes

- [#2552](https://github.com/medusajs/medusa/pull/2552) [`7b0ceeffb`](https://github.com/medusajs/medusa/commit/7b0ceeffb4616c3f4e0cf51aba2ab381c61ea5d7) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - feat(medusa, medusa-js, medusa-react): /store api product types

- Updated dependencies [[`2d095a0ce`](https://github.com/medusajs/medusa/commit/2d095a0ce14ab7f24b4e6856cb4850cea18af21c), [`8069ed5e9`](https://github.com/medusajs/medusa/commit/8069ed5e99dc53a912df9bb860114d2258044108), [`7b0ceeffb`](https://github.com/medusajs/medusa/commit/7b0ceeffb4616c3f4e0cf51aba2ab381c61ea5d7), [`5ea4b728e`](https://github.com/medusajs/medusa/commit/5ea4b728e728a7e6d4d6fe7255ea80395ab75bd3)]:
  - @medusajs/medusa@1.6.2

## 1.3.2

### Patch Changes

- [#2433](https://github.com/medusajs/medusa/pull/2433) [`3c5e31c64`](https://github.com/medusajs/medusa/commit/3c5e31c6455695f854e9df7a3592c12b899fa1e1) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Add protected uploads to fileservices

* [#2430](https://github.com/medusajs/medusa/pull/2430) [`765a2cccd`](https://github.com/medusajs/medusa/commit/765a2cccda2c4c552ede9ec23e0c1e3dd4ea44fc) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(medusa, medusa-js, medusa-react): add resources to discount condition by batch

- [#2270](https://github.com/medusajs/medusa/pull/2270) [`69e579758`](https://github.com/medusajs/medusa/commit/69e579758f81332094d6f0dfa6fbcbc359b0d92c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - Adds the use of price selection strategy to retrieving variants in the admin API. This moves the responsibility of tax calculations from the frontend (admin) to the backend.

* [#2444](https://github.com/medusajs/medusa/pull/2444) [`48411157b`](https://github.com/medusajs/medusa/commit/48411157b1cdec0a67f91e06de8ac547af89d7af) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Support batch remove resources on discount condition

* Updated dependencies [[`211720f24`](https://github.com/medusajs/medusa/commit/211720f24cbcb1f01c36aa35660e1ff0c4518ebd), [`c71744245`](https://github.com/medusajs/medusa/commit/c717442451cf9fc2e0961edded5b49ea5a78760e), [`3c5e31c64`](https://github.com/medusajs/medusa/commit/3c5e31c6455695f854e9df7a3592c12b899fa1e1), [`13611e3e5`](https://github.com/medusajs/medusa/commit/13611e3e53d449fbfab7a88f848f6652a360bd14), [`765a2cccd`](https://github.com/medusajs/medusa/commit/765a2cccda2c4c552ede9ec23e0c1e3dd4ea44fc), [`69e579758`](https://github.com/medusajs/medusa/commit/69e579758f81332094d6f0dfa6fbcbc359b0d92c), [`05f921711`](https://github.com/medusajs/medusa/commit/05f921711fb0ac3603d29955648d8ba563a7da7d), [`19ca18e71`](https://github.com/medusajs/medusa/commit/19ca18e71c8feea7277e09db3c5e9e6316adb6ab), [`a9c703d56`](https://github.com/medusajs/medusa/commit/a9c703d56c2678fb509af7f9e1fe2cb65f95ba9d), [`58c7ffdc6`](https://github.com/medusajs/medusa/commit/58c7ffdc6ec1d06f76aaa9427505dc452398770f), [`9deec0fc3`](https://github.com/medusajs/medusa/commit/9deec0fc3c3ff9d89ca194b8b05948141799a412), [`299c4ae7f`](https://github.com/medusajs/medusa/commit/299c4ae7f55b0586f283d7f21792b7b204df421a), [`48411157b`](https://github.com/medusajs/medusa/commit/48411157b1cdec0a67f91e06de8ac547af89d7af), [`144ce0e42`](https://github.com/medusajs/medusa/commit/144ce0e42cd894a2cd5b40b68c095fd1eda851a9), [`8be67c734`](https://github.com/medusajs/medusa/commit/8be67c734c970ef03bf0afaf74cc3818e305466d)]:
  - @medusajs/medusa@1.6.0

## 1.3.1

### Patch Changes

- [#2207](https://github.com/medusajs/medusa/pull/2207) [`6132711ee`](https://github.com/medusajs/medusa/commit/6132711eef797219f1b93e4bc4bdb1dd47655308) Thanks [@sabakhilji](https://github.com/sabakhilji)! - Use correct payload type for resetting password in `medusa-js`

* [#2353](https://github.com/medusajs/medusa/pull/2353) [`642902aae`](https://github.com/medusajs/medusa/commit/642902aaeb25144e59177c178f09fb8398951357) Thanks [@pKorsholm](https://github.com/pKorsholm)! - feat(medusa-js, medusa-react): add expand fields to get order

* Updated dependencies [[`d2b272fab`](https://github.com/medusajs/medusa/commit/d2b272fab649bb272b8af4f2f00aafe89965995e), [`7dc8d3a0c`](https://github.com/medusajs/medusa/commit/7dc8d3a0c90ce06e3f11a6a46dec1f9ec3f26e81), [`3d255302b`](https://github.com/medusajs/medusa/commit/3d255302b022a06b492807774412b1db05fa8d06), [`678a06752`](https://github.com/medusajs/medusa/commit/678a06752a03f71d77265a874fd7d07361337862), [`d8a5942d3`](https://github.com/medusajs/medusa/commit/d8a5942d3d85671e2923668bdbf2867957f5554b), [`edd35631f`](https://github.com/medusajs/medusa/commit/edd35631f722009bdcb2439ff8c2326025425d33), [`df62e618b`](https://github.com/medusajs/medusa/commit/df62e618bcc365ef376b96705d63b465b48b0191), [`3f7317028`](https://github.com/medusajs/medusa/commit/3f7317028808cd3c1b44cb7b66694501a7c706c4)]:
  - @medusajs/medusa@1.5.0

## 1.3.0

### Minor Changes

- [#2185](https://github.com/medusajs/medusa/pull/2185) [`64949dc72`](https://github.com/medusajs/medusa/commit/64949dc721a6c697e3eb7091db9f2d261111a766) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - Adds missing response types for currency endpoints and exports route. Adds currency endpoints to medusa-js and medusa-react.

### Patch Changes

- Updated dependencies [[`64949dc72`](https://github.com/medusajs/medusa/commit/64949dc721a6c697e3eb7091db9f2d261111a766), [`b6161d240`](https://github.com/medusajs/medusa/commit/b6161d24043b8b910320475b8616b7e29a96f6cd), [`af80e0fd2`](https://github.com/medusajs/medusa/commit/af80e0fd2ed75cd3c15282ddcbfb949060dfdd33)]:
  - @medusajs/medusa@1.4.0

## 1.2.6

### Patch Changes

- [#1234](https://github.com/medusajs/medusa/pull/1234) [`8cbebef40`](https://github.com/medusajs/medusa/commit/8cbebef403a5ac5def1f95b2e591991cfa90b7fb) Thanks [@WalkingPizza](https://github.com/WalkingPizza)! - Add deleteSession endpoint

* [#1958](https://github.com/medusajs/medusa/pull/1958) [`a88bf3c76`](https://github.com/medusajs/medusa/commit/a88bf3c76ea801d2b17227fb2eb8b8d8dbfe1262) Thanks [@richardwardza](https://github.com/richardwardza)! - Add batch endpoints (remove, add) for Collections to medusa-js

* Updated dependencies [[`15a5b029a`](https://github.com/medusajs/medusa/commit/15a5b029ae3bd954481c558beeac87ace7ab945d), [`900260c5b`](https://github.com/medusajs/medusa/commit/900260c5b9df4f4f927db5bb6921e5e139ff269a), [`42ed20951`](https://github.com/medusajs/medusa/commit/42ed209518bf0278d1bef3c4c47d0ee21cae84c8), [`a54dc68db`](https://github.com/medusajs/medusa/commit/a54dc68db7a7d476cf4bf8d36c122c7f34629c90), [`aaebb38ea`](https://github.com/medusajs/medusa/commit/aaebb38eae883a225779b03556900ea813c991d2), [`9e0cb1212`](https://github.com/medusajs/medusa/commit/9e0cb1212023d7035165ddd269edab3efc7ebe29), [`c97ccd3fb`](https://github.com/medusajs/medusa/commit/c97ccd3fb5dbe796b0e4fbf37def5bb6e8201557), [`152934f8b`](https://github.com/medusajs/medusa/commit/152934f8b07cb3095788091df6823f9665fdf43d), [`8c4be3353`](https://github.com/medusajs/medusa/commit/8c4be3353630efd18759eb893666e44b1b49e2b7), [`bda83a84b`](https://github.com/medusajs/medusa/commit/bda83a84bc99a4741da2076f59071c177bc5534f), [`11fab121f`](https://github.com/medusajs/medusa/commit/11fab121f4c4b5ec3b6a3afccd4c44844bc5e3d9), [`40ae53567`](https://github.com/medusajs/medusa/commit/40ae53567a23ebe562e571fa22f1721eed174c82), [`80e02130b`](https://github.com/medusajs/medusa/commit/80e02130b4a444287920989654b607f07dd8d4f8), [`c31290c91`](https://github.com/medusajs/medusa/commit/c31290c911450a06d5e4da3dc5e4e3977071a6ea), [`4b663cca3`](https://github.com/medusajs/medusa/commit/4b663cca3acf43b0e02a1fb94b8d4f14913bfe45)]:
  - @medusajs/medusa@1.3.6

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
