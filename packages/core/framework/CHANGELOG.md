# @medusajs/framework

## 2.13.3

### Patch Changes

- [#14815](https://github.com/medusajs/medusa/pull/14815) [`dbaae9630d26a0806751d5614beadef3e0b4bf07`](https://github.com/medusajs/medusa/commit/dbaae9630d26a0806751d5614beadef3e0b4bf07) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - fix(framework): remoteQueryConfig undefined entity regression

- Updated dependencies [[`9fecbd2b0487b10736879507cf11ed426d9523d5`](https://github.com/medusajs/medusa/commit/9fecbd2b0487b10736879507cf11ed426d9523d5)]:
  - @medusajs/types@2.13.3
  - @medusajs/modules-sdk@2.13.3
  - @medusajs/orchestration@2.13.3
  - @medusajs/utils@2.13.3
  - @medusajs/workflows-sdk@2.13.3
  - @medusajs/cli@2.13.3
  - @medusajs/deps@2.13.3
  - @medusajs/telemetry@2.13.3

## 2.13.2

### Patch Changes

- [#14292](https://github.com/medusajs/medusa/pull/14292) [`7aca778ae56069371f5d26a757d3b2276d524776`](https://github.com/medusajs/medusa/commit/7aca778ae56069371f5d26a757d3b2276d524776) Thanks [@florianhv](https://github.com/florianhv)! - fix(framework): exclude test files from resource auto-loading

- [#14665](https://github.com/medusajs/medusa/pull/14665) [`77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8`](https://github.com/medusajs/medusa/commit/77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: add forbidden error 403

- Updated dependencies [[`495b823a370c86c25142e02a5daabfeccdc6e518`](https://github.com/medusajs/medusa/commit/495b823a370c86c25142e02a5daabfeccdc6e518), [`f37f029799cad7ee0337aeab625df5e272de2363`](https://github.com/medusajs/medusa/commit/f37f029799cad7ee0337aeab625df5e272de2363), [`42322f44eaaf997e9ab7af2ca1e8621a08a8ca01`](https://github.com/medusajs/medusa/commit/42322f44eaaf997e9ab7af2ca1e8621a08a8ca01), [`583deb57ea5805a1cce7be8342bd8533b29682b5`](https://github.com/medusajs/medusa/commit/583deb57ea5805a1cce7be8342bd8533b29682b5), [`d0e6f710c3f8305b58ac39131a125274987cae05`](https://github.com/medusajs/medusa/commit/d0e6f710c3f8305b58ac39131a125274987cae05), [`9e6e80cd2c58b373ee5e5cbf026e3fa5a9d8b526`](https://github.com/medusajs/medusa/commit/9e6e80cd2c58b373ee5e5cbf026e3fa5a9d8b526), [`77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8`](https://github.com/medusajs/medusa/commit/77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8), [`69ff277f1d2cbf148f432747474b134520b2addb`](https://github.com/medusajs/medusa/commit/69ff277f1d2cbf148f432747474b134520b2addb), [`6c0990afa9c7df80a8a4da9c3c63f04e02fd5cbb`](https://github.com/medusajs/medusa/commit/6c0990afa9c7df80a8a4da9c3c63f04e02fd5cbb)]:
  - @medusajs/types@2.13.2
  - @medusajs/utils@2.13.2
  - @medusajs/orchestration@2.13.2
  - @medusajs/cli@2.13.2
  - @medusajs/modules-sdk@2.13.2
  - @medusajs/workflows-sdk@2.13.2
  - @medusajs/deps@2.13.2
  - @medusajs/telemetry@2.13.2

## 2.13.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/cli@2.13.1
  - @medusajs/modules-sdk@2.13.1
  - @medusajs/orchestration@2.13.1
  - @medusajs/types@2.13.1
  - @medusajs/utils@2.13.1
  - @medusajs/workflows-sdk@2.13.1
  - @medusajs/deps@2.13.1
  - @medusajs/telemetry@2.13.1

## 2.13.0

### Minor Changes

- [`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor bump

### Patch Changes

- Updated dependencies [[`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7)]:
  - @medusajs/cli@2.13.0
  - @medusajs/modules-sdk@2.13.0
  - @medusajs/orchestration@2.13.0
  - @medusajs/types@2.13.0
  - @medusajs/utils@2.13.0
  - @medusajs/workflows-sdk@2.13.0
  - @medusajs/deps@2.13.0
  - @medusajs/telemetry@2.13.0

## 2.12.6

### Patch Changes

- [#14478](https://github.com/medusajs/medusa/pull/14478) [`13476988763368b3b333fa5bc3f613e8eb174fdf`](https://github.com/medusajs/medusa/commit/13476988763368b3b333fa5bc3f613e8eb174fdf) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat/enable event configuration in medusa config
  enables event priority configuration through the Medusa config, allowing users to configure event processing options (like priority) for specific events at the module level.

- [#14540](https://github.com/medusajs/medusa/pull/14540) [`8890f284705a4843a57a3800820208f593689a2a`](https://github.com/medusajs/medusa/commit/8890f284705a4843a57a3800820208f593689a2a) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Prevent build command from throwing on missing config

- [#14441](https://github.com/medusajs/medusa/pull/14441) [`1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b`](https://github.com/medusajs/medusa/commit/1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(deps,framework): add zod as framework dependency

- Updated dependencies [[`42235825eeacd4554a5fb533feda5840175bee38`](https://github.com/medusajs/medusa/commit/42235825eeacd4554a5fb533feda5840175bee38), [`13476988763368b3b333fa5bc3f613e8eb174fdf`](https://github.com/medusajs/medusa/commit/13476988763368b3b333fa5bc3f613e8eb174fdf), [`55d2a704700433c34edd0f7f10dfd042d2f9333a`](https://github.com/medusajs/medusa/commit/55d2a704700433c34edd0f7f10dfd042d2f9333a), [`a9b5797e2de093e26286808876262b724e26671a`](https://github.com/medusajs/medusa/commit/a9b5797e2de093e26286808876262b724e26671a), [`d60ea7268a00f386f803f0f9e6ffeec4bced50bf`](https://github.com/medusajs/medusa/commit/d60ea7268a00f386f803f0f9e6ffeec4bced50bf), [`39b9f84affcdda267bca0ee486825daca2e4a896`](https://github.com/medusajs/medusa/commit/39b9f84affcdda267bca0ee486825daca2e4a896), [`41e1d5e5066719569d4f639415d3d1fdae1ddc0b`](https://github.com/medusajs/medusa/commit/41e1d5e5066719569d4f639415d3d1fdae1ddc0b), [`cec8b8e428131d4743d6da98cd5fa0974b8ab9e1`](https://github.com/medusajs/medusa/commit/cec8b8e428131d4743d6da98cd5fa0974b8ab9e1), [`7828f5ac791df6cb1af56595b6dcadbc4815d61f`](https://github.com/medusajs/medusa/commit/7828f5ac791df6cb1af56595b6dcadbc4815d61f), [`b615b71a8e4e273018a09528a8b61116fca6de8b`](https://github.com/medusajs/medusa/commit/b615b71a8e4e273018a09528a8b61116fca6de8b), [`95e9dfdcaf008b86e2ed3d1ad273b369776bc90e`](https://github.com/medusajs/medusa/commit/95e9dfdcaf008b86e2ed3d1ad273b369776bc90e), [`89e6e3e5cbe96f1f64e2cdb33cc2e0d6a221f7a2`](https://github.com/medusajs/medusa/commit/89e6e3e5cbe96f1f64e2cdb33cc2e0d6a221f7a2), [`1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b`](https://github.com/medusajs/medusa/commit/1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b)]:
  - @medusajs/cli@2.12.6
  - @medusajs/types@2.12.6
  - @medusajs/utils@2.12.6
  - @medusajs/workflows-sdk@2.12.6
  - @medusajs/deps@2.12.6
  - @medusajs/modules-sdk@2.12.6
  - @medusajs/orchestration@2.12.6
  - @medusajs/telemetry@2.12.6

## 2.12.5

### Patch Changes

- [#14502](https://github.com/medusajs/medusa/pull/14502) [`233ec261be200fac83002415aa7c0df082339a3f`](https://github.com/medusajs/medusa/commit/233ec261be200fac83002415aa7c0df082339a3f) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix/add schema only flag

- Updated dependencies [[`bb599a26deed6d5b98e6ce6308c447dca5b90f10`](https://github.com/medusajs/medusa/commit/bb599a26deed6d5b98e6ce6308c447dca5b90f10), [`08c55e703573f3c11532228d2c626f7b7f16228f`](https://github.com/medusajs/medusa/commit/08c55e703573f3c11532228d2c626f7b7f16228f), [`233ec261be200fac83002415aa7c0df082339a3f`](https://github.com/medusajs/medusa/commit/233ec261be200fac83002415aa7c0df082339a3f)]:
  - @medusajs/modules-sdk@2.12.5
  - @medusajs/types@2.12.5
  - @medusajs/utils@2.12.5
  - @medusajs/workflows-sdk@2.12.5
  - @medusajs/orchestration@2.12.5
  - @medusajs/cli@2.12.5
  - @medusajs/deps@2.12.5
  - @medusajs/telemetry@2.12.5

## 2.12.4

### Patch Changes

- [#14337](https://github.com/medusajs/medusa/pull/14337) [`181d5fa67122e4e5f38b91f6b716d35f2d08a204`](https://github.com/medusajs/medusa/commit/181d5fa67122e4e5f38b91f6b716d35f2d08a204) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Auto generated types generation upon build

- [#14390](https://github.com/medusajs/medusa/pull/14390) [`d347e369ce555064e24f2dc3cd93b9e4e73a006d`](https://github.com/medusajs/medusa/commit/d347e369ce555064e24f2dc3cd93b9e4e73a006d) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - fix(medusa,framework): hmr file watch

- Updated dependencies [[`0ffd79010953315494c1b2ba1def477b7b1d9e4b`](https://github.com/medusajs/medusa/commit/0ffd79010953315494c1b2ba1def477b7b1d9e4b), [`89a0adc6122a78891cd9d56dfaadf6fc7af04efb`](https://github.com/medusajs/medusa/commit/89a0adc6122a78891cd9d56dfaadf6fc7af04efb), [`bf4cc12545edc5bf249edc6ecec115c5f7a2b31f`](https://github.com/medusajs/medusa/commit/bf4cc12545edc5bf249edc6ecec115c5f7a2b31f), [`b21a599d118f126e64d2993d46ba60f4a4e94545`](https://github.com/medusajs/medusa/commit/b21a599d118f126e64d2993d46ba60f4a4e94545), [`181d5fa67122e4e5f38b91f6b716d35f2d08a204`](https://github.com/medusajs/medusa/commit/181d5fa67122e4e5f38b91f6b716d35f2d08a204), [`001923da2bbebb3d42373f0f66e517830d9c0187`](https://github.com/medusajs/medusa/commit/001923da2bbebb3d42373f0f66e517830d9c0187), [`43305a562cfba914654da056b0a7e03c40849678`](https://github.com/medusajs/medusa/commit/43305a562cfba914654da056b0a7e03c40849678)]:
  - @medusajs/modules-sdk@2.12.4
  - @medusajs/types@2.12.4
  - @medusajs/utils@2.12.4
  - @medusajs/cli@2.12.4
  - @medusajs/workflows-sdk@2.12.4
  - @medusajs/orchestration@2.12.4
  - @medusajs/deps@2.12.4
  - @medusajs/telemetry@2.12.4

## 2.12.3

### Patch Changes

- [#14305](https://github.com/medusajs/medusa/pull/14305) [`7b4dda5a179c78de5e099231ec407836db4c8dbd`](https://github.com/medusajs/medusa/commit/7b4dda5a179c78de5e099231ec407836db4c8dbd) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): apply locale middleware to all store routes

- [#14300](https://github.com/medusajs/medusa/pull/14300) [`8964a03fa1b9e6a4c443bf5b21d65d41a8441d29`](https://github.com/medusajs/medusa/commit/8964a03fa1b9e6a4c443bf5b21d65d41a8441d29) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - chore(): Remove default_locale from StoreLocale

- [#14318](https://github.com/medusajs/medusa/pull/14318) [`c8a7122ba918751b215dc0b19cf9b09b2c011ab8`](https://github.com/medusajs/medusa/commit/c8a7122ba918751b215dc0b19cf9b09b2c011ab8) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Update locale header usage

- Updated dependencies [[`b3cb904e9bce3bfad649e500a9e1be0c9bff0e1a`](https://github.com/medusajs/medusa/commit/b3cb904e9bce3bfad649e500a9e1be0c9bff0e1a), [`31a057558c0ec6ff7233489a28edc1fda0ec5375`](https://github.com/medusajs/medusa/commit/31a057558c0ec6ff7233489a28edc1fda0ec5375), [`8bb2ac654ce928edf1c3a2040f35614c924800c8`](https://github.com/medusajs/medusa/commit/8bb2ac654ce928edf1c3a2040f35614c924800c8), [`accb778039a52fae8eefbada77044c527b136114`](https://github.com/medusajs/medusa/commit/accb778039a52fae8eefbada77044c527b136114), [`8964a03fa1b9e6a4c443bf5b21d65d41a8441d29`](https://github.com/medusajs/medusa/commit/8964a03fa1b9e6a4c443bf5b21d65d41a8441d29), [`ba6ed8d9dd22be8646d311d9531c65aea1b7986a`](https://github.com/medusajs/medusa/commit/ba6ed8d9dd22be8646d311d9531c65aea1b7986a), [`70929ecac3e5610d90d47a40a517eac3cf3173a4`](https://github.com/medusajs/medusa/commit/70929ecac3e5610d90d47a40a517eac3cf3173a4), [`f13c23a4b709e31f9b2d42e98acc6e342c494403`](https://github.com/medusajs/medusa/commit/f13c23a4b709e31f9b2d42e98acc6e342c494403), [`d813fc4ff91e98b475a4eae11780ddc00caf66a8`](https://github.com/medusajs/medusa/commit/d813fc4ff91e98b475a4eae11780ddc00caf66a8)]:
  - @medusajs/utils@2.12.3
  - @medusajs/types@2.12.3
  - @medusajs/cli@2.12.3
  - @medusajs/modules-sdk@2.12.3
  - @medusajs/orchestration@2.12.3
  - @medusajs/workflows-sdk@2.12.3
  - @medusajs/deps@2.12.3
  - @medusajs/telemetry@2.12.3

## 2.12.2

### Patch Changes

- [#14204](https://github.com/medusajs/medusa/pull/14204) [`9f7846ae0babbad39947a1f33d236bff8b5098d0`](https://github.com/medusajs/medusa/commit/9f7846ae0babbad39947a1f33d236bff8b5098d0) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): revert route loading parallelization

- [#14074](https://github.com/medusajs/medusa/pull/14074) [`fe49b567d6d55ae224095c06c710d31d40887653`](https://github.com/medusajs/medusa/commit/fe49b567d6d55ae224095c06c710d31d40887653) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Backend HMR (expriemental)

- [#14189](https://github.com/medusajs/medusa/pull/14189) [`6dc0b8bed84a330c1c24f4f1331f1ed078430a47`](https://github.com/medusajs/medusa/commit/6dc0b8bed84a330c1c24f4f1331f1ed078430a47) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(framework): Prevent registering express handler for disabled routes

- [#14262](https://github.com/medusajs/medusa/pull/14262) [`356283c359e5c30e0d31e6c6fd0fb8e16c025b78`](https://github.com/medusajs/medusa/commit/356283c359e5c30e0d31e6c6fd0fb8e16c025b78) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Accept an extra agument 'all-or-nothing' on the migrate command

- Updated dependencies [[`4dbf46f2cb64240092843ebfdef766ec5b2a7116`](https://github.com/medusajs/medusa/commit/4dbf46f2cb64240092843ebfdef766ec5b2a7116), [`e4877616c38777f583fe0b58bb10d1c7cf41c0b3`](https://github.com/medusajs/medusa/commit/e4877616c38777f583fe0b58bb10d1c7cf41c0b3), [`a78f68fa46dceb8e201fe60e770bd9ea654390d8`](https://github.com/medusajs/medusa/commit/a78f68fa46dceb8e201fe60e770bd9ea654390d8), [`fe49b567d6d55ae224095c06c710d31d40887653`](https://github.com/medusajs/medusa/commit/fe49b567d6d55ae224095c06c710d31d40887653), [`b517137466726c15d5e31ab0c9f42aa57af90c4e`](https://github.com/medusajs/medusa/commit/b517137466726c15d5e31ab0c9f42aa57af90c4e), [`fd3965974dc0b750d377ff621387d34611760957`](https://github.com/medusajs/medusa/commit/fd3965974dc0b750d377ff621387d34611760957), [`356283c359e5c30e0d31e6c6fd0fb8e16c025b78`](https://github.com/medusajs/medusa/commit/356283c359e5c30e0d31e6c6fd0fb8e16c025b78), [`5b7e3c0e7649a3a61b0a4fe796f37e5f7fbe9a3a`](https://github.com/medusajs/medusa/commit/5b7e3c0e7649a3a61b0a4fe796f37e5f7fbe9a3a)]:
  - @medusajs/utils@2.12.2
  - @medusajs/types@2.12.2
  - @medusajs/workflows-sdk@2.12.2
  - @medusajs/modules-sdk@2.12.2
  - @medusajs/cli@2.12.2
  - @medusajs/orchestration@2.12.2
  - @medusajs/deps@2.12.2
  - @medusajs/telemetry@2.12.2

## 2.12.1

### Patch Changes

- Updated dependencies [[`391d8dc6cd50c79b678059fdeb7774a72e243143`](https://github.com/medusajs/medusa/commit/391d8dc6cd50c79b678059fdeb7774a72e243143)]:
  - @medusajs/utils@2.12.1
  - @medusajs/cli@2.12.1
  - @medusajs/modules-sdk@2.12.1
  - @medusajs/orchestration@2.12.1
  - @medusajs/workflows-sdk@2.12.1
  - @medusajs/types@2.12.1
  - @medusajs/deps@2.12.1
  - @medusajs/telemetry@2.12.1

## 2.12.0

### Patch Changes

- [#14042](https://github.com/medusajs/medusa/pull/14042) [`c2c3ad5ba53f1959422fb2d37297a8de8d714782`](https://github.com/medusajs/medusa/commit/c2c3ad5ba53f1959422fb2d37297a8de8d714782) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Upgrade vit to non vulnerable one

- [#14023](https://github.com/medusajs/medusa/pull/14023) [`7e3eb6e41316d7b04d32bc7186ed0c78de1aa539`](https://github.com/medusajs/medusa/commit/7e3eb6e41316d7b04d32bc7186ed0c78de1aa539) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: cleanup/improve bootstrap

- [#14083](https://github.com/medusajs/medusa/pull/14083) [`beb91d88a2f224075e4fcf35a0ee9483b3124504`](https://github.com/medusajs/medusa/commit/beb91d88a2f224075e4fcf35a0ee9483b3124504) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Update glob package

- Updated dependencies [[`c2c3ad5ba53f1959422fb2d37297a8de8d714782`](https://github.com/medusajs/medusa/commit/c2c3ad5ba53f1959422fb2d37297a8de8d714782), [`7e3eb6e41316d7b04d32bc7186ed0c78de1aa539`](https://github.com/medusajs/medusa/commit/7e3eb6e41316d7b04d32bc7186ed0c78de1aa539), [`beb91d88a2f224075e4fcf35a0ee9483b3124504`](https://github.com/medusajs/medusa/commit/beb91d88a2f224075e4fcf35a0ee9483b3124504), [`78842af1c30de9c7561f10b4129aba4e1f30db27`](https://github.com/medusajs/medusa/commit/78842af1c30de9c7561f10b4129aba4e1f30db27), [`8ddf8b4d764ae359d279498f08d85146d55077f0`](https://github.com/medusajs/medusa/commit/8ddf8b4d764ae359d279498f08d85146d55077f0), [`00aa2c13bc37223029e40b38f3e2bedd8ed1e816`](https://github.com/medusajs/medusa/commit/00aa2c13bc37223029e40b38f3e2bedd8ed1e816), [`536a3f802c92960b1eab48c37db25a8c542fd231`](https://github.com/medusajs/medusa/commit/536a3f802c92960b1eab48c37db25a8c542fd231), [`5da51064d7936c6d7a459cfa8b34eada65163e03`](https://github.com/medusajs/medusa/commit/5da51064d7936c6d7a459cfa8b34eada65163e03), [`a9d33bc8d11637230052f1729e85af5e174b2423`](https://github.com/medusajs/medusa/commit/a9d33bc8d11637230052f1729e85af5e174b2423), [`1ea932a56f1d85fd1ebbe4a77f3619fe58d2947a`](https://github.com/medusajs/medusa/commit/1ea932a56f1d85fd1ebbe4a77f3619fe58d2947a), [`b81f958d4126ab99f09b9fef3b1f790b4bca1515`](https://github.com/medusajs/medusa/commit/b81f958d4126ab99f09b9fef3b1f790b4bca1515), [`62d103b44f6402529a156202e37ec5ece01244b4`](https://github.com/medusajs/medusa/commit/62d103b44f6402529a156202e37ec5ece01244b4), [`5c6c28545c6fe4789afdb8fedcab144eda2a452f`](undefined), [`e59cdae3365981339d55ec01224f09995250e67d`](https://github.com/medusajs/medusa/commit/e59cdae3365981339d55ec01224f09995250e67d), [`b74ef4a784d3728ff2c657a8186095e87fc3f0d4`](https://github.com/medusajs/medusa/commit/b74ef4a784d3728ff2c657a8186095e87fc3f0d4), [`6746fecd727823b233a90edb1819d08555124464`](https://github.com/medusajs/medusa/commit/6746fecd727823b233a90edb1819d08555124464), [`9d9d0397a88c398683f75ac3d6f539c1a686d278`](undefined), [`5725837ba8bb592cd6de962999430c8a5acf00ed`](undefined), [`a85778679e99c40421b3be0122d153f991efbc80`](https://github.com/medusajs/medusa/commit/a85778679e99c40421b3be0122d153f991efbc80), [`f67bfb9f92b9ea4c06910ea203c685e18fafe1d7`](https://github.com/medusajs/medusa/commit/f67bfb9f92b9ea4c06910ea203c685e18fafe1d7)]:
  - @medusajs/types@2.12.0
  - @medusajs/telemetry@2.12.0
  - @medusajs/modules-sdk@2.12.0
  - @medusajs/cli@2.12.0
  - @medusajs/utils@2.12.0
  - @medusajs/orchestration@2.12.0
  - @medusajs/workflows-sdk@2.12.0
  - @medusajs/deps@2.12.0

## 2.11.3

### Patch Changes

- [#13948](https://github.com/medusajs/medusa/pull/13948) [`28c3ea68f5634792848f146ac6af5b27c848bf21`](https://github.com/medusajs/medusa/commit/28c3ea68f5634792848f146ac6af5b27c848bf21) Thanks [@peterlgh7](https://github.com/peterlgh7)! - fix typo in opentelemetry-resources.ts name

- [#13910](https://github.com/medusajs/medusa/pull/13910) [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Dependencies cleanup and improvements

- [#13940](https://github.com/medusajs/medusa/pull/13940) [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Cleanup and organize deps

- [#13932](https://github.com/medusajs/medusa/pull/13932) [`37563987b8fe75c9acfe62957a33e8398977647a`](https://github.com/medusajs/medusa/commit/37563987b8fe75c9acfe62957a33e8398977647a) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Fix dependencies vulnerabilities

- [#13898](https://github.com/medusajs/medusa/pull/13898) [`13d7d15be594ca413785eebe8f86b47c36cb9830`](https://github.com/medusajs/medusa/commit/13d7d15be594ca413785eebe8f86b47c36cb9830) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(modules-sdk): parallel migrations

- Updated dependencies [[`42b270ed2df09474f528d8d23816e0affcf4bd25`](https://github.com/medusajs/medusa/commit/42b270ed2df09474f528d8d23816e0affcf4bd25), [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d), [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff), [`e66f7cf59e516f12e5446e191e9fdd1aede9c8ab`](https://github.com/medusajs/medusa/commit/e66f7cf59e516f12e5446e191e9fdd1aede9c8ab), [`37563987b8fe75c9acfe62957a33e8398977647a`](https://github.com/medusajs/medusa/commit/37563987b8fe75c9acfe62957a33e8398977647a), [`516e217dbb848b71810e006c4eab914a40d7ecfc`](https://github.com/medusajs/medusa/commit/516e217dbb848b71810e006c4eab914a40d7ecfc), [`13d7d15be594ca413785eebe8f86b47c36cb9830`](https://github.com/medusajs/medusa/commit/13d7d15be594ca413785eebe8f86b47c36cb9830)]:
  - @medusajs/types@2.11.3
  - @medusajs/cli@2.11.3
  - @medusajs/deps@2.11.3
  - @medusajs/modules-sdk@2.11.3
  - @medusajs/orchestration@2.11.3
  - @medusajs/telemetry@2.11.3
  - @medusajs/utils@2.11.3
  - @medusajs/workflows-sdk@2.11.3

## 2.11.2

### Patch Changes

- [#13869](https://github.com/medusajs/medusa/pull/13869) [`85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2`](https://github.com/medusajs/medusa/commit/85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(index): Add support for API end points to interact with the index module

- Updated dependencies [[`cc2614ded7f83cdbe7e7f7f809d05f5ab6059fe4`](https://github.com/medusajs/medusa/commit/cc2614ded7f83cdbe7e7f7f809d05f5ab6059fe4), [`01ee437926f0a4ec587510c65f8282620bf72d3f`](https://github.com/medusajs/medusa/commit/01ee437926f0a4ec587510c65f8282620bf72d3f), [`25a20ca95f702dfb8a34fe9e4f3c565a47c2655e`](https://github.com/medusajs/medusa/commit/25a20ca95f702dfb8a34fe9e4f3c565a47c2655e), [`ec4443287601f5fe1544b305873f3aa151ed1bd7`](https://github.com/medusajs/medusa/commit/ec4443287601f5fe1544b305873f3aa151ed1bd7), [`47572816778e21432d0201f4b2642a765c86fdbc`](https://github.com/medusajs/medusa/commit/47572816778e21432d0201f4b2642a765c86fdbc), [`66bbe39a8ee812ae88b7f06f7d911b8254b1c87e`](https://github.com/medusajs/medusa/commit/66bbe39a8ee812ae88b7f06f7d911b8254b1c87e), [`c9701c70da33bb81aca1560ac5b96ea53fb61060`](https://github.com/medusajs/medusa/commit/c9701c70da33bb81aca1560ac5b96ea53fb61060), [`6d7ba778f5ace76350ac6f249b855b21fb43a03e`](https://github.com/medusajs/medusa/commit/6d7ba778f5ace76350ac6f249b855b21fb43a03e), [`85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2`](https://github.com/medusajs/medusa/commit/85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2), [`1defb3c29bfe018fd5f89b5a9e27fc8a31d72cdd`](https://github.com/medusajs/medusa/commit/1defb3c29bfe018fd5f89b5a9e27fc8a31d72cdd)]:
  - @medusajs/types@2.11.2
  - @medusajs/utils@2.11.2
  - @medusajs/modules-sdk@2.11.2
  - @medusajs/orchestration@2.11.2
  - @medusajs/workflows-sdk@2.11.2
  - @medusajs/cli@2.11.2
  - @medusajs/deps@2.11.2
  - @medusajs/telemetry@2.11.2

## 2.11.1

### Patch Changes

- Updated dependencies [[`d51ae2768be0dad5ece49324aa4866bb591e7ad0`](https://github.com/medusajs/medusa/commit/d51ae2768be0dad5ece49324aa4866bb591e7ad0), [`bad0858348dca100533bb6fcdcdefe90b0668407`](https://github.com/medusajs/medusa/commit/bad0858348dca100533bb6fcdcdefe90b0668407), [`5df903f5fb52d1e37d13bfe72ed9c226c1eb46b4`](https://github.com/medusajs/medusa/commit/5df903f5fb52d1e37d13bfe72ed9c226c1eb46b4)]:
  - @medusajs/orchestration@2.11.1
  - @medusajs/workflows-sdk@2.11.1
  - @medusajs/types@2.11.1
  - @medusajs/modules-sdk@2.11.1
  - @medusajs/utils@2.11.1
  - @medusajs/cli@2.11.1
  - @medusajs/deps@2.11.1
  - @medusajs/telemetry@2.11.1

## 2.11.0

### Patch Changes

- [#13439](https://github.com/medusajs/medusa/pull/13439) [`12a96a7c7015f011f5e29a1d387f835e514ba536`](https://github.com/medusajs/medusa/commit/12a96a7c7015f011f5e29a1d387f835e514ba536) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Move peer deps into a single package and re export from framework

- [#13435](https://github.com/medusajs/medusa/pull/13435) [`b9d6f73320c36c53235b12fb8397b30a448917f0`](https://github.com/medusajs/medusa/commit/b9d6f73320c36c53235b12fb8397b30a448917f0) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(): distributed caching

- [#13450](https://github.com/medusajs/medusa/pull/13450) [`8ece06d8ed6a197ebb370918c49a3ec5c21dd186`](https://github.com/medusajs/medusa/commit/8ece06d8ed6a197ebb370918c49a3ec5c21dd186) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Upgrade mikro orm 6.5.4

- [#13568](https://github.com/medusajs/medusa/pull/13568) [`92d30b28f45b4037cd73c180c8f257070cf49bd4`](https://github.com/medusajs/medusa/commit/92d30b28f45b4037cd73c180c8f257070cf49bd4) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): remove ssl_mode from url and also use sslmode

- [#13646](https://github.com/medusajs/medusa/pull/13646) [`02b6d013822b9665f868c4ea6d1b5cfe58723459`](https://github.com/medusajs/medusa/commit/02b6d013822b9665f868c4ea6d1b5cfe58723459) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Add instrumentation to deps

- Updated dependencies [[`0cbd9f0bc315b3eda1770ac301061f1576856387`](https://github.com/medusajs/medusa/commit/0cbd9f0bc315b3eda1770ac301061f1576856387), [`12a96a7c7015f011f5e29a1d387f835e514ba536`](https://github.com/medusajs/medusa/commit/12a96a7c7015f011f5e29a1d387f835e514ba536), [`c61f3150c138de016c6886e79d79984bc267273c`](https://github.com/medusajs/medusa/commit/c61f3150c138de016c6886e79d79984bc267273c), [`45f180a2b558edcf69603f3d8da983e92c4e212d`](https://github.com/medusajs/medusa/commit/45f180a2b558edcf69603f3d8da983e92c4e212d), [`7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1`](https://github.com/medusajs/medusa/commit/7dc3b0c5ffdf8eb7070ee5cfd8155c6c4de5c0b1), [`9c7c1d48c7779023172d5e7003674b2d7107b733`](https://github.com/medusajs/medusa/commit/9c7c1d48c7779023172d5e7003674b2d7107b733), [`76aa4a48b3cbec519ab16c96cc87ee3288de28de`](https://github.com/medusajs/medusa/commit/76aa4a48b3cbec519ab16c96cc87ee3288de28de), [`513b352da3f580d87e556fd5cd54e7005313ce2f`](https://github.com/medusajs/medusa/commit/513b352da3f580d87e556fd5cd54e7005313ce2f), [`8a4c10d7f8b74fc68296e9825c777e3e2fc57d0a`](https://github.com/medusajs/medusa/commit/8a4c10d7f8b74fc68296e9825c777e3e2fc57d0a), [`9d8ed70130867466f81834adf13b7b60bdfc0b6a`](undefined), [`150aa50397825ae800f3acf4bbc68fe28e397582`](https://github.com/medusajs/medusa/commit/150aa50397825ae800f3acf4bbc68fe28e397582), [`b9d6f73320c36c53235b12fb8397b30a448917f0`](https://github.com/medusajs/medusa/commit/b9d6f73320c36c53235b12fb8397b30a448917f0), [`28d57b7bf8bceee62449564228b9e08d4f706cd7`](https://github.com/medusajs/medusa/commit/28d57b7bf8bceee62449564228b9e08d4f706cd7), [`51859c38a728c5f05cf30f09f4c6a55657895de7`](https://github.com/medusajs/medusa/commit/51859c38a728c5f05cf30f09f4c6a55657895de7), [`41651721450c99e5f38cfbb87a6a47ab067ece86`](https://github.com/medusajs/medusa/commit/41651721450c99e5f38cfbb87a6a47ab067ece86), [`a61d1825eaef4bece20704fe6ae21d9da841b2f2`](https://github.com/medusajs/medusa/commit/a61d1825eaef4bece20704fe6ae21d9da841b2f2), [`5e827ec95d0f721e62c0d4e8c603bda7ddc0929c`](https://github.com/medusajs/medusa/commit/5e827ec95d0f721e62c0d4e8c603bda7ddc0929c), [`8ece06d8ed6a197ebb370918c49a3ec5c21dd186`](https://github.com/medusajs/medusa/commit/8ece06d8ed6a197ebb370918c49a3ec5c21dd186), [`fc67fd0b36f53f0c0897df54ecea02061e65e816`](https://github.com/medusajs/medusa/commit/fc67fd0b36f53f0c0897df54ecea02061e65e816), [`c54c5ed6de2c9686f89aeef86c5c607c4b5f1cf3`](https://github.com/medusajs/medusa/commit/c54c5ed6de2c9686f89aeef86c5c607c4b5f1cf3), [`458dd04bbf70159ec42254e91675c7a1f1d344d8`](https://github.com/medusajs/medusa/commit/458dd04bbf70159ec42254e91675c7a1f1d344d8), [`92d30b28f45b4037cd73c180c8f257070cf49bd4`](https://github.com/medusajs/medusa/commit/92d30b28f45b4037cd73c180c8f257070cf49bd4), [`02b6d013822b9665f868c4ea6d1b5cfe58723459`](https://github.com/medusajs/medusa/commit/02b6d013822b9665f868c4ea6d1b5cfe58723459), [`516f5a38960f1ea05a2c696e0079d2e4c34d5c86`](https://github.com/medusajs/medusa/commit/516f5a38960f1ea05a2c696e0079d2e4c34d5c86), [`8734866eb108871c36343098a0297475e952f58f`](https://github.com/medusajs/medusa/commit/8734866eb108871c36343098a0297475e952f58f)]:
  - @medusajs/types@2.11.0
  - @medusajs/deps@2.11.0
  - @medusajs/modules-sdk@2.11.0
  - @medusajs/orchestration@2.11.0
  - @medusajs/cli@2.11.0
  - @medusajs/utils@2.11.0
  - @medusajs/workflows-sdk@2.11.0
  - @medusajs/telemetry@2.11.0

## 2.10.3

### Patch Changes

- [#13516](https://github.com/medusajs/medusa/pull/13516) [`25634b038248ab6501af719faec79b59b496bada`](https://github.com/medusajs/medusa/commit/25634b038248ab6501af719faec79b59b496bada) Thanks [@adrien2p](https://github.com/adrien2p)! - test(): test dynamic max workers and improve CI

- Updated dependencies [[`2a29c6f82c73ff6720cc21e885125c984419226c`](https://github.com/medusajs/medusa/commit/2a29c6f82c73ff6720cc21e885125c984419226c), [`ebf33bea43bb6fe03a60a3099b2bc62608f0d13b`](https://github.com/medusajs/medusa/commit/ebf33bea43bb6fe03a60a3099b2bc62608f0d13b), [`25634b038248ab6501af719faec79b59b496bada`](https://github.com/medusajs/medusa/commit/25634b038248ab6501af719faec79b59b496bada), [`9563ee446f2b3a2e0cd4a4a33959ed55be5f268a`](https://github.com/medusajs/medusa/commit/9563ee446f2b3a2e0cd4a4a33959ed55be5f268a), [`88748ba09d6578608d3d9858718fbbfba956f67b`](https://github.com/medusajs/medusa/commit/88748ba09d6578608d3d9858718fbbfba956f67b)]:
  - @medusajs/types@2.10.3
  - @medusajs/orchestration@2.10.3
  - @medusajs/modules-sdk@2.10.3
  - @medusajs/utils@2.10.3
  - @medusajs/workflows-sdk@2.10.3
  - @medusajs/cli@2.10.3
  - @medusajs/telemetry@2.10.3

## 2.10.2

### Patch Changes

- [#13312](https://github.com/medusajs/medusa/pull/13312) [`b4c0f131b70ba950339c1ca4d81b5ce062a588a3`](https://github.com/medusajs/medusa/commit/b4c0f131b70ba950339c1ca4d81b5ce062a588a3) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(framework): load custom flags before medusa config

- [#13476](https://github.com/medusajs/medusa/pull/13476) [`a4b72f9a21fd1d278c622fcd45d24bb9bfb1e0a8`](https://github.com/medusajs/medusa/commit/a4b72f9a21fd1d278c622fcd45d24bb9bfb1e0a8) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(): prepare list query for list

- Updated dependencies [[`e8822f3e693bde33fdfd8b0d6140b4e59b40af98`](https://github.com/medusajs/medusa/commit/e8822f3e693bde33fdfd8b0d6140b4e59b40af98), [`0000ed69982b95f4bff80fd6182347291d25f7b8`](https://github.com/medusajs/medusa/commit/0000ed69982b95f4bff80fd6182347291d25f7b8), [`115a1deb49b154dc18c5e406fd8fbd7ad412df97`](https://github.com/medusajs/medusa/commit/115a1deb49b154dc18c5e406fd8fbd7ad412df97), [`b4c0f131b70ba950339c1ca4d81b5ce062a588a3`](https://github.com/medusajs/medusa/commit/b4c0f131b70ba950339c1ca4d81b5ce062a588a3), [`faae150a589bb29d08719ebb1d2617234e1f5e3a`](https://github.com/medusajs/medusa/commit/faae150a589bb29d08719ebb1d2617234e1f5e3a), [`d7692100e7a2b2f078756cac9ca2b33784d3d1ff`](https://github.com/medusajs/medusa/commit/d7692100e7a2b2f078756cac9ca2b33784d3d1ff), [`0079464f32052ebc225e5a795be9cb018a3a6aeb`](https://github.com/medusajs/medusa/commit/0079464f32052ebc225e5a795be9cb018a3a6aeb), [`55a35e47218c65190e36a1a6088031890edc1b14`](https://github.com/medusajs/medusa/commit/55a35e47218c65190e36a1a6088031890edc1b14), [`6634765cedc68f605f005766845350d611db142c`](https://github.com/medusajs/medusa/commit/6634765cedc68f605f005766845350d611db142c), [`b85a46e85bb741b942e7fa23bef48f447d2b7c5a`](https://github.com/medusajs/medusa/commit/b85a46e85bb741b942e7fa23bef48f447d2b7c5a), [`fc4d5f0ac94afaf48fdf39f1d6bd3ac97259a8c5`](https://github.com/medusajs/medusa/commit/fc4d5f0ac94afaf48fdf39f1d6bd3ac97259a8c5), [`8e5c22a8e8c54daa313b4685e453e49699d75e9a`](https://github.com/medusajs/medusa/commit/8e5c22a8e8c54daa313b4685e453e49699d75e9a), [`2f6edf367abb9d3e71f398c3b98a749b73517ea6`](https://github.com/medusajs/medusa/commit/2f6edf367abb9d3e71f398c3b98a749b73517ea6), [`0700a2448c54438482cd3b422e66c591bc5c1df8`](https://github.com/medusajs/medusa/commit/0700a2448c54438482cd3b422e66c591bc5c1df8), [`823a5c75ff97cf0acbd4ddf00f43ab3b49f0f210`](https://github.com/medusajs/medusa/commit/823a5c75ff97cf0acbd4ddf00f43ab3b49f0f210), [`1b681a79da02aec3f872baa2213a4b2423d73e97`](https://github.com/medusajs/medusa/commit/1b681a79da02aec3f872baa2213a4b2423d73e97)]:
  - @medusajs/utils@2.10.2
  - @medusajs/types@2.10.2
  - @medusajs/cli@2.10.2
  - @medusajs/modules-sdk@2.10.2
  - @medusajs/orchestration@2.10.2
  - @medusajs/workflows-sdk@2.10.2
  - @medusajs/telemetry@2.10.2

## 2.10.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/cli@2.10.1
  - @medusajs/modules-sdk@2.10.1
  - @medusajs/orchestration@2.10.1
  - @medusajs/types@2.10.1
  - @medusajs/utils@2.10.1
  - @medusajs/workflows-sdk@2.10.1
  - @medusajs/telemetry@2.10.1

## 2.10.0

### Patch Changes

- [#13283](https://github.com/medusajs/medusa/pull/13283) [`e413cfefc2e0579ba7c5299dc4f4270310e39c2c`](https://github.com/medusajs/medusa/commit/e413cfefc2e0579ba7c5299dc4f4270310e39c2c) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: define file config and improved feature flag support

- [#13156](https://github.com/medusajs/medusa/pull/13156) [`e2213448ac9eb93318570fde2807a3036108d44b`](https://github.com/medusajs/medusa/commit/e2213448ac9eb93318570fde2807a3036108d44b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat: custom logger on medusa-config

- Updated dependencies [[`486621383a79e83c831933c1a0ffdae58a695cb0`](https://github.com/medusajs/medusa/commit/486621383a79e83c831933c1a0ffdae58a695cb0), [`2f594291ad8d227b499b80a5bfe66f5963d42d6a`](https://github.com/medusajs/medusa/commit/2f594291ad8d227b499b80a5bfe66f5963d42d6a), [`e413cfefc2e0579ba7c5299dc4f4270310e39c2c`](https://github.com/medusajs/medusa/commit/e413cfefc2e0579ba7c5299dc4f4270310e39c2c), [`3cc512ef39b6d64b1fe04c1bcdb2e23fa03526f6`](https://github.com/medusajs/medusa/commit/3cc512ef39b6d64b1fe04c1bcdb2e23fa03526f6), [`cbaa40374480a6254d9e568c3003517308be0a44`](https://github.com/medusajs/medusa/commit/cbaa40374480a6254d9e568c3003517308be0a44), [`67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad`](https://github.com/medusajs/medusa/commit/67d3660abf3ceeac3f04006fe5e92d2fa7c0ccad), [`9412669e654c994e2dbee9cf61c18004d79f6475`](https://github.com/medusajs/medusa/commit/9412669e654c994e2dbee9cf61c18004d79f6475), [`cbfe646ce14d8436adbaa72cda95d38e6cdcd908`](https://github.com/medusajs/medusa/commit/cbfe646ce14d8436adbaa72cda95d38e6cdcd908), [`f764b3a36471a0ad9e9e05f125183464680e3a2d`](https://github.com/medusajs/medusa/commit/f764b3a36471a0ad9e9e05f125183464680e3a2d), [`fc4925327334c540c0125a91e81794c3c1f340e7`](https://github.com/medusajs/medusa/commit/fc4925327334c540c0125a91e81794c3c1f340e7), [`e2213448ac9eb93318570fde2807a3036108d44b`](https://github.com/medusajs/medusa/commit/e2213448ac9eb93318570fde2807a3036108d44b), [`34c3c14e0a1491ab80473605018b97981544167d`](https://github.com/medusajs/medusa/commit/34c3c14e0a1491ab80473605018b97981544167d), [`ff152e7ace60232c02932bbd06a759e555a823d4`](https://github.com/medusajs/medusa/commit/ff152e7ace60232c02932bbd06a759e555a823d4), [`492e0189573ffad4977a3559d71f39bf94d8b45d`](https://github.com/medusajs/medusa/commit/492e0189573ffad4977a3559d71f39bf94d8b45d), [`6264a6262b0220c70ad35c0d56a93a39218ccb80`](https://github.com/medusajs/medusa/commit/6264a6262b0220c70ad35c0d56a93a39218ccb80), [`fd4e79142880f1b2da63a38adef8c647da9c48e4`](https://github.com/medusajs/medusa/commit/fd4e79142880f1b2da63a38adef8c647da9c48e4)]:
  - @medusajs/types@2.10.0
  - @medusajs/modules-sdk@2.10.0
  - @medusajs/utils@2.10.0
  - @medusajs/workflows-sdk@2.10.0
  - @medusajs/cli@2.10.0
  - @medusajs/orchestration@2.10.0
  - @medusajs/telemetry@2.10.0

## 2.9.0

### Patch Changes

- Updated dependencies [[`a52708769da675e2ade6cb6fe28e1cd9741c562d`](https://github.com/medusajs/medusa/commit/a52708769da675e2ade6cb6fe28e1cd9741c562d), [`f1da73cb588a45afdeb80572d7d59987b5559252`](https://github.com/medusajs/medusa/commit/f1da73cb588a45afdeb80572d7d59987b5559252), [`51d4751d9502c0996ee5640f29d0253da980082a`](https://github.com/medusajs/medusa/commit/51d4751d9502c0996ee5640f29d0253da980082a), [`1bdf602f1c1da181e2839858d2f7e8aea503573a`](https://github.com/medusajs/medusa/commit/1bdf602f1c1da181e2839858d2f7e8aea503573a), [`9766570827ebf50d49d8daf956deecce6666a8cc`](https://github.com/medusajs/medusa/commit/9766570827ebf50d49d8daf956deecce6666a8cc)]:
  - @medusajs/utils@2.9.0
  - @medusajs/types@2.9.0
  - @medusajs/cli@2.9.0
  - @medusajs/modules-sdk@2.9.0
  - @medusajs/orchestration@2.9.0
  - @medusajs/workflows-sdk@2.9.0
  - @medusajs/telemetry@2.9.0

## 2.8.8

### Patch Changes

- [#13007](https://github.com/medusajs/medusa/pull/13007) [`43fb06ecc2d87ea2a11e12524679c142eb890ec7`](https://github.com/medusajs/medusa/commit/43fb06ecc2d87ea2a11e12524679c142eb890ec7) Thanks [@peterlgh7](https://github.com/peterlgh7)! - fix(framework): fix script migrations order

- Updated dependencies [[`e74044af4de213ba6326a8fb2b5d02e5875b8a4a`](https://github.com/medusajs/medusa/commit/e74044af4de213ba6326a8fb2b5d02e5875b8a4a), [`468b81c2cbdbc24b26e31bf6e347d3633a4fb4f8`](https://github.com/medusajs/medusa/commit/468b81c2cbdbc24b26e31bf6e347d3633a4fb4f8), [`919c53e44e2c7bb16bc513b5c96c93ac47bd6ce5`](https://github.com/medusajs/medusa/commit/919c53e44e2c7bb16bc513b5c96c93ac47bd6ce5), [`1bd455bc7bd32b0fda8c808b203ad341253f095d`](https://github.com/medusajs/medusa/commit/1bd455bc7bd32b0fda8c808b203ad341253f095d), [`7669dbb03e2f65fa76cff1c5b90a0777e475cb47`](https://github.com/medusajs/medusa/commit/7669dbb03e2f65fa76cff1c5b90a0777e475cb47), [`c5d609d09cb29c6cf01d1c6c65305cc566f391c5`](https://github.com/medusajs/medusa/commit/c5d609d09cb29c6cf01d1c6c65305cc566f391c5)]:
  - @medusajs/orchestration@2.8.8
  - @medusajs/types@2.8.8
  - @medusajs/workflows-sdk@2.8.8
  - @medusajs/utils@2.8.8
  - @medusajs/modules-sdk@2.8.8
  - @medusajs/cli@2.8.8
  - @medusajs/telemetry@2.8.8

## 2.8.7

### Patch Changes

- Updated dependencies [[`e9a33d0700c47c3d2357bb325791bc272a4d4569`](https://github.com/medusajs/medusa/commit/e9a33d0700c47c3d2357bb325791bc272a4d4569), [`42be9a88d61a11db7aebde2d6f4d96d43f54ea79`](https://github.com/medusajs/medusa/commit/42be9a88d61a11db7aebde2d6f4d96d43f54ea79)]:
  - @medusajs/orchestration@2.8.7
  - @medusajs/types@2.8.7
  - @medusajs/modules-sdk@2.8.7
  - @medusajs/workflows-sdk@2.8.7
  - @medusajs/utils@2.8.7
  - @medusajs/cli@2.8.7
  - @medusajs/telemetry@2.8.7

## 2.8.6

### Patch Changes

- Updated dependencies [[`9a62f359f1c954bcc09c57e4660f90d4b010e51c`](https://github.com/medusajs/medusa/commit/9a62f359f1c954bcc09c57e4660f90d4b010e51c), [`95d282e8ef8f2185737d493dea8b6f1677684543`](https://github.com/medusajs/medusa/commit/95d282e8ef8f2185737d493dea8b6f1677684543)]:
  - @medusajs/workflows-sdk@2.8.6
  - @medusajs/utils@2.8.6
  - @medusajs/orchestration@2.8.6
  - @medusajs/cli@2.8.6
  - @medusajs/modules-sdk@2.8.6
  - @medusajs/types@2.8.6
  - @medusajs/telemetry@2.8.6

## 2.8.5

### Patch Changes

- [#12713](https://github.com/medusajs/medusa/pull/12713) [`cbf3644eb7c8a24eaed879647b58c9ece3373c0e`](https://github.com/medusajs/medusa/commit/cbf3644eb7c8a24eaed879647b58c9ece3373c0e) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Add retry strategy to database connection

- [#12813](https://github.com/medusajs/medusa/pull/12813) [`d517dbd66a47817d1270c278b03add9a5c4244cb`](https://github.com/medusajs/medusa/commit/d517dbd66a47817d1270c278b03add9a5c4244cb) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Add support for jwt asymetric keys

- [#12720](https://github.com/medusajs/medusa/pull/12720) [`820a936b9836ae83e7a45de1e1ed0488d8cde2fd`](https://github.com/medusajs/medusa/commit/820a936b9836ae83e7a45de1e1ed0488d8cde2fd) Thanks [@riqwan](https://github.com/riqwan)! - feat(framework,types): add cookie options to project options

- [#12754](https://github.com/medusajs/medusa/pull/12754) [`00505b4f8e49873123111752adfda47ccb35ab46`](https://github.com/medusajs/medusa/commit/00505b4f8e49873123111752adfda47ccb35ab46) Thanks [@thetutlage](https://github.com/thetutlage)! - chore: upgrade to use glob 10

- [#12761](https://github.com/medusajs/medusa/pull/12761) [`94b62c67249d13ec6342411cf7efdedfd0ac47e1`](https://github.com/medusajs/medusa/commit/94b62c67249d13ec6342411cf7efdedfd0ac47e1) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: fallback to console with req.scope is undefined

- Updated dependencies [[`ab634a14ba709f1b1d12eb4cd5c7f3db6bfe6470`](https://github.com/medusajs/medusa/commit/ab634a14ba709f1b1d12eb4cd5c7f3db6bfe6470), [`6ca755ede7bfe3211464447412ca0d97e1207742`](https://github.com/medusajs/medusa/commit/6ca755ede7bfe3211464447412ca0d97e1207742), [`ba1e6595b74ae69f4ee066d545f8def8aff77dd3`](https://github.com/medusajs/medusa/commit/ba1e6595b74ae69f4ee066d545f8def8aff77dd3), [`cbf3644eb7c8a24eaed879647b58c9ece3373c0e`](https://github.com/medusajs/medusa/commit/cbf3644eb7c8a24eaed879647b58c9ece3373c0e), [`d517dbd66a47817d1270c278b03add9a5c4244cb`](https://github.com/medusajs/medusa/commit/d517dbd66a47817d1270c278b03add9a5c4244cb), [`b316924572fc2cf529e0d91b84955da20b34248a`](https://github.com/medusajs/medusa/commit/b316924572fc2cf529e0d91b84955da20b34248a), [`820a936b9836ae83e7a45de1e1ed0488d8cde2fd`](https://github.com/medusajs/medusa/commit/820a936b9836ae83e7a45de1e1ed0488d8cde2fd), [`44d1d186890cd44b20e41b60d1e217bc3d4b2a51`](https://github.com/medusajs/medusa/commit/44d1d186890cd44b20e41b60d1e217bc3d4b2a51), [`2621f00bb035a6b909f9498a2bc98fdba8570ba9`](https://github.com/medusajs/medusa/commit/2621f00bb035a6b909f9498a2bc98fdba8570ba9), [`bd6d9777c50d69115a20334a103a8ab9997b259d`](https://github.com/medusajs/medusa/commit/bd6d9777c50d69115a20334a103a8ab9997b259d), [`316a325b63e92003df25452faf88e577e9133064`](https://github.com/medusajs/medusa/commit/316a325b63e92003df25452faf88e577e9133064), [`1a7847660890ae84648123567ce8dc4c9a0eca03`](https://github.com/medusajs/medusa/commit/1a7847660890ae84648123567ce8dc4c9a0eca03)]:
  - @medusajs/utils@2.8.5
  - @medusajs/types@2.8.5
  - @medusajs/modules-sdk@2.8.5
  - @medusajs/orchestration@2.8.5
  - @medusajs/workflows-sdk@2.8.5
  - @medusajs/cli@2.8.5
  - @medusajs/telemetry@2.8.5

## 2.8.4

### Patch Changes

- [#12582](https://github.com/medusajs/medusa/pull/12582) [`7685d66c0775167994150e61a8b628ad6289ce23`](https://github.com/medusajs/medusa/commit/7685d66c0775167994150e61a8b628ad6289ce23) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(framework): Fix compiler to create the dist after clean-up

- [#12574](https://github.com/medusajs/medusa/pull/12574) [`cf0297f74af1b043363ffbd5a23ca0933097a69d`](https://github.com/medusajs/medusa/commit/cf0297f74af1b043363ffbd5a23ca0933097a69d) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: implement stream based processing of the files

- [#12612](https://github.com/medusajs/medusa/pull/12612) [`1f5f50010ae42f8d5b9924edcd75612b1f336463`](https://github.com/medusajs/medusa/commit/1f5f50010ae42f8d5b9924edcd75612b1f336463) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: expand method ALL for bodyparser config and additional validator

- Updated dependencies [[`da5e278a783010e886fbae96c4b704bc9fcf78e5`](https://github.com/medusajs/medusa/commit/da5e278a783010e886fbae96c4b704bc9fcf78e5), [`791276e80f5745c8885352b7979c0faa979110f4`](https://github.com/medusajs/medusa/commit/791276e80f5745c8885352b7979c0faa979110f4), [`3d65807d9924c057ccce6ccaf1c6e0eee8e7c245`](https://github.com/medusajs/medusa/commit/3d65807d9924c057ccce6ccaf1c6e0eee8e7c245), [`f6f34cc0e419a0c4be0971f13eb59b2a1e3aa31d`](https://github.com/medusajs/medusa/commit/f6f34cc0e419a0c4be0971f13eb59b2a1e3aa31d), [`490bd7647fca30951d14c7c78c1b809379ebd870`](https://github.com/medusajs/medusa/commit/490bd7647fca30951d14c7c78c1b809379ebd870), [`cf0297f74af1b043363ffbd5a23ca0933097a69d`](https://github.com/medusajs/medusa/commit/cf0297f74af1b043363ffbd5a23ca0933097a69d)]:
  - @medusajs/modules-sdk@2.8.4
  - @medusajs/types@2.8.4
  - @medusajs/utils@2.8.4
  - @medusajs/workflows-sdk@2.8.4
  - @medusajs/orchestration@2.8.4
  - @medusajs/cli@2.8.4
  - @medusajs/telemetry@2.8.4

## 2.8.3

### Patch Changes

- Updated dependencies [[`4e49cebcf0f053cb89012276e935a7ec62a12046`](https://github.com/medusajs/medusa/commit/4e49cebcf0f053cb89012276e935a7ec62a12046), [`59bbff62d81861282d55a32d6c0c45285203c4e0`](https://github.com/medusajs/medusa/commit/59bbff62d81861282d55a32d6c0c45285203c4e0), [`52bd9f9a53f6e63e5fbe0beb1fb2c650d88f7c88`](https://github.com/medusajs/medusa/commit/52bd9f9a53f6e63e5fbe0beb1fb2c650d88f7c88), [`ebe5cc7acddb7c61dc82fd8ec7f2fe3779104a99`](https://github.com/medusajs/medusa/commit/ebe5cc7acddb7c61dc82fd8ec7f2fe3779104a99), [`85d2b3c992cf361a9a18a14659484c57f4923197`](https://github.com/medusajs/medusa/commit/85d2b3c992cf361a9a18a14659484c57f4923197), [`c5a6573e26b403b86f53b88c307ea311a1bd9230`](https://github.com/medusajs/medusa/commit/c5a6573e26b403b86f53b88c307ea311a1bd9230)]:
  - @medusajs/types@2.8.3
  - @medusajs/utils@2.8.3
  - @medusajs/modules-sdk@2.8.3
  - @medusajs/orchestration@2.8.3
  - @medusajs/workflows-sdk@2.8.3
  - @medusajs/cli@2.8.3
  - @medusajs/telemetry@2.8.3

## 2.8.2

### Patch Changes

- Updated dependencies [[`b2984f48f5fcf535177c98e921baa58fcf45bbe5`](https://github.com/medusajs/medusa/commit/b2984f48f5fcf535177c98e921baa58fcf45bbe5), [`e149a998862272fff80573a623c4d9010cb0b104`](https://github.com/medusajs/medusa/commit/e149a998862272fff80573a623c4d9010cb0b104)]:
  - @medusajs/types@2.8.2
  - @medusajs/utils@2.8.2
  - @medusajs/modules-sdk@2.8.2
  - @medusajs/orchestration@2.8.2
  - @medusajs/workflows-sdk@2.8.2
  - @medusajs/cli@2.8.2
  - @medusajs/telemetry@2.8.2

## 2.8.1

### Patch Changes

- Updated dependencies [[`4602163b568962f8115b83971d67a6c55c2b8a98`](https://github.com/medusajs/medusa/commit/4602163b568962f8115b83971d67a6c55c2b8a98), [`142a1f0a5be60d2cc013ecb174bca7b1381c6551`](https://github.com/medusajs/medusa/commit/142a1f0a5be60d2cc013ecb174bca7b1381c6551)]:
  - @medusajs/utils@2.8.1
  - @medusajs/cli@2.8.1
  - @medusajs/modules-sdk@2.8.1
  - @medusajs/orchestration@2.8.1
  - @medusajs/workflows-sdk@2.8.1
  - @medusajs/types@2.8.1
  - @medusajs/telemetry@2.8.1

## 2.8.0

### Patch Changes

- [#11898](https://github.com/medusajs/medusa/pull/11898) [`b868a4ef4deb7df09d6156a907f4c883cd55a3fd`](https://github.com/medusajs/medusa/commit/b868a4ef4deb7df09d6156a907f4c883cd55a3fd) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(index): add filterable fields to link definition

- Updated dependencies [[`a53d645f8aab30135baebac29f9645dd35d47632`](https://github.com/medusajs/medusa/commit/a53d645f8aab30135baebac29f9645dd35d47632), [`89859987565b1fc872c7cd1c6d23144b97f454bc`](https://github.com/medusajs/medusa/commit/89859987565b1fc872c7cd1c6d23144b97f454bc), [`9cedeb182dc19d6127b602fc06e4b8850490e2a9`](https://github.com/medusajs/medusa/commit/9cedeb182dc19d6127b602fc06e4b8850490e2a9), [`fff285f8d2f3020a24b83066fa4250130fdcf229`](https://github.com/medusajs/medusa/commit/fff285f8d2f3020a24b83066fa4250130fdcf229), [`b868a4ef4deb7df09d6156a907f4c883cd55a3fd`](https://github.com/medusajs/medusa/commit/b868a4ef4deb7df09d6156a907f4c883cd55a3fd), [`80007f3afda76eabd5b148fa6bb5590fa6987265`](https://github.com/medusajs/medusa/commit/80007f3afda76eabd5b148fa6bb5590fa6987265), [`9d4bc81d0f1ac1614ab1ffb95d708f622c836ceb`](https://github.com/medusajs/medusa/commit/9d4bc81d0f1ac1614ab1ffb95d708f622c836ceb)]:
  - @medusajs/utils@2.8.0
  - @medusajs/types@2.8.0
  - @medusajs/modules-sdk@2.8.0
  - @medusajs/orchestration@2.8.0
  - @medusajs/workflows-sdk@2.8.0
  - @medusajs/cli@2.8.0
  - @medusajs/telemetry@2.8.0

## 2.7.1

### Patch Changes

- [#12194](https://github.com/medusajs/medusa/pull/12194) [`ee35f3ce9097832c10cdf2fd168763088e6c3fcb`](https://github.com/medusajs/medusa/commit/ee35f3ce9097832c10cdf2fd168763088e6c3fcb) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: apply additional data validator using a global middleware

- [#12157](https://github.com/medusajs/medusa/pull/12157) [`2f6963a5fbea05537680cb1b1f6a2b9822c36325`](https://github.com/medusajs/medusa/commit/2f6963a5fbea05537680cb1b1f6a2b9822c36325) Thanks [@adrien2p](https://github.com/adrien2p)! - fix: event group propagation and event managements

- [#12140](https://github.com/medusajs/medusa/pull/12140) [`b8902637251e9ed4f8762ef280659bbab6d967de`](https://github.com/medusajs/medusa/commit/b8902637251e9ed4f8762ef280659bbab6d967de) Thanks [@thetutlage](https://github.com/thetutlage)! - Add support for dynamoDB for storing sessions and some types cleanup

- Updated dependencies [[`e180253d608103cd8dfba8fddd3af2ba6ff2455a`](https://github.com/medusajs/medusa/commit/e180253d608103cd8dfba8fddd3af2ba6ff2455a), [`2f6963a5fbea05537680cb1b1f6a2b9822c36325`](https://github.com/medusajs/medusa/commit/2f6963a5fbea05537680cb1b1f6a2b9822c36325), [`c2fe3f152059b5c0323190e57ffed8f762efd4b7`](https://github.com/medusajs/medusa/commit/c2fe3f152059b5c0323190e57ffed8f762efd4b7), [`b8902637251e9ed4f8762ef280659bbab6d967de`](https://github.com/medusajs/medusa/commit/b8902637251e9ed4f8762ef280659bbab6d967de), [`8618e6ee3843069ea189ea64d5191d93db52dc9d`](https://github.com/medusajs/medusa/commit/8618e6ee3843069ea189ea64d5191d93db52dc9d), [`1f73281ab88c064404ecf7cc9dd0977dfd369723`](https://github.com/medusajs/medusa/commit/1f73281ab88c064404ecf7cc9dd0977dfd369723)]:
  - @medusajs/orchestration@2.7.1
  - @medusajs/workflows-sdk@2.7.1
  - @medusajs/types@2.7.1
  - @medusajs/modules-sdk@2.7.1
  - @medusajs/utils@2.7.1
  - @medusajs/cli@2.7.1
  - @medusajs/telemetry@2.7.1

## 2.7.0

### Patch Changes

- [#11720](https://github.com/medusajs/medusa/pull/11720) [`ec56a8bc857a74788df6523af25914da95c4c1d8`](https://github.com/medusajs/medusa/commit/ec56a8bc857a74788df6523af25914da95c4c1d8) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,utils,test-utils,types,framework,dashboard,admin-vite-plugin,admib-bundler): Fix broken plugin dependencies in development server

- [#12113](https://github.com/medusajs/medusa/pull/12113) [`2a18a75353f872b0cb4c203afc08cfd82f778428`](https://github.com/medusajs/medusa/commit/2a18a75353f872b0cb4c203afc08cfd82f778428) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(framework): slightly improve maybe apply link filter middleware

- Updated dependencies [[`74381addc3d6af42f0292e778948aabb60a6dad9`](https://github.com/medusajs/medusa/commit/74381addc3d6af42f0292e778948aabb60a6dad9), [`ec56a8bc857a74788df6523af25914da95c4c1d8`](https://github.com/medusajs/medusa/commit/ec56a8bc857a74788df6523af25914da95c4c1d8), [`ff3885500cdc49440ada8f92d355e9bfe1cd39b9`](https://github.com/medusajs/medusa/commit/ff3885500cdc49440ada8f92d355e9bfe1cd39b9), [`72d2cf92075b3e0849251f233517e2972de1b19c`](https://github.com/medusajs/medusa/commit/72d2cf92075b3e0849251f233517e2972de1b19c), [`95e89a39f347c8af6a5960943af56965bc3a07ba`](https://github.com/medusajs/medusa/commit/95e89a39f347c8af6a5960943af56965bc3a07ba), [`b1b3b484747a110f720d9c1d086696bbfba86bda`](https://github.com/medusajs/medusa/commit/b1b3b484747a110f720d9c1d086696bbfba86bda), [`c3440e5e3812e3d1c6b82e9d4e41287398451611`](https://github.com/medusajs/medusa/commit/c3440e5e3812e3d1c6b82e9d4e41287398451611), [`3dba58785fb2d8e79f1ea89daa9e4ab8810821c8`](https://github.com/medusajs/medusa/commit/3dba58785fb2d8e79f1ea89daa9e4ab8810821c8), [`0625f76cd4f040963829b61dcc70563e1d1b7070`](https://github.com/medusajs/medusa/commit/0625f76cd4f040963829b61dcc70563e1d1b7070), [`0cc306bf562d8f1f1f1c09d9658463e2c8def465`](https://github.com/medusajs/medusa/commit/0cc306bf562d8f1f1f1c09d9658463e2c8def465), [`cae47d9e49e9a17d8395f7b390f6ec0a2f9b8dc2`](https://github.com/medusajs/medusa/commit/cae47d9e49e9a17d8395f7b390f6ec0a2f9b8dc2), [`79cfc1a69ee166fec298aa706b994253a1284520`](https://github.com/medusajs/medusa/commit/79cfc1a69ee166fec298aa706b994253a1284520), [`cb6249320e7322e8eabfec8434f1278f8d63e96c`](https://github.com/medusajs/medusa/commit/cb6249320e7322e8eabfec8434f1278f8d63e96c), [`cab6f3a8adc7d6d1f39db9f3191a5797e35bf56f`](https://github.com/medusajs/medusa/commit/cab6f3a8adc7d6d1f39db9f3191a5797e35bf56f), [`1f8fab36361aa8e473ffe6c411c8598a916a6d3f`](https://github.com/medusajs/medusa/commit/1f8fab36361aa8e473ffe6c411c8598a916a6d3f), [`375c4a5ab1b2805ef2a3d792327c325fa11740a5`](https://github.com/medusajs/medusa/commit/375c4a5ab1b2805ef2a3d792327c325fa11740a5), [`13e159d8ad7ebb3e6977969b4bb10877d7bb7850`](https://github.com/medusajs/medusa/commit/13e159d8ad7ebb3e6977969b4bb10877d7bb7850), [`2f7eb0ee030966844b45dd00b2259e68b9fb0e83`](https://github.com/medusajs/medusa/commit/2f7eb0ee030966844b45dd00b2259e68b9fb0e83), [`92c7baa56193e052c6af41ea240b8d2cecd9fb77`](https://github.com/medusajs/medusa/commit/92c7baa56193e052c6af41ea240b8d2cecd9fb77), [`31abba8cdeedee65328e5529e172d4d3b23661f3`](https://github.com/medusajs/medusa/commit/31abba8cdeedee65328e5529e172d4d3b23661f3), [`9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234`](https://github.com/medusajs/medusa/commit/9dd62d93bd9e2acccc2e9f22bc029fd2b0df3234), [`c870a7a1baf7db748a831265f06dd4b7378b262e`](https://github.com/medusajs/medusa/commit/c870a7a1baf7db748a831265f06dd4b7378b262e), [`9ac74eead4760d6c92676d451e6f25c2305b1852`](https://github.com/medusajs/medusa/commit/9ac74eead4760d6c92676d451e6f25c2305b1852)]:
  - @medusajs/types@2.7.0
  - @medusajs/utils@2.7.0
  - @medusajs/workflows-sdk@2.7.0
  - @medusajs/orchestration@2.7.0
  - @medusajs/modules-sdk@2.7.0
  - @medusajs/cli@2.7.0
  - @medusajs/telemetry@2.7.0

## 2.6.1

### Patch Changes

- [#11724](https://github.com/medusajs/medusa/pull/11724) [`cc1309d3709b251683a0cda0ced448f8bf9f514e`](https://github.com/medusajs/medusa/commit/cc1309d3709b251683a0cda0ced448f8bf9f514e) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(product): Improve product normalization

- [#11738](https://github.com/medusajs/medusa/pull/11738) [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Remove ranges on Medusa packages

- [#11765](https://github.com/medusajs/medusa/pull/11765) [`20cd59e622463fbd46506275648ce681869adcdf`](https://github.com/medusajs/medusa/commit/20cd59e622463fbd46506275648ce681869adcdf) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix(framework): http cors middleware order and options

- Updated dependencies [[`b7678983a9b3e5c4d88282054b37b6c517329bd7`](https://github.com/medusajs/medusa/commit/b7678983a9b3e5c4d88282054b37b6c517329bd7), [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861), [`84f991192ec288f90af36c5352448b2785901d1a`](https://github.com/medusajs/medusa/commit/84f991192ec288f90af36c5352448b2785901d1a)]:
  - @medusajs/types@2.6.1
  - @medusajs/orchestration@2.6.1
  - @medusajs/workflows-sdk@2.6.1
  - @medusajs/modules-sdk@2.6.1
  - @medusajs/cli@2.6.1
  - @medusajs/utils@2.6.1
  - @medusajs/telemetry@2.6.1

## 2.6.0

### Patch Changes

- [#11638](https://github.com/medusajs/medusa/pull/11638) [`b0a16488e01632bc2bfee4d4bf2a3e1d3e11b104`](https://github.com/medusajs/medusa/commit/b0a16488e01632bc2bfee4d4bf2a3e1d3e11b104) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add middleware-file-loader

- [#11636](https://github.com/medusajs/medusa/pull/11636) [`ca6a15717d05de112ca00ca56d65beb2ab0f2598`](https://github.com/medusajs/medusa/commit/ca6a15717d05de112ca00ca56d65beb2ab0f2598) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Add support for extra pool configuration

- [#11707](https://github.com/medusajs/medusa/pull/11707) [`5d184ba0c8ff0438b422af5602bf275333eb2019`](https://github.com/medusajs/medusa/commit/5d184ba0c8ff0438b422af5602bf275333eb2019) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(framework): Unified resource loading and exclude non js/ts files

- [#11592](https://github.com/medusajs/medusa/pull/11592) [`9e2af4801daeb72d0e5a4d5ae674bdf6d415cf58`](https://github.com/medusajs/medusa/commit/9e2af4801daeb72d0e5a4d5ae674bdf6d415cf58) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add routes loader

- [#11646](https://github.com/medusajs/medusa/pull/11646) [`aabbbb7292a59ec029a6165451aa6d949844b2ea`](https://github.com/medusajs/medusa/commit/aabbbb7292a59ec029a6165451aa6d949844b2ea) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: Replace existing router with the new implementation

- Updated dependencies [[`8bb0a25f573c62ca1d1bcd7af184b0d0cf98e125`](https://github.com/medusajs/medusa/commit/8bb0a25f573c62ca1d1bcd7af184b0d0cf98e125), [`698a520729a3045cd13eed5ee0e5120a563e9261`](https://github.com/medusajs/medusa/commit/698a520729a3045cd13eed5ee0e5120a563e9261), [`51b0af193c7dde4899a696a515b59373b465d907`](https://github.com/medusajs/medusa/commit/51b0af193c7dde4899a696a515b59373b465d907), [`eeebb35758ea443468dd2355a7ea761dfe24babc`](https://github.com/medusajs/medusa/commit/eeebb35758ea443468dd2355a7ea761dfe24babc), [`93cbc6b6695f236fa39b66169de971228888f1b9`](https://github.com/medusajs/medusa/commit/93cbc6b6695f236fa39b66169de971228888f1b9), [`d1efad9bf05ca80959e8b50d74b74167fc1b0064`](https://github.com/medusajs/medusa/commit/d1efad9bf05ca80959e8b50d74b74167fc1b0064), [`ca6a15717d05de112ca00ca56d65beb2ab0f2598`](https://github.com/medusajs/medusa/commit/ca6a15717d05de112ca00ca56d65beb2ab0f2598), [`c250de79192bda1b1cd217bcca37f458c693de1d`](https://github.com/medusajs/medusa/commit/c250de79192bda1b1cd217bcca37f458c693de1d), [`d814d9540e76256be23d733b73cf5a63aa380c8b`](https://github.com/medusajs/medusa/commit/d814d9540e76256be23d733b73cf5a63aa380c8b), [`d254b2ddba3fba4fb60e1076a6bc4e7d425bbd30`](https://github.com/medusajs/medusa/commit/d254b2ddba3fba4fb60e1076a6bc4e7d425bbd30), [`b42f151be31161a5d7a73132ee6794b990403d76`](https://github.com/medusajs/medusa/commit/b42f151be31161a5d7a73132ee6794b990403d76), [`ab96ad3b8213b117b067ae0ab66b94f74b8bd031`](https://github.com/medusajs/medusa/commit/ab96ad3b8213b117b067ae0ab66b94f74b8bd031)]:
  - @medusajs/types@2.6.0
  - @medusajs/utils@2.6.0
  - @medusajs/workflows-sdk@2.6.0
  - @medusajs/modules-sdk@2.6.0
  - @medusajs/orchestration@2.6.0
  - @medusajs/telemetry@2.6.0

## 2.5.1

### Patch Changes

- [#11511](https://github.com/medusajs/medusa/pull/11511) [`b60e1c855ebd3f10753fcb31a4a0402799e7c470`](https://github.com/medusajs/medusa/commit/b60e1c855ebd3f10753fcb31a4a0402799e7c470) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(framework): add missing storefrontUrl from configuration type

- [#11489](https://github.com/medusajs/medusa/pull/11489) [`3b7856e8f515baaabd852ad6fb5bf21388205a4c`](https://github.com/medusajs/medusa/commit/3b7856e8f515baaabd852ad6fb5bf21388205a4c) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(framework): Improve production structured logging with more valuable information as well

- [#11526](https://github.com/medusajs/medusa/pull/11526) [`feec0243ab92c217e9b88aa31db250925da04e5e`](https://github.com/medusajs/medusa/commit/feec0243ab92c217e9b88aa31db250925da04e5e) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add middleware and routes sorter

- [#11414](https://github.com/medusajs/medusa/pull/11414) [`47edd01deec79b394552cea349f1e41b7b88723b`](https://github.com/medusajs/medusa/commit/47edd01deec79b394552cea349f1e41b7b88723b) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-vite-plugin,admin-bundler,ui,icons,dashboard,framework,types): Update Vite dependencies

- Updated dependencies [[`22276648ad0aef12206464b555efdce97e316bb4`](https://github.com/medusajs/medusa/commit/22276648ad0aef12206464b555efdce97e316bb4), [`d1cbe4c61ed99bbeccf1be49721e0aa7b74edd71`](https://github.com/medusajs/medusa/commit/d1cbe4c61ed99bbeccf1be49721e0aa7b74edd71), [`63f0774569643ffe473daef2fcfd8944954d72c0`](https://github.com/medusajs/medusa/commit/63f0774569643ffe473daef2fcfd8944954d72c0), [`1a3843a92a6db83b9249e9c0aece7b3d13a600a9`](https://github.com/medusajs/medusa/commit/1a3843a92a6db83b9249e9c0aece7b3d13a600a9), [`d6c03ee5427457237e3c739545a8816cc3a3198e`](https://github.com/medusajs/medusa/commit/d6c03ee5427457237e3c739545a8816cc3a3198e), [`3b4997840e624ef8da1a75744b4bfb5c5a371f7c`](https://github.com/medusajs/medusa/commit/3b4997840e624ef8da1a75744b4bfb5c5a371f7c), [`0c957350a6688c78572361b51c1f16a452a31aed`](https://github.com/medusajs/medusa/commit/0c957350a6688c78572361b51c1f16a452a31aed), [`448dbcb5963c732c9c3b822b81330556bcf883cd`](https://github.com/medusajs/medusa/commit/448dbcb5963c732c9c3b822b81330556bcf883cd), [`065df75e7d5b90a4de43873d8c08e1aab65e3fd7`](https://github.com/medusajs/medusa/commit/065df75e7d5b90a4de43873d8c08e1aab65e3fd7), [`47edd01deec79b394552cea349f1e41b7b88723b`](https://github.com/medusajs/medusa/commit/47edd01deec79b394552cea349f1e41b7b88723b), [`32c5015f563b7d60221a472635b44820fe4ef1f6`](https://github.com/medusajs/medusa/commit/32c5015f563b7d60221a472635b44820fe4ef1f6)]:
  - @medusajs/orchestration@2.5.1
  - @medusajs/modules-sdk@2.5.1
  - @medusajs/types@2.5.1
  - @medusajs/utils@2.5.1
  - @medusajs/workflows-sdk@2.5.1
  - @medusajs/telemetry@2.5.1

## 2.5.0

### Patch Changes

- [#11190](https://github.com/medusajs/medusa/pull/11190) [`e98d3c615e8a42e09974ded9cc3ca3277e3a9217`](https://github.com/medusajs/medusa/commit/e98d3c615e8a42e09974ded9cc3ca3277e3a9217) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore(orchestration): validate missing PK filters when throwIfKeyNotFound

- [#11206](https://github.com/medusajs/medusa/pull/11206) [`716de2cb3ab5d504ec763fc322dc11b542b7e8ca`](https://github.com/medusajs/medusa/commit/716de2cb3ab5d504ec763fc322dc11b542b7e8ca) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: exit process with a status code when build fails

- Updated dependencies [[`6db96c80d05730a9188937599baba2602f4e2a92`](https://github.com/medusajs/medusa/commit/6db96c80d05730a9188937599baba2602f4e2a92), [`e98d3c615e8a42e09974ded9cc3ca3277e3a9217`](https://github.com/medusajs/medusa/commit/e98d3c615e8a42e09974ded9cc3ca3277e3a9217), [`9f1a3b2a4214ef23a22972e6d28c5f43f87da353`](https://github.com/medusajs/medusa/commit/9f1a3b2a4214ef23a22972e6d28c5f43f87da353), [`cb0f065c9dd59fe54a52c337f9b5392723f9db58`](https://github.com/medusajs/medusa/commit/cb0f065c9dd59fe54a52c337f9b5392723f9db58), [`016e332e9b98f316cded6eb999927fc942ce56c5`](https://github.com/medusajs/medusa/commit/016e332e9b98f316cded6eb999927fc942ce56c5), [`65fae943c9d919f658c8660e5b46626c1b302e31`](https://github.com/medusajs/medusa/commit/65fae943c9d919f658c8660e5b46626c1b302e31), [`a33aebd8957f4bab10afd5e50a810cf738879b0d`](https://github.com/medusajs/medusa/commit/a33aebd8957f4bab10afd5e50a810cf738879b0d), [`c9821171866a5a66ce5b7f0b8a414de48dbcdc7e`](https://github.com/medusajs/medusa/commit/c9821171866a5a66ce5b7f0b8a414de48dbcdc7e), [`244cd714b2e8dc742afbefd0d175649f8fc45eed`](https://github.com/medusajs/medusa/commit/244cd714b2e8dc742afbefd0d175649f8fc45eed), [`f07af7b93c86673e730dc4e5eba8df2572013f9f`](https://github.com/medusajs/medusa/commit/f07af7b93c86673e730dc4e5eba8df2572013f9f), [`3c51709daf07dcdd5563fa08fec2446a42cc8058`](https://github.com/medusajs/medusa/commit/3c51709daf07dcdd5563fa08fec2446a42cc8058)]:
  - @medusajs/types@2.5.0
  - @medusajs/orchestration@2.5.0
  - @medusajs/utils@2.5.0
  - @medusajs/modules-sdk@2.5.0
  - @medusajs/workflows-sdk@2.5.0
  - @medusajs/telemetry@2.5.0

## 2.4.0

### Minor Changes

- [#10292](https://github.com/medusajs/medusa/pull/10292) [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - chore: upgrade to mikro-orm 6

### Patch Changes

- [#11110](https://github.com/medusajs/medusa/pull/11110) [`0deffe7b9b9a1055813249b17057b7bba01b78ac`](https://github.com/medusajs/medusa/commit/0deffe7b9b9a1055813249b17057b7bba01b78ac) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: switch from tsc watch to chokidar

- [#11072](https://github.com/medusajs/medusa/pull/11072) [`13fe2f6776b22c401d131f184fc3600ef4008383`](https://github.com/medusajs/medusa/commit/13fe2f6776b22c401d131f184fc3600ef4008383) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(framework): migration scripts regexp

- [#11084](https://github.com/medusajs/medusa/pull/11084) [`e53b8b0a9708d2eb46258ca417b6ff6abbd5f3d9`](https://github.com/medusajs/medusa/commit/e53b8b0a9708d2eb46258ca417b6ff6abbd5f3d9) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: Flaky behavior of Yalc

- Updated dependencies [[`d4e042e9ad838cfc3b3c83c342afaf76adb281d2`](https://github.com/medusajs/medusa/commit/d4e042e9ad838cfc3b3c83c342afaf76adb281d2), [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547), [`a76208ed0217e5a3993d48e1884e855966691fd8`](https://github.com/medusajs/medusa/commit/a76208ed0217e5a3993d48e1884e855966691fd8), [`ecc8efcb049f5c77cb7e38c2b6a273860590a5f4`](https://github.com/medusajs/medusa/commit/ecc8efcb049f5c77cb7e38c2b6a273860590a5f4), [`da3906efa42ee729c11696e2d3255a60ac3fa958`](https://github.com/medusajs/medusa/commit/da3906efa42ee729c11696e2d3255a60ac3fa958)]:
  - @medusajs/types@2.4.0
  - @medusajs/orchestration@2.4.0
  - @medusajs/workflows-sdk@2.4.0
  - @medusajs/modules-sdk@2.4.0
  - @medusajs/cli@2.4.0
  - @medusajs/utils@2.4.0
  - @medusajs/telemetry@2.4.0

## 2.3.1

### Patch Changes

- [#11049](https://github.com/medusajs/medusa/pull/11049) [`171088b47a58929f1ffbc610855a0032b947c43c`](https://github.com/medusajs/medusa/commit/171088b47a58929f1ffbc610855a0032b947c43c) Thanks [@thetutlage](https://github.com/thetutlage)! - fix: missing dependencies in the framework package

- Updated dependencies []:
  - @medusajs/modules-sdk@2.3.1
  - @medusajs/orchestration@2.3.1
  - @medusajs/types@2.3.1
  - @medusajs/utils@2.3.1
  - @medusajs/workflows-sdk@2.3.1
  - @medusajs/telemetry@2.3.1

## 2.3.0

### Patch Changes

- [#10935](https://github.com/medusajs/medusa/pull/10935) [`b0f581cc7cb9f173666502d9ed2ea2c128b517be`](https://github.com/medusajs/medusa/commit/b0f581cc7cb9f173666502d9ed2ea2c128b517be) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add plugin build command

- [#10941](https://github.com/medusajs/medusa/pull/10941) [`4bc3f5b845f832959bed3d5f2bd320b55a8fb50f`](https://github.com/medusajs/medusa/commit/4bc3f5b845f832959bed3d5f2bd320b55a8fb50f) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(medusa,admin-bundler,cli,framework): Integrate admin extensions into plugin build

- [#10926](https://github.com/medusajs/medusa/pull/10926) [`69e2a6d6951c133295947d00fa1f99547da467d2`](https://github.com/medusajs/medusa/commit/69e2a6d6951c133295947d00fa1f99547da467d2) Thanks [@thetutlage](https://github.com/thetutlage)! - Feat/plugin develop

- [#10975](https://github.com/medusajs/medusa/pull/10975) [`c75678d6d41d3b88d07681ad7e24472d6cbde672`](https://github.com/medusajs/medusa/commit/c75678d6d41d3b88d07681ad7e24472d6cbde672) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: add support for loading admin extensions from the source

- [#10960](https://github.com/medusajs/medusa/pull/10960) [`0924164e86ecc256e2fa56a4e8c504abf7663131`](https://github.com/medusajs/medusa/commit/0924164e86ecc256e2fa56a4e8c504abf7663131) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(core, medusa, cli): Enable migration scripts

- [#10990](https://github.com/medusajs/medusa/pull/10990) [`9a742911feaa2274743b0edca5d649fcbbf8b6e3`](https://github.com/medusajs/medusa/commit/9a742911feaa2274743b0edca5d649fcbbf8b6e3) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(framework): Exclude .d.ts files from the glob search and Properly generate the insert query string

- [#10904](https://github.com/medusajs/medusa/pull/10904) [`428fce53134bd0b224f636a9a15d369d1f03cde8`](https://github.com/medusajs/medusa/commit/428fce53134bd0b224f636a9a15d369d1f03cde8) Thanks [@thetutlage](https://github.com/thetutlage)! - chore: move build utilities to Compiler class

- Updated dependencies [[`67782350a9da278457c3280c300ebec65bdc6326`](https://github.com/medusajs/medusa/commit/67782350a9da278457c3280c300ebec65bdc6326), [`ff725090bb4ec848cb82c5411bdc25c4b72252ab`](https://github.com/medusajs/medusa/commit/ff725090bb4ec848cb82c5411bdc25c4b72252ab), [`01acf9e7009300c01544f022c2a97d4d3f0fdb65`](https://github.com/medusajs/medusa/commit/01acf9e7009300c01544f022c2a97d4d3f0fdb65), [`5eab9e739919594ae7e7e416942ec93d84b699fd`](https://github.com/medusajs/medusa/commit/5eab9e739919594ae7e7e416942ec93d84b699fd), [`c75678d6d41d3b88d07681ad7e24472d6cbde672`](https://github.com/medusajs/medusa/commit/c75678d6d41d3b88d07681ad7e24472d6cbde672), [`c1930bd6568043d145e34d8360015e7207e18e4a`](https://github.com/medusajs/medusa/commit/c1930bd6568043d145e34d8360015e7207e18e4a), [`28febfc6438351fddb5b214b86f96aff89db688e`](https://github.com/medusajs/medusa/commit/28febfc6438351fddb5b214b86f96aff89db688e), [`bc22b81cdf9591912744f448c74d45bcb0f11e0c`](https://github.com/medusajs/medusa/commit/bc22b81cdf9591912744f448c74d45bcb0f11e0c)]:
  - @medusajs/utils@2.3.0
  - @medusajs/types@2.3.0
  - @medusajs/orchestration@2.3.0
  - @medusajs/modules-sdk@2.3.0
  - @medusajs/workflows-sdk@2.3.0
  - @medusajs/telemetry@2.3.0

## 2.2.0

### Patch Changes

- [#10768](https://github.com/medusajs/medusa/pull/10768) [`bbf790ea44d0ce0a128a07e66224735f5a2dccf0`](https://github.com/medusajs/medusa/commit/bbf790ea44d0ce0a128a07e66224735f5a2dccf0) Thanks [@thetutlage](https://github.com/thetutlage)! - Refactor/deprecate remote link

- [#10773](https://github.com/medusajs/medusa/pull/10773) [`5e9d86d75d1f2745c24a4bcd4a5c0df066578ef5`](https://github.com/medusajs/medusa/commit/5e9d86d75d1f2745c24a4bcd4a5c0df066578ef5) Thanks [@thetutlage](https://github.com/thetutlage)! - feat: deprecate remoteQueryConfig in favor of queryConfig

- Updated dependencies [[`ecc09fd77db01fcb7e8eb8e60cd19e16e2b5ea81`](https://github.com/medusajs/medusa/commit/ecc09fd77db01fcb7e8eb8e60cd19e16e2b5ea81), [`7d8f6cf39f96638ad90b4926cf20187aacf788fc`](https://github.com/medusajs/medusa/commit/7d8f6cf39f96638ad90b4926cf20187aacf788fc), [`13ddf27c68fc2831b3661940bc5f27bab23ce8c0`](https://github.com/medusajs/medusa/commit/13ddf27c68fc2831b3661940bc5f27bab23ce8c0), [`99a06102a246c119f69d1873f3cdeee9ff1241a0`](https://github.com/medusajs/medusa/commit/99a06102a246c119f69d1873f3cdeee9ff1241a0), [`4f897661eb7a855a881d460c565c2da6459367eb`](https://github.com/medusajs/medusa/commit/4f897661eb7a855a881d460c565c2da6459367eb), [`bbf790ea44d0ce0a128a07e66224735f5a2dccf0`](https://github.com/medusajs/medusa/commit/bbf790ea44d0ce0a128a07e66224735f5a2dccf0), [`5e9d86d75d1f2745c24a4bcd4a5c0df066578ef5`](https://github.com/medusajs/medusa/commit/5e9d86d75d1f2745c24a4bcd4a5c0df066578ef5), [`47594192b79fbc798cfaf21821b60673745d1374`](https://github.com/medusajs/medusa/commit/47594192b79fbc798cfaf21821b60673745d1374), [`0559d54c18d2e79c78c2b9a348b9873d1a786dea`](https://github.com/medusajs/medusa/commit/0559d54c18d2e79c78c2b9a348b9873d1a786dea)]:
  - @medusajs/modules-sdk@2.2.0
  - @medusajs/types@2.2.0
  - @medusajs/utils@2.2.0
  - @medusajs/orchestration@2.2.0
  - @medusajs/workflows-sdk@2.2.0
  - @medusajs/telemetry@2.2.0

## 2.1.3

### Patch Changes

- Updated dependencies [[`100da64242838739816351ed259461f2d7c258e3`](https://github.com/medusajs/medusa/commit/100da64242838739816351ed259461f2d7c258e3), [`c9b8db04c1b35f1cf129bb9ad74789fbc2881815`](https://github.com/medusajs/medusa/commit/c9b8db04c1b35f1cf129bb9ad74789fbc2881815), [`2ad08c4c440706dd2ffe2215807b89ee4a7f325b`](https://github.com/medusajs/medusa/commit/2ad08c4c440706dd2ffe2215807b89ee4a7f325b), [`048620884b5d458b109ac496e7a2056c202bd459`](https://github.com/medusajs/medusa/commit/048620884b5d458b109ac496e7a2056c202bd459)]:
  - @medusajs/types@2.1.3
  - @medusajs/utils@2.1.3
  - @medusajs/modules-sdk@2.1.3
  - @medusajs/orchestration@2.1.3
  - @medusajs/workflows-sdk@2.1.3
  - @medusajs/telemetry@2.1.3

## 2.1.2

### Patch Changes

- Updated dependencies [[`729eb5da7b6daf9781b8bdcbc2fab344e942d444`](https://github.com/medusajs/medusa/commit/729eb5da7b6daf9781b8bdcbc2fab344e942d444), [`16d27ea6e4c2e4290820fe2328f08557534fcb8f`](https://github.com/medusajs/medusa/commit/16d27ea6e4c2e4290820fe2328f08557534fcb8f), [`fad85a9d293acee1dae784afa223a080b9b8b85b`](https://github.com/medusajs/medusa/commit/fad85a9d293acee1dae784afa223a080b9b8b85b), [`885c82ded63e504739bf39a113f820c87c9e2d52`](https://github.com/medusajs/medusa/commit/885c82ded63e504739bf39a113f820c87c9e2d52), [`90ad2566fdde2215447100d10c3fe9b17ce826b5`](https://github.com/medusajs/medusa/commit/90ad2566fdde2215447100d10c3fe9b17ce826b5), [`6367bccde88158d524dfa01e5a8123ffa3461c10`](https://github.com/medusajs/medusa/commit/6367bccde88158d524dfa01e5a8123ffa3461c10)]:
  - @medusajs/types@2.1.2
  - @medusajs/utils@2.1.2
  - @medusajs/modules-sdk@2.1.2
  - @medusajs/orchestration@2.1.2
  - @medusajs/workflows-sdk@2.1.2
  - @medusajs/telemetry@2.1.2

## 2.1.1

### Patch Changes

- [#10456](https://github.com/medusajs/medusa/pull/10456) [`597bffaab396931880c6986a889cbe9816a266e2`](https://github.com/medusajs/medusa/commit/597bffaab396931880c6986a889cbe9816a266e2) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(framework): add missing query type argument in request types

- Updated dependencies [[`90ae187e097c42a224c701f31cbc2924ea6ee86b`](https://github.com/medusajs/medusa/commit/90ae187e097c42a224c701f31cbc2924ea6ee86b), [`0a077d48e14976bafcf19705fc48e66756362fd6`](https://github.com/medusajs/medusa/commit/0a077d48e14976bafcf19705fc48e66756362fd6), [`a1a1e0e789424546443ce195b95f652d081d7b3b`](https://github.com/medusajs/medusa/commit/a1a1e0e789424546443ce195b95f652d081d7b3b), [`16663ec8132e99bac7fbfe2adda542a5294d2384`](https://github.com/medusajs/medusa/commit/16663ec8132e99bac7fbfe2adda542a5294d2384), [`90d7f4ff3949ade9f6a7335c9611aae6633be908`](https://github.com/medusajs/medusa/commit/90d7f4ff3949ade9f6a7335c9611aae6633be908), [`f65a3cc06df9faca3615f30eb4d3bf889efa5765`](https://github.com/medusajs/medusa/commit/f65a3cc06df9faca3615f30eb4d3bf889efa5765), [`b160fd3cbf6edf06702fa15b694709375557d188`](https://github.com/medusajs/medusa/commit/b160fd3cbf6edf06702fa15b694709375557d188), [`559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a`](https://github.com/medusajs/medusa/commit/559fc6587aa02cd4f8fbc9e97ff1f1ba094a4b1a), [`0a16efa4266f93302b31589349e777bc8d24dc07`](https://github.com/medusajs/medusa/commit/0a16efa4266f93302b31589349e777bc8d24dc07), [`864f53011b892e1ed0abee2e241b662eccef7e6d`](https://github.com/medusajs/medusa/commit/864f53011b892e1ed0abee2e241b662eccef7e6d), [`69f4c4f4e06022990fcd9c66d8f1a68ff0ff97b1`](https://github.com/medusajs/medusa/commit/69f4c4f4e06022990fcd9c66d8f1a68ff0ff97b1)]:
  - @medusajs/workflows-sdk@2.1.1
  - @medusajs/utils@2.1.1
  - @medusajs/types@2.1.1
  - @medusajs/modules-sdk@2.1.1
  - @medusajs/orchestration@2.1.1
  - @medusajs/telemetry@2.1.1

## 2.1.0

### Patch Changes

- [#10339](https://github.com/medusajs/medusa/pull/10339) [`a5263083fae89d6885b291b9cb06de8d74aec074`](https://github.com/medusajs/medusa/commit/a5263083fae89d6885b291b9cb06de8d74aec074) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(framework): Apply CORS and auth middleware for global middleware that is not already applied by routes

- [#10374](https://github.com/medusajs/medusa/pull/10374) [`11bd55613304350a5478fd4c001e2309cca3a995`](https://github.com/medusajs/medusa/commit/11bd55613304350a5478fd4c001e2309cca3a995) Thanks [@riqwan](https://github.com/riqwan)! - feat(core-flows,framework,medusa): list shipping options pass in cart as pricing context

- Updated dependencies [[`194361b95a0ed2c182e0a3c107fde9b4b6a7bcf7`](https://github.com/medusajs/medusa/commit/194361b95a0ed2c182e0a3c107fde9b4b6a7bcf7), [`3e98364bd1631f96846cd3199bf7497702cf5923`](https://github.com/medusajs/medusa/commit/3e98364bd1631f96846cd3199bf7497702cf5923), [`324b4ab438662f44de495ffe4d9137677a032a00`](https://github.com/medusajs/medusa/commit/324b4ab438662f44de495ffe4d9137677a032a00)]:
  - @medusajs/utils@2.1.0
  - @medusajs/types@2.1.0
  - @medusajs/modules-sdk@2.1.0
  - @medusajs/orchestration@2.1.0
  - @medusajs/workflows-sdk@2.1.0
  - @medusajs/telemetry@2.1.0

## 2.0.7

### Patch Changes

- Updated dependencies [[`e9003c3124f284eae7e1457101bf10c1beccbac1`](https://github.com/medusajs/medusa/commit/e9003c3124f284eae7e1457101bf10c1beccbac1)]:
  - @medusajs/utils@2.0.7
  - @medusajs/modules-sdk@2.0.7
  - @medusajs/orchestration@2.0.7
  - @medusajs/types@2.0.7
  - @medusajs/workflows-sdk@2.0.7
  - @medusajs/telemetry@2.0.7

## 2.0.6

### Patch Changes

- Updated dependencies []:
  - @medusajs/modules-sdk@2.0.6
  - @medusajs/orchestration@2.0.6
  - @medusajs/types@2.0.6
  - @medusajs/utils@2.0.6
  - @medusajs/workflows-sdk@2.0.6
  - @medusajs/telemetry@2.0.6

## 2.0.5

### Patch Changes

- [#10179](https://github.com/medusajs/medusa/pull/10179) [`42c08fa8e00d33e93e152b3058d2f73476b9a0c3`](https://github.com/medusajs/medusa/commit/42c08fa8e00d33e93e152b3058d2f73476b9a0c3) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Fix loaders path

- Updated dependencies [[`aeb5b43692df8b69cfb9af7d7fed2c757f3f1d1e`](https://github.com/medusajs/medusa/commit/aeb5b43692df8b69cfb9af7d7fed2c757f3f1d1e), [`9dff05cddeeca40fab47760fa15e07ca087664ed`](https://github.com/medusajs/medusa/commit/9dff05cddeeca40fab47760fa15e07ca087664ed), [`1659c9be5d3ace1bed9f3a6e7206fe54e60645c0`](https://github.com/medusajs/medusa/commit/1659c9be5d3ace1bed9f3a6e7206fe54e60645c0), [`42c08fa8e00d33e93e152b3058d2f73476b9a0c3`](https://github.com/medusajs/medusa/commit/42c08fa8e00d33e93e152b3058d2f73476b9a0c3), [`3e265229f2ae5c3d55f64a445574c13c40b52c14`](https://github.com/medusajs/medusa/commit/3e265229f2ae5c3d55f64a445574c13c40b52c14), [`1eef324af33cfb70b414ac564788f28dfd6d2c18`](https://github.com/medusajs/medusa/commit/1eef324af33cfb70b414ac564788f28dfd6d2c18), [`3fee17747f059a331e9fbe40622205b968404faf`](https://github.com/medusajs/medusa/commit/3fee17747f059a331e9fbe40622205b968404faf), [`7390c14c20f7b5053458de1b1a58870dc8e441cc`](https://github.com/medusajs/medusa/commit/7390c14c20f7b5053458de1b1a58870dc8e441cc)]:
  - @medusajs/orchestration@2.0.5
  - @medusajs/workflows-sdk@2.0.5
  - @medusajs/types@2.0.5
  - @medusajs/utils@2.0.5
  - @medusajs/modules-sdk@2.0.5
  - @medusajs/telemetry@2.0.5

## 2.0.4

### Patch Changes

- Updated dependencies [[`34f4f695c0b8359a6e9efd45fd081ea743a1c439`](https://github.com/medusajs/medusa/commit/34f4f695c0b8359a6e9efd45fd081ea743a1c439), [`bc2d556c2c57adab637308fb65247b17b8cd2ed5`](https://github.com/medusajs/medusa/commit/bc2d556c2c57adab637308fb65247b17b8cd2ed5)]:
  - @medusajs/types@2.0.4
  - @medusajs/modules-sdk@2.0.4
  - @medusajs/orchestration@2.0.4
  - @medusajs/utils@2.0.4
  - @medusajs/workflows-sdk@2.0.4
  - @medusajs/telemetry@2.0.4

## 2.0.3

### Patch Changes

- [#9979](https://github.com/medusajs/medusa/pull/9979) [`6496789c65a032b7c83f5b2a9c285c2620d4288a`](https://github.com/medusajs/medusa/commit/6496789c65a032b7c83f5b2a9c285c2620d4288a) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Exclude nested fields when excluding field from endpoint

- Updated dependencies [[`03f4b66b90625634f13409be35cd57081f0eb7d5`](https://github.com/medusajs/medusa/commit/03f4b66b90625634f13409be35cd57081f0eb7d5)]:
  - @medusajs/types@2.0.3
  - @medusajs/utils@2.0.3
  - @medusajs/modules-sdk@2.0.3
  - @medusajs/orchestration@2.0.3
  - @medusajs/workflows-sdk@2.0.3
  - @medusajs/telemetry@2.0.3

## 2.0.2

### Patch Changes

- [#9947](https://github.com/medusajs/medusa/pull/9947) [`b3cbc160eb94025402b5a0ef21653c207bbe8ccd`](https://github.com/medusajs/medusa/commit/b3cbc160eb94025402b5a0ef21653c207bbe8ccd) Thanks [@sradevski](https://github.com/sradevski)! - fix: Default to a relative path for backend URL in admin

- Updated dependencies [[`bbf4af17258ea34adeeb8ff3a6cd213a12d67c76`](https://github.com/medusajs/medusa/commit/bbf4af17258ea34adeeb8ff3a6cd213a12d67c76), [`de228d209f30dfbb5b500d5cb49932b63e06f52a`](https://github.com/medusajs/medusa/commit/de228d209f30dfbb5b500d5cb49932b63e06f52a), [`c1c85ef952441eacfe8b6c2ffa9304ac4433053f`](https://github.com/medusajs/medusa/commit/c1c85ef952441eacfe8b6c2ffa9304ac4433053f), [`16b4cc433e996d1a54e4ff043daaa148981ba63d`](https://github.com/medusajs/medusa/commit/16b4cc433e996d1a54e4ff043daaa148981ba63d), [`c0368cca282fe26c9e557240bb8ca90514da70c6`](https://github.com/medusajs/medusa/commit/c0368cca282fe26c9e557240bb8ca90514da70c6), [`879ce33090c7e99ae8b466c31c5dc0c67cdbc08f`](https://github.com/medusajs/medusa/commit/879ce33090c7e99ae8b466c31c5dc0c67cdbc08f), [`b3cbc160eb94025402b5a0ef21653c207bbe8ccd`](https://github.com/medusajs/medusa/commit/b3cbc160eb94025402b5a0ef21653c207bbe8ccd)]:
  - @medusajs/types@2.0.2
  - @medusajs/telemetry@2.0.2
  - @medusajs/utils@2.0.2
  - @medusajs/workflows-sdk@2.0.2
  - @medusajs/modules-sdk@2.0.2
  - @medusajs/orchestration@2.0.2

## 2.0.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/modules-sdk@2.0.1
  - @medusajs/orchestration@2.0.1
  - @medusajs/types@2.0.1
  - @medusajs/utils@2.0.1
  - @medusajs/workflows-sdk@2.0.1
  - @medusajs/telemetry@2.0.1

## 2.0.0

### Major Changes

- [#7341](https://github.com/medusajs/medusa/pull/7341) [`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Medusa 2.0

### Patch Changes

- Updated dependencies [[`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e)]:
  - @medusajs/cli@2.0.0
  - @medusajs/modules-sdk@2.0.0
  - @medusajs/orchestration@2.0.0
  - @medusajs/types@2.0.0
  - @medusajs/utils@2.0.0
  - @medusajs/workflows-sdk@2.0.0
  - @medusajs/telemetry@2.0.0
