# Change Log

## 1.1.53

### Patch Changes

- [#3217](https://github.com/medusajs/medusa/pull/3217) [`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Fix npm packages files included

- Updated dependencies [[`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0)]:
  - medusa-core-utils@1.1.39
  - medusa-interfaces@1.3.6

## 1.1.52

### Patch Changes

- [#3046](https://github.com/medusajs/medusa/pull/3046) [`82da3605f`](https://github.com/medusajs/medusa/commit/82da3605fb50cef182699900552109ad654f0df2) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa-payment-stripe): Avoid unnecessary customer update if the stripe id already exists

- [#3100](https://github.com/medusajs/medusa/pull/3100) [`0009da026`](https://github.com/medusajs/medusa/commit/0009da02619e794537d88fa9494e35594ed1bb0c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa-payment-stripe): Resend capture event to ensure auto-capture

- [#3185](https://github.com/medusajs/medusa/pull/3185) [`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Patches all dependencies + minor bumps `winston` to include a [fix for a significant memory leak](https://github.com/winstonjs/winston/pull/2057)

- [#3160](https://github.com/medusajs/medusa/pull/3160) [`71fdd2819`](https://github.com/medusajs/medusa/commit/71fdd281986781a96f5c50205a4a3628ae8e6282) Thanks [@olivermrbl](https://github.com/olivermrbl)! - fix(medusa-payment-stripe): Prevent Stripe events from retrying

- Updated dependencies [[`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4)]:
  - medusa-core-utils@1.1.38
  - medusa-interfaces@1.3.5

## 1.1.51

### Patch Changes

- [#3025](https://github.com/medusajs/medusa/pull/3025) [`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): test, build and watch scripts

- Updated dependencies [[`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2)]:
  - medusa-interfaces@1.3.4

## 1.1.50

### Patch Changes

- [#2808](https://github.com/medusajs/medusa/pull/2808) [`0a9c89185`](https://github.com/medusajs/medusa/commit/0a9c891853c4d16b553d38268a3408ca1daa71f0) Thanks [@patrick-medusajs](https://github.com/patrick-medusajs)! - chore: explicitly add devDependencies for monorepo peerDependencies

- [#2743](https://github.com/medusajs/medusa/pull/2743) [`c8724da50`](https://github.com/medusajs/medusa/commit/c8724da50300b94255c5fb4ffe9904be279b5923) Thanks [@adrien2p](https://github.com/adrien2p)! - feat(medusa,medusa-payment-stripe): Move database mutation from plugin to core

- Updated dependencies [[`7cced6006`](https://github.com/medusajs/medusa/commit/7cced6006a9a6f9108009e9f3e191e9f3ba1b168)]:
  - medusa-core-utils@1.1.37

## 1.1.49

### Patch Changes

- [#2666](https://github.com/medusajs/medusa/pull/2666) [`63d2a0eb1`](https://github.com/medusajs/medusa/commit/63d2a0eb1bb55301cb4d3c6399c04c59d376c1f6) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa-plugin-stripe): Correct hooks import

- Updated dependencies [[`1b21af87a`](https://github.com/medusajs/medusa/commit/1b21af87ab80c18013f0f44434e59b873c2313aa)]:
  - medusa-core-utils@1.1.36

## 1.1.48

### Patch Changes

- [#2607](https://github.com/medusajs/medusa/pull/2607) [`e09f6e8a1`](https://github.com/medusajs/medusa/commit/e09f6e8a1e4a759fe70664bea0538c61b7cea70a) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa-payment-stripe): handle webhook sirialization failure

- [#2603](https://github.com/medusajs/medusa/pull/2603) [`9e91a50df`](https://github.com/medusajs/medusa/commit/9e91a50df17b4f542db8d9678b5f489218511adb) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa-payment-stripe): missing transaction on create payment

## 1.1.47

### Patch Changes

- [#2581](https://github.com/medusajs/medusa/pull/2581) [`04e894ec3`](https://github.com/medusajs/medusa/commit/04e894ec39e1008be893a6cf313c3822a085579c) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Support provider specific intent options

## 1.1.46

### Patch Changes

- [`715bdf6b1`](https://github.com/medusajs/medusa/commit/715bdf6b159d6eb291d3c489ab32a80f9eadcfb9) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Patch bump Stripe plugin

## 1.1.45

### Patch Changes

- [`a014e3623`](https://github.com/medusajs/medusa/commit/a014e3623c64f747e7496abccb8d0c7c01093d8b) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Support automatic payment methods

## 1.1.44

### Patch Changes

- [#2381](https://github.com/medusajs/medusa/pull/2381) [`a908a7716`](https://github.com/medusajs/medusa/commit/a908a7716c94222f340531a5b13db0867b511519) Thanks [@srindom](https://github.com/srindom)! - Rely on cart totals in payment providers

* [#1790](https://github.com/medusajs/medusa/pull/1790) [`df62e618b`](https://github.com/medusajs/medusa/commit/df62e618bcc365ef376b96705d63b465b48b0191) Thanks [@adrien2p](https://github.com/adrien2p)! - Migrate Stripe providers to the new AbstractPaymentService

* Updated dependencies [[`7dc8d3a0c`](https://github.com/medusajs/medusa/commit/7dc8d3a0c90ce06e3f11a6a46dec1f9ec3f26e81)]:
  - medusa-core-utils@1.1.32

## 1.1.43

### Patch Changes

- [#1982](https://github.com/medusajs/medusa/pull/1982) [`40ae53567`](https://github.com/medusajs/medusa/commit/40ae53567a23ebe562e571fa22f1721eed174c82) Thanks [@chemicalkosek](https://github.com/chemicalkosek)! - Add payment providers Przelewy24 and Blik through Stripe

- Updated dependencies [[`c97ccd3fb`](https://github.com/medusajs/medusa/commit/c97ccd3fb5dbe796b0e4fbf37def5bb6e8201557)]:
  - medusa-interfaces@1.3.3

## 1.1.42

### Patch Changes

- [#1914](https://github.com/medusajs/medusa/pull/1914) [`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68) Thanks [@fPolic](https://github.com/fPolic)! - Version bump due to missing changesets in merged PRs

* [#1899](https://github.com/medusajs/medusa/pull/1899) [`e51fdd330`](https://github.com/medusajs/medusa/commit/e51fdd3304697725f8d7e3980e38fbdec6a3c58d) Thanks [@adrien2p](https://github.com/adrien2p)! - Fix options typo in payment intent descriptions

* Updated dependencies [[`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68), [`b8ddb31f6`](https://github.com/medusajs/medusa/commit/b8ddb31f6fe296a11d2d988276ba8e991c37fa9b)]:
  - medusa-interfaces@1.3.2

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.1.41](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.40...medusa-payment-stripe@1.1.41) (2022-07-05)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.40](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.38...medusa-payment-stripe@1.1.40) (2022-06-19)

### Features

- **medusa-payment-stripe:** Ability to add payment description and improve status resolution ([#1404](https://github.com/medusajs/medusa/issues/1404)) ([327614e](https://github.com/medusajs/medusa/commit/327614e126d57b1c53ca95b2298c8e4ec1dd34fb))

## [1.1.39](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.38...medusa-payment-stripe@1.1.39) (2022-05-31)

### Features

- **medusa-payment-stripe:** Ability to add payment description and improve status resolution ([#1404](https://github.com/medusajs/medusa/issues/1404)) ([327614e](https://github.com/medusajs/medusa/commit/327614e126d57b1c53ca95b2298c8e4ec1dd34fb))

## [1.1.38](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.37...medusa-payment-stripe@1.1.38) (2022-01-11)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.37](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.36...medusa-payment-stripe@1.1.37) (2021-12-29)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.36](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.35...medusa-payment-stripe@1.1.36) (2021-12-17)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.35](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.34...medusa-payment-stripe@1.1.35) (2021-12-08)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.34](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.33...medusa-payment-stripe@1.1.34) (2021-11-23)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.33](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.32...medusa-payment-stripe@1.1.33) (2021-11-22)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.32](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.31...medusa-payment-stripe@1.1.32) (2021-11-19)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.31](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.30...medusa-payment-stripe@1.1.31) (2021-11-19)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.30](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.29...medusa-payment-stripe@1.1.30) (2021-10-18)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.29](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.28...medusa-payment-stripe@1.1.29) (2021-10-18)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.28](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.26...medusa-payment-stripe@1.1.28) (2021-10-18)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.27](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.26...medusa-payment-stripe@1.1.27) (2021-10-18)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.26](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.25...medusa-payment-stripe@1.1.26) (2021-09-22)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.25](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.24...medusa-payment-stripe@1.1.25) (2021-09-15)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.24](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.23...medusa-payment-stripe@1.1.24) (2021-09-14)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.23](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.22...medusa-payment-stripe@1.1.23) (2021-08-05)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.22](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.21...medusa-payment-stripe@1.1.22) (2021-07-26)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.21](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.19...medusa-payment-stripe@1.1.21) (2021-07-15)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.20](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.19...medusa-payment-stripe@1.1.20) (2021-07-15)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.19](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.18...medusa-payment-stripe@1.1.19) (2021-07-02)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.18](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.17...medusa-payment-stripe@1.1.18) (2021-06-22)

### Bug Fixes

- release assist ([668e8a7](https://github.com/medusajs/medusa/commit/668e8a740200847fc2a41c91d2979097f1392532))

### Features

- **stripe:** adds giropay provider ([5873682](https://github.com/medusajs/medusa/commit/58736824911d4fa1b252e93313c71de607405eb9))

## [1.1.17](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.16...medusa-payment-stripe@1.1.17) (2021-06-09)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.16](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.15...medusa-payment-stripe@1.1.16) (2021-06-09)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.15](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.14...medusa-payment-stripe@1.1.15) (2021-06-09)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.14](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.13...medusa-payment-stripe@1.1.14) (2021-06-09)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.13](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.12...medusa-payment-stripe@1.1.13) (2021-06-08)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.12](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.9...medusa-payment-stripe@1.1.12) (2021-04-28)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.11](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.10...medusa-payment-stripe@1.1.11) (2021-04-20)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.10](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.9...medusa-payment-stripe@1.1.10) (2021-04-20)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.9](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.8...medusa-payment-stripe@1.1.9) (2021-04-13)

### Bug Fixes

- merge develop ([a468c45](https://github.com/medusajs/medusa/commit/a468c451e82c68f41b5005a2e480057f6124aaa6))

## [1.1.8](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.7...medusa-payment-stripe@1.1.8) (2021-04-13)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.7](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.6...medusa-payment-stripe@1.1.7) (2021-03-30)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.6](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.5...medusa-payment-stripe@1.1.6) (2021-03-17)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.5](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.3...medusa-payment-stripe@1.1.5) (2021-03-17)

### Bug Fixes

- floor amounts ([5e2f550](https://github.com/medusajs/medusa/commit/5e2f550ae10a3eb7636edf6bf99197517a1fa7b3))
- round instead of floor ([74a6b67](https://github.com/medusajs/medusa/commit/74a6b67f9db0a66fdf3cf69be6db62ae0deea635))

## [1.1.4](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.3...medusa-payment-stripe@1.1.4) (2021-03-17)

### Bug Fixes

- floor amounts ([5e2f550](https://github.com/medusajs/medusa/commit/5e2f550ae10a3eb7636edf6bf99197517a1fa7b3))
- round instead of floor ([74a6b67](https://github.com/medusajs/medusa/commit/74a6b67f9db0a66fdf3cf69be6db62ae0deea635))

## [1.1.3](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.2...medusa-payment-stripe@1.1.3) (2021-02-17)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.2](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.1...medusa-payment-stripe@1.1.2) (2021-02-03)

**Note:** Version bump only for package medusa-payment-stripe

## [1.1.1](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.1.0...medusa-payment-stripe@1.1.1) (2021-01-27)

**Note:** Version bump only for package medusa-payment-stripe

# [1.1.0](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.0.15...medusa-payment-stripe@1.1.0) (2021-01-26)

**Note:** Version bump only for package medusa-payment-stripe

## [1.0.15](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.0.14...medusa-payment-stripe@1.0.15) (2020-12-17)

**Note:** Version bump only for package medusa-payment-stripe

## [1.0.14](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.0.13...medusa-payment-stripe@1.0.14) (2020-11-24)

**Note:** Version bump only for package medusa-payment-stripe

## [1.0.13](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.0.12...medusa-payment-stripe@1.0.13) (2020-10-19)

**Note:** Version bump only for package medusa-payment-stripe

## [1.0.12](https://github.com/medusajs/medusa/compare/medusa-payment-stripe@1.0.11...medusa-payment-stripe@1.0.12) (2020-10-12)

**Note:** Version bump only for package medusa-payment-stripe

## 1.0.11 (2020-10-06)

## 1.0.10 (2020-09-09)

### Bug Fixes

- updates license ([db519fb](https://github.com/medusajs/medusa/commit/db519fbaa6f8ad02c19cbecba5d4f28ba1ee81aa))

## 1.0.7 (2020-09-07)

## 1.0.2 (2020-09-06)

## 1.0.1 (2020-09-05)

## 1.0.1-beta.0 (2020-09-04)

# 1.0.0 (2020-09-03)

# 1.0.0-alpha.30 (2020-08-28)

# 1.0.0-alpha.27 (2020-08-27)

# 1.0.0-alpha.25 (2020-08-27)

# 1.0.0-alpha.24 (2020-08-27)

### Bug Fixes

- **medusa-payment-stripe:** adds missing await in updateSession ([0cebcd2](https://github.com/medusajs/medusa/commit/0cebcd25211f32088e19e56dee095129ee2da86b))

# 1.0.0-alpha.3 (2020-08-20)

# 1.0.0-alpha.2 (2020-08-20)

# 1.0.0-alpha.1 (2020-08-20)

# 1.0.0-alpha.0 (2020-08-20)

# 0.3.0 (2020-04-06)

# 0.2.0 (2020-04-06)

# 0.2.0-alpha.0 (2020-04-04)

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
