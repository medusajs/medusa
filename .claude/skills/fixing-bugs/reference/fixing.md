# Applying the Fix

## Fix rules

- **Root cause, not symptom.** Change the line(s) identified in validation. A null-guard that hides wrong data is not a fix.
- **Minimal diff.** No refactors, renames, reformatting, or unrelated cleanups. Match the surrounding code style.
- **Keep public API stable.** If the fix requires a breaking change to an exported type or method, stop and emit `needs-info` explaining the trade-off; don't ship it.
- **No new comments** unless the fixed line would look deletable or wrong to a reader without one (max 3 lines).
- **Related bugs found nearby:** don't fix them; list them in `pr-body.md` under Additional Context.

## Changesets

Every published package whose source changed needs a changeset. Write the file directly:

```md
---
"@medusajs/<package>": patch
---

fix(<package-short-name>): <what was fixed, user-facing wording>
```

- Path: `.changeset/<kebab-case-description>.md`
- Always `patch` for bug fixes. Never `major`. `minor` only for breaking changes (which this skill should not ship).
- Package name comes from the changed package's `package.json` `name`.
- Test-only changes don't need a changeset.

## Generated files

| You changed | Run |
| --- | --- |
| A data model in `packages/modules/<module>/src/models` | `cd packages/modules/<module> && yarn migration:create` (never hand-write or edit migrations) |
| Keys in `packages/admin/dashboard/src/i18n/translations/en.json` | `cd packages/admin/dashboard && yarn i18n:schema` |

## Store routes

If the fix touches a store API route's fields, keep its `allowed` list in `query-config.ts` explicit (see repo `CLAUDE.md`). Never widen it to fix a bug.

## Before moving on

- [ ] `git status` shows only the fix, tests, changeset, and generated files
- [ ] No throwaway repro files remain
- [ ] Tests re-run per `writing-tests.md` → "After the fix"
