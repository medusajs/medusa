# @medusajs/inventory

## 1.8.0

### Minor Changes

- [#3329](https://github.com/medusajs/medusa/pull/3329) [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Inventory and Stock location modules supporting isolated connection

### Patch Changes

- [#3319](https://github.com/medusajs/medusa/pull/3319) [`08c8aa46c`](https://github.com/medusajs/medusa/commit/08c8aa46c55453cf741a97d06547ae85fee6e985) Thanks [@pKorsholm](https://github.com/pKorsholm)! - List inventory items based on locations

- [#3041](https://github.com/medusajs/medusa/pull/3041) [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): Typeorm fixes / enhancements

  - upgrade typeorm from 0.2.51 to 0.3.11
  - Plugin repository loader to work with Typeorm update

- [#3685](https://github.com/medusajs/medusa/pull/3685) [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Fix RC package versions

- [#3352](https://github.com/medusajs/medusa/pull/3352) [`aa690beed`](https://github.com/medusajs/medusa/commit/aa690beed775646cbc86b445fb5dc90dcac087d5) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(medusa): Modules initializer

  ### Loading modules in a project

  Example

  ```typescript
  import {
    InventoryServiceInitializeOptions,
    initialize,
  } from "@medusajs/inventory"

  const options: InventoryServiceInitializeOptions = {
    database: {
      type: "postgres",
      url: DB_URL,
    },
  }

  const inventoryService = await initialize(options)
  const newInventoryItem = await inventoryService.createInventoryItem({
    sku: "sku_123",
  })
  ```

- [#3460](https://github.com/medusajs/medusa/pull/3460) [`10bf05c14`](https://github.com/medusajs/medusa/commit/10bf05c147cb65a263465129790edd44a6d8948b) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(inventory, medusa): ensure no orphaned reservations and invenotry levels on location removal

- [#3649](https://github.com/medusajs/medusa/pull/3649) [`bd12a9508`](https://github.com/medusajs/medusa/commit/bd12a95083b69a70b83ad38578c5a68738c41b2b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Export initialize method for all modules

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules

- Updated dependencies [[`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4), [`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38), [`55e94d0b4`](https://github.com/medusajs/medusa/commit/55e94d0b45776776639d3970d4264b8f5c5385dd), [`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`bd12a9508`](https://github.com/medusajs/medusa/commit/bd12a95083b69a70b83ad38578c5a68738c41b2b), [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73), [`bca1f80dd`](https://github.com/medusajs/medusa/commit/bca1f80dd501d878455e1ad4f5091cf20ef900ea), [`271844aed`](https://github.com/medusajs/medusa/commit/271844aedbe45c369e188b5d06458dbd6984cd39), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def)]:
  - @medusajs/modules-sdk@1.8.0
  - @medusajs/utils@1.8.0

## 1.8.0-rc.4

### Patch Changes

- [#3649](https://github.com/medusajs/medusa/pull/3649) [`bd12a9508`](https://github.com/medusajs/medusa/commit/bd12a95083b69a70b83ad38578c5a68738c41b2b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Export initialize method for all modules

- Updated dependencies [[`a0c919a8d`](https://github.com/medusajs/medusa/commit/a0c919a8d01ca5edf62336de48e9a112e3822f38), [`bd12a9508`](https://github.com/medusajs/medusa/commit/bd12a95083b69a70b83ad38578c5a68738c41b2b)]:
  - @medusajs/utils@0.0.2-rc.2
  - @medusajs/modules-sdk@0.1.0-rc.4

## 1.8.0-rc.3

### Patch Changes

- Updated dependencies [[`55e94d0b4`](https://github.com/medusajs/medusa/commit/55e94d0b45776776639d3970d4264b8f5c5385dd)]:
  - @medusajs/modules-sdk@0.1.0-rc.3

## 1.8.0-rc.2

### Patch Changes

- chore: Fix RC package versions

- Updated dependencies []:
  - @medusajs/modules-sdk@0.1.0-rc.2
  - @medusajs/utils@0.0.2-rc.1

## 1.8.0-rc.1

### Patch Changes

- Updated dependencies [[`bca1f80dd`](https://github.com/medusajs/medusa/commit/bca1f80dd501d878455e1ad4f5091cf20ef900ea)]:
  - @medusajs/modules-sdk@0.1.0-rc.1

## 1.8.0-rc.0

### Minor Changes

- [#3329](https://github.com/medusajs/medusa/pull/3329) [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Inventory and Stock location modules supporting isolated connection

### Patch Changes

- [#3319](https://github.com/medusajs/medusa/pull/3319) [`08c8aa46c`](https://github.com/medusajs/medusa/commit/08c8aa46c55453cf741a97d06547ae85fee6e985) Thanks [@pKorsholm](https://github.com/pKorsholm)! - List inventory items based on locations

- [#3041](https://github.com/medusajs/medusa/pull/3041) [`121b42acf`](https://github.com/medusajs/medusa/commit/121b42acfe98c12dd593f9b1f2072ff0f3b61724) Thanks [@riqwan](https://github.com/riqwan)! - chore(medusa): Typeorm fixes / enhancements

  - upgrade typeorm from 0.2.51 to 0.3.11
  - Plugin repository loader to work with Typeorm update

- [#3352](https://github.com/medusajs/medusa/pull/3352) [`aa690beed`](https://github.com/medusajs/medusa/commit/aa690beed775646cbc86b445fb5dc90dcac087d5) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(medusa): Modules initializer

  ### Loading modules in a project

  Example

  ```typescript
  import {
    InventoryServiceInitializeOptions,
    initialize,
  } from "@medusajs/inventory"

  const options: InventoryServiceInitializeOptions = {
    database: {
      type: "postgres",
      url: DB_URL,
    },
  }

  const inventoryService = await initialize(options)
  const newInventoryItem = await inventoryService.createInventoryItem({
    sku: "sku_123",
  })
  ```

- [#3460](https://github.com/medusajs/medusa/pull/3460) [`10bf05c14`](https://github.com/medusajs/medusa/commit/10bf05c147cb65a263465129790edd44a6d8948b) Thanks [@pKorsholm](https://github.com/pKorsholm)! - Fix(inventory, medusa): ensure no orphaned reservations and invenotry levels on location removal

- [#3531](https://github.com/medusajs/medusa/pull/3531) [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Remove dependency on @medusajs/medusa from Inventory and Stock-Location Modules

- Updated dependencies [[`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73), [`271844aed`](https://github.com/medusajs/medusa/commit/271844aedbe45c369e188b5d06458dbd6984cd39), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def)]:
  - @medusajs/utils@0.0.2-rc.0
  - @medusajs/modules-sdk@0.1.0-rc.0

## 1.0.12

### Patch Changes

- Updated dependencies [[`98fe8fd00`](https://github.com/medusajs/medusa/commit/98fe8fd00a1912fde1d2a93b434bda500a213c14), [`2869763ea`](https://github.com/medusajs/medusa/commit/2869763ea9673cf5c5a3aa10b58f61b8e830ce21)]:
  - @medusajs/medusa@1.7.15

## 1.0.11

### Patch Changes

- Updated dependencies [[`902ed3c0b`](https://github.com/medusajs/medusa/commit/902ed3c0b21cd525d9975e59b7a8120ae5f7a895), [`fa4049cb5`](https://github.com/medusajs/medusa/commit/fa4049cb51232b2ed7091b1322c3fc14cd23e451)]:
  - @medusajs/medusa@1.7.14

## 1.0.10

### Patch Changes

- [#3407](https://github.com/medusajs/medusa/pull/3407) [`f0a1355fe`](https://github.com/medusajs/medusa/commit/f0a1355feb5160ff7de1f3d3da769efe29d0d8ed) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa): Bulk emit events

- Updated dependencies [[`601d20e7a`](https://github.com/medusajs/medusa/commit/601d20e7ab293728cd81f0723805841016812120), [`f0a1355fe`](https://github.com/medusajs/medusa/commit/f0a1355feb5160ff7de1f3d3da769efe29d0d8ed)]:
  - @medusajs/medusa@1.7.13

## 1.0.9

### Patch Changes

- Updated dependencies [[`ce577f269`](https://github.com/medusajs/medusa/commit/ce577f2696aa2181bef8f3096b1a639feabe2714), [`aa0d1f321`](https://github.com/medusajs/medusa/commit/aa0d1f32153f82c6219efe5cfc08862db5e5a129), [`9f508c8bd`](https://github.com/medusajs/medusa/commit/9f508c8bd8bee63677504cc8b86f1643579945d8)]:
  - @medusajs/medusa@1.7.12

## 1.0.8

### Patch Changes

- Updated dependencies [[`c43248131`](https://github.com/medusajs/medusa/commit/c432481319cc205938081c3fcf60e75053b659ca)]:
  - @medusajs/medusa@1.7.11

## 1.0.7

### Patch Changes

- Updated dependencies [[`b458615ed`](https://github.com/medusajs/medusa/commit/b458615ed50a7c637e9e77f29f21c7ab300ed5d8), [`4b114cc41`](https://github.com/medusajs/medusa/commit/4b114cc4191ba20832b66072ec82386b22a3533c)]:
  - @medusajs/medusa@1.7.10

## 1.0.6

### Patch Changes

- Updated dependencies [[`370bd472e`](https://github.com/medusajs/medusa/commit/370bd472ed8c9038f66defd012a886e0f83c32cf)]:
  - @medusajs/medusa@1.7.9

## 1.0.5

### Patch Changes

- Updated dependencies [[`9690f07bc`](https://github.com/medusajs/medusa/commit/9690f07bc062c85fcf8b7f0f35a162b930944183), [`5301a1e9d`](https://github.com/medusajs/medusa/commit/5301a1e9d632ddac94e7864fecfdc860a4c2a66d), [`d11ab924b`](https://github.com/medusajs/medusa/commit/d11ab924b88211bc18ed019ca300f6d452972167), [`f88af0c28`](https://github.com/medusajs/medusa/commit/f88af0c28d3fa574cdeea3694607d4df563cb88d)]:
  - @medusajs/medusa@1.7.8

## 1.0.4

### Patch Changes

- [#3217](https://github.com/medusajs/medusa/pull/3217) [`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Fix npm packages files included

- Updated dependencies [[`507ad00be`](https://github.com/medusajs/medusa/commit/507ad00bec74bb63b17eae8a4a3313eb6e0d2503), [`6e443dc70`](https://github.com/medusajs/medusa/commit/6e443dc708ffe20bf96d45ddc207ed274c28e344), [`eee928381`](https://github.com/medusajs/medusa/commit/eee9283818b1717f37f084c319201ea7144fdf8a), [`4cb44a3a2`](https://github.com/medusajs/medusa/commit/4cb44a3a2ec5bcf3d90e3b6a0e1f6bb9ff45e2b6), [`472f96d7f`](https://github.com/medusajs/medusa/commit/472f96d7fb8668a15df6e6f9ea31291891b3e688), [`61b0b2f3a`](https://github.com/medusajs/medusa/commit/61b0b2f3aa1d54d539b216a99032549485136a82), [`80452332d`](https://github.com/medusajs/medusa/commit/80452332d852ad7d33d74e1f08f12f45d7a35503), [`bbbb3d888`](https://github.com/medusajs/medusa/commit/bbbb3d888292391976355c88ecb0fcf8a7c115bc), [`10ff72c30`](https://github.com/medusajs/medusa/commit/10ff72c30ae59d2174d876b0c4141aad135d9a1c), [`968eb8fc6`](https://github.com/medusajs/medusa/commit/968eb8fc6b7ccd7221f88f42d75717f3a0547861), [`a59bd84e4`](https://github.com/medusajs/medusa/commit/a59bd84e41fb5d8fc2edc7bdc43d3cbf74d9d7dc), [`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0), [`cac13a88d`](https://github.com/medusajs/medusa/commit/cac13a88da42fa986bd7352fbc12a318b566d98f), [`a2cc084db`](https://github.com/medusajs/medusa/commit/a2cc084db817f8f7699e9b0daceda274b5f0e0c0), [`8194d19b0`](https://github.com/medusajs/medusa/commit/8194d19b0e933310fdc65af25300da5dd185e669)]:
  - @medusajs/medusa@1.7.7
  - medusa-interfaces@1.3.6

## 1.0.3

### Patch Changes

- [#2971](https://github.com/medusajs/medusa/pull/2971) [`f65f590a2`](https://github.com/medusajs/medusa/commit/f65f590a2771d6e526d7dfc7ca721be74c8f79a9) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Adding inventory items api

- [#3185](https://github.com/medusajs/medusa/pull/3185) [`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Patches all dependencies + minor bumps `winston` to include a [fix for a significant memory leak](https://github.com/winstonjs/winston/pull/2057)

- Updated dependencies [[`ce866475b`](https://github.com/medusajs/medusa/commit/ce866475b4b6c8b453638000f7b1df7a27daf45d), [`53532df8d`](https://github.com/medusajs/medusa/commit/53532df8d597ed5471c07296981b6959cba4ddc3), [`d8ffbe25b`](https://github.com/medusajs/medusa/commit/d8ffbe25b047fda0f644240c9f518f95e74f03cb), [`2d525237b`](https://github.com/medusajs/medusa/commit/2d525237b682e89495b6cc8e3aa677bfad4d0726), [`5b63533c7`](https://github.com/medusajs/medusa/commit/5b63533c77528cab31755cedab9e768f7461f373), [`09dc9c667`](https://github.com/medusajs/medusa/commit/09dc9c6677c0d64cf765b27290e707ea75edd4aa), [`4105405f2`](https://github.com/medusajs/medusa/commit/4105405f28c3f3e54a6077c95a575a268fb5569f), [`ee42b60a2`](https://github.com/medusajs/medusa/commit/ee42b60a20db2afc5e9b6b958502f9e86ec37d80), [`d0adaf57e`](https://github.com/medusajs/medusa/commit/d0adaf57ed1018f29bebf01e5cffde5f7192f89f), [`f65f590a2`](https://github.com/medusajs/medusa/commit/f65f590a2771d6e526d7dfc7ca721be74c8f79a9), [`5ec6d438f`](https://github.com/medusajs/medusa/commit/5ec6d438fb1f909be925461c788f3a3a958528e4), [`5c1d2a5e8`](https://github.com/medusajs/medusa/commit/5c1d2a5e83c3654ae468d17c900892c32ef76060), [`8e41c6996`](https://github.com/medusajs/medusa/commit/8e41c6996601142661bde877b9ee1d80b8325f5f), [`d50db84a3`](https://github.com/medusajs/medusa/commit/d50db84a336da2de9c06a59aa79f2a5e9aa558f1), [`82da3605f`](https://github.com/medusajs/medusa/commit/82da3605fb50cef182699900552109ad654f0df2), [`b242e2232`](https://github.com/medusajs/medusa/commit/b242e22326ce74d5437d0da6863f22facbb5964c), [`4339d47e1`](https://github.com/medusajs/medusa/commit/4339d47e1f6c9f6c8f100b3ac72c8a394b6dd44d), [`2e7e16b91`](https://github.com/medusajs/medusa/commit/2e7e16b9173e2779946776b9b07ce7232c683f36), [`9ebb50104`](https://github.com/medusajs/medusa/commit/9ebb50104cc1f6c8ef1cea446ae595fb2eb532a2), [`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4), [`e22a383f4`](https://github.com/medusajs/medusa/commit/e22a383f4738e8bc80394ccaba3ac9a4ae678955), [`dc156861d`](https://github.com/medusajs/medusa/commit/dc156861d413ecfe3fd264bcd5ad736d83d8a08e), [`8f4c84121`](https://github.com/medusajs/medusa/commit/8f4c84121bd9b8c7067d72f03125e13afe4d2571), [`bfa33f444`](https://github.com/medusajs/medusa/commit/bfa33f444cd225906149777c5c6e842685f3dd7c), [`f776ed234`](https://github.com/medusajs/medusa/commit/f776ed234fcfccf23041ffebecbae6c9a8b7e922), [`4d6e63d68`](https://github.com/medusajs/medusa/commit/4d6e63d68f4e64c365ecbba133876d95e6528763), [`fcba70570`](https://github.com/medusajs/medusa/commit/fcba705701b8013183fafb39e8dda4a85718080a), [`4f0d8992a`](https://github.com/medusajs/medusa/commit/4f0d8992a091a05e93dd5be3762dfa47f074610e), [`d25a53104`](https://github.com/medusajs/medusa/commit/d25a531045143d3be68d3cd3b5764bbbc792ee3a), [`86c87c7b1`](https://github.com/medusajs/medusa/commit/86c87c7b1020ab6bb02f931e1ee113f2857cf527), [`78650ea66`](https://github.com/medusajs/medusa/commit/78650ea66517b0a77100228615d8122f84ad235b), [`b9bda3bf4`](https://github.com/medusajs/medusa/commit/b9bda3bf4e0f95675041085cea5008268c37edd5), [`e581d3bd9`](https://github.com/medusajs/medusa/commit/e581d3bd90f9bc40105e7eaf34e0c94d4f657f7a), [`4d3210bfb`](https://github.com/medusajs/medusa/commit/4d3210bfbb84877d951f7319d2e87c1acbdd6aad)]:
  - @medusajs/medusa@1.7.6
  - medusa-interfaces@1.3.5

## 1.0.2

### Patch Changes

- Updated dependencies [[`9c2169422`](https://github.com/medusajs/medusa/commit/9c2169422dd51be727118fa4830dadc58c24568a), [`9427bc7f2`](https://github.com/medusajs/medusa/commit/9427bc7f256c563befe3035bc3d67380066f304b)]:
  - @medusajs/medusa@1.7.5

## 1.0.1

### Patch Changes

- [#2997](https://github.com/medusajs/medusa/pull/2997) [`9dbccd9ca`](https://github.com/medusajs/medusa/commit/9dbccd9ca78b8b66f9a21947bb863622e7ff326b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - feat(medusa, stock-location, inventory): Allow modules to integrate with core

- [#3033](https://github.com/medusajs/medusa/pull/3033) [`1547dd814`](https://github.com/medusajs/medusa/commit/1547dd8143889fc30045fc3d0241de8e69acb76e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa): Add module options to transaction base service to use in modules

- Updated dependencies [[`9dbccd9ca`](https://github.com/medusajs/medusa/commit/9dbccd9ca78b8b66f9a21947bb863622e7ff326b), [`542daeead`](https://github.com/medusajs/medusa/commit/542daeeadd78d939f5144c690e8907374da6d085), [`8c08d0031`](https://github.com/medusajs/medusa/commit/8c08d003198b94c00f8428a51c0e79d2ca9d1dc7), [`017538883`](https://github.com/medusajs/medusa/commit/017538883588792e1ff37abcab0fd2872c9af932), [`b2839e2e4`](https://github.com/medusajs/medusa/commit/b2839e2e4dc0d9344fa2ac8d4d16b796def4c56d), [`76d175231`](https://github.com/medusajs/medusa/commit/76d17523105d3860028a90a45b6038a64040e5ce), [`9e3beaf53`](https://github.com/medusajs/medusa/commit/9e3beaf5319dc785cf84b856cfcc8193df90c3a4), [`7d4b8b9cc`](https://github.com/medusajs/medusa/commit/7d4b8b9cc59672d01cdf0c6f331bc3d1eeec9bee), [`aab163bab`](https://github.com/medusajs/medusa/commit/aab163babb91759a05b852d34c299cdfac96d800), [`a0c4cfe0f`](https://github.com/medusajs/medusa/commit/a0c4cfe0f74cf30c45956c32c2fb22bf833bea68), [`27a29ef24`](https://github.com/medusajs/medusa/commit/27a29ef24e5ea1ba2bc0be8ecb7dd747d4c7c65b), [`aef842123`](https://github.com/medusajs/medusa/commit/aef8421235d8fff68d7d4f8b73f77484073311a5), [`1dc79590b`](https://github.com/medusajs/medusa/commit/1dc79590b3539af09dbc8fbf931d9b5ee225fb0d), [`9c4647383`](https://github.com/medusajs/medusa/commit/9c4647383ebf0a183ccc566636bcf7af06409060), [`a0c4cfe0f`](https://github.com/medusajs/medusa/commit/a0c4cfe0f74cf30c45956c32c2fb22bf833bea68), [`b80124d32`](https://github.com/medusajs/medusa/commit/b80124d32d950790c2a01b49e8c34d562b1d57f4), [`cb1ec0076`](https://github.com/medusajs/medusa/commit/cb1ec0076b4fd932c686d6027e8b060ceded3a64), [`142c8aa70`](https://github.com/medusajs/medusa/commit/142c8aa70f583d9b11a6add2b8f988e9ba4cf979), [`1547dd814`](https://github.com/medusajs/medusa/commit/1547dd8143889fc30045fc3d0241de8e69acb76e), [`d2c692aa9`](https://github.com/medusajs/medusa/commit/d2c692aa96ea89c053f9a694a9ae6dba77e89b14), [`150696de9`](https://github.com/medusajs/medusa/commit/150696de99fc852c5d72a746f168b6f62b2086ed), [`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2), [`b3e4be720`](https://github.com/medusajs/medusa/commit/b3e4be72087d0b528c3cce322edf9325b855c8ae)]:
  - @medusajs/medusa@1.7.4
  - medusa-interfaces@1.3.4
