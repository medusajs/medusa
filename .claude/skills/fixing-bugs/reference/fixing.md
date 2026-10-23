# Applying the Fix

## Fix rules

- **Root cause, not symptom.** Change the line(s) identified in validation. A null-guard that hides wrong data is not a fix.
- **Minimal diff.** No refactors, renames, reformatting, or unrelated cleanups. Match the surrounding code style.
- **Keep public API stable.** If the fix requires a change to an exported type, method, or emitted event, stop and emit `needs-team` explaining the trade-off; don't ship it.
- **No new comments** unless the fixed line would look deletable or wrong to a reader without one (max 3 lines).
- **Related bugs found nearby:** don't fix them; list them in `pr-body.md` under Additional Context.

## Changesets

Every published package whose source changed needs a changeset. Only workspace packages under `packages/` are published; changes elsewhere (e.g. `www/`) take no changeset. Write the file directly:

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
- Keep the description to one short line (under 80 characters), like a commit subject.

## Size and path limits

The downstream step rejects a patch that breaks these, and the issue is escalated to the team instead of getting a PR. Check `git diff --stat` before emitting the result.

- At most **10 files** and **500 changed lines** (added + removed), not counting test files (`__tests__/`, `integration-tests/`, `*.spec.ts`, `*.test.ts`) and `.changeset/`.
- Never touch: any `package.json`, any `migrations/` directory, `.github/`, `.claude/`, `scripts/`, `.husky/`, `.yarn/`, `yarn.lock`, `.env*`, `.mcp.json`. No binary files.
- If the fix can't fit, revert your changes and emit `needs-team` with a `summary` naming what the fix would need (e.g. a migration, a dependency bump, a public API change).

## Generated files

| You changed | Run |
| --- | --- |
| A data model in `packages/modules/<module>/src/models` | Out of scope: it needs a migration. Emit `needs-team`. |
| Keys in `packages/admin/dashboard/src/i18n/translations/en.json` | `cd packages/admin/dashboard && yarn i18n:schema` |

## Store routes

If the fix touches a store API route's fields, keep its `allowed` list in `query-config.ts` explicit (see repo `CLAUDE.md`). Never widen it to fix a bug.

## Before moving on

- [ ] `git status` shows only the fix, tests, changeset, and generated files
- [ ] No throwaway repro files remain
- [ ] Tests re-run per `writing-tests.md` → "After the fix"
