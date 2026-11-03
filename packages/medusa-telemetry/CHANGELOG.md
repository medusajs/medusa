# Change Log

## 2.22.2

### Patch Changes

- [#17527](https://github.com/medusajs/medusa/pull/17527) [`9d55082`](https://github.com/medusajs/medusa/commit/9d55082bf9706e45b148100808f4d4550b9105bc) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(telemetry,test-utils): require axios ^1.20.0 for security fixes

- [#17528](https://github.com/medusajs/medusa/pull/17528) [`6d38bc8`](https://github.com/medusajs/medusa/commit/6d38bc8773d8db0b928872f6376c3ee9196970ae) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(dashboard,telemetry,draft-order): update @babel/runtime to ^7.29.10

- [#17567](https://github.com/medusajs/medusa/pull/17567) [`52caddd`](https://github.com/medusajs/medusa/commit/52cadddcf34fdbbc70be34aecd036d6885e8fa5d) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(deps): update development and test tooling (cross-env 10.1.0, esbuild 0.28.2, tsup 9.0.0, expect-type 1.4.0, @faker-js/faker 10.6.0, jsdom 30.1.3, @types/jsonwebtoken 9.0.10, msw 3.0.3, rimraf 6.1.3, Testing Library, turbo 2.11.10, @types/node 22, boxen 9.0.0, chalk 6.0.1, ci-info 4.4.0, commander 15.0.0, configstore 8.0.0, dotenv 18.0.9, execa 10.2.1, get-port 7.2.0, inquirer 14.2.4, @inquirer/checkbox 5.2.7, @inquirer/confirm 6.3.4, @inquirer/input 5.1.8, is-docker 4.0.0, meant 2.0.1, open 11.0.4, openapi3-ts 4.6.2, ora 9.4.1, @readme/openapi-parser 10.0.0, @redocly/cli 2.71.0, stack-trace 1.0.0, swagger-inline 8.1.0, yargs 18.2.0) and remove unused development dependencies; drop hosted-git-info from @medusajs/cli; fix the medusa-oas-cli circular patch recommendation crashing on references nested in inline schemas; `medusa-oas docs --preview` now serves a static Redoc 3 build since Redocly removed `preview-docs`; replace chalk with Node's built-in `util.styleText` in CommonJS packages; replace uuid with Node's built-in `crypto.randomUUID`; replace get-port with a built-in free-port helper in @medusajs/test-utils

## 2.22.1

## 2.22.0

### Patch Changes

- [#17382](https://github.com/medusajs/medusa/pull/17382) [`1db74006ede40300afe64970024688a1a9c2a936`](https://github.com/medusajs/medusa/commit/1db74006ede40300afe64970024688a1a9c2a936) Thanks [@shahednasser](https://github.com/shahednasser)! - chore: ship AGENTS.md in published packages and add agent discovery fields to package.json

## 2.21.2

## 2.21.1

## 2.21.0

## 2.20.1

## 2.20.0

## 2.19.0

## 2.18.0

## 2.17.2

### Patch Changes

- [#15683](https://github.com/medusajs/medusa/pull/15683) [`de58ec503bcd82aae3fe576f9a404c36e2525f4c`](https://github.com/medusajs/medusa/commit/de58ec503bcd82aae3fe576f9a404c36e2525f4c) Thanks [@Floofy6](https://github.com/Floofy6)! - chore: add package bugs metadata

## 2.17.1

## 2.17.0

## 2.16.0

### Patch Changes

- [#15630](https://github.com/medusajs/medusa/pull/15630) [`740132b7576d937b82e913c1ccf4cfabe56777d6`](https://github.com/medusajs/medusa/commit/740132b7576d937b82e913c1ccf4cfabe56777d6) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(create-medusa-app, telemetry, dashboard, medusa): update react-router-dom and uuid packages

## 2.15.5

## 2.15.4

## 2.15.3

## 2.15.2

## 2.15.1

## 2.15.0

## 2.14.2

## 2.14.1

## 2.14.0

## 2.13.6

## 2.13.5

## 2.13.4

## 2.13.3

## 2.13.2

## 2.13.1

## 2.13.0

### Minor Changes

- [`a31e72c31c5235240cead2d04e39e5927688eec7`](https://github.com/medusajs/medusa/commit/a31e72c31c5235240cead2d04e39e5927688eec7) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Minor bump

## 2.12.6

## 2.12.5

## 2.12.4

## 2.12.3

## 2.12.2

## 2.12.1

## 2.12.0

### Patch Changes

- [#14042](https://github.com/medusajs/medusa/pull/14042) [`c2c3ad5ba53f1959422fb2d37297a8de8d714782`](https://github.com/medusajs/medusa/commit/c2c3ad5ba53f1959422fb2d37297a8de8d714782) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Upgrade vit to non vulnerable one

## 2.11.3

### Patch Changes

- [#13910](https://github.com/medusajs/medusa/pull/13910) [`224ab39a81e8d3cf3d6fa3ff5eee82541f64728d`](https://github.com/medusajs/medusa/commit/224ab39a81e8d3cf3d6fa3ff5eee82541f64728d) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Dependencies cleanup and improvements

- [#13932](https://github.com/medusajs/medusa/pull/13932) [`37563987b8fe75c9acfe62957a33e8398977647a`](https://github.com/medusajs/medusa/commit/37563987b8fe75c9acfe62957a33e8398977647a) Thanks [@adrien2p](https://github.com/adrien2p)! - chore(): Fix dependencies vulnerabilities

## 2.11.2

## 2.11.1

## 2.11.0

## 2.10.3

## 2.10.2

## 2.10.1

## 2.10.0

## 2.9.0

## 2.8.8

## 2.8.7

## 2.8.6

## 2.8.5

## 2.8.4

## 2.8.3

## 2.8.2

## 2.8.1

## 2.8.0

## 2.7.1

## 2.7.0

## 2.6.1

## 2.6.0

## 2.5.1

## 2.5.0

## 2.4.0

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

## 2.0.4

## 2.0.3

## 2.0.2

### Patch Changes

- [#9939](https://github.com/medusajs/medusa/pull/9939) [`de228d209f30dfbb5b500d5cb49932b63e06f52a`](https://github.com/medusajs/medusa/commit/de228d209f30dfbb5b500d5cb49932b63e06f52a) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(telemetry): Pointing and resolving packages wrongly

## 2.0.1

## 2.0.0

### Major Changes

- [#7341](https://github.com/medusajs/medusa/pull/7341) [`2e42e053d4c9d5445d227bdc268c66713aad8e2e`](https://github.com/medusajs/medusa/commit/2e42e053d4c9d5445d227bdc268c66713aad8e2e) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Medusa 2.0

## 0.0.17

### Patch Changes

- [#4817](https://github.com/medusajs/medusa/pull/4817) [`c58588904`](https://github.com/medusajs/medusa/commit/c58588904c5631111603b15afacf7cdc4c738cc4) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(medusa-telemetry): added missing babel dependencies

## 0.0.16

### Patch Changes

- [#3025](https://github.com/medusajs/medusa/pull/3025) [`93d0dc1bd`](https://github.com/medusajs/medusa/commit/93d0dc1bdcb54cf6e87428a7bb9b0dac196b4de2) Thanks [@adrien2p](https://github.com/adrien2p)! - fix(medusa): test, build and watch scripts

## 0.0.15

### Patch Changes

- [#2590](https://github.com/medusajs/medusa/pull/2590) [`a76762418`](https://github.com/medusajs/medusa/commit/a76762418877e675977540dc95e095492873af44) Thanks [@fPolic](https://github.com/fPolic)! - Add missing changeset

## 0.0.14

### Patch Changes

- [#2574](https://github.com/medusajs/medusa/pull/2574) [`cfb24d72f`](https://github.com/medusajs/medusa/commit/cfb24d72fa303a6755e8579c46d3c7f36278b120) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Fix incorrect import

## 0.0.13

### Patch Changes

- [#2017](https://github.com/medusajs/medusa/pull/2017) [`900260c5b`](https://github.com/medusajs/medusa/commit/900260c5b9df4f4f927db5bb6921e5e139ff269a) Thanks [@olivermrbl](https://github.com/olivermrbl)! - Adds enabled features flags to tracking event in `medusa-telemetry`

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.0.11](https://github.com/medusajs/medusa/compare/medusa-telemetry@0.0.10...medusa-telemetry@0.0.11) (2021-12-08)

### Features

- medusa-source-shopify loader ([#563](https://github.com/medusajs/medusa/issues/563)) ([577bcc2](https://github.com/medusajs/medusa/commit/577bcc23d44c87b91b2b685fd4ddfc5d21a0aa47))

## [0.0.10](https://github.com/medusajs/medusa/compare/medusa-telemetry@0.0.9...medusa-telemetry@0.0.10) (2021-11-11)

**Note:** Version bump only for package medusa-telemetry

## [0.0.9](https://github.com/medusajs/medusa/compare/medusa-telemetry@0.0.8...medusa-telemetry@0.0.9) (2021-10-18)

**Note:** Version bump only for package medusa-telemetry

## [0.0.8](https://github.com/medusajs/medusa/compare/medusa-telemetry@0.0.7...medusa-telemetry@0.0.8) (2021-10-18)

**Note:** Version bump only for package medusa-telemetry

## [0.0.7](https://github.com/medusajs/medusa/compare/medusa-telemetry@0.0.5...medusa-telemetry@0.0.7) (2021-10-18)

**Note:** Version bump only for package medusa-telemetry

## [0.0.6](https://github.com/medusajs/medusa/compare/medusa-telemetry@0.0.5...medusa-telemetry@0.0.6) (2021-10-18)

**Note:** Version bump only for package medusa-telemetry

## [0.0.5](https://github.com/medusajs/medusa/compare/medusa-telemetry@0.0.4...medusa-telemetry@0.0.5) (2021-09-15)

**Note:** Version bump only for package medusa-telemetry

## [0.0.4](https://github.com/medusajs/medusa/compare/medusa-telemetry@0.0.3...medusa-telemetry@0.0.4) (2021-09-14)

### Bug Fixes

- make shipping_option_id on requirements optional ([#340](https://github.com/medusajs/medusa/issues/340)) ([16b0fa3](https://github.com/medusajs/medusa/commit/16b0fa377a577abd7976c2beaff83e2030969df8))

### Features

- update and cancel swaps, claims, and returns ([#310](https://github.com/medusajs/medusa/issues/310)) ([cf66f97](https://github.com/medusajs/medusa/commit/cf66f97758003a41737602d4b1b1051b266d4f81))

## [0.0.3](https://github.com/medusajs/medusa/compare/medusa-telemetry@0.0.2...medusa-telemetry@0.0.3) (2021-08-17)

**Note:** Version bump only for package medusa-telemetry

## 0.0.2 (2021-08-05)

### Bug Fixes

- canary assist ([b988b67](https://github.com/medusajs/medusa/commit/b988b67118553c88ef6c6d53ae99ef1ad9d67305))
- ci detection ([9475ed7](https://github.com/medusajs/medusa/commit/9475ed7689508cf8bda166ac8d7ccda544e76e2f))
- deps ([c8d8fa2](https://github.com/medusajs/medusa/commit/c8d8fa28ca928f4f065b7d6d00d0152cfe9f727c))

### Features

- medusa-telemetry ([#328](https://github.com/medusajs/medusa/issues/328)) ([cfe19f7](https://github.com/medusajs/medusa/commit/cfe19f7f9d3bb17425348362b148a0b4b7a649ef))
