---
description: Route a free-text user intent to the right slash command or agent. Reads the Intent Routing table from CLAUDE.md and executes the matching first-action. Disambiguates when ambiguous; never silently improvises.
---

# /dispatch — Intent Router

$ARGUMENTS

ultrathink

> "Сначала пойми что это за труба, потом тяни ключ." — Classify before acting.
> "Не лезь поперёк батьки." — If a command exists for this, use it. Don't reimplement.

## Behavior

Given the user's intent in `$ARGUMENTS` (free-text), do the following:

### 1. Match against Intent Routing table

Source of truth: the **`## Intent Routing`** section in [`CLAUDE.md`](../../CLAUDE.md). Match by:

- **Keyword presence** (case-insensitive, RU/EN both): `bug`, `debug`, `сломалось`, `не работает` → debugger.
- **Pattern**: paste of CI log → `/fix-ci`. `git diff`-style output → `/diff` retrospective.
- **File-path scope**: TS errors mention → `/fix-types`. Test stack-trace mention → `/fix-tests`.

### 2. Single-match path

If exactly one row matches confidently (≥0.85 confidence) → execute the prescribed first-action immediately. State it briefly: "Routing → `/fix-tests` (matched 'тесты упали')."

### 3. Multi-match / ambiguity

If 2+ rows match OR confidence < 0.85 → **don't act**. Present the candidates:

```
Intent ambiguous. Candidates:
- /brainstorm — if you want options before deciding
- /speckit.specify — if you're committing to "we're building X"
Which?
```

Wait for user pick. Don't pick yourself.

### 4. No match

Show 2 best-fit guesses with reasoning + ask:

```
No exact match. Best guesses:
- /verify — for "проверь" maps to status checks
- /diff — for "что у нас сейчас"
Or describe more concretely?
```

### 5. Already-routed input

If `$ARGUMENTS` literally starts with `/<command>` — that IS the dispatch. Don't re-route. Just execute.

## Routing principles

1. **The command's prompt is the source of truth** for that action. `/dispatch` does not duplicate logic — it points at the right command.
2. **Don't improvise when a command exists.** Improvisation = inconsistent over time.
3. **Don't double-route.** `/dispatch /fix-ci ...` is a usage error — flag and proceed with `/fix-ci`.
4. **Stop conditions still apply** (CLAUDE.md). A `/dispatch` match doesn't bypass plan-first-when-touching->3-files etc.
5. **Persona stays Valera.** Routing is mechanical; tone is not.

## Absolute constraints

- **Never** silently pick when ambiguous. User decision > AI guess for routing.
- **Never** chain commands without confirmation (e.g. don't `/fix-ci` THEN auto-commit THEN auto-push).
- **Never** modify the Intent Routing table from inside `/dispatch`. Updates go through normal CLAUDE.md edit + regen.
- **Never** commit/push/deploy as a side effect of routing (Standing Order #1).

## Pairs with

- `/verify` — when intent is "tell me state"
- `/brainstorm` / `/questions_ideas` — when intent is "think about X" / "find holes in X"
- `/fix-tests`, `/fix-types`, `/fix-ci`, `/resolve-conflicts` — domain-specific repair flows
- `/improve` — when intent is "capture lesson from this session"
- `/bump` — when intent is "ship"

## Examples

```
/dispatch fix the auth flake on main
   → routes to /fix-tests OR /fix-ci depending on log shape; asks if unclear

/dispatch brainstorm caching strategy for feed API
   → routes to /brainstorm caching strategy for feed API

/dispatch ship 0.4.0
   → routes to /bump minor (after confirming target version)

/dispatch добавь команду для X
   → routes to /speckit.start "X" (>3 files implied) OR inline if trivial; asks

/dispatch                         # no args
   → asks what to dispatch
```
