---
description: Generate an actionable, dependency-ordered tasks.md with agent routing and parallel execution lanes.
handoffs:
  - label: Analyze For Consistency
    agent: speckit.analyze
    prompt: Run a project analysis for consistency
    send: true
  - label: Implement Project
    agent: speckit.implement
    prompt: Start the implementation in phases
    send: true
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

ultrathink

> "Какое ТЗ — такое и ХЗ." — Valera on requirements quality driving task quality.

1. **Setup**: Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json` from repo root and parse FEATURE_DIR and AVAILABLE_DOCS list. All paths must be absolute. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load design documents**: Read from FEATURE_DIR:
   - **Required**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities)
   - **Optional**: data-model.md (entities), contracts/ (interface contracts), research.md (decisions), quickstart.md (test scenarios)
   - **Coding Standards**: Read `.github/instructions/coding/copilot-instructions.md` — task descriptions MUST align with these standards:
     - Tasks that create API handlers → include "with Zod validation and structured error handling" in description
     - Tasks that create services → include "with typed inputs/outputs" in description
     - Tasks that touch DB → include "parameterized queries" or "via ORM" in description
     - Never generate tasks that imply `as any`, `console.log`, raw SQL interpolation, or `dangerouslySetInnerHTML`
     - If spec requests tests → task descriptions reference TDD-Lite approach (test before or immediately after)
   - Note: Not all projects have all documents. Generate tasks based on what's available.

3. **Execute task generation workflow**:
   - Load plan.md and extract tech stack, libraries, project structure
   - Load spec.md and extract user stories with their priorities (P1, P2, P3, etc.)
   - If data-model.md exists: Extract entities and map to user stories
   - If contracts/ exists: Map interface contracts to user stories
   - If research.md exists: Extract decisions for setup tasks
   - **Agent Assignment**: Assign `[AGENT]` tag to each task (see Agent Assignment Rules below)
   - **Shared File Extraction**: Scan tasks for overlapping file paths — any file touched by 2+ agents → extract into `[SETUP]` task before the fork point
   - **Dependency Resolution**: Build dependency graph (see Dependency Resolution Rules below)
   - **Lane Generation**: Group dependency chains into parallel lanes by agent flow
   - **Graph Validation**: Run self-validation checklist (no cycles, no orphans, correct syntax)
   - Validate task completeness (each user story has all needed tasks, independently testable)

4. **Generate tasks.md**: Use `.specify/templates/tasks-template.md` as structure, fill with:
   - Correct feature name from plan.md
   - Phase 1: Setup tasks (project initialization, shared dependency installs)
   - Phase 2: Foundational tasks (blocking prerequisites for all user stories)
   - Phase 3+: One phase per user story (in priority order from spec.md)
   - Each phase includes: story goal, independent test criteria, tests (if requested), implementation tasks
   - Final Phase: Polish & cross-cutting concerns
   - All tasks must follow the strict checklist format (see Task Format below)
   - Clear file paths for each task
   - **Dependency Graph section** with validated dependencies
   - **Parallel Lanes table** showing execution lanes per agent
   - **Agent Summary table** with task counts and start conditions
   - **Agent Dispatch Plan** — for each agent: subagent name, skills to load, input context sections, task IDs, target files/directories (see template for generator rules)
   - **Critical Path** — the longest dependency chain
   - Implementation strategy section (MVP first, incremental delivery, parallel agent strategy)

5. **Report**: Output path to generated tasks.md and summary:
   - Total task count
   - Task count per agent
   - Task count per user story
   - Number of parallel lanes
   - Critical path (longest dependency chain)
   - Agent dispatch plan summary (agents × skills × context)
   - Independent test criteria for each story
   - Suggested MVP scope (typically just User Story 1)
   - Format validation: Confirm ALL tasks follow the checklist format

Context for task generation: $ARGUMENTS

The tasks.md should be immediately executable - each task must be specific enough that an LLM can complete it without additional context.

## Task Format (REQUIRED)

Every task MUST strictly follow this format:

```text
- [ ] [TaskID] [AGENT] [Story?] Description with file path
```

**Format Components**:

1. **Checkbox**: ALWAYS start with `- [ ]` (markdown checkbox)
2. **Task ID**: Sequential number (T001, T002, T003...) in execution order
3. **[AGENT] tag**: REQUIRED for every task. One of:
   - **Core** (any project): `[SETUP]`, `[DB]`, `[BE]`, `[FE]`, `[OPS]`, `[E2E]`, `[SEC]`, `[PERF]`, `[DOC]`, `[DEBUG]`, `[REFACTOR]`
   - **Conditional** (only when plan.md explicitly requires): `[SEO]`, `[MOBILE]`, `[UIUX]`, `[PENTEST]`, `[GAME]`
4. **[Story] label**: REQUIRED for user story phase tasks only
   - Format: [US1], [US2], [US3], etc. (maps to user stories from spec.md)
   - Setup phase: NO story label
   - Foundational phase: NO story label
   - User Story phases: MUST have story label
   - Polish phase: NO story label
5. **Description**: Clear action with exact file path

**Examples**:

- ✅ CORRECT: `- [ ] T001 [SETUP] Create project structure per implementation plan`
- ✅ CORRECT: `- [ ] T005 [BE] Implement authentication middleware in src/middleware/auth.py`
- ✅ CORRECT: `- [ ] T012 [DB] [US1] Create User model in src/models/user.py`
- ✅ CORRECT: `- [ ] T016 [FE] [US1] Create LoginForm in src/components/LoginForm.tsx`
- ❌ WRONG: `- [ ] T001 Create project structure` (missing AGENT tag)
- ❌ WRONG: `- [ ] T005 [P] [BE] Implement auth` (old [P] marker — do NOT use)
- ❌ WRONG: `- [ ] [US1] Create User model` (missing Task ID and AGENT)

## Agent Assignment Rules

### By file path (primary)

| Path Pattern | Agent |
|-------------|-------|
| `src/models/`, `prisma/`, `drizzle/`, `migrations/`, `schema.*`, `seeds/` | `[DB]` |
| `src/api/`, `src/services/`, `src/middleware/`, `server/`, `src/routes/`, `src/lib/` | `[BE]` |
| `src/components/`, `src/pages/`, `src/app/`, `styles/`, `public/`, `src/hooks/` | `[FE]` |
| `Dockerfile`, `.github/workflows/`, `infra/`, `deploy/`, CI configs | `[OPS]` |
| `tests/e2e/`, `tests/integration/` (cross-domain only) | `[E2E]` |
| `docs/`, `README.md`, `CHANGELOG.md`, `*.api.md`, OpenAPI specs, runbooks | `[DOC]` |
| `app/` (React Native/Expo), `lib/` (Flutter), `ios/`, `android/`, `pubspec.yaml` | `[MOBILE]` |
| `robots.txt`, `sitemap.xml`, `app/sitemap.ts`, `app/robots.ts`, structured-data components | `[SEO]` |
| `design/`, `figma/`, `*.fig`, wireframes, design tokens, style guide | `[UIUX]` |
| `Assets/` (Unity), `*.godot`, `*.unity`, shaders, game-engine configs | `[GAME]` |

### By task description (fallback)

- "audit", "security review", "vulnerability", "hardening", "OWASP", "threat model" → `[SEC]`
- "pentest", "exploit", "offensive test", "red team", "attack simulation" → `[PENTEST]`
- "create schema", "add migration", "seed data", "create model", "index", "query optimization" → `[DB]`
- "implement endpoint", "add route", "create service", "add middleware", "background job" → `[BE]`
- "create component", "add page", "style", "create form", "responsive layout" → `[FE]`
- "CI/CD", "Docker", "deploy", "configure environment", "pipeline", "runner" → `[OPS]`
- "optimize", "profile", "benchmark", "Core Web Vitals", "bundle size", "LCP/INP/CLS", "memory leak", "cpu hotspot" → `[PERF]`
- "document", "README", "API docs", "changelog", "runbook", "onboarding guide", "architecture doc" → `[DOC]`
- "debug", "investigate", "root cause", "reproduce bug", "crash analysis", "RCA" → `[DEBUG]`
- "refactor", "extract method", "modernize legacy", "characterization test", "seam" → `[REFACTOR]`
- "SEO audit", "meta tags", "structured data", "schema.org", "sitemap", "GEO", "AI search", "E-E-A-T" → `[SEO]`
- "mobile screen", "React Native", "Flutter", "iOS", "Android", "push notification", "app store" → `[MOBILE]`
- "design system", "wireframe", "mockup", "user flow", "design tokens", "color palette", "typography scale" → `[UIUX]`
- "game mechanic", "physics", "shader", "level design", "multiplayer netcode", "game loop" → `[GAME]`

### Phase-based defaults

- Phase 1 tasks without clear domain → `[SETUP]`
- Unit tests → same agent as the code they test (`[BE]` tests → `[BE]`, `[FE]` tests → `[FE]`)
- Cross-boundary integration/E2E tests → `[E2E]`

### Conditional agents

- `[SEC]` — only add when spec.md/plan.md mentions security requirements (OWASP, threat model, compliance)
- `[E2E]` — only add when spec.md mentions E2E testing or cross-boundary scenarios
- `[PERF]` — only add when spec.md has NFRs for latency/throughput/bundle size OR plan.md marks performance as a constitutional principle
- `[DOC]` — only add when spec.md requires user/developer-facing docs, or plan.md flags public API surface
- `[DEBUG]` — only add when feature replaces flaky subsystem or spec.md references existing bug investigation
- `[REFACTOR]` — only add when feature touches legacy code without tests (Michael Feathers territory) — always precede with characterization tests
- `[SEO]` — only for public-facing web content (marketing sites, blogs, docs portals, e-commerce)
- `[MOBILE]` — only when plan.md tech stack includes React Native, Expo, Flutter, or native iOS/Android
- `[UIUX]` — only for design-heavy features needing wireframes/mockups before implementation (precedes `[FE]`)
- `[PENTEST]` — only when spec.md explicitly requires offensive testing (distinct from `[SEC]` defensive audit)
- `[GAME]` — only when plan.md tech stack includes Unity, Unreal, Godot, Phaser, or Three.js-as-game-engine

### Shared file extraction

- Scan all generated tasks for file path overlaps
- If 2+ agents need to write to the same file (e.g., `package.json`) → create a single `[SETUP]` task that performs ALL writes to that file BEFORE the parallel fork
- This `[SETUP]` task becomes a dependency for both agents in the graph

## Dependency Resolution Rules

### Default dependency patterns within a user story

- `[SETUP]` blocks all other agents in the phase
- `[UIUX]` → `[FE]` (design must precede implementation — wireframes/tokens first)
- `[DB]` → `[BE]` (when BE uses the model)
- `[DB]` → `[FE]` (when FE binds to the model directly)
- `[BE]` → `[FE]` (when FE calls the API)
- `[BE]` → `[MOBILE]` (when mobile client calls the API)
- `[REFACTOR]` tasks MUST be preceded by characterization tests ([E2E] or unit tests) — refactoring without a safety net is not refactoring, it's random edits
- `[DEBUG]` tasks produce an RCA artifact — subsequent fix tasks depend on the RCA output
- `[E2E]` depends on all implementation tasks in its user story
- `[SEC]` depends on all implementation tasks in its user story
- `[PENTEST]` depends on `[SEC]` completing AND deployable artifact existing (needs live target)
- `[PERF]` depends on `[E2E]` (can't optimize what's not working) — produces benchmarks, not new features
- `[SEO]` depends on `[FE]` pages existing (needs rendered output to audit)
- `[DOC]` depends on the public API it documents — runs after implementation stabilizes (polish phase)
- `[OPS]` depends only on `[SETUP]` (parallel to everything else)

### Explicit dependencies

- From contracts/: if interface A is consumed by task B → A dependency on B
- From data-model.md: entity relationships define model → service ordering
- Shared file writes: sequential, `[SETUP]` task owns the write (see above)

### Dependency graph syntax (STRICT)

```
# VALID formats (one per line):
T001 → T002                    # single unlock
T001 → T002, T003              # fan-out (one unlocks many)
T002 + T003 → T004             # fan-in (many unlock one)

