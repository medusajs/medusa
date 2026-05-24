---
description: Run the test suite, classify failures, fix the real ones, and rerun until green or stuck. Delegates to test-engineer agent.
---

# /fix-tests — Diagnose & Fix Failing Tests

$ARGUMENTS

ultrathink

> "Стучит? Хороший стук наружу вылезет." — Don't silence a failing test, understand it.
> "В системе нет багов, есть только аномалии." — Each failure points somewhere.
> "Отладка вдвое сложнее написания кода. Если пишешь на пределе ума — ты по определению тупой, чтобы отладить." — Kernighan's law.

## Delegation

Load `test-engineer` agent and its skills: `testing-patterns`, `tdd-workflow`, `systematic-debugging`, `webapp-testing`, `code-review-checklist`. The command is the entry point; the agent does the work.

See [`.claude/agents/test-engineer.md`](../agents/test-engineer.md).

## Workflow

### 1. Detect the test command

Prefer in order: `$ARGUMENTS` if user named a script, then `test:unit`, `test:integration`, `test` — whichever exists in `package.json`. If none, stop and ask.

### 2. Run once, capture output

Run the test command, capture stdout+stderr. If **zero failures** → stop, report "all green."

### 3. Classify each failure — before fixing anything

Each failure lands in one of these buckets. Treat them differently:

| Bucket | Symptom | Action |
|--------|---------|--------|
| **Setup error** | Test file didn't even run (import fail, syntax error, missing fixture) | Fix setup FIRST — failures downstream of a broken setup are noise |
| **Flaky** | Intermittent; timing / ordering / network dependent | Rerun the failing test(s) ×2. If passes now, mark as flaky and note for separate issue. Do not paper over. |
| **Assertion mismatch** | Test asserted `X` but got `Y` | **Check the test, not just the code.** Maybe the test is wrong about what the contract should be. Decide: is production code right or is the test right? |
| **Real bug** | Code produces wrong output per a correctly-written test | Fix the code. Use `systematic-debugging` protocol (reproduce → isolate → hypothesize → verify). |
| **Schema/type drift** | Test fails because a type / schema / fixture changed but not everywhere | Update fixtures or the consumer; if cross-boundary, may need migration note |

### 4. Fix iteratively, rerun after each

- Fix **one bucket at a time**, starting with `Setup error` (biggest downstream cascade), then `Schema drift`, then `Real bug`, then `Assertion mismatch`.
- After each fix, **rerun only the affected files** (`vitest run <file>`). Full suite only at the end.
- If a fix introduces NEW failures → stop, re-classify, do not snowball.

### 5. Stop conditions

- ✓ All tests pass → final full-suite rerun → report.
- ✗ No progress after **3 fix attempts on the same test** → stop, hand back to user with the diagnosis and what was tried.
- ✗ Fix requires a structural change (new dep, refactor of unrelated module, API redesign) → stop, propose plan, wait for approval.

### 6. Absolute constraints

- **Never `.skip` / `.todo` a failing test** to get green. That's hiding the issue. If you truly believe the test is wrong, say so explicitly and get approval before removing.
- **Never lower a threshold** (coverage, snapshot, timeout) silently to make a test pass. If the threshold must change, flag it.
- **Never mock at a new boundary** to dodge a bug. Mocks are for external systems, not for the code under test.
- **Never commit a fix without the full suite green.**

## Output format

```markdown
## Test run: <command> — <N passed, M failed>

### Failures classified

- **setup (1)**: `tests/integration/regen.test.ts` — missing fixture file
- **real bug (2)**: `tests/unit/slots.test.ts:42` — off-by-one in merge
- **flaky (1)**: `tests/e2e/login.test.ts` — passed on rerun, tracking as TODO

### Fixes applied

1. `tests/integration/regen.test.ts` — create `fixtures/minimal-manifest.ts` (setup)
2. `src/core/slots.ts:128` — adjust boundary condition (real bug)

### Status: ✓ all green (rerun confirmed)
### Flaky tracker: 1 test needs investigation — not blocking.
```

## Pairs with

- `/verify` — start here; if tests row is `✗`, then `/fix-tests`.
- `/fix-types` — type errors often cause test failures. Run types first.
- `/debug` — deep RCA for a single stubborn failure.
- `/questions_ideas` — before claiming done, scrutinize what edge cases you DIDN'T test.

## Examples

```
/fix-tests
/fix-tests test:integration          # specific script
/fix-tests tests/integration/regen   # specific file
```
