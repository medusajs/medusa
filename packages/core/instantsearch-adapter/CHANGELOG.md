# @medusajs/instantsearch-adapter

## 2.22.2

### Patch Changes

- [#17567](https://github.com/medusajs/medusa/pull/17567) [`52caddd`](https://github.com/medusajs/medusa/commit/52cadddcf34fdbbc70be34aecd036d6885e8fa5d) Thanks [@shahednasser](https://github.com/shahednasser)! - chore(deps): update development and test tooling (cross-env 10.1.0, esbuild 0.28.2, tsup 9.0.0, expect-type 1.4.0, @faker-js/faker 10.6.0, jsdom 30.1.3, @types/jsonwebtoken 9.0.10, msw 3.0.3, rimraf 6.1.3, Testing Library, turbo 2.11.10, @types/node 22, boxen 9.0.0, chalk 6.0.1, ci-info 4.4.0, commander 15.0.0, configstore 8.0.0, dotenv 18.0.9, execa 10.2.1, get-port 7.2.0, inquirer 14.2.4, @inquirer/checkbox 5.2.7, @inquirer/confirm 6.3.4, @inquirer/input 5.1.8, is-docker 4.0.0, meant 2.0.1, open 11.0.4, openapi3-ts 4.6.2, ora 9.4.1, @readme/openapi-parser 10.0.0, @redocly/cli 2.71.0, stack-trace 1.0.0, swagger-inline 8.1.0, yargs 18.2.0) and remove unused development dependencies; drop hosted-git-info from @medusajs/cli; fix the medusa-oas-cli circular patch recommendation crashing on references nested in inline schemas; `medusa-oas docs --preview` now serves a static Redoc 3 build since Redocly removed `preview-docs`; replace chalk with Node's built-in `util.styleText` in CommonJS packages; replace uuid with Node's built-in `crypto.randomUUID`; replace get-port with a built-in free-port helper in @medusajs/test-utils

## 2.22.1

## 2.22.0

### Minor Changes

- [#17089](https://github.com/medusajs/medusa/pull/17089) [`d249d29ddef76d0bde0b68899b9fe5f9faa1ef6a`](https://github.com/medusajs/medusa/commit/d249d29ddef76d0bde0b68899b9fe5f9faa1ef6a) Thanks [@shahednasser](https://github.com/shahednasser)! - chore: drop Node.js 20 support and require Node.js v22.22.0 or later

### Patch Changes

- [#17382](https://github.com/medusajs/medusa/pull/17382) [`1db74006ede40300afe64970024688a1a9c2a936`](https://github.com/medusajs/medusa/commit/1db74006ede40300afe64970024688a1a9c2a936) Thanks [@shahednasser](https://github.com/shahednasser)! - chore: ship AGENTS.md in published packages and add agent discovery fields to package.json

## 2.21.2

## 2.21.1

## 2.21.0

## 2.20.1

## 2.20.0

### Patch Changes

- [`9b687b4b15a8c65365480c825312a39c78f817b5`](undefined) - Add instantsearch adapter for medusa
