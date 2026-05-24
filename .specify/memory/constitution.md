# UnderUndre AI Helpers Constitution

Binding principles for `clai-helpers` CLI + the curated `.claude/` template it ships. Every `/speckit.*` command checks plans and tasks against this file. Violations halt work until resolved or the constitution is explicitly amended.

## Core Principles

### I. Source of Truth Discipline

`.claude/` is **the** authoritative AI configuration. All downstream formats (`.github/prompts/`, `.github/instructions/*.instructions.md`, `.gemini/`, `GEMINI.md`, `.github/copilot-instructions.md`) are **generated**, never hand-edited.

- Edits flow one direction: `.claude/` → transformers → consumer tree.
- Any reverse flow (editing a generated file) is an incident and must be rolled back via `clai-helpers sync`.
- Hand-written instruction files under `.github/instructions/{project,persona,coding}/` are the explicit exception and are preserved by pipeline exclusion, not by luck.

### II. Transformer, Not Fork

New AI-tool target = one new transformer in `packages/cli/src/transformers/` + registration + pipeline entry in `helpers.config.ts`. Duplicating `.claude/` into a new directory tree is forbidden.

- Rationale: two copies of the same instruction drift. The CLI pipeline is the anti-drift discipline.
- Corollary: `.agent/`, `.gemini/`, `.github/prompts/` etc. MUST be produced by the pipeline, not maintained by hand.

### III. Protected Slots over Hand-Editing

Project-specific overrides inside managed files MUST use `<!-- HELPERS:CUSTOM START --> … <!-- HELPERS:CUSTOM END -->` markers. These survive `sync`. Unmarked hand-edits to managed files are lost silently on next sync — by design.

- Consumer projects never edit generated trees directly.
- Upstream improvements that would benefit every consumer go through `UnderUndre/ai` + `sync`, not local patch.

### IV. SemVer Discipline in the 0.x Zone (NON-NEGOTIABLE)

While `clai-helpers` is pre-1.0:

- **Breaking change** → MINOR bump (de facto major in 0.x semantics).
- **Feature** → MINOR bump.
- **Bugfix** → PATCH bump.
- **`chore:` / `docs:` / `refactor:` / `ci:` / `test:` / `build:`** → NO bump. Every `chore: bump version` commit is a smell.
- Going to `1.0.0` is a one-way public promise of API stability. Not before migration notes, deprecation cycles, and a tagged RC.

Full framework: `.claude/skills/semver-versioning/SKILL.md`. Bump via `/bump` command — never by hand-editing `package.json#version`.

### V. Token Economy for AI Artifacts

Every file in `.claude/` earns its place by being invoked. Decorative clones, stale mirrors, and "just in case" agents bloat the context window of every downstream Claude session.

- A file not referenced by any command, agent, or skill in 60 days is a candidate for deletion.
- `ultrathink` markers belong on entry points (commands + primary agents + decision-framework skills), not on every file. Each marker costs reasoning budget on load.
- Persona flavor (catchphrases, aphorisms) MUST be opt-in via a separate transpile target so non-Russian-speaking consumers can omit it.

### VI. Cross-AI Review Gate (NON-NEGOTIABLE)

`/speckit.implement` MUST NOT proceed without explicit gate approval. The gate requires:

1. `/speckit.analyze` written `specs/<slug>/reviews/analyze.md` with verdict ∈ {PASS, OVERRIDDEN}.
2. At least **2 distinct external AI reviewers** (Codex Desktop, Antigravity, Gemini CLI, Copilot, or Claude in an independent session) wrote `specs/<slug>/reviews/<provider>.md` via `/speckit.review` with verdict ∈ {PASS, OVERRIDDEN}.

Rationale: the model that wrote the spec is the worst auditor of the spec. Independent eyes find what the author already rationalized away. Two reviewers is the minimum to distinguish a real signal from a single-model blind spot.

Override is permitted via `--override-gate <reason>` passed to `/speckit.implement`. Every override is logged to `specs/<slug>/reviews/_gate-override.md` with timestamp, actor, commit SHA, and reason. Frequent overrides on a single feature are an incident, not a workflow.

