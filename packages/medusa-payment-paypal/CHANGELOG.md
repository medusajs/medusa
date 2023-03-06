# Change Log

## 1.2.10

### Patch Changes

- [#3217](https://github.com/medusajs/medusa/pull/3217) [`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0) Thanks [@adrien2p](https://github.com/adrien2p)! - chore: Fix npm packages files included

- Updated dependencies [[`8c5219a31`](https://github.com/medusajs/medusa/commit/8c5219a31ef76ee571fbce84d7d57a63abe56eb0)]:
  - medusa-core-utils@1.1.39
  - medusa-interfaces@1.3.6

## 1.2.9

### Patch Changes

- [#3011](https://github.com/medusajs/medusa/pull/3011) [`ce866475b`](https://github.com/medusajs/medusa/commit/ce866475b4b6c8b453638000f7b1df7a27daf45d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(_-payment-_): cleanup payment provider plugins

- [#3185](https://github.com/medusajs/medusa/pull/3185) [`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Patches all dependencies + minor bumps `winston` to include a [fix for a significant memory leak](https://github.com/winstonjs/winston/pull/2057)

- Updated dependencies [[`08324355a`](https://github.com/medusajs/medusa/commit/08324355a4466b017a0bc7ab1d333ee3cd27b8c4)]:
  - medusa-core-utils@1.1.38
  - medusa-interfaces@1.3.5

## 1.2.8

### Patch Changes

- [#3010](https://github.com/medusajs/medusa/pull/3010) [`142c8aa70`](https://github.com/medusajs/medusa/commit/142c8aa70f583d9b11a6add2b8f988e9ba4cf979) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): Payment collection should provider the region_id, total and id in the partial cart data

- [#3025](https://github.com/medusajs/medusa/pull/3025) [`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): test, build and watch scripts

- Updated dependencies [[`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2)]:
  - medusa-interfaces@1.3.4

## 1.2.7

### Patch Changes

- [`9cf971c6b`](https://github.com/medusajs/medusa/commit/9cf971c6bdcee89098e455f02be5539d963f896f) Thanks [@olivermrbl](https://github.com/olivermrbl)! - feat(medusa-payment-paypal): PaymentCollection support

## 1.2.6

### Patch Changes

- [#2381](https://github.com/medusajs/medusa/pull/2381) [`a908a7716`](https://github.com/medusajs/medusa/commit/a908a7716c94222f340531a5b13db0867b511519) Thanks [@srindom](https://github.com/srindom)! - Rely on cart totals in payment providers

- Updated dependencies [[`7dc8d3a0c`](https://github.com/medusajs/medusa/commit/7dc8d3a0c90ce06e3f11a6a46dec1f9ec3f26e81)]:
  - medusa-core-utils@1.1.32

## 1.2.5

### Patch Changes

- Updated dependencies [[`c97ccd3fb`](https://github.com/medusajs/medusa/commit/c97ccd3fb5dbe796b0e4fbf37def5bb6e8201557)]:
  - medusa-interfaces@1.3.3

## 1.2.4

### Patch Changes

- [#1914](https://github.com/medusajs/medusa/pull/1914) [`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68) Thanks [@fPolic](https://github.com/fPolic)! - Version bump due to missing changesets in merged PRs

- Updated dependencies [[`1dec44287`](https://github.com/medusajs/medusa/commit/1dec44287df5ac69b4c5769b59f9ebef58d3da68), [`b8ddb31f6`](https://github.com/medusajs/medusa/commit/b8ddb31f6fe296a11d2d988276ba8e991c37fa9b)]:
  - medusa-interfaces@1.3.2

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.2.3](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.2.2...medusa-payment-paypal@1.2.3) (2022-07-05)

**Note:** Version bump only for package medusa-payment-paypal

## [1.2.2](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.2.0...medusa-payment-paypal@1.2.2) (2022-06-19)

### Bug Fixes

- **medusa-payment-paypal:** Should not throw when canceling already canceled payment ([#1470](https://github.com/medusajs/medusa/issues/1470)) ([5838793](https://github.com/medusajs/medusa/commit/58387936c9c944e85c4e72144cf81a52d1f0e505))

## [1.2.1](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.2.0...medusa-payment-paypal@1.2.1) (2022-05-31)

### Bug Fixes

- **medusa-payment-paypal:** Should not throw when canceling already canceled payment ([#1470](https://github.com/medusajs/medusa/issues/1470)) ([5838793](https://github.com/medusajs/medusa/commit/58387936c9c944e85c4e72144cf81a52d1f0e505))

# [1.2.0](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.1.1...medusa-payment-paypal@1.2.0) (2022-05-01)

**Note:** Version bump only for package medusa-payment-paypal

## [1.1.1](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.40...medusa-payment-paypal@1.1.1) (2022-02-28)

**Note:** Version bump only for package medusa-payment-paypal

# [1.1.0](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.40...medusa-payment-paypal@1.1.0) (2022-02-25)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.40](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.39...medusa-payment-paypal@1.0.40) (2022-02-06)

### Bug Fixes

- release ([fc3fbc8](https://github.com/medusajs/medusa/commit/fc3fbc897fad5c8a5d3eea828ac7277fba9d70af))

## [1.0.39](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.38...medusa-payment-paypal@1.0.39) (2022-02-06)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.38](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.37...medusa-payment-paypal@1.0.38) (2022-01-11)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.37](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.36...medusa-payment-paypal@1.0.37) (2021-12-29)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.36](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.35...medusa-payment-paypal@1.0.36) (2021-12-17)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.35](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.34...medusa-payment-paypal@1.0.35) (2021-12-08)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.34](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.33...medusa-payment-paypal@1.0.34) (2021-11-23)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.33](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.32...medusa-payment-paypal@1.0.33) (2021-11-22)

### Bug Fixes

- account for lowest currency unit in paypal ([#761](https://github.com/medusajs/medusa/issues/761)) ([b30a2af](https://github.com/medusajs/medusa/commit/b30a2af94de32476d82bbe4727ee7b224d6437fe))

## [1.0.32](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.30...medusa-payment-paypal@1.0.32) (2021-11-19)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.31](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.30...medusa-payment-paypal@1.0.31) (2021-11-19)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.30](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.29...medusa-payment-paypal@1.0.30) (2021-10-18)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.29](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.28...medusa-payment-paypal@1.0.29) (2021-10-18)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.28](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.26...medusa-payment-paypal@1.0.28) (2021-10-18)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.27](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.26...medusa-payment-paypal@1.0.27) (2021-10-18)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.26](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.25...medusa-payment-paypal@1.0.26) (2021-09-15)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.25](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.24...medusa-payment-paypal@1.0.25) (2021-09-14)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.24](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.23...medusa-payment-paypal@1.0.24) (2021-08-05)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.23](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.22...medusa-payment-paypal@1.0.23) (2021-07-26)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.22](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.20...medusa-payment-paypal@1.0.22) (2021-07-15)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.21](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.20...medusa-payment-paypal@1.0.21) (2021-07-15)

### Bug Fixes

- paypal order ([1f6ee0f](https://github.com/medusajs/medusa/commit/1f6ee0fc00024c25d6628e6531097f93f54f8a1b))
- support for hook completion of swap carts ([fca29cc](https://github.com/medusajs/medusa/commit/fca29cc5cc0d6f20d01fada7445d32da85291cd8))

## [1.0.20](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.19...medusa-payment-paypal@1.0.20) (2021-07-02)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.19](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.18...medusa-payment-paypal@1.0.19) (2021-06-22)

### Bug Fixes

- release assist ([668e8a7](https://github.com/medusajs/medusa/commit/668e8a740200847fc2a41c91d2979097f1392532))

## [1.0.18](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.17...medusa-payment-paypal@1.0.18) (2021-06-09)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.17](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.16...medusa-payment-paypal@1.0.17) (2021-06-09)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.16](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.15...medusa-payment-paypal@1.0.16) (2021-06-09)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.15](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.14...medusa-payment-paypal@1.0.15) (2021-06-09)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.14](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.13...medusa-payment-paypal@1.0.14) (2021-06-08)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.13](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.12...medusa-payment-paypal@1.0.13) (2021-04-29)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.12](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.9...medusa-payment-paypal@1.0.12) (2021-04-28)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.11](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.10...medusa-payment-paypal@1.0.11) (2021-04-20)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.10](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.9...medusa-payment-paypal@1.0.10) (2021-04-20)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.9](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.8...medusa-payment-paypal@1.0.9) (2021-04-13)

### Bug Fixes

- merge develop ([a468c45](https://github.com/medusajs/medusa/commit/a468c451e82c68f41b5005a2e480057f6124aaa6))

## [1.0.8](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.7...medusa-payment-paypal@1.0.8) (2021-04-13)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.7](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.6...medusa-payment-paypal@1.0.7) (2021-03-30)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.6](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.5...medusa-payment-paypal@1.0.6) (2021-03-17)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.5](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.3...medusa-payment-paypal@1.0.5) (2021-03-17)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.4](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.3...medusa-payment-paypal@1.0.4) (2021-03-17)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.3](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.2...medusa-payment-paypal@1.0.3) (2021-02-17)

**Note:** Version bump only for package medusa-payment-paypal

## [1.0.2](https://github.com/medusajs/medusa/compare/medusa-payment-paypal@1.0.1...medusa-payment-paypal@1.0.2) (2021-02-09)

**Note:** Version bump only for package medusa-payment-paypal

## 1.0.1 (2021-02-08)

### Features

- adds paypal ([#168](https://github.com/medusajs/medusa/issues/168)) ([#169](https://github.com/medusajs/medusa/issues/169)) ([427ae25](https://github.com/medusajs/medusa/commit/427ae25016bb3a22ebc05aa7b18017132846567c))
