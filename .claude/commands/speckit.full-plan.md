---
description: Combined plan + tasks — generate implementation plan and task breakdown in one session.
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

ultrathink

You **MUST** consider the user input before proceeding (if not empty).

## Outline

This is a **combo command** that runs `/speckit.plan` followed by `/speckit.tasks` in a single session, without requiring the user to manually invoke the second command.

### Phase 1: Plan

Execute the **full** `/speckit.plan` workflow as defined in `speckit.plan.md`:

1. **Setup**: Run `.specify/scripts/powershell/setup-plan.ps1 -Json` and parse FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH
2. **Load context**: Read FEATURE_SPEC and `.specify/memory/constitution.md`. Load IMPL_PLAN template
3. **Execute plan workflow**:
   - Fill Technical Context
   - Fill Constitution Check
   - Evaluate gates
   - Phase 0: Generate research.md (resolve NEEDS CLARIFICATION)
   - Phase 1: Generate data-model.md, contracts/, quickstart.md
   - Phase 1: Update `specs/main/architecture.md` with new technologies, paths, and feature reference
   - Re-evaluate Constitution Check post-design
4. Snapshot stage: `snapshot-stage.ps1 -Stage plan -Slug <slug>`

**IMPORTANT**: After plan completes, do NOT report completion or suggest next steps. Immediately proceed to Phase 2.

### Phase 2: Tasks

Without pausing, execute the **full** `/speckit.tasks` workflow as defined in `speckit.tasks.md`:

1. **Setup**: Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json` and parse FEATURE_DIR, AVAILABLE_DOCS
2. **Load design documents**: Read from FEATURE_DIR — plan.md (just generated in Phase 1), spec.md, and optional artifacts (data-model.md, contracts/, research.md, quickstart.md)
3. **Load coding standards**: Read `.github/instructions/coding/copilot-instructions.md`
4. **Execute task generation**:
   - Extract tech stack, user stories, entities, contracts
   - Assign [AGENT] tags, extract shared files, resolve dependencies
   - Generate parallel lanes, validate dependency graph
   - Generate **Agent Dispatch Plan** (subagent × skills × input context × files)
5. **Generate tasks.md** using `.specify/templates/tasks-template.md`
6. Snapshot stage: `snapshot-stage.ps1 -Stage tasks -Slug <slug>`

**Context reuse**: Phase 2 can directly reference plan artifacts generated in Phase 1 (plan.md, data-model.md, contracts/, research.md) without re-reading them from disk — they are already in context.

### Completion Report

After both phases complete, report:

- Branch name
- Phase 1: plan.md path, generated artifacts list, architecture.md updates
- Phase 2: tasks.md path, total task count, tasks per agent, parallel lanes, critical path, agent dispatch plan, suggested MVP scope
- Suggested next command: `/speckit.analyze` or `/speckit.implement`
