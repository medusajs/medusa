# @medusajs/http-types-generator

## 2.22.2

### Patch Changes

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

- [`b74b5b19569534412a67835ffae8fb3afbf6f5c5`](undefined) - fix(http-types-generator, types): correctly generate types for OperatorMap

## 2.15.5

## 2.15.4

## 2.15.3

## 2.15.2

## 2.15.1

## 2.15.0

## 2.14.2

## 2.14.1

## 2.14.0

### Patch Changes

- [#15017](https://github.com/medusajs/medusa/pull/15017) [`15085e1adb9c50743ca07d2da94f23cc09b6852a`](https://github.com/medusajs/medusa/commit/15085e1adb9c50743ca07d2da94f23cc09b6852a) Thanks [@shahednasser](https://github.com/shahednasser)! - fix: fix http types not matching validators

## 2.13.6

### Patch Changes

- [#14988](https://github.com/medusajs/medusa/pull/14988) [`39240be68bb9935ac6651f1cae962e4ebf0b613b`](https://github.com/medusajs/medusa/commit/39240be68bb9935ac6651f1cae962e4ebf0b613b) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(http-types-generator): added HTTP types generator package

- [#15005](https://github.com/medusajs/medusa/pull/15005) [`2b0cd5ff0ce00bf1de1d99632f1bda4073ac035d`](https://github.com/medusajs/medusa/commit/2b0cd5ff0ce00bf1de1d99632f1bda4073ac035d) Thanks [@shahednasser](https://github.com/shahednasser)! - chore: update glob version
