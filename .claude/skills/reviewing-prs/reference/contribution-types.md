# Contribution Type Verification

## Code Contributions

**Checklist:**

- [ ] The linked issue describes the same problem the diff solves (its presence and the author's assignment are enforced by `pr-guardrails.yml`; don't re-check them)
- [ ] Reproducible steps are clear — either from the PR description or the linked issue
- [ ] Tests are included (unit or integration, appropriate to the scope of the change)
- [ ] Follows `CONTRIBUTING.md` — specifically: change is scoped and starts from `develop`
- [ ] Follows conventions in `conventions.md`
- [ ] **Changeset included** — any change to source code under `packages/` must include a changeset file under `.changeset/`. Exception: TSDoc-only changes (adding/updating JSDoc comments with no logic change) do not require a changeset. Contributors can generate one with `yarn changeset`. The changeset bump type must be:
  - `patch` for non-breaking changes (bug fixes, additions that don't break existing behaviour)
  - `minor` for breaking changes (removed exports, changed signatures, altered behaviour)
- [ ] **Changeset message format** — the message in the changeset file must follow one of:
  - `fix(package-name1, package-name2): short description` — for bug fixes
  - `feat(package-name): short description` — for new features
  - `chore(package-name): short description` — for everything else

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
- A **new** locale JSON file under `packages/admin/dashboard/src/i18n/translations/`

Existing locale files are kept in sync with `en.json` by `admin-i18n-sync.yml`.
A PR that only changes translation files and modifies, renames, or removes
an existing locale file (anything other than `en.json` and `$schema.json`)
is closed by `pr-guardrails.yml` before it reaches you. Locale edits that
come with dashboard code changes (e.g. translating new keys a feature adds)
are fine: review them as part of the change.

A new locale is a normal contribution: it needs a linked issue the author
is assigned to (enforced by the guardrails) and goes through this checklist.
Translating with AI tools is fine.

**Checklist:**

- [ ] Follows `www/apps/book/app/learn/resources/contribution-guidelines/admin-translations/page.mdx`
- [ ] File is named with the locale code used by the existing files (e.g., `da.json`, `ptBR.json`) and has the same keys as `en.json`
- [ ] The new language is registered wherever the existing ones are (e.g., `translations/index.ts`), following the guide above
- [ ] No unrelated code changes included
- [ ] Translation values are actual translations, not copies of the English text
