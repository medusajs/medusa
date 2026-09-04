# @medusajs/rbac

## 2.20.2

### Patch Changes

- Updated dependencies [[`a4c0a845e8b3a7a5acfaacbb0c093cd539ac713b`](https://github.com/medusajs/medusa/commit/a4c0a845e8b3a7a5acfaacbb0c093cd539ac713b), [`c8701e77534f7b615c8b86814f8d5789c0104382`](https://github.com/medusajs/medusa/commit/c8701e77534f7b615c8b86814f8d5789c0104382)]:
  - @medusajs/framework@2.20.2

## 2.20.1

### Patch Changes

- Updated dependencies [[`f373c17dd60cb1e7df1d0c70db31d516d2a0cb4f`](https://github.com/medusajs/medusa/commit/f373c17dd60cb1e7df1d0c70db31d516d2a0cb4f)]:
  - @medusajs/framework@2.20.1

## 2.20.0

### Patch Changes

- Updated dependencies [[`847612908fdd1c11a4df09ccc2e8ab44d338bb04`](https://github.com/medusajs/medusa/commit/847612908fdd1c11a4df09ccc2e8ab44d338bb04), [`785fd2b8a978201638a4d8d5ae9eea483958c0fb`](https://github.com/medusajs/medusa/commit/785fd2b8a978201638a4d8d5ae9eea483958c0fb), [`706ce874672c9cd1d8fc0c5429fc0dd24e6910a9`](https://github.com/medusajs/medusa/commit/706ce874672c9cd1d8fc0c5429fc0dd24e6910a9), [`6a2fce501f3bcd459c21a67f586c7a15b905ff0f`](https://github.com/medusajs/medusa/commit/6a2fce501f3bcd459c21a67f586c7a15b905ff0f), [`5e06e544a296b9033f20f71f11c559f81a0e5739`](https://github.com/medusajs/medusa/commit/5e06e544a296b9033f20f71f11c559f81a0e5739)]:
  - @medusajs/framework@2.20.0

## 2.19.0

### Patch Changes

- Updated dependencies [[`372a1ab8fa4c8415f1eda294e3c4c5d9dbee4a30`](https://github.com/medusajs/medusa/commit/372a1ab8fa4c8415f1eda294e3c4c5d9dbee4a30), [`5f4d93c374b0ad0b0a31e75de98c7557e0415677`](https://github.com/medusajs/medusa/commit/5f4d93c374b0ad0b0a31e75de98c7557e0415677), [`5105fec20908cf7bcd7f5f859674acdd8a38b982`](https://github.com/medusajs/medusa/commit/5105fec20908cf7bcd7f5f859674acdd8a38b982)]:
  - @medusajs/framework@2.19.0

## 2.18.0

### Patch Changes

- [`ce410177897f2de3f35825096df7870ebf5b2f8f`](undefined) - fix(rbac): add migration that creates the missing `rbac_role_inheritance` table

  The `RbacRoleInheritance` model is registered by the module but no migration created the corresponding `rbac_role_inheritance` table or its foreign keys, so running `medusa db:migrate` left the module in a broken state and subsequent `medusa db:generate rbac` runs would produce migration files inside `node_modules` (and fail to load under Node's native TS stripping).

- Updated dependencies [[`1621e14330fe64a968510991408ace8fdac84ce9`](https://github.com/medusajs/medusa/commit/1621e14330fe64a968510991408ace8fdac84ce9), [`1359d1bf6237aa058910b805395932cd070d2043`](https://github.com/medusajs/medusa/commit/1359d1bf6237aa058910b805395932cd070d2043), [`3bf2b51b7e140c3a7f45ad9c9a8a6bd4f470ff09`](https://github.com/medusajs/medusa/commit/3bf2b51b7e140c3a7f45ad9c9a8a6bd4f470ff09), [`d76952b5b0e4b287747a7e08f2cb745510143aae`](https://github.com/medusajs/medusa/commit/d76952b5b0e4b287747a7e08f2cb745510143aae), [`d6b2a87da1dbfd065336c80e41cb7c086dc2a340`](https://github.com/medusajs/medusa/commit/d6b2a87da1dbfd065336c80e41cb7c086dc2a340), [`6ef16b6fdc6f04b900583a5f2714a863011ed19a`](https://github.com/medusajs/medusa/commit/6ef16b6fdc6f04b900583a5f2714a863011ed19a), [`70c122753875f3cca03ff49b8a0ea9fe2c5e1165`](https://github.com/medusajs/medusa/commit/70c122753875f3cca03ff49b8a0ea9fe2c5e1165), [`144c47aba88f6e08fb7c99634c9fec8474721b0a`](https://github.com/medusajs/medusa/commit/144c47aba88f6e08fb7c99634c9fec8474721b0a), [`513c01a5a7f587cb52c92677e2379e54bd990361`](https://github.com/medusajs/medusa/commit/513c01a5a7f587cb52c92677e2379e54bd990361)]:
  - @medusajs/framework@2.18.0

## 2.17.2

### Patch Changes

- [#15683](https://github.com/medusajs/medusa/pull/15683) [`de58ec503bcd82aae3fe576f9a404c36e2525f4c`](https://github.com/medusajs/medusa/commit/de58ec503bcd82aae3fe576f9a404c36e2525f4c) Thanks [@Floofy6](https://github.com/Floofy6)! - chore: add package bugs metadata

- Updated dependencies [[`de58ec503bcd82aae3fe576f9a404c36e2525f4c`](https://github.com/medusajs/medusa/commit/de58ec503bcd82aae3fe576f9a404c36e2525f4c)]:
  - @medusajs/framework@2.17.2

## 2.17.1

### Patch Changes

- Updated dependencies [[`975313f62b22055ddaacf7852f33cf7b0f4af5df`](https://github.com/medusajs/medusa/commit/975313f62b22055ddaacf7852f33cf7b0f4af5df)]:
  - @medusajs/framework@2.17.1

## 2.17.0

### Patch Changes

- Updated dependencies [[`57b8e74d0fea8fb0e9dccd76eb6df06f0380071a`](https://github.com/medusajs/medusa/commit/57b8e74d0fea8fb0e9dccd76eb6df06f0380071a)]:
  - @medusajs/framework@2.17.0

## 2.16.0

### Patch Changes

- Updated dependencies [[`8a6664d6d445f875f56078fad21fe12a185b9627`](https://github.com/medusajs/medusa/commit/8a6664d6d445f875f56078fad21fe12a185b9627), [`20352f4fa2f31e5b491c8b1b244c407392939fbf`](https://github.com/medusajs/medusa/commit/20352f4fa2f31e5b491c8b1b244c407392939fbf), [`90af038c95c835dee5168ffd19cda5182d81b904`](https://github.com/medusajs/medusa/commit/90af038c95c835dee5168ffd19cda5182d81b904), [`66610b87efb112e37b78c7c9536d95070b8d6b11`](https://github.com/medusajs/medusa/commit/66610b87efb112e37b78c7c9536d95070b8d6b11)]:
  - @medusajs/framework@2.16.0

## 2.15.5

### Patch Changes

- [#14593](https://github.com/medusajs/medusa/pull/14593) [`538f98da78ae2d741f1182e6ef315ba8efac6911`](https://github.com/medusajs/medusa/commit/538f98da78ae2d741f1182e6ef315ba8efac6911) Thanks [@fPolic](https://github.com/fPolic)! - feat(dashboard,framework,rbac,js-sdk,types,utils,medusa): rbac admin dashboard utils

- Updated dependencies [[`8122633a8b33164a6094f5a39896e356efde1747`](https://github.com/medusajs/medusa/commit/8122633a8b33164a6094f5a39896e356efde1747), [`538f98da78ae2d741f1182e6ef315ba8efac6911`](https://github.com/medusajs/medusa/commit/538f98da78ae2d741f1182e6ef315ba8efac6911)]:
  - @medusajs/framework@2.15.5

## 2.15.4

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.15.4

## 2.15.3

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.15.3

## 2.15.2

### Patch Changes

- Updated dependencies [[`2b21d15640ae459386b0acea4c83804c6f502b9d`](https://github.com/medusajs/medusa/commit/2b21d15640ae459386b0acea4c83804c6f502b9d)]:
  - @medusajs/framework@2.15.2

## 2.15.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.15.1

## 2.15.0

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.15.0

## 2.14.2

### Patch Changes

- Updated dependencies [[`be0b8817a1e2e48e1c6c579de6598c6f5e9bf4b0`](https://github.com/medusajs/medusa/commit/be0b8817a1e2e48e1c6c579de6598c6f5e9bf4b0), [`7c659ff3d69c43bd7477bcc8a1c0afd092ea1c23`](https://github.com/medusajs/medusa/commit/7c659ff3d69c43bd7477bcc8a1c0afd092ea1c23)]:
  - @medusajs/framework@2.14.2

## 2.14.1

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.14.1

## 2.14.0

### Patch Changes

- Updated dependencies [[`0929b8d192833e10b6b91795f1ffc478938c3fb7`](https://github.com/medusajs/medusa/commit/0929b8d192833e10b6b91795f1ffc478938c3fb7), [`843dbfe7c8f27b732486c7a8da7b6d63f2fdf967`](https://github.com/medusajs/medusa/commit/843dbfe7c8f27b732486c7a8da7b6d63f2fdf967)]:
  - @medusajs/framework@2.14.0

## 2.13.6

### Patch Changes

- Updated dependencies [[`2b0cd5ff0ce00bf1de1d99632f1bda4073ac035d`](https://github.com/medusajs/medusa/commit/2b0cd5ff0ce00bf1de1d99632f1bda4073ac035d)]:
  - @medusajs/framework@2.13.6

## 2.13.5

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.13.5

## 2.13.4

### Patch Changes

- Updated dependencies []:
  - @medusajs/framework@2.13.4

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

- Updated dependencies [[`13476988763368b3b333fa5bc3f613e8eb174fdf`](https://github.com/medusajs/medusa/commit/13476988763368b3b333fa5bc3f613e8eb174fdf), [`8890f284705a4843a57a3800820208f593689a2a`](https://github.com/medusajs/medusa/commit/8890f284705a4843a57a3800820208f593689a2a), [`1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b`](https://github.com/medusajs/medusa/commit/1ca3516a5cbb059ad79fe483cd8e1d6a7ebca23b)]:
  - @medusajs/framework@2.12.6

## 2.12.5

### Patch Changes

- Updated dependencies [[`233ec261be200fac83002415aa7c0df082339a3f`](https://github.com/medusajs/medusa/commit/233ec261be200fac83002415aa7c0df082339a3f)]:
  - @medusajs/framework@2.12.5
