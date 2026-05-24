---
description: Multi-feature scope coordination — builds an overlap matrix across all active SpecKit specs to detect file collisions before they cause merge conflicts. Read-only.
---

## User Input

```text
$ARGUMENTS
```

Optional argument: `--shipped` to include features tagged `shipped/<slug>` (excluded by default).

## Goal

ultrathink

> "Два сантехника в один стояк — стояк лопнул." — Valera, on parallel features touching shared pipes.

When multiple SpecKit features run in parallel (e.g., `specs/001-orchestrator/` + `specs/002-checkout/` + `specs/003-billing/`), they often touch the same files: shared models, common utilities, config files, root manifests. Without explicit coordination, you discover the collision at merge time — `/speckit.implement` of feature B clobbers what feature A wrote, or worse, two PRs both touch `helpers.config.ts` with conflicting changes.

`/speckit.scope` builds an **overlap matrix** by reading every active feature's `plan.md` + `tasks.md`, extracting referenced file paths, and flagging cells where ≥2 features touch the same file. Output is `specs/_overlap.md` — committed evidence of known overlaps with severity ranking and recommendations.

## Operating Constraints

**STRICTLY READ-ONLY across feature artifacts**. The only file written is `specs/_overlap.md` (top-level, alongside individual feature dirs).

## Execution Steps

### 1. Discover Active Features

List all `specs/<N>-<slug>/` directories. Default exclusion:
- Features with `shipped/<slug>` git tag (already merged, no longer in flight).
- The `_overlap.md` file itself (it lives at `specs/_overlap.md`, not inside any feature dir).

If `--shipped` is passed in `$ARGUMENTS`, include shipped features too (useful for retro analysis).

### 2. Extract File References per Feature

For each active feature `specs/<N>-<slug>/`:
- Read `plan.md` and `tasks.md` (skip if either missing — note in output).
- Extract file path mentions using regex:
  - Backtick-quoted paths: `` `path/to/file.ext` ``
  - Markdown link refs: `[text](path/to/file.ext)`
  - Bullet lists where the first token looks like a path
- Filter out:
  - Pure URLs (`http://`, `https://`)
  - Anchors-only (`#section`)
  - Generic placeholders (`<file>`, `<path>`, `path/to/...`)
  - Files inside the feature's own dir (`specs/<N>-<slug>/...`) — they don't collide cross-feature
- Normalize: lowercase, strip leading `./`, dedupe per feature.

### 3. Build Overlap Matrix

Construct a 2D map: `file_path → [feature1, feature2, ...]`.
Filter to files referenced by **≥2 distinct features**.

For each overlapping file, compute severity:

| Severity | Condition |
|---|---|
| **CRITICAL** | Same file referenced by ≥2 features in tasks marked with the **same** `[AGENT]` tag (e.g., both `[BE]`) — same agent, same file, same time window = race condition. |
| **HIGH** | Same file across different `[AGENT]` tags AND in `[SETUP]` or root config (e.g., `helpers.config.ts`, `package.json`, root `tsconfig.json`) — schema-level changes that don't merge cleanly. |
| **MEDIUM** | Same file across different `[AGENT]` tags in non-root code (e.g., `src/lib/utils.ts`) — likely to merge but needs review. |
| **LOW** | Same file mentioned in one feature's task list but only in another feature's plan.md (no concrete task yet) — early warning. |

### 4. Write `specs/_overlap.md`

Format:

```markdown
# SpecKit Cross-Feature Overlap Matrix

**Generated**: <ISO timestamp>
**Active features**: <list of slugs>
**Excluded (shipped)**: <list, or "none">
**Total overlapping files**: <N>

## CRITICAL — Same Agent, Same File (race condition risk)

| File | Features (agent) | Recommendation |
|------|-----------------|----------------|
| `src/api/orchestrator.ts` | 001-orchestrator (`[BE]`), 003-billing (`[BE]`) | **Sequence**: ship 001 first, rebase 003 onto it. Or extract shared interface to a separate `[SETUP]` task that both depend on. |

## HIGH — Root config / schema collision

| File | Features (agents) | Recommendation |
|------|-------------------|----------------|
| `helpers.config.ts` | 002-checkout (`[OPS]`), 005-mobile (`[OPS]`) | Coordinate via shared `[SETUP]` task. Stagger PRs. |

## MEDIUM — Cross-agent shared code

| File | Features (agents) | Recommendation |
|------|-------------------|----------------|
| `src/lib/format.ts` | 001-orchestrator (`[BE]`), 004-reports (`[FE]`) | Add cross-link in tasks.md (`see also 004-reports/T-12`). Review at merge time. |

## LOW — Plan-only mentions

| File | Features | Notes |
|------|---------|-------|
| `src/db/schema.ts` | 002-checkout (planned but no task), 003-billing (T7 [DB]) | 002 hasn't broken plan into tasks yet. Re-run scope when it does. |

## Per-Feature File Footprint

| Feature | Files referenced | Stage | Last activity |
|---------|------------------|-------|---------------|
| 001-orchestrator | 12 | implementing | <commit date> |
| 002-checkout | 3 | planning | <commit date> |
| ... | ... | ... | ... |

## Recommendations

1. **Sequence**: <list of features that should ship in specific order>
2. **Refactor candidates**: <files that ≥3 features touch — candidates for extraction>
3. **Re-run cadence**: re-run `/speckit.scope` after every `/speckit.tasks` to keep this current.
```

### 5. Report to User

Print to stdout:
- Path of overlap file
- Total CRITICAL/HIGH/MEDIUM/LOW counts
- Top-3 most-overlapping files (the worst offenders)
- Recommended action (e.g., "1 CRITICAL — sequence features 001 → 003 before parallel implement")

## Operating Principles

### Conservative regex (no hallucinations)
If a file path is ambiguous (e.g., `utils.ts` without a directory prefix), report it but mark `low confidence` in the recommendation column. Don't invent paths that aren't literally in the artifacts.

### Re-runnable
Each invocation overwrites `specs/_overlap.md` entirely. The git history of that file is the historical record.

### Doesn't gate anything
Scope is **advisory**, not a gate. It informs the user; it doesn't block `/speckit.implement`. Forcing it into a gate would create a chicken-and-egg with multi-feature parallel development.

## Context

$ARGUMENTS
