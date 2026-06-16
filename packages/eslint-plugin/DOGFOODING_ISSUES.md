# Dogfooding Issues

Issues found while running `@medusajs/eslint-plugin` against the Medusa monorepo. These are bugs/false positives/false negatives in the plugin itself to be fixed, distinct from real violations in the codebase.

## Format

Each entry records the affected rule, the kind of problem, a concrete reproduction, the root cause (if known), and a suggested fix.

---

## 1. `link-no-cross-module-relationship` flags aliased in-module imports (`@models`)

- **Rule:** `link-no-cross-module-relationship`
- **Kind:** False positive
- **Status:** Fixed

### Symptom

The rule reports a `crossModuleRelationship` error for a relationship target that is actually defined in the same module, when the target is imported via a TypeScript path alias such as `@models` instead of a relative path.

### Reproduction

`packages/modules/tax/src/models/tax-provider.ts`:

```ts
import { model } from "@medusajs/framework/utils"
import { TaxRegion } from "@models"

const TaxProvider = model.define("TaxProvider", {
  id: model.id().primaryKey(),
  is_enabled: model.boolean().default(true),
  regions: model.hasMany(() => TaxRegion, {
    mappedBy: "provider",
  }),
})

export default TaxProvider
```

`TaxRegion` lives inside the same `tax` module (`@models` is a per-module tsconfig path alias pointing at the module's own `src/models`), so this is a valid in-module relationship. The rule incorrectly flags it as cross-module.

### Root cause

In `src/rules/link-no-cross-module-relationship/rule.ts`, the in-module check only treats relative imports as staying within the module:

```ts
function isRelativeImport(source: string): boolean {
  return source.startsWith("./") || source.startsWith("../") || source === "."
}
```

The target identifier (`TaxRegion`) resolves to an import from `@models`. Since `@models` is not a relative path, `isRelativeImport` returns `false`, the in-module branch is skipped, and the rule falls through to reporting `crossModuleRelationship`. Path aliases that resolve within the same module (`@models`, `@services`, `@types`, etc.) are not recognized as in-module.

### Fix (implemented)

Rather than hardcode a list of alias names, the rule now resolves non-relative imports through the **nearest tsconfig's `compilerOptions.paths`** (read with `ts.readConfigFile` — plain config reading, no type-aware linting required) and applies the same module-containment check used for relative imports. An import is in-module only when its alias resolves to a path inside the module root, so:

- Any alias name a project configures works (not just `@models`), and
- An alias that resolves *outside* the module is still correctly flagged.

Real packages (`@medusajs/customer`, deep `dist` imports) don't match a `paths` pattern, so they remain flagged. tsconfig reads are cached per file/run, and the work only happens for relationship targets imported via a non-relative specifier.

---

## 2. Plugin lints test fixtures and other test files

- **Rule:** All / config-level (file selection)
- **Kind:** False positive (wrong files linted)
- **Status:** Fixed

### Symptom

The plugin picks up and reports on test/fixture files that are not real Medusa source — e.g. config files used only to bootstrap integration tests.

### Reproduction

`packages/modules/index/integration-tests/__fixtures__/medusa-config.js` is a fixture config used to set up the index module's integration tests. It is not an application's `medusa-config`, yet the plugin treats it as one (and applies source-targeting rules to it).

### Root cause

The configs/rules don't exclude test scaffolding directories such as `__fixtures__`, `__tests__`, `__mocks__`, and `integration-tests`. File-name/location heuristics (e.g. matching `medusa-config.*`) match these fixtures the same as real project files.

### Suggested fix

Exclude test scaffolding paths from the plugin's file selection — ignore files under `__tests__/`, `__fixtures__/`, `__mocks__/`, and `integration-tests/` (and likely `*.spec.*` / `*.test.*`) in the shipped configs, and/or guard location-based rules so they don't match files inside those directories.

---

## 3. `admin-no-medusa-utils-import` is missing from the recommended preset

- **Rule:** `admin-no-medusa-utils-import`
- **Kind:** Missing rule wiring (rule never runs)
- **Status:** Fixed

### Symptom

The `admin-no-medusa-utils-import` rule exists as a rule implementation (`src/rules/admin-no-medusa-utils-import/`) but is never enabled, so it produces no diagnostics during dogfooding.

### Root cause

The rule is not referenced in `src/configs/recommended.ts` (nor in any other shipped config), so it is never turned on for consuming projects. It is also not imported/registered in `src/rules/index.ts`, meaning the rule is not even exposed under the plugin's `rules` map for users to enable manually.

### Suggested fix

- Register the rule in `src/rules/index.ts` so it is exported in the plugin's `rules` map.
- Add it to the recommended preset under the admin-dashboard file group (`src/admin/**`, `**/src/admin/**`), alongside the other admin rules such as `admin-env-vars-import-meta`, with an appropriate severity.

---

## 4. `import-from-framework-not-internal` is missing from the recommended preset

- **Rule:** `import-from-framework-not-internal`
- **Kind:** Missing rule wiring (rule never runs)
- **Status:** Fixed

### Symptom

The `import-from-framework-not-internal` rule exists as a rule implementation (`src/rules/import-from-framework-not-internal/`) but is never enabled, so it produces no diagnostics during dogfooding.

### Root cause

The rule is not referenced in `src/configs/recommended.ts` (nor in any other shipped config), so it is never turned on for consuming projects. It is also not imported/registered in `src/rules/index.ts`, meaning the rule is not exposed under the plugin's `rules` map for users to enable manually.

This rule discourages importing from deprecated standalone packages (`@medusajs/utils`, `@medusajs/types`, `@medusajs/workflows-sdk`, `@medusajs/modules-sdk`, `@medusajs/orchestration`) and from compiled `dist` build output, in favor of the supported `@medusajs/framework/*` entry points — a general import convention that applies across the whole project, not a directory-scoped concern.

### Suggested fix

- Register the rule in `src/rules/index.ts` so it is exported in the plugin's `rules` map.
- Add it to the recommended preset in the global file group (`**/*.{ts,js}`), since it applies to all source files rather than a specific directory, with an appropriate severity.

---

## 5. `no-mikroorm-direct-import` is missing from the recommended preset

- **Rule:** `no-mikroorm-direct-import`
- **Kind:** Missing rule wiring (rule never runs)
- **Status:** Fixed

### Symptom

The `no-mikroorm-direct-import` rule exists as a rule implementation (`src/rules/no-mikroorm-direct-import/`) but is never enabled, so it produces no diagnostics during dogfooding.

### Root cause

The rule is not referenced in `src/configs/recommended.ts` (nor in any other shipped config), so it is never turned on for consuming projects. It is also not imported/registered in `src/rules/index.ts`, meaning the rule is not exposed under the plugin's `rules` map for users to enable manually.

This rule discourages importing directly from `@mikro-orm/*` subpackages (and `awilix`) in favor of the framework re-exports (`@medusajs/framework/mikro-orm/<sub>`, `@medusajs/framework/awilix`) — a general import convention that applies across the whole project, not a directory-scoped concern.

### Suggested fix

- Register the rule in `src/rules/index.ts` so it is exported in the plugin's `rules` map.
- Add it to the recommended preset in the global file group (`**/*.{ts,js}`), since it applies to all source files rather than a specific directory, with an appropriate severity.

---

## 6. `use-medusa-error-not-generic-error` is missing from the recommended preset

- **Rule:** `use-medusa-error-not-generic-error`
- **Kind:** Missing rule wiring (rule never runs)
- **Status:** Fixed

### Symptom

The `use-medusa-error-not-generic-error` rule exists as a rule implementation (`src/rules/use-medusa-error-not-generic-error/`) but is never enabled, so it produces no diagnostics during dogfooding.

### Root cause

The rule is not referenced in `src/configs/recommended.ts` (nor in any other shipped config), so it is never turned on for consuming projects. It is also not imported/registered in `src/rules/index.ts`, meaning the rule is not exposed under the plugin's `rules` map for users to enable manually.

This rule discourages throwing built-in JavaScript errors (`Error`, `TypeError`, etc.) in favor of `MedusaError`, so errors carry the structured `type` Medusa relies on to map to HTTP statuses — a general convention that applies across the whole project, not a directory-scoped concern.

### Suggested fix

- Register the rule in `src/rules/index.ts` so it is exported in the plugin's `rules` map.
- Add it to the recommended preset in the global file group (`**/*.{ts,js}`), since it applies to all source files rather than a specific directory, with an appropriate severity.

---

## 7. `step-must-return-step-response` flags `StepResponse.skip()`

- **Rule:** `step-must-return-step-response`
- **Kind:** False positive
- **Status:** Fixed

### Symptom

The rule reports `missingStepResponse` for a step callback that returns `StepResponse.skip()`, even though that is a valid step return.

### Reproduction

`packages/core/workflows-sdk/src/utils/composer/create-step.ts` (and the locking steps in `packages/core/core-flows/src/locking/steps/`):

```ts
createStep("s", (input) => {
  return StepResponse.skip()
})
```

`StepResponse.skip()` is a static factory (`StepResponse.skip(): SkipStepResponse`) used to short-circuit a step. The rule only accepted `new StepResponse(...)`, so the bare static-call form was wrongly flagged (and the autofix would have nonsensically wrapped it as `new StepResponse(StepResponse.skip())`).

### Fix (implemented)

The rule now also accepts a return whose argument is a call to `<StepResponse>.skip()` — a non-computed member call on a bound `StepResponse` identifier (alias-aware) with property name `skip`. Other static calls on `StepResponse` (e.g. `StepResponse.from(...)`) remain flagged, and the `new StepResponse(...)` handling is unchanged.

---

## Audit: all orphaned rules

A full audit of `src/rules/*/` against `src/rules/index.ts` and `src/configs/` found exactly **4** rules that are implemented but never imported/registered (and therefore also absent from every config). All other 64 registered rules are referenced by a config. The 4 orphaned rules are documented above:

1. `admin-no-medusa-utils-import` (issue #3)
2. `import-from-framework-not-internal` (issue #4)
3. `no-mikroorm-direct-import` (issue #5)
4. `use-medusa-error-not-generic-error` (issue #6)