Reviewers identify themselves by tool — `claude`, `codex`, `antigravity`, `gemini`, `copilot`. Two reviews from the same provider count as one. The gate trusts the provider tag in the VERDICT block; falsifying it defeats the purpose.

### VII. Artifact Versioning

Every pipeline stage that mutates a feature artifact (specify, clarify, plan, tasks, review) MUST tag the commit via `.specify/scripts/{bash,powershell}/snapshot-stage.{sh,ps1}` using the convention `<stage>/<slug>/v<N>`.

- Tags are the **only** historical record. **No parallel `.history/` files** — git is the history. Duplicating into `specs/<slug>/.history/` is an anti-pattern: it drifts and bloats the tree.
- `/speckit.diff <slug>` reads tags to compare iterations without speculative file copies.
- `/speckit.retrospective` reads `tasks/<slug>/v1` → HEAD to bound the implementation lifecycle and surface lessons-learned.
- The snapshot script is **idempotent** via `--points-at HEAD` guard — re-running a speckit command on the same commit reuses the existing tag instead of polluting the namespace.
- Reviewers (`/speckit.review`) only need ONE of them to call snapshot — the idempotency guard ensures parallel reviewers don't duplicate.

### VIII. Self-Maintaining Knowledge

The AI workflow infrastructure MUST keep itself current. Lessons learned are captured into staged knowledge; recurring patterns get promoted into skills/agents; project-wide spec drift is corrected actively. The repo is a learning system, not a static template.

Mechanisms (delivered May 2026):

1. **Intent Routing** (CLAUDE.md §"Intent Routing" + `/dispatch` command). User utterances map to known commands/agents. Soft-baseline transpiles to all targets; CC adds reliability via `UserPromptSubmit` hook (`.claude/hooks/intent-hint.sh`).
2. **Agent skills loading** (`.claude/hooks/agent-skills-reminder.sh`). `PreToolUse(Task)` hook prepends "load skills from frontmatter" reminder into the spawned subagent's prompt. Prevents subagents from skipping their declared skills.
3. **Session checkpoint** (`.claude/hooks/session-checkpoint.sh`). Stop hook fires once per session at turn ~30 to remind about `/improve`, `/learn`, spec updates. Counter-gated to avoid alarm fatigue.
4. **Pattern capture** (`/learn <slug>`). Stages reusable patterns in `knowledge/patterns/<slug>.md` with `status: draft`. Not a final destination — patterns mature here before being promoted.
5. **Promotion** (`/improve`). Reads `knowledge/patterns/`, proposes targeted promotions into specific `.claude/skills/<name>/SKILL.md` or `.claude/agents/<name>.md`. Promotion is explicit, not automatic.
6. **Living spec** ([`specs/main/architecture.md`](../../specs/main/architecture.md) + [`requirements.md`](../../specs/main/requirements.md)). Canonical source for project topography and contracts. Updated when arch changes — drift here is treated as a defect.

Violations (signals, not blockers):

- Same anti-pattern observed in 2+ commits within a quarter without a corresponding `knowledge/patterns/` entry → `/learn` candidate.
- Agent X spawned 3+ times for tasks that touch domain Y without using domain-Y skill → frontmatter or skill itself is wrong.
- `specs/main/` last-modified > 90 days while `packages/cli/src/` had ≥10 commits → spec drift, run a refresh.
- `knowledge/patterns/` entries with `status: draft` older than 60 days → either promote (`/improve`) or close as won't-fix.

Detection is **fuzzy**, not automated gates. This principle informs `/speckit.retrospective`, `/improve`, and the Stop checkpoint hook — they raise these signals when they see them. Acting on the signals is the maintainer's call. Unlike Principles IV/VI/VII, VIII does not block `/speckit.implement`.

Hybrid enforcement:

- **Soft baseline**: Intent Routing table + `/dispatch` + `/learn` + `/improve` — all in `.claude/`, transpile to Copilot/Gemini/Codex/Antigravity.
- **CC ratchet**: hooks under `.claude/hooks/` + `.claude/settings.json` registration. Live upstream-only by design (Hybrid enforcement decision from May 2026 brainstorm). Do not transpile; not in `helpers.config.ts.sources`.

## Technical Constraints