# INVALID (do NOT produce):
T001 → T002 → T003             # chaining — use two separate lines
T001, T002 → T003, T004        # multi-to-multi — decompose
```

### Graph self-validation (MUST pass before writing tasks.md)

- [ ] Every task ID in Dependencies exists in the task list
- [ ] No circular dependencies (A→B→A or longer cycles)
- [ ] No orphan task IDs referenced that don't exist
- [ ] Fan-in uses `+` only, fan-out uses `,` only
- [ ] No chained arrows on a single line

If validation fails → STOP and fix before writing tasks.md.

## Phase Structure

- **Phase 1**: Setup (project initialization, sync barrier)
- **Phase 2**: Foundational (blocking prerequisites, sync barrier)
- **Phase 3+**: User Stories in priority order (P1, P2, P3...)
  - Default: sequential (P1 → P2 → P3) with sync barrier between phases
  - Opt-in parallel: if plan.md explicitly marks stories as independent, multiple US phases can run in parallel
  - Within each story: Tests (if requested) → Models → Services → Endpoints → UI → Integration
  - Each phase should be a complete, independently testable increment
- **Final Phase**: Polish & Cross-Cutting Concerns (sync barrier — waits for all US phases)

## Task Organization Sources

1. **From User Stories (spec.md)** — PRIMARY ORGANIZATION:
   - Each user story (P1, P2, P3...) gets its own phase
   - Map all related components to their story, assign agent tags
   - Mark story dependencies (most stories should be independent)

2. **From Contracts**:
   - Map each interface contract → to the user story it serves
   - If tests requested: Each interface contract → contract test task before implementation

3. **From Data Model**:
   - Map each entity to the user story(ies) that need it
   - If entity serves multiple stories: Put in earliest story or Foundational phase
   - Relationships → service layer tasks in appropriate story phase

4. **From Setup/Infrastructure**:
   - Shared infrastructure → Setup phase (Phase 1)
   - Foundational/blocking tasks → Foundational phase (Phase 2)
   - Story-specific setup → within that story's phase

## Snapshot Stage (Principle VII)

After `tasks.md` is written (with dependency graph + parallel lanes + agent summary), tag the pipeline stage:

```bash
.specify/scripts/bash/snapshot-stage.sh tasks <slug>
```

```powershell
.specify\scripts\powershell\snapshot-stage.ps1 -Stage tasks -Slug <slug>
```

Where `<slug>` = the feature directory slug (e.g., `001-orchestrator`). Tag (e.g., `tasks/001-orchestrator/v1`) MUST be reported back. The `tasks/<slug>/v1` tag is the anchor for `/speckit.retrospective` to bound the implementation lifecycle. Idempotent. Skips with warning if not in a git repo.
