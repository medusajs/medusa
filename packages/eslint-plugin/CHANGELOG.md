# @medusajs/eslint-plugin

## 2.20.2

## 2.20.1

## 2.20.0

### Patch Changes

- [#16517](https://github.com/medusajs/medusa/pull/16517) [`4f657cfc0bed22f5a76344bf5f1acd45eb6fe564`](https://github.com/medusajs/medusa/commit/4f657cfc0bed22f5a76344bf5f1acd45eb6fe564) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(eslint-plugin): add throw in workflow definition eslint rule

- [#16585](https://github.com/medusajs/medusa/pull/16585) [`c17f4d98b72075bef5c1ff83c3ce5ff1950681a9`](https://github.com/medusajs/medusa/commit/c17f4d98b72075bef5c1ff83c3ce5ff1950681a9) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(eslint-plugin): add missing when name eslint rule

- [#16520](https://github.com/medusajs/medusa/pull/16520) [`5bd3ca3092d593bf218da2e47a485a2b6f1844f6`](https://github.com/medusajs/medusa/commit/5bd3ca3092d593bf218da2e47a485a2b6f1844f6) Thanks [@NicolasGorga](https://github.com/NicolasGorga)! - feat(eslint-plugin): no nested when then block eslint rule

## 2.19.0

### Patch Changes

- [`8933ac87c69b6904f890afe6d4c41e542732272e`](undefined) - feat(eslint-plugin): prefer workflow events

## 2.18.0

### Patch Changes

- [`598020c157cec9b9905f7817c3cded4aa44ece94`](undefined) - fix(eslint-plugin): normalize Windows paths in cross-module relationship rule

- [`fdf80069f11c23b6ec458119934251db5e6fce85`](undefined) - feat(eslint-plugin): add a rule for wildcard + specific field selections in query

- [`8df11805fc51f4818647da433021c4fa7f6004f1`](undefined) - Remove the `use-query-context-utility` rule. It required wrapping the entire `query.graph` / `query.index` `context` object with `QueryContext(...)`, but the correct placement is query-specific: pricing queries wrap the `calculated_price` leaf (`context: { variants: { calculated_price: QueryContext(...) } }`), while others (such as shipping options) wrap the whole context. As written, the rule flagged correct pricing code and autofixed it into a runtime error (`Trying to query by not existing property Product.context`), contradicting the official docs and the framework's own usage. Correct placement cannot be determined generically, so the rule is removed. Fixes #15821.

## 2.17.2

### Patch Changes

- [#15683](https://github.com/medusajs/medusa/pull/15683) [`de58ec503bcd82aae3fe576f9a404c36e2525f4c`](https://github.com/medusajs/medusa/commit/de58ec503bcd82aae3fe576f9a404c36e2525f4c) Thanks [@Floofy6](https://github.com/Floofy6)! - chore: add package bugs metadata

## 2.17.1

## 2.17.0

### Patch Changes

- [#15774](https://github.com/medusajs/medusa/pull/15774) [`c352997589d4d41d585df4600e0a6b51e6f320aa`](https://github.com/medusajs/medusa/commit/c352997589d4d41d585df4600e0a6b51e6f320aa) Thanks [@shahednasser](https://github.com/shahednasser)! - fix(eslint-plugin): handle link edge cases

## 2.16.0

### Patch Changes

- [`2db19b271486a05a1bc4d12189ca6035799ed187`](undefined) - fix(eslint-plugin): fixes to avoid false positives

- [`f8578a6f7d34ce9026a3b3d6b0d99c1de3ee231d`](undefined) - feat(eslint-plugin): add Medusa ESLint plugin

- [`f87619c50aad055104acc3babae9592bdc166aa9`](undefined) - fix(eslint-plugin): fix and improve main config

- [`e67e11584a4f6f79ba1a8ddd2c56b48312fcb766`](undefined) - feat(eslint-plugin): add `modules` config preset and support ESLint 8.57+

- [#15719](https://github.com/medusajs/medusa/pull/15719) [`a1fd4d648b923cbd68240dba49f1c46ad0e98f39`](https://github.com/medusajs/medusa/commit/a1fd4d648b923cbd68240dba49f1c46ad0e98f39) Thanks [@shahednasser](https://github.com/shahednasser)! - feat(cli, eslint-plugin, medusa): add linting to medusa CLI
