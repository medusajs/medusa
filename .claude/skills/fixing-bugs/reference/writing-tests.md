# Writing and Running Regression Tests

## Choose the test layer

Pick the lowest layer that reproduces the bug.

| Bug lives in | Test type | Location | Needs DB |
| --- | --- | --- | --- |
| Pure logic in `packages/core/*` (utils, workflows-sdk, orchestration, js-sdk) | Unit | `src/**/__tests__/*.spec.ts` next to the code | No |
| Workflow/step in `core-flows` | Unit if mockable, else HTTP integration | `src/**/__tests__/` or `integration-tests/http/__tests__/` | Maybe |
| Module service / repository / model | Module integration | `packages/modules/<module>/integration-tests/__tests__/` | Yes |
| API route, validator, middleware, query config | HTTP integration | `integration-tests/http/__tests__/<domain>/` | Yes |
| Admin dashboard | Vitest unit | `packages/admin/dashboard/src/**/*.test.ts(x)` | No |

> **CRITICAL:** Add to an existing spec file for the same code when one exists. Read a nearby test first and copy its setup, helpers, and naming.

## Run commands

Run from the package directory, filtered to the test:

```bash
# Unit (Jest)
cd packages/<path> && npx jest <spec-path> -t "<describe or it name>"

# Module integration (needs Postgres)
cd packages/modules/<module> && yarn test:integration <spec-path>

# HTTP integration (needs Postgres; slow, run one file)
cd integration-tests/http && yarn test:integration <spec-path>

# Admin dashboard (Vitest)
cd packages/admin/dashboard && npx vitest --run <spec-path>
```

If a DB-backed layer can't run in the environment, write the test anyway, say so in `pr-body.md` under Testing, and add a unit-level test too if possible.

## Writing the test

- Name `it` for the behavior expected after the fix, e.g. `"should pass the renamed step's own compensate input when the original step was skipped"`.
- Cover the reported scenario **and** the worst sibling case found during validation (e.g. silent wrong data, not just `undefined`).
- Assert on the observable symptom the reporter saw (output, state, error), not on internals.
- Use synthetic data only, never reporter data.
- No comments explaining the bug; that belongs in the PR body.

## Confirm it fails for the right reason

Run the test on the unfixed code and read the failure:

- ✅ Assertion failure whose received value matches the reported symptom.
- ❌ Import/compile error, `TypeError` in setup, timeout, missing fixture, wrong ID → fix the test, re-run.

Record the received vs expected values; they go in the PR body.

## After the fix

1. Re-run the new test(s) → must pass.
2. Run the whole spec file → must pass.
3. Run the package's unit suite (`yarn test` in the package) → must pass.
4. If something else fails, `git stash` and re-run it on the base code. Pre-existing failures are noted in the PR body, not fixed.
