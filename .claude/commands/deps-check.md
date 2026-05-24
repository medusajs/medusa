---
description: Periodic dependency health check — `npm outdated` + `npm audit` parsed. Categorizes upgrades by risk. Does NOT upgrade automatically.
---

# /deps-check — Dependency Health Snapshot

$ARGUMENTS

ultrathink

> "Работает — не трогай, блять!" — Rule #1. Don't upgrade for upgrade's sake.
> "Обходи эту шелупонь!" — Bypass broken libs; pin and document.

## Behavior

Read-only dependency status. Runs `npm outdated` and `npm audit` in the current package, parses the output, and classifies each entry by risk and urgency. Makes no changes.

## Execution

1. Determine package dir: `$ARGUMENTS` or current cwd. If monorepo root, walk `packages/*` and aggregate per-package.
2. `npm outdated --json` → parse. Group by:
   - **Major** behind (breaking API changes likely) — requires review.
   - **Minor** behind (new features / deprecations).
   - **Patch** behind (bugfixes only — safest).
3. `npm audit --json` → parse. Group by severity: `critical`, `high`, `moderate`, `low`.
4. Cross-reference: if a vulnerable package has a fix available and is only a patch upgrade → prioritize. If fix requires a major upgrade → flag as blocker.
5. Print a table and a recommended action list.

## Output format

```markdown
## Dependency health: `packages/cli/` (clai-helpers@0.2.0)

### Outdated (<N> packages behind)

| Package | Current | Wanted (range) | Latest | Category | Notes |
|---------|---------|----------------|--------|----------|-------|
| typescript | 5.7.2 | 5.7.2 | 5.9.0 | minor | new inference features; low risk |
| citty      | 0.1.3 | 0.1.3 | 0.2.0 | minor | — |
| consola    | 3.2.3 | 3.4.0 | 3.4.0 | patch | within caret range; run `npm update` |
| vitest     | 3.2.4 | 3.2.4 | 4.0.0 | **major** | test framework; read migration guide first |

### Vulnerabilities (<N> total: <crit> critical, <high> high, <mod> moderate, <low> low)

| Package | Severity | Fix available | Upgrade needed |
|---------|----------|---------------|----------------|
| old-dep | high     | 1.2.3 (patch) | **apply now**  |
| foo-lib | moderate | 2.0.0 (major) | read changelog; plan migration |
| legacy  | low      | — (no fix)    | consider replacing |

### Recommended actions (priority order)

1. **Apply patch-only security fixes**: `npm update old-dep` — safe, addresses high severity.
2. **Safe minor bumps within caret** (already allowed by range): `npm update` (picks everything within `^x.y.z`).
3. **Plan major reviews**: vitest 3→4, react 18→19, etc. Each needs its own brainstorm + migration note; do NOT bundle.
4. **Defer low-severity, no-fix vulnerabilities**: document in `SECURITY.md` with rationale.
```

## Constraints

- **Never run `npm audit fix`** — it may upgrade majors silently. Let the human decide.
- **Never auto-bump anything.** This is an information command. Upgrades go through normal PR + review.
- **Never ignore critical vulnerabilities** without explicit documentation.
- If `npm audit` flags a transitive dep with no fix path → note "no direct fix" + recommend `npm ls <pkg>` to identify who's pulling it in.

## Pairs with

- `/bump` — before releasing, confirm deps are healthy.
- `/security-auditor` (agent) — deep-dive a specific vulnerability.
- `/verify` — post-upgrade, ensure nothing regressed.

## Examples

```
/deps-check
/deps-check packages/cli
/deps-check --only-security     # just audit, skip outdated
```
