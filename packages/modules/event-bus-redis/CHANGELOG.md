# @medusajs/event-bus-redis

## 2.13.3

### Patch Changes

- Updated dependencies [[`dbaae9630d26a0806751d5614beadef3e0b4bf07`](https://github.com/medusajs/medusa/commit/dbaae9630d26a0806751d5614beadef3e0b4bf07)]:
  - @medusajs/framework@2.13.3

## 2.13.2

### Patch Changes

- Updated dependencies [[`7aca778ae56069371f5d26a757d3b2276d524776`](https://github.com/medusajs/medusa/commit/7aca778ae56069371f5d26a757d3b2276d524776), [`77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8`](https://github.com/medusajs/medusa/commit/77d899e135ed75668ca7d7b01a8ed4f0c1fe0ac8)]:
  - @medusajs/framework@2.13.2

## 2.13.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.13.1

## 2.13.0

### Minor Changes

- [`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor bump

### Patch Changes

- Updated dependencies [[`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7)]:
  - @medusajs/framework@2.13.0

## 2.12.6

### Patch Changes

- [#14478](https://github.com/medusajs/medusa/pull/14478) [`13476988763368b3b333fa5bc3f613e8eb174fdf`](https://github.com/medusajs/medusa/commit/13476988763368b3b333fa5bc3f613e8eb174fdf) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat/enable event configuration in medusa config
  enables event priority configuration through the Medusa config, allowing users to configure event processing options (like priority) for specific events at the module level.

- [#14476](https://github.com/medusajs/medusa/pull/14476) [`7307a5e63fdf8ed6f0ff201a0383f0a0bbfc7002`](https://github.com/medusajs/medusa/commit/7307a5e63fdf8ed6f0ff201a0383f0a0bbfc7002) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(events): Implement priority-based event processing

  - Internal events default to lowest priority (2,097,152) to prevent queue overload
  - Normal events default to priority 100
  - Order placed events explicitly set to priority 10 for immediate processing
  - Support for priority overrides at message, emit, and module levels

- Updated dependencies [[`13476988763368b3b333fa5bc3f613e8eb174fdf`](https://github.com/medusajs/medusa/commit/13476988763368b3b333fa5bc3f613e8eb174fdf), [`8890f284705a4843a57a3800820208f593689a2a`](https://github.com/medusajs/medusa/commit/8890f284705a4843a57a3800820208f593689a2a), [`1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b`](https://github.com/medusajs/medusa/commit/1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b)]:
  - @medusajs/framework@2.12.6

## 2.12.5

### Patch Changes

- [#14465](https://github.com/medusajs/medusa/pull/14465) [`568742826fae7240b33e6cc7356a12c3715d05b1`](https://github.com/medusajs/medusa/commit/568742826fae7240b33e6cc7356a12c3715d05b1) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(): Add modules options autocomplete to medusa config

- Updated dependencies [[`233ec261be200fac83002415aa7c0df082339a3f`](https://github.com/medusajs/medusa/commit/233ec261be200fac83002415aa7c0df082339a3f)]:
  - @medusajs/framework@2.12.5

## 2.12.4

### Patch Changes

- Updated dependencies [[`181d5fa67122e4e5f38b91f6b716d35f2d08a204`](https://github.com/medusajs/medusa/commit/181d5fa67122e4e5f38b91f6b716d35f2d08a204), [`d347e369ce555064e24f2dc3cd93b9e4e73a006d`](https://github.com/medusajs/medusa/commit/d347e369ce555064e24f2dc3cd93b9e4e73a006d)]:
  - @medusajs/framework@2.12.4

## 2.12.3

### Patch Changes

- Updated dependencies [[`7b4dda5a179c78de5e099231ec407836db4c8dbd`](https://github.com/medusajs/medusa/commit/7b4dda5a179c78de5e099231ec407836db4c8dbd), [`8964a03fa1b9e6a4c443bf5b21d65d41a8441d29`](https://github.com/medusajs/medusa/commit/8964a03fa1b9e6a4c443bf5b21d65d41a8441d29), [`c8a7122ba918751b215dc0b19cf9b09b2c011ab8`](https://github.com/medusajs/medusa/commit/c8a7122ba918751b215dc0b19cf9b09b2c011ab8)]:
  - @medusajs/framework@2.12.3

## 2.12.2

### Patch Changes

- [#14201](https://github.com/medusajs/medusa/pull/14201) [`144f0f4e2ef4bf27e0e3fc48dd7d79bb6fbedef9`](https://github.com/medusajs/medusa/commit/144f0f4e2ef4bf27e0e3fc48dd7d79bb6fbedef9) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Enable more granualar queue configuration

- Updated dependencies [[`9f7846ae0babbad39947a1f33d236bff8b5098d0`](https://github.com/medusajs/medusa/commit/9f7846ae0babbad39947a1f33d236bff8b5098d0), [`fe49b567d6d55ae224095c06c710d31d40887653`](https://github.com/medusajs/medusa/commit/fe49b567d6d55ae224095c06c710d31d40887653), [`6dc0b8bed84a330c1c24f4f1331f1ed078430a47`](https://github.com/medusajs/medusa/commit/6dc0b8bed84a330c1c24f4f1331f1ed078430a47), [`356283c359e5c30e0d31e6c6fd0fb8e16c025b78`](https://github.com/medusajs/medusa/commit/356283c359e5c30e0d31e6c6fd0fb8e16c025b78)]:
  - @medusajs/framework@2.12.2

## 2.12.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.12.1

## 2.12.0

### Patch Changes

- [#14084](https://github.com/medusajs/medusa/pull/14084) [`113f200a99ccb2f0fbef0017340da5107c700a74`](https://github.com/medusajs/medusa/commit/113f200a99ccb2f0fbef0017340da5107c700a74) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(event-vus-\*): Do not emit if no subscribers:

- Updated dependencies [[`c2c3ad5ba53f1959422fb2d37297a8de8d714782`](https://github.com/medusajs/medusa/commit/c2c3ad5ba53f1959422fb2d37297a8de8d714782), [`7e3eb6e41316d7b04d32bc7186ed0c78de1aa539`](https://github.com/medusajs/medusa/commit/7e3eb6e41316d7b04d32bc7186ed0c78de1aa539), [`beb91d88a2f224075e4fcf35a0ee9483b3124504`](https://github.com/medusajs/medusa/commit/beb91d88a2f224075e4fcf35a0ee9483b3124504)]:
  - @medusajs/framework@2.12.0

## 2.11.3

### Patch Changes

- [#13910](https://github.com/medusajs/medusa/pull/13910) [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Dependencies cleanup and improvements

- Updated dependencies [[`28c3ea68f5634792848f146ac6af5b27c848bf21`](https://github.com/medusajs/medusa/commit/28c3ea68f5634792848f146ac6af5b27c848bf21), [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d), [`afb40d437b3cc4ceb015df70985b2f005f40eaff`](https://github.com/medusajs/medusa/commit/afb40d437b3cc4ceb015df70985b2f005f40eaff), [`37563987b8fe75c9acfe62957a33e8398977647a`](https://github.com/medusajs/medusa/commit/37563987b8fe75c9acfe62957a33e8398977647a), [`13d7d15be594ca413785eebe8f86b47c36cb9830`](https://github.com/medusajs/medusa/commit/13d7d15be594ca413785eebe8f86b47c36cb9830)]:
  - @medusajs/framework@2.11.3

## 2.11.2

### Patch Changes

- Updated dependencies [[`85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2`](https://github.com/medusajs/medusa/commit/85b1f3d43aa8d8e0269a545ef7867733fd0eb8e2)]:
  - @medusajs/framework@2.11.2

## 2.11.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.11.1

## 2.11.0

### Patch Changes

- [#13439](https://github.com/medusajs/medusa/pull/13439) [`12a96a7c7015f011f5e29a1d387f835e514ba536`](https://github.com/medusajs/medusa/commit/12a96a7c7015f011f5e29a1d387f835e514ba536) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Move peer deps into a single package and re export from framework

- [#13435](https://github.com/medusajs/medusa/pull/13435) [`b9d6f73320c36c53235b12fb8397b30a448917f0`](https://github.com/medusajs/medusa/commit/b9d6f73320c36c53235b12fb8397b30a448917f0) Thanks [@adrien2p](https://github.com/adrien2p)! - Feat(): distributed caching

- Updated dependencies [[`12a96a7c7015f011f5e29a1d387f835e514ba536`](https://github.com/medusajs/medusa/commit/12a96a7c7015f011f5e29a1d387f835e514ba536), [`b9d6f73320c36c53235b12fb8397b30a448917f0`](https://github.com/medusajs/medusa/commit/b9d6f73320c36c53235b12fb8397b30a448917f0), [`8ece06d8ed6a197ebb370918c49a3ec5c21dd186`](https://github.com/medusajs/medusa/commit/8ece06d8ed6a197ebb370918c49a3ec5c21dd186), [`92d30b28f45b4037cd73c180c8f257070cf49bd4`](https://github.com/medusajs/medusa/commit/92d30b28f45b4037cd73c180c8f257070cf49bd4), [`02b6d013822b9665f868c4ea6d1b5cfe58723459`](https://github.com/medusajs/medusa/commit/02b6d013822b9665f868c4ea6d1b5cfe58723459)]:
  - @medusajs/framework@2.11.0

## 2.10.3

### Patch Changes

- [#13516](https://github.com/medusajs/medusa/pull/13516) [`25634b038248ab6501af719faec79b59b496bada`](https://github.com/medusajs/medusa/commit/25634b038248ab6501af719faec79b59b496bada) Thanks [@adrien2p](https://github.com/adrien2p)! - test(): test dynamic max workers and improve CI

- Updated dependencies [[`25634b038248ab6501af719faec79b59b496bada`](https://github.com/medusajs/medusa/commit/25634b038248ab6501af719faec79b59b496bada)]:
  - @medusajs/framework@2.10.3

## 2.10.2

### Patch Changes

- Updated dependencies [[`b4c0f131b70ba950339c1ca4d81b5ce062a588a3`](https://github.com/medusajs/medusa/commit/b4c0f131b70ba950339c1ca4d81b5ce062a588a3), [`a4b72f9a21fd1d278c622fcd45d24bb9bfb1e0a8`](https://github.com/medusajs/medusa/commit/a4b72f9a21fd1d278c622fcd45d24bb9bfb1e0a8)]:
  - @medusajs/framework@2.10.2

## 2.10.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.10.1

## 2.10.0

### Patch Changes

- [#13281](https://github.com/medusajs/medusa/pull/13281) [`fc4925327334c540c0125a91e81794c3c1f340e7`](https://github.com/medusajs/medusa/commit/fc4925327334c540c0125a91e81794c3c1f340e7) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(core, event-bus): Compensate emit event step utility

- Updated dependencies [[`e413cfefc2e0579ba7c5299dc4f4270310e39c2c`](https://github.com/medusajs/medusa/commit/e413cfefc2e0579ba7c5299dc4f4270310e39c2c), [`e2213448ac9eb93318570fde2807a3036108d44b`](https://github.com/medusajs/medusa/commit/e2213448ac9eb93318570fde2807a3036108d44b)]:
  - @medusajs/framework@2.10.0

## 2.9.0

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.9.0

## 2.8.8

### Patch Changes

- Updated dependencies [[`43fb06ecc2d87ea2a11e12524679c142eb890ec7`](https://github.com/medusajs/medusa/commit/43fb06ecc2d87ea2a11e12524679c142eb890ec7)]:
  - @medusajs/framework@2.8.8

## 2.8.7

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.8.7

## 2.8.6

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.8.6

## 2.8.5

### Patch Changes

- Updated dependencies [[`cbf3644eb7c8a24eaed879647b58c9ece3373c0e`](https://github.com/medusajs/medusa/commit/cbf3644eb7c8a24eaed879647b58c9ece3373c0e), [`d517dbd66a47817d1270c278b03add9a5c4244cb`](https://github.com/medusajs/medusa/commit/d517dbd66a47817d1270c278b03add9a5c4244cb), [`820a936b9836ae83e7a45de1e1ed0488d8cde2fd`](https://github.com/medusajs/medusa/commit/820a936b9836ae83e7a45de1e1ed0488d8cde2fd), [`00505b4f8e49873123111752adfda47ccb35ab46`](https://github.com/medusajs/medusa/commit/00505b4f8e49873123111752adfda47ccb35ab46), [`94b62c67249d13ec6342411cf7efdedfd0ac47e1`](https://github.com/medusajs/medusa/commit/94b62c67249d13ec6342411cf7efdedfd0ac47e1)]:
  - @medusajs/framework@2.8.5

## 2.8.4

### Patch Changes

- Updated dependencies [[`7685d66c0775167994150e61a8b628ad6289ce23`](https://github.com/medusajs/medusa/commit/7685d66c0775167994150e61a8b628ad6289ce23), [`cf0297f74af1b043363ffbd5a23ca0933097a69d`](https://github.com/medusajs/medusa/commit/cf0297f74af1b043363ffbd5a23ca0933097a69d), [`1f5f50010ae42f8d5b9924edcd75612b1f336463`](https://github.com/medusajs/medusa/commit/1f5f50010ae42f8d5b9924edcd75612b1f336463)]:
  - @medusajs/framework@2.8.4

## 2.8.3

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.8.3

## 2.8.2

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.8.2

## 2.8.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.8.1

## 2.8.0

### Patch Changes

- Updated dependencies [[`b868a4ef4deb7df09d6156a907f4c883cd55a3fd`](https://github.com/medusajs/medusa/commit/b868a4ef4deb7df09d6156a907f4c883cd55a3fd)]:
  - @medusajs/framework@2.8.0

## 2.7.1

### Patch Changes

- Updated dependencies [[`ee35f3ce9097832c10cdf2fd168763088e6c3fcb`](https://github.com/medusajs/medusa/commit/ee35f3ce9097832c10cdf2fd168763088e6c3fcb), [`2f6963a5fbea05537680cb1b1f6a2b9822c36325`](https://github.com/medusajs/medusa/commit/2f6963a5fbea05537680cb1b1f6a2b9822c36325), [`b8902637251e9ed4f8762ef280659bbab6d967de`](https://github.com/medusajs/medusa/commit/b8902637251e9ed4f8762ef280659bbab6d967de)]:
  - @medusajs/framework@2.7.1

## 2.7.0

### Patch Changes

- Updated dependencies [[`ec56a8bc857a74788df6523af25914da95c4c1d8`](https://github.com/medusajs/medusa/commit/ec56a8bc857a74788df6523af25914da95c4c1d8), [`2a18a75353f872b0cb4c203afc08cfd82f778428`](https://github.com/medusajs/medusa/commit/2a18a75353f872b0cb4c203afc08cfd82f778428)]:
  - @medusajs/framework@2.7.0

## 2.6.1

### Patch Changes

- [#11738](https://github.com/medusajs/medusa/pull/11738) [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Remove ranges on Medusa packages

- Updated dependencies [[`cc1309d3709b251683a0cda0ced448f8bf9f514e`](https://github.com/medusajs/medusa/commit/cc1309d3709b251683a0cda0ced448f8bf9f514e), [`3b470f41427e487c68f89b8ee8155de716ffe861`](https://github.com/medusajs/medusa/commit/3b470f41427e487c68f89b8ee8155de716ffe861), [`20cd59e622463fbd46506275648ce681869adcdf`](https://github.com/medusajs/medusa/commit/20cd59e622463fbd46506275648ce681869adcdf)]:
  - @medusajs/framework@2.6.1

## 2.6.0

### Patch Changes

- [#11641](https://github.com/medusajs/medusa/pull/11641) [`c250de79192bda1b1cd217bcca37f458c693de1d`](https://github.com/medusajs/medusa/commit/c250de79192bda1b1cd217bcca37f458c693de1d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Prevent sub workflow events release early + redis unlink

## 2.5.1

## 2.5.0

## 2.4.0

### Patch Changes

- Updated dependencies [[`0deffe7b9b9a1055813249b17057b7bba01b78ac`](https://github.com/medusajs/medusa/commit/0deffe7b9b9a1055813249b17057b7bba01b78ac), [`cc73802ab3821d2c667942bd887efb7476205547`](https://github.com/medusajs/medusa/commit/cc73802ab3821d2c667942bd887efb7476205547), [`13fe2f6776b22c401d131f184fc3600ef4008383`](https://github.com/medusajs/medusa/commit/13fe2f6776b22c401d131f184fc3600ef4008383), [`e53b8b0a9708d2eb46258ca417b6ff6abbd5f3d9`](https://github.com/medusajs/medusa/commit/e53b8b0a9708d2eb46258ca417b6ff6abbd5f3d9)]:
  - @medusajs/framework@2.4.0

## 2.3.1

## 2.3.0

## 2.2.0

## 2.1.3

## 2.1.2

## 2.1.1

## 2.1.0

## 2.0.7

## 2.0.6

## 2.0.5

### Patch Changes

- [#10085](https://github.com/medusajs/medusa/pull/10085) [`3e265229f2ae5c3d55f64a445574c13c40b52c14`](https://github.com/medusajs/medusa/commit/3e265229f2ae5c3d55f64a445574c13c40b52c14) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Improve event bus error handling

## 2.0.4

## 2.0.3

## 2.0.2

## 2.0.1

## 2.0.0

### Major Changes

- [#7341](https://github.com/medusajs/medusa/pull/7341) [`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Medusa 2.0

### Patch Changes

- Updated dependencies [[`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e)]:
  - @medusajs/framework@2.0.0

## 1.8.13

### Patch Changes

- [#6924](https://github.com/medusajs/medusa/pull/6924) [`12fcb655cd`](https://github.com/medusajs/medusa/commit/12fcb655cd0e398e75acce39166d14db13aa2c08) Thanks [@adrien2p](https://github.com/adrien2p)! - Chore/workflow engine loader redis

- [#6865](https://github.com/medusajs/medusa/pull/6865) [`8fd1488938`](https://github.com/medusajs/medusa/commit/8fd148893850eb66c5eae00c4ca9391a80ea2eb9) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: medusa shutdown

- Updated dependencies [[`1eeb1e9de3`](https://github.com/medusajs/medusa/commit/1eeb1e9de3e0b571735437b00968ee96e4aabad5), [`20e8df914e`](https://github.com/medusajs/medusa/commit/20e8df914ec5fdf8d562d4fa84f72c58c7056195), [`e0b02a1012`](https://github.com/medusajs/medusa/commit/e0b02a1012981c29830d7779f59ebe805bbfd137), [`e944a627f0`](https://github.com/medusajs/medusa/commit/e944a627f074fb39a56f4bc7b3d6d315736ebf7c), [`cc557c8752`](https://github.com/medusajs/medusa/commit/cc557c8752fd0554f5a1b58522d9a88dc43a8509), [`dd35a4dbff`](https://github.com/medusajs/medusa/commit/dd35a4dbff10c86ea3c5f7f817c18b6e60d599e3), [`1bcb13f892`](https://github.com/medusajs/medusa/commit/1bcb13f892bc61db21b3fc6bdbce85f747aeec4c), [`82a176e30e`](https://github.com/medusajs/medusa/commit/82a176e30e47a7d11caaf31c3023bd8db588b465), [`5d9aea053c`](https://github.com/medusajs/medusa/commit/5d9aea053ce6e04f242f86fb9053c13dec515d5b), [`232322d035`](https://github.com/medusajs/medusa/commit/232322d03515f81e56867ff8c765b8409399ee68), [`528ef4ca90`](https://github.com/medusajs/medusa/commit/528ef4ca90bb2cf6173dccc9fd6a9f9932ff9b76), [`4b57c5d286`](https://github.com/medusajs/medusa/commit/4b57c5d286f9dc6e2098c67e9fecb0d93175b5a1), [`667c8609cc`](https://github.com/medusajs/medusa/commit/667c8609ccf3850f5df8cf784723a95bd0d6d2a6), [`a6562d2a41`](https://github.com/medusajs/medusa/commit/a6562d2a41453cbe7aa43be352c4924e3e4c79d5), [`8fd1488938`](https://github.com/medusajs/medusa/commit/8fd148893850eb66c5eae00c4ca9391a80ea2eb9), [`1c6ba4468e`](https://github.com/medusajs/medusa/commit/1c6ba4468eab1440931c88929affd5b4c593f377)]:
  - @medusajs/modules-sdk@1.12.11
  - @medusajs/utils@1.11.9

## 1.8.12

### Patch Changes

- [#6739](https://github.com/medusajs/medusa/pull/6739) [`56481e683d`](https://github.com/medusajs/medusa/commit/56481e683d33ff98f0d4c4e144873bb23f993c9c) Thanks [@srindom](https://github.com/srindom)! - feat: v2 - add worker mode

- Updated dependencies [[`06f22bb48a`](https://github.com/medusajs/medusa/commit/06f22bb48ad1fe73577657b8c5db055312f16a0d), [`56481e683d`](https://github.com/medusajs/medusa/commit/56481e683d33ff98f0d4c4e144873bb23f993c9c), [`9073d7aba3`](https://github.com/medusajs/medusa/commit/9073d7aba3419e4dc0a206473291a46ebd79b8c1), [`4974f5e455`](https://github.com/medusajs/medusa/commit/4974f5e4557bd64a328a881ec02b91e15485bd23), [`1ef9c78cea`](https://github.com/medusajs/medusa/commit/1ef9c78cea080c3b7c136f909c6cddec9d8f0c62)]:
  - @medusajs/modules-sdk@1.12.10
  - @medusajs/utils@1.11.8

## 1.8.11

### Patch Changes

- [#6218](https://github.com/medusajs/medusa/pull/6218) [`884428a1b`](https://github.com/medusajs/medusa/commit/884428a1b573e499d7659aefed639bf797147428) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Feat: Event Aggregator

- Updated dependencies [[`12054f5c0`](https://github.com/medusajs/medusa/commit/12054f5c01915899223ddc6da734151b31fbb23b), [`3db2f95e65`](https://github.com/medusajs/medusa/commit/3db2f95e65909f4fff432990b48be74509052e83), [`96ba49329`](https://github.com/medusajs/medusa/commit/96ba49329b6b05922c90f0c55f16455cb40aa5ca), [`45134e4d1`](https://github.com/medusajs/medusa/commit/45134e4d11cfcdc08dbd10aae687bfbe9e848ab9), [`884428a1b`](https://github.com/medusajs/medusa/commit/884428a1b573e499d7659aefed639bf797147428), [`882aa549b`](https://github.com/medusajs/medusa/commit/882aa549bdcc6f378934eab2a7c485df354f46aa)]:
  - @medusajs/utils@1.11.5
  - @medusajs/modules-sdk@1.12.8

## 1.8.10

### Patch Changes

- [#5468](https://github.com/medusajs/medusa/pull/5468) [`a45da9215`](https://github.com/medusajs/medusa/commit/a45da9215d2a7834c368037726aaa3961caadaf9) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa, modules-sdk, modules): Module loading was missing the expected dependencies and remote query reference fix

- Updated dependencies [[`a45da9215`](https://github.com/medusajs/medusa/commit/a45da9215d2a7834c368037726aaa3961caadaf9)]:
  - @medusajs/modules-sdk@1.12.2

## 1.8.9

### Patch Changes

- [#4420](https://github.com/medusajs/medusa/pull/4420) [`6f1fa244f`](https://github.com/medusajs/medusa/commit/6f1fa244fa47d4ecdaa7363483bd7da555dbbf32) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(medusa-cli): Cleanup plugin setup + include Logger type update which is used across multiple packages

- Updated dependencies [[`499c3478c`](https://github.com/medusajs/medusa/commit/499c3478c910c8b922a15cc6f4d9fbad122a347f), [`9dcdc0041`](https://github.com/medusajs/medusa/commit/9dcdc0041a2b08cc0723343dd8d9127d9977b086), [`9760d4a96`](https://github.com/medusajs/medusa/commit/9760d4a96c27f6f89a8c3f3b6e73b17547f97f2a)]:
  - @medusajs/utils@1.9.2

## 1.8.8

### Patch Changes

- [#4276](https://github.com/medusajs/medusa/pull/4276) [`afd1b67f1`](https://github.com/medusajs/medusa/commit/afd1b67f1c7de8cf07fd9fcbdde599a37914e9b5) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Use caret range

- Updated dependencies [[`f98ba5bde`](https://github.com/medusajs/medusa/commit/f98ba5bde83ba785eead31b0c9eb9f135d664178), [`14c0f62f8`](https://github.com/medusajs/medusa/commit/14c0f62f84704a4c87beff3daaff60a52f5c88b8)]:
  - @medusajs/utils@1.9.1
  - @medusajs/modules-sdk@1.8.8

## 1.8.7

### Patch Changes

- Updated dependencies [[`a91987fab`](https://github.com/medusajs/medusa/commit/a91987fab33745f9864eab21bd1c27e8e3e24571), [`e73c3e51c`](https://github.com/medusajs/medusa/commit/e73c3e51c9cd192eeae7a57b24b07bd466214145), [`db4199530`](https://github.com/medusajs/medusa/commit/db419953075e0907b8c4d27ab5188e9bd3e3d72b), [`c0e527d6e`](https://github.com/medusajs/medusa/commit/c0e527d6e0a67d0c53577a0b9c3d16ee8dc5740f)]:
  - @medusajs/utils@1.9.0
  - @medusajs/modules-sdk@1.8.7

## 1.8.6

### Patch Changes

- Updated dependencies [[`cdbac2c84`](https://github.com/medusajs/medusa/commit/cdbac2c8403a3c15c0e11993f6b7dab268fa5c08), [`6511959e2`](https://github.com/medusajs/medusa/commit/6511959e23177f3b4831915db0e8e788bc9047fa)]:
  - @medusajs/utils@1.8.5
  - @medusajs/modules-sdk@1.8.6

## 1.8.5

### Patch Changes

- Updated dependencies [[`1ea57c3a6`](https://github.com/medusajs/medusa/commit/1ea57c3a69a5377a8dd0821df819743ded4a222b)]:
  - @medusajs/utils@1.8.4
  - @medusajs/modules-sdk@1.8.5

## 1.8.4

### Patch Changes

- Updated dependencies [[`0e488e71b`](https://github.com/medusajs/medusa/commit/0e488e71b186f7d08b18c4c6ba409ef3cadb8152), [`d539c6fee`](https://github.com/medusajs/medusa/commit/d539c6feeba8ee431f9a655b6cd4e9102cba2b25)]:
  - @medusajs/utils@1.8.3
  - @medusajs/modules-sdk@1.8.4

## 1.8.3

### Patch Changes

- Updated dependencies [[`af710f1b4`](https://github.com/medusajs/medusa/commit/af710f1b48a4545a5064029a557013af34c4c100), [`491566df6`](https://github.com/medusajs/medusa/commit/491566df6b7ced35f655f810961422945e10ecd0)]:
  - @medusajs/utils@1.8.2
  - @medusajs/modules-sdk@1.8.3

## 1.8.2

### Patch Changes

- Updated dependencies []:
  - @medusajs/modules-sdk@1.8.2

## 1.8.1

### Patch Changes

- Updated dependencies [[`654a54622`](https://github.com/medusajs/medusa/commit/654a54622303139e7180538bd686630ad9a46cfd), [`abdb74d99`](https://github.com/medusajs/medusa/commit/abdb74d997f49f994bff49787a396179982843b0)]:
  - @medusajs/utils@1.8.1
  - @medusajs/modules-sdk@1.8.1

## 1.8.0

### Minor Changes

- [#2599](https://github.com/medusajs/medusa/pull/2599) [`ef5ef9f5a`](https://github.com/medusajs/medusa/commit/ef5ef9f5a26febf0b64d9981606c1e59999ca76e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa,event-bus-local,event-bus-redis): Event Bus module (Redis + Local)

### Patch Changes

- [#3685](https://github.com/medusajs/medusa/pull/3685) [`8ddb3952c`](https://github.com/medusajs/medusa/commit/8ddb3952c045e6c05c8d0f6922f0d4ba30cf3bd4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Fix RC package versions

- [#3649](https://github.com/medusajs/medusa/pull/3649) [`bd12a9508`](https://github.com/medusajs/medusa/commit/bd12a95083b69a70b83ad38578c5a68738c41b2b) Thanks [@carlos-r-l-rodrigues](https://github.com/carlos-r-l-rodrigues)! - Export initialize method for all modules

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

- [#2599](https://github.com/medusajs/medusa/pull/2599) [`ef5ef9f5a`](https://github.com/medusajs/medusa/commit/ef5ef9f5a26febf0b64d9981606c1e59999ca76e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa,event-bus-local,event-bus-redis): Event Bus module (Redis + Local)

### Patch Changes

- Updated dependencies [[`74bc4b16a`](https://github.com/medusajs/medusa/commit/74bc4b16a07f78668003ca930bf2a0d928897ceb), [`77d46220c`](https://github.com/medusajs/medusa/commit/77d46220c23bfe19e575cbc445874eb6c22f3c73), [`271844aed`](https://github.com/medusajs/medusa/commit/271844aedbe45c369e188b5d06458dbd6984cd39), [`4e9d257d3`](https://github.com/medusajs/medusa/commit/4e9d257d3bf76703ef5be8ca054cc9f0f7339def)]:
  - @medusajs/utils@0.0.2-rc.0
  - @medusajs/modules-sdk@0.1.0-rc.0
