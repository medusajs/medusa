---
name: semver-versioning
description: Decision framework for npm package version bumps (MAJOR.MINOR.PATCH). Use when bumping any package.json version, deciding what to release, or writing changelog. Triggers on bump, release, version, publish, changelog, semver.
allowed-tools: Read, Edit, Bash, Grep, Glob
---

# SemVer Versioning Decision Framework

ultrathink

> "Сила в бэкапах... и в правильной версии." — Valera on release discipline.
> "Измерять продуктивность строчками кода — как оценивать самолёт по весу." — Don't bump because you shipped lines; bump because of user impact.

## Core Rule

`MAJOR.MINOR.PATCH` = `сломал.добавил.починил`

Decision criterion: **"After `npm update`, does the user need to change anything?"**

- YES, code breaks silently → **MAJOR**
- YES, they got new capabilities but old code still works → **MINOR**
- NO, it just got better in the same shape → **PATCH**

Never bump by "what I did." Bump by **what the consumer experiences**.

---

## Bump Decision Table

| Bump | When | Examples |
|------|------|----------|
| **PATCH** `x.y.Z` | Bugfix, no behavior change for valid inputs | Fix crash on missing dir; typo in CLI output; fix internal types without changing public types; security patch with no API change |
| **MINOR** `x.Y.0` | Additive, backwards-compatible | New command/flag (optional); new export; new supported platform; deprecation warnings (without removal) |
| **MAJOR** `X.0.0` | **Breaking change** — consumer must migrate | Rename/remove command or flag; change output format; raise engine minimum (e.g. Node 20→22); remove export; change default behavior; rename `bin` entry |

---

## `0.x.y` Zone (Pre-1.0) — Special Rules

SemVer spec: *"Anything MAY change at any time. Public API should not be considered stable."*

npm enforces this: `^0.1.2` resolves to `0.1.x` only, **not** `0.2.x`. So in the 0-zone:

| What you did | Bump |
|--------------|------|
| Bugfix | **PATCH** — `0.1.2 → 0.1.3` |
| New feature (additive) | **MINOR** — `0.1.2 → 0.2.0` |
| Breaking change | **MINOR** — `0.1.2 → 0.2.0` (de facto major in 0.x) |
| API finally stable, ready to commit | **MAJOR** — `0.x.y → 1.0.0` |

**Going to 1.0.0 is a public promise** — "I will now follow strict SemVer." Don't do it until you're ready to stop breaking users silently.

---

## Conventional Commits → Bump Mapping

If using `semantic-release` / `standard-version` / manual:

| Commit prefix | Bump (post-1.0) | Bump (0.x zone) |
|---------------|-----------------|-----------------|
| `fix:` | PATCH | PATCH |
| `feat:` | MINOR | MINOR |
| `feat!:` or `BREAKING CHANGE:` footer | MAJOR | MINOR |
| `perf:` | PATCH | PATCH |
| `refactor:` / `style:` / `test:` | **none** | **none** |
| `docs:` / `chore:` / `ci:` / `build:` | **none** | **none** |
| `revert:` | depends on what's reverted | same |

**Anti-pattern**: `chore(deps): bump cli version` — `chore` changes nothing user-visible but you're bumping. Either the bump has a reason (use `feat:`/`fix:`), or you shouldn't bump at all.

See [commit conventions](../../../.github/instructions/coding/git/copilot-instructions.md) for full list.

---

## What Triggers a Bump vs. What Doesn't

### Triggers a bump

- Public CLI commands/flags/output
- Public exports (`exports` field, `bin`, `main`, `types`)
- Runtime `dependencies` upgrades (may leak breaking changes)
- `engines.node` minimum
- Behavior of documented defaults
- Removal of deprecation warnings that were already there (→ MAJOR — the removal is the break)

### Does NOT trigger a bump

- `devDependencies` updates (vitest, tsc, eslint)
- Internal refactor, file rename inside `src/`
- New tests
- CI config (`.github/workflows/`)
- Docs-only changes
- Build tooling that doesn't change output shape
- Comments, formatting

**Rule**: if `npm pack` contents are byte-identical for the consumer, there's nothing to bump.

---

## Pre-release Tags

When preparing a breaking change but not ready to cut it:

```
0.2.0-alpha.0   → early experiments
0.2.0-beta.1    → feature-complete, testing
0.2.0-rc.1      → release candidate
0.2.0           → stable
```

Publish with `npm publish --tag next` (or `--tag beta`). Users on default `@latest` won't auto-receive it; they must `npm i pkg@next` explicitly.

---

## Workflow: The Bump Itself

**Use `npm version`, not manual edit.** It updates `package.json`, `package-lock.json`, creates a commit AND a tag in one atomic operation.

```bash
cd packages/cli

# Bugfix
npm version patch                    # 0.1.2 → 0.1.3

# New feature OR breaking change (in 0.x)
npm version minor                    # 0.1.2 → 0.2.0

# Commit to 1.0 (stable API)
npm version major                    # 0.x.y → 1.0.0

# Pre-release
npm version prerelease --preid=beta  # 0.2.0 → 0.2.1-beta.0

# Without git tag (e.g. monorepo with centralized tagging)
npm version patch --no-git-tag-version

# Custom commit message
npm version minor -m "chore: release v%s"
```

**In this repo**: the CLI lives in `packages/cli/`. Run `npm version` **from inside that directory**, not from the monorepo root.

---

## Pre-bump Checklist

Before running `npm version`, verify:

- [ ] Working tree is clean (`git status` — `npm version` refuses dirty tree by default).
- [ ] On the right branch (usually `main` or a release branch).
- [ ] Tests pass: `npm test`.
- [ ] Build works: `npm run build`.
- [ ] **Semantic correctness**: re-read the changes since last tag — does the consumer experience match the bump size?
  ```bash
  git log v<last-tag>..HEAD --oneline -- packages/cli/
  ```
- [ ] If MAJOR (or MINOR in 0.x) with breaking changes: migration notes written in CHANGELOG or release notes.
- [ ] `dependencies` upgrades scanned for transitively-breaking updates.

---

## Post-bump

After `npm version` creates the commit+tag:

1. **Push with tags**: `git push --follow-tags`.
2. **Publish**: `npm publish` (or `npm publish --tag next` for pre-release).
3. **GitHub Release** (if repo uses them): `gh release create v<tag> --generate-notes`.
4. **Verify**: `npm view clai-helpers version` should reflect the new number.
5. **Announce** if MAJOR or notable MINOR.

---

## Red Flags (STOP and reconsider)

| Symptom | What it means | Fix |
|---------|---------------|-----|
| Bumping without knowing why | You're doing ritual, not release | Re-check changes; maybe no bump needed |
| `chore:` commit bumps version | Mismatched commit type | Recategorize commit or skip bump |
| Major bump every sprint | Breaking constantly — bad API design, OR still in 0.x and lying to yourself | Stay in 0.x longer; stabilize before 1.0 |
| `^0.x.y` in consumer's lockfile didn't update after your release | Expected — npm locks 0.x minors | Document migration, tell users to update manually |
| Dependency bumped, you didn't bump | Maybe fine for PATCH; MINOR-major of a dep = you should MINOR | Run consumer-facing tests first |

---

## Quick Reference

```
Bug? → patch
New thing? → minor
Breaking? → major (or minor in 0.x)
Nothing user-visible? → no bump
```

If writing a migration guide crosses your mind — it's MAJOR. If there's nothing to say except "now faster" — PATCH. Everything else is MINOR.
