---
description: Execute the implementation planning workflow using the plan template to generate design artifacts.
handoffs: 
  - label: Create Tasks
    agent: speckit.tasks
    prompt: Break the plan into tasks
    send: true
  - label: Create Checklist
    agent: speckit.checklist
    prompt: Create a checklist for the following domain...
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Outline

ultrathink

> "Обкашляю вопросик." — Valera takes on the planning task.

1. **Setup**: Run `.specify/scripts/powershell/setup-plan.ps1 -Json` from repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. For single quotes in args like "I'm Groot", use escape syntax: e.g 'I'\''m Groot' (or double-quote if possible: "I'm Groot").

2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template (already copied).

3. **Execute plan workflow**: Follow the structure in IMPL_PLAN template to:
   - Fill Technical Context (mark unknowns as "NEEDS CLARIFICATION")
   - Fill Constitution Check section from constitution
   - Evaluate gates (ERROR if violations unjustified)
   - Phase 0: Generate research.md (resolve all NEEDS CLARIFICATION)
   - Phase 1: Generate data-model.md, contracts/, quickstart.md
   - Phase 1: Update `specs/main/architecture.md` with new technologies, paths, and feature reference
   - Re-evaluate Constitution Check post-design

4. **Stop and report**: Command ends after Phase 2 planning. Report branch, IMPL_PLAN path, and generated artifacts.

## Phases

### Phase 0: Outline & Research

1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:

   ```text
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

### Phase 1: Design & Contracts

**Prerequisites:** `research.md` complete

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Define interface contracts** (if project has external interfaces) → `/contracts/`:
   - Identify what interfaces the project exposes to users or other systems
   - Document the contract format appropriate for the project type
   - Examples: public APIs for libraries, command schemas for CLI tools, endpoints for web services, grammars for parsers, UI contracts for applications
   - Skip if project is purely internal (build scripts, one-off tools, etc.)

3. **Architecture update** (`specs/main/architecture.md`):
   - Read the current `specs/main/architecture.md`
   - If the feature introduces **new technologies** (language, framework, DB, external service) not already listed → add them to the relevant section (§5 CLI Package Layout, or a new subsection if the tech doesn't fit existing sections)
   - If the feature adds **new directories or modules** to the project layout → update the path tables in §2/§4/§5/§6 to reflect the new structure
   - Add a **feature reference row** to §6 SpecKit Integration's `specs/<feature-slug>/` pattern (or update the existing description if the slug already appears)
   - Preserve all existing content — only append or update, never remove sections
   - Use the same markdown table style and heading hierarchy as the rest of the file

**Output**: data-model.md, /contracts/*, quickstart.md, updated architecture.md

## Key rules

- Use absolute paths
- ERROR on gate failures or unresolved clarifications

## Snapshot Stage (Principle VII)

After all plan artifacts (`plan.md`, `data-model.md`, `contracts/`, `research.md`, `quickstart.md`) are written and committed (or staged), tag the pipeline stage:

```bash
.specify/scripts/bash/snapshot-stage.sh plan <slug>
```

```powershell
.specify\scripts\powershell\snapshot-stage.ps1 -Stage plan -Slug <slug>
```

Where `<slug>` = the feature directory slug (e.g., `001-orchestrator`). Tag (e.g., `plan/001-orchestrator/v1`) MUST be reported back to the user. Idempotent. Skips with warning if not in a git repo.