> Moved to [`../../specs/main/requirements.md`](../../specs/main/requirements.md) §2.1 (single source of truth). Constitution governs **principles**; concrete tech-stack constraints live alongside requirements where they belong.

## Development Workflow

### Plumber's Loop (required for every non-trivial change)

`Classify → Analyze → Spec → Plan → Execute → Verify → Reflect`. Defined in `.github/instructions/coding/copilot-instructions.md` §5.

### WRAP atomicity

`W`rite-issue → `R`efine → `A`tomic-tasks (<500 LOC each) → `P`air-execute (one PR = one concern: refactor XOR feature, never both).

### `/speckit.*` pipeline for features

`/speckit.specify` → `/speckit.clarify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.analyze` → **`/speckit.review`** (×2 from external AI tools) → `/speckit.implement` → `/speckit.status`.

This file (the constitution) is loaded at the Constitution Check gate of `/speckit.plan`. Violations block until resolved.

`/speckit.implement` enforces Principle VI's cross-AI review gate before any task execution: requires `analyze.md` PASS + ≥2 distinct external reviewers PASS in `specs/<slug>/reviews/`. Override via `--override-gate <reason>` is logged.

### Quality gates before `done`

- `npm run validate` (tsc --noEmit) — clean.
- `npm test` — all pass.
- `npm run build` — produces `dist/`.
- `npx clai-helpers status --strict` — no drift between `.claude/` source and generated targets.

### Release gate

`/bump` → confirmation → `npm version` → `git push --follow-tags` → `npm publish` (which triggers `prepublishOnly` = validate + test + build). No manual version edits. No publish from dirty tree.

## Governance

1. **This constitution supersedes ad-hoc practice.** If an agent, skill, or command contradicts a principle here, the principle wins until the constitution is amended.
2. **Amendments require a commit** that touches `.specify/memory/constitution.md` plus any dependent `.claude/` files (e.g., changing Principle IV requires updating `semver-versioning` skill and `/bump` command to match).
3. **`/speckit.analyze` enforces constitution alignment** — any misalignment in spec/plan/tasks is flagged CRITICAL.
4. **Complexity must be justified.** Every new agent, transformer, target, or skill adds load to every downstream session. A change that doesn't earn its weight is rejected.
5. **Anti-sycophancy applies to review of this file too.** If a principle above is wrong for the project, say so and propose an amendment. Don't quietly ignore it.

**Version**: 1.4.0 | **Ratified**: 2026-04-17 | **Last Amended**: 2026-05-06

### Changelog

- **1.4.0** (2026-05-06) — Added Principle VIII: Self-Maintaining Knowledge. Documents the May 2026 self-maintaining workflow infrastructure (Intent Routing + `/dispatch` + 3 hooks + `/learn` + `/improve` + `specs/main/`). NOT NON-NEGOTIABLE — fuzzy signals only, no `/speckit.implement` block. Hybrid enforcement: soft baseline transpiles everywhere; CC ratchet (hooks) lives upstream-only. Companion build-out: brainstorm Option B implemented over Steps 1-7.
- **1.3.0** (2026-05-06) — Moved "Technical Constraints" section out of constitution to [`specs/main/requirements.md`](../../specs/main/requirements.md) §2.1 as part of project-doc consolidation. Constitution now governs **principles only**; concrete tech-stack constraints live with requirements. No principle changes; no behavioral diff for `/speckit.*` commands.
- **1.2.0** (2026-04-26) — Added Principle VII: Artifact Versioning. Every speckit pipeline stage (specify/clarify/plan/tasks/review) now tags the commit via `snapshot-stage.{sh,ps1}` using `<stage>/<slug>/v<N>` convention. Enables `/speckit.diff` and `/speckit.retrospective` without parallel `.history/` files. Idempotent via `--points-at HEAD` guard.
- **1.1.0** (2026-04-26) — Added Principle VI: Cross-AI Review Gate (NON-NEGOTIABLE). `/speckit.implement` now requires `/speckit.analyze` PASS + ≥2 external reviewer PASS via `/speckit.review`. Override via `--override-gate <reason>` with audit log.
- **1.0.0** (2026-04-17) — Initial ratification.
