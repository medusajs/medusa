# Contribution Type Verification

## Code Contributions

**Checklist:**

- [ ] There is a linked issue (via closing keyword) unless it's a trivial fix (typo, obvious one-liner)
- [ ] The linked issue is real, open (or was open), and describes the same problem
- [ ] Reproducible steps are clear — either from the PR description or the linked issue
- [ ] Tests are included (unit or integration, appropriate to the scope of the change)
- [ ] Follows `CONTRIBUTING.md` — specifically: change is scoped, starts from `develop`, linked issue exists
- [ ] Follows conventions in `conventions.md`

**Key convention checks for code PRs:**
- API route changes → integration tests in `integration-tests/http/__tests__/`
- Request body accepted → Zod schema present
- Zod schema changed → HTTP types updated
- Route handlers have typed generic arguments using HTTP types
- Naming: snake_case properties, camelCase variables, kebab-case files
- Private/protected properties suffixed with `_`

---

## Docs Contributions

**What counts as a docs contribution:**
- MDX files under `www/apps/` (book, resources, ui, user-guide, cloud, api-reference)
- Changes to shared docs components or tooling under `www/packages/`

**Checklist:**

- [ ] Follows the guidelines in `.claude/skills/writing-docs/SKILL.md` and its reference files — load them to verify
- [ ] MDX files have the required `export const metadata` with a `title` field
- [ ] No direct edits to auto-generated directories: `resources/references/`, `specs/components/`, `api-reference/specs` (these are generated — changes there won't persist)
- [ ] No items tagged `@ignore` are documented
- [ ] Cross-project links use the correct syntax (e.g., `!resources!`, `!api!`, `!ui!`) — not hardcoded URLs
- [ ] If adding a new page, a corresponding sidebar entry exists
- [ ] Prose does not use first-person pronouns
- [ ] **Components under `www/packages/docs-ui/` must include tests** — check for a `__tests__/` directory or `.spec.tsx` / `.test.tsx` alongside the component

---

## Admin Translation Contributions

**What counts as a translation contribution:**
- JSON files under `packages/admin/dashboard/src/i18n/translations/`

**Checklist:**

- [ ] Follows `www/apps/book/app/learn/resources/contribution-guidelines/admin-translations/page.mdx`
- [ ] New language: file is named with the ISO-2 code (e.g., `da.json`) and was copied from `en.json`
- [ ] Existing language: only translates existing keys — does not add, rename, or remove keys
- [ ] No code changes included (only JSON translation files should be modified)
- [ ] Translation values are actual translations, not copies of the English text
