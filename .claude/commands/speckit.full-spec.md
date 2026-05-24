---
description: Combined specify + clarify — create feature spec and immediately clarify ambiguities in one session.
handoffs: 
  - label: Build Technical Plan
    agent: speckit.plan
    prompt: Create a plan for the spec. I am building with...
  - label: Full Plan + Tasks
    agent: speckit.full-plan
    prompt: Create plan and tasks for the spec
    send: true
---

## User Input

```text
$ARGUMENTS
```

ultrathink

You **MUST** consider the user input before proceeding (if not empty).

## Outline

This is a **combo command** that runs `/speckit.specify` followed by `/speckit.clarify` in a single session, without requiring the user to manually invoke the second command.

### Phase 1: Specify

Execute the **full** `/speckit.specify` workflow as defined in `speckit.specify.md`:

1. Generate short name from feature description
2. Detect prior `/speckit.start` worktree OR create branch + spec directory
3. Load spec template from `.specify/templates/spec-template.md`
4. Parse user description, extract concepts, fill spec sections
5. Write spec to SPEC_FILE
6. Run Specification Quality Validation (checklist at `FEATURE_DIR/checklists/requirements.md`)
7. Handle validation results — fix failing items, present [NEEDS CLARIFICATION] questions (max 3)
8. Snapshot stage: `snapshot-stage.ps1 -Stage spec -Slug <slug>`

**IMPORTANT**: After specify completes, do NOT report completion or suggest next steps. Immediately proceed to Phase 2.

### Phase 2: Clarify

Without pausing, execute the **full** `/speckit.clarify` workflow as defined in `speckit.clarify.md`:

1. Run `.specify/scripts/powershell/check-prerequisites.ps1 -Json -PathsOnly` to get FEATURE_DIR and FEATURE_SPEC
2. Load the spec file written in Phase 1
3. Perform structured ambiguity & coverage scan (all taxonomy categories)
4. Generate prioritized queue of up to 5 clarification questions
5. Sequential questioning loop — one question at a time, with recommendations
6. Integrate each accepted answer into the spec (incremental updates)
7. Validate after each write
8. Snapshot stage: `snapshot-stage.ps1 -Stage clarify -Slug <slug>`

**Deduplication rule**: If Phase 1 already asked [NEEDS CLARIFICATION] questions and the user answered them, Phase 2 must NOT re-ask the same questions. The 5-question budget in Phase 2 applies only to NEW ambiguities not already resolved.

### Completion Report

After both phases complete, report:

- Branch name and spec file path
- Phase 1: checklist results, questions asked/answered
- Phase 2: questions asked/answered, sections touched, coverage summary
- Suggested next command: `/speckit.full-plan` or `/speckit.plan`
