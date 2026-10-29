# @medusajs/eslint-plugin

Official ESLint plugin (flat config) that turns Medusa framework conventions into lint rules for API routes, workflows, modules, data models, links, subscribers, jobs, and admin extensions. It powers `medusa lint` and the lint step of `medusa develop` / `medusa build`, and also lints this monorepo.

## Using this package

```ts
// eslint.config.ts
import { defineConfig } from "eslint/config"
import medusa from "@medusajs/eslint-plugin"

export default defineConfig([...medusa.configs.recommended])
```

- Presets (`src/configs/`):
  - `recommended`: path-scoped rules (`src/api/**`, `src/modules/**`, `src/admin/**`, `src/links/**`, `src/subscribers/*`, `src/jobs/*`, workflows everywhere), no type info needed.
  - `strict`: `recommended` + type-aware rules (sets `parserOptions.project: true`, so a tsconfig must include the linted files) + the cross-file `scheduled-job-name-unique`.
  - `modules`: for a standalone module/provider package (services anywhere, `module-name-snake-case` on `src/index.{ts,js}`, model rules on `**/models/**`).
- Rule ids are `@medusajs/<rule-name>`; override after the preset spread.
- Peer deps: `eslint` `^8.57.0 || ^9.0.0 || ^10.0.0` (v8 needs `ESLINT_USE_FLAT_CONFIG=true` outside the Medusa CLI), `typescript >=4.8.0`. `jiti` is needed to load `eslint.config.ts`.
- Docs: https://docs.medusajs.com/resources/lint.md and per-rule pages at https://docs.medusajs.com/resources/lint/rules.md/<rule-name> (this URL is also emitted as `meta.docs.url` by `src/create-rule.ts`).

## Architecture

- `src/index.ts`: plugin object `{ meta, rules, configs }`; configs are built after the object exists because each preset embeds the plugin itself.
- `src/rules/<rule-name>/{index.ts,rule.ts,__tests__/rule.spec.ts}`; `index.ts` re-exports `rule`. Every rule is registered in `src/rules/index.ts`.
- `src/create-rule.ts`: `createRule` (`ESLintUtils.RuleCreator`) with `MedusaRuleDocs` (`description`, `recommended?`, `strict?`, `requiresTypeChecking?`).
- `src/constants.ts`: `PLUGIN_NAMESPACE` (`@medusajs`), `ruleId()`, import sources rules match on (`@medusajs/framework/utils`, `.../workflows-sdk`, `.../http`, `.../types`, `@medusajs/admin-sdk`), and `MODULES_BY_VALUE`, a hand-copied map of `Modules` enum values from `packages/core/utils/src/modules-sdk/definition.ts`.
- `src/util/`: shared detectors (`api-route.ts`, `workflow-scope.ts`, `service-scope.ts`, `admin-scope.ts`, `middlewares.ts`, `link.ts`, `container.ts`, `filename.ts`, `ast.ts`). Rules gate themselves on filename (e.g. `isUnderApiDir`) in addition to the preset `files` globs, and return `{}` for virtual filenames starting with `<`.
- `src/configs/shared.ts`: `ignoresBlock` (dist, `.medusa`, tests, `integration-tests`, `apps/storefront`, ...), `pluginBlock` (global, no `files`), `tsParserBlock(withProject)`.

## Development

- `yarn build`, `yarn watch`, `yarn test` (jest over `src`).
- Single rule: `../../node_modules/.bin/jest src/rules/<rule-name>` from this directory (`yarn test <path>` ignores the path because the script already sets `--testPathPattern=src`).
- Tests use `createRuleTester()` from `src/test-utils.ts`. Cross-file rules (`scheduled-job-name-unique`, `loader-must-be-exported-in-module-definition`, `use-validated-body-or-query`) need real files: use `createFixtureWorkspace(subPath, files)`, lint with the absolute path from `resolve(rel)`, and `afterAll(cleanupFixtureWorkspaces)`.
- Adding a rule:
  1. `src/rules/<name>/` with `rule.ts`, `index.ts`, `__tests__/rule.spec.ts`
  2. register it in `src/rules/index.ts`
  3. enable it in the right preset block(s) in `src/configs/` with the right `files` scope
  4. add the docs page `www/apps/resources/app/lint/rules/<name>/page.mdx` (the sidebar autogenerates from `lint/rules` in `www/apps/resources/sidebars/tools.mjs`)
- The monorepo dogfoods the plugin: root `.eslintrc.js` requires the built package and `eslint.medusa.cjs` / `yarn lint:medusa` (run in CI) apply only the `@medusajs/*` rules. A new `error` rule can fail CI on existing framework code.

## Gotchas

- Root `.eslintrc.js` and `www` (`link:../packages/eslint-plugin`) load `dist/`, so run `yarn workspace @medusajs/eslint-plugin build` before linting the repo or www after changing a rule (CI does this explicitly).
- Keep the plugin registration block free of `files`; scoping it to TS breaks `.js` files with `Could not find plugin "@medusajs"`.
- Only `strict` may contain rules that need type information; `recommended` and `modules` must stay zero-config.
- `subscribers/*` and `jobs/*` globs intentionally match direct children only (Medusa only loads those); nested files are utilities.
- Admin rules are scoped to `src/admin/**` specifically so they don't hit `src/api/admin/**` server routes.
- Messages that mention `allowFields` quote `ALLOW_FIELDS_MIN_MEDUSA_VERSION` (`2.21.0`) because the plugin and project Medusa versions can differ.
- `README.md` still says the plugin ships no rules; it is stale.
